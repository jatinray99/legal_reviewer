import path from 'path';
import { fileURLToPath } from 'url';
import type { Knex } from 'knex';
import 'dotenv/config'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  },
};

export default config;