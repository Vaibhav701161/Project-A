import React from 'react';
import { Plus } from 'lucide-react';

interface CreateAdButtonProps {
  onClick: () => void;
}

export function CreateAdButton({ onClick }: CreateAdButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
    >
      <Plus className="w-5 h-5" />
      <span>Create Advertisement</span>
    </button>
  );
}