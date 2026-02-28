import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useSearchVideos } from '../hooks/useQueries';
import VideoCard from '../components/VideoCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchResultsPage() {
  const search = useSearch({ strict: false }) as { q?: string };
  const query = search.q || '';
  const { data: results = [], isLoading } = useSearchVideos(query);

  return (
    <div className="px-4 py-6 max-w-screen-xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-brand" />
        <h1 className="text-xl font-bold text-foreground">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
        {results.length > 0 && (
          <span className="text-xs text-muted-foreground bg-surface-2 px-2 py-0.5 rounded-full">
            {results.length} found
          </span>
        )}
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
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-1">No results found</h2>
          <p className="text-sm text-muted-foreground">
            {query ? `No videos match "${query}"` : 'Enter a search term to find videos'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
