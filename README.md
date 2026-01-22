# 🚀 Get Project - Smart Lead to Client Conversion System

**Live Website:** [https://getprojects.vercel.app](https://getprojects.vercel.app)

A powerful, full-stack email outreach automation platform designed to turn cold leads into warm clients. Built with React (Vite) and Node.js.

![Dashboard Preview](https://github.com/user-attachments/assets/placeholder)

---

## ✨ Key Features

### 📨 Intelligent Email Engine
*   **One-by-One Throttling:** Sends emails individually with random "human-like" delays (e.g., 60-120 seconds apart) to avoid spam filters.
*   **Daily Safety Limits:** Set a hard cap (e.g., 50 emails/day) per campaign. The system stops automatically when the limit is reached and resumes the next day.
*   **Background Worker:** A dedicated worker process runs every minute to manage the queue, ensuring no lead is left behind.

### 🤖 Smart Automation & Follow-ups
*   **Auto-Reply Detection:** The system logs into your email (IMAP) every 10 minutes to check for replies.
    *   If a lead replies, they are marked as **"REPLIED"**.
    *   **Future follow-ups are automatically CANCELLED** so you don't annoy interested prospects.
*   **Drip Campaigns:**
    *   **Follow-up #1:** Sent automatically after **3 days** (configurable) if no reply.
    *   **Follow-up #2:** Sent after **7 days** (configurable).
    *   *Note:* Follow-ups respect the "Replies" rule—if they reply, the drip stops.

### � Real-Time Analytics Dashboard
*   **Live Status Tracking:** See leads moving from `Imported` → `Sent` → `Replied`.
*   **Failed/Bounce Detection:** Instantly see if emails are bouncing or failing (SMTP errors) right on your dashboard.
*   **Visual KPIs:** Beautiful charts and cards built with Shadcn UI & Recharts.

### 📥 Smart Lead Import
*   **Ghost Space Removal:** Automatically trims invisible spaces from Excel/CSV headers (e.g., "Email " becomes "Email").
*   **Auto-Mapping:** intelligently recognizes columns like "Name", "Title", or "Business Name" as the Company Name.
*   **Duplicate Protection:** Prevents importing the same email twice across campaigns.
*   **Validation:** Checks for valid email formats before importing.

### 🎨 Email Template System
*   **Dynamic Variables:** Personalize emails with `{{company_name}}`, `{{your_name}}`, etc.
*   **Signature Management:**
    *   Auto-detects if you forgot a signature.
    *   Appends a professional HTML signature if missing.
    *   Prevents duplicate signatures if "Kind regards" is already in your template.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework:** React (Vite) + TypeScript
*   **UI Library:** shadcn/ui + Tailwind CSS
*   **State Management:** TanStack Query (React Query)
*   **Icons:** Lucide React

### Backend
*   **Runtime:** Node.js + Express
*   **Database:** MongoDB Atlas (Mongoose)
*   **Email Sending:** Nodemailer (SMTP)
*   **Reply Check:** IMAP Simple
*   **Scheduling:** Custom Interval Workers + Cron Jobs

---

## � Quick Start Guide

### 1. Backend Setup
1.  Navigate to `backend/`.
2.  Install dependencies: `npm install`
3.  Create a `.env` file (see `backend/START_HERE.md`).
4.  Run server: `npm run dev`

### 2. Frontend Setup
1.  Navigate to root directory.
2.  Install dependencies: `npm install`
3.  Run frontend: `npm run dev`

---

## 🏗️ Project Structure
```
├── backend/          # Express API, Workers, Cron Jobs
│   ├── routes/      # API endpoints (cron.js, campaigns.js, etc.)
│   ├── services/    # Email sending & IMAP logic
│   └── worker.js    # Background task runner
└── src/             # React Frontend
    ├── components/  # Dashboard & UI components
    └── pages/       # Main application views
```

## 📝 License
ISC
