import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import EmailTemplate from '../models/EmailTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const templates = await EmailTemplate.find({});
        console.log(`Checking ${templates.length} templates...`);

        let updatedCount = 0;

        for (const t of templates) {
            let body = t.bodyTemplate;
            let originalBody = body;

            // 1. Remove hardcoded signature block with specific braces
            // Matches: <p>Best,<br>{{Aurangzeb Sunny}}...Portfolio: {{...}}</p>
            // We use a broader regex to catch variations of the hardcoded block
            body = body.replace(/<p>Best,<br>\{\{[^}]+\}\}<br>\{\{[^}]+\}\}<br>WhatsApp: \{\{[^}]+\}\}<br>Portfolio: \{\{[^}]+\}\}<\/p>/g, '');

            // Also clean up any "Warm regards,<p>Best..." double artifacts if present
            body = body.replace(/<p>Warm regards,<p>Best,/g, '<p>Warm regards,');

            // 2. Remove hardcoded Reply STOP (various forms)
            body = body.replace(/<p><small>Reply STOP.*?<\/small><\/p>/gi, '');
            body = body.replace(/\n\nReply STOP.*/gi, '');

            // 3. Remove any trailing <p>Best,</p> if it was left dangling
            // But we actually WANT to remove "Best regards" type closers so the system appends the dynamic one
            // The system check is: if (!body.includes('Best regards')) append signature.
            // The hardcoded ones used "Best," or "Kind regards,". 
            // Let's strip those specific hardcoded blocks completely so the system adds the clean specific one.

            if (body !== originalBody) {
                t.bodyTemplate = body;
                await t.save();
                updatedCount++;
                console.log(`Cleaned Template: ${t._id}`);
            }
        }

        console.log(`\nFixed ${updatedCount} templates.`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

fixTemplates();
