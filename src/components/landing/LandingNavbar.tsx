import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { label: t('nav.home'), href: '/', isRoute: true },
    { label: t('nav.features'), href: '/features', isRoute: true },
    { label: t('nav.howItWorks'), href: '/how-it-works', isRoute: true },
    { label: t('nav.pricing'), href: '/pricing', isRoute: true, badge: t('nav.free') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/get-project.png" alt="Get Project" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Get Project
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                    {link.badge}
                  </span>
                )}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                    {link.badge}
                  </span>
                )}
              </a>
            )
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-6 md:flex">
          <LanguageToggle />
          <Button asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
            <Link to="/login">{t('nav.login')}</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    link.isRoute ? (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-lg font-medium text-foreground"
                      >
                        {link.label}
                        {link.badge && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-lg font-medium text-foreground"
                      >
                        {link.label}
                        {link.badge && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {link.badge}
                          </span>
                        )}
                      </a>
                    )
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild className="w-full">
                    <Link to="/login" onClick={() => setIsOpen(false)}>{t('nav.login')}</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
