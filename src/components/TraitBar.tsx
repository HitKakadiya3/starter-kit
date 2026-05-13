import React from 'react';
import type { TraitPercentage } from '@/utils/scoring';

const TraitBar: React.FC<TraitPercentage> = React.memo(({ leftLabel, rightLabel, dominantLabel, percentage }) => {
  const isLeft = dominantLabel === leftLabel;
  const fillPct = percentage;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={isLeft ? 'font-semibold text-foreground' : 'text-muted-foreground'}>{leftLabel}</span>
        <span className={!isLeft ? 'font-semibold text-foreground' : 'text-muted-foreground'}>{rightLabel}</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-quiz-trait-bar rounded-full transition-all duration-500"
          style={{ width: `${isLeft ? fillPct : 100 - fillPct}%`, marginLeft: isLeft ? 0 : 'auto', float: isLeft ? 'left' : 'right' }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">{dominantLabel} — {percentage}%</p>
    </div>
  );
});

TraitBar.displayName = 'TraitBar';
export default TraitBar;
