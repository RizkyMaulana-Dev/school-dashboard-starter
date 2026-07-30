import { NavLink, useLocation } from "react-router-dom";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTE_PATHS } from "@/routes/route-paths";

interface NavItem {
  path: string;
  label: string;
  icon: string; // Placeholder for icon component
  requiredPermission?: string;
  children?: NavItem[];
}

/**
 * Sidebar navigasi untuk dashboard
 */
export function Sidebar() {
  const { sidebarState, toggleSidebar } = useUIStore();
  const { user, hasPermission } = useAuthStore();
  const location = useLocation();
  const isCollapsed = sidebarState === "collapsed";

  // Define navigation items
  const navigationItems: NavItem[] = [
    {
      path: ROUTE_PATHS.DASHBOARD_HOME,
      label: "Dashboard",
      icon: "home",
    },
    {
      path: "#",
      label: "Manajemen",
      icon: "users",
      children: [
        {
          path: ROUTE_PATHS.USERS,
          label: "Users",
          icon: "user",
          requiredPermission: "user.read",
        },
        {
          path: ROUTE_PATHS.ROLES,
          label: "Roles",
          icon: "shield",
          requiredPermission: "role.read",
        },
        {
          path: ROUTE_PATHS.CLASSES,
          label: "Kelas",
          icon: "building",
          requiredPermission: "class.read",
        },
        {
          path: ROUTE_PATHS.STUDENTS,
          label: "Siswa",
          icon: "graduation-cap",
          requiredPermission: "student.read",
        },
        {
          path: ROUTE_PATHS.TEACHERS,
          label: "Guru",
          icon: "academic-cap",
          requiredPermission: "teacher.read",
        },
      ],
    },
    {
      path: "#",
      label: "Presensi",
      icon: "clipboard-check",
      requiredPermission: "attendance-session.read",
      children: [
        {
          path: ROUTE_PATHS.ATTENDANCE_SESSIONS,
          label: "Sesi",
          icon: "calendar",
          requiredPermission: "attendance-session.read",
        },
      ],
    },
    {
      path: "#",
      label: "Perpustakaan",
      icon: "library",
      requiredPermission: "book.read",
      children: [
        {
          path: ROUTE_PATHS.BOOKS,
          label: "Buku",
          icon: "book-open",
          requiredPermission: "book.read",
        },
        {
          path: ROUTE_PATHS.BOOK_LOANS,
          label: "Peminjaman",
          icon: "clipboard-list",
          requiredPermission: "book-loan.read",
        },
      ],
    },
    {
      path: "#",
      label: "Inventaris",
      icon: "archive",
      requiredPermission: "item.read",
      children: [
        {
          path: ROUTE_PATHS.ITEMS,
          label: "Barang",
          icon: "cube",
          requiredPermission: "item.read",
        },
        {
          path: ROUTE_PATHS.ITEM_LOANS,
          label: "Peminjaman",
          icon: "clipboard-list",
          requiredPermission: "item-loan.read",
        },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === "#") return false;
    return location.pathname.startsWith(path);
  };

  const filterByPermission = (items: NavItem[]): NavItem[] => {
    return items.filter((item) => {
      if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
        return false;
      }
      if (item.children) {
        item.children = filterByPermission(item.children);
        return item.children.length > 0;
      }
      return true;
    });
  };

  const filteredNavItems = filterByPermission(navigationItems);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 z-40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-800 truncate">School Dashboard</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
              d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <div key={item.path}>
            {item.children ? (
              <div>
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    isCollapsed ? "justify-center" : ""
                  } text-gray-600`}
                >
                  <span className="text-lg">{/* Icon placeholder */}</span>
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </div>
                <div className="ml-4 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive: linkActive }) =>
                        `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          isCollapsed ? "justify-center" : ""
                        } ${
                          linkActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <span className="text-lg">{/* Icon placeholder */}</span>
                      {!isCollapsed && <span className="ml-3">{child.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive: linkActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    isCollapsed ? "justify-center" : ""
                  } ${linkActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`
                }
              >
                <span className="text-lg">{/* Icon placeholder */}</span>
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
