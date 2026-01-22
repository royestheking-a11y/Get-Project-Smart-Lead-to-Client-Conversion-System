import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { emailLogsApi, campaignsApi } from '@/lib/backend-api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EmailLog {
  _id?: string;
  id?: string;
  sentAt: string | Date;
  leadId?: {
    companyName?: string;
    email: string;
  };
  company?: string;
  email?: string;
  type: 'initial' | 'followup1' | 'followup2';
  status: 'sent' | 'failed';
  subject: string;
  body: string;
  errorMessage?: string;
}

const typeLabels = {
  initial: 'Initial',
  followup1: 'Follow-up 1',
  followup2: 'Follow-up 2',
};

const statusConfig: Record<string, { label: string; className: string }> = {
  sent: { label: 'Sent', className: 'status-success' },
  failed: { label: 'Failed', className: 'status-error' },
};

export default function EmailLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

  // Get campaigns
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsApi.list,
  });

  // Set first campaign as default
  useEffect(() => {
    if (campaigns && campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0]._id || campaigns[0].id);
    }
  }, [campaigns, selectedCampaignId]);

  // Get email logs
  const { data: logsData, isLoading } = useQuery({
    queryKey: ['email-logs', selectedCampaignId, searchQuery],
    queryFn: () => emailLogsApi.list({
      campaignId: selectedCampaignId,
      page: 1,
      limit: 100,
    }),
    enabled: !!selectedCampaignId,
  });

  const logs = logsData?.logs || [];

  const filteredLogs = logs.filter((log: EmailLog) => {
    if (!searchQuery) return true;
    const company = log.leadId?.companyName || log.company || '';
    const email = log.leadId?.email || log.email || '';
    return company.toLowerCase().includes(searchQuery.toLowerCase()) ||
           email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Logs</h1>
          <p className="text-muted-foreground mt-1">Track all sent emails and their status</p>
        </div>
        {campaigns && campaigns.length > 0 && (
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {campaigns.map((campaign) => (
              <option key={campaign._id || campaign.id} value={campaign._id || campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by company or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Logs Table */}
      <div className="card-elevated overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !selectedCampaignId ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please select a campaign</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No email logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Lead</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Error</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const logId = log._id || log.id || '';
                  const company = log.leadId?.companyName || log.company || 'Unknown';
                  const email = log.leadId?.email || log.email || '';
                  const date = log.sentAt ? new Date(log.sentAt) : new Date();
                  return (
                    <tr key={logId}>
                      <td className="text-muted-foreground whitespace-nowrap">
                        {format(date, 'MMM d, yyyy HH:mm')}
                      </td>
                      <td>
                        <div>
                          <p className="font-medium">{company}</p>
                          <p className="text-sm text-muted-foreground">{email}</p>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm px-2 py-1 rounded-md bg-muted">
                          {typeLabels[log.type] || log.type}
                        </span>
                      </td>
                      <td>
                        <span className={cn('status-badge', statusConfig[log.status]?.className || 'bg-muted')}>
                          {statusConfig[log.status]?.label || log.status}
                        </span>
                      </td>
                      <td className="text-sm">
                        {log.errorMessage ? (
                          <span className="flex items-center gap-1 text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {log.errorMessage}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Preview Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-medium">{selectedLog.leadId?.email || selectedLog.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{selectedLog.subject}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Body</p>
                <div className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap text-sm">
                  {selectedLog.body}
                </div>
              </div>
              {selectedLog.errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {selectedLog.errorMessage}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
