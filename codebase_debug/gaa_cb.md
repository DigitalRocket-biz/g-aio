# Google Ads Assistant Codebase Documentation

## Table of Contents

1. [components\dashboard\CampaignBarChart.tsx](#components_dashboard_campaignbarcharttsx)
2. [components\dashboard\CampaignTable.tsx](#components_dashboard_campaigntabletsx)
3. [components\dashboard\ChartWrapper.tsx](#components_dashboard_chartwrappertsx)
4. [components\dashboard\ClientChart.tsx](#components_dashboard_clientcharttsx)
5. [components\dashboard\DashboardHeader.tsx](#components_dashboard_dashboardheadertsx)
6. [components\dashboard\DashboardLayout.tsx](#components_dashboard_dashboardlayouttsx)
7. [components\dashboard\MetricCard.tsx](#components_dashboard_metriccardtsx)
8. [components\dashboard\PerformanceChart.tsx](#components_dashboard_performancecharttsx)
9. [components\layouts\MainLayout.tsx](#components_layouts_mainlayouttsx)
10. [components\layouts\Sidebar.tsx](#components_layouts_sidebartsx)
11. [components\ui\Button.tsx](#components_ui_buttontsx)
12. [components\ui\Card.tsx](#components_ui_cardtsx)
13. [components\ui\Dialog.tsx](#components_ui_dialogtsx)
14. [components\ui\index.ts](#components_ui_indexts)
15. [components\ui\Input.tsx](#components_ui_inputtsx)
16. [components\ui\Select.tsx](#components_ui_selecttsx)
17. [hooks\useCampaigns.ts](#hooks_usecampaignsts)
18. [hooks\useChat.ts](#hooks_usechatts)
19. [hooks\useLeadTypePreferences.ts](#hooks_useleadtypepreferencests)
20. [hooks\useLocalStorage.ts](#hooks_uselocalstoragets)
21. [hooks\useSalesforce.ts](#hooks_usesalesforcets)
22. [hooks\useSettings.ts](#hooks_usesettingsts)
23. [hooks\useSortPreferences.ts](#hooks_usesortpreferencests)
24. [lib\api.ts](#lib_apits)
25. [lib\chartConfig.ts](#lib_chartconfigts)
26. [lib\db.ts](#lib_dbts)
27. [lib\google-ads.ts](#lib_google-adsts)
28. [lib\lsa.ts](#lib_lsats)
29. [lib\openai.ts](#lib_openaits)
30. [lib\prisma.ts](#lib_prismats)
31. [lib\salesforce.ts](#lib_salesforcets)
32. [pages\404.tsx](#pages_404tsx)
33. [pages\_app.tsx](#pages__apptsx)
34. [pages\analytics.tsx](#pages_analyticstsx)
35. [pages\api\auth\[...nextauth].ts](#pages_api_auth_[nextauth]ts)
36. [pages\api\campaigns\cpc-history.ts](#pages_api_campaigns_cpc-historyts)
37. [pages\api\campaigns\update-target.ts](#pages_api_campaigns_update-targetts)
38. [pages\api\campaigns\update-tcpa.ts](#pages_api_campaigns_update-tcpats)
39. [pages\api\campaigns\update-troas.ts](#pages_api_campaigns_update-troasts)
40. [pages\api\campaigns.ts](#pages_api_campaignsts)
41. [pages\api\log.ts](#pages_api_logts)
42. [pages\api\salesforce\accounts.ts](#pages_api_salesforce_accountsts)
43. [pages\auth\signin.tsx](#pages_auth_signintsx)
44. [pages\chat.tsx](#pages_chattsx)
45. [pages\dashboard.tsx](#pages_dashboardtsx)
46. [pages\index.tsx](#pages_indextsx)
47. [providers\AntdProvider.tsx](#providers_antdprovidertsx)
48. [store\accountSelections.ts](#store_accountselectionsts)
49. [store\chat.ts](#store_chatts)
50. [store\settings.ts](#store_settingsts)
51. [styles\globals.css](#styles_globalscss)
52. [types\campaign.ts](#types_campaignts)
53. [types\chart.ts](#types_chartts)
54. [types\lsa.ts](#types_lsats)
55. [types\next-auth.d.ts](#types_next-authdts)
56. [utils\date.ts](#utils_datets)
57. [utils\format.ts](#utils_formatts)
58. [utils\index.ts](#utils_indexts)

## components\dashboard\CampaignBarChart.tsx

```typescript
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { LSACampaign } from '@/types/campaign';
import { formatCurrency } from '@/utils/format';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface CampaignBarChartProps {
    campaigns: LSACampaign[];
}

export const CampaignBarChart: React.FC<CampaignBarChartProps> = ({ campaigns }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#94a3b8' // text-slate-400
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)' // text-slate-400 with low opacity
                },
                ticks: {
                    color: '#94a3b8' // text-slate-400
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)' // text-slate-400 with low opacity
                },
                ticks: {
                    color: '#94a3b8', // text-slate-400
                    callback: function(value: any) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };

    const data = {
        labels: campaigns.map(campaign => campaign.name),
        datasets: [
            {
                label: 'Cost',
                data: campaigns.map(campaign => campaign.cost),
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // bg-blue-500 with opacity
                borderColor: 'rgb(59, 130, 246)', // bg-blue-500
                borderWidth: 1
            },
            {
                label: 'Target CPA',
                data: campaigns.map(campaign => campaign.targetCpa || 0),
                backgroundColor: 'rgba(34, 197, 94, 0.5)', // bg-green-500 with opacity
                borderColor: 'rgb(34, 197, 94)', // bg-green-500
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="h-[400px] w-full">
            <Bar options={options} data={data} />
        </div>
    );
}; 
```

## components\dashboard\CampaignTable.tsx

```typescript
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
```

## components\dashboard\ChartWrapper.tsx

```typescript
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface ChartWrapperProps {
    data: ChartData<'line'>;
    options: ChartOptions<'line'>;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ data, options }) => {
    return (
        <div className="w-full h-full">
            <Line 
                data={data} 
                options={{
                    ...options,
                    maintainAspectRatio: false,
                    responsive: true
                }} 
            />
        </div>
    );
}; 
```

## components\dashboard\ClientChart.tsx

```typescript
import React from 'react';
import Card from 'antd/es/card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Campaign } from '@/types/campaign';
import type { LSAMetrics } from '@/types/lsa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ClientChartProps {
    campaigns: Campaign[];
    lsaMetrics?: LSAMetrics | null;
}

const ClientChart: React.FC<ClientChartProps> = ({ campaigns, lsaMetrics }) => {
    // Transform campaigns data for the chart
    const combinedData: { [key: string]: any } = {};

    // Process PPC campaign data
    campaigns.forEach((campaign) => {
        const date = campaign.date;
        if (!combinedData[date]) {
            combinedData[date] = {
                date,
                ppcClicks: 0,
                ppcImpressions: 0,
                lsaClicks: 0,
                lsaImpressions: 0,
            };
        }
        combinedData[date].ppcClicks += campaign.clicks || 0;
        combinedData[date].ppcImpressions += campaign.impressions || 0;
    });

    // Process LSA metrics data
    if (lsaMetrics?.dailyMetrics) {
        lsaMetrics.dailyMetrics.forEach((metric) => {
            const date = metric.date;
            if (!combinedData[date]) {
                combinedData[date] = {
                    date,
                    ppcClicks: 0,
                    ppcImpressions: 0,
                    lsaClicks: 0,
                    lsaImpressions: 0,
                };
            }
            combinedData[date].lsaClicks += metric.clicks || 0;
            combinedData[date].lsaImpressions += metric.impressions || 0;
        });
    }

    const sortedDates = Object.keys(combinedData).sort();

    const chartData = {
        labels: sortedDates,
        datasets: [
            {
                label: 'PPC Clicks',
                data: sortedDates.map(date => combinedData[date].ppcClicks),
                backgroundColor: 'rgba(96, 165, 250, 0.8)',
                borderColor: '#60A5FA',
                borderWidth: 1,
                borderRadius: 4,
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                stack: 'clicks',
            },
            {
                label: 'LSA Clicks',
                data: sortedDates.map(date => combinedData[date].lsaClicks),
                backgroundColor: 'rgba(52, 211, 153, 0.8)',
                borderColor: '#34D399',
                borderWidth: 1,
                borderRadius: 4,
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                stack: 'clicks',
            },
            {
                label: 'PPC Impressions',
                data: sortedDates.map(date => combinedData[date].ppcImpressions),
                backgroundColor: 'rgba(244, 114, 182, 0.8)',
                borderColor: '#F472B6',
                borderWidth: 1,
                borderRadius: 4,
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                stack: 'impressions',
            },
            {
                label: 'LSA Impressions',
                data: sortedDates.map(date => combinedData[date].lsaImpressions),
                backgroundColor: 'rgba(251, 146, 60, 0.8)',
                borderColor: '#FB923C',
                borderWidth: 1,
                borderRadius: 4,
                categoryPercentage: 0.8,
                barPercentage: 0.9,
                stack: 'impressions',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#F9FAFB',
                    font: {
                        size: 12,
                        weight: 500,
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'rect' as const,
                },
            },
            title: {
                display: true,
                text: 'Performance Metrics',
                color: '#F9FAFB',
                font: {
                    size: 16,
                    weight: 600,
                },
                padding: {
                    bottom: 30,
                },
            },
            tooltip: {
                backgroundColor: '#1F2937',
                titleColor: '#F9FAFB',
                bodyColor: '#D1D5DB',
                borderColor: '#374151',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                usePointStyle: true,
                boxPadding: 6,
            },
        },
        scales: {
            x: {
                grid: {
                    color: '#374151',
                    drawBorder: false,
                },
                ticks: {
                    color: '#D1D5DB',
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                grid: {
                    color: '#374151',
                    drawBorder: false,
                },
                ticks: {
                    color: '#D1D5DB',
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };

    return (
        <Card
            className="h-full w-full"
            title={<span className="text-slate-100">Performance Chart</span>}
            style={{
                background: '#1F2937',
                borderRadius: '8px',
                border: '1px solid #374151',
                height: '100%',
            }}
            headStyle={{
                background: '#111827',
                borderBottom: '1px solid #374151',
            }}
            bodyStyle={{
                padding: '24px',
                height: 'calc(100% - 58px)', // Subtract header height
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{ flex: 1, minHeight: '400px', width: '100%' }}>
                <Bar options={options} data={chartData} />
            </div>
        </Card>
    );
};

export default ClientChart;
```

## components\dashboard\DashboardHeader.tsx

```typescript
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
    const { totalQualified, newAccounts, yesterdayAccounts, refreshData } = useSalesforce(dateRange);

    const handleAccountToggle = (accountId: string) => {
        if (selectedAccounts.includes(accountId)) {
            onAccountsChange(selectedAccounts.filter(id => id !== accountId));
        } else {
            onAccountsChange([...selectedAccounts, accountId]);
        }
    };

    const handleRefresh = async () => {
        try {
            await Promise.all([
                onRefresh(),
                refreshData(dateRange),
                refreshSalesforceData(dateRange)
            ]);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
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
                                LSA: {formatCurrency(lsaMetrics?.dailyMetrics?.reduce((acc, metric) => acc + (metric.cost || 0), 0) || 0)}
                            </div>
                            <div className="text-slate-400">
                                PPC: {formatCurrency(campaigns?.filter(c => c.accountId === '5292473333')?.reduce((acc, c) => acc + (c.cost || 0), 0) || 0)}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-purple-500/50 transition-all">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400">Leads</h3>
                                <div className="mt-2">
                                    <p className="text-3xl font-bold text-slate-100">
                                        {totalQualified}
                                    </p>
                                </div>
                            </div>

                            <div className="border-l border-slate-600 pl-4">
                                <h3 className="text-sm font-medium text-slate-400">Cost Per Lead</h3>
                                <div className="mt-2">
                                    <p className="text-3xl font-bold text-slate-100">
                                        {formatCurrency(
                                            (lsaMetrics?.dailyMetrics?.reduce((acc, metric) => acc + (metric.cost || 0), 0) || 0) / 
                                            (totalQualified || 1)
                                        )}
                                    </p>
                                    <div className="mt-2 text-sm text-slate-400">
                                        Total Cost: {formatCurrency(lsaMetrics?.dailyMetrics?.reduce((acc, metric) => acc + (metric.cost || 0), 0) || 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-blue-500/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400">LSA {dateRange.toLowerCase()}</h3>
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

```

## components\dashboard\DashboardLayout.tsx

```typescript
 
```

## components\dashboard\MetricCard.tsx

```typescript
// src/components/Dashboard/MetricCard.tsx

import React from 'react';
import { Card } from '@/components/ui';

interface MetricCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subValue, icon }) => {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 w-full h-full 
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
            border border-slate-700/50
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
            hover:border-slate-600/50
            transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-400 tracking-wide">{title}</h3>
                {icon && <div className="text-slate-400 opacity-75 hover:opacity-100 transition-opacity">{icon}</div>}
            </div>
            <div className="mt-3">
                <p className="text-3xl font-bold text-slate-100 tracking-tight">{value}</p>
                {subValue && (
                    <p className="text-sm text-slate-400 mt-2 font-medium">{subValue}</p>
                )}
            </div>
        </div>
    );
};
```

## components\dashboard\PerformanceChart.tsx

```typescript
// src/components/Dashboard/PerformanceChart.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import type { Campaign } from '@/types/campaign';
import type { LSAMetrics } from '@/types/lsa';

interface ClientChartProps {
    campaigns: Campaign[];
    lsaMetrics?: LSAMetrics | null;
}

const ClientSideChart = dynamic(
    () => import('@/components/Dashboard/ClientChart'),
    { ssr: false }
) as React.ComponentType<ClientChartProps>;

interface PerformanceChartProps {
    campaigns: Campaign[];
    lsaMetrics?: LSAMetrics | null;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ campaigns, lsaMetrics }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-[500px] bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 animate-pulse" />
        );
    }

    return (
        <div className="w-full h-[500px]">
            <ClientSideChart campaigns={campaigns} lsaMetrics={lsaMetrics} />
        </div>
    );
};
```

## components\layouts\MainLayout.tsx

```typescript
// src/components/layouts/MainLayout.tsx

import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatWidget } from '../Chat/ChatWidget';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 ml-64 px-6 py-6">
                {children}
            </main>
            <ChatWidget />
        </div>
    );
};
```

## components\layouts\Sidebar.tsx

```typescript
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdDashboard, MdChat } from 'react-icons/md';

export const Sidebar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: MdDashboard
        },
        {
            name: 'Chat',
            path: '/chat',
            icon: MdChat
        }
    ];

    return (
        <div className="w-64 h-screen bg-slate-800 fixed left-0 top-0 border-r border-slate-700">
            <div className="p-4">
                <h1 className="text-xl font-bold text-white mb-8">Google Ads Assistant</h1>
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive(item.path)
                                        ? 'bg-slate-700 text-white'
                                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}; 
```

## components\ui\Button.tsx

```typescript
// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
        ghost: 'hover:bg-slate-700 text-slate-300'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};
```

## components\ui\Card.tsx

```typescript
// src/components/ui/Card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-slate-800 rounded-xl shadow-lg border border-slate-700 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }: CardProps) => (
  <div className={`p-4 border-b border-slate-700 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }: CardProps) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);
```

## components\ui\Dialog.tsx

```typescript
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// Make sure to export the component
export { Dialog, DialogTrigger, DialogPortal, DialogClose }

```

## components\ui\index.ts

```typescript
export { Button } from './Button';
export { Card, CardHeader, CardContent } from './Card';
export { Input } from './Input';
export { Select } from './Select';
export { Dialog } from './Dialog';
// export { Badge } from './Badge';

```

## components\ui\Input.tsx

```typescript
// src/components/ui/Input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', icon, error, ...props }, ref) => (
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {icon}
                </div>
            )}
            <input
                ref={ref}
                className={`
          w-full rounded-lg bg-slate-700 border border-slate-600
          px-4 py-2 text-slate-100 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${icon ? 'pl-10' : ''}
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
);

Input.displayName = 'Input';
```

## components\ui\Select.tsx

```typescript
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
    // Add any custom props here
}

export function Select(props: SelectProps) {
    return <SelectPrimitive.Root {...props} />
}

export default Select

```

## hooks\useCampaigns.ts

```typescript
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
```

## hooks\useChat.ts

```typescript
// src/hooks/useChat.ts

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import type { Message } from '@prisma/client';
import type { Thread } from '../types';

interface ChatState {
    threads: Thread[];
    currentThread: Thread | null;
    messages: Message[];
    loading: boolean;
    error: string | null;
    setThreads: (threads: Thread[]) => void;
    setCurrentThread: (thread: Thread | null) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    clearError: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    threads: [],
    currentThread: null,
    messages: [],
    loading: false,
    error: null,
    setThreads: (threads) => set({ threads }),
    setCurrentThread: (thread) => set({ currentThread: thread }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    clearError: () => set({ error: null })
}));

export const useChat = () => {
    const store = useChatStore();
    const [sendingMessage, setSendingMessage] = useState(false);

    const sendMessage = async (content: string) => {
        if (!store.currentThread) return;

        try {
            setSendingMessage(true);

            // Add user message
            const userMessage = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    threadId: store.currentThread.id,
                    content,
                    role: 'user'
                })
            }).then(res => res.json());

            store.addMessage(userMessage);

            // Get AI response
            const assistantMessage = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    threadId: store.currentThread.id,
                    messages: [...store.messages, userMessage]
                })
            }).then(res => res.json());

            store.addMessage(assistantMessage);
        } catch (error) {
            store.error = 'Failed to send message';
        } finally {
            setSendingMessage(false);
        }
    };

    const loadThreads = async () => {
        try {
            const threads = await fetch('/api/threads').then(res => res.json());
            store.setThreads(threads);
        } catch (error) {
            store.error = 'Failed to load threads';
        }
    };

    const loadMessages = async (threadId: string) => {
        try {
            const messages = await fetch(`/api/messages?threadId=${threadId}`).then(res => res.json());
            store.setMessages(messages);
        } catch (error) {
            store.error = 'Failed to load messages';
        }
    };

    return {
        ...store,
        sendMessage,
        sendingMessage,
        loadThreads,
        loadMessages
    };
};
```

## hooks\useLeadTypePreferences.ts

```typescript
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useLeadTypePreferences = () => {
    const [preferences, setPreferences] = useLocalStorage('leadTypePreferences', {
        visibleTypes: ['Purchases', 'Submit Lead Forms', 'Converted Leads', 'Phone Calls', 'Qualified Leads', 'Request Quotes'],
        sortField: 'count',
        sortDirection: 'desc'
    });

    const toggleLeadType = (type: string) => {
        setPreferences(prev => ({
            ...prev,
            visibleTypes: prev.visibleTypes.includes(type)
                ? prev.visibleTypes.filter(t => t !== type)
                : [...prev.visibleTypes, type]
        }));
    };

    return {
        preferences,
        toggleLeadType,
        setPreferences
    };
};
```

## hooks\useLocalStorage.ts

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

```

## hooks\useSalesforce.ts

```typescript
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
```

## hooks\useSettings.ts

```typescript
// src/hooks/useSettings.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
    theme: 'light' | 'dark';
    refreshInterval: number;
    autoRefresh: boolean;
    notifications: boolean;
    selectedAccounts: string[];
    dateRange: string;
}

interface SettingsState extends Settings {
    updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'dark',
            refreshInterval: 300000,
            autoRefresh: true,
            notifications: true,
            selectedAccounts: [],
            dateRange: 'TODAY',
            updateSettings: (newSettings) => set((state) => ({
                ...state,
                ...newSettings
            }))
        }),
        {
            name: 'settings-store'
        }
    )
);
```

## hooks\useSortPreferences.ts

```typescript
import { useLocalStorage } from './useLocalStorage';

export type SortDirection = 'asc' | 'desc';

export interface SortPreference<T> {
    field: T;
    direction: SortDirection;
}

export function useSortPreferences<T extends string>() {
    const [sortPreference, setSortPreference] = useLocalStorage<SortPreference<T>>(
        'campaign-table-sort',
        { field: 'cost' as T, direction: 'desc' }
    );

    const toggleSort = (field: T) => {
        setSortPreference((prev: SortPreference<T>) => ({
            field,
            direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return { sortPreference, toggleSort };
}
```

## lib\api.ts

```typescript
// src/utils/api.ts

import { prisma } from '@/lib/db';
import { getCampaignStats, getAccountInfo } from '@/lib/google-ads';
import { chatCompletion } from '@/lib/openai';

export async function createThread(title: string, accountId?: string) {
  return prisma.thread.create({
    data: { title, accountId }
  });
}

export async function getThreads() {
  return prisma.thread.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { 
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      }
    }
  });
}

export async function getMessages(threadId: string) {
  return prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

export async function addMessage(threadId: string, content: string, role: 'user' | 'assistant') {
  return prisma.message.create({
    data: { threadId, content, role }
  });
}

export async function getUserSettings() {
  const settings = await prisma.userSettings.findFirst();
  return settings || prisma.userSettings.create({
    data: {} // Will use defaults from schema
  });
}

export async function updateUserSettings(data: Partial<{
  theme: string;
  dateRange: string;
  refreshRate: number;
  lastAccount: string;
}>) {
  return prisma.userSettings.update({
    where: { id: 'default' },
    data
  });
}
```

## lib\chartConfig.ts

```typescript
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

if (typeof window !== 'undefined') {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
} 
```

## lib\db.ts

```typescript
// src/lib/db.ts

import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
```

## lib\google-ads.ts

```typescript
import { GoogleAdsApi } from 'google-ads-api';
import { Session } from 'next-auth';
import { prisma } from '@/lib/db';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface CPCTrend {
    currentValue: number;
    previousValue: number;
    direction: TrendDirection;
    lastUpdated: string;
}

interface GoogleAdsCampaign {
    id: string;
    name: string;
    status?: string;
    bidding_strategy_type?: string | number;
    target_cpa?: {
        target_cpa_micros: string | number;
    };
    target_roas?: {
        target_roas: string | number;
    };
    maximize_conversion_value?: {
        target_roas: string | number;
    };
    maximize_conversions?: {
        target_cpa_micros: string | number;
    };
    optimization_score?: number;
}

interface GoogleAdsResponse {
    campaign?: {
        id: string;
        name: string;
        status: string;
        bidding_strategy_type?: string | number;
        target_cpa?: {
            target_cpa_micros: string | number;
        };
        target_roas?: {
            target_roas: string | number;
        };
        maximize_conversion_value?: {
            target_roas: string | number;
        };
        maximize_conversions?: {
            target_cpa_micros: string | number;
        };
    };
    metrics?: {
        cost_micros: string | number;
        clicks: string | number;
        conversions: string | number;
        impressions: string | number;
        conversions_value?: string | number;
    };
    segments?: {
        date: string;
        conversion_action?: string;
        conversion_action_name?: string;
        conversion_action_category?: string;
    };
}

interface ConversionActionResponse {
    campaign?: {
        id: string;
        name: string;
    };
    segments?: {
        conversion_action: string;
        conversion_action_name: string;
        conversion_action_category: string;
        date: string;
    };
    metrics?: {
        conversions: string | number;
        conversions_value: string | number;
    };
}

interface CustomerQueryResponse {
    customer?: {
        descriptive_name: string;
        currency_code: string;
        time_zone: string;
    };
}

const googleAdsClient = new GoogleAdsApi({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    developer_token: process.env.GOOGLE_DEVELOPER_TOKEN ?? '',
});

interface GoogleAdsSession extends Session {
    refreshToken?: string;
    accessToken?: string;
}

export interface ConversionAction {
    name: string;
    value: number;
    category?: string;
}

export interface Campaign {
    id: string;
    name: string;
    status: string;
    cost: number;
    clicks: number;
    conversions: number;
    impressions: number;
    date: string;
    accountId?: string;
    targetCpa?: number;
    targetRoas?: number;
    biddingStrategyType?: string;
    maximizeConversionValue?: boolean;
    cpc: number;
    cpcTrend: CPCTrend;
    conversionActions: ConversionAction[];
    previousHourSpend?: number;
    previousCpc?: number;
}

export async function getGoogleAdsCustomer(session: GoogleAdsSession, accountId?: string): Promise<any> {
    if (!session?.refreshToken) {
        throw new Error('Google Ads authentication required. Please check your credentials.');
    }

    return googleAdsClient.Customer({
        customer_id: accountId ?? process.env.GOOGLE_ADS_DEFAULT_ACCOUNT_ID ?? '',
        login_customer_id: process.env.GOOGLE_LOGIN_CUSTOMER_ID ?? '',
        refresh_token: session.refreshToken,
    });
}

export async function getCampaignStats(
    session: GoogleAdsSession,
    accountId: string,
    dateRange: string
): Promise<Campaign[]> {
    try {
        if (!session?.refreshToken) {
            console.error('❌ Missing refresh token');
            return [];
        }

        const customer = await getGoogleAdsCustomer(session, accountId);
        if (!customer) {
            console.error('❌ Failed to get Google Ads customer');
            return [];
        }

        const formattedDateRange = formatDateRange(dateRange);
        const [metricsQuery, conversionQuery] = buildCampaignQueries(formattedDateRange);

        console.log(`🔍 Fetching campaigns for Account ${accountId}`);
        console.log(`📅 Using date range: ${formattedDateRange}`);

        // Fetch general metrics
        const metricsResponse = await customer.query(metricsQuery);
        console.log('📊 Raw Metrics Response:', JSON.stringify(metricsResponse, null, 2));

        // Fetch conversion actions
        const conversionResponse = await customer.query(conversionQuery);
        console.log('📊 Raw Conversion Response:', JSON.stringify(conversionResponse, null, 2));

        if (!Array.isArray(metricsResponse)) {
            console.warn('⚠️ Invalid metrics response format:', metricsResponse);
            return [];
        }

        const conversionMap = new Map<string, Array<{ name: string; value: number; category?: string }>>();

        if (Array.isArray(conversionResponse)) {
            conversionResponse.forEach((row: ConversionActionResponse) => {
                if (row.campaign?.id && row.segments?.conversion_action_name) {
                    const existing = conversionMap.get(row.campaign.id) || [];
                    existing.push({
                        name: row.segments.conversion_action_name,
                        value: Number(row.metrics?.conversions) || 0,
                        category: row.segments.conversion_action_category
                    });
                    conversionMap.set(row.campaign.id, existing);
                }
            });
        }

        const campaigns = metricsResponse
            .map((row: GoogleAdsResponse) => {
                try {
                    if (!row.campaign?.id || !row.campaign?.name) {
                        console.warn('⚠️ Skipping invalid campaign data:', row);
                        return null;
                    }
                    return formatCampaignResponse(row, accountId, conversionMap.get(row.campaign.id));
                } catch (formatError) {
                    console.warn('⚠️ Error formatting campaign:', formatError, row);
                    return null;
                }
            })
            .map(async (campaign) => {
                if (campaign === null) return null;
                return campaign;
            })
            .filter((campaign): campaign is Promise<Campaign> => campaign !== null);

        const resolvedCampaigns = await Promise.all(campaigns.filter((c): c is Promise<Campaign> => c !== null));
        console.log(`✅ Successfully processed ${resolvedCampaigns.length} campaigns`);
        return resolvedCampaigns;

    } catch (error: unknown) {
        console.error('❌ Google Ads API Error:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                cause: error.cause
            });
            return [];
        }
        console.error('Unknown error type:', error);
        return [];
    }
}

function formatDateRange(dateRange: string): string {
    switch (dateRange.toLowerCase()) {
        case 'last30':
        case 'last_30_days':
            return 'LAST_30_DAYS';
        case 'last7':
        case 'last_7_days':
            return 'LAST_7_DAYS';
        case 'today':
            return 'TODAY';
        case 'yesterday':
            return 'YESTERDAY';
        case 'this_month':
            return 'THIS_MONTH';
        default:
            return 'LAST_30_DAYS';
    }
}

function buildCampaignQueries(dateRange: string): [string, string] {
    const metricsQuery = `
        SELECT 
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.bidding_strategy_type,
            campaign.target_cpa.target_cpa_micros,
            campaign.target_roas.target_roas,
            campaign.maximize_conversion_value.target_roas,
            campaign.maximize_conversions.target_cpa_micros,
            metrics.cost_micros,
            metrics.clicks,
            metrics.impressions,
            metrics.conversions,
            metrics.conversions_value,
            segments.date
        FROM campaign 
        WHERE 
            segments.date DURING ${dateRange}
            AND campaign.status IN ('ENABLED', 'PAUSED', 'REMOVED')
        ORDER BY campaign.name ASC
    `;

    const conversionQuery = `
        SELECT
            campaign.id,
            campaign.name,
            segments.conversion_action_name,
            segments.conversion_action_category,
            metrics.conversions
        FROM campaign
        WHERE
            segments.date DURING ${dateRange}
            AND campaign.status IN ('ENABLED', 'PAUSED', 'REMOVED')
        ORDER BY campaign.name ASC
    `;

    return [metricsQuery, conversionQuery];
}

function getBiddingStrategyType(type: number): string {
    const strategies: { [key: number]: string } = {
        6: 'TARGET_CPA',
        10: 'MAXIMIZE_CONVERSIONS',
        11: 'MAXIMIZE_CONVERSION_VALUE',
        12: 'TARGET_ROAS'
    };
    return strategies[type] || 'UNKNOWN';
}

async function formatCampaignResponse(
    row: GoogleAdsResponse,
    accountId: string,
    conversionActions?: Array<{ name: string; value: number; category?: string }>
): Promise<Campaign> {
    if (!row.campaign || !row.metrics || !row.segments) {
        throw new Error('Invalid response format: missing required fields');
    }

    const { campaign, metrics, segments } = row;

    const biddingStrategyType = getBiddingStrategyType(Number(campaign.bidding_strategy_type));
    let targetCpa, targetRoas;

    switch (biddingStrategyType) {
        case 'TARGET_CPA':
            targetCpa = campaign.target_cpa?.target_cpa_micros
                ? Number(campaign.target_cpa.target_cpa_micros) / 1_000_000
                : undefined;
            break;
        case 'MAXIMIZE_CONVERSIONS':
            targetCpa = campaign.maximize_conversions?.target_cpa_micros
                ? Number(campaign.maximize_conversions.target_cpa_micros) / 1_000_000
                : undefined;
            break;
        case 'TARGET_ROAS':
            targetRoas = campaign.target_roas?.target_roas
                ? Number(campaign.target_roas.target_roas)
                : undefined;
            break;
        case 'MAXIMIZE_CONVERSION_VALUE':
            targetRoas = campaign.maximize_conversion_value?.target_roas
                ? Number(campaign.maximize_conversion_value.target_roas)
                : undefined;
            break;
    }

    const status = campaign.status ? String(campaign.status).toLowerCase() : 'unknown';
    const clicks = Number(metrics.clicks) || 0;
    const costMicros = Number(metrics.cost_micros) || 0;
    const cost = costMicros / 1_000_000;
    const cpc = clicks > 0 ? cost / clicks : 0;

    // Get previous hour's data
    const previousHourData = await prisma.cPCHistory.findFirst({
        where: {
            campaignId: String(campaign.id),
            timestamp: {
                gte: new Date(Date.now() - 2 * 60 * 60 * 1000),
                lt: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
        },
        orderBy: {
            timestamp: 'desc'
        }
    });

    // Get current hour's average
    const currentHourData = await prisma.cPCHistory.aggregate({
        where: {
            campaignId: String(campaign.id),
            timestamp: {
                gte: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
        },
        _avg: {
            cpc: true,
            cost: true
        }
    });

    const currentHourCPC = currentHourData._avg.cpc || cpc;
    const previousHourCPC = previousHourData?.cpc || currentHourCPC;

    const cpcTrend = {
        currentValue: currentHourCPC,
        previousValue: previousHourCPC,
        direction: previousHourData ?
            (currentHourCPC > previousHourCPC ? 'up' :
                currentHourCPC < previousHourCPC ? 'down' : 'stable') as TrendDirection :
            'stable' as TrendDirection,
        lastUpdated: new Date().toISOString()
    };

    return {
        id: String(campaign.id),
        name: String(campaign.name),
        status,
        cost,
        clicks,
        conversions: Number(metrics.conversions) || 0,
        impressions: Number(metrics.impressions) || 0,
        date: String(segments.date),
        accountId,
        targetCpa,
        targetRoas,
        biddingStrategyType,
        maximizeConversionValue: biddingStrategyType === 'MAXIMIZE_CONVERSION_VALUE',
        cpc,
        cpcTrend,
        previousHourSpend: previousHourData?.cost || cost,
        conversionActions: conversionActions || [],
        previousCpc: previousHourData?.cpc || cpc
    };
}

export async function getAccountInfo(session: GoogleAdsSession, accountId: string): Promise<{
    name: string;
    currency: string;
    timezone: string;
}> {
    try {
        const customer = await getGoogleAdsCustomer(session, accountId);
        const query = `
            SELECT
                customer.descriptive_name,
                customer.currency_code,
                customer.time_zone
            FROM customer
        `;

        const [response] = await customer.query(query);
        if (!response.customer) {
            throw new Error('Invalid response format from Google Ads API');
        }

        return {
            name: response.customer.descriptive_name,
            currency: response.customer.currency_code,
            timezone: response.customer.time_zone,
        };
    } catch (error: unknown) {
        console.error('Google Ads API Error:', error);
        throw new Error('Failed to fetch account info');
    }
}

export async function calculateCPCTrend(campaignId: string, currentCPC: number): Promise<CPCTrend> {
    try {
        const response = await fetch(`/api/campaigns/cpc-history?campaignId=${campaignId}&hours=1`);
        const history = await response.json();

        const previousCPC = history[0]?.cpc ?? currentCPC;
        const direction: TrendDirection =
            currentCPC > previousCPC ? 'up' :
                currentCPC < previousCPC ? 'down' :
                    'stable';

        return {
            currentValue: currentCPC,
            previousValue: previousCPC,
            direction,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        return {
            currentValue: currentCPC,
            previousValue: currentCPC,
            direction: 'stable',
            lastUpdated: new Date().toISOString()
        };
    }
}

export async function storeCPCHistory(
    campaignId: string,
    accountId: string,
    cpc: number,
    cost: number
): Promise<void> {
    if (!campaignId || !accountId) return;

    try {
        // Store data point
        await prisma.cPCHistory.create({
            data: {
                campaignId,
                accountId,
                cpc,
                cost,
                timestamp: new Date()
            }
        });

        // Clean up old data points (keep last 24 hours only)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await prisma.cPCHistory.deleteMany({
            where: {
                campaignId,
                timestamp: {
                    lt: twentyFourHoursAgo
                }
            }
        });
    } catch (error) {
        console.error('Error storing CPC history:', error);
    }
}
```

## lib\lsa.ts

```typescript
import { Session } from 'next-auth';
import { GoogleAdsApi } from 'google-ads-api';
import { LSAMetrics } from '@/types/lsa';
import { ChartData } from '@/types/chart';

interface LSASession extends Session {
    refreshToken?: string;
    accessToken?: string;
}

const lsaClient = new GoogleAdsApi({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    developer_token: process.env.GOOGLE_DEVELOPER_TOKEN ?? '',
});

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDateRangeFilter(dateRange: string, field: string): string {
    const now = new Date();
    let startDate = new Date(now);
    let endDate = new Date(now);

    switch (dateRange.toLowerCase()) {
        case 'today':
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'yesterday':
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            endDate.setDate(now.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'last_7_days':
            startDate.setDate(now.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'this_month':
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        default:
            startDate.setDate(now.getDate() - 30);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
    }

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    return `${field} BETWEEN '${start}' AND '${end}'`;
}

export async function getLSAStats(
    session: LSASession,
    dateRange: string
): Promise<LSAMetrics> {
    try {
        console.log('🔄 Starting LSA data fetch...');
        console.log('📅 Date Range:', dateRange);

        if (!session?.refreshToken) {
            console.warn('⚠️ No access token available for LSA data');
            return {
                ...getEmptyMetrics(),
                error: 'Authentication required for LSA data access'
            };
        }

        const lsaAccountId = process.env.HARVEST_LSA_ID;
        console.log('🏢 Using LSA Account ID:', lsaAccountId);

        if (!lsaAccountId) {
            console.warn('⚠️ Missing LSA Account ID configuration');
            return {
                ...getEmptyMetrics(),
                error: 'LSA Account ID not configured'
            };
        }

        const customer = await lsaClient.Customer({
            customer_id: lsaAccountId,
            login_customer_id: process.env.GOOGLE_LOGIN_CUSTOMER_ID,
            refresh_token: session.refreshToken,
        });

        try {
            // Get LSA campaign data with metrics
            const campaignQuery = `
                SELECT
                    campaign.id,
                    campaign.name,
                    campaign.status,
                    campaign_budget.amount_micros,
                    metrics.cost_micros,
                    metrics.all_conversions,
                    metrics.phone_through_rate,
                    segments.date
                FROM campaign
                WHERE campaign.advertising_channel_type = 'LOCAL_SERVICES'
                AND campaign.status != 'REMOVED'
                AND ${getDateRangeFilter(dateRange, 'segments.date')}
            `;

            console.log('🔍 Getting LSA campaign details...');
            const campaignResponse = await customer.query(campaignQuery);
            console.log('📊 Campaign Response:', JSON.stringify(campaignResponse, null, 2));

            let messageLeads = 0;
            let callLeads = 0;
            let totalSpend = 0;
            let activeCampaigns = 0;
            let campaignBudget = 0;
            let dailyMetrics: { [key: string]: { date: string; cost: number; conversions: number } } = {};

            // Process campaign data
            if (Array.isArray(campaignResponse)) {
                campaignResponse.forEach((row: any) => {
                    const date = row.segments?.date;
                    if (row.campaign?.status === 2) {
                        activeCampaigns++;
                    }
                    if (row.campaign_budget?.amount_micros) {
                        campaignBudget += Number(row.campaign_budget.amount_micros) / 1_000_000;
                    }
                    if (date && row.metrics) {
                        const dailyCost = Number(row.metrics.cost_micros || 0) / 1_000_000;
                        const dailyConversions = Number(row.metrics.all_conversions || 0);
                        
                        // Based on the data, most conversions are phone calls (approximately 95%)
                        const phoneCallConversions = Math.round(dailyConversions * 0.95);
                        const messageConversions = dailyConversions - phoneCallConversions;

                        dailyMetrics[date] = {
                            date,
                            cost: dailyCost,
                            conversions: dailyConversions
                        };

                        // Update totals
                        totalSpend += dailyCost;
                        callLeads += phoneCallConversions;
                        messageLeads += messageConversions;
                    }
                });
            }

            const metrics: LSAMetrics = {
                totalLeads: messageLeads + callLeads,
                messageLeads,
                callLeads,
                totalSpend,
                conversations: {
                    total: callLeads + messageLeads,
                    calls: callLeads,
                    messages: messageLeads,
                    avgCallDuration: 0 // Not available through API
                },
                campaigns: {
                    total: campaignResponse?.length || 0,
                    active: activeCampaigns,
                    budget: campaignBudget,
                    details: campaignResponse?.map(row => ({
                        id: String(row.campaign?.id || ''),
                        name: String(row.campaign?.name || ''),
                        status: row.campaign?.status === 2 ? 'Active' : 'Paused',
                        cost: Number(row.metrics?.cost_micros || 0) / 1_000_000,
                        conversions: {
                            total: Number(row.metrics?.all_conversions || 0),
                            calls: Math.round(Number(row.metrics?.all_conversions || 0) * 0.95),
                            messages: Math.round(Number(row.metrics?.all_conversions || 0) * 0.05)
                        }
                    })) || []
                },
                dailyMetrics: Object.values(dailyMetrics)
                    .map(({ date, cost, conversions }) => ({
                        date,
                        cost,
                        clicks: 0,
                        conversions,
                        impressions: 0,
                        conversionTypes: {
                            calls: Math.round(conversions * 0.95),
                            messages: Math.round(conversions * 0.05)
                        }
                    } as ChartData))
                    .sort((a, b) => a.date.localeCompare(b.date))
            };

            // Ensure we have at least one data point for the chart
            if (metrics.dailyMetrics.length === 0 && totalSpend > 0) {
                const today = new Date().toISOString().split('T')[0];
                metrics.dailyMetrics.push({
                    date: today,
                    cost: totalSpend,
                    clicks: 0,
                    conversions: messageLeads + callLeads,
                    impressions: 0,
                    conversionTypes: {
                        calls: callLeads,
                        messages: messageLeads
                    }
                } as ChartData);
            }

            console.log('📊 Final LSA Metrics:', metrics);
            return metrics;

        } catch (queryError) {
            console.error('❌ LSA Query Error:', queryError);
            if (queryError instanceof Error) {
                console.error('Query Error details:', {
                    message: queryError.message,
                    stack: queryError.stack,
                    name: queryError.name
                });
            }
            throw queryError;
        }

    } catch (error) {
        console.error('❌ LSA API Error:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
        }
        return getEmptyMetrics();
    }
}

function getEmptyMetrics(): LSAMetrics {
    return {
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
} 
```

## lib\openai.ts

```typescript
// src/lib/openai.ts

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert Google Ads assistant. You have access to the following ad accounts:
- Wright's Lights (ID: ${process.env.WRIGHTS_LIGHTS_ID})
- Harvest Insurance (ID: ${process.env.HARVEST_INSURANCE_ID})
- Neal Roofing (ID: ${process.env.NEAL_ROOFING_ID})

You can help analyze campaign data, suggest optimizations, and execute queries to fetch specific metrics.
When data is requested, use the appropriate account ID and format your response clearly.

Example queries you can handle:
1. "Show me Wright's Lights performance for last month"
2. "Compare CTR across all accounts"
3. "What's the best performing campaign for Neal Roofing?"

Format your responses with clear headings and metrics when presenting data.`;

export async function chatCompletion(
    messages: ChatCompletionMessageParam[],
    threadContext?: { accountId?: string; dateRange?: string }
) {
    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...(threadContext ? [{
                    role: 'system' as const,
                    content: `Current context: Account ${threadContext.accountId}, Date range: ${threadContext.dateRange}`
                }] : []),
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        return completion.choices[0].message;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate response');
    }
}
```

## lib\prisma.ts

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
```

## lib\salesforce.ts

```typescript
import jsforce from 'jsforce';

const conn = new jsforce.Connection({
    loginUrl: 'https://login.salesforce.com',
    version: '57.0'
});

export async function getTotalAccounts(): Promise<number> {
    try {
        if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD || !process.env.SALESFORCE_SECURITY_TOKEN) {
            throw new Error('Missing Salesforce credentials in environment variables');
        }

        await conn.login(
            process.env.SALESFORCE_USERNAME,
            `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
        );

        const result = await conn.query(
            `SELECT COUNT() FROM Account WHERE Name LIKE '%Harvest Insurance%'`
        );

        console.debug('Total Accounts Query Result:', result);
        return result.totalSize;
    } catch (error) {
        console.error('Error fetching total Salesforce accounts:', error);
        return 0;
    }
}

export async function getTodayNewAccounts(): Promise<number> {
    try {
        if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD || !process.env.SALESFORCE_SECURITY_TOKEN) {
            throw new Error('Missing Salesforce credentials in environment variables');
        }

        await conn.login(
            process.env.SALESFORCE_USERNAME,
            `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_SECURITY_TOKEN}`
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await conn.query(
            `SELECT COUNT() FROM Account WHERE CreatedDate >= ${today.toISOString()} AND Name LIKE '%Harvest Insurance%'`
        );

        console.debug('Today New Accounts Query Result:', result);
        return result.totalSize;
    } catch (error) {
        console.error('Error fetching Salesforce accounts:', error);
        return 0;
    }
}
```

## pages\404.tsx

```typescript
 
```

## pages\_app.tsx

```typescript
// src/pages/_app.tsx

import React from 'react';
import { AppProps } from 'next/app';
import { useSettings } from '@/hooks/useSettings';
import '@/styles/globals.css';
import { SessionProvider } from "next-auth/react";
import dynamic from 'next/dynamic';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AntdProvider = dynamic(
  () => import('../providers/AntdProvider'),
  { ssr: false }
);

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const { theme } = useSettings();

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <SessionProvider session={session}>
            <AntdProvider>
                <Component {...pageProps} />
            </AntdProvider>
        </SessionProvider>
    );
}
```

## pages\analytics.tsx

```typescript
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Activity } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Analytics = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const data = [
    { month: 'Mar 2024', cost: 27724.35, leads: 1788, cpl: 15.51 },
    { month: 'Apr 2024', cost: 34224.27, leads: 2506, cpl: 13.66 },
    { month: 'May 2024', cost: 45329.15, leads: 2205, cpl: 20.56 },
    { month: 'Jun 2024', cost: 48713.74, leads: 2869, cpl: 16.98 },
    { month: 'Jul 2024', cost: 53972.73, leads: 2607, cpl: 20.70 },
    { month: 'Aug 2024', cost: 59693.50, leads: 3160, cpl: 18.89 },
    { month: 'Sep 2024', cost: 61110.13, leads: 2868, cpl: 21.31 },
    { month: 'Oct 2024', cost: 75568.96, leads: 3160, cpl: 23.91 },
    { month: 'Nov 2024', cost: 78484.37, leads: 2869, cpl: 27.36 }
  ];

  // Calculate key metrics
  const metrics = {
    totalSpend: data.reduce((acc, curr) => acc + curr.cost, 0),
    totalLeads: data.reduce((acc, curr) => acc + curr.leads, 0),
    avgCPL: data.reduce((acc, curr) => acc + curr.cpl, 0) / data.length,
    monthlyAvgSpend: data.reduce((acc, curr) => acc + curr.cost, 0) / data.length,
    highestCPL: data.reduce((max, curr) => curr.cpl > max.cpl ? curr : max, data[0]),
    lowestCPL: data.reduce((min, curr) => curr.cpl < min.cpl ? curr : min, data[0]),
    bestLeadMonth: data.reduce((max, curr) => curr.leads > max.leads ? curr : max, data[0]),
    worstLeadMonth: data.reduce((min, curr) => curr.leads < min.leads ? curr : min, data[0]),
    spendGrowth: ((data[data.length - 1].cost - data[0].cost) / data[0].cost * 100).toFixed(1),
    leadGrowth: ((data[data.length - 1].leads - data[0].leads) / data[0].leads * 100).toFixed(1),
    cplGrowth: ((data[data.length - 1].cpl - data[0].cpl) / data[0].cpl * 100).toFixed(1)
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg shadow-xl">
          <p className="text-gray-300 font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center space-x-4">
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name.toLowerCase().includes('cost') || entry.name.toLowerCase().includes('spend')
                  ? `$${entry.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-gray-100">Loading...</div>
    </div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Campaign Performance Analytics
            </h1>
            <p className="text-gray-400 mt-2">Comprehensive analysis with full context</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span className="text-gray-300">March 2024 - November 2024</span>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Campaign Spend</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ${metrics.totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-3 bg-blue-400/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-400">↑ {metrics.spendGrowth}%</span>
                <span className="text-gray-500 ml-2">since March</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Monthly avg: ${metrics.monthlyAvgSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Leads</p>
                  <p className="text-2xl font-bold text-purple-400">{metrics.totalLeads.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-400/10 rounded-lg">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-400">↑ {metrics.leadGrowth}%</span>
                <span className="text-gray-500 ml-2">since March</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Best: {metrics.bestLeadMonth.month} ({metrics.bestLeadMonth.leads.toLocaleString()})
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Cost Per Lead</p>
                  <p className="text-2xl font-bold text-green-400">${metrics.avgCPL.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-400/10 rounded-lg">
                  <Activity className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Range: ${metrics.lowestCPL.cpl.toFixed(2)} to ${metrics.highestCPL.cpl.toFixed(2)}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Best: {metrics.lowestCPL.month} @ ${metrics.lowestCPL.cpl.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-amber-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Leads per $1000</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {(metrics.totalLeads / (metrics.totalSpend / 1000)).toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-amber-400/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Total spend: ${metrics.totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Total leads: {metrics.totalLeads.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Spend vs. Cost per Lead Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data}>
                    <defs>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <YAxis yAxisId="left" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      name="Total Spend"
                      fill="url(#costGradient)"
                      stroke="#818cf8"
                      yAxisId="left"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone"
                      dataKey="cpl" 
                      name="Cost per Lead" 
                      stroke="#34d399"
                      yAxisId="right"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Monthly Lead Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <defs>
                      <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="leads" 
                      name="Leads Generated"
                      fill="url(#leadsGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Context Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Cost Analysis Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Highest CPL Period</span>
                    <span className="font-medium text-red-400">
                      {metrics.highestCPL.month} (${metrics.highestCPL.cpl.toFixed(2)})
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    During highest CPL month:
                    • Leads: {metrics.highestCPL.leads.toLocaleString()}
                    • Spend: ${metrics.highestCPL.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Lowest CPL Period</span>
                    <span className="font-medium text-green-400">
                      {metrics.lowestCPL.month} (${metrics.lowestCPL.cpl.toFixed(2)})
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    During lowest CPL month:
                    • Leads: {metrics.lowestCPL.leads.toLocaleString()}
                    • Spend: ${metrics.lowestCPL.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Cost Efficiency Trend</span>
                    <span className={`font-medium ${metrics.cplGrowth > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {metrics.cplGrowth}% change
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Campaign start: ${data[0].cpl.toFixed(2)} CPL
                    Campaign end: ${data[data.length - 1].cpl.toFixed(2)} CPL
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Lead Generation Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Best Performing Month</span>
                    <span className="font-medium text-purple-400">
                      {metrics.bestLeadMonth.month}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Leads: {metrics.bestLeadMonth.leads.toLocaleString()}
                    • CPL: ${metrics.bestLeadMonth.cpl.toFixed(2)}
                    • Spend: ${metrics.bestLeadMonth.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Month-over-Month Growth</span>
                    <span className="font-medium text-blue-400">
                      {metrics.leadGrowth}% overall
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Starting volume: {data[0].leads.toLocaleString()} leads
                    Current volume: {data[data.length - 1].leads.toLocaleString()} leads
                  </div>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Campaign Efficiency</span>
                    <span className="font-medium text-amber-400">
                      {(metrics.totalLeads / (metrics.totalSpend / 1000)).toFixed(1)} leads/$1k
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Average monthly leads: {(metrics.totalLeads / data.length).toFixed(0)}
                    • Average monthly spend: ${(metrics.totalSpend / data.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
```

## pages\api\auth\[...nextauth].ts

```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/adwords",
                    access_type: "offline",
                    prompt: "consent",
                    response_type: "code",
                    include_granted_scopes: true,
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);

```

## pages\api\campaigns\cpc-history.ts

```typescript
import { prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { campaignId, accountId, cpc, cost } = req.body;

        try {
            await prisma.cPCHistory.create({
                data: {
                    campaignId,
                    accountId,
                    cpc,
                    cost,
                }
            });

            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to store CPC history' });
        }
    } else if (req.method === 'GET') {
        const { campaignId, hours = 24 } = req.query;

        try {
            const history = await prisma.$queryRaw`
                SELECT 
                    date_trunc('hour', timestamp) as hour,
                    AVG(cpc) as avg_cpc,
                    AVG(cost) as avg_cost
                FROM "CPCHistory"
                WHERE 
                    "campaignId" = ${String(campaignId)}
                    AND timestamp >= ${new Date(Date.now() - Number(hours) * 60 * 60 * 1000)}
                GROUP BY date_trunc('hour', timestamp)
                ORDER BY hour DESC
            `;

            return res.status(200).json(history);
        } catch (error) {
            console.error('CPC History API Error:', error);
            return res.status(500).json({ error: 'Failed to fetch CPC history' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
```

## pages\api\campaigns\update-target.ts

```typescript

```

## pages\api\campaigns\update-tcpa.ts

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getGoogleAdsCustomer } from '@/lib/google-ads';

interface UpdateTCPARequest {
    campaignId: string;
    accountId: string;
    targetCpa: number;
}

// Google Ads API bidding strategy type enum mapping
const BIDDING_STRATEGY_TYPES = {
    0: 'UNSPECIFIED',
    1: 'UNKNOWN',
    2: 'MANUAL_CPC',
    3: 'MANUAL_CPM',
    4: 'MANUAL_CPV',
    5: 'MAXIMIZE_CONVERSIONS',
    6: 'MAXIMIZE_CONVERSION_VALUE',
    7: 'TARGET_CPA',
    8: 'TARGET_IMPRESSION_SHARE',
    9: 'TARGET_ROAS',
    10: 'TARGET_SPEND',
    11: 'PERCENT_CPC',
    12: 'TARGET_CPM'
} as const;

type BiddingStrategyType = keyof typeof BIDDING_STRATEGY_TYPES;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { campaignId, accountId, targetCpa } = req.body as UpdateTCPARequest;

        if (!campaignId || !accountId || targetCpa === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const targetCpaMicros = Math.round(targetCpa * 1_000_000);
        console.log('Processing TCPA update:', { campaignId, accountId, targetCpa, targetCpaMicros });

        const customer = await getGoogleAdsCustomer(session, accountId);

        // First, get the campaign to check its bidding strategy
        const query = `
            SELECT 
                campaign.id,
                campaign.name,
                campaign.bidding_strategy_type,
                campaign.target_cpa.target_cpa_micros,
                campaign.maximize_conversions.target_cpa_micros
            FROM campaign
            WHERE campaign.id = ${campaignId}
        `;

        console.log('Fetching campaign:', { query });
        const [campaign] = await customer.query(query);
        console.log('Campaign details:', campaign);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Get the string representation of the bidding strategy type
        const biddingStrategyTypeNum = campaign.campaign.bidding_strategy_type as BiddingStrategyType;
        const biddingStrategyType = BIDDING_STRATEGY_TYPES[biddingStrategyTypeNum];

        console.log('Bidding strategy:', { numeric: biddingStrategyTypeNum, string: biddingStrategyType });

        // Check if campaign supports Target CPA updates by checking both strategy type and fields
        const hasTargetCpa = campaign.campaign.target_cpa?.target_cpa_micros !== undefined;
        const hasMaxConversionsWithTargetCpa = campaign.campaign.maximize_conversions?.target_cpa_micros !== undefined;
        const supportsTargetCpa = biddingStrategyType === 'TARGET_CPA' ||
            biddingStrategyType === 'MAXIMIZE_CONVERSIONS' ||
            hasTargetCpa ||
            hasMaxConversionsWithTargetCpa;

        if (!supportsTargetCpa) {
            return res.status(400).json({
                error: `Campaign does not support Target CPA updates. Current strategy: ${biddingStrategyType}`
            });
        }

        // Prepare the update based on whether the campaign uses maximize_conversions or target_cpa
        const updateOperation = {
            resource_name: `customers/${accountId}/campaigns/${campaignId}`,
        } as any;

        // If the campaign has maximize_conversions field, use that for the update
        if (hasMaxConversionsWithTargetCpa || biddingStrategyType === 'MAXIMIZE_CONVERSIONS') {
            updateOperation.maximize_conversions = {
                target_cpa_micros: targetCpaMicros.toString()
            };
        } else {
            // Otherwise use target_cpa
            updateOperation.target_cpa = {
                target_cpa_micros: targetCpaMicros.toString()
            };
        }

        console.log('Sending update request:', updateOperation);

        const response = await customer.campaigns.update([updateOperation]);

        console.log('Update response:', response);
        res.status(200).json({ success: true, response });
    } catch (error: any) {
        console.error('Error updating Target CPA:', error);

        // Extract the most relevant error message
        let errorMessage = 'An error occurred while updating the campaign';
        if (error.details?.[0]?.errors?.[0]?.message) {
            errorMessage = error.details[0].errors[0].message;
        } else if (error.errors?.[0]?.message) {
            errorMessage = error.errors[0].message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Include additional error details in development
        const errorResponse = {
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error : undefined
        };

        res.status(500).json(errorResponse);
    }
}

```

## pages\api\campaigns\update-troas.ts

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getGoogleAdsCustomer } from '@/lib/google-ads';

interface UpdateTROASRequest {
    campaignId: string;
    accountId: string;
    targetRoas: number;
}

// Google Ads API bidding strategy type enum mapping
const BIDDING_STRATEGY_TYPES = {
    0: 'UNSPECIFIED',
    1: 'UNKNOWN',
    2: 'MANUAL_CPC',
    3: 'MANUAL_CPM',
    4: 'MANUAL_CPV',
    5: 'MAXIMIZE_CONVERSIONS',
    6: 'MAXIMIZE_CONVERSION_VALUE',
    7: 'TARGET_CPA',
    8: 'TARGET_IMPRESSION_SHARE',
    9: 'TARGET_ROAS',
    10: 'TARGET_SPEND',
    11: 'PERCENT_CPC',
    12: 'TARGET_CPM'
} as const;

type BiddingStrategyType = keyof typeof BIDDING_STRATEGY_TYPES;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { campaignId, accountId, targetRoas } = req.body as UpdateTROASRequest;

        if (!campaignId || !accountId || targetRoas === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Convert percentage to decimal (e.g., 500% -> 5.0)
        const targetRoasValue = targetRoas / 100;
        console.log('Processing TROAS update:', { campaignId, accountId, targetRoas: targetRoasValue });

        const customer = await getGoogleAdsCustomer(session, accountId);

        // First, get the campaign to check its bidding strategy
        const query = `
            SELECT 
                campaign.id,
                campaign.name,
                campaign.bidding_strategy_type,
                campaign.target_roas.target_roas,
                campaign.maximize_conversion_value.target_roas
            FROM campaign
            WHERE campaign.id = ${campaignId}
        `;

        console.log('Fetching campaign:', { query });
        const [campaign] = await customer.query(query);
        console.log('Campaign details:', campaign);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Get the string representation of the bidding strategy type
        const biddingStrategyTypeNum = campaign.campaign.bidding_strategy_type as BiddingStrategyType;
        const biddingStrategyType = BIDDING_STRATEGY_TYPES[biddingStrategyTypeNum];

        console.log('Bidding strategy:', { numeric: biddingStrategyTypeNum, string: biddingStrategyType });

        // Check if campaign supports Target ROAS updates
        const hasTargetRoas = campaign.campaign.target_roas?.target_roas !== undefined;
        const hasMaxConvValueWithTargetRoas = campaign.campaign.maximize_conversion_value?.target_roas !== undefined;
        const supportsTargetRoas = biddingStrategyType === 'TARGET_ROAS' ||
            biddingStrategyType === 'MAXIMIZE_CONVERSION_VALUE' ||
            hasTargetRoas ||
            hasMaxConvValueWithTargetRoas;

        if (!supportsTargetRoas) {
            return res.status(400).json({
                error: `Campaign does not support Target ROAS updates. Current strategy: ${biddingStrategyType}`
            });
        }

        // Prepare the update based on whether the campaign uses maximize_conversion_value or target_roas
        const updateOperation = {
            resource_name: `customers/${accountId}/campaigns/${campaignId}`,
        } as any;

        // If the campaign has maximize_conversion_value field, use that for the update
        if (hasMaxConvValueWithTargetRoas || biddingStrategyType === 'MAXIMIZE_CONVERSION_VALUE') {
            updateOperation.maximize_conversion_value = {
                target_roas: targetRoasValue.toString()
            };
        } else {
            // Otherwise use target_roas
            updateOperation.target_roas = {
                target_roas: targetRoasValue.toString()
            };
        }

        console.log('Sending update request:', updateOperation);

        const response = await customer.campaigns.update([updateOperation]);

        console.log('Update response:', response);
        res.status(200).json({ success: true, response });
    } catch (error: any) {
        console.error('Error updating Target ROAS:', error);

        // Extract the most relevant error message
        let errorMessage = 'An error occurred while updating the campaign';
        if (error.details?.[0]?.errors?.[0]?.message) {
            errorMessage = error.details[0].errors[0].message;
        } else if (error.errors?.[0]?.message) {
            errorMessage = error.errors[0].message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Include additional error details in development
        const errorResponse = {
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error : undefined
        };

        res.status(500).json(errorResponse);
    }
}
```

## pages\api\campaigns.ts

```typescript
// src/pages/api/campaigns.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getCampaignStats } from '@/lib/google-ads';
import { getLSAStats } from '@/lib/lsa';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Session } from 'next-auth';
import { prisma } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { dateRange, accountIds, isLSAEnabled } = req.body;
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        console.log('📅 Date Range:', dateRange);
        console.log('🏢 Account IDs:', accountIds);
        console.log('🔄 LSA Enabled:', isLSAEnabled);

        // Get regular campaign stats
        const campaignsResults = await Promise.all(
            accountIds.map((accountId: string) =>
                getCampaignStats(session, accountId, dateRange)
            )
        );

        let allCampaigns = campaignsResults.flat();
        let lsaMetrics = null;

        // Fetch LSA data if enabled
        if (isLSAEnabled) {
            lsaMetrics = await getLSAStats(session, dateRange);
            allCampaigns.push({
                id: 'lsa-harvest',
                name: 'Harvest LSA',
                status: 'ENABLED',
                cost: lsaMetrics.totalSpend,
                clicks: 0, // LSA doesn't track clicks
                conversions: lsaMetrics.totalLeads,
                impressions: 0, // LSA doesn't track impressions
                date: new Date().toISOString(),
                accountId: process.env.HARVEST_LSA_ID,
                cpc: 0,
                cpcTrend: {
                    currentValue: 0,
                    previousValue: 0,
                    direction: 'stable',
                    lastUpdated: new Date().toISOString()
                },
                conversionActions: [
                    {
                        name: 'Message Leads',
                        value: lsaMetrics.messageLeads,
                        category: 'LSA'
                    },
                    {
                        name: 'Call Leads',
                        value: lsaMetrics.callLeads,
                        category: 'LSA'
                    }
                ]
            });
        }

        console.log(`📈 Total Campaigns Found: ${allCampaigns.length}`);

        // Store CPC history for non-LSA campaigns
        await Promise.all(allCampaigns
            .filter(campaign => campaign.id !== 'lsa-harvest')
            .map(campaign =>
                prisma.cPCHistory.create({
                    data: {
                        campaignId: campaign.id,
                        accountId: campaign.accountId || '',
                        cpc: campaign.cpc || 0,
                        cost: campaign.cost || 0,
                    }
                })
            )
        );

        res.status(200).json({
            campaigns: allCampaigns,
            lsaMetrics
        });
    } catch (error: any) {
        console.error('❌ Campaigns API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
```

## pages\api\log.ts

```typescript
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { event, account, action } = req.body;

        // Log to server console
        console.log('[Account Selection]', {
            timestamp: new Date().toISOString(),
            event,
            account,
            action
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Logging error:', error);
        res.status(500).json({ error: 'Failed to log event' });
    }
} 
```

## pages\api\salesforce\accounts.ts

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { getSalesforceConnection } from '../../../lib/salesforce';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || session.user?.email !== 'william@digitalrocket.biz') {
            return res.status(401).json({ message: 'Only authorized Harvest Insurance users can access this data' });
        }

        const { dateRange } = req.body;
        const conn = await getSalesforceConnection();

        // Handle date range
        let startDate = startOfDay(new Date());
        let endDate = endOfDay(new Date());

        switch (dateRange) {
            case 'YESTERDAY':
                startDate = startOfDay(subDays(new Date(), 1));
                endDate = endOfDay(subDays(new Date(), 1));
                break;
            case 'LAST_7_DAYS':
                startDate = startOfDay(subDays(new Date(), 7));
                break;
            case 'THIS_MONTH':
                startDate = startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
                break;
            // default is TODAY, already set
        }

        // Format dates for Salesforce SOQL
        const formatDateForSalesforce = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        // Query for total accounts in date range
        const totalAccountsQuery = `
            SELECT COUNT(Id) total 
            FROM Account 
            WHERE CreatedDate >= ${formatDateForSalesforce(startDate)}
            AND CreatedDate <= ${formatDateForSalesforce(endDate)}
            AND RecordType.DeveloperName = 'Individual_Account_Suspect_Prospect'
            AND Type = 'Prospect'
        `;

        // Query for today's accounts
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        const todayQuery = `
            SELECT COUNT(Id) total 
            FROM Account 
            WHERE CreatedDate >= ${formatDateForSalesforce(todayStart)}
            AND CreatedDate <= ${formatDateForSalesforce(todayEnd)}
            AND RecordType.DeveloperName = 'Individual_Account_Suspect_Prospect'
            AND Type = 'Prospect'
        `;

        // Query for yesterday's accounts
        const yesterdayStart = startOfDay(subDays(new Date(), 1));
        const yesterdayEnd = endOfDay(subDays(new Date(), 1));
        const yesterdayQuery = `
            SELECT COUNT(Id) total 
            FROM Account 
            WHERE CreatedDate >= ${formatDateForSalesforce(yesterdayStart)}
            AND CreatedDate <= ${formatDateForSalesforce(yesterdayEnd)}
            AND RecordType.DeveloperName = 'Individual_Account_Suspect_Prospect'
            AND Type = 'Prospect'
        `;

        console.log('Date ranges:', {
            startDate: formatDateForSalesforce(startDate),
            endDate: formatDateForSalesforce(endDate),
            todayStart: formatDateForSalesforce(todayStart),
            todayEnd: formatDateForSalesforce(todayEnd),
            yesterdayStart: formatDateForSalesforce(yesterdayStart),
            yesterdayEnd: formatDateForSalesforce(yesterdayEnd)
        });

        console.log('Executing queries:', {
            totalAccountsQuery,
            todayQuery,
            yesterdayQuery
        });

        const [totalResults, todayResults, yesterdayResults] = await Promise.all([
            conn.query(totalAccountsQuery),
            conn.query(todayQuery),
            conn.query(yesterdayQuery)
        ]);

        console.log('Query results:', {
            totalResults: totalResults.records[0],
            todayResults: todayResults.records[0],
            yesterdayResults: yesterdayResults.records[0]
        });

        const response = {
            totalQualified: totalResults.records[0].total,
            todayAccounts: todayResults.records[0].total,
            yesterdayAccounts: yesterdayResults.records[0].total
        };

        console.log('API Response:', response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching Salesforce data:', error);
        res.status(500).json({ message: 'Error fetching Salesforce data' });
    }
}
```

## pages\auth\signin.tsx

```typescript
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function SignIn() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        } else {
            signIn("google", {
                callbackUrl: "/dashboard",
            });
        }
    }, [session, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Redirecting to Google Sign In...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
} 
```

## pages\chat.tsx

```typescript
// src/pages/chat.tsx

import React, { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Input, Button, Select, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import type { Campaign } from '@/types/campaign';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isFetchingCampaigns, setIsFetchingCampaigns] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setIsFetchingCampaigns(true);
        try {
            const response = await fetch('/api/campaigns');
            const data = await response.json();
            // Ensure data is an array before setting it
            setCampaigns(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setCampaigns([]);
        } finally {
            setIsFetchingCampaigns(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    selectedCampaigns,
                    history: messages
                }),
            });

            const data = await response.json();
            
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto">
                <Card className="mb-4">
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder={isFetchingCampaigns ? "Loading campaigns..." : "Select campaigns to analyze"}
                        onChange={setSelectedCampaigns}
                        options={campaigns?.map(campaign => ({
                            value: campaign.id,
                            label: campaign.name || `Campaign ${campaign.id}`
                        })) || []}
                        loading={isFetchingCampaigns}
                        disabled={isFetchingCampaigns}
                    />
                </Card>
                
                <div className="flex-1 overflow-y-auto bg-slate-800 rounded-lg p-4 mb-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-700 text-slate-100'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPressEnter={handleSend}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        loading={isLoading}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default ChatPage;
```

## pages\dashboard.tsx

```typescript
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
        refreshSalesforceData(newDateRange);
    };

    const handleRefresh = async () => {
        try {
            await Promise.all([
                refresh(isLSAEnabled, dateRange),
                refreshSalesforceData(dateRange)
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
        let isRefreshing = false;
        let intervalId: NodeJS.Timeout;
        
        const refreshAll = async () => {
            if (isRefreshing) return;
            
            try {
                isRefreshing = true;
                await handleRefresh();
            } catch (error) {
                console.error('Error during auto-refresh:', error);
            } finally {
                isRefreshing = false;
            }
        };

        // Initial refresh
        refreshAll();

        // Set up auto-refresh interval
        intervalId = setInterval(refreshAll, REFRESH_INTERVAL);

        // Cleanup on unmount
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isLSAEnabled, dateRange, selectedAccounts]); // Dependencies that should trigger a refresh reset

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
```

## pages\index.tsx

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Home() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push('/dashboard');
        } else {
            router.push('/auth/signin');
        }
    }, [session, router]);

    return null;
}
```

## providers\AntdProvider.tsx

```typescript
import React from 'react';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

interface AntdProviderProps {
    children: React.ReactNode;
}

const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
    return (
        <StyleProvider hashPriority="high">
            <ConfigProvider
                theme={{
                    algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 6,
                        colorBgContainer: '#141414',
                        colorBgElevated: '#1f1f1f',
                        colorText: '#ffffff',
                    },
                    components: {
                        Layout: {
                            headerBg: '#141414',
                            bodyBg: '#141414',
                            siderBg: '#141414',
                        },
                        Card: {
                            colorBgContainer: '#1f1f1f',
                        },
                        Button: {
                            colorPrimary: '#1890ff',
                        },
                    },
                }}
            >
                <AntdApp>{children}</AntdApp>
            </ConfigProvider>
        </StyleProvider>
    );
};

export default AntdProvider; 
```

## store\accountSelections.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccountSelectionsState {
    selectedAccounts: string[];
    isLSAEnabled: boolean;
    setSelectedAccounts: (accounts: string[]) => void;
    toggleLSA: () => void;
}

export const useAccountSelections = create(
    persist<AccountSelectionsState>(
        (set) => ({
            selectedAccounts: [],
            isLSAEnabled: false,
            setSelectedAccounts: (accounts) => set({ selectedAccounts: accounts }),
            toggleLSA: () => set((state) => ({ isLSAEnabled: !state.isLSAEnabled })),
        }),
        {
            name: 'account-selections',
        }
    )
); 
```

## store\chat.ts

```typescript
// src/pages/api/chat.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';
import { chatCompletion } from '@/lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { threadId, messages } = req.body;

        const thread = await prisma.thread.findUnique({
            where: { id: threadId }
        });

        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        const response = await chatCompletion(messages, {
            accountId: thread.accountId,
            dateRange: 'LAST_30_DAYS' // Can be made dynamic
        });

        const assistantMessage = await prisma.message.create({
            data: {
                threadId,
                role: 'assistant',
                content: response.content
            }
        });

        res.status(200).json(assistantMessage);
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
}
```

## store\settings.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
    selectedAccounts: string[];
    dateRange: string;
}

interface SettingsStore extends Settings {
    updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettings = create<SettingsStore>()(
    persist(
        (set) => ({
            selectedAccounts: [],
            dateRange: 'TODAY',
            updateSettings: (newSettings) => set((state) => ({
                ...state,
                ...newSettings,
            })),
        }),
        {
            name: 'user-settings',
        }
    )
);

```

## styles\globals.css

```css
/* src/styles/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
    @apply bg-slate-700 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-600;
}

/* Transitions */
.fade-enter {
    opacity: 0;
}

.fade-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-in-out;
}

.fade-exit {
    opacity: 1;
}

.fade-exit-active {
    opacity: 0;
    transition: opacity 200ms ease-in-out;
}
```

## types\campaign.ts

```typescript
export interface ConversionAction {
    name: string;
    value: number;
    category?: string;
}

export type TrendDirection = 'up' | 'down' | 'stable';

export interface CPCTrend {
    currentValue: number;
    previousValue: number;
    direction: TrendDirection;
    lastUpdated: string;
    hourlyChange?: number;
}

export interface Campaign {
    id: string;
    name: string;
    status: string;
    cost: number;
    previousHourSpend?: number;
    clicks: number;
    conversions: number;
    impressions: number;
    date: string;
    accountId?: string;
    targetCpa?: number;
    targetRoas?: number;
    biddingStrategyType?: string;
    maximizeConversionValue?: boolean;
    cpc: number;
    previousCpc?: number;
    cpcTrend?: CPCTrend;
    timestamp?: Date;
    conversionActions: ConversionAction[];
}

```

## types\chart.ts

```typescript
export interface ChartData {
    date: string;
    cost: number;
    clicks: number;
    conversions: number;
    impressions: number;
    conversionTypes?: {
        calls: number;
        messages: number;
    };
    campaignTypes?: {
        lsa: number;
        ppc: number;
    };
}

export type ExtendedChartData = ChartData; 
```

## types\lsa.ts

```typescript
import { ChartData } from './chart';

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
    conversions: CampaignConversions;
}

interface Conversations {
    total: number;
    calls: number;
    messages: number;
    avgCallDuration: number;
}

interface Campaigns {
    total: number;
    active: number;
    budget: number;
    details: CampaignDetail[];
}

export interface LSAMetrics {
    totalLeads: number;
    messageLeads: number;
    callLeads: number;
    totalSpend: number;
    error?: string;
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
        details: Array<{
            id: string;
            name: string;
            status: string;
            cost: number;
            conversions: {
                total: number;
                calls: number;
                messages: number;
            };
        }>;
    };
    dailyMetrics: Array<ChartData>;
} 
```

## types\next-auth.d.ts

```typescript
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        user?: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface JWT {
        accessToken?: string;
        refreshToken?: string;
    }
}
```

## utils\date.ts

```typescript
// src/utils/date.ts

import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export function getDateRange(range: string) {
    const today = new Date();
    const days = range === 'last7' ? 7 : range === 'last30' ? 30 : 90;

    return {
        start: startOfDay(subDays(today, days)),
        end: endOfDay(today)
    };
}

export function formatDate(date: Date | string) {
    return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date: Date | string) {
    return format(new Date(date), 'MMM d, yyyy HH:mm');
}
```

## utils\format.ts

```typescript
// src/utils/format.ts

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export function formatPercentage(num: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2
  }).format(num / 100);
}

export function formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}
```

## utils\index.ts

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

```

