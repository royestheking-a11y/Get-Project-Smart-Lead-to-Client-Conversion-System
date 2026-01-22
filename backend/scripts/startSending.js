#!/usr/bin/env node
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CRON_SECRET = process.env.CRON_SECRET || 'clientcatcher-cron-secret-2024';
const API_URL = 'http://localhost:8000/api';
const campaignId = process.argv[2];

if (!campaignId) {
    console.error('Usage: node scripts/startSending.js <campaignId>');
    process.exit(1);
}

const startSending = async () => {
    try {
        console.log(`Starting campaign ${campaignId}...`);

        const response = await fetch(`${API_URL}/send/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-cron-secret': CRON_SECRET
            },
            body: JSON.stringify({ campaignId })
        });

        const result = await response.json();
        console.log('\nResult:', result);

        if (result.jobsCreated > 0) {
            console.log(`\n✅ Created ${result.jobsCreated} email jobs!`);
            console.log(`Worker will process them automatically.`);
        } else {
            console.log('\n⚠️ No jobs created:', result.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

startSending();
