import path from 'path';
import type { Knex } from 'knex';
import 'dotenv/config'; 

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST , 
      port: Number(process.env.PG_PORT),   
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
    },
    // NOTE: 'useNullAsDefault: true' is a SQLite-specific option.
    // It is not needed (or recognized) by the PostgreSQL driver.
  },

  // You can add a production config later, which often uses a single connection string
  // production: {
  //   client: 'pg',
  //   connection: process.env.DATABASE_URL, // e.g., 'postgres://user:pass@host:port/db'
  //   migrations: {
  //     directory: path.resolve(__dirname, 'migrations'),
  //   },
  // }
};

export default config;