# Growfinfire Global

## Current State
- BudgetingPage.tsx has 3 tabs: "Budget Categories", "Income & Expenses", "Monthly Tracker"
- ExpensesTab.tsx has type filter and search but no Month/Year filter; card totals use all-time data
- MonthlyTrackerTab.tsx has a Monthly Overview chart somewhere in the page
- DashboardPage.tsx: Goals Progress shows name + progress bar only; Budgeting 6M "Planned" totals ALL category monthlyLimits (income + expense); Expense by Category pie has no value/% labels; Savings Rate chart has tight margins; Risk vs Return tooltip formatter is correct
- No admin files exist

## Requested Changes (Diff)

### Add
- ExpensesTab: Month and Year dropdowns (default = current month/year, plus "All" option). Filter transactions and recompute summary cards based on selection.

### Modify
- BudgetingPage.tsx tab labels: "Budget Categories" → "Plan Budget"; "Income & Expenses" → "Track Income & Expenses"; "Monthly Tracker" → "Budget Insights"
- ExpensesTab: summary cards (Income, Expense, Net) recalculate based on month/year filter selection
- MonthlyTrackerTab: move Monthly Overview — Income vs Expenses chart to the bottom (end) of the page; ensure it shows 6 months
- DashboardPage Goals Progress: each goal item shows Goal Date (formatted from targetDate BigInt) and estimated SIP amount (=(targetAmount - currentAmount) / monthsRemaining)
- DashboardPage Budgeting 6M: fix totalPlanned to sum only Expense categories (filter budgetCats by TransactionType.Expense before summing monthlyLimit)
- DashboardPage Expense by Category: add % labels alongside value in Tooltip and Legend (name: "Category (value | XX%)"), also add renderCustomizedLabel or use label prop on Pie for each slice showing "XX%"
- DashboardPage Savings Rate chart: increase height to 220, adjust margins to top:10, right:20, left:5, bottom:20 for better fitment
- DashboardPage Risk vs Return: already correct in tooltip, but ensure chart height is 300 and the ScatterChart has proper margin for axis labels

### Remove
- No admin code (already absent)

## Implementation Plan
1. Edit `src/frontend/src/pages/BudgetingPage.tsx`: rename 3 tab labels
2. Edit `src/frontend/src/components/budgeting/ExpensesTab.tsx`: add month/year state, filter transactions by selected month/year, recompute card totals
3. Edit `src/frontend/src/components/budgeting/MonthlyTrackerTab.tsx`: move Monthly Overview chart to end of component
4. Edit `src/frontend/src/pages/DashboardPage.tsx`:
   a. Fix budgetChart useMemo to filter only expense categories
   b. Update Goals Progress items to show deadline + SIP estimate
   c. Update Expense by Category pie to show value+% in label/tooltip
   d. Fix Savings Rate chart height/margins
   e. Fix Risk vs Return chart height
