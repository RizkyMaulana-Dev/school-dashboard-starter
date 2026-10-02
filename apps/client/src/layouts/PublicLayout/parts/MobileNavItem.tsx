import { Link } from "react-router-dom";
import type { MenuItem } from "./types";

export function MobileNavItem({
  item,
  checkIsActive,
  onItemClick,
}: {
  item: MenuItem;
  checkIsActive: (path: string) => boolean;
  onItemClick: () => void;
}) {
  const isActive = item.path ? checkIsActive(item.path) : false;

  if (item.subItems) {
    return (
      <div>
        <span className="px-3 py-2 text-sm font-bold text-gray-800">{item.label}</span>
        <div className="flex flex-col gap-1 pl-4 border-l-2 border-gray-100 ml-3">
          {item.subItems.map((subItem) => (
            <Link
              key={subItem.path}
              to={subItem.path}
              onClick={onItemClick}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium",
                checkIsActive(subItem.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100",
              )}
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
      className={cn(
        "px-3 py-2 rounded-lg text-sm font-medium",
        isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100",
      )}
    >
      {item.label}
    </Link>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
