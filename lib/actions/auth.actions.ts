'use server';
//@ts-nocheck
import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";
import { connectToDatabase } from "@/database/mongoose";

export const signUpWithEmail = async ({
    email,
    password,
    fullName,
    country,
    investmentGoals,
    riskTolerance,
    preferredIndustry
}: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: { email, password, name: fullName },
            headers: await headers()
        });

        if (response) {
            try {
                const mongoose = await connectToDatabase();
                const db = mongoose.connection.db;
                if (db) {
                    await db.collection('user').updateOne(
                        { email },
                        { $set: { country, investmentGoals, riskTolerance, preferredIndustry } }
                    );
                }
            } catch (dbErr) {
                console.warn('Failed to update extended user profile fields:', dbErr);
            }

            try {
                await inngest.send({
                    name: 'app/user.created',
                    data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
                });
            } catch (inngestError: any) {
                console.log('Inngest welcome event skipped (no key configured in local dev)');
            }
        }

        return { success: true, data: response };
    } catch (e: any) {
        console.error('Sign up failed:', e);
        return {
            success: false,
            error: e?.message || e?.body?.message || 'Sign up failed. User may already exist.'
        };
    }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        //@ts-ignore
        const response = await auth.api.signInEmail({
            body: { email, password },
            headers: await headers()
        });
        return { success: true, data: response };
    } catch (e: any) {
        console.error('Sign in failed:', e);
        return {
            success: false,
            error: e?.message || e?.body?.message || 'Invalid email or password.'
        };
    }
};

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
        return { success: true };
    } catch (e) {
        console.error('Sign out failed:', e);
        return { success: false, error: 'Sign out failed' };
    }
};
