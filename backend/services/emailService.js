import nodemailer from 'nodemailer';
import { google } from 'googleapis';

let transporter = null;
let gmailClient = null;

// Initialize Gmail API client
const initGmailClient = () => {
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'urn:ietf:wg:oauth:2.0:oob'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });
    return true;
  }
  return false;
};

// Initialize SMTP transporter
const initSMTP = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    return true;
  }
  return false;
};

// Initialize email service
export const initEmailService = () => {
  if (!initGmailClient()) {
    initSMTP();
  }
};

// Send email via Gmail API
const sendViaGmail = async (to, subject, body) => {
  if (!gmailClient) {
    throw new Error('Gmail client not initialized');
  }

  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body
  ].join('\n');

  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await gmailClient.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedEmail
    }
  });

  return response.data.id;
};

// Send email via SMTP
const sendViaSMTP = async (to, subject, body) => {
  if (!transporter) {
    throw new Error('SMTP transporter not initialized');
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER || process.env.GMAIL_USER,
    to,
    subject,
    html: body
  });

  return info.messageId;
};

// Main send email function with timeout
export const sendEmail = async (to, subject, body) => {
  try {
    // 30 second timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Email sending timed out after 30s')), 30000)
    );

    const sendPromise = (async () => {
      if (gmailClient) {
        const messageId = await sendViaGmail(to, subject, body);
        return { success: true, messageId };
      } else if (transporter) {
        const messageId = await sendViaSMTP(to, subject, body);
        return { success: true, messageId };
      } else {
        throw new Error('No email service configured');
      }
    })();

    return await Promise.race([sendPromise, timeoutPromise]);
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};
