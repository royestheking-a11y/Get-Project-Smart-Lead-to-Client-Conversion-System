import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Define schemas
const jobSchema = new mongoose.Schema({}, { strict: false });
const leadSchema = new mongoose.Schema({}, { strict: false });
const emailLogSchema = new mongoose.Schema({}, { strict: false });
const campaignSchema = new mongoose.Schema({}, { strict: false });
const templateSchema = new mongoose.Schema({}, { strict: false });

const Job = mongoose.model('Job', jobSchema);
const Lead = mongoose.model('Lead', leadSchema);
const EmailLog = mongoose.model('EmailLog', emailLogSchema);
const Campaign = mongoose.model('Campaign', campaignSchema);
const EmailTemplate = mongoose.model('EmailTemplate', templateSchema);

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Count before clearing
        const jobCount = await Job.countDocuments();
        const leadCount = await Lead.countDocuments();
        const emailLogCount = await EmailLog.countDocuments();
        const campaignCount = await Campaign.countDocuments();
        const templateCount = await EmailTemplate.countDocuments();

        console.log('📊 Current data counts:');
        console.log(`   Jobs: ${jobCount}`);
        console.log(`   Leads: ${leadCount}`);
        console.log(`   Email Logs: ${emailLogCount}`);
        console.log(`   Campaigns: ${campaignCount}`);
        console.log(`   Templates: ${templateCount}\n`);

        // Clear all collections
        console.log('🗑️  Clearing all data...\n');

        await Job.deleteMany({});
        console.log('   ✅ Cleared all Jobs');

        await Lead.deleteMany({});
        console.log('   ✅ Cleared all Leads');

        await EmailLog.deleteMany({});
        console.log('   ✅ Cleared all Email Logs');

        await Campaign.deleteMany({});
        console.log('   ✅ Cleared all Campaigns');

        await EmailTemplate.deleteMany({});
        console.log('   ✅ Cleared all Email Templates');

        console.log('\n🎉 Database cleared successfully! Ready for fresh start.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

clearDatabase();
