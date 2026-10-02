import { defineConfig } from '@mikro-orm/postgresql';
import { env } from './env';

const config = defineConfig({
    entities: ['schemas/**/*.ts'],
    clientUrl: env.DATABASE_URL,
    migrations: {
        path: './migrations',
    },

    debug: env.NODE_ENV === 'development',
});

export default config;
