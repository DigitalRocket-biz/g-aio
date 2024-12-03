// src/hooks/useCampaigns.ts

import { useState, useCallback } from 'react';
import { Campaign } from '@/types/campaign';
import { useSettings } from '@/store/settings';
import type { LSAMetrics } from '@/types/lsa';

interface UseCampaignsReturn {
    campaigns: Campaign[];
    loading: boolean;
    error: string | null;
    dateRange: string;
    setDateRange: (range: string) => void;
    selectedAccounts: string[];
    setSelectedAccounts: (accounts: string[]) => void;
    refresh: (isLSAEnabled?: boolean) => Promise<void>;
    lsaMetrics: LSAMetrics | null;
}

export function useCampaigns(): UseCampaignsReturn {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lsaMetrics, setLsaMetrics] = useState<LSAMetrics | null>(null);
    const { selectedAccounts: savedAccounts, dateRange: savedDateRange } = useSettings();
    const [dateRange, setDateRange] = useState(savedDateRange || 'TODAY');
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>(savedAccounts || []);

    const refresh = useCallback(async (isLSAEnabled?: boolean) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRange,
                    accountIds: selectedAccounts,
                    isLSAEnabled,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch campaigns');
            }

            const data = await response.json();
            setCampaigns(data.campaigns);
            setLsaMetrics(data.lsaMetrics);
        } catch (err: any) {
            console.error('Error fetching campaigns:', err);
            setError(err.message || 'Failed to fetch campaigns');
            setCampaigns([]);
            setLsaMetrics(null);
        } finally {
            setLoading(false);
        }
    }, [dateRange, selectedAccounts]);

    return {
        campaigns,
        loading,
        error,
        dateRange,
        setDateRange,
        selectedAccounts,
        setSelectedAccounts,
        refresh,
        lsaMetrics,
    };
}