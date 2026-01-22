// Complete diagnostic script for email sending system
// Run with: node backend/scripts/diagnoseEmailSystem.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Campaign from '../models/Campaign.js';
import Lead from '../models/Lead.js';
import Job from '../models/Job.js';
import EmailLog from '../models/EmailLog.js';
import EmailTemplate from '../models/EmailTemplate.js';
import User from '../models/User.js';

dotenv.config({ path: './backend/.env' });

const diagnose = async () => {
    try {
        console.log('🔍 STARTING EMAIL SYSTEM DIAGNOSTIC...\n');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // 1. Check Campaigns
        console.log('=== 1. CHECKING CAMPAIGNS ===');
        const campaigns = await Campaign.find();
        console.log(`Total campaigns: ${campaigns.length}`);

        const activeCampaigns = campaigns.filter(c => c.status === 'active');
        console.log(`Active campaigns: ${activeCampaigns.length}`);

        if (activeCampaigns.length === 0) {
            console.log('❌ NO ACTIVE CAMPAIGNS! You need to activate a campaign first.\n');
        } else {
            for (const camp of activeCampaigns) {
                console.log(`\n  Campaign: "${camp.name}"`);
                console.log(`  Status: ${camp.status}`);
                console.log(`  Daily Limit: ${camp.dailyLimit}`);
                console.log(`  Rate Limit: ${camp.rateLimitMinSec}-${camp.rateLimitMaxSec}s`);
            }
        }

        // 2. Check Leads
        console.log('\n=== 2. CHECKING LEADS ===');
        const allLeads = await Lead.find();
        console.log(`Total leads: ${allLeads.length}`);

        const statusCounts = {};
        allLeads.forEach(lead => {
            statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
        });
        console.log('Lead status breakdown:');
        Object.entries(statusCounts).forEach(([status, count]) => {
            console.log(`  ${status}: ${count}`);
        });

        const readyLeads = allLeads.filter(l => l.status === 'READY');
        if (readyLeads.length === 0) {
            console.log('\n❌ NO LEADS IN READY STATUS!');
            console.log('   Leads must be categorized and in READY status to send.');
            console.log('   Run categorization on your leads first!');
        } else {
            console.log(`\n✅ ${readyLeads.length} leads ready to send`);
        }

        // 3. Check Jobs
        console.log('\n=== 3. CHECKING JOBS ===');
        const allJobs = await Job.find().sort({ createdAt: -1 }).limit(20);
        console.log(`Total jobs (last 20): ${allJobs.length}`);

        const jobStatusCounts = {};
        allJobs.forEach(job => {
            jobStatusCounts[job.status] = (jobStatusCounts[job.status] || 0) + 1;
        });
        console.log('Job status breakdown:');
        Object.entries(jobStatusCounts).forEach(([status, count]) => {
            console.log(`  ${status}: ${count}`);
        });

        const pendingJobs = allJobs.filter(j => j.status === 'PENDING');
        if (pendingJobs.length > 0) {
            console.log(`\n✅ ${pendingJobs.length} pending jobs waiting to execute`);
            console.log('Sample pending job:');
            const sample = pendingJobs[0];
            console.log(`  Run at: ${sample.runAt}`);
            console.log(`  Type: ${sample.type}`);
            console.log(`  Attempts: ${sample.attempts}`);
        } else {
            console.log('\n❌ NO PENDING JOBS!');
            console.log('   Jobs should be created when you start a campaign.');
            console.log('   Check if /api/cron/schedule-jobs is being called!');
        }

        // 4. Check Email Templates
        console.log('\n=== 4. CHECKING EMAIL TEMPLATES ===');
        const templates = await EmailTemplate.find();
        console.log(`Total templates: ${templates.length}`);
        if (templates.length === 0) {
            console.log('❌ NO EMAIL TEMPLATES! Create templates first!');
        } else {
            templates.forEach(t => {
                console.log(`  Category: ${t.category}, Subject: ${t.subjectTemplate}`);
            });
        }

        // 5. Check Email Logs
        console.log('\n=== 5. CHECKING EMAIL LOGS (Last 10) ===');
        const logs = await EmailLog.find().sort({ sentAt: -1 }).limit(10);
        console.log(`Total recent logs: ${logs.length}`);
        logs.forEach(log => {
            console.log(`  ${log.sentAt?.toISOString() || 'N/A'} - ${log.recipient} - ${log.status}`);
            if (log.error) {
                console.log(`    Error: ${log.error}`);
            }
        });

        // 6. Check User Configuration
        console.log('\n=== 6. CHECKING USER EMAIL CONFIG ===');
        const user = await User.findOne();
        if (user) {
            console.log(`User: ${user.email}`);
            console.log(`Name: ${user.name}`);
            console.log(`Signature:`, user.signature);
        }

        // 7. Check Environment Variables
        console.log('\n=== 7. CHECKING ENVIRONMENT ===');
        console.log(`SMTP_USER: ${process.env.SMTP_USER ? '✅ Set' : '❌ Missing'}`);
        console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? '✅ Set' : '❌ Missing'}`);
        console.log(`GMAIL_CLIENT_ID: ${process.env.GMAIL_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);

        // 8. Recommendations
        console.log('\n=== 📋 DIAGNOSTIC SUMMARY ===');
        const issues = [];

        if (activeCampaigns.length === 0) issues.push('❌ No active campaigns');
        if (readyLeads.length === 0) issues.push('❌ No leads in READY status');
        if (templates.length === 0) issues.push('❌ No email templates');
        if (pendingJobs.length === 0 && readyLeads.length > 0) issues.push('❌ No jobs created for ready leads');
        if (!process.env.SMTP_USER && !process.env.GMAIL_CLIENT_ID) issues.push('❌ No email credentials configured');

        if (issues.length === 0) {
            console.log('✅ System looks healthy! Check worker logs for runtime errors.');
        } else {
            console.log('Found issues:');
            issues.forEach(issue => console.log(`  ${issue}`));
        }

        await mongoose.disconnect();
        console.log('\n✅ Diagnostic complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Diagnostic error:', error);
        process.exit(1);
    }
};

diagnose();
