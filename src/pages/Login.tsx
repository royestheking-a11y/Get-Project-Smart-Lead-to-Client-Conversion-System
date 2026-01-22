import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, ArrowLeft, Zap } from 'lucide-react';
import { authApi } from '@/lib/backend-api';

export default function Login() {
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
      await authApi.login(email, password);
      await refreshUser();
      toast({
        title: t('login.successTitle'),
        description: t('login.successDesc'),
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: t('login.errorTitle'),
        description: error.message || t('login.errorGeneric'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <div className="flex items-center gap-3 mb-8">
            <img src="/get-project.png" alt="Get Project" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-bold text-white">Get Project</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {t('login.title')}
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            {t('login.subtitle')}
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span>{t('login.feature1')}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span>{t('login.feature2')}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span>{t('login.feature3')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            {t('login.backToHome')}
          </Link>

          <div className="bg-card rounded-2xl border border-border shadow-xl p-8 animate-fade-in">
            {/* Logo - Mobile */}
            <div className="flex flex-col items-center mb-8 lg:hidden">
              <img src="/get-project.png" alt="Get Project" className="w-14 h-14 object-contain mb-4" />
              <h1 className="text-2xl font-bold text-foreground">Get Project</h1>
              <p className="text-muted-foreground text-sm mt-1">{t('login.tagline')}</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('login.welcome')}</h2>
              <p className="text-muted-foreground">{t('login.enterCredentials')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('login.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-semibold"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t('login.loggingIn')}
                  </>
                ) : (
                  t('login.loginBtn')
                )}
              </Button>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
}
