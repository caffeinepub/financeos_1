# FinanceOS

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Full-stack personal finance application with the following modules:
  - **Dashboard**: Overview of net worth, portfolio summary, budget status, recent transactions, goals progress
  - **Goal**: Financial goals tracking (savings targets, milestones, deadlines, progress)
  - **Portfolio**: Investment portfolio management with sub-categories:
    - Retirement
    - Mutual Fund
    - ETF / Equity Stocks
    - Crypto
    - Commodity
    - Real Estate
    - Fixed Income
    - Other Investments
  - **Budgeting**: Income and expense budget categories, monthly budget vs actual tracking
  - **Financial Model**: Projections, scenarios, what-if analysis (compound interest, future value calculations)
  - **Financial Planner**: Life events planning, milestone-based financial planning calendar
  - **Financial Rules**: Custom user-defined financial rules and alerts (e.g., spending limits, savings ratios)
  - **Loans**: Loan tracking (mortgage, auto, personal, student), amortization, payoff tracking
  - **Transactions**: Manual transaction entry, categorization, search/filter
- Authentication: Internet Identity + manual username/password login
- Empty data on start (no seed data)

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- User profile storage (linked to principal or username)
- Goals CRUD (name, target amount, current amount, deadline)
- Portfolio holdings CRUD (asset type, name, ticker, quantity, cost basis, current value, sub-category)
- Budget categories CRUD (name, type income/expense, monthly limit)
- Transactions CRUD (date, amount, category, description, account)
- Loans CRUD (name, type, principal, rate, term, start date, balance)
- Financial Rules CRUD (name, rule type, threshold, alert)
- Financial Planner events CRUD (title, date, amount, life event type)
- Financial Model parameters (input sets for projection scenarios)
- Authorization: per-user data isolation via caller principal

### Frontend (React + TypeScript + Tailwind)
- Sidebar navigation with all module links
- Dashboard: net worth widget, portfolio summary chart, budget ring, goal cards, recent transactions table
- Goal module: goal cards grid, add/edit/delete goals, progress bars
- Portfolio module: tabbed view by sub-category, holdings table, allocation pie chart
- Budgeting module: budget categories list, monthly summary, budget vs actual bars
- Financial Model module: projection inputs, compound growth chart
- Financial Planner module: timeline/calendar of financial milestones
- Financial Rules module: rules list, create/edit rules with conditions
- Loans module: loan cards, amortization schedule table, payoff progress
- Transactions module: transaction table with filters, add/edit/delete, category tagging
- Login page: Internet Identity + manual login form
- Responsive layout, dark/light theme consistent with original design
