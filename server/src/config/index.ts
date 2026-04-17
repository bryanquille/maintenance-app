import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export default {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/maintanance',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};