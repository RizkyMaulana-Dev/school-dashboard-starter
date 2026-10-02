import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/routes/route.paths";

interface DesktopUserMenuProps {
  userName?: string;
  onLogout: () => void;
  onOpenScanner: () => void;
}

export function DesktopUserMenu({ userName, onLogout, onOpenScanner }: DesktopUserMenuProps) {
  return (
    <div className="flex items-center">
      <div className="relative group ml-4 pl-4 border-l">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-5 focus:outline-none cursor-pointer">
          <span className="font-medium">{userName}</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="absolute right-0 top-full w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
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
        className="ml-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M3 9h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
