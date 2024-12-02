// src/pages/dashboard.tsx

import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { PerformanceChart } from '@/components/Dashboard/PerformanceChart';
import { CampaignTable } from '@/components/Dashboard/CampaignTable';
import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { CampaignBarChart } from '@/components/Dashboard/CampaignBarChart';
import { useCampaigns } from '@/hooks/useCampaigns';
import { formatCurrency, formatNumber } from '@/utils/format';
import type { Campaign as GoogleCampaign } from '@/types/campaign';
import type { LSAMetrics } from '@/types/lsa';
import type { ChartData } from '@/types/chart';
import { useSettings } from '@/hooks/useSettings';
import { useSalesforce } from '@/hooks/useSalesforce';
import { useAccountSelections } from '@/store/accountSelections';

interface GoogleAdsAccount {
    id: string;
    name: string;
    managerId: string;
}

interface CampaignConversions {
    total: number;
    calls: number;
    messages: number;
}

interface CampaignDetail {
    id: string;
    name: string;
    status: string;
    cost: number;
    clicks: number;
    impressions: number;
    date: string;
    cpc: number;
    conversions: CampaignConversions;
    conversionActions: {
        calls: number;
        messages: number;
    };
}

interface ExtendedChartData extends ChartData {
    conversionTypes: {
        calls: number;
        messages: number;
    };
}

interface CombinedMetrics {
    totalSpend: number;
    totalClicks: number;
    totalConversions: number;
    totalImpressions: number;
    costPerLead: number;
}

interface LSAMetricsDefault {
    totalLeads: number;
    messageLeads: number;
    callLeads: number;
    totalSpend: number;
    conversations: {
        total: number;
        calls: number;
        messages: number;
        avgCallDuration: number;
    };
    campaigns: {
        total: number;
        active: number;
        budget: number;
        details: CampaignDetail[];
    };
    dailyMetrics: ChartData[];
}

const defaultLSAMetrics: LSAMetricsDefault = {
    totalLeads: 0,
    messageLeads: 0,
    callLeads: 0,
    totalSpend: 0,
    conversations: {
        total: 0,
        calls: 0,
        messages: 0,
        avgCallDuration: 0
    },
    campaigns: {
        total: 0,
        active: 0,
        budget: 0,
        details: []
    },
    dailyMetrics: []
};

const REFRESH_INTERVAL = 60000; // 60 seconds

const Dashboard: React.FC = () => {
    const availableAccounts: GoogleAdsAccount[] = [
        {
            id: process.env.NEXT_PUBLIC_HARVEST_INSURANCE_ID || '',
            name: "Harvest Insurance",
            managerId: process.env.NEXT_PUBLIC_GOOGLE_ADS_MANAGER_ID || ''
        }

    ].filter(account => account.id !== '');

    const { selectedAccounts: savedAccounts, dateRange: savedDateRange, updateSettings } = useSettings();
    const { isLSAEnabled } = useAccountSelections();
    const {
        campaigns = [],
        loading,
        error,
        dateRange,
        setDateRange,
        selectedAccounts,
        setSelectedAccounts,
        refresh,
        lsaMetrics
    } = useCampaigns();

    const { newAccounts, newAccounts: totalAccounts, totalLeads, refreshData: refreshSalesforceData } = useSalesforce();

    const handleAccountsChange = (accountIds: string[]) => {
        setSelectedAccounts(accountIds);
        updateSettings({ selectedAccounts: accountIds });
        refresh();
    };

    const handleDateRangeChange = (newDateRange: string) => {
        setDateRange(newDateRange);
        updateSettings({ dateRange: newDateRange });
        refresh();
    };

    const handleRefresh = async () => {
        try {
            await Promise.all([
                refresh(isLSAEnabled),
                refreshSalesforceData()
            ]);
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
        }
    };

    useEffect(() => {
        // Only run once on mount
        if (savedAccounts?.length > 0) {
            setSelectedAccounts(savedAccounts);
        } else if (availableAccounts.length > 0) {
            const initialAccount = [availableAccounts[0].id];
            setSelectedAccounts(initialAccount);
            updateSettings({ selectedAccounts: initialAccount });
        }

        if (savedDateRange) {
            setDateRange(savedDateRange);
        }
    }, []);

    // Add auto-refresh functionality
    useEffect(() => {
        // Initial refresh
        handleRefresh();

        // Set up auto-refresh interval
        const intervalId = setInterval(() => {
            handleRefresh();
        }, REFRESH_INTERVAL);

        // Cleanup on unmount
        return () => clearInterval(intervalId);
    }, [isLSAEnabled]); // Re-run if LSA toggle changes

    const metrics = useMemo<CombinedMetrics>(() => {
        if (!Array.isArray(campaigns)) {
            return {
                totalSpend: 0,
                totalClicks: 0,
                totalConversions: 0,
                totalImpressions: 0,
                costPerLead: 0
            };
        }

        // Calculate totals including LSA metrics
        const totals = campaigns.reduce((acc, campaign) => ({
            totalSpend: acc.totalSpend + (campaign.cost || 0),
            totalClicks: acc.totalClicks + (campaign.clicks || 0),
            totalConversions: acc.totalConversions + (campaign.conversions || 0),
            totalImpressions: acc.totalImpressions + (campaign.impressions || 0)
        }), {
            totalSpend: lsaMetrics?.dailyMetrics?.[0]?.cost || 0,
            totalClicks: lsaMetrics?.dailyMetrics?.[0]?.clicks || 0,
            totalConversions: lsaMetrics?.dailyMetrics?.[0]?.conversions || 0,
            totalImpressions: lsaMetrics?.dailyMetrics?.[0]?.impressions || 0
        });

        return {
            ...totals,
            costPerLead: totals.totalConversions ? totals.totalSpend / totals.totalConversions : 0
        };
    }, [campaigns, lsaMetrics]);

    // Enhance chart data processing
    const chartData = useMemo<ExtendedChartData[]>(() => {
        const combinedData: Record<string, ExtendedChartData> = {};

        // Process LSA metrics first
        if (lsaMetrics?.dailyMetrics) {
            lsaMetrics.dailyMetrics.forEach(metric => {
                const date = new Date(metric.date).toISOString().split('T')[0];
                combinedData[date] = {
                    date,
                    cost: metric.cost || 0,
                    clicks: metric.clicks || 0,
                    conversions: metric.conversions || 0,
                    impressions: metric.impressions || 0,
                    conversionTypes: {
                        calls: (metric as ExtendedChartData).conversionTypes?.calls || 0,
                        messages: (metric as ExtendedChartData).conversionTypes?.messages || 0
                    },
                    campaignTypes: {
                        lsa: metric.cost || 0,
                        ppc: 0
                    }
                };
            });
        }

        // Add PPC campaign data
        campaigns.forEach((campaign: GoogleCampaign) => {
            const date = new Date(campaign.date).toISOString().split('T')[0];
            if (!combinedData[date]) {
                combinedData[date] = {
                    date,
                    cost: 0,
                    clicks: 0,
                    conversions: 0,
                    impressions: 0,
                    conversionTypes: {
                        calls: 0,
                        messages: 0
                    },
                    campaignTypes: {
                        lsa: 0,
                        ppc: 0
                    }
                };
            }

            // Update metrics
            combinedData[date].cost += campaign.cost || 0;
            combinedData[date].clicks += campaign.clicks || 0;
            combinedData[date].conversions += campaign.conversions || 0;
            combinedData[date].impressions += campaign.impressions || 0;
            (combinedData[date].campaignTypes as { ppc: number; lsa: number }).ppc += campaign.cost || 0;

            // Handle conversion types
            const convTypes = (campaign as any).conversionTypes;
            if (convTypes && typeof convTypes === 'object') {
                combinedData[date].conversionTypes.calls += convTypes.calls || 0;
                combinedData[date].conversionTypes.messages += convTypes.messages || 0;
            } else {
                combinedData[date].conversionTypes.calls += campaign.conversions || 0;
            }
        });

        return Object.values(combinedData)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [campaigns, lsaMetrics]);

    return (
        <MainLayout>
            <div className="min-h-screen bg-slate-900">
                <div className="max-w-[1920px] mx-auto px-6 py-8">
                    <div className="mb-8">
                        <DashboardHeader
                            dateRange={dateRange}
                            selectedAccounts={selectedAccounts}
                            lsaMetrics={(lsaMetrics || defaultLSAMetrics) as unknown as LSAMetrics}
                            campaigns={campaigns}
                            onDateRangeChange={handleDateRangeChange}
                            onAccountsChange={handleAccountsChange}
                            onRefresh={handleRefresh}
                            refreshSalesforceData={refreshSalesforceData}
                            availableAccounts={availableAccounts}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 mb-8">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-slate-100">Campaign Performance</h2>
                            </div>

                            <div className="mb-8">
                                <CampaignBarChart campaigns={campaigns} />
                            </div>

                            <div className="overflow-hidden rounded-lg border border-slate-700">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700 bg-slate-800/50">
                                                <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-slate-300">Campaign</th>
                                                <th className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-300">Cost</th>
                                                <th className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-300">Conversions</th>
                                                <th className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-300">Target</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campaigns.map((campaign) => (
                                                <tr
                                                    key={campaign.id}
                                                    className="border-b border-slate-700 last:border-0 hover:bg-slate-800/75 transition-colors"
                                                >
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <span className="font-medium text-slate-200">
                                                                {campaign.id === '20776847692' ? 'Harvest LSA' : campaign.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-slate-300">
                                                        {formatCurrency(campaign.cost)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-slate-300">
                                                        {campaign.conversions}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                                        <span className="inline-flex items-center rounded-full bg-slate-700/50 px-3 py-1 text-sm font-medium text-slate-300">
                                                            {campaign.targetCpa ? `${formatCurrency(campaign.targetCpa)} CPA` : 'Set CPA'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;