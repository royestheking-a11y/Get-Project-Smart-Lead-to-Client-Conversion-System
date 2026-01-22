import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const Terms = () => {
    return (
        <div className="min-h-screen bg-background font-sans">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
                    <div className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                        <p>Last updated: January 21, 2026</p>
                        <p>
                            Please read these terms and conditions carefully before using Our Service.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Acknowledgment</h2>
                        <p>
                            These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                        </p>
                        <p>
                            Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">User Accounts</h2>
                        <p>
                            When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
                        </p>
                        <p>
                            You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Intellectual Property</h2>
                        <p>
                            The Service and its original content (excluding Content provided by You or other users), features and functionality are and will remain the exclusive property of the Company and its licensors.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Termination</h2>
                        <p>
                            We may terminate or suspend Your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                        </p>
                        <p>
                            Upon termination, Your right to use the Service will cease immediately. If You wish to terminate Your Account, You may simply discontinue using the Service.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Changes to These Terms and Conditions</h2>
                        <p>
                            We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
                        <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>By email: support@getproject.com</li>
                        </ul>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
};

export default Terms;
