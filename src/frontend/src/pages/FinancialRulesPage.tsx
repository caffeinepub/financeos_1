import {
  Activity,
  AlertTriangle,
  BarChart,
  BarChart2,
  BookOpen,
  Brain,
  Clock,
  DollarSign,
  Filter,
  GraduationCap,
  LayoutGrid,
  Pencil,
  PieChart,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Shield,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import type { FinancialRule } from "../backend.d";
import { AIRulesAnalysis } from "../components/AIRulesAnalysis";
import { FinancialRulesSection } from "../components/FinancialRulesSection";
import type { FinancialRule as FinancialRuleData } from "../components/FinancialRulesSection";
import { financialRules as ALL_FINANCIAL_RULES } from "../components/FinancialRulesSection";
import { ModelFundamentalsTab } from "../components/financial-model/ModelFundamentalsTab";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useActor } from "../hooks/useActor";

const emptyForm = {
  name: "",
  ruleType: "",
  condition: "",
  threshold: 0,
  action: "",
  isActive: true,
};

const _LEVEL_STEPS = [
  {
    label: "All",
    color: "#64748b",
    bg: "bg-slate-500",
    textColor: "text-slate-600",
  },
  {
    label: "Beginner",
    color: "#16a34a",
    bg: "bg-green-500",
    textColor: "text-green-700",
  },
  {
    label: "Intermediate",
    color: "#2563eb",
    bg: "bg-blue-500",
    textColor: "text-blue-700",
  },
  {
    label: "Advanced",
    color: "#ea580c",
    bg: "bg-orange-500",
    textColor: "text-orange-700",
  },
  {
    label: "Expert",
    color: "#7c3aed",
    bg: "bg-purple-500",
    textColor: "text-purple-700",
  },
];

const BASICS_TOPICS = [
  {
    id: "compounding",
    name: "Compounding",
    desc: "The 8th wonder of the world",
    Icon: TrendingUp,
  },
  {
    id: "rule-of-72",
    name: "Rule of 72",
    desc: "Estimate how fast money doubles",
    Icon: Clock,
  },
  {
    id: "sip-vs-lump",
    name: "SIP vs Lump Sum",
    desc: "Which strategy wins?",
    Icon: BarChart2,
  },
  {
    id: "inflation",
    name: "Inflation Impact",
    desc: "Preserve your purchasing power",
    Icon: Activity,
  },
  {
    id: "cagr",
    name: "CAGR",
    desc: "Measure true investment growth",
    Icon: Target,
  },
  {
    id: "market-cycles",
    name: "Market Cycles",
    desc: "Bull, bear and beyond",
    Icon: BarChart,
  },
  {
    id: "pe-ratio",
    name: "P/E Ratio & Valuation",
    desc: "Is a stock cheap or expensive?",
    Icon: DollarSign,
  },
  {
    id: "diversification",
    name: "Diversification",
    desc: "Don't put all eggs in one basket",
    Icon: BookOpen,
  },
  {
    id: "margin-of-safety",
    name: "Margin of Safety",
    desc: "Buy when Price ≤ ⅔ of intrinsic value",
    Icon: Scale,
    content: `**Margin of Safety** is the central concept of value investing, introduced by Benjamin Graham in The Intelligent Investor (Chapter 20).\n\n**Core Rule:** Only buy a stock when its market price is ≤ ⅔ (67%) of its intrinsic value — whether measured by Earnings Power Value (EPV) or Net Asset Value (NAV).\n\n**Why it works:** It protects against valuation errors, unexpected bad news, and market downturns. If you pay 67 cents for something worth ₹1, you have a built-in cushion.\n\n**Real-world use today:**\n- Used by Warren Buffett, Seth Klarman, and most quantitative value funds\n- Basis of screeners that filter for stocks trading below book value or low P/E\n- EPV model (Bruce Greenwald) and Owner Earnings (Buffett) are modern applications\n\n**Example:** If a company's intrinsic value is ₹150, the Margin of Safety price is ₹100. Only buy at or below ₹100.\n\n**Formula:** MoS Price = Intrinsic Value × 0.67`,
  },
  {
    id: "defensive-portfolio",
    name: "Defensive Investor Portfolio",
    desc: "60/40 or 50/50 stock-bond allocation",
    Icon: PieChart,
    content: `**Defensive Investor Portfolio Allocation** (Chapters 1 & 4 of The Intelligent Investor) is the foundation of modern balanced investing.\n\n**Core Rule:** Allocate between 50% and 75% to stocks, and 25% to 50% to bonds. The classic starting point is 60% stocks / 40% bonds.\n\n**Glide-path model:** As you age, reduce stock allocation and increase bonds. Example: Age 30 → 70/30; Age 50 → 60/40; Age 65 → 40/60.\n\n**Real-world use today:**\n- The "60/40 portfolio" is the industry standard for pension funds and institutional investors\n- Basis of all target-date funds (e.g., 2040 Fund, 2050 Fund)\n- Used by robo-advisors (Betterment, INDmoney, Wealthfront) for automated allocation\n\n**Why it works:** Stocks provide growth; bonds provide stability. The combination reduces volatility without sacrificing long-term returns.\n\n**For Indian investors:** Equivalent in Equity Mutual Funds + Debt Funds / PPF / EPF.`,
  },
  {
    id: "dca",
    name: "Dollar-Cost Averaging (DCA)",
    desc: "Invest fixed amounts at regular intervals",
    Icon: RefreshCw,
    content:
      "**Dollar-Cost Averaging (DCA)** (Chapters 1 & 5) is the practice of investing a fixed amount at regular intervals regardless of market price.\n\n**Core Rule:** Invest the same fixed amount every month (or quarter) into an index fund or diversified portfolio — regardless of whether markets are up or down.\n\n**Why it works:**\n- You buy more units when prices are low, fewer when prices are high\n- Eliminates the impossible task of timing the market\n- Builds discipline and removes emotional decision-making\n\n**Real-world use today:**\n- The mathematical foundation of every SIP (Systematic Investment Plan) in India\n- Core mechanism of 401(k) plans in the US and EPFO in India\n- Used by all index-fund accumulation strategies\n\n**Example:** Investing \u20b910,000/month in a Nifty50 index fund for 20 years, regardless of market conditions, consistently outperforms most active strategies.\n\n**Key insight:** Time in the market beats timing the market. DCA enforces this mathematically.",
  },
  {
    id: "mr-market",
    name: "Mr. Market",
    desc: "Market is emotional — don't follow its mood",
    Icon: Users,
    content: `**Mr. Market** is Benjamin Graham's famous allegory for understanding market behavior and investor psychology.\n\n**The Concept:** Imagine you have a business partner named Mr. Market who offers to buy your shares or sell you his shares every single day. His prices are driven by his mood — euphoric on good days (offers high prices), depressed on bad days (offers low prices).\n\n**Core Lesson:** You are never obligated to trade with Mr. Market. You should only buy from him when he offers irrationally low prices, and sell to him when he offers irrationally high prices.\n\n**Real-world use today:**\n- Underpins all contrarian investing strategies\n- The behavioral finance model behind market-timing avoidance rules\n- Used by quant funds like AQR and Dimensional to exploit momentum and value anomalies\n- Basis of "buy the dip" and "rebalancing during crashes" strategies\n\n**Practical rule:** When markets crash 20-30%, Mr. Market is depressed — that is your opportunity to buy quality assets at a discount, not to panic-sell.\n\n**Key insight:** The market is a voting machine in the short run, but a weighing machine in the long run (Benjamin Graham).`,
  },
  {
    id: "ncav-screen",
    name: "Net-Net Working Capital (NCAV)",
    desc: "Buy stocks below liquidation value",
    Icon: Search,
    content: `**Net-Net Working Capital (NCAV) Screen** is Benjamin Graham's classic deep-value quantitative model for finding severely undervalued stocks.\n\n**Formula:**\nNCAV = Current Assets − Total Liabilities\nBuy when: Market Cap < 67% of NCAV\n\n**Simplified:** If a company could shut down tomorrow, liquidate current assets, and pay all debts — would the remaining cash exceed what you paid for the stock? If yes, you have a net-net.\n\n**Why it works:** You are essentially buying assets for less than their liquidation value — the ultimate margin of safety.\n\n**Real-world use today:**\n- Classic deep-value quant model still used by Graham-style hedge funds\n- Adapted in Joel Greenblatt's Magic Formula (adds return on capital)\n- Used by screeners on value investing platforms globally\n\n**Example:** If a company has ₹100 Cr in current assets, ₹40 Cr in liabilities → NCAV = ₹60 Cr. If market cap is ₹35 Cr (below 67% of ₹60 Cr = ₹40 Cr), it qualifies.\n\n**Caution:** Net-nets often exist for a reason (declining business). Diversify across 20-30 net-nets to reduce single-stock risk.`,
  },
  {
    id: "enterprising-criteria",
    name: "Enterprising Investor Criteria",
    desc: "Multi-factor: size + quality + value + momentum",
    Icon: Filter,
    content: `**Enterprising Investor Positive Criteria** is Graham's framework for active investors willing to put in more research to earn superior returns.\n\n**Core Criteria (all must be met):**\n1. Financial condition: Current ratio ≥ 1.5; Debt ≤ 110% of net current assets\n2. Earnings stability: Positive EPS for 5 consecutive years\n3. Dividend record: Some dividends paid\n4. Earnings growth: Current EPS higher than 5 years ago\n5. Price: P/E ≤ 9× last 12-month earnings\n6. Price-to-book: P/B ≤ 1.2×\n\n**Real-world use today:**\n- Direct predecessor of modern multi-factor investing (Fama-French 3-factor model)\n- Combines size + quality + value + momentum filters\n- Used by systematic value strategies at AQR, Dimensional Fund Advisors, and Research Affiliates\n- Basis of "quantitative value" funds worldwide\n\n**Why it works:** Graham's criteria eliminate financial distress risk while ensuring you pay a fair price. The combination of multiple filters has been shown to consistently outperform the market over 20-year periods.`,
  },
  {
    id: "intrinsic-value-epv",
    name: "Intrinsic Value via Earnings Power",
    desc: "EPV model and Owner Earnings (Buffett)",
    Icon: Zap,
    content: `**Intrinsic Value via Earnings Power** is the most important calculation in value investing — estimating what a business is truly worth.\n\n**Two main approaches:**\n\n**1. Earnings Power Value (EPV) — Bruce Greenwald:**\nEPV = Normalized After-Tax Earnings ÷ Cost of Capital\nExample: If a company earns ₹10 Cr/year consistently and WACC is 10% → EPV = ₹100 Cr\n\n**2. Owner Earnings — Warren Buffett:**\nOwner Earnings = Net Income + Depreciation − Maintenance CapEx − Working Capital Changes\nThis is "real cash" the business generates for its owners.\n\n**Why it matters:**\n- P/E and book value are accounting constructs; Owner Earnings are economic reality\n- Buffett has used this framework to compound at 20%+ for 50 years\n\n**Real-world use today:**\n- EPV model is taught at Columbia Business School (Graham's alma mater)\n- Owner Earnings is the basis of DCF analysis in every investment bank and PE fund\n- Used alongside Margin of Safety: Only buy when Price < 67% of Intrinsic Value\n\n**Key insight:** A business earning ₹10 Cr/year reliably is worth far more than one earning ₹50 Cr this year by accident.`,
  },
  {
    id: "diversification-graham",
    name: "Diversification (Graham)",
    desc: "Hold 10-30 stocks across different industries",
    Icon: LayoutGrid,
    content: `**Diversification** — "Don't Put All Eggs in One Basket" — is one of Graham's most cited principles and the intellectual root of modern portfolio theory.\n\n**Graham's Rule:** Hold at least 10-30 stocks across different industries. No single stock should exceed 5-10% of your portfolio.\n\n**Why it works:**\n- Reduces unsystematic (company-specific) risk to near zero\n- Even if 3-4 stocks fail completely, the portfolio survives\n- Forces discipline in position sizing\n\n**Evolution into modern finance:**\n- Harry Markowitz formalized this as Modern Portfolio Theory (1952 Nobel Prize)\n- Led to the creation of index funds (John Bogle, Vanguard)\n- Today: Risk-parity models (Ray Dalio's All-Weather Portfolio) and multi-asset strategies\n\n**Practical framework for Indian investors:**\n- Equity: Large cap (40%) + Mid cap (30%) + Small cap (20%) + International (10%)\n- Asset classes: Equity + Debt + Gold + Real Estate\n- Sectors: Do not allocate >20% to any single sector\n\n**Key insight:** Diversification is the only free lunch in investing. It reduces risk without reducing expected returns.`,
  },
  {
    id: "investor-psychology",
    name: "Investor Psychology & Emotional Discipline",
    desc: "Override emotion with systematic rules",
    Icon: Brain,
    content: `**Investor Psychology & Emotional Discipline** is Graham's prescription for the biggest enemy of investment returns — the investor's own emotions.\n\n**Graham's Key Insight:** "The investor's chief problem — and even his worst enemy — is likely to be himself."\n\n**Two core emotions that destroy wealth:**\n1. **Fear** → Selling during crashes (locking in losses permanently)\n2. **Greed** → Buying at peaks (FOMO-driven buying at all-time highs)\n\n**Graham's solution:** Create rules-based systems that remove discretion:\n- Rebalance automatically when allocation drifts >5%\n- Never check portfolio more than quarterly\n- Set DCA on auto-debit — remove the decision entirely\n- Define your buy and sell criteria before buying any stock\n\n**Real-world use today:**\n- Behavioral portfolio theory (Shefrin & Statman) is built on Graham's observations\n- All top robo-advisory platforms (Betterment, INDmoney, Zerodha Coin) use automated rebalancing to override human emotion\n- AQR and Dimensional use systematic rules specifically to override investor psychology\n\n**Practical rule:** Write an Investment Policy Statement (IPS). Follow it regardless of what the market does.`,
  },
  {
    id: "graham-doddsville",
    name: "Graham-and-Doddsville Superinvestors",
    desc: "Value investing works over decades — proven",
    Icon: Trophy,
    content: `**The Superinvestors of Graham-and-Doddsville** is Warren Buffett's landmark 1984 essay that proved value investing works across different investors, markets, and time periods.\n\n**The Proof:** Buffett analyzed 9 investors who all learned from Graham. Despite using different methods and portfolios, all of them significantly outperformed the market over 20-30 years:\n- Walter Schloss: 21.3% CAGR vs S&P 500's 8.4% (over 28 years)\n- Tom Knapp (Tweedy Browne): ~20% CAGR\n- Buffett Partnership: 29.5% vs Dow's 7.4% (over 13 years)\n- Bill Ruane (Sequoia Fund): 18.2% vs S&P's 10%\n\n**Why it matters:** The probability of all 9 achieving this by luck is astronomically low. The common thread: all used Graham's value investing framework.\n\n**Real-world impact today:**\n- The empirical foundation for factor-based investing and smart beta ETFs\n- Proof that the "Value" factor generates persistent alpha\n- Inspired the Fama-French value premium research\n- Every value fund, from Parag Parikh to AQR, traces its intellectual roots here\n\n**Key insight:** You don't need to be smarter than the market — you need to be more disciplined, patient, and emotionally detached than other investors.`,
  },
];

const RULE_CATEGORIES = [
  "Investment Rules",
  "Budgeting Rules",
  "Emergency & Risk Rules",
  "Retirement Rules",
  "Debt Management Rules",
  "Risk Management Rules",
  "Valuation & Stock Selection Rules",
  "Business/Corporate Finance Rules",
  "Global Heuristics/Mental Models",
];

const LEVEL_BORDER_COLORS: Record<string, string> = {
  All: "#64748b",
  Beginner: "#16a34a",
  Intermediate: "#2563eb",
  Advanced: "#ea580c",
  Expert: "#7c3aed",
};

const MISTAKES = [
  {
    id: 1,
    mistake: "Not tracking expenses at all",
    principle:
      "Track every rupee: Use zero-based budgeting or detailed monthly expense log",
    ruleId: "50-30-20-budgeting",
    ruleName: "50/30/20 Budgeting Rule",
  },
  {
    id: 2,
    mistake: "Underestimating real monthly outflows",
    principle:
      "Build awareness: Track all outflows for 2-3 months to reveal true spending",
    ruleId: "pay-yourself-first",
    ruleName: "Pay Yourself First Rule",
  },
  {
    id: 3,
    mistake: "Multiple overlapping loans/EMIs spiraling",
    principle:
      "Avoid bad debt: Live below your means; pay high-interest debt first (avalanche method)",
    ruleId: "avalanche-debt",
    ruleName: "Avalanche Debt Method",
  },
  {
    id: 4,
    mistake: "No emergency fund built",
    principle:
      "Build 3-12 months' expenses in liquid savings (6+ months ideal for private job)",
    ruleId: "emergency-fund",
    ruleName: "Emergency Fund Rule",
  },
  {
    id: 5,
    mistake: "Addicted to get-rich-quick schemes (F&O, crypto)",
    principle:
      "Invest long-term: Time in market > timing the market; avoid speculation",
    ruleId: "eggs-basket",
    ruleName: "Don't Put All Eggs in One Basket",
  },
  {
    id: 6,
    mistake: "Living lifestyle on EMIs",
    principle:
      "Use cash/debit for non-essentials: No lifestyle on credit; EMIs ≤ 30-40% of take-home",
    ruleId: "debt-to-income-36",
    ruleName: "Debt-to-Income ≤36% Rule",
  },
  {
    id: 7,
    mistake: "Never discussing money in family",
    principle:
      "Open family money talks: Teach kids budgeting, debt, and saving early",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 8,
    mistake: "Buying insurance only for tax saving",
    principle:
      "Buy pure protection: Term life (15-25x annual income) + separate health cover",
    ruleId: "life-insurance-coverage",
    ruleName: "Life Insurance Coverage Rule",
  },
  {
    id: 9,
    mistake: "Buying home too early (20s/early 30s)",
    principle:
      "Rent + invest first: Buy home after 35+ when stable; aim for EMI ≤ 30% income",
    ruleId: "housing-30",
    ruleName: "Housing 30% Income Rule",
  },
  {
    id: 10,
    mistake: "Treating children as retirement plan",
    principle:
      "Set boundaries: Parents build own retirement corpus; discuss mutual support",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 11,
    mistake: "Chasing shortcuts instead of consistent change",
    principle:
      "Focus on consistency: Small daily habits compound (pay yourself first)",
    ruleId: "pay-yourself-first",
    ruleName: "Pay Yourself First Rule",
  },
  {
    id: 12,
    mistake: "No health/term insurance for self or parents",
    principle:
      "Insure protection first: Term life + comprehensive health (family floater)",
    ruleId: "life-insurance-coverage",
    ruleName: "Life Insurance Coverage Rule",
  },
  {
    id: 13,
    mistake: "Low self-belief / avoiding the mirror",
    principle:
      "Face reality: Monthly net worth review + mindset of abundance & ownership",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 14,
    mistake: "Not having a budget or financial plan",
    principle:
      "Follow 50/30/20 (or 60/30/10) rule: Needs 50-60%, wants 30%, savings/debt 20%",
    ruleId: "50-30-20-budgeting",
    ruleName: "50/30/20 Budgeting Rule",
  },
  {
    id: 15,
    mistake: "Overspending / lifestyle inflation",
    principle:
      "Live below means: Cap spending increases; save raises/bonuses first",
    ruleId: "1-percent-lifestyle",
    ruleName: "1% Rule for Lifestyle Creep",
  },
  {
    id: 16,
    mistake: "Paying only minimum due on credit cards",
    principle:
      "Pay full balance monthly: Avoid 30-45% interest; use 0% balance transfers if needed",
    ruleId: "credit-utilization",
    ruleName: "Credit Utilization 30%",
  },
  {
    id: 17,
    mistake: "Delaying investments / starting late",
    principle:
      "Start early: Benefit from compounding (Rule of 72: years to double ≈ 72/return %)",
    ruleId: "rule-of-72",
    ruleName: "Rule of 72",
  },
  {
    id: 18,
    mistake: "Ignoring inflation impact",
    principle:
      "Beat inflation: Invest in equities/mutual funds (aim 10-12% long-term return)",
    ruleId: "inflation-adjusted",
    ruleName: "Inflation-Adjusted Planning",
  },
  {
    id: 19,
    mistake: "Not diversifying investments",
    principle:
      "Diversify portfolio: Spread across asset classes (equity, debt, gold)",
    ruleId: "3-fund-portfolio",
    ruleName: "3-Fund Portfolio Rule",
  },
  {
    id: 20,
    mistake: "Following tips/herd mentality",
    principle:
      "Do your own research: Invest based on goals/risk, not trends or social media",
    ruleId: "avoid-story-stocks",
    ruleName: "Avoid Story Stocks",
  },
  {
    id: 21,
    mistake: "No retirement planning",
    principle: "Save 15-20%+ of income: Automate to retirement accounts",
    ruleId: "25x-retirement",
    ruleName: "25x Retirement Rule",
  },
  {
    id: 22,
    mistake: "Over-relying on conservative investments",
    principle:
      "Balance growth: Age-based allocation (e.g., 100 - age % in equities)",
    ruleId: "100-minus-age",
    ruleName: "100 Minus Age Asset Allocation",
  },
  {
    id: 23,
    mistake: "Not reviewing credit score regularly",
    principle:
      "Monitor credit: Check score annually; maintain low utilization (<30%)",
    ruleId: "credit-utilization",
    ruleName: "Credit Utilization 30%",
  },
  {
    id: 24,
    mistake: "Availing unnecessary debt/loans",
    principle:
      "Borrow only for assets: No consumer debt; good debt (home/education) only if affordable",
    ruleId: "good-bad-debt",
    ruleName: "Good Debt vs Bad Debt",
  },
  {
    id: 25,
    mistake: "Having too many credit cards",
    principle:
      "Limit to 2-3: One for rewards, one backup; close unused to reduce temptation",
    ruleId: "no-new-debt",
    ruleName: "No New Debt Rule",
  },
  {
    id: 26,
    mistake: "Not claiming tax benefits properly",
    principle: "Maximize deductions: Use tax-advantaged accounts",
    ruleId: "tax-advantaged-first",
    ruleName: "Use Tax-Advantaged Accounts First",
  },
  {
    id: 27,
    mistake: "Ignoring small recurring expenses",
    principle:
      'Cut leaks: Audit subscriptions/apps; apply "pay yourself first" to small savings',
    ruleId: "1-percent-lifestyle",
    ruleName: "1% Rule for Lifestyle Creep",
  },
  {
    id: 28,
    mistake: "Emotional spending / impulse buys",
    principle: "Implement 24-48 hour rule: Wait before non-essential purchases",
    ruleId: "24-hour-rule",
    ruleName: "24-Hour Rule",
  },
  {
    id: 29,
    mistake: "Not negotiating salaries or side income",
    principle:
      "Build leverage: Negotiate raises; create multiple income streams",
    ruleId: "multiple-income-streams",
    ruleName: "Retire with Multiple Income Streams",
  },
  {
    id: 30,
    mistake: "Cosigning loans for others",
    principle:
      "Protect yourself: Never cosign unless you can afford to pay fully",
    ruleId: "leverage-prudence",
    ruleName: "Leverage Prudence",
  },
  {
    id: 31,
    mistake: "Not having life insurance (pure term)",
    principle: "Cover dependents: Term policy = 10-20x annual expenses",
    ruleId: "life-insurance-coverage",
    ruleName: "Life Insurance Coverage Rule",
  },
  {
    id: 32,
    mistake: "Mixing insurance with investment",
    principle:
      "Separate tools: Insurance for protection only; invest separately for growth",
    ruleId: "life-insurance-coverage",
    ruleName: "Life Insurance Coverage Rule",
  },
  {
    id: 33,
    mistake: 'Waiting for "perfect time" to invest',
    principle:
      "Start now: Dollar-cost average (SIP monthly) regardless of market",
    ruleId: "rule-of-72",
    ruleName: "Rule of 72",
  },
  {
    id: 34,
    mistake: "Not automating savings/investments",
    principle:
      "Automate everything: Pay yourself first via auto-transfers to savings/invest",
    ruleId: "pay-yourself-first",
    ruleName: "Pay Yourself First Rule",
  },
  {
    id: 35,
    mistake: "Spending windfalls carelessly",
    principle:
      "Allocate windfalls: 50% debt/savings, 30% fun, 20% invest (or similar split)",
    ruleId: "80-20-savings",
    ruleName: "80/20 Savings Rule",
  },
  {
    id: 36,
    mistake: "Ignoring professional financial advice",
    principle:
      "Seek help when needed: Use fiduciary advisor for complex situations",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 37,
    mistake: "Not building multiple income streams",
    principle:
      "Diversify income: Salary + side hustle/freelance + passive (dividends/rent)",
    ruleId: "multiple-income-streams",
    ruleName: "Retire with Multiple Income Streams",
  },
  {
    id: 38,
    mistake: "Overexposure to real estate",
    principle:
      "Limit illiquids: Real estate ≤ 30-40% net worth; maintain liquidity",
    ruleId: "10-percent-diversification",
    ruleName: "10% Diversification Rule",
  },
  {
    id: 39,
    mistake: "Paying high fees on mutual funds",
    principle:
      "Choose low-cost: Direct plans/index funds (expense ratio <0.5%)",
    ruleId: "3-fund-portfolio",
    ruleName: "3-Fund Portfolio Rule",
  },
  {
    id: 40,
    mistake: "Not rebalancing portfolio",
    principle:
      "Rebalance annually: Sell winners/buy losers to maintain target allocation",
    ruleId: "rebalance-annually",
    ruleName: "Rebalance Annually",
  },
  {
    id: 41,
    mistake: "Borrowing from future self",
    principle: "Build buffer: Emergency fund before credit reliance",
    ruleId: "emergency-credit",
    ruleName: "Emergency Credit Avoidance",
  },
  {
    id: 42,
    mistake: "No goals tied to money",
    principle:
      "Set SMART goals: Link savings to specific targets (house, kids, retirement)",
    ruleId: "25x-retirement",
    ruleName: "25x Retirement Rule",
  },
  {
    id: 43,
    mistake: "Underestimating medical inflation",
    principle:
      "Plan for 10-15% rise: Adequate health cover + buffer for parents/self",
    ruleId: "healthcare-buffer",
    ruleName: "Healthcare Buffer",
  },
  {
    id: 44,
    mistake: "Giving in to social pressure (weddings, status)",
    principle:
      "Prioritize values: Spend on what matters; ignore status symbols",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 45,
    mistake: "Not tracking net worth",
    principle: "Track quarterly: Assets - liabilities = progress dashboard",
    ruleId: "income-by-age-40",
    ruleName: "Income by Age: 3x by 40",
  },
  {
    id: 46,
    mistake: 'Falling for "guaranteed returns" scams',
    principle:
      "Verify always: If too good to be true, avoid; stick to regulated options",
    ruleId: "avoid-ipo-hype",
    ruleName: "Avoid IPO Hype",
  },
  {
    id: 47,
    mistake: "Not updating nominee details",
    principle:
      "Review annually: Update nominees/beneficiaries on all accounts/policies",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 48,
    mistake: 'Treating salary as "free money" post-tax',
    principle:
      "Allocate take-home: Follow budget rule immediately after credit",
    ruleId: "pay-yourself-first",
    ruleName: "Pay Yourself First Rule",
  },
  {
    id: 49,
    mistake: "Neglecting skill upgradation",
    principle: "Invest in self: Continuous learning = higher earning potential",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 50,
    mistake: "Avoiding money conversations",
    principle:
      "Normalize talks: Regular check-ins with partner/family on finances",
    ruleId: null,
    ruleName: null,
  },
];

const _linkedToRulesCount = MISTAKES.filter((m) => m.ruleId !== null).length;

export default function FinancialRulesPage() {
  const { actor } = useActor();
  const [rules, setRules] = useState<FinancialRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialRule | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState("knowledge");
  const [activeBasic, setActiveBasic] = useState<string | null>(null);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [dialogCategory, setDialogCategory] = useState("");
  const [dialogRuleId, setDialogRuleId] = useState("");

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllFinancialRules()
      .then(setRules)
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogCategory("");
    setDialogRuleId("");
    setOpen(true);
  };
  const openEdit = (r: FinancialRule) => {
    setEditing(r);
    setForm({
      name: r.name,
      ruleType: r.ruleType,
      condition: r.condition,
      threshold: r.threshold,
      action: r.action,
      isActive: r.isActive,
    });
    setDialogCategory("");
    setDialogRuleId("");
    setOpen(true);
  };

  const toggleActive = async (r: FinancialRule) => {
    if (!actor) return;
    await actor.updateFinancialRule(r.id, { ...r, isActive: !r.isActive });
    load();
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        await actor.updateFinancialRule(editing.id, { ...editing, ...form });
      } else {
        await actor.createFinancialRule({ id: crypto.randomUUID(), ...form });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deleteFinancialRule(id);
    load();
  };

  const handleAIAddRule = async (ruleData: {
    name: string;
    ruleType: string;
    condition: string;
    threshold: number;
    action: string;
    isActive: true;
  }) => {
    if (!actor) return;
    await actor.createFinancialRule({ id: crypto.randomUUID(), ...ruleData });
    load();
  };

  const goToRulesTab = () => {
    setActiveTab("knowledge");
    window.scrollTo(0, 0);
  };

  return (
    <div data-ocid="financialrules.page" className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)" }}
        >
          <Shield className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Learn Finance</h1>
      </div>
      <div className="hidden">
        <div>
          <p className="text-sm text-slate-500">
            Build your financial knowledge from basics to expert
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Pill-style tab bar */}
        <TabsList className="bg-slate-100 p-1 rounded-xl gap-1 h-auto flex-wrap">
          <TabsTrigger
            value="knowledge"
            data-ocid="financialrules.knowledge.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            Rules
          </TabsTrigger>
          <TabsTrigger
            value="basics"
            data-ocid="financialrules.basics.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
            Basics
          </TabsTrigger>
          <TabsTrigger
            value="mistakes"
            data-ocid="financialrules.mistakes.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Learn from Mistakes
          </TabsTrigger>
          <TabsTrigger
            value="my-rules"
            data-ocid="financialrules.myrules.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <Brain className="w-3.5 h-3.5 mr-1.5" />
            My Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="mt-4 space-y-4">
          {/* Level Filter Pills */}
          <FinancialRulesSection />
        </TabsContent>

        <TabsContent value="basics" className="mt-4">
          {(() => {
            const BASICS_COLORS = [
              {
                color: "#10b981",
                iconBg: "bg-emerald-50",
                iconText: "text-emerald-600",
                iconBgActive: "bg-emerald-500",
                expandedBg: "bg-emerald-50/30",
                borderColor: "border-emerald-100",
              },
              {
                color: "#3b82f6",
                iconBg: "bg-blue-50",
                iconText: "text-blue-600",
                iconBgActive: "bg-blue-500",
                expandedBg: "bg-blue-50/30",
                borderColor: "border-blue-100",
              },
              {
                color: "#8b5cf6",
                iconBg: "bg-violet-50",
                iconText: "text-violet-600",
                iconBgActive: "bg-violet-500",
                expandedBg: "bg-violet-50/30",
                borderColor: "border-violet-100",
              },
              {
                color: "#f97316",
                iconBg: "bg-orange-50",
                iconText: "text-orange-600",
                iconBgActive: "bg-orange-500",
                expandedBg: "bg-orange-50/30",
                borderColor: "border-orange-100",
              },
              {
                color: "#6366f1",
                iconBg: "bg-indigo-50",
                iconText: "text-indigo-600",
                iconBgActive: "bg-indigo-500",
                expandedBg: "bg-indigo-50/30",
                borderColor: "border-indigo-100",
              },
              {
                color: "#06b6d4",
                iconBg: "bg-cyan-50",
                iconText: "text-cyan-600",
                iconBgActive: "bg-cyan-500",
                expandedBg: "bg-cyan-50/30",
                borderColor: "border-cyan-100",
              },
              {
                color: "#f59e0b",
                iconBg: "bg-amber-50",
                iconText: "text-amber-600",
                iconBgActive: "bg-amber-500",
                expandedBg: "bg-amber-50/30",
                borderColor: "border-amber-100",
              },
              {
                color: "#f43f5e",
                iconBg: "bg-rose-50",
                iconText: "text-rose-600",
                iconBgActive: "bg-rose-500",
                expandedBg: "bg-rose-50/30",
                borderColor: "border-rose-100",
              },
            ];
            if (activeBasic) {
              const topic = BASICS_TOPICS.find((t) => t.id === activeBasic);
              if (topic) {
                const idx = BASICS_TOPICS.findIndex(
                  (t) => t.id === activeBasic,
                );
                const c = BASICS_COLORS[idx % BASICS_COLORS.length];
                return (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setActiveBasic(null)}
                      className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      data-ocid="basics.back_button"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to Basics
                    </button>
                    <div
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                      style={{ borderLeft: `4px solid ${c.color}` }}
                    >
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconBgActive}`}
                          >
                            <topic.Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-slate-800">
                              {topic.name}
                            </h2>
                            <p className="text-xs text-slate-500">
                              {topic.desc}
                            </p>
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {"content" in topic && topic.content ? (
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                              {String(topic.content).replace(
                                /\*\*(.+?)\*\*/g,
                                "$1",
                              )}
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {"sections" in topic &&
                                Array.isArray(topic.sections) &&
                                (
                                  topic.sections as {
                                    title: string;
                                    text: string;
                                  }[]
                                ).map((s, si) => (
                                  <div key={s.title || si}>
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                                      {s.title}
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                      {s.text}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BASICS_TOPICS.map((topic, idx) => {
                  const c = BASICS_COLORS[idx % BASICS_COLORS.length];
                  const isActive = false; // No inline expansion - click opens full page
                  return (
                    <div
                      key={topic.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                      style={{ borderLeft: `4px solid ${c.color}` }}
                    >
                      <button
                        type="button"
                        data-ocid={`basics.${topic.id}.card`}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        onClick={() => setActiveBasic(topic.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? c.iconBgActive : c.iconBg}`}
                          >
                            <topic.Icon
                              className={`w-4 h-4 ${isActive ? "text-white" : c.iconText}`}
                            />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">
                              {topic.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {topic.desc}
                            </p>
                          </div>
                        </div>
                        <span className="text-slate-400 text-sm ml-2">
                          {isActive ? "▲" : "▼"}
                        </span>
                      </button>
                      {isActive && (
                        <div
                          className={`border-t ${c.borderColor} ${c.expandedBg}`}
                        >
                          {(topic as any).content ? (
                            <div className="p-4 space-y-2">
                              {((topic as any).content as string)
                                .split("\n\n")
                                .map((para: string) => (
                                  <p
                                    key={para.substring(0, 30)}
                                    className="text-sm text-slate-700 leading-relaxed"
                                  >
                                    {para
                                      .split(/\*\*(.+?)\*\*/)
                                      .map((part: string, i: number) =>
                                        i % 2 === 1 ? (
                                          <strong
                                            key={`${part.substring(0, 15)}-b`}
                                            className="font-semibold text-slate-900"
                                          >
                                            {part}
                                          </strong>
                                        ) : (
                                          part
                                        ),
                                      )}
                                  </p>
                                ))}
                            </div>
                          ) : (
                            <ModelFundamentalsTab showSection={topic.id} />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </TabsContent>

        <TabsContent value="mistakes" className="mt-4">
          {(() => {
            const MISTAKE_CATEGORIES = [
              {
                name: "Debt & Loans",
                icon: "💳",
                color: "#ef4444",
                bg: "bg-red-50",
                border: "border-red-200",
                ids: [3, 6, 9, 16, 24, 25, 30, 38, 41],
              },
              {
                name: "Savings & Emergency Fund",
                icon: "🏦",
                color: "#10b981",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                ids: [4, 11, 14, 15, 27, 34, 35, 42, 48],
              },
              {
                name: "Insurance",
                icon: "🛡️",
                color: "#6366f1",
                bg: "bg-indigo-50",
                border: "border-indigo-200",
                ids: [8, 12, 31, 32, 43],
              },
              {
                name: "Investments",
                icon: "📈",
                color: "#2563eb",
                bg: "bg-blue-50",
                border: "border-blue-200",
                ids: [5, 17, 18, 19, 20, 22, 33, 37, 39, 40, 46],
              },
              {
                name: "Tax & Planning",
                icon: "📋",
                color: "#d97706",
                bg: "bg-amber-50",
                border: "border-amber-200",
                ids: [10, 21, 26, 36, 44, 47],
              },
              {
                name: "Behaviour & Mindset",
                icon: "🧠",
                color: "#7c3aed",
                bg: "bg-violet-50",
                border: "border-violet-200",
                ids: [1, 2, 7, 13, 28, 29, 49, 50],
              },
              {
                name: "Income & Lifestyle",
                icon: "💼",
                color: "#0891b2",
                bg: "bg-cyan-50",
                border: "border-cyan-200",
                ids: [15, 29, 37, 45],
              },
            ];
            const toggleCat = (name: string) =>
              setOpenCats((prev) => {
                const isOpen = prev[name] ?? false;
                // Close all, then open only the clicked one (unless it was already open)
                const next: Record<string, boolean> = {};
                if (!isOpen) next[name] = true;
                return next;
              });

            return (
              <div className="space-y-4">
                {/* Categories */}
                {MISTAKE_CATEGORIES.map((cat) => {
                  const catMistakes = MISTAKES.filter((m) =>
                    cat.ids.includes(m.id),
                  );
                  const isOpen = openCats[cat.name] ?? false;
                  return (
                    <div
                      key={cat.name}
                      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${cat.border}`}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        onClick={() => toggleCat(cat.name)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cat.icon}</span>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">
                              {cat.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {catMistakes.length} mistakes
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                            style={{ background: cat.color }}
                          >
                            {catMistakes.length}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {isOpen ? "▲" : "▼"}
                          </span>
                        </div>
                      </button>
                      {isOpen && (
                        <div className={`px-4 pb-4 ${cat.bg}`}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {catMistakes.map((item) => {
                              const hasRule = item.ruleId !== null;
                              const globalIdx = MISTAKES.findIndex(
                                (m) => m.id === item.id,
                              );
                              return (
                                <div
                                  key={item.id}
                                  data-ocid={`mistakes.item.${globalIdx + 1}`}
                                  className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex"
                                  style={{
                                    borderLeftColor: hasRule
                                      ? "#14b8a6"
                                      : "#cbd5e1",
                                    borderLeftWidth: 3,
                                  }}
                                >
                                  <div className="p-4 flex items-start gap-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg">
                                      {(
                                        {
                                          1: "📊",
                                          2: "📊",
                                          3: "💳",
                                          4: "🏦",
                                          5: "🎰",
                                          6: "💳",
                                          7: "👨‍👩‍👧",
                                          8: "🏥",
                                          9: "🏠",
                                          10: "👨‍👩‍👧",
                                          11: "📊",
                                          12: "🏥",
                                          13: "🧠",
                                          14: "📊",
                                          15: "🛍️",
                                          16: "💳",
                                          17: "📉",
                                          18: "📈",
                                          19: "📉",
                                          20: "🎰",
                                          21: "🌅",
                                          22: "📉",
                                          23: "💳",
                                          24: "📝",
                                          25: "💳",
                                          26: "📋",
                                          27: "🛍️",
                                          28: "🛍️",
                                          29: "💼",
                                          30: "📝",
                                          31: "🏥",
                                          32: "🏥",
                                          33: "📉",
                                          34: "🏦",
                                          35: "🛍️",
                                          36: "💼",
                                          37: "💼",
                                          38: "🏠",
                                          39: "📉",
                                          40: "📈",
                                          41: "📝",
                                          42: "🌅",
                                          43: "🏥",
                                          44: "🛍️",
                                          45: "📈",
                                          46: "🎰",
                                          47: "📝",
                                          48: "💼",
                                          49: "🎓",
                                          50: "👨‍👩‍👧",
                                        } as Record<number, string>
                                      )[item.id] ?? "📌"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-slate-800 leading-snug">
                                        {item.mistake}
                                      </p>
                                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {item.principle}
                                      </p>
                                      {item.ruleId && item.ruleName && (
                                        <button
                                          type="button"
                                          data-ocid={`mistakes.item.${globalIdx + 1}.link`}
                                          onClick={goToRulesTab}
                                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 cursor-pointer transition-colors"
                                        >
                                          → {item.ruleName}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </TabsContent>

        <TabsContent value="my-rules" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Button
                variant={showAIAnalysis ? "default" : "outline"}
                className={`gap-2 ${
                  showAIAnalysis
                    ? "bg-gradient-to-r from-violet-500 to-purple-700 text-white border-0 hover:opacity-90"
                    : "border-violet-200 text-violet-700 hover:bg-violet-50"
                }`}
                onClick={() => setShowAIAnalysis((v) => !v)}
                data-ocid="ai_analysis.toggle_button"
              >
                <Brain className="w-4 h-4" />
                {showAIAnalysis ? "Hide AI Analysis" : "AI Analysis"}
              </Button>
              <Button
                data-ocid="financialrules.add_button"
                onClick={openAdd}
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> Add Rule
              </Button>
            </div>

            {showAIAnalysis && (
              <Card className="border-violet-200 shadow-sm">
                <CardContent className="p-5">
                  <AIRulesAnalysis
                    userRules={rules}
                    onAddRule={handleAIAddRule}
                  />
                </CardContent>
              </Card>
            )}

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : rules.length === 0 ? (
              <div
                data-ocid="financialrules.empty_state"
                className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700 text-sm">
                  No rules yet
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs text-center">
                  Add your own financial guardrails or use AI Analysis to get
                  personalized recommendations.
                </p>
                <Button
                  onClick={openAdd}
                  size="sm"
                  className="mt-4 gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
                  data-ocid="financialrules.empty.add_button"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Rule
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rules.map((r, i) => {
                  const levelColor =
                    LEVEL_BORDER_COLORS[r.ruleType] ?? "#64748b";
                  return (
                    <Card
                      key={r.id}
                      data-ocid={`financialrules.item.${i + 1}`}
                      className="rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                      style={{
                        borderLeftColor: levelColor,
                        borderLeftWidth: 3,
                      }}
                    >
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800 text-sm">
                              {r.name}
                            </span>
                            {r.ruleType && (
                              <Badge
                                className="text-xs"
                                style={{
                                  background: `${
                                    LEVEL_BORDER_COLORS[r.ruleType] ?? "#64748b"
                                  }20`,
                                  color:
                                    LEVEL_BORDER_COLORS[r.ruleType] ??
                                    "#64748b",
                                  border: `1px solid ${LEVEL_BORDER_COLORS[r.ruleType] ?? "#64748b"}40`,
                                }}
                              >
                                {r.ruleType}
                              </Badge>
                            )}
                            <Badge
                              variant={r.isActive ? "default" : "secondary"}
                              className={`text-xs ${
                                r.isActive
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : ""
                              }`}
                            >
                              {r.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-xs text-slate-500 space-y-0.5">
                            {r.condition && (
                              <div>
                                <span className="text-slate-400 font-medium">
                                  Condition:
                                </span>{" "}
                                {r.condition}
                              </div>
                            )}
                            {r.threshold > 0 && (
                              <div>
                                <span className="text-slate-400 font-medium">
                                  Threshold:
                                </span>{" "}
                                {r.threshold.toLocaleString()}
                              </div>
                            )}
                            {r.action && (
                              <div>
                                <span className="text-slate-400 font-medium">
                                  Action:
                                </span>{" "}
                                {r.action}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Switch
                            data-ocid={`financialrules.switch.${i + 1}`}
                            checked={r.isActive}
                            onCheckedChange={() => toggleActive(r)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            data-ocid={`financialrules.edit_button.${i + 1}`}
                            onClick={() => openEdit(r)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            data-ocid={`financialrules.delete_button.${i + 1}`}
                            onClick={() => del(r.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="financialrules.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Rule" : "Add Rule"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rule Category</Label>
              <Select
                value={dialogCategory}
                onValueChange={(v) => {
                  setDialogCategory(v);
                  setDialogRuleId("");
                }}
              >
                <SelectTrigger data-ocid="financialrules.category.select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {RULE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {dialogCategory && (
              <div>
                <Label>Rule</Label>
                <Select
                  value={dialogRuleId}
                  onValueChange={(v) => {
                    setDialogRuleId(v);
                    const rule = ALL_FINANCIAL_RULES.find((r) => r.id === v);
                    if (rule)
                      setForm((f) => ({
                        ...f,
                        name: rule.name,
                        ruleType: rule.category,
                      }));
                  }}
                >
                  <SelectTrigger data-ocid="financialrules.rule.select">
                    <SelectValue placeholder="Select a rule" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_FINANCIAL_RULES.filter(
                      (r) => r.category === dialogCategory,
                    ).map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Name</Label>
              <Input
                data-ocid="financialrules.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Rule Type / Level</Label>
              <Input
                data-ocid="financialrules.ruletype.input"
                value={form.ruleType}
                readOnly
                className="bg-slate-50 text-slate-500 cursor-default"
                placeholder="Auto-filled from selected rule"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                data-ocid="financialrules.active.switch"
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="financialrules.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="financialrules.submit_button"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
