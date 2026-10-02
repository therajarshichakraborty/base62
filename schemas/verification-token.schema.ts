import { defineEntity, p } from '@mikro-orm/core';

export const VerificationToken = defineEntity({
    name: 'VerificationToken',
    tableName: 'verification_token',
    properties: {
        identifier: p.string().length(255).primary(),
        token: p.string().length(255).primary(),
        expires: p.datetime(),
    },
});

export const verificationTokens = VerificationToken;
