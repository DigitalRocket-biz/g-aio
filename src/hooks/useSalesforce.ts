import { useState, useEffect } from 'react';

export function useSalesforce() {
    const [totalLeads, setTotalLeads] = useState(0);
    const [newAccounts, setNewAccounts] = useState(0);

    const fetchSalesforceData = async () => {
        try {
            const response = await fetch('/api/salesforce/leads');
            const data = await response.json();
            setTotalLeads(data.totalRecords || 0);
            setNewAccounts(data.todayLeads || 0);
        } catch (error) {
            console.error('Error fetching Salesforce data:', error);
        }
    };

    useEffect(() => {
        fetchSalesforceData();
    }, []);

    return { totalLeads, newAccounts, refreshData: fetchSalesforceData };
}