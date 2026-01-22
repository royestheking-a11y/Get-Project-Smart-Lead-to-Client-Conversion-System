import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { campaignsApi } from '@/lib/backend-api';
import { useToast } from '@/hooks/use-toast';

interface FollowupRule {
  id: string;
  name: string;
  daysAfter: number;
  enabled: boolean;
  description: string;
}

export default function Followups() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  // Get selected campaign
  const selectedCampaign = campaigns?.find(c => (c._id || c.id) === selectedCampaignId);

  const updateCampaignMutation = useMutation({
    mutationFn: (data: any) => {
      if (!selectedCampaignId) throw new Error('No campaign selected');
      return campaignsApi.update(selectedCampaignId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({ title: 'Follow-up settings updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const rules: FollowupRule[] = [
    {
      id: 'followup1',
      name: 'Follow-up #1',
      daysAfter: 3,
      enabled: selectedCampaign?.followupsEnabled || false,
      description: 'Send a gentle reminder if no reply received',
    },
    {
      id: 'followup2',
      name: 'Follow-up #2',
      daysAfter: 7,
      enabled: selectedCampaign?.followupsEnabled || false,
      description: 'Send a final follow-up before marking as done',
    },
  ];

  const updateRule = (id: string, updates: Partial<FollowupRule>) => {
    if (id === 'followup1' || id === 'followup2') {
      // Update campaign followupsEnabled setting
      updateCampaignMutation.mutate({ followupsEnabled: updates.enabled });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Follow-up Automation</h1>
          <p className="text-muted-foreground mt-1">
            Configure automatic follow-up emails for leads who haven't replied
          </p>
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

      {!selectedCampaignId && (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Please select a campaign to configure follow-ups</p>
        </div>
      )}

      {/* Rules */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="card-elevated p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-light">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                </div>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={(enabled) => updateRule(rule.id, { enabled })}
                disabled={updateCampaignMutation.isPending || !selectedCampaignId}
              />
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor={`days-${rule.id}`} className="text-sm text-muted-foreground">
                  Send after
                </Label>
              </div>
              <Input
                id={`days-${rule.id}`}
                type="number"
                min={1}
                max={30}
                value={rule.daysAfter}
                onChange={(e) => {
                  // Days are fixed at 3 and 7 as per backend spec
                  // This is just for display
                }}
                className="w-20"
                disabled={!rule.enabled || !selectedCampaignId}
                readOnly
              />
              <span className="text-sm text-muted-foreground">days of no reply</span>
            </div>
          </div>
        ))}
      </div>

      {/* Conditions Info */}
      <div className="card-elevated p-6 bg-muted/30">
        <h3 className="font-semibold text-foreground mb-3">Follow-up Conditions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Follow-ups will only be sent when the lead meets these conditions:
        </p>
        <ul className="space-y-2">
          {[
            'Lead has not replied',
            'Email did not bounce',
            'Lead is not marked as "Do Not Contact"',
            'Previous email was successfully sent',
          ].map((condition) => (
            <li key={condition} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline */}
      <div className="card-elevated p-6">
        <h3 className="font-semibold text-foreground mb-4">Email Sequence Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="relative flex items-center gap-4 pb-6">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
              <span className="text-xs font-bold text-primary-foreground">1</span>
            </div>
            <div>
              <p className="font-medium">Initial Email</p>
              <p className="text-sm text-muted-foreground">Day 0</p>
            </div>
          </div>

          <div className="relative flex items-center gap-4 pb-6">
            <div className="w-8 h-8 rounded-full bg-primary/70 flex items-center justify-center z-10">
              <span className="text-xs font-bold text-primary-foreground">2</span>
            </div>
            <div>
              <p className="font-medium">Follow-up #1</p>
              <p className="text-sm text-muted-foreground">Day {rules[0].daysAfter}</p>
            </div>
          </div>

          <div className="relative flex items-center gap-4 pb-6">
            <div className="w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center z-10">
              <span className="text-xs font-bold text-primary-foreground">3</span>
            </div>
            <div>
              <p className="font-medium">Follow-up #2</p>
              <p className="text-sm text-muted-foreground">Day {rules[1].daysAfter}</p>
            </div>
          </div>

          <div className="relative flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center z-10">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Sequence Complete</p>
              <p className="text-sm text-muted-foreground">Mark as DONE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
