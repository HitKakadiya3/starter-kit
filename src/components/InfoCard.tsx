import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = React.memo(({ title, children }) => (
  <div className="bg-card border border-border rounded-lg p-4">
    <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
    <div className="text-sm text-muted-foreground">{children}</div>
  </div>
));

InfoCard.displayName = 'InfoCard';
export default InfoCard;
