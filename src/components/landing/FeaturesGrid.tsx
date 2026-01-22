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
    <section id="features" className="relative py-24 lg:py-32 bg-muted/20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
            Platform Capabilities
          </span>
          <h2 className="mb-6 text-4xl font-extrabold text-foreground md:text-5xl tracking-tight">
            {t('features.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group relative overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <CardContent className="relative p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/20 transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                </div>

                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
