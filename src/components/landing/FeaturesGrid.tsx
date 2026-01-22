import { Tags, FileText, Shield, RefreshCw, BarChart3, UserX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const FeaturesGrid = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Tags,
      title: t('features.categorization.title'),
      description: t('features.categorization.desc'),
    },
    {
      icon: FileText,
      title: t('features.templates.title'),
      description: t('features.templates.desc'),
    },
    {
      icon: Shield,
      title: t('features.rateLimit.title'),
      description: t('features.rateLimit.desc'),
    },
    {
      icon: RefreshCw,
      title: t('features.followups.title'),
      description: t('features.followups.desc'),
    },
    {
      icon: BarChart3,
      title: t('features.tracking.title'),
      description: t('features.tracking.desc'),
    },
    {
      icon: UserX,
      title: t('features.exclusion.title'),
      description: t('features.exclusion.desc'),
    },
  ];

  return (
    <section id="features" className="bg-muted/30 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('features.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
