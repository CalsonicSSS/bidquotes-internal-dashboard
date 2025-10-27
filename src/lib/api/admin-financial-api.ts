// =====================================
// Financial Metrics Types
// =====================================

export interface RevenueMetrics {
  total_revenue_cad: number;
  bid_payment_revenue_cad: number;
  credit_purchase_revenue_cad: number;
}

export interface TransactionMetrics {
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  pending_transactions: number;
}

export interface CreditMetrics {
  total_credits_purchased: number;
  total_credits_used: number;
  total_credits_refunded: number;
  active_credit_balance: number;
}

export interface DailyRevenueBreakdown {
  date: string; // Format: "YYYY-MM-DD"
  total_revenue: number;
  bid_payment_revenue: number;
  credit_purchase_revenue: number;
  transaction_count: number;
}

export interface FinancialMetricsResponse {
  revenue: RevenueMetrics;
  transactions: TransactionMetrics;
  credits: CreditMetrics;
  daily_revenue_breakdown: DailyRevenueBreakdown[];
}

// =====================================
// Financial Metrics API Call
// =====================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFinancialMetrics(): Promise<FinancialMetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/financial/metrics`);

  if (!response.ok) {
    throw new Error('Failed to fetch financial metrics');
  }

  return response.json();
}
