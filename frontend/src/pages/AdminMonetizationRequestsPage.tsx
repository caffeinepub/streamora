import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useMonetizationRequests, useUpdateMonetizationRequest, useSaveUserStats, useAddNotification } from '../hooks/useQueries';
import { getUserStats } from '../lib/store';
import { Button } from '@/components/ui/button';
import { timeAgo } from '../lib/utils';
import { toast } from 'sonner';

export default function AdminMonetizationRequestsPage() {
  const { data: requests = [], isLoading } = useMonetizationRequests();
  const updateRequest = useUpdateMonetizationRequest();
  const saveStats = useSaveUserStats();
  const addNotification = useAddNotification();

  const handleAction = (id: string, username: string, name: string, status: 'approved' | 'rejected') => {
    updateRequest.mutate({ id, status });

    if (status === 'approved') {
      const stats = getUserStats(username);
      saveStats.mutate({ ...stats, monetizationApproved: true });
      addNotification.mutate({
        targetUsername: username,
        category: 'monetization',
        message: `🎉 Your monetization request has been approved! Complete activation in the Monetization section.`,
      });
      toast.success(`Approved monetization for ${name}`);
    } else {
      addNotification.mutate({
        targetUsername: username,
        category: 'monetization',
        message: `Your monetization request has been reviewed and was not approved at this time. You may reapply after growing your channel.`,
      });
      toast.success(`Rejected monetization for ${name}`);
    }
  };

  const statusIcon = {
    pending: <Clock className="w-4 h-4 text-yellow-400" />,
    approved: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    rejected: <XCircle className="w-4 h-4 text-red-400" />,
  };

  const statusColor = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    approved: 'text-green-400 bg-green-400/10 border-green-400/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Monetization Requests</h1>
        <span className="text-xs bg-surface-2 text-muted-foreground px-2 py-0.5 rounded-full">
          {requests.filter(r => r.status === 'pending').length} pending
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No monetization requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{req.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(req.requestedAt)}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusColor[req.status]}`}>
                  {statusIcon[req.status]}
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
              {req.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleAction(req.id, req.username, req.name, 'approved')}
                    disabled={updateRequest.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(req.id, req.username, req.name, 'rejected')}
                    disabled={updateRequest.isPending}
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
