import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  strikes: number;
}

export default function StrikeWarning({ strikes }: Props) {
  if (strikes === 0) return null;

  const messages = {
    1: { title: '1 Strike Warning', desc: 'Your videos are excluded from the home feed promotion.', color: 'text-yellow-400' },
    2: { title: '2 Strikes Warning', desc: 'Your videos are excluded from home feed and monetization has been disabled.', color: 'text-orange-400' },
    3: { title: '3 Strikes — Account Suspended', desc: 'Your channel has been suspended. All content has been removed.', color: 'text-red-400' },
  };

  const info = messages[strikes as 1 | 2 | 3] || messages[3];

  return (
    <Alert variant="destructive" className="border-destructive/50 bg-destructive/10 mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className={info.color}>{info.title}</AlertTitle>
      <AlertDescription className="text-muted-foreground">{info.desc}</AlertDescription>
    </Alert>
  );
}
