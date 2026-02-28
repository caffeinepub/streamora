import React from 'react';
import { cn } from '../lib/utils';

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  highlight?: boolean;
  badge?: string;
  badgeColor?: string;
}

export default function AnalyticsCard({ label, value, icon, highlight, badge, badgeColor }: Props) {
  return (
    <div className={cn(
      'bg-card border border-border rounded-xl p-4 flex flex-col gap-2',
      highlight && 'border-brand/40 bg-brand/5'
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className={cn(
          'text-2xl font-bold',
          highlight ? 'text-brand' : 'text-foreground'
        )}>
          {value}
        </span>
        {badge && (
          <span className={cn(
            'text-xs font-semibold px-2 py-0.5 rounded-full border',
            badgeColor || 'bg-brand/20 text-brand border-brand/30'
          )}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
