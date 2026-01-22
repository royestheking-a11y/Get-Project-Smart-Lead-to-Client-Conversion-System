import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try both methods
console.log('Method 1: dotenv.config()');
dotenv.config();
console.log('CRON_SECRET:', process.env.CRON_SECRET);

console.log('\nMethod 2: dotenv.config({ path })');
dotenv.config({ path: join(__dirname, '.env') });
console.log('CRON_SECRET:', process.env.CRON_SECRET);

console.log('\nFile path:', join(__dirname, '.env'));
