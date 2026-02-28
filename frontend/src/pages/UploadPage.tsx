import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Film, Zap, ArrowRight } from 'lucide-react';

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Upload Content</h1>
        <p className="text-muted-foreground text-sm mt-1">Share your videos with the world</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => navigate({ to: '/upload/long-video' })}
          className="w-full bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-brand/50 hover:bg-brand/5 transition-all group text-left"
        >
          <div className="w-14 h-14 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
            <Film className="w-7 h-7 text-brand" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground text-base">Upload Long Video</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Share full-length videos, tutorials, vlogs, and more
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-surface-2 text-muted-foreground px-2 py-0.5 rounded-full">MP4, MOV, AVI</span>
              <span className="text-xs bg-surface-2 text-muted-foreground px-2 py-0.5 rounded-full">Up to 4GB</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors shrink-0" />
        </button>

        <button
          onClick={() => navigate({ to: '/upload/shorts' })}
          className="w-full bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-brand/50 hover:bg-brand/5 transition-all group text-left"
        >
          <div className="w-14 h-14 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
            <Zap className="w-7 h-7 text-brand" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground text-base">Upload Short</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Quick vertical videos up to 60 seconds
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-surface-2 text-muted-foreground px-2 py-0.5 rounded-full">Vertical format</span>
              <span className="text-xs bg-surface-2 text-muted-foreground px-2 py-0.5 rounded-full">Max 60s</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors shrink-0" />
        </button>
      </div>

      <div className="mt-6 bg-surface-2 rounded-xl p-4 border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">📋 Upload Guidelines</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Long videos require a thumbnail to be promoted on the home feed</li>
          <li>• Content must comply with Streamora's community guidelines</li>
          <li>• Violations may result in strikes on your account</li>
        </ul>
      </div>
    </div>
  );
}
