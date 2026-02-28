import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications, useMarkNotificationRead } from '../hooks/useQueries';
import NotificationItem from '../components/NotificationItem';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsPage() {
  const { session } = useAuth();
  const { data: notifications = [], isLoading } = useNotifications(session?.secretUsername || '');
  const markRead = useMarkNotificationRead();

  const handleRead = (id: string) => {
    markRead.mutate(id);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-brand" />
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {notifications.filter(n => !n.read).length} new
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-4 bg-card rounded-xl border border-border">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-1">No Notifications</h2>
          <p className="text-sm text-muted-foreground">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <NotificationItem key={n.id} notification={n} onRead={handleRead} />
          ))}
        </div>
      )}
    </div>
  );
}
