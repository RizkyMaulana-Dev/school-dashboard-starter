import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/routes/route.paths";

export function Logo() {
  return (
    <Link to={ROUTE_PATHS.PUBLIC_HOME} className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-lg">S</span>
      </div>
      <span className="text-xl font-bold text-gray-900">School Portal</span>
    </Link>
  );
}
