import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Zap, Rocket, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import LandingNavbar from '@/components/landing/LandingNavbar';

export default function Pricing() {
  const { t } = useLanguage();

  const pricingPlans = [
    {
      name: t('pricing.basic'),
      price: t('pricing.free'),
      description: t('pricing.basicDesc'),
      icon: Zap,
      features: [
        t('pricing.basic.feature1'),
        t('pricing.basic.feature2'),
        t('pricing.basic.feature3'),
        t('pricing.basic.feature4'),
        t('pricing.basic.feature5'),
        t('pricing.basic.feature6'),
      ],
      cta: t('pricing.getStartedFree'),
      popular: false,
    },
    {
      name: t('pricing.premium'),
      price: '$29',
      period: t('pricing.perMonth'),
      description: t('pricing.premiumDesc'),
      icon: Rocket,
      features: [
        t('pricing.premium.feature1'),
        t('pricing.premium.feature2'),
        t('pricing.premium.feature3'),
        t('pricing.premium.feature4'),
        t('pricing.premium.feature5'),
        t('pricing.premium.feature6'),
        t('pricing.premium.feature7'),
        t('pricing.premium.feature8'),
      ],
      cta: t('pricing.startTrial'),
      popular: true,
    },
    {
      name: t('pricing.enterprise'),
      price: '$99',
      period: t('pricing.perMonth'),
      description: t('pricing.enterpriseDesc'),
      icon: Building2,
      features: [
        t('pricing.enterprise.feature1'),
        t('pricing.enterprise.feature2'),
        t('pricing.enterprise.feature3'),
        t('pricing.enterprise.feature4'),
        t('pricing.enterprise.feature5'),
        t('pricing.enterprise.feature6'),
        t('pricing.enterprise.feature7'),
        t('pricing.enterprise.feature8'),
      ],
      cta: t('pricing.contactSales'),
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <LandingNavbar />

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Zap className="h-4 w-4" />
            {t('pricing.badge')}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl mb-6">
            {t('pricing.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg',
                  plan.popular
                    ? 'border-primary shadow-primary/10 scale-105'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg">
                      {t('pricing.popular')}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={cn(
                    'inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4',
                    plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                  )}>
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    'w-full',
                    plan.popular
                      ? 'shadow-lg shadow-primary/25'
                      : ''
                  )}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  asChild
                >
                  <Link to="/signup">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            {t('pricing.questions')}{' '}
            <Link to="/#faq" className="text-primary font-medium hover:underline">
              {t('pricing.viewFaq')}
            </Link>{' '}
            {t('pricing.or')}{' '}
            <a href="mailto:support@getproject.com" className="text-primary font-medium hover:underline">
              {t('pricing.contactSupport')}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
