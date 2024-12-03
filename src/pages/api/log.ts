import { NextApiRequest, NextApiResponse } from 'next';
export const runtime = 'edge';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { event, account, action } = req.body;

        // Log to server console
        console.log('[Account Selection]', {
            timestamp: new Date().toISOString(),
            event,
            account,
            action
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Logging error:', error);
        res.status(500).json({ error: 'Failed to log event' });
    }
} 