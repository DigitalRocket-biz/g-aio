// src/components/Dashboard/CampaignTable.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber, formatDuration } from '@/utils/format';
import { ArrowUpDown, Phone, MessageSquare } from 'lucide-react';
import { useSortPreferences } from '@/hooks/useSortPreferences';
import { cn } from '@/utils/index';
import { Campaign } from '@/types/campaign';

type SortableField = 'name' | 'cost' | 'clicks' | 'conversions' | 'targetCpa' | 'cpc' | 'calls' | 'messages';

interface LSAConversation {
    id: string;
    conversationType: 'PHONE_CALL' | 'MESSAGE';
    duration?: number;
    text?: string;
    timestamp: string;
}

interface LSACampaign extends Campaign {
    isLSA?: boolean;
    conversations?: LSAConversation[];
    callCount?: number;
    messageCount?: number;
    avgCallDuration?: number;
}

interface CampaignTableProps {
    campaigns: LSACampaign[];
    loading: boolean;
    onRowClick?: (campaign: LSACampaign) => void;
    onUpdateTarget?: (campaignId: string, value: number) => void;
    onRefresh?: () => void;
    refreshSalesforceData?: (dateRange: string) => Promise<void>;
    dateRange?: string;
    isLSAEnabled?: boolean;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
    campaigns = [],
    loading,
    onRowClick,
    onUpdateTarget,
    onRefresh,
    refreshSalesforceData,
    dateRange,
    isLSAEnabled
}) => {
    const { sortPreference, toggleSort } = useSortPreferences<SortableField>();
    const [editingTarget, setEditingTarget] = useState<{ id: string; value: string } | null>(null);
    const campaignsArray = Array.isArray(campaigns) ? campaigns : [];

    const sortedCampaigns = React.useMemo(() => {
        return [...campaignsArray].sort((a, b) => {
            const multiplier = sortPreference.direction === 'desc' ? -1 : 1;
            const field = sortPreference.field;

            switch (field) {
                case 'name':
                    return multiplier * a.name.localeCompare(b.name);
                case 'calls':
                    return multiplier * ((a.callCount || 0) - (b.callCount || 0));
                case 'messages':
                    return multiplier * ((a.messageCount || 0) - (b.messageCount || 0));
                case 'targetCpa':
                    const aValue = a.targetCpa ?? 0;
                    const bValue = b.targetCpa ?? 0;
                    return multiplier * (aValue - bValue);
                default:
                    return multiplier * ((a[field] ?? 0) - (b[field] ?? 0));
            }
        });
    }, [campaignsArray, sortPreference]);

    const renderLSAMetrics = (campaign: LSACampaign) => {
        if (!campaign.isLSA) return null;

        return (
            <div className="space-y-2">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-slate-300">
                            {campaign.callCount || 0} calls
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-slate-300">
                            {campaign.messageCount || 0} messages
                        </span>
                    </div>
                </div>
                {campaign.avgCallDuration && (
                    <div className="text-xs text-slate-400">
                        Avg Call Duration: {formatDuration(campaign.avgCallDuration)}
                    </div>
                )}
            </div>
        );
    };

    const handleTargetEdit = async (campaign: LSACampaign, newValue: string): Promise<void> => {
        const numericValue = parseFloat(newValue);
        if (isNaN(numericValue)) return;

        try {
            const biddingStrategy = String(campaign.biddingStrategyType || '');
            let endpoint = '';
            const payload = {
                campaignId: campaign.id,
                accountId: campaign.accountId,
                targetCpa: undefined as number | undefined,
                targetRoas: undefined as number | undefined
            };

            if (biddingStrategy === 'TARGET_CPA' ||
                (biddingStrategy === 'MAXIMIZE_CONVERSIONS' && campaign.targetCpa !== undefined)) {
                endpoint = '/api/campaigns/update-tcpa';
                payload.targetCpa = numericValue;
            } else if (biddingStrategy === 'TARGET_ROAS' ||
                (biddingStrategy === 'MAXIMIZE_CONVERSION_VALUE' && campaign.targetRoas !== undefined)) {
                endpoint = '/api/campaigns/update-troas';
                payload.targetRoas = numericValue / 100;
            }

            if (endpoint) {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || data.error || 'Failed to update target');
                }

                onUpdateTarget?.(campaign.id, numericValue);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating target:', error);
        }

        setEditingTarget(null);
    };

    const renderTargetValue = (campaign: LSACampaign) => {
        if (campaign.isLSA) {
            return (
                <span className="text-slate-300">
                    {formatCurrency(campaign.cost || 0)}
                </span>
            );
        }

        const biddingStrategy = String(campaign.biddingStrategyType || '');
        let targetValue: number | undefined;
        let targetType: string;
        let isMaximize = false;
        let step: number;

        if (biddingStrategy === 'TARGET_CPA') {
            targetValue = campaign.targetCpa;
            targetType = 'CPA';
            step = 0.5;
        } else if (biddingStrategy === 'TARGET_ROAS') {
            targetValue = campaign.targetRoas;
            targetType = 'ROAS';
            step = 0.25;
        } else if (biddingStrategy === 'MAXIMIZE_CONVERSIONS') {
            targetValue = campaign.targetCpa;
            targetType = 'CPA';
            step = 0.5;
            isMaximize = !targetValue;
        } else if (biddingStrategy === 'MAXIMIZE_CONVERSION_VALUE') {
            targetValue = campaign.targetRoas;
            targetType = 'ROAS';
            step = 0.25;
            isMaximize = !targetValue;
        } else {
            targetType = 'CPA';
            step = 0.5;
        }

        const handleIncrement = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!targetValue) return;
            const newValue = targetType === 'ROAS'
                ? (targetValue * 100 + step * 100) / 100
                : targetValue + step;
            await handleTargetEdit(campaign, newValue.toString());
        };

        const handleDecrement = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!targetValue) return;
            const newValue = targetType === 'ROAS'
                ? Math.max((targetValue * 100 - step * 100) / 100, step)
                : Math.max(targetValue - step, step);
            await handleTargetEdit(campaign, newValue.toString());
        };

        if (editingTarget?.id === campaign.id) {
            return (
                <input
                    type="number"
                    step={targetType === 'ROAS' ? '1' : '0.01'}
                    min="0"
                    className="w-24 px-2 py-1 bg-slate-700 border border-slate-500 rounded"
                    value={editingTarget.value}
                    onChange={(e) => setEditingTarget({
                        id: campaign.id,
                        value: e.target.value
                    })}
                    onBlur={() => handleTargetEdit(campaign, editingTarget.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleTargetEdit(campaign, editingTarget.value);
                        }
                    }}
                    autoFocus
                />
            );
        }

        return (
            <div className="flex items-center gap-2">
                {!isMaximize && targetValue && (
                    <button
                        onClick={handleDecrement}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                    >
                        -
                    </button>
                )}
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isMaximize) {
                            setEditingTarget({
                                id: campaign.id,
                                value: targetValue?.toString() || ''
                            });
                        }
                    }}
                    className={cn(
                        "cursor-pointer",
                        !isMaximize && "hover:text-blue-400"
                    )}
                >
                    {isMaximize
                        ? `Max ${targetType === 'ROAS' ? 'Conv. Value' : 'Conversions'}`
                        : targetValue
                        ? `${targetType === 'ROAS' ? `${(targetValue * 100).toFixed(0)}%` : formatCurrency(targetValue)}`
                        : `Set ${targetType}`}
                </span>
                {!isMaximize && targetValue && (
                    <button
                        onClick={handleIncrement}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                    >
                        +
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700/50">
                            <th className="whitespace-nowrap px-6 py-4 text-left text-sm font-semibold text-slate-300">Campaign</th>
                            <th className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-300">Cost</th>
                            <th className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-300">Conversions</th>
                            <th className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-300">Target</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign) => (
                            <tr
                                key={campaign.id}
                                className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors"
                            >
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${campaign.status === 'ENABLED' ? 'bg-green-500' : 'bg-slate-500'}`} />
                                        <span className="font-medium text-slate-200">
                                            {campaign.id === process.env.NEXT_PUBLIC_HARVEST_LSA_ID ? 'Harvest LSA' : campaign.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-300">
                                    ${campaign.cost.toFixed(2)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                    <span className="inline-flex items-center justify-center min-w-[2rem] rounded-full bg-blue-500/20 px-2.5 py-0.5 text-sm font-medium text-blue-400">
                                        {campaign.conversions}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                    <span className="inline-flex items-center rounded-full bg-slate-700/50 px-3 py-1 text-sm font-medium text-slate-300">
                                        {campaign.targetCpa ? `$${campaign.targetCpa} CPA` : 'Set CPA'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};