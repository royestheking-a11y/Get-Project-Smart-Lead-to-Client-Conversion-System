import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const campaignSchema = new mongoose.Schema({}, { strict: false });
const Campaign = mongoose.model('Campaign', campaignSchema);

const fixCampaigns = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find ALL campaigns
        const allCampaigns = await Campaign.find({});
        console.log(`Found ${allCampaigns.length} total campaigns:\n`);

        for (const campaign of allCampaigns) {
            console.log(`Campaign: ${campaign.name}`);
            console.log(`  Status: ${campaign.status}`);
            console.log(`  Window: ${campaign.sendingWindowStart} - ${campaign.sendingWindowEnd}\n`);
        }

        // Activate all campaigns and set 24-hour sending window
        const result = await Campaign.updateMany(
            {},
            {
                $set: {
                    status: 'ACTIVE',
                    sendingWindowStart: '00:00',
                    sendingWindowEnd: '23:59'
                }
            }
        );

        console.log(`✅ Updated ${result.modifiedCount} campaigns:`);
        console.log('  - Status: ACTIVE');
        console.log('  - Sending window: 00:00 - 23:59 (24 hours)\n');

        const updatedCampaigns = await Campaign.find({ status: 'ACTIVE' });
        console.log(`Now have ${updatedCampaigns.length} active campaigns ready to send!`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixCampaigns();
