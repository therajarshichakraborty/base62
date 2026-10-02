import { defineEntity, p } from '@mikro-orm/core';

export const Account = defineEntity({
    name: 'Account',
    tableName: 'accounts',
    properties: {
        user: p
            .manyToOne('User' as any)
            .fieldName('user_id')
            .deleteRule('cascade'),
        type: p.string().length(255),
        provider: p.string().length(255).primary(),
        providerAccountId: p.string().length(255).fieldName('provider_account_id').primary(),
        refresh_token: p.text().nullable(),
        access_token: p.text().nullable(),
        expires_at: p.integer().nullable(),
        token_type: p.string().length(255).nullable(),
        scope: p.string().length(255).nullable(),
        id_token: p.text().nullable(),
        session_state: p.string().length(255).nullable(),
    },
});

export const accounts = Account;
