
import type { FinancialRatio } from "@/components/dashboard/DataTable";

export const financialRatios: FinancialRatio[] = [
  {
    id: 1,
    category: "liquidity_ratios",
    metric: "current_ratio",
    value: 1.5,
    explanation: "Current assets (ZAR 15.2 billion) divided by current liabilities (ZAR 10.1 billion) equals 1.5. This indicates healthy short-term liquidity with ZAR 1.5 of current assets for every ZAR 1 of liabilities."
  },
  {
    id: 2,
    category: "liquidity_ratios",
    metric: "quick_ratio",
    value: 1.1,
    explanation: "Quick assets (ZAR 11.1 billion) divided by current liabilities (ZAR 10.1 billion) equals 1.1. The company can cover immediate obligations without inventory liquidation."
  },
  {
    id: 3,
    category: "liquidity_ratios",
    metric: "cash_ratio",
    value: 0.5,
    explanation: "Cash & equivalents (ZAR 5.2 billion) divided by current liabilities (ZAR 10.1 billion) equals 0.5. 50% of short-term obligations could be covered with cash alone."
  },
  {
    id: 4,
    category: "liquidity_ratios",
    metric: "operating_cash_flow_ratio",
    value: 0.8,
    explanation: "Operating cash flow (ZAR 8.1 billion) divided by current liabilities (ZAR 10.1 billion) equals 0.8. 80% of current liabilities covered by operating cash flow."
  },
  {
    id: 5,
    category: "profitability_ratios",
    metric: "gross_profit_margin",
    value: 34.2,
    explanation: "Gross profit (ZAR 20.5 billion) divided by revenue (ZAR 60.0 billion) equals 34.2%. Maintains strong pricing power but down 2% YoY."
  },
  {
    id: 6,
    category: "profitability_ratios",
    metric: "operating_profit_margin",
    value: 12.3,
    explanation: "Operating profit (ZAR 7.4 billion) divided by revenue (ZAR 60.0 billion) equals 12.3%. Reflects 1.5% margin compression from FY2023."
  },
  {
    id: 7,
    category: "profitability_ratios",
    metric: "net_profit_margin",
    value: 2.1,
    explanation: "Net profit (ZAR 1.25 billion) divided by revenue (ZAR 60.0 billion) equals 2.1%. Profitability under pressure from rising costs."
  },
  {
    id: 8,
    category: "profitability_ratios",
    metric: "return_on_assets",
    value: 3.1,
    explanation: "Net profit (ZAR 1.25 billion) divided by total assets (ZAR 40.3 billion) equals 3.1%. Below industry average of 5%."
  },
  {
    id: 9,
    category: "profitability_ratios",
    metric: "return_on_equity",
    value: 7.8,
    explanation: "Net profit (ZAR 1.25 billion) divided by shareholders' equity (ZAR 16.0 billion) equals 7.8%. Declining trend from 9.2% in FY23."
  },
  {
    id: 10,
    category: "solvency_ratios",
    metric: "debt_to_equity_ratio",
    value: 0.6,
    explanation: "Total debt (ZAR 9.6 billion) divided by shareholders' equity (ZAR 16.0 billion) equals 0.6. Moderate leverage but up from 0.55 in FY23."
  },
  {
    id: 11,
    category: "solvency_ratios",
    metric: "debt_to_assets_ratio",
    value: 0.24,
    explanation: "Total debt (ZAR 9.6 billion) divided by total assets (ZAR 40.3 billion) equals 0.24. 24% of assets financed by debt."
  },
  {
    id: 12,
    category: "solvency_ratios",
    metric: "interest_coverage_ratio",
    value: 4.2,
    explanation: "EBIT (ZAR 8.5 billion) divided by interest expense (ZAR 2.0 billion) equals 4.2. Comfortable coverage but declining trend."
  },
  {
    id: 13,
    category: "solvency_ratios",
    metric: "debt_service_coverage_ratio",
    value: 2.8,
    explanation: "Operating cash flow (ZAR 8.1 billion) divided by total debt service (ZAR 2.9 billion) equals 2.8. Strong ability to service debt obligations."
  },
  {
    id: 14,
    category: "efficiency_ratios",
    metric: "asset_turnover_ratio",
    value: 1.49,
    explanation: "Revenue (ZAR 60.0 billion) divided by average total assets (ZAR 40.3 billion) equals 1.49. Efficient asset utilization."
  },
  {
    id: 15,
    category: "efficiency_ratios",
    metric: "inventory_turnover_ratio",
    value: 5.2,
    explanation: "COGS (ZAR 39.5 billion) divided by average inventory (ZAR 7.6 billion) equals 5.2. Industry-standard turnover rate."
  },
  {
    id: 16,
    category: "efficiency_ratios",
    metric: "receivables_turnover_ratio",
    value: 7.4,
    explanation: "Revenue (ZAR 60.0 billion) divided by average receivables (ZAR 8.1 billion) equals 7.4. 51-day collection period."
  },
  {
    id: 17,
    category: "efficiency_ratios",
    metric: "payables_turnover_ratio",
    value: 4.9,
    explanation: "COGS (ZAR 39.5 billion) divided by average payables (ZAR 8.1 billion) equals 4.9. 74-day payment cycle."
  },
  {
    id: 18,
    category: "market_value_ratios",
    metric: "earnings_per_share",
    value: "ZAR 2.85",
    explanation: "Net profit (ZAR 1.25 billion) divided by 438 million shares equals ZAR 2.85 per share."
  },
  {
    id: 19,
    category: "market_value_ratios",
    metric: "price_to_earnings_ratio",
    value: 18.5,
    explanation: "Current share price (ZAR 52.7) divided by EPS (ZAR 2.85) equals 18.5x. Above sector median of 15x."
  },
  {
    id: 20,
    category: "market_value_ratios",
    metric: "price_to_book_ratio",
    value: 1.2,
    explanation: "Current share price (ZAR 52.7) divided by book value per share (ZAR 43.9) equals 1.2. Slightly overvalued."
  },
  {
    id: 21,
    category: "market_value_ratios",
    metric: "dividend_yield",
    value: 3.2,
    explanation: "Dividend per share (ZAR 1.7) divided by current share price (ZAR 52.7) equals 3.2% yield."
  }
];

// Chart data for financial ratios by category
export const categoryChartData = [
  { name: "Liquidity", value: 0.98, average: 0.85 },
  { name: "Profitability", value: 11.9, average: 12.5 },
  { name: "Solvency", value: 1.95, average: 1.8 },
  { name: "Efficiency", value: 4.75, average: 4.2 },
  { name: "Market Value", value: 6.4, average: 5.9 }
];

// Trend data for key metrics
export const profitabilityTrend = [
  { name: "Q1", gross_margin: 36.1, operating_margin: 13.8, net_margin: 2.9 },
  { name: "Q2", gross_margin: 35.4, operating_margin: 13.2, net_margin: 2.5 },
  { name: "Q3", gross_margin: 34.8, operating_margin: 12.7, net_margin: 2.3 },
  { name: "Q4", gross_margin: 34.2, operating_margin: 12.3, net_margin: 2.1 }
];

export const liquidityTrend = [
  { name: "Q1", value: 1.65 },
  { name: "Q2", value: 1.59 },
  { name: "Q3", value: 1.54 },
  { name: "Q4", value: 1.50 }
];

export const solvencyTrend = [
  { name: "Q1", debt_equity: 0.55, interest_coverage: 4.8 },
  { name: "Q2", debt_equity: 0.57, interest_coverage: 4.6 },
  { name: "Q3", debt_equity: 0.58, interest_coverage: 4.4 },
  { name: "Q4", debt_equity: 0.60, interest_coverage: 4.2 }
];
