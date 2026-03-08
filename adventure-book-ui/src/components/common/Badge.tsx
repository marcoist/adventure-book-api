import { forwardRef, type HTMLAttributes } from 'react';
import type { Difficulty, SessionStatus } from '../../types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-600 text-slate-200',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Helper components for common badge types
export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const variants: Record<Difficulty, BadgeVariant> = {
    EASY: 'success',
    MEDIUM: 'warning',
    HARD: 'danger',
  };

  return (
    <Badge variant={variants[difficulty]}>
      {difficulty.toLowerCase()}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: SessionStatus }) {
  const variants: Record<SessionStatus, BadgeVariant> = {
    PLAYING: 'info',
    PAUSED: 'warning',
    COMPLETED: 'success',
    DEAD: 'danger',
  };

  const labels: Record<SessionStatus, string> = {
    PLAYING: 'Playing',
    PAUSED: 'Paused',
    COMPLETED: 'Completed',
    DEAD: 'Dead',
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
}
