import { useQuery } from '@tanstack/react-query';
import { KPICard } from '@/components/dashboard/KPICard';
import { CampaignStatusPanel } from '@/components/dashboard/CampaignStatusPanel';
import { RecentActivityTable } from '@/components/dashboard/RecentActivityTable';
import { Users, Send, Mail, MessageSquare, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsApi, sendApi } from '@/lib/backend-api';
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Get all campaigns
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsApi.list,
  });

  // Get stats for the first campaign (or aggregate all)
  const selectedCampaignId = campaigns?.[0]?._id || campaigns?.[0]?.id;

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats', selectedCampaignId],
    queryFn: () => sendApi.stats(selectedCampaignId!),
    enabled: !!selectedCampaignId,
  });

  const kpiData = useMemo(() => [
    {
      title: t('dashboard.leadsImported'),
      value: stats?.leadsImported?.toLocaleString() || '0',
      icon: Users
    },
    {
      title: t('dashboard.readyToSend'),
      value: stats?.readyCount?.toLocaleString() || '0',
      icon: Send
    },
    {
      title: t('dashboard.sentToday'),
      value: stats?.sentToday?.toLocaleString() || '0',
      icon: Mail
    },
    {
      title: t('dashboard.replies'),
      value: stats?.repliedCount?.toLocaleString() || '0',
      icon: MessageSquare
    },
    {
      title: t('admin.dashboard.failedBounced'),
      value: stats?.failedCount?.toLocaleString() || '0',
      icon: TrendingUp
    },
  ], [stats, t]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('admin.dashboard')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('admin.dashboard.welcome').replace('{name}', user?.name?.split(' ')[0] || 'User')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/leads/import" className="flex items-center gap-2">
              {t('admin.importLeads')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild className="shadow-lg shadow-primary/25">
            <Link to="/campaigns" className="flex items-center gap-2">
              {t('admin.dashboard.newCampaign')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 shadow-xl shadow-primary/20">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-white/80 text-sm">{t('admin.dashboard.campaignPerformance')}</p>
                <p className="font-semibold">{t('admin.dashboard.replyRateMsg')}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/campaigns">{t('admin.dashboard.viewDetails')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      {statsLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}

            />
          ))}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Status - Takes 1 column */}
        <div className="lg:col-span-1">
          <CampaignStatusPanel campaignId={selectedCampaignId} campaign={campaigns?.[0]} />
        </div>

        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivityTable />
        </div>
      </div>
    </div>
  );
}
