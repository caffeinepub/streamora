import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVideos,
  saveVideo,
  deleteVideo,
  getVideoById,
  getUserStats,
  saveUserStats,
  getNotifications,
  getUserNotifications,
  addNotification,
  markNotificationRead,
  getMonetizationRequests,
  addMonetizationRequest,
  updateMonetizationRequest,
  getPayoutRequests,
  addPayoutRequest,
  updatePayoutRequest,
  getAllUserStats,
  generateId,
  type VideoRecord,
  type UserStats,
  type Notification,
  type MonetizationRequest,
  type PayoutRequest,
} from '../lib/store';
import { getUsers } from '../lib/auth';

// Videos
export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: () => getVideos(),
    staleTime: 30_000,
  });
}

export function useVideoById(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => getVideoById(id),
    enabled: !!id,
  });
}

export function useHomeFeed() {
  return useQuery({
    queryKey: ['home-feed'],
    queryFn: () => {
      const videos = getVideos();
      return videos.filter(v =>
        v.type === 'long' || v.type === 'embedded'
      ).filter(v => v.isPromoted && v.thumbnailUrl);
    },
    staleTime: 30_000,
  });
}

export function useShortsFeed() {
  return useQuery({
    queryKey: ['shorts-feed'],
    queryFn: () => {
      const videos = getVideos();
      return videos.filter(v => v.type === 'short');
    },
    staleTime: 30_000,
  });
}

export function useUserVideos(username: string) {
  return useQuery({
    queryKey: ['user-videos', username],
    queryFn: () => {
      const videos = getVideos();
      return videos.filter(v => v.uploaderUsername === username);
    },
    enabled: !!username,
  });
}

export function useSearchVideos(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => {
      if (!query.trim()) return [];
      const videos = getVideos();
      const q = query.toLowerCase();
      return videos.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.tags.some(t => t.toLowerCase().includes(q))
      ).slice(0, 10);
    },
    enabled: query.length >= 2,
    staleTime: 10_000,
  });
}

export function useSaveVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (video: VideoRecord) => {
      saveVideo(video);
      return Promise.resolve(video);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] });
      qc.invalidateQueries({ queryKey: ['home-feed'] });
      qc.invalidateQueries({ queryKey: ['shorts-feed'] });
    },
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      deleteVideo(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['videos'] });
      qc.invalidateQueries({ queryKey: ['home-feed'] });
      qc.invalidateQueries({ queryKey: ['shorts-feed'] });
    },
  });
}

// User Stats
export function useUserStats(username: string) {
  return useQuery({
    queryKey: ['user-stats', username],
    queryFn: () => getUserStats(username),
    enabled: !!username,
  });
}

export function useAllUserStats() {
  return useQuery({
    queryKey: ['all-user-stats'],
    queryFn: () => getAllUserStats(),
  });
}

export function useSaveUserStats() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stats: UserStats) => {
      saveUserStats(stats);
      return Promise.resolve(stats);
    },
    onSuccess: (stats) => {
      qc.invalidateQueries({ queryKey: ['user-stats', stats.username] });
      qc.invalidateQueries({ queryKey: ['all-user-stats'] });
    },
  });
}

// Notifications
export function useNotifications(username: string) {
  return useQuery({
    queryKey: ['notifications', username],
    queryFn: () => getUserNotifications(username),
    enabled: !!username,
    refetchInterval: 30_000,
  });
}

export function useAllNotifications() {
  return useQuery({
    queryKey: ['all-notifications'],
    queryFn: () => getNotifications(),
  });
}

export function useAddNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
      const n: Notification = {
        ...notification,
        id: generateId(),
        createdAt: Date.now(),
        read: false,
      };
      addNotification(n);
      return Promise.resolve(n);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['all-notifications'] });
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      markNotificationRead(id);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Monetization Requests
export function useMonetizationRequests() {
  return useQuery({
    queryKey: ['monetization-requests'],
    queryFn: () => getMonetizationRequests(),
  });
}

export function useAddMonetizationRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: Omit<MonetizationRequest, 'id' | 'requestedAt' | 'status'>) => {
      const r: MonetizationRequest = {
        ...req,
        id: generateId(),
        requestedAt: Date.now(),
        status: 'pending',
      };
      addMonetizationRequest(r);
      return Promise.resolve(r);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['monetization-requests'] });
    },
  });
}

export function useUpdateMonetizationRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      updateMonetizationRequest(id, status);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['monetization-requests'] });
    },
  });
}

// Payout Requests
export function usePayoutRequests() {
  return useQuery({
    queryKey: ['payout-requests'],
    queryFn: () => getPayoutRequests(),
  });
}

export function useAddPayoutRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: Omit<PayoutRequest, 'id' | 'requestedAt' | 'status'>) => {
      const r: PayoutRequest = {
        ...req,
        id: generateId(),
        requestedAt: Date.now(),
        status: 'pending',
      };
      addPayoutRequest(r);
      return Promise.resolve(r);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payout-requests'] });
    },
  });
}

export function useUpdatePayoutRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      updatePayoutRequest(id, status);
      return Promise.resolve();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payout-requests'] });
    },
  });
}

// All users (for admin)
export function useAllUsers() {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: () => getUsers(),
  });
}
