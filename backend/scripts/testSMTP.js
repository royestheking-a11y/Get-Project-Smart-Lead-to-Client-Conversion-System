// Test SMTP Connection Script
// Run with: node backend/scripts/testSMTP.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

const testSMTP = async () => {
    console.log('📧 TESTING SMTP CONNECTION...');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`Port: ${process.env.SMTP_PORT}`);
    console.log(`User: ${process.env.SMTP_USER}`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        // 1. Verify connection configuration
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ SMTP Connection Verified!');

        // 2. Send test email
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.SMTP_USER, // Send to self
            subject: 'ReachOut Rocket - Test Email',
            text: 'If you receive this, your SMTP configuration is working correctly!',
            html: '<p>If you receive this, your <b>SMTP configuration</b> is working correctly!</p>'
        });

        console.log('✅ Test Email Sent!');
        console.log(`Message ID: ${info.messageId}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ SMTP Error:', error);
        process.exit(1);
    }
};

testSMTP();
