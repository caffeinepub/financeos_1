# Growfinfire Global

## Current State
App is at Version 108 (stable). Changes needed are focused and isolated to specific components.

## Requested Changes (Diff)

### Add
- ExpensesTab: collapse/expand logic for income rows (show 1, expand rest; no "Show more" link if only 1)

### Modify
- DashboardPage: `shortNum` — remove space between digits and Cr/L/K (e.g. `12.50Cr` not `12.50 Cr`)
- DashboardPage NAV card mobile layout: on mobile, NAV value appears in top-left row 1 (full width), then investments grid below. No change on web view.
- GoalList: rename "Needs Attention" → "Need Attention" (type, filter logic, pill buttons, data-ocid)
- GoalsTab: rename "Needs Attention" → "Need Attention" in analytics data
- DashboardPage statusBadge: rename "Needs Attention" → "Need Attention"
- PortfolioPage submenu: remove `bg-black` from outer wrapper div, replace with transparent/light background matching Goals pill theme
- BudgetingPage TabsList: remove `bg-black`, replace with transparent/light background matching Goals pill theme
- ExpensesTab summary cards: change `grid-cols-1 sm:grid-cols-3` to `grid-cols-2 sm:grid-cols-3`; remove Net Balance card; keep only Actual Income and Actual Expense
- ModelBudgetingTab, ModelDebtTab, ModelGoalPlanningTab: add view state ("menu" | "detail"); menu = scenario cards; detail = full form+results with "Back to Menu" button

### Remove
- ExpensesTab: Net Balance card

## Implementation Plan
1. Fix shortNum in DashboardPage (remove spaces before Cr/L/K)
2. Fix NAV card mobile layout in DashboardPage (flex-col on mobile, flex-row on sm+)
3. Rename "Needs Attention" → "Need Attention" in GoalList, GoalsTab, DashboardPage
4. Remove bg-black from PortfolioPage submenu wrapper
5. Remove bg-black from BudgetingPage TabsList
6. Update ExpensesTab: 2-col mobile cards, remove Net Balance, add income collapse/expand
7. Update 3 Financial Model tabs: scenario cards → full page view → Back to Menu
