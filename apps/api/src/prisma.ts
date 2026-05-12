import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is required');
}

let parsedConnectionString: URL;
try {
    parsedConnectionString = new URL(connectionString);
} catch {
    throw new Error(
        'DATABASE_URL is not a valid URL. Use a full Postgres connection string (postgres:// or postgresql://).'
    );
}
const hostname = parsedConnectionString.hostname.toLowerCase();
const isSupabaseHost =
    hostname.endsWith('.supabase.co') || hostname.endsWith('.supabase.com');
const usesSslModeRequire =
    parsedConnectionString.searchParams.get('sslmode') === 'require';
const shouldConfigureSsl = isSupabaseHost || usesSslModeRequire;
const allowInvalidSslCerts =
    process.env.DB_SSL_ALLOW_INVALID_CERTS === 'true' ||
    (!process.env.DB_SSL_ALLOW_INVALID_CERTS && isSupabaseHost);

// pg treats sslmode in the URL as authoritative and can override the `ssl` object.
// Remove sslmode when we explicitly configure TLS options below.
if (shouldConfigureSsl) {
    parsedConnectionString.searchParams.delete('sslmode');
}

const pool = new Pool({
    connectionString: parsedConnectionString.toString(),
    ssl: shouldConfigureSsl ? { rejectUnauthorized: !allowInvalidSslCerts } : undefined,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export { prisma };
