import { AlertTriangle } from 'lucide-react';
import type { Option } from '../../types';

interface ChoiceButtonProps {
  option: Option;
  onClick: () => void;
  disabled?: boolean;
}

export function ChoiceButton({ option, onClick, disabled }: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        choice-button w-full text-left p-4 rounded-lg
        bg-slate-700/50 border border-slate-600
        hover:bg-slate-700 hover:border-amber-500/50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600
        transition-all duration-200
        group
      `}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-semibold text-sm">
          {option.index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-slate-100 group-hover:text-white transition-colors">
            {option.description}
          </p>
          {option.hasConsequence && (
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
              <AlertTriangle className="w-3 h-3" />
              <span>This choice has consequences</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
