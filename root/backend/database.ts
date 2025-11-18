import knex from 'knex';
import config from './knexfile.js';

// Initialize Knex with the 'development' environment config only if DB is configured
let db: any = null;

try {
  if (process.env.PG_HOST && process.env.PG_DATABASE) {
    db = knex(config.development);
    console.log('[DATABASE] PostgreSQL connection initialized');
  } else {
    console.log('[DATABASE] No PostgreSQL configuration found, using in-memory storage');
  }
} catch (error) {
  console.warn('[DATABASE] Failed to initialize database:', error);
  console.log('[DATABASE] Falling back to in-memory storage');
}

// Export the database connection (may be null)
export default db;