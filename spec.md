# Growfinfire Global — Focused UI Fixes

## Current State

The app is a comprehensive finance management platform with Dashboard, Goals, Portfolio, Budgeting, Financial Model, Loans, and Trade Journal modules. Version 139 is live.

Key existing files:
- `src/frontend/src/pages/DashboardPage.tsx` (1749 lines) — contains RiskOMeter component, chart layout, GoalsProgressList
- `src/frontend/src/pages/PortfolioPage.tsx` (2201 lines) — Overview with 3 donut charts, 20-year forecast bar chart, per-module holdings
- `src/frontend/src/pages/BudgetingPage.tsx` (934 lines) — contains Improve Budget tab with ModelBudgetingTab + autofill
- `src/frontend/src/components/goals/GoalsTab.tsx` (598 lines) — Analytics section with Achievement Quality and Goal Diversification donut charts
- `src/frontend/src/components/financial-model/ModelGoalPlanningTab.tsx` (927 lines) — Plan Goals with "Available Today" and "Years to Goal" fields, Add to Track Goals button
- `src/frontend/src/components/financial-model/ModelBudgetingTab.tsx` (1072 lines) — Budgeting model cards (4 scenario cards)
- `src/frontend/src/components/budgeting/MonthlyTrackerTab.tsx` (1629 lines) — Budget Insights with Savings Rate Trend chart
- `src/frontend/src/pages/LoansPage.tsx` (1445 lines) — Loan Tracker module
- `src/frontend/src/pages/TradeJournalPage.tsx` (2419 lines) — Trade Journal module

## Requested Changes (Diff)

### Add
- Budget Insights: Add "Budgeting (6 Months)" bar chart (planned vs actual 6-month view, currently only on Dashboard) after the Savings Rate Trend chart

### Modify

**Dashboard:**
1. Assets vs Liabilities chart: Reduce donut container size (width/height 140px instead of 160px), keep legend labels and % value closely co-located on the right side — the label name and % value should be on the same row or close together so the donut diameter itself isn't squeezed
2. Portfolio Risk-o-meter: Rebuild the SVG arc segments so all 6 colors are definitively rendered:
   - The LEVELS array covers [0-25, 25-35, 35-45, 45-60, 60-75, 75-100] = 6 segments totaling 100 units
   - Map score 0→100 to angle 180°→0° (left to right over a semicircle)
   - Each segment's arc spans from scoreToAngle(level.min) down to scoreToAngle(level.max)
   - The SVG path sweep direction: outer arc uses sweep-flag=0 (counter-clockwise from large angle to small), inner arc uses sweep-flag=1
   - Use W=320, H=210, cx=160, cy=185, outerR=120, innerR=80 so the arc fits without clipping
   - Resize card to be reasonable (not oversized)
3. 50/30/20 Budget Rule Analysis chart: Pull data from Budget Insights logic (same calculation as AnalyseTab — current month income/expense from transactions + categories, applying catTypeMap based on budgetType field or category name inference) rather than the current inline calculation. The inline calculation in DashboardPage already looks at transactions and budgetCats but map via `catTypeMap[t.categoryId]` — the existing logic is correct but the chart currently uses the `budgetType` property which may not exist. Fix to use the same type-inference logic as BudgetingPage's `inferBudgetType()` function.
4. Goals Progress chart: Already limited to max 3 on-track + max 3 need-attention. Verify the logic works correctly — if total goals < 4, show ALL goals (not just on-track). The current code does check `if (allGoalsWithProgress.length < 4) return allGoalsWithProgress` — confirm this is correct and also ensure achieved goals are shown separately only when there are >3 total.
5. Move "Budgeting (6 Months)" chart from Dashboard: Remove the entire `{/* ── Section 4: Budget 6M ── */}` card from DashboardPage (the Goals Progress + Budgeting 6M row). Keep Goals Progress alone in its row, or pair with another chart if needed.

**Goals — GoalsTab.tsx:**
6. Achievement Quality and Goal Diversification donut charts: Resize container from `width: 140, height: 180` to `width: 160, height: 200` (slightly larger). Move legend label+% value to be more compact — the label text and percentage should be on the same line in the right-side legend panel so the legend doesn't push the donut diameter down.

**Goals — Plan Goals (ModelGoalPlanningTab.tsx):**
7. Swap column order: In the goals table header and rows, put "Years to Goal" BEFORE "Available Today (₹)" — currently order is [Goal Name, Target Today, Available Today, Years to Goal]. Change to [Goal Name, Target Today, Years to Goal, Available Today].
8. Fix Add to Track Goals goal date: Currently uses `dob + years` which is wrong (uses Date of Birth). Change to: `goalDateMs = Date.now() + g.years * 365 * 24 * 3600 * 1000` (today + years to goal). Update this for both single-goal and multi-goal scenario Add buttons.
9. Fix Add to Track Goals SIP amount: When creating the goal via `actor.createGoal(...)`, store the SIP required in the goal notes or as a separate field. The goal's `targetAmount` should be set to `g.targetInflated` (already done). The issue is Track Goals SIP display — it calculates SIP from remaining months, not from the plan. To pass the planned SIP, add it to the notes JSON: `notes: JSON.stringify({ ...existingFields, plannedSip: g.sipRequired })`.

**Portfolio — PortfolioPage.tsx:**
10. Remove all charts from non-Overview module tabs: In the section that renders per-module tab content (Retiral, Mutual Fund, Equity, Crypto, Commodity, Fixed Income, Real Estate, Other), remove Holdings Distribution chart and 10-Year Forecast chart. Keep only the summary cards and holdings table/card view. Do NOT change anything in the Overview tab charts.
11. Overview — Move all 3 donut charts into a single row: Currently the `Allocation%` donut and `Equity - Allocation%` + `Mutual Fund - Allocation%` donuts are in separate sections. Move all 3 into a single `grid-cols-1 sm:grid-cols-3 gap-4` row. Each donut should have its legend with name + % value on the right side, properly aligned.
12. Overview — Convert 20-Year Portfolio Forecast chart to a Line chart and place it next to (alongside) the `Allocation%` donut. The current layout has `Allocation% donut | Invested vs Current bar chart` in a 2-col grid. Change to: `Allocation% donut | 20-Year Forecast Line chart` in a 2-col grid. Use a stacked-total line (single line showing total portfolio value over 20 years).
13. Overview — Keep `Invested vs Current Value — All Asset Types` and `20-Year Portfolio Forecast line chart` in the 2nd row: After the 3-donut row and the allocation+forecast row, have a row with Invested vs Current and the forecast again (OR just keep Invested vs Current in its own row). Actually the requirement is: Row1=3 donuts, Row2=Allocation%+20YearLineChart, Row3=InvestedVsCurrent+20YearForecastLineChart. Place the line chart in BOTH row 2 and row 3? No — re-read: "Move all 3 donut charts in a single Row. Keep Legend and % Value on the right side. Convert 20-Year Portfolio Forecast to line chart and move it next to Allocation % chart. Keep Invested vs Current Value and 20-Year Portfolio Forecast chart in 2nd Row." So layout:
  - Row 1: [Allocation% donut] [Equity-Allocation% donut] [MF-Allocation% donut] — 3-col grid
  - Row 2: [Invested vs Current Value — All Asset Types bar chart] [20-Year Portfolio Forecast line chart] — 2-col grid

**Budgeting — BudgetingPage.tsx / MonthlyTrackerTab.tsx:**
14. Improve Budget tab — Remove all 4 ModelBudgetingTab cards, rebuild as a standalone budget improvement form:
   - Keep the Autofill bar (month/year selectors + Autofill button)
   - Replace `<ModelBudgetingTab autofillData={autofillData} />` with a new inline Improve Budget component
   - The component should have: Income section (1 consolidated income field), Needs section (with standard Needs categories from Plan Budget), Wants section (standard Wants categories), Savings section (standard Savings categories)
   - Each section shows category rows with fields: Category Name, Budgeted Amount, Actual Amount (autofilled when autofill clicked), Variance
   - Sample/default values pre-filled (e.g., Housing ₹15,000, Groceries ₹8,000, etc.)
   - When user clicks Autofill, populate Actual Amount column from actual transaction data for selected month
   - Apply 50/30/20 rule to show recommended vs actual at the bottom
   - Income should be ONE consolidated field (not multiple income rows)
   - Do NOT change Financial Model → Budget & Expense Tracking — those 4 cards remain untouched

**Financial Model — ModelGoalPlanningTab.tsx:**
15. Remove all scenario cards from Goal Planning. Keep ONLY: Single Goal radio selection showing the single-goal planning UI, and Multi Goal radio selection showing the multi-goal planning UI. No more "Buy a Car", "3 Goals ₹20,000/month", "Retirement at 55", "Cost of 2-Year Delay", "Income Increase, Reprioritize" scenario cards. The content when Single Goal is selected = single goal planning form (1 goal row). The content when Multi Goal is selected = multi-goal planning form (multiple goal rows, same as current multi scenario). Do NOT change Financial Model → Budget & Expense Tracking cards.

**Loans — LoansPage.tsx:**
16. Update ALL value/metric font colors to `#16a34a` (green-600) for number values. Labels/headings remain standard dark gray (`text-slate-700` or `text-slate-600`). This applies to: EMI amounts, balance amounts, interest rates, any numeric metric displayed in cards, table cells showing numeric values. Update all sub-tabs: Loan Tracker, Prepayment Simulator, Loan vs Invest, Affordability Check, Debt-Free Timeline, Debt Management. If some values are showing in light green or light gray, ensure they use `text-green-600` (or `style={{ color: '#16a34a' }}`) for values and `text-slate-700` for labels.

**Trade Journal — TradeJournalPage.tsx:**
17. Same font color fix: ALL numeric values/metrics use `#16a34a` green. Labels remain dark gray. This applies to: P&L values, trade count, win rate %, price values, table cell numeric values in Trade Log, Analytics values, Journal numeric values. Ensure consistency across Dashboard tab, Trade Log tab, Journal & Review tab, Analytics tab.

### Remove
- Remove "Budgeting (6 Months)" chart from Dashboard page (the card with `data-ocid="dashboard.budget.card"`)
- Remove the Goals Progress + Budgeting row restructuring — Goals Progress stays but Budgeting 6 Months moves to Budget Insights
- Remove all 4 ModelBudgetingTab cards from Improve Budget tab in BudgetingPage (replace with new component)
- Remove scenario cards (Buy a Car, 3 Goals, Retirement, Cost of Delay, Income Increase) from Financial Model Goal Planning

## Implementation Plan

1. **DashboardPage.tsx**:
   - Fix RiskOMeter SVG: change W=320, H=210, cx=160, cy=185, outerR=120, innerR=80; fix arc path direction so all 6 color segments render (outer arc sweep=0 counter-clockwise, inner arc sweep=1 clockwise)
   - Assets vs Liabilities: shrink donut container to 140×160, put label+% on same flex row in legend
   - Move Goals Progress out of its paired row (remove Budgeting 6 months card entirely)
   - Goals Progress: keep existing logic, just show Goals Progress in its own row or paired with another chart
   - 50/30/20 chart: fix catTypeMap to use inferBudgetType logic on category names (same as BudgetingPage)

2. **GoalsTab.tsx**:
   - Achievement Quality + Goal Diversification donuts: increase container to 160×200, legend shows label+% on same line

3. **ModelGoalPlanningTab.tsx**:
   - Swap "Years to Goal" before "Available Today" in table header and all rows
   - Add to Track Goals: use `Date.now() + g.years * 365 * 24 * 3600 * 1000` for goalDateMs
   - Store `plannedSip: g.sipRequired` in notes JSON
   - Remove scenario cards, keep only Single Goal / Multi Goal radio with corresponding UI
   - Set initial Single Goal state = 1 goal entry; Multi Goal = 3 goal entries (no scenario cards)

4. **PortfolioPage.tsx**:
   - Non-Overview tabs: remove any donut charts or forecast charts at bottom of each tab content
   - Overview: Restructure to 2 rows:
     - Row 1: 3 donuts (Allocation%, Equity-Allocation%, MF-Allocation%) in 3-col grid with right-side legends
     - Row 2: Invested vs Current (bar) | 20-Year Forecast (line chart, single total line) in 2-col grid

5. **BudgetingPage.tsx** (Improve Budget tab):
   - Remove ModelBudgetingTab import from improve tab
   - Add new ImprovebudgetTab inline component with: income field, Needs/Wants/Savings category sections, sample values, autofill from tracker, 50/30/20 summary

6. **MonthlyTrackerTab.tsx** (Budget Insights):
   - Add Budgeting (6 Months) bar chart at the end, after Savings Rate Trend chart, using same budgetChart logic (planned vs actual, 6 months)

7. **LoansPage.tsx**: Change all numeric value text colors to `text-green-600` or `style={{ color: '#16a34a' }}`, labels remain `text-slate-600/700`

8. **TradeJournalPage.tsx**: Same font color update for all numeric values/metrics
