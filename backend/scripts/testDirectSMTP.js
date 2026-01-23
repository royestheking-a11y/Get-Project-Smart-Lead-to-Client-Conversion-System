import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const testSMTP = async () => {
    console.log('🔍 Testing SMTP Configuration...\n');

    // Show configuration
    console.log('Configuration:');
    console.log(`  Host: ${process.env.SMTP_HOST || 'MISSING'}`);
    console.log(`  Port: ${process.env.SMTP_PORT || '587 (default)'}`);
    console.log(`  User: ${process.env.SMTP_USER || 'MISSING'}`);
    console.log(`  Pass: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'MISSING'}`);
    console.log('');

    // Test both ports
    const ports = [
        { port: 587, secure: false, name: 'STARTTLS (587)' },
        { port: 465, secure: true, name: 'SSL (465)' }
    ];

    for (const config of ports) {
        console.log(`\n🧪 Testing ${config.name}...`);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: config.port,
            secure: config.secure,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            logger: true,
            debug: true
        });

        try {
            console.log('Verifying connection...');
            await transporter.verify();
            console.log(`✅ ${config.name} - Connection SUCCESSFUL!`);

            console.log('Sending test email...');
            const info = await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: process.env.SMTP_USER, // Send to yourself
                subject: 'Test Email from ClientCatcher',
                text: 'This is a test email to verify SMTP configuration.',
                html: '<b>This is a test email</b> to verify SMTP configuration.'
            });

            console.log(`✅ ${config.name} - Email SENT! Message ID: ${info.messageId}`);
            console.log(`\n🎉 SUCCESS! Use port ${config.port} in your Render environment.`);
            break; // Stop if successful

        } catch (error) {
            console.error(`❌ ${config.name} - FAILED`);
            console.error(`Error: ${error.message}`);
            console.error(`Code: ${error.code || 'N/A'}`);
        }
    }

    process.exit(0);
};

testSMTP();
