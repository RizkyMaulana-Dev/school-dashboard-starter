import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ROUTE_PATHS } from "@/routes/route.paths";
import { useAuthStore } from "@/stores/auth.store";
import googleLensIcon from "@/assets/images/google-lens.svg";
import { QrScanner } from "@/components/ui/QrScanner";

// Types & Constants
interface SubMenuItem {
    label: string;
    path: string;
}

interface MenuItem {
    label: string;
    path?: string;
    subItems?: SubMenuItem[];
}

const NAV_ITEMS: MenuItem[] = [
    { label: "Presensi", path: ROUTE_PATHS.PUBLIC_ATTENDANCE },
    {
        label: "Peminjaman",
        subItems: [
            { label: "Katalog Buku", path: ROUTE_PATHS.PUBLIC_BOOK_CATALOG },
            { label: "Katalog Barang", path: ROUTE_PATHS.PUBLIC_ITEM_CATALOG },
            { label: "Riwayat", path: ROUTE_PATHS.PUBLIC_LOAN_HISTORY },
        ],
    },
];

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

    /**
     * Mengecek apakah path saat ini sedang aktif
     * @param {string} path - URL path yang akan dicek
     * @returns {boolean} Status aktif
     */
    const checkIsActive = (path: string): boolean => location.pathname === path;

    const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);
    const handleOpenScanner = () => setIsScannerOpen(true);
    const handleCloseScanner = () => setIsScannerOpen(false);

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

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {NAV_ITEMS.map((item) => (
                                <DesktopNavItem
                                    key={item.label}
                                    item={item}
                                    isActive={item.path ? checkIsActive(item.path) : false}
                                />
                            ))}

                            {isAuthenticated ? (
                                <DesktopUserMenu
                                    userName={user?.name}
                                    onLogout={logout}
                                    onOpenScanner={handleOpenScanner}
                                />
                            ) : (
                                <Link
                                    to={ROUTE_PATHS.LOGIN}
                                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden pb-4">
                            <div className="flex flex-col gap-2">
                                {NAV_ITEMS.map((item) => (
                                    <MobileNavItem
                                        key={item.label}
                                        item={item}
                                        checkIsActive={checkIsActive}
                                        onItemClick={handleCloseMobileMenu}
                                    />
                                ))}

                                {isAuthenticated ? (
                                    <MobileUserMenu
                                        isActive={checkIsActive(ROUTE_PATHS.PUBLIC_PROFILE)}
                                        onCloseMenu={handleCloseMobileMenu}
                                        onOpenScanner={() => {
                                            handleOpenScanner();
                                            handleCloseMobileMenu();
                                        }}
                                        onLogout={() => {
                                            logout();
                                            handleCloseMobileMenu();
                                        }}
                                    />
                                ) : (
                                    <Link
                                        to={ROUTE_PATHS.LOGIN}
                                        onClick={handleCloseMobileMenu}
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
                    <QrScanner onClose={handleCloseScanner} />
                </div>
            )}
        </>
    );
}

// --- Sub Components ---

function DesktopNavItem({ item, isActive }: { item: MenuItem; isActive: boolean }) {
    if (item.subItems) {
        return (
            <div className="relative group py-5">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer">
                    {item.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div className="absolute left-0 top-full mt-[-10px] w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                    {item.subItems.map((subItem) => (
                        <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        >
                            {subItem.label}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Link
            to={item.path as string}
            className={`text-sm font-medium transition-colors py-5 ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
        >
            {item.label}
        </Link>
    );
}

function MobileNavItem({
    item,
    checkIsActive,
    onItemClick
}: {
    item: MenuItem;
    checkIsActive: (path: string) => boolean;
    onItemClick: () => void;
}) {
    if (item.subItems) {
        return (
            <div className="flex flex-col gap-1">
                <span className="px-3 py-2 text-sm font-bold text-gray-800">{item.label}</span>
                <div className="flex flex-col gap-1 pl-4 border-l-2 border-gray-100 ml-3">
                    {item.subItems.map((subItem) => (
                        <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={onItemClick}
                            className={`px-3 py-2 rounded-lg text-sm font-medium ${checkIsActive(subItem.path)
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {subItem.label}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Link
            to={item.path as string}
            onClick={onItemClick}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${checkIsActive(item.path as string)
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            {item.label}
        </Link>
    );
}

function DesktopUserMenu({ userName, onLogout, onOpenScanner }: { userName?: string; onLogout: () => void; onOpenScanner: () => void }) {
    return (
        <div className="flex items-center">
            <div className="relative group ml-4 pl-4 border-l">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-5 focus:outline-none cursor-pointer">
                    <span className="font-medium">{userName}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div className="absolute right-0 top-full mt-[-10px] w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                    <Link
                        to={ROUTE_PATHS.PUBLIC_PROFILE}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Profil
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <button
                onClick={onOpenScanner}
                aria-label="Scan QR"
                className="ml-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
            >
                <img src={googleLensIcon} alt="Scanner" className="w-5 h-5" />
            </button>
        </div>
    );
}

function MobileUserMenu({ isActive, onCloseMenu, onOpenScanner, onLogout }: { isActive: boolean; onCloseMenu: () => void; onOpenScanner: () => void; onLogout: () => void }) {
    return (
        <>
            <Link
                to={ROUTE_PATHS.PUBLIC_PROFILE}
                onClick={onCloseMenu}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
            >
                Profil
            </Link>
            <button
                onClick={onOpenScanner}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            >
                <img src={googleLensIcon} alt="Scan QR" className="w-4 h-4" />
                Scan QR
            </button>
            <button
                onClick={onLogout}
                className="px-3 py-2 text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
            >
                Logout
            </button>
        </>
    );
}