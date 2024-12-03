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