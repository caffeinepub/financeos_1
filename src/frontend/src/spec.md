# Growfinfire Global — Performance Optimization

## Current State

- `QueryClient` in `main.tsx` has no `staleTime`, `gcTime`, or `refetchOnWindowFocus` set — every component mount triggers a fresh backend call
- `DashboardPage.tsx` makes 4 separate `useQuery` calls on mount: `getAllPortfolioHoldings`, `getAllTransactions`, `getAllBudgetCategories`, `getAllLoans`
- `PortfolioPage.tsx` and `BudgetingPage.tsx` use raw `useEffect(() => load(), [actor])` with direct `actor.getAll*()` calls — no caching layer
- `TradeJournalPage.tsx` uses same raw `useEffect` + `actor.getAll*()` pattern with no cache
- `useGoals.ts` uses `useQuery` without `staleTime` — refetches on every mount
- All backend reads are already annotated as `public query` in Motoko — no update-call misuse found
- No `setInterval` or polling exists — no polling to fix
- No OneDrive/Excel sync exists — item 5 skipped per user instruction
- Vite config has `minify: false` and no chunk splitting

## Requested Changes (Diff)

### Add
- Global `QueryClient` defaults: `staleTime: 90_000`, `gcTime: 10 * 60_000`, `refetchOnWindowFocus: false`, `refetchOnMount: false`, `retry: 1` — all queries use these automatically
- A `useQueryDefaults` hook pattern — no individual files need staleTime set unless overriding
- Cache invalidation on mutations: all `useMutation` `onSuccess` handlers already call `qc.invalidateQueries` — this is correct and must remain unchanged
- Lazy loading: pages already code-split via Vite chunking; add `React.lazy` + `Suspense` in `App.tsx` for all page-level components so modules only load when navigated to
- Vite manual chunk splitting and `minify: 'esbuild'` for faster builds and smaller bundles

### Modify
- `main.tsx`: configure `QueryClient` with the 90s stale time defaults
- `App.tsx`: wrap page imports in `React.lazy` + `Suspense` for lazy loading per module
- `vite.config.js`: set `minify: 'esbuild'`, add `manualChunks` for vendor, charts, ICP, and page-level splits
- `useGoals.ts` `usePortfolioByType`: each asset type calls `getAllPortfolioHoldings` separately (8 calls). Consolidate so all 8 share the same query key `['portfolio','all']` and filter client-side — reducing 8 backend calls to 1 per cache window
- `DashboardPage.tsx`: consolidate the 4 individual `useQuery` calls to share query keys matching the rest of the app (`['portfolio','all']`, `['transactions']`, `['budgetCategories']`, `['loans']`) so cached data from other pages is reused

### Remove
- Nothing removed — no UI, business logic, or backend changes

## Implementation Plan

1. **`main.tsx`** — Set `QueryClient` defaults: `staleTime: 90_000`, `gcTime: 600_000`, `refetchOnWindowFocus: false`, `refetchOnMount: false`, `retry: 1`
2. **`App.tsx`** — Replace static page imports with `React.lazy` wrapped imports; wrap router outlet with `<Suspense fallback={<div/>}>`
3. **`vite.config.js`** — Add `build.minify: 'esbuild'`, `manualChunks` splitting vendor-react, vendor-charts, vendor-icp, vendor-ui, page-level chunks
4. **`useGoals.ts`** — Change `usePortfolioByType` so all 8 asset-type hooks share query key `['portfolio','all']` and filter locally — 8 backend calls → 1
5. **`DashboardPage.tsx`** — Align query keys to match the shared keys used elsewhere (`['portfolio','all']`, `['transactions']`, `['budgetCategories']`, `['loans']`) so Dashboard reuses cached data already fetched by other modules
6. **Query/Update audit** — All `getAll*` methods are `public query` in Motoko. No fixes needed.
7. Validate: lint, typecheck, build must pass with no errors
