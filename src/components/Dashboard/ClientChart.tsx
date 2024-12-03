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