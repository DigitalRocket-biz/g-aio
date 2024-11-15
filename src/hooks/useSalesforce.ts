import { useEffect, useState, useCallback } from 'react';

interface SalesforceData {
    count: number;
    totalAccounts: number;
    totalLeads?: number;
    timestamp?: string;
    error?: string;
}

interface UseSalesforceOptions {
    bypass?: boolean;
    suppressErrors?: boolean;
}

export function useSalesforce(options: UseSalesforceOptions = {}) {
    const [data, setData] = useState<SalesforceData>({ count: 0, totalAccounts: 0 });
    const [loading, setLoading] = useState<boolean>(!options.bypass);
    const [error, setError] = useState<string | null>(null);

    const fetchNewAccounts = useCallback(async () => {
        if (options.bypass) {
            setLoading(false);
            setError(null);
            setData({ count: 0, totalAccounts: 0 });
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch both accounts and leads
            const [accountsResponse, leadsResponse] = await Promise.all([
                fetch('/api/salesforce/accounts'),
                fetch('/api/salesforce/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ dateRange: 'TODAY' }),
                })
            ]);

            const accountsData = await accountsResponse.json();
            const leadsData = await leadsResponse.json();

            if (!accountsResponse.ok || !leadsResponse.ok) {
                if (options.suppressErrors) {
                    setData({ count: 0, totalAccounts: 0 });
                    return;
                }
                throw new Error('Failed to fetch Salesforce data');
            }

            setData({
                count: accountsData.count,
                totalAccounts: accountsData.totalAccounts,
                totalLeads: leadsData.totalRecords,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            if (!options.suppressErrors) {
                console.error('Salesforce fetch error:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch Salesforce data');
                setData(prev => ({ ...prev, error: err instanceof Error ? err.message : 'Failed to fetch Salesforce data' }));
            }
        } finally {
            setLoading(false);
        }
    }, [options.bypass, options.suppressErrors]);

    useEffect(() => {
        fetchNewAccounts();
        if (!options.bypass) {
            const interval = setInterval(fetchNewAccounts, 5 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [fetchNewAccounts, options.bypass]);

    const refreshSalesforceData = async (dateRange: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/salesforce/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dateRange }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error('Salesforce API Error:', responseData);
                throw new Error(responseData.message || 'Failed to fetch Salesforce data');
            }

            if (responseData.success) {
                setData(prev => ({
                    ...prev,
                    totalAccounts: responseData.totalRecords,
                    timestamp: new Date().toISOString()
                }));
                console.debug('Today\'s Leads Report Data:', {
                    totalRecords: responseData.totalRecords,
                    reportName: responseData.reportName
                });
            } else {
                throw new Error('Invalid response from Salesforce API');
            }
        } catch (error) {
            console.error('Error refreshing Salesforce data:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch Salesforce data');
            // Set data to previous state or default values
            setData(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to fetch Salesforce data'
            }));
        } finally {
            setLoading(false);
        }
    };

    return {
        newAccounts: data.count,
        totalAccounts: data.totalAccounts,
        totalLeads: data.totalLeads,
        timestamp: data.timestamp,
        loading,
        error,
        refresh: fetchNewAccounts,
        refreshSalesforceData,
    };
}