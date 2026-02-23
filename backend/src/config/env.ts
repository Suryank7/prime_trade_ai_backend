import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required().description('PostgreSQL connection string'),
    REDIS_URL: Joi.string().required().description('Redis connection string'),
    JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
    JWT_EXPIRES_IN: Joi.string().required().description('JWT Expiry time'),
    JWT_REFRESH_SECRET: Joi.string().required().description('JWT Refresh Secret Key'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().required().description('JWT Refresh Expiry time'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  DATABASE_URL: envVars.DATABASE_URL,
  REDIS_URL: envVars.REDIS_URL,
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: envVars.JWT_REFRESH_EXPIRES_IN,
};
