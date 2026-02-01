#!/usr/bin/env node
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const testBrevoQuick = async () => {
    try {
        console.log('🔧 Testing Brevo SMTP\n');

        const smtpKey = process.env.SMTP_PASS;
        const userEmail = process.env.SMTP_USER;

        console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
        console.log(`SMTP User: ${userEmail}`);
        console.log(`SMTP Key: ${smtpKey.substring(0, 20)}...\n`);

        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: userEmail,
                pass: smtpKey
            }
        });

        console.log('🔌 Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified!\n');

        console.log('📧 Sending test email...');

        const info = await transporter.sendMail({
            from: userEmail,
            to: userEmail,
            subject: '✅ Brevo Test - ClientCatcher',
            html: '<h1>Success!</h1><p>Brevo SMTP is working!</p>'
        });

        console.log('\n🎉 SUCCESS!');
        console.log(`Message ID: ${info.messageId}\n`);
        console.log('✅ Brevo is ready for Render deployment!');

    } catch (error) {
        console.error('\n❌ Test failed!');
        console.error('Error:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Authentication failed. Possible issues:');
            console.log('   - SMTP key might be incorrect');
            console.log('   - Brevo account not verified');
            console.log('   - Need to verify sender email in Brevo dashboard');
        }
    }
};

testBrevoQuick();
