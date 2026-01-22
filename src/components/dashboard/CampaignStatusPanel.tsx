import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw, Clock, Mail, Gauge, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { campaignsApi } from '@/lib/backend-api';
import { useToast } from '@/hooks/use-toast';

interface CampaignStatusPanelProps {
  className?: string;
  campaignId?: string;
  campaign?: any;
}

export function CampaignStatusPanel({ className, campaignId, campaign }: CampaignStatusPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const status = campaign?.status || 'paused';
  const campaignData = {
    dailyLimit: campaign?.dailyLimit || 50,
    sendingWindow: campaign?.sendingWindowStart && campaign?.sendingWindowEnd 
      ? `${campaign.sendingWindowStart} - ${campaign.sendingWindowEnd}`
      : '9:00 AM - 5:00 PM',
    rateLimit: campaign?.rateLimitMinSec && campaign?.rateLimitMaxSec
      ? `${campaign.rateLimitMinSec}-${campaign.rateLimitMaxSec} sec`
      : '60-120 sec',
  };

  const statusMutation = useMutation({
    mutationFn: (newStatus: 'active' | 'paused') => {
      if (!campaignId) throw new Error('No campaign selected');
      return newStatus === 'active' 
        ? campaignsApi.resume(campaignId)
        : campaignsApi.pause(campaignId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({ title: `Campaign ${status === 'active' ? 'paused' : 'resumed'}` });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <div className={cn('card-elevated p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Campaign Status</h3>
        <div className={cn(
          'status-badge',
          status === 'active' ? 'status-success' : 'status-warning'
        )}>
          <span className={cn(
            'w-2 h-2 rounded-full mr-2',
            status === 'active' ? 'bg-primary animate-pulse' : 'bg-amber-500'
          )} />
          {status === 'active' ? 'Active' : 'Paused'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Daily Limit</p>
            <p className="text-sm font-semibold">{campaignData.dailyLimit} emails</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sending Window</p>
            <p className="text-sm font-semibold">{campaignData.sendingWindow}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rate Limit</p>
            <p className="text-sm font-semibold">{campaignData.rateLimit}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {!campaignId ? (
          <Button disabled className="flex-1" variant="outline">
            No campaign selected
          </Button>
        ) : status === 'paused' ? (
          <Button 
            onClick={() => statusMutation.mutate('active')} 
            className="flex-1"
            disabled={statusMutation.isPending}
          >
            {statusMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Start Sending
          </Button>
        ) : (
          <Button 
            onClick={() => statusMutation.mutate('paused')} 
            variant="outline" 
            className="flex-1"
            disabled={statusMutation.isPending}
          >
            {statusMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
            Pause
          </Button>
        )}
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
          }}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
