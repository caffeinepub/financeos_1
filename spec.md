# Growfinfire Global

## Current State
- Portfolio has Invested Value / Current Value labels; tables not sorted by Invested; Category and Allocation% are in mid-table; Overview table has sharp corners; no DOB in profile; no age column in forecast.
- Financial Model has its own bespoke card layout, different from Financial Planner's accordion category cards.

## Requested Changes (Diff)

### Add
- Date of Birth field (with auto-calculated Age tag) to sidebar profile section
- Age column in Portfolio Overview 20-year forecast table (starts from user's current age)
- Donut chart for % Allocation added left of the Invested vs Current Value bar chart on Overview

### Modify
- Portfolio all submodule tables: rename 'Invested Value' → 'Invested', 'Current Value' → 'Current'
- Portfolio all tables: sort by Invested value descending
- Portfolio all tables: move Category and % Allocation columns to the end (after Gain/Loss %)
- Portfolio Overview table: rounded corners matching Retiral module style
- Financial Model: convert all tab cards to match Financial Planner's collapsible accordion category card theme (color coding, card style, layout)

### Remove
- Admin module (skipped per user request)

## Implementation Plan
1. Add DOB field to UserProfile component; calculate and show Age tag
2. Pass DOB/Age into Portfolio Overview forecast table as first-column Age values
3. Add % Allocation donut chart to Portfolio Overview row next to bar chart
4. Rename column headers across all portfolio submodule tables
5. Sort all portfolio tables by Invested descending
6. Reorder table columns: move Category and % Allocation to end
7. Update Overview table to use rounded-2xl card/table style
8. Refactor FinancialModelPage tabs to use same collapsible accordion category card theme as Financial Planner
