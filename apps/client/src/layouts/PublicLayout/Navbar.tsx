import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { QrScanner } from "@/components/ui/QrScanner";
import { ROUTE_PATHS } from "@/routes/route.paths";
import { useAuthStore } from "@/stores/auth.store";
import {
  Logo,
  NavDropdown,
  NavLink,
  MobileNavItem,
  DesktopUserMenu,
  MobileUserMenu,
  type MenuItem,
} from "./parts";

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

  const checkIsActive = (path: string): boolean => location.pathname === path;

  return (
    <>
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Logo />

            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = item.path ? checkIsActive(item.path) : false;
                if (item.subItems) {
                  return <NavDropdown key={idx} item={item} checkIsActive={checkIsActive} />;
                }
                return <NavLink key={idx} item={item} isActive={isActive} />;
              })}

              {isAuthenticated ? (
                <DesktopUserMenu
                  userName={user?.name}
                  onLogout={logout}
                  onOpenScanner={() => setIsScannerOpen(true)}
                />
              ) : (
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
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

          {isMobileMenuOpen && (
            <div className="pb-4 border-t border-gray-100 md:hidden">
              <div className="flex flex-col gap-1 px-4">
                {NAV_ITEMS.map((item, idx) => (
                  <MobileNavItem
                    key={idx}
                    item={item}
                    checkIsActive={checkIsActive}
                    onItemClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
                {isAuthenticated ? (
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <MobileUserMenu
                      isActive={checkIsActive(ROUTE_PATHS.PUBLIC_PROFILE)}
                      onCloseMenu={() => setIsMobileMenuOpen(false)}
                      onOpenScanner={() => {
                        setIsScannerOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      onLogout={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    />
                  </div>
                ) : (
                  <Link
                    to={ROUTE_PATHS.LOGIN}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 text-center mt-2"
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
