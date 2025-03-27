import React from 'react';

interface ProfileHeaderProps {
  title: string;
  description: string;
}

export function ProfileHeader({ title, description }: ProfileHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
}