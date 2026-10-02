'use server';

import { z } from 'zod';
import { orm } from '@/lib/orm';
import { Urls } from '@/schemas/urls.schema';
import { nanoid } from 'nanoid';
import { ensureHttps } from '@/lib/utils';

export const urlShortenSchema = z.object({
    url: z.url('Please enter a valid URL'),
});

export async function shortenUrl(formData: FormData) {
    try {
        const rawUrl = formData.get('url');
        const url = typeof rawUrl === 'string' ? rawUrl.trim() : '';

        const validatedFields = urlShortenSchema.safeParse({
            url,
        });

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.flatten().fieldErrors.url?.[0] || 'Invalid URL',
            };
        }

        const originalUrl = ensureHttps(validatedFields.data.url);
        const shortCode = nanoid(6);

        const em = orm.em.fork();
        const existingUrl = await em.findOne(Urls, { originalUrl });

        if (existingUrl) {
            return {
                success: true,
                data: existingUrl,
            };
        }

        const newUrl = em.create(Urls, {
            originalUrl,
            shortCode,
            clicks: 0,
        });

        em.persist(newUrl);
        await em.flush();

        return {
            success: true,
            data: newUrl,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        };
    }
}
