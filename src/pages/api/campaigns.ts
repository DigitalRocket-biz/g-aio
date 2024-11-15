// src/pages/api/campaigns.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getCampaignStats } from '@/lib/google-ads';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions) as Session & {
            refreshToken?: string;
            accessToken?: string;
        };

        if (!session) {
            return res.status(401).json({
                error: 'Authentication required',
                redirect: '/auth/signin'
            });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { dateRange, accountIds, bypassCheck } = req.body;

        if (!bypassCheck && (!accountIds || accountIds.length === 0)) {
            return res.status(400).json({
                error: 'At least one Account ID is required. Please select an account.'
            });
        }

        if (bypassCheck && (!accountIds || accountIds.length === 0)) {
            return res.status(200).json([]);
        }

        const campaignsResults = await Promise.all(
            accountIds.map(async (accountId: string) => {
                const campaigns = await getCampaignStats(session, accountId, dateRange);
                return campaigns.map(campaign => ({
                    ...campaign,
                    accountId
                }));
            })
        );

        const allCampaigns = campaignsResults.flat();
        res.status(200).json(allCampaigns);
    } catch (error: any) {
        console.error('Campaigns API Error:', error);
        res.status(500).json({ error: error.message });
    }
}