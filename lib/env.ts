import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

export const envSchema = z.object({
    DATABASE_URL: z.url().describe('The database url.'),
    NEXT_PUBLIC_BASE_URL: z.url().describe('The base url'),
    NODE_ENV: z.enum(['development', 'production']),
    AUTH_GITHUB_CLIENT_ID: z.string().describe('The github client id'),
    AUTH_GITHUB_CLIENT_SECRET: z.string().describe('The github client secret'),
    AUTH_GOOGLE_CLIENT_ID: z.string().describe('The google client id'),
    AUTH_GOOGLE_CLIENT_SECRET: z.string().describe('The google client secret'),
    AUTH_SECRET: z.string().describe('The auth secret'),
    REDIS_HOST: z.string().describe('The redis host'),
    REDIS_PORT: z.number().describe('The redis port'),
    KAFKA_BROKER: z.string().describe('The kafka broker'),
    KAFKA_TOPIC: z.string().describe('The kafka topic'),
    KAFKA_CLIENT_ID: z.string().describe('The kafka client id'),
    KAFKA_CLIENT_SECRET: z.string().describe('The kafka client secret'),
    EMAIL_HOST: z.string().describe('The email host'),
    EMAIL_PORT: z.number().describe('The email port'),
    EMAIL_USER: z.string().describe('The email user'),
    EMAIL_PASSWORD: z.string().describe('The email password'),
    EMAIL_FROM: z.string().describe('The email from'),
});

const _env = envSchema.parse(process.env);

export const env = {
    DATABASE_URL: _env.DATABASE_URL,
    NEXT_PUBLIC_BASE_URL: _env.NEXT_PUBLIC_BASE_URL,
    NODE_ENV: _env.NODE_ENV,
    AUTH_GITHUB_CLIENT_ID: _env.AUTH_GITHUB_CLIENT_ID,
    AUTH_GITHUB_CLIENT_SECRET: _env.AUTH_GITHUB_CLIENT_SECRET,
    AUTH_GOOGLE_CLIENT_ID: _env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET: _env.AUTH_GOOGLE_CLIENT_SECRET,
    AUTH_SECRET: _env.AUTH_SECRET,
    REDIS_HOST: _env.REDIS_HOST,
    REDIS_PORT: _env.REDIS_PORT,
    KAFKA_BROKER: _env.KAFKA_BROKER,
    KAFKA_TOPIC: _env.KAFKA_TOPIC,
    KAFKA_CLIENT_ID: _env.KAFKA_CLIENT_ID,
    KAFKA_CLIENT_SECRET: _env.KAFKA_CLIENT_SECRET,
    EMAIL_HOST: _env.EMAIL_HOST,
    EMAIL_PORT: _env.EMAIL_PORT,
    EMAIL_USER: _env.EMAIL_USER,
    EMAIL_PASSWORD: _env.EMAIL_PASSWORD,
    EMAIL_FROM: _env.EMAIL_FROM,
};
