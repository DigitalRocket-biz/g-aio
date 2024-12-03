import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getGoogleAdsCustomer } from '@/lib/google-ads';
export const runtime = 'edge';

interface UpdateTROASRequest {
    campaignId: string;
    accountId: string;
    targetRoas: number;
}

// Google Ads API bidding strategy type enum mapping
const BIDDING_STRATEGY_TYPES = {
    0: 'UNSPECIFIED',
    1: 'UNKNOWN',
    2: 'MANUAL_CPC',
    3: 'MANUAL_CPM',
    4: 'MANUAL_CPV',
    5: 'MAXIMIZE_CONVERSIONS',
    6: 'MAXIMIZE_CONVERSION_VALUE',
    7: 'TARGET_CPA',
    8: 'TARGET_IMPRESSION_SHARE',
    9: 'TARGET_ROAS',
    10: 'TARGET_SPEND',
    11: 'PERCENT_CPC',
    12: 'TARGET_CPM'
} as const;

type BiddingStrategyType = keyof typeof BIDDING_STRATEGY_TYPES;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { campaignId, accountId, targetRoas } = req.body as UpdateTROASRequest;

        if (!campaignId || !accountId || targetRoas === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Convert percentage to decimal (e.g., 500% -> 5.0)
        const targetRoasValue = targetRoas / 100;
        console.log('Processing TROAS update:', { campaignId, accountId, targetRoas: targetRoasValue });

        const customer = await getGoogleAdsCustomer(session, accountId);

        // First, get the campaign to check its bidding strategy
        const query = `
            SELECT 
                campaign.id,
                campaign.name,
                campaign.bidding_strategy_type,
                campaign.target_roas.target_roas,
                campaign.maximize_conversion_value.target_roas
            FROM campaign
            WHERE campaign.id = ${campaignId}
        `;

        console.log('Fetching campaign:', { query });
        const [campaign] = await customer.query(query);
        console.log('Campaign details:', campaign);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Get the string representation of the bidding strategy type
        const biddingStrategyTypeNum = campaign.campaign.bidding_strategy_type as BiddingStrategyType;
        const biddingStrategyType = BIDDING_STRATEGY_TYPES[biddingStrategyTypeNum];

        console.log('Bidding strategy:', { numeric: biddingStrategyTypeNum, string: biddingStrategyType });

        // Check if campaign supports Target ROAS updates
        const hasTargetRoas = campaign.campaign.target_roas?.target_roas !== undefined;
        const hasMaxConvValueWithTargetRoas = campaign.campaign.maximize_conversion_value?.target_roas !== undefined;
        const supportsTargetRoas = biddingStrategyType === 'TARGET_ROAS' ||
            biddingStrategyType === 'MAXIMIZE_CONVERSION_VALUE' ||
            hasTargetRoas ||
            hasMaxConvValueWithTargetRoas;

        if (!supportsTargetRoas) {
            return res.status(400).json({
                error: `Campaign does not support Target ROAS updates. Current strategy: ${biddingStrategyType}`
            });
        }

        // Prepare the update based on whether the campaign uses maximize_conversion_value or target_roas
        const updateOperation = {
            resource_name: `customers/${accountId}/campaigns/${campaignId}`,
        } as any;

        // If the campaign has maximize_conversion_value field, use that for the update
        if (hasMaxConvValueWithTargetRoas || biddingStrategyType === 'MAXIMIZE_CONVERSION_VALUE') {
            updateOperation.maximize_conversion_value = {
                target_roas: targetRoasValue.toString()
            };
        } else {
            // Otherwise use target_roas
            updateOperation.target_roas = {
                target_roas: targetRoasValue.toString()
            };
        }

        console.log('Sending update request:', updateOperation);

        const response = await customer.campaigns.update([updateOperation]);

        console.log('Update response:', response);
        res.status(200).json({ success: true, response });
    } catch (error: any) {
        console.error('Error updating Target ROAS:', error);

        // Extract the most relevant error message
        let errorMessage = 'An error occurred while updating the campaign';
        if (error.details?.[0]?.errors?.[0]?.message) {
            errorMessage = error.details[0].errors[0].message;
        } else if (error.errors?.[0]?.message) {
            errorMessage = error.errors[0].message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Include additional error details in development
        const errorResponse = {
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error : undefined
        };

        res.status(500).json(errorResponse);
    }
}