# FinanceOS

## Current State
Version 125 is in production. App has Portfolio, Goals, Budgeting (Plan Budget, Track Income vs Expense, Budget Insights, Improve Budget), Financial Model, Financial Planner, Learn Finance (Rules, Basics, Learn from Mistakes, My Rules), Loans, Trade Journal modules.

## Requested Changes (Diff)

### Add
- Portfolio: 10-year forecast line charts replacing Invested vs Current Value bar charts in all investment module tabs
- Goals - Track Goals: actual investment name badges (4-5) in card title row with tooltip for more
- Budgeting - Track Income vs Expenses: Type column values (Needs/Wants/Savings) in table
- Learn Finance - Basics: interactive calculators for the 8 original topics (compounding, rule-of-72, sip-vs-lump, inflation, cagr, market-cycles, pe-ratio, diversification) — restore interactive calc UX while keeping the 10 Intelligent Investor content cards unchanged

### Modify
- Portfolio: default view = card for Overview + all investment tabs; toggle icons moved to top-right of submenu header row (desktop only); Add Holding button moved to top-right; Overview Current Value card bg = Total Invested card bg; edit/delete buttons repositioned below allocation bar in cards (no extra row); Retiral Holdings Distribution chart converted to same donut style/colors as Overview Allocation% donut; remove Invested vs Current Value bar chart across all investment module tabs, replace with 10-year forecast line chart per asset class
- Goals - Track Goals: default view = card; goal icon moved just before goal title (adjust layout with circular progress bar); completed goal cards: card size unchanged, SIP/Mo=0, show 'Goal' and 'Achieved' in two rows; Need & SIP shown in 2 rows in card; deadline 'Year Month' tag removed from card; mobile: Need and SIP condensed alongside the circular progress bar in one row
- Budgeting - Track Income vs Expenses: Actual Income, Actual Expense, and all buttons in one row; Month/Year dropdowns at start of row, search bar fills remaining space same row; remove Account field from table and Add Transaction dialog; Add Transaction dialog: Type and Category on top row, category dropdown scrollable
- Budget Insights: % of Income Budget and % of Expenses Budget cards filtered by selected Month/Year (not all-time); Spending by Categories values shown inside donut/circular bars; Budget vs Spending: remove empty space above/below section title
- Loans: UI/UX improvements to all 6 existing tabs (better visualizations, cleaner card layouts, more insightful metrics); no new features or CRUD changes
- Trade Journal: reverted to app-standard theme (white in light mode, dark in dark mode matching Portfolio/Budgeting); card sizes standardized (not oversized)

### Remove
- Portfolio: Invested vs Current Value bar charts from all investment module tabs (replaced by 10-year forecast)
- Budgeting - Track Income vs Expenses: Account field from table display and Add Transaction dialog

## Implementation Plan

1. **PortfolioPage.tsx** — Set `useState<'table'|'card'>('card')` default; move toggle buttons and Add Holding to top-right of submenu header row on desktop (hidden on mobile for toggle); fix Overview Current Value card to match Total Invested card bg color; in card view for investment tabs: move Edit/Delete buttons below allocation bar (no flex extra row, align them under the bar); convert Retiral Holdings Distribution pie to donut matching Overview style with SLICE_COLORS; remove Invested vs Current Value BarChart component for all investment tabs; add 10-year forecast LineChart using asset-class return rates (Retirement 8%, MF 12%, ETF 14%, Crypto 20%, Commodity 8%, RealEstate 10%, FixedIncome 7%, Other 10%)
2. **GoalList.tsx** — Set `useState<'table'|'card'>('card')` default; in card view: reorder so goal icon (emoji) is before goal title text (with circular ring on left); for completed goals: show 'Goal' on first line, 'Achieved' on second line in the right panel, SIP=0, card size unchanged; show Need/SIP in 2 rows in right panel; remove 'Deadline in...' text; add actual linked investment name badges (4-5) in card title row on desktop with tooltip showing all; mobile: compress Need+SIP into one row alongside circular ring
3. **MonthlyTrackerTab.tsx (Track Income vs Expenses section)** — Move Month/Year selects to start of filter row; put search bar inline after dropdowns; keep Actual Income, Actual Expense cards and all action buttons in one row; add Type column to transaction table showing Needs/Wants/Savings mapped from category names; remove Account field from table columns and dialog form; in dialog put Type + Category on top row; make Category SelectContent have `className='max-h-[200px] overflow-y-auto'`; change % of Income Budget and % of Expenses Budget donuts to use `analyticsIncome/analyticsExpenses` (filtered by selected month/year) instead of all-months aggregates; in Budget Insights Spending by Categories chart show values inside the donut; remove extra padding/margin around Budget vs Spending Card header
4. **FinancialRulesPage.tsx Basics section** — For the 8 original topics (compounding, rule-of-72, sip-vs-lump, inflation, cagr, market-cycles, pe-ratio, diversification): in their expanded full-page view, add an interactive calculator section below the text content. Calculators: compounding=A=P(1+r/n)^nt inputs; rule-of-72=years to double input; sip-vs-lump=SIP vs lumpsum comparison; inflation=future value of money; cagr=CAGR from start/end values; market-cycles=simple P/E fair value; pe-ratio=earnings to price; diversification=correlation benefit. Keep 10 Intelligent Investor cards content unchanged.
5. **LoansPage.tsx** — Improve UI on all 6 tabs: standardize card backgrounds (white in light, slate-900 in dark); improve chart visualizations (larger, cleaner); improve metric card design (more insightful labels, color-coded); ensure font colors have proper contrast; no CRUD changes
6. **TradeJournalPage.tsx** — Revert to app-standard theme: white bg in light mode, dark in dark mode; standardize card sizes (no oversized padding); match Portfolio/Budgeting card style (rounded-2xl, border-slate-200, shadow-sm)
