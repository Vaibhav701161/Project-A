import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  // Add all states...
];