# Growfinfire Global

## Current State
Full-stack finance app with Portfolio, Budgeting, Financial Model, Financial Planner, Learn Finance, Loans, and Trade Journal modules.

## Requested Changes (Diff)

### Add
- Budget Insights: "All Months" and "All Years" options in month/year dropdowns
- Budget Insights: Type column values (Needs/Wants/Savings) in the transaction-style table

### Modify
- **Portfolio Overview table**: Rename columns: "Total Invested"→"Invested", "Current Value"→"Current", "% Gain/Loss"→"Gain/Loss%", "Gain / Loss"→"Gain/Loss". Swap order of Gain/Loss% and Gain/Loss columns.
- **Portfolio all tabs**: Rename "P&L" → "Gain/Loss" and "% P&L" → "Gain/Loss%" everywhere (table headers, cards, chart labels)
- **Budgeting Track Income vs Expenses**: On the right side of the top 2 cards row, move buttons (All, Income, Expense, Add) into same row as the cards; move Search bar to left of Month dropdown
- **Budgeting Budget Insights**: Add "All Months" and "All Years" filter options in dropdowns; show Type as Needs/Wants/Savings in table
- **Financial Model cards sequence**: Asset Allocation → Goal Planning (rename Goal-Based Saving & Planning) → Budget & Expense Tracking → Model Portfolio & Investments (rename Model Portfolio) → Loan Management & Repayment (rename Debt Management & Repayment) → Model Retirement → Model Insurance (rename Insurance) → Model Crypto
- **Financial Planner**: Accordion - when one card is expanded and user opens another, collapse the previous one (single-open accordion)
- **Financial Planner**: Currency in results/left panel should use selected currency from CurrencyContext, not hardcoded symbols
- **Learn Finance Rules, Basics, Learn from Mistakes, My Rules**: Show 2 cards per row (grid-cols-2)
- **Learn Finance Rules**: Single-open accordion - expanding a card collapses any previously expanded card
- **Learn Finance Learn from Mistakes**: Single-open accordion - same behavior
- **Loans**: Fix card backgrounds and font colors to match application standard (white/dark-bg cards, proper text contrast, consistent with Goals/Portfolio modules)
- **Trade Journal**: Apply industry-standard trading journal dark theme: dark charcoal/slate backgrounds (#0f1117 or similar), accent colors green/red for P&L, monospace elements for prices, professional trading terminal aesthetic

### Remove
- Nothing removed

## Implementation Plan
1. PortfolioPage.tsx: grep for column headers and rename/swap
2. PortfolioPage.tsx: replace all P&L/% P&L with Gain/Loss/Gain/Loss%
3. BudgetingPage.tsx: restructure Track Income top bar (buttons inline, search left of month dropdown)
4. BudgetingPage.tsx: Budget Insights - add All Months/All Years to dropdowns, add Type column
5. FinancialModelPage.tsx: reorder and rename the 8 model cards
6. FinancialPlannerPage.tsx: implement single-open accordion logic, fix currency usage
7. FinancialRulesPage.tsx: 2-per-row grid, single-open accordion for Rules and Learn from Mistakes tabs
8. LoansPage.tsx: fix card theming
9. TradeJournalPage.tsx: apply trading journal dark theme
