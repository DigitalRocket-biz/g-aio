// src/pages/api/campaigns.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getCampaignStats } from '@/lib/google-ads';
import { getLSAStats } from '@/lib/lsa';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Session } from 'next-auth';
import { prisma } from '@/lib/db';
export const runtime = 'edge';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { dateRange, accountIds, isLSAEnabled } = req.body;
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        console.log('📅 Date Range:', dateRange);
        console.log('🏢 Account IDs:', accountIds);
        console.log('🔄 LSA Enabled:', isLSAEnabled);

        // Get regular campaign stats
        const campaignsResults = await Promise.all(
            accountIds.map((accountId: string) =>
                getCampaignStats(session, accountId, dateRange)
            )
        );

        let allCampaigns = campaignsResults.flat();
        let lsaMetrics = null;

        // Fetch LSA data if enabled
        if (isLSAEnabled) {
            lsaMetrics = await getLSAStats(session, dateRange);
            allCampaigns.push({
                id: 'lsa-harvest',
                name: 'Harvest LSA',
                status: 'ENABLED',
                cost: lsaMetrics.totalSpend,
                clicks: 0, // LSA doesn't track clicks
                conversions: lsaMetrics.totalLeads,
                impressions: 0, // LSA doesn't track impressions
                date: new Date().toISOString(),
                accountId: process.env.HARVEST_LSA_ID,
                cpc: 0,
                cpcTrend: {
                    currentValue: 0,
                    previousValue: 0,
                    direction: 'stable',
                    lastUpdated: new Date().toISOString()
                },
                conversionActions: [
                    {
                        name: 'Message Leads',
                        value: lsaMetrics.messageLeads,
                        category: 'LSA'
                    },
                    {
                        name: 'Call Leads',
                        value: lsaMetrics.callLeads,
                        category: 'LSA'
                    }
                ]
            });
        }

        console.log(`📈 Total Campaigns Found: ${allCampaigns.length}`);

        // Store CPC history for non-LSA campaigns
        await Promise.all(allCampaigns
            .filter(campaign => campaign.id !== 'lsa-harvest')
            .map(campaign =>
                prisma.cPCHistory.create({
                    data: {
                        campaignId: campaign.id,
                        accountId: campaign.accountId || '',
                        cpc: campaign.cpc || 0,
                        cost: campaign.cost || 0,
                    }
                })
            )
        );

        res.status(200).json({
            campaigns: allCampaigns,
            lsaMetrics
        });
    } catch (error: any) {
        console.error('❌ Campaigns API Error:', error);
        res.status(500).json({ error: error.message });
    }
}