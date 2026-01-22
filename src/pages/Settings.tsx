import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertCircle, User, Mail, MessageSquare, Link, Building, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/backend-api';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();

  const [senderConfig, setSenderConfig] = useState({
    displayName: user?.name || '',
    connected: true, // SMTP/Gmail is configured in backend
  });

  const [signature, setSignature] = useState({
    yourName: user?.name || '',
    company: '',
    whatsapp: '',
    portfolioLink: '',
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setSenderConfig({
        displayName: user.name || '',
        connected: true,
      });
      // @ts-ignore - signature might not be in access token type def yet
      const sig = user.signature || {};
      setSignature({
        yourName: user.name || '',
        company: sig.company || '',
        whatsapp: sig.whatsapp || '',
        portfolioLink: sig.portfolioLink || '',
      });
    }
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return authApi.updateProfile(data);
    },
    onSuccess: (updatedUser: any) => {
      // Refresh context
      refreshUser();

      // Manually update local state to verify immediate feedback
      setSenderConfig({
        displayName: updatedUser.name || '',
        connected: true,
      });

      const sig = updatedUser.signature || {};
      setSignature({
        yourName: updatedUser.name || '',
        company: sig.company || '',
        whatsapp: sig.whatsapp || '',
        portfolioLink: sig.portfolioLink || '',
      });

      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });
    },
  });

  const handleSave = () => {
    updateUserMutation.mutate({
      name: signature.yourName, // Update name from signature field
      signature: {
        company: signature.company,
        whatsapp: signature.whatsapp,
        portfolioLink: signature.portfolioLink
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your sender profile and email signature</p>
      </div>

      {/* Sender Configuration */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sender Configuration</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Sender Display Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="displayName"
                value={senderConfig.displayName}
                onChange={(e) => setSenderConfig({ ...senderConfig, displayName: e.target.value })}
                className="pl-9"
                placeholder="Your name as it appears in emails"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Service</p>
                <p className="text-sm text-muted-foreground">
                  {import.meta.env.VITE_API_URL ? 'Connected to backend' : 'Gmail SMTP configured in backend'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Configured</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              Email sending is configured in the backend. Check <code className="text-xs bg-background px-1 py-0.5 rounded">backend/.env</code> for SMTP/Gmail settings.
            </p>
          </div>
        </div>
      </div>

      {/* Email Signature */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Email Signature Variables</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These values will replace template variables like {'{{your_name}}'}, {'{{company}}'}, etc.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="yourName">Your Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="yourName"
                value={signature.yourName}
                onChange={(e) => setSignature({ ...signature, yourName: e.target.value })}
                className="pl-9"
                placeholder="Your full name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                value={signature.company}
                onChange={(e) => setSignature({ ...signature, company: e.target.value })}
                className="pl-9"
                placeholder="Your company name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="whatsapp"
                value={signature.whatsapp}
                onChange={(e) => setSignature({ ...signature, whatsapp: e.target.value })}
                className="pl-9"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioLink">Portfolio Link</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="portfolioLink"
                value={signature.portfolioLink}
                onChange={(e) => setSignature({ ...signature, portfolioLink: e.target.value })}
                className="pl-9"
                placeholder="https://your-portfolio.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          size="lg"
          disabled={updateUserMutation.isPending}
        >
          {updateUserMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
