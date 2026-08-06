// src/features/attendance/components/SessionForm.tsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, LoadingScreen } from "@/components/ui";
import { useClasses } from "@/features/class-management/hooks/useClasses";
import { useCreateSession } from "../hooks/useAttendanceMutations";
import { ROUTE_PATHS } from "@/routes/route-paths";

// Schema form minimal: judul dan waktu opsional
const sessionSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
});
type SessionFormData = z.infer<typeof sessionSchema>;

export default function SessionForm() {
    const navigate = useNavigate();
    const { data: classesData } = useClasses({ limit: 100 });
    const createMutation = useCreateSession();

    const classes = classesData?.data ?? [];

    // Form react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SessionFormData>({
        resolver: zodResolver(sessionSchema),
        defaultValues: { title: "", startTime: "", endTime: "" },
    });

    // State untuk multi-select kelas
    const [classSearch, setClassSearch] = useState("");
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

    // Filter kelas berdasarkan pencarian
    const filteredClasses = useMemo(() => {
        if (!classSearch) return classes;
        return classes.filter((c) =>
            c.name.toLowerCase().includes(classSearch.toLowerCase())
        );
    }, [classes, classSearch]);

    const addClass = (classId: string) => {
        setSelectedClassIds((prev) =>
            prev.includes(classId) ? prev : [...prev, classId]
        );
        setClassSearch("");
    };

    const removeClass = (classId: string) => {
        setSelectedClassIds((prev) => prev.filter((id) => id !== classId));
    };

    // State untuk hari
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);

    // Generate daftar hari dari sekarang sampai Minggu ini
    const daysOfWeek = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Minggu, 1 = Senin, ...
        // Hitung jarak ke Minggu (0) - jika hari ini Minggu, jarak = 0
        const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;

        const days: Date[] = [];
        for (let i = 0; i <= daysUntilSunday; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            days.push(d);
        }
        return days; // termasuk hari ini, max 7 hari
    }, []);

    const toggleDate = (date: Date) => {
        const dateStr = date.toDateString();
        setSelectedDates((prev) => {
            const exists = prev.find((d) => d.toDateString() === dateStr);
            if (exists) {
                return prev.filter((d) => d.toDateString() !== dateStr);
            }
            return [...prev, date];
        });
    };

    const toggleAllDates = () => {
        if (selectedDates.length === daysOfWeek.length) {
            setSelectedDates([]);
        } else {
            setSelectedDates([...daysOfWeek]);
        }
    };

    const isDateSelected = (date: Date) =>
        selectedDates.some((d) => d.toDateString() === date.toDateString());

    const allDatesSelected = selectedDates.length === daysOfWeek.length;

    // Submit: buat sesi untuk setiap kelas × tanggal
    const onSubmit = async (data: SessionFormData) => {
        if (selectedClassIds.length === 0 || selectedDates.length === 0) {
            alert("Pilih minimal satu kelas dan satu hari");
            return;
        }

        const payloads = selectedClassIds.flatMap((classId) =>
            selectedDates.map((date) => {
                const payload: any = {
                    title: data.title,
                    date: new Date(date).toISOString(), // string ISO
                    schoolClassId: classId,
                };

                // Konversi waktu ke string ISO hanya jika diisi
                if (data.startTime) {
                    // Gabung tanggal date + waktu startTime
                    const [hours, minutes] = data.startTime.split(":");
                    const dt = new Date(date);
                    dt.setHours(Number(hours), Number(minutes), 0, 0);
                    payload.startTime = dt.toISOString();
                }

                if (data.endTime) {
                    const [hours, minutes] = data.endTime.split(":");
                    const dt = new Date(date);
                    dt.setHours(Number(hours), Number(minutes), 0, 0);
                    payload.endTime = dt.toISOString();
                }

                return payload;
            })
        );

        // Kirim satu per satu
        for (const payload of payloads) {
            await createMutation.mutateAsync(payload);
        }

        navigate(ROUTE_PATHS.ATTENDANCE_SESSIONS);
    };
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-black">Buat Sesi Baru</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
                <Input
                    className="text-black"
                    label="Judul Sesi"
                    {...register("title")}
                    error={errors.title?.message}
                    disabled={createMutation.isPending}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        className="text-black"
                        label="Waktu Mulai (opsional)"
                        type="time"
                        {...register("startTime")}
                    />
                    <Input
                        className="text-black"
                        label="Waktu Selesai (opsional)"
                        type="time"
                        {...register("endTime")}
                    />
                </div>

                {/* Multi‑select Kelas */}
                <div>
                    <label className="block text-sm font-medium text-black mb-1">
                        Pilih Kelas
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={classSearch}
                            onChange={(e) => setClassSearch(e.target.value)}
                            placeholder="Cari kelas..."
                            className="w-full border rounded px-3 py-2 text-sm text-black"
                        />
                        {classSearch && (
                            <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto bg-white border rounded shadow-lg">
                                {filteredClasses.map((c) => (
                                    <li
                                        key={c.id}
                                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-black text-sm"
                                        onMouseDown={(e) => e.preventDefault()} // mencegah blur
                                        onClick={() => addClass(c.id)}
                                    >
                                        {c.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Badges kelas terpilih */}
                    {selectedClassIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedClassIds.map((id) => {
                                const cls = classes.find((c) => c.id === id);
                                return (
                                    <span
                                        key={id}
                                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                    >
                                        {cls?.name ?? id}
                                        <button
                                            type="button"
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                            onClick={() => removeClass(id)}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pilihan Hari */}
                <div>
                    <label className="block text-sm font-medium text-black mb-1">
                        Pilih Hari (minggu ini)
                    </label>
                    <div className="flex flex-wrap gap-3 items-center">
                        <label className="flex items-center gap-1 text-sm text-black cursor-pointer">
                            <input
                                type="checkbox"
                                checked={allDatesSelected}
                                onChange={toggleAllDates}
                                className="rounded border-gray-300"
                            />
                            Semua
                        </label>
                        {daysOfWeek.map((date, idx) => {
                            const dayName = date.toLocaleDateString("id-ID", { weekday: "long" });
                            const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                            const isSelected = isDateSelected(date);
                            return (
                                <label
                                    key={idx}
                                    className="flex items-center gap-1 text-sm text-black cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleDate(date)}
                                        className="rounded border-gray-300"
                                    />
                                    {dayName}, {dateStr}
                                </label>
                            );
                        })}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Sesi akan dibuat untuk setiap kombinasi kelas dan hari terpilih.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => navigate(ROUTE_PATHS.ATTENDANCE_SESSIONS)}
                    >
                        Batal
                    </Button>
                    <Button type="submit" isLoading={createMutation.isPending}>
                        Buat Sesi ({selectedClassIds.length * selectedDates.length})
                    </Button>
                </div>
            </form>
        </div>
    );
}