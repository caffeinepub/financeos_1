# Growfinfire Global

## Current State
App has Goals, Dashboard, Budgeting, Loans, Trade Journal modules fully implemented.

## Requested Changes (Diff)

### Add
- Dashboard: Rebuild Risk-o-meter as semicircular gauge (like image) with needle, 6 color bands, no investment allocation bars below it. Move it next to Allocation% chart.
- Trade Journal: Heatmap navigation (prev/next month/year buttons)
- Trade Journal: Win/Loss as Donut charts with count inside the ring
- Budgeting Improve Budget: ability to copy specific month data from Track Income vs Expense

### Modify
- Goals GoalsPage: Move toggle icons (table/card) to rightmost side of submenu header row (same row as Track Goals / Plan Goals tabs)
- Goals GoalList card view: keep circular ring in parallel (same vertical alignment) with Target/Current fields — shift metric fields slightly right so they sit beside the ring, not below it. Ring should align vertically with the first metric row.
- Goals GoalsTab/GoalsPage: Remove the outer Card wrapper (white panel/skeleton) that wraps around the 4 summary cards + status tabs + GoalList. The content should lay out directly like Portfolio module (no extra rectangular outer container below the submenu header).
- Dashboard: Risk-o-meter card moved to be next to Allocation% chart (same row), remove investment allocation bar list from inside the risk-o-meter card
- Budgeting Track Income & Expenses: On mobile, Actual Income and Actual Expenses cards must be in one row (same sizing as Plan Budget cards)
- Budgeting Budget Insights: Move "Type" column to the end, just before "Variance" (last two columns)
- Loans: Remove Principal vs Interest paid bar from loan cards
- Loans: Replace Financial Model cards (Goal Planning, Debt Model, Improve Budget sub-sections) with card style matching main modules (Portfolio/Budgeting card style)
- Loans: Plan Goals cards nested under Goal Planning card; Debt Model cards under Loan Management & Repayment; Improve Budget cards under Budgeting & Expense Tracking
- Trade Journal Dashboard: P&L by Strategy limited to top 6; P&L by Instrument limited to top 6
- Trade Journal Dashboard: Total Trades value font color = black (dark mode aware: text-slate-900 dark:text-white or similar)
- Trade Journal: Reduce space above "Trade Journal" title (reduce pt-6 to pt-2 or remove)
- Trade Journal Trade Log: search/filter input fields background = white (bg-white) in light mode
- Trade Journal Analytics: card label/value font colors follow app standard (text-slate-700 dark:text-slate-200 for labels, text-slate-900 dark:text-white for values)
- Trade Journal tables: font colors follow app standard (text-slate-800 dark:text-slate-200)

### Remove
- Goals: The outer Card/CardContent wrapper in GoalsTab that wraps around everything (4 summary cards + GoalList). Keep the Analytics card as is. The inner content (summary cards + GoalList) should render without the outer white card panel.
- Dashboard Risk-o-meter: Remove the investment allocation breakdown list (bars) from inside the Risk-o-meter card

## Implementation Plan
1. GoalsPage.tsx: Add toggle icons (LayoutList/LayoutGrid) to the submenu header row, rightmost. Remove them from GoalList's own filter row if duplicated.
2. GoalsTab.tsx: Remove outer Card/CardContent wrapper — render summary cards and GoalList directly in a div. Keep Analytics card unchanged.
3. GoalList.tsx card view: Fix layout so circular ring (72px) is vertically aligned with the first metric row. Use flex-row with ring on left, metrics on right (not stacked below). Ring aligns to the start of the Target/Current row.
4. DashboardPage.tsx: Move Risk-o-meter card into the same grid row as Allocation% chart (2-column grid). Remove the allocation bars from inside RiskOMeter card content.
5. BudgetingPage.tsx (MonthlyTrackerTab): ensure Actual Income and Actual Expenses cards are in a flex row on mobile (grid-cols-2 always, not stacking to 1 col).
6. BudgetingPage.tsx Budget Insights table: Move Type column to end, just before Variance.
7. BudgetingPage.tsx Improve Budget: Add "Copy Month Data" button that copies from Track Income vs Expense for the selected month into the Improve Budget scenario.
8. LoansPage.tsx: Remove Principal vs Interest bar. Replace Financial Model accordion cards (Goal Planning, Debt Model, Improve Budget) with Portfolio/Budgeting styled cards. Nest Plan Goals cards under Goal Planning, Debt Model cards under Loan Management, Improve Budget cards under Budgeting section.
9. TradeJournalPage.tsx: Limit pnlByStrategy to top 6, pnlByTicker to top 6. Convert Win/Loss from BarChart to two PieChart donuts showing count in center. Add prev/next navigation to MonthlyHeatmap. Fix Total Trades color to black. Reduce header padding. Search filter inputs bg-white. Analytics card text colors follow app standard. Table font colors follow app standard.