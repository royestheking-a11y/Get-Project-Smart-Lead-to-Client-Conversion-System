// Cleanup script to fix leads stuck in READY status despite having failed
// Run this with: node backend/scripts/fixInconsistentLeads.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import EmailLog from '../models/EmailLog.js';
import Job from '../models/Job.js';

dotenv.config({ path: './backend/.env' });

const fixInconsistentLeads = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all leads that are in READY status
        const readyLeads = await Lead.find({ status: 'READY' });
        console.log(`Found ${readyLeads.length} leads in READY status\n`);

        let fixed = 0;
        let alreadyCorrect = 0;

        for (const lead of readyLeads) {
            // Check if this lead has any FAILED jobs
            const failedJobs = await Job.countDocuments({
                leadId: lead._id,
                status: 'FAILED'
            });

            // Check if this lead has failed email logs
            const failedLogs = await EmailLog.countDocuments({
                leadId: lead._id,
                status: { $in: ['failed', 'bounced'] }
            });

            if (failedJobs > 0 || failedLogs > 0) {
                // This lead should be FAILED, not READY
                console.log(`❌ Inconsistent lead found:`);
                console.log(`   Email: ${lead.email}`);
                console.log(`   Current status: ${lead.status}`);
                console.log(`   Failed jobs: ${failedJobs}`);
                console.log(`   Failed logs: ${failedLogs}`);

                lead.status = 'FAILED';
                await lead.save();

                console.log(`   ✅ Fixed: updated to FAILED\n`);
                fixed++;
            } else {
                alreadyCorrect++;
            }
        }

        console.log('\n=== Summary ===');
        console.log(`Total READY leads checked: ${readyLeads.length}`);
        console.log(`✅ Fixed inconsistent leads: ${fixed}`);
        console.log(`✓ Already correct: ${alreadyCorrect}`);

        await mongoose.disconnect();
        console.log('\n✅ Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixInconsistentLeads();
