# Growfinfire Global — Focused UI Fixes (Version 142)

## Current State
- Dashboard shows a self-contained 50/30/20 chart that re-computes from raw transactions, diverging from Budget Insights' pre-computed chart
- Goals Analytics donut charts (Achievement Quality, Goal Diversification) have legend/count misaligned and diameter clipped
- Goals Plan Goals: 'If You Wait 2 Years' SIP ignores the `availableToday` value; 'If You Start TODAY' SIP may also be wrong
- Portfolio Overview: Equity & MF donut charts don't match Allocation% chart diameter/legend alignment; bar chart lacks value labels; 20-Year Forecast height too small
- Budget Insights: Month-over-Month Trend and Monthly Overview charts are in wrong order; Top Spending shows more than 5 categories; Budgeting (6 Months) and Savings Rate Trend are swapped
- Improve Budget: Autofill reads from raw transactions instead of Budget Insights pre-computed summaries; missing Monthly Reduction Target field, freelancer checkbox, and Top Leakage / Quick Win output after Analyse
- Financial Model > Model Retirement: shows only a single flat Retirement Planner — no sub-cards for FIRE, 3-Bucket, 2-Bucket, Retirement Readiness
- Financial Model > Goal Planning: still shows scenario cards, not the direct Single/Multi goal radio UI from Goals > Plan Goals
- Financial Model > Loan Management and Repayment (debtmodel): internally renders ModelDebtTab which has its own Back-to-Menu, but the FinancialModelingTab wrapper adds another Back button, causing double navigation

## Requested Changes (Diff)

### Add
- `ImproveBudgetContent`: add `monthlyReductionTarget` (number input, optional) and `isFreelancer` (checkbox) fields under an "Optional Goals" section
- `ImproveBudgetContent`: when freelancer checkbox checked, show Freelancer-Specific Budget Rules section (same as ModelBudgetingTab freelancer rules)
- `ImproveBudgetContent`: after "Analyse Budget" button click, show "Top Money Leakage Areas" and "Your Quick Win — Do This Today" sections (same logic as ModelBudgetingTab output cards)
- `ModelRetirementTab`: add 4 collapsible sub-cards: FIRE Planner, 3-Bucket Planner, 2-Bucket Planner, Retirement Readiness Score — each embeds the exact same component used in FinancialPlannerPage (FIRECalculator, ThreeBucketCalculator, TwoBucketCalculator, RetirementReadinessCalculator from `../../components/financial-planner/calculators/`)

### Modify
- **Dashboard 50/30/20 chart**: Replace the self-computed version with a reuse of the same `BudgetRuleChart` logic extracted from `MonthlyTrackerTab`. Import and share the chart component so both Dashboard and Budget Insights show identical data/style. Use current month's data via the pre-computed `analyticsIncome`, `analyticsExpenses`, `analyticsNeeds50`, `analyticsWants30`, `analyticsSavings`, `analyticsSavings20` pattern from MonthlyTrackerTab. Simplest approach: extract a `Budget5030Chart` pure component accepting these 6 values as props, use it in both files.
- **Goals Analytics — Achievement Quality & Goal Diversification donuts**: reduce chart container width, move label+count to tight right-side legend (no gap between label and count), use smaller `outerRadius`/`innerRadius` so the full arc is visible without clipping
- **Goals Analytics — Savings Adequacy bar chart**: add `LabelList` on top of each bar formatted in Cr/L/K or M/B/K per currency
- **Plan Goals — Cost of Delay calculation** (`ModelGoalPlanningTab.tsx`): Fix `sipDelay2` to deduct the future value of `availableToday` compounded over `years - 2` years (not zero). Also verify 'If You Start TODAY' uses `fvAvailable` correctly. Correct formula: `fvAvailableDelay = availableToday * (1 + rate/100)^(years-2)`, `adjustedDelayTarget = max(0, inflated - fvAvailableDelay)`, `sipDelay2 = sipRequired(adjustedDelayTarget, rate, years-2)`
- **Portfolio Overview — Equity Allocation% and Mutual Fund Allocation% donuts**: match `outerRadius`, `innerRadius`, container size, and legend layout exactly to the main `Allocation%` donut (currently ~outerRadius=90, innerRadius=55, right-side legend with % values)
- **Portfolio Overview — Invested vs Current Value bar chart**: add `LabelList` on each bar formatted in Cr/L/K or M/B/K
- **Portfolio Overview — 20-Year Portfolio Forecast chart**: increase container `height` from current value to at least `380`
- **Budget Insights — chart order**: swap so Month-over-Month Trend appears BEFORE Monthly Overview — Income vs Expenses
- **Budget Insights — Top Spending Categories**: cap at 5 categories (`.slice(0, 5)`)
- **Budget Insights — Budgeting (6 Months) and Savings Rate Trend**: swap their positions so Savings Rate Trend appears before Budgeting (6 Months)
- **Improve Budget — Autofill**: change `handleAutofill` in `BudgetingPage.tsx` to read from Budget Insights' pre-computed category summaries (`analyticsFiltered` transactions grouped by category type using the same `inferBudgetType` keyword logic from `MonthlyTrackerTab`) rather than raw transaction lookup. This gives the same categorization as shown in Budget Insights.
- **Financial Model — Goal Planning (goalmodel section)**: instead of showing scenario cards, render `ModelGoalPlanningTab` directly (same as Goals > Plan Goals page) — no extra navigation layer, no scenario cards
- **Financial Model — Loan Management / debtmodel full-page view**: When `activeSectionId === 'debtmodel'` and no `activeScenarioId` is set (i.e., the scenario-list view), skip the scenario card list and instead render `<ModelDebtTab />` directly with its own internal navigation — remove the outer Back button wrapper for debtmodel so there is only one Back-to-Menu (the internal one inside ModelDebtTab)
- **ModelRetirementTab**: wrap the existing Retirement Planner content in a collapsible card, then add 4 more collapsible cards for FIRE, 3-Bucket, 2-Bucket, Retirement Readiness

### Remove
- Remove the duplicated/extra Back-to-Menu button in FinancialModelingTab's debtmodel scenario wrapper
- Remove message cards in ImproveBudget autofill (replace with just Clear/Reset button)

## Implementation Plan
1. Extract `Budget5030Chart` component (pure, props-based) from DashboardPage and BudgetingPage — use in both
2. Fix Goals Analytics donut container sizing and legend alignment
3. Fix Goals Analytics Savings Adequacy — add LabelList with currency formatting
4. Fix ModelGoalPlanningTab cost-of-delay calculation to account for availableToday in delay scenario
5. Fix Portfolio Overview Equity/MF donut charts to match Allocation% chart sizing
6. Add LabelList to Portfolio Overview Invested vs Current Value bar chart
7. Increase Portfolio Overview 20-Year Forecast chart height
8. Reorder Budget Insights charts (Month-over-Month before Monthly Overview; Savings Rate before Budgeting 6 Months)
9. Cap Top Spending at 5
10. Fix Improve Budget autofill to use same category mapping as Budget Insights
11. Add Monthly Reduction Target field + freelancer checkbox + Top Leakage / Quick Win output to ImproveBudgetContent
12. Update FinancialModelingTab: goalmodel renders ModelGoalPlanningTab directly; debtmodel renders ModelDebtTab directly (no scenario card list, no double back button)
13. Rebuild ModelRetirementTab with 5 collapsible sub-cards (existing Retirement Planner + 4 from FinancialPlanner)
