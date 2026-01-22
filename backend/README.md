# ClientCatcher AI Backend

Express.js backend API for ClientCatcher AI email outreach platform.

## Features

- **Authentication**: JWT-based auth (register, login, protected routes)
- **Campaigns**: Create, update, pause/resume campaigns
- **Templates**: Email templates with variable substitution
- **Lead Import**: CSV/XLSX import with deduplication and validation
- **Categorization**: Automatic lead categorization based on website analysis
- **Email Sending**: Gmail API or SMTP email sending
- **Job Queue**: MongoDB-based job queue (no Redis needed)
- **Follow-ups**: Automated follow-up emails at 3 and 7 days
- **Stats**: Campaign statistics and dashboard data

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT (jsonwebtoken)
- **Email**: Gmail API (googleapis) or SMTP (nodemailer)
- **File Upload**: Multer
- **CSV/XLSX**: csv-parse, xlsx

## Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random secret string for JWT signing
   - `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`: For Gmail API (recommended)
   - OR `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: For SMTP fallback
   - `CRON_SECRET`: Secret token for cron endpoints (optional but recommended)

3. **Start server**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - List user's campaigns
- `GET /api/campaigns/:id` - Get campaign
- `PATCH /api/campaigns/:id` - Update campaign
- `POST /api/campaigns/:id/pause` - Pause campaign
- `POST /api/campaigns/:id/resume` - Resume campaign

### Templates
- `POST /api/templates` - Create template
- `GET /api/templates?campaignId=...` - List templates
- `GET /api/templates/:id` - Get template
- `PATCH /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Leads
- `POST /api/leads/import` - Import leads from CSV/XLSX
- `GET /api/leads?campaignId=...&status=...&category=...&search=...&page=...&limit=...` - List leads
- `PATCH /api/leads/:id` - Update lead
- `POST /api/leads/:id/mark-replied` - Mark lead as replied
- `POST /api/leads/:id/do-not-contact` - Mark lead as DNC
- `POST /api/leads/categorize` - Categorize leads (bulk)

### Sending
- `POST /api/send/start` - Start sending (create jobs)
- `POST /api/send/stop` - Stop sending
- `GET /api/send/stats?campaignId=...` - Get campaign stats

### Cron (Worker)
- `POST /api/cron/run-jobs?limit=5&secret=...` - Run due jobs (worker)
- `POST /api/cron/followups?secret=...` - Create follow-up jobs
- `POST /api/cron/check-bounce-rate?secret=...` - Auto-pause campaigns with high failure rate

## Cron Setup

For production, set up cron jobs to ping these endpoints:

1. **Run jobs** (every 1-5 minutes):
   ```bash
   */5 * * * * curl -X POST https://your-domain.com/api/cron/run-jobs?secret=YOUR_SECRET
   ```

2. **Follow-ups** (daily):
   ```bash
   0 9 * * * curl -X POST https://your-domain.com/api/cron/followups?secret=YOUR_SECRET
   ```

3. **Bounce rate check** (daily):
   ```bash
   0 10 * * * curl -X POST https://your-domain.com/api/cron/check-bounce-rate?secret=YOUR_SECRET
   ```

Or use:
- **Render Cron Jobs**: Add cron jobs in Render dashboard
- **Vercel Cron**: Use `vercel.json` cron configuration
- **External cron service**: EasyCron, Cron-job.org, etc.

## Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials (Desktop app)
5. Get refresh token using OAuth 2.0 Playground
6. Add credentials to `.env`

## Data Models

### User
- name, email, passwordHash, role, createdAt

### Campaign
- userId, name, dailyLimit, sendingWindowStart, sendingWindowEnd, rateLimitMinSec, rateLimitMaxSec, followupsEnabled, status, createdAt

### Lead
- campaignId, companyName, email, website, location, industry, category, status, lastContactedAt, doNotContact, notes, createdAt

### EmailTemplate
- campaignId, name, category, subjectTemplate, bodyTemplate, createdAt

### EmailLog
- campaignId, leadId, type, subject, body, providerMessageId, status, errorMessage, sentAt

### Job
- type, campaignId, leadId, templateId, runAt, status, attempts, lastError, createdAt

## Rate Limits

- **Daily limit**: Configurable per campaign (default 20, max 200)
- **Rate limit**: 60-120 seconds between emails (configurable)
- **Concurrency**: 1 email at a time (safe for free tier)
- **Categorization**: 3-5 concurrent website fetches

## Notes

- All routes except `/api/auth/register` and `/api/auth/login` require JWT token in `Authorization: Bearer <token>` header
- Cron endpoints require `CRON_SECRET` in query param or `X-Cron-Secret` header
- Job queue uses MongoDB (no Redis needed)
- Email sending supports both Gmail API and SMTP
- Lead categorization uses basic HTML parsing (free, no paid APIs)
