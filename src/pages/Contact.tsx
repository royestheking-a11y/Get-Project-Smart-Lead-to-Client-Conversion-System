import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Form submitted');
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 mb-20 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
                        Contact Support
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in [animation-delay:200ms]">
                        We're here to <span className="text-primary">help</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in [animation-delay:400ms]">
                        Have a question, suggestion, or just want to say hello? We'd love to hear from you.
                    </p>
                </section>

                <section className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 max-w-6xl">
                    {/* Contact Info */}
                    <div className="space-y-8 animate-fade-in [animation-delay:600ms]">
                        <h2 className="text-2xl font-bold">Get in touch</h2>
                        <p className="text-muted-foreground">
                            Fill out the form and our team will get back to you within 24 hours.
                        </p>

                        <div className="grid gap-6">
                            <Card className="border-border/50 bg-card hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Email</CardTitle>
                                        <CardDescription>Our friendly team is here to help.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <a href="mailto:support@getproject.com" className="text-primary font-medium hover:underline">
                                        getproject.org@gmail.com
                                    </a>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Live Chat</CardTitle>
                                        <CardDescription>Chat with us in real-time.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground font-medium">
                                        Available Mon-Fri, 9am-6pm PST
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 bg-card hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Office</CardTitle>
                                        <CardDescription>Come say hello at our HQ.</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground font-medium">
                                        18 No Road Dhaka, Bangladesh
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="animate-fade-in [animation-delay:800ms]">
                        <Card className="border-border/50 shadow-lg">
                            <CardHeader>
                                <CardTitle>Send us a message</CardTitle>
                                <CardDescription>You'll hear from us sooner than you think.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                                            <Input id="first-name" placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                                            <Input id="last-name" placeholder="Doe" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                                        <Input id="email" type="email" placeholder="john@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                                        <Input id="subject" placeholder="How can we help?" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                                        <Textarea id="message" placeholder="Leave us a message..." className="min-h-[120px]" required />
                                    </div>
                                    <Button type="submit" className="w-full">Send Message</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
};

export default Contact;
