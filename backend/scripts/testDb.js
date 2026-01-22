import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

console.log('Testing MongoDB Connection...');
console.log('URI:', uri ? uri.replace(/:([^:@]{1,})@/, ':****@') : 'Undefined');

if (!uri) {
    console.error('❌ MONGODB_URI is missing in .env');
    process.exit(1);
}

try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connection Successful!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    await mongoose.connection.close();
    process.exit(0);
} catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
}
