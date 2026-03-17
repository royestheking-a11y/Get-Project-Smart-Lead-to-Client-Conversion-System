import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { initEmailService } from './services/emailService.js';
import { initSelfPing } from './services/selfPing.js';
import './worker.js'; // Start the worker/cron jobs automatically

// Import routes
import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import templateRoutes from './routes/templates.js';
import leadRoutes from './routes/leads.js';
import sendRoutes from './routes/send.js';
import cronRoutes from './routes/cron.js';
import emailLogsRoutes from './routes/emailLogs.js';
import settingsRoutes from './routes/settings.js';

// Load environment variables
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize email service
initEmailService();

// Connect to MongoDB
connectDB();

// Anti-sleep self-pinger for Render
initSelfPing();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/send', sendRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/email-logs', emailLogsRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
