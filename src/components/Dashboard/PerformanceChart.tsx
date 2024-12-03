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
    () => import('@/components/dashboard/ClientChart'),
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