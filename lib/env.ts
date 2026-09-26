import dotenv from "dotenv";
dotenv.config()
import { z } from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string().description("Url of the database."),
    NEXT_PUBLIC_BASE_URL: z.url().description("Url of the next app."),
});

const _env = envSchema.parse(process.env);

export const env = {
    DATABASE_URL: _env.DATABASE_URL,
    NEXT_PUBLIC_BASE_URL: _env.NEXT_PUBLIC_BASE_URL,
};