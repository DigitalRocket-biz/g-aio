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