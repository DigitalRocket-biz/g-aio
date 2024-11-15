// src/components/Dashboard/PerformanceChart.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid
} from 'recharts';
import { formatCurrency } from '@/utils/format';

interface Campaign {
    id: string;
    name: string;
    cost: number;
    clicks: number;
    conversions: number;
    date: string;
    targetCpa?: number;
    biddingStrategy?: string;
    accountId?: string;
}

interface PerformanceChartProps {
    data: Campaign[];
}

const EditableTargetCPA = ({ value, onSave }: { value?: number; onSave: (value: number) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value?.toString() || '');

    const handleSave = () => {
        const numValue = parseFloat(tempValue);
        if (!isNaN(numValue)) {
            onSave(numValue);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-24 px-2 py-1 text-sm bg-slate-700 border border-slate-500 rounded"
                    step="0.01"
                />
                <button
                    onClick={handleSave}
                    className="text-green-400 hover:text-green-300"
                >
                    ✓
                </button>
                <button
                    onClick={() => setIsEditing(false)}
                    className="text-red-400 hover:text-red-300"
                >
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className="cursor-pointer hover:text-blue-400"
        >
            {value ? formatCurrency(value) : 'Set Target CPA'}
        </div>
    );
};

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
    // Aggregate and sort data by cost
    const aggregatedData = data.reduce((acc, campaign) => {
        const existing = acc.find(item => item.name === campaign.name);
        if (existing) {
            existing.cost += campaign.cost;
            existing.clicks += campaign.clicks;
            existing.conversions += campaign.conversions;
        } else {
            acc.push({
                name: campaign.name,
                cost: campaign.cost,
                clicks: campaign.clicks,
                conversions: campaign.conversions,
                targetCpa: campaign.targetCpa,
                biddingStrategy: campaign.biddingStrategy
            });
        }
        return acc;
    }, [] as any[])
        .sort((a, b) => b.cost - a.cost); // Sort by cost descending

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg border border-slate-600 shadow-xl">
                    <p className="text-slate-200 font-medium text-sm mb-1">{label}</p>
                    {payload.map((entry: any) => (
                        <p key={entry.name} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                            <span>{entry.name}: {entry.name === 'Cost'
                                ? formatCurrency(entry.value)
                                : entry.value.toLocaleString()}
                            </span>
                        </p>
                    ))}
                    {payload[0].payload.targetCpa !== undefined && (
                        <div className="text-sm text-orange-400 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                            <EditableTargetCPA
                                value={payload[0].payload.targetCpa}
                                onSave={async (value) => {
                                    try {
                                        await fetch('/api/campaigns/update-tcpa', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                campaignId: payload[0].payload.id,
                                                accountId: payload[0].payload.accountId,
                                                targetCpa: value
                                            })
                                        });
                                    } catch (error) {
                                        console.error('Failed to update Target CPA:', error);
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer>
                <BarChart
                    data={aggregatedData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={{
                            fill: '#94a3b8',
                            fontSize: 12
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{
                            fill: '#94a3b8',
                            fontSize: 12
                        }}
                    />
                    <Tooltip
                        cursor={{
                            fill: '#1e293b',
                            opacity: 0.4
                        }}
                        content={<CustomTooltip />}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                    />
                    <Bar dataKey="cost" name="Cost" fill="#3b82f6" />
                    <Bar dataKey="clicks" name="Clicks" fill="#10b981" />
                    <Bar dataKey="conversions" name="Conversions" fill="#f59e0b" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};