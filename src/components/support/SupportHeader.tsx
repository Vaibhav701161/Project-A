import React from 'react';

interface SupportHeaderProps {
  title: string;
  description: string;
}

export function SupportHeader({ title, description }: SupportHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
}