import { Link, useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "@/routes/route.paths";
import { useAuthStore } from "@/stores/auth.store";
import { useState } from "react";
import googleLensIcon from "@/assets/images/google-lens.svg";
import { QrScanner } from "@/components/ui/QrScanner";

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const navLinks = [
        { path: ROUTE_PATHS.PUBLIC_ATTENDANCE, label: "Presensi" },
        { path: ROUTE_PATHS.PUBLIC_LOANS, label: "Peminjaman" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <nav className="bg-white shadow-sm border-b relative z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to={ROUTE_PATHS.PUBLIC_HOME} className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">S</span>
                                </div>
                                <span className="text-xl font-bold text-gray-800">School Portal</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors ${isActive(link.path)
                                        ? "text-blue-600"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <div className="flex items-center">
                                    <div className="relative group ml-4 pl-4 border-l">
                                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2 focus:outline-none cursor-pointer">
                                            <span className="font-medium">{user?.name}</span>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        <div className="absolute right-0 top-full w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                                            <Link
                                                to={ROUTE_PATHS.PUBLIC_PROFILE}
                                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Profil
                                            </Link>
                                            <div className="border-t border-gray-100"></div>
                                            <button
                                                onClick={() => logout()}
                                                className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsScannerOpen(true)}
                                        aria-label="Scan QR"
                                        className="ml-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        <img
                                            src={googleLensIcon}
                                            alt="Scanner"
                                            className="w-5 h-5"
                                        />
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

                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Toggle mobile menu"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden pb-4">
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive(link.path)
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to={ROUTE_PATHS.PUBLIC_PROFILE}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive(ROUTE_PATHS.PUBLIC_PROFILE)
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            Profil
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsScannerOpen(true);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <img src={googleLensIcon} alt="" className="w-4 h-4" />
                                            Scan QR
                                        </button>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="px-3 py-2 text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to={ROUTE_PATHS.LOGIN}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg text-center mt-2"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {isScannerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <QrScanner onClose={() => setIsScannerOpen(false)} />
                </div>
            )}
        </>
    );
}