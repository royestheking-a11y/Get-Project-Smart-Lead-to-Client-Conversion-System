import { Resend } from 'resend';

let resendClient = null;

// Initialize Resend HTTP API client
export const initEmailService = () => {
  if (process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend HTTP API initialized');
    return;
  }

  console.warn('⚠️ RESEND_API_KEY not found. Email sending will fail.');
};

// Main send email function
export const sendEmail = async (to, subject, body) => {
  try {
    if (!resendClient) {
      throw new Error('Resend API not initialized. Set RESEND_API_KEY environment variable.');
    }

    const fromEmail = process.env.FROM_EMAIL || 'ClientCatcher <onboarding@resend.dev>';

    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: body,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Email sent successfully to ${to}, ID: ${data.id}`);
    return { success: true, messageId: data.id };

  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};
