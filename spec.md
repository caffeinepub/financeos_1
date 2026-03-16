# FinanceOS

## Current State
- Portfolio module has asset-type tabs (Retiral, Mutual Fund, Equity, Crypto, etc.) each showing a holdings table and pie chart
- Goals module has analytics charts: Savings Adequacy (bar: target vs current), Achievement Quality (pie), Goal Diversification (pie)
- No Overview tab exists in Portfolio

## Requested Changes (Diff)

### Add
- **Portfolio Overview tab**: New first tab labeled "Overview" in the portfolio tab bar (before Retiral). Shows:
  - Summary cards for each asset type (8 cards) with a unique icon per asset type, showing Total Invested, Current Value, and Gain/Loss for that asset type
  - A grouped bar chart at the bottom: X-axis = asset types, two bars per type = Invested vs Current Value (consolidated across all holdings)
  - Two cap distribution charts:
    1. Equity (ETF/Stocks) cap chart: groups holdings by category (Large Cap, Mid Cap, Small Cap, others) showing value and % for each cap
    2. Mutual Fund cap chart: groups holdings by category (Large Cap, Mid Cap, Small Cap, Flexi Cap, Multi Cap, Multi Asset are treated as-is) showing value and % for each cap

### Modify
- **Goals Savings Adequacy chart**: Rename bar legend label from "Current" to "Current Value" to make it explicit

### Remove
- Nothing removed

## Implementation Plan
1. Add an "overview" route concept: the tab bar in PortfolioPage gets an "Overview" button that sets a state/param to show the overview panel instead of asset-type table
2. Create `PortfolioOverviewTab` component (or inline in PortfolioPage) with:
   - 8 asset type cards with icons (use lucide icons: PiggyBank for Retiral, TrendingUp for Equity, BarChart3 for MutualFund, Bitcoin for Crypto, Gem for Commodity, Building2 for RealEstate, Landmark for FixedIncome, Package for Other)
   - BarChart using recharts for Invested vs Current Value per asset type
   - Two cap breakdown bar/pie charts for Equity and MutualFund
3. In Goals analytics, update the `name` prop on the "current" Bar from `"Current"` to `"Current Value"`
4. No backend changes, no CRUD changes
