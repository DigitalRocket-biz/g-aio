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
import { Campaign } from '@/types/campaign';
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
    campaigns: Campaign[];
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
