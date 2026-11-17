import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const variants = {
  primary:
    'bg-leaf-600 hover:bg-leaf-500 text-white shadow-lg shadow-leaf-900/30 border border-leaf-500/30',
  secondary:
    'bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-sm',
  ghost:
    'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border border-transparent',
  danger:
    'bg-red-600/80 hover:bg-red-600 text-white border border-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  onClick,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-leaf-500/50 focus:ring-offset-2 focus:ring-offset-gray-950',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
