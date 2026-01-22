# 🌽 Keep-Alive System (How to prevent Render Sleep)

Render's free tier spins down (sleeps) after 15 minutes of inactivity. To keep your backend and email worker running 24/7 without paying, you need an external "Heartbeat".

## The Solution: Cron-Job.org
We will use a free service to "ping" your website every 10 minutes. This tricks Render into thinking your site is popular, so it never falls asleep.

### Step 1: Get your Backend URL
1. Go to your **Render Dashboard**.
2. Click on your **Backend Service**.
3. Copy the URL (e.g., `https://get-project-backend.onrender.com`).
4. Add `/health` to the end.
   *   **Final URL**: `https://get-project-backend.onrender.com/health`

### Step 2: Create the Cron Job
1. Go to **[cron-job.org](https://console.cron-job.org/signup)** and create a free account.
2. Click **"Create Cronjob"** (or "Create").
3. **Title**: `Get Project Keep Alive`
4. **URL**: Paste your Health URL (from Step 1).
   *   Example: `https://get-project-backend.onrender.com/health`
5. **Execution Schedule**:
   *   Select **"Every 10 minutes"**.
   *   (Do not choose every 1 minute; 10-14 minutes is perfect).
6. **Notifications**: Disable "Email me on failure" (unless you really want to know).
7. Click **Create Configuration**.

### ✅ That's it!
*   **Result**: This external service will visit your site 144 times a day.
*   **Effect**: Render will see traffic and keep your server (and email worker) awake.
*   **Cost**: Free.
