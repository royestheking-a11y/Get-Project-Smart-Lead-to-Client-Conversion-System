import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import EmailTemplate from '../models/EmailTemplate.js';
import Campaign from '../models/Campaign.js';

const premiumTemplates = [
    {
        name: 'Premium: Restaurant / Cafe',
        category: 'RESTAURANT',
        subjectTemplate: 'Digital Growth for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

{{Smart Summary}}

For restaurants, cafes, and takeaways, customers often check online before visiting or ordering. A professional website, digital menu, online ordering system, Google ranking, and social media content can make a big difference in getting more customers.

At **Rizqara Tech**, we help food businesses with:

Restaurant websites
Online food ordering systems
Digital menu pages
Table booking systems
Delivery/order management
Google SEO and local search optimization
Facebook and Instagram marketing
Branding, banners, posters, and menu design
Custom software and POS solutions

We also provide **custom website, software, web application, SaaS, and POS development** based on your business needs.

For selected businesses, we are offering a **20% discount**.

We can prepare a **free demo design or website preview** for {{Business Name}} first. If you like it, then we can move forward.

Would you be open to seeing a free demo concept?

Best regards,
Rizqara Tech
Build Smart. Grow Fast.
[www.rizqara.tech](http://www.rizqara.tech)`
    },
    {
        name: 'Premium: Salon / Beauty',
        category: 'SALON',
        subjectTemplate: 'Professional Online Presence for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

{{Smart Summary}}

For salons, parlours, and beauty businesses, customers usually check photos, service lists, prices, reviews, and booking options before choosing where to go. A modern website and strong social media presence can help increase trust and bring more bookings.

At **Rizqara Tech**, we provide:

Premium salon and beauty business websites
Online appointment booking systems
Service and pricing pages
Portfolio/gallery sections
SEO and Google ranking support
Social media content creation
Facebook and Instagram ads
Brand identity, posters, banners, and graphic design
Custom business software and web applications

We can also build advanced systems like **booking dashboards, customer management tools, SaaS platforms, and POS systems**.

We are currently offering a **20% discount** for selected businesses.

Before starting, we can create a **free demo preview** for your business. If you like the concept, then we can continue.

Would you like us to prepare a free demo for {{Business Name}}?

Best regards,
Rizqara Tech
Build Smart. Grow Fast.
[www.rizqara.tech](http://www.rizqara.tech)`
    },
    {
        name: 'Premium: Retail / Shops',
        category: 'SHOP',
        subjectTemplate: 'Boost your business presence: {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

{{Smart Summary}}

Many local shops lose customers because they either do not have a professional website, or their current online presence does not clearly show their products, location, offers, and contact options in a user-friendly way.

At **Rizqara Tech**, we help businesses build a complete digital presence, including:

Website design and development
Custom web applications
Product catalogue websites
POS and inventory systems
SEO and Google ranking support
Social media content creation
Branding, posters, banners, and graphic design
Digital marketing campaigns

We are currently offering a **20% discount** for selected businesses.

Also, we can create a **free demo preview** for your business first. If you like the design and idea, then we can continue with the full project.

Would you like us to send a free demo concept for {{Business Name}}?

Best regards,
Rizqara Tech
Build Smart. Grow Fast.
[www.rizqara.tech](http://www.rizqara.tech)`
    },
    {
        name: 'Premium: E-commerce',
        category: 'ECOMMERCE',
        subjectTemplate: 'Boost Sales for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

I visited your online store {{Business Name}} and wanted to reach out.

In e-commerce, user experience and conversion optimization are key to growth. We help brands like yours with:

- Shopify/WooCommerce optimization
- Conversion rate improvement
- Product page design
- Digital marketing and social media ads
- SEO for products

We are currently offering a **20% discount** and a **free website audit**.

Would you like us to prepare a free audit for {{Business Name}}?

Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: Healthcare / Clinic',
        category: 'HEALTHCARE',
        subjectTemplate: 'Digital Solutions for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

I found {{Business Name}} online and wanted to share a professional idea.

In healthcare, trust is very important. Patients often search online before choosing a doctor, clinic, or hospital. A clean, professional, and user-friendly website can help patients understand your services, doctors, appointment process, and contact information more easily.

At **Rizqara Tech**, we help healthcare businesses with:

Doctor portfolio websites
Clinic and hospital websites
Online appointment systems
Digital prescription modules
Patient management systems
Hospital management software
SEO and Google local ranking
Social media content creation
Branding, banners, posters, and graphic design
Custom web applications and SaaS systems

We are currently offering a **20% discount** for selected healthcare businesses.

We can also create a **free demo preview** first, so you can see how your digital presence could look before making any decision.

Would you like us to prepare a free demo concept for {{Business Name}}?

Best regards,
Rizqara Tech
Build Smart. Grow Fast.
[www.rizqara.tech](http://www.rizqara.tech)`
    },
    {
        name: 'Premium: Education',
        category: 'EDUCATION',
        subjectTemplate: 'Digital Solutions for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

I came across {{Business Name}} and noticed your educational institution could benefit from a stronger digital presence.

We help schools, academies, and coaching centers with:

- Professional websites
- Student management systems
- Online course platforms
- Digital marketing for admissions

We are currently offering a **20% discount** and a **free demo preview**.

Would you like us to prepare a free demo for your institution?

Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: Fitness / Gym',
        category: 'FITNESS',
        subjectTemplate: 'Grow {{Business Name}} with Rizqara Tech',
        bodyTemplate: `Hello {{Owner Name}},

I found {{Business Name}} and noticed you have a great fitness community!

We help gyms and fitness studios attract more members through:

- Modern fitness websites
- Booking and membership systems
- Social media content creation
- Local SEO to find nearby clients

We are currently offering a **20% discount** and a **free demo preview**.

Would you like us to prepare a free demo for {{Business Name}}?

Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: Personal Portfolio',
        category: 'PORTFOLIO',
        subjectTemplate: 'Professional Portfolio for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

I came across your work at {{Business Name}} and was impressed!

As a professional, your portfolio is your first impression. We help creators and consultants build premium personal brands through:

- Stunning portfolio websites
- Personal branding and identity
- SEO for your name/brand

We are currently offering a **20% discount** and a **free demo preview**.

Would you like us to prepare a free demo for your portfolio?

Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: Real Estate',
        category: 'REAL_ESTATE',
        subjectTemplate: 'Digital Edge for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

I found {{Business Name}} and wanted to share how we help real estate businesses stand out.

We specialize in:

- Property listing websites
- Lead generation systems
- Virtual tour integrations
- Local SEO for property searches

We are currently offering a **20% discount** and a **free demo preview**.

Would you like us to prepare a free demo for {{Business Name}}?

Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: Agency',
        category: 'AGENCY',
        subjectTemplate: 'Scaling {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

I came across {{Business Name}} and love what you're doing in the agency space.

We partner with agencies to provide white-label development, custom software, and technical SEO support to help you scale faster.

We are currently offering a **20% discount** on our partnership plans.

Would you like to discuss a potential collaboration?

Best regards,
Rizqara Tech`
    },
    {
        name: 'Premium: General / E-commerce',
        category: 'GENERAL',
        subjectTemplate: 'Grow {{Business Name}} with Rizqara Tech',
        bodyTemplate: `Hello {{Owner Name}},

I came across {{Business Name}} and wanted to reach out from **Rizqara Tech**.

We help businesses, institutions, professionals, and entrepreneurs build a strong digital presence through modern websites, custom software, SEO, digital marketing, and branding.

If your business does not have a website yet, or if your current website does not look modern, mobile-friendly, fast, or user-friendly, we can help you improve it professionally.

Our services include:

Business websites
E-commerce websites
Educational institution websites
Personal portfolio websites
Custom software development
Web applications and SaaS platforms
POS and management systems
SEO and Google ranking
Digital marketing
Social media content creation
Branding and identity design
Banner ads, posters, and graphic design

We are currently offering a **20% discount** for selected clients.

Also, we can create a **free demo preview** first. If you like the design, features, and strategy, then we can continue with the full project.

Would you like us to send a free demo idea for {{Business Name}}?

Best regards,
Rizqara Tech
Build Smart. Grow Fast.
[www.rizqara.tech](http://www.rizqara.tech)`
    },
    {
        name: 'Premium: SEO Audit',
        category: 'SEO',
        subjectTemplate: 'SEO Growth for {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

I came across {{Business Name}} and noticed that your business has strong potential to get more customers from Google.

Today, many customers search online before choosing a shop, restaurant, salon, clinic, service provider, or ecommerce brand. If your business is not ranking properly on Google, you may be missing valuable leads, calls, bookings, and sales.

At **Rizqara Tech**, we help businesses improve their online visibility through professional SEO and digital growth strategies.

Our SEO services include:

Website SEO audit
Keyword research
On-page SEO optimization
Technical SEO fixes
Google Business Profile optimization
Local SEO for nearby customers
Competitor analysis
Content planning
Blog and landing page strategy
Speed and mobile optimization
Monthly SEO reporting
SEO-friendly website improvement

We are currently offering a **20% discount** for selected businesses.

We can also provide a **free SEO audit/demo report** first, where we show what can be improved for {{Business Name}}. If you like our strategy, then we can continue with the full SEO plan.

Would you like us to prepare a free SEO audit for your business?

Best regards,
Rizqara Tech
Build Smart. Grow Fast.
[www.rizqara.tech](http://www.rizqara.tech)`
    },
    {
        name: 'Premium: Follow-up',
        category: 'FOLLOWUP',
        subjectTemplate: 'Following up: {{Business Name}}',
        bodyTemplate: `Hello {{Owner Name}},

Just following up in case my previous email got missed.

We can prepare a free demo preview for {{Business Name}}, showing how your website, branding, or digital system could look.

There is no commitment. If you like the demo, then we can discuss the full project with our current 20% discount.

Best regards,
Rizqara Tech
[www.rizqara.tech](http://www.rizqara.tech)`
    }
];

const updateAllTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const campaigns = await Campaign.find();
        console.log(`Found ${campaigns.length} campaigns to update.\n`);

        for (const campaign of campaigns) {
            console.log(`Updating templates for campaign: ${campaign.name || campaign._id}`);
            
            // Delete existing templates for this campaign
            await EmailTemplate.deleteMany({ campaignId: campaign._id });
            
            // Add new premium templates
            for (const template of premiumTemplates) {
                await EmailTemplate.create({
                    ...template,
                    campaignId: campaign._id
                });
            }
            console.log(`   ✅ Successfully updated templates for: ${campaign.name || campaign._id}`);
        }

        console.log('\n🎉 All campaigns have been updated with premium templates!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateAllTemplates();
