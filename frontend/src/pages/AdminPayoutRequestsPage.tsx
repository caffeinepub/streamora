import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react';
import { usePayoutRequests, useUpdatePayoutRequest, useAddNotification } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { timeAgo, formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

export default function AdminPayoutRequestsPage() {
  const { data: requests = [], isLoading } = usePayoutRequests();
  const updateRequest = useUpdatePayoutRequest();
  const addNotification = useAddNotification();

  const handleAction = (id: string, username: string, amount: number, status: 'approved' | 'rejected') => {
    updateRequest.mutate({ id, status });
    if (status === 'approved') {
      addNotification.mutate({
        targetUsername: username,
        category: 'payment',
        message: `✅ Your payout of ${formatCurrency(amount)} has been approved and will be sent to your PayPal within 2-5 business days.`,
      });
      toast.success('Payout approved');
    } else {
      addNotification.mutate({
        targetUsername: username,
        category: 'payment',
        message: `Your payout request of ${formatCurrency(amount)} was not approved at this time. Please contact support for more information.`,
      });
      toast.success('Payout rejected');
    }
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
        <h1 className="text-xl font-bold text-foreground">Payout Requests</h1>
        <span className="text-xs bg-surface-2 text-muted-foreground px-2 py-0.5 rounded-full">
          {requests.filter(r => r.status === 'pending').length} pending
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No payout requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{req.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(req.requestedAt)}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor[req.status]}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-lg font-bold text-foreground">{formatCurrency(req.amount)}</span>
                <span className="text-xs text-muted-foreground">via PayPal: {req.paypalEmail}</span>
              </div>
              {req.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAction(req.id, req.username, req.amount, 'approved')}
                    disabled={updateRequest.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve Payout
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(req.id, req.username, req.amount, 'rejected')}
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
