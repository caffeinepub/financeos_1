# Growfinfire Global

## Current State
Version 103 is live. The app has Dashboard, Goals, Portfolio, Budgeting, Financial Model, Financial Planner, Learn Finance, and Loans modules with full backend CRUD. Admin panel was added in v103 with bootstrapAdmin stable var approach.

## Requested Changes (Diff)

### Add
- Portfolio (all tabs except Overview): "Invested vs Current Value" bar chart on the same row as the existing Allocation/Holdings Distribution chart

### Modify
1. **Dashboard NAV cards**: Change from current layout to 2 assets per row on mobile (`grid-cols-2` on mobile)
2. **Portfolio Overview table**: Add rounded corners (matching Retiral module style: `rounded-2xl`)
3. **Goals top 4 summary cards**: Restyle to match Budget Insights card format (same height, color theme, sizing — compact cards with colored left-border accent)
4. **Budgeting submenu header**: Align pill/tab styling to match Portfolio module header theme (same pill nav visual style)
5. **Financial Model - Asset Allocation**: Replace the 3 clickable cards for risk profile with a single dropdown (Conservative, Moderate, Aggressive) - keep the rest of the UI intact
6. **Financial Model - Retirement**: Remove the Alert/guidance text block after Risk Profile dropdown; arrange fields in pairs on the same row (2 fields per row)
7. **Financial Model - Asset Allocation, Retirement, Model Portfolio, Crypto**: All user entry fields (inputs) should be displayed 2 per row (grid-cols-2)
8. **Admin icon**: Ensure bootstrapAdmin flow works reliably so first-login user gets admin and sees the header shield icon

### Remove
- Financial Model Retirement: Alert/guidance text block after risk profile dropdown

## Implementation Plan
1. DashboardPage.tsx: Find NAV cards grid, change to `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` or similar for 2-per-row on mobile
2. PortfolioPage.tsx: Add `rounded-2xl overflow-hidden` to Overview table wrapper
3. PortfolioPage.tsx: Add Invested vs Current Value BarChart in each individual asset tab, placed in same row as the Allocation donut chart
4. GoalsPage.tsx: Restyle the 4 summary cards to match Budgeting Budget Insights card format
5. BudgetingPage.tsx: Update submenu tab pills to match Portfolio module header pill style
6. FinancialModelingTab.tsx (AssetAllocationTab): Replace 3 clickable cards with a Select dropdown for risk profile; change input fields to grid-cols-2
7. ModelRetirementTab.tsx: Remove Alert guidance block; change input fields to grid-cols-2 (2 per row)
8. ModelPortfolioTab.tsx & ModelCryptoPortfolioTab.tsx: Change input fields to grid-cols-2 (2 per row)
9. Layout.tsx: Verify admin icon logic with bootstrapAdmin — ensure isAdmin state is set correctly
