# FinanceOS

## Current State
Backend is modularized into Types.mo, Storage.mo, Utils.mo (with generateId), and main.mo.
Every `create*` function in main.mo contained an identical 6-line block:
```
switch (userXxx.get(caller)) {
  case (?m) { m };
  case null {
    let newMap = Map.empty<Text, SomeType>();
    userXxx.add(caller, newMap);
    newMap;
  };
};
```
This block appeared 8 times (Goals, Portfolio, BudgetCategories, Transactions, Loans, Rules, Events, Models).

## Requested Changes (Diff)

### Add
- `Utils.getOrCreateUserMap<V>(outerMap, caller)` -- a generic function that returns the existing inner map for a caller, or creates and registers a fresh empty one.

### Modify
- `Utils.mo`: add `getOrCreateUserMap` with `import Map` and `import Principal`.
- `main.mo`: replace the repeated switch/empty/add block in all 8 `create*` functions with a single `Utils.getOrCreateUserMap(userXxx, caller)` call.

### Remove
- The 8 inline boilerplate switch blocks in create functions (replaced by the utility call).

## Implementation Plan
1. Add `getOrCreateUserMap<V>` to Utils.mo with proper imports.
2. Replace all 8 create-function boilerplate blocks in main.mo with the new utility call.
3. No logic, public API, or UI changes.
