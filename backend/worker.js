import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// CRITICAL FIX: Support both local and production (Render) deployment
// If API_URL is set in environment, use it (for Render deployment)
// Otherwise, fall back to localhost (for local development)
const PORT = process.env.PORT || 3001;
const API_URL = process.env.API_URL || `http://localhost:${PORT}/api`;
const CRON_SECRET = process.env.CRON_SECRET || 'clientcatcher-cron-secret-2024';

console.log(`🔧 Worker Configuration:`);
console.log(`   API URL: ${API_URL}`);
console.log(`   Port: ${PORT}`);

const runWorker = async () => {
    console.log('⏰ Email Job Worker Started');
    console.log(`Checking for jobs every 30 seconds...\n`);

    let cycleCount = 0;

    const processJobs = async () => {
        cycleCount++;

        try {
            // 1. Run Pending Jobs
            const response = await fetch(`${API_URL}/cron/run-jobs?limit=10`, {
                method: 'POST',
                headers: {
                    'x-cron-secret': CRON_SECRET,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                console.error(`[${new Date().toLocaleTimeString()}] Jobs API Error:`, error);
            } else {
                const result = await response.json();
                if (result.processed > 0) {
                    console.log(`[${new Date().toLocaleTimeString()}] Processed ${result.processed} jobs (${result.succeeded} succeeded, ${result.failed} failed)`);
                }
            }

            // 1.5 Schedule New Jobs (Every minute - every 2 cycles)
            if (cycleCount % 2 === 0) {
                const scheduleResponse = await fetch(`${API_URL}/cron/schedule-jobs`, {
                    method: 'POST',
                    headers: {
                        'x-cron-secret': CRON_SECRET,
                        'Content-Type': 'application/json'
                    }
                });

                if (scheduleResponse.ok) {
                    const scheduleResult = await scheduleResponse.json();
                    if (scheduleResult.jobsCreated > 0) {
                        console.log(`[${new Date().toLocaleTimeString()}] Scheduled ${scheduleResult.jobsCreated} new emails`);
                    }
                }
            }

            // 2. Run Follow-ups (Every minute - every 2 cycles)
            if (cycleCount % 2 === 0) {
                const followupResponse = await fetch(`${API_URL}/cron/followups`, {
                    method: 'POST',
                    headers: {
                        'x-cron-secret': CRON_SECRET,
                        'Content-Type': 'application/json'
                    }
                });

                if (followupResponse.ok) {
                    const followupResult = await followupResponse.json();
                    if (followupResult.followup1Created > 0 || followupResult.followup2Created > 0) {
                        console.log(`[${new Date().toLocaleTimeString()}] Follow-ups: Created ${followupResult.followup1Created} (1st) and ${followupResult.followup2Created} (2nd)`);
                    }
                }
            }

            // Check replies every 10 mins (20 cycles)
            if (cycleCount % 20 === 0) {
                console.log('Worker: Checking for replies...');
                try {
                    await fetch(`${API_URL}/cron/check-replies`, {
                        method: 'POST',
                        headers: {
                            'x-cron-secret': CRON_SECRET,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (err) {
                    console.error('Reply check failed:', err.message);
                }
            }

            // 3. Check Bounce Rate (Every hour - every 120 cycles)
            if (cycleCount % 120 === 0) {
                await fetch(`${API_URL}/cron/check-bounce-rate`, {
                    method: 'POST',
                    headers: {
                        'x-cron-secret': CRON_SECRET,
                        'Content-Type': 'application/json'
                    }
                });
            }

        } catch (error) {
            console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
        }
    };

    // Run immediately
    await processJobs();

    // Then run every 30 seconds
    setInterval(processJobs, 30 * 1000);
};

runWorker();
