import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testBrevoSMTP() {
    console.log('Testing Brevo SMTP Connection...\n');

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: 'rizqaratech@gmail.com',
            pass: process.env.SMTP_PASS || 'xsmtpsib-B34f3870f8880aa35320210666b40600fcfc5602f6d924b654a20d44931fa08e-DNWg3GRupItCXJG7'
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
    });

    try {
        // Verify connection
        console.log('1. Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');

        // Send test email
        console.log('2. Sending test email...');
        const info = await transporter.sendMail({
            from: 'rizqaratech@gmail.com',
            to: 'aurangzebsunny0@gmail.com',
            subject: 'Test Email from Brevo SMTP',
            html: '<h1>Success!</h1><p>Brevo SMTP is working correctly.</p>'
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\nBrevo SMTP is working correctly. The issue is on Render.');
    } catch (error) {
        console.error('❌ SMTP Test Failed:');
        console.error('Error:', error.message);
        console.error('\nThis error suggests:');
        if (error.message.includes('Invalid login')) {
            console.error('- SMTP credentials (user/pass) are incorrect');
            console.error('- Double-check your Brevo SMTP key');
        } else if (error.message.includes('timeout')) {
            console.error('- Network/firewall blocking SMTP port 587');
            console.error('- Try port 465 with secure: true');
        } else {
            console.error('- Unknown SMTP error');
        }
    }
}

testBrevoSMTP();
