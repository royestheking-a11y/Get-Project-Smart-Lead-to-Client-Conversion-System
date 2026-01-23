// Script to reset stuck RUNNING jobs to PENDING
// Run with: node backend/scripts/resetStuckJobs.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';

dotenv.config({ path: './backend/.env' });

const resetStuckJobs = async () => {
    try {
        console.log('🔄 RESETTING STUCK JOBS...\n');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find jobs stuck in RUNNING state
        // We assume any job running for more than 5 minutes is stuck
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        // Actually, let's just reset ALL running jobs because the worker is likely restarted
        // and we want to retry everything.
        const runningJobs = await Job.find({ status: 'RUNNING' });
        console.log(`Found ${runningJobs.length} jobs in RUNNING status.`);

        if (runningJobs.length > 0) {
            const result = await Job.updateMany(
                { status: 'RUNNING' },
                {
                    $set: {
                        status: 'PENDING',
                        // Reset runAt to now so they are picked up immediately
                        runAt: new Date()
                    },
                    $inc: { attempts: 0 } // Don't increment attempts yet, let it retry freely
                }
            );

            console.log(`✅ Reset ${result.modifiedCount} stuck jobs to PENDING.`);
            console.log('   These jobs will be picked up by the worker immediately.');
        } else {
            console.log('✅ No stuck jobs found.');
        }

        await mongoose.disconnect();
        console.log('\n✅ Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetStuckJobs();
