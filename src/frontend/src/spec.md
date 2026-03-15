# FinanceOS

## Current State
- DashboardPage.tsx: NAV section has a large hero card + 8 individual asset type cards. Bottom section has 8 mini pie charts (Holdings by Asset Type). Cards/tables are functional but not world-class styled.
- PortfolioPage.tsx: Shows holdings table per asset type tab. No per-type distribution chart.

## Requested Changes (Diff)

### Add
- PortfolioPage: Holdings distribution mini pie chart panel below the holdings table, scoped to the currently selected asset type (showing breakdown by individual holding).

### Modify
- DashboardPage: Compress NAV section into a single compact card with a summary strip (total NAV prominently + 8 asset type mini-badges inline). Replace large hero card + 8 cards with a slimmer, more polished layout.
- DashboardPage: Remove "Holdings by Asset Type" section (Section 6 with 8 mini pies) — moved to Portfolio.
- DashboardPage: Upgrade all cards, tables, and charts to world-class industry-standard styling (better typography, subtle gradients, cleaner borders, improved spacing, professional color usage).
- PortfolioPage: Improve table and card styling to match industry standard.

### Remove
- DashboardPage: Section 6 (Holdings by Asset Type 8 mini pies grid).

## Implementation Plan
1. Update DashboardPage: compress NAV into a single compact summary bar card, remove Holdings mini pies section, upgrade all card/table styling.
2. Update PortfolioPage: add holdings distribution pie chart below table, upgrade table styling.
3. No backend, logic, or CRUD changes.
