import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const optionDefs = [
  { key: 'stronglyAgree', weight: 2, bgClass: 'bg-scale-agree', borderClass: 'border-scale-agree' },
  { key: 'agree', weight: 1, bgClass: 'bg-scale-agree-light', borderClass: 'border-scale-agree-light' },
  { key: 'neutral', weight: 0, bgClass: 'bg-scale-neutral', borderClass: 'border-scale-neutral' },
  { key: 'disagree', weight: -1, bgClass: 'bg-scale-disagree-light', borderClass: 'border-scale-disagree-light' },
  { key: 'stronglyDisagree', weight: -2, bgClass: 'bg-scale-disagree', borderClass: 'border-scale-disagree' },
] as const;

interface ScaleSelectorProps {
  onSelect: (weight: number) => void;
  questionIndex: number;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({ onSelect, questionIndex }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);

  React.useEffect(() => {
    setSelected(null);
  }, [questionIndex]);

  const handleClick = (weight: number) => {
    if (selected !== null) return;
    setSelected(weight);
    setTimeout(() => onSelect(weight), 220);
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[480px] mx-auto">
      {optionDefs.map(({ key, weight, bgClass, borderClass }) => {
        const label = t(`scale.${key}`);
        return (
          <button
            key={weight}
            onClick={() => handleClick(weight)}
            disabled={selected !== null}
            className={`w-full py-3.5 px-5 rounded-xl border-2 text-left font-semibold text-base text-foreground transition-all duration-200 ${borderClass} ${bgClass} ${
              selected === weight
                ? 'scale-[1.02] shadow-md brightness-95'
                : 'hover:brightness-95 hover:scale-[1.01]'
            } ${selected !== null && selected !== weight ? 'opacity-40' : ''}`}
            aria-label={label}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ScaleSelector;
