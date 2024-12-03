// src/components/dashboard/MetricCard.tsx

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