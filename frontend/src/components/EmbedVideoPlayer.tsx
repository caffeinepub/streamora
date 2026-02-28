import React from 'react';
import { getEmbedUrl } from '../lib/utils';

interface Props {
  url: string;
  source: 'youtube' | 'rumble';
  title?: string;
}

export default function EmbedVideoPlayer({ url, source, title }: Props) {
  const embedUrl = getEmbedUrl(url, source);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <iframe
        src={embedUrl}
        title={title || 'Embedded video'}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      />
    </div>
  );
}
