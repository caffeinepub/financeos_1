# Growfinfire Global - Focused UI Fixes

## Current State
Comprehensive finance app with Dashboard, Portfolio, Goals, Budgeting, Financial Model, Financial Planner, Learn Finance, Loans, Trade Journal. Version 136 deployed in production.

## Requested Changes (Diff)

### Add
- Landing Page: Hidden admin icon triggered by 5 clicks on bottom-right corner; password prompt (password: `288nitK!`); reveals admin panel link

### Modify

**Dashboard - DashboardPage.tsx**
1. Risk-o-meter (RiskOMeter component ~line 288-433): Fix SVG viewBox clipping. The arc only shows at left/right corners, needle partially visible, only 2/6 color bands render. Root cause: `cy=175` with `outerR=130` means the center is too low and arcs go below the viewBox. Fix: increase H to 220, set cy=190, recalculate all polarToCartesian so the full 180° arc fits. All 6 color bands must be visible. Needle tip must be inside the arc. Add bottom padding.
2. Chart layout - rearrange these into 2-per-row grids:
   - Row: Assets vs Liabilities (currently in 3-col grid) + Debt-to-Income Ratio (currently in 3-col grid)
   - Row: Cash Flow Summary (currently in 3-col grid) + Income vs Expense Trend (currently standalone full-width)
   - Row: Investment Categories (currently standalone) + 50/30/20 Budget Rule Analysis (currently standalone)
   - Goals Progress + Budgeting (6 Months) already in 2-col grid — keep as is
   Currently the 3-col grid has Assets vs Liabilities, DTI, and Cash Flow all together. Split to: [Assets vs Liabilities + DTI] in one 2-col row, [Cash Flow + Income vs Expense] in another 2-col row.

**Portfolio - PortfolioPage.tsx**
- Overview: "Equity - Allocation%" and "Mutual Fund - Allocation%" donut charts (~line 1968-2090): Update to use the same style as the main Allocation% donut chart. The Allocation% donut uses `innerRadius={50}` `outerRadius={80}`, white text labels inside with `%`, and Cell colors from the entry. Update these two charts to match: same innerRadius/outerRadius, same label function showing `%` inside (white text, fontSize 9, fontWeight 600), same tooltip and legend style.

**Budgeting - MonthlyTrackerTab.tsx**
- Track Income vs Expense: Move Month/Year dropdowns and Search box below the two summary cards (Actual Income + Actual Expense). On desktop (md+), keep "All/Income/Expense/Add" buttons in the same top row as the cards. The current layout has dropdowns on top row. New layout: Top row = [Actual Income card] [Actual Expense card] [All/Income/Expense/Add buttons — desktop only]. Below cards = [Month dropdown] [Year dropdown] [Search bar — fills remaining space]
- Table font size: Ensure table text uses `text-sm` (same as Plan Budget table), not `text-xs`

**Budget Insights - AnalyseTab.tsx**
- Update summary card theme from colored background divs (bg-emerald-50, bg-red-50, etc.) to match Portfolio/Goals INDmoney-style cards: white background, `border-l-4` colored accent, subtle shadow, consistent height

**Improve Budget - BudgetingPage.tsx (improve tab, lines ~762-840)**
- The autofill button calls `handleAutofill` which filters `transactions` state. The `transactions` state is loaded in the parent `BudgetingPage` via `actor.getAllTransactions()`. The issue is likely that `transactions` is empty or filtering is wrong. Fix: ensure transactions are loaded before autofill runs; add a console check; if transactions are empty show a toast "No transaction data — add transactions in Track Income & Expense first". Also the autofill populates `autofillData` which shows as a banner but doesn't map into the scenario card inputs — fix so autofill data is actually applied to the editable scenario input fields.
- ModelBudgetingTab.tsx scenarios: The 4 scenario cards need to have comprehensive Needs/Wants/Savings category fields. Each scenario's input form should have industry-standard categories: Income (salary/business/freelance), Needs (rent, groceries, transport, utilities, EMIs, healthcare), Wants (dining out, entertainment, subscriptions, shopping, travel), Savings (emergency fund, SIP/investments, retirement), and a Miscellaneous field. This replaces the current minimal input fields.

**Financial Model - ModelBudgetingTab.tsx**
- The Budget & Expense Tracking tab in Financial Model uses ModelBudgetingTab. Compare with Improve Budget in BudgetingPage. Make ModelBudgetingTab visually consistent with the Improve Budget tab: same card accordion theme, same expanded view, same white card backgrounds with colored headers.

**Loans - LoansPage.tsx**
- Prepayment simulator: Fix `calcAmortization` usage in `prepaySim` (~line 354-403). Current logic: `emi + extraPayment` is passed as the total monthly payment to `calcAmortization`. This should correctly reduce tenure. However the bug may be that `remainingTenure = Number(simLoan.termMonths)` uses the original full term, not remaining months. Fix: use `simLoan.termMonths` as remaining months (current implementation), but verify `calcAmortization` terminates correctly. The real fix: when `principal <= 0` in calcAmortization, the loop should break. Check `principal = Math.min(emi - interest, bal)` — if `emi < interest` then `principal` is negative and balance never decreases. Add guard: if `emi <= interest` then principal = 0 and break. This is the root cause when extraPayment is added but base emi is already miscalculated.

**Trade Journal - TradeJournalPage.tsx Analytics section (~line 1631+)**
- Fix font colors in Analytics tab to match app standard:
  - Section headers like "Pattern Recognition" and "Day of Week Performance": change `text-slate-400` to `text-slate-700 dark:text-slate-300`
  - Table header in "Day of Week Performance": `text-slate-100` → `text-slate-700 dark:text-slate-200`
  - `TableCell` with `text-slate-100` → `text-slate-800 dark:text-slate-100`
  - `TableCell` with `text-slate-400` for trade count → `text-slate-600 dark:text-slate-400`

**Landing Page - LandingPage.tsx**
- Add hidden admin icon: Track click count on a small invisible area (bottom-right corner, 30x30px, z-50). After 5 clicks within 10 seconds, show a modal/dialog with password input. If user enters `288nitK!`, navigate to `/admin`. Reset counter after 10s or successful/failed auth.

### Remove
- Nothing removed

## Implementation Plan
1. Fix RiskOMeter SVG in DashboardPage.tsx — adjust viewBox H, cy, and recalculate coordinates
2. Rearrange Dashboard chart grid layout — split 3-col section, make Cash Flow + Income vs Expense a 2-col row, Investment Categories + 50/30/20 a 2-col row
3. Fix Portfolio Overview Equity/MF donut charts — update to match main Allocation% donut style
4. Fix MonthlyTrackerTab layout — move dropdowns below cards, fix table font size
5. Fix AnalyseTab card theme — INDmoney border-l-4 style
6. Fix Improve Budget autofill — ensure it actually populates scenario fields, add expanded category fields to scenarios
7. Fix ModelBudgetingTab visual consistency — match Improve Budget tab theme
8. Fix Loans prepayment simulator logic — guard against negative principal in calcAmortization
9. Fix Trade Journal Analytics font colors
10. Add hidden admin trigger to LandingPage
11. Validate and deploy
