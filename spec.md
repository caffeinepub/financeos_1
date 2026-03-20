# Growfinfire Global

## Current State
- Budgeting has 3 tabs: Plan Budget, Track Income & Expense, Budget Insights
- Track Income & Expense: transactions are saved to backend via `actor.createTransaction()` but pass `id: ""`, causing all transactions to overwrite each other at key "" in the backend map — data is lost on reload
- Budget Insights top panel: simple summary cards; actual income/expense values not aggregated from transaction data
- Dashboard: Asset Allocation uses a PieChart (no donut); 20-year Forecast table sits at the bottom of Dashboard
- Portfolio: Overview tab shows allocation table and charts; no summary cards on any portfolio page; no forecast chart

## Requested Changes (Diff)

### Add
- Portfolio: 4 summary cards (Total Invested, Current Value, Gain/Loss, %Gain/Loss) displayed at top of ALL portfolio pages (Overview + all 8 asset-type pages); 2-column grid on mobile, 4-column on md+
- Portfolio Overview: 20-year Forecast bar chart (grouped bar: each asset type per year) + forecast table moved from Dashboard, placed at the bottom of Portfolio Overview
- Budget Insights top panel: two donut charts — "% of Income Budget Used" (actual/budgeted income) and "% of Expenses Budget Used" (actual/budgeted expenses) — plus metric cards for Actual Income, Actual Expenses, Net Savings (Actual Income minus Actual Expenses)

### Modify
- ExpensesTab.tsx: Fix `save()` function — generate a unique ID via `crypto.randomUUID()` before calling `createTransaction()` so each transaction is stored separately
- ExpensesTab.tsx: date field added per-transaction (already exists but ensure it's captured); allow multiple transactions per category
- MonthlyTrackerTab.tsx (Budget Insights): actual income/expense values in top panel aggregate from backend transaction data (sum amounts by transactionType for selected month/year), not hardcoded or category-limit-based
- MonthlyTrackerTab.tsx: reduce card sizes on mobile to be consistent with Plan Budget and Track Income & Expense tabs; use same compact card height/padding
- DashboardPage.tsx: Asset Allocation chart — convert from PieChart to donut PieChart (innerRadius set, % labels shown on each slice or in tooltip)
- DashboardPage.tsx: Remove 20-year Forecast table entirely from Dashboard

### Remove
- Dashboard: 20-year Forecast table section removed from DashboardPage.tsx

## Implementation Plan
1. Fix `ExpensesTab.tsx` `save()`: replace `id: ""` with `id: crypto.randomUUID()` for new transactions
2. Update `MonthlyTrackerTab.tsx` top panel: fetch all transactions, filter by selected month/year, sum Income and Expense amounts, display as donut charts + metric cards inspired by the attached reference image (two donuts side-by-side, metric cards to the right)
3. Standardize card sizing across all 3 budgeting tabs for mobile (compact `p-3` cards, consistent height)
4. `DashboardPage.tsx`: change Asset Allocation PieChart to donut (add `innerRadius={50}`) with % labels rendered via `renderCustomizedLabel` or `Cell` labels; remove the entire forecast table section
5. `PortfolioPage.tsx`: extract `forecast20` computation (already exists in DashboardPage) and add it to PortfolioOverview component; add grouped BarChart of forecast at bottom of Overview; add forecast table below chart
6. `PortfolioPage.tsx`: add 4-card summary row (Total Invested, Current Value, Gain/Loss, %Gain/Loss) computed from `holdings` at top of page — visible on ALL tabs (Overview + per-asset pages); grid-cols-2 on mobile, grid-cols-4 on md+
