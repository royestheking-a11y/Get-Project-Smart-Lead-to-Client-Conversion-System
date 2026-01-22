import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background font-sans">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
                    <div className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                        <p>Last updated: January 21, 2026</p>
                        <p>
                            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Interpretation and Definitions</h2>
                        <h3 className="text-lg font-medium text-foreground">Interpretation</h3>
                        <p>
                            The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Collecting and Using Your Personal Data</h2>
                        <h3 className="text-lg font-medium text-foreground">Types of Data Collected</h3>
                        <h4 className="font-medium text-foreground">Personal Data</h4>
                        <p>
                            While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Email address</li>
                            <li>First name and last name</li>
                            <li>Usage Data</li>
                        </ul>

                        <h3 className="text-lg font-medium text-foreground">Use of Your Personal Data</h3>
                        <p>The Company may use Personal Data for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
                            <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
                            <li>To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Security of Your Personal Data</h2>
                        <p>
                            The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                        </p>

                        <h2 className="text-xl font-semibold text-foreground pt-4">Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, You can contact us:</p>
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

export default Privacy;
