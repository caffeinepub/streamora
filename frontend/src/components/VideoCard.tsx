import React from 'react';
import { Link } from '@tanstack/react-router';
import { Play, Eye } from 'lucide-react';
import { type VideoRecord } from '../lib/store';
import { formatNumber, timeAgo, cn } from '../lib/utils';

interface Props {
  video: VideoRecord;
  compact?: boolean;
}

export default function VideoCard({ video, compact = false }: Props) {
  return (
    <Link to="/video/$videoId" params={{ videoId: video.id }} className="block group card-hover">
      <div className={cn('bg-card rounded-xl overflow-hidden border border-border', compact ? '' : '')}>
        {/* Thumbnail */}
        <div className="relative aspect-video bg-surface-3 overflow-hidden">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-2">
              <img
                src="/assets/generated/streamora-logo.dim_256x256.png"
                alt="Streamora"
                className="w-16 h-16 object-contain opacity-40"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-brand rounded-full p-3 shadow-glow">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
          {video.type === 'short' && (
            <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              SHORT
            </span>
          )}
          {video.type === 'embedded' && (
            <span className="absolute top-2 left-2 bg-surface-3/90 text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded border border-border">
              {video.embedSource?.toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className={cn(
            'font-semibold text-foreground line-clamp-2 leading-snug',
            compact ? 'text-sm' : 'text-sm'
          )}>
            {video.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-muted-foreground truncate">{video.uploaderName}</span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Eye className="w-3 h-3" />
              {formatNumber(video.views)}
            </span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-xs text-muted-foreground shrink-0">{timeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
