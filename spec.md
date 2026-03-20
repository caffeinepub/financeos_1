# Growfinfire Global

## Current State
- Portfolio has a scrollable pill tab bar with colored gradient pills per asset type
- Goals has pill filter chips (All, On Track, Needs Attention, Achieved) as sub-header
- Financial Planner (CalculatorsTab) uses colored gradient CardHeader cards per category, with button grid inside
- Goals analytics charts use PieChart (achievementQuality, goalDiversification)
- Financial Model AssetAllocation uses PieChart for portfolio visualization
- AI assistant (GrowfinfireChat.tsx) has training data but needs expansion

## Requested Changes (Diff)

### Add
- AI training data for: all Learn Finance Rules, all 50 Mistakes + mitigations, all 8 Basics, Financial Model modules (Asset Allocation, Model Portfolio MF/ETF/Both, Crypto, Insurance, Retirement), Financial Planner AI-led definition and step-by-step usage for all 35+ calculators

### Modify
- Portfolio sub-header tab bar: apply same pill visual style as Goals filter chips (rounded pills with distinct colors, consistent hover/active states)
- Financial Planner CalculatorsTab: change category cards to match Learn Finance Rules category card theme (collapsible accordion cards with emoji, left-color-border, count badge, expand/collapse toggle; calculator items shown as rule-style cards inside)
- Goals: convert PieChart (achievementQuality, goalDiversification) to Donut charts (add innerRadius, show % label inside)
- Financial Model AssetAllocation: convert PieChart to Donut chart (add innerRadius)
- Any other Pie charts across the app: convert to Donut charts

### Remove
- Nothing removed

## Implementation Plan
1. In GoalsTab.tsx: change `<Pie>` for achievementQuality and goalDiversification to use innerRadius=40 outerRadius=75 (donut)
2. In FinancialModelingTab.tsx: change AssetAllocation `<Pie>` to donut with innerRadius=50
3. In PortfolioPage.tsx: update the asset-type tab bar pills to match Goals pill style
4. In CalculatorsTab.tsx: replace gradient CardHeader category layout with collapsible accordion-style category cards matching Learn Finance Rules theme (emoji per category, colored left border, count badge, expand/collapse)
5. In GrowfinfireChat.tsx: append extensive training blocks for Rules, Mistakes, Basics, Financial Model modules, and Financial Planner step-by-step guides
6. Scan DashboardPage.tsx and other files for any remaining PieCharts and convert to Donut
