# Growfinfire Global

## Current State
Full-stack fintech app with Dashboard, Goals, Portfolio, Budgeting, Financial Model, Financial Planner, Learn Finance, Loans, Trade Journal modules. Version 122 deployed in production.

## Requested Changes (Diff)

### Add
- **Portfolio**: Table/Card view toggle on all tabs (Overview + all 8 asset type tabs). Card view matches portfolio_modules reference image: name + category badge top-left, allocation% top-right, horizontal allocation bar (color-coded), Invested / Current / Gain/Loss% / Gain/Loss metrics row, edit/delete icon buttons.
- **Goals (Track Goals tab)**: Table/Card view toggle. Card view matches goal_planning1 image: circular SVG progress ring (72px), goal name + status badge, Target / Current / Goal date / Timeline 4-column row, linked investment tags (EPS, NPS, etc. with +N more), right panel showing Need amount + SIP amount + deadline. Table view keeps horizontal progress bar. Mobile-friendly.

### Modify
- **Budgeting → Track Income vs Expenses**: Move Month and Year dropdowns to leftmost of the action row; move search bar to the right side.
- **Budgeting → Budget Insights**: The 3 metric cards "% of Income Budget", "% of Expenses Budget", and "Balance" always show all-months aggregated values regardless of the month/year filter applied to charts.
- **Learn Finance → Basics**: Card border/theme matches Rules tab exactly (same card header style, colors, borders). When any card is clicked/expanded, show full-page content replacing the main panel (sidebar and header remain), with a "Back to Basics" button that returns to the card grid — same pattern as Financial Planner scenario full-page view.
- **Financial Model → Last 3 models (Goal Planning, Budgeting & Expense Tracking, Debt Management)**: When a scenario is clicked, show full-page view replacing main panel (sidebar and header remain), with "Back to Menu" returning to card grid — same pattern as Financial Planner. This enforces consistency with what user confirmed.

### Remove
- Nothing removed.

## Implementation Plan
1. **PortfolioPage.tsx**: Add `viewMode: 'table' | 'card'` state per tab. Add a toggle button (Table/Card icons) in the tab header area. Build a `PortfolioCardView` component that renders each holding as a card matching the reference image. Apply to Overview and all 8 asset tabs.
2. **GoalsTab.tsx / GoalList.tsx**: Add `viewMode` state toggle in Track Goals tab. Build `GoalCardView` component matching goal_planning1 image with circular progress SVG, status badge, 4-column metrics, investment tags, right Need/SIP panel. Table view retains existing horizontal progress bar.
3. **BudgetingPage.tsx / MonthlyTrackerTab.tsx (Track Income vs Expenses)**: Swap order — Month/Year dropdowns leftmost, search bar rightmost in the top action row.
4. **BudgetingPage.tsx / AnalyseTab or BudgetingTab (Budget Insights)**: Make the 3 summary cards compute from all transactions regardless of the active month/year filter.
5. **FinancialRulesPage.tsx (Basics tab)**: Update card styling to match Rules tab exactly. Add `expandedCard` state; when set, render full-page content replacing card grid (like Financial Planner). Add "Back to Basics" button.
6. **FinancialModelPage.tsx / ModelGoalPlanningTab, ModelBudgetingTab, ModelDebtTab**: Ensure scenario click replaces main panel with full-page view (sidebar/header intact), "Back to Menu" returns to scenario card grid.
