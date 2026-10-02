import type { NextAuthOptions, DefaultSession, User as NextAuthUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { User } from '@/schemas/user.schema';

// extend the types to include id and role
declare module 'next-auth' {
    interface User {
        id?: string;
        role?: 'user' | 'admin' | string;
    }

    interface Session {
        user: {
            id: string;
            role?: 'user' | 'admin' | string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        role?: 'user' | 'admin' | string;
    }
}

export type NextAuthConfig = NextAuthOptions;

let cachedOrm: any = null;

export async function getOrm() {
    if (cachedOrm) return cachedOrm;

    const globalForOrm = globalThis as unknown as { orm: any };
    if (globalForOrm.orm) {
        cachedOrm = globalForOrm.orm;
        return cachedOrm;
    }

    try {
        const ormModule = await import('@/lib/orm');
        if (ormModule.orm) {
            cachedOrm = ormModule.orm;
            return cachedOrm;
        }
    } catch {
        // If lib/orm couldn't be loaded (e.g. strict env validation in development),
        // initialize directly using MikroORM
    }

    const { MikroORM } = await import('@mikro-orm/postgresql');
    const { Urls, Account, Session, VerificationToken } = await import('@/schemas');

    cachedOrm = await MikroORM.init({
        entities: [User, Urls, Account, Session, VerificationToken],
        clientUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/base62',
        debug: process.env.NODE_ENV === 'development',
    });

    if (process.env.NODE_ENV !== 'production') {
        globalForOrm.orm = cachedOrm;
    }

    return cachedOrm;
}

export function authorized({
    auth,
    request: { nextUrl },
}: {
    auth?: { user?: { role?: string } | null } | null;
    request: { nextUrl: { pathname: string } };
}) {
    const isLoggedIn = !!auth?.user;
    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    const isOnAdmin = nextUrl.pathname.startsWith('/admin');

    if (isOnAdmin) {
        return isLoggedIn && auth?.user?.role === 'admin';
    } else if (isOnDashboard) {
        return isLoggedIn;
    }
    return true;
}

export const authOptions: NextAuthOptions = {
    secret:
        process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'development-auth-secret-key-change-in-production',
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/login',
        verifyRequest: '/verify-request',
        newUser: '/register',
    },
    callbacks: {
        jwt: async ({ token, user }: { token: JWT; user?: NextAuthUser }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }: { session: any; token: JWT }) => {
            if (token && session.user) {
                session.user.id = (token.id as string) || (token.sub as string);
                session.user.role = token.role;
            }
            return session;
        },
        signIn: async ({ user, account }) => {
            if (account && (account.provider === 'github' || account.provider === 'google')) {
                if (user.email) {
                    try {
                        const ormInstance = await getOrm();
                        const em = ormInstance.em.fork();
                        let existingUser = await em.findOne(User, {
                            email: user.email.toLowerCase(),
                        });

                        if (!existingUser) {
                            existingUser = em.create(User, {
                                email: user.email.toLowerCase(),
                                name: user.name || user.email.split('@')[0],
                            });
                            em.persist(existingUser);
                            await em.flush();
                        }

                        user.id = String(existingUser.id);
                    } catch (error) {
                        console.error('Error saving OAuth user in MikroORM:', error);
                    }
                }
            }
            return true;
        },
    },
    providers: [
        GithubProvider({
            clientId: process.env.AUTH_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'example@example.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;

                try {
                    const ormInstance = await getOrm();
                    const em = ormInstance.em.fork();

                    const user = await em.findOne(User, { email: email.toLowerCase() });
                    if (!user) return null;

                    let userPassword = (user as any).password;
                    let userRole = (user as any).role || 'user';
                    let userImage = (user as any).image;

                    // If password was not defined on EntitySchema properties, check raw columns
                    if (!userPassword) {
                        try {
                            const rawResult = (await em.execute(
                                'SELECT password, role, image FROM "user" WHERE email = ? LIMIT 1',
                                [email.toLowerCase()]
                            )) as any[];
                            if (rawResult && rawResult.length > 0) {
                                userPassword = rawResult[0].password;
                                if (rawResult[0].role) userRole = rawResult[0].role;
                                if (rawResult[0].image) userImage = rawResult[0].image;
                            }
                        } catch {
                            // Ignore if raw column is not present
                        }
                    }

                    if (!userPassword) return null;

                    const passwordsMatch = await bcrypt.compare(password, userPassword);
                    if (!passwordsMatch) return null;

                    return {
                        id: String(user.id),
                        email: user.email,
                        name: user.name,
                        image: userImage ?? null,
                        role: userRole,
                    };
                } catch (error) {
                    console.error('Authorize error with MikroORM:', error);
                    return null;
                }
            },
        }),
    ],
};

export const authConfig = authOptions;
