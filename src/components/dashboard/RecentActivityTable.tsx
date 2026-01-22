import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { emailLogsApi, campaignsApi } from '@/lib/backend-api';
import { Loader2 } from 'lucide-react';

interface Activity {
  id: string;
  company: string;
  email: string;
  status: 'sent' | 'failed' | 'replied' | 'bounced';
  lastAction: Date;
}

const statusConfig = {
  sent: { label: 'Sent', className: 'status-info' },
  failed: { label: 'Failed', className: 'status-error' },
  replied: { label: 'Replied', className: 'status-success' },
  bounced: { label: 'Bounced', className: 'status-warning' },
  opened: { label: 'Opened', className: 'bg-purple-100 text-purple-800' },
};

interface RecentActivityTableProps {
  className?: string;
}

export function RecentActivityTable({ className }: RecentActivityTableProps) {
  // Get recent email logs for all campaigns
  const { data: logsData, isLoading } = useQuery({
    queryKey: ['email-logs', 'recent'],
    queryFn: () => emailLogsApi.list({
      limit: 10,
    }),
  });

  const logs = logsData?.logs || [];

  const activities: Activity[] = logs.slice(0, 10).map((log: any) => {
    const company = log.leadId?.companyName || 'Unknown';
    const email = log.leadId?.email || log.email || '';
    const date = log.sentAt ? new Date(log.sentAt) : new Date();

    return {
      id: log._id || log.id || '',
      company,
      email,
      status: log.status === 'sent' ? 'sent'
        : log.status === 'failed' ? 'failed'
          : log.type === 'reply_received' ? 'replied'
            : log.type === 'bounce_received' ? 'bounced'
              : 'sent',
      lastAction: date,
    };
  });

  return (
    <div className={cn('card-elevated overflow-hidden', className)}>
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground mt-1">Last 10 email actions</p>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Email</th>
                <th>Status</th>
                <th>Last Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="font-medium">{activity.company}</td>
                  <td className="text-muted-foreground">{activity.email}</td>
                  <td>
                    <span className={cn('status-badge', statusConfig[activity.status]?.className || 'bg-muted')}>
                      {statusConfig[activity.status]?.label || activity.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground">
                    {formatDistanceToNow(activity.lastAction, { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
