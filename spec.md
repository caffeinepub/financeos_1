# Growfinfire Global — Focused UI Fixes (Charts, Budgeting, Financial Model)

## Current State
Full-stack fintech app (Motoko backend + React/Tailwind frontend) with modules: Dashboard, Goals, Portfolio, Budgeting, Financial Model, Financial Planner, Learn Finance, Loans, Trade Journal. Charts use Recharts. Currency context is global.

## Requested Changes (Diff)

### Add
- Projected Net Worth Trend: tooltip that shows breakup of all investment categories (Equity, MF, Gold, Retiral, Real Estate, Bonds, FDs, Crypto, Other) on hover
- Improve Budget: "50/30/20 Analysis Summary" table below Analyse Budget button
- Improve Budget: "Top Money Leakage Areas" as individual cards for each leakage recommendation
- Improve Budget: Monthly result cards (Monthly Income, Needs 50% ideal, Wants 30% ideal, Savings Rate with ideal values) when Analyse Budget is clicked
- Plan Goals: tooltip next to "Monthly Savings Available" with text "Total you can invest each month across all goals"

### Modify

#### Global — All Charts
- Card container height must shrink to hug chart content — remove any fixed min-height on chart cards that creates dead space above/below
- Legend and value labels positioned at right-most side with tight spacing (no large gap between legend item and its value)
- Chart diameter must never be clipped on left or right — ensure adequate horizontal padding/viewBox

#### Dashboard
- Assets vs Liabilities donut chart: reduce gap between legend label and count; move both to right-most side; ensure full donut diameter is visible without clipping
- Projected Net Worth Trend: include ALL investment categories (Equity, MF, Gold, Retiral, Real Estate, Bonds, FDs, Crypto, Other) accumulated as Net Worth; add hover tooltip showing per-category breakdown

#### Goals — Goals Analytics
- Achievement Quality chart: compact legend+count on right, no extra gap, full diameter visible, no left arch clipping
- Goal Diversification chart: same as above

#### Goals — Plan Goals
- Remove hardcoded ₹ symbol from "Monthly Savings Available", "Target Today", "Available Today" fields — use dynamic currency symbol from CurrencyContext
- Add tooltip (info icon) next to "Monthly Savings Available" label with text "Total you can invest each month across all goals"
- All outcome values (SIP, corpus, etc.) must use selected currency symbol from context, not hardcoded ₹

#### Portfolio — Overview
- "Add Holdings" dialog: default Quantity field value to 1
- "Edit Holding" dialog: auto-focus the Quantity field when dialog opens
- "Invested vs Current Value — All Asset Types" bar chart: show "K" suffix for values in thousands (e.g. 250K instead of 250,000) — already have Cr/L formatter but extend it to show K for thousands
- All other charts and tables in Portfolio: apply same K suffix logic for values in thousands

#### Budgeting — Track Income & Expense
- Eliminate full page refresh / visible screen blink on add, update, delete of transactions
- Use optimistic UI: update local React state immediately after successful backend call
- Do NOT re-fetch all data from canister after each mutation — update only the affected item in state
- Ensure table re-renders only affected rows (use stable keys based on record ID)
- No changes to backend CRUD logic or UI design

#### Budgeting — Budget Insights
- Swap "Monthly Overview — Income vs Expenses" and "50/30/20 Budget Rule Analysis" charts (50/30/20 first, Monthly Overview second)
- Keep "Budgeting (6 Months)" and "Savings Rate Trend (%)" charts in the same row (side by side)

#### Budgeting — Improve Budget
- Rename dropdown/tag label from "Autofill from Tracker" to "Select Month/Year"
- Rename the button from "Autofill from Tracker" to "Load Income and Expense"
- Add a "Clear" link next to the button to reset fields back to sample data
- When button clicked: load actual income/expenses for selected month/year from Track Income & Expense data (category-wise totals), mapping to Income, Needs, Wants, Savings sections
- Keep 3 fields per row across the whole page
- Reduce vertical space between card header and first field
- When "Analyse Budget" clicked: show summary cards (Monthly Income, Needs with 50% ideal, Wants with 30% ideal, Savings Rate with ideal) above results
- Show "50/30/20 Analysis Summary" table below the Analyse Budget button
- Show "Top Money Leakage Areas" as individual recommendation cards

#### Financial Model
- Mobile: when user clicks any sub-card, show content full-page, hiding all other menu cards (same behavior as Financial Planner mobile)
- Allow "Back to menu" button to return to the menu card list on mobile
- Retirement Planner sub-card: start in collapsed/closed state; do not auto-expand on load
- Loan Management & Repayment: remove just the "Debt Management & Repayment Model" text header/label, keep all 4 cards as-is
- Budgeting & Expense Tracking Model: make it the main/parent card containing all sub-cards — remove duplicate standalone cards and duplicate "Back to Menu" navigation

### Remove
- Duplicate "Back to Menu" links in Financial Model → Budgeting & Expense Tracking
- Standalone duplicate cards that are already nested under Budgeting & Expense Tracking Model
- Hardcoded ₹ symbols in Plan Goals output fields

## Implementation Plan

1. **Global chart card fix** — remove fixed min-height from chart card wrappers; set `h-auto` so cards hug content; check for padding causing dead space
2. **Assets vs Liabilities** — tighten legend layout: use `gap-1` between label and value, right-align legend container; ensure SVG viewBox has left/right padding so donut is not clipped
3. **Projected Net Worth Trend** — aggregate all portfolio categories into the trend line; add custom Recharts tooltip that shows each category's projected value on hover
4. **Goals Analytics donuts** — same legend tightening as Assets vs Liabilities; check SVG left clipping
5. **Plan Goals** — replace hardcoded `₹` with `{currency.symbol}` from `useCurrency()`; add `<Tooltip>` info icon next to Monthly Savings Available label
6. **Portfolio dialogs** — set defaultValue/value=1 for Quantity in Add dialog; add `autoFocus` to Quantity input in Edit dialog
7. **Portfolio K-suffix** — extend formatCurrency/formatValue utility to return "K" suffix when value is in thousands (< 1L for INR, < 1M for USD/GBP); apply to all bar chart labels and table cells
8. **Track Income & Expense optimistic UI** — replace refetch-after-mutation with local state updates: on add → append to transactions array; on edit → replace item; on delete → filter out item; remove `queryClient.invalidateQueries` calls that cause full re-renders
9. **Budget Insights chart swap** — reorder chart rendering so 50/30/20 appears before Monthly Overview; wrap Budgeting 6M and Savings Rate Trend in a `grid-cols-2` row
10. **Improve Budget** — rename labels/button; add Clear link; fix autofill to map category totals from transactions; add 3-column field layout; reduce card header padding; add result cards + 50/30/20 summary table + leakage area cards after Analyse
11. **Financial Model mobile full-page** — add state tracking `activeSubCard`; on mobile, when sub-card clicked, render full-page view hiding menu; show Back to Menu button
12. **Financial Model Retirement Planner** — set initial collapsed state to `false` (don't auto-expand)
13. **Financial Model Loan Management** — remove "Debt Management & Repayment Model" text label from the card header/body while keeping all 4 sub-cards
14. **Financial Model Budgeting** — restructure so Budgeting & Expense Tracking is a single parent card with all sub-cards nested inside, eliminating duplicate standalone cards and Back to Menu repetition
