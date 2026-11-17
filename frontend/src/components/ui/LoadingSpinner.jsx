import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function LoadingSpinner({ size = 'md', className }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'rounded-full border-leaf-400/20 border-t-leaf-400 animate-spin',
          sizeClasses[size] ?? sizeClasses.md
        )}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50 gap-4">
      {/* Leaf SVG */}
      <svg
        className="w-12 h-12 text-leaf-400 animate-pulse"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
      <LoadingSpinner size="lg" />
      <p className="text-gray-400 text-sm font-medium animate-pulse">Loading PhytoTurboNet…</p>
    </div>
  );
}
