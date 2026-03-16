# FinanceOS

## Current State
- Financial Model has 6 tabs: Asset Allocation (Beginner), Model Portfolio (Intermediate), Retirement (Intermediate), Insurance (Beginner), Crypto (Advanced), Fundamentals/Learn (All Levels). Insurance is 4th, Fundamentals is last.
- Financial Rules has two tabs: "Knowledge Base" (FinancialRulesSection with 80+ rules, searchable by category) and "My Rules" (CRUD). No level filter.
- Budgeting Monthly Tracker uses `monthlyLimit` from BudgetCategory as the planned amount for each month - no per-month override.
- Goals table has `overflow-x-scroll` on a wrapper div, but the scrollbar appears at the top (default browser behavior), not the bottom.

## Requested Changes (Diff)

### Add
- Financial Rules: new "Basics" tab (sub-tab inside Financial Rules tab) containing the Fundamentals content (moved from Financial Model)
- Financial Rules > Rules tab: a level selector bar (Beginner / Intermediate / Advanced / Expert) that filters the rules shown, styled like the Financial Model progression theme
- Budgeting Monthly Tracker: per-month planned expense override — user can add/remove planned amounts for any month, stored in localStorage, without impacting existing CRUD

### Modify
- Financial Model: reorder TABS so Insurance is 1st (Beginner) and Asset Allocation is 2nd (Beginner), then Model Portfolio, Retirement, Crypto — Fundamentals tab removed
- Financial Model PROGRESSION_STEPS: update Beginner tabs to ["Insurance", "Asset Allocation"]
- Financial Rules: rename "Knowledge Base" TabsTrigger and TabsContent to "Rules"
- Financial Rules tab: add new "Basics" TabsTrigger/TabsContent after "Rules", before "My Rules"
- Goals GoalList: fix horizontal scroll so the scrollbar appears at the bottom of the table on mobile, not the top — use CSS transform flip trick (`transform: rotateX(180deg)` on outer wrapper; inner div un-flips)

### Remove
- Financial Model: remove Fundamentals tab from TABS array and its TabsContent
- Financial Model: remove import of ModelFundamentalsTab (it will be used in Financial Rules Basics tab instead)

## Implementation Plan
1. `FinancialModelingTab.tsx`: Remove `fundamentals` from TABS, reorder so `modelinsurance` is index 0, `assetallocation` is index 1. Update PROGRESSION_STEPS Beginner tabs to ["Insurance", "Asset Allocation"]. Remove Fundamentals TabsContent.
2. `FinancialRulesPage.tsx`: Rename `knowledge` tab value/trigger to `rules` with label "Rules". Add `basics` tab after it containing `<ModelFundamentalsTab />`. Add level selector inside the Rules tab content that filters rules by level (Beginner/Intermediate/Advanced/Expert). Pass active level down to `FinancialRulesSection`.
3. `FinancialRulesSection.tsx`: Accept optional `levelFilter` prop. Assign a `level` field to each rule category (or per rule). Filter displayed rules/categories when `levelFilter` is set. Keep existing search and category filter working.
4. `MonthlyTrackerTab.tsx`: Add a "Planned Expenses" section per selected month. Store per-month planned overrides in localStorage keyed by `month+year`. Provide Add/Remove UI for planned line items. Use these overrides (or fall back to category monthlyLimit) in the tracker comparisons. Do not change any CRUD or backend calls.
5. `GoalList.tsx`: Replace the current scroll wrapper with a CSS rotateX(180deg) flip pattern so the scrollbar renders at the bottom. The outer div has `transform: rotateX(180deg); overflow-x: auto` and the inner div has `transform: rotateX(180deg)` to un-flip content.
