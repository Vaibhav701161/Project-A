import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-6 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <Icon className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 transition-all duration-300 group-hover:text-blue-600">
          {value}
        </span>
        <span className={cn(
          "text-sm mt-1 transition-all duration-300",
          trendUp ? "text-green-600" : "text-gray-500"
        )}>
          {trend}
        </span>
      </div>
    </div>
  );
}