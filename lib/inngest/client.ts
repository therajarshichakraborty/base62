import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: 'signalist',
    ...(process.env.GEMINI_API_KEY ? { ai: { gemini: { apiKey: process.env.GEMINI_API_KEY } } } : {})
});
