// src/pages/api/chat.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { chatCompletion } from '@/lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { threadId, messages } = req.body;

        const thread = await prisma.thread.findUnique({
            where: { id: threadId }
        });

        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        const response = await chatCompletion(messages, {
            accountId: thread.accountId,
            dateRange: 'LAST_30_DAYS' // Can be made dynamic
        });

        const assistantMessage = await prisma.message.create({
            data: {
                threadId,
                role: 'assistant',
                content: response.content
            }
        });

        res.status(200).json(assistantMessage);
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
}