import { Bot, Send, Sparkles, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  isTyping?: boolean;
};

const WELCOME_MESSAGE: Message = {
  id: 0,
  role: "assistant",
  text: "👋 Hi! I'm **Growfinfire**, your AI financial assistant. I can help you navigate all FinanceOS modules, answer financial questions, design portfolios, and guide your wealth-building journey.\n\nAsk me about any module, financial concept, calculator, investment strategy, or portfolio design!",
};

const SUGGESTED_PROMPTS = [
  "What is the 50/30/20 rule?",
  "What mistakes should I avoid?",
  "Explain the Rule of 72",
  "Design a portfolio for me",
  "How to plan for retirement?",
  "Explain mutual fund categories",
  "FIRE strategy explained",
  "How does Trade Journal work?",
];

// ─── Knowledge Base ───────────────────────────────────────────────────────────

function getAIResponse(message: string): string {
  const m = message.toLowerCase();

  // ── APP OVERVIEW ─────────────────────────────────────────────────────────────

  if (
    (m.includes("overview") && m.includes("app")) ||
    (m.includes("what") && m.includes("module"))
  ) {
    return "🏦 **Growfinfire Global — App Overview**\n\nA comprehensive finance app with 10 core modules:\n\n1. **Dashboard** — Financial command center with NAV, charts, Risk-o-meter, projections\n2. **Goals** — Track/plan financial goals with linked investments & SIP guidance\n3. **Portfolio** — 8 asset types: Equity, MF, Gold, Retiral, Real Estate, Bonds, FD, Crypto\n4. **Budgeting** — Plan Budget, Track Income/Expense, Budget Insights, Improve Budget\n5. **Financial Model** — 8 models: Asset Allocation, Goal Planning, Budget & Expense, Model Portfolio, Debt/Loan Management, Model Retirement, Insurance, Crypto\n6. **Financial Planner** — 35+ calculators across Investments, Loans, Savings, Retirement, Tax, Goals, FIRE\n7. **Learn Finance** — Rules, Basics (with Intelligent Investor models), 50 Mistakes, My Rules\n8. **Loans** — Loan Tracker (merged dashboard), Prepayment Simulator, Loan vs Invest, Affordability, Debt-Free Timeline, Debt Model\n9. **Trade Journal** — Trade Log, Dashboard, Journal & Review, Analytics with live market prices\n10. **Admin** — User management (admin-only)\n\n💡 Currency selection on the landing page persists across all modules — choose INR (Cr/L/K) or USD/GBP (B/M/K).";
  }

  // ── APP MODULES ──────────────────────────────────────────────────────────────

  if (m.includes("dashboard")) {
    return "📊 **Dashboard Module**\n\nYour financial command center. Sections include:\n• **NAV Cards** — Portfolio value across all 8 asset types (2 per row on mobile, values in Cr/L/K)\n• **Asset Allocation** — Donut chart breakdown by asset class with % inside\n• **Portfolio Risk-o-meter** — Semicircular gauge with 6 color bands (Low Risk green → Very High Risk red), needle points to risk level based on Equity+MF+Crypto allocation %\n• **Projected Net Worth Trend** — 10-year projection by asset class\n• **Assets vs Liabilities** — Circular bars with % values\n• **Debt-to-Income Ratio** — Monthly debt burden %\n• **Cash Flow Summary** — Income vs expenses overview\n• **Income vs Expense Trend** — Monthly trend chart\n• **Investment Categories** — Horizontal bar chart with Cr/L/K values\n• **Monthly Savings Rate (%)** — Bar chart with % inside each bar\n• **Goals Progress** — Top goals with status badges\n• **Budgeting (6 Months)** — Planned vs Actual comparison\n• **50/30/20 Budget Rule Analysis** — Needs/Wants/Savings breakdown\n\n**Risk-o-meter thresholds:**\n• ≤25% → Low Risk (Irish Green)\n• 26-34% → Low to Moderate (Chartreuse)\n• 35-44% → Moderate (Neon Yellow)\n• 45-59% → Moderately High (Caramel)\n• 60-74% → High Risk (Dark Orange)\n• ≥75% → Very High Risk (Red)";
  }

  if (
    m.includes("risk-o-meter") ||
    m.includes("riskometer") ||
    (m.includes("risk") && m.includes("meter"))
  ) {
    return "🎯 **Portfolio Risk-o-meter**\n\nA semicircular gauge on the Dashboard showing your portfolio's overall risk level.\n\n**How it works:**\nCalculates the combined allocation % of Equity (ETF/Stocks) + Mutual Funds + Crypto from your Portfolio module, then maps to one of 6 risk bands:\n\n• **Low Risk** 🟢 — Combined ≤ 25%\n• **Low to Moderate** 🟡 — 26–34%\n• **Moderate** 🟡 — 35–44%\n• **Moderately High** 🟠 — 45–59%\n• **High Risk** 🟠 — 60–74%\n• **Very High Risk** 🔴 — ≥ 75%\n\n**Gauge design:** 6 color bands from Irish Green (#08A04B) → Chartreuse → Neon Yellow → Caramel (#C68E17) → Dark Orange (#FF8C00) → Red (#F70D1A). A needle points to current risk level with a text label below.\n\n💡 Add more Equity/MF/Crypto holdings in Portfolio to see the needle move. Reduce risk by increasing Bonds, FD, or Gold allocation.";
  }

  if (
    m.includes("goal") &&
    !m.includes("fire") &&
    !m.includes("retirement goal")
  ) {
    return "🎯 **Goals Module**\n\n**Two tabs:**\n\n**1. Track Goals** (Card/Table view toggle)\n• Add goals: Name, Type, Target Amount, Target Date, Priority (1–5), Inflation Rate\n• Card view shows: Circular progress ring (right side), Target/Current/Need in row 1, Goal Date/Timeline/SIP per month in row 2, linked investment badges (3 shown + tooltip for more)\n• Status badges: On Track 🟢 / Need Attention 🟡 / Achieved ✅\n• Actions: Link Investments, Edit, Delete — stacked vertically beside ring\n• Mobile: 3 goals visible across screen\n\n**2. Plan Goals**\n• **Buy a House — Eligibility Planner** (6-rule AI model): Income, EMI, CIBIL, LTV, property cost, savings check\n• **Goal Planning Model** (same as Financial Model): 5 scenario cards — Single Goal: Buy a Car, Emergency Fund in 1 Year, Multiple Goals Simultaneously, Long-Term Wealth Creation, Retirement Corpus Goal\n\n**Summary cards:** Total Target, Current Savings, Amount Required (Target-Savings), Months to Deadline\n\n💡 Link your equity SIPs and EPF to goals for automatic current value tracking!";
  }

  if (
    (m.includes("portfolio") || m.includes("holding")) &&
    !m.includes("model portfolio")
  ) {
    return "💼 **Portfolio Module**\n\nTracks 8 asset types with full CRUD. Default view is **card view** with toggle to table.\n\n**Asset Types:**\n• **Retiral** — PPF, NPS, EPF, LIC, Pension, Gratuity, Superannuation\n• **Equity (ETF/Stocks)** — Large/Mid/Small Cap, Factor, Multi Cap\n• **Mutual Fund** — Large/Mid/Small/Flexi/Multi/Index/Debt/Hybrid/ELSS/Liquid/Balance Advantage\n• **Crypto** — Large/Mid/Small/Micro Cap, Stablecoin, Memecoin\n• **Commodity** — Gold, Silver, Platinum, Gold ETF, Silver ETF\n• **Real Estate** — Residential, Commercial, Land\n• **Fixed Income** — FD, Bonds, Post Office, Cash\n• **Other** — IPO, PMS, SIF, Startup, P2P Lending, Invoice Discounting\n\n**Card layout:** Name + Category badge | Allocation% + horizontal bar | Invested / Current / Gain/Loss in one row | Edit/Delete below bar\n\n**Overview Tab:** 4 summary cards (Total Invested, Current, Gain/Loss, Gain/Loss%) + Allocation% donut + Equity/MF cap distribution + 10-year forecast bar chart\n\n**Field logic:** Qty + Buy Price → Invested auto-fills; Qty + Market Price → Current Value auto-fills\n\n**Columns:** Invested, Current, Gain/Loss, Gain/Loss%, Allocation%\n\n💡 Add Holding button is in the Portfolio title row. Toggle (card/table) is just before Add Holding.";
  }

  if (m.includes("budget") && !m.includes("50/30") && !m.includes("50-30")) {
    return "💰 **Budgeting Module — 4 Tabs**\n\n**1. Plan Budget**\n• Add income/expense categories with planned amounts per month\n• Type auto-assigned: Needs (Housing, Food, Transport, Healthcare), Wants (Entertainment, Dining, Shopping), Savings (Investments, Emergency Fund)\n• Income rows: only 1 shown by default → 'Show more entries' to expand\n• Cards: Budgeted Income, Budgeted Expense, Expected Savings, Savings Rate\n\n**2. Track Income vs Expense**\n• Filter by Month and Year (default: current month)\n• Cards: Actual Income + Actual Expenses in one row (matches Plan Budget card size on mobile)\n• Buttons: All/Income/Expense/Add in the same row as cards (website view)\n• Type column shows Needs/Wants/Savings mapped from Plan Budget categories\n• Account field removed\n• Category dropdown: scrollable, shows only Income or Expense options by type\n\n**3. Budget Insights**\nCharts in order: Monthly Overview → 50/30/20 Analysis → Month-over-Month Trend → Monthly Budget Snapshot → Spending by Category → Top Spending Categories → Savings Rate Trend\n• Cards match Goals card theme (border-l-4 accent, bold values)\n• Savings and Savings Rate (%) cards included\n• Filter by Month and Year (All Months + All Years options available)\n\n**4. Improve Budget**\n• Uses Financial Model → Budgeting & Expense Tracking scenarios\n• Autofill from selected Month/Year in Track Income vs Expense\n• 4 scenario cards: consistent with Plan Budget Needs/Wants/Savings categories";
  }

  if (
    m.includes("financial model") ||
    (m.includes("model") &&
      (m.includes("tab") ||
        m.includes("module") ||
        m.includes("goal planning") ||
        m.includes("debt model")))
  ) {
    return "📚 **Financial Model Module — 8 Models**\n\nAll models use full-page scenario cards with 'Back to Menu' on expand.\n\n**1. Asset Allocation** — Risk profile (Conservative/Moderate/Aggressive) → Allocation breakdown with Planned vs Actual vs Variance. AI recommendations for portfolio improvement.\n\n**2. Goal Planning** (formerly Goal-Based Saving & Planning)\n5 scenarios: Single Goal, Emergency Fund in 1 Year, Multiple Goals, Long-Term Wealth, Retirement Corpus\n\n**3. Budgeting & Expense Tracking**\n50/30/20 rule applied to your income. 4 scenarios with autofill from Track Income & Expense data. Identifies top leakages, outputs monthly budget table.\n\n**4. Model Portfolio & Investments** — Conservative/Moderate/Aggressive MF+ETF sample portfolios\n\n**5. Loan Management & Repayment** (formerly Debt Management)\nAvalanche vs Snowball comparison. 6-month repayment roadmap. Debt freedom date calculator.\n\n**6. Model Retirement** — 25x rule, 4% SWR, age-based strategy\n\n**7. Model Insurance** — HLV term life sizing, health cover, critical illness planning\n\n**8. Model Crypto** — DCA strategy, 4-phase cycle, allocation limits by risk profile\n\n💡 All cards start collapsed for clean view. Single-open accordion — clicking one card collapses the previous.";
  }

  if (
    m.includes("financial planner") ||
    (m.includes("calculator") &&
      !m.includes("fire") &&
      !m.includes("goal planner"))
  ) {
    return "🔢 **Financial Planner — 35+ Calculators**\n\n**Investments (7):** SIP Planner (Step-Up), SWP Planner (Step-Up), Lump Sum, CAGR, MF Returns, Stock Returns, Goal-based Investment\n\n**Loans & EMI (7):** Home Loan EMI, Car Loan EMI, Personal Loan EMI, Amortization, Balance Transfer, Prepayment Impact, Loan Comparison\n\n**Savings & Deposits (8):** FD, RD, PPF Maturity, NPS Maturity, Emergency Fund, Debt-to-Income, Savings Growth, Senior Citizen Savings\n\n**Retirement (5):** FIRE Planner (FAT/Lean/Barista), Retirement Corpus, Pension Planning, Annuity Returns, Post-Retirement SWP\n\n**Tax Planning (4):** 80C Optimizer, 80D Health, LTCG/STCG Tax, Old vs New Tax Regime\n\n**Goal Planning (4):** Education Fund, Marriage Fund, House Down Payment, Vehicle Purchase\n\n**Special (included):** Buy a House Eligibility Planner (6-rule AI model, under Retirement & Goals section)\n\n💡 All results use the currency selected on the landing page (₹ for INR, $ for USD, £ for GBP). Single-open accordion — clicking a category expands it and closes the previous one. Use the search bar to find any calculator instantly.";
  }

  if (
    m.includes("fire") ||
    m.includes("financial independence") ||
    m.includes("fat fire") ||
    m.includes("lean fire") ||
    m.includes("barista fire")
  ) {
    return "🔥 **FIRE Planner — FAT, Lean & Barista FIRE**\n\n**FIRE = Financial Independence, Retire Early**\n\nOpen **Financial Planner → Retirement → FIRE Planner** for instant calculations (no Calculate button needed).\n\n**Three FIRE strategies:**\n\n🥩 **Fat FIRE** — Comfortable retirement with generous lifestyle\n• Corpus Multiplier: 33x annual expenses\n• Country multiplier adjusts for cost of living (India: lower, USA/UK: higher)\n• Includes inflation buffer and generous lifestyle expenses\n\n🥬 **Lean FIRE** — Minimalist retirement, frugal lifestyle\n• Corpus Multiplier: 20x annual expenses\n• Maximum savings rate, minimal lifestyle requirements\n• Best for: Early 30s retirees willing to optimize spending\n\n☕ **Barista FIRE** — Semi-retirement with part-time income\n• Corpus Multiplier: 15x annual expenses (part-time income covers the rest)\n• Part-time work: ₹15K-25K/month bridges the gap\n• Most realistic for most people\n\n**FIRE Inputs:** Annual expenses, Current savings, Annual savings rate, Expected return rate, Inflation rate, Country\n\n**FIRE Outputs:** FIRE number, Years to FIRE, Corpus projection chart, 40-year year-wise table, Feasibility score\n\n**Power of savings rate:**\n• Save 10% → FIRE in ~40 years\n• Save 25% → FIRE in ~30 years\n• Save 50% → FIRE in ~17 years\n• Save 75% → FIRE in ~7 years!";
  }

  if (
    m.includes("learn finance") ||
    m.includes("financial rules") ||
    (m.includes("rules") && m.includes("tab"))
  ) {
    return "🎓 **Learn Finance Module — 4 Tabs**\n\n**1. Rules** (First tab, default)\n• Filter from Beginner → Intermediate → Advanced → Expert\n• Categories are collapsible accordions; single-open (clicking one collapses previous)\n• Search expands matching cards automatically\n• Filter by level, number count on right side of each card\n\n**2. Basics**\n• 18 clickable cards: 8 core financial basics + 10 Intelligent Investor models\n• Expanded view shows full content in a full-page view with 'Back to Basics' link\n• Interactive calculators for applicable cards (Compounding, Rule of 72, SIP, Inflation, Savings Rate, etc.)\n\n**3. Learn from Mistakes** (50 Mistakes)\n• 50 common financial mistakes grouped by category with emojis\n• Each mapped to a rule/principle with navigation link\n• Clicking a Rule link auto-navigates and expands the associated Rule\n• Single-open accordion; all start collapsed\n• 2 cards per row for better fit\n\n**4. My Rules (AI Recommendations)**\n• Select risk profile: Conservative / Moderate / Aggressive\n• AI recommends 8 rules aligned to your profile with alignment score\n• One-click add to My Rules list\n• Saved rules display Condition and Action fields auto-populated from rule name/category\n\n💡 Learn from Mistakes links directly to Rules module — click any rule link to auto-expand that rule.";
  }

  if (
    m.includes("intelligent investor") ||
    (m.includes("graham") && (m.includes("model") || m.includes("investor")))
  ) {
    return "📖 **Intelligent Investor — 10 Core Models (Learn Finance → Basics)**\n\n**Benjamin Graham's foundational models used in modern investing:**\n\n1. **Margin of Safety** — Buy when Price ≤ ⅔ of intrinsic value. Used by Buffett, Seth Klarman, quantitative value funds.\n\n2. **Defensive Investor Portfolio Allocation** — 60/40 or 50/50 equity/bond glide-path. Basis of balanced target-date funds and robo-advisors.\n\n3. **Dollar-Cost Averaging (DCA)** — Automated monthly/quarterly investing. Foundation of SIP, 401(k), index-fund accumulation. \n\n4. **Mr. Market** — Behavioral model for contrarian investing. Market prices fluctuate irrationally; buy when fearful, sell when greedy.\n\n5. **NCAV Screen (Net-Net Working Capital)** — Buy when Price < Net Current Asset Value. Classic deep-value quant model used by Graham-style hedge funds.\n\n6. **Enterprising Investor Criteria** — Multi-factor: size + quality + value + momentum filters. Basis for systematic value strategies.\n\n7. **Intrinsic Value via Earnings Power** — EPV model (Bruce Greenwald) and Owner Earnings (Buffett). Value = sustainable earnings / cost of capital.\n\n8. **Diversification** — Risk-parity and multi-asset models. Root of index-fund diversification (Modern Portfolio Theory).\n\n9. **Investor Psychology & Emotional Discipline** — Behavioral portfolio theory. Systematic rebalancing overrides emotion. Used by all top quant/robo platforms.\n\n10. **Graham-and-Doddsville Superinvestor Model** — Empirical proof value investing works over decades. Inspired Buffett, Munger, Schloss, etc.\n\n💡 Each card in Learn Finance → Basics has an interactive calculator or formula tool.";
  }

  if (
    m.includes("loan") &&
    !m.includes("home loan") &&
    !m.includes("car loan") &&
    !m.includes("personal loan")
  ) {
    return "🏦 **Loans Module — 6 Tabs**\n\n**1. Loan Tracker** (merged Health Dashboard + Smart Tracker)\n• Add loans: Type (Home/Car/Personal/Education/Other), Outstanding Balance, EMI, Interest Rate, Tenure\n• Each card shows: Loan Health Score, Debt Burden %, Principal vs Interest split, EMI details\n• Overall summary row at top with total outstanding, total EMI, debt burden %\n• Edit / Delete on each card\n\n**2. Prepayment Impact Simulator**\n• Enter outstanding amount, EMI, interest rate, remaining tenure\n• Enter prepayment amount and frequency (one-time / monthly)\n• Output: Time saved, interest saved, new payoff date\n• Without Prepayment vs With Prepayment comparison\n\n**3. Loan vs Invest Dilemma**\n• AI recommendation: Should you prepay your loan or invest the surplus?\n• Compares: Loan interest rate vs expected investment return\n• Considers: Tax deduction on loan interest (home loan 24b), LTCG implications\n\n**4. Loan Affordability Check**\n• Safe borrowing limit based on income and existing EMIs\n• 40% EMI rule applied\n\n**5. Debt-Free Timeline**\n• Visual projection chart showing when you become debt-free\n• Scenarios: minimum payment, aggressive payment, extra lump sum\n\n**6. Debt Model** (same as Financial Model → Loan Management & Repayment)\n• Avalanche vs Snowball strategy comparison\n• 6-month repayment roadmap\n\n💡 Loan health color codes: Green (healthy DTI <36%), Amber (36-43%), Red (>43% — danger zone).";
  }

  if (
    m.includes("trade journal") ||
    (m.includes("trade") &&
      (m.includes("log") ||
        m.includes("journal") ||
        m.includes("p&l") ||
        m.includes("pnl")))
  ) {
    return "📈 **Trade Journal Module — 4 Tabs**\n\nDesigned for active traders with industry-standard dark navy trading terminal theme.\n\n**1. Dashboard**\n• Performance metrics: Win Rate, Total P&L, Profit Factor, Avg Win/Loss\n• Equity curve chart\n• Win/Loss donut charts with trade count inside\n• P&L by Strategy (top 6 max) and by Instrument (top 6 max) bar charts\n• Monthly Performance Heatmap (navigate prev/next months with arrows)\n• Scatter plot: P&L vs Trade Size\n\n**2. Trade Log**\n• Log trades: Ticker/Instrument, Strategy, Entry/Exit Price, Quantity, Direction (Long/Short), Market Condition\n• P&L auto-calculated\n• **Live Market Price for Open Trades:** Uses Yahoo Finance free API. Fetches live price every 30 seconds (only while Trade Journal tab is open). Shows Market Price for open/in-progress trades → auto-calculates running P&L\n• If no live data fetched: shows Buy Price as Market Price (marked as 'est.')\n• TradingView chart widget available when logging trades\n• Strategy and Market Condition are standard dropdowns\n\n**3. Journal & Review**\n• Pre-trade checklist (customizable)\n• Post-trade review with tags\n• Performance reflection notes\n\n**4. Analytics**\n• Pattern recognition\n• Session breakdown (morning/afternoon/evening)\n• Day-of-week performance analysis\n\n💡 For Indian stocks use NSE suffix: RELIANCE.NS, HDFC.NS. For US stocks: AAPL, MSFT. Live price fetches from Yahoo Finance free API and auto-refreshes every 30s.";
  }

  if (
    m.includes("live price") ||
    m.includes("live market") ||
    (m.includes("market price") && m.includes("trade"))
  ) {
    return "📡 **Trade Journal — Live Market Price**\n\n**How it works:**\n• Open trades (In Progress status) in Trade Journal automatically fetch live price\n• Uses Yahoo Finance free API to get current market price\n• Auto-refreshes every 30 seconds ONLY while you are on the Trade Journal module (stops when you navigate away to save resources)\n• Running P&L is auto-calculated: (Market Price - Entry Price) × Quantity × Direction\n\n**If no live data available:**\n• Market Price shows Entry/Buy Price with '(est.)' label\n• P&L shows 0 or estimated value\n• Usually happens for: unlisted tickers, weekends/market holidays, invalid ticker format\n\n**Ticker format:**\n• Indian NSE stocks: RELIANCE.NS, TCS.NS, INFY.NS, HDFC.NS\n• BSE stocks: RELIANCE.BO\n• US stocks: AAPL, MSFT, NVDA\n• Crypto: BTC-USD, ETH-USD\n• Indices: ^NSEI (Nifty 50), ^BSESN (Sensex)\n\n💡 Enter the correct ticker format when logging the trade for live price to work correctly.";
  }

  // ── FINANCIAL PLANNER CALCULATORS (Deep Dives) ──────────────────────────────

  if (m.includes("sip") && !m.includes("swp")) {
    return "📈 **SIP Calculator & Strategy**\n\n**How SIP works:** Invest a fixed amount monthly. Units bought at lower NAV when markets fall (Rupee Cost Averaging).\n\n**SIP with Step-Up (in Financial Planner):**\nIncrease SIP by a fixed % annually. Example:\n• ₹10K/month SIP for 20 years at 12% = ₹98L\n• ₹10K/month with 10% annual step-up = ₹1.9 Crore!\n\n**Power numbers:**\n• ₹5K/month × 12% × 20 years = ₹50L\n• ₹10K/month × 12% × 20 years = ₹1 Crore\n• ₹20K/month × 12% × 20 years = ₹2 Crore\n\n**Best SIP strategies:**\n1. Start as early as possible\n2. Increase SIP every April (salary hike time)\n3. Never stop SIP during market crashes – buy more units!\n4. Use **SIP Planner** in Financial Planner to model step-up scenarios.";
  }

  if (m.includes("swp") || m.includes("systematic withdrawal")) {
    return "💸 **SWP – Systematic Withdrawal Plan**\n\nSWP lets you withdraw a fixed amount from your mutual fund corpus every month – essentially a self-made pension.\n\n**How to use SWP Planner (Financial Planner):**\n1. Enter your corpus amount\n2. Set monthly withdrawal amount\n3. Set expected return rate (8-12% for balanced funds)\n4. Choose Step-Up % to increase withdrawals annually (for inflation)\n5. See how long corpus lasts\n\n**Safe Withdrawal Rate:**\n• 4% annual withdrawal = corpus lasts forever theoretically\n• For 30-year retirement on ₹1 Crore: withdraw ₹4L/year = ₹33K/month\n\n**Best funds for SWP:** Balanced Advantage Funds, Equity Savings Funds\n\n💡 Combine SWP with NPS annuity and PPF withdrawals for a diversified retirement income.";
  }

  if (m.includes("ppf")) {
    return "🏛️ **PPF (Public Provident Fund)**\n\n• **Returns:** 7.1% p.a. (government-set, tax-free)\n• **Tax status:** EEE – Exempt on contribution (80C), Exempt on interest, Exempt on maturity\n• **Lock-in:** 15 years (partial withdrawal from year 7)\n• **Annual limit:** ₹1.5 Lakh (qualifies for 80C)\n• **Risk:** Zero (government-backed)\n\n**Optimal strategy:** Invest ₹1.5L on April 1st every year to maximize interest for that year.\n\n**PPF Maturity Calculator** in Financial Planner:\n• ₹1.5L/year × 15 years at 7.1% = ~₹40.7 Lakhs\n• Extend in 5-year blocks after 15 years for compounding power\n\n**Compare:** PPF gives guaranteed 7.1% tax-free vs FD at 7% but fully taxable (effective ~5% for 30% slab).\n\nTrack PPF in **Portfolio → Retiral** module.";
  }

  if (m.includes("nps")) {
    return "🎯 **NPS (National Pension System)**\n\n• **Returns:** 9-11% historically (equity-heavy allocation)\n• **Tax benefits:** ₹1.5L u/s 80C + ₹50K additional u/s 80CCD(1B) = total ₹2L deduction\n• **Withdrawal:** 60% lump sum (tax-free) + 40% mandatory annuity at age 60\n• **Lock-in:** Until age 60\n\n**Tier 1 vs Tier 2:**\n• Tier 1 = retirement account (locked), tax benefits\n• Tier 2 = flexible savings (withdraw anytime, no tax benefit)\n\n**Asset allocation:**\n• **Auto choice (Lifecycle Fund):** Reduces equity automatically by age\n• **Active choice:** Up to 75% equity until age 50, then reduces\n\nTrack NPS in **Portfolio → Retiral** module. Use **NPS Calculator** in Financial Planner for maturity projections.";
  }

  if (m.includes("epf") || m.includes("provident fund")) {
    return "💼 **EPF (Employee Provident Fund)**\n\n• **Contribution:** 12% of basic salary (employee) + 12% (employer – split into 8.33% EPS + 3.67% EPF)\n• **Interest:** 8.15% p.a. (2023-24), compounded annually\n• **Withdrawal:** Tax-free after 5 years of continuous service\n\n**VPF (Voluntary PF):** Contribute beyond 12% at same 8.15% rate. Best guaranteed-return debt instrument after PPF.\n\n**DCA connection:** EPF is automatic Dollar-Cost Averaging (DCA) — monthly contributions buy units regardless of market conditions (as taught in Intelligent Investor model in Learn Finance → Basics).\n\nTrack EPF in **Portfolio → Retiral** to include in net worth. Use EPF Corpus Calculator in **Financial Planner → Savings**.";
  }

  if (m.includes("fd") || m.includes("fixed deposit")) {
    return "🏦 **Fixed Deposit (FD)**\n\n**FD Calculator** in Financial Planner → Savings & Deposits:\n• Simple and compound interest options\n• Quarterly/monthly/annual compounding\n• TDS deduction calculation\n\n**Current FD rates (2024):** SBI ~7%, HDFC ~7%, Small Finance Banks up to 9%\n\n**Pros:** Capital safety (up to ₹5L insured by DICGC), predictable returns\n**Cons:** Taxable as income (at your slab rate), barely beats inflation after tax\n\nTrack FDs in **Portfolio → Fixed Income** module.";
  }

  if (m.includes("compounding") || m.includes("compound interest")) {
    return "🚀 **Power of Compounding**\n\nEinstein called it the 8th wonder of the world!\n\n**The magic of time:**\n• ₹1L at 12% for 10 years = ₹3.1L (3x)\n• ₹1L at 12% for 20 years = ₹9.6L (9.6x)\n• ₹1L at 12% for 30 years = ₹29.9L (nearly 30x!)\n\n**Starting early vs starting late:**\n• Start at 25 with ₹5K/month → ₹3.5 Crore at 60 (12% return)\n• Start at 35 with ₹10K/month → ₹1 Crore at 60 (12% return)\n• Starting early and investing HALF monthly amount beats starting late with double!\n\nExplore this interactively with the calculator in **Learn Finance → Basics → Power of Compounding** card.";
  }

  if (m.includes("rule of 72")) {
    return "⚡ **Rule of 72 – Quick Doubling Time**\n\n**Formula:** 72 ÷ Return Rate = Years to double your money\n\n**Practical table:**\n| Return | Doubles In |\n|--------|------------|\n| 6% (FD) | 12 years |\n| 8% (Hybrid) | 9 years |\n| 10% (Gold) | 7.2 years |\n| 12% (Nifty) | 6 years |\n| 15% (Mid Cap) | 4.8 years |\n| 36% (Credit Card) | 2 years! |\n\n**Key insights:**\n• Inflation at 6% halves your money's purchasing power in 12 years\n• Credit card debt at 36% DOUBLES your liability in 2 years – pay it off first!\n• Nifty 50 at 12% doubles money every 6 years\n\nTry the **Rule of 72 Calculator** in Learn Finance → Basics tab.";
  }

  if (
    m.includes("50-30-20") ||
    m.includes("50 30 20") ||
    m.includes("50/30/20") ||
    m.includes("needs wants savings")
  ) {
    return "📊 **50/30/20 Budget Rule**\n\n**The Rule:**\n• **50% Needs** — Housing, Food, Transport, Utilities, Healthcare, Insurance, Minimum debt payments\n• **30% Wants** — Entertainment, Dining, Subscriptions, Hobbies, Shopping, Vacations\n• **20% Savings** — Emergency fund, Investments (SIP, PPF, NPS), Extra debt repayment\n\n**How to apply in Growfinfire:**\n1. Go to **Budgeting → Plan Budget** — Type column auto-assigns Needs/Wants/Savings per category\n2. Override if needed for your situation\n3. Go to **Budgeting → Budget Insights** → See **50/30/20 Budget Rule Analysis** chart showing your actual vs ideal split\n4. Also visible on the **Dashboard** as a chart\n\n**India-specific adjustments:**\n• High rent cities (Mumbai, Bangalore): Needs may naturally be 55-60% — that's okay\n• If saving < 20%: Reduce Wants first\n• Aggressive savers: 50/20/30 (flip Wants/Savings) is ideal\n\n**Improve Budget tab:** Uses this model with your actual Track Income & Expense data. Autofill from any Month/Year to analyze spending patterns instantly.";
  }

  if (
    m.includes("80c") ||
    m.includes("section 80") ||
    m.includes("tax saving") ||
    m.includes("tax plan")
  ) {
    return "💸 **Tax Planning – Section 80C & Beyond**\n\n**Section 80C (₹1.5L limit):**\n• ELSS MF (3-year lock-in, market returns) – best for wealth creation\n• PPF (15 years, 7.1%, EEE) – best for guaranteed returns\n• EPF employee contribution (auto-deducted)\n• NPS Tier 1 (included in 80C)\n• LIC premium, 5-year FD, NSC, SCSS\n\n**Section 80D (Health Insurance):**\n• ₹25K for self/family + ₹25K for parents (< 60 years)\n• ₹50K for parents (60+ years) – total up to ₹75K deduction\n\n**Section 80CCD(1B):** Additional ₹50K for NPS Tier 1\n\n**Capital Gains:**\n• LTCG Equity (held > 1 year): 10% on gains > ₹1L/year\n• STCG Equity (held < 1 year): 15%\n• Debt MF: As per income slab\n\n**Old vs New Tax Regime Calculator** in Financial Planner:\n• Old regime better if total deductions > ₹3.75L (for ₹15L+ income)\n\n💡 Results section uses your selected currency symbol dynamically.";
  }

  if (
    m.includes("home loan") ||
    m.includes("house loan") ||
    m.includes("mortgage")
  ) {
    return "🏠 **Home Loan Planning**\n\n**Home Loan EMI Calculator** in Financial Planner:\nEMI = P × r × (1+r)^n / ((1+r)^n – 1)\n\nExample: ₹50L loan, 8.5% for 20 years → EMI = ₹43,391\nTotal interest paid = ₹54.1L (more than principal!)\n\n**Key rules:**\n• EMI should not exceed 30-35% of take-home salary\n• Pay 20% down payment to avoid PMI and get lower rates\n• Every ₹1L prepayment in year 1 saves ~₹3-4L in interest\n\n**Tax benefits:**\n• Principal repayment: 80C (up to ₹1.5L)\n• Interest: Section 24b (up to ₹2L for self-occupied)\n\n**Buy a House — Eligibility Planner** in Financial Planner → Retirement & Goals:\n6 AI rules: Income adequacy, EMI-to-income ratio, CIBIL score, LTV ratio, Property cost vs savings, Emergency fund check.\n\n**Also in Loans module:** Prepayment Impact Simulator shows exactly how much interest you save with any prepayment amount.";
  }

  if (m.includes("emergency fund")) {
    return "🆘 **Emergency Fund**\n\n**Target:** 6 months of total monthly expenses (not income)\n\n**Emergency Fund Planner** in Financial Planner → Savings & Deposits:\n• Enter monthly expenses → get exact target amount\n• Set monthly savings toward emergency fund\n• See months to build full emergency fund\n\n**Where to keep it:**\n✅ Liquid Mutual Fund (best: 7-7.5% return, redeemable in 1 day)\n✅ Savings account (low return but instant access)\n✅ Short-term FD (sweep-in FD for automatic transfer)\n❌ Equity mutual funds (too volatile)\n❌ Physical gold (takes time to sell)\n\n**Build it in this order:**\n1. ₹1L emergency fund immediately (1-month buffer)\n2. Build to 3 months over 6 months\n3. Reach 6-month target within 1-2 years\n4. After that, redirect savings to wealth creation\n\n💡 Track Emergency Fund goal in the **Goals module** and link your liquid MF holding.";
  }

  if (
    m.includes("asset allocation") &&
    (m.includes("model") ||
      m.includes("conservative") ||
      m.includes("moderate") ||
      m.includes("aggressive"))
  ) {
    return "📊 **Financial Model — Asset Allocation**\n\nThree risk profiles with exact allocation targets and Planned vs Actual vs Variance tracking:\n\n🔵 **Conservative Profile** (6-8% expected return)\n• 20% Equity (ETF/Stocks) | 15% Mutual Funds | 15% Gold/Commodity\n• 5% Silver | 30% Bonds/Fixed Income | 10% Retiral (30% conservative) | 5% FD\n→ Best for: Capital preservation, retirees, risk-averse investors\n\n🟡 **Moderate Profile** (10-12% expected return)\n• 35% Equity | 25% Mutual Funds | 10% Gold | 5% Silver | 5% Crypto\n• 15% Bonds | 20% Retiral | 5% FD\n→ Best for: Balanced growth, 5-10 year horizon\n\n🔴 **Aggressive Profile** (14-18% expected return)\n• 45% Equity | 30% Mutual Funds | 5% Gold | 3% Silver | 10% Crypto\n• 3% Bonds | 10% Retiral | 2% FD\n→ Best for: Long-term wealth creation (10+ years)\n\n**Planned vs Actual vs Variance table:**\n• If no Portfolio entries: Actual shows 0% for all\n• AI recommendations for portfolio improvement based on variance\n\n💡 Open **Financial Model → Asset Allocation**, select risk profile and see your actual vs model allocation with AI recommendations!";
  }

  if (m.includes("prepayment") || m.includes("loan prepay")) {
    return "💰 **Prepayment Impact Simulator (Loans Module)**\n\n**How to use:**\n1. Go to **Loans → Prepayment** tab\n2. Enter: Outstanding loan amount, EMI, Annual interest rate, Remaining tenure (months)\n3. Enter prepayment: Amount and frequency (one-time or monthly extra payment)\n4. Results show automatically\n\n**Output:**\n• Without Prepayment: Correct remaining tenure, total interest, payoff date\n• With Prepayment: Reduced tenure, total interest saved, new payoff date\n• Savings: Time saved (months/years) + Total interest saved\n\n**Example:**\nOutstanding: ₹40L, EMI: ₹35K, Rate: 8.5%, Remaining: 18 years\nPrepay ₹5L one-time:\n→ Saves ~3.5 years of payments + ~₹8.5L in interest\n\n**The rule:** Prepay in early years for maximum impact. In year 1, almost all EMI is interest — so prepaying ₹1L early = saving ₹3-4L later.\n\n💡 Also use Loan vs Invest tab to decide whether prepaying beats investing the surplus.";
  }

  if (
    m.includes("debt management") ||
    m.includes("avalanche") ||
    m.includes("snowball")
  ) {
    return "💳 **Debt Management & Repayment (Loans → Debt Model)**\n\nSame model as Financial Model → Loan Management & Repayment.\n\n**Two strategies compared:**\n\n**Avalanche Method (Mathematically Optimal):**\n1. List all debts by interest rate, highest first\n2. Pay minimums on all debts\n3. Put all extra money toward HIGHEST interest debt\n4. Roll payment to next highest when paid off\n\n**Snowball Method (Motivational):**\n1. List debts by balance, smallest first\n2. Pay off smallest debt first (quick wins)\n3. Roll freed payment to next debt\n\n**6-Month Repayment Roadmap:** Month-by-month breakdown of which debt to attack\n**Debt Freedom Date:** Projected date when you'll be completely debt-free\n\n**Priority order:**\n1. Credit card (36-40%) — immediate\n2. Personal loans (12-20%)\n3. Car loans (8-12%)\n4. Home loan (8-9%) — consider tax benefit before prepaying\n\n**40% EMI Rule:** Total all EMIs must never exceed 40% of take-home pay.";
  }

  if (
    m.includes("common mistake") ||
    m.includes("financial mistake") ||
    m.includes("50 mistake") ||
    m.includes("money mistake") ||
    m.includes("learn from mistake")
  ) {
    return "⚠️ **50 Common Financial Mistakes (Learn Finance → Learn from Mistakes)**\n\n**Spending & Budgeting:**\n1. Not tracking expenses 2. Underestimating outflows 6. Lifestyle on EMIs 15. Lifestyle inflation 28. Impulse spending\n\n**Emergency & Protection:**\n4. No emergency fund 8. Insurance only for tax saving 12. No health/term insurance\n\n**Investment Mistakes:**\n5. F&O and crypto speculation 17. Delaying investments 18. Ignoring inflation 19. Not diversifying 20. Following tips/tips 22. Over-relying on conservative investments 33. Waiting for perfect time 34. Not automating savings 38. Overexposure to real estate 40. Not rebalancing\n\n**Debt Mistakes:**\n3. Multiple overlapping loans 16. Minimum credit card payments 23. Not reviewing credit score 24. Unnecessary debt 25. Too many credit cards 30. Cosigning loans 41. Borrowing from future self\n\n**Retirement & Planning:**\n21. No retirement planning 26. Not claiming tax benefits 35. Spending windfalls carelessly 42. No SMART goals 45. Not tracking net worth 47. Not updating nominees\n\n💡 Each mistake in Learn Finance is mapped to a specific financial rule — click the rule link to auto-navigate and expand it in the Rules tab.";
  }

  if (
    m.includes("currency") ||
    m.includes("inr") ||
    m.includes("usd") ||
    m.includes("cr/l/k") ||
    m.includes("formatting")
  ) {
    return "💱 **Currency & Number Formatting**\n\nCurrency selection on the **Landing Page** persists across all modules and sessions.\n\n**Available currencies:** INR (India), USD (United States), GBP (United Kingdom), and others\n\n**Number formatting:**\n• **INR (₹):** Values shown in Cr (Crore), L (Lakh), K (Thousands)\n  Example: ₹1,50,00,000 → ₹1.50 Cr\n• **USD ($) / GBP (£):** Values shown in B (Billion), M (Million), K (Thousands)\n  Example: $1,500,000 → $1.50 M\n\n**Where it applies:**\n• All Dashboard charts and cards\n• Portfolio summary cards and 10-year forecast\n• Goals — Target, Current, Need, SIP values\n• Budgeting — all planned/actual values\n• All 35+ Financial Planner calculators (result sections)\n• Loans — EMI, outstanding amounts\n• Trade Journal — P&L values\n\n💡 Change currency at any time from the Landing Page dropdown. The selection is saved in localStorage and applies globally.";
  }

  if (
    m.includes("navigation") ||
    m.includes("sidebar") ||
    m.includes("mobile menu") ||
    m.includes("portfolio menu")
  ) {
    return "🗺️ **Navigation & Sidebar**\n\n**Desktop/Website View:**\n• Left sidebar with all main modules and submenus\n• Portfolio menu: Click → Overview auto-selected, submenus expand\n• Click Portfolio again → submenus collapse\n• Click any other main menu → Portfolio submenus collapse\n\n**Mobile View:**\n• Hamburger (☰) button at top-left to collapse/expand sidebar\n• When sidebar is collapsed: all main menu items appear as a **horizontally-scrollable bar at the top** of the screen\n• Submenu headers in Portfolio, Goals, Budgeting etc. are draggable on mobile\n\n**Portfolio navigation flow:**\n• Outside Portfolio → click Portfolio → Overview loads, submenus expand\n• On Portfolio (expanded) → click Portfolio label → submenus collapse\n• On Portfolio (collapsed) → click Portfolio label → submenus expand\n• On any other module → Portfolio auto-collapses\n\n**Theme toggle:** Dark/Light mode toggle in the header. Persists via localStorage.";
  }

  if (m.includes("admin") || m.includes("admin panel")) {
    return "👑 **Admin Module**\n\n**How Admin is assigned:**\n• `bootstrapAdmin()` auto-assigns the first user who logs in as Admin\n• Admin icon appears in the header for the admin user only\n\n**Admin capabilities:**\n• View all registered users\n• Suspend / Unsuspend users\n• Access Admin page from the header icon\n\n**If admin icon is not showing:**\n• First, verify you were the first user to log in to this app instance\n• If another account logged in first, that account holds admin\n• Contact support to reset admin assignment if needed\n\n**Note:** A fallback hardcoded Principal ID can be set for the admin as a permanent override. Share your Caffeine Principal ID to enable this.";
  }

  // ── LEARN FINANCE: 8 BASICS ─────────────────────────────────────────────────
  if (
    m.includes("basic") ||
    m.includes("budgeting basic") ||
    m.includes("learn finance basic")
  ) {
    return "📚 **Learn Finance — Basics (18 Cards)**\n\n**8 Core Financial Basics (with interactive calculators):**\n1. **Budgeting** — Zero-based budgeting, 50/30/20 rule\n2. **Emergency Fund** — 3-6 months expenses calculator\n3. **Insurance** — Term life + health cover sizing\n4. **Debt Management** — Avalanche vs Snowball calculator\n5. **Investing Basics** — SIP vs Lump sum, Rule of 72 calculator\n6. **Asset Allocation** — Risk profile allocation tool\n7. **Tax Planning** — 80C, 80D, Old vs New regime\n8. **Retirement Planning** — 25x rule, corpus calculator\n\n**10 Intelligent Investor Models (Benjamin Graham):**\n9. Margin of Safety | 10. Defensive Investor Portfolio\n11. Dollar-Cost Averaging (DCA) | 12. Mr. Market\n13. NCAV Screen | 14. Enterprising Investor Criteria\n15. Intrinsic Value via Earnings Power | 16. Diversification\n17. Investor Psychology & Discipline | 18. Graham-and-Doddsville Model\n\n💡 Each card opens in a full-page view (sidebar and header visible). Click 'Back to Basics' to return to all cards.";
  }

  // ── FINANCIAL MODEL: DETAILED ────────────────────────────────────────────────
  if (
    m.includes("goal planning") ||
    m.includes("goal based saving") ||
    (m.includes("goal") && m.includes("scenario"))
  ) {
    return "🎯 **Financial Model — Goal Planning Model**\n\n5 scenario cards, each opens as a full-page view with 'Back to Menu':\n\n**1. Single Goal: Buy a Car**\nTimeline: 3 years | Monthly SIP: ₹12,500 | Goal: ₹5L\nInstruments: Debt MF (60%) + Hybrid MF (40%)\n\n**2. Emergency Fund in 1 Year**\nTimeline: 12 months | Target: 6x monthly expenses\nInstrument: Liquid MF (100%) — capital safety priority\n\n**3. Multiple Goals Simultaneously**\nPriority matrix: Emergency Fund (Immediate) > Down Payment (3yr) > Education (10yr) > Retirement (25yr)\nSIP allocation across all goals\n\n**4. Long-Term Wealth Creation (10+ Years)**\nEquity-heavy portfolio, SIP + Step-Up strategy\nNifty 50 + Mid Cap + International ETF mix\n\n**5. Retirement Corpus Goal**\n25x annual expenses rule, 4% SWR\nNPS + EPF + Equity MF combination\n\n💡 This model is also used in Goals → Plan Goals tab, and in Financial Model → Goal Planning section.";
  }

  if (
    m.includes("budgeting model") ||
    m.includes("budget model") ||
    m.includes("improve budget") ||
    (m.includes("budget") && m.includes("scenario"))
  ) {
    return "💰 **Financial Model — Budgeting & Expense Tracking**\n\nSame scenarios as Budgeting → Improve Budget tab. 4 scenario cards:\n\n**1. Fresh Graduate: First Budget**\n• Income: ₹50,000/month | Categories: Rent, Food, Transport, EMI, SIP\n• 50/30/20 applied: ₹25K Needs / ₹15K Wants / ₹10K Savings\n• Quick win: Reduce dining out by ₹3K → invest in liquid fund\n\n**2. Salaried Professional: Optimize Spending**\n• Income: ₹1,20,000/month | Multiple expense categories\n• Identifies top 3 leakages, reallocates to savings\n• Savings rate improved from 12% to 22%\n\n**3. Small Business Owner: Irregular Income**\n• Average income with variance | Fixed vs variable expenses\n• Emergency fund priority, lean months strategy\n\n**4. Family Budget: Dual Income**\n• Combined household income | Joint expenses + individual allocations\n• Education fund, EMIs, household expenses modeled\n\n**Autofill Feature:** In Improve Budget tab, select Month/Year from dropdown to auto-populate income and expense values from Track Income & Expense module for real-world analysis.";
  }

  // ── FINANCIAL RULES KNOWLEDGE BASE ──────────────────────────────────────────

  if (
    m.includes("80/20") ||
    m.includes("80 20 rule") ||
    (m.includes("savings rule") && m.includes("percent"))
  ) {
    return "💰 **80/20 Savings Rule**\n\nSave 20% of your income, live on 80%. The simplest and most effective savings rule.\n\n**Formula:** Savings = Income × 20%\n\n**How to apply:**\n• Set up automatic transfer of 20% to savings on payday (Pay Yourself First)\n• Treat savings as a non-negotiable bill, not 'what's left'\n• Even ₹5K/month at 12% return for 20 years = ₹50 Lakhs\n\n**Variants:** 70/20/10 (70% expenses, 20% savings, 10% giving/debt) or 60/40 (60% fixed, 40% flexible)\n\n💡 Go to Budgeting → Plan Budget to set up your budget with this rule. Budget Insights will show your actual savings rate vs the 20% target.";
  }

  if (
    m.includes("70/20/10") ||
    m.includes("70 20 10") ||
    m.includes("giving rule")
  ) {
    return "📊 **70/20/10 Rule**\n\n70% of income for living expenses, 20% for savings/investments, 10% for charity or extra debt repayment.\n\n**Why it works:**\n• Forces you to allocate income across all three zones\n• 10% giving/debt zone prevents debt accumulation while building habits\n• 20% savings is the wealth creation engine\n\n**Compared to 50/30/20:** The 70/20/10 rule is slightly more lenient on needs (70% vs 50%) — better for high-cost cities like Mumbai/Bangalore where housing and transport eat more income.\n\n💡 Use Budgeting → Plan Budget to allocate your income across these three zones.";
  }

  if (
    m.includes("24-hour") ||
    m.includes("24 hour rule") ||
    m.includes("impulse buy") ||
    (m.includes("wait") && m.includes("purchase"))
  ) {
    return "⏰ **24-Hour Rule (Impulse Control)**\n\nWait 24 hours before making any non-essential purchase. 30 days for major purchases over ₹10,000.\n\n**Why it works:**\n• Emotional spending happens in the first 10 minutes\n• 80% of impulse buy desires disappear after 24 hours\n• Helps distinguish wants from needs\n\n**How to apply:**\n• Add items to cart but don't check out — come back next day\n• For big purchases: write it on a '30-day wishlist'\n• Ask: 'Will this matter in 5 years?'\n\n**Mapped to mistake:** Emotional spending / impulse buys (Mistake #28) is one of the top wealth destroyers, especially with UPI and 1-click buying.";
  }

  if (
    m.includes("lifestyle creep") ||
    m.includes("lifestyle inflation") ||
    (m.includes("1 percent rule") && m.includes("lifestyle"))
  ) {
    return "📈 **1% Lifestyle Rule (Preventing Lifestyle Creep)**\n\nWhen income rises, increase spending by only 1% — invest/save the rest.\n\n**The problem:** Most people increase spending proportionally with income. 20% salary raise → 20% more spending. Savings rate stays flat.\n\n**The solution:**\n• Salary increased by ₹20,000/month? Increase spending by ₹200 (1%), save ₹19,800\n• Each raise accelerates wealth building exponentially\n• Habits of spending at current income level, not future income level\n\n**Classic trap:** EMIs for lifestyle upgrades (new car, bigger house) lock in the 'new normal' permanently. Avoid.\n\n💡 Review your savings rate annually in Budgeting → Budget Insights → Savings Rate Trend chart.";
  }

  if (
    m.includes("pay yourself first") ||
    (m.includes("automate") && m.includes("savings")) ||
    m.includes("automatic savings")
  ) {
    return "🤖 **Pay Yourself First Rule**\n\nOn payday, the first transaction should be to your savings/investment account — before you spend anything else.\n\n**Why it works:**\n• Human psychology: available money gets spent\n• Automation removes the willpower requirement\n• 'Save what's left' always leaves nothing\n\n**Implementation:**\n1. Set standing instruction: transfer 20% to savings account on 1st of month\n2. Set SIP auto-debit on 1st/5th (after salary credit)\n3. Treat savings transfer as non-negotiable like rent/EMI\n\n**Growfinfire application:** Use Budgeting → Plan Budget to set target savings amounts. Track via Budget Insights to see if you're hitting the target each month.\n\n💡 Related mistake: Not automating savings (Mistake #34) — the single fix that compounds into crores over a career.";
  }

  if (
    m.includes("25x rule") ||
    (m.includes("retirement") && m.includes("corpus") && !m.includes("plan")) ||
    m.includes("retirement number")
  ) {
    return "🎯 **25x Retirement Rule**\n\nYour retirement corpus should be 25 times your annual expenses.\n\n**Formula:** Retirement Corpus = Annual Expenses × 25\n\n**Example:**\n• Need ₹10L/year in retirement → target ₹2.5 Crore\n• Need ₹20L/year → target ₹5 Crore\n\n**Why 25x?** Based on the 4% Safe Withdrawal Rate (SWR):\n• Withdraw 4% per year from corpus\n• Historically survives 30+ years in 95% of scenarios\n• Adjust for inflation annually\n\n**Indian context:**\n• Use 3–3.5% SWR (₹28–33x corpus) for higher Indian inflation\n• EPF + NPS + equity SIPs should combine to reach this target\n\n**Tools:** Financial Planner → Retirement → FIRE Planner for detailed projections. Financial Model → Model Retirement for strategy scenarios.\n\n💡 Start with your target: if you need ₹1L/month at retirement, you need ₹3 Crore (25x × ₹12L/year).";
  }

  if (
    m.includes("housing 30") ||
    (m.includes("housing") && m.includes("income") && m.includes("rule")) ||
    (m.includes("rent") && m.includes("30%")) ||
    (m.includes("emi") && m.includes("30%") && m.includes("income"))
  ) {
    return "🏠 **Housing 30% Rule**\n\nTotal housing costs (rent/EMI + utilities + maintenance) should not exceed 30% of gross monthly income.\n\n**Why it matters:**\n• Exceeding 30% creates 'house-poor' status — adequate home, inadequate savings\n• Leaves room for goals: retirement, children's education, emergency fund\n• Industry standard used by banks for loan eligibility (though they allow up to 40%)\n\n**Example:**\n• Gross income ₹1L/month → max housing ₹30,000\n• Includes EMI + property tax + maintenance + insurance\n\n**High-cost city adjustment:**\n• Mumbai/Bangalore: Housing may naturally be 35–40% for mid-income earners\n• If >30%: prioritize salary growth, consider cheaper areas, or delay home purchase\n\n💡 Related mistake #9: Buying home too early (20s/early 30s) — rent + invest first strategy often builds more wealth before age 35.";
  }

  if (
    m.includes("emergency fund rule") ||
    (m.includes("3") &&
      m.includes("6") &&
      m.includes("month") &&
      m.includes("expense")) ||
    (m.includes("liquid") && m.includes("savings") && m.includes("emergency"))
  ) {
    return "🆘 **Emergency Fund Rule**\n\nBuild 3–6 months of total monthly expenses in liquid savings before any other financial goal.\n\n**Why first?** Without this buffer, any unexpected event (job loss, medical, car repair) forces:\n• Breaking long-term investments at a loss\n• Taking personal loans at 15–20% interest\n• Credit card debt at 35–40% interest\n\n**Build in phases:**\n1. ₹50K–1L immediately (1-month rough buffer)\n2. 3 months within 6 months\n3. Full 6 months within 12–18 months\n\n**Where to keep it:**\n✅ Liquid Mutual Fund (7–7.5% return, T+1 redemption) — best\n✅ Savings account (3.5–4%, instant access)\n✅ Sweep-in FD (auto-sweep between savings + FD)\n❌ Equity MF (too volatile, bad time to sell)\n\n**Calculator:** Financial Planner → Savings → Emergency Fund Calculator\n\n💡 Related mistake #4: 46% of Indian households have less than 1 month emergency fund — the most dangerous financial vulnerability.";
  }

  if (
    m.includes("rebalance") ||
    (m.includes("annual") && m.includes("portfolio") && m.includes("review"))
  ) {
    return "⚖️ **Rebalance Annually Rule**\n\nReview and rebalance your portfolio once a year to maintain target asset allocation.\n\n**Why rebalancing is critical:**\n• Bull market: equity grows from 70% to 85% of portfolio → you're taking more risk than intended\n• Bear market: equity shrinks to 55% → you're missing growth opportunity\n• Rebalancing = buy what's cheap, sell what's expensive — enforces 'buy low, sell high'\n\n**When to rebalance:**\n• Best: March–April (before new financial year starts)\n• Tax-efficient: Use new SIP money to buy underweight assets first\n• Trigger-based: Also rebalance if any asset drifts >5% from target\n\n**Process:**\n1. Check actual vs target allocation in Portfolio → Overview\n2. Compare against Financial Model → Asset Allocation\n3. Redirect SIPs to underweight categories\n\n💡 Related mistake #40: Not rebalancing portfolio — one of the most consequential but easily fixable mistakes.";
  }

  if (
    m.includes("avalanche") ||
    m.includes("snowball") ||
    (m.includes("debt") && m.includes("strategy") && m.includes("repay"))
  ) {
    return "💳 **Debt Repayment Strategies: Avalanche vs Snowball**\n\n**Avalanche Method (Mathematically Optimal):**\n• List all debts by interest rate, highest first\n• Pay minimums on all debts\n• All extra money → HIGHEST interest debt\n• Roll freed payment to next highest when paid off\n• Minimizes total interest paid\n\n**Snowball Method (Psychologically Optimal):**\n• List debts by balance, smallest first\n• Pay off smallest debt first (quick wins)\n• Motivation from eliminating accounts\n• Slightly more interest paid total\n\n**Priority order in India:**\n1. Credit card (36–40%) → IMMEDIATE\n2. Personal loans (12–20%)\n3. Car loans (8–12%)\n4. Education loans (8–10%) — tax deductible\n5. Home loan (8–9%) — tax benefit, lowest priority for prepayment\n\n**Tools:** Loans → Debt Model has both strategies side-by-side with debt freedom date calculator.";
  }

  if (
    m.includes("3 fund") ||
    m.includes("three fund") ||
    (m.includes("index fund") &&
      m.includes("bond") &&
      m.includes("international"))
  ) {
    return "📊 **3-Fund Portfolio Rule**\n\nThe simplest evidence-based portfolio: Domestic Index Fund + International Index Fund + Bond Index Fund.\n\n**Why just 3 funds?**\n• Covers entire global equity market + fixed income\n• Ultra-low cost (combined expense < 0.3%)\n• Easy to rebalance\n• Beats 90% of complex actively managed portfolios over 15+ years\n\n**Indian version:**\n1. **Domestic:** Nifty 50 / Nifty 500 index fund (0.1–0.2% ER)\n2. **International:** Motilal Oswal S&P 500 / US Treasury ETF or Global index fund\n3. **Debt:** Government securities index fund or Short Duration fund\n\n**Allocation by age:**\n• Age 30: 60% domestic equity, 20% international, 20% debt\n• Age 45: 50% equity, 15% international, 35% debt\n• Age 60: 40% equity, 10% international, 50% debt\n\n💡 Related mistake #39: Paying high fees on mutual funds — switching from regular to direct plans alone can add ₹15–30L to a 20-year corpus.";
  }

  if (
    m.includes("margin of safety") ||
    (m.includes("intrinsic value") && m.includes("buy"))
  ) {
    return "🛡️ **Margin of Safety (Benjamin Graham)**\n\nBuy only when stock price ≤ ⅔ (66%) of estimated intrinsic value. The 33% discount is your safety net.\n\n**Why it works:**\n• Valuation is imprecise — your estimate may be 20% off\n• The discount cushions estimation errors AND market downturns\n• If intrinsic value = ₹100, buy at ≤ ₹67\n\n**How to estimate intrinsic value:**\n• P/E method: Industry P/E × company EPS\n• DCF method: Discounted future cash flows\n• Graham's formula: √(22.5 × EPS × Book Value Per Share)\n\n**Warren Buffett:** 'Margin of safety is the most important concept in investing. Without it, you're speculating.'\n\n**Applied to mutual funds:** When Nifty P/E is below 15–16x (historical average ~20x), the entire market offers margin of safety for lump sum investing.\n\n💡 See Learn Finance → Basics → Intelligent Investor Models → Margin of Safety card for interactive calculator.";
  }

  if (
    m.includes("circle of competence") ||
    m.includes("invest what you know") ||
    (m.includes("competence") && m.includes("invest"))
  ) {
    return "🎯 **Circle of Competence (Munger/Buffett)**\n\nOnly invest in businesses you deeply understand. Know the boundaries of your knowledge and don't invest beyond them.\n\n**The principle:**\n• You don't need to understand every industry\n• Being right about what's inside your circle is more valuable than being mediocre about everything\n• 'A small circle, well understood' beats 'a large circle, poorly understood'\n\n**How to apply:**\n• Banking professional: can deeply analyze bank stocks\n• IT professional: can evaluate tech businesses better than most\n• Both can use index funds for everything outside their circle\n\n**Common mistake:** Investing in pharmaceutical stocks because 'healthcare is growing' without understanding drug approval pipelines, patent cliffs, or generic competition.\n\n**For most retail investors:** Index funds cover everything outside your circle. Individual stocks only within your circle.\n\n💡 Related: Mr. Market mental model — even if you know a business, wait for Mr. Market to offer an irrational price.";
  }

  if (
    m.includes("mr. market") ||
    m.includes("mr market") ||
    (m.includes("market") && m.includes("irrational") && m.includes("price"))
  ) {
    return "👁️ **Mr. Market Mental Model (Benjamin Graham)**\n\nImagine the stock market as a manic-depressive business partner who offers to buy or sell his share of the business every day.\n\n**The story:**\n• On good days, he's euphoric — offers sky-high prices\n• On bad days, he's terrified — offers dirt-cheap prices\n• You are NEVER obligated to trade with him\n• His prices are an opportunity, not advice\n\n**Practical application:**\n• Market crash (March 2020): Mr. Market is terrified → buy more, don't stop SIPs\n• Bull market peak (2007, 2021): Mr. Market is euphoric → reduce new lump sum investments, rebalance\n• The noise of daily price movement is Mr. Market's mood swings — ignore it\n\n**Buffett's version:** 'Be fearful when others are greedy, greedy when others are fearful.'\n\n**Anti-pattern:** Selling in March 2020 (Mr. Market at his most terrified) locked in massive losses. Those who kept SIPs running saw 2–3x returns in 3 years.\n\n💡 See Learn Finance → Basics → Intelligent Investor Models → Mr. Market card.";
  }

  if (
    m.includes("100 minus age") ||
    m.includes("age-based allocation") ||
    (m.includes("equity") && m.includes("age") && m.includes("allocation"))
  ) {
    return "📊 **100 Minus Age Rule (Age-Based Asset Allocation)**\n\nEquity allocation % = 100 − your age. Remainder in debt/fixed income.\n\n**Examples:**\n• Age 25: 75% equity, 25% debt\n• Age 40: 60% equity, 40% debt\n• Age 55: 45% equity, 55% debt\n• Age 65: 35% equity, 65% debt\n\n**Modern update:** With longer life expectancy, many advisors use 110 or 120 minus age:\n• Age 25 with 120 rule: 95% equity (fine for long horizon)\n• Age 60 with 110 rule: 50% equity (maintains growth even in retirement)\n\n**Indian context:**\nRetiral instruments (EPF, PPF, NPS) count as 'debt' in this formula. A 35-year-old with 20% in EPF/PPF + 45% equity = 65% total growth allocation (close to the 65% suggested by 100-35 rule).\n\n💡 Check Financial Model → Asset Allocation to see Conservative/Moderate/Aggressive profiles with exact allocations and compare against your actual portfolio.";
  }

  if (
    m.includes("credit utilization") ||
    (m.includes("credit card") && m.includes("limit") && m.includes("30"))
  ) {
    return "💳 **Credit Utilization 30% Rule**\n\nKeep your total credit card balance below 30% of your total credit limit at all times.\n\n**Why it matters:**\n• Credit score is heavily influenced by utilization (30% of CIBIL score)\n• Below 30% = 'responsible borrower'\n• Below 10% = excellent credit behavior\n• Above 60% = credit risk flag\n\n**Example:**\n• Credit limit ₹5L across 2 cards → keep balance below ₹1.5L\n• Ideally pay in full every month (0% utilization is best)\n\n**Strategies:**\n• Pay twice per month if you're heavy spender\n• Request credit limit increase (improves ratio without changing spending)\n• Keep old cards open (maintaining total available credit)\n\n**Related mistakes:** Mistake #16 (minimum due payments) + Mistake #25 (too many credit cards) + Mistake #23 (not reviewing credit score) — all credit-related pitfalls mapped to this rule.\n\n💡 CIBIL score above 750 is needed for best home loan rates. Review your score annually for free at CIBIL or RBI-licensed platforms.";
  }

  if (
    m.includes("good debt") ||
    m.includes("bad debt") ||
    (m.includes("home loan") && m.includes("vs") && m.includes("credit card"))
  ) {
    return "⚖️ **Good Debt vs Bad Debt**\n\n**Good Debt** (builds or protects assets):\n• Home loan: Forces savings, asset appreciation, tax benefit (24b)\n• Education loan: Invests in human capital, income multiplier\n• Business loan: Revenue-generating, ROI > interest cost\n\n**Bad Debt** (funds consumption/depreciating assets):\n• Credit card balance: 30–45% p.a. — the worst\n• Personal loan for vacation, gadgets, wedding: 12–20% p.a.\n• Car loan for luxury vehicle beyond needs: 8–12% p.a.\n• Buy Now Pay Later for impulse purchases: Hidden 24–36% effective\n\n**Decision framework:**\n• Will this debt create an asset worth more than the interest?\n• If YES → possibly good debt\n• If NO → it's bad debt, avoid\n\n**Indian trap:** Wedding loans (₹10–30L at 14–18%) and car upgrades on EMI are two of the most common bad debt traps.\n\n💡 Use Loans → Loan vs Invest tab to compare: 'Should I prepay my loan or invest the surplus?'";
  }

  if (
    m.includes("life insurance") ||
    (m.includes("term") && m.includes("cover") && m.includes("how much")) ||
    m.includes("hlv") ||
    m.includes("human life value")
  ) {
    return "🛡️ **Life Insurance Coverage Rule**\n\nTerm insurance cover = 15–25 times annual income (or 10–20x annual expenses).\n\n**HLV Method (Human Life Value):**\n• HLV = (Annual income − personal expenses) × working years remaining\n• Example: ₹12L income, ₹3L personal expenses, 25 years to retirement\n• HLV = ₹9L × 25 = ₹2.25 Crore\n\n**Key rules:**\n• Only buy PURE TERM INSURANCE — no endowment, ULIP, or 'return of premium'\n• Cover should replace your income for 15–20 years\n• Include: existing loans, children's education, spouse income gap\n• Review cover at: marriage, children, home loan, major income change\n\n**Cost:** ₹1 Crore term cover for 30-year-old = ₹8,000–12,000/year. Cheapest and most effective financial protection available.\n\n**Insurance mistake:** 65% of Indians who have 'life insurance' are actually holding endowment/money-back policies that provide 4–6% returns — far less than inflation and far less cover than needed.\n\n💡 Financial Model → Insurance shows HLV calculation for your exact situation.";
  }

  if (
    m.includes("inflation adjusted") ||
    (m.includes("plan") &&
      m.includes("inflation") &&
      m.includes("retirement")) ||
    (m.includes("real return") && m.includes("portfolio"))
  ) {
    return "📈 **Inflation-Adjusted Planning Rule**\n\nAll financial goals must be calculated in inflation-adjusted (real) terms, not today's nominal numbers.\n\n**The math:**\n• 6% inflation doubles prices every 12 years (Rule of 72)\n• ₹1L/month needed today = ₹3.2L/month in 20 years\n• Retirement corpus must be calculated at retirement date prices\n\n**Target real returns:**\n• FD: 7% nominal − 6% inflation − 30% tax on interest = ~1% real return (terrible)\n• Equity MF: 12% nominal − 6% inflation = 6% real return (good)\n• NPS/EPF: 8.5% nominal − 6% inflation = 2.5% real return (safe baseline)\n\n**Planning checklist:**\n1. Define goal in today's money\n2. Project future value using inflation rate\n3. Calculate SIP needed to reach inflation-adjusted corpus\n4. Choose investments targeting 10–12% nominal (4–6% real)\n\n💡 All Financial Planner calculators account for inflation — enter inflation rate of 6% for India when calculating retirement or goals.";
  }

  // ── FINANCIAL MISTAKES KNOWLEDGE BASE ──────────────────────────────────────

  if (
    m.includes("stop sip") ||
    m.includes("pause sip") ||
    m.includes("sip in bear") ||
    (m.includes("sip") && m.includes("crash") && m.includes("stop"))
  ) {
    return "⚠️ **Mistake: Stopping SIPs During Market Crash**\n\nOne of the costliest mistakes in Indian retail investing. Here's why it destroys wealth:\n\n**What happens when you stop:**\n• You miss buying the cheapest units of your investing life\n• Bear markets (like March 2020, Jan 2008) are the best SIP periods — lowest NAVs, highest future returns\n• Stopping SIP during crash + resuming after recovery = you buy only at high prices\n\n**Real numbers:**\n• ₹10K/month Nifty SIP run through March 2020 crash → 3-year CAGR: ~22%\n• Same SIP stopped in Feb 2020 and restarted Oct 2020 → 3-year CAGR: ~11%\n• Cost of panic: 11% CAGR difference compounded over career = lakhs/crores\n\n**The mental model:**\n• SIP in crash = buying groceries in sale season\n• The price fell, but the quality didn't\n• You want MORE units at low prices, not fewer\n\n**Rule:** Never stop a SIP unless you genuinely can't afford it. The purpose of SIP is to buy through all market conditions — especially crashes.";
  }

  if (
    m.includes("timing market") ||
    m.includes("time the market") ||
    m.includes("wait for correction") ||
    m.includes("wait to invest")
  ) {
    return "⏰ **Mistake: Waiting for the Perfect Time to Invest**\n\nMistake #33: Waiting for the 'right time' to invest is one of the most costly errors. The right time was yesterday; the second-best time is today.\n\n**The data:**\n• DALBAR study: Average investor returns are 2–4% below fund returns due to wrong timing\n• Time in market beats timing the market in 90%+ of scenarios over 10-year periods\n• Missing just the 10 best trading days in a decade cuts returns by 40–50%\n\n**Typical excuses vs reality:**\n• 'Market is at all-time high' → ATHs are regularly broken; missing ATH investments misses the next ATH\n• 'Let me wait for a correction' → Corrections happen rarely and you often miss them\n• 'I'll invest after elections/budget' → Markets are forward-looking, already priced in\n\n**Solution:**\n• Start SIP immediately — even ₹1,000/month is better than waiting\n• For lump sums: invest over 3–6 months via STP (Systematic Transfer Plan)\n• The cost of waiting 1 year at 12% return = 12% of corpus\n\n💡 Rule of 72: at 12%, money doubles every 6 years. Every year you wait = significant wealth lost.";
  }

  if (
    m.includes("overexposure") ||
    m.includes("too much real estate") ||
    (m.includes("real estate") && m.includes("portfolio") && m.includes("too"))
  ) {
    return "🏠 **Mistake: Overexposure to Real Estate (#38)**\n\nKeeping more than 30–40% of net worth in a single illiquid real estate asset (especially one property).\n\n**Why it's risky:**\n• Real estate is illiquid — can take 6–18 months to sell at fair value\n• No diversification — one property = one market, one tenant, one locality risk\n• Maintenance costs eat 1–2% of property value annually\n• Rental yield in India: 2–3% (vs 7–8% in equity dividends + growth)\n\n**The math comparison:**\n• ₹1 Crore property appreciation: 7% p.a. → ₹3.87 Crore in 20 years (gross, before costs)\n• ₹1 Crore in Nifty index fund: 12% p.a. → ₹9.65 Crore in 20 years\n• Plus: equity is liquid, divisible, and zero maintenance\n\n**Better approach:**\n• REITs provide real estate exposure with full liquidity (Embassy REIT, Mindspace REIT)\n• Limit physical real estate to own home + max 1 investment property\n• Keep real estate ≤ 30–40% of total net worth\n\n💡 Track your real estate vs total portfolio allocation in Portfolio → Overview tab.";
  }

  if (
    m.includes("high fee") ||
    m.includes("expense ratio") ||
    m.includes("direct plan") ||
    m.includes("regular plan") ||
    (m.includes("fund") && m.includes("fee") && m.includes("impact"))
  ) {
    return "💸 **Mistake: Paying High Fees on Mutual Funds (#39)**\n\nSwitching from regular to direct mutual fund plans is one of the simplest, highest-impact financial decisions.\n\n**The fee impact:**\n• Regular plan (with distributor): 1.5–2% expense ratio\n• Direct plan (no distributor): 0.5–1% expense ratio\n• Difference: 0.5–1% per year\n\n**Compounded impact on ₹10L invested for 20 years at 12%:**\n• Regular plan (11% net): ₹80.6 Lakhs\n• Direct plan (12% net): ₹96.5 Lakhs\n• **Difference: ₹15.9 Lakhs!**\n\n**How to switch:**\n1. Open account on AMC website directly or use Groww/Zerodha Coin/ET Money\n2. Switch existing regular plan to direct plan (may trigger exit load/LTCG — plan tax-efficiently)\n3. All new investments: always choose 'Direct' plan\n\n**Also:** Prefer index funds (0.1% ER) over actively managed funds for large-cap exposure.\n\n💡 For an investor putting ₹50K/month for 20 years: the direct plan advantage is ₹75L+.";
  }

  if (
    m.includes("tax benefit") ||
    m.includes("claim deduction") ||
    m.includes("80c optimize") ||
    (m.includes("tax") && m.includes("saving") && m.includes("proper"))
  ) {
    return "💡 **Mistake: Not Claiming Tax Benefits Properly (#26)**\n\n**Maximum deduction stack (old regime):**\n\n🟢 **₹1.5L under Section 80C:**\n• ELSS (3-year lock-in, equity returns) — BEST for wealth creation\n• PPF (15-year, 7.1% tax-free) — BEST for guaranteed returns\n• EPF contribution (automatic)\n• NPS Tier-1, NSC, 5-year FD, SCSS, LIC premium\n\n🔵 **₹50K under Section 80CCD(1B):**\n• Additional NPS Tier-1 contribution\n• Total NPS deduction potential: ₹2L\n\n🟡 **₹25K-50K under Section 80D:**\n• Health insurance premium: ₹25K (self/family) + ₹25K (parents <60) = ₹50K\n• For senior parents: ₹25K + ₹50K = ₹75K total deduction\n\n🟠 **Section 24(b):** Up to ₹2L home loan interest (self-occupied)\n\n**Total possible deduction:** ₹2.25L–4.25L depending on situation.\n\nFor 30% slab: saving ₹4L in deductions = ₹1.2L tax saved annually.\n\n💡 Use Financial Planner → Tax Planning → 80C Optimizer for personalized deduction planning.";
  }

  if (
    m.includes("no goal") ||
    m.includes("smart goal") ||
    (m.includes("goal") && m.includes("link") && m.includes("money"))
  ) {
    return "🎯 **Mistake: No Goals Tied to Money (#42)**\n\nMoney without purpose leaks. Linking every rupee to a goal transforms spending and saving discipline.\n\n**SMART financial goals:**\n• **Specific:** Not 'buy a house' but 'buy 2BHK in Pune by 2028 for ₹80L'\n• **Measurable:** Track monthly progress toward the target\n• **Achievable:** Based on real income and savings capacity\n• **Relevant:** Aligned with life priorities\n• **Time-bound:** Specific deadline creating urgency\n\n**Goal types in Growfinfire:**\n• Emergency Fund (Immediate, Liquid MF)\n• House Down Payment (3–5 years, Balanced MF)\n• Child's Education (10+ years, Equity MF)\n• Retirement (25+ years, Equity + NPS + EPF)\n\n**Linking goals to investments:**\nIn Goals module: link specific portfolio holdings to each goal. The app tracks progress automatically.\n\n💡 Go to Goals → Track Goals → Add Goal. Goals module shows 'Amount Required' (gap between target and current savings), months remaining, and recommended monthly SIP to meet the goal.";
  }

  if (
    m.includes("chasing returns") ||
    m.includes("past performance") ||
    (m.includes("best fund") && m.includes("last year"))
  ) {
    return "⚠️ **Mistake: Chasing Past Returns in Mutual Funds (#33 related)**\n\nFund selection based on last 1-year returns is one of the most studied and most common investor errors.\n\n**The data:**\n• Only ~15% of top-quartile funds in one year remain top-quartile the next year\n• Selecting funds based on 3-year rolling returns is 3x more predictive than 1-year\n• Category rotation explains most 'hot fund' performance — not manager skill\n\n**What actually works:**\n1. Consistency over 7–10 years across market cycles\n2. Lower expense ratio (in your favor)\n3. Low standard deviation relative to category peers\n4. Higher Sharpe ratio (return per unit of risk)\n5. Same fund house across market cycles (manager stability)\n\n**The trap cycle:**\n• 2020: Small cap funds top (after COVID crash) → everyone piles in\n• 2021: Small cap delivers 100%+ → more inflows\n• 2022: Small cap corrects 25–40% → same investors panic-sell\n\n**Solution:** Select funds based on 5–10 year rolling returns and consistency, not 1-year rankings. Index funds eliminate this problem entirely.";
  }

  if (
    m.includes("guaranteed return") ||
    m.includes("guaranteed returns") ||
    m.includes("assured return") ||
    m.includes("ponzi") ||
    (m.includes("scam") && m.includes("invest"))
  ) {
    return "🚨 **Mistake: Falling for 'Guaranteed Returns' Scams (#46)**\n\n**Red flags — avoid ANY scheme that:**\n• Promises fixed returns of 15%+ with 'no risk'\n• Is not registered with SEBI/RBI\n• Claims returns through referrals or recruitment\n• Has complex, opaque return mechanism\n• Pressures quick investment before 'offer closes'\n\n**Famous Indian scams:**\n• Saradha Chit Fund: ₹2,500 Crore loss (West Bengal, 2013)\n• PACL/Pearls: ₹49,100 Crore fraud\n• Rose Valley: ₹17,000 Crore (West Bengal)\n• Numerous real estate + multi-level marketing schemes\n\n**Legitimate high-return reality:**\n• P2P lending: 10–15% but UNSECURED credit risk\n• Small-cap equity: 15%+ historically but HIGH VOLATILITY\n• No investment offers 15%+ GUARANTEED without substantial risk\n\n**Verification steps:**\n1. Search SEBI website: sebi.gov.in → Intermediaries\n2. Check if registered: AMFI for MF, IRDAI for insurance\n3. If it's too good to be true — it is\n\n💡 Learn Finance → Learn from Mistakes → Mistake #46 maps to the 'Avoid IPO Hype' rule — apply same skepticism to all 'hot' investment opportunities.";
  }

  if (
    m.includes("nominee") ||
    m.includes("beneficiary") ||
    (m.includes("nomination") && m.includes("update"))
  ) {
    return "📋 **Mistake: Not Updating Nominee Details (#47)**\n\nOne of the most overlooked financial tasks — outdated nominees can leave families in legal limbo for years.\n\n**Where to update nominees:**\n• Bank accounts (all active accounts)\n• EPF account (via UAN portal — CRITICAL)\n• NPS account (NSDL/Karvy portal)\n• All insurance policies\n• Demat account (CDSL/NSDL)\n• Mutual fund folios (each AMC separately)\n• PPF account (post office/bank)\n\n**What happens without correct nominee:**\n• Bank requires succession certificate/probate (6–24 months)\n• EPF nominee dispute can freeze ₹50L+ corpus\n• Insurance company may reject claim or pay to wrong person\n• Legal costs often exceed 5–10% of amount involved\n\n**Update triggers:**\n• Marriage/divorce\n• Birth of child\n• Death of existing nominee\n• Every 2–3 years as routine financial review\n\n💡 Annual 'Financial Health Checkup' task: Update nominees, review insurance coverage, rebalance portfolio, file ITR. Do this every April–May.";
  }

  if (
    m.includes("net worth track") ||
    m.includes("track net worth") ||
    (m.includes("asset") && m.includes("liability") && m.includes("track"))
  ) {
    return "📊 **Mistake: Not Tracking Net Worth (#45)**\n\n**Net Worth = Total Assets − Total Liabilities**\n\nTracking this quarterly is the single most important financial dashboard metric.\n\n**What to track:**\n\n**Assets:**\n• Portfolio (equity, MF, gold, bonds, FD, retiral)\n• Real estate (current market value)\n• EPF/PPF/NPS balance\n• Emergency fund\n• Business/partnership value\n\n**Liabilities:**\n• Home loan outstanding\n• Car/personal loans outstanding\n• Credit card balance\n\n**Milestones (rule of thumb):**\n• Age 30: Net worth ≥ 1x annual salary\n• Age 40: Net worth ≥ 3x annual salary\n• Age 50: Net worth ≥ 6x annual salary\n• FIRE point: Net worth ≥ 25x annual expenses\n\n**In Growfinfire:**\nDashboard shows: Total Portfolio NAV, Goals Progress, Assets vs Liabilities chart, and Projected Net Worth Trend (10-year projection).\n\n💡 Update your Portfolio module regularly — the Dashboard NAV cards aggregate your net investible wealth automatically.";
  }

  if (
    m.includes("diversif") &&
    (m.includes("too much") || m.includes("over") || m.includes("many fund"))
  ) {
    return "⚠️ **Over-Diversification (Di-worse-ification)**\n\nOwning 15–20 mutual funds is NOT diversification — it's complexity without benefit. Peter Lynch called this 'di-worse-ification'.\n\n**Why over-diversification fails:**\n• 10 large-cap funds all hold the same Nifty 50 stocks — near-identical correlation\n• Combined expense ratio: 1.5% × 10 funds = 1.5% per ₹10L (no savings vs 1 fund)\n• Tracking 20 funds is overwhelming → you hold them passively → underperformance goes unnoticed\n\n**Optimal portfolio size:**\n• 3–5 funds covers all you need\n• 1 Nifty 50 index fund covers most large-cap exposure\n• 1 international fund (S&P 500 or global)\n• 1 mid/small cap fund for growth\n• 1 debt fund for stability\n• 1 ELSS for tax saving\n\n**Overlap check:**\n• Search 'mutual fund overlap tool' — many free tools show % stock overlap between funds\n• >60% overlap = one fund is redundant, adds no diversification value\n\n💡 Related mistake #19: Not diversifying AND #38: Over-diversification. The sweet spot: diversify across ASSET CLASSES (equity, debt, gold, international), not within the same asset class.";
  }

  if (
    m.includes("cosigning") ||
    m.includes("co-sign") ||
    m.includes("guarantor") ||
    (m.includes("loan") &&
      m.includes("someone else") &&
      m.includes("guarantee"))
  ) {
    return "🚨 **Mistake: Co-signing Loans for Others (#30)**\n\nCo-signing or being a loan guarantor for someone else is one of the highest financial risks you can take.\n\n**What co-signing means legally:**\n• You are equally liable for the ENTIRE loan\n• If they default → you pay — plus penalty interest\n• Their missed payments appear on YOUR CIBIL score immediately\n• Lender can attach YOUR assets without first exhausting primary borrower's assets\n\n**Never co-sign for:**\n• Friends (friendship does not equal financial liability)\n• Relatives with history of financial irresponsibility\n• Business partners (use legal agreements instead)\n• Anyone whose repayment ability you cannot verify\n\n**Alternative if someone needs your support:**\n• Gift money outright if you can afford to lose it\n• Help them build CIBIL score with secured credit card\n• Educate them on loan eligibility requirements\n\n**Rule:** Only co-sign if you are 100% willing and financially able to repay the full loan yourself. Period.\n\n💡 Related: Leverage Prudence rule — never take on financial obligations beyond your ability to independently service them.";
  }

  // Default fallback

  return "I'm here to help with your financial journey! 🌟\n\nAsk me about any of these topics:\n\n**FinanceOS Modules:**\n• Dashboard (Risk-o-meter, charts, projections)\n• Goals (Track Goals, Plan Goals, Buy a House Planner)\n• Portfolio (8 asset types, card/table view)\n• Budgeting (Plan Budget, Track, Insights, Improve)\n• Loans (Loan Tracker, Prepayment, Debt Model)\n• Trade Journal (Live prices, P&L, Analytics)\n• Financial Model (8 models)\n• Financial Planner (35+ calculators including FIRE)\n• Learn Finance (Rules, Basics, 50 Mistakes, My Rules)\n\n**Financial Calculators:**\n• SIP / SWP / Lump Sum / CAGR\n• Home Loan EMI / FD / PPF / NPS\n• FIRE Number (FAT/Lean/Barista) / Retirement Corpus\n• Tax Planning (80C, LTCG, Old vs New Regime)\n• Emergency Fund / Debt-to-Income Ratio\n\n**Investment Knowledge:**\n• Mutual Funds, Index Funds, Equity, Gold, Crypto\n• Portfolio Design (Conservative / Moderate / Aggressive)\n• Compounding, Rule of 72, Inflation, CAGR\n• Intelligent Investor Models (Graham's 10 principles)\n• 50 Common Financial Mistakes & How to Avoid Them\n\nJust ask your question and I'll give you a detailed, actionable answer!";
}

// ─── Components ───────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-purple-400"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function renderText(text: string) {
  // Split on newlines and render with bold support
  const segments: React.ReactNode[] = [];
  const lines = text.split("\n");
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    for (let pi = 0; pi < parts.length; pi++) {
      const part = parts[pi];
      if (part.startsWith("**") && part.endsWith("**")) {
        segments.push(
          <strong key={`b${li}-${pi}`}>{part.slice(2, -2)}</strong>,
        );
      } else {
        segments.push(<span key={`s${li}-${pi}`}>{part}</span>);
      }
    }
    if (li < lines.length - 1) segments.push(<br key={`br${li}`} />);
  }
  return segments;
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm shadow-md">
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-purple-100 text-slate-800 text-sm shadow-sm leading-relaxed">
        {msg.isTyping ? (
          <TypingDots />
        ) : (
          <div className="whitespace-pre-line">{renderText(msg.text)}</div>
        )}
      </div>
    </div>
  );
}

export function GrowfinfireChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [nextId, setNextId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([WELCOME_MESSAGE]);
    }
  }, [isOpen, messages.length]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll-on-new-message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: nextId, role: "user", text: text.trim() };
    const typingMsg: Message = {
      id: nextId + 1,
      role: "assistant",
      text: "",
      isTyping: true,
    };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setNextId((n) => n + 2);
    setInput("");
    setIsTyping(true);

    const delay = 800 + Math.random() * 400;
    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages((prev) =>
        prev.map((m) =>
          m.isTyping ? { ...m, text: response, isTyping: false } : m,
        ),
      );
      setIsTyping(false);
    }, delay);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setNextId(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            data-ocid="chatbot.open_modal_button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl flex items-center justify-center cursor-pointer"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(147,51,234,0.4)",
                  "0 0 0 12px rgba(147,51,234,0)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 rounded-full"
            />
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-ocid="chatbot.panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 flex flex-col overflow-hidden shadow-2xl
              bottom-0 right-0 left-0 h-[85vh] rounded-t-2xl
              sm:bottom-6 sm:right-6 sm:left-auto sm:w-96 sm:h-[600px] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-900 to-blue-900 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-sm">Growfinfire</p>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                </div>
                <p className="text-purple-200 text-xs">
                  AI Financial Assistant
                </p>
              </div>
              <button
                type="button"
                data-ocid="chatbot.delete_button"
                onClick={clearChat}
                className="text-purple-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                data-ocid="chatbot.close_button"
                onClick={() => setIsOpen(false)}
                className="text-purple-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Suggested prompts */}
              {showSuggestions && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-slate-400 text-center">
                    Suggested questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <button
                        // biome-ignore lint/suspicious/noArrayIndexKey: static list
                        key={i}
                        type="button"
                        data-ocid="chatbot.suggestion.button"
                        onClick={() => sendMessage(prompt)}
                        className="px-3 py-1.5 rounded-full border border-purple-200 bg-white text-xs text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-colors cursor-pointer shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 bg-white border-t border-slate-200 flex-shrink-0">
              <Input
                ref={inputRef}
                data-ocid="chatbot.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything financial..."
                disabled={isTyping}
                className="flex-1 text-sm border-slate-200 focus-visible:ring-purple-400"
              />
              <Button
                type="button"
                data-ocid="chatbot.submit_button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
