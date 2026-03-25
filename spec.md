# Growfinfire Global — Focused UI Fixes v112

## Current State
Version 111 is live. The app has Dashboard, Portfolio, Budgeting, Financial Model and other modules. No backend/CRUD changes are needed.

## Requested Changes (Diff)

### Add
- Budgeting: New "Analyse" tab at the end (4th tab) that embeds the Budgeting & Expense Tracking Model logic but pre-fills actual income/expense values from the Track Income & Expense tab data

### Modify

**Dashboard:**
- NAV Card mobile: reduce `py-4` to `py-2` on mobile only (use `sm:py-4`) to reduce vertical whitespace
- Projected Net Worth Trend chart: show Cr/L/K value label on each data dot using `<LabelList>` with `shortNum()` formatter
- Goals progress section: change status badge text from "Completed" to "Achieved" (in `statusBadge()` function at line ~156 in DashboardPage.tsx)
- Cash Flow Summary chart bars: add `<LabelList>` on each bar showing value in Cr/L/K
- Assets vs Liabilities: replace the current PieChart/donut with a `RadialBarChart` showing circular progress bars for Assets and Liabilities with values

**Portfolio:**
- Submenu pill nav: active tab = black background (`bg-slate-900`) + white font; inactive = consistent slate-600 text with subtle border. Apply uniformly to all tabs including Overview
- Overview table: ensure `overflow-hidden` is on the Card wrapper so `rounded-2xl` visually clips the table corners — table rows currently show sharp corners inside the rounded card
- All module tables (mobile): wrap `<th>` text and sort icon in a `flex items-center gap-1 whitespace-nowrap` so the sort icon stays inline on the same row as the header text on narrow screens

**Budgeting:**
- Add 4th tab "Analyse" that uses the ModelBudgetingTab component logic but reads `actualIncome` and `actualExpenses` from the existing Track Income & Expense state/data. Pre-populate the model inputs with these real values.

**Financial Model:**
- ModelPortfolioTab: convert solid Pie chart to donut (add `innerRadius={55}`) and add value labels inside/on arcs
- FinancialModelingTab accordion: change `toggleSection` to accordion behavior — when opening a new section, close all others (replace `new Set(prev)` add logic with `new Set([id])` on open)
- For the 3 model tabs (budgetingmodel, debtmodel, goalmodel): implement full-page view pattern matching Financial Planner — when a scenario card is clicked, show full-page content replacing the accordion card body, with a "← Back to Menu" button at top. Do not show scenario cards again inside the expanded view.

### Remove
- Nothing removed

## Implementation Plan
1. `DashboardPage.tsx`:
   - Line ~586: add `py-2 sm:py-4` to NAV Card CardContent
   - Line ~156: `Completed` → `Achieved` in statusBadge
   - Net Worth Trend Line chart: add `<LabelList dataKey="Net Worth" content={renderDotLabel}>` with shortNum formatting
   - Cash Flow BarChart: add `<LabelList dataKey="Income">` and `<LabelList dataKey="Expense">` with shortNum formatting positioned above bars
   - Assets vs Liabilities: replace PieChart with RadialBarChart showing two arcs (Assets, Liabilities) with value + % labels
2. `PortfolioPage.tsx`:
   - Pill nav: use `style={isActive ? {bg:'#0f172a', color:'#fff'} : {color:'#475569'}}` uniformly, ensure Overview tab uses same active style
   - Overview Card: add `overflow-hidden` class if missing
   - All `<th>` elements: wrap content in `<span className="flex items-center gap-1 whitespace-nowrap">`
3. `BudgetingPage.tsx`:
   - Add 4th tab `value="analyse"` labeled "Analyse"
   - Inside tab content: render an inline analysis component that reads `actualIncome` and `actualExpenses` totals from the budgeting data already in scope, then runs the 50/30/20 analysis, leakage detection, and outputs the structured budget table (same logic as ModelBudgetingTab but pre-seeded)
4. `FinancialModelingTab.tsx`:
   - `toggleSection`: replace with accordion — `setExpandedSections(prev => prev.has(id) ? new Set() : new Set([id]))`
   - For sections budgetingmodel/debtmodel/goalmodel: add a `selectedScenario` state per section; when a scenario is selected, render full-page view with Back button; hide scenario list when content is shown
5. `ModelPortfolioTab.tsx`:
   - Add `innerRadius={55}` to the `<Pie>` element
   - Add value labels on arcs
