import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, Sparkles, CheckCircle, Users, Mail, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroUploadCard from './HeroUploadCard';
import DashboardMockup from './DashboardMockup';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[800px] w-[800px] -translate-y-1/3 translate-x-1/4 rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute left-0 bottom-0 h-[600px] w-[600px] translate-y-1/3 -translate-x-1/4 rounded-full bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />
      </div>

      {/* First Hero - Upload Card */}
      {/* First Hero - Upload Card */}
      <div className="container mx-auto px-4 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="flex flex-col items-center gap-12 text-center">
          {/* Content - Top */}
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              {t('hero.badge')}
            </div>
            <h1 className="mb-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {t('hero.title1')}{' '}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                {t('hero.title2')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl max-w-xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                {t('hero.noCreditCard')}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                {t('hero.fileLimit')}
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                {t('hero.csvSupport')}
              </span>
            </div>
          </div>

          {/* Upload Card - Centered Below */}
          <div className="w-full flex justify-center">
            <HeroUploadCard />
          </div>
        </div>
      </div>

      {/* Second Hero - Dashboard Preview */}
      <div className="container mx-auto px-4 py-16 lg:py-24 border-t border-border/50">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Dashboard Mockup */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <DashboardMockup />
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="mb-6 text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {t('hero.title3')}{' '}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                {t('hero.title4')}
              </span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.subtitle2')}
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{t('hero.autoImport')}</p>
                  <p className="text-xs text-muted-foreground">{t('hero.csvExcel')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{t('hero.smartSending')}</p>
                  <p className="text-xs text-muted-foreground">{t('hero.rateLimited')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{t('hero.trackResults')}</p>
                  <p className="text-xs text-muted-foreground">{t('hero.realTimeStats')}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group px-8">
                <Link to="/login" className="flex items-center gap-2">
                  {t('nav.login')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group px-8">
                <Link to="/watch-demo" className="flex items-center gap-2">
                  <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t('hero.watchDemo')}
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t('hero.noPaidTools')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t('hero.freefirst')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t('hero.builtFor')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
