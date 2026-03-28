# Growfinfire Global

## Current State
Production-grade finance app with Dashboard, Goals, Portfolio, Budgeting, Financial Model, Financial Planner, Learn Finance, Loans, Trade Journal modules. Version 120 deployed.

## Requested Changes (Diff)

### Add
- Budgeting Plan Budget: 2 new cards — Expected Savings (Income - Expense) and Savings Rate (%)
- Budgeting Track Income vs Expense: 2 new cards — Net Balance and Balance (%)
- Financial Planner Retirement & Goals section: Add "Buy a House - Eligibility" card (move BuyHousePlanner component from GoalsPage Plan Goals)

### Modify
- **Admin (Layout.tsx):** `bootstrapAdmin()` call should use the actor directly and ensure `isCallerAdmin` response correctly sets `isAdmin` state. Debug and fix so admin icon appears on login.
- **Dashboard Budgeting 6-Month chart:** `planned` value per month should reflect per-month planned budget edits from backend (budgetCats monthlyLimit per month if available), not a single static sum.
- **Dashboard Goals Progress chart:** GoalDate text → `text-slate-600` (dark grey); currentAmount → red if progress < 50%, amber if 50-80%, green if >= 80% (based on currentAmount/targetAmount ratio).
- **Dashboard Assets vs Liabilities:** Replace PieChart donut with RadialBarChart showing % values inside each circular bar (RadialBarChart already imported).
- **Goals Plan Goals — ModelGoalPlanningTab:** Header "Goal-Based Saving & Planning Model" font color → black (`text-gray-900 dark:text-white`). Remove guidance text "Select a scenario to explore. Pre-filled with realistic goal numbers you can edit." Add "Back to Menu" button in detail view (view==="detail"). Card theme updated to match Financial Planner card style (white background, proper border, consistent font). Remove BuyHousePlanner from here (moved to Financial Planner).
- **Goals Plan Goals:** Card backgrounds white, card title text black, scenario description grey.
- **Portfolio Overview table:** Rename "Investment Module" header → "Investment". Move "Allocation%" column to last position. Gain/Loss card already uses shortNum — verify it shows Cr/L/K or M/B/K.
- **Portfolio all tables:** Swap "Gain/Loss%" and "Gain/Loss" columns so Gain/Loss% appears before Gain/Loss.
- **Budget Insights chart order:** Reorder to: 1. Monthly Overview Income vs Expenses, 2. 50/30/20 Budget Rule Analysis, 3. Month-over-Month Trend, 4. Monthly Budget Snapshot, 5. Spending by Category, 6. Top Spending Categories, 7. Savings Rate Trend (%)
- **Budgeting Improve Budget — ModelBudgetingTab:** Header "Budgeting & Expense Tracking Model" → black text. Remove guidance text. Add Back to Menu in detail view. Card theme matches Financial Planner.
- **Loans Debt Model — ModelDebtTab:** Header "Debt Management & Repayment Model" → black text. Remove guidance text. Add Back to Menu in detail view. Card theme matches Financial Planner.
- **Loans submenu header:** Fix mobile - all menu items visible, draggable/scrollable from leftmost item.
- **Loans & Trade Journal:** Full UI theme alignment — card backgrounds, font colors, table styles to match app standard (Portfolio/Budgeting theme, dark/light toggle).
- **FIRE Calculator (FIRECalculator.tsx):** Remove "Calculate FIRE Plan" button. Trigger calculation automatically using useEffect whenever any input changes (instant calculation like other planners).

### Remove
- "Buy a House Planner" card from Goals Plan Goals (moved to Financial Planner)
- Guidance texts in ModelGoalPlanningTab, ModelBudgetingTab, ModelDebtTab detail views
- "Calculate FIRE Plan" button from FIRECalculator

## Implementation Plan
1. Fix admin icon — ensure bootstrapAdmin + isCallerAdmin sequence works reliably in Layout.tsx
2. Dashboard: fix Budgeting 6M planned per-month, Goals Progress text colors, Assets vs Liabilities RadialBarChart
3. ModelGoalPlanningTab: black header, remove guidance, Back to Menu button, Financial Planner card theme, remove BuyHousePlanner
4. FinancialPlannerPage/CalculatorsTab: add Buy a House - Eligibility entry in Retirement & Goals
5. Portfolio: rename column, reorder Allocation%, swap Gain/Loss columns in all tables
6. BudgetingPage Plan Budget: add Expected Savings + Savings Rate cards
7. MonthlyTrackerTab: add Net Balance + Balance (%) cards in Track tab; reorder Budget Insights charts
8. ModelBudgetingTab: black header, remove guidance, Back to Menu, Financial Planner card theme
9. ModelDebtTab: black header, remove guidance, Back to Menu, Financial Planner card theme
10. LoansPage: fix mobile submenu draggable, align UI theme
11. TradeJournalPage: align UI theme with app standard
12. FIRECalculator: remove button, add useEffect for instant calculation
