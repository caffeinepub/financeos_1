import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  PiggyBank,
  Search,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

const HELP_SECTIONS = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    color: "#2563eb",
    bg: "#eff6ff",
    title: "Dashboard",
    content: [
      {
        q: "What does the Dashboard show?",
        a: "The Dashboard is your financial command center showing 11+ charts in a structured order: NAV cards, Asset Allocation donut, Portfolio Risk-o-meter, Projected Net Worth Trend, Assets vs Liabilities, Debt-to-Income Ratio, Cash Flow Summary, Income vs Expense Trend, Investment Categories (horizontal bars), Goals Progress, Budgeting 6 Months, and a 50/30/20 Budget Rule Analysis chart.",
      },
      {
        q: "How is the NAV calculated?",
        a: "NAV is the sum of current values across all 8 portfolio asset types: Retiral, Equity (ETF/Stocks), Mutual Fund, Crypto, Commodity, Real Estate, Fixed Income, and Other Investments. Values are shown in Cr/L/K (INR) or M/B/K (USD/GBP) based on your selected currency.",
      },
      {
        q: "What is the Portfolio Risk-o-meter?",
        a: "The Risk-o-meter is a semicircular gauge with 6 colour-coded bands. It calculates combined allocation % of Equity + Mutual Funds + Crypto from your portfolio. Bands: Low Risk (≤25%, green), Low-Moderate (26–34%, chartreuse), Moderate (35–44%, yellow), Moderately High (45–59%, caramel), High (60–74%, orange), Very High (≥75%, red). A needle points to your current risk level with a label below.",
      },
      {
        q: "What is the Investment Categories chart?",
        a: "A horizontal bar chart showing current value per asset type in Cr/L/K or M/B/K. Bars are colour-coded by asset class and sorted by value descending. This replaces the old vertical bar chart for better readability.",
      },
      {
        q: "What is the 50/30/20 Budget Rule Analysis on the Dashboard?",
        a: "This chart uses your current month's actual income and expense transactions to show how your spending splits across Needs, Wants, and Savings — compared to the 50/30/20 ideal. Category types (Needs/Wants/Savings) are mapped from your Plan Budget settings.",
      },
      {
        q: "Where is the Risk vs Return chart?",
        a: "The Risk vs Return scatter chart has been moved to Portfolio → Overview tab, at the bottom of that page. It shows each holding plotted by volatility vs expected return.",
      },
      {
        q: "What is the Projected Net Worth Trend?",
        a: "A 10-year projection chart using asset-class-specific returns (e.g. 13% for equity, 7% for bonds) minus your liabilities. It shows how your total wealth is expected to grow year by year.",
      },
      {
        q: "How are values formatted on the Dashboard?",
        a: "All values use the currency selected on the landing page. INR shows Cr (Crore), L (Lakh), K (Thousand). USD/GBP shows B (Billion), M (Million), K (Thousand). Change currency on the landing page to update all charts instantly.",
      },
    ],
  },
  {
    id: "goals",
    icon: Target,
    color: "#059669",
    bg: "#f0fdf4",
    title: "Goals",
    content: [
      {
        q: "What are the two tabs in Goals?",
        a: "Goals has two tabs: (1) Track Goals — add and track financial goals with linked investments, progress rings, and SIP guidance. (2) Plan Goals — includes the Buy a House Eligibility Planner and Goal Planning Model with 5 scenarios.",
      },
      {
        q: "How do I add a financial goal?",
        a: 'Click the "+ Add Goal" button in the header row (top right). Enter the goal name, type, target amount, target date, priority (1–5), and inflation rate. The system calculates the monthly SIP needed to reach the goal.',
      },
      {
        q: "How do I switch between card and table view?",
        a: "Use the toggle icons in the top-right of the submenu header row (Track Goals / Plan Goals row). The default is card view. Toggle switches to table view which shows all goals in a sortable table with a horizontal progress bar.",
      },
      {
        q: "How does the Goal card layout work?",
        a: "Each goal card shows: status badge (On Track/Need Attention/Achieved), linked investment badges (3 shown + tooltip for more), Row 1 — Target, Current, Need; Row 2 — Goal Date, Timeline, SIP/Mo. A large circular progress ring is on the right side with colour (green >80%, amber 50–80%, red <50%). Link/Edit/Delete buttons are stacked beside the ring.",
      },
      {
        q: "How do I link investments to a goal?",
        a: "Click the Link icon on a goal card. A dialog shows all portfolio holdings grouped by asset type. Check the investments to link and click Link Investments. Linked investment current values automatically feed into goal progress.",
      },
      {
        q: "What is the Buy a House Eligibility Planner?",
        a: "Found in Plan Goals, this AI-led planner checks 6 eligibility rules: income adequacy, EMI-to-income ratio (≤35%), CIBIL score (≥700 recommended), Loan-to-Value ratio, property cost vs savings, and emergency fund check. It gives a pass/fail on each rule.",
      },
      {
        q: "What is the Goal Planning Model?",
        a: "Five pre-built scenario cards in Plan Goals: Single Goal: Buy a Car (3yr), Emergency Fund in 1 Year, Multiple Goals Simultaneously, Long-Term Wealth Creation (10yr+), and Retirement Corpus Goal. Each opens as a full-page editable calculator.",
      },
      {
        q: "How is Current Savings calculated in the top panel?",
        a: "Current Savings = sum of current values of all unique investments linked across all goals (no double-counting). This reflects actual portfolio value working toward your goals.",
      },
    ],
  },
  {
    id: "portfolio",
    icon: TrendingUp,
    color: "#0891b2",
    bg: "#ecfeff",
    title: "Portfolio",
    content: [
      {
        q: "What asset types are supported?",
        a: "Portfolio supports 8 asset classes: Retiral (PPF, NPS, EPF, LIC, Pension, Gratuity), Equity (ETF/Stocks) with cap categories, Mutual Fund (Large/Mid/Small/Flexi/Index/ELSS/Hybrid etc.), Crypto, Commodity (Gold, Silver, Platinum), Real Estate, Fixed Income (FD, Bonds, Post Office), and Other (IPO, PMS, P2P Lending, Startup).",
      },
      {
        q: "How do I add a holding?",
        a: 'Click the "Add Holding" button in the Portfolio title row (top of the page). Enter Name/Ticker, Category (auto-populated per asset type), Quantity, and either Buy Price (Invested auto-calculates) or Invested directly. Same symmetric logic applies for Market Price and Current Value.',
      },
      {
        q: "How do I switch between card and table view?",
        a: "The toggle icon is located just before the Add Holding button in the Portfolio title row. Default is card view. Card view shows each holding as a card with name, allocation bar, and Invested/Current/Gain/Loss in one compact row.",
      },
      {
        q: "What does the Overview tab show?",
        a: "Overview shows 4 summary cards (Total Invested, Current Value, Gain/Loss, Gain/Loss%), an Allocation% donut chart, Equity and MF cap distribution donuts, a 10-year growth forecast bar chart per asset type (values in Cr/L/K), and the Risk vs Return scatter chart at the bottom.",
      },
      {
        q: "What is the 10-Year Growth Forecast chart?",
        a: "Each Portfolio module tab shows a single grouped bar chart with year 1–10 projected values based on asset-class historical return rates. Value labels appear at each bar point in Cr/L/K or M/B/K format.",
      },
      {
        q: "How does the Buy Price / Invested logic work?",
        a: "If you enter Buy Price → Invested = Qty × Buy Price (auto-calculated and field disabled). If you enter Invested → Buy Price = Invested / Qty. Clearing either field re-enables both. Same symmetric logic applies for Market Price ↔ Current Value.",
      },
      {
        q: "What column order is used in the table?",
        a: "Table columns: Name/Ticker, Category, Invested, Current, Gain/Loss, Gain/Loss%, Allocation%. Gain/Loss and Gain/Loss% are shown together for quick reference. Sorting is enabled on all columns.",
      },
    ],
  },
  {
    id: "budgeting",
    icon: PiggyBank,
    color: "#7c3aed",
    bg: "#faf5ff",
    title: "Budgeting",
    content: [
      {
        q: "What are the four tabs in Budgeting?",
        a: "(1) Plan Budget — set monthly planned income/expense per category with Needs/Wants/Savings type auto-assignment. (2) Track Income vs Expense — log actual transactions filtered by month/year. (3) Budget Insights — 7 charts with Cards matching Goals card theme. (4) Improve Budget — scenario models with autofill from your actual data.",
      },
      {
        q: "How does the Plan Budget tab work?",
        a: "Add categories (e.g. Salary, Housing, Food) with planned amounts. Type is auto-assigned: Needs (Housing, Transport, Healthcare), Wants (Entertainment, Dining), Savings (Investments, Emergency Fund). Only 1 income row shows by default — click 'Show more entries' to expand. Cards show Budgeted Income, Budgeted Expense, Expected Savings, and Savings Rate.",
      },
      {
        q: "How does the Track Income vs Expense tab work?",
        a: "Filter by Month and Year (default: current month). Actual Income and Actual Expense cards appear at the top. On desktop, All/Income/Expense/Add buttons sit in the same row as the cards. Below: Month/Year dropdowns then search bar. Table shows Date, Category, Type (Needs/Wants/Savings badge), Description, and Amount.",
      },
      {
        q: "What does the Type column show in Track Income vs Expense?",
        a: "The Type column maps each transaction's category to its Plan Budget type: Needs (blue badge), Wants (amber badge), or Savings (green badge). This helps you instantly see how your actual spending aligns with the 50/30/20 rule.",
      },
      {
        q: "What charts are in Budget Insights?",
        a: "7 charts in order: Monthly Overview (Income vs Expenses), 50/30/20 Budget Rule Analysis, Month-over-Month Trend, Monthly Budget Snapshot, Spending by Category (donut with values inside), Top Spending Categories, and Savings Rate Trend (%). Cards show Actual Income, Actual Expenses, Total Savings, and Savings Rate (%) with colour-coded indicators.",
      },
      {
        q: "How does the Improve Budget tab work?",
        a: "Shows 4 Financial Model scenarios (Fresh Graduate, Salaried Professional, Small Business Owner, Family Budget). An Autofill feature at the top lets you select a Month/Year and click 'Autofill from Tracker' to pre-populate scenario inputs with your actual income and categorised expense data.",
      },
      {
        q: "How does the Autofill feature work in Improve Budget?",
        a: "Select a Month and Year from the dropdown at the top of Improve Budget. Click 'Autofill from Tracker'. The system reads your actual transactions for that month, sums income, and splits expenses into Needs/Wants/Savings based on your Plan Budget category types. These values pre-fill the scenario input fields.",
      },
    ],
  },
  {
    id: "financial-model",
    icon: BarChart3,
    color: "#dc2626",
    bg: "#fef2f2",
    title: "Financial Model",
    content: [
      {
        q: "What are the 8 models in Financial Model?",
        a: "(1) Asset Allocation — risk-profile-based allocation with Planned vs Actual vs Variance and AI recommendations. (2) Goal Planning — 5 goal scenarios. (3) Budgeting & Expense Tracking — 4 budget scenarios. (4) Model Portfolio & Investments — Conservative/Moderate/Aggressive MF+ETF portfolios. (5) Loan Management & Repayment — Avalanche vs Snowball with 6-month roadmap. (6) Model Retirement — 25x rule, 4% SWR. (7) Model Insurance — HLV term life, health cover sizing. (8) Model Crypto — DCA, 4-phase cycles.",
      },
      {
        q: "How does the Asset Allocation model work?",
        a: "Select a risk profile (Conservative/Moderate/Aggressive). The model shows target allocations per asset class. A Planned vs Actual vs Variance table compares your model targets against your actual Portfolio holdings. If no portfolio entries exist, Actual shows 0% for all. AI recommendations suggest adjustments to improve alignment with industry standards.",
      },
      {
        q: "What are the target allocations per risk profile?",
        a: "Conservative: 20% Equity, 15% MF, 15% Gold, 5% Silver, 30% Fixed Income, 30% Retiral, 5% FD. Moderate: 35% Equity, 25% MF, 10% Gold, 5% Crypto, 15% Bonds, 20% Retiral. Aggressive: 45% Equity, 30% MF, 5% Gold, 10% Crypto, 3% Bonds, 10% Retiral.",
      },
      {
        q: "How do full-page scenario cards work?",
        a: "Clicking any scenario card expands it into a full-page view (header and sidebar remain visible). A 'Back to Menu' link at the top lets you return. Only one card is visible at a time — expanding a new one collapses the previous.",
      },
      {
        q: "What is the Loan Management & Repayment model?",
        a: "Enter your debts (name, balance, interest rate, minimum payment). The model compares Avalanche (highest interest first) vs Snowball (smallest balance first) payoff strategies. Outputs a 6-month repayment roadmap and a projected debt-freedom date.",
      },
      {
        q: "What is the Goal Planning model?",
        a: "Five editable scenario cards: Single Goal: Buy a Car, Emergency Fund in 1 Year, Multiple Goals Simultaneously, Long-Term Wealth Creation, Retirement Corpus Goal. Each shows instrument recommendations, monthly SIP calculation, and cost-of-delay analysis. These same scenarios appear in Goals → Plan Goals tab.",
      },
    ],
  },
  {
    id: "financial-planner",
    icon: CalendarDays,
    color: "#d97706",
    bg: "#fffbeb",
    title: "Financial Planner",
    content: [
      {
        q: "How many calculators are available?",
        a: "35+ calculators across 6 categories: Investment Planners (SIP with Step-Up, SWP with Step-Up, Lump Sum, CAGR, MF Returns, Stock Returns, Goal-based), Retirement & Goals (FIRE Planner, Retirement Corpus, Pension, Annuity, Post-Retirement SWP, Buy a House Eligibility), Loan & EMI (Home Loan, Car Loan, Education Loan, EMI, Amortization, Prepayment, Balance Transfer, Flat vs Reducing), Tax Planners (Old vs New Regime, GST, LTCG/STCG), Savings & Deposits (FD, RD, PPF, NPS, Emergency Fund, DTI, Gratuity, HRA), and Life Planners (Marriage, Child Education, HLV, Inflation Impact).",
      },
      {
        q: "How does the FIRE Planner work?",
        a: "The FIRE Planner supports three strategies: FAT FIRE (33x annual expenses — comfortable lifestyle), Lean FIRE (20x — frugal lifestyle), and Barista FIRE (15x — semi-retirement with part-time income). Inputs: annual expenses, current savings, annual savings rate, return rate, inflation, and country. Outputs: FIRE number, years to FIRE, corpus projection chart, and 40-year year-wise table. All calculated instantly — no button needed.",
      },
      {
        q: "What are FAT, Lean, and Barista FIRE?",
        a: "FAT FIRE: retire with a large corpus (33x expenses) for a comfortable, full lifestyle. No income needed. Lean FIRE: retire with a minimal corpus (20x expenses) by living frugally. Barista FIRE: semi-retire with a smaller corpus (15x expenses) and earn part-time income to bridge the gap. Country multipliers adjust for cost-of-living differences.",
      },
      {
        q: "How does the SIP Planner's Step-Up feature work?",
        a: "Enter an Annual Step-Up % (e.g. 10%). Your SIP increases by that % each year — matching typical salary increments. Example: ₹10K/month at 10% step-up for 20 years = ₹1.9 Crore vs ₹98L without step-up. The calculator shows year-wise corpus growth.",
      },
      {
        q: "How do I navigate between calculators?",
        a: "Financial Planner uses a single-open accordion. Clicking a category expands it and collapses the previous one. Use the search bar at the top to find any calculator instantly by name. All result sections use the currency symbol selected on the landing page.",
      },
      {
        q: "What is the Buy a House Eligibility Planner?",
        a: "Found under Retirement & Goals category. This AI-led planner checks 6 eligibility rules: income adequacy, EMI-to-income ratio, CIBIL score, Loan-to-Value ratio, property cost vs savings, and emergency fund availability. It gives a pass/fail on each rule with actionable guidance.",
      },
      {
        q: "Are calculator results in my selected currency?",
        a: "Yes. All result sections in every Financial Planner calculator dynamically use the currency symbol and number format (Cr/L/K or M/B/K) based on your landing page currency selection. No hardcoded ₹ symbols anywhere.",
      },
    ],
  },
  {
    id: "learn-finance",
    icon: Shield,
    color: "#0d9488",
    bg: "#f0fdfa",
    title: "Learn Finance",
    content: [
      {
        q: "What are the four tabs in Learn Finance?",
        a: "(1) Rules — 80+ financial rules filterable by Beginner/Intermediate/Advanced/Expert, with single-open accordion. (2) Basics — 18 cards: 8 core financial basics with interactive calculators + 10 Intelligent Investor models from Benjamin Graham. (3) Learn from Mistakes — 50 common financial mistakes grouped by category, each mapped to a rule. (4) My Rules — personal rules with AI analysis and recommendations.",
      },
      {
        q: "How does the Basics tab work?",
        a: "18 clickable cards. Clicking a card opens a full-page content view (sidebar and header remain visible) with a 'Back to Basics' link. Cards with calculators (Compounding, Rule of 72, SIP, Inflation, Savings Rate, etc.) show interactive input fields and instant results. The 10 Intelligent Investor cards show formulas and real-world applications.",
      },
      {
        q: "What are the 10 Intelligent Investor models?",
        a: "Based on Benjamin Graham's foundational principles: (1) Margin of Safety — buy when price ≤ ⅔ intrinsic value. (2) Defensive Investor Portfolio — 60/40 glide path. (3) Dollar-Cost Averaging (DCA) — monthly systematic investing. (4) Mr. Market — behavioural finance and contrarian investing. (5) NCAV Screen — net-net deep value. (6) Enterprising Investor Criteria — multi-factor value. (7) Intrinsic Value via Earnings Power — EPV model. (8) Diversification — risk-parity multi-asset. (9) Investor Psychology — systematic rebalancing. (10) Graham-and-Doddsville Model — proof of value investing.",
      },
      {
        q: "How does Learn from Mistakes work?",
        a: "50 financial mistakes grouped by category (Spending, Emergency, Investment, Debt, Insurance, Planning, Mindset) with relevant icons. Each mistake is mapped to a rule. Clicking a rule link auto-navigates to the Rules tab and expands that specific rule. Cards use a single-open accordion — all start collapsed.",
      },
      {
        q: "How does the Rules accordion work?",
        a: "Rules are grouped into collapsible category cards. The accordion is single-open: clicking a card expands it and collapses the previous one. Search automatically expands matching cards. Number count is shown on the right side of each category header.",
      },
      {
        q: "How does AI Analysis work in My Rules?",
        a: "Click AI Analysis to get personalised rule recommendations based on 3 risk profiles (Conservative, Moderate, Aggressive). Each profile shows 8 rules with alignment scoring. One click adds any rule to your My Rules list. Saved rules auto-display Condition and Action fields based on the rule name and category.",
      },
    ],
  },
  {
    id: "loans",
    icon: CreditCard,
    color: "#9333ea",
    bg: "#fdf4ff",
    title: "Loans",
    content: [
      {
        q: "What are the tabs in the Loans module?",
        a: "(1) Loan Tracker — merged Health Dashboard and Smart Tracker: add/edit/delete loans with health score per card and overall summary. (2) Prepayment Impact Simulator — compare without vs with prepayment scenarios. (3) Loan vs Invest Dilemma — AI recommendation on whether to prepay or invest. (4) Loan Affordability Check — safe borrowing limit based on income. (5) Debt-Free Timeline — visual projection. (6) Debt Model — same as Financial Model → Loan Management & Repayment.",
      },
      {
        q: "How does the Loan Tracker work?",
        a: "Add loans with: Type (Home/Car/Personal/Education/Other), Outstanding Balance, EMI, Annual Interest Rate, and Remaining Tenure. Each card shows Loan Health Score, Debt Burden %, and EMI details. An overall summary row at the top shows Total Outstanding, Total EMI, and combined Debt Burden %. Edit and Delete buttons are on each card.",
      },
      {
        q: "How does the Prepayment Impact Simulator work?",
        a: "Enter: Outstanding amount, current EMI, annual interest rate, remaining tenure (months), prepayment amount, and frequency (one-time or monthly extra). The simulator shows side-by-side comparison: Without Prepayment (correct EMI × remaining tenure calculation) vs With Prepayment — showing time saved, interest saved, and new payoff date.",
      },
      {
        q: "How is the Without Prepayment calculation done?",
        a: "Total Payment Without = EMI × Remaining Tenure (months). Total Interest Without = Total Payment − Outstanding Principal. Payoff Date = today + remaining tenure months. This gives the correct baseline for comparison.",
      },
      {
        q: "What is the Loan vs Invest Dilemma?",
        a: "Enter your loan interest rate and expected investment return. The AI recommends whether to prepay the loan or invest the surplus. It factors in tax deductions on home loan interest (Section 24b) and LTCG implications on equity investments.",
      },
      {
        q: "What is the Debt Model tab?",
        a: "The Debt Model tab contains the same scenarios as Financial Model → Loan Management & Repayment. It compares Avalanche (highest interest first) vs Snowball (smallest balance first) strategies and outputs a 6-month repayment roadmap and debt-freedom date.",
      },
    ],
  },
  {
    id: "trade-journal",
    icon: BookOpen,
    color: "#e11d48",
    bg: "#fff1f2",
    title: "Trade Journal",
    content: [
      {
        q: "What are the four tabs in Trade Journal?",
        a: "(1) Dashboard — performance metrics (Win Rate, Total P&L, Profit Factor), equity curve, Win/Loss donut charts with count inside, P&L by Strategy (top 6) and by Instrument (top 6), Monthly Performance Heatmap with prev/next navigation, and scatter plot. (2) Trade Log — add/edit/delete trades with live market price and running P&L for open trades. (3) Journal & Review — pre-trade checklist, post-trade review, and tags. (4) Analytics — pattern recognition, session breakdown, day-of-week performance.",
      },
      {
        q: "How do I log a trade?",
        a: "In Trade Log, click Add Trade. Enter: Ticker/Instrument symbol, Strategy (dropdown), Direction (Long/Short), Entry Price, Quantity, Market Condition (dropdown), and optionally Exit Price. P&L is auto-calculated. For NSE stocks use suffix: RELIANCE.NS. For BSE: RELIANCE.BO. For US stocks: AAPL, MSFT. For crypto: BTC-USD.",
      },
      {
        q: "How does the live market price work?",
        a: "For open/in-progress trades (no exit price), the app fetches live market price from Yahoo Finance free API. Prices auto-refresh every 30 seconds. The polling starts only when you are on the Trade Journal module and stops automatically when you navigate away, saving resources.",
      },
      {
        q: "What happens if no live price is available?",
        a: "If the ticker is invalid, the market is closed, or no data is returned, Market Price falls back to the Entry/Buy Price and is marked with '(est.)' label. P&L still shows based on the estimated price. Verify your ticker format is correct (e.g. RELIANCE.NS not just RELIANCE).",
      },
      {
        q: "How does the Monthly Performance Heatmap work?",
        a: "The heatmap shows daily P&L for the selected month — green for profitable days, red for losing days, intensity varies by magnitude. Use the Previous (←) and Next (→) arrow buttons to navigate between months and review historical performance.",
      },
      {
        q: "What is the pre-trade checklist?",
        a: "In Journal & Review, you can create a customisable pre-trade checklist (e.g. 'Trend confirmed?', 'Risk/reward ≥ 2?', 'No major news event?'). Check off items before entering a trade. Post-trade review lets you record what went right or wrong, with tags for easy filtering.",
      },
      {
        q: "How are P&L charts limited in the Dashboard?",
        a: "P&L by Strategy and P&L by Instrument charts each show a maximum of top 6 entries to keep the chart readable. Strategies or instruments with the highest absolute P&L are shown first.",
      },
    ],
  },
  {
    id: "ai-assistant",
    icon: Bot,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "AI Assistant (Growfinfire)",
    content: [
      {
        q: "How do I open the AI Assistant?",
        a: "Click the pulsing purple-blue button at the bottom-right corner of any page after login. The chat panel opens as a bottom sheet on mobile and a floating side panel on desktop.",
      },
      {
        q: "What can I ask the AI Assistant?",
        a: "Ask about all 10 app modules (navigation and features), all 35+ calculators, all 8 Financial Models, FIRE strategies (FAT/Lean/Barista), Live trade prices, 50 financial mistakes, Intelligent Investor models (Graham's 10 principles), portfolio design, tax planning, SIP/SWP/CAGR, insurance, loans, and general financial topics.",
      },
      {
        q: "What modules is the AI trained on?",
        a: "The AI is trained on: Dashboard (Risk-o-meter, chart layouts), Goals (Track/Plan, Buy a House Planner), Portfolio (8 asset types, card/table view, 10-yr forecast), Budgeting (50/30/20, autofill), Financial Model (all 8 models with current allocations), Financial Planner (FIRE FAT/Lean/Barista, all 35+ calculators), Learn Finance (Basics with Intelligent Investor, 50 Mistakes, Rules), Loans (Loan Tracker, Prepayment Simulator), Trade Journal (live prices, P&L, heatmap), and currency formatting.",
      },
      {
        q: "Can the AI help me design a portfolio?",
        a: 'Yes. Ask "Design a portfolio for me" or "What allocation suits an aggressive investor?" The AI provides detailed recommendations based on Modern Portfolio Theory, the 3 risk profiles (Conservative/Moderate/Aggressive) with exact allocation percentages, and India-specific or global instruments.',
      },
      {
        q: "Can I ask about the Trade Journal?",
        a: "Yes. Ask 'How does the Trade Journal work?', 'What ticker format do I use for NSE stocks?', 'How does live market price work?', or 'Explain the Monthly Heatmap'. The AI explains all Trade Journal features including live price polling, checklist, and analytics.",
      },
      {
        q: "What quick prompts are available?",
        a: "8 quick prompts on opening: How do I set financial goals?, Explain SIP with Step-Up, Design a portfolio for me, What is the 50-30-20 rule?, How to plan for retirement?, FIRE strategy explained, How does Trade Journal work?, Explain mutual fund categories.",
      },
    ],
  },
  {
    id: "navigation",
    icon: LayoutDashboard,
    color: "#64748b",
    bg: "#f8fafc",
    title: "Navigation & Settings",
    content: [
      {
        q: "How does the Portfolio menu toggle work?",
        a: "Clicking Portfolio from any other module navigates to Overview and expands all submenus. Clicking the Portfolio label again while already on Portfolio collapses the submenus (stays on current page). Clicking it once more re-expands. Navigating to any other main menu automatically collapses Portfolio submenus.",
      },
      {
        q: "How does the mobile navigation work?",
        a: "On mobile, the hamburger (☰) button at the top-left collapses or expands the sidebar. When collapsed, all main menu items appear as a horizontally-scrollable bar at the top of the screen below the header — same as the website collapsed view.",
      },
      {
        q: "How does currency selection work?",
        a: "Select your country/currency on the landing page from the dropdown (default: INR). The selection is saved in localStorage and persists across all modules and sessions. INR shows values in Cr/L/K. USD and GBP show M/B/K. All charts, cards, calculators, and planners update automatically.",
      },
      {
        q: "How does dark/light mode work?",
        a: "Click the sun/moon icon in the header (or landing page header). The theme preference is saved in localStorage and applies across all pages and sessions. All modules, charts, and cards respect the dark/light toggle.",
      },
      {
        q: "How does the Admin icon work?",
        a: "The Admin icon appears in the header only for the admin user. Admin is auto-assigned to the first user who logs into the app (bootstrapAdmin function). Admin can view all users, suspend/unsuspend accounts from the Admin page.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filteredSections = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return HELP_SECTIONS;
    return HELP_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.some(
          (item) =>
            item.q.toLowerCase().includes(q) ||
            item.a.toLowerCase().includes(q),
        ),
    );
  }, [search]);

  return (
    <div className="space-y-6" data-ocid="help.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow">
          <HelpCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Help &amp; Guide
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about Growfinfire Global — all 10
            modules
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative" data-ocid="help.section.panel">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search help topics (e.g. FIRE, Trade Journal, Risk-o-meter)..."
          className="pl-9 rounded-xl border-slate-200 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="help.search.input"
        />
      </div>

      {/* Quick topic pills */}
      {!search && (
        <div className="flex flex-wrap gap-2">
          {HELP_SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSearch(s.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: `${s.color}40`,
                  background: s.bg,
                  color: s.color,
                }}
              >
                <Icon className="w-3 h-3" />
                {s.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Accordion Sections */}
      {filteredSections.length === 0 ? (
        <div
          className="text-center py-12 text-slate-400"
          data-ocid="help.empty_state"
        >
          <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No results found for &quot;{search}&quot;</p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-3 text-xs text-indigo-500 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSections.map((section, si) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
                data-ocid={`help.section.item.${si + 1}`}
              >
                {/* Section header */}
                <div
                  className="flex items-center gap-3 px-5 py-4 border-b border-slate-50 dark:border-slate-700"
                  style={{ borderLeftColor: section.color, borderLeftWidth: 3 }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: section.bg }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: section.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {section.title}
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {section.content.length} topics
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: section.bg, color: section.color }}
                  >
                    {section.content.length} Q&amp;A
                  </span>
                </div>

                {/* Accordion Q&A */}
                <Accordion type="multiple" className="px-4 pb-2">
                  {section.content.map((item, qi) => (
                    <AccordionItem
                      key={item.q.slice(0, 30)}
                      value={`${section.id}-${qi}`}
                      className="border-slate-100 dark:border-slate-700"
                      data-ocid={`help.${section.id}.item.${qi + 1}`}
                    >
                      <AccordionTrigger className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-left py-3">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pb-3">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
