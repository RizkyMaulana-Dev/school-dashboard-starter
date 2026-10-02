import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";
import { ROUTE_PATHS } from "@/routes/route.paths";

interface MobileUserMenuProps {
  isActive: boolean;
  onCloseMenu: () => void;
  onOpenScanner: () => void;
  onLogout: () => void;
}

export function MobileUserMenu({
  isActive,
  onCloseMenu,
  onOpenScanner,
  onLogout,
}: MobileUserMenuProps) {
  return (
    <>
      <Link
        to={ROUTE_PATHS.PUBLIC_PROFILE}
        onClick={onCloseMenu}
        className={isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
      >
        <span className="block px-3 py-2 rounded-lg text-sm font-medium">Profil</span>
      </Link>

      <button
        onClick={onOpenScanner}
        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 flex items-center gap-2"
      >
        <QrCode className="w-4 h-4" />
        Scan QR
      </button>

      <button
        onClick={onLogout}
        className="px-3 py-2 text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </>
  );
}
