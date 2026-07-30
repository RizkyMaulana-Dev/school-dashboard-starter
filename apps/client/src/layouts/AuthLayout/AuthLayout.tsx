import { Outlet } from "react-router-dom";

/**
 * Layout minimal untuk halaman autentikasi (login, register, dll)
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">School Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Sistem Manajemen Sekolah Terpadu</p>
        </div>

        {/* Auth Form Container */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
