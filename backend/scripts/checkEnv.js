#!/usr/bin/env node
import dotenv from 'dotenv';

dotenv.config();

console.log('Environment variables check:');
console.log('CRON_SECRET:', process.env.CRON_SECRET);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('SMTP_USER:', process.env.SMTP_USER);
