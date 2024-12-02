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
