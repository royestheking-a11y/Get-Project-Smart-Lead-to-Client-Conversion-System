#!/usr/bin/env node
import nodemailer from 'nodemailer';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🔧 Resend API Key Tester\n');
console.log('This tool tests your Resend API key before deploying to Render.\n');

const testResend = async () => {
    try {
        const apiKey = await question('Paste your Resend API Key (starts with re_): ');

        if (!apiKey.startsWith('re_')) {
            console.log('\n❌ Invalid API key format. It should start with "re_"');
            rl.close();
            return;
        }

        console.log('\n✅ API key format looks good!');
        console.log('📧 Attempting to send test email...\n');

        const transporter = nodemailer.createTransport({
            host: 'smtp.resend.com',
            port: 587,
            secure: false,
            auth: {
                user: 'resend',
                pass: apiKey
            }
        });

        console.log('🔌 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ Connection verified!\n');

        const testEmail = await question('Enter email to send test to (or press Enter for rizqaratech@gmail.com): ');
        const recipient = testEmail.trim() || 'rizqaratech@gmail.com';

        console.log(`\n📨 Sending test email to ${recipient}...`);

        const info = await transporter.sendMail({
            from: 'rizqaratech@gmail.com',
            to: recipient,
            subject: '✅ Resend Test - ClientCatcher',
            text: 'This is a test email from your ClientCatcher app using Resend!',
            html: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #10b981; margin-top: 0;">✅ Resend Test Successful!</h1>
              <p style="color: #333; line-height: 1.6;">
                Your ClientCatcher app successfully connected to Resend and sent this test email.
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                Sent via Resend SMTP<br>
                Time: ${new Date().toISOString()}
              </p>
            </div>
          </body>
        </html>
      `
        });

        console.log('\n🎉 SUCCESS!');
        console.log(`Message ID: ${info.messageId}`);
        console.log(`\n✅ Your Resend API key is working perfectly!`);
        console.log('\n📋 Next Steps:');
        console.log('1. Go to Render Dashboard > Environment');
        console.log('2. Update these variables:');
        console.log('   SMTP_HOST: smtp.resend.com');
        console.log('   SMTP_PORT: 587');
        console.log('   SMTP_USER: resend');
        console.log('   SMTP_PASS: ' + apiKey.substring(0, 8) + '...');
        console.log('3. Save and wait for redeploy (3 min)');
        console.log('4. Check Email Logs for "Sent" status ✅\n');

    } catch (error) {
        console.error('\n❌ Test failed!');
        console.error('Error:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 This means your API key is invalid or expired.');
            console.log('   Go to Resend Dashboard > API Keys');
            console.log('   Create a new API key and try again.');
        } else {
            console.log('\n💡 Check the error message above for details.');
        }
    } finally {
        rl.close();
    }
};

testResend();
