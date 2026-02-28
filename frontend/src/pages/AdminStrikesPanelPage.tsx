import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, AlertTriangle, Search } from 'lucide-react';
import { useAllUsers, useSaveUserStats, useAddNotification, useDeleteVideo } from '../hooks/useQueries';
import { getUserStats, getVideos } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminStrikesPanelPage() {
  const { data: users = [] } = useAllUsers();
  const saveStats = useSaveUserStats();
  const addNotification = useAddNotification();
  const deleteVideo = useDeleteVideo();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ username: string; name: string } | null>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (username: string, name: string) => {
    setSelectedUser({ username, name });
    setSearchQuery('');
  };

  const handleIssueStrike = (newStrikes: number) => {
    if (!selectedUser) return;
    const stats = getUserStats(selectedUser.username);
    const updatedStats = { ...stats, strikes: newStrikes };

    if (newStrikes >= 2) {
      updatedStats.isMonetized = false;
    }

    saveStats.mutate(updatedStats);

    const strikeMessages: Record<number, string> = {
      1: `⚠️ You have received Strike 1. Your videos will no longer be promoted on the home feed.`,
      2: `⚠️ You have received Strike 2. Your monetization has been disabled.`,
      3: `🚫 You have received Strike 3. Your channel has been suspended and all content removed.`,
    };

    addNotification.mutate({
      targetUsername: selectedUser.username,
      category: 'strike',
      message: strikeMessages[newStrikes] || `You have received a strike on your account.`,
    });

    if (newStrikes >= 3) {
      // Delete all videos for this user
      const allVideos = getVideos();
      const userVideos = allVideos.filter(v => v.uploaderUsername === selectedUser.username);
      userVideos.forEach(v => deleteVideo.mutate(v.id));
      toast.success(`Strike 3 issued — channel deleted for ${selectedUser.name}`);
    } else {
      toast.success(`Strike ${newStrikes} issued to ${selectedUser.name}`);
    }
  };

  const currentStrikes = selectedUser ? getUserStats(selectedUser.username).strikes : 0;

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <h1 className="text-xl font-bold text-foreground">Issue Strikes</h1>
      </div>

      {/* User search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search users by name..."
          className="pl-9 bg-surface-2 border-border focus:border-brand"
        />
        {searchQuery && filteredUsers.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-card z-10 overflow-hidden">
            {filteredUsers.map(u => (
              <button
                key={u.secretUsername}
                onClick={() => handleSelectUser(u.secretUsername, u.name)}
                className="w-full text-left px-4 py-2.5 hover:bg-muted transition-colors text-sm text-foreground"
              >
                {u.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedUser ? (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="font-semibold text-foreground">{selectedUser.name}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Current strikes:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(n => (
                  <div key={n} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    n <= currentStrikes ? 'bg-red-500 text-white' : 'bg-surface-3 text-muted-foreground'
                  }`}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-2 rounded-xl p-4 border border-border space-y-2 text-xs text-muted-foreground">
            <p>⚠️ <strong className="text-foreground">Strike 1:</strong> Videos excluded from home feed</p>
            <p>⚠️ <strong className="text-foreground">Strike 2:</strong> Monetization disabled</p>
            <p>🚫 <strong className="text-foreground">Strike 3:</strong> Channel deleted, all content removed</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(n => (
              <Button
                key={n}
                onClick={() => handleIssueStrike(n)}
                disabled={saveStats.isPending || currentStrikes >= n}
                variant={n === 3 ? 'destructive' : 'outline'}
                className={n < 3 ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : ''}
              >
                Strike {n}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => {
              if (!selectedUser) return;
              const stats = getUserStats(selectedUser.username);
              saveStats.mutate({ ...stats, strikes: 0 });
              toast.success(`Strikes cleared for ${selectedUser.name}`);
            }}
            className="w-full"
          >
            Clear All Strikes
          </Button>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Search for a user to manage their strikes</p>
        </div>
      )}
    </div>
  );
}
