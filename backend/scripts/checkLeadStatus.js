import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const checkLeads = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected\n');

        const leads = await Lead.find({});

        console.log('=== LEAD STATUS CHECK ===\n');
        leads.forEach(l => {
            console.log(`${l.email}`);
            console.log(`  Status: ${l.status}`);
            console.log(`  Category: ${l.category || 'NULL - NOT CATEGORIZED!'}`);
            console.log(`  Ready to send: ${l.status === 'READY' && l.category ? 'YES' : 'NO - needs categorization'}`);
            console.log('');
        });

        const readyCount = leads.filter(l => l.status === 'READY' && l.category).length;
        const needsCategorization = leads.filter(l => !l.category).length;

        console.log(`\n=== SUMMARY ===`);
        console.log(`Total leads: ${leads.length}`);
        console.log(`Ready to send: ${readyCount}`);
        console.log(`Need categorization: ${needsCategorization}`);

        if (needsCategorization > 0) {
            console.log(`\n⚠️  ACTION REQUIRED: Categorize leads before sending!`);
            console.log(`Go to Leads page → Select campaign → Click "Categorize Leads"`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkLeads();
