import { GoogleAdsApi } from 'google-ads-api';
import { Session } from 'next-auth';
import { prisma } from '@/lib/db';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface CPCTrend {
    currentValue: number;
    previousValue: number;
    direction: TrendDirection;
    lastUpdated: string;
}

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
        status: string;
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
    };
    metrics?: {
        cost_micros: string | number;
        clicks: string | number;
        conversions: string | number;
        impressions: string | number;
        conversions_value?: string | number;
    };
    segments?: {
        date: string;
        conversion_action?: string;
        conversion_action_name?: string;
        conversion_action_category?: string;
    };
}

interface ConversionActionResponse {
    campaign?: {
        id: string;
        name: string;
    };
    segments?: {
        conversion_action: string;
        conversion_action_name: string;
        conversion_action_category: string;
        date: string;
    };
    metrics?: {
        conversions: string | number;
        conversions_value: string | number;
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

export interface ConversionAction {
    name: string;
    value: number;
    category?: string;
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
    targetRoas?: number;
    biddingStrategyType?: string;
    maximizeConversionValue?: boolean;
    cpc: number;
    cpcTrend: CPCTrend;
    conversionActions: ConversionAction[];
    previousHourSpend?: number;
    previousCpc?: number;
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
        if (!session?.refreshToken) {
            console.error('❌ Missing refresh token');
            return [];
        }

        const customer = await getGoogleAdsCustomer(session, accountId);
        if (!customer) {
            console.error('❌ Failed to get Google Ads customer');
            return [];
        }

        const formattedDateRange = formatDateRange(dateRange);
        const [metricsQuery, conversionQuery] = buildCampaignQueries(formattedDateRange);

        console.log(`🔍 Fetching campaigns for Account ${accountId}`);
        console.log(`📅 Using date range: ${formattedDateRange}`);

        // Fetch general metrics
        const metricsResponse = await customer.query(metricsQuery);
        console.log('📊 Raw Metrics Response:', JSON.stringify(metricsResponse, null, 2));

        // Fetch conversion actions
        const conversionResponse = await customer.query(conversionQuery);
        console.log('📊 Raw Conversion Response:', JSON.stringify(conversionResponse, null, 2));

        if (!Array.isArray(metricsResponse)) {
            console.warn('⚠️ Invalid metrics response format:', metricsResponse);
            return [];
        }

        const conversionMap = new Map<string, Array<{ name: string; value: number; category?: string }>>();

        if (Array.isArray(conversionResponse)) {
            conversionResponse.forEach((row: ConversionActionResponse) => {
                if (row.campaign?.id && row.segments?.conversion_action_name) {
                    const existing = conversionMap.get(row.campaign.id) || [];
                    existing.push({
                        name: row.segments.conversion_action_name,
                        value: Number(row.metrics?.conversions) || 0,
                        category: row.segments.conversion_action_category
                    });
                    conversionMap.set(row.campaign.id, existing);
                }
            });
        }

        const campaigns = metricsResponse
            .map((row: GoogleAdsResponse) => {
                try {
                    if (!row.campaign?.id || !row.campaign?.name) {
                        console.warn('⚠️ Skipping invalid campaign data:', row);
                        return null;
                    }
                    return formatCampaignResponse(row, accountId, conversionMap.get(row.campaign.id));
                } catch (formatError) {
                    console.warn('⚠️ Error formatting campaign:', formatError, row);
                    return null;
                }
            })
            .map(async (campaign) => {
                if (campaign === null) return null;
                return campaign;
            })
            .filter((campaign): campaign is Promise<Campaign> => campaign !== null);

        const resolvedCampaigns = await Promise.all(campaigns.filter((c): c is Promise<Campaign> => c !== null));
        console.log(`✅ Successfully processed ${resolvedCampaigns.length} campaigns`);
        return resolvedCampaigns;

    } catch (error: unknown) {
        console.error('❌ Google Ads API Error:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                cause: error.cause
            });
            return [];
        }
        console.error('Unknown error type:', error);
        return [];
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

function buildCampaignQueries(dateRange: string): [string, string] {
    const metricsQuery = `
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
            metrics.impressions,
            metrics.conversions,
            metrics.conversions_value,
            segments.date
        FROM campaign 
        WHERE 
            segments.date DURING ${dateRange}
            AND campaign.status IN ('ENABLED', 'PAUSED', 'REMOVED')
        ORDER BY campaign.name ASC
    `;

    const conversionQuery = `
        SELECT
            campaign.id,
            campaign.name,
            segments.conversion_action_name,
            segments.conversion_action_category,
            metrics.conversions
        FROM campaign
        WHERE
            segments.date DURING ${dateRange}
            AND campaign.status IN ('ENABLED', 'PAUSED', 'REMOVED')
        ORDER BY campaign.name ASC
    `;

    return [metricsQuery, conversionQuery];
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

async function formatCampaignResponse(
    row: GoogleAdsResponse,
    accountId: string,
    conversionActions?: Array<{ name: string; value: number; category?: string }>
): Promise<Campaign> {
    if (!row.campaign || !row.metrics || !row.segments) {
        throw new Error('Invalid response format: missing required fields');
    }

    const { campaign, metrics, segments } = row;

    const biddingStrategyType = getBiddingStrategyType(Number(campaign.bidding_strategy_type));
    let targetCpa, targetRoas;

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

    const status = campaign.status ? String(campaign.status).toLowerCase() : 'unknown';
    const clicks = Number(metrics.clicks) || 0;
    const costMicros = Number(metrics.cost_micros) || 0;
    const cost = costMicros / 1_000_000;
    const cpc = clicks > 0 ? cost / clicks : 0;

    // Get previous hour's data
    const previousHourData = await prisma.cPCHistory.findFirst({
        where: {
            campaignId: String(campaign.id),
            timestamp: {
                gte: new Date(Date.now() - 2 * 60 * 60 * 1000),
                lt: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
        },
        orderBy: {
            timestamp: 'desc'
        }
    });

    // Get current hour's average
    const currentHourData = await prisma.cPCHistory.aggregate({
        where: {
            campaignId: String(campaign.id),
            timestamp: {
                gte: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
        },
        _avg: {
            cpc: true,
            cost: true
        }
    });

    const currentHourCPC = currentHourData._avg.cpc || cpc;
    const previousHourCPC = previousHourData?.cpc || currentHourCPC;

    const cpcTrend = {
        currentValue: currentHourCPC,
        previousValue: previousHourCPC,
        direction: previousHourData ?
            (currentHourCPC > previousHourCPC ? 'up' :
                currentHourCPC < previousHourCPC ? 'down' : 'stable') as TrendDirection :
            'stable' as TrendDirection,
        lastUpdated: new Date().toISOString()
    };

    return {
        id: String(campaign.id),
        name: String(campaign.name),
        status,
        cost,
        clicks,
        conversions: Number(metrics.conversions) || 0,
        impressions: Number(metrics.impressions) || 0,
        date: String(segments.date),
        accountId,
        targetCpa,
        targetRoas,
        biddingStrategyType,
        maximizeConversionValue: biddingStrategyType === 'MAXIMIZE_CONVERSION_VALUE',
        cpc,
        cpcTrend,
        previousHourSpend: previousHourData?.cost || cost,
        conversionActions: conversionActions || [],
        previousCpc: previousHourData?.cpc || cpc
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

export async function calculateCPCTrend(campaignId: string, currentCPC: number): Promise<CPCTrend> {
    try {
        const response = await fetch(`/api/campaigns/cpc-history?campaignId=${campaignId}&hours=1`);
        const history = await response.json();

        const previousCPC = history[0]?.cpc ?? currentCPC;
        const direction: TrendDirection =
            currentCPC > previousCPC ? 'up' :
                currentCPC < previousCPC ? 'down' :
                    'stable';

        return {
            currentValue: currentCPC,
            previousValue: previousCPC,
            direction,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        return {
            currentValue: currentCPC,
            previousValue: currentCPC,
            direction: 'stable',
            lastUpdated: new Date().toISOString()
        };
    }
}

export async function storeCPCHistory(
    campaignId: string,
    accountId: string,
    cpc: number,
    cost: number
): Promise<void> {
    if (!campaignId || !accountId) return;

    try {
        // Store data point
        await prisma.cPCHistory.create({
            data: {
                campaignId,
                accountId,
                cpc,
                cost,
                timestamp: new Date()
            }
        });

        // Clean up old data points (keep last 24 hours only)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await prisma.cPCHistory.deleteMany({
            where: {
                campaignId,
                timestamp: {
                    lt: twentyFourHoursAgo
                }
            }
        });
    } catch (error) {
        console.error('Error storing CPC history:', error);
    }
}