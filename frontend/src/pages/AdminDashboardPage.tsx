import React from 'react';
import { Link } from '@tanstack/react-router';
import { Users, DollarSign, Bell, BarChart2, Zap, AlertTriangle, Star, Film, Settings, ChevronRight } from 'lucide-react';
import { useAllUsers, useMonetizationRequests, usePayoutRequests } from '../hooks/useQueries';

export default function AdminDashboardPage() {
  const { data: users = [] } = useAllUsers();
  const { data: monRequests = [] } = useMonetizationRequests();
  const { data: payoutRequests = [] } = usePayoutRequests();

  const pendingMon = monRequests.filter(r => r.status === 'pending').length;
  const pendingPayout = payoutRequests.filter(r => r.status === 'pending').length;

  const adminLinks = [
    { to: '/admin/monetization-requests' as const, icon: DollarSign, label: 'Monetization Requests', badge: pendingMon, color: 'text-green-400', bg: 'bg-green-400/10' },
    { to: '/admin/payout-requests' as const, icon: BarChart2, label: 'Payout Requests', badge: pendingPayout, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { to: '/admin/send-notification' as const, icon: Bell, label: 'Send Notifications', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { to: '/admin/edit-stats' as const, icon: Settings, label: 'Edit User Stats', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { to: '/admin/events' as const, icon: Zap, label: 'Event Control', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { to: '/admin/strikes' as const, icon: AlertTriangle, label: 'Issue Strikes', color: 'text-red-400', bg: 'bg-red-400/10' },
    { to: '/admin/creator-management' as const, icon: Star, label: 'Creator Management', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { to: '/admin/embed-video' as const, icon: Film, label: 'Embed Video', color: 'text-brand', bg: 'bg-brand/10' },
  ];

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold bg-brand text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Streamora control panel</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Users className="w-5 h-5 text-brand mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{users.length}</p>
          <p className="text-xs text-muted-foreground">Users</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{pendingMon}</p>
          <p className="text-xs text-muted-foreground">Mon. Pending</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <BarChart2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{pendingPayout}</p>
          <p className="text-xs text-muted-foreground">Payouts</p>
        </div>
      </div>

      {/* Admin links */}
      <div className="space-y-2">
        {adminLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-brand/40 hover:bg-brand/5 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${link.bg} flex items-center justify-center shrink-0`}>
              <link.icon className={`w-5 h-5 ${link.color}`} />
            </div>
            <span className="flex-1 font-medium text-foreground">{link.label}</span>
            {link.badge !== undefined && link.badge > 0 && (
              <span className="bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {link.badge}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors" />
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Streamora Admin Panel · Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'streamora')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
