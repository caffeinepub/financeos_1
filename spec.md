# FinanceOS

## Current State
All modules (Goals, Portfolio, Budgeting, Loans, Financial Rules) already call backend actor methods for all CRUD operations. A standalone Transactions page exists at `/transactions` with its own sidebar nav entry. The Dashboard has a stat card that links to `/transactions`.

## Requested Changes (Diff)

### Add
- Nothing new.

### Modify
- `Layout.tsx`: Remove the Transactions entry from `navItems`.
- `App.tsx`: Remove the `TransactionsPage` import and `/transactions` route.
- `DashboardPage.tsx`: Change the "Transactions" stat card link from `/transactions` to `/budgeting` (transactions are managed in Budgeting > Income & Expenses tab).

### Remove
- Transactions nav item and route.

## Implementation Plan
1. Remove Transactions import and route from App.tsx.
2. Remove Transactions item from navItems array in Layout.tsx.
3. Update Transactions stat card in DashboardPage to link to /budgeting instead of /transactions.
