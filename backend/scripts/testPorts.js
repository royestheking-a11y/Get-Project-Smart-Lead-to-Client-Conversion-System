import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const testPort = async (port, secure) => {
    console.log(`\n--- Testing Port ${port} (Secure: ${secure}) ---`);
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: port,
        secure: secure,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        connectionTimeout: 10000, // 10s for testing
    });

    try {
        await transporter.verify();
        console.log(`✅ Success! Port ${port} is open and working.`);
        return true;
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
        return false;
    }
};

const runTest = async () => {
    console.log('Starting SMTP Port Diagnostics...');
    await testPort(465, true);
    await testPort(587, false);
    await testPort(2525, false);
    process.exit(0);
};

runTest();
