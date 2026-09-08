// ./apps/client/src/features/public-activity/components/PublicProfile.tsx
import { useAuthStore } from "@/stores/auth.store";
import { useCurrentStudent } from "../hooks/useCurrentStudent";
import { EmptyState } from "@/components/feedback";
import { formatDate, formatGender } from "@/utils/formatters";
import QrCode from "@/components/ui/QrCode";

export default function PublicProfile() {
    const user = useAuthStore((state) => state.user);
    const student = useCurrentStudent();

    if (!user) {
        return (
            <EmptyState title="Anda belum login" description="Silakan login untuk melihat profil." />
        );
    }

    // QR Payload tetap aman walaupun student belum ada
    const qrPayload = JSON.stringify({
        type: "STUDENT_CARD",
        userId: user.id,
        studentId: student?.id ?? null,
    });

    const profileSections = [
        {
            title: "Informasi Akun",
            rows: [
                { label: "Nama Login", value: user.name },
                { label: "Email", value: user.email },
            ],
        },
        ...(student
            ? [
                {
                    title: "Data Siswa",
                    rows: [
                        { label: "Nama Lengkap", value: student.name },
                        { label: "Jenis Kelamin", value: formatGender(student.gender) },
                        { label: "Tanggal Lahir", value: formatDate(student.birthDate) },
                        { label: "Kelas", value: student.schoolClass?.name ?? "-" },
                    ],
                },
            ]
            : []),
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profil Saya</h2>

            {/* --- KARTU QR CODE (Di-render tanpa kondisi {student && ...}) --- */}
            <div className="bg-white p-6 shadow rounded-lg flex flex-col items-center justify-center text-center space-y-3">
                <h3 className="font-bold text-gray-800 text-lg">Kartu Digital</h3>
                <p className="text-xs text-gray-500 max-w-sm">
                    Tunjukkan QR Code ini kepada petugas perpustakaan atau pengurus barang saat melakukan transaksi.
                </p>

                <div className="pt-2">
                    <QrCode
                        value={qrPayload}
                        size={180}
                        downloadable={true}
                        label={student?.name ?? user.name}
                    />
                </div>
            </div>

            {/* --- DETAIL PROFIL --- */}
            {profileSections.map((section) => (
                <div key={section.title} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-800">{section.title}</h3>
                    </div>
                    <div className="px-6 py-4 space-y-3">
                        {section.rows.map((row) => (
                            <div key={row.label} className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">{row.label}</span>
                                <span className="text-sm font-medium text-gray-900">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {!student && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        Akun Anda belum terhubung dengan data siswa. Beberapa fitur mungkin terbatas.
                    </p>
                </div>
            )}
        </div>
    );
}