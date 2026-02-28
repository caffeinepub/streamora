import React, { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Eye, Heart, Share2, UserPlus, ArrowLeft } from 'lucide-react';
import { useVideoById, useUserStats } from '../hooks/useQueries';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserStats,
  incrementVideoViews,
  toggleVideoLike,
  isSubscribed,
  toggleSubscription,
  generateId,
  addComment,
  type Comment,
} from '../lib/store';
import VideoPlayer from '../components/VideoPlayer';
import EmbedVideoPlayer from '../components/EmbedVideoPlayer';
import { formatNumber, timeAgo } from '../lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function VideoDetailPage() {
  const params = useParams({ strict: false }) as { videoId?: string };
  const videoId = params.videoId || '';
  const { session } = useAuth();
  const { data: video, isLoading } = useVideoById(videoId);
  const { data: creatorStats } = useUserStats(video?.uploaderUsername || '');
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (video && session) {
      incrementVideoViews(video.id);
      setSubscribed(isSubscribed(session.secretUsername, video.uploaderUsername));
      setLocalComments(video.comments);
    }
  }, [video?.id, session]);

  const handleLike = () => {
    if (!video || liked) return;
    toggleVideoLike(video.id);
    setLiked(true);
    toast.success('Liked!');
  };

  const handleSubscribe = () => {
    if (!video || !session) return;
    const result = toggleSubscription(session.secretUsername, video.uploaderUsername);
    setSubscribed(result);
    toast.success(result ? `Subscribed to ${video.uploaderName}` : 'Unsubscribed');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast.success('Link copied!');
  };

  const handleComment = () => {
    if (!commentText.trim() || !session || !video) return;
    const comment: Comment = {
      id: generateId(),
      username: session.secretUsername,
      name: session.name,
      text: commentText.trim(),
      createdAt: Date.now(),
    };
    addComment(video.id, comment);
    setLocalComments(prev => [...prev, comment]);
    setCommentText('');
    toast.success('Comment posted!');
  };

  const userStats = creatorStats || getUserStats(video?.uploaderUsername || '');
  const isPremiumUser = session ? getUserStats(session.secretUsername).isPremium : false;

  if (isLoading) {
    return (
      <div className="px-4 py-4 max-w-screen-md mx-auto space-y-4">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <p className="text-lg font-semibold text-foreground">Video not found</p>
        <Link to="/home" className="text-brand hover:underline text-sm mt-2">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto">
      {/* Back button */}
      <div className="px-4 pt-4 pb-2">
        <Link to="/home" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Player */}
      <div className="px-4">
        {video.type === 'embedded' && video.embedUrl && video.embedSource ? (
          <EmbedVideoPlayer url={video.embedUrl} source={video.embedSource} title={video.title} />
        ) : video.videoUrl ? (
          <VideoPlayer videoUrl={video.videoUrl} isPremium={isPremiumUser} title={video.title} />
        ) : (
          <div className="aspect-video bg-surface-2 rounded-xl flex items-center justify-center">
            <img src="/assets/generated/streamora-logo.dim_256x256.png" alt="" className="w-20 h-20 opacity-30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-4">
        <h1 className="text-lg font-bold text-foreground leading-snug">{video.title}</h1>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(video.views)}</span>
          <span>·</span>
          <span>{timeAgo(video.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
              liked ? 'bg-brand border-brand text-white' : 'border-border text-muted-foreground hover:border-brand hover:text-brand'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
            {formatNumber(video.likes + (liked ? 1 : 0))}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:border-brand hover:text-brand transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={handleSubscribe}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ml-auto ${
              subscribed ? 'bg-brand border-brand text-white' : 'border-border text-muted-foreground hover:border-brand hover:text-brand'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-3 mt-4 p-3 bg-card border border-border rounded-xl">
          <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
            <span className="text-brand font-bold text-sm">{video.uploaderName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm">{video.uploaderName}</p>
            <p className="text-xs text-muted-foreground">{formatNumber(userStats.subscriberCount)} subscribers</p>
          </div>
        </div>

        {/* Description */}
        {video.description && (
          <div className="mt-4 p-3 bg-card border border-border rounded-xl">
            <p className="text-sm text-muted-foreground leading-relaxed">{video.description}</p>
            {video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {video.tags.map(tag => (
                  <span key={tag} className="text-xs text-brand bg-brand/10 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        <div className="mt-6">
          <h3 className="font-semibold text-foreground mb-3">Comments ({localComments.length})</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-surface-2 border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand"
              onKeyDown={e => e.key === 'Enter' && handleComment()}
            />
            <button
              onClick={handleComment}
              className="bg-brand text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-brand-bright transition-colors"
            >
              Post
            </button>
          </div>
          <div className="space-y-3">
            {localComments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-muted-foreground">{c.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{c.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{c.text}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{timeAgo(c.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
