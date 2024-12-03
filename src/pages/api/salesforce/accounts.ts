import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { getSalesforceConnection } from '../../../lib/salesforce';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || session.user?.email !== 'william@digitalrocket.biz') {
            return res.status(401).json({ message: 'Only authorized Harvest Insurance users can access this data' });
        }

        const { dateRange } = req.body;
        const conn = await getSalesforceConnection();

        // Handle date range
        let startDate = startOfDay(new Date());
        let endDate = endOfDay(new Date());

        switch (dateRange) {
            case 'YESTERDAY':
                startDate = startOfDay(subDays(new Date(), 1));
                endDate = endOfDay(subDays(new Date(), 1));
                break;
            case 'LAST_7_DAYS':
                startDate = startOfDay(subDays(new Date(), 7));
                break;
            case 'THIS_MONTH':
                startDate = startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
                break;
            // default is TODAY, already set
        }

        // Format dates for Salesforce SOQL
        const formatDateForSalesforce = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        // Query for total accounts in date range
        const totalAccountsQuery = `
            SELECT COUNT(Id) total 
            FROM Account 
            WHERE CreatedDate >= ${formatDateForSalesforce(startDate)}
            AND CreatedDate <= ${formatDateForSalesforce(endDate)}
            AND RecordType.DeveloperName = 'Individual_Account_Suspect_Prospect'
            AND Type = 'Prospect'
        `;

        // Query for today's accounts
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        const todayQuery = `
            SELECT COUNT(Id) total 
            FROM Account 
            WHERE CreatedDate >= ${formatDateForSalesforce(todayStart)}
            AND CreatedDate <= ${formatDateForSalesforce(todayEnd)}
            AND RecordType.DeveloperName = 'Individual_Account_Suspect_Prospect'
            AND Type = 'Prospect'
        `;

        // Query for yesterday's accounts
        const yesterdayStart = startOfDay(subDays(new Date(), 1));
        const yesterdayEnd = endOfDay(subDays(new Date(), 1));
        const yesterdayQuery = `
            SELECT COUNT(Id) total 
            FROM Account 
            WHERE CreatedDate >= ${formatDateForSalesforce(yesterdayStart)}
            AND CreatedDate <= ${formatDateForSalesforce(yesterdayEnd)}
            AND RecordType.DeveloperName = 'Individual_Account_Suspect_Prospect'
            AND Type = 'Prospect'
        `;

        console.log('Date ranges:', {
            startDate: formatDateForSalesforce(startDate),
            endDate: formatDateForSalesforce(endDate),
            todayStart: formatDateForSalesforce(todayStart),
            todayEnd: formatDateForSalesforce(todayEnd),
            yesterdayStart: formatDateForSalesforce(yesterdayStart),
            yesterdayEnd: formatDateForSalesforce(yesterdayEnd)
        });

        console.log('Executing queries:', {
            totalAccountsQuery,
            todayQuery,
            yesterdayQuery
        });

        const [totalResults, todayResults, yesterdayResults] = await Promise.all([
            conn.query(totalAccountsQuery),
            conn.query(todayQuery),
            conn.query(yesterdayQuery)
        ]);

        console.log('Query results:', {
            totalResults: totalResults.records[0],
            todayResults: todayResults.records[0],
            yesterdayResults: yesterdayResults.records[0]
        });

        const response = {
            totalQualified: totalResults.records[0].total,
            todayAccounts: todayResults.records[0].total,
            yesterdayAccounts: yesterdayResults.records[0].total
        };

        console.log('API Response:', response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching Salesforce data:', error);
        res.status(500).json({ message: 'Error fetching Salesforce data' });
    }
}