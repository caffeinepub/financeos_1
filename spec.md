# FinanceOS

## Current State
- `CurrencyProvider` is NOT in `main.tsx` or `App.tsx` — so `useCurrency()`'s `setCountry` is always a no-op (uses default context), causing currency selection to never persist and always showing ₹.
- `ExpensesTab.tsx` has a hardcoded `currency: "USD"` in its Intl formatter instead of using the selected currency.
- `MonthlyTrackerTab.tsx` has hardcoded `currency: "INR"` in its formatter.
- `CurrencyContext.tsx` uses only React state (no localStorage), so selected currency resets on every page refresh/login.
- Financial Model tab has adequate but not world-class UI — not structured beginner-to-expert, no skill-level progression, no risk profile color differentiation across all tabs.
- Backend integration works at the actor level but may not be visible if the app doesn't render properly due to context issues.

## Requested Changes (Diff)

### Add
- `CurrencyProvider` wrapping the full app in `main.tsx` (above `App`)
- localStorage persistence in `CurrencyContext.tsx` — on mount read from `localStorage.getItem('financeOS_currency')`, on `setCountry` write to localStorage
- World-class Financial Model UI: skill progression banner (Beginner → Intermediate → Advanced → Expert), risk profile color badges on all tabs, mobile-first responsive layout improvements, section headers with level indicators, interactive learning callouts

### Modify
- `main.tsx`: wrap `<App />` with `<CurrencyProvider>`
- `CurrencyContext.tsx`: initialize state from localStorage; persist on change
- `ExpensesTab.tsx`: replace hardcoded `currency: "USD"` with `country.code` from `useCurrency()`
- `MonthlyTrackerTab.tsx`: replace hardcoded `currency: "INR"` with `country.code` from `useCurrency()`
- `FinancialModelingTab.tsx`: redesign tab bar with color-coded risk badges, add skill level progression header, improve section cards with level indicators, ensure all 6 tabs are mobile-friendly with proper responsive grids

### Remove
- Nothing removed

## Implementation Plan
1. Fix `CurrencyContext.tsx` — localStorage init + persist
2. Fix `main.tsx` — add `CurrencyProvider` wrapper
3. Fix `ExpensesTab.tsx` — use dynamic `country.code`
4. Fix `MonthlyTrackerTab.tsx` — use dynamic `country.code`
5. Redesign `FinancialModelingTab.tsx` — world-class UI with skill progression, risk profile color coding, mobile-friendly layout
6. Validate and build
