import { Link, useLocation } from "react-router-dom";
import type { NavDropdownProps } from "./types";

export function NavDropdown({ item, checkIsActive }: NavDropdownProps) {
  const location = useLocation();
  const hasActiveSubItem = item.subItems?.some((s) => location.pathname === s.path);
  const isActive = hasActiveSubItem || (item.path ? checkIsActive(item.path) : false);

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-1 text-sm font-medium py-5 focus:outline-none cursor-pointer transition-colors ${
          isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        {item.label}
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute left-0 top-full w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
        {(item.subItems ?? []).map((subItem) => (
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
