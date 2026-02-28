// Local data store for Streamora app data
// Since the backend has limited video management, we use localStorage for extended data

export interface VideoRecord {
  id: string;
  type: 'long' | 'short' | 'embedded';
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  embedUrl?: string;
  embedSource?: 'youtube' | 'rumble';
  uploaderUsername: string;
  uploaderName: string;
  views: number;
  likes: number;
  comments: Comment[];
  isPromoted: boolean;
  createdAt: number;
  duration?: number;
}

export interface Comment {
  id: string;
  username: string;
  name: string;
  text: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  targetUsername: string; // 'ALL' for broadcast
  category: 'payment' | 'monetization' | 'strike' | 'general';
  message: string;
  createdAt: number;
  read: boolean;
}

export interface MonetizationRequest {
  id: string;
  username: string;
  name: string;
  requestedAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PayoutRequest {
  id: string;
  username: string;
  name: string;
  amount: number;
  paypalEmail: string;
  requestedAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserStats {
  username: string;
  totalViews: number;
  subscriberCount: number;
  estimatedEarnings: number;
  totalEarnings: number;
  adEligible: boolean;
  cpmRank: 'bronze' | 'silver' | 'gold' | 'premium';
  monetizationPlan: 'standard' | 'premium';
  isMonetized: boolean;
  isPremium: boolean;
  isLifetimePremium: boolean;
  isTrusted: boolean;
  strikes: number;
  paypalEmail?: string;
  adPin?: string;
  monetizationApproved: boolean;
  monetizationRequested: boolean;
  name: string;
}

export interface SiteEvent {
  id: string;
  name: string;
  theme: string;
  active: boolean;
  startedAt: number;
}

const VIDEOS_KEY = 'streamora_videos';
const NOTIFICATIONS_KEY = 'streamora_notifications';
const MONETIZATION_REQUESTS_KEY = 'streamora_mon_requests';
const PAYOUT_REQUESTS_KEY = 'streamora_payout_requests';
const USER_STATS_KEY = 'streamora_user_stats';
const SITE_EVENT_KEY = 'streamora_site_event';
const SUBSCRIPTIONS_KEY = 'streamora_subscriptions';

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Videos
export function getVideos(): VideoRecord[] {
  return getItem<VideoRecord[]>(VIDEOS_KEY, []);
}

export function saveVideo(video: VideoRecord): void {
  const videos = getVideos();
  const idx = videos.findIndex(v => v.id === video.id);
  if (idx >= 0) {
    videos[idx] = video;
  } else {
    videos.unshift(video);
  }
  setItem(VIDEOS_KEY, videos);
}

export function deleteVideo(id: string): void {
  const videos = getVideos().filter(v => v.id !== id);
  setItem(VIDEOS_KEY, videos);
}

export function getVideoById(id: string): VideoRecord | undefined {
  return getVideos().find(v => v.id === id);
}

export function incrementVideoViews(id: string): void {
  const videos = getVideos();
  const idx = videos.findIndex(v => v.id === id);
  if (idx >= 0) {
    videos[idx].views += 1;
    setItem(VIDEOS_KEY, videos);
  }
}

export function toggleVideoLike(id: string): void {
  const videos = getVideos();
  const idx = videos.findIndex(v => v.id === id);
  if (idx >= 0) {
    videos[idx].likes += 1;
    setItem(VIDEOS_KEY, videos);
  }
}

export function addComment(videoId: string, comment: Comment): void {
  const videos = getVideos();
  const idx = videos.findIndex(v => v.id === videoId);
  if (idx >= 0) {
    videos[idx].comments.push(comment);
    setItem(VIDEOS_KEY, videos);
  }
}

// Notifications
export function getNotifications(): Notification[] {
  return getItem<Notification[]>(NOTIFICATIONS_KEY, []);
}

export function addNotification(notification: Notification): void {
  const notifications = getNotifications();
  notifications.unshift(notification);
  setItem(NOTIFICATIONS_KEY, notifications);
}

export function markNotificationRead(id: string): void {
  const notifications = getNotifications();
  const idx = notifications.findIndex(n => n.id === id);
  if (idx >= 0) {
    notifications[idx].read = true;
    setItem(NOTIFICATIONS_KEY, notifications);
  }
}

export function getUserNotifications(username: string): Notification[] {
  return getNotifications().filter(n => n.targetUsername === username || n.targetUsername === 'ALL');
}

// Monetization Requests
export function getMonetizationRequests(): MonetizationRequest[] {
  return getItem<MonetizationRequest[]>(MONETIZATION_REQUESTS_KEY, []);
}

export function addMonetizationRequest(req: MonetizationRequest): void {
  const requests = getMonetizationRequests();
  const existing = requests.findIndex(r => r.username === req.username);
  if (existing >= 0) {
    requests[existing] = req;
  } else {
    requests.unshift(req);
  }
  setItem(MONETIZATION_REQUESTS_KEY, requests);
}

export function updateMonetizationRequest(id: string, status: 'approved' | 'rejected'): void {
  const requests = getMonetizationRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx >= 0) {
    requests[idx].status = status;
    setItem(MONETIZATION_REQUESTS_KEY, requests);
  }
}

// Payout Requests
export function getPayoutRequests(): PayoutRequest[] {
  return getItem<PayoutRequest[]>(PAYOUT_REQUESTS_KEY, []);
}

export function addPayoutRequest(req: PayoutRequest): void {
  const requests = getPayoutRequests();
  requests.unshift(req);
  setItem(PAYOUT_REQUESTS_KEY, requests);
}

export function updatePayoutRequest(id: string, status: 'approved' | 'rejected'): void {
  const requests = getPayoutRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx >= 0) {
    requests[idx].status = status;
    setItem(PAYOUT_REQUESTS_KEY, requests);
  }
}

// User Stats
export function getUserStats(username: string): UserStats {
  const allStats = getItem<Record<string, UserStats>>(USER_STATS_KEY, {});
  return allStats[username] || {
    username,
    totalViews: 0,
    subscriberCount: 0,
    estimatedEarnings: 0,
    totalEarnings: 0,
    adEligible: false,
    cpmRank: 'bronze',
    monetizationPlan: 'standard',
    isMonetized: false,
    isPremium: false,
    isLifetimePremium: false,
    isTrusted: false,
    strikes: 0,
    monetizationApproved: false,
    monetizationRequested: false,
    name: username,
  };
}

export function getAllUserStats(): Record<string, UserStats> {
  return getItem<Record<string, UserStats>>(USER_STATS_KEY, {});
}

export function saveUserStats(stats: UserStats): void {
  const allStats = getItem<Record<string, UserStats>>(USER_STATS_KEY, {});
  allStats[stats.username] = stats;
  setItem(USER_STATS_KEY, allStats);
}

// Site Event
export function getActiveSiteEvent(): SiteEvent | null {
  return getItem<SiteEvent | null>(SITE_EVENT_KEY, null);
}

export function setSiteEvent(event: SiteEvent | null): void {
  setItem(SITE_EVENT_KEY, event);
}

// Subscriptions
export function getSubscriptions(username: string): string[] {
  const subs = getItem<Record<string, string[]>>(SUBSCRIPTIONS_KEY, {});
  return subs[username] || [];
}

export function toggleSubscription(subscriberUsername: string, creatorUsername: string): boolean {
  const subs = getItem<Record<string, string[]>>(SUBSCRIPTIONS_KEY, {});
  if (!subs[subscriberUsername]) subs[subscriberUsername] = [];
  const idx = subs[subscriberUsername].indexOf(creatorUsername);
  if (idx >= 0) {
    subs[subscriberUsername].splice(idx, 1);
    setItem(SUBSCRIPTIONS_KEY, subs);
    return false;
  } else {
    subs[subscriberUsername].push(creatorUsername);
    setItem(SUBSCRIPTIONS_KEY, subs);
    return true;
  }
}

export function isSubscribed(subscriberUsername: string, creatorUsername: string): boolean {
  const subs = getItem<Record<string, string[]>>(SUBSCRIPTIONS_KEY, {});
  return (subs[subscriberUsername] || []).includes(creatorUsername);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
