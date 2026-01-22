# Quick Start Guide

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Set Up Environment Variables

Copy the example and fill in your values:

```bash
# Create .env file (see ENV_SETUP.md for details)
touch .env
```

Minimum required variables:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Any random string (e.g., `openssl rand -hex 32`)
- Either Gmail API credentials OR SMTP credentials

## 3. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3001` (or PORT from .env)

## 4. Test the API

### Register a user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response.

### Create a campaign (use token from login):
```bash
curl -X POST http://localhost:3001/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My First Campaign",
    "dailyLimit": 20
  }'
```

## 5. Set Up Cron Jobs

For production, configure cron to hit these endpoints:

### Run jobs (every 5 minutes):
```bash
*/5 * * * * curl -X POST https://your-domain.com/api/cron/run-jobs?secret=YOUR_CRON_SECRET
```

### Follow-ups (daily at 9 AM):
```bash
0 9 * * * curl -X POST https://your-domain.com/api/cron/followups?secret=YOUR_CRON_SECRET
```

## Next Steps

1. Create email templates for your campaign
2. Import leads via CSV/XLSX
3. Categorize leads
4. Start sending emails

See `README.md` for full API documentation.
