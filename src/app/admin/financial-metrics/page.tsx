'use client';

import { useQuery } from '@tanstack/react-query';
import { getFinancialMetrics } from '@/lib/api/admin-financial-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, TrendingUp, CreditCard, Activity } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

export default function FinancialMetricsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['financial-metrics'],
    queryFn: getFinancialMetrics,
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='font-inter text-red-600'>Error loading financial metrics. Please try again.</p>
      </div>
    );
  }

  if (!data) return null;

  // Chart configuration
  const chartConfig = {
    total_revenue: {
      label: 'Total Revenue',
      color: 'hsl(var(--chart-1))',
    },
    bid_payment_revenue: {
      label: 'Bid Payments',
      color: 'hsl(var(--chart-2))',
    },
    credit_purchase_revenue: {
      label: 'Credit Purchases',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <div className='space-y-6 max-w-7xl'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold font-roboto text-gray-900'>Financial Metrics</h2>
        <p className='font-inter text-gray-600 mt-1'>Overview of platform revenue, transactions, and credits</p>
      </div>

      {/* Summary Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Total Revenue Card */}
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-roboto font-medium text-gray-600'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-roboto text-gray-900'>${data.revenue.total_revenue_cad.toLocaleString()}</div>
            <p className='text-xs font-inter text-gray-500 mt-1'>All-time earnings</p>
          </CardContent>
        </Card>

        {/* Bid Payment Revenue Card */}
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-roboto font-medium text-gray-600'>Bid Payments</CardTitle>
            <TrendingUp className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-roboto text-gray-900'>${data.revenue.bid_payment_revenue_cad.toLocaleString()}</div>
            <p className='text-xs font-inter text-gray-500 mt-1'>From bid submissions</p>
          </CardContent>
        </Card>

        {/* Credit Purchase Revenue Card */}
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-roboto font-medium text-gray-600'>Credit Purchases</CardTitle>
            <CreditCard className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-roboto text-gray-900'>${data.revenue.credit_purchase_revenue_cad.toLocaleString()}</div>
            <p className='text-xs font-inter text-gray-500 mt-1'>From credit packages</p>
          </CardContent>
        </Card>

        {/* Successful Transactions Card */}
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-roboto font-medium text-gray-600'>Successful Transactions</CardTitle>
            <Activity className='h-4 w-4 text-emerald-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-roboto text-gray-900'>{data.transactions.successful_transactions.toLocaleString()}</div>
            <p className='text-xs font-inter text-gray-500 mt-1'>of {data.transactions.total_transactions.toLocaleString()} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-roboto'>30-Day Revenue Breakdown (between credit and bid payments)</CardTitle>
          <p className='text-sm font-inter text-gray-600'>Daily revenue from bid payments and credit purchases</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-[400px] w-full'>
            <LineChart
              data={data.daily_revenue_breakdown}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' className='stroke-gray-200' vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
                className='text-xs font-inter'
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} className='text-xs font-inter' />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    }}
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, '']}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type='monotone' dataKey='total_revenue' stroke='var(--color-total_revenue)' strokeWidth={2} dot={false} name='Total Revenue' />
              <Line type='monotone' dataKey='bid_payment_revenue' stroke='var(--color-bid_payment_revenue)' strokeWidth={2} dot={false} name='Bid Payments' />
              <Line type='monotone' dataKey='credit_purchase_revenue' stroke='var(--color-credit_purchase_revenue)' strokeWidth={2} dot={false} name='Credit Purchases' />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Additional Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Transaction Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-roboto'>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='font-inter text-sm text-gray-600'>Total Transactions</span>
              <span className='font-inter font-semibold text-gray-900'>{data.transactions.total_transactions}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='font-inter text-sm text-gray-600'>Successful</span>
              <span className='font-inter font-semibold text-green-600'>{data.transactions.successful_transactions}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='font-inter text-sm text-gray-600'>Failed</span>
              <span className='font-inter font-semibold text-red-600'>{data.transactions.failed_transactions}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='font-inter text-sm text-gray-600'>Pending</span>
              <span className='font-inter font-semibold text-yellow-600'>{data.transactions.pending_transactions}</span>
            </div>
            <div className='pt-2 border-t border-gray-200'>
              <div className='flex justify-between items-center'>
                <span className='font-inter text-sm font-medium text-gray-700'>Success Rate</span>
                <span className='font-inter font-bold text-gray-900'>
                  {data.transactions.total_transactions > 0 ? ((data.transactions.successful_transactions / data.transactions.total_transactions) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-roboto'>Credit Statistics</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='font-inter text-sm text-gray-600'>Total Credits Purchased</span>
              <span className='font-inter font-semibold text-gray-900'>{data.credits.total_credits_purchased}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='font-inter text-sm text-gray-600'>Credits Used</span>
              <span className='font-inter font-semibold text-blue-600'>{data.credits.total_credits_used}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='font-inter text-sm text-gray-600'>Credits Refunded</span>
              <span className='font-inter font-semibold text-orange-600'>{data.credits.total_credits_refunded}</span>
            </div>
            <div className='pt-2 border-t border-gray-200'>
              <div className='flex justify-between items-center'>
                <span className='font-inter text-sm font-medium text-gray-700'>Active Credit Balance</span>
                <span className='font-inter font-bold text-purple-600'>{data.credits.active_credit_balance}</span>
              </div>
            </div>
            <div className='bg-purple-50 rounded-lg p-3 mt-2'>
              <p className='text-xs font-inter text-purple-800'>
                <span className='font-semibold'>Usage Rate: </span>
                {data.credits.total_credits_purchased > 0 ? ((data.credits.total_credits_used / data.credits.total_credits_purchased) * 100).toFixed(1) : 0}% of purchased credits
                have been used
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
