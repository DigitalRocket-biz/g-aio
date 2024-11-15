// src/hooks/useCampaigns.ts

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useRouter } from 'next/navigation';

interface Campaign {
    id: string;
    name: string;
    status: 'enabled';
    budget: number;
    clicks: number;
    impressions: number;
    conversions: number;
    cost: number;
    accountId?: string;
}

interface CampaignState {
    campaigns: Campaign[];
    loading: boolean;
    error: string | null;
    dateRange: string;
    selectedAccounts: string[];
    setDateRange: (range: string) => void;
    setSelectedAccounts: (accounts: string[]) => void;
    setCampaigns: (campaigns: Campaign[]) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useCampaignStore = create<CampaignState>()(
    persist(
        (set) => ({
            campaigns: [],
            loading: false,
            error: null,
            dateRange: 'TODAY',
            selectedAccounts: [],
            setDateRange: (range) => set({ dateRange: range }),
            setSelectedAccounts: (accounts) => {
                set({ selectedAccounts: accounts });
            },
            setCampaigns: (campaigns) => set({ campaigns }),
            setError: (error) => set({ error }),
            setLoading: (loading) => set({ loading })
        }),
        {
            name: 'campaign-store',
            skipHydration: true
        }
    )
);

export const useCampaigns = () => {
    const store = useCampaignStore();
    const router = useRouter();

    const fetchCampaigns = async (bypassCheck = false) => {
        if (!bypassCheck && (!store.selectedAccounts || store.selectedAccounts.length === 0)) {
            store.setError('Please select at least one account.');
            return;
        }

        try {
            store.setLoading(true);
            store.setError(null);
            const response = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dateRange: store.dateRange,
                    accountIds: store.selectedAccounts || [],
                    bypassCheck: bypassCheck
                })
            });

            if (!response.ok) {
                const error = await response.json();
                if (response.status === 401) {
                    router.push('/auth/signin');
                    return;
                }
                throw new Error(error.error);
            }

            const data = await response.json();
            store.setCampaigns(data);
        } catch (error: any) {
            store.setError(error.message);
        } finally {
            store.setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
        const interval = setInterval(() => fetchCampaigns(), 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [store.dateRange, store.selectedAccounts]);

    return {
        ...store,
        refresh: fetchCampaigns,
        refreshWithBypass: () => fetchCampaigns(true)
    };
};