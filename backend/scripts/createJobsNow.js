import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const leadSchema = new mongoose.Schema({ /* simplified */ });
const jobSchema = new mongoose.Schema({ /* simplified */ });

const Lead = mongoose.model('Lead', leadSchema);
const Job = mongoose.model('Job', jobSchema);

const createJobsNow = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find READY leads without jobs
        const readyLeads = await Lead.find({ status: 'READY' });
        console.log(`Found ${readyLeads.length} READY leads\n`);

        for (const lead of readyLeads) {
            // Check if job already exists
            const existingJob = await Job.findOne({
                leadId: lead._id,
                type: 'SEND_EMAIL'
            });

            if (existingJob) {
                console.log(`✓ Lead ${lead.email} already has a job (${existingJob.status})`);
                continue;
            }

            // Create new job
            const job = await Job.create({
                leadId: lead._id,
                campaignId: lead.campaignId,
                type: 'SEND_EMAIL',
                status: 'PENDING',
                scheduledFor: new Date(), // Send immediately
                attempts: 0
            });

            console.log(`✅ Created job for ${lead.email}`);
        }

        console.log('\n🎉 Done! Jobs will be processed in the next 30 seconds.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createJobsNow();
