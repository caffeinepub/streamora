import React, { useState, useEffect } from 'react';

interface Props {
  onComplete?: () => void;
  autoSkip?: boolean;
  skipAfter?: number;
}

export default function AdSlot({ onComplete, autoSkip = false, skipAfter = 5 }: Props) {
  const [countdown, setCountdown] = useState(skipAfter);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!autoSkip) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoSkip]);

  return (
    <div className="relative w-full bg-surface-2 border border-border rounded-xl overflow-hidden">
      <div className="aspect-video flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-16 h-16 rounded-full bg-surface-3 border border-border flex items-center justify-center">
          <span className="text-2xl">📺</span>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Advertisement</p>
          <p className="text-sm text-foreground font-medium">Your ad could be here</p>
          <p className="text-xs text-muted-foreground mt-1">Reach millions of viewers on Streamora</p>
        </div>
        {autoSkip && (
          <div className="text-xs text-muted-foreground">
            {canSkip ? (
              <button
                onClick={onComplete}
                className="text-brand hover:underline font-medium"
              >
                Skip Ad →
              </button>
            ) : (
              <span>Ad ends in {countdown}s</span>
            )}
          </div>
        )}
      </div>
      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
        AD
      </div>
    </div>
  );
}
