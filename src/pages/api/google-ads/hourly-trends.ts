import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

interface Campaign {
    campaignId: string;
}

interface CurrentData {
    avg_cpc: number;
    last_update: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

        // Get all active campaigns
        const campaigns = await prisma.$queryRaw<Campaign[]>`
            SELECT DISTINCT "campaignId"
            FROM "CPCHistory"
            WHERE timestamp >= ${thirtyMinutesAgo}
        `;

        const hourlyTrends: Record<string, any> = {};

        await Promise.all(
            campaigns.map(async ({ campaignId }) => {
                // Get current rolling average (last 15 minutes)
                const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
                const currentData = await prisma.$queryRaw<{ avg_cpc: any, last_update: string }[]>`
                    SELECT 
                        CAST(AVG(cpc) AS FLOAT) as avg_cpc,
                        strftime('%Y-%m-%dT%H:%M:%fZ', MAX(timestamp)) as last_update
                    FROM "CPCHistory"
                    WHERE "campaignId" = ${campaignId}
                    AND timestamp >= ${fifteenMinutesAgo}
                    AND cpc > 0
                    GROUP BY "campaignId"
                `;

                // Get the previous period average (15-30 minutes ago)
                const previousData = await prisma.$queryRaw<{ avg_cpc: any }[]>`
                    SELECT CAST(AVG(cpc) AS FLOAT) as avg_cpc
                    FROM "CPCHistory"
                    WHERE "campaignId" = ${campaignId}
                    AND timestamp >= ${thirtyMinutesAgo}
                    AND timestamp < ${fifteenMinutesAgo}
                    AND cpc > 0
                    GROUP BY "campaignId"
                `;

                const currentCPC = Number(currentData[0]?.avg_cpc || 0);
                const previousCPC = Number(previousData[0]?.avg_cpc || 0);

                // Calculate trend percentage
                const trendPercentage = previousCPC > 0
                    ? Number(((currentCPC - previousCPC) / previousCPC * 100).toFixed(2))
                    : currentCPC > 0 ? 100 : 0;

                // Determine direction with a 2% threshold
                let direction: 'up' | 'down' | 'stable' = 'stable';
                if (Math.abs(trendPercentage) >= 2) {
                    direction = currentCPC > previousCPC ? 'up' : 'down';
                }

                // Only include in trends if we have valid data
                if (currentCPC > 0) {
                    hourlyTrends[campaignId] = {
                        cpc: {
                            current: Number(currentCPC.toFixed(2)),
                            previous: Number(previousCPC.toFixed(2)),
                            trend: trendPercentage,
                            direction
                        },
                        lastUpdated: currentData[0]?.last_update || now.toISOString()
                    };
                }
            })
        );

        return res.status(200).json(hourlyTrends);
    } catch (error) {
        console.error('Error fetching hourly trends:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
} 