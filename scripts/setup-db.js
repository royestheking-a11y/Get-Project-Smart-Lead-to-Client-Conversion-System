import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

// Connection string provided by the user
const connectionString = 'postgresql://postgres:625691878Sunny@db.mgsbkiyoehbbozoeqewu.supabase.co:5432/postgres';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        await client.connect();
        console.log('Connected to Supabase database successfully.');

        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Reading schema.sql...');

        // Split the SQL file into individual statements to execute them
        // This is a naive split, but schema.sql is well formatted with semicolons
        // We just want to execute the whole block. pg can often handle multiple statements.

        console.log('Executing schema migration...');
        await client.query(schemaSql);

        console.log('Schema migration completed successfully!');
    } catch (err) {
        console.error('Error executing schema migration:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
