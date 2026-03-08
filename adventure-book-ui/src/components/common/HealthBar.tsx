import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HealthBarProps {
  current: number;
  max?: number;
  showHearts?: boolean;
  animate?: 'damage' | 'heal' | null;
}

export function HealthBar({ current, max = 10, showHearts = true, animate = null }: HealthBarProps) {
  const [animating, setAnimating] = useState(false);
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  useEffect(() => {
    if (animate) {
      setAnimating(true);
      const timeout = setTimeout(() => setAnimating(false), 900);
      return () => clearTimeout(timeout);
    }
  }, [animate, current]);

  const getBarColor = () => {
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (showHearts) {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <Heart
            key={i}
            className={`w-5 h-5 transition-all duration-200 ${
              i < current
                ? 'text-red-500 fill-red-500'
                : 'text-slate-600'
            } ${
              animating && animate === 'damage' && i === current
                ? 'animate-damage'
                : ''
            } ${
              animating && animate === 'heal' && i === current - 1
                ? 'animate-heal'
                : ''
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-slate-400">
          {current}/{max}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-400">Health</span>
        <span className="text-slate-300">{current}/{max}</span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getBarColor()} ${
            animating ? (animate === 'damage' ? 'animate-damage' : 'animate-heal') : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
