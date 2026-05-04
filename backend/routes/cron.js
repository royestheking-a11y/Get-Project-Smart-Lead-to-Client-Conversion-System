import express from 'express';
import Job from '../models/Job.js';
import Lead from '../models/Lead.js';
import Campaign from '../models/Campaign.js';
import EmailTemplate from '../models/EmailTemplate.js';
import EmailLog from '../models/EmailLog.js';
import { sendEmail, initEmailService } from '../services/emailService.js';
import { renderTemplate } from '../services/emailRenderService.js';
import User from '../models/User.js';

const router = express.Router();

// Optional: Add a simple auth token check for cron endpoints
// For production, use a secret token or IP whitelist

const verifyCronSecret = (req, res, next) => {
  // Read secret dynamically to ensure env vars are loaded
  const CRON_SECRET = process.env.CRON_SECRET || 'change-this-secret';
  const token = req.headers['x-cron-secret'] || req.query.secret;

  console.log('[CRON Auth] Token received:', token);
  console.log('[CRON Auth] Expected secret:', CRON_SECRET);
  console.log('[CRON Auth] Match:', token === CRON_SECRET);

  if (token === CRON_SECRET) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Run jobs (worker)
router.post('/run-jobs', verifyCronSecret, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '5');
    const now = new Date();

    // Auto-cleanup: Reset stuck running jobs (> 5 mins)
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
    await Job.updateMany(
      { status: 'RUNNING', updatedAt: { $lt: fiveMinsAgo } },
      { $set: { status: 'PENDING', attempts: 0 } } // Reset attempts to force fresh retry
    );

    // Find due jobs
    const jobs = await Job.find({
      status: 'PENDING',
      runAt: { $lte: now }
    })
      .sort({ runAt: 1 })
      .limit(limit)
      .populate('campaignId')
      .populate('leadId')
      .populate('templateId');

    if (jobs.length === 0) {
      const pendingCount = await Job.countDocuments({ status: 'PENDING' });
      const readyCount = await Job.countDocuments({ status: 'PENDING', runAt: { $lte: now } });
      const nextJob = await Job.findOne({ status: 'PENDING' }).sort({ runAt: 1 });
      
      console.log(`[Worker] No jobs ready to run. Total Pending: ${pendingCount}, Ready Now: ${readyCount}, Next Job At: ${nextJob ? nextJob.runAt.toISOString() : 'N/A'}, Current Time: ${now.toISOString()}`);
      return res.json({ processed: 0, pending: pendingCount, ready: readyCount, nextJobAt: nextJob ? nextJob.runAt : null, message: 'No due jobs' });
    }

    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    for (const job of jobs) {
      try {
        // Atomically claim job
        const claimedJob = await Job.findOneAndUpdate(
          { _id: job._id, status: 'PENDING' },
          { status: 'RUNNING' },
          { new: true }
        );

        if (!claimedJob) {
          continue; // Job was already claimed
        }

        const lead = job.leadId;
        const campaign = job.campaignId;
        const template = job.templateId;

        // Safety checks
        if (!lead || !campaign || !template) {
          await Job.findByIdAndUpdate(job._id, {
            status: 'FAILED',
            lastError: 'Missing lead, campaign, or template'
          });
          failed++;
          continue;
        }

        if (lead.doNotContact) {
          await Job.findByIdAndUpdate(job._id, {
            status: 'CANCELLED',
            lastError: 'Lead marked as do not contact'
          });
          continue;
        }

        if (['REPLIED', 'BOUNCED', 'DONE', 'WON', 'LOST'].includes(lead.status)) {
          await Job.findByIdAndUpdate(job._id, {
            status: 'CANCELLED',
            lastError: `Lead status is ${lead.status}`
          });
          continue;
        }

        // Get sender profile
        const user = await User.findById(campaign.userId);
        const senderProfile = {
          name: user?.name || '',
          email: user?.email || '',
          company: user?.signature?.company || '',
          whatsapp: user?.signature?.whatsapp || '',
          portfolioLink: user?.signature?.portfolioLink || ''
        };

        console.log('📧 Sending email with senderProfile:', JSON.stringify(senderProfile));

        // Render email
        const { subject, html, text } = renderTemplate(template, lead, senderProfile);

        // Send email (passing both html and text for better deliverability)
        const emailResult = await sendEmail(lead.email, subject, { html, text });

        // Write email log (using html for the body log)
        const emailType = job.type === 'SEND_EMAIL' ? 'initial' :
          job.type === 'FOLLOWUP_1_EMAIL' ? 'followup1' : 'followup2';

        await EmailLog.create({
          campaignId: campaign._id,
          leadId: lead._id,
          recipient: lead.email,
          type: emailType,
          subject,
          body: html,
          providerMessageId: emailResult.messageId || null,
          status: emailResult.success ? 'sent' : 'failed',
          errorMessage: emailResult.error || null
        });

        if (emailResult.success) {
          // Update lead
          let newStatus = 'SENT';
          if (job.type === 'FOLLOWUP_1_EMAIL') {
            newStatus = 'FOLLOWUP_1_SENT';
          } else if (job.type === 'FOLLOWUP_2_EMAIL') {
            newStatus = 'FOLLOWUP_2_SENT';
          }

          lead.status = newStatus;
          lead.lastContactedAt = new Date();
          await lead.save();

          // Mark job as done
          await Job.findByIdAndUpdate(job._id, {
            status: 'DONE'
          });

          console.log(`✅ Email sent successfully to ${lead.email}`);
          succeeded++;
        } else {
          // Handle retry with exponential backoff
          const currentAttempts = (job.attempts || 0) + 1;
          const MAX_ATTEMPTS = 3;

          if (currentAttempts <= MAX_ATTEMPTS) {
            // Exponential backoff: 1min, 5min, 15min
            const backoffMinutes = currentAttempts === 1 ? 1 : currentAttempts === 2 ? 5 : 15;
            const retryAt = new Date(now.getTime() + backoffMinutes * 60 * 1000);

            await Job.findByIdAndUpdate(job._id, {
              status: 'PENDING',
              runAt: retryAt,
              attempts: currentAttempts,
              lastError: emailResult.error
            });

            console.log(`⚠️  Email failed for ${lead.email}, retrying in ${backoffMinutes}min (attempt ${currentAttempts}/${MAX_ATTEMPTS})`);
            console.log(`   Error: ${emailResult.error}`);
          } else {
            // Max attempts reached - mark as permanently failed
            await Job.findByIdAndUpdate(job._id, {
              status: 'FAILED',
              attempts: currentAttempts,
              lastError: emailResult.error
            });

            lead.status = 'FAILED';
            await lead.save();

            console.log(`❌ Email permanently failed for ${lead.email} after ${MAX_ATTEMPTS} attempts`);
            console.log(`   Final error: ${emailResult.error}`);
            failed++;
          }
        }

        processed++;
      } catch (error) {
        console.error(`Error processing job ${job._id}:`, error);

        job.attempts += 1;
        if (job.attempts <= 2) {
          job.status = 'PENDING';
          job.runAt = new Date(now.getTime() + 10 * 60 * 1000);
          job.lastError = error.message;
          await job.save();
        } else {
          // Max attempts reached - mark BOTH job AND lead as failed
          await Job.findByIdAndUpdate(job._id, {
            status: 'FAILED',
            lastError: error.message
          });

          // CRITICAL FIX: Update lead status to FAILED
          lead.status = 'FAILED';
          await lead.save();

          failed++;
        }
        processed++;
      }
    }

    res.json({
      processed,
      succeeded,
      failed,
      message: `Processed ${processed} jobs`
    });
  } catch (error) {
    console.error('Run jobs error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Follow-ups cron
router.post('/followups', verifyCronSecret, async (req, res) => {
  try {
    const now = new Date();
    const activeCampaigns = await Campaign.find({ status: 'active' });

    let followup1Created = 0;
    let followup2Created = 0;
    let markedDone = 0;

    for (const campaign of activeCampaigns) {
      // Calculate dynamic delay dates based on campaign settings
      const delay1 = campaign.followup1DelayDays || 3;
      const delay2 = campaign.followup2DelayDays || 7;

      const cutoff1 = new Date(now.getTime() - delay1 * 24 * 60 * 60 * 1000);
      const cutoff2 = new Date(now.getTime() - delay2 * 24 * 60 * 60 * 1000);
      const cutoffDone = new Date(now.getTime() - (delay2 + 7) * 24 * 60 * 60 * 1000); // 7 days after last email

      // Followup 1: SENT leads contacted X days ago
      const followup1Leads = await Lead.find({
        campaignId: campaign._id,
        status: 'SENT',
        lastContactedAt: { $lte: cutoff1 },
        doNotContact: false
      });

      // Get templates
      const templates = await EmailTemplate.find({ campaignId: campaign._id });
      const templateMap = {};
      templates.forEach(t => {
        templateMap[t.category] = t._id;
      });

      for (const lead of followup1Leads) {
        // Use specific FOLLOWUP_1 template if available, otherwise fall back to category or defaults
        const templateId = templateMap['FOLLOWUP_1'] || templateMap['FOLLOWUP'] || templateMap[lead.category] || templates[0]?._id;
        if (!templateId) continue;

        // Check if followup1 job already exists
        const existingJob = await Job.findOne({
          campaignId: campaign._id,
          leadId: lead._id,
          type: 'FOLLOWUP_1_EMAIL',
          status: { $in: ['PENDING', 'RUNNING', 'DONE'] }
        });

        if (!existingJob) {
          const randomDelay = Math.floor(
            Math.random() * (campaign.rateLimitMaxSec - campaign.rateLimitMinSec + 1) +
            campaign.rateLimitMinSec
          );

          await Job.create({
            type: 'FOLLOWUP_1_EMAIL',
            campaignId: campaign._id,
            leadId: lead._id,
            templateId,
            runAt: new Date(now.getTime() + randomDelay * 1000),
            status: 'PENDING',
            attempts: 0
          });

          followup1Created++;
        }
      }

      // Followup 2: FOLLOWUP_1_SENT leads contacted Y days ago (exclude replied/won/lost)
      const followup2Leads = await Lead.find({
        campaignId: campaign._id,
        status: 'FOLLOWUP_1_SENT',
        lastContactedAt: { $lte: cutoff2 },
        doNotContact: false
      });

      for (const lead of followup2Leads) {
        // Use specific FOLLOWUP_2 template
        const templateId = templateMap['FOLLOWUP_2'] || templateMap['FOLLOWUP'] || templateMap[lead.category] || templates[0]?._id;
        if (!templateId) continue;

        const existingJob = await Job.findOne({
          campaignId: campaign._id,
          leadId: lead._id,
          type: 'FOLLOWUP_2_EMAIL',
          status: { $in: ['PENDING', 'RUNNING', 'DONE'] }
        });

        if (!existingJob) {
          const randomDelay = Math.floor(
            Math.random() * (campaign.rateLimitMaxSec - campaign.rateLimitMinSec + 1) +
            campaign.rateLimitMinSec
          );

          await Job.create({
            type: 'FOLLOWUP_2_EMAIL',
            campaignId: campaign._id,
            leadId: lead._id,
            templateId,
            runAt: new Date(now.getTime() + randomDelay * 1000),
            status: 'PENDING',
            attempts: 0
          });

          followup2Created++;
        }
      }

      // Mark as DONE: followup2 older than 7 days afterwards with no reply
      const doneLeads = await Lead.updateMany(
        {
          campaignId: campaign._id,
          status: 'FOLLOWUP_2_SENT',
          lastContactedAt: { $lte: cutoffDone },
          doNotContact: false
        },
        {
          status: 'DONE'
        }
      );

      markedDone += doneLeads.modifiedCount;
    }

    res.json({
      followup1Created,
      followup2Created,
      markedDone,
      message: 'Follow-ups processed'
    });
  } catch (error) {
    console.error('Followups cron error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Auto-pause check (bounce/failure rate)
router.post('/check-bounce-rate', verifyCronSecret, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' });
    let pausedCount = 0;

    for (const campaign of campaigns) {
      // Get last 20 email logs
      const recentLogs = await EmailLog.find({
        campaignId: campaign._id
      })
        .sort({ sentAt: -1 })
        .limit(20);

      if (recentLogs.length < 10) {
        continue; // Not enough data
      }

      const failedCount = recentLogs.filter(log => log.status === 'failed').length;
      const failureRate = failedCount / recentLogs.length;

      if (failureRate > 0.1) { // 10% failure rate
        campaign.status = 'paused';
        await campaign.save();
        pausedCount++;
      }
    }

    res.json({
      pausedCount,
      message: `Auto-paused ${pausedCount} campaigns due to high failure rate`
    });
  } catch (error) {
    console.error('Check bounce rate error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Schedule new jobs (Main scheduler)
router.post('/schedule-jobs', verifyCronSecret, async (req, res) => {
  try {
    const activeCampaigns = await Campaign.find({ status: 'active' });
    let jobsCreated = 0;
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    for (const campaign of activeCampaigns) {
      // 1. Check daily limit
      const sentToday = await EmailLog.countDocuments({
        campaignId: campaign._id,
        sentAt: { $gte: startOfDay },
        status: { $in: ['sent', 'failed'] }
      });

      const pendingJobsToday = await Job.countDocuments({
        campaignId: campaign._id,
        runAt: { $gte: startOfDay, $lte: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) },
        status: { $in: ['PENDING', 'RUNNING'] }
      });

      // Total allotted for today
      const usage = sentToday + pendingJobsToday;
      const remainingQuota = campaign.dailyLimit - usage;

      if (remainingQuota <= 0) {
        continue; // Limit reached for today
      }

      // 2. Find fresh leads (IMPORTED) that don't have jobs yet
      // We limit by remainingQuota to not over-schedule
      const newLeads = await Lead.find({
        campaignId: campaign._id,
        status: 'READY',
        doNotContact: false
      }).limit(remainingQuota);

      if (newLeads.length === 0) continue;

      // 3. Get templates
      const templates = await EmailTemplate.find({ campaignId: campaign._id });
      // Identify initial template (default or categorized)
      const templateMap = {};
      templates.forEach(t => {
        templateMap[t.category] = t._id;
      });

      // 4. Create jobs
      let nextRunAt = new Date();
      // If there are existing pending jobs, we should schedule AFTER them (not implemented here for simplicity, 
      // but we add random jitter). simpler is to just schedule from "now".

      for (const lead of newLeads) {
        // Find best template
        const templateId = templateMap['INITIAL'] || templateMap[lead.category] || templates[0]?._id;

        if (!templateId) {
          console.log(`Campaign ${campaign._id} has leads but no valid template found.`);
          continue;
        }

        // Check if job already exists (double safety)
        const existingJob = await Job.findOne({
          leadId: lead._id,
          type: 'SEND_EMAIL'
        });
        if (existingJob) continue;

        // Calculate schedule time with rate limiting
        // We accumulate delay so they are spread out
        const randomDelay = Math.floor(
          Math.random() * (campaign.rateLimitMaxSec - campaign.rateLimitMinSec + 1) +
          campaign.rateLimitMinSec
        );

        // Add randomDelay to nextRunAt
        nextRunAt = new Date(nextRunAt.getTime() + randomDelay * 1000);

        // Enforce Sending Window (e.g. 09:00 - 17:00)
        // Parse window
        const [startHour, startMin] = (campaign.sendingWindowStart || '09:00').split(':').map(Number);
        const [endHour, endMin] = (campaign.sendingWindowEnd || '17:00').split(':').map(Number);

        // Adjust nextRunAt if outside window
        // (Simplified logic: if it's too late, push to tomorrow start)
        const currentHour = nextRunAt.getHours();
        if (currentHour >= endHour) {
          // Move to tomorrow start
          nextRunAt.setDate(nextRunAt.getDate() + 1);
          nextRunAt.setHours(startHour, startMin, 0, 0);
        } else if (currentHour < startHour) {
          nextRunAt.setHours(startHour, startMin, 0, 0);
        }

        await Job.create({
          type: 'SEND_EMAIL',
          campaignId: campaign._id,
          leadId: lead._id,
          templateId,
          runAt: nextRunAt,
          status: 'PENDING',
          attempts: 0
        });

        // Update lead status to signify it's queued
        // lead.status = 'PENDING'; // Removed because PENDING is not valid enum
        // await lead.save();

        jobsCreated++;
      }
    }

    res.json({ jobsCreated, message: `Scheduled ${jobsCreated} new emails` });

  } catch (error) {
    console.error('Schedule jobs error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Check replies cron
router.post('/check-replies', verifyCronSecret, async (req, res) => {
  try {
    // Only check if IMAP is configured
    if (!process.env.IMAP_USER || !process.env.IMAP_PASSWORD) {
      return res.json({ message: 'IMAP not configured, skipping reply check' });
    }

    const { checkReplies } = await import('../services/replyService.js');
    const result = await checkReplies();

    res.json({
      success: true,
      stats: result,
      message: `Checked ${result.checked} messages, found ${result.found} replies, updated ${result.updated} leads`
    });
  } catch (error) {
    console.error('Check replies error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Debug config
router.get('/debug-config', async (req, res) => {
  const config = {
    SMTP_HOST: process.env.SMTP_HOST ? `Set (${process.env.SMTP_HOST})` : 'Missing',
    SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Missing',
    SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Missing',
    SMTP_PORT: process.env.SMTP_PORT ? `Set (${process.env.SMTP_PORT})` : 'Missing',
    FROM_EMAIL: process.env.FROM_EMAIL ? `Set (${process.env.FROM_EMAIL})` : 'Missing',
    Keys: Object.keys(process.env).filter(k => k.startsWith('SMTP') || k === 'FROM_EMAIL'),
  };
  console.log('Debug Config:', config);
  res.json(config);
});

// Help debug jobs and timezone issues
router.get('/debug-jobs', verifyCronSecret, async (req, res) => {
  try {
    const now = new Date();
    const pendingJobs = await Job.find({ status: 'PENDING' }).sort({ runAt: 1 }).limit(10).populate('campaignId');
    const campaigns = await Campaign.find({});
    
    res.json({
      serverTime: now.toISOString(),
      serverHour: now.getHours(),
      pendingJobs: pendingJobs.map(j => ({
        id: j._id,
        runAt: j.runAt.toISOString(),
        type: j.type,
        campaign: j.campaignId?.name,
        window: `${j.campaignId?.sendingWindowStart} - ${j.campaignId?.sendingWindowEnd}`
      })),
      campaigns: campaigns.map(c => ({
        name: c.name,
        status: c.status,
        window: `${c.sendingWindowStart} - ${c.sendingWindowEnd}`,
        dailyLimit: c.dailyLimit
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
