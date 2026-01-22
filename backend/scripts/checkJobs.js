import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';
import Campaign from '../models/Campaign.js';
import Lead from '../models/Lead.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const checkJobs = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected\n');

        const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(20);

        console.log('=== JOBS CHECK ===\n');
        console.log(`Total jobs: ${jobs.length}\n`);

        if (jobs.length === 0) {
            console.log('⚠️  NO JOBS FOUND!');
            console.log('This means the Play button did not create any jobs.');
            console.log('\nPossible reasons:');
            console.log('1. Leads are not in READY status');
            console.log('2. Daily limit already reached');
            console.log('3. Frontend did not call /api/send/start correctly\n');
        } else {
            const statusCounts = {};
            jobs.forEach(j => {
                statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
            });

            console.log('Job Status Summary:');
            Object.entries(statusCounts).forEach(([status, count]) => {
                console.log(`  ${status}: ${count}`);
            });

            console.log('\nRecent Jobs:');
            jobs.slice(0, 5).forEach(j => {
                console.log(`  - ${j.type} | Status: ${j.status} | Run at: ${j.runAt}`);
            });

            const pendingJobs = jobs.filter(j => j.status === 'PENDING');
            if (pendingJobs.length > 0) {
                console.log(`\n✅ ${pendingJobs.length} jobs waiting to be processed`);
                console.log('Starting background worker...');
            }
        }

        // Check leads
        const leads = await Lead.find({});
        console.log(`\n=== LEADS ===`);
        console.log(`Total: ${leads.length}`);
        leads.forEach(l => {
            console.log(`  - ${l.email} | Status: ${l.status} | Category: ${l.category}`);
        });

        // Check campaign
        const campaigns = await Campaign.find({});
        console.log(`\n=== CAMPAIGNS ===`);
        campaigns.forEach(c => {
            console.log(`  - ${c.name} | Status: ${c.status} | Daily limit: ${c.dailyLimit}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkJobs();
