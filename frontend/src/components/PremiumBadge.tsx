import React from 'react';
import { Crown } from 'lucide-react';

interface Props {
  isLifetime?: boolean;
  size?: 'sm' | 'md';
}

export default function PremiumBadge({ isLifetime = false, size = 'md' }: Props) {
  return (
    <span
      title={isLifetime ? 'Lifetime Premium' : 'Premium Member'}
      className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 text-xs font-semibold"
    >
      <Crown className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {isLifetime ? 'Lifetime' : 'Premium'}
    </span>
  );
}
