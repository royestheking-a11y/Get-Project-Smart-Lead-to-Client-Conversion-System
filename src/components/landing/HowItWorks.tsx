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
    <section id="how-it-works" className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute -left-40 top-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 bottom-40 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
            Simple Process
          </span>
          <h2 className="mb-6 text-4xl font-extrabold text-foreground md:text-5xl tracking-tight">
            {t('how.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
            {t('how.subtitle')}
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

          {steps.map((step, index) => (
            <Card key={step.number} className="relative z-10 overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <CardContent className="relative p-8 flex flex-col items-center text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-background to-muted border border-border/50 shadow-xl group-hover:border-primary/30 transition-colors">
                    <step.icon className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-lg text-sm">
                      {step.number}
                    </div>
                  </div>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
