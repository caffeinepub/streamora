import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function TrustedBadge() {
  return (
    <span
      title="Trusted Creator"
      className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-2 py-0.5 text-xs font-semibold"
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      Trusted
    </span>
  );
}
