import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Home, Play, PlusCircle, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useQueries';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const { session } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: notifications = [] } = useNotifications(session?.secretUsername || '');
  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { to: '/home' as const, icon: Home, label: 'Home' },
    { to: '/shorts' as const, icon: Play, label: 'Shorts' },
    { to: '/upload' as const, icon: PlusCircle, label: 'Upload', isUpload: true },
    { to: '/notifications' as const, icon: Bell, label: 'Alerts', badge: unreadCount },
    { to: '/profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
        {tabs.map(tab => {
          const isActive = currentPath === tab.to || currentPath.startsWith(tab.to + '/');
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-0 flex-1',
                isActive ? 'text-brand' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'relative',
                tab.isUpload && 'bg-brand rounded-full p-1.5 shadow-glow-sm'
              )}>
                <tab.icon className={cn(
                  'w-5 h-5',
                  tab.isUpload && 'text-white w-5 h-5'
                )} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium',
                isActive ? 'text-brand' : 'text-muted-foreground'
              )}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
