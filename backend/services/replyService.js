import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import Lead from '../models/Lead.js';
import EmailLog from '../models/EmailLog.js';
import Campaign from '../models/Campaign.js';
import Job from '../models/Job.js';

const config = {
    imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        host: process.env.IMAP_HOST || 'imap.gmail.com',
        port: parseInt(process.env.IMAP_PORT) || 993,
        tls: process.env.IMAP_TLS === 'true',
        tlsOptions: { rejectUnauthorized: false }, // Add this to handle self-signed certs
        authTimeout: 10000
    }
};

export const checkReplies = async () => {
    let connection;
    const stats = {
        checked: 0,
        found: 0,
        updated: 0,
        errors: []
    };

    try {
        console.log('Connecting to IMAP...');
        connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        // Search specifically for UNSEEN messages to save bandwidth
        // OR search for recent messages if we want to be thorough.
        // For now, let's search for UNSEEN to verify "new" replies.
        // We can also search 'ALL' but limit by date if needed.
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false // Keep as unseen until we process? Or mark seen? Let's leave them unseen for the user to read.
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`Found ${messages.length} unseen messages.`);
        stats.checked = messages.length;

        for (const message of messages) {
            try {
                const headerPart = message.parts.find(p => p.which === 'HEADER');
                const header = headerPart.body;

                // Parse From address
                const fromHeader = header.from ? header.from[0] : '';
                // Extract email from "Name <email@example.com>" or "email@example.com"
                const fromEmailMatch = fromHeader.match(/<(.+)>/) || [null, fromHeader];
                const fromEmail = fromEmailMatch[1] ? fromEmailMatch[1].trim().toLowerCase() : '';

                // Check if it's a bounce/failure notification
                const isBounce = /mailer-daemon|postmaster/i.test(fromEmail) ||
                    /delivery status|failure|returned|undeliverable/i.test(header.subject ? header.subject[0] : '');

                if (isBounce) {
                    console.log(`Potential bounce detected from: ${fromEmail}`);

                    // Parse body to find original recipient
                    // This is heuristic-based; varied formats exist.
                    // We look for email patterns in the body.
                    const textBody = message.parts.find(p => p.which === 'TEXT')?.body || '';
                    const fullBody = JSON.stringify(textBody); // simple way to search string

                    // Attempt to find email addresses in the body
                    // We'll search for the emails of our active leads to see if any match.
                    // This is inefficient for huge DBs, but for single user it's okay?
                    // Better: extract emails from text, check if they are in our DB.

                    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
                    const foundEmails = fullBody.match(emailRegex) || [];
                    const uniqueEmails = [...new Set(foundEmails.map(e => e.toLowerCase()))];

                    for (const email of uniqueEmails) {
                        const lead = await Lead.findOne({
                            email: email,
                            status: { $in: ['SENT', 'FOLLOWUP_1_SENT', 'FOLLOWUP_2_SENT'] }
                        });

                        if (lead) {
                            console.log(`Bounce confirmed for Lead: ${lead.email} (${lead._id})`);

                            lead.status = 'BOUNCED';
                            await lead.save();

                            // Cancel future jobs
                            await Job.updateMany(
                                { leadId: lead._id, status: 'PENDING' },
                                { status: 'CANCELLED', lastError: 'Email Bounced' }
                            );

                            await EmailLog.create({
                                campaignId: lead.campaignId,
                                leadId: lead._id,
                                type: 'bounce_received',
                                status: 'bounced',
                                subject: header.subject ? header.subject[0] : 'Bounce Notification',
                                body: 'Bounce detected via IMAP',
                                sentAt: new Date()
                            });

                            stats.updated++;
                        }
                    }
                    continue; // Skip reply check if it was a bounce
                }

                if (!fromEmail) continue;

                stats.found++;

                // Find leads with this email who are currently in SENT/FOLLOWUP status
                // We only care about leads that are actively being contacted
                const lead = await Lead.findOne({
                    email: fromEmail,
                    status: { $in: ['SENT', 'FOLLOWUP_1_SENT', 'FOLLOWUP_2_SENT'] },
                    doNotContact: false
                });

                if (lead) {
                    console.log(`Reply detected from Lead: ${lead.email} (${lead._id})`);

                    // Mark lead as REPLIED
                    lead.status = 'REPLIED';
                    await lead.save();

                    // Cancel any pending followup jobs for this lead
                    await Job.updateMany(
                        {
                            leadId: lead._id,
                            status: 'PENDING'
                        },
                        {
                            status: 'CANCELLED',
                            lastError: 'Reply detected'
                        }
                    );

                    // Log the reply detection
                    await EmailLog.create({
                        campaignId: lead.campaignId,
                        leadId: lead._id,
                        type: 'reply_received',
                        status: 'replied',
                        subject: header.subject ? header.subject[0] : 'Reply Received',
                        body: 'Reply detected via IMAP',
                        sentAt: new Date()
                    });

                    stats.updated++;
                }
            } catch (err) {
                console.error('Error processing message:', err);
                stats.errors.push(err.message);
            }
        }

    } catch (error) {
        console.error('IMAP Error:', error);
        throw error;
    } finally {
        if (connection) {
            try {
                connection.end();
            } catch (err) {
                console.error('Error closing IMAP connection:', err);
            }
        }
    }

    return stats;
};
