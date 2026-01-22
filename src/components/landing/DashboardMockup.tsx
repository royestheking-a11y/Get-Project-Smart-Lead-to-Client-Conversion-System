import { Users, Send, MessageSquare, RefreshCw, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DashboardMockup = () => {
  const kpis = [
    { label: 'Imported', value: '2,847', icon: Users, trend: '+12%' },
    { label: 'Sent Today', value: '67', icon: Send, trend: '+8%' },
    { label: 'Replies', value: '23', icon: MessageSquare, trend: '+24%' },
    { label: 'Follow-ups', value: '145', icon: RefreshCw, trend: '+5%' },
  ];

  const leads = [
    { company: 'TechFlow Inc', email: 'hello@techflow.io', status: 'SENT' },
    { company: 'GreenLeaf Co', email: 'info@greenleaf.com', status: 'REPLIED' },
    { company: 'BlueSky Media', email: 'team@bluesky.co', status: 'READY' },
    { company: 'Nova Design', email: 'hi@novadesign.io', status: 'SENT' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REPLIED':
        return <Badge className="bg-success text-success-foreground text-[10px] px-1.5 py-0">Replied</Badge>;
      case 'SENT':
        return <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Sent</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0">Ready</Badge>;
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Premium Glow effect */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 blur-2xl opacity-60" />
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/50 via-transparent to-primary/50 opacity-50" />
      
      <Card className="relative border-2 shadow-2xl bg-card/95 backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/50 pb-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Dashboard Preview
            </CardTitle>
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* KPI Cards */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {kpis.map((kpi) => (
              <div 
                key={kpi.label} 
                className="rounded-xl bg-gradient-to-br from-muted/80 to-muted/40 p-2.5 text-center border border-border/50"
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <kpi.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-base font-bold text-foreground">{kpi.value}</p>
                <p className="text-[9px] text-muted-foreground mb-0.5">{kpi.label}</p>
                <p className="text-[8px] text-primary font-medium flex items-center justify-center gap-0.5">
                  <TrendingUp className="h-2 w-2" />
                  {kpi.trend}
                </p>
              </div>
            ))}
          </div>

          {/* Mini Table */}
          <div className="rounded-xl border overflow-hidden">
            <div className="grid grid-cols-3 gap-2 bg-muted/50 px-3 py-2 text-[10px] font-semibold text-muted-foreground">
              <span>Company</span>
              <span>Email</span>
              <span>Status</span>
            </div>
            {leads.map((lead, i) => (
              <div 
                key={i} 
                className="grid grid-cols-3 gap-2 border-t px-3 py-2 text-[11px] hover:bg-muted/30 transition-colors"
              >
                <span className="truncate font-medium text-foreground">{lead.company}</span>
                <span className="truncate text-muted-foreground">{lead.email}</span>
                <span>{getStatusBadge(lead.status)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMockup;
