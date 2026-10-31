import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Function to create or retrieve the connection pool.
export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 30000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });

    // Prevent unhandled pool-level errors from crashing the application
    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });

/**
 * Resilient query executor that transparently retries transient connection drops
 * (e.g. Cloud SQL scale-to-zero wake up, idle TCP timeouts, or proxy reconnects).
 */
export async function withDbRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = String(error?.message || error?.cause?.message || '');
    const isTransientConnectionError =
      errorMsg.includes('Connection terminated unexpectedly') ||
      errorMsg.includes('Connection terminated') ||
      errorMsg.includes('closed connection') ||
      errorMsg.includes('socket hang up') ||
      error?.code === 'ECONNRESET' ||
      error?.code === '57P01'; // admin_shutdown

    if (retries > 0 && isTransientConnectionError) {
      console.warn('[Cloud SQL] Transient connection termination caught. Retrying query after brief delay...');
      await new Promise((r) => setTimeout(r, 250));
      return await fn();
    }
    throw error;
  }
}
