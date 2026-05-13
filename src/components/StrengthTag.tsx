import React from 'react';

const StrengthTag: React.FC<{ label: string }> = React.memo(({ label }) => (
  <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
    {label}
  </span>
));

StrengthTag.displayName = 'StrengthTag';
export default StrengthTag;
