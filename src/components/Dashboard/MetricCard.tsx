// src/components/Dashboard/MetricCard.tsx

import React from 'react';
import { Card } from '@/components/ui';

interface MetricCardProps {
    title: string;
    value: string;
    icon?: React.ReactNode;
}

export const MetricCard = ({ title, value, icon }: MetricCardProps) => {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <h3 className="text-2xl font-semibold mt-1">{value}</h3>
                </div>
                {icon && <div className="text-2xl">{icon}</div>}
            </div>
        </Card>
    );
};