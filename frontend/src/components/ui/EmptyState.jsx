import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import Button from './Button';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function EmptyState({
  icon: Icon,
  title = 'No Data Available',
  description = 'Results Pending Integration',
  action,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-8 text-center rounded-xl border border-dashed border-white/10 bg-white/3',
        className
      )}
    >
      {Icon && (
        <div className="p-4 rounded-full bg-white/5 border border-white/10">
          <Icon className="w-8 h-8 text-gray-500" />
        </div>
      )}

      <div className="space-y-1.5">
        <h3 className="font-display font-semibold text-gray-200 text-lg">{title}</h3>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">{description}</p>
      </div>

      {action && (
        <Button
          variant={action.variant ?? 'secondary'}
          size="sm"
          onClick={action.onClick}
          className="mt-2"
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
