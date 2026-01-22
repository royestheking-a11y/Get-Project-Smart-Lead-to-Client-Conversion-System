import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, ArrowRight, Zap, CheckCircle2, Sparkles } from 'lucide-react';
import { authApi } from '@/lib/backend-api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.register(name, email, password);
      await refreshUser();
      toast({
        title: t('signup.successTitle'),
        description: "Account created successfully!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: t('signup.errorTitle'),
        description: error.message || t('signup.errorGeneric'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    t('signup.benefit1'),
    t('signup.benefit2'),
    t('signup.benefit3'),
    t('signup.benefit4'),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 order-2 lg:order-1">
          <div className="w-full max-w-md">
            {/* Logo & Back Link */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Get Project</span>
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {t('signup.alreadyHaveAccount')}
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mb-4">
                <Sparkles className="h-3 w-3" />
                {t('signup.badge')}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('signup.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('signup.subtitle')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">{t('signup.name')}</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('signup.namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('signup.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('signup.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('signup.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-background"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-semibold gap-2"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('signup.creating')}
                  </>
                ) : (
                  <>
                    {t('signup.createAccount')}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {t('signup.terms1')}{' '}
              <a href="#" className="text-primary hover:underline">{t('signup.termsLink')}</a>{' '}
              {t('signup.terms2')}{' '}
              <a href="#" className="text-primary hover:underline">{t('signup.privacyLink')}</a>
            </p>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/90 p-8 lg:p-16 flex items-center order-1 lg:order-2">
          <div className="w-full max-w-lg mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">
              {t('signup.benefitsTitle')}
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              {t('signup.benefitsSubtitle')}
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-primary-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-white/30 border-2 border-primary" />
                  ))}
                </div>
                <span className="text-primary-foreground/80 text-sm">
                  {t('signup.joinedUsers')}
                </span>
              </div>
              <p className="text-primary-foreground text-sm italic">
                "{t('signup.testimonial')}"
              </p>
              <p className="text-primary-foreground/70 text-sm mt-2">
                — {t('signup.testimonialAuthor')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
