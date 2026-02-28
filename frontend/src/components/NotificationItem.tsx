import React from 'react';
import { Bell, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { type Notification } from '../lib/store';
import { timeAgo } from '../lib/utils';
import { cn } from '../lib/utils';

interface Props {
  notification: Notification;
  onRead?: (id: string) => void;
}

const categoryConfig = {
  payment: { icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', label: 'Payment' },
  monetization: { icon: TrendingUp, color: 'text-brand', bg: 'bg-brand/10 border-brand/20', label: 'Monetization' },
  strike: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', label: 'Strike' },
  general: { icon: Bell, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', label: 'Notice' },
};

export default function NotificationItem({ notification, onRead }: Props) {
  const config = categoryConfig[notification.category] || categoryConfig.general;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl border transition-colors cursor-pointer',
        notification.read ? 'bg-card border-border opacity-70' : 'bg-card border-border',
        !notification.read && 'border-l-2 border-l-brand'
      )}
      onClick={() => !notification.read && onRead?.(notification.id)}
    >
      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0 border', config.bg)}>
        <Icon className={cn('w-4 h-4', config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded border', config.bg, config.color)}>
            {config.label}
          </span>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
          )}
        </div>
        <p className="text-sm text-foreground leading-relaxed">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
    </div>
  );
}
