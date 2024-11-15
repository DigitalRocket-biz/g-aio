import { GoogleAdsApi } from 'google-ads-api';
import { Session } from 'next-auth';

interface GoogleAdsCampaign {
    id: string;
    name: string;
    status?: string;
    bidding_strategy_type?: string | number;
    target_cpa?: {
        target_cpa_micros: string | number;
    };
    target_roas?: {
        target_roas: string | number;
    };
    maximize_conversion_value?: {
        target_roas: string | number;
    };
    maximize_conversions?: {
        target_cpa_micros: string | number;
    };
    optimization_score?: number;
}

interface GoogleAdsResponse {
    campaign?: {
        id: string;
        name: string;
        status?: string;
        bidding_strategy_type?: number;
        target_cpa?: {
            target_cpa_micros: string | number;
        };
        target_roas?: {
            target_roas: string | number;
        };
        maximize_conversion_value?: {
            target_roas: string | number;
        };
        maximize_conversions?: {
            target_cpa_micros: string | number;
        };
    };
    metrics?: {
        cost_micros: string | number;
        clicks: string | number;
        conversions: string | number;
        impressions: string | number;
    };
    segments?: {
        date: string;
    };
}

interface CustomerQueryResponse {
    customer?: {
        descriptive_name: string;
        currency_code: string;
        time_zone: string;
    };
}

const googleAdsClient = new GoogleAdsApi({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    developer_token: process.env.GOOGLE_DEVELOPER_TOKEN ?? '',
});

interface GoogleAdsSession extends Session {
    refreshToken?: string;
    accessToken?: string;
}

export interface Campaign {
    id: string;
    name: string;
    status: string;
    cost: number;
    clicks: number;
    conversions: number;
    impressions: number;
    date: string;
    accountId?: string;
    targetCpa?: number;
    biddingStrategy?: string;
    biddingStrategyType?: string;
    targetRoas?: number;
    maximizeConversionValue?: boolean;
}

export async function getGoogleAdsCustomer(session: GoogleAdsSession, accountId?: string): Promise<any> {
    if (!session?.refreshToken) {
        throw new Error('Google Ads authentication required. Please check your credentials.');
    }

    return googleAdsClient.Customer({
        customer_id: accountId ?? process.env.GOOGLE_ADS_DEFAULT_ACCOUNT_ID ?? '',
        login_customer_id: process.env.GOOGLE_LOGIN_CUSTOMER_ID ?? '',
        refresh_token: session.refreshToken,
    });
}

export async function getCampaignStats(
    session: GoogleAdsSession,
    accountId: string,
    dateRange: string
): Promise<Campaign[]> {
    try {
        const customer = await getGoogleAdsCustomer(session, accountId);
        const formattedDateRange = formatDateRange(dateRange);
        const query = buildCampaignQuery(formattedDateRange);
        const response = await customer.query(query);

        return response.map((row: GoogleAdsResponse) => {
            if (!row.campaign || !row.metrics || !row.segments) {
                throw new Error('Invalid response format from Google Ads API');
            }

            return formatCampaignResponse(row, accountId);
        });
    } catch (error: unknown) {
        console.error('Google Ads API Error:', error);
        throw new Error('Failed to fetch campaign stats');
    }
}

function formatDateRange(dateRange: string): string {
    switch (dateRange.toLowerCase()) {
        case 'last30':
        case 'last_30_days':
            return 'LAST_30_DAYS';
        case 'last7':
        case 'last_7_days':
            return 'LAST_7_DAYS';
        case 'today':
            return 'TODAY';
        case 'yesterday':
            return 'YESTERDAY';
        case 'this_month':
            return 'THIS_MONTH';
        default:
            return 'LAST_30_DAYS';
    }
}

function buildCampaignQuery(dateRange: string): string {
    return `
        SELECT 
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.bidding_strategy_type,
            campaign.target_cpa.target_cpa_micros,
            campaign.target_roas.target_roas,
            campaign.maximize_conversion_value.target_roas,
            campaign.maximize_conversions.target_cpa_micros,
            metrics.cost_micros,
            metrics.clicks,
            metrics.conversions,
            metrics.impressions,
            segments.date
        FROM campaign 
        WHERE segments.date DURING ${dateRange}
    `;
}

function getBiddingStrategyType(type: number): string {
    const strategies: { [key: number]: string } = {
        6: 'TARGET_CPA',
        10: 'MAXIMIZE_CONVERSIONS',
        11: 'MAXIMIZE_CONVERSION_VALUE',
        12: 'TARGET_ROAS'
    };
    return strategies[type] || 'UNKNOWN';
}

function formatCampaignResponse(row: GoogleAdsResponse, accountId: string): Campaign {
    if (!row.campaign?.id || !row.campaign?.name || !row.metrics || !row.segments?.date) {
        throw new Error('Missing required campaign data');
    }

    const campaign = row.campaign;
    const metrics = row.metrics;
    const segments = row.segments;

    const biddingStrategyType = getBiddingStrategyType(Number(campaign.bidding_strategy_type));
    let targetCpa: number | undefined;
    let targetRoas: number | undefined;

    switch (biddingStrategyType) {
        case 'TARGET_CPA':
            targetCpa = campaign.target_cpa?.target_cpa_micros
                ? Number(campaign.target_cpa.target_cpa_micros) / 1_000_000
                : undefined;
            break;
        case 'MAXIMIZE_CONVERSIONS':
            targetCpa = campaign.maximize_conversions?.target_cpa_micros
                ? Number(campaign.maximize_conversions.target_cpa_micros) / 1_000_000
                : undefined;
            break;
        case 'TARGET_ROAS':
            targetRoas = campaign.target_roas?.target_roas
                ? Number(campaign.target_roas.target_roas)
                : undefined;
            break;
        case 'MAXIMIZE_CONVERSION_VALUE':
            targetRoas = campaign.maximize_conversion_value?.target_roas
                ? Number(campaign.maximize_conversion_value.target_roas)
                : undefined;
            break;
    }

    return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status?.toString().toLowerCase() || 'unknown',
        cost: Number(metrics.cost_micros) / 1_000_000,
        clicks: Number(metrics.clicks),
        conversions: Number(metrics.conversions),
        impressions: Number(metrics.impressions),
        date: segments.date,
        accountId,
        targetCpa,
        targetRoas,
        biddingStrategyType,
        maximizeConversionValue: biddingStrategyType === 'MAXIMIZE_CONVERSION_VALUE'
    };
}

export async function getAccountInfo(session: GoogleAdsSession, accountId: string): Promise<{
    name: string;
    currency: string;
    timezone: string;
}> {
    try {
        const customer = await getGoogleAdsCustomer(session, accountId);
        const query = `
            SELECT
                customer.descriptive_name,
                customer.currency_code,
                customer.time_zone
            FROM customer
        `;

        const [response] = await customer.query(query);
        if (!response.customer) {
            throw new Error('Invalid response format from Google Ads API');
        }

        return {
            name: response.customer.descriptive_name,
            currency: response.customer.currency_code,
            timezone: response.customer.time_zone,
        };
    } catch (error: unknown) {
        console.error('Google Ads API Error:', error);
        throw new Error('Failed to fetch account info');
    }
}