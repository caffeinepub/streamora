import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import { useHomeFeed } from '../hooks/useQueries';
import VideoCard from '../components/VideoCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: videos = [], isLoading } = useHomeFeed();

  return (
    <div className="px-3 py-4 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand" />
          <h1 className="text-lg font-bold text-foreground">Featured Videos</h1>
        </div>
        <span className="text-xs text-muted-foreground bg-surface-2 px-2 py-0.5 rounded-full">
          {videos.length} videos
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
              <Skeleton className="aspect-video w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mb-4">
            <TrendingUp className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No Featured Videos Yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Admin-promoted videos will appear here. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
