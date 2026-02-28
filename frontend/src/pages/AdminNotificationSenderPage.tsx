import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Bell, Send } from 'lucide-react';
import { useAddNotification, useAllUsers } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Notification } from '../lib/store';
import { toast } from 'sonner';

type Category = Notification['category'];

export default function AdminNotificationSenderPage() {
  const { data: users = [] } = useAllUsers();
  const addNotification = useAddNotification();

  const [target, setTarget] = useState('ALL');
  const [category, setCategory] = useState<Category>('general');
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (target === 'ALL') {
      addNotification.mutate({ targetUsername: 'ALL', category, message: message.trim() });
      toast.success('Notification sent to all users');
    } else {
      addNotification.mutate({ targetUsername: target, category, message: message.trim() });
      toast.success(`Notification sent to ${target}`);
    }
    setMessage('');
  };

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Bell className="w-5 h-5 text-brand" />
        <h1 className="text-xl font-bold text-foreground">Send Notification</h1>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Target</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="bg-surface-2 border-border">
              <SelectValue placeholder="Select target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">📢 All Users</SelectItem>
              {users.map(u => (
                <SelectItem key={u.secretUsername} value={u.secretUsername}>
                  👤 {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger className="bg-surface-2 border-border">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">📣 General</SelectItem>
              <SelectItem value="payment">💰 Payment</SelectItem>
              <SelectItem value="monetization">📈 Monetization</SelectItem>
              <SelectItem value="strike">⚠️ Strike</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Enter your notification message..."
            rows={5}
            className="bg-surface-2 border-border focus:border-brand resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={addNotification.isPending}
          className="w-full bg-brand hover:bg-brand-bright text-white gap-2"
        >
          <Send className="w-4 h-4" />
          {addNotification.isPending ? 'Sending...' : 'Send Notification'}
        </Button>
      </form>
    </div>
  );
}
