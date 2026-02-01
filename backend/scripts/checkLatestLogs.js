import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import EmailLog from '../models/EmailLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const checkLatestLogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const logs = await EmailLog.find({})
            .sort({ _id: -1 })
            .limit(10);

        console.log(`Found ${logs.length} latest logs:\n`);

        logs.forEach(log => {
            console.log(`Recipient: ${log.recipient}`);
            console.log(`Status: ${log.status}`);
            console.log(`Error: ${log.errorMessage}`);
            console.log(`Time: ${log.createdAt || log._id.getTimestamp()}`); // _id has timestamp
            console.log('---\n');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkLatestLogs();
