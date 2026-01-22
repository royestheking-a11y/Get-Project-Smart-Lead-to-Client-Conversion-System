# Environment Variables Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clientcatcher?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Gmail API (recommended)
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
GMAIL_USER=your-email@gmail.com

# SMTP (fallback for dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cron Secret (for protecting cron endpoints)
CRON_SECRET=change-this-secret

# Environment
NODE_ENV=development
```

## Getting MongoDB URI

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database user password

## Getting Gmail API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gmail API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Desktop app"
6. Download the credentials JSON
7. Use OAuth 2.0 Playground to get refresh token:
   - Go to https://developers.google.com/oauthplayground/
   - Click gear icon → check "Use your own OAuth credentials"
   - Enter Client ID and Client Secret
   - Select Gmail API v1 scopes
   - Authorize and get refresh token

## SMTP Setup (Alternative)

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an "App Password" in Google Account settings
3. Use that as `SMTP_PASS`
