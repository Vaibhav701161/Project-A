import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileFieldProps {
  icon: LucideIcon;
  label: string;
  value: string | undefined;
}

export function ProfileField({ icon: Icon, label, value }: ProfileFieldProps) {
  if (!value) return null;

  return (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <Icon className="w-5 h-5 text-blue-600" />
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}