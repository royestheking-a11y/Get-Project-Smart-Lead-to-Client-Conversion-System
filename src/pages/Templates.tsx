import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, FileText, Edit, Trash2, Eye, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { templatesApi, campaignsApi } from '@/lib/backend-api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Template {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  subjectTemplate: string;
  bodyTemplate: string;
  campaignId?: string;
}

const variables = [
  '{{company_name}}',
  '{{website}}',
  '{{location}}',
  '{{industry}}',
  '{{your_name}}',
  '{{your_company}}',
  '{{whatsapp}}',
  '{{portfolio_link}}',
];

export default function Templates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subject: '',
    body: '',
    campaignId: '',
  });

  // Get campaigns
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsApi.list,
  });



  // Get templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates', selectedCampaignId],
    queryFn: () => templatesApi.list(selectedCampaignId),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => templatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({ title: 'Template created' });
      setIsDialogOpen(false);
      setFormData({ name: '', category: '', subject: '', body: '', campaignId: '' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => templatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({ title: 'Template updated' });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      setFormData({ name: '', category: '', subject: '', body: '', campaignId: '' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => templatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({ title: 'Template deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subject: template.subjectTemplate,
      body: template.bodyTemplate,
      campaignId: template.campaignId || selectedCampaignId,
    });
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingTemplate(null);
    setFormData({ name: '', category: '', subject: '', body: '', campaignId: selectedCampaignId });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.campaignId) {
      toast({ title: 'Campaign required', variant: 'destructive' });
      return;
    }
    if (!formData.name || !formData.category || !formData.subject || !formData.body) {
      toast({ title: 'All fields required', variant: 'destructive' });
      return;
    }

    const templateData = {
      campaignId: formData.campaignId,
      name: formData.name,
      category: formData.category,
      subjectTemplate: formData.subject,
      bodyTemplate: formData.body,
    };

    if (editingTemplate) {
      updateMutation.mutate({
        id: editingTemplate._id || editingTemplate.id || '',
        data: templateData,
      });
    } else {
      createMutation.mutate(templateData);
    }
  };

  const insertVariable = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      body: prev.body + variable,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground mt-1">Manage your outreach email templates</p>
        </div>
        <div className="flex items-center gap-2">
          {campaigns && campaigns.length > 0 && (
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
          )}
          <Button onClick={handleNew} disabled={!selectedCampaignId}>
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : templates && templates.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/25">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No templates yet</h3>
          <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
            Create your first email template to start sending personalized emails.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates?.map((template) => {
            const templateId = template._id || template.id || '';
            return (
              <div key={templateId} className="card-elevated p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary-light">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {template.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  Subject: {template.subjectTemplate}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(template)}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate(templateId)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Template Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {campaigns && campaigns.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign</Label>
                <select
                  id="campaign"
                  value={formData.campaignId}
                  onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select campaign...</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign._id || campaign.id} value={campaign._id || campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Website Audit Offer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select category...</option>
                  <option value="NO_WEBSITE">No Website</option>
                  <option value="HAS_WEBSITE">Has Website</option>
                  <option value="WEAK_WEBSITE">Weak Website</option>
                  <option value="SEO_WEAK">SEO Weak</option>
                  <option value="ECOMMERCE">E-commerce</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Quick question about {{company_name}}"
              />
            </div>

            <div className="space-y-2">
              <Label>Insert Variables</Label>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable) => (
                  <Button
                    key={variable}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable)}
                    className="text-xs"
                  >
                    {variable}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Write your email template here..."
                rows={10}
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 120-170 words with one clear CTA
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setEditingTemplate(null);
              setFormData({ name: '', category: '', subject: '', body: '', campaignId: selectedCampaignId });
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {editingTemplate ? 'Update' : 'Create'} Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
