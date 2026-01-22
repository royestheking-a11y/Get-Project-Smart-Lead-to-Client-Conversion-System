// Script to update user signature in database
// Run this with: node backend/scripts/updateSignature.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateSignature = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update the first user (admin) with new signature
        const user = await User.findOne({ role: 'admin' });

        if (!user) {
            console.log('No admin user found. Creating signature for first user...');
            const firstUser = await User.findOne();
            if (firstUser) {
                firstUser.signature = {
                    company: 'RizQara Tech',
                    whatsapp: '8801343042761',
                    portfolioLink: 'https://rizqaratech.vercel.app/'
                };
                firstUser.name = 'Aurangzeb Sunny';
                await firstUser.save();
                console.log('✅ Updated user signature:', firstUser.email);
            }
        } else {
            user.signature = {
                company: 'RizQara Tech',
                whatsapp: '8801343042761',
                portfolioLink: 'https://rizqaratech.vercel.app/'
            };
            user.name = 'Aurangzeb Sunny';
            await user.save();
            console.log('✅ Updated admin signature:', user.email);
        }

        console.log('Signature details:');
        console.log('- Company: RizQara Tech');
        console.log('- WhatsApp: +880 1343-042761');
        console.log('- Website: https://rizqaratech.com/');

        await mongoose.disconnect();
        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateSignature();
