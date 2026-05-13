import React, { useState } from 'react';
import { LIKERT_LABELS_BY_POSITION } from '@/lib/likertScale';

const styleByLabel: Record<string, { bgClass: string; borderClass: string }> = {
  'Strongly Agree':    { bgClass: 'bg-scale-agree',            borderClass: 'border-scale-agree' },
  'Agree':             { bgClass: 'bg-scale-agree-light',      borderClass: 'border-scale-agree-light' },
  'Neutral':           { bgClass: 'bg-scale-neutral',          borderClass: 'border-scale-neutral' },
  'Disagree':          { bgClass: 'bg-scale-disagree-light',   borderClass: 'border-scale-disagree-light' },
  'Strongly Disagree': { bgClass: 'bg-scale-disagree',         borderClass: 'border-scale-disagree' },
};

const options = LIKERT_LABELS_BY_POSITION.map((label) => ({
  label,
  ...styleByLabel[label],
}));

interface ScaleSelectorProps {
  onSelect: (positionIndex: number) => void;
  questionIndex: number;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({ onSelect, questionIndex }) => {
  const [selected, setSelected] = useState<number | null>(null);

  React.useEffect(() => {
    setSelected(null);
  }, [questionIndex]);

  const handleClick = (positionIndex: number) => {
    if (selected !== null) return;
    setSelected(positionIndex);
    setTimeout(() => onSelect(positionIndex), 220);
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[480px] mx-auto">
      {options.map(({ label, bgClass, borderClass }, index) => (
        <button
          key={label}
          onClick={() => handleClick(index)}
          disabled={selected !== null}
          className={`w-full py-3.5 px-5 rounded-xl border-2 text-left font-semibold text-base text-foreground transition-all duration-200 ${borderClass} ${bgClass} ${
            selected === index
              ? 'scale-[1.02] shadow-md brightness-95'
              : 'hover:brightness-95 hover:scale-[1.01]'
          } ${selected !== null && selected !== index ? 'opacity-40' : ''}`}
          aria-label={label}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ScaleSelector;
