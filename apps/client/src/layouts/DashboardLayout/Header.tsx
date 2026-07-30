import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { clearTokens } from "@/lib/axios";
import { ROUTE_PATHS } from "@/routes/route-paths";

/**
 * Header untuk area dashboard
 */
export function Header() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearTokens();
      logout();
      navigate(ROUTE_PATHS.LOGIN);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Breadcrumb atau page title bisa ditambahkan di sini */}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          aria-label="Notifications"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Notification badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.roles?.[0]?.name || "Role"}</p>
            </div>
            <svg
              className="w-4 h-4 text-gray-400 hidden md:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="py-1">
              <button
                onClick={() => navigate("/app/profile")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => navigate("/app/settings")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
