import React from 'react';
import { Button } from '@/components/ui';
import { RefreshCw } from 'lucide-react';

interface GoogleAdsAccount {
    id: string;
    name: string;
}

interface DashboardHeaderProps {
    dateRange: string;
    selectedAccounts: string[];
    totalLeads?: number;
    totalSpend: number;
    onDateRangeChange: (range: string) => void;
    onAccountsChange: (accounts: string[]) => void;
    onRefresh: () => void;
    refreshSalesforceData: (dateRange: string) => Promise<void>;
    availableAccounts: GoogleAdsAccount[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    dateRange,
    selectedAccounts,
    totalLeads,
    totalSpend,
    onDateRangeChange,
    onAccountsChange,
    onRefresh,
    refreshSalesforceData,
    availableAccounts = []
}) => {
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
    };

    return (
        <div className="border-b border-slate-700 bg-slate-800 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
                    <span className="text-sm text-slate-400">
                        Total Leads Today: {totalLeads || 0}
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    {availableAccounts.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {availableAccounts.map((account) => (
                                <button
                                    key={account.id}
                                    onClick={() => handleAccountToggle(account.id)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedAccounts.includes(account.id)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                >
                                    {account.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <select
                        value={dateRange}
                        onChange={(e) => onDateRangeChange(e.target.value)}
                        className="bg-slate-700 text-slate-100 rounded-lg px-3 py-2"
                    >
                        <option value="TODAY">Today</option>
                        <option value="YESTERDAY">Yesterday</option>
                        <option value="LAST_7_DAYS">Last 7 Days</option>
                        <option value="THIS_MONTH">This Month</option>
                    </select>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        className="text-slate-400 hover:text-slate-300"
                    >
                        <RefreshCw size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
