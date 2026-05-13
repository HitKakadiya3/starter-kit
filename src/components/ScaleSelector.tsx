import React, { useEffect, useMemo, useState } from 'react';
import type { ApiQuestionOption } from '@/lib/apiTypes';

// Pill colors keyed by Likert weight. Weight is locale-stable (1=Strongly
// Agree → 5=Strongly Disagree on every locale), unlike `text` which the
// backend localizes per `x-host`. The label itself comes straight from
// `opt.text`, which is already localized by the API.
const WEIGHT_STYLE_MAP: Record<number, { bgClass: string; borderClass: string }> = {
  1: { bgClass: 'bg-scale-agree',          borderClass: 'border-scale-agree' },
  2: { bgClass: 'bg-scale-agree-light',    borderClass: 'border-scale-agree-light' },
  3: { bgClass: 'bg-scale-neutral',        borderClass: 'border-scale-neutral' },
  4: { bgClass: 'bg-scale-disagree-light', borderClass: 'border-scale-disagree-light' },
  5: { bgClass: 'bg-scale-disagree',       borderClass: 'border-scale-disagree' },
};

interface ScaleSelectorProps {
  options: ApiQuestionOption[];
  onSelect: (optionId: string) => void;
  questionIndex: number;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({ options, onSelect, questionIndex }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(null);
  }, [questionIndex]);

  // Backend returns options in a non-guaranteed order. Sort by weight ascending
  // so "Strongly Agree" (weight 1) stays on top and "Strongly Disagree"
  // (weight 5) on the bottom — preserving the established UX.
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => {
      const wa = typeof a.weight === 'number' ? a.weight : Number.POSITIVE_INFINITY;
      const wb = typeof b.weight === 'number' ? b.weight : Number.POSITIVE_INFINITY;
      return wa - wb;
    });
  }, [options]);

  const handleClick = (id: string) => {
    if (selectedId !== null) return;
    setSelectedId(id);
    setTimeout(() => onSelect(id), 220);
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[480px] mx-auto">
      {sortedOptions.map((opt) => {
        const style = typeof opt.weight === 'number' ? WEIGHT_STYLE_MAP[opt.weight] : undefined;
        const bgClass = style?.bgClass ?? 'bg-muted';
        const borderClass = style?.borderClass ?? 'border-border';
        return (
          <button
            key={opt.id}
            onClick={() => handleClick(opt.id)}
            disabled={selectedId !== null}
            className={`w-full py-3.5 px-5 rounded-xl border-2 text-left font-semibold text-base text-foreground transition-all duration-200 ${borderClass} ${bgClass} ${
              selectedId === opt.id
                ? 'scale-[1.02] shadow-md brightness-95'
                : 'hover:brightness-95 hover:scale-[1.01]'
            } ${selectedId !== null && selectedId !== opt.id ? 'opacity-40' : ''}`}
            aria-label={opt.text}
          >
            {opt.text}
          </button>
        );
      })}
    </div>
  );
};

export default ScaleSelector;
