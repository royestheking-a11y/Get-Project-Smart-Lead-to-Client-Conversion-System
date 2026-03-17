import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkLeadStatus() {
    await mongoose.connect(process.env.MONGODB_URI);

    const leads = await mongoose.connection.collection('leads').find({}).toArray();

    console.log('=== ALL LEADS BY STATUS ===\n');

    const byStatus = {};
    leads.forEach(l => {
        if (!byStatus[l.status]) byStatus[l.status] = [];
        byStatus[l.status].push(l.email);
    });

    Object.keys(byStatus).forEach(status => {
        console.log(`${status}: ${byStatus[status].length}`);
        byStatus[status].forEach(email => console.log(`  - ${email}`));
        console.log('');
    });

    // Check email logs
    const logs = await mongoose.connection.collection('emaillogs').find({}).toArray();
    console.log('=== EMAIL LOGS BY STATUS ===\n');

    const logsByStatus = {};
    logs.forEach(l => {
        if (!logsByStatus[l.status]) logsByStatus[l.status] = [];
        logsByStatus[l.status].push(l.recipient);
    });

    Object.keys(logsByStatus).forEach(status => {
        console.log(`${status}: ${logsByStatus[status].length}`);
        logsByStatus[status].forEach(email => console.log(`  - ${email}`));
        console.log('');
    });

    await mongoose.disconnect();
}

checkLeadStatus().catch(console.error);
