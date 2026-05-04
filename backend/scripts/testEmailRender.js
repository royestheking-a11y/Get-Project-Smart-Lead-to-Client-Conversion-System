// Test script for email rendering with new placeholders
import { renderTemplate } from '../services/emailRenderService.js';

const lead = {
    firstName: 'Sunny',
    companyName: 'ABC Store',
    website: 'www.abcstore.com',
    location: 'Dhaka',
    industry: 'Retail'
};

const template = {
    subjectTemplate: 'Boost your business presence: {{Business Name}}',
    bodyTemplate: `Hello {{Owner Name}},

I came across {{Business Name}} in {{City}} and noticed your website {{Website}} for {{Service Type}} could be improved.`
};

const senderProfile = {
    name: 'Aurangzeb Sunny',
    company: 'RizQara Tech',
    whatsapp: '+880 1343-042761',
    portfolioLink: 'www.rizqara.tech'
};

const result = renderTemplate(template, lead, senderProfile);

console.log('--- SUBJECT ---');
console.log(result.subject);
console.log('\n--- TEXT BODY ---');
console.log(result.text);
