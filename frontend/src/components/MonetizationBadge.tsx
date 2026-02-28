import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

export default function MonetizationBadge({ size = 'md' }: Props) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <span title="Monetized Creator" className="inline-flex items-center">
      <CheckCircle2 className={`${sizes[size]} text-brand fill-brand/20`} />
    </span>
  );
}
