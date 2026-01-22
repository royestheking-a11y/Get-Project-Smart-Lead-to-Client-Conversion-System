import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import HowItWorksSection from '@/components/landing/HowItWorks';

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-background">
            <LandingNavbar />
            <main className="pt-20">
                <HowItWorksSection />
            </main>
            <LandingFooter />
        </div>
    );
};

export default HowItWorks;
