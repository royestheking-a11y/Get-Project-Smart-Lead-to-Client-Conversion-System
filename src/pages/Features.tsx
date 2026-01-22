import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import FeaturesGrid from '@/components/landing/FeaturesGrid';

const Features = () => {
    return (
        <div className="min-h-screen bg-background">
            <LandingNavbar />
            <main className="pt-20">
                <FeaturesGrid />
            </main>
            <LandingFooter />
        </div>
    );
};

export default Features;
