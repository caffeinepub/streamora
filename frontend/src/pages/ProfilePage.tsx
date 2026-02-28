import React from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { Settings, BarChart2, DollarSign, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserVideos, useUserStats } from '../hooks/useQueries';
import { getUserStats } from '../lib/store';
import MonetizationBadge from '../components/MonetizationBadge';
import PremiumBadge from '../components/PremiumBadge';
import TrustedBadge from '../components/TrustedBadge';
import GoPremiumButton from '../components/GoPremiumButton';
import StrikeWarning from '../components/StrikeWarning';
import VideoCard from '../components/VideoCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatNumber } from '../lib/utils';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { session, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { username?: string };
  const targetUsername = params.username || session?.secretUsername || '';
  const isOwnProfile = !params.username || params.username === session?.secretUsername;

  const { data: videos = [] } = useUserVideos(targetUsername);
  const { data: stats } = useUserStats(targetUsername);

  const userStats = stats || getUserStats(targetUsername);
  const longVideos = videos.filter(v => v.type === 'long' || v.type === 'embedded');
  const shorts = videos.filter(v => v.type === 'short');

  const displayName = isOwnProfile ? session?.name : (userStats.name || targetUsername);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate({ to: '/login' });
  };

  return (
    <div className="max-w-screen-md mx-auto">
      {/* Profile Header */}
      <div className="px-4 pt-6 pb-4">
        {isOwnProfile && userStats.strikes > 0 && (
          <StrikeWarning strikes={userStats.strikes} />
        )}

        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-brand/20 border-2 border-brand/30 flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-brand" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
              {userStats.isMonetized && <MonetizationBadge />}
              {userStats.isPremium && <PremiumBadge isLifetime={userStats.isLifetimePremium} />}
              {userStats.isTrusted && <TrustedBadge />}
              {isOwnProfile && isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-xs font-semibold border border-amber-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatNumber(userStats.subscriberCount)}</p>
                <p className="text-xs text-muted-foreground">Subscribers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{formatNumber(userStats.totalViews)}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{videos.length}</p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isOwnProfile && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {/* Admin Dashboard button — only visible to admin */}
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white border-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            <Link to="/analytics">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" />
                Analytics
              </Button>
            </Link>
            <Link to="/monetization">
              <Button variant="outline" size="sm" className="gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Monetization
              </Button>
            </Link>
            {!userStats.isPremium && <GoPremiumButton />}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <div className="px-4">
        <Tabs defaultValue="videos">
          <TabsList className="w-full bg-surface-2">
            <TabsTrigger value="videos" className="flex-1">
              Videos ({longVideos.length})
            </TabsTrigger>
            <TabsTrigger value="shorts" className="flex-1">
              Shorts ({shorts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-4">
            {longVideos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No videos uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {longVideos.map(v => <VideoCard key={v.id} video={v} compact />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shorts" className="mt-4">
            {shorts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No shorts uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shorts.map(v => (
                  <Link key={v.id} to="/video/$videoId" params={{ videoId: v.id }} className="block">
                    <div className="aspect-[9/16] bg-surface-2 rounded-xl overflow-hidden relative">
                      {v.thumbnailUrl ? (
                        <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img src="/assets/generated/streamora-logo.dim_256x256.png" alt="" className="w-12 h-12 opacity-30" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2">
                        <p className="text-white text-xs font-medium line-clamp-2">{v.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="px-4 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'streamora')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            caffeine.ai
          </a>{' '}
          · © {new Date().getFullYear()} Streamora
        </p>
      </div>
    </div>
  );
}
