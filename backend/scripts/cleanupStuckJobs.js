import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function cleanupStuckJobs() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all stuck jobs (RUNNING with errors or FAILED)
    const stuckJobs = await mongoose.connection.collection('jobs').find({
        $or: [
            { status: 'RUNNING', lastError: { $ne: null } },
            { status: 'FAILED' }
        ]
    }).toArray();

    console.log(`Found ${stuckJobs.length} stuck jobs\n`);

    if (stuckJobs.length === 0) {
        console.log('No stuck jobs to clean up!');
        await mongoose.disconnect();
        return;
    }

    // Show stuck jobs
    console.log('=== STUCK JOBS ===');
    stuckJobs.forEach((job, i) => {
        console.log(`${i + 1}. Lead: ${job.leadId}`);
        console.log(`   Status: ${job.status}`);
        console.log(`   Error: ${job.lastError}`);
        console.log(`   Type: ${job.type}`);
    });

    // Reset all stuck jobs to PENDING
    const result = await mongoose.connection.collection('jobs').updateMany(
        {
            $or: [
                { status: 'RUNNING', lastError: { $ne: null } },
                { status: 'FAILED' }
            ]
        },
        {
            $set: {
                status: 'PENDING',
                lastError: null,
                scheduledFor: new Date(),
                retryCount: 0
            }
        }
    );

    console.log(`\n✅ Reset ${result.modifiedCount} stuck jobs to PENDING`);

    // Show new job counts
    const pendingCount = await mongoose.connection.collection('jobs').countDocuments({ status: 'PENDING' });
    const runningCount = await mongoose.connection.collection('jobs').countDocuments({ status: 'RUNNING' });
    const doneCount = await mongoose.connection.collection('jobs').countDocuments({ status: 'DONE' });

    console.log('\n=== JOB STATUS AFTER CLEANUP ===');
    console.log(`PENDING: ${pendingCount}`);
    console.log(`RUNNING: ${runningCount}`);
    console.log(`DONE: ${doneCount}`);

    await mongoose.disconnect();
}

cleanupStuckJobs().catch(console.error);
