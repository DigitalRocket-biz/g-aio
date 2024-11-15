// src/components/Dashboard/CampaignTable.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/utils/format';
import { ArrowUpDown } from 'lucide-react';
import { useSortPreferences } from '@/hooks/useSortPreferences';
import { cn } from '@/utils/index';

interface Campaign {
    id: string;
    name: string;
    status: string;
    cost: number;
    clicks: number;
    conversions: number;
    targetCpa?: number;
    biddingStrategyType?: string;
    targetRoas?: number;
    maximizeConversionValue?: boolean;
    accountId?: string;
}

type SortableField = 'name' | 'cost' | 'clicks' | 'conversions' | 'targetCpa';

interface CampaignTableProps {
    campaigns: Campaign[] | null | undefined;
    loading?: boolean;
    onRowClick?: (campaign: Campaign) => void;
    onUpdateTarget?: () => void;
}

export const CampaignTable = ({ campaigns = [], loading, onRowClick, onUpdateTarget }: CampaignTableProps) => {
    const { sortPreference, toggleSort } = useSortPreferences<SortableField>();
    const [editingTarget, setEditingTarget] = useState<{ id: string, value: string } | null>(null);
    const campaignsArray = Array.isArray(campaigns) ? campaigns : [];

    const sortedCampaigns = React.useMemo(() => {
        return [...campaignsArray].sort((a, b) => {
            const multiplier = sortPreference.direction === 'desc' ? -1 : 1;
            const field = sortPreference.field;

            switch (field) {
                case 'name':
                    return multiplier * a.name.localeCompare(b.name);
                case 'targetCpa':
                    const aValue = a.targetCpa ?? 0;
                    const bValue = b.targetCpa ?? 0;
                    return multiplier * (aValue - bValue);
                default:
                    return multiplier * ((a[field] ?? 0) - (b[field] ?? 0));
            }
        });
    }, [campaignsArray, sortPreference]);

    const handleTargetEdit = async (campaign: Campaign, newValue: string) => {
        console.log('Starting target edit:', {
            campaign: {
                id: campaign.id,
                name: campaign.name,
                biddingStrategyType: campaign.biddingStrategyType,
                currentTargetCpa: campaign.targetCpa,
                currentTargetRoas: campaign.targetRoas
            },
            newValue
        });

        const numericValue = parseFloat(newValue);
        if (isNaN(numericValue)) {
            return;
        }

        try {
            const biddingStrategy = String(campaign.biddingStrategyType || '');
            let endpoint = '';
            let payload: {
                campaignId: string;
                accountId?: string;
                targetCpa?: number;
                targetRoas?: number;
            } = {
                campaignId: campaign.id,
                accountId: campaign.accountId,
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
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || data.error || 'Failed to update target');
                    }

                    await new Promise(resolve => setTimeout(resolve, 2000));

                    if (onUpdateTarget) {
                        onUpdateTarget();
                    }
                } catch (error: any) {
                    console.error('Error updating target:', error);
                    // You could add a toast notification here
                }
            }
        } catch (error) {
            console.error('Error updating target:', error);
        }

        setEditingTarget(null);
    };

    const renderTargetValue = (campaign: Campaign) => {
        let targetValue: number | undefined;
        let targetType: string;
        let isMaximize = false;

        const biddingStrategy = String(campaign.biddingStrategyType || '');

        if (biddingStrategy === 'TARGET_CPA') {
            targetValue = campaign.targetCpa;
            targetType = 'CPA';
        } else if (biddingStrategy === 'TARGET_ROAS') {
            targetValue = campaign.targetRoas;
            targetType = 'ROAS';
        } else if (biddingStrategy === 'MAXIMIZE_CONVERSIONS') {
            targetValue = campaign.targetCpa;
            targetType = 'CPA';
            isMaximize = !targetValue;
        } else if (biddingStrategy === 'MAXIMIZE_CONVERSION_VALUE') {
            targetValue = campaign.targetRoas;
            targetType = 'ROAS';
            isMaximize = !targetValue;
        } else {
            targetType = 'CPA';
        }

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
                {isMaximize ? (
                    `Max ${targetType === 'ROAS' ? 'Conv. Value' : 'Conversions'}`
                ) : targetValue ? (
                    `${targetType === 'ROAS' ? `${(targetValue * 100).toFixed(0)}%` : formatCurrency(targetValue)}`
                ) : (
                    `Set ${targetType}`
                )}
            </span>
        );
    };

    const SortHeader = ({ field, label }: { field: SortableField, label: string }) => (
        <th
            className="px-6 py-3 text-left text-sm font-semibold text-slate-400 cursor-pointer group"
            onClick={() => toggleSort(field)}
        >
            <div className="flex items-center gap-2">
                {label}
                <ArrowUpDown className={cn(
                    "h-4 w-4 transition-colors",
                    sortPreference.field === field ? "text-slate-200" : "text-slate-600 group-hover:text-slate-400"
                )} />
            </div>
        </th>
    );

    return (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold text-slate-100">Active Campaigns</h3>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <SortHeader field="name" label="Name" />
                            <SortHeader field="cost" label="Spend" />
                            <SortHeader field="clicks" label="Clicks" />
                            <SortHeader field="conversions" label="Conversions" />
                            <SortHeader field="targetCpa" label="Target CPA/ROAS" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-slate-400">
                                    Loading campaigns...
                                </td>
                            </tr>
                        ) : sortedCampaigns.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-slate-400">
                                    No campaigns found
                                </td>
                            </tr>
                        ) : (
                            <>
                                {sortedCampaigns.map(campaign => (
                                    <tr
                                        key={campaign.id}
                                        className="border-b border-slate-700 hover:bg-slate-800/50"
                                    >
                                        <td className="px-6 py-4 text-slate-100">{campaign.name}</td>
                                        <td className="px-6 py-4 text-slate-100">{formatCurrency(campaign.cost)}</td>
                                        <td className="px-6 py-4 text-slate-100">{formatNumber(campaign.clicks)}</td>
                                        <td className="px-6 py-4 text-slate-100">{formatNumber(campaign.conversions)}</td>
                                        <td className="px-6 py-4 text-slate-100">
                                            {renderTargetValue(campaign)}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};