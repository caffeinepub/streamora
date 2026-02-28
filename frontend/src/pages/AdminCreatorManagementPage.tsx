import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Star, Search } from 'lucide-react';
import { useAllUsers, useSaveUserStats, useAddNotification } from '../hooks/useQueries';
import { getUserStats, type UserStats } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminCreatorManagementPage() {
  const { data: users = [] } = useAllUsers();
  const saveStats = useSaveUserStats();
  const addNotification = useAddNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ username: string; name: string } | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectUser = (username: string, name: string) => {
    setSelectedUser({ username, name });
    const s = getUserStats(username);
    setStats({ ...s, name });
    setSearchQuery('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stats || !selectedUser) return;
    saveStats.mutate(stats);

    if (stats.isPremium) {
      addNotification.mutate({
        targetUsername: selectedUser.username,
        category: 'monetization',
        message: `🌟 Congratulations! You have been granted ${stats.isLifetimePremium ? 'Lifetime ' : ''}Premium status by the admin.`,
      });
    }
    if (stats.isTrusted) {
      addNotification.mutate({
        targetUsername: selectedUser.username,
        category: 'monetization',
        message: `✅ You have been marked as a Trusted Creator on Streamora!`,
      });
    }

    toast.success(`Creator settings updated for ${selectedUser.name}`);
  };

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Star className="w-5 h-5 text-amber-400" />
        <h1 className="text-xl font-bold text-foreground">Creator Management</h1>
      </div>

      {/* User search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search creators by name..."
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

      {stats && selectedUser ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-3 mb-2">
            <p className="text-sm font-semibold text-foreground">Editing: {selectedUser.name}</p>
          </div>

          <div className="space-y-1.5">
            <Label>CPM Rank</Label>
            <Select
              value={stats.cpmRank}
              onValueChange={v => setStats({ ...stats, cpmRank: v as UserStats['cpmRank'] })}
            >
              <SelectTrigger className="bg-surface-2 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">🥉 Bronze — $3 CPM</SelectItem>
                <SelectItem value="silver">🥈 Silver — $5 CPM</SelectItem>
                <SelectItem value="gold">🥇 Gold — $8 CPM</SelectItem>
                <SelectItem value="premium">💎 Premium — $10 CPM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Monetization Plan</Label>
            <Select
              value={stats.monetizationPlan}
              onValueChange={v => setStats({ ...stats, monetizationPlan: v as UserStats['monetizationPlan'] })}
            >
              <SelectTrigger className="bg-surface-2 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard — 55% creator share</SelectItem>
                <SelectItem value="premium">Premium — 70% creator share</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {[
              { key: 'isMonetized', label: 'Monetized', desc: 'Enable monetization & verified tick' },
              { key: 'isPremium', label: 'Premium', desc: 'Grant Premium status' },
              { key: 'isLifetimePremium', label: 'Lifetime Premium', desc: 'Grant Lifetime Premium' },
              { key: 'isTrusted', label: 'Trusted Creator', desc: 'Mark as trusted creator' },
              { key: 'monetizationApproved', label: 'Monetization Approved', desc: 'Bypass eligibility criteria' },
            ].map(field => (
              <div key={field.key} className="flex items-center justify-between p-3 bg-surface-2 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-foreground">{field.label}</p>
                  <p className="text-xs text-muted-foreground">{field.desc}</p>
                </div>
                <Switch
                  checked={Boolean(stats[field.key as keyof UserStats])}
                  onCheckedChange={v => setStats({ ...stats, [field.key]: v })}
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={saveStats.isPending}
            className="w-full bg-brand hover:bg-brand-bright text-white"
          >
            {saveStats.isPending ? 'Saving...' : 'Save Creator Settings'}
          </Button>
        </form>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Search for a creator to manage their settings</p>
        </div>
      )}
    </div>
  );
}
