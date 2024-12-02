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