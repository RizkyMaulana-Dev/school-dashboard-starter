import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useUIStore } from "@/stores/ui.store";

/**
 * Layout utama untuk area dashboard (Admin, Guru, Staff)
 * Struktur: Sidebar + Header + Content
 */
export function DashboardLayout() {
  const { sidebarState } = useUIStore();
  const isCollapsed = sidebarState === "collapsed";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
