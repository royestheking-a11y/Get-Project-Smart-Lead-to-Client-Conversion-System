import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
    const posts = [
        {
            title: 'The Future of Cold Email in 2026',
            excerpt: 'How AI and personalization are reshaping the outreach landscape.',
            author: 'Sarah Johnson',
            date: 'Jan 15, 2026',
            category: 'Strategy',
            readTime: '5 min read',
        },
        {
            title: 'Top 10 Subject Lines That Get Opens',
            excerpt: 'Data-backed analysis of the most effective email subject lines.',
            author: 'Mike Chen',
            date: 'Jan 10, 2026',
            category: 'Tips',
            readTime: '3 min read',
        },
        {
            title: 'Scaling Your Agency with Automation',
            excerpt: 'A guide to using tools to grow your client base without burnout.',
            author: 'Alex Rivera',
            date: 'Jan 05, 2026',
            category: 'Growth',
            readTime: '7 min read',
        },
        {
            title: 'Understanding Email Deliverability',
            excerpt: 'Technical deep dive into SPF, DKIM, and DMARC records.',
            author: 'Tech Team',
            date: 'Dec 28, 2025',
            category: 'Technical',
            readTime: '10 min read',
        },
    ];

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 mb-16 text-center">
                    <Badge variant="outline" className="mb-4 px-3 py-1 text-sm border-primary/20 text-primary bg-primary/5">
                        Our Blog
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Insights & Updates
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Latest news, tips, and strategies for growing your business.
                    </p>
                </section>

                <section className="container mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl">
                    {posts.map((post, index) => (
                        <Card key={index} className="group border-border/50 hover:border-primary/50 transition-colors duration-300">
                            <CardHeader>
                                <div className="flex justify-between items-center mb-2">
                                    <Badge variant="secondary" className="font-medium">{post.category}</Badge>
                                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors text-2xl">
                                    {post.title}
                                </CardTitle>
                                <CardDescription className="text-base mt-2">
                                    {post.excerpt}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        {post.author}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {post.date}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <a href="#" className="text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Read Article <ArrowRight className="w-4 h-4" />
                                </a>
                            </CardFooter>
                        </Card>
                    ))}
                </section>
            </main>
            <LandingFooter />
        </div>
    );
};

export default Blog;
