import React from 'react';
import { Link } from '@tanstack/react-router';
import { BarChart2, Eye, Users, DollarSign, TrendingUp, Star, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserStats, useUserVideos, useAddPayoutRequest } from '../hooks/useQueries';
import { getUserStats } from '../lib/store';
import AnalyticsCard from '../components/AnalyticsCard';
import { Button } from '@/components/ui/button';
import { formatNumber, formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

const CPM_RATES: Record<string, number> = {
  bronze: 3,
  silver: 5,
  gold: 8,
  premium: 10,
};

const CPM_COLORS: Record<string, string> = {
  bronze: 'bg-amber-700/20 text-amber-600 border-amber-700/30',
  silver: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
  gold: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
  premium: 'bg-brand/20 text-brand border-brand/30',
};

export default function AnalyticsPage() {
  const { session } = useAuth();
  const { data: stats } = useUserStats(session?.secretUsername || '');
  const { data: videos = [] } = useUserVideos(session?.secretUsername || '');
  const addPayoutRequest = useAddPayoutRequest();

  const userStats = stats || getUserStats(session?.secretUsername || '');
  const cpmRate = CPM_RATES[userStats.cpmRank] || 3;
  const planShare = userStats.monetizationPlan === 'premium' ? 0.70 : 0.55;
  const canRequestPayout = userStats.totalEarnings >= 100;

  const handlePayoutRequest = () => {
    if (!session || !userStats.paypalEmail) {
      toast.error('Please set up your PayPal email in Monetization settings first');
      return;
    }
    addPayoutRequest.mutate({
      username: session.secretUsername,
      name: session.name,
      amount: userStats.totalEarnings,
      paypalEmail: userStats.paypalEmail,
    });
    toast.success('Payout request submitted! Admin will review within 2-3 business days.');
  };

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="w-5 h-5 text-brand" />
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <AnalyticsCard
          label="Total Views"
          value={formatNumber(userStats.totalViews)}
          icon={<Eye className="w-4 h-4" />}
        />
        <AnalyticsCard
          label="Subscribers"
          value={formatNumber(userStats.subscriberCount)}
          icon={<Users className="w-4 h-4" />}
        />
        <AnalyticsCard
          label="Estimated Earnings"
          value={formatCurrency(userStats.estimatedEarnings)}
          icon={<DollarSign className="w-4 h-4" />}
          highlight
        />
        <AnalyticsCard
          label="Total Earnings"
          value={formatCurrency(userStats.totalEarnings)}
          icon={<TrendingUp className="w-4 h-4" />}
          highlight
        />
        <AnalyticsCard
          label="CPM Rank"
          value={`$${cpmRate} CPM`}
          icon={<Star className="w-4 h-4" />}
          badge={userStats.cpmRank.charAt(0).toUpperCase() + userStats.cpmRank.slice(1)}
          badgeColor={CPM_COLORS[userStats.cpmRank]}
        />
        <AnalyticsCard
          label="Ad Eligible"
          value={userStats.adEligible ? 'Yes' : 'No'}
          icon={<CheckCircle2 className="w-4 h-4" />}
          badge={userStats.adEligible ? 'Active' : 'Inactive'}
          badgeColor={userStats.adEligible ? 'bg-green-400/20 text-green-400 border-green-400/30' : 'bg-muted text-muted-foreground border-border'}
        />
      </div>

      {/* Plan Info */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Monetization Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground capitalize">{userStats.monetizationPlan} Plan</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {userStats.monetizationPlan === 'premium' ? '70% creator / 30% platform' : '55% creator / 45% platform'}
            </p>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
            userStats.monetizationPlan === 'premium'
              ? 'bg-amber-400/20 text-amber-400 border-amber-400/30'
              : 'bg-surface-2 text-muted-foreground border-border'
          }`}>
            {Math.round(planShare * 100)}% share
          </span>
        </div>
      </div>

      {/* Per-video stats */}
      {videos.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Video Performance</h3>
          <div className="space-y-2">
            {videos.slice(0, 5).map(v => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-sm text-foreground truncate flex-1 mr-3">{v.title}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Eye className="w-3 h-3" />
                  {formatNumber(v.views)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payout */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Payout</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Minimum payout threshold: $100 · PayPal only
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Balance</span>
          <span className="text-lg font-bold text-foreground">{formatCurrency(userStats.totalEarnings)}</span>
        </div>
        <div className="w-full bg-surface-3 rounded-full h-2 mb-3">
          <div
            className="bg-brand h-2 rounded-full transition-all"
            style={{ width: `${Math.min((userStats.totalEarnings / 100) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {canRequestPayout ? 'Eligible for payout!' : `$${(100 - userStats.totalEarnings).toFixed(2)} more needed`}
        </p>
        <Button
          onClick={handlePayoutRequest}
          disabled={!canRequestPayout || addPayoutRequest.isPending}
          className="w-full bg-brand hover:bg-brand-bright text-white disabled:opacity-50"
        >
          {addPayoutRequest.isPending ? 'Submitting...' : 'Request Payout'}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <Link to="/about-monetization" className="text-sm text-brand hover:underline">
          Learn about monetization →
        </Link>
      </div>
    </div>
  );
}
