import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EmailLog from '../models/EmailLog.js';
import Job from '../models/Job.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const checkEmailLogs = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected\n');

        const logs = await EmailLog.find({}).sort({ sentAt: -1 }).limit(10);
        const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(10);

        console.log('=== EMAIL LOGS ===');
        console.log(`Total: ${logs.length}\n`);

        if (logs.length === 0) {
            console.log('⚠️  No email logs yet - emails haven\'t been sent\n');
        } else {
            logs.forEach(log => {
                console.log(`To: ${log.leadId}`);
                console.log(`Subject: ${log.subject}`);
                console.log(`Status: ${log.status}`);
                console.log(`Sent at: ${log.sentAt}`);
                console.log(`Provider ID: ${log.providerMessageId || 'N/A'}`);
                console.log('');
            });
        }

        console.log('=== JOBS STATUS ===');
        console.log(`Total jobs: ${jobs.length}\n`);

        const statusCounts = {};
        jobs.forEach(j => {
            statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
        });

        Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`  ${status}: ${count}`);
        });

        if (jobs.length > 0) {
            console.log('\nRecent jobs:');
            jobs.slice(0, 3).forEach(j => {
                console.log(`  - ${j.type} | Status: ${j.status} | Run at: ${j.runAt}`);
                if (j.lastError) console.log(`    Error: ${j.lastError}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkEmailLogs();
