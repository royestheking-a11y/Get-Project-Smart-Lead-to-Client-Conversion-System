import { Building2, User, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const BuiltForSection = () => {
  const { t } = useLanguage();

  const audiences = [
    {
      icon: Building2,
      title: t('builtFor.agencies.title'),
      description: t('builtFor.agencies.desc'),
    },
    {
      icon: User,
      title: t('builtFor.freelancers.title'),
      description: t('builtFor.freelancers.desc'),
    },
    {
      icon: Rocket,
      title: t('builtFor.startups.title'),
      description: t('builtFor.startups.desc'),
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
            Who It's For
          </span>
          <h2 className="mb-6 text-4xl font-extrabold text-foreground md:text-5xl tracking-tight">
            {t('builtFor.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
            {t('builtFor.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {audiences.map((audience) => (
            <Card key={audience.title} className="group relative overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-border group-hover:border-primary/50 group-hover:bg-background transition-colors">
                    <audience.icon className="h-9 w-9 text-primary transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                </div>

                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  {audience.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {audience.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuiltForSection;
