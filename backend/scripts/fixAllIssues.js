import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function fixAll() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // 1. Check all leads
    const leads = await mongoose.connection.collection('leads').find({}).toArray();
    console.log('=== LEADS ===');
    leads.forEach(l => console.log(l.email, '|', l.status));

    // 2. Check all jobs
    const jobs = await mongoose.connection.collection('jobs').find({}).toArray();
    console.log('\n=== JOBS ===');
    console.log('PENDING:', jobs.filter(j => j.status === 'PENDING').length);
    console.log('RUNNING:', jobs.filter(j => j.status === 'RUNNING').length);
    console.log('DONE:', jobs.filter(j => j.status === 'DONE').length);
    console.log('FAILED:', jobs.filter(j => j.status === 'FAILED').length);

    // 3. Check email logs
    const logs = await mongoose.connection.collection('emaillogs').find({}).toArray();
    console.log('\n=== EMAIL LOGS ===');
    console.log('sent:', logs.filter(l => l.status === 'sent').length);
    console.log('failed:', logs.filter(l => l.status === 'failed').length);

    logs.filter(l => l.status === 'failed').forEach(l => {
        console.log('FAILED:', l.recipient, '-', l.errorMessage);
    });

    // 4. FIX: Reset all stuck/failed jobs to PENDING
    console.log('\n=== FIXING ISSUES ===');
    const resetResult = await mongoose.connection.collection('jobs').updateMany(
        { status: { $in: ['RUNNING', 'FAILED'] } },
        { $set: { status: 'PENDING', lastError: null, scheduledFor: new Date() } }
    );
    console.log('Reset stuck/failed jobs:', resetResult.modifiedCount);

    // 5. Show final pending count
    const pendingNow = await mongoose.connection.collection('jobs').countDocuments({ status: 'PENDING' });
    console.log('PENDING jobs now:', pendingNow);

    await mongoose.disconnect();
}

fixAll().catch(console.error);
