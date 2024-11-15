import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getGoogleAdsCustomer } from '@/lib/google-ads';

interface UpdateTCPARequest {
    campaignId: string;
    accountId: string;
    targetCpa: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { campaignId, accountId, targetCpa } = req.body as UpdateTCPARequest;
        const targetCpaMicros = targetCpa * 1_000_000;

        console.log('Processing TCPA update:', { campaignId, accountId, targetCpa, targetCpaMicros });

        const customer = await getGoogleAdsCustomer(session, accountId);

        const operations = [{
            update: {
                resourceName: `customers/${accountId}/campaigns/${campaignId}`,
                maximizeConversions: {
                    targetCpaMicros: targetCpaMicros
                }
            },
            updateMask: {
                paths: ['maximize_conversions.target_cpa_micros']
            }
        }];

        const response = await customer.campaigns.mutate({
            customerId: accountId,
            operations: operations
        });

        console.log('Mutation response:', response);

        res.status(200).json({ success: true, response });
    } catch (error: any) {
        console.error('Error updating Target CPA:', error);
        res.status(500).json({
            error: error.message || 'Failed to update target CPA',
            details: error.errors || [],
            message: 'There was an error updating the campaign target CPA'
        });
    }
}
