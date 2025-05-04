
import type { FinancialRatio } from "@/components/dashboard/DataTable";

// Updated financial ratios based on the provided 2024 data
export const financialRatios: FinancialRatio[] = [
  {
    id: 1,
    category: "liquidity_ratios",
    metric: "current_ratio",
    value: 1.85,
    explanation: "Current assets (ZAR 25.6 billion) divided by current liabilities (ZAR 13.8 billion) equals 1.85, indicating strong short-term liquidity."
  },
  {
    id: 2,
    category: "liquidity_ratios",
    metric: "quick_ratio",
    value: 1.22,
    explanation: "Quick assets (ZAR 16.8 billion) divided by current liabilities (ZAR 13.8 billion) equals 1.22, showing adequate immediate liquidity without inventory."
  },
  {
    id: 3,
    category: "liquidity_ratios",
    metric: "cash_ratio",
    value: 0.45,
    explanation: "Cash & equivalents (ZAR 6.2 billion) divided by current liabilities (ZAR 13.8 billion) equals 0.45, suggesting limited cash-only liquidity."
  },
  {
    id: 4,
    category: "liquidity_ratios",
    metric: "operating_cash_flow_ratio",
    value: 0.79,
    explanation: "Operating cash flow (ZAR 10.9 billion) divided by current liabilities (ZAR 13.8 billion) equals 0.79, indicating 79% coverage of short-term obligations from operations."
  },
  {
    id: 5,
    category: "profitability_ratios",
    metric: "gross_profit_margin",
    value: 32.4,
    explanation: "Gross profit (ZAR 28.3 billion) divided by revenue (ZAR 87.4 billion) equals 32.4%, showing healthy core profitability."
  },
  {
    id: 6,
    category: "profitability_ratios",
    metric: "operating_profit_margin",
    value: 10.3,
    explanation: "Operating profit (ZAR 9.0 billion) divided by revenue (ZAR 87.4 billion) equals 10.3%, reflecting operational efficiency."
  },
  {
    id: 7,
    category: "profitability_ratios",
    metric: "net_profit_margin",
    value: 2.1,
    explanation: "Net profit (ZAR 1.8 billion) divided by revenue (ZAR 87.4 billion) equals 2.1%, indicating modest bottom-line profitability."
  },
  {
    id: 8,
    category: "profitability_ratios",
    metric: "return_on_assets",
    value: 3.1,
    explanation: "Net profit (ZAR 1.8 billion) divided by total assets (ZAR 58.7 billion) equals 3.1%, showing asset utilization efficiency."
  },
  {
    id: 9,
    category: "profitability_ratios",
    metric: "return_on_equity",
    value: 5.0,
    explanation: "Net profit (ZAR 1.8 billion) divided by shareholders' equity (ZAR 35.8 billion) equals 5.0%, indicating moderate shareholder returns."
  },
  {
    id: 10,
    category: "solvency_ratios",
    metric: "debt_to_equity_ratio",
    value: 0.63,
    explanation: "Total debt (ZAR 22.5 billion) divided by shareholders' equity (ZAR 35.8 billion) equals 0.63, showing conservative leverage."
  },
  {
    id: 11,
    category: "solvency_ratios",
    metric: "debt_to_assets_ratio",
    value: 0.38,
    explanation: "Total debt (ZAR 22.5 billion) divided by total assets (ZAR 58.7 billion) equals 0.38, indicating 38% of assets are debt-financed."
  },
  {
    id: 12,
    category: "solvency_ratios",
    metric: "interest_coverage_ratio",
    value: 4.2,
    explanation: "EBIT (ZAR 11.2 billion) divided by interest expense (ZAR 2.7 billion) equals 4.2x coverage, showing comfortable debt servicing capacity."
  },
  {
    id: 13,
    category: "solvency_ratios",
    metric: "debt_service_coverage_ratio",
    value: 2.9,
    explanation: "Operating cash flow (ZAR 10.9 billion) divided by total debt service (ZAR 3.8 billion) equals 2.9x coverage, indicating strong debt repayment ability."
  },
  {
    id: 14,
    category: "efficiency_ratios",
    metric: "asset_turnover_ratio",
    value: 1.49,
    explanation: "Revenue (ZAR 87.4 billion) divided by average total assets (ZAR 58.7 billion) equals 1.49x turnover, showing efficient asset utilization."
  },
  {
    id: 15,
    category: "efficiency_ratios",
    metric: "inventory_turnover_ratio",
    value: 12.5,
    explanation: "COGS (ZAR 59.1 billion) divided by average inventory (ZAR 4.7 billion) equals 12.5x turnover, indicating rapid inventory conversion."
  },
  {
    id: 16,
    category: "efficiency_ratios",
    metric: "receivables_turnover_ratio",
    value: 8.1,
    explanation: "Revenue (ZAR 87.4 billion) divided by average receivables (ZAR 10.8 billion) equals 8.1x turnover, showing effective credit management."
  },
  {
    id: 17,
    category: "efficiency_ratios",
    metric: "payables_turnover_ratio",
    value: 6.3,
    explanation: "COGS (ZAR 59.1 billion) divided by average payables (ZAR 9.4 billion) equals 6.3x turnover, indicating standard payment terms."
  },
  {
    id: 18,
    category: "market_value_ratios",
    metric: "earnings_per_share",
    value: "ZAR 3.25",
    explanation: "Net profit (ZAR 1.8 billion) divided by 550 million shares equals ZAR 3.25 per share."
  },
  {
    id: 19,
    category: "market_value_ratios",
    metric: "price_to_earnings_ratio",
    value: 12.3,
    explanation: "Market price (ZAR 40.00) divided by EPS (ZAR 3.25) equals 12.3x, reflecting valuation relative to earnings."
  },
  {
    id: 20,
    category: "market_value_ratios",
    metric: "price_to_book_ratio",
    value: 1.12,
    explanation: "Market price (ZAR 40.00) divided by book value per share (ZAR 35.8 billion / 550m shares = ZAR 35.73) equals 1.12x."
  },
  {
    id: 21,
    category: "market_value_ratios",
    metric: "dividend_yield",
    value: 4.5,
    explanation: "Dividend per share (ZAR 1.80) divided by market price (ZAR 40.00) equals 4.5% yield."
  }
];

// Updated chart data for financial ratios by category
export const categoryChartData = [
  { name: "Liquidity", value: 1.08, average: 0.95 },
  { name: "Profitability", value: 10.6, average: 12.5 },
  { name: "Solvency", value: 2.03, average: 1.9 },
  { name: "Efficiency", value: 7.1, average: 6.5 },
  { name: "Market Value", value: 5.3, average: 5.9 }
];

// Updated trend data for key metrics based on the year and quarter breakdown
export const profitabilityTrend = [
  { name: "2023 Q1", gross_margin: 34.0, operating_margin: 12.2, net_margin: 3.4 },
  { name: "2023 Q2", gross_margin: 33.6, operating_margin: 11.8, net_margin: 3.2 },
  { name: "2023 Q3", gross_margin: 33.0, operating_margin: 11.3, net_margin: 2.8 },
  { name: "2023 Q4", gross_margin: 32.7, operating_margin: 10.8, net_margin: 2.5 },
  { name: "2024 Q1", gross_margin: 32.5, operating_margin: 10.6, net_margin: 2.3 },
  { name: "2024 Q2", gross_margin: 32.4, operating_margin: 10.3, net_margin: 2.1 }
];

export const yearlyProfitabilityTrend = [
  { name: "2020", gross_margin: 38.2, operating_margin: 14.5, net_margin: 5.1 },
  { name: "2021", gross_margin: 36.8, operating_margin: 13.6, net_margin: 4.5 },
  { name: "2022", gross_margin: 35.2, operating_margin: 12.8, net_margin: 3.9 },
  { name: "2023", gross_margin: 33.5, operating_margin: 11.5, net_margin: 3.0 },
  { name: "2024", gross_margin: 32.4, operating_margin: 10.3, net_margin: 2.1 }
];

export const fiveYearProfitabilityTrend = [
  { name: "2020", gross_margin: 38.2, operating_margin: 14.5, net_margin: 5.1 },
  { name: "2021", gross_margin: 36.8, operating_margin: 13.6, net_margin: 4.5 },
  { name: "2022", gross_margin: 35.2, operating_margin: 12.8, net_margin: 3.9 },
  { name: "2023", gross_margin: 33.5, operating_margin: 11.5, net_margin: 3.0 },
  { name: "2024", gross_margin: 32.4, operating_margin: 10.3, net_margin: 2.1 }
];

export const liquidityTrend = [
  { name: "2023 Q1", value: 1.70 },
  { name: "2023 Q2", value: 1.75 },
  { name: "2023 Q3", value: 1.80 },
  { name: "2023 Q4", value: 1.82 },
  { name: "2024 Q1", value: 1.83 },
  { name: "2024 Q2", value: 1.85 }
];

export const yearlyLiquidityTrend = [
  { name: "2020", value: 1.55 },
  { name: "2021", value: 1.60 },
  { name: "2022", value: 1.65 },
  { name: "2023", value: 1.75 },
  { name: "2024", value: 1.85 }
];

export const fiveYearLiquidityTrend = [
  { name: "2020", value: 1.55 },
  { name: "2021", value: 1.60 },
  { name: "2022", value: 1.65 },
  { name: "2023", value: 1.75 },
  { name: "2024", value: 1.85 }
];

export const solvencyTrend = [
  { name: "2023 Q1", debt_equity: 0.58, interest_coverage: 4.6 },
  { name: "2023 Q2", debt_equity: 0.60, interest_coverage: 4.5 },
  { name: "2023 Q3", debt_equity: 0.61, interest_coverage: 4.4 },
  { name: "2023 Q4", debt_equity: 0.62, interest_coverage: 4.3 },
  { name: "2024 Q1", debt_equity: 0.63, interest_coverage: 4.2 },
  { name: "2024 Q2", debt_equity: 0.63, interest_coverage: 4.2 }
];

export const yearlySolvencyTrend = [
  { name: "2020", debt_equity: 0.51, interest_coverage: 5.2 },
  { name: "2021", debt_equity: 0.53, interest_coverage: 5.0 },
  { name: "2022", debt_equity: 0.56, interest_coverage: 4.8 },
  { name: "2023", debt_equity: 0.60, interest_coverage: 4.5 },
  { name: "2024", debt_equity: 0.63, interest_coverage: 4.2 }
];

export const fiveYearSolvencyTrend = [
  { name: "2020", debt_equity: 0.51, interest_coverage: 5.2 },
  { name: "2021", debt_equity: 0.53, interest_coverage: 5.0 },
  { name: "2022", debt_equity: 0.56, interest_coverage: 4.8 },
  { name: "2023", debt_equity: 0.60, interest_coverage: 4.5 },
  { name: "2024", debt_equity: 0.63, interest_coverage: 4.2 }
];

// Key insights from the report
export const keyInsights = [
  "Decline in net profit margin to 2.1% from 3.5% in FY2023 indicates rising costs",
  "Strong liquidity position maintained with current ratio at 1.85x",
  "Debt levels remain manageable with debt/equity ratio of 0.63",
  "Interest coverage ratio of 4.2x provides comfortable debt servicing buffer",
  "Inventory turnover improved to 12.5x from 11.2x in FY2023"
];

// Recommendations from the report
export const recommendations = [
  "Investigate cost reduction opportunities to improve declining profitability",
  "Maintain conservative debt levels but consider optimizing capital structure",
  "Monitor working capital management given receivables turnover decline",
  "Explore opportunities to enhance shareholder returns given low ROE of 5.0%"
];
