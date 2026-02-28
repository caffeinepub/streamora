import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, UserPlus, Volume2, VolumeX } from 'lucide-react';
import { useShortsFeed } from '../hooks/useQueries';
import { useAuth } from '../contexts/AuthContext';
import { toggleVideoLike, addComment, generateId, isSubscribed, toggleSubscription, type VideoRecord } from '../lib/store';
import { formatNumber } from '../lib/utils';
import AdSlot from '../components/AdSlot';
import { toast } from 'sonner';

function ShortCard({ video, isActive, onLike, onSubscribe }: {
  video: VideoRecord;
  isActive: boolean;
  onLike: () => void;
  onSubscribe: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      setSubscribed(isSubscribed(session.secretUsername, video.uploaderUsername));
    }
  }, [session, video.uploaderUsername]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive]);

  const handleLike = () => {
    if (!liked) {
      toggleVideoLike(video.id);
      setLiked(true);
      onLike();
    }
  };

  const handleSubscribe = () => {
    if (!session) return;
    const result = toggleSubscription(session.secretUsername, video.uploaderUsername);
    setSubscribed(result);
    onSubscribe();
    toast.success(result ? `Subscribed to ${video.uploaderName}` : `Unsubscribed from ${video.uploaderName}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/video/${video.id}`).catch(() => {});
    toast.success('Link copied!');
  };

  const handleComment = () => {
    if (!commentText.trim() || !session) return;
    addComment(video.id, {
      id: generateId(),
      username: session.secretUsername,
      name: session.name,
      text: commentText.trim(),
      createdAt: Date.now(),
    });
    setCommentText('');
    setShowComment(false);
    toast.success('Comment added!');
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {video.videoUrl ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onClick={() => setIsMuted(!isMuted)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-surface-2">
          <img src="/assets/generated/streamora-logo.dim_256x256.png" alt="" className="w-24 h-24 opacity-30" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

      {/* Mute indicator */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Right actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${liked ? 'bg-brand' : 'bg-black/50'}`}>
            <Heart className={`w-5 h-5 ${liked ? 'text-white fill-white' : 'text-white'}`} />
          </div>
          <span className="text-white text-xs font-medium">{formatNumber(video.likes + (liked ? 1 : 0))}</span>
        </button>

        <button onClick={() => setShowComment(!showComment)} className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{formatNumber(video.comments.length)}</span>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Share</span>
        </button>

        <button onClick={handleSubscribe} className="flex flex-col items-center gap-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${subscribed ? 'bg-brand' : 'bg-black/50'}`}>
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{subscribed ? 'Subbed' : 'Sub'}</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-3 right-16">
        <p className="text-white font-semibold text-sm mb-1">{video.uploaderName}</p>
        <p className="text-white/80 text-xs line-clamp-2">{video.title}</p>
        {video.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {video.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-white/60 text-xs">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Comment input */}
      {showComment && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-3 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-surface-2 border border-border rounded-full px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand"
            onKeyDown={e => e.key === 'Enter' && handleComment()}
          />
          <button
            onClick={handleComment}
            className="bg-brand text-white rounded-full px-3 py-1.5 text-sm font-medium"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}

export default function ShortsPage() {
  const { data: shorts = [], isLoading, refetch } = useShortsFeed();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Build feed with ads every 2 shorts
  const feed: Array<{ type: 'short'; video: VideoRecord } | { type: 'ad'; id: string }> = [];
  shorts.forEach((video, i) => {
    feed.push({ type: 'short', video });
    if ((i + 1) % 2 === 0) {
      feed.push({ type: 'ad', id: `ad-${i}` });
    }
  });

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(idx);
        },
        { threshold: 0.7 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [feed.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mb-4">
          <span className="text-4xl">🎬</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">No Shorts Yet</h2>
        <p className="text-sm text-muted-foreground">Be the first to upload a short!</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-8rem)] overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: 'none' }}
    >
      {feed.map((item, idx) => (
        <div
          key={item.type === 'short' ? item.video.id : item.id}
          ref={el => { itemRefs.current[idx] = el; }}
          className="h-[calc(100vh-8rem)] snap-start snap-always flex items-center justify-center"
        >
          {item.type === 'short' ? (
            <ShortCard
              video={item.video}
              isActive={activeIndex === idx}
              onLike={() => refetch()}
              onSubscribe={() => {}}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background p-4">
              <div className="w-full max-w-sm">
                <AdSlot />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
