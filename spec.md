# Growfinfire Global — Focused UI Fixes v141

## Current State
Production finance app with Dashboard, Goals, Portfolio, Budgeting, Financial Model, Trade Journal modules. Version 140 is live.

## Requested Changes (Diff)

### Add
- Trade Journal: Total monthly P&L text in bottom-right of Heatmap
- Trade Journal: Mobile tooltip/click interaction for heatmap cells
- Goals analytics: Hover tooltip on donut showing goal names per status group
- Plan Goals: Button loading animation on "+ Add to Track Goals"
- Plan Goals: Refresh Track Goals table after adding goals

### Modify

**Dashboard**
- RiskOMeter: Increase arc radius (R_OUT from 120 to 140, R_IN from 80 to 95) and proportionally adjust viewBox/H/cy so labels are fully visible
- RiskOMeter: Change guidance text from "Based on Equity, Mutual Funds & Crypto allocation" to "Based on risk profile of portfolio investments"
- Assets vs Liabilities donut: Reduce outerRadius (90→70), reduce container width (140→120), move legend labels closer to % values (same row, tighter layout)
- 50/30/20 Budget Rule Analysis in Dashboard: Replace current implementation with same chart component as Budget Insights 50/30/20 Budget Rule Analysis (uses transaction data with proper Needs/Wants/Savings categorization via budget category names)

**Goals**
- Savings Adequacy bar chart: Format Y-axis tick values and tooltip values using formatCurrency/shortNum (Cr/L/K or M/B/K) instead of raw numbers
- Achievement Quality and Goal Diversification donuts: Move legend label closer to % value (same flex row), reduce outerRadius (90→75)
- Achievement Quality and Goal Diversification: Show count of goals (e.g. "3 goals") as the label text instead of % value in the legend
- Achievement Quality and Goal Diversification: On hover (Tooltip), show list of goal names that fall under that status
- Goals Analytics outer Card wrapper: Remove the outer Card/CardContent that wraps the 3 inner analytics cards — render the 3 inner cards in a grid directly without the outer panel

**Plan Goals (ModelGoalPlanningTab.tsx)**
- Swap column order in table header and cells: put "Available Today" before "Years to Goal" (column order: Goal Name, Target Today, Available Today, Years to Goal)
- When "+ Add to Track Goals" is clicked: set button to disabled+loading state with spinner animation, then re-enable after 1.5s; also invalidate/refresh Track Goals query
- Goal Date calculation on Add: use `new Date(Date.now() + g.years * 365.25 * 24 * 3600 * 1000)` for deadline and targetDate — already correct, keep this

**Portfolio Overview**
- Equity - Allocation% and Mutual Fund - Allocation% donut charts: Move % value label to be on same line/row as the legend name (flex row with dot, name, %-value justified right), reduce outerRadius (90→75), ensure full donut is visible within container
- 20-Year Portfolio Forecast line chart: Instead of single `total` line, show one Line per active asset type (Retiral, Equity, MF, FDs, Crypto, Commodity, Real Estate, Other) using their individual projected values

**Budgeting - Track Income vs Expense (MonthlyTrackerTab / ExpensesTab)**
- Transactions CRUD (add/edit/delete): use optimistic state updates — after save/delete, update local `transactions` state directly instead of calling `load()` which re-fetches all data and causes page blink
- Remove "Amount (₹)" duplicate field from Add Transaction dialog — keep only "Amount" field (the label already shows symbol from currency context; the `account` field is separate)
- Category dropdown in Add Transaction: Sort categories so these appear first (in order): Housing & Rent, Groceries & Food, Utilities & Bills, Transportation, Healthcare & Medical, Education, Insurance, Entertainment & Leisure, Clothing & Apparel, Savings & Investments, Travel & Vacation — then remaining categories alphabetically

**Budget Insights (MonthlyTrackerTab)**
- Top section: Show 4 cards matching Plan Budget card theme (white bg, border-l-4 colored left border, muted label, bold value) — Actual Income (green), Actual Expenses (red), Total Savings (blue), Savings Rate (violet)
- Upper panel chart (% of Income Budget and % of Expenses Budget): Increase font size of "Budget" and "Balance" labels from text-[10px] to text-xs
- Budget vs Spending section: Remove empty space/row above and below "Budget vs Spending" CardTitle (reduce CardHeader padding)
- Spending by Category chart: Rebuild as horizontal bar chart with legend+% value on right side (same as Asset Allocation chart), show only top 8 categories by expense
- Top Spending Categories chart: Change from showing top 3 to top 5 (currently `analyticsTop3` variable)
- Budgeting (6 Months) bar chart: Add LabelList on top of each bar showing value in Cr/L/K or M/B/K format
- Savings Rate Trend (%) chart: Add % value label for each month data point

**Improve Budget (BudgetingPage)**
- Default autofill month to last month (not current month): initialize `autofillMonth` to `(new Date().getMonth() - 1 + 12) % 12`, initialize `autofillYear` to `new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear()`
- Autofill logic: When handleAutofill runs, immediately call handleApplyAutofill after setting autofillData (auto-apply without requiring a second button click)

**Financial Model**
- Goal Planning (ModelGoalPlanningTab): No change needed — already has radio-style single/multi selection via SCENARIOS array
- Budget & Expense Tracking (ModelBudgetingTab): The 4 scenario cards should show scenario titles; fix any "Back to Menu" routing inconsistency — ensure back button returns to Financial Model main tab list, not a different screen
- Loan Management & Repayment: Remove all existing scenario cards from under this section and replace with the exact same cards/component as ModelDebtTab (Debt Management & Repayment Model)

**Trade Journal**
- Monthly Performance Heatmap: Add a total monthly P&L row/text in bottom-right corner showing sum of all dayPnL values for the displayed month
- Monthly Performance Heatmap mobile: Wrap each day cell in a Tooltip that shows the P&L value on hover/click (using Recharts Tooltip or a custom title attribute with pointer-events)
- Swap order of Equity Curve and Win/Loss Distribution charts (Win/Loss first, then Equity Curve)
- Swap order of the second chart row: put Monthly Performance Heatmap first (left), Risk/Reward Scatter second (right)
- Risk/Reward Scatter: Format XAxis tick values with 2 decimal places (`tickFormatter={(v) => v.toFixed(2)}`)

### Remove
- Goals Analytics outer Card/CardContent wrapper that groups the 3 charts into one panel

## Implementation Plan
1. DashboardPage.tsx: Fix RiskOMeter arc sizing + text; fix Assets vs Liabilities legend layout; fix 50/30/20 chart to use actual budget category data
2. GoalsTab.tsx: Fix Savings Adequacy Y-axis formatting; fix Achievement Quality + Goal Diversification donut legend layout and labels; remove outer analytics Card wrapper
3. ModelGoalPlanningTab.tsx: Swap Available Today / Years to Goal columns; add button loading state; fix goal date calculation
4. PortfolioPage.tsx: Fix Equity/MF Allocation% donut legends; fix 20-Year Forecast to show all asset type lines
5. MonthlyTrackerTab.tsx (ExpensesTab): Optimistic CRUD, remove duplicate Amount field, reorder category dropdown, fix Budget Insights top cards, font sizes, spending chart, top 5 categories, 6-month bar labels, savings rate labels
6. BudgetingPage.tsx: Fix autofill to default last month and auto-apply
7. FinancialModelingTab.tsx: Fix Loan Management cards to use ModelDebtTab
8. TradeJournalPage.tsx: Add heatmap total P&L, swap chart order, fix scatter X axis
