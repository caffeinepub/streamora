import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export function formatCurrency(n: number): string {
  return '$' + n.toFixed(2);
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

export function getRumbleEmbedUrl(url: string): string {
  const match = url.match(/rumble\.com\/embed\/([^/?]+)/);
  if (match) return `https://rumble.com/embed/${match[1]}/`;
  const match2 = url.match(/rumble\.com\/v([^/?]+)/);
  if (match2) return `https://rumble.com/embed/v${match2[1]}/`;
  return url;
}

export function getEmbedUrl(url: string, source: 'youtube' | 'rumble'): string {
  if (source === 'youtube') return getYouTubeEmbedUrl(url);
  return getRumbleEmbedUrl(url);
}

export function detectEmbedSource(url: string): 'youtube' | 'rumble' | null {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('rumble.com')) return 'rumble';
  return null;
}
