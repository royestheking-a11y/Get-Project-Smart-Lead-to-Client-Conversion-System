import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, Pause, MoreHorizontal, Rocket, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api';
import { campaignsApi, sendApi } from '@/lib/backend-api';
import { CreateCampaignDialog } from '@/components/campaigns/CreateCampaignDialog';
import { EditCampaignDialog } from '@/components/campaigns/EditCampaignDialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Campaigns() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingCampaign, setEditingCampaign] = useState<{ id: string, name: string, dailyLimit: number } | null>(null);
  const { t } = useLanguage();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: api.campaigns.list,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (status === 'active') {
        await campaignsApi.resume(id);
        // Also start sending jobs when activating
        await sendApi.start(id);
        return { resumed: true };
      } else if (status === 'paused') {
        return campaignsApi.pause(id);
      } else {
        return campaignsApi.update(id, { status });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({ title: 'Campaign status updated' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.campaigns.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({ title: 'Campaign deleted' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    const key = `admin.campaigns.status.${status.toLowerCase()}`;
    // Fallback to capitalizing first letter if key not found (though it should be)
    return t(key).includes('admin.') ? status.charAt(0).toUpperCase() + status.slice(1) : t(key);
  };

  const statusColors: Record<string, string> = {
    active: 'status-success',
    paused: 'status-warning',
    draft: 'bg-muted text-foreground',
    completed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.campaigns.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.campaigns.subtitle')}</p>
        </div>
        <CreateCampaignDialog />
      </div>

      <div className="grid gap-4">
        {campaigns?.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/25">
            <Rocket className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">{t('admin.campaigns.noCampaigns')}</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              {t('admin.campaigns.createFirst')}
            </p>
          </div>
        ) : (
          campaigns?.map((campaign) => (
            <div key={campaign._id || campaign.id} className="card-elevated p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{campaign.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{campaign.leadCount || 0} {t('admin.campaigns.leads')}</span>
                      <span>•</span>
                      <span>{campaign.dailyLimit || campaign.daily_limit} {t('admin.campaigns.emailsPerDay')}</span>
                      <span>•</span>
                      <span>{t('admin.campaigns.created')} {formatDistanceToNow(new Date(campaign.createdAt || campaign.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn('status-badge', statusColors[campaign.status || 'paused'] || statusColors.paused)}>
                    {getStatusLabel(campaign.status || 'paused')}
                  </span>

                  {(campaign.status === 'active' || campaign.status === 'paused') && (
                    campaign.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => statusMutation.mutate({ id: campaign._id || campaign.id, status: 'paused' })}
                        disabled={statusMutation.isPending}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => statusMutation.mutate({ id: campaign._id || campaign.id, status: 'active' })}
                        disabled={statusMutation.isPending}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCampaign({
                        id: campaign._id || campaign.id,
                        name: campaign.name,
                        dailyLimit: campaign.dailyLimit || campaign.daily_limit || 50
                      })}>
                        {t('admin.campaigns.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>{t('admin.campaigns.viewLeads')}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(campaign._id || campaign.id)}>
                        {t('admin.campaigns.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('admin.campaigns.sentToday')}</span>
                  <span className="font-medium text-foreground">
                    {campaign.todayCount || 0} / {campaign.dailyLimit || campaign.daily_limit}
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((campaign.todayCount || 0) / (campaign.dailyLimit || campaign.daily_limit)) * 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="text-sm text-muted-foreground">{t('admin.campaigns.totalSent')}</div>
                  <div className="text-xl font-bold text-foreground mt-1">{campaign.sentCount || 0}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="text-sm text-muted-foreground">{t('admin.campaigns.totalLeads')}</div>
                  <div className="text-xl font-bold text-foreground mt-1">{campaign.leadCount || 0}</div>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="text-sm text-red-600/80">{t('admin.campaigns.failed')}</div>
                  <div className="text-xl font-bold text-red-600 mt-1">{campaign.failedCount || 0}</div>
                </div>
              </div>


            </div>
          ))
        )}
      </div>

      <EditCampaignDialog
        open={!!editingCampaign}
        onOpenChange={(open) => !open && setEditingCampaign(null)}
        campaign={editingCampaign}
      />
    </div>
  );
}
