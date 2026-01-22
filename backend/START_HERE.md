# 🚀 START HERE - Quick Setup Guide

## ✅ MongoDB is Already Configured!

Your MongoDB connection string is ready. Just create a `.env` file in the `backend` folder.

## 📝 Step 1: Create .env File

Create a file named `.env` in the `backend` folder with this content:

```env
PORT=3001
MONGODB_URI=mongodb+srv://getprojectorg_db_user:c2oCwuzUBY9seHRC@cluster0.rnwlxek.mongodb.net/clientcatcher?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-here
JWT_EXPIRES_IN=7d

# SMTP Email Configuration (EASIEST - Use This!)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here

# Cron Secret
CRON_SECRET=any-random-string-here

NODE_ENV=development
```

## 📧 Step 2: Set Up Gmail SMTP (5 Minutes - EASIEST!)

### Quick Steps:

1. **Go to**: https://myaccount.google.com/security
2. **Enable "2-Step Verification"** (if not already enabled)
3. **Go to**: https://myaccount.google.com/apppasswords
4. **Select**: 
   - App: "Mail"
   - Device: "Other (Custom name)"
   - Name: "ClientCatcher"
   - Click "Generate"
5. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
6. **Update your `.env` file**:
   ```env
   SMTP_USER=your-actual-email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   ```

**That's it!** Your email is ready.

## 🔑 Step 3: Generate JWT Secret

Run this command to generate a secure secret:

```bash
# Mac/Linux:
openssl rand -hex 32

# Or use any random string like:
# JWT_SECRET=my-super-secret-key-12345
```

Update `JWT_SECRET` in your `.env` file.

## 🚀 Step 4: Install and Run

```bash
cd backend
npm install
npm run dev
```

Your server will start on `http://localhost:3001` ✅

## 🧪 Step 5: Test It

```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📚 Need More Help?

- **Email setup details**: See `EMAIL_SETUP.md`
- **Complete instructions**: See `SETUP_INSTRUCTIONS.md`
- **API documentation**: See `README.md`
- **Quick examples**: See `QUICKSTART.md`

---

## ⚡ Quick Checklist

- [ ] Created `.env` file in `backend/` folder
- [ ] Added MongoDB URI (already done!)
- [ ] Enabled Gmail 2FA
- [ ] Generated App Password
- [ ] Updated `SMTP_USER` and `SMTP_PASS` in `.env`
- [ ] Set `JWT_SECRET` in `.env`
- [ ] Set `CRON_SECRET` in `.env`
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Server is running! 🎉

---

**You're all set!** The backend is ready to send emails. 🚀
