import React from 'react';

const TypeBadge: React.FC<{ type: string }> = React.memo(({ type }) => (
  <div className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-quiz-badge text-quiz-badge-fg text-4xl md:text-5xl font-extrabold tracking-widest shadow-elevated">
    {type}
  </div>
));

TypeBadge.displayName = 'TypeBadge';
export default TypeBadge;
