// src/pages/dashboard.tsx

import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { PerformanceChart } from '@/components/Dashboard/PerformanceChart';
import { CampaignTable } from '@/components/Dashboard/CampaignTable';
import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { useCampaigns } from '@/hooks/useCampaigns';
import { formatCurrency, formatNumber } from '@/utils/format';
import {
    TrendingUp,
    MousePointerClick,
    ShoppingCart,
    DollarSign,
    Users
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useSalesforce } from '@/hooks/useSalesforce';

interface GoogleAdsAccount {
    id: string;
    name: string;
    managerId: string;
}

interface Campaign {
    id: string;
    name: string;
    status: string;
    cost: number;
    clicks: number;
    conversions: number;
    impressions: number;
    date: string;
}

interface DashboardMetrics {
    totalSpend: number;
    totalClicks: number;
    totalConversions: number;
    totalImpressions: number;
    newAccounts: number;
    costPerLead: number;
}

const Dashboard: React.FC = () => {
    const availableAccounts: GoogleAdsAccount[] = [
        {
            id: process.env.NEXT_PUBLIC_HARVEST_INSURANCE_ID || '',
            name: "Harvest Insurance",
            managerId: process.env.NEXT_PUBLIC_GOOGLE_ADS_MANAGER_ID || ''
        },
        {
            id: process.env.NEXT_PUBLIC_WRIGHTS_LIGHTS_ID || '',
            name: "Wright's Lights",
            managerId: process.env.NEXT_PUBLIC_GOOGLE_ADS_MANAGER_ID || ''
        },
        {
            id: process.env.NEXT_PUBLIC_NEAL_ROOFING_ID || '',
            name: "Neal Roofing",
            managerId: process.env.NEXT_PUBLIC_GOOGLE_ADS_MANAGER_ID || ''
        }
    ].filter(account => account.id !== '');

    const { selectedAccounts: savedAccounts, dateRange: savedDateRange, updateSettings } = useSettings();
    const {
        campaigns = [],
        loading,
        error,
        dateRange,
        setDateRange,
        selectedAccounts,
        setSelectedAccounts,
        refresh
    } = useCampaigns();

    const { newAccounts, totalAccounts, totalLeads, refreshSalesforceData } = useSalesforce();

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

    const handleRefresh = () => {
        refresh();
        refreshSalesforceData(dateRange);
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
    }, []); // Empty dependency array

    const metrics = React.useMemo(() => {
        if (!Array.isArray(campaigns)) {
            return {
                totalSpend: 0,
                totalClicks: 0,
                totalConversions: 0,
                totalImpressions: 0,
                costPerLead: 0
            };
        }

        const totals = campaigns.reduce((acc, campaign) => ({
            totalSpend: acc.totalSpend + (campaign.cost || 0),
            totalClicks: acc.totalClicks + (campaign.clicks || 0),
            totalConversions: acc.totalConversions + (campaign.conversions || 0),
            totalImpressions: acc.totalImpressions + (campaign.impressions || 0)
        }), {
            totalSpend: 0,
            totalClicks: 0,
            totalConversions: 0,
            totalImpressions: 0
        });

        return {
            ...totals,
            costPerLead: totalLeads ? totals.totalSpend / totalLeads : 0
        };
    }, [campaigns, totalLeads]);

    return (
        <MainLayout>
            <div className="h-full flex flex-col">
                <DashboardHeader
                    dateRange={dateRange}
                    selectedAccounts={selectedAccounts}
                    totalLeads={totalLeads}
                    totalSpend={metrics.totalSpend}
                    onDateRangeChange={(range) => {
                        setDateRange(range);
                        refreshSalesforceData(range);
                    }}
                    onAccountsChange={handleAccountsChange}
                    onRefresh={handleRefresh}
                    refreshSalesforceData={refreshSalesforceData}
                    availableAccounts={availableAccounts}
                />

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                        <MetricCard
                            title="Total Spend"
                            value={formatCurrency(metrics.totalSpend)}
                            icon={<DollarSign className="text-green-500" />}
                        />
                        <MetricCard
                            title="Total Clicks"
                            value={formatNumber(metrics.totalClicks)}
                            icon={<MousePointerClick className="text-blue-500" />}
                        />
                        <MetricCard
                            title="Total Conversions"
                            value={formatNumber(metrics.totalConversions)}
                            icon={<ShoppingCart className="text-purple-500" />}
                        />
                        <MetricCard
                            title="Total Impressions"
                            value={formatNumber(metrics.totalImpressions)}
                            icon={<TrendingUp className="text-orange-500" />}
                        />
                        <MetricCard
                            title="Total Leads Today"
                            value={formatNumber(totalLeads || 0)}
                            icon={<Users className="text-cyan-500" />}
                        />
                        <MetricCard
                            title="Cost Per Lead"
                            value={formatCurrency(metrics.costPerLead)}
                            icon={<DollarSign className="text-yellow-500" />}
                        />
                    </div>

                    <PerformanceChart data={campaigns as unknown as Campaign[]} />

                    <CampaignTable
                        campaigns={campaigns}
                        loading={loading}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;