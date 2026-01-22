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
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('builtFor.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t('builtFor.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((audience) => (
            <Card key={audience.title} className="border-2 text-center transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
                  <audience.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{audience.title}</h3>
                <p className="text-muted-foreground">{audience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuiltForSection;
