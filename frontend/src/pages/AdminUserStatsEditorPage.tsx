import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Settings, Search } from 'lucide-react';
import { useAllUsers, useSaveUserStats } from '../hooks/useQueries';
import { getUserStats, type UserStats } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AdminUserStatsEditorPage() {
  const { data: users = [] } = useAllUsers();
  const saveStats = useSaveUserStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [stats, setStats] = useState<UserStats | null>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (username: string, name: string) => {
    setSelectedUsername(username);
    const s = getUserStats(username);
    setStats({ ...s, name });
    setSearchQuery('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stats) return;
    saveStats.mutate(stats);
    toast.success(`Stats updated for ${stats.name}`);
  };

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Settings className="w-5 h-5 text-brand" />
        <h1 className="text-xl font-bold text-foreground">Edit User Stats</h1>
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

      {stats ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 mb-2">
            <p className="text-sm font-semibold text-foreground">Editing: {stats.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Total Views</Label>
              <Input
                type="number"
                value={stats.totalViews}
                onChange={e => setStats({ ...stats, totalViews: parseInt(e.target.value) || 0 })}
                className="bg-surface-2 border-border focus:border-brand"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Subscribers</Label>
              <Input
                type="number"
                value={stats.subscriberCount}
                onChange={e => setStats({ ...stats, subscriberCount: parseInt(e.target.value) || 0 })}
                className="bg-surface-2 border-border focus:border-brand"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Estimated Earnings ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={stats.estimatedEarnings}
                onChange={e => setStats({ ...stats, estimatedEarnings: parseFloat(e.target.value) || 0 })}
                className="bg-surface-2 border-border focus:border-brand"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Total Earnings ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={stats.totalEarnings}
                onChange={e => setStats({ ...stats, totalEarnings: parseFloat(e.target.value) || 0 })}
                className="bg-surface-2 border-border focus:border-brand"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-2 rounded-xl">
            <Label>Ad Eligible</Label>
            <Switch
              checked={stats.adEligible}
              onCheckedChange={v => setStats({ ...stats, adEligible: v })}
            />
          </div>

          <Button
            type="submit"
            disabled={saveStats.isPending}
            className="w-full bg-brand hover:bg-brand-bright text-white"
          >
            {saveStats.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Settings className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Search for a user to edit their stats</p>
        </div>
      )}
    </div>
  );
}
