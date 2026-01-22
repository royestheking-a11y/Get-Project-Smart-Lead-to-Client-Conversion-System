import { Zap, RefreshCw, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SocialProofStrip = () => {
  const { t } = useLanguage();
  
  const items = [
    { icon: Zap, label: t('social.autoOutreach') },
    { icon: RefreshCw, label: t('social.queueFollowups') },
    { icon: FileSpreadsheet, label: t('social.excelImport') },
    { icon: BarChart3, label: t('social.trackingDashboard') },
  ];

  return (
    <section className="border-y bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-sm border"
            >
              <item.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofStrip;
