import express from 'express';
import nodemailer from 'nodemailer';
import imaps from 'imap-simple';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// Test SMTP Connection
router.post('/test-smtp', async (req, res) => {
    try {
        const { host, port, user, pass, secure } = req.body;

        // Use provided credentials or fallback to env
        const smtpConfig = {
            host: host || process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(port || process.env.SMTP_PORT || '587'),
            secure: secure !== undefined ? secure : (process.env.SMTP_PORT === '465'),
            auth: {
                user: user || process.env.SMTP_USER,
                pass: pass || process.env.SMTP_PASS
            }
        };

        console.log('Testing SMTP with:', { ...smtpConfig, auth: { user: smtpConfig.auth.user, pass: '****' } });

        const transporter = nodemailer.createTransport(smtpConfig);
        await transporter.verify();

        res.json({ success: true, message: 'SMTP Connection Successful' });
    } catch (error) {
        console.error('SMTP Test Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// Test IMAP Connection
router.post('/test-imap', async (req, res) => {
    try {
        const { host, port, user, pass, tls } = req.body;

        const imapConfig = {
            imap: {
                user: user || process.env.IMAP_USER,
                password: pass || process.env.IMAP_PASSWORD,
                host: host || process.env.IMAP_HOST || 'imap.gmail.com',
                port: parseInt(port || process.env.IMAP_PORT || '993'),
                tls: tls !== undefined ? tls : (process.env.IMAP_TLS !== 'false'),
                authTimeout: 10000
            }
        };

        console.log('Testing IMAP with:', { ...imapConfig.imap, password: '****' });

        const connection = await imaps.connect(imapConfig);
        await connection.end();

        res.json({ success: true, message: 'IMAP Connection Successful' });
    } catch (error) {
        console.error('IMAP Test Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;
