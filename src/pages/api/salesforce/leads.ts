import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import jsforce from 'jsforce';

// Update the interface to match the actual Salesforce report response
interface FactMap {
    aggregates: Array<{
        label: string;
        value: number;
    }>;
    rows: Array<any>;
}

interface ReportExecuteResult {
    factMap: {
        [key: string]: FactMap;
    };
    reportMetadata: {
        id: string;
        name: string;
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session || session.user?.email !== 'william@digitalrocket.biz') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const conn = new jsforce.Connection({
            loginUrl: 'https://login.salesforce.com',
            version: '57.0'
        });

        await conn.login(
            process.env.SALESFORCE_USERNAME!,
            `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
        );

        // Use the known report ID
        const reportId = '00OUY000000O9qA2AS';
        console.debug('Using Report ID:', reportId);

        // Execute the report with proper typing
        const result = await conn.analytics.report(reportId).execute({
            details: true
        }) as ReportExecuteResult;

        // Get total records from the report, safely accessing nested properties
        const totalRecords = Object.values(result.factMap)
            .reduce((count, factMap) => count + (factMap.rows?.length || 0), 0);

        console.debug('Salesforce Report Result:', {
            reportId,
            reportName: result.reportMetadata?.name,
            totalRecords
        });

        res.status(200).json({
            success: true,
            totalRecords,
            reportName: result.reportMetadata?.name
        });

    } catch (error: any) {
        console.error('Error fetching Salesforce report:', error);
        res.status(500).json({
            error: 'Failed to fetch report data',
            message: error.message,
            errorCode: error.errorCode,
            details: error.stack
        });
    }
}
