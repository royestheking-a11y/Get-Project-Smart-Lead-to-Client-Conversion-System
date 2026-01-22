import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Mail, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LandingFooter = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    product: [
      { label: t('nav.features'), href: '/features' },
      { label: t('nav.howItWorks'), href: '/how-it-works' },
      { label: t('nav.pricing'), href: '/pricing' },
    ],
    company: [
      { label: t('footer.about'), href: '/about' },
      { label: t('footer.blog'), href: '/blog' },
      { label: t('footer.careers'), href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: t('footer.privacy'), href: '/privacy' },
      { label: t('footer.terms'), href: '/terms' },
    ],
  };

  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-background to-muted/20 pt-16 pb-8 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl opacity-30"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 xl:grid-cols-5 lg:gap-8">
          {/* Brand Column */}
          <div className="xl:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Get Project
              </span>
            </Link>
            <p className="text-muted-foreground text-base max-w-sm mb-8 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-3">
            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">{t('footer.product')}</h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors block text-sm font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">{t('footer.company')}</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors block text-sm font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">{t('footer.legal')}</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors block text-sm font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground/80">
            {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {t('nav.login')}
            </Link>

            {/* Scroll to Top Button */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 animate-fade-in group"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
