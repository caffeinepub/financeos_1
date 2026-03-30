# Growfinfire Global

## Current State
Full-stack finance app with Dashboard, Goals, Portfolio, Budgeting, Financial Model, Financial Planner, Learn Finance, Loans, Trade Journal modules. CurrencyContext with formatCurrency hook exists. GoalsPage has Track/Plan tabs with pill nav. PortfolioPage has submenu header with card/table toggle. LoansPage has separate Dashboard and Smart Tracker tabs. TradeJournalPage has Trade Log with TradingView widget embedded per trade.

## Requested Changes (Diff)

### Add
- Trade Journal: TradingView single-ticker price widget on open trade rows + auto-calculated running P&L
- Loans: Health score summary row above merged loan cards
- Goals: Values in Cr/L/K or M/B/K in Savings Adequacy chart

### Modify
- Goals Page: Move tab toggle (Track Goals/Plan Goals) to top-right of the header row (same row as "Financial Goals" title and Add Goal button)
- Goals Cards: Move linked investments row beneath status badge; show 3 + tooltip for more
- Goals Cards: Row 1 = Target/Current/Need; Row 2 = Goal Date/Timeline/SIP/Mo; adjust circular ring size so 3 cards fit on mobile
- Goals Charts: Achievement Quality + Goal Diversification — show values inside rings, thinner circular bars
- Portfolio: Consistent donut chart colors/theme across all modules including Overview
- Portfolio Cards: Invested + Current + Gain/Loss in one compact row; Gain/Loss value and % shown together (3 fields total in one row)
- Portfolio: "Add Holding" button moved to Portfolio title row (top-right); toggle placed below Add Holding in smallest size for mobile
- Currency: All 35+ Financial Planners result sections updated to use useCurrency hook (no hardcoded ₹)
- Currency: Plan Budget updated to use dynamic currency symbol
- Loans: Dashboard tab and Smart Tracker tab merged into single "Loans" tab; health metrics as compact summary row at top; each loan card shows health score + Edit/Delete buttons
- Loans: Font colors improved and consistent across all Loans module tabs

### Remove
- Loans: Separate "Health Dashboard" and "Smart Tracker" tabs (replaced by merged "Loans" tab)

## Implementation Plan
1. GoalsPage.tsx — restructure header row to put tab pills at top-right alongside title
2. GoalList.tsx / GoalsTab.tsx — reorder card elements; compact rows; ring size adjustment for mobile
3. Goals charts — add values inside rings, reduce stroke width for Achievement Quality and Goal Diversification
4. Goals Savings Adequacy chart — use formatCurrency for axis/tooltip values
5. PortfolioPage.tsx — unify donut chart colors; compact summary cards to 3-field single row; move Add Holding + toggle in header
6. FinancialPlannerPage.tsx + all planner components — replace hardcoded ₹ with useCurrency symbol and formatCurrency
7. BudgetingPage.tsx Plan Budget — replace hardcoded ₹ with currency symbol
8. LoansPage.tsx — merge Dashboard + Tracker tabs; health summary row; per-card health score + Edit/Delete
9. TradeJournalPage.tsx — add TradingView ticker widget on OPEN trade rows; compute running P&L from widget price or last known price
