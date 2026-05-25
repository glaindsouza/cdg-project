import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function DashboardCard({ title, value, icon, trend, trendUp }: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
        <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
