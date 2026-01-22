import { Upload, Tags, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: '1',
      icon: Upload,
      title: t('how.step1.title'),
      description: t('how.step1.desc'),
    },
    {
      number: '2',
      icon: Tags,
      title: t('how.step2.title'),
      description: t('how.step2.desc'),
    },
    {
      number: '3',
      icon: Send,
      title: t('how.step3.title'),
      description: t('how.step3.desc'),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {t('how.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t('how.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.number} className="relative overflow-hidden border-2 transition-shadow hover:shadow-lg">
              <div className="absolute -right-4 -top-4 text-8xl font-bold text-primary/5">
                {step.number}
              </div>
              <CardContent className="relative p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
