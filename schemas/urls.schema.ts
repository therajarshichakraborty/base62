import { defineEntity, p } from '@mikro-orm/core';

export const Urls = defineEntity({
    name: 'Urls',
    tableName: 'urls',
    properties: {
        id: p.integer().primary().autoincrement(),
        originalUrl: p.string().length(2000).fieldName('original_url'),
        shortCode: p.string().length(10).fieldName('short_code').unique(),
        createdAt: p
            .datetime()
            .fieldName('created_at')
            .onCreate(() => new Date()),
        updatedAt: p
            .datetime()
            .fieldName('updated_at')
            .onCreate(() => new Date())
            .onUpdate(() => new Date()),
        clicks: p.integer().default(0),
        user: p
            .manyToOne('User' as any)
            .fieldName('user_id')
            .nullable()
            .deleteRule('set null'),
    },
});

export const urls = Urls;
