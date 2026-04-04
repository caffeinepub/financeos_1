# Growfinfire Global — Focused UI Changes

## Current State

The app has DashboardPage, GoalsPage, PortfolioPage, BudgetingPage, LoansPage, TradeJournalPage, and associated component files. Key issues:
- Donut charts across all modules show % labels inside arcs and have inconsistent sizing
- Dashboard RiskOMeter uses equal 30° arc segments but only shows 2 visible color bands (SVG rendering bug)
- Goals Plan Goals tab shows a scenario menu without radio buttons; has hardcoded ages and missing "Available Today" field
- Portfolio module tabs still show charts at the bottom (Retiral, MF, Equity, etc.)
- Budgeting Improve Budget autofill has logic bugs where `setAutofillData` updates state but `ModelBudgetingTab` doesn't wire it properly to its input fields
- Loans and Trade Journal have light/muted text that is hard to read on white backgrounds

## Requested Changes (Diff)

### Add
- Goals Plan Goals: Two radio buttons (Single Goal / Multi Goal) that control which scenario content is shown
- Goals Plan Goals: "Available Today" field next to "Target Today" in the goals table; factors remaining amount for future value
- Goals Plan Goals: "Add to Track Goals" button after analysis that saves goal(s) to backend with pre-filled fields
- DonutChartWithLegend: A reusable wrapper component that renders a donut chart with legend on the right side showing name + % value

### Modify
- **All donut/pie charts across app** (DashboardPage, PortfolioPage, GoalsTab, FinancialModelPage): Remove % labels inside arcs. Add right-side legend showing `name — X%`. Match Asset Allocation chart diameter (innerRadius=55, outerRadius=90). Skip BudgetingPage → Budget Insights top charts.
- **Dashboard RiskOMeter**: Rebuild arc as 6 individual SVG `<path>` elements (one per color band) calculated from angles using `polarToCartesian`. The 6 bands cover 0°–30°, 30°–60°, 60°–90°, 90°–120°, 120°–150°, 150°–180° of the semicircle. Needle must render fully inside the viewBox.
- **Dashboard 50/30/20 chart**: Already uses current month transactions — verify it uses same logic as Budget Insights tab (budgetCats.budgetType field for category type mapping).
- **Dashboard Goals Progress**: Filter to max 3 "on track" + max 3 "need attention" goals sorted by nearest goal date. If user has <4 goals total, show all.
- **Goals Analytics charts (Achievement Quality, Goal Diversification)**: Increase donut size to match standard (innerRadius=55, outerRadius=90). Show legend on right with % values. Remove inner labels.
- **Goals Plan Goals**: Remove "Retirement Age" field. Auto-fill Current Age from `localStorage.getItem('gff_dob')` (DOB stored as date string). Add "Available Today" column after "Target Today" in the goals table (default 0). When user enters Available Today > 0, compute remaining = targetInflated - availableToday*(1+rate/100)^years, then compute SIP on remaining only. Show SIP Required in results.
- **Goals Plan Goals radio buttons**: Single Goal radio → load scenario id="single". Multi Goal radio → load scenario id="raise". Both show the full detail view immediately. Remove the scenario menu cards (keep Back button).
- **Goals Plan Goals Add to Track Goals**: After result renders, show "Add to Track Goals" button. On click, call `actor.addGoal()` for each goal with: name=goalName, targetAmount=targetInflated, targetDate = DOB + yearsToGoal as timestamp.
- **Portfolio Overview**: Move 3 donut charts (Allocation%, Equity-Allocation%, Mutual Fund-Allocation%) into a single 3-column row. Apply right-side legend standard.
- **Portfolio module tabs (Equity, MF, Gold, Retiral, Real Estate, Bonds, FDs, Crypto, Other)**: Remove all charts from the bottom of each tab (10-year forecast bar chart, Holdings Distribution pie chart). Keep only summary cards and the card/table view of holdings.
- **Portfolio Overview donut charts**: Apply consistent right-side legend with % values, remove inner arc labels. Use innerRadius=55, outerRadius=90 for all three.
- **Budgeting Improve Budget**: Fix autofill → ModelBudgetingTab data flow. When autofillData is set in BudgetingPage, it should pass the full category breakdown by Plan Budget `budgetType` (Needs/Wants/Savings). ModelBudgetingTab should map these to its input fields: income→income, needs total→rent+groceries+transport+emi split proportionally, wants total→eatingOut+subscriptions split, savings total→otherMisc. Show scenario with pre-populated actual values. 50/30/20 analysis then runs on top of these actuals.
- **Loans page font colors**: Replace all `text-muted-foreground`, very light grays, and near-white text with `text-slate-700 dark:text-slate-200` for labels and `text-green-700 dark:text-green-400` (primary green #16a34a) for metric/value numbers.
- **Trade Journal page font colors**: Apply same pattern — `text-slate-700` for labels, `text-green-700` for values/metrics in light mode.

### Remove
- % labels rendered inside donut arc segments (across all modules except Budget Insights top charts)
- "Retirement Age" input field from Goals Plan Goals
- Charts from bottom of non-Overview Portfolio tabs (Holdings Distribution pie, 10-year forecast bar chart)

## Implementation Plan

1. **DonutChartWithLegend helper** — Create a small reusable render helper (inline in each file, not a separate component to avoid over-engineering) that takes `data: {name, value, color}[]`, `innerRadius`, `outerRadius`, `height`, `formatLabel` and renders a `<div className="flex items-center gap-4">` with a PieChart on the left (no labels in arc) and a legend list on the right showing colored dot + name + `X%`.

2. **DashboardPage.tsx**:
   - RiskOMeter: Replace `segmentDeg=30` with proper per-band angle calculation. Use `LEVELS.map` to compute each segment's `startAngle` and `endAngle` proportionally to risk range. Build SVG path with `polarToCartesian` for each. Fix viewBox to `0 0 320 220` with `cy=185` so arc is fully visible.
   - Asset Allocation donut: Remove label prop, add right-side legend div.
   - Assets vs Liabilities donut: Remove inner label, add right-side legend.
   - Goals Progress: Filter `goalsProgress` to max 3 on-track + max 3 need-attention sorted by `targetDate`.
   - 50/30/20: Verify uses `budgetCats` `budgetType` field for category mapping (already does, confirm).

3. **GoalsTab.tsx** — Achievement Quality and Goal Diversification donut charts: Remove inner labels, add right-side legend with count + %.

4. **GoalsPage.tsx / ModelGoalPlanningTab.tsx**:
   - Add radio buttons at top (Single Goal / Multi Goal).
   - Remove scenario menu (view="menu" state). Always show detail view, radio controls scenario.
   - Remove retirementAge state and field.
   - Add availableToday per-goal field in table.
   - Auto-populate currentAge from localStorage gff_dob.
   - Update analyzeGoals to account for Available Today in SIP calculation.
   - Add "Add to Track Goals" button that calls actor.addGoal for each result goal.

5. **PortfolioPage.tsx**:
   - Overview: Wrap 3 donut charts in `grid-cols-3` row. Remove inner labels, add right-side legends.
   - Non-Overview tabs: Remove Holdings Distribution Pie and 10-Year Growth Forecast sections.
   - All donuts: innerRadius=55, outerRadius=90 for consistency.

6. **BudgetingPage.tsx + ModelBudgetingTab.tsx**:
   - Fix autofill: Pass full category-level breakdown (not just needs/wants/savings totals) from BudgetingPage to ModelBudgetingTab. Map budgetType from Plan Budget categories.
   - ModelBudgetingTab: Apply autofilled values directly to inputs when autofillData prop changes.

7. **LoansPage.tsx**: Update text color classes — labels to `text-slate-700 dark:text-slate-200`, values/metrics to `text-green-700 dark:text-green-400` where they were previously light/muted.

8. **TradeJournalPage.tsx**: Same font color updates — labels `text-slate-700 dark:text-slate-200`, metric values `text-green-700 dark:text-green-400`.
