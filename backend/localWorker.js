#!/usr/bin/env node

/**
 * Local Email Worker
 * 
 * Runs on your local machine to send emails via Gmail SMTP
 * Connects to production MongoDB to process the same jobs as Render
 * 
 * Usage:
 *   node localWorker.js
 * 
 * This worker:
 * - Checks for pending jobs every 60 seconds
 * - Sends 1 email per minute
 * - Uses Gmail SMTP (no Render blocking!)
 * - Updates the same MongoDB as Render
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

// Load local environment variables
dotenv.config({ path: '.env.local' });

const API_URL = 'http://localhost:8001/api';
const WORKER_INTERVAL = 60000; // 60 seconds
const CRON_SECRET = process.env.CRON_SECRET || 'clientcatcher-cron-secret-2024';

console.log('🚀 Local Email Worker Starting...\n');
console.log('Configuration:');
console.log('  MongoDB:', process.env.MONGODB_URI?.substring(0, 50) + '...');
console.log('  SMTP:', process.env.SMTP_HOST);
console.log('  Port:', process.env.PORT || 8001);
console.log('  Worker Interval:', WORKER_INTERVAL / 1000, 'seconds\n');

// Start the backend server first
console.log('Starting backend server on port', process.env.PORT || 8001, '...\n');

// Import and start server
import('./server.js').then(() => {
    console.log('✅ Backend server started\n');

    // Wait 3 seconds for server to fully initialize
    setTimeout(startWorker, 3000);
}).catch(err => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
});

function startWorker() {
    console.log('⏰ Email Worker Started');
    console.log('Checking for jobs every', WORKER_INTERVAL / 1000, 'seconds...\n');

    // Process jobs immediately, then every 60 seconds
    processJobs();
    setInterval(processJobs, WORKER_INTERVAL);
}

async function processJobs() {
    try {
        const response = await fetch(`${API_URL}/cron/run-jobs?limit=1`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-cron-secret': CRON_SECRET
            }
        });

        if (!response.ok) {
            console.error(`❌ Worker error: ${response.status} ${response.statusText}`);
            return;
        }

        const result = await response.json();

        if (result.processed > 0) {
            console.log(`✅ Processed ${result.processed} job(s) - ${result.succeeded} sent, ${result.failed} failed`);
        } else {
            console.log('⏳ No pending jobs - waiting...');
        }
    } catch (error) {
        console.error('❌ Worker error:', error.message);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping local email worker...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Stopping local email worker...');
    process.exit(0);
});
