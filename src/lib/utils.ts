
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to generate breadcrumb data
export function generateBreadcrumbs(path: string) {
  const parts = path.split('/').filter(Boolean);
  return parts.map((part, index) => {
    const url = '/' + parts.slice(0, index + 1).join('/');
    return {
      name: part.charAt(0).toUpperCase() + part.slice(1),
      url
    };
  });
}

// Format date helper
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}
