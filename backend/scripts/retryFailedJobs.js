import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const jobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model('Job', jobSchema);

const retryFailedJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Reset both FAILED and RUNNING (stuck) jobs
        const result = await Job.updateMany(
            { status: { $in: ['FAILED', 'RUNNING'] } },
            {
                $set: {
                    status: 'PENDING',
                    attempts: 0,
                    lastError: null,
                    scheduledFor: new Date() // Reschedule for now
                }
            }
        );

        console.log(`✅ Reset ${result.modifiedCount} failed/stuck jobs to PENDING.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

retryFailedJobs();
