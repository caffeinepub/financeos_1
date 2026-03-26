# FinanceOS — Focused UI Fixes

## Current State
- Landing page has no dark/light theme toggle
- Dashboard bar charts (Investment Categories, Monthly Savings Rate) show values inside bars
- Trade Journal backend methods (createTradeEntry, getAllTradeEntries, createChecklistItem, getAllChecklistItems, updateTradeEntry, deleteTradeEntry, updateChecklistItem, deleteChecklistItem) are missing from the generated IDL/bindings (backend.did.js / backend.ts), causing `(actor as any).xxx()` calls to silently fail since the actor proxy doesn't have these methods
- Trade Journal submenu tabs overflow on mobile (not scrollable)
- Financial Model: 3 new models (Budgeting, Debt, Goal-Based) show scenario cards TWICE — once in the menu view and again repeated in the detail/expanded view

## Requested Changes (Diff)

### Add
- Dark/Light theme toggle button in Landing Page top header, persisted to localStorage, applied globally across all pages (Landing + authenticated app)

### Modify
- Dashboard: Investment Categories chart — move bar labels to top of each bar
- Dashboard: Monthly Savings Rate chart — move % and amount labels to top of each bar
- Trade Journal: Regenerate backend bindings to include TradeJournal CRUD methods in the IDL so actor calls work
- Trade Journal: Fix mobile tab overflow — make tab container horizontally scrollable with full width
- Financial Model: ModelBudgetingTab, ModelDebtTab, ModelGoalPlanningTab — in the detail view, remove the duplicate scenario selector grid (scenarios are already visible in the menu view; showing them again in detail is redundant)

### Remove
- Nothing

## Implementation Plan
1. Create ThemeContext with localStorage persistence; apply 'dark'/'light' class to html element; add Sun/Moon toggle to LandingPage header and Layout header
2. Regenerate Motoko backend to include TradeJournal types and expose them in IDL
3. Fix Trade Journal mobile tab bar: change `w-fit` to `w-full` with `overflow-x-auto`
4. Fix Dashboard bar chart label positions for Investment Categories and Monthly Savings Rate
5. Remove duplicate scenario selector grids from ModelBudgetingTab, ModelDebtTab, ModelGoalPlanningTab detail views
