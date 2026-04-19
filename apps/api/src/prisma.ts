import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is required');
}

const allowInvalidSslCerts = process.env.DB_SSL_ALLOW_INVALID_CERTS === 'true';
const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('supabase.co')
        ? { rejectUnauthorized: !allowInvalidSslCerts }
        : undefined,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export { prisma };
