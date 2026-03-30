# Growfinfire Global

## Current State
- Goals page has Track Goals / Plan Goals tabs with tab pills at top-left, no toggle buttons in header row
- Goals cards show linked investments in their own row near top
- Portfolio pages have Add Holding button in various locations, toggle icons in different positions
- Portfolio cards show Invested, Current, Gain/Loss in separate rows
- Donut chart styles are inconsistent across portfolio modules
- Financial Planners (35+ calculators) have hardcoded ₹ symbol in result sections
- Plan Budget shows hardcoded ₹ symbol
- Loans has separate Dashboard tab and Smart Tracker tab (duplicate feel)
- Trade Journal shows market price as manual input with no live data

## Requested Changes (Diff)

### Add
- Trade Journal: Live price fetching via Yahoo Finance API for open/in-progress trades (refresh every 30s), auto-calculate running P&L shown in green/red
- Loans: Health score summary row above all loan cards

### Modify
- Goals page: Move toggle (Track Goals/Plan Goals) pills to top-right of the header row alongside the Add Goal button; remove standalone tab pills row
- Goals cards: Move linked investments badges row to below the status badge (On Track/Achieved/Need Attention); show 3 badges + tooltip for more
- Goals cards: Row 1 = Target, Current, Need; Row 2 = Goal Date, Timeline, SIP/Mo; adjust circular ring to allow 3 cards visible on mobile
- Goals analytics: Achievement Quality and Goal Diversification charts — show values inside rings, use thinner circular bars
- Goals: Savings Adequacy chart — use formatCurrency() from useCurrency hook
- Portfolio: Consistent donut chart theme (same colors, stroke, label style) across all modules including Overview
- Portfolio cards: Compact single row — Invested | Current | Gain/Loss (value + % together) all in one row
- Portfolio: Move Add Holding button to Portfolio title row (top-right); toggle icon compact below it on mobile
- All Financial Planner calculators (35+): Replace hardcoded ₹ with useCurrency() formatCurrency in all result sections
- Plan Budget: Replace hardcoded ₹ with useCurrency() currency symbol
- Loans: Merge Dashboard and Smart Tracker into single "Loans" tab; health score shown in each individual loan card + overall summary at top; Edit/Delete on each card; font colors consistent

### Remove
- Goals: Standalone tab pills row (replaced by top-right toggle in header)
- Loans: Separate Dashboard tab and Smart Tracker tab (merged into one)
- Trade Journal: Manual Market Price input field (replaced by live API fetch)

## Implementation Plan
1. Update GoalsPage.tsx — move tab toggles to header row top-right alongside Add Goal button
2. Update GoalsTab component — reorder card rows (linked investments below status, Target/Current/Need row 1, Goal Date/Timeline/SIP row 2)
3. Update Goals analytics charts — values inside rings, thinner bars, currency-aware Savings Adequacy
4. Update PortfolioPage.tsx — Add Holding in title row, compact toggle below on mobile
5. Update Portfolio card views — compact 3-field row (Invested + Current + Gain/Loss with % together)
6. Standardize donut chart colors/style across all portfolio module components
7. Update all 35+ Financial Planner calculator components — replace hardcoded ₹ with useCurrency hook
8. Update BudgetingTab (Plan Budget) — replace hardcoded ₹ with useCurrency symbol
9. Update LoansPage.tsx — merge Dashboard + Tracker tabs, add health score to individual cards and overall summary row, add Edit/Delete to cards
10. Update TradeJournalPage.tsx — add Yahoo Finance API price fetch for open trades, auto-refresh every 30s, show live P&L in green/red
