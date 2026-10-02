import { z } from 'zod';

export const urlSchema = z.object({
    url: z.string().url('Please enter a valid URL'),
});

export type UrlFormData = z.infer<typeof urlSchema>;

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

export type Url = {
    id: number;
    originalUrl: string;
    shortCode: string;
    createdAt: string;
    updatedAt: string;
    clicks: number;
};
