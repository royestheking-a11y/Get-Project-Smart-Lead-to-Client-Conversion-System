import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const jobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model('Job', jobSchema);

const checkAllJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const allJobs = await Job.find({}).sort({ createdAt: -1 }).limit(10);
        console.log(`Found ${allJobs.length} total jobs (latest 10):\n`);

        for (const job of allJobs) {
            console.log(`Job ID: ${job._id}`);
            console.log(`  Lead: ${job.leadId}`);
            console.log(`  Type: ${job.type}`);
            console.log(`  Status: ${job.status}`);
            console.log(`  Scheduled: ${job.scheduledFor}`);
            console.log(`  Attempts: ${job.attempts}`);
            console.log(`  Last Error: ${job.lastError}`);
            console.log(`  Created: ${job.createdAt}`);
            console.log(`  Updated: ${job.updatedAt}\n`);
        }

        const statusCounts = await Job.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        console.log('Jobs by status:');
        statusCounts.forEach(s => console.log(`  ${s._id}: ${s.count}`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAllJobs();
