import React from 'react';
import { Link } from '@tanstack/react-router';
import { DollarSign, Star, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutMonetizationPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-brand" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Streamora Creator Program</h1>
        <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Turn your passion into income. Join thousands of creators earning with Streamora's transparent monetization system.
        </p>
      </div>

      {/* Eligibility */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand" />
          Eligibility Criteria
        </h2>
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <p className="text-sm text-muted-foreground">To automatically qualify for the Creator Program, you need:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-2 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-brand">100</p>
              <p className="text-sm text-muted-foreground mt-1">Subscribers</p>
            </div>
            <div className="bg-surface-2 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-brand">1K</p>
              <p className="text-sm text-muted-foreground mt-1">Valid Views</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            * Admin can manually approve creators who don't yet meet these criteria.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-brand" />
          Monetization Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-foreground text-lg mb-1">Standard Plan</h3>
            <p className="text-3xl font-bold text-brand mb-3">55%</p>
            <p className="text-xs text-muted-foreground mb-4">Creator revenue share</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">✓ <span>Ads enabled on your videos</span></li>
              <li className="flex items-center gap-2">✓ <span>45% platform share</span></li>
              <li className="flex items-center gap-2">✓ <span>Monthly payouts via PayPal</span></li>
            </ul>
          </div>
          <div className="bg-card border border-brand/30 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PREMIUM</div>
            <h3 className="font-bold text-foreground text-lg mb-1">Premium Plan</h3>
            <p className="text-3xl font-bold text-brand mb-3">70%</p>
            <p className="text-xs text-muted-foreground mb-4">Creator revenue share</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">✓ <span>No ads on your videos</span></li>
              <li className="flex items-center gap-2">✓ <span>30% platform share</span></li>
              <li className="flex items-center gap-2">✓ <span>Special events access</span></li>
              <li className="flex items-center gap-2">✓ <span>Priority support</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* CPM Tiers */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand" />
          CPM Tiers
        </h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {[
            { rank: 'Bronze', rate: '$3', color: 'text-amber-700' },
            { rank: 'Silver', rate: '$5', color: 'text-slate-300' },
            { rank: 'Gold', rate: '$8', color: 'text-yellow-400' },
            { rank: 'Premium', rate: '$10', color: 'text-brand' },
          ].map((tier, i) => (
            <div key={tier.rank} className={`flex items-center justify-between px-5 py-3 ${i < 3 ? 'border-b border-border' : ''}`}>
              <span className={`font-semibold ${tier.color}`}>{tier.rank}</span>
              <span className="text-foreground font-bold">{tier.rate} CPM</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 px-1">
          CPM (Cost Per Mille) is the rate per 1,000 ad views. Admin assigns your CPM tier based on content quality and engagement.
        </p>
      </section>

      {/* Payout Rules */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand" />
          Payout Rules
        </h2>
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-brand font-bold text-lg">$100</span>
            <div>
              <p className="text-sm font-medium text-foreground">Minimum Payout Threshold</p>
              <p className="text-xs text-muted-foreground">You must accumulate at least $100 before requesting a payout.</p>
            </div>
          </div>
          <div className="border-t border-border pt-3 flex items-start gap-3">
            <span className="text-brand font-bold text-lg">💳</span>
            <div>
              <p className="text-sm font-medium text-foreground">PayPal Only</p>
              <p className="text-xs text-muted-foreground">All payouts are processed via PayPal. Ensure your PayPal email is verified.</p>
            </div>
          </div>
          <div className="border-t border-border pt-3 flex items-start gap-3">
            <span className="text-brand font-bold text-lg">⏱</span>
            <div>
              <p className="text-sm font-medium text-foreground">Processing Time</p>
              <p className="text-xs text-muted-foreground">Payout requests are reviewed and processed by admin within 2-5 business days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-6">
        <Link to="/monetization">
          <Button className="bg-brand hover:bg-brand-bright text-white gap-2 px-8 py-3 text-base">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-3">
          Questions? Contact us at{' '}
          <a href="mailto:Tvglobalimpact@gmail.com" className="text-brand hover:underline">
            Tvglobalimpact@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
