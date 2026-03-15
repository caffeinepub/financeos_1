# FinanceOS

## Current State
The Financial Model module has 5 tabs: Asset Allocation (risk profiles + pie chart), Model Portfolio (growth/value/dividend/index strategies), Model Retirement (corpus calculator + growth chart), Model Insurance (life/health/term/critical illness calculators), and Model Crypto (risk-based crypto allocation). All tabs are functional with basic educational content.

## Requested Changes (Diff)

### Add
- New **Investment Fundamentals** tab (6th tab) covering 8 core learning concepts: Compound Interest interactive calculator + chart, Rule of 72, SIP vs Lump Sum comparison with chart, Market Cycles education, Inflation Impact calculator, Diversification Benefits, CAGR calculator, and P/E Ratio explained
- Educational "Learn" callout panels on each existing tab (Modern Portfolio Theory basics on Asset Allocation; Factor Investing concepts on Model Portfolio; 4% Rule / SWR explanation on Retirement; HLV method explanation on Insurance; DCA strategy education on Crypto)
- Historical returns data table (asset class CAGR by decade) on Asset Allocation tab
- Indian market model portfolio option (Nifty large-cap stocks) in Model Portfolio tab
- FIRE (Financial Independence Retire Early) number calculator on Retirement tab
- Glide-path visual progress bar on Retirement tab

### Modify
- FinancialModelingTab.tsx: add 6th tab trigger and content for Fundamentals
- ModelPortfolioTab.tsx: add India strategy option + educational rationale panel
- ModelRetirementTab.tsx: add FIRE number, richer education panel, SWR explanation
- ModelInsuranceTab.tsx: add HLV method card and needs-analysis framework callout
- ModelCryptoPortfolioTab.tsx: add DCA education and crypto market cycle callout

### Remove
- Nothing removed

## Implementation Plan
1. Create `ModelFundamentalsTab.tsx` with 8 interactive investor education concepts
2. Update `FinancialModelingTab.tsx` to add Fundamentals as tab 6
3. Enhance `ModelPortfolioTab.tsx` with India strategy and education panel
4. Enhance `ModelRetirementTab.tsx` with FIRE number and SWR education
5. Enhance `ModelInsuranceTab.tsx` with HLV method callout
6. Enhance `ModelCryptoPortfolioTab.tsx` with DCA and market cycle education
