# Growfinfire Global

## Current State
- Loans module: TabsList does not scroll on mobile (spills right); `createLoan` payload missing `id` field; `termMonths` sent as `Number` but backend expects `bigint`; UI color/theme needs upgrade to match app standard
- Trade Journal: `backend.d.ts` and `backend.ts` are missing `TradeEntry` and `ChecklistItem` types + all 9 CRUD functions; frontend uses `(actor as any)` casts to work around this; `sortOrder` (bigint) sent as plain `number`; submenu tabs spill on mobile

## Requested Changes (Diff)

### Add
- `TradeEntry` and `ChecklistItem` types to `backend.d.ts`
- 9 TradeJournal CRUD function signatures to `backend.d.ts`
- 9 TradeJournal CRUD function implementations to `backend.ts` (same pattern as existing Loan functions)

### Modify
- `backend.d.ts`: add TradeEntry, ChecklistItem interfaces and CRUD signatures
- `backend.ts`: add createTradeEntry, getTradeEntry, getAllTradeEntries, updateTradeEntry, deleteTradeEntry, createChecklistItem, getAllChecklistItems, updateChecklistItem, deleteChecklistItem implementations
- `LoansPage.tsx`:
  - Add `id: crypto.randomUUID()` to the `createLoan` payload
  - Change `termMonths: Number(form.termMonths)` → `termMonths: BigInt(form.termMonths)` in payload
  - Same fix in `openEdit` and `simLoan` usages
  - Fix TabsList: add `overflow-x-auto scrollbar-hide flex-nowrap min-w-0` for mobile draggable scroll
  - Upgrade UI theme to match application standards: use Goals/Portfolio pill nav style; consistent dark card colors; proper color coding per loan type; industry-standard health score coloring (green/amber/red)
- `TradeJournalPage.tsx`:
  - Remove all `(actor as any)` casts — use typed `actor` with proper imports
  - Fix `sortOrder: BigInt(item.sortOrder)` in createChecklistItem payload
  - Fix TabsList: add `overflow-x-auto scrollbar-hide flex-nowrap min-w-0` for mobile draggable scroll

### Remove
- Nothing

## Implementation Plan
1. Update `backend.d.ts` to add TradeEntry, ChecklistItem types and all 9 CRUD function signatures
2. Update `backend.ts` to add all 9 CRUD function implementations (copy Loans pattern)
3. Fix `LoansPage.tsx`: add id to payload, BigInt for termMonths, fix mobile tab overflow, upgrade UI theme
4. Fix `TradeJournalPage.tsx`: replace (actor as any) with typed calls, fix sortOrder bigint, fix mobile tab overflow
5. Validate build
