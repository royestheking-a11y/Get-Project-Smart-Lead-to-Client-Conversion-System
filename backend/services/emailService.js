import nodemailer from 'nodemailer';
import { Resend } from 'resend';

let transporter = null;
let resendClient = null;
let emailMode = null; // 'resend' or 'smtp'

// Initialize email service - auto-detect based on environment
export const initEmailService = () => {
  // Priority 1: Resend HTTP API (works on Render)
  if (process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
    emailMode = 'resend';
    console.log('✅ Email service initialized: Resend HTTP API');
    return;
  }

  // Priority 2: SMTP (works locally with Gmail)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const port = parseInt(process.env.SMTP_PORT || '587');

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });

    emailMode = 'smtp';
    console.log(`✅ Email service initialized: SMTP (${process.env.SMTP_HOST}:${port})`);
    return;
  }

  console.warn('⚠️ No email service configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS');
};

// Send email via Resend HTTP API
const sendViaResend = async (to, subject, body) => {
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: body.html,
      text: body.text
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Email sent via Resend to ${to}, ID: ${data.id}`);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Resend send error:', error);
    return { success: false, error: error.message };
  }
};

// Send email via SMTP
const sendViaSMTP = async (to, subject, body) => {
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: to,
      subject: subject,
      html: body.html,
      text: body.text,
      headers: {
        'X-Mailin-Track-Clicks': '0' // Disable Brevo link tracking to move to Primary tab
      }
    });

    console.log(`✅ Email sent via SMTP to ${to}, ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('SMTP send error:', error);
    return { success: false, error: error.message };
  }
};

// Main send email function - auto-routes based on initialized mode
export const sendEmail = async (to, subject, body) => {
  if (emailMode === 'resend' && resendClient) {
    return sendViaResend(to, subject, body);
  }

  if (emailMode === 'smtp' && transporter) {
    return sendViaSMTP(to, subject, body);
  }

  return {
    success: false,
    error: 'No email service configured. Set RESEND_API_KEY or SMTP credentials.'
  };
};
