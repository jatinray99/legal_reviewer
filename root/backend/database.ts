import knex from 'knex';
import config from './knexfile';

// Initialize Knex with the 'development' environment config
const db = knex(config.development);

// Export the database connection
export default db;