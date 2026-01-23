import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Environment setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Schema
const emailLogSchema = new mongoose.Schema({
    leadId: mongoose.Schema.Types.ObjectId,
    campaignId: mongoose.Schema.Types.ObjectId,
    recipient: String,
    status: String,
    errorMessage: String, // Correct field name
    sentAt: Date
});
const EmailLog = mongoose.model('EmailLog', emailLogSchema);

const checkLogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get logs from last 20 minutes
        const twentyMinsAgo = new Date(Date.now() - 20 * 60 * 1000);

        const logs = await EmailLog.find({
            sentAt: { $gte: twentyMinsAgo }
        }).sort({ sentAt: -1 });

        console.log(`Found ${logs.length} logs in last 20 mins:`);

        logs.forEach(log => {
            console.log(`Recipient: ${log.recipient}`);
            console.log(`Status: ${log.status}`);
            console.log(`Error: ${log.errorMessage || 'None'}`);
            console.log(`Time: ${log.sentAt.toISOString()}`);
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkLogs();
