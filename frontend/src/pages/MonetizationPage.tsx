import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle2, XCircle, DollarSign, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserStats, useSaveUserStats, useAddMonetizationRequest } from '../hooks/useQueries';
import { getUserStats } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function MonetizationPage() {
  const { session } = useAuth();
  const { data: stats } = useUserStats(session?.secretUsername || '');
  const saveStats = useSaveUserStats();
  const addRequest = useAddMonetizationRequest();

  const userStats = stats || getUserStats(session?.secretUsername || '');
  const [paypalEmail, setPaypalEmail] = useState(userStats.paypalEmail || '');
  const [adPin, setAdPin] = useState(userStats.adPin || '');
  const [showPopup, setShowPopup] = useState(false);
  const [activating, setActivating] = useState(false);

  const isEligible = userStats.subscriberCount >= 100 || userStats.monetizationApproved;
  const hasRequestedAlready = userStats.monetizationRequested;

  useEffect(() => {
    if (showPopup) {
      const t = setTimeout(() => setShowPopup(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showPopup]);

  const handleRequestMonetization = () => {
    if (!session) return;
    addRequest.mutate({ username: session.secretUsername, name: session.name });
    saveStats.mutate({ ...userStats, monetizationRequested: true });
    setShowPopup(true);
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paypalEmail.trim() || !adPin.trim()) {
      toast.error('Please fill in both PayPal email and Ad PIN');
      return;
    }
    if (!paypalEmail.includes('@')) {
      toast.error('Please enter a valid PayPal email');
      return;
    }
    setActivating(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      saveStats.mutate({
        ...userStats,
        paypalEmail: paypalEmail.trim(),
        adPin: adPin.trim(),
        isMonetized: true,
        adEligible: true,
      });
      toast.success('Monetization activated! Your colored tick has been granted.');
    } finally {
      setActivating(false);
    }
  };

  if (userStats.isMonetized) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Monetization Active!</h1>
          <p className="text-muted-foreground text-sm mb-6">
            You're earning with Streamora. Check your analytics for earnings details.
          </p>
          <div className="bg-card border border-border rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan</span>
              <span className="text-foreground capitalize font-medium">{userStats.monetizationPlan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CPM Rank</span>
              <span className="text-foreground capitalize font-medium">{userStats.cpmRank}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">PayPal</span>
              <span className="text-foreground font-medium">{userStats.paypalEmail}</span>
            </div>
          </div>
          <Link to="/analytics">
            <Button className="bg-brand hover:bg-brand-bright text-white">View Analytics</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-5 h-5 text-brand" />
        <h1 className="text-xl font-bold text-foreground">Monetization</h1>
      </div>

      {/* Eligibility Check */}
      {!isEligible ? (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Eligibility Criteria</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {userStats.subscriberCount >= 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">100 Subscribers</p>
                  <p className="text-xs text-muted-foreground">{userStats.subscriberCount} / 100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {userStats.totalViews >= 1000 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">1,000 Valid Views</p>
                  <p className="text-xs text-muted-foreground">{userStats.totalViews} / 1,000</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleRequestMonetization}
            disabled={hasRequestedAlready || addRequest.isPending}
            className="w-full bg-brand hover:bg-brand-bright text-white"
          >
            {hasRequestedAlready ? 'Request Submitted' : 'Request Monetization'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Admin can approve monetization even if criteria is not fully met.
          </p>

          <Link to="/about-monetization" className="block text-center text-sm text-brand hover:underline">
            Learn about monetization →
          </Link>
        </div>
      ) : (
        /* Activation Form */
        <div className="space-y-4">
          <div className="bg-brand/10 border border-brand/20 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">You're approved!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete the activation below to start earning.
              </p>
            </div>
          </div>

          <form onSubmit={handleActivate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="paypal" className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-brand" />
                PayPal Email Address
              </Label>
              <Input
                id="paypal"
                type="email"
                value={paypalEmail}
                onChange={e => setPaypalEmail(e.target.value)}
                placeholder="your@paypal.com"
                className="bg-surface-2 border-border focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adpin" className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand" />
                Streamora Ad PIN
              </Label>
              <Input
                id="adpin"
                type="text"
                value={adPin}
                onChange={e => setAdPin(e.target.value)}
                placeholder="Enter your Ad PIN from admin"
                className="bg-surface-2 border-border focus:border-brand"
              />
              <p className="text-xs text-muted-foreground">
                Your Ad PIN is provided by the Streamora admin team.
              </p>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-surface-2 rounded-lg p-3">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand" />
              <span>Both fields are required to activate monetization and receive your verified creator badge.</span>
            </div>

            <Button
              type="submit"
              disabled={activating}
              className="w-full bg-brand hover:bg-brand-bright text-white"
            >
              {activating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Activating...
                </span>
              ) : 'Activate Monetization'}
            </Button>
          </form>
        </div>
      )}

      {/* 4-second popup */}
      {showPopup && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-popover border border-border rounded-xl px-5 py-3 shadow-card z-50 animate-fade-in text-center">
          <p className="text-sm font-medium text-foreground">Request submitted!</p>
          <p className="text-xs text-muted-foreground mt-0.5">Review may take 2–3 business days.</p>
        </div>
      )}
    </div>
  );
}
