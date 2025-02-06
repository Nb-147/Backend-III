import dotenv from 'dotenv';
import path from 'path';

const envFile = path.resolve(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development');
dotenv.config({ path: envFile });

dotenv.config({ path: path.resolve(envFile) });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  dbUri: process.env.DB_URI,
};

export default config;