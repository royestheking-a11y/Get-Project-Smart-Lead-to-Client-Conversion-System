# Email Setup Guide - Choose One Option

## Option 1: Gmail SMTP (EASIEST - Recommended for Beginners)

This is the simplest way to send emails. Follow these steps:

### Step 1: Enable 2-Factor Authentication on Gmail

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the steps to enable it

### Step 2: Generate App Password

1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **App passwords**
3. Select "Mail" and "Other (Custom name)"
4. Enter "ClientCatcher" as the name
5. Click **Generate**
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Open `backend/.env` and update these lines:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

**Important:** Use the email address you used to generate the app password, and use the 16-character app password (remove spaces or keep them, both work).

### Step 4: Test

Start your server:
```bash
cd backend
npm install
npm run dev
```

The server will use SMTP to send emails automatically!

---

## Option 2: Gmail API (More Complex - For Advanced Users)

If you prefer Gmail API (more features, but more setup):

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "ClientCatcher" and click "Create"

### Step 2: Enable Gmail API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click on it and press "Enable"

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: ClientCatcher
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue" through the steps
4. Back to Credentials:
   - Application type: **Desktop app**
   - Name: ClientCatcher
   - Click "Create"
5. **Download the JSON file** or copy Client ID and Client Secret

### Step 4: Get Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in top right
3. Check ✅ "Use your own OAuth credentials"
4. Enter your **Client ID** and **Client Secret** from Step 3
5. In left panel, find "Gmail API v1"
6. Check these scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.compose`
7. Click "Authorize APIs"
8. Sign in with your Gmail account
9. Click "Allow"
10. Click "Exchange authorization code for tokens"
11. **Copy the "Refresh token"** (long string)

### Step 5: Update .env File

Open `backend/.env` and add:

```env
GMAIL_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret-here
GMAIL_REFRESH_TOKEN=your-refresh-token-here
GMAIL_USER=your-email@gmail.com
```

### Step 6: Comment Out SMTP

In `.env`, comment out or remove the SMTP lines:
```env
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password-here
```

---

## Which Option Should I Choose?

- **Choose SMTP (Option 1)** if:
  - You want the easiest setup
  - You're just getting started
  - You don't need advanced Gmail features

- **Choose Gmail API (Option 2)** if:
  - You need more control
  - You want better error handling
  - You're comfortable with OAuth setup

**For most users, SMTP (Option 1) is recommended!**

---

## Troubleshooting

### SMTP Not Working?

1. Make sure 2FA is enabled on Gmail
2. Make sure you're using an **App Password**, not your regular password
3. Check that SMTP_USER is your full Gmail address
4. Try removing spaces from the app password

### Gmail API Not Working?

1. Make sure Gmail API is enabled in Google Cloud Console
2. Check that OAuth consent screen is configured
3. Verify refresh token is correct (it's a long string)
4. Make sure you authorized the correct scopes

---

## Need Help?

If you're stuck, start with **Option 1 (SMTP)** - it's much simpler and works great for sending emails!
