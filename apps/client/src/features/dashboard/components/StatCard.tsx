import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className = "" }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>

          {trend && (
            <p className="mt-2 text-sm">
              <span
                className={`font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </p>
          )}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}
