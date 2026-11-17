import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Card({ children, className, hover = false, glow = false }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 transition-all duration-300',
        hover && 'hover:bg-white/8 hover:border-white/20 cursor-pointer',
        glow && 'hover:shadow-lg hover:shadow-leaf-500/10 hover:border-leaf-500/30',
        className
      )}
    >
      {children}
    </div>
  );
}
