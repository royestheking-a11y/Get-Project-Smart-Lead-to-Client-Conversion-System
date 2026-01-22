import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const transferOwnership = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected\n');

        const testUser = await User.findOne({ email: 'test@example.com' });
        const sunnyUser = await User.findOne({ email: 'sunny@gmail.com' });

        if (!testUser || !sunnyUser) {
            console.error('Users not found!');
            process.exit(1);
        }

        console.log(`From: ${testUser.email} (${testUser._id})`);
        console.log(`To: ${sunnyUser.email} (${sunnyUser._id})\n`);

        // Update all campaigns owned by test@example.com to sunny@gmail.com
        const result = await Campaign.updateMany(
            { userId: testUser._id },
            { $set: { userId: sunnyUser._id } }
        );

        console.log(`✅ Transferred ${result.modifiedCount} campaign(s) to sunny@gmail.com`);

        // Verify
        const campaigns = await Campaign.find({ userId: sunnyUser._id });
        console.log('\nCampaigns now owned by sunny@gmail.com:');
        campaigns.forEach(c => {
            console.log(`- ${c.name} (${c._id})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

transferOwnership();
