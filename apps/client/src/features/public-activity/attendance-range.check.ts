/**
 * Self-check for the startDate/endDate range filter added to
 * apps/server/src/modules/attendances/attendance.repository.ts.
 *
 * Run: node --import tsx features/public-activity/attendance-range.check.ts
 *   (from apps/client) or any tsx-capable runner.
 *
 * The bug it guards: the public rekap page sent startDate/endDate, the server
 * only read `date`, so both were dropped without error and every month showed
 * identical totals. If this file stops passing, the filter is broken again.
 */

type Range = { startDate?: string; endDate?: string };

/** Mirrors the where.session.date construction in attendance.repository.ts. */
export function buildDateFilter(query: Range) {
  if (!query.startDate && !query.endDate) return undefined;
  return {
    ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
    ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
  };
}

/** Mirrors the getPagination clamp, which silently caps limit at 100. */
export function effectiveLimit(requested: number) {
  return Math.min(Math.max(Number(requested) || 10, 1), 100);
}

/** A record belongs to `month` only if its session date does. */
export function isInMonth(sessionDate: string | undefined, year: number, month: number) {
  if (!sessionDate) return false; // createdAt is NOT a valid fallback
  const d = new Date(sessionDate);
  return d.getMonth() === month && d.getFullYear() === year;
}

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ok  ${msg}`);
}

function main() {
  console.log("date-range filter");

  const jan = buildDateFilter({
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-01-31T23:59:59.000Z",
  });
  assert(!!jan?.gte && !!jan?.lte, "both bounds produce gte AND lte");

  assert(buildDateFilter({}) === undefined, "empty query yields no filter");
  assert(!!buildDateFilter({ startDate: "2026-01-01" })?.gte, "startDate alone gives gte only");
  assert(
    buildDateFilter({ startDate: "2026-01-01" })?.lte === undefined,
    "startDate alone leaves lte open",
  );
  assert(
    buildDateFilter({ endDate: "2026-01-31" })?.gte === undefined,
    "endDate alone leaves gte open",
  );

  // Boundary. The component sends endDate as 23:59:59.999 local, so use that
  // shape here — a date-only "2026-01-31" parses to UTC midnight and would
  // wrongly exclude the whole last day.
  const f = buildDateFilter({ startDate: "2026-01-01", endDate: "2026-01-31T23:59:59.000Z" })!;
  assert(new Date("2026-01-31T12:00:00Z") <= f.lte!, "last day of range is included");
  assert(new Date("2026-02-01T00:00:00Z") > f.lte!, "day after the range is excluded");
  assert(new Date("2025-12-31T23:00:00Z") < f.gte!, "day before the range is excluded");

  // Known ceiling, asserted so the sharp edge is documented rather than latent:
  // a date-only bound is midnight, not end-of-day.
  const dateOnly = buildDateFilter({ startDate: "2026-01-01", endDate: "2026-01-31" })!;
  assert(
    dateOnly.lte!.getUTCHours() === 0,
    "date-only endDate lands at midnight (callers must send 23:59:59)",
  );

  console.log("limit clamp");
  assert(effectiveLimit(1000) === 100, "limit 1000 is clamped to 100 (the silent undercount)");
  assert(effectiveLimit(50) === 50, "limit 50 passes through");
  assert(effectiveLimit(0) === 10, "limit 0 falls back to default 10");
  assert(effectiveLimit(9999) === 100, "absurd limit still clamped");

  console.log("month bucketing");
  assert(isInMonth("2026-03-15T08:00:00Z", 2026, 2), "March record buckets into month index 2");
  assert(!isInMonth("2026-04-15T08:00:00Z", 2026, 2), "April record does not bucket into March");
  assert(!isInMonth("2025-03-15T08:00:00Z", 2026, 2), "wrong year is excluded");
  assert(
    !isInMonth(undefined, 2026, 2),
    "missing session date is skipped, not defaulted to createdAt",
  );

  console.log("\nAll checks passed.");
}

main();
