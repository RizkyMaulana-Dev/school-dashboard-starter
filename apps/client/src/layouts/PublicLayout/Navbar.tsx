import { Link, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { useAuthStore } from "@/stores/auth.store";
import { useState } from "react";

/**
 * Navbar untuk area publik
 */
export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: ROUTE_PATHS.PUBLIC_ATTENDANCE, label: "Presensi" },
    { path: ROUTE_PATHS.PUBLIC_LOANS, label: "Peminjaman" },
    { path: ROUTE_PATHS.PUBLIC_PROFILE, label: "Profil" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to={ROUTE_PATHS.PUBLIC} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-800">School Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path) ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <span className="text-sm text-gray-600">{user?.name}</span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to={ROUTE_PATHS.LOGIN}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
