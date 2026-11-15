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
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      query_timeout: 25000,
      statement_timeout: 25000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });

    // Prevent unhandled pool-level errors from crashing the application
    global._postgresPool.on('error', (err) => {
      console.warn('[Cloud SQL] Idle pool client notice:', err?.message || err);
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
 * (e.g. Cloud SQL scale-to-zero wake up, connection timeouts, idle TCP resets, or proxy reconnects).
 */
export async function withDbRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMsg = `${error?.message || ''} ${error?.cause?.message || ''}`.toLowerCase();
      const errorCode = String(error?.code || error?.cause?.code || '');
      const isTransientConnectionError =
        errorMsg.includes('connection terminated') ||
        errorMsg.includes('connection timeout') ||
        errorMsg.includes('timeout expired') ||
        errorMsg.includes('closed connection') ||
        errorMsg.includes('socket hang up') ||
        errorMsg.includes('too many clients') ||
        errorCode === 'ECONNRESET' ||
        errorCode === 'ETIMEDOUT' ||
        errorCode === 'ECONNREFUSED' ||
        errorCode === 'ENOTFOUND' ||
        errorCode === '57P01' || // admin_shutdown
        errorCode === '57P03' || // cannot_connect_now (DB starting up)
        errorCode === '08006' || // connection_failure
        errorCode === '08001';   // sqlclient_unable_to_establish_sqlconnection

      if (attempt < retries && isTransientConnectionError) {
        const delayMs = 600 * Math.pow(2, attempt);
        console.warn(`[Cloud SQL] Transient DB wake-up/timeout caught (attempt ${attempt + 1}/${retries}). Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}
