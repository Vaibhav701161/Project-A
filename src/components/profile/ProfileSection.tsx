import React from 'react';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}