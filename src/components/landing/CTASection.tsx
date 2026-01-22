import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 p-10 md:p-16 shadow-2xl shadow-primary/20">
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          </div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {t('cta.badge')}
            </div>
            
            <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              {t('cta.title')}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90">
              {t('cta.subtitle')}
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/95 shadow-lg hover:shadow-xl transition-all font-semibold group" 
                asChild
              >
                <Link to="/login" className="flex items-center gap-2">
                  {t('nav.getStarted')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white bg-transparent text-white hover:bg-white/10 font-semibold" 
                asChild
              >
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
