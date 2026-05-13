import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = React.memo(({ current, total }) => {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
        <span>{pct} %</span>
        <span>Step {current} of {total}</span>
      </div>
      <div className="w-full h-2 bg-primary/15 rounded-full overflow-hidden">
        <div
          className="h-full bg-quiz-progress rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
export default ProgressBar;
