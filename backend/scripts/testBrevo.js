#!/usr/bin/env node
import nodemailer from 'nodemailer';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🔧 Brevo (Sendinblue) SMTP Tester\n');

const testBrevo = async () => {
    try {
        const smtpKey = await question('Paste your Brevo SMTP Key: ');
        const email = await question('Your Brevo login email (default: rizqaratech@gmail.com): ');
        const login = email.trim() || 'rizqaratech@gmail.com';

        console.log('\n✅ Testing Brevo SMTP...\n');

        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: login,
                pass: smtpKey
            }
        });

        console.log('🔌 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ Connection verified!\n');

        const testEmail = await question('Enter email to send test to (or press Enter for ' + login + '): ');
        const recipient = testEmail.trim() || login;

        console.log(`\n📨 Sending test email to ${recipient}...`);

        const info = await transporter.sendMail({
            from: login,
            to: recipient,
            subject: '✅ Brevo Test - ClientCatcher',
            text: 'This is a test email from your ClientCatcher app using Brevo!',
            html: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px;">
              <h1 style="color: #10b981;">✅ Brevo Test Successful!</h1>
              <p>Your ClientCatcher app successfully connected to Brevo SMTP.</p>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                Time: ${new Date().toISOString()}
              </p>
            </div>
          </body>
        </html>
      `
        });

        console.log('\n🎉 SUCCESS!');
        console.log(`Message ID: ${info.messageId}`);
        console.log('\n📋 Update Render with:');
        console.log('   SMTP_HOST: smtp-relay.brevo.com');
        console.log('   SMTP_PORT: 587');
        console.log('   SMTP_USER: ' + login);
        console.log('   SMTP_PASS: ' + smtpKey.substring(0, 10) + '...\n');

    } catch (error) {
        console.error('\n❌ Test failed!');
        console.error('Error:', error.message);
    } finally {
        rl.close();
    }
};

testBrevo();
