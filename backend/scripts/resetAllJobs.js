import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const jobSchema = new mongoose.Schema({
    leadId: mongoose.Schema.Types.ObjectId,
    campaignId: mongoose.Schema.Types.ObjectId,
    type: String,
    status: String,
    attempts: Number,
    scheduledFor: Date,
    lastAttemptAt: Date
});

const Job = mongoose.model('Job', jobSchema);

const resetAllJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all RUNNING jobs
        const runningJobs = await Job.find({ status: 'RUNNING' });
        console.log(`Found ${runningJobs.length} jobs stuck in RUNNING state\n`);

        if (runningJobs.length === 0) {
            console.log('No jobs to reset. All good!');
            process.exit(0);
        }

        // Reset them to PENDING
        const result = await Job.updateMany(
            { status: 'RUNNING' },
            {
                $set: {
                    status: 'PENDING',
                    scheduledFor: new Date() // Schedule immediately
                }
            }
        );

        console.log(`✅ Reset ${result.modifiedCount} jobs from RUNNING to PENDING`);
        console.log('These jobs will be picked up by the cron worker in the next 30 seconds.\n');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAllJobs();
