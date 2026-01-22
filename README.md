# ClientCatcher AI - Reach Out Rocket

Full-stack email outreach platform with automated lead management and email sending.

## 🚀 Quick Start

### Backend Setup

1. **Go to backend folder**:
   ```bash
   cd backend
   ```

2. **See `backend/START_HERE.md`** for complete setup instructions!

   Quick version:
   - Create `.env` file (MongoDB is already configured!)
   - Set up Gmail SMTP (5 minutes - see `EMAIL_SETUP.md`)
   - Run `npm install && npm run dev`

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
├── backend/          # Express.js API server
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API endpoints
│   ├── services/    # Business logic
│   └── server.js    # Main server file
└── src/             # React frontend
    ├── pages/       # Page components
    ├── components/  # UI components
    └── lib/         # Utilities
```

## 🛠️ Technologies

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Gmail API / SMTP

## 📚 Documentation

### Backend
- **`backend/START_HERE.md`** - Quick setup guide ⭐
- **`backend/EMAIL_SETUP.md`** - Email configuration (SMTP/Gmail API)
- **`backend/README.md`** - Full API documentation
- **`backend/QUICKSTART.md`** - API examples

### Frontend
- Standard React/Vite setup
- See `src/` for component structure

## 🔑 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

See `backend/START_HERE.md` for complete setup!

## 🚀 Deployment

### Backend
- Deploy to Render, Railway, or any Node.js host
- Set up cron jobs for `/api/cron/run-jobs` (every 5 min)
- Set up daily cron for `/api/cron/followups`

### Frontend
- Deploy to Vercel, Netlify, or any static host
- Update API URL in frontend config

## 📖 API Endpoints

See `backend/README.md` for complete API documentation.

Main endpoints:
- `/api/auth/*` - Authentication
- `/api/campaigns/*` - Campaign management
- `/api/templates/*` - Email templates
- `/api/leads/*` - Lead management
- `/api/send/*` - Email sending
- `/api/cron/*` - Worker endpoints

## 🎯 Features

- ✅ User authentication (JWT)
- ✅ Campaign management
- ✅ Lead import (CSV/XLSX)
- ✅ Automatic lead categorization
- ✅ Email template system
- ✅ Automated email sending
- ✅ Follow-up automation
- ✅ Job queue (MongoDB-based)
- ✅ Statistics dashboard

## 📝 License

ISC
