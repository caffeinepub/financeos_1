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
  "How do I set financial goals?",
  "Explain SIP with Step-Up",
  "Design a portfolio for me",
  "What is the 50-30-20 rule?",
  "How to plan for retirement?",
  "FIRE strategy explained",
  "Compare Old vs New Tax Regime",
  "Explain mutual fund categories",
];

// ─── Knowledge Base ───────────────────────────────────────────────────────────

function getAIResponse(message: string): string {
  const m = message.toLowerCase();

  // ── APP MODULES ──────────────────────────────────────────────────────────────

  if (m.includes("dashboard")) {
    return "📊 **Dashboard Module**\n\nYour financial command center. Sections include:\n• **NAV Card** – Total portfolio value across all 8 asset types\n• **Asset Allocation Pie** – Visual breakdown by asset class\n• **Investment Categories Bar** – Invested vs Current Value\n• **Goals Progress** – Top 5 goals with status badges\n• **6-Month Budgeting Comparison** – Planned vs Actual spend\n• **Risk vs Return Scatter** – Holdings plotted by volatility vs return\n• **20-Year Forecast Table** – Projected growth by asset class (horizontally scrollable)\n• **Mini Pie Charts** – Holdings breakdown per asset category\n\n💡 All data auto-updates as you add holdings, goals, and budget entries. No seed data – add your own investments to populate charts.";
  }

  if (
    m.includes("goal") &&
    !m.includes("fire") &&
    !m.includes("retirement goal")
  ) {
    return "🎯 **Goals Module**\n\nSet and track your financial targets:\n1. Click **Add Goal** → Name, Target Amount, Date, Priority (1-5), Inflation Rate\n2. Goals table shows: Target, Date, Priority, Linked Investments, Current Value, Months Left, SIP advice, Progress %\n3. Click the **link icon** on any goal row → **Link Investments** dialog groups all portfolio holdings by asset type (Retiral, Equity, MF, etc.)\n4. Check investments to link → click **Link Investments** button\n5. Linked investment current values auto-calculate **progress %** and **Current Savings** in the top panel\n\n**Analytics charts:** Achievement Quality pie, Savings Adequacy bar, Goal Diversification by time horizon\n\n💡 Link your EPF/NPS to your Retirement goal and Equity SIPs to your House Down Payment goal for automatic tracking!";
  }

  if (
    (m.includes("portfolio") || m.includes("holding")) &&
    !m.includes("model portfolio")
  ) {
    return "💼 **Portfolio Module**\n\nTracks 8 asset types with full CRUD:\n• **Retiral** – PPF, NPS, EPF, LIC, Pension, Gratuity, Superannuation\n• **Equity (ETF/Stocks)** – Large/Mid/Small Cap, Factor, Multi Cap\n• **Mutual Fund** – Large/Mid/Small/Flexi/Multi/Index/Debt/Hybrid/ELSS/Liquid/Balance Advantage\n• **Crypto** – Large/Mid/Small/Micro Cap, Stablecoin, Memecoin\n• **Commodity** – Gold, Silver, Platinum, Gold ETF, Silver ETF\n• **Real Estate** – Residential, Commercial, Land\n• **Fixed Income** – FD, Bonds, Post Office, Cash\n• **Other** – IPO, PMS, SIF, Startup, P2P Lending, Invoice Discounting\n\n**Adding holdings:** Enter Name/Ticker + Category. Auto-calculation logic:\n→ Quantity + Buy Price → Invested auto-fills\n→ Quantity + Invested → Buy Price auto-fills\n→ Same for Market Price ↔ Current Value\n\n**Overview Tab:** Consolidated table (Invested, Current Value, Gain/Loss, % Gain/Loss, % Allocation) + horizontal bar chart + Equity/MF cap distribution pie charts.\n\nAll tables: sortable columns, Allocation %, Gain/Loss split into value and %.";
  }

  if (m.includes("budget") || m.includes("expense")) {
    return "💰 **Budgeting Module**\n\n• Categories grouped as **Income** (Salary, Business, Freelance, Investment Returns, Rental, Other) and **Expenses** (Housing, Food, Transport, Healthcare, Entertainment, etc.)\n• Select a month → add/edit **planned amounts** per category\n• Enter actuals to see variance\n• **Monthly Tracker** – each month can have different planned amounts; add or remove entries month-wise\n• Charts: 6-month income vs expense trends, expense by category, monthly savings rate\n\n**Best practices:**\n• Use 50-30-20 rule: 50% needs, 30% wants, 20% savings\n• Set planned income = take-home salary\n• Update actuals weekly for accurate tracking\n\n💡 The Budgeting module feeds the Dashboard 6-month comparison chart automatically.";
  }

  if (
    m.includes("financial model") ||
    (m.includes("model") &&
      (m.includes("tab") || m.includes("module") || m.includes("learn")))
  ) {
    return "📚 **Financial Model Module**\n\nA beginner-to-expert investor education platform. 6 tabs:\n\n**1. Insurance (Beginner)**\n• Term insurance sizing (HLV method: 20-25x annual income)\n• Health cover requirements (₹10-15L individual, ₹20-25L family)\n• IRDAI guidelines, never mix insurance with investment\n\n**2. Asset Allocation (Beginner)**\n• Age-based allocation models (100-Age rule)\n• Risk profile allocation: Conservative / Moderate / Aggressive\n• India historical returns by asset class\n\n**3. Model Portfolio**\n• Sample portfolios for each risk profile\n• Factor investing (Value, Momentum, Quality, Low Volatility)\n• India strategy: Nifty 50 core + satellite funds\n\n**4. Retirement**\n• FIRE Number calculator (Annual Expenses × 25)\n• 4% Safe Withdrawal Rate (Bengen Rule)\n• NPS + PPF + Equity MF retirement combination\n\n**5. Crypto**\n• DCA strategy calculator\n• 4-phase market cycle education\n• Never invest > 5-10% of portfolio in crypto\n\n**6. Fundamentals**\n• Compounding, Rule of 72, SIP vs Lump Sum, CAGR, Inflation Impact\n• Nifty P/E valuation zones, India benchmark returns\n• Diversification and risk-return fundamentals (MPT)";
  }

  if (
    m.includes("financial planner") ||
    m.includes("35 calculator") ||
    (m.includes("calculator") && !m.includes("fire"))
  ) {
    return "🔢 **Financial Planner – 35+ Calculators**\n\n**Investments (7 calculators):**\n• SIP Planner (with Annual Step-Up %)\n• SWP Planner (Systematic Withdrawal Plan + Step-Up)\n• Lump Sum Growth Calculator\n• CAGR Calculator\n• Mutual Fund Returns\n• Stock/ETF Returns\n• Goal-based Investment\n\n**Loans & EMI (7 calculators):**\n• Home Loan EMI\n• Car Loan EMI\n• Personal Loan EMI\n• Loan Amortization Schedule\n• Balance Transfer Savings\n• Prepayment Impact\n• Loan Comparison\n\n**Savings & Deposits (8 calculators):**\n• Fixed Deposit (FD)\n• Recurring Deposit (RD)\n• PPF Maturity\n• NPS Maturity\n• Emergency Fund Planner\n• Debt-to-Income Ratio\n• Savings Growth\n• Senior Citizen Savings Scheme\n\n**Retirement (5 calculators):**\n• FIRE Number (Financial Independence)\n• Retirement Corpus\n• Pension Planning\n• Annuity Returns\n• Post-Retirement SWP\n\n**Tax Planning (4 calculators):**\n• 80C Deduction Optimizer\n• 80D Health Premium\n• LTCG/STCG Tax\n• Old vs New Tax Regime Comparison\n\n**Goal Planning (4 calculators):**\n• Education Fund\n• Wedding/Marriage Fund\n• House Down Payment\n• Vehicle Purchase\n\n💡 Use the search bar to find any calculator instantly. 8 calculators include live charts.";
  }

  if (
    m.includes("learn finance") ||
    m.includes("financial rules") ||
    (m.includes("rules") && m.includes("tab"))
  ) {
    return "🎓 **Learn Finance Module**\n\nThree tabs to build financial literacy:\n\n**1. Basics**\nFoundational concepts: compounding, inflation, risk, asset classes, diversification, emergency fund, net worth calculation\n\n**2. Rules**\nFilter by level: **Beginner → Intermediate → Advanced → Expert**\n• Each rule is actionable and backed by financial research\n• Examples: Pay yourself first (Beginner), Tax-loss harvesting (Advanced), Factor investing (Expert)\n• Follow rules progressively as your financial knowledge grows\n\n**3. My Rules (AI Recommendations)**\n• Select your risk profile: Conservative / Moderate / Aggressive\n• AI suggests 8 relevant rules aligned to your profile\n• See alignment score for each rule\n• One-click to add rules to your personal My Rules list\n\n💡 Start with Basics → master Beginner rules → progress to Expert over 6-12 months.";
  }

  if (m.includes("loan") || (m.includes("emi") && !m.includes("calculator"))) {
    return "🏦 **Loans Module**\n\nTrack all borrowings in one place:\n• **Personal, Home, Car, Other** loan types\n• See outstanding balance, EMI, interest paid vs principal\n• Track tenure and remaining months\n• Understand total interest cost over loan life\n\n**EMI formula:** EMI = P × r × (1+r)^n / ((1+r)^n - 1)\nwhere P = principal, r = monthly rate, n = tenure months\n\n**Debt management priority:**\n1. Credit card (36-40% interest) – pay off immediately\n2. Personal loans (12-20%)\n3. Car loans (8-12%)\n4. Home loan (8-9%) – leverage tax benefits, invest surplus\n\nUse **Financial Planner → Loans & EMI** for 7 loan calculators including amortization schedule and prepayment impact.";
  }

  // ── FINANCIAL PLANNER CALCULATORS (Deep Dives) ──────────────────────────────

  if (m.includes("sip") && !m.includes("swp")) {
    return "📈 **SIP Calculator & Strategy**\n\n**How SIP works:** Invest a fixed amount monthly. Units bought at lower NAV when markets fall (Rupee Cost Averaging).\n\n**SIP with Step-Up (in Financial Planner):**\nIncrease SIP by a fixed % annually. Example:\n• ₹10K/month SIP for 20 years at 12% = ₹98L\n• ₹10K/month with 10% annual step-up = ₹1.9 Crore!\n\n**Power numbers:**\n• ₹5K/month × 12% × 20 years = ₹50L\n• ₹10K/month × 12% × 20 years = ₹1 Crore\n• ₹20K/month × 12% × 20 years = ₹2 Crore\n\n**Best SIP strategies:**\n1. Start as early as possible\n2. Increase SIP every April (salary hike time)\n3. Never stop SIP during market crashes – buy more units!\n4. Use **SIP Planner** in Financial Planner to model step-up scenarios.";
  }

  if (m.includes("swp") || m.includes("systematic withdrawal")) {
    return "💸 **SWP – Systematic Withdrawal Plan**\n\nSWP lets you withdraw a fixed amount from your mutual fund corpus every month – essentially a self-made pension.\n\n**How to use SWP Planner (Financial Planner):**\n1. Enter your corpus amount\n2. Set monthly withdrawal amount\n3. Set expected return rate (8-12% for balanced funds)\n4. Choose Step-Up % to increase withdrawals annually (for inflation)\n5. See how long corpus lasts\n\n**Safe Withdrawal Rate:**\n• 4% annual withdrawal = corpus lasts forever theoretically\n• For 30-year retirement on ₹1 Crore: withdraw ₹4L/year = ₹33K/month\n\n**Best funds for SWP:** Balanced Advantage Funds, Equity Savings Funds\n\n💡 Combine SWP with NPS annuity and PPF withdrawals for a diversified retirement income.";
  }

  if (m.includes("fire") || m.includes("financial independence")) {
    return "🔥 **FIRE – Financial Independence, Retire Early**\n\n**FIRE Number = Annual Expenses × 25** (based on the 4% rule)\n\n**Types of FIRE:**\n• **Lean FIRE** – Frugal lifestyle, ₹1-2 Crore corpus\n• **Regular FIRE** – Normal lifestyle, ₹3-5 Crore corpus\n• **Fat FIRE** – Comfortable lifestyle, ₹5 Crore+ corpus\n• **Barista FIRE** – Semi-retire with part-time income\n\n**FIRE Formula:**\nMonthly Expenses = ₹50K → Annual = ₹6L → FIRE Number = ₹1.5 Crore\n\n**FIRE Timeline (at 70% savings rate, 12% return):** ~10-12 years\n\n**FIRE Strategy:**\n• Save 50-70% of income\n• 70-80% in equity (Nifty 50 Index + Mid Cap)\n• 10-15% in gold (inflation hedge)\n• 10-15% in debt (stability)\n\nUse **FIRE Calculator** in Financial Planner → Retirement tab to find your exact FIRE date.";
  }

  if (m.includes("ppf")) {
    return "🏛️ **PPF (Public Provident Fund)**\n\n• **Returns:** 7.1% p.a. (government-set, tax-free)\n• **Tax status:** EEE – Exempt on contribution (80C), Exempt on interest, Exempt on maturity\n• **Lock-in:** 15 years (partial withdrawal from year 7)\n• **Annual limit:** ₹1.5 Lakh (qualifies for 80C)\n• **Risk:** Zero (government-backed)\n\n**Optimal strategy:** Invest ₹1.5L on April 1st every year to maximize interest for that year.\n\n**PPF Maturity Calculator** in Financial Planner:\n• ₹1.5L/year × 15 years at 7.1% = ~₹40.7 Lakhs\n• Extend in 5-year blocks after 15 years for compounding power\n\n**Compare:** PPF gives guaranteed 7.1% tax-free vs FD at 7% but fully taxable (effective ~5% for 30% slab).";
  }

  if (m.includes("nps")) {
    return "🎯 **NPS (National Pension System)**\n\n• **Returns:** 9-11% historically (equity-heavy allocation)\n• **Tax benefits:** ₹1.5L u/s 80C + ₹50K additional u/s 80CCD(1B) = total ₹2L deduction\n• **Withdrawal:** 60% lump sum (tax-free) + 40% mandatory annuity at age 60\n• **Lock-in:** Until age 60\n\n**Tier 1 vs Tier 2:**\n• Tier 1 = retirement account (locked), tax benefits\n• Tier 2 = flexible savings (withdraw anytime, no tax benefit)\n\n**Asset allocation:**\n• **Auto choice (Lifecycle Fund):** Reduces equity automatically by age\n• **Active choice:** Up to 75% equity until age 50, then reduces\n\n**NPS Calculator** in Financial Planner: Enter monthly contribution, expected return, years to retirement → see corpus + monthly pension estimate.";
  }

  if (m.includes("epf") || m.includes("provident fund")) {
    return "💼 **EPF (Employee Provident Fund)**\n\n• **Contribution:** 12% of basic salary (employee) + 12% (employer – split into 8.33% EPS + 3.67% EPF)\n• **Interest:** 8.15% p.a. (2023-24), compounded annually\n• **Withdrawal:** Tax-free after 5 years of continuous service\n• **UAN:** Universal Account Number – link Aadhaar for easy management\n\n**VPF (Voluntary PF):** Contribute beyond 12% at same 8.15% rate. Best guaranteed-return debt instrument after PPF.\n\n**EPFO Pension (EPS):** After 10 years of service, eligible for ₹1K-7.5K/month pension at 58. Not significant – don't rely on it alone.\n\nTrack EPF in **Portfolio → Retiral** to include in net worth. Use EPF Corpus Calculator in **Financial Planner → Savings**.";
  }

  if (m.includes("fd") || m.includes("fixed deposit")) {
    return "🏦 **Fixed Deposit (FD)**\n\n**FD Calculator** in Financial Planner → Savings & Deposits:\n• Simple and compound interest options\n• Quarterly/monthly/annual compounding\n• TDS deduction calculation\n\n**Current FD rates (2024):** SBI ~7%, HDFC ~7%, Small Finance Banks up to 9%\n\n**Pros:** Capital safety (up to ₹5L insured by DICGC), predictable returns\n**Cons:** Taxable as income (at your slab rate), barely beats inflation after tax\n\n**FD vs Alternatives (3+ year horizon):**\n• Debt Mutual Funds → better tax efficiency with indexation\n• Corporate Bonds → 7-9% with credit risk\n• Arbitrage Funds → equity taxation (~15% STCG), FD-like returns\n\nTrack FDs in **Portfolio → Fixed Income** module.";
  }

  if (m.includes("rd") || m.includes("recurring deposit")) {
    return "💳 **Recurring Deposit (RD)**\n\nSimilar to SIP but for bank deposits. Fixed monthly deposit for a fixed tenure.\n\n**RD Calculator** in Financial Planner:\n• Maturity = P × n + P × n(n+1)/24 × r/100 (approximately)\n• Current rates: ~6.5-7.5% (similar to FD rates)\n\n**Better alternatives for monthly investing:**\n• **Liquid Mutual Fund** – better returns (~7-7.5%), fully liquid, lower tax for 30% bracket\n• **Debt Fund RD** – invest in ultra-short or liquid fund monthly for higher post-tax returns\n\n💡 Use RD only for short-term goals (< 1 year) where capital safety is paramount.";
  }

  if (m.includes("lump sum") || m.includes("lumpsum")) {
    return "💵 **Lump Sum vs SIP – When to Use What**\n\n**Lump Sum Calculator** in Financial Planner:\nFV = PV × (1 + r)^n\n\n**Use Lump Sum when:**\n• You receive a bonus, inheritance, or maturity proceeds\n• Markets are significantly undervalued (Nifty P/E < 18)\n• Investing in low-volatility assets (debt, gold)\n\n**Use SIP when:**\n• Regular monthly income\n• Equity investing (rupee cost averaging benefits)\n• You don't want to time the market\n\n**Hybrid strategy for large corpus:**\nReceived ₹10L? → Invest ₹3L lump sum immediately + ₹50K/month SIP for 14 months\nThis reduces timing risk while putting capital to work.\n\n**Key insight:** Over 15+ years, SIP and lump sum return similar CAGR in Nifty 50. SIP wins during volatile markets.";
  }

  if (m.includes("cagr")) {
    return "📐 **CAGR Calculator**\n\n**Formula:** CAGR = (End Value / Start Value)^(1/Years) – 1\n\n**India Historical Benchmarks:**\n| Asset | 20-Year CAGR |\n|-------|-------------|\n| Nifty 50 | 13-15% |\n| Nifty Midcap 150 | 16-18% |\n| Gold | 10-11% |\n| Real Estate | 8-10% |\n| FD | 6-7% |\n| Inflation | 5-6% |\n\n**In Financial Planner:** Enter start value, end value, years → get CAGR + benchmark comparison chart\n\n**Using CAGR to evaluate:** Your mutual fund showing 18% 3-year CAGR sounds great but compare vs Nifty 50 CAGR for the same period. If Nifty returned 20%, your fund underperformed.";
  }

  if (
    m.includes("80c") ||
    m.includes("section 80") ||
    m.includes("tax saving") ||
    m.includes("tax plan")
  ) {
    return "💸 **Tax Planning – Section 80C & Beyond**\n\n**Section 80C (₹1.5L limit):**\n• ELSS MF (3-year lock-in, market returns) – best for wealth creation\n• PPF (15 years, 7.1%, EEE) – best for guaranteed returns\n• EPF employee contribution (auto-deducted)\n• NPS Tier 1 (included in 80C)\n• LIC premium, 5-year FD, NSC, SCSS\n• Home loan principal repayment\n• Children's tuition fees\n\n**Section 80D (Health Insurance):**\n• ₹25K for self/family + ₹25K for parents (< 60 years)\n• ₹50K for parents (60+ years) – total up to ₹75K deduction\n\n**Section 80CCD(1B):** Additional ₹50K for NPS Tier 1\n\n**Capital Gains:**\n• LTCG Equity (held > 1 year): 10% on gains > ₹1L/year (as of FY24)\n• STCG Equity (held < 1 year): 15%\n• Debt MF: As per income slab\n\n**Old vs New Tax Regime Calculator** in Financial Planner:\n• Old regime better if total deductions > ₹3.75L (for ₹15L+ income)";
  }

  if (
    m.includes("old.*new.*tax") ||
    m.includes("new.*old.*tax") ||
    m.includes("tax regime")
  ) {
    return "⚖️ **Old vs New Tax Regime**\n\n**New Regime (default from FY24-25):**\n• Lower slab rates, no exemptions\n• Standard deduction: ₹75K\n• Rebate u/s 87A: No tax up to ₹7L income\n\n**Old Regime:**\n• Higher rates but allows all deductions\n• 80C (₹1.5L), 80D (₹25-75K), HRA, NPS 80CCD(1B) (₹50K), Home loan interest (₹2L), etc.\n\n**When Old Regime wins:**\n• Your total deductions exceed ₹3.75L (₹15L income bracket)\n• You maximize 80C + NPS + HRA + home loan\n\n**When New Regime wins:**\n• Income < ₹7L (zero tax with rebate)\n• You don't have many deductions/investments\n• Simpler filing\n\nUse **Old vs New Tax Regime Calculator** in Financial Planner → Tax Planning for your exact numbers.";
  }

  if (m.includes("ltcg") || m.includes("stcg") || m.includes("capital gain")) {
    return "📊 **Capital Gains Tax**\n\n**Equity & Equity MF:**\n• **STCG** (held < 1 year): 15% flat\n• **LTCG** (held ≥ 1 year): 10% on gains > ₹1L/year (no indexation)\n\n**Debt MF / Bonds (from April 2023):**\n• All gains taxed as per income slab (no LTCG benefit)\n• Makes FD and debt MF tax treatment similar now\n\n**Real Estate:**\n• **STCG** (held < 2 years): As per slab\n• **LTCG** (held ≥ 2 years): 20% with indexation benefit\n\n**Gold ETF / Physical Gold:**\n• **STCG** (< 3 years): As per slab\n• **LTCG** (≥ 3 years): 20% with indexation\n\n**Tax Harvesting Strategy:** Book equity LTCG of ₹1L every March (tax-free limit) and reinvest to reset cost basis.\n\nUse **LTCG/STCG Calculator** in Financial Planner → Tax Planning.";
  }

  if (
    m.includes("home loan") ||
    m.includes("house loan") ||
    m.includes("mortgage")
  ) {
    return "🏠 **Home Loan Planning**\n\n**Home Loan EMI Calculator** in Financial Planner:\nEMI = P × r × (1+r)^n / ((1+r)^n – 1)\n\nExample: ₹50L loan, 8.5% for 20 years → EMI = ₹43,391\nTotal interest paid = ₹54.1L (more than principal!)\n\n**Key rules:**\n• EMI should not exceed 30-35% of take-home salary\n• Pay 20% down payment to avoid PMI and get lower rates\n• Every ₹1L prepayment in year 1 saves ~₹3-4L in interest\n\n**Tax benefits:**\n• Principal repayment: 80C (up to ₹1.5L)\n• Interest: Section 24b (up to ₹2L for self-occupied)\n\n**Loan Amortization:** Use amortization schedule to see month-by-month interest vs principal split. In early years, 80%+ of EMI is interest!\n\n**Prepayment Impact Calculator:** See how even ₹50K/year prepayment drastically reduces tenure and total interest.";
  }

  if (m.includes("emergency fund")) {
    return "🆘 **Emergency Fund**\n\n**Target:** 6 months of total monthly expenses (not income)\n\n**Emergency Fund Planner** in Financial Planner → Savings & Deposits:\n• Enter monthly expenses → get exact target amount\n• Set monthly savings toward emergency fund\n• See months to build full emergency fund\n\n**Where to keep it:**\n✅ Liquid Mutual Fund (best: 7-7.5% return, redeemable in 1 day)\n✅ Savings account (low return but instant access)\n✅ Short-term FD (sweep-in FD for automatic transfer)\n❌ Equity mutual funds (too volatile, market may be down when you need money)\n❌ Physical gold (takes time to sell)\n\n**Build it in this order:**\n1. ₹1L emergency fund immediately (1-month buffer)\n2. Build to 3 months over 6 months\n3. Reach 6-month target within 1-2 years\n4. After that, redirect savings to wealth creation";
  }

  if (
    m.includes("debt.to.income") ||
    m.includes("dti") ||
    (m.includes("debt") && m.includes("ratio"))
  ) {
    return "📉 **Debt-to-Income Ratio**\n\n**Debt-to-Income (DTI) Calculator** in Financial Planner → Savings & Deposits:\n\nDTI = Total Monthly Debt Payments / Gross Monthly Income × 100\n\n**Benchmarks:**\n• < 36% = Healthy (banks prefer this for loans)\n• 36-43% = Manageable but watch out\n• > 43% = Danger zone – aggressively pay down debt\n• < 20% = Excellent financial health\n\n**Include in debt payments:** EMIs for all loans, credit card minimum payments, personal loan EMIs\n\n**To improve DTI:**\n1. Increase income (salary hike, side income)\n2. Pay off highest-interest loans first (Debt Avalanche method)\n3. Avoid taking new loans until DTI < 36%\n4. Consider Balance Transfer to lower-interest loans";
  }

  if (
    m.includes("education fund") ||
    m.includes("college fund") ||
    m.includes("child")
  ) {
    return "🎓 **Education Fund Planning**\n\n**Education Fund Calculator** in Financial Planner → Goal Planning:\n\n**Current education costs (2024):**\n• IIT/NIT Engineering: ₹8-15L total (4 years)\n• Private Engineering: ₹15-40L\n• MBBS: ₹40L-1 Crore (private)\n• MBA (IIM): ₹20-35L\n• Study abroad (USA/UK): ₹1-2 Crore\n\n**Inflation for education:** 8-10% per year (higher than general inflation!)\n\n**Strategy for 10-year goal:**\n• 60% in equity (Nifty 50 Index + Flexi Cap)\n• 30% in hybrid fund\n• 10% in gold\n• Switch to debt-heavy allocation 2 years before the goal date\n\n**Best instruments:** Sukanya Samriddhi (for girl child, 8.2% tax-free), ELSS SIP, child plan\n\nUse Education Fund Calculator to see exact monthly SIP needed.";
  }

  if (
    m.includes("house.*down") ||
    m.includes("down.*payment") ||
    m.includes("home.*down")
  ) {
    return "🏡 **House Down Payment Planning**\n\n**House Down Payment Calculator** in Financial Planner → Goal Planning:\n\n**Typical down payment:** 20% of property value\n• ₹80L property → ₹16L down payment needed\n• ₹1.5 Crore property → ₹30L down payment needed\n\n**Strategy (5-7 year goal):**\n• 50% in aggressive equity (Mid Cap + Flexi Cap)\n• 30% in balanced hybrid fund\n• 20% in debt/FD for stability\n\n**Monthly SIP calculation:**\nFor ₹20L in 5 years at 12% CAGR: ~₹24,000/month\nFor ₹20L in 7 years at 12% CAGR: ~₹14,500/month\n\n💡 Link your equity SIPs to your House Goal in the Goals module for automatic current value tracking.";
  }

  // ── FINANCIAL LITERACY ────────────────────────────────────────────────────────

  if (m.includes("compounding") || m.includes("compound interest")) {
    return "🚀 **Power of Compounding**\n\nEinstein called it the 8th wonder of the world!\n\n**The magic of time:**\n• ₹1L at 12% for 10 years = ₹3.1L (3x)\n• ₹1L at 12% for 20 years = ₹9.6L (9.6x)\n• ₹1L at 12% for 30 years = ₹29.9L (nearly 30x!)\n\n**Starting early vs starting late:**\n• Start at 25 with ₹5K/month → ₹3.5 Crore at 60 (12% return)\n• Start at 35 with ₹10K/month → ₹1 Crore at 60 (12% return)\n• Starting early and investing HALF monthly amount beats starting late with double!\n\n**Frequency matters:**\n• Annual compounding: ₹1L × (1.12)^10 = ₹3.1L\n• Monthly compounding: ₹1L × (1+0.12/12)^120 = ₹3.3L\n\nExplore this interactively in **Financial Model → Fundamentals → Power of Compounding** tab.";
  }

  if (m.includes("rule of 72")) {
    return "⚡ **Rule of 72 – Quick Doubling Time**\n\n**Formula:** 72 ÷ Return Rate = Years to double your money\n\n**Practical table:**\n| Return | Doubles In |\n|--------|------------|\n| 6% (FD) | 12 years |\n| 8% (Hybrid) | 9 years |\n| 10% (Gold) | 7.2 years |\n| 12% (Nifty) | 6 years |\n| 15% (Mid Cap) | 4.8 years |\n| 36% (Credit Card) | 2 years! |\n\n**Key insights:**\n• Inflation at 6% halves your money's purchasing power in 12 years\n• Credit card debt at 36% DOUBLES your liability in 2 years – pay it off first!\n• Nifty 50 at 12% doubles money every 6 years\n\nTry the **Rule of 72 Calculator** in Financial Model → Fundamentals tab.";
  }

  if (
    m.includes("50-30-20") ||
    m.includes("50 30 20") ||
    m.includes("budget.*rule")
  ) {
    return "📊 **50-30-20 Budgeting Rule**\n\nSimple framework for allocating take-home income:\n\n**50% Needs:**\n• Rent/Home Loan EMI, Groceries, Utilities (electricity, water, internet)\n• Insurance premiums, Minimum debt payments, Transport\n\n**30% Wants:**\n• Dining out, Entertainment (OTT, cinema), Travel, Shopping\n• Gadgets, Gym, Subscriptions\n\n**20% Savings/Investments:**\n• SIP in mutual funds, PPF contribution, NPS contribution\n• Emergency fund building, Debt prepayment\n\n**Modifications for India:**\n• If you're young (20s): Try 40% savings – you have fewer responsibilities\n• If you have loans: Reduce wants to 15%, allocate 35% to savings+debt repayment\n• If you're near retirement: Increase savings to 30%+\n\nSet up these category targets in the **Budgeting Module** and track actuals monthly.";
  }

  if (m.includes("mutual fund") || m.includes(" mf ")) {
    return "🏦 **Mutual Funds – Complete Guide**\n\n**Equity Funds (High Risk, High Return):**\n• Large Cap – Top 100 companies, stable (~12-14% historical CAGR)\n• Mid Cap – Companies 101-250, higher return (~15-17%)\n• Small Cap – Companies 251+, highest potential, highest volatility (~16-20%)\n• Flexi Cap – Fund manager picks across caps (flexible)\n• ELSS – Tax saving u/s 80C, 3-year lock-in\n• Index Fund – Passive, tracks Nifty/Sensex, lowest expense ratio (0.1-0.2%)\n• Sector/Thematic – IT, Banking, Pharma, Infrastructure (high concentration risk)\n\n**Hybrid Funds (Medium Risk):**\n• Balanced Advantage Fund – Dynamic equity/debt allocation\n• Equity Savings Fund – ~30% equity, rest arbitrage/debt\n• Aggressive Hybrid – 65-80% equity\n\n**Debt Funds (Low Risk):**\n• Liquid Fund – For emergency fund and short-term parking\n• Short Duration / Ultra Short – 1-3 year horizon\n• Corporate Bond – 3+ year horizon\n\n**Key metrics to evaluate:**\n• Expense Ratio (lower is better)\n• Alpha (excess return over benchmark)\n• Sharpe Ratio (risk-adjusted return)\n• Standard Deviation (volatility)\n• Rolling Returns (consistency)";
  }

  if (
    m.includes("index fund") ||
    (m.includes("index") && m.includes("invest"))
  ) {
    return "📊 **Index Funds – The Passive Investing Advantage**\n\n**Why index funds beat most active funds:**\n• ~80-85% of active large cap funds underperform Nifty 50 over 10 years (SPIVA India report)\n• Ultra-low expense ratio: 0.1-0.2% vs 1-2% for active funds\n• No fund manager risk (human bias)\n• Transparent – you know exactly what you own\n\n**Available index options in India:**\n• **Nifty 50** – Core equity exposure (top 50 companies)\n• **Nifty Next 50** – Companies 51-100, mid-cap like returns\n• **Nifty Midcap 150** – Mid cap passive exposure\n• **Nifty 500** – Broad market exposure\n• **S&P 500 (US)** – International diversification\n\n**Recommended core-satellite approach:**\n• Core (60-70%): Nifty 50 Index Fund\n• Satellite (20-30%): Nifty Next 50 / Midcap 150\n• Explore (10%): Thematic / International / Small Cap\n\nWarren Buffett, Jack Bogle, and most evidence-based finance experts recommend index funds for most investors.";
  }

  if (
    m.includes("equity") ||
    m.includes("stock") ||
    m.includes("share") ||
    m.includes("etf")
  ) {
    return "📈 **Equity Investing – Stocks & ETFs**\n\n**Asset types in FinanceOS Portfolio → Equity (ETF/Stocks):**\n• Large Cap ETFs: Nifty BeES, Nifty 50 ETF (Nippon, SBI, HDFC)\n• Mid Cap ETFs: Mirae Asset Nifty Midcap 150\n• Factor ETFs: Nifty Quality 30, Nifty Alpha 50, Momentum ETFs\n\n**Categories available:** Large Cap, Mid Cap, Small Cap, Multi Cap, Factor, Other\n\n**Key principles:**\n• Long-term (7+ years) dramatically reduces equity risk\n• Nifty 50 has NEVER given negative returns on any 10-year rolling basis\n• Diversify across sectors: IT (20%), Banking (30%), FMCG (10%), Pharma (6%)\n• P/E ratio < 20: Undervalued zone; P/E > 25: Overvalued – invest via SIP\n\n**For individual stocks:** Research P/E, PB, ROE, Debt/Equity, Revenue growth. Limit individual stocks to 10-15 companies max.";
  }

  if (m.includes("crypto") || m.includes("bitcoin") || m.includes("ethereum")) {
    return "₿ **Crypto Investing**\n\n**Golden Rules:**\n1. Max 5-10% of total portfolio in crypto\n2. DCA (weekly/monthly fixed investment) – never lump sum in crypto\n3. Only Bitcoin and Ethereum for long-term holds (large cap)\n4. Never invest what you can't afford to lose 100%\n\n**DCA Calculator** in Financial Model → Crypto tab:\n• Simulate weekly DCA over 1-4 years\n• See cost averaging benefit across market cycles\n\n**Crypto Categories (in Portfolio):**\n• Large Cap: Bitcoin, Ethereum\n• Mid Cap: Solana, Cardano\n• Small/Micro Cap: High risk altcoins\n• Stablecoin: USDC, USDT (for parking)\n• Memecoin: Purely speculative – avoid unless you accept total loss\n\n**Tax in India:** Flat 30% on all crypto gains + 1% TDS on each sale > ₹10K. Keep detailed records.\n\n**Market Cycles:** Accumulation → Bull Run → Distribution → Bear Market. Bitcoin halving (every 4 years) historically precedes bull runs.";
  }

  if (m.includes("gold") || m.includes("commodity")) {
    return "🥇 **Gold & Commodities**\n\n**Gold as investment:**\n• Historical CAGR: ~10-11% in India (20-year)\n• Negative correlation with equity – goes up when markets fall\n• Best for: Inflation hedge, portfolio diversification, crisis insurance\n• Recommended allocation: 5-10% of portfolio\n\n**Forms of Gold (Best to Worst):**\n1. **Sovereign Gold Bonds (SGB)** – 2.5% annual interest + capital gains, tax-free on maturity after 8 years (best!)\n2. **Gold ETF** – No storage risk, SIP possible, low cost (0.5% expense ratio)\n3. **Digital Gold** – Convenient but higher charges, counterparty risk\n4. **Physical Gold** – Storage risk, high making charges (5-25%)\n\n**Commodities available in Portfolio:**\n• Gold, Silver, Platinum, Gold ETF, Silver ETF\n\n**Silver:** More volatile than gold, has industrial demand (EV, solar panels). CAGR ~8-9% long-term.";
  }

  if (
    m.includes("insurance") ||
    m.includes("term plan") ||
    m.includes("health insurance")
  ) {
    return "🛡️ **Insurance – Protect Before You Invest**\n\n**Term Insurance (Must Have):**\n• Coverage = 20-25x annual income (Human Life Value method)\n• ₹10L salary → ₹2 Crore term cover\n• Cost: ~₹10-15K/year for ₹1 Crore at age 30 (buy early!)\n• ❌ NEVER buy ULIP, endowment, money-back – they combine insurance + investment = worst of both\n• ✅ Pure term + pure investment is always better\n\n**Health Insurance (Must Have):**\n• Individual: Minimum ₹10-15L cover\n• Family floater: ₹20-25L for family of 4\n• Super top-up: ₹50-1 Crore cover at very low premium (get base plan + super top-up)\n• Key features: Cashless network, pre-existing disease waiting period, no-claim bonus, room rent limit\n\n**HLV Calculator** in Financial Model → Insurance tab:\n• Enter income, years to retirement, existing insurance\n• Get recommended coverage amount\n\n**Priority order:** Term insurance → Health insurance → Emergency fund → Start investing";
  }

  if (m.includes("retire") || m.includes("retirement")) {
    return "🌅 **Retirement Planning**\n\n**How much corpus do you need?**\n• Annual expenses at retirement × 25 (4% withdrawal rule)\n• ₹50K/month expenses at 60 = ₹6L/year × 25 = **₹1.5 Crore corpus**\n\n**Account for inflation:** ₹50K today at 6% inflation = ₹1.6L/month in 20 years!\n• Revised: ₹1.6L × 12 × 25 = ₹4.8 Crore needed\n\n**Building retirement corpus:**\n• NPS (market-linked, ₹2L tax deduction) + PPF (guaranteed, EEE) + Equity MF SIP\n• Rule of thumb: At 30, have 2x annual salary saved; at 40, 4x; at 50, 7x\n\n**Retirement Calculator** in Financial Planner → Retirement tab:\nEnter current age, retirement age, monthly expenses, existing corpus → get required monthly SIP\n\n**Post-retirement income:**\n• NPS annuity (40% of corpus mandatorily)\n• SWP from mutual fund corpus (4% rule)\n• PPF maturity withdrawals\n• Senior Citizen Savings Scheme (SCSS) – 8.2%, quarterly interest";
  }

  // ── PORTFOLIO DESIGN ─────────────────────────────────────────────────────────

  if (
    m.includes("design.*portfolio") ||
    m.includes("portfolio.*design") ||
    m.includes("portfolio.*plan") ||
    m.includes("plan.*portfolio") ||
    m.includes("build.*portfolio") ||
    m.includes("portfolio.*allocat") ||
    m.includes("model.*portfolio") ||
    m.includes("portfolio.*model")
  ) {
    return "🧩 **Portfolio Design – Industry Best Practices**\n\n**Step 1: Determine Risk Profile**\n• Conservative (age 55+, low risk tolerance, capital preservation)\n• Moderate (age 35-55, balanced growth, some volatility accepted)\n• Aggressive (age < 35, high growth, accepts volatility)\n\n**Step 2: Choose Asset Allocation (Modern Portfolio Theory)**\n\n**Conservative Portfolio:**\n• 30% Equity (Large Cap Index + Balanced Hybrid)\n• 50% Debt (PPF, FD, Short Duration Fund)\n• 15% Gold (SGB + Gold ETF)\n• 5% Cash/Liquid Fund\nExpected CAGR: 8-10%\n\n**Moderate Portfolio:**\n• 55% Equity (Nifty 50 Index 30% + Nifty Next 50 15% + Midcap 150 10%)\n• 25% Debt (PPF 15% + Debt MF 10%)\n• 15% Gold (SGB + Gold ETF)\n• 5% International (S&P 500 Index)\nExpected CAGR: 11-13%\n\n**Aggressive Portfolio:**\n• 75% Equity (Large Cap 30% + Mid Cap 20% + Small Cap 15% + International 10%)\n• 10% Debt (PPF/NPS)\n• 10% Gold (Gold ETF/SGB)\n• 5% Crypto (BTC + ETH only)\nExpected CAGR: 13-16%\n\n**Step 3: Rebalance annually** – restore target allocation when any asset class deviates > 5%\n\nSee **Financial Model → Asset Allocation & Model Portfolio** tabs for interactive portfolio builders.";
  }

  if (m.includes("diversif")) {
    return "🌐 **Diversification – Modern Portfolio Theory**\n\n**Why diversify?** Assets with low correlation reduce portfolio volatility without sacrificing returns.\n\n**Correlation Matrix (India):**\n• Equity ↔ Gold: Negative to low (gold rises in equity crises)\n• Equity ↔ Real Estate: Low\n• Equity ↔ Debt: Low negative\n• Within equity (Large ↔ Mid Cap): High (0.7-0.8) – less benefit\n\n**3 Levels of Diversification:**\n1. **Asset class:** Equity, Debt, Gold, Real Estate, Crypto\n2. **Geographic:** India (Nifty) + US (S&P 500) + EM\n3. **Sector:** IT, Banking, Healthcare, FMCG, Infrastructure\n\n**Efficient Frontier (MPT):**\nThe optimal portfolio lies on the efficient frontier – highest return for a given level of risk. Adding uncorrelated assets (like gold to an equity portfolio) moves your portfolio closer to the efficient frontier.\n\nExplore diversification concepts in **Financial Model → Asset Allocation** tab.";
  }

  if (m.includes("rebalance") || m.includes("rebalancing")) {
    return "⚖️ **Portfolio Rebalancing**\n\nRebalancing = restoring your target asset allocation by selling over-allocated assets and buying under-allocated ones.\n\n**Why rebalance?**\n• Markets naturally drift your allocation (equity grew 50% last year → now overweight equity)\n• Rebalancing forces you to sell high and buy low automatically\n• Maintains your risk level as you age\n\n**When to rebalance:**\n• **Annual rebalancing (recommended):** Every April (start of financial year)\n• **Threshold-based:** Rebalance when any asset class deviates > 5% from target\n• **Life events:** Marriage, child birth, job change, approaching retirement\n\n**How to rebalance in FinanceOS:**\n1. Open **Portfolio → Overview** to see current allocation %\n2. Compare vs your target allocation\n3. Identify over/under-allocated asset classes\n4. Redirect new investments to under-allocated classes (or sell + buy)\n\n**Tax-efficient rebalancing:** Use new SIP investments to rebalance rather than selling, to avoid capital gains tax.";
  }

  if (
    m.includes("factor invest") ||
    m.includes("smart beta") ||
    m.includes("momentum") ||
    m.includes("quality.*invest")
  ) {
    return "🔬 **Factor Investing (Smart Beta)**\n\nFactor investing targets specific characteristics (factors) that have historically delivered excess returns.\n\n**Key Factors:**\n• **Momentum** – Stocks/funds with recent price momentum tend to continue. (Nifty Momentum 50 Index)\n• **Value** – Cheap stocks (low P/E, P/B) tend to outperform long-term (Nifty Value 20)\n• **Quality** – High ROE, low debt, stable earnings (Nifty Quality 30)\n• **Low Volatility** – Less volatile stocks outperform on risk-adjusted basis\n• **Size (Small Cap)** – Small caps outperform large caps over very long horizons\n\n**Multi-factor approach (recommended):**\nCombine momentum + quality + value to reduce single-factor risk.\n\n**India ETFs available:**\n• Nifty Alpha 50, Nifty Alpha Low Volatility 30\n• Nifty 100 Quality 30, Nifty200 Momentum 30\n\nExplore factor investing in **Financial Model → Model Portfolio** tab.";
  }

  if (m.includes("risk") && !m.includes("risk.*return")) {
    return "⚖️ **Risk in Investing**\n\n**Types of Risk:**\n• **Market Risk** – Overall market fall (2008, 2020)\n• **Concentration Risk** – Too much in one stock/sector\n• **Liquidity Risk** – Can't sell when needed (real estate, small cap in crashes)\n• **Inflation Risk** – Returns below inflation (FD post-tax)\n• **Credit Risk** – Bond issuer defaults\n• **Currency Risk** – International investments\n\n**Risk Profiles:**\n• **Conservative:** FD, PPF, Debt MF, Sovereign Gold Bonds\n• **Moderate:** Hybrid funds, Large cap equity, Gold ETF\n• **Aggressive:** Mid/Small cap, Crypto, Sector funds\n\n**Risk Mitigation:**\n• Diversify across uncorrelated assets\n• Invest for the long term (equity risk reduces drastically over 10+ years)\n• Maintain emergency fund so you don't have to sell at a loss\n• SIP instead of lump sum in volatile assets\n\nSee your portfolio's **Risk vs Return scatter chart** on the Dashboard.";
  }

  if (m.includes("inflation")) {
    return "📉 **Inflation – The Silent Wealth Killer**\n\n• India average CPI inflation: ~5-6% per year\n• ₹1 Lakh today = ~₹55K purchasing power in 10 years at 6% inflation\n• ₹1 Crore needed in 20 years = ₹3.2 Crore in today's money!\n\n**Inflation Impact Calculator** in Financial Model → Fundamentals:\n• See how ₹X today becomes what in future (nominal vs real value)\n\n**Beating inflation:**\n• Equity (Nifty): 13-15% CAGR > 6% inflation ✅\n• Gold: 10-11% CAGR > 6% inflation ✅\n• FD (6-7%): barely beats inflation, taxable makes it negative in real terms ❌\n• Cash in savings account (3-4%): Always loses to inflation ❌\n\n**Real Return = Nominal Return – Inflation Rate**\nNifty at 13%: Real return = 13% – 6% = **7% real return** (your actual wealth growth)\nFD at 7% for 30% tax slab: After-tax = 4.9%. Real return = 4.9% – 6% = **–1.1%** (wealth destruction!)";
  }

  if (m.includes("real estate") || m.includes("property")) {
    return "🏢 **Real Estate Investing**\n\n**Categories in Portfolio → Real Estate:**\nResidential, Commercial, Land\n\n**Real Estate CAGR:** 8-10% historically in India (but huge variance by location)\n\n**Pros:**\n✅ Tangible asset, sense of ownership\n✅ Rental income (2-3% gross yield typically)\n✅ Leverage (buy ₹1 Crore asset with ₹20L down payment)\n✅ Inflation protection\n\n**Cons:**\n❌ Illiquid (can take months to sell)\n❌ High transaction costs (stamp duty 5-7%, registration 1-2%)\n❌ Black money issue, underdeclared transactions\n❌ Maintenance costs, vacancy risk\n❌ LTCG tax at 20% with indexation\n\n**REITs (Real Estate Investment Trusts):**\n• Trade on stock exchange like shares\n• Minimum investment: ~₹300-500\n• 8-10% distribution yield\n• Embassy REIT, Mindspace REIT, Nexus Select Trust (India)\n\n💡 For most retail investors, REITs > physical real estate for pure investment purposes.";
  }

  if (m.includes("net worth") || m.includes("nav") || m.includes("wealth")) {
    return "📊 **Net Worth – Your Financial Scorecard**\n\n**Net Worth = Total Assets – Total Liabilities**\n\n**Assets (track in FinanceOS Portfolio):**\n• Equity, Mutual Funds, ETFs\n• Crypto, Gold, Commodities\n• Fixed Deposits, PPF, EPF, NPS\n• Real Estate market value\n• Cash and savings accounts\n\n**Liabilities (track in Loans module):**\n• Home loan outstanding\n• Car loan, personal loans\n• Credit card dues\n\n**Net Worth in FinanceOS:**\nDashboard shows total Portfolio NAV (Assets). Add all loans in the Loans module. Net Worth ≈ Portfolio NAV – Total Outstanding Loans\n\n**Net Worth Milestones (India, middle class):**\n• Age 30: 3-4x annual salary\n• Age 40: 6-8x annual salary\n• Age 50: 12-15x annual salary\n• FIRE Target: 25x annual expenses\n\n💡 Track your net worth monthly. Growing net worth = financial progress, even during market volatility.";
  }

  if (
    m.includes("debt") &&
    !m.includes("debt fund") &&
    !m.includes("debt.*income") &&
    !m.includes("debt.*ratio")
  ) {
    return "⚡ **Debt Management**\n\n**Good Debt vs Bad Debt:**\n• 🟢 Good: Home loan (8-9%, appreciating asset, tax benefits)\n• 🟡 Okay: Education loan (invest in yourself, tax deduction u/s 80E)\n• 🔴 Bad: Personal loan (12-24%), Car loan (deprecating asset)\n• 🚨 Danger: Credit card (36-42% interest) – pay off IMMEDIATELY\n\n**Payoff Strategies:**\n• **Debt Avalanche** (mathematically optimal): Pay highest interest rate first\n• **Debt Snowball** (psychologically motivating): Pay smallest balance first\n\n**Priority for extra cash:**\n1. Credit card → full payment every month, no exceptions\n2. Personal loans → prepay aggressively\n3. Car loan → prepay if rate > 10%\n4. Home loan → use tax benefits, prepay with bonuses\n\nTrack all loans in **Loans Module**. Use **Debt-to-Income Ratio Calculator** in Financial Planner.";
  }

  if (
    m.includes("how.*use") ||
    m.includes("help") ||
    m.includes("get started") ||
    m.includes("guide")
  ) {
    return "🗺️ **Getting Started with FinanceOS**\n\n**Recommended flow for new users:**\n\n**Week 1 – Foundation:**\n1. Select your currency on the Landing Page\n2. Log in with Internet Identity\n3. Set up your **Profile** (sidebar bottom) with name and email\n\n**Week 2 – Add Your Data:**\n4. **Portfolio** – Add all current investments by asset type\n5. **Loans** – Add all outstanding loans\n6. **Budgeting** – Set planned amounts for the current month\n\n**Week 3 – Set Goals & Plan:**\n7. **Goals** – Create 3-5 financial goals with target amounts and dates\n8. Link portfolio investments to relevant goals\n9. **Financial Planner** – Use SIP Calculator to find required monthly investment\n\n**Ongoing:**\n10. Update Budgeting actuals monthly\n11. Add new investments as you make them\n12. Review Dashboard monthly\n13. Learn in **Learn Finance** and **Financial Model** at your own pace\n\n💡 Start with the Dashboard after adding investments – all charts auto-populate!";
  }

  // ─── Learn from Mistakes Knowledge Base ─────────────────────────────────────

  // Block 1 — General financial mistakes overview
  if (
    m.includes("learn from mistake") ||
    m.includes("common mistake") ||
    m.includes("financial mistake") ||
    m.includes("money mistake") ||
    (m.includes("mistake") &&
      !m.includes("credit card") &&
      !m.includes("insurance") &&
      !m.includes("invest") &&
      !m.includes("retirement") &&
      !m.includes("diversif") &&
      !m.includes("rebalanc") &&
      !m.includes("net worth") &&
      !m.includes("salary") &&
      !m.includes("lifestyle") &&
      !m.includes("scam") &&
      !m.includes("guaranteed"))
  ) {
    return "⚠️ **Learn from Mistakes – 50 Common Financial Mistakes**\n\nFound in **Learn Finance → Learn from Mistakes** tab. Here are the key categories:\n\n**💸 Spending & Budgeting Mistakes (1-2, 14-15, 27-28, 48)**\n• Not tracking expenses → Use zero-based budgeting; log every rupee\n• Underestimating outflows → Track 2-3 months to reveal true spending\n• No budget/plan → Follow 50/30/20 rule (Needs 50-60%, Wants 30%, Savings 20%)\n• Lifestyle inflation → Cap spending increases; save raises/bonuses first\n• Ignoring small recurring → Audit subscriptions; pay yourself first\n• Impulse buys → 24-48 hour rule before non-essential purchases\n• Treating salary as free money → Follow budget immediately after salary credit\n\n**🏦 Debt & Credit Mistakes (3, 6, 16, 24-25, 30)**\n• Multiple overlapping EMIs → Debt avalanche: pay highest interest first\n• Living lifestyle on EMIs → EMIs ≤ 30-40% of take-home\n• Minimum credit card payment → Pay full balance; 36-42% interest compounds fast\n• Unnecessary debt → Borrow only for appreciating assets\n• Too many credit cards → Keep 2-3 max; close unused\n• Co-signing loans → Never co-sign unless you can pay the full amount\n\n**🏠 Housing & Insurance Mistakes (8-9, 12, 31-32)**\n• Insurance only for tax → Buy term life (15-25x income) + separate health cover\n• Buying home too early → Rent + invest; buy after 35+; EMI ≤ 30% income\n• No health/term insurance → Family floater health + pure term life\n• Mixing insurance with investment → Separate: insurance = protection, MF = growth\n\n**📈 Investment Mistakes (5, 17-20, 33-35, 38-40)**\n• F&O / crypto addiction → Time in market > timing the market\n• Starting investments late → Rule of 72; start with even ₹500/month SIP\n• Ignoring inflation → Target 10-12% return via equities/mutual funds\n• No diversification → Spread across equity, debt, gold, real estate\n• Following herd mentality → Research based on your goals and risk, not tips\n• Waiting for perfect time → SIP monthly regardless of market conditions\n• Spending windfalls → 50% debt/savings, 30% fun, 20% invest\n• Real estate overexposure → Limit to 30-40% of net worth\n• High MF fees → Choose direct plans / index funds (expense ratio <0.5%)\n• Not rebalancing → Rebalance annually: sell winners, buy laggards\n\n**🏥 Retirement & Goals Mistakes (4, 10, 21, 41-42)**\n• No emergency fund → Build 3-12 months' liquid savings\n• Children as retirement plan → Build independent retirement corpus\n• No retirement planning → Save 15-20%+ income; automate to retirement accounts\n• Borrowing from future self → Build emergency buffer first\n• No financial goals → Set SMART goals linked to specific targets\n\n**📊 Mindset & Other Mistakes (7, 11, 13, 44-50)**\n• Avoiding family money talks → Regular check-ins with partner/family\n• Chasing shortcuts → Small daily habits compound\n• Avoiding the mirror → Monthly net worth review\n• Social pressure spending → Spend on values, not status symbols\n• Not tracking net worth → Quarterly: Assets − Liabilities = progress\n• Guaranteed returns scams → If too good to be true, avoid; stick to regulated options\n• Neglecting skills → Continuous learning = higher earning potential\n\n💡 Open **Learn Finance → Learn from Mistakes** to explore all 50 with linked rules.";
  }

  // Block 2 — Expense tracking / budget mistakes
  if (
    (m.includes("track") && m.includes("expense")) ||
    m.includes("zero-based budget") ||
    m.includes("zero based budget") ||
    m.includes("monthly outflow")
  ) {
    return '📝 **Expense Tracking Mistakes**\n\n**Mistake #1:** Not tracking expenses at all\n→ Fix: Zero-based budgeting — assign every rupee a job. Track in Budgeting module.\n\n**Mistake #2:** Underestimating real monthly outflows\n→ Fix: Track ALL outflows for 2-3 months before budgeting. Most people underestimate by 20-30%.\n\n**Mistake #27:** Ignoring small recurring expenses\n→ Fix: Audit subscriptions/apps quarterly. ₹500/month in unused subscriptions = ₹6,000/year wasted.\n\n**Mistake #48:** Treating salary as "free money" post-tax\n→ Fix: Apply the 50/30/20 budget rule the same day salary is credited.\n\n💡 Use **Budgeting → Plan Budget** to set planned amounts, then **Track Income & Expense** to log actuals. The gap = your leakage.';
  }

  // Block 3 — Credit card mistakes
  if (
    m.includes("credit card") &&
    (m.includes("mistake") ||
      m.includes("minimum") ||
      m.includes("interest") ||
      m.includes("too many"))
  ) {
    return "💳 **Credit Card Mistakes**\n\n**Mistake #16:** Paying only the minimum due\n→ Credit cards charge 36-45% annual interest on the outstanding balance.\n→ Fix: Pay full statement balance every month, no exceptions.\n→ ₹50,000 balance at 36% = ₹18,000/year in interest alone.\n\n**Mistake #25:** Having too many credit cards\n→ Too many cards = temptation, complexity, and credit score management overhead.\n→ Fix: Keep 2-3 cards max — one for rewards, one backup.\n\n**Key rule:** Never use credit cards as income supplements. They are convenience tools, not credit lines.\n\n💡 Track credit card repayments in **Loans Module**. Use **Credit Card Payoff Calculator** in Financial Planner to find your payoff timeline.";
  }

  // Block 4 — Insurance mistakes
  if (
    m.includes("insurance") &&
    (m.includes("mistake") ||
      m.includes("wrong") ||
      m.includes("mix") ||
      m.includes("tax saving"))
  ) {
    return "🛡️ **Insurance Mistakes**\n\n**Mistake #8:** Buying insurance only for tax saving\n→ ULIPs, endowment plans, and money-back policies combine insurance + investment poorly.\n→ Fix: Buy pure **term life insurance** (15-25x annual income) for protection.\n→ Invest separately in mutual funds for growth.\n\n**Mistake #12:** No health/term insurance for self or parents\n→ Medical inflation = 10-15% per year. One hospitalisation can wipe 2-3 years of savings.\n→ Fix: ₹10-15L individual health cover + ₹20-25L family floater + term life.\n\n**Mistake #31:** Not having life insurance (pure term)\n→ Term policy = 10-20x annual expenses at 20s/30s age = very low premium.\n\n**Mistake #32:** Mixing insurance with investment\n→ These are separate tools. Insurance = protection. Mutual Funds = growth.\n→ Surrender low-yield LIC/ULIP and reinvest in index funds.\n\n💡 Use **Financial Model → Insurance tab** to calculate your exact term insurance and health cover requirements.";
  }

  // Block 5 — Investment delay / starting late
  if (
    m.includes("start invest") ||
    m.includes("invest late") ||
    m.includes("delay invest") ||
    m.includes("when invest") ||
    (m.includes("late") && m.includes("invest"))
  ) {
    return "⏰ **Mistake #17: Delaying Investments / Starting Late**\n\nThis is one of the most costly mistakes due to the **power of compounding**.\n\n**The numbers:**\n• Start at 25: ₹5,000/month SIP at 12% → ₹1.76 Cr at 55 (30 years)\n• Start at 35: ₹5,000/month SIP at 12% → ₹49.9 L at 55 (20 years)\n• **Waiting 10 years costs you ₹1.26 Cr — 3.5x more wealth lost than invested**\n\n**Rule of 72:** Money doubles every ≈ 6 years at 12% return.\n• ₹1L at 25 → ₹2L at 31 → ₹4L at 37 → ₹8L at 43 → ₹16L at 49 → ₹32L at 55\n\n**Fix:**\n1. Start with ANY amount today — even ₹500/month\n2. Use SIP (auto-debit) so emotions don't stop you\n3. Increase SIP by 10% every year (Step-Up SIP)\n4. Never stop SIP during market falls — that's when you buy more units cheaply\n\n💡 Use **SIP Calculator** in Financial Planner to see your exact wealth projection.";
  }

  // Block 6 — Retirement planning mistakes
  if (
    (m.includes("retirement") && m.includes("mistake")) ||
    (m.includes("retire") && m.includes("plan") && m.includes("mistake"))
  ) {
    return "🌅 **Retirement Planning Mistakes**\n\n**Mistake #21:** No retirement planning at all\n→ Fix: Save 15-20%+ of income. NPS + PPF + Equity MF combination works well.\n→ FIRE Number = Annual Expenses × 25. Use 4% safe withdrawal rate.\n\n**Mistake #10:** Treating children as retirement plan\n→ Fix: Build your own retirement corpus independent of children's support.\n→ Have an open family conversation about mutual support expectations.\n\n**Mistake #22:** Over-relying on conservative investments\n→ FDs and PPF alone won't beat inflation over 30 years.\n→ Fix: Age-based allocation: (100 - your age)% in equities.\n→ At 30: 70% equity, 30% debt. At 50: 50% equity, 50% debt.\n\n**Mistake #9:** Buying home too early (20s/early 30s)\n→ Buying too early locks capital, reduces liquidity, and often leads to EMI overload.\n→ Fix: Rent + invest until 35+. Aim for EMI ≤ 30% of take-home income.\n\n💡 Use **Financial Model → Retirement tab** and **FIRE Calculator** in Financial Planner.";
  }

  // Block 7 — Diversification / portfolio mistakes
  if (
    (m.includes("diversif") ||
      m.includes("all eggs") ||
      m.includes("rebalanc")) &&
    m.includes("mistake")
  ) {
    return "📊 **Portfolio & Diversification Mistakes**\n\n**Mistake #19:** Not diversifying investments\n→ Concentration in one asset = higher risk without proportional reward.\n→ Fix: Spread across equity, debt, gold, real estate per your risk profile.\n→ Use **3-Fund Portfolio**: Nifty 50 Index + Midcap + Debt Fund.\n\n**Mistake #38:** Overexposure to real estate\n→ Real estate is illiquid. 1 property = 40-60% of net worth for many Indians.\n→ Fix: Cap real estate at 30-40% of net worth. Maintain liquidity.\n\n**Mistake #39:** Paying high fees on mutual funds\n→ Regular plan vs Direct plan: 0.5-1% higher expense ratio = massive loss over 20 years.\n→ Fix: Switch to Direct plans. Choose index funds (expense ratio 0.05-0.2%).\n→ ₹50L portfolio: Direct plan saves ₹5-10L over 20 years vs regular plan.\n\n**Mistake #40:** Not rebalancing portfolio\n→ Fix: Rebalance annually. Sell outperformers, buy underweighted assets.\n→ Maintains target allocation and enforces buy-low-sell-high discipline.\n\n**Mistake #20:** Following tips/herd mentality\n→ Fix: Invest based on your goals, risk tolerance, and time horizon — not WhatsApp tips.\n\n💡 Use **Portfolio Overview tab** to see your current allocation. Check **Financial Model → Asset Allocation** for target allocations.";
  }

  // Block 8 — Net worth tracking mistake
  if (m.includes("net worth") && m.includes("mistake")) {
    return "📊 **Mistake #45: Not Tracking Net Worth**\n\nMost people track income and expenses but ignore the most important number: **Net Worth = Assets − Liabilities**.\n\n**Why it matters:**\n• It's your financial score — the only number that shows if you're truly building wealth\n• Identifies hidden liabilities you've ignored\n• Motivates you when you see it grow year over year\n\n**How to calculate:**\nAssets: Portfolio value + Real estate value + Bank balances + Gold + PF/NPS\nLiabilities: Home loan outstanding + Car loan + Personal loan + Credit card dues\n\n**Fix:** Review quarterly. Track in the **Dashboard** — your NAV card shows total portfolio value.\n\n**Related Mistake #13:** Avoiding the mirror — face your financial reality monthly.\n\n💡 Add all investments in **Portfolio**, all loans in **Loans Module**, and your Dashboard NAV auto-updates.";
  }

  // Block 9 — Salary negotiation / multiple income streams mistake
  if (
    (m.includes("salary") && m.includes("negotiat")) ||
    m.includes("multiple income") ||
    m.includes("side hustle") ||
    (m.includes("income stream") && m.includes("mistake"))
  ) {
    return "💼 **Mistakes #29 & #37: Not Negotiating Salary / No Multiple Income Streams**\n\n**Mistake #29:** Not negotiating salaries or side income\n→ Salary is your biggest wealth-building lever in your 20s-40s.\n→ Every ₹10,000/month raise = ₹1.2L/year more to invest.\n→ At 12% returns: ₹1.2L/year for 20 years = **₹1.08 Cr extra wealth**.\n→ Fix: Research market rates (Glassdoor, LinkedIn). Negotiate at every role change.\n\n**Mistake #37:** Not building multiple income streams\n→ Single income = single point of failure.\n→ Fix: Salary + at least one of: Side hustle/freelance, Dividend income, Rental income.\n→ Even ₹5,000/month passive income = ₹60,000/year = builds a corpus over time.\n\n**3 levels of income diversification:**\n1. **Active:** Salary + freelance / consulting\n2. **Semi-passive:** Rental income, online courses\n3. **Passive:** Dividends, debt fund SWP, REITs\n\n💡 Track all income sources in **Budgeting → Track Income & Expense**.";
  }

  // Block 10 — Scam / guaranteed returns mistake
  if (
    m.includes("scam") ||
    m.includes("guaranteed return") ||
    m.includes("get rich quick") ||
    m.includes("ponzi") ||
    (m.includes("too good") && m.includes("true"))
  ) {
    return '⚠️ **Mistake #46: Falling for "Guaranteed Returns" Scams**\n\nRed flags of financial fraud:\n🚨 "Guaranteed 20-30% annual returns" (legit equity averages 10-12%)\n🚨 "No risk, assured returns" — risk and return are always correlated\n🚨 "Limited time offer" or "exclusive scheme"\n🚨 Recruitment-based earnings (MLM / Ponzi structure)\n🚨 Unlisted / unregulated investment schemes\n\n**Also related — Mistake #5:** F&O and crypto speculation\n→ 90%+ of retail F&O traders lose money (SEBI data).\n→ Crypto extreme volatility — treat as max 5% of portfolio.\n\n**The golden rule:** If it sounds too good to be true, it always is.\n\n**Safe alternatives with good returns:**\n• Index Funds: 10-12% long-term CAGR\n• NPS/PPF: 7-8% tax-advantaged\n• Direct Equity (bluechips): 12-15% long-term\n• REITs: 8-10% yield\n\nAlways verify: SEBI registration, IRDAI license, RBI approval.\n\n💡 Use **Financial Model → Model Portfolio** to design a legitimate high-return portfolio.';
  }

  // Block 11 — Social pressure / lifestyle inflation mistake
  if (
    m.includes("lifestyle inflation") ||
    m.includes("social pressure") ||
    m.includes("lifestyle credit") ||
    (m.includes("wedding") && m.includes("finance")) ||
    m.includes("keeping up")
  ) {
    return '👔 **Lifestyle & Social Pressure Mistakes**\n\n**Mistake #15:** Lifestyle inflation / overspending\n→ Every salary hike gets spent on a bigger car, bigger flat, more dining out.\n→ Fix: "Savings rate, not salary, builds wealth."\n→ When income rises: Save the first 20-30% increase, then lifestyle up on the rest.\n\n**Mistake #44:** Giving in to social pressure (weddings, status symbols)\n→ Big weddings funded by loans = 5-10 years of debt servicing.\n→ "Others\' weddings / cars / holidays" is not your benchmark.\n→ Fix: Spend on what genuinely matters to YOU. Ignore status games.\n\n**Mistake #6:** Living lifestyle on EMIs\n→ EMIs for phones, gadgets, furniture = consumer debt on depreciating items.\n→ Fix: EMIs ≤ 30-40% of take-home. Use cash/debit for non-essentials.\n\n**The 1% Rule for Lifestyle Creep:**\n→ Limit lifestyle upgrade spending to 1% of income increase, save the rest.\n\n💡 Use **Budgeting → Plan Budget** to set hard limits per category before the month begins.';
  }

  // Default fallback
  return "I'm here to help with your financial journey! 🌟\n\nAsk me about any of these topics:\n\n**FinanceOS Modules:**\n• Dashboard, Goals, Portfolio, Budgeting, Loans\n• Financial Model, Financial Planner (35+ calculators), Learn Finance\n\n**Financial Calculators:**\n• SIP / SWP / Lump Sum / CAGR\n• Home Loan EMI / FD / PPF / NPS / RD\n• FIRE Number / Retirement Corpus\n• Tax Planning (80C, LTCG, Old vs New Regime)\n• Emergency Fund / Debt-to-Income Ratio\n• Education Fund / House Down Payment\n\n**Investment Knowledge:**\n• Mutual Funds, Index Funds, Equity, Gold, Crypto, Real Estate\n• Portfolio Design (Conservative / Moderate / Aggressive)\n• Compounding, Rule of 72, Inflation, CAGR\n• Diversification, Rebalancing, Factor Investing\n• Insurance, Tax, Retirement, FIRE strategy\n\nJust ask your question and I'll give you a detailed, actionable answer!";
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
