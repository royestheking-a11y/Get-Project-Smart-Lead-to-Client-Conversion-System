import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Lead from '../models/Lead.js';
import Campaign from '../models/Campaign.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkStatus = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Overall Status Counts
        const statusCounts = await Lead.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        console.log('\n--- Lead Status Summary ---');
        statusCounts.forEach(s => console.log(`${s._id || 'NULL'}: ${s.count}`));

        // 2. Campaign Breakdown
        const campaigns = await Campaign.find({});
        console.log('\n--- Campaign Breakdown ---');

        for (const camp of campaigns) {
            const leads = await Lead.countDocuments({ campaignId: camp._id });
            const ready = await Lead.countDocuments({ campaignId: camp._id, status: 'READY' });
            const sent = await Lead.countDocuments({ campaignId: camp._id, status: 'SENT' });
            const imported = await Lead.countDocuments({ campaignId: camp._id, status: 'IMPORTED' });

            console.log(`Campaign: "${camp.name}" (${camp.status})`);
            console.log(`  Total: ${leads}`);
            console.log(`  Imported: ${imported}`);
            console.log(`  Ready: ${ready}`);
            console.log(`  Sent: ${sent}`);
            console.log('-------------------');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkStatus();
