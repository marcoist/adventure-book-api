import { Heart, HeartCrack } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Consequence } from '../../types';

interface ConsequenceAlertProps {
  consequence: Consequence;
  onDismiss?: () => void;
}

export function ConsequenceAlert({ consequence, onDismiss }: ConsequenceAlertProps) {
  const [visible, setVisible] = useState(true);

  const isDamage = consequence.type === 'LOSE_HEALTH';
  const Icon = isDamage ? HeartCrack : Heart;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        animate-fade-in
        ${isDamage ? 'bg-red-900/90' : 'bg-green-900/90'}
        border ${isDamage ? 'border-red-500' : 'border-green-500'}
        rounded-lg shadow-lg p-4 max-w-sm
      `}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`w-6 h-6 flex-shrink-0 ${
            isDamage ? 'text-red-400' : 'text-green-400'
          }`}
        />
        <div>
          <p className={`font-semibold ${isDamage ? 'text-red-300' : 'text-green-300'}`}>
            {isDamage ? `Lost ${consequence.value} health` : `Gained ${consequence.value} health`}
          </p>
          {consequence.text && (
            <p className="text-sm text-slate-300 mt-1">{consequence.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}
