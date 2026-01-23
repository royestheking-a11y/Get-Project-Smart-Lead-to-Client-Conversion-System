import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Environment setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Settings Schema
const settingsSchema = new mongoose.Schema({
    smtp: {
        host: String,
        port: Number,
        user: String,
        pass: String,
        secure: Boolean
    },
    imap: {
        user: String,
        password: String,
        host: String,
        port: Number,
        tls: Boolean
    }
}, { strict: false });
const Settings = mongoose.model('Settings', settingsSchema);

const checkConfig = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('--- Environment Variables ---');
        console.log('SMTP_HOST:', process.env.SMTP_HOST ? 'Set' : 'Missing');
        console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Missing');
        console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Missing');
        console.log('\n--- Database Settings ---');

        const settings = await Settings.findOne();
        if (settings) {
            console.log('Settings Found: YES');
            console.log('SMTP Host:', settings.smtp?.host ? 'Set' : 'Missing');
            console.log('SMTP User:', settings.smtp?.user ? 'Set' : 'Missing');
        } else {
            console.log('Settings Found: NO');
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkConfig();
