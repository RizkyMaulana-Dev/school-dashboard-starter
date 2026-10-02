import { Link } from "react-router-dom";
import type { MenuItem } from "./types";

export function NavLink({ item, isActive }: { item: MenuItem; isActive: boolean }) {
  if (!item.path) return null;

  return (
    <Link
      to={item.path}
      className={isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}
    >
      <span className="text-sm font-medium transition-colors py-5">{item.label}</span>
    </Link>
  );
}
