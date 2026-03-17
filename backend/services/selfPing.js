import fetch from 'node-fetch';

/**
 * Self-Ping Service
 * Used to keep Render's free tier from sleeping by pinging the health endpoint every 10 minutes.
 */
export const initSelfPing = () => {
  const url = process.env.RENDER_EXTERNAL_URL || process.env.API_URL;
  
  if (!url) {
    console.log('ℹ️ Self-ping skipped: No RENDER_EXTERNAL_URL or API_URL found.');
    return;
  }

  const healthUrl = `${url.replace(/\/api$/, '')}/health`;
  console.log(`🚀 Self-ping initialized for: ${healthUrl}`);

  // Ping every 10 minutes (600,000 ms)
  // Render spins down after 15 mins of inactivity
  setInterval(async () => {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        console.log(`[${new Date().toLocaleTimeString()}] 💓 Self-ping successful: ${response.status}`);
      } else {
        console.warn(`[${new Date().toLocaleTimeString()}] ⚠️ Self-ping returned status: ${response.status}`);
      }
    } catch (err) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Self-ping failed:`, err.message);
    }
  }, 10 * 60 * 1000); 
};
