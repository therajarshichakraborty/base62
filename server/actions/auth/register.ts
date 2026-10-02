'use server';

import { ApiResponse } from '@/lib/types';
import { getOrm } from '@/server/auth.config';
import { User } from '@/schemas/user.schema';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function registerUser(formData: FormData): Promise<ApiResponse<{ userId: string }>> {
    try {
        const validatedFields = registerSchema.safeParse({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        });

        if (!validatedFields.success) {
            return {
                success: false,
                error:
                    validatedFields.error.flatten().fieldErrors.email?.[0] ||
                    validatedFields.error.flatten().fieldErrors.password?.[0] ||
                    validatedFields.error.flatten().fieldErrors.name?.[0] ||
                    'Invalid data',
            };
        }

        const { name, email, password } = validatedFields.data;

        const ormInstance = await getOrm();
        const em = ormInstance.em.fork();

        const existingUser = await em.findOne(User, {
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return {
                success: false,
                error: 'A user with this email already exists',
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = nanoid();

        const newUser = em.create(User, {
            id: userId,
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'user',
        });

        em.persist(newUser);
        await em.flush();

        return {
            success: true,
            data: { userId },
        };
    } catch (error) {
        console.error('Register user error:', error);
        return {
            success: false,
            error: 'An error occurred. Please try again.',
        };
    }
}
