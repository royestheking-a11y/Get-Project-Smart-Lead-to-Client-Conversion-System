import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testGmailDirect() {
    console.log('Testing Gmail SMTP directly...\n');
    console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
    console.log(`SMTP_PASS: ${process.env.SMTP_PASS?.substring(0, 4)}...`);
    console.log('');

    const transporter = nodemailer.createTransporter({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000
    });

    try {
        console.log('1. Verifying connection...');
        await transporter.verify();
        console.log('✅ Gmail SMTP connection successful!\n');

        console.log('2. Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: 'aurangzebsunny0@gmail.com',
            subject: 'Test from Local Worker',
            html: '<h1>Success!</h1><p>Gmail SMTP works from your computer!</p>'
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\nGmail SMTP is working correctly!');
    } catch (error) {
        console.error('❌ Gmail SMTP Failed:', error.message);
        console.error('\nPossible issues:');
        console.error('1. App password is incorrect');
        console.error('2. Less secure app access not enabled');
        console.error('3. Gmail security blocking the connection');
        console.error('\nSolution: Use Resend API instead (no SMTP issues)');
    }
}

testGmailDirect();
