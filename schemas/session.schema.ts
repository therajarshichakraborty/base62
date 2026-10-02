import { defineEntity, p } from '@mikro-orm/core';

export const Session = defineEntity({
    name: 'Session',
    tableName: 'sessions',
    properties: {
        sessionToken: p.string().length(255).fieldName('session_token').primary(),
        user: p
            .manyToOne('User' as any)
            .fieldName('user_id')
            .deleteRule('cascade'),
        expires: p.datetime(),
    },
});

export const sessions = Session;
