import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Briefcase } from 'lucide-react';

const Careers = () => {
    const positions = [
        {
            title: 'Senior Frontend Engineer',
            department: 'Engineering',
            location: 'Remote',
            type: 'Full-time',
        },
        {
            title: 'Product Marketing Manager',
            department: 'Marketing',
            location: 'New York / Remote',
            type: 'Full-time',
        },
        {
            title: 'Customer Success Specialist',
            department: 'Support',
            location: 'London / Remote',
            type: 'Full-time',
        },
    ];

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 mb-20 text-center">
                    <Badge variant="outline" className="mb-4 px-3 py-1 text-sm border-primary/20 text-primary bg-primary/5">
                        Join the Team
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        Build the future of <br />
                        <span className="text-primary">outreach automation</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        We're a remote-first team passionate about helping businesses grow. Join us in making lead generation smarter and more human.
                    </p>
                    <Button size="lg" className="shadow-lg shadow-primary/20">
                        View Open Roles
                    </Button>
                </section>

                <section className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
                    <div className="space-y-4">
                        {positions.map((job, index) => (
                            <div
                                key={index}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card border border-border/50 rounded-xl hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            {job.department}
                                        </span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                        <span>•</span>
                                        <span>{job.type}</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
};

export default Careers;
