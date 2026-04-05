# Growfinfire Global — Focused UI Fixes (Version 142)

## Current State

The app is a full-stack finance application (React + Motoko). Key modules: Dashboard, Goals, Portfolio, Budgeting, Financial Model, Financial Planner, Learn Finance, Loans, Trade Journal.

Recent builds (v139–v141) introduced:
- Goals Analytics donut charts with legends on right, sized at width:140/height:200
- Portfolio Overview with 3 donut charts in a row + Invested vs Current bar chart + 20-Year line chart
- Budgeting Budget Insights (MonthlyTrackerTab) with chart ordering
- Improve Budget with autofill from tracker (currently broken — populates needs/wants/savings buckets via ratio instead of per-category)
- Financial Model: ModelRetirementTab (flat, no sub-cards), ModelGoalPlanningTab (has radio for Single/Multi + scenarios), ModelDebtTab (has Back to Menu, scenario cards)
- FinancialModelingTab: renders ModelDebtTab via scenario cards → full-page view with its own Back to Menu → causes double Back to Menu pattern

## Requested Changes (Diff)

### Add
- Financial Model → Model Retirement: Add sub-cards for FIRE Planner, 3-Bucket Planner, 2-Bucket Planner, Retirement Readiness Score — each renders the corresponding Financial Planner calculator component (FIRECalculator, ThreeBucketCalculator, TwoBucketCalculator, RetirementReadinessCalculator). Retirement Planner itself becomes a sub-card too.
- Improve Budget: Add "Monthly Reduction Target" optional field; add "I am a freelancer / have variable income" checkbox. When checked, show Freelancer-Specific Budget Rules section (same as in ModelBudgetingTab freelancer scenario). When user clicks "Analyse Budget", show "Top Money Leakage Areas" and "Your Quick Win — Do This Today" sections (same logic as ModelBudgetingTab output).

### Modify
- **Dashboard → 50/30/20 Budget Rule Analysis chart**: Replace current implementation with the exact same component used in BudgetingPage Budget Insights tab (MonthlyTrackerTab). Extract a shared `BudgetRule5030Chart` component or directly call the same logic/UI from MonthlyTrackerTab. The chart must show the same bar-based analysis with actual transaction data.
- **Goals → Analytics → Achievement Quality & Goal Diversification charts**: Reduce the donut container width from 140px to 100px; move legend + count values into a tighter layout so legend label and count are on the same line, right-aligned, without gap. Ensure full donut arc is visible (no clipping). Container height: 180px.
- **Goals → Analytics → Savings Adequacy chart**: Add LabelList on top of each bar showing value formatted as Cr/L/K or M/B/K per selected currency using `shortNum()`.
- **Goals → Plan Goals → Cost of Delay calculation**: Fix "If You Wait 2 Years" card — it must deduct `availableToday` future value from the inflated target BEFORE calculating `sipDelay2yrs`. Currently `sipDelay2` uses `primary.targetInflated` without subtracting `fvAvailable`. Fix: `adjustedTargetDelay = Math.max(0, primary.targetInflated - primary.fvAvailable)` then `sipDelay2 = sipRequired(adjustedTargetDelay, primary.returnRate, Math.max(1, primary.years - 2))`. Also verify "If You Start TODAY" correctly uses `adjustedTarget` (it does — no change needed there).
- **Portfolio Overview → Equity Allocation% & Mutual Fund Allocation% charts**: Change container from `width:140, height:200` flex layout to match the main Allocation% chart pattern — narrower legend text, label and % on same line, tighter gap between them, smaller donut (innerRadius 40, outerRadius 65) so full diameter is visible.
- **Portfolio Overview → Invested vs Current Value bar chart**: Add `LabelList` to each bar with values formatted using `shortNum(value, sym, country.code)`, positioned "right" or "insideRight" for clarity.
- **Portfolio Overview → 20-Year Portfolio Forecast chart**: Increase ResponsiveContainer height from current to 320px.
- **Budget Insights (MonthlyTrackerTab) → Chart order**: 
  - Swap positions of "Monthly Overview — Income vs Expenses" and "Month-over-Month Trend" (Month-over-Month comes first, Monthly Overview comes second)
  - Top Spending Categories: filter to show only top 5 (change `analyticsTop5` slice from current limit to 5 max)
  - Swap positions of "Budgeting (6 Months)" and "Savings Rate Trend (%)" charts (Savings Rate first, Budgeting 6 Months second)
- **Improve Budget (BudgetingPage) → Autofill from Tracker**: Completely rewrite `handleAutofill` and `ImproveBudgetContent`/`applyAutofillData` to pass per-category actual values (not aggregated needs/wants/savings). Each NEEDS_CATEGORIES key maps to matching transaction categories by name. Pass `{ income, perCategory: Record<string, number> }` and apply per-field. Remove the "Autofill applied" message card; instead update a "Clear" button that resets to sample data.
- **Financial Model → Goal Planning**: Remove all scenario cards. The `goalmodel` section in `FinancialModelingTab` should NOT be in `MODEL_IDS` set (remove "goalmodel" from MODEL_IDS). Instead, when `activeSectionId === 'goalmodel'`, directly render `<ModelGoalPlanningTab />` without scenario navigation (same as `modelretirement`, `modelinsurance` etc.).
- **Financial Model → Loan Management & Repayment (debtmodel)**: Remove the scenario cards layer. Same fix as Goal Planning — remove "debtmodel" from `MODEL_IDS`. When `activeSectionId === 'debtmodel'`, directly render `<ModelDebtTab />` without the intermediate scenario list, so there is only ONE Back to Menu (from FinancialModelingTab's `backBtn`). The ModelDebtTab's internal "Back to Menu" button should be removed or hidden.
- **Financial Model → Model Retirement**: Convert from flat rendering to a sub-card accordion pattern (similar to how MODEL_IDS sections show scenario cards). Show 5 sub-cards: 1) Retirement Planner (existing ModelRetirementTab content), 2) FIRE Planner, 3) 3-Bucket Planner, 4) 2-Bucket Planner, 5) Retirement Readiness Score. Each card expands in place (not full-page navigation) to show the respective calculator. Use collapsible/accordion UI.

### Remove
- Remove internal "Back to Menu" button inside `ModelDebtTab` (since FinancialModelingTab now provides the single Back to Menu).
- Remove the `applied` state message cards (green banners) from `ImproveBudgetContent` — replace with just a "Clear" button.
- Scan and delete all unused files after changes: orphaned .bak files, unused components, unreferenced images.

## Implementation Plan

1. **Extract shared 50/30/20 chart logic**: Create a `BudgetRule5030Chart` component (or inline function) shared between DashboardPage and MonthlyTrackerTab. Dashboard calls it with current month transaction data.
2. **Fix Goals Analytics donut layout**: Update GoalsTab.tsx — reduce donut container to 100px wide, tighten legend, ensure arcs not clipped.
3. **Fix Savings Adequacy LabelList**: Add `<LabelList>` to GoalsTab.tsx bar chart with shortNum formatting.
4. **Fix Plan Goals cost-of-delay calc**: Update `analyzeGoals` in ModelGoalPlanningTab.tsx to compute adjustedTargetDelay correctly.
5. **Fix Portfolio Equity/MF donut charts**: Reduce diameter in PortfolioPage.tsx to prevent clipping, tighten legend layout.
6. **Add LabelList to Invested vs Current bar chart**: PortfolioPage.tsx.
7. **Increase 20-Year forecast chart height**: PortfolioPage.tsx.
8. **Swap Budget Insights chart order + Top 5 spending**: MonthlyTrackerTab.tsx.
9. **Fix Improve Budget autofill**: BudgetingPage.tsx — rewrite `handleAutofill` to pass per-category data; rewrite `ImproveBudgetContent` to apply per-field matching; add freelancer checkbox + Monthly Reduction Target field; add Analyse Budget output with leakage areas and quick win; replace message card with Clear button.
10. **Simplify Financial Model Goal Planning**: Remove goalmodel from MODEL_IDS in FinancialModelingTab.tsx, render ModelGoalPlanningTab directly.
11. **Simplify Financial Model Debt/Loan section**: Remove debtmodel from MODEL_IDS in FinancialModelingTab.tsx, render ModelDebtTab directly, remove ModelDebtTab internal Back to Menu.
12. **Convert Model Retirement to sub-cards**: Update FinancialModelingTab.tsx and/or ModelRetirementTab.tsx to show 5 collapsible sub-cards including FIRE, 3-Bucket, 2-Bucket, Readiness Score.
13. **Unused file scan and cleanup**.
