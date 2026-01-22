import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import EmailTemplate from '../models/EmailTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const inspectData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // 1. Check User Profile
        const users = await User.find({});
        console.log('\n--- User Profiles ---');
        users.forEach(u => {
            console.log(`Name: "${u.name}"`);
            console.log(`Company: "${u.signature?.company}"`);
            console.log(`WhatsApp: "${u.signature?.whatsapp}"`);
            console.log(`Portfolio: "${u.signature?.portfolioLink}"`);
        });

        // 2. Check Templates
        const templates = await EmailTemplate.find({});
        console.log('\n--- Email Templates ---');
        templates.forEach(t => {
            console.log(`\nID: ${t._id}`);
            console.log(`Subject: ${t.subjectTemplate}`);
            console.log('--- Body Preview ---');
            console.log(t.bodyTemplate);
            console.log('--------------------');
        });

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

inspectData();
