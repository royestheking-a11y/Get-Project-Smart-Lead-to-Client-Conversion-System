# Complete Setup Instructions

## ✅ Step 1: MongoDB is Already Configured!

Your MongoDB connection is already set up in `.env`:
```
MONGODB_URI=mongodb+srv://getprojectorg_db_user:c2oCwuzUBY9seHRC@cluster0.rnwlxek.mongodb.net/clientcatcher?retryWrites=true&w=majority
```

## 📧 Step 2: Set Up Email (Choose One)

### EASIEST: Gmail SMTP (5 minutes)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other" → Name it "ClientCatcher"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

3. **Update `.env` file**:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   ```
   Replace `your-email@gmail.com` with your Gmail address and paste the app password.

**That's it!** Your email is ready to use.

---

## 🚀 Step 3: Install and Run

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Generate a random JWT secret (optional but recommended)
# On Mac/Linux:
openssl rand -hex 32

# Update .env with the generated secret:
# JWT_SECRET=your-generated-secret-here

# Start the server
npm run dev
```

Server will run on `http://localhost:3001`

---

## 🧪 Step 4: Test It

### Test Registration:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

---

## 📋 Quick Checklist

- [x] MongoDB URI configured
- [ ] Gmail 2FA enabled
- [ ] App Password generated
- [ ] SMTP_USER and SMTP_PASS updated in .env
- [ ] JWT_SECRET set (use `openssl rand -hex 32`)
- [ ] CRON_SECRET set (any random string)
- [ ] Dependencies installed (`npm install`)
- [ ] Server running (`npm run dev`)

---

## 🎯 Next Steps After Setup

1. **Create a campaign** via API or frontend
2. **Create email templates** for different categories
3. **Import leads** from CSV/XLSX
4. **Categorize leads** (automatic website analysis)
5. **Start sending** emails!

See `README.md` for full API documentation.

---

## ❓ Need Help?

- **Email not working?** See `EMAIL_SETUP.md` for detailed troubleshooting
- **API questions?** See `README.md` for endpoint documentation
- **Quick start?** See `QUICKSTART.md` for examples
