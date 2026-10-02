import { defineEntity, p } from '@mikro-orm/core';

export const Urls = defineEntity({
    name: 'Urls',
    properties: {
        id: p.integer().primary().autoincrement(),
        originalUrl: p.string(),
        shortCode: p.string().unique(),
        createdAt: p.datetime().onCreate(() => new Date()),
        updatedAt: p
            .datetime()
            .onCreate(() => new Date())
            .onUpdate(() => new Date()),
        clicks: p.integer().default(0),
    },
});
