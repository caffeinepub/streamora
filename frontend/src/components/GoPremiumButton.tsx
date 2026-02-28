import React, { useState, useEffect } from 'react';
import { Crown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GoPremiumButton() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="relative">
      <Button
        onClick={() => setShowPopup(true)}
        variant="outline"
        size="sm"
        className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 gap-1.5"
      >
        <Crown className="w-3.5 h-3.5" />
        Go Premium
      </Button>

      {showPopup && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-popover border border-border rounded-xl p-4 shadow-card z-50 animate-fade-in">
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-foreground">Go Premium</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">$15/month</strong> — No ads, 70% revenue share, special events access.
          </p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Contact: <a href="mailto:Tvglobalimpact@gmail.com" className="text-brand hover:underline">Tvglobalimpact@gmail.com</a>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Premium may be granted free if approved by admin.
          </p>
          <div className="mt-3 h-1 bg-surface-3 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full animate-[shrink_4s_linear_forwards]" style={{ animation: 'width 4s linear forwards', width: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
}
