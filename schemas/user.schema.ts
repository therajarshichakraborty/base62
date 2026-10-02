import { defineEntity, p } from '@mikro-orm/core';

export const userRoleEnum = ['user', 'admin'] as const;
export type UserRole = (typeof userRoleEnum)[number];

export const User = defineEntity({
    name: 'User',
    tableName: 'users',
    properties: {
        id: p.string().length(255).primary(),
        name: p.string().length(255).nullable(),
        email: p.string().length(255).unique(),
        emailVerified: p.datetime().nullable(),
        image: p.text().nullable(),
        password: p.text().nullable(),
        role: p.enum(['user', 'admin']).default('user'),
        createdAt: p
            .datetime()
            .fieldName('created_at')
            .onCreate(() => new Date()),
        updatedAt: p
            .datetime()
            .fieldName('updated_at')
            .onCreate(() => new Date())
            .onUpdate(() => new Date()),
        urls: p.oneToMany('Urls' as any).mappedBy('user'),
        accounts: p.oneToMany('Account' as any).mappedBy('user'),
        sessions: p.oneToMany('Session' as any).mappedBy('user'),
    },
});

export const users = User;
