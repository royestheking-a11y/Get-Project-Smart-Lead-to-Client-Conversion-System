import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MoreHorizontal, ExternalLink, Mail, Ban, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { leadsApi, campaignsApi } from '@/lib/backend-api';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface Lead {
  _id?: string;
  id?: string;
  companyName?: string;
  email: string;
  website?: string;
  category?: string | null;
  status: string;
  lastContactedAt?: string | Date | null;
}

// StatusConfig and categoryLabels are now inside the component to access t()

export default function Leads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

  // Status configuration with translations
  const statusConfig: Record<string, { label: string; className: string }> = {
    IMPORTED: { label: t('admin.leads.status.imported'), className: 'bg-muted text-muted-foreground' },
    READY: { label: t('admin.leads.status.ready'), className: 'status-info' },
    SENT: { label: t('admin.leads.status.sent'), className: 'bg-blue-100 text-blue-800' },
    REPLIED: { label: t('admin.leads.status.replied'), className: 'status-success' },
    BOUNCED: { label: t('admin.leads.status.bounced'), className: 'status-warning' },
    FAILED: { label: t('admin.leads.status.failed'), className: 'status-error' },
    FOLLOWUP_1_SENT: { label: t('admin.leads.status.followup1'), className: 'bg-purple-100 text-purple-800' },
    FOLLOWUP_2_SENT: { label: t('admin.leads.status.followup2'), className: 'bg-indigo-100 text-indigo-800' },
    WON: { label: t('admin.leads.status.won'), className: 'bg-green-100 text-green-800' },
    LOST: { label: t('admin.leads.status.lost'), className: 'bg-red-100 text-red-800' },
    DONE: { label: t('admin.leads.status.done'), className: 'bg-gray-100 text-gray-800' },
    DO_NOT_CONTACT: { label: t('admin.leads.status.doNotContact'), className: 'bg-orange-100 text-orange-800' },
  };

  const categoryLabels: Record<string, string> = {
    NO_WEBSITE: t('admin.leads.category.noWebsite'),
    HAS_WEBSITE: t('admin.leads.category.hasWebsite'),
    WEAK_WEBSITE: t('admin.leads.category.weakWebsite'),
    SEO_WEAK: t('admin.leads.category.seoWeak'),
    ECOMMERCE: t('admin.leads.category.ecommerce'),
  };

  // Get campaigns
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsApi.list,
  });



  // Get leads
  // Get leads
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['leads', selectedCampaignId, statusFilter, categoryFilter, searchQuery],
    queryFn: () => leadsApi.list({
      campaignId: selectedCampaignId || undefined, // Allow fetching all leads if no campaign selected
      status: statusFilter !== 'all' ? statusFilter : undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      search: searchQuery || undefined,
      page: 1,
      limit: 100,
    }),
  });

  const leads = leadsData?.leads || [];

  const filteredLeads = leads.filter(
    (lead) =>
      !searchQuery ||
      (lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((l) => l.id));
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const markRepliedMutation = useMutation({
    mutationFn: (id: string) => leadsApi.markReplied(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({ title: 'Lead marked as replied' });
    },
  });

  const doNotContactMutation = useMutation({
    mutationFn: (id: string) => leadsApi.doNotContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast({ title: 'Lead marked as do not contact' });
    },
  });

  const categorizeMutation = useMutation({
    mutationFn: () => {
      if (!selectedCampaignId) throw new Error('No campaign selected');
      return leadsApi.categorize(selectedCampaignId, 50);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: 'Categorization complete',
        description: `Categorized ${result.categorized} leads`
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.leads.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('admin.leads.subtitle', { total: leadsData?.total || 0 })}
            {selectedCampaignId && campaigns && (
              <span> {t('admin.leads.in')} {campaigns.find(c => (c._id || c.id) === selectedCampaignId)?.name}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedCampaignId && (
            <Button
              variant="outline"
              onClick={() => categorizeMutation.mutate()}
              disabled={categorizeMutation.isPending}
            >
              {categorizeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t('admin.leads.categorize')}
            </Button>
          )}
          <Button asChild>
            <a href="/leads/import">{t('admin.importLeads')}</a>
          </Button>
        </div>
      </div>

      {/* Campaign Selector */}
      {campaigns && campaigns.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{t('admin.leads.campaign')}</label>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">{t('admin.leads.allCampaigns')}</option>
            {campaigns.map((campaign) => (
              <option key={campaign._id || campaign.id} value={campaign._id || campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.leads.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.leads.allStatus')}</SelectItem>
            <SelectItem value="IMPORTED">{statusConfig.IMPORTED.label}</SelectItem>
            <SelectItem value="READY">{statusConfig.READY.label}</SelectItem>
            <SelectItem value="SENT">{statusConfig.SENT.label}</SelectItem>
            <SelectItem value="REPLIED">{statusConfig.REPLIED.label}</SelectItem>
            <SelectItem value="BOUNCED">{statusConfig.BOUNCED.label}</SelectItem>
            <SelectItem value="FAILED">{statusConfig.FAILED.label}</SelectItem>
            <SelectItem value="WON">{statusConfig.WON.label}</SelectItem>
            <SelectItem value="LOST">{statusConfig.LOST.label}</SelectItem>
            <SelectItem value="DONE">{statusConfig.DONE.label}</SelectItem>
            <SelectItem value="DO_NOT_CONTACT">{statusConfig.DO_NOT_CONTACT.label}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.leads.allCategories')}</SelectItem>
            <SelectItem value="NO_WEBSITE">{categoryLabels.NO_WEBSITE}</SelectItem>
            <SelectItem value="HAS_WEBSITE">{categoryLabels.HAS_WEBSITE}</SelectItem>
            <SelectItem value="WEAK_WEBSITE">{categoryLabels.WEAK_WEBSITE}</SelectItem>
            <SelectItem value="SEO_WEAK">{categoryLabels.SEO_WEAK}</SelectItem>
            <SelectItem value="ECOMMERCE">{categoryLabels.ECOMMERCE}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-light border border-primary/20 animate-fade-in">
          <span className="text-sm font-medium text-primary">
            {t('admin.leads.selected', { count: selectedLeads.length })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              selectedLeads.forEach(id => doNotContactMutation.mutate(id));
              setSelectedLeads([]);
            }}
            disabled={doNotContactMutation.isPending}
          >
            <Ban className="h-4 w-4" />
            {t('admin.leads.markDoNotContact')}
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            {t('admin.leads.delete')}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('admin.leads.noLeads')}</p>
            {!selectedCampaignId && (
              <p className="text-sm text-muted-foreground mt-2">{t('admin.leads.noLeadsDesc')}</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12">
                    <Checkbox
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th>{t('admin.leads.company')}</th>
                  <th>{t('admin.leads.email')}</th>
                  <th>Website</th>
                  <th>{t('admin.leads.category')}</th>
                  <th>{t('admin.leads.status')}</th>
                  <th>{t('admin.leads.lastContacted')}</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const leadId = lead._id || lead.id || '';
                  const lastContacted = lead.lastContactedAt
                    ? new Date(lead.lastContactedAt)
                    : null;
                  return (
                    <tr key={leadId}>
                      <td>
                        <Checkbox
                          checked={selectedLeads.includes(leadId)}
                          onCheckedChange={() => toggleSelectLead(leadId)}
                        />
                      </td>
                      <td className="font-medium">{lead.companyName || '—'}</td>
                      <td className="text-muted-foreground">{lead.email}</td>
                      <td>
                        {lead.website ? (
                          <a
                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {lead.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td>
                        <span className="text-sm text-muted-foreground">
                          {lead.category ? (categoryLabels[lead.category] || lead.category) : '—'}
                        </span>
                      </td>
                      <td>
                        <span className={cn('status-badge', statusConfig[lead.status]?.className || 'bg-muted')}>
                          {statusConfig[lead.status]?.label || lead.status}
                        </span>
                      </td>
                      <td className="text-muted-foreground text-sm">
                        {lastContacted
                          ? lastContacted.toLocaleDateString()
                          : '—'}
                      </td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => markRepliedMutation.mutate(leadId)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Replied
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                leadsApi.update(leadId, { status: 'WON' }).then(() => {
                                  queryClient.invalidateQueries({ queryKey: ['leads'] });
                                  queryClient.invalidateQueries({ queryKey: ['stats'] });
                                  toast({ title: 'Lead marked as WON' });
                                }).catch((error: any) => {
                                  toast({ title: 'Error', description: error.message, variant: 'destructive' });
                                });
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Mark as Won
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                leadsApi.update(leadId, { status: 'LOST' }).then(() => {
                                  queryClient.invalidateQueries({ queryKey: ['leads'] });
                                  queryClient.invalidateQueries({ queryKey: ['stats'] });
                                  toast({ title: 'Lead marked as LOST' });
                                }).catch((error: any) => {
                                  toast({ title: 'Error', description: error.message, variant: 'destructive' });
                                });
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2 text-red-600" />
                              Mark as Lost
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => doNotContactMutation.mutate(leadId)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Do Not Contact
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
