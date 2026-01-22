#!/usr/bin/env node
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CRON_SECRET = process.env.CRON_SECRET || 'clientcatcher-cron-secret-2024';

console.log('Testing worker connection...\n');
console.log('CRON_SECRET:', CRON_SECRET);
console.log('API URL: http://localhost:8000/api/cron/run-jobs\n');

try {
    const response = await fetch('http://localhost:8000/api/cron/run-jobs?limit=10', {
        method: 'POST',
        headers: {
            'x-cron-secret': CRON_SECRET,
            'Content-Type': 'application/json'
        }
    });

    console.log('Response status:', response.status, response.statusText);

    const text = await response.text();
    console.log('Response body:', text);

    if (response.ok) {
        const result = JSON.parse(text);
        console.log('\n✅ Success!');
        console.log('Processed:', result.processed);
        console.log('Succeeded:', result.succeeded);
        console.log('Failed:', result.failed);
    } else {
        console.log('\n❌ Request failed');
    }
} catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
}
