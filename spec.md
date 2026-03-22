# Growfinfire Global — Focused UI Changes

## Current State
Production-grade finance app with Dashboard, Portfolio, Budgeting, Financial Model, Financial Planner, Learn Finance modules. Version 104 is live.

## Requested Changes (Diff)

### Add
- Financial Model: Search textbox (like other modules)
- Budget vs Spending table: expand/collapse for rows beyond 5

### Modify

**Dashboard**
- NAV card (mobile only): Reduce font size of NAV value; use left empty space to show investment label fitting in mobile. No change on desktop.
- If currency is non-INR: show investment values in M or B
- Swap positions: "Projected Net Worth Trend" ↔ "Investment Categories" chart
- Budgeting (6 Months) chart: show values on top of each bar
- Move Financial Health Overview 4 charts ABOVE Advanced Analytics charts

**Portfolio**
- Submenu header background: Black (keep font colour as-is)
- Overview table: rounded corners (already done in prior versions but confirm stays consistent)
- Overview page: % Allocation donut and Invested vs Current Value bar chart — same size
- All modules: rename card "Invested" → "Total Invested"
- All modules: "Current Value" card background = same as "Invested" card background
- All tables: reduce value text font size by 1 step; ensure it fits
- All tables: rename "Gain/Loss %" → "Gain/Loss%"
- All tables: rename "Allocation %" → "Allocation%"
- Holdings Distribution donut: increase circle size to match Dashboard donuts
- Invested vs Current Value chart: horizontal bars
- Submenu header: same font colour + background theme as Goals submenu (pill style)

**Budgeting**
- Default active tab: "Track Income vs Expense"
- Budget Insights: Monthly Overview Income vs Expenses chart → horizontal bars
- Budget vs Spending table: show top 5 rows sorted by Actual Spent (highest); collapse remaining; allow expand toggle
- Reduce spacing between "Budget vs Spending" heading row and table header
- Submenu header: same font colour + background theme as Goals (pill style)

**Financial Planner**
- Remove "Financial Planner" text label that appears before the Search textbox row

**Learn Finance**
- Basics tab: cards follow the same theme as Rules tab cards
- Rules tab: remove "Filter by Level" card/options; move count number to the right-most side of each card
- Learn from Mistakes tab: move count number to the right-most side of each card

### Remove
- Financial Planner: "Financial Planner" heading text before Search box
- Rules: Filter by Level UI element

## Implementation Plan
1. DashboardPage.tsx — NAV card mobile font fix, M/B formatting, chart swap, bar labels, section reorder
2. PortfolioPage.tsx — submenu bg black, card rename, Current Value card bg, table font size, column renames, donut size, horizontal bar chart, same-size charts
3. BudgetingPage.tsx — default tab, horizontal bars in insights, Budget vs Spending collapse/expand, spacing fix, submenu theme
4. FinancialModelPage.tsx — add search input
5. FinancialPlannerPage.tsx — remove "Financial Planner" heading text
6. FinancialRulesSection.tsx — Basics card theme, Rules remove level filter + move count right, Mistakes move count right
