import NextAuth, { getServerSession } from 'next-auth';
import { authConfig, authOptions } from './auth.config';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

const nextAuthHandler = NextAuth(authOptions);

export const handler = nextAuthHandler;

export const handlers = {
    GET: nextAuthHandler,
    POST: nextAuthHandler,
};

export const { GET, POST } = handlers;

export async function auth() {
    return await getServerSession(authOptions);
}

export const signIn = nextAuthSignIn;
export const signOut = nextAuthSignOut;

export { authConfig, authOptions };
export default nextAuthHandler;
