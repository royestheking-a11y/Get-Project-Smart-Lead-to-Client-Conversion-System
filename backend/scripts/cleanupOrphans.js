import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';
import Campaign from '../models/Campaign.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const cleanupOrphans = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        const leads = await Lead.find({});
        let deletedCount = 0;

        for (const l of leads) {
            const campaign = await Campaign.findById(l.campaignId);
            if (!campaign) {
                console.log(`Deleting orphaned lead: ${l.email} (Campaign: ${l.campaignId})`);
                await Lead.deleteOne({ _id: l._id });
                deletedCount++;
            }
        }

        console.log(`\nDeleted ${deletedCount} orphaned leads.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanupOrphans();
