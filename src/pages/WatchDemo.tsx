import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Play, Clock, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function WatchDemo() {
  const { t } = useLanguage();

  const demoVideos = [
    {
      id: 1,
      title: t('demo.video1.title'),
      description: t('demo.video1.desc'),
      duration: '4:32',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=340&fit=crop',
      category: t('demo.category.gettingStarted'),
    },
    {
      id: 2,
      title: t('demo.video2.title'),
      description: t('demo.video2.desc'),
      duration: '6:15',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop',
      category: t('demo.category.import'),
    },
    {
      id: 3,
      title: t('demo.video3.title'),
      description: t('demo.video3.desc'),
      duration: '8:45',
      thumbnail: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&h=340&fit=crop',
      category: t('demo.category.templates'),
    },
    {
      id: 4,
      title: t('demo.video4.title'),
      description: t('demo.video4.desc'),
      duration: '5:20',
      thumbnail: 'https://images.unsplash.com/photo-1553484771-047a44eee27a?w=600&h=340&fit=crop',
      category: t('demo.category.automation'),
    },
    {
      id: 5,
      title: t('demo.video5.title'),
      description: t('demo.video5.desc'),
      duration: '7:10',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop',
      category: t('demo.category.ai'),
    },
    {
      id: 6,
      title: t('demo.video6.title'),
      description: t('demo.video6.desc'),
      duration: '6:55',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=340&fit=crop',
      category: t('demo.category.analytics'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Get Project</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('login.backToHome')}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Play className="h-4 w-4" />
            {t('demo.badge')}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl mb-6">
            {t('demo.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('demo.subtitle')}
          </p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {demoVideos.map((video) => (
              <div
                key={video.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                      <Play className="h-7 w-7 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                      {video.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                      <Clock className="h-3 w-3" />
                      {video.duration}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State for Adding Videos */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center p-12 rounded-2xl border-2 border-dashed border-border">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t('demo.addVideosTitle')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('demo.addVideosDesc')}
            </p>
            <Button variant="outline" asChild>
              <Link to="/signup">{t('nav.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary rounded-t-3xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            {t('demo.readyToStart')}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {t('demo.readyDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">{t('demo.getStartedFree')}</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/pricing">{t('nav.pricing')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
