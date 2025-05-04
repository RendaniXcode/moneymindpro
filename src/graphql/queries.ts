// This file is kept for backward compatibility
// We're now using the REST API directly in useFinancialData.ts

import { gql } from '@apollo/client';

// These queries are no longer used but kept for backward compatibility
export const GET_API_STATUS = gql`
  query GetApiStatus {
    getApiStatus {
      status
      version
    }
  }
`;

export const GET_FINANCIAL_DATA = gql`
  query GetFinancialData($companyId: ID!, $year: String!) {
    getFinancialReport(companyId: $companyId, year: $year) {
      company
      year
      generated_at
      report {
        executive_summary
        financial_ratios {
          liquidity_ratios {
            current_ratio {
              value
              explanation
            }
            quick_ratio {
              value
              explanation
            }
            cash_ratio {
              value
              explanation
            }
            operating_cash_flow_ratio {
              value
              explanation
            }
          }
          profitability_ratios {
            gross_profit_margin {
              value
              explanation
            }
            operating_profit_margin {
              value
              explanation
            }
            net_profit_margin {
              value
              explanation
            }
            return_on_assets {
              value
              explanation
            }
            return_on_equity {
              value
              explanation
            }
          }
          solvency_ratios {
            debt_to_equity_ratio {
              value
              explanation
            }
            debt_to_assets_ratio {
              value
              explanation
            }
            interest_coverage_ratio {
              value
              explanation
            }
            debt_service_coverage_ratio {
              value
              explanation
            }
          }
          efficiency_ratios {
            asset_turnover_ratio {
              value
              explanation
            }
            inventory_turnover_ratio {
              value
              explanation
            }
            receivables_turnover_ratio {
              value
              explanation
            }
            payables_turnover_ratio {
              value
              explanation
            }
          }
          market_value_ratios {
            earnings_per_share {
              value
              explanation
            }
            price_to_earnings_ratio {
              value
              explanation
            }
            price_to_book_ratio {
              value
              explanation
            }
            dividend_yield {
              value
              explanation
            }
          }
        }
        key_insights
        recommendations
      }
    }
    getTrendData(companyId: $companyId) {
      profitability_trends {
        name
        gross_margin
        operating_margin
        net_margin
      }
      liquidity_trends {
        name
        value
      }
      solvency_trends {
        name
        debt_equity
        interest_coverage
      }
    }
  }
`;

// New mutation for uploading financial data
export const UPLOAD_FINANCIAL_DATA = gql`
  mutation UploadFinancialData($input: FinancialDataInput!) {
    uploadFinancialData(input: $input) {
      success
      message
      reportId
    }
  }
`;
