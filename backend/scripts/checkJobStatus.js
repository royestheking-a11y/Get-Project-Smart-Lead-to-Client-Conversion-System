import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const jobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model('Job', jobSchema);

const checkJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const pendingJobs = await Job.find({ status: 'PENDING' }).limit(10);
        console.log(`Found ${pendingJobs.length} PENDING jobs:\n`);

        for (const job of pendingJobs) {
            console.log(`Job ID: ${job._id}`);
            console.log(`  Lead: ${job.leadId}`);
            console.log(`  Type: ${job.type}`);
            console.log(`  Status: ${job.status}`);
            console.log(`  Scheduled: ${job.scheduledFor}`);
            console.log(`  Attempts: ${job.attempts}\n`);
        }

        const runningJobs = await Job.find({ status: 'RUNNING' }).limit(10);
        console.log(`Found ${runningJobs.length} RUNNING jobs:\n`);

        for (const job of runningJobs) {
            console.log(`Job ID: ${job._id}`);
            console.log(`  Lead: ${job.leadId}`);
            console.log(`  Status: ${job.status}`);
            console.log(`  Attempts: ${job.attempts}`);
            console.log(`  Last attempt: ${job.lastAttemptAt}\n`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkJobs();
