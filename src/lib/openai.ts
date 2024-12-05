// src/lib/openai.ts

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 3,
    timeout: 30000
});

const SYSTEM_PROMPT = `You are an expert Google Ads assistant. You have access to the following ad accounts:
- Wright's Lights (ID: ${process.env.WRIGHTS_LIGHTS_ID})
- Harvest Insurance (ID: ${process.env.HARVEST_INSURANCE_ID})
- Neal Roofing (ID: ${process.env.NEAL_ROOFING_ID})

You can help analyze campaign data, suggest optimizations, and execute queries to fetch specific metrics.
When data is requested, use the appropriate account ID and format your response clearly.

Example queries you can handle:
1. "Show me Wright's Lights performance for last month"
2. "Compare CTR across all accounts"
3. "What's the best performing campaign for Neal Roofing?"

Format your responses with clear headings and metrics when presenting data.`;

export async function chatCompletion(
    messages: ChatCompletionMessageParam[],
    threadContext?: { accountId?: string; dateRange?: string }
) {
    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...(threadContext ? [{
                    role: 'system' as const,
                    content: `Current context: Account ${threadContext.accountId}, Date range: ${threadContext.dateRange}`
                }] : []),
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        return completion.choices[0].message;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate response');
    }
}