# FinanceOS

## Current State
- Backend is split into `Types.mo` (12 type definitions) and `Storage.mo` (State record + init factory).
- `main.mo` imports both modules and contains all CRUD logic.
- `main.mo` still holds a `var idCounter : Nat` and a local `generateId()` function whose body duplicates logic that belongs in a utility module.
- No `Utils.mo` exists yet.

## Requested Changes (Diff)

### Add
- `src/backend/Utils.mo`: exports a pure `generateId(counter: Nat) : Text` function that combines a counter value with the current timestamp. No mutable state.

### Modify
- `src/backend/main.mo`:
  - Add `import Utils "Utils"`.
  - Keep `var idCounter : Nat = 0` (mutable state must stay in the actor).
  - Replace the body of the local `generateId()` wrapper with a delegation to `Utils.generateId(idCounter)`.
  - No other changes.

### Remove
- Nothing removed from public API or CRUD logic.

## Implementation Plan
1. Create `Utils.mo` with the pure `generateId(counter)` function.
2. Update `main.mo` to import `Utils` and delegate `generateId()` to it.
3. Validate that no logic, UI, or public API is changed.
