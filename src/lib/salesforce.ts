import * as jsforce from 'jsforce';

const conn = new jsforce.Connection({
    loginUrl: 'https://login.salesforce.com',
    version: '57.0'
});

export async function getSalesforceConnection(): Promise<jsforce.Connection> {
    if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD || !process.env.SALESFORCE_SECURITY_TOKEN) {
        throw new Error('Missing Salesforce credentials in environment variables');
    }

    await conn.login(
        process.env.SALESFORCE_USERNAME,
        `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
    );

    return conn;
}

export async function getTotalAccounts(): Promise<number> {
    try {
        if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD || !process.env.SALESFORCE_SECURITY_TOKEN) {
            throw new Error('Missing Salesforce credentials in environment variables');
        }

        await conn.login(
            process.env.SALESFORCE_USERNAME,
            `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
        );

        const result = await conn.query(
            `SELECT COUNT() FROM Account WHERE Name LIKE '%Harvest Insurance%'`
        );

        console.debug('Total Accounts Query Result:', result);
        return result.totalSize;
    } catch (error) {
        console.error('Error fetching total Salesforce accounts:', error);
        return 0;
    }
}

export async function getTodayNewAccounts(): Promise<number> {
    try {
        if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD || !process.env.SALESFORCE_SECURITY_TOKEN) {
            throw new Error('Missing Salesforce credentials in environment variables');
        }

        await conn.login(
            process.env.SALESFORCE_USERNAME,
            `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await conn.query(
            `SELECT COUNT() FROM Account WHERE CreatedDate >= ${today.toISOString()} AND Name LIKE '%Harvest Insurance%'`
        );

        console.debug('Today New Accounts Query Result:', result);
        return result.totalSize;
    } catch (error) {
        console.error('Error fetching Salesforce accounts:', error);
        return 0;
    }
}