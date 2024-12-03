import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getTodayNewAccounts, getTotalAccounts } from '@/utils/salesforce';
export const runtime = 'edge';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session || session.user?.email !== 'william@digitalrocket.biz') {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Only authorized Harvest Insurance users can access this data'
            });
        }

        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD || !process.env.SALESFORCE_SECURITY_TOKEN) {
            return res.status(500).json({
                error: 'Configuration Error',
                message: 'Missing Salesforce credentials in environment variables'
            });
        }

        const [count, totalAccounts] = await Promise.all([
            getTodayNewAccounts(),
            getTotalAccounts()
        ]);

        console.debug('API Response:', { count, totalAccounts });
        res.status(200).json({ count, totalAccounts, timestamp: new Date().toISOString() });
    } catch (error: any) {
        console.error('Salesforce API Error:', error);
        res.status(500).json({
            error: 'Server Error',
            message: error.message || 'Failed to fetch Salesforce data',
            timestamp: new Date().toISOString()
        });
    }
}