import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, Users, Globe, Award } from 'lucide-react';

const About = () => {
    const { t } = useLanguage();

    const stats = [
        { label: 'Active Users', value: '10K+', icon: Users },
        { label: 'Countries', value: '50+', icon: Globe },
        { label: 'Emails Sent', value: '1M+', icon: Zap },
        { label: 'Awards Won', value: '5', icon: Award },
    ];

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="container mx-auto px-4 mb-20 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
                        About Get Project
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in [animation-delay:200ms]">
                        We're on a mission to <br />
                        <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                            democratize lead generation
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in [animation-delay:400ms]">
                        Get Project helps freelancers and agencies grow their business through automated, intelligent outreach that feels personal.
                    </p>
                </section>

                {/* Stats Grid */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center p-6 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${600 + index * 100}ms` }}
                            >
                                <div className="p-3 bg-primary/10 rounded-xl mb-4 text-primary">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Story Section */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="max-w-4xl mx-auto bg-muted/30 rounded-3xl p-8 md:p-12 border border-border/50">
                        <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                Founded in 2026, Get Project started with a simple observation: talented freelancers and agencies were spending more time chasing leads than doing what they love.
                            </p>
                            <p>
                                We believed there had to be a better way. A way that combined the efficiency of automation with the authenticity of personal connection.
                            </p>
                            <p>
                                Today, we're proud to support thousands of professionals worldwide, helping them build sustainable businesses by automating the most tedious part of their workflow: finding new clients.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
};

export default About;
