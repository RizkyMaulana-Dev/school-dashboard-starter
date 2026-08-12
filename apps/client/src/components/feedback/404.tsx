export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/70 sm:p-12">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500" />

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl font-black text-red-500 shadow-inner shadow-red-200">
                    404
                </div>

                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Error
                </span>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Halaman tidak ditemukan
                </h1>

                <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                    Maaf, halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau tidak pernah ada.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                        href="/"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
                    >
                        Kembali ke beranda
                    </a>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
}
