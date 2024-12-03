import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface SalesforceData {
    totalQualified: number;
    todayAccounts: number;
    yesterdayAccounts: number;
}

export function useSalesforce(dateRange?: string) {
    const { data: session, status } = useSession();
    const [totalQualified, setTotalQualified] = useState(0);
    const [newAccounts, setNewAccounts] = useState(0);
    const [yesterdayAccounts, setYesterdayAccounts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastFetchedRangeRef = useRef<string | null>(null);

    const fetchSalesforceData = useCallback(async (range?: string) => {
        const currentRange = range || dateRange || 'TODAY';

        if (!session || status !== 'authenticated') {
            return;
        }

        // Only prevent if already loading
        if (isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/salesforce/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRange: currentRange
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: SalesforceData = await response.json();
            setTotalQualified(data.totalQualified || 0);
            setNewAccounts(data.todayAccounts || 0);
            setYesterdayAccounts(data.yesterdayAccounts || 0);
            lastFetchedRangeRef.current = currentRange;

        } catch (error) {
            console.error('Error fetching Salesforce data:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch data');
            setTotalQualified(0);
            setNewAccounts(0);
            setYesterdayAccounts(0);
        } finally {
            setIsLoading(false);
        }
    }, [session, status, dateRange]);

    useEffect(() => {
        if (status === 'authenticated' && dateRange !== lastFetchedRangeRef.current) {
            fetchSalesforceData();
        }
    }, [status, dateRange, fetchSalesforceData]);

    return {
        totalQualified,
        newAccounts,
        yesterdayAccounts,
        isLoading,
        error,
        refreshData: fetchSalesforceData
    };
}