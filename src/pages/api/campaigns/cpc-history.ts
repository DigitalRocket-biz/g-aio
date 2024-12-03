import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
export const runtime = 'edge';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { campaignId, accountId, cpc, cost } = req.body;

        try {
            await prisma.cPCHistory.create({
                data: {
                    campaignId,
                    accountId,
                    cpc,
                    cost,
                }
            });

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to store CPC history' });
        }
    } else if (req.method === 'GET') {
        const { campaignId, hours = 24 } = req.query;

        try {
            const history = await prisma.$queryRaw`
                SELECT 
                    date_trunc('hour', timestamp) as hour,
                    AVG(cpc) as avg_cpc,
                    AVG(cost) as avg_cost
                FROM "CPCHistory"
                WHERE 
                    "campaignId" = ${String(campaignId)}
                    AND timestamp >= ${new Date(Date.now() - Number(hours) * 60 * 60 * 1000)}
                GROUP BY date_trunc('hour', timestamp)
                ORDER BY hour DESC
            `;

            return res.status(200).json(history);
        } catch (error) {
            console.error('CPC History API Error:', error);
            return res.status(500).json({ error: 'Failed to fetch CPC history' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}