import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Zap, Sun, Moon, Star, X } from 'lucide-react';
import { getActiveSiteEvent, setSiteEvent, generateId, type SiteEvent } from '../lib/store';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const EVENTS = [
  { id: 'holiday', name: 'Holiday Theme', theme: 'holiday', icon: Star, description: 'Festive red & green color scheme', color: 'text-red-400' },
  { id: 'dark-event', name: 'Dark Mode Event', theme: 'dark-event', icon: Moon, description: 'Ultra-dark immersive theme', color: 'text-slate-400' },
  { id: 'golden', name: 'Golden Event', theme: 'golden', icon: Sun, description: 'Premium gold accent theme', color: 'text-yellow-400' },
];

export default function AdminEventControlPage() {
  const { refreshSiteEvent } = useAuth();
  const activeEvent = getActiveSiteEvent();

  const handleStartEvent = (event: typeof EVENTS[0]) => {
    const siteEvent: SiteEvent = {
      id: generateId(),
      name: event.name,
      theme: event.theme,
      active: true,
      startedAt: Date.now(),
    };
    setSiteEvent(siteEvent);
    document.body.className = `theme-${event.theme}`;
    refreshSiteEvent();
    toast.success(`${event.name} started!`);
  };

  const handleStopEvent = () => {
    setSiteEvent(null);
    document.body.className = '';
    refreshSiteEvent();
    toast.success('Event stopped. Default theme restored.');
  };

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Zap className="w-5 h-5 text-brand" />
        <h1 className="text-xl font-bold text-foreground">Event Control</h1>
      </div>

      {activeEvent && (
        <div className="bg-brand/10 border border-brand/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Active Event: {activeEvent.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Theme: {activeEvent.theme}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleStopEvent}
            className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <X className="w-3.5 h-3.5" />
            Stop
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {EVENTS.map(event => {
          const isActive = activeEvent?.theme === event.theme;
          return (
            <div key={event.id} className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${isActive ? 'border-brand/40' : 'border-border'}`}>
              <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center shrink-0">
                <event.icon className={`w-6 h-6 ${event.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{event.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleStartEvent(event)}
                disabled={isActive}
                className={isActive ? 'bg-brand/20 text-brand border border-brand/30' : 'bg-brand hover:bg-brand-bright text-white'}
              >
                {isActive ? 'Active' : 'Start'}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-surface-2 rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground">
          Events change the site-wide color theme for all users. Only one event can be active at a time.
          Stopping an event restores the default Streamora theme.
        </p>
      </div>
    </div>
  );
}
