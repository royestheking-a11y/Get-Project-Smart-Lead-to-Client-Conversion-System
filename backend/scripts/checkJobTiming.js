import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Environment setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Job Schema
const jobSchema = new mongoose.Schema({
    type: String, // 'SEND_EMAIL'
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    status: String, // 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
    runAt: Date
});
const Job = mongoose.model('Job', jobSchema);

const checkTiming = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const jobs = await Job.find({ status: 'PENDING' });
        console.log(`Found ${jobs.length} PENDING jobs:`);

        const now = new Date();
        console.log(`Current Server Time (UTC): ${now.toISOString()}`);
        console.log(`Current Server Time (Local): ${now.toString()}\n`);

        jobs.forEach(job => {
            console.log(`Job ID: ${job._id}`);
            console.log(`  RunAt: ${job.runAt.toISOString()} (${job.runAt.toString()})`);
            const diff = job.runAt - now;
            const hours = Math.floor(diff / 1000 / 60 / 60);
            const mins = Math.floor((diff / 1000 / 60) % 60);

            if (diff > 0) {
                console.log(`  Status: WAITING (Scheduled in ${hours}h ${mins}m)`);
            } else {
                console.log(`  Status: OVERDUE (Should have run ${Math.abs(hours)}h ${Math.abs(mins)}m ago)`);
            }
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkTiming();
