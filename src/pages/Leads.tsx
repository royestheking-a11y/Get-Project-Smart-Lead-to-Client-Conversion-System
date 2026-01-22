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

// Removed mock data - using real API data

const statusConfig: Record<string, { label: string; className: string }> = {
  IMPORTED: { label: 'Imported', className: 'bg-muted text-muted-foreground' },
  READY: { label: 'Ready', className: 'status-info' },
  SENT: { label: 'Sent', className: 'bg-blue-100 text-blue-800' },
  REPLIED: { label: 'Replied', className: 'status-success' },
  BOUNCED: { label: 'Bounced', className: 'status-warning' },
  FAILED: { label: 'Failed', className: 'status-error' },
  FOLLOWUP_1_SENT: { label: 'Follow-up 1', className: 'bg-purple-100 text-purple-800' },
  FOLLOWUP_2_SENT: { label: 'Follow-up 2', className: 'bg-indigo-100 text-indigo-800' },
  WON: { label: 'Won', className: 'bg-green-100 text-green-800' },
  LOST: { label: 'Lost', className: 'bg-red-100 text-red-800' },
  DONE: { label: 'Done', className: 'bg-gray-100 text-gray-800' },
  DO_NOT_CONTACT: { label: 'Do Not Contact', className: 'bg-orange-100 text-orange-800' },
};

const categoryLabels: Record<string, string> = {
  NO_WEBSITE: 'No Website',
  HAS_WEBSITE: 'Has Website',
  WEAK_WEBSITE: 'Weak Website',
  SEO_WEAK: 'SEO Weak',
  ECOMMERCE: 'E-commerce',
};

export default function Leads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

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
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground mt-1">
            {leadsData?.total || 0} total leads
            {selectedCampaignId && campaigns && (
              <span> in {campaigns.find(c => (c._id || c.id) === selectedCampaignId)?.name}</span>
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
              Categorize Leads
            </Button>
          )}
          <Button asChild>
            <a href="/leads/import">Import Leads</a>
          </Button>
        </div>
      </div>

      {/* Campaign Selector */}
      {campaigns && campaigns.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Campaign:</label>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">All Campaigns</option>
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
            placeholder="Search company or email..."
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="IMPORTED">Imported</SelectItem>
            <SelectItem value="READY">Ready</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="REPLIED">Replied</SelectItem>
            <SelectItem value="BOUNCED">Bounced</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="WON">Won</SelectItem>
            <SelectItem value="LOST">Lost</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
            <SelectItem value="DO_NOT_CONTACT">Do Not Contact</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="NO_WEBSITE">No Website</SelectItem>
            <SelectItem value="HAS_WEBSITE">Has Website</SelectItem>
            <SelectItem value="WEAK_WEBSITE">Weak Website</SelectItem>
            <SelectItem value="SEO_WEAK">SEO Weak</SelectItem>
            <SelectItem value="ECOMMERCE">E-commerce</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-light border border-primary/20 animate-fade-in">
          <span className="text-sm font-medium text-primary">
            {selectedLeads.length} selected
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
            Do Not Contact
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            Delete
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
            <p className="text-muted-foreground">No leads found</p>
            {!selectedCampaignId && (
              <p className="text-sm text-muted-foreground mt-2">Please select a campaign</p>
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
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Last Contacted</th>
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
