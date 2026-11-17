import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const statusMap = {
  PENDING: {
    icon: Clock,
    label: 'Pending',
    className: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    iconClass: 'text-amber-400',
  },
  AVAILABLE: {
    icon: CheckCircle2,
    label: 'Available',
    className: 'bg-leaf-500/10 border-leaf-500/30 text-leaf-400',
    iconClass: 'text-leaf-400',
  },
  ERROR: {
    icon: XCircle,
    label: 'Error',
    className: 'bg-red-500/10 border-red-500/30 text-red-400',
    iconClass: 'text-red-400',
  },
};

export default function StatusBadge({ status = 'PENDING', className }) {
  const cfg = statusMap[status?.toUpperCase()] ?? statusMap.PENDING;
  const Icon = cfg.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        cfg.className,
        className
      )}
    >
      <Icon className={cn('w-3 h-3', cfg.iconClass)} />
      {cfg.label}
    </span>
  );
}
