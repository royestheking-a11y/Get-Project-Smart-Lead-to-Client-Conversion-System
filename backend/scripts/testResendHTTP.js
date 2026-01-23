#!/usr/bin/env node
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const testResendHTTP = async () => {
    try {
        console.log('🔧 Testing Resend HTTP API\n');

        const apiKey = process.env.RESEND_API_KEY;
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

        if (!apiKey) {
            console.error('❌ RESEND_API_KEY not found in .env');
            process.exit(1);
        }

        console.log(`API Key: ${apiKey.substring(0, 10)}...`);
        console.log(`From Email: ${fromEmail}\n`);

        const resend = new Resend(apiKey);

        console.log('📧 Sending test email...\n');

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: ['rizqaratech@gmail.com'],
            subject: '✅ Resend HTTP API Test - ClientCatcher',
            html: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px;">
              <h1 style="color: #10b981;">✅ Resend HTTP API Works!</h1>
              <p>Your ClientCatcher app successfully connected to Resend via HTTP API (not SMTP).</p>
              <p style="color: #666; margin-top: 20px;">
                This method bypasses SMTP ports entirely, working perfectly on Render and all cloud platforms.
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                Time: ${new Date().toISOString()}
              </p>
            </div>
          </body>
        </html>
      `,
        });

        if (error) {
            console.error('❌ Resend API Error:');
            console.error(error);
            process.exit(1);
        }

        console.log('🎉 SUCCESS!');
        console.log(`Message ID: ${data.id}\n`);
        console.log('✅ Resend HTTP API is working perfectly!\n');
        console.log('📋 Next Steps:');
        console.log('1. Add to Render: RESEND_API_KEY = ' + apiKey.substring(0, 15) + '...');
        console.log('2. Add to Render: FROM_EMAIL = ' + fromEmail);
        console.log('3. Save changes and redeploy');
        console.log('4. Emails will start sending immediately! ✅\n');

    } catch (error) {
        console.error('❌ Test failed:');
        console.error(error);
        process.exit(1);
    }
};

testResendHTTP();
