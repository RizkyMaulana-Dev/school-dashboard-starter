import { z } from "zod";

export const roleQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type RoleQueryInput = z.infer<typeof roleQuerySchema>;