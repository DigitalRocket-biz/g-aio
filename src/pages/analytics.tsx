import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Activity } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Analytics = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const data = [
    { month: 'Mar 2024', cost: 27724.35, leads: 1788, cpl: 15.51 },
    { month: 'Apr 2024', cost: 34224.27, leads: 2506, cpl: 13.66 },
    { month: 'May 2024', cost: 45329.15, leads: 2205, cpl: 20.56 },
    { month: 'Jun 2024', cost: 48713.74, leads: 2869, cpl: 16.98 },
    { month: 'Jul 2024', cost: 53972.73, leads: 2607, cpl: 20.70 },
    { month: 'Aug 2024', cost: 59693.50, leads: 3160, cpl: 18.89 },
    { month: 'Sep 2024', cost: 61110.13, leads: 2868, cpl: 21.31 },
    { month: 'Oct 2024', cost: 75568.96, leads: 3160, cpl: 23.91 },
    { month: 'Nov 2024', cost: 78484.37, leads: 2869, cpl: 27.36 }
  ];

  // Calculate key metrics
  const metrics = {
    totalSpend: data.reduce((acc, curr) => acc + curr.cost, 0),
    totalLeads: data.reduce((acc, curr) => acc + curr.leads, 0),
    avgCPL: data.reduce((acc, curr) => acc + curr.cpl, 0) / data.length,
    monthlyAvgSpend: data.reduce((acc, curr) => acc + curr.cost, 0) / data.length,
    highestCPL: data.reduce((max, curr) => curr.cpl > max.cpl ? curr : max, data[0]),
    lowestCPL: data.reduce((min, curr) => curr.cpl < min.cpl ? curr : min, data[0]),
    bestLeadMonth: data.reduce((max, curr) => curr.leads > max.leads ? curr : max, data[0]),
    worstLeadMonth: data.reduce((min, curr) => curr.leads < min.leads ? curr : min, data[0]),
    spendGrowth: ((data[data.length - 1].cost - data[0].cost) / data[0].cost * 100).toFixed(1),
    leadGrowth: ((data[data.length - 1].leads - data[0].leads) / data[0].leads * 100).toFixed(1),
    cplGrowth: ((data[data.length - 1].cpl - data[0].cpl) / data[0].cpl * 100).toFixed(1)
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg shadow-xl">
          <p className="text-gray-300 font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center space-x-4">
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name.toLowerCase().includes('cost') || entry.name.toLowerCase().includes('spend')
                  ? `$${entry.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-gray-100">Loading...</div>
    </div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Campaign Performance Analytics
            </h1>
            <p className="text-gray-400 mt-2">Comprehensive analysis with full context</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span className="text-gray-300">March 2024 - November 2024</span>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Campaign Spend</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ${metrics.totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-3 bg-blue-400/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-400">↑ {metrics.spendGrowth}%</span>
                <span className="text-gray-500 ml-2">since March</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Monthly avg: ${metrics.monthlyAvgSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Leads</p>
                  <p className="text-2xl font-bold text-purple-400">{metrics.totalLeads.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-400/10 rounded-lg">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className="text-green-400">↑ {metrics.leadGrowth}%</span>
                <span className="text-gray-500 ml-2">since March</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Best: {metrics.bestLeadMonth.month} ({metrics.bestLeadMonth.leads.toLocaleString()})
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Cost Per Lead</p>
                  <p className="text-2xl font-bold text-green-400">${metrics.avgCPL.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-400/10 rounded-lg">
                  <Activity className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Range: ${metrics.lowestCPL.cpl.toFixed(2)} to ${metrics.highestCPL.cpl.toFixed(2)}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Best: {metrics.lowestCPL.month} @ ${metrics.lowestCPL.cpl.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-amber-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Leads per $1000</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {(metrics.totalLeads / (metrics.totalSpend / 1000)).toFixed(1)}
                  </p>
                </div>
                <div className="p-3 bg-amber-400/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-amber-400" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Total spend: ${metrics.totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Total leads: {metrics.totalLeads.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Spend vs. Cost per Lead Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data}>
                    <defs>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <YAxis yAxisId="left" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      name="Total Spend"
                      fill="url(#costGradient)"
                      stroke="#818cf8"
                      yAxisId="left"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone"
                      dataKey="cpl" 
                      name="Cost per Lead" 
                      stroke="#34d399"
                      yAxisId="right"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Monthly Lead Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <defs>
                      <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="leads" 
                      name="Leads Generated"
                      fill="url(#leadsGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Context Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Cost Analysis Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Highest CPL Period</span>
                    <span className="font-medium text-red-400">
                      {metrics.highestCPL.month} (${metrics.highestCPL.cpl.toFixed(2)})
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    During highest CPL month:
                    • Leads: {metrics.highestCPL.leads.toLocaleString()}
                    • Spend: ${metrics.highestCPL.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Lowest CPL Period</span>
                    <span className="font-medium text-green-400">
                      {metrics.lowestCPL.month} (${metrics.lowestCPL.cpl.toFixed(2)})
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    During lowest CPL month:
                    • Leads: {metrics.lowestCPL.leads.toLocaleString()}
                    • Spend: ${metrics.lowestCPL.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Cost Efficiency Trend</span>
                    <span className={`font-medium ${metrics.cplGrowth > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {metrics.cplGrowth}% change
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Campaign start: ${data[0].cpl.toFixed(2)} CPL
                    Campaign end: ${data[data.length - 1].cpl.toFixed(2)} CPL
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Lead Generation Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Best Performing Month</span>
                    <span className="font-medium text-purple-400">
                      {metrics.bestLeadMonth.month}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Leads: {metrics.bestLeadMonth.leads.toLocaleString()}
                    • CPL: ${metrics.bestLeadMonth.cpl.toFixed(2)}
                    • Spend: ${metrics.bestLeadMonth.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Month-over-Month Growth</span>
                    <span className="font-medium text-blue-400">
                      {metrics.leadGrowth}% overall
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Starting volume: {data[0].leads.toLocaleString()} leads
                    Current volume: {data[data.length - 1].leads.toLocaleString()} leads
                  </div>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Campaign Efficiency</span>
                    <span className="font-medium text-amber-400">
                      {(metrics.totalLeads / (metrics.totalSpend / 1000)).toFixed(1)} leads/$1k
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Average monthly leads: {(metrics.totalLeads / data.length).toFixed(0)}
                    • Average monthly spend: ${(metrics.totalSpend / data.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 