import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const campaignSchema = new mongoose.Schema({}, { strict: false });
const Campaign = mongoose.model('Campaign', campaignSchema);

const checkCampaign = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const campaigns = await Campaign.find({ status: 'ACTIVE' });
        console.log(`Found ${campaigns.length} active campaigns:\n`);

        for (const campaign of campaigns) {
            console.log(`Campaign: ${campaign.name}`);
            console.log(`  Status: ${campaign.status}`);
            console.log(`  Daily limit: ${campaign.dailyLimit}`);
            console.log(`  Sending window: ${campaign.sendingWindowStart} - ${campaign.sendingWindowEnd}`);
            console.log(`  Created: ${campaign.createdAt}\n`);
        }

        // Check current time vs sending window
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

        console.log(`Current time: ${currentTime}`);
        console.log(`Current date: ${now.toISOString()}\n`);

        for (const campaign of campaigns) {
            const inWindow = currentTime >= campaign.sendingWindowStart && currentTime <= campaign.sendingWindowEnd;
            console.log(`Campaign "${campaign.name}" - Currently in sending window: ${inWindow ? '✅ YES' : '❌ NO'}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkCampaign();
