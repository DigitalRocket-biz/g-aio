import React from 'react';
import { Button } from '@/components/ui';
import { RefreshCw, Phone, MessageSquare, DollarSign, Activity } from 'lucide-react';
import { useAccountSelections } from '@/store/accountSelections';
import { formatCurrency, formatNumber, formatDuration } from '@/utils/format';
import type { LSAMetrics } from '@/types/lsa';
import type { Campaign } from '@/types/campaign';
import { useSalesforce } from '@/hooks/useSalesforce';

interface GoogleAdsAccount {
    id: string;
    name: string;
    managerId: string;
}

interface DashboardHeaderProps {
    dateRange: string;
    selectedAccounts: string[];
    lsaMetrics: LSAMetrics | undefined;
    campaigns: Campaign[];
    onDateRangeChange: (range: string) => void;
    onAccountsChange: (accounts: string[]) => void;
    onRefresh: () => void;
    refreshSalesforceData: (dateRange: string) => Promise<void>;
    availableAccounts: GoogleAdsAccount[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    dateRange,
    selectedAccounts,
    lsaMetrics,
    campaigns = [],
    onDateRangeChange,
    onAccountsChange,
    onRefresh,
    refreshSalesforceData,
    availableAccounts = []
}) => {
    const { isLSAEnabled, toggleLSA } = useAccountSelections();
    const { totalLeads, newAccounts, refreshData } = useSalesforce();

    const handleAccountToggle = (accountId: string) => {
        if (selectedAccounts.includes(accountId)) {
            onAccountsChange(selectedAccounts.filter(id => id !== accountId));
        } else {
            onAccountsChange([...selectedAccounts, accountId]);
        }
    };

    const handleRefresh = async () => {
        onRefresh();
        await refreshSalesforceData(dateRange);
        await refreshData();
    };

    const handleLSAToggle = () => {
        toggleLSA();
        handleRefresh();
    };

    const formatDuration = (ms: number): string => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className="border-b border-slate-700 bg-slate-800 rounded-xl">
            <div className="flex flex-col space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-3xl font-bold text-slate-100">Performance Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={dateRange}
                            onChange={(e) => onDateRangeChange(e.target.value)}
                            className="bg-slate-700 text-slate-100 rounded-lg px-4 py-2 border border-slate-600 focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            <option value="TODAY">Today</option>
                            <option value="YESTERDAY">Yesterday</option>
                            <option value="LAST_7_DAYS">Last 7 Days</option>
                            <option value="THIS_MONTH">This Month</option>
                        </select>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleRefresh}
                            className="text-slate-300 hover:text-slate-100 border-slate-600 transition-all"
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-blue-500/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400">Total Spend</h3>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-3xl font-bold text-slate-100">
                                        {formatCurrency(
                                            (lsaMetrics?.dailyMetrics?.[0]?.cost || 0) +
                                            (campaigns?.filter(c => c.accountId === '5292473333')?.reduce((acc, c) => acc + (c.cost || 0), 0) || 0)
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <DollarSign className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="text-slate-400">
                                LSA: {formatCurrency(lsaMetrics?.dailyMetrics?.[0]?.cost || 0)}
                            </div>
                            <div className="text-slate-400">
                                PPC: {formatCurrency(campaigns?.filter(c => c.accountId === '5292473333')?.reduce((acc, c) => acc + (c.cost || 0), 0) || 0)}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-purple-500/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400">Salesforce Leads</h3>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-3xl font-bold text-slate-100">
                                        {totalLeads}
                                    </p>
                                    <p className="ml-2 text-sm text-slate-400">qualified</p>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <MessageSquare className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="text-slate-400">
                                Today: {newAccounts}
                            </div>
                            <div className="text-slate-400">
                                CPL: {formatCurrency((lsaMetrics?.dailyMetrics?.[0]?.cost || 0) / (totalLeads || 1))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-blue-500/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400">LSA Today</h3>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-3xl font-bold text-slate-100">
                                        {formatNumber(lsaMetrics?.conversations?.total || 0)}
                                    </p>
                                    <p className="ml-2 text-sm text-slate-400">leads</p>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Phone className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="text-slate-400">
                                Calls: {formatNumber(lsaMetrics?.conversations?.calls || 0)}
                            </div>
                            <div className="text-slate-400">
                                Messages: {formatNumber(lsaMetrics?.conversations?.messages || 0)}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-yellow-500/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400">PPC Performance</h3>
                                <div className="mt-2 flex items-baseline">
                                    <p className="text-3xl font-bold text-slate-100">
                                        {formatNumber(campaigns?.filter(c => c.accountId === '5292473333')?.reduce((acc, c) => acc + (c.conversions || 0), 0) || 0)}
                                    </p>
                                    <p className="ml-2 text-sm text-slate-400">converted</p>
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-500/10 rounded-lg">
                                <Activity className="h-6 w-6 text-yellow-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="text-slate-400">
                                Cost: {formatCurrency(campaigns?.filter(c => c.accountId === '5292473333')?.reduce((acc, c) => acc + (c.cost || 0), 0) || 0)}
                            </div>
                            <div className="text-slate-400">
                                Conv Rate: {((campaigns?.filter(c => c.accountId === '5292473333')?.reduce((acc, c) => acc + (c.conversions || 0), 0) || 0) /
                                    (campaigns?.filter(c => c.accountId === '5292473333')?.reduce((acc, c) => acc + (c.clicks || 0), 0) || 1) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
