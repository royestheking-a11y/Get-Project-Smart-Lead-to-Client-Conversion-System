import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EmailTemplate from '../models/EmailTemplate.js';
import Campaign from '../models/Campaign.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const cleanupOrphans = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        const templates = await EmailTemplate.find({});
        let deletedCount = 0;

        for (const t of templates) {
            const campaign = await Campaign.findById(t.campaignId);
            if (!campaign) {
                console.log(`Deleting orphaned template: ${t.name} (Campaign: ${t.campaignId})`);
                await EmailTemplate.deleteOne({ _id: t._id });
                deletedCount++;
            }
        }

        console.log(`\nDeleted ${deletedCount} orphaned templates.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanupOrphans();
