import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  RotateCcw,
  Shield,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  category: "rules" | "basics" | "mistakes" | "advanced";
  description: string;
  questions: QuizQuestion[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const quizzes: Quiz[] = [
  // ── RULES QUIZ 1 ─────────────────────────────────────────────────────────────
  {
    id: "rules-budgeting-savings",
    title: "Budgeting & Savings Rules",
    category: "rules",
    description: "Test your knowledge of core budgeting and savings rules",
    questions: [
      {
        id: 1,
        question:
          "The 50/30/20 rule allocates your income into three buckets. What is the correct split?",
        options: [
          "50% savings, 30% needs, 20% wants",
          "50% needs, 30% wants, 20% savings/debt",
          "50% wants, 30% savings, 20% needs",
          "50% investments, 20% needs, 30% wants",
        ],
        correctAnswer: 1,
        explanation:
          "The 50/30/20 rule: 50% for needs (housing, food, transport), 30% for wants (entertainment, dining), and 20% for savings and debt repayment. It's the most widely recommended budgeting framework.",
      },
      {
        id: 2,
        question:
          "The 80/20 Savings Rule says you should save what percentage of your income?",
        options: ["10%", "15%", "20%", "25%"],
        correctAnswer: 2,
        explanation:
          "The 80/20 rule: spend 80% and save 20%. Setting up an automatic transfer of 20% to savings on payday ensures you pay yourself first before spending.",
      },
      {
        id: 3,
        question: "What does the Rule of 72 tell you?",
        options: [
          "The safe withdrawal rate in retirement",
          "How many years to double your money (72 ÷ return rate)",
          "Maximum debt-to-income ratio",
          "The recommended emergency fund size",
        ],
        correctAnswer: 1,
        explanation:
          "Rule of 72: divide 72 by your expected annual return to find how many years it takes to double your money. At 12% return, your money doubles every 6 years.",
      },
      {
        id: 4,
        question:
          "The 25x Retirement Rule states your retirement corpus should be what multiple of your annual expenses?",
        options: ["10x", "15x", "20x", "25x"],
        correctAnswer: 3,
        explanation:
          "The 25x rule: save 25 times your annual expenses for retirement. This is based on the 4% safe withdrawal rate — allowing you to withdraw 4% of your corpus annually without running out of money for 30+ years.",
      },
      {
        id: 5,
        question:
          "According to the Housing 30% Rule, what is the maximum percentage of gross income that should go toward housing costs?",
        options: ["20%", "25%", "30%", "40%"],
        correctAnswer: 2,
        explanation:
          "Housing costs (EMI/rent, utilities, maintenance) should not exceed 30% of gross income. Exceeding this creates a 'house-poor' situation where you struggle to fund other financial goals.",
      },
      {
        id: 6,
        question:
          "The 70/20/10 rule allocates income as: 70% living expenses, 20% savings, and 10% for what?",
        options: [
          "Emergency fund only",
          "Giving/charity or extra debt repayment",
          "Luxury spending",
          "Insurance premiums",
        ],
        correctAnswer: 1,
        explanation:
          "The 70/20/10 rule: 70% for living expenses, 20% for savings and wealth building, and 10% for giving/charity or extra debt repayment. It's a balanced approach covering all financial priorities.",
      },
      {
        id: 7,
        question:
          "The 24-Hour Rule is designed to prevent what financial behavior?",
        options: [
          "Withdrawing retirement savings early",
          "Impulse buying and emotional spending",
          "Selling investments during a market crash",
          "Applying for too many credit cards",
        ],
        correctAnswer: 1,
        explanation:
          "The 24-Hour Rule: wait 24 hours before any non-essential purchase. This cooling-off period separates impulse buying (emotion-driven) from deliberate spending (need-driven).",
      },
      {
        id: 8,
        question:
          "By age 30, the 'Income by Age' savings milestone says you should have saved how much relative to your annual salary?",
        options: ["0.5x salary", "1x salary", "2x salary", "3x salary"],
        correctAnswer: 1,
        explanation:
          "By age 30, aim to have 1x your annual salary saved. By 40: 3x, by 50: 6x, by 60: 8x. These milestones ensure you're on track for a comfortable retirement.",
      },
      {
        id: 9,
        question: "The 'Pay Yourself First' rule means what?",
        options: [
          "Spend on personal needs before paying bills",
          "Transfer savings automatically before paying any other expenses",
          "Prioritize income tax payments",
          "Pay off all debt before investing",
        ],
        correctAnswer: 1,
        explanation:
          "Pay Yourself First: automate a fixed savings amount on payday before any spending. This ensures savings happen consistently, not as an afterthought with 'what's left over'.",
      },
      {
        id: 10,
        question: "What is the 1% Rule for Lifestyle Creep?",
        options: [
          "Invest at least 1% of income in gold every month",
          "Only increase lifestyle spending by 1% when income rises",
          "Limit credit card spending to 1% of portfolio value",
          "Spend no more than 1% of net worth on luxury items",
        ],
        correctAnswer: 1,
        explanation:
          "When you get a raise, the 1% rule says increase your lifestyle spending by only 1% — save or invest the rest. This prevents lifestyle inflation that erodes the benefit of income growth.",
      },
    ],
  },

  // ── RULES QUIZ 2 ─────────────────────────────────────────────────────────────
  {
    id: "rules-investment-debt",
    title: "Investment & Debt Rules",
    category: "rules",
    description:
      "Test your grasp of investment, emergency fund, and debt rules",
    questions: [
      {
        id: 1,
        question: "What is the recommended minimum size for an emergency fund?",
        options: [
          "1 month of expenses",
          "3–6 months of expenses",
          "1 year of income",
          "10% of annual salary",
        ],
        correctAnswer: 1,
        explanation:
          "An emergency fund should cover 3–6 months of living expenses. For those with variable income or private-sector jobs, 6–12 months is recommended. Keep it in a liquid instrument like a liquid mutual fund.",
      },
      {
        id: 2,
        question:
          "The Debt-to-Income rule says total monthly EMI payments should not exceed what percentage of gross monthly income?",
        options: ["20%", "30%", "36%", "50%"],
        correctAnswer: 2,
        explanation:
          "Total monthly EMI should be ≤36% of gross monthly income. Exceeding this signals overleveraging and reduces financial flexibility for goals, savings, and unexpected expenses.",
      },
      {
        id: 3,
        question:
          "The 3-Fund Portfolio Rule consists of which three components?",
        options: [
          "Stocks, Gold, Real Estate",
          "Domestic Index Fund + International Index Fund + Bond Index Fund",
          "Equity MF + Debt MF + Liquid Fund",
          "Large Cap + Mid Cap + Small Cap funds",
        ],
        correctAnswer: 1,
        explanation:
          "The 3-Fund Portfolio: one domestic index fund (e.g., S&P 500, Nifty 50), one international index fund (global equities), and one bond index fund. Broad diversification with minimal cost and complexity.",
      },
      {
        id: 4,
        question:
          "The 100 Minus Age Rule is used to determine what aspect of your portfolio?",
        options: [
          "Minimum retirement savings target",
          "Equity allocation percentage based on your age",
          "Maximum credit card limit",
          "Safe withdrawal rate in retirement",
        ],
        correctAnswer: 1,
        explanation:
          "100 minus your age = % to keep in equity. At 30: 70% equity, 30% debt. At 50: 50/50. This rule reduces equity risk as you approach retirement. Many now use 110 minus age for longer retirements.",
      },
      {
        id: 5,
        question: "What does the Avalanche Debt Method prioritize?",
        options: [
          "Paying the smallest balance first for motivation",
          "Paying the highest interest rate debt first to minimize total interest",
          "Paying all debts equally each month",
          "Consolidating all debts into one loan",
        ],
        correctAnswer: 1,
        explanation:
          "The Avalanche Method: pay minimums on all debts, then put all extra money on the highest-interest debt. Mathematically optimal — minimizes total interest paid over time.",
      },
      {
        id: 6,
        question:
          "The Life Insurance Coverage Rule recommends a term cover of how many times your annual income?",
        options: ["5–8x", "10–15x", "15–25x", "25–30x"],
        correctAnswer: 2,
        explanation:
          "Term life cover should be 15–25x your annual income to ensure dependents can maintain their lifestyle if you're gone. Buy pure term insurance — not endowment or ULIP which mix insurance + investment poorly.",
      },
      {
        id: 7,
        question:
          "The Inflation-Adjusted Planning rule says investments should target what annual return to meaningfully beat inflation in India?",
        options: [
          "6–7% (match inflation)",
          "8–9% (small real return)",
          "10–12% (meaningful real return)",
          "15–20% (aggressive growth)",
        ],
        correctAnswer: 2,
        explanation:
          "The Inflation-Adjusted Planning rule: target returns meaningfully above inflation to generate real wealth. With typical inflation of 3–6% in most countries, equity investments targeting 8–12% returns generate meaningful real returns of 3–6%.",
      },
      {
        id: 8,
        question:
          "The Rebalance Annually rule says you should review and rebalance your portfolio how often?",
        options: [
          "Every week",
          "Every month",
          "Once a year",
          "Only when markets crash",
        ],
        correctAnswer: 2,
        explanation:
          "Rebalance once a year: sell assets that grew above target allocation and buy those below. This enforces 'sell high, buy low' and keeps your risk profile aligned with your goals.",
      },
      {
        id: 9,
        question:
          "The 10% Diversification Rule states that no single investment should represent more than what percentage of your total portfolio?",
        options: ["5%", "10%", "20%", "25%"],
        correctAnswer: 1,
        explanation:
          "No single stock, sector, or investment should exceed 10% of your total portfolio. This prevents concentration risk where one bad investment causes outsized damage to your overall wealth.",
      },
      {
        id: 10,
        question: "What is the Good Debt vs Bad Debt distinction?",
        options: [
          "Good debt has low interest; bad debt has high interest regardless of purpose",
          "Good debt builds/protects assets (home loan, education); bad debt funds consumption (credit card, personal loan for lifestyle)",
          "Good debt is from government banks; bad debt is from private lenders",
          "There is no such distinction — all debt should be avoided",
        ],
        correctAnswer: 1,
        explanation:
          "Good debt finances assets that appreciate or generate income (home loan, education loan). Bad debt funds depreciating consumption (credit cards for shopping, personal loans for vacations). Minimize bad debt entirely.",
      },
    ],
  },

  // ── BASICS QUIZ 1 ────────────────────────────────────────────────────────────
  {
    id: "basics-money-global",
    title: "Money Basics & Financial Ecosystem",
    category: "basics",
    description:
      "Fundamental money concepts and how financial systems work globally",
    questions: [
      {
        id: 1,
        question:
          "What is the primary role of a financial market regulator (such as the SEC in the US, FCA in the UK, or SEBI in India)?",
        options: [
          "To set interest rates for banks",
          "To protect investors, ensure market integrity, and regulate securities exchanges, brokers, and listed companies",
          "To print and manage the national currency",
          "To collect taxes from investment gains",
        ],
        correctAnswer: 1,
        explanation:
          "Financial market regulators protect investors and maintain fair, transparent markets. Examples: SEC (US), FCA (UK), SEBI (India), MAS (Singapore), ASIC (Australia). They oversee exchanges, brokers, mutual funds, and listed companies.",
      },
      {
        id: 2,
        question:
          "What is the role of a central bank (such as the US Federal Reserve, Bank of England, or RBI)?",
        options: [
          "To regulate stock markets and mutual funds",
          "To manage monetary policy, set interest rates, regulate commercial banks, and maintain currency stability",
          "To insure individual investment accounts",
          "To approve company IPOs and new stock listings",
        ],
        correctAnswer: 1,
        explanation:
          "Central banks manage monetary policy — setting interest rates, controlling money supply, and maintaining financial stability. Examples: US Federal Reserve, European Central Bank (ECB), Bank of England, Reserve Bank of India (RBI).",
      },
      {
        id: 3,
        question: "What is NAV in the context of mutual funds?",
        options: [
          "Net Accumulated Value — total assets held",
          "Net Asset Value — price per unit of a mutual fund",
          "National Allocation Value — government-assigned fund value",
          "Nominal Asset Value — initial investment amount",
        ],
        correctAnswer: 1,
        explanation:
          "NAV (Net Asset Value) is the price per unit of a mutual fund, calculated daily as (Total Assets − Total Liabilities) ÷ Total Units. If you invest $1,000 at NAV $50, you get 20 units. All global mutual funds use this same pricing mechanism.",
      },
      {
        id: 4,
        question:
          "What is a brokerage/custodian account and what is its primary function?",
        options: [
          "A savings account for emergency funds",
          "An account that holds your investment securities (stocks, bonds, funds) in electronic form and facilitates buying and selling",
          "A government-managed retirement savings account",
          "A fixed-deposit account offered by investment firms",
        ],
        correctAnswer: 1,
        explanation:
          "A brokerage account (also called a custodian or investment account) holds your securities electronically and allows you to trade. Examples: Fidelity, Charles Schwab (US), HL (UK), Zerodha (India). Opening requires identity verification (KYC).",
      },
      {
        id: 5,
        question:
          "What is the difference between nominal return and real return?",
        options: [
          "Nominal return is before fees; real return is after fees",
          "Nominal return is before inflation; real return is after adjusting for inflation",
          "Nominal return is for bonds; real return is for equities",
          "There is no difference — both mean the same thing",
        ],
        correctAnswer: 1,
        explanation:
          "Real return = Nominal return − Inflation rate. If your savings account gives 4% but inflation is 3%, your real return is just 1%. Equity investments targeting 8–12% at 2–6% inflation provide meaningful real returns for long-term wealth building.",
      },
      {
        id: 6,
        question:
          "The Time Value of Money principle states that $1,000 today is worth what compared to $1,000 one year from now?",
        options: [
          "The same — money has no time value",
          "Less — because inflation reduces value over time",
          "More — because today's money can be invested to earn returns",
          "It depends on stock market conditions at that time",
        ],
        correctAnswer: 2,
        explanation:
          "$1,000 today is worth more than $1,000 a year from now because today's money can be invested to earn returns. This is the foundation of investing, discounted cash flow analysis, and all financial planning calculations.",
      },
      {
        id: 7,
        question: "What is net worth?",
        options: [
          "Your monthly take-home salary",
          "Total assets minus total liabilities",
          "Total investments minus total expenses",
          "Annual income minus annual taxes",
        ],
        correctAnswer: 1,
        explanation:
          "Net worth = Total assets (investments, property, cash, retirement accounts) − Total liabilities (mortgage, car loan, credit card debt). It's the single best measure of your financial health regardless of what country you live in. Track it quarterly.",
      },
      {
        id: 8,
        question:
          "What is liquidity risk, especially relevant to real estate investments?",
        options: [
          "Risk that the property physically floods",
          "Risk that you cannot quickly convert the asset to cash without significant loss",
          "Risk of interest rate changes affecting property prices",
          "Risk of tenant not paying rent",
        ],
        correctAnswer: 1,
        explanation:
          "Liquidity risk: some assets (real estate, private equity, locked-in deposits) cannot be quickly sold without loss. Real estate can take months or years to sell at fair value globally — this is why over-allocating to illiquid assets is risky.",
      },
      {
        id: 9,
        question:
          "Deposit insurance schemes protect bank depositors up to a limit. What is the typical protected amount in the US (FDIC) and EU?",
        options: [
          "$10,000 / €10,000",
          "$50,000 / €50,000",
          "$250,000 / €100,000",
          "$1,000,000 / €500,000",
        ],
        correctAnswer: 2,
        explanation:
          "FDIC (US) insures deposits up to $250,000 per depositor per bank. EU Deposit Guarantee Schemes protect €100,000 per depositor per bank. UK FSCS protects £85,000. If you have more, spread across multiple banks.",
      },
      {
        id: 10,
        question:
          "What is a mutual fund industry body and what does it typically do?",
        options: [
          "A government agency that taxes fund returns",
          "An industry association that promotes best practices, regulates distributors, and runs investor education campaigns",
          "A company that directly manages investor money",
          "An exchange where mutual fund units are traded",
        ],
        correctAnswer: 1,
        explanation:
          "Mutual fund industry bodies (e.g., ICI in the US, Investment Association in UK, AMFI in India) promote best practices among fund managers, regulate distribution standards, and run investor awareness campaigns to improve financial literacy.",
      },
    ],
  },

  // ── BASICS QUIZ 2 ────────────────────────────────────────────────────────────
  {
    id: "basics-equity-mf",
    title: "Equity & Mutual Fund Basics",
    category: "basics",
    description:
      "Core concepts about stocks, mutual funds, and systematic investing",
    questions: [
      {
        id: 1,
        question:
          "What is the key advantage of buying a mutual fund through a direct/no-commission channel vs a distributor/adviser-commission channel?",
        options: [
          "Direct channel invests in stocks; commission channel invests in bonds",
          "Direct channel has no distributor commission — lower expense ratio means significantly more wealth over time",
          "Direct channels are for institutional investors only",
          "Direct channels lock money for 3 years; commission channels are open-ended",
        ],
        correctAnswer: 1,
        explanation:
          "Buying direct (no distributor commission) reduces annual costs by 0.5–1.5%. On a $100,000 investment over 20 years, even a 1% cost difference can amount to $100,000+ in extra wealth due to compounding. Always choose the lowest cost option available.",
      },
      {
        id: 2,
        question:
          "What does 'Dollar-Cost Averaging' (DCA) or systematic investment mean in practice?",
        options: [
          "Converting all investments to dollars before investing",
          "Investing a fixed amount at regular intervals regardless of market price — buying more units when prices are low and fewer when high",
          "Averaging returns across all fund categories",
          "Setting a fixed dollar target for each investment session",
        ],
        correctAnswer: 1,
        explanation:
          "DCA / Systematic Investing: invest a fixed amount monthly (e.g., $500 into an index fund). When prices fall, you buy more units automatically. When prices rise, you buy fewer. Over time this reduces your average cost — removing the need to 'time the market'.",
      },
      {
        id: 3,
        question: "What is the exit load (redemption fee) in mutual funds?",
        options: [
          "A fee paid when purchasing mutual fund units",
          "A penalty charged when redeeming units within a specified period (e.g., within 1 year)",
          "Annual fund management charges",
          "Tax on mutual fund capital gains",
        ],
        correctAnswer: 1,
        explanation:
          "Exit load / redemption fee is a penalty (typically 1%) charged if you redeem mutual fund units before a specified holding period. It discourages short-term trading and rewards long-term holders. Index funds and ETFs often have zero exit loads.",
      },
      {
        id: 4,
        question: "What does the expense ratio of a mutual fund represent?",
        options: [
          "The percentage of NAV deducted annually to cover fund management costs",
          "The fund's historical performance over the last year",
          "The ratio of equity to debt in the fund",
          "The percentage of income distributed as dividends",
        ],
        correctAnswer: 0,
        explanation:
          "Expense ratio is the annual fee (as % of AUM) for managing the fund. Broad market index funds charge as low as 0.03–0.2% (Vanguard, Fidelity). Actively managed funds charge 0.5–2%+. Over 20 years, a 1% higher expense ratio can cost 20–25% of your final portfolio value.",
      },
      {
        id: 5,
        question: "What is the difference between CAGR and absolute return?",
        options: [
          "CAGR measures bonds; absolute return measures equity",
          "CAGR is the annualized return rate accounting for compounding; absolute return is total % gain without time consideration",
          "CAGR is before tax; absolute return is after tax",
          "They are the same metric with different names",
        ],
        correctAnswer: 1,
        explanation:
          "Absolute return: $10,000 grew to $20,000 = 100% return. CAGR: if this took 10 years, CAGR = 7.18% p.a. Always compare investments using CAGR — a fund that doubled in 2 years (41% CAGR) far outperforms one that doubled in 10 years (7% CAGR).",
      },
      {
        id: 6,
        question:
          "How are stocks broadly classified by company size, and what is the general risk/return trade-off?",
        options: [
          "Large-cap are foreign companies; small-cap are domestic companies",
          "Large-cap (top companies by market cap) are more stable with lower risk; small-cap (smaller companies) have higher growth potential but higher volatility",
          "Large-cap funds are only suitable for retirees",
          "All of the above",
        ],
        correctAnswer: 1,
        explanation:
          "Globally: Large-cap companies (e.g., Apple, HSBC, TCS) are established, lower risk, moderate returns. Small-cap companies are newer/smaller with higher growth potential but also higher volatility and risk of failure. Most portfolios benefit from a mix.",
      },
      {
        id: 7,
        question:
          "What is an Index Fund and why does research show it outperforms most actively managed funds over 15+ years?",
        options: [
          "An index fund passively copies a market index (e.g., S&P 500) with no active stock picking — ultra-low costs mean it beats 75–85% of active fund managers long-term",
          "An index fund is managed by AI instead of human fund managers",
          "An index fund only invests in government securities",
          "Index funds are only available in the US market",
        ],
        correctAnswer: 0,
        explanation:
          "An index fund mirrors an index (S&P 500, FTSE 100, Nifty 50, etc.) at minimal cost. Research consistently shows 75–85% of active fund managers underperform the index over 15+ years after fees. This is why low-cost index investing is considered the default smart strategy globally.",
      },
      {
        id: 8,
        question:
          "What is the P/E ratio and what does a 'high P/E' indicate about a stock?",
        options: [
          "Price to Earnings ratio — high P/E always means the stock is overvalued",
          "Price to Earnings ratio — high P/E indicates high growth expectations OR overvaluation; must be compared with industry averages",
          "Profit to Equity ratio — shows company profitability only",
          "P/E is only relevant for US markets",
        ],
        correctAnswer: 1,
        explanation:
          "P/E = Stock Price ÷ Earnings Per Share. S&P 500 historical average P/E is ~15–17x. Above 25x suggests expensive; below 12x suggests potentially cheap. Always compare P/E within the same sector — tech companies naturally carry higher P/E than utilities or banks.",
      },
      {
        id: 9,
        question:
          "What is 'tracking error' in the context of index funds and ETFs?",
        options: [
          "Errors in the fund manager's stock picking strategy",
          "The difference in returns between the ETF/index fund and its benchmark index",
          "The volatility of the fund compared to the market",
          "Mistakes made during fund NAV calculation",
        ],
        correctAnswer: 1,
        explanation:
          "Tracking error measures how closely the fund follows its index. A high tracking error means you're not getting pure index exposure. Choose ETFs/index funds with consistently low tracking error — well-managed index funds typically show under 0.1% tracking error.",
      },
      {
        id: 10,
        question:
          "Tax-advantaged retirement accounts (e.g., 401k in US, ISA in UK, PPF/NPS in India) share what common key benefit?",
        options: [
          "Guaranteed returns and zero market risk",
          "Tax benefits that compound over time — either tax-free growth, tax-deferred growth, or tax deductions on contributions",
          "Unlimited investment amounts with no annual caps",
          "Liquidity — withdraw anytime without penalty",
        ],
        correctAnswer: 1,
        explanation:
          "Tax-advantaged accounts exist in every major country (401k/IRA in US, ISA in UK, RRSP in Canada, Superannuation in Australia, NPS/PPF in India). The core benefit: tax-free or tax-deferred compounding dramatically boosts long-term wealth. Always max these before taxable investing.",
      },
    ],
  },

  // ── BASICS QUIZ 3 ────────────────────────────────────────────────────────────
  {
    id: "basics-retirement-tax",
    title: "Retirement Savings & Investment Taxation",
    category: "basics",
    description:
      "Global retirement account types, contribution strategies, and investment tax principles",
    questions: [
      {
        id: 1,
        question:
          "What is the key characteristic of a defined contribution retirement plan (e.g., 401k in US, workplace pension in UK)?",
        options: [
          "Employer guarantees a fixed monthly payout at retirement",
          "Both employee and employer contribute — the final amount depends on investment returns",
          "Only the employer contributes to the account",
          "Contributions are mandatory and fixed by the government",
        ],
        correctAnswer: 1,
        explanation:
          "Defined contribution plans: both you and your employer typically contribute. The final retirement balance depends on total contributions AND investment returns. Unlike defined benefit (pension) plans, there's no guaranteed monthly payout — you bear investment risk.",
      },
      {
        id: 2,
        question:
          "Employer matching in workplace retirement plans (e.g., 401k match, workplace pension match) is often described as what?",
        options: [
          "A legal obligation that can be claimed in court",
          "Free money — contribute enough to get the full employer match before investing elsewhere",
          "Taxable income that increases your annual tax bill significantly",
          "Optional and rarely worth using",
        ],
        correctAnswer: 1,
        explanation:
          "Employer matching is essentially a 50–100% instant return on your contribution. If your employer matches 50% up to 6% of salary, contributing 6% gives you an instant 50% return (3% free). This is mathematically the highest-return investment available — always max the match first.",
      },
      {
        id: 3,
        question:
          "What is the key difference between a Roth IRA (US) / ISA (UK) and a traditional IRA/401k or workplace pension?",
        options: [
          "Roth/ISA use after-tax money — growth and withdrawals are tax-free; traditional accounts use pre-tax money — taxed on withdrawal",
          "Roth/ISA are only for high earners; traditional accounts are for everyone",
          "Roth/ISA are government bonds; traditional accounts invest in stocks",
          "There is no meaningful difference — both are identical in tax treatment",
        ],
        correctAnswer: 0,
        explanation:
          "Roth IRA / ISA (UK): contribute after-tax money, all future growth and withdrawals are completely tax-free. Traditional/workplace: contributions reduce taxable income now, but withdrawals in retirement are taxed. Roth/ISA is typically better for younger investors expecting to be in higher tax brackets at retirement.",
      },
      {
        id: 4,
        question:
          "At what age do most major national retirement accounts (US 401k/IRA, UK pension, etc.) allow penalty-free withdrawals?",
        options: [
          "Age 50",
          "Age 55–59½ depending on country and account type",
          "Age 70",
          "No age restriction — withdraw anytime",
        ],
        correctAnswer: 1,
        explanation:
          "Most retirement accounts allow penalty-free withdrawals around age 55–59½. US: 59½ for IRA/401k. UK: currently 55, rising to 57 in 2028. India NPS: age 60. Early withdrawal typically incurs a 10–25% penalty plus income tax, making early access very costly.",
      },
      {
        id: 5,
        question:
          "What is the general principle of capital gains tax on investments held for a longer term vs a shorter term?",
        options: [
          "Short-term gains are always tax-free; long-term gains are taxed heavily",
          "Long-term gains (typically held 1+ year) are usually taxed at a lower rate than short-term gains to reward patient investing",
          "Tax rates are identical regardless of holding period",
          "Only gains above $1 million are taxed",
        ],
        correctAnswer: 1,
        explanation:
          "Most countries incentivize long-term investing: long-term capital gains (held 1+ year) are taxed at preferential rates. US: 0–20% LTCG vs up to 37% STCG. UK: 10–20% CGT for longer holds. India: 12.5% LTCG vs 20% STCG on equity. Hold investments longer to reduce your tax burden.",
      },
      {
        id: 6,
        question:
          "What is 'tax-loss harvesting' and why is it a valuable strategy?",
        options: [
          "Selling loss-making investments to offset gains elsewhere, reducing your tax bill, then reinvesting in similar assets",
          "Claiming deductions for investment losses in income tax returns",
          "Converting long-term losses to short-term losses",
          "Harvesting dividends from loss-making funds",
        ],
        correctAnswer: 0,
        explanation:
          "Tax-loss harvesting: strategically sell investments at a loss to offset capital gains realized elsewhere. This reduces your tax bill while keeping your investment exposure similar. Available in most countries — best executed before your tax year ends.",
      },
      {
        id: 7,
        question:
          "Sovereign or government bonds held to maturity typically offer what advantage over corporate bonds?",
        options: [
          "Higher returns due to government backing",
          "Zero credit/default risk since governments can print currency (for local currency bonds) — the safest bond category",
          "Exemption from all taxes globally",
          "Traded on stock exchanges like equities",
        ],
        correctAnswer: 1,
        explanation:
          "Government bonds (US Treasuries, UK Gilts, German Bunds) carry zero credit risk for local-currency bonds — the government can always print money to repay. They offer lower yields than corporate bonds precisely because of this safety. The cornerstone of defensive investment portfolios.",
      },
      {
        id: 8,
        question:
          "What is 'tax-efficient investing' in the context of asset location?",
        options: [
          "Investing only in tax-exempt government bonds",
          "Placing high-growth, high-turnover assets in tax-advantaged accounts (retirement funds) and stable, low-turnover assets in taxable accounts",
          "Avoiding any investment that generates dividends",
          "Switching to cash at year-end to minimize taxable events",
        ],
        correctAnswer: 1,
        explanation:
          "Asset location: put tax-inefficient assets (high dividend stocks, bonds, REITs) in tax-advantaged accounts where growth is tax-free or deferred. Keep tax-efficient assets (index funds, low-turnover equity) in taxable accounts. This simple strategy can add 0.5–1% annually to after-tax returns.",
      },
      {
        id: 9,
        question:
          "What does 'compound interest on retirement savings' mean, and why does starting early matter so much?",
        options: [
          "Compound interest has no time benefit — total contributions matter more than timing",
          "Starting early allows your returns to earn returns — 10 extra years of compounding can more than double your final retirement balance vs starting late",
          "Compound interest only benefits those who invest in bonds",
          "Compounding only occurs in government-approved retirement accounts",
        ],
        correctAnswer: 1,
        explanation:
          "At 7% annual return: $10,000 invested at age 25 grows to ~$149,000 by age 65. The same $10,000 at age 35 grows to only ~$76,000 — roughly half. One decade earlier = roughly double the wealth at retirement. Time is the most powerful variable in retirement planning.",
      },
      {
        id: 10,
        question:
          "What is an annuity, and what is the primary trade-off when buying one at retirement?",
        options: [
          "A type of equity fund that provides market returns",
          "An insurance product that provides guaranteed income for life — trading flexibility and upside potential for security and certainty of payments",
          "A government bond that matures at a fixed date",
          "A savings account with a fixed interest rate",
        ],
        correctAnswer: 1,
        explanation:
          "An annuity converts a lump sum into guaranteed income for life (or a fixed term). Trade-off: you give up control of capital and upside potential in exchange for certainty. Fixed annuities lose real value to inflation. Variable annuities can grow but add complexity. Most advisors recommend annuitizing only 30–40% of your corpus.",
      },
    ],
  },

  // ── BASICS QUIZ 4 ────────────────────────────────────────────────────────────
  {
    id: "basics-behavioral-risk",
    title: "Behavioural Finance & Risk",
    category: "basics",
    description:
      "Investor psychology, biases, and smart risk management principles",
    questions: [
      {
        id: 1,
        question: "What is 'loss aversion' in behavioural finance?",
        options: [
          "Avoiding all investments with potential for loss",
          "The psychological tendency where losses hurt ~2x more than equivalent gains feel good",
          "Selling all investments when market falls 10%",
          "Preferring debt funds over equity to avoid any loss",
        ],
        correctAnswer: 1,
        explanation:
          "Loss aversion (Kahneman & Tversky): losing $10,000 feels about 2x as painful as gaining $10,000 feels good. This causes investors to hold losing stocks too long and sell winners too early.",
      },
      {
        id: 2,
        question: "What is 'recency bias' and how does it harm investors?",
        options: [
          "Bias toward recently listed companies in IPOs",
          "Giving excessive weight to recent events — buying after market peaks and selling after crashes",
          "Preference for recently launched mutual fund schemes",
          "Bias toward modern fintech over traditional investing",
        ],
        correctAnswer: 1,
        explanation:
          "Recency bias: we assume recent trends will continue forever. In 2007 (market high), people invested heavily. In early 2020 (COVID crash), people stopped investing. Both are the opposite of what rational investing demands.",
      },
      {
        id: 3,
        question:
          "What is 'herd mentality' in investing and what is a common real-world example?",
        options: [
          "Following Warren Buffett's exact portfolio",
          "Investing because 'everyone is doing it' — e.g., crypto mania of 2021 with retail investors piling in at peak prices",
          "Diversifying into as many assets as possible",
          "Buying government bonds when banks buy them",
        ],
        correctAnswer: 1,
        explanation:
          "Herd mentality: investing because 'everyone is doing it.' Classic examples: tech stocks in 2000, housing in 2007, crypto in 2021, meme stocks in 2021. When everyone is buying, valuations are usually stretched. Buy when there's fear; sell when there's euphoria.",
      },
      {
        id: 4,
        question:
          "Benjamin Graham's 'Mr. Market' metaphor teaches investors what key lesson?",
        options: [
          "Follow the market's daily price signals for buy/sell decisions",
          "Market prices are driven by emotion — be a buyer when Mr. Market is fearful and seller when he's euphoric",
          "The market is always right and prices reflect true value",
          "Ignore Mr. Market and only invest in index funds",
        ],
        correctAnswer: 1,
        explanation:
          "Mr. Market (Benjamin Graham): imagine a manic-depressive business partner who offers to buy/sell every day. When he's terrified (crash), his prices are gifts. When he's euphoric (bull market), his prices are traps. Buy fear, sell greed.",
      },
      {
        id: 5,
        question:
          "The 'Margin of Safety' principle recommends buying a stock when its price is at most what proportion of its estimated intrinsic value?",
        options: [
          "90% of intrinsic value",
          "75% of intrinsic value",
          "⅔ (66%) of intrinsic value",
          "50% of intrinsic value",
        ],
        correctAnswer: 2,
        explanation:
          "Margin of Safety: buy only when the market price is ≤ ⅔ of your estimated intrinsic value. This 33% discount provides a buffer for estimation errors. Warren Buffett calls it the most important concept in investing.",
      },
      {
        id: 6,
        question:
          "What does 'circle of competence' mean as a mental model for investing?",
        options: [
          "Only invest in circular economy businesses",
          "Only invest in businesses/sectors you genuinely understand, and stay away from what you don't",
          "Limit your portfolio to a circle of trusted companies",
          "Use circular analysis (technicals + fundamentals) for every investment",
        ],
        correctAnswer: 1,
        explanation:
          "Circle of competence (Munger/Buffett): know what you understand deeply and invest only within that boundary. Don't invest in pharma stocks because a friend told you — if you don't understand the business, you can't assess the risk.",
      },
      {
        id: 7,
        question:
          "What is 'overconfidence bias' and how does it specifically harm retail traders in F&O?",
        options: [
          "Being overconfident about emergency fund adequacy",
          "Believing you have superior skills/information — leading to excessive F&O trading where SEBI found 91% of retail traders lost money",
          "Being overconfident about tax calculations",
          "Overestimating one's ability to time real estate markets",
        ],
        correctAnswer: 1,
        explanation:
          "Overconfidence: most people believe they're above-average investors. Studies consistently show that 70–90% of retail derivatives traders lose money globally — fuelled by overconfidence that they could beat market makers and algorithmic traders.",
      },
      {
        id: 8,
        question:
          "What is 'inversion thinking' as a mental model for investing (Charlie Munger's approach)?",
        options: [
          "Inverting the portfolio by selling all assets and holding cash",
          "Instead of 'how do I succeed?', ask 'what would make this investment fail?' — and avoid those pitfalls",
          "Using inverse ETFs to hedge downside risk",
          "Inverting P/E ratios to find earnings yield",
        ],
        correctAnswer: 1,
        explanation:
          "Inversion (Munger): instead of 'how can I make money on this stock?', ask 'what could make this go to zero?' If the downside risks are acceptable and avoidable, the investment passes. It's a powerful tool for avoiding disasters.",
      },
      {
        id: 9,
        question:
          "What is the Sharpe Ratio and what does a higher value indicate?",
        options: [
          "Total return divided by initial investment — higher means more absolute profit",
          "Return generated per unit of risk taken (return minus risk-free rate ÷ standard deviation) — higher means better risk-adjusted return",
          "A measure of a fund manager's expertise — higher means more skill",
          "Dividend yield relative to price — higher means more income",
        ],
        correctAnswer: 1,
        explanation:
          "Sharpe Ratio = (Portfolio Return − Risk-Free Rate) ÷ Standard Deviation. A fund returning 15% with high volatility may have a lower Sharpe than one returning 12% with low volatility. Always compare funds on Sharpe Ratio, not just returns.",
      },
      {
        id: 10,
        question:
          "What is 'Dollar-Cost Averaging' (DCA) and why is it powerful?",
        options: [
          "Investing a variable amount based on market conditions",
          "Investing a fixed amount at regular intervals regardless of market price — automatically buys more units when cheap and fewer when expensive",
          "Converting investments to a different currency each month",
          "Averaging purchase prices by buying the same number of units each time",
        ],
        correctAnswer: 1,
        explanation:
          "DCA: invest a fixed amount every month regardless of market. When markets fall 20%, your fixed investment buys 25% more units. Over 15–20 years, this mechanical discipline dramatically reduces average cost and builds significant wealth.",
      },
    ],
  },

  // ── MISTAKES QUIZ 1 ──────────────────────────────────────────────────────────
  {
    id: "mistakes-budgeting-savings",
    title: "Budgeting & Savings Mistakes",
    category: "mistakes",
    description: "Identify and avoid the most common financial mistakes",
    questions: [
      {
        id: 1,
        question:
          "What is the most effective principle to counter 'not tracking expenses at all'?",
        options: [
          "Keep all receipts in a folder for year-end review",
          "Apply zero-based budgeting or a detailed monthly expense log using the 50/30/20 rule",
          "Avoid spending entirely for one month each quarter",
          "Only use cash for all transactions",
        ],
        correctAnswer: 1,
        explanation:
          "Zero-based budgeting (50/30/20 framework) assigns every unit of income a purpose. Tracking reveals that most people underestimate spending by 20–30% — subscriptions, dining, impulse buys add up invisibly.",
      },
      {
        id: 2,
        question:
          "When investors stop SIPs during a market crash, what actually happens to their long-term wealth?",
        options: [
          "They protect their capital from further losses",
          "They miss buying the cheapest units available — locking in paper losses and sacrificing years of recovery gains",
          "Nothing changes — SIPs can be paused without long-term cost",
          "They benefit by reinvesting at the bottom manually",
        ],
        correctAnswer: 1,
        explanation:
          "Stopping a systematic investment during a crash is the most expensive mistake. Cheap units bought during a bear market generate the highest long-term returns. Investors who stopped investing in early 2020 and resumed after recovery lost 15–20% of potential 5-year returns.",
      },
      {
        id: 3,
        question:
          "The mistake of 'paying only the minimum due on credit cards' results in what outcome?",
        options: [
          "Slightly lower credit score but manageable debt",
          "Paying 30–45% annual interest — turning ₹1 lakh into ₹1.3–1.45 lakh in one year of outstanding balance",
          "Improving credit utilization ratio",
          "Shorter loan tenure due to revolving credit",
        ],
        correctAnswer: 1,
        explanation:
          "Credit card interest is typically 20–45% p.a. — the highest legal debt in most countries. Paying only the minimum creates a debt trap where interest compounds faster than you can pay down principal. Always pay the full outstanding amount.",
      },
      {
        id: 4,
        question:
          "The mistake of 'lifestyle inflation' (spending more as income rises) is best countered by which rule?",
        options: [
          "50/30/20 rule applied strictly after every raise",
          "The 1% Lifestyle Creep Rule — increase spending by only 1% when income rises, investing the rest",
          "The 70/20/10 rule — cap expenses at 70%",
          "All of the above are valid approaches",
        ],
        correctAnswer: 3,
        explanation:
          "All three rules address lifestyle inflation. The 1% rule is most specific: if you get a 10% raise, increase spending by only 1% and invest the remaining 9%. The 50/30/20 and 70/20/10 frameworks also enforce spending caps preventing lifestyle creep.",
      },
      {
        id: 5,
        question: "What is the most common insurance mistake investors make?",
        options: [
          "Buying too much term insurance",
          "Mixing insurance with investment — buying endowment/whole-life policies that combine coverage with poor-return savings instead of pure term insurance + separate investment",
          "Not insuring vehicles",
          "Buying health insurance with too high a deductible",
        ],
        correctAnswer: 1,
        explanation:
          "Endowment and whole-life policies mix insurance + investment — giving low returns (3–6%) and inadequate coverage. The correct approach: pure term insurance for protection + invest savings in index funds or diversified portfolios separately.",
      },
      {
        id: 6,
        question:
          "The mistake of 'not having an emergency fund' leaves you vulnerable to what specific risk?",
        options: [
          "Missing out on investment opportunities",
          "Being forced to break investments at a loss, take expensive loans, or default on EMIs when unexpected expenses hit",
          "Paying higher taxes",
          "Losing credit card reward points",
        ],
        correctAnswer: 1,
        explanation:
          "Without an emergency fund, a job loss or medical bill forces you to: (a) break long-term investments at a loss, (b) take personal loans at 15–20%, or (c) use credit cards at 20–40% interest. Build 6 months of expenses in a liquid, accessible account.",
      },
      {
        id: 7,
        question:
          "What is the mistake of 'underestimating real monthly outflows' and how do you fix it?",
        options: [
          "Forgetting to account for loan payments in budget calculations",
          "Thinking you spend $4,000/month when actual spend is $5,500 — invisible expenses (dining, streaming, online shopping, subscriptions) hide in digital payments",
          "Miscalculating income tax",
          "Not accounting for investment returns",
        ],
        correctAnswer: 1,
        explanation:
          "The digital payment era makes overspending invisible — contactless payments, subscription auto-debits, food delivery apps, and impulse online shopping never 'feel' like spending. Track ALL outflows for 2–3 months to reveal your true spending pattern.",
      },
      {
        id: 8,
        question:
          "Spending windfalls carelessly (bonuses, inheritance) is best addressed by which allocation rule?",
        options: [
          "Spend it all immediately since you earned it",
          "50% savings/debt repayment, 30% fun/discretionary, 20% invest (or similar structured split)",
          "Invest 100% in the highest-return asset available",
          "Park it in a savings account and decide later",
        ],
        correctAnswer: 1,
        explanation:
          "The windfall rule: 50% toward existing debt or liquid savings, 30% for enjoyment, 20% toward long-term investments. This balances responsible wealth building with human psychology — pure restriction leads to frustration and eventual splurging.",
      },
      {
        id: 9,
        question:
          "The mistake of 'not automating savings and investments' results in what common outcome?",
        options: [
          "Savings happening randomly depending on monthly mood and discipline",
          "Savings never happening because discretionary spending fills all available income first",
          "Tax complications from manual transfers",
          "Bank charges for manual transfers",
        ],
        correctAnswer: 1,
        explanation:
          "Without automation, the human brain fills available income with spending — 'I'll save what's left' always means saving zero. Automate: set standing instructions to transfer to savings/SIP on the 1st of every month.",
      },
      {
        id: 10,
        question:
          "The mistake of 'giving in to social pressure' (weddings, status symbols, peer comparison) is linked to which cognitive trap?",
        options: [
          "Loss aversion",
          "Social comparison bias / 'keeping up with the Joneses' — spending to signal status rather than to build wealth",
          "Recency bias",
          "Confirmation bias",
        ],
        correctAnswer: 1,
        explanation:
          "Social comparison spending is one of the biggest wealth destroyers globally — expensive weddings funded by loans, luxury cars on financing, premium schools to impress neighbors. Ask: 'Does this align with MY values and goals?' — not whether it impresses others.",
      },
    ],
  },

  // ── MISTAKES QUIZ 2 ──────────────────────────────────────────────────────────
  {
    id: "mistakes-investment-retirement",
    title: "Investment & Retirement Mistakes",
    category: "mistakes",
    description: "Key investment and retirement planning mistakes to avoid",
    questions: [
      {
        id: 1,
        question:
          "The mistake of 'delaying investments / starting late' — what does the Rule of 72 reveal about starting at 25 vs 35?",
        options: [
          "Starting 10 years later makes little difference over a 30-year horizon",
          "At 12% return, money doubles every 6 years — starting at 25 vs 35 means one extra doubling cycle, potentially 2x the final corpus",
          "Starting later with higher investment amount fully compensates",
          "Time horizon is less important than the amount invested",
        ],
        correctAnswer: 1,
        explanation:
          "At 12% CAGR, money doubles every 6 years (Rule of 72). Starting 10 years earlier = 1 extra doubling cycle. The same monthly investment amount started 10 years earlier can result in roughly 2x the final retirement corpus. Early start is the single most powerful wealth-building decision.",
      },
      {
        id: 2,
        question:
          "What is the mistake of 'chasing past returns in mutual funds'?",
        options: [
          "Investing in a fund with 30% returns last year — SEBI data shows last year's top performers rarely repeat next year",
          "Calculating CAGR based on past performance data",
          "Comparing your portfolio to past Nifty performance",
          "Using historical data for retirement planning calculations",
        ],
        correctAnswer: 0,
        explanation:
          "Past performance doesn't predict future returns. The top-performing fund of 2021 often underperforms in 2022–24 due to sector rotation or fund size constraints. Select funds based on 5–10 year consistency, not 1-year rankings.",
      },
      {
        id: 3,
        question:
          "The mistakes of 'not diversifying' AND 'over-diversification' together suggest what optimal approach?",
        options: [
          "Own as many funds and stocks as possible",
          "Own 1–2 funds maximum",
          "Diversify across asset classes (equity, debt, gold) but avoid fund duplication — 3–5 quality funds beats 20 overlapping funds",
          "Diversify only within equity across cap segments",
        ],
        correctAnswer: 2,
        explanation:
          "Owning 20 large-cap funds is NOT diversification — it's di-worse-ification (all correlated, high combined expense). True diversification: equity (domestic + international) + debt + gold. 3–5 quality, non-overlapping funds is optimal.",
      },
      {
        id: 4,
        question:
          "Following tips and herd mentality (mistake 20) is contrasted with which sound investing principle?",
        options: [
          "Technical analysis over fundamentals",
          "Do your own research — invest based on your financial goals, risk profile, and time horizon, not social media trends",
          "Only invest in what the government recommends",
          "Follow institutional investor moves via bulk deal data",
        ],
        correctAnswer: 1,
        explanation:
          "Tips-based investing fails because: (a) the tip is already priced in, (b) you don't understand the business to hold through volatility, (c) the tipper has different goals/risk profile. Research-based conviction allows you to hold through dips.",
      },
      {
        id: 5,
        question:
          "The mistake of 'no retirement planning' is most alarming because of which factor?",
        options: [
          "Equity markets are too volatile for retirement savings",
          "Many workers have no mandatory corporate pension — employer retirement schemes alone are often inadequate; active personal retirement savings are essential",
          "Retirement is too far away to plan for in your 20s",
          "Government pension schemes cover all retirement needs",
        ],
        correctAnswer: 1,
        explanation:
          "In many countries, workplace pension or employer retirement contributions provide only 30–40% of pre-retirement income. Personal retirement savings through index funds, retirement accounts, or similar vehicles must bridge the gap. Start investing 15–20% of income toward retirement from your first paycheck.",
      },
      {
        id: 6,
        question:
          "Falling for 'guaranteed returns' scams — what is the key red flag?",
        options: [
          "Schemes promising returns above 10% are always scams",
          "Any scheme promising fixed returns significantly above FD rates (especially 15%+ guaranteed) in unregulated channels — if it's too good to be true, it almost certainly is",
          "Any unlisted investment should be avoided",
          "Investments without daily NAV disclosure",
        ],
        correctAnswer: 1,
        explanation:
          "No legitimate investment can guarantee equity-like returns (15%+) with savings-like safety. Fraudulent schemes (Ponzi schemes, MLMs) have cost retail investors billions globally. Always verify: is it regulated by a recognized financial authority? Is the return mechanism fully transparent?",
      },
      {
        id: 7,
        question:
          "The mistake of 'not rebalancing portfolio' — what happens to a 70/30 equity/debt portfolio after a strong bull market?",
        options: [
          "Nothing — portfolio stays at 70/30 automatically",
          "Equity grows to 85–90% of portfolio (risk increases significantly) — without rebalancing you're taking far more risk than intended",
          "Debt portion automatically increases to compensate",
          "The portfolio becomes a 50/50 split automatically",
        ],
        correctAnswer: 1,
        explanation:
          "In a bull market, equity grows faster, shifting your 70/30 to 85/15 — dangerously equity-heavy. Annual rebalancing: sell the equity that exceeded target, buy debt/gold. This enforces 'sell high, buy low' systematically.",
      },
      {
        id: 8,
        question:
          "The mistake of 'ignoring inflation impact' — if you need ₹1 lakh per month today, how much will you need in 20 years at 6% inflation?",
        options: ["₹1.5 lakh", "₹2 lakh", "₹3.2 lakh", "₹5 lakh"],
        correctAnswer: 2,
        explanation:
          "At 6% inflation, $1,000 today = ~$3,200 in 20 years in nominal terms needed to buy the same goods (money's purchasing power halves every 12 years at 6% inflation per Rule of 72). Retirement planning must be inflation-adjusted — target corpus calculations must use real, not nominal numbers.",
      },
      {
        id: 9,
        question:
          "The mistake of 'not claiming tax benefits properly' — what combination of tax-advantaged instruments maximizes your tax efficiency?",
        options: [
          "Contribute only to employer retirement scheme",
          "Max out employer retirement match + personal retirement account (IRA/SIPP/NPS) + tax-advantaged health savings accounts, in that order",
          "Park all savings in a standard savings account",
          "Only use government bonds for tax efficiency",
        ],
        correctAnswer: 1,
        explanation:
          "Tax maximization priority: (1) Always capture full employer match — it's an instant 50–100% return. (2) Max personal tax-advantaged retirement account (Roth/traditional IRA, ISA, NPS). (3) Tax-advantaged health savings (HSA, etc.). These combined can save thousands annually in taxes.",
      },
      {
        id: 10,
        question:
          "The mistake of 'not updating nominee details' can result in what serious consequence?",
        options: [
          "Slightly lower investment returns",
          "Legal disputes and years of delay before family receives death benefits — preventing timely financial support during the most vulnerable time",
          "Higher insurance premiums",
          "Account freezing by SEBI",
        ],
        correctAnswer: 1,
        explanation:
          "Outdated or missing beneficiaries/nominees in retirement accounts, insurance, bank accounts, and investment folios can result in: (a) family fighting legal battles for years, (b) benefits going to the wrong person, (c) funds stuck in legal limbo. Review and update beneficiaries annually.",
      },
    ],
  },

  // ── ADVANCED QUIZ ─────────────────────────────────────────────────────────────
  {
    id: "advanced-portfolio-valuation",
    title: "Advanced: Portfolio & Valuation",
    category: "advanced",
    description: "Advanced investing concepts for serious wealth builders",
    questions: [
      {
        id: 1,
        question:
          "What is the CAPE ratio (Cyclically Adjusted P/E) and why is it more useful than standard P/E for market-level valuation?",
        options: [
          "It's a faster version of P/E calculation for algorithmic trading",
          "It uses 10-year inflation-adjusted average earnings — smoothing out business cycle fluctuations for a more reliable valuation signal",
          "It adjusts P/E for currency fluctuations across markets",
          "It's only applicable to US markets, not India",
        ],
        correctAnswer: 1,
        explanation:
          "CAPE (Shiller P/E): uses 10-year inflation-adjusted average earnings. One bad year doesn't make a market look cheap; one good year doesn't make it expensive. When CAPE is very high, future returns tend to be below average.",
      },
      {
        id: 2,
        question:
          "What is EV/EBITDA and why is it often preferred over P/E for comparing companies?",
        options: [
          "Earnings Velocity divided by EBITDA — measures growth speed",
          "Enterprise Value (equity + debt − cash) ÷ EBITDA — accounts for capital structure to compare leveraged and unleveraged companies",
          "It's the same as P/E but uses quarterly instead of annual earnings",
          "EV/EBITDA is only used for private equity investments",
        ],
        correctAnswer: 1,
        explanation:
          "EV/EBITDA = (Market Cap + Debt − Cash) ÷ EBITDA. Unlike P/E, it accounts for debt — a company with 0 debt and one with high debt but same earnings look the same on P/E but different on EV/EBITDA. Better for capital-intensive industries.",
      },
      {
        id: 3,
        question:
          "What is 'sequence of returns risk' in retirement, and why is it dangerous?",
        options: [
          "Negative returns in early retirement years permanently damage the portfolio even if later years recover well",
          "Risk from investing in a specific sequence of asset classes",
          "Risk that returns don't match the sequence predicted by financial models",
          "It's only relevant for annuity products",
        ],
        correctAnswer: 0,
        explanation:
          "Sequence risk: retiring with a $500K portfolio, then a 40% crash in year 1 + withdrawals = $250K. Even if markets recover 15%/year for 10 years, the depleted corpus can't recover as well. Keep 2–3 years of expenses in liquid/debt to avoid selling equity at market lows.",
      },
      {
        id: 4,
        question:
          "What is a 'covered call' as an income strategy for stock investors?",
        options: [
          "Buying call options to protect downside risk",
          "Selling call options against stock you already own — earning premium income while capping your upside",
          "A strategy to cover margin calls",
          "Buying calls that are in-the-money",
        ],
        correctAnswer: 1,
        explanation:
          "Covered call: if you own shares, sell a call option at a higher strike price. You collect the premium immediately. If stock rises above strike: shares get called away (you miss upside beyond strike). Best for generating income on large-cap holdings.",
      },
      {
        id: 5,
        question:
          "Graham's NCAV (Net Current Asset Value) screen identifies what type of deep-value opportunity?",
        options: [
          "Companies with high revenue growth trajectory",
          "Companies where stock price is below (current assets − all liabilities) — buying the business for less than its liquidation value",
          "Companies with maximum dividend yield",
          "Companies with the lowest P/E ratio in an index",
        ],
        correctAnswer: 1,
        explanation:
          "NCAV = Current Assets − Total Liabilities. If stock price < NCAV per share, you're buying $1 of liquid assets for less than $1 — the business itself is free. Graham achieved ~50% annual returns on such positions in his career.",
      },
      {
        id: 6,
        question:
          "What is 'debt-to-equity ratio' and what does a high D/E ratio signal in company analysis?",
        options: [
          "Total debt ÷ total equity — high D/E means the company is growing aggressively, a buy signal",
          "Total debt ÷ total equity — high D/E signals high financial leverage; in a downturn, interest obligations may threaten solvency",
          "Monthly debt payments ÷ equity dividends — used by lenders",
          "Total equity ÷ total debt — high means low growth potential",
        ],
        correctAnswer: 1,
        explanation:
          "D/E = Total Debt ÷ Shareholders' Equity. Acceptable D/E varies by industry (telecom: 2–3x OK; pharma: <1x preferred). High D/E during rising interest rates amplifies risk. Look for declining D/E over 3–5 years as a positive signal.",
      },
      {
        id: 7,
        question:
          "The 4% Safe Withdrawal Rate (SWR) rule for retirement was derived from what historical analysis?",
        options: [
          "Indian EPF withdrawal data over 50 years",
          "US equity/bond portfolio data from 1926–1994 (Trinity Study) — showed 4% annual withdrawal on 50/50 or 60/40 portfolio survived 30 years in 95% of scenarios",
          "Global average pension payout data from G20 countries",
          "Warren Buffett's personal portfolio management approach",
        ],
        correctAnswer: 1,
        explanation:
          "The Trinity Study (1998): on a 60/40 equity/bond portfolio, 4% annual withdrawal (adjusted for inflation) survived 30 years in 95% of historical scenarios from 1926–1994. For India, use 3–3.5% to account for higher inflation.",
      },
      {
        id: 8,
        question:
          "P2P lending platforms offer high stated returns (10–15%) but carry what primary risk?",
        options: [
          "Low liquidity compared to bank deposits",
          "Credit/default risk — if borrowers default, you lose principal; no government deposit insurance protection unlike bank deposits",
          "Interest rate risk similar to long-duration bonds",
          "Regulatory risk from potential securities authority oversight",
        ],
        correctAnswer: 1,
        explanation:
          "P2P lending offers 10–15% returns but principal is unsecured. In economic downturns, default rates spike. Unlike bank deposits, there's no government deposit insurance protection. Regulators in various countries (UK FCA, US, India RBI) cap maximum exposure per lender to limit systemic risk.",
      },
    ],
  },
];

type Category = "all" | "rules" | "basics" | "mistakes" | "advanced";

const CATEGORIES: {
  id: Category;
  label: string;
  icon: React.ReactNode;
  color: string;
  activeBg: string;
  dotColor: string;
}[] = [
  {
    id: "all",
    label: "All Topics",
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    color: "text-slate-600 dark:text-slate-300",
    activeBg: "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900",
    dotColor: "#64748b",
  },
  {
    id: "rules",
    label: "Rules",
    icon: <Shield className="w-3.5 h-3.5" />,
    color: "text-teal-600 dark:text-teal-400",
    activeBg: "bg-teal-600 text-white",
    dotColor: "#0d9488",
  },
  {
    id: "basics",
    label: "Basics",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-600 text-white",
    dotColor: "#10b981",
  },
  {
    id: "mistakes",
    label: "Mistakes",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "text-amber-600 dark:text-amber-400",
    activeBg: "bg-amber-500 text-white",
    dotColor: "#d97706",
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: <Trophy className="w-3.5 h-3.5" />,
    color: "text-violet-600 dark:text-violet-400",
    activeBg: "bg-violet-600 text-white",
    dotColor: "#7c3aed",
  },
];

interface QuizState {
  quizId: string;
  questions: (QuizQuestion & {
    shuffledOptions: string[];
    mappedCorrect: number;
  })[];
  currentIndex: number;
  selectedAnswer: number | null;
  revealed: boolean;
  answers: (number | null)[];
  finished: boolean;
}

function buildQuizState(quiz: Quiz): QuizState {
  const questions = shuffleArray(quiz.questions).map((q) => {
    const indexed = q.options.map((opt, i) => ({ opt, orig: i }));
    const shuffled = shuffleArray(indexed);
    const mappedCorrect = shuffled.findIndex((x) => x.orig === q.correctAnswer);
    return { ...q, shuffledOptions: shuffled.map((x) => x.opt), mappedCorrect };
  });
  return {
    quizId: quiz.id,
    questions,
    currentIndex: 0,
    selectedAnswer: null,
    revealed: false,
    answers: new Array(questions.length).fill(null),
    finished: false,
  };
}

// ─── Score Gauge ───────────────────────────────────────────────────────────────
function ScoreGauge({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={130}
        height={130}
        className="-rotate-90"
        aria-label="Score gauge"
      >
        <title>Score gauge</title>
        <circle
          cx={65}
          cy={65}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={10}
          className="dark:stroke-slate-700"
        />
        <circle
          cx={65}
          cy={65}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-black leading-none" style={{ color }}>
          {pct}%
        </span>
        <span className="text-xs font-semibold mt-0.5 text-slate-500 dark:text-slate-400">
          {score}/{total}
        </span>
      </div>
    </div>
  );
}

// ─── Quiz Card ─────────────────────────────────────────────────────────────────
function QuizCard({
  state,
  onSelect,
  onReveal,
  onNext,
  onFinish,
}: {
  state: QuizState;
  onSelect: (idx: number) => void;
  onReveal: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const { questions, currentIndex, selectedAnswer, revealed } = state;
  const q = questions[currentIndex];
  const progress =
    ((currentIndex + (revealed ? 1 : 0)) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;
  const correctSoFar =
    state.answers.filter(
      (a, i) => a !== null && a === questions[i].mappedCorrect,
    ).length + (revealed && selectedAnswer === q.mappedCorrect ? 1 : 0);

  const optionState = (
    i: number,
  ): "default" | "correct" | "wrong" | "selected" => {
    if (!revealed) return selectedAnswer === i ? "selected" : "default";
    if (i === q.mappedCorrect) return "correct";
    if (i === selectedAnswer && selectedAnswer !== q.mappedCorrect)
      return "wrong";
    return "default";
  };

  const optionClasses: Record<string, string> = {
    default:
      "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer",
    selected:
      "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800 cursor-pointer shadow-sm",
    correct:
      "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
    wrong:
      "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 opacity-75",
  };

  return (
    <div className="space-y-3">
      {/* Progress header */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Q{currentIndex + 1}
            <span className="text-slate-300 dark:text-slate-600">
              /{questions.length}
            </span>
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
            {correctSoFar} correct
          </span>
        </div>
        <Progress
          value={progress}
          className="h-1.5 bg-slate-100 dark:bg-slate-700 [&>div]:bg-blue-500 [&>div]:transition-all [&>div]:duration-500"
        />
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
            <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </span>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
            {q.question}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {q.shuffledOptions.map((opt, i) => {
          const st = optionState(i);
          return (
            <button
              key={`${q.id}-opt-${i}`}
              type="button"
              data-ocid={`quiz.option.${i + 1}`}
              disabled={revealed}
              onClick={() => !revealed && onSelect(i)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left text-sm transition-all duration-150 ${optionClasses[st]}`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  st === "selected"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : st === "correct"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : st === "wrong"
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50"
                }`}
              >
                {st === "correct" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : st === "wrong" ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="flex-1 leading-snug font-medium text-sm">
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div
          className={`rounded-xl border p-3.5 text-sm leading-relaxed ${
            selectedAnswer === q.mappedCorrect
              ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {selectedAnswer === q.mappedCorrect ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <div>
              <p className="font-bold text-xs mb-1">
                {selectedAnswer === q.mappedCorrect
                  ? "✓ Correct!"
                  : "✗ Not quite right"}
              </p>
              <p className="text-xs opacity-90">{q.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action */}
      <div className="flex items-center gap-2.5 pt-1">
        {!revealed ? (
          <Button
            data-ocid="quiz.check_answer"
            onClick={onReveal}
            disabled={selectedAnswer === null}
            className="flex-1 h-10 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Check Answer
          </Button>
        ) : isLast ? (
          <Button
            data-ocid="quiz.finish"
            onClick={onFinish}
            className="flex-1 h-10 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
          >
            <Trophy className="w-4 h-4" /> See Results
          </Button>
        ) : (
          <Button
            data-ocid="quiz.next_question"
            onClick={onNext}
            className="flex-1 h-10 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({
  state,
  quiz,
  onRetake,
  onBack,
}: {
  state: QuizState;
  quiz: Quiz;
  onRetake: () => void;
  onBack: () => void;
}) {
  const score = state.answers.filter(
    (a, i) => a === state.questions[i].mappedCorrect,
  ).length;
  const total = state.questions.length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const feedback =
    pct >= 80
      ? {
          label: "Excellent!",
          sub: "You've mastered this topic",
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
          border: "border-emerald-100 dark:border-emerald-800",
        }
      : pct >= 50
        ? {
            label: "Good effort!",
            sub: "Review the wrong answers to improve",
            color: "text-amber-600 dark:text-amber-400",
            bg: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
            border: "border-amber-100 dark:border-amber-800",
          }
        : {
            label: "Keep learning!",
            sub: "Revisit this topic and try again",
            color: "text-red-600 dark:text-red-400",
            bg: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
            border: "border-red-100 dark:border-red-800",
          };

  return (
    <div className="space-y-4">
      <div
        className={`bg-gradient-to-br ${feedback.bg} rounded-2xl border ${feedback.border} p-5`}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate max-w-[200px]">
              {quiz.title}
            </p>
          </div>
          <ScoreGauge score={score} total={total} />
          <div>
            <p className={`text-lg font-black ${feedback.color}`}>
              {feedback.label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {feedback.sub}
            </p>
          </div>
          <div className="flex items-center gap-5 pt-1">
            <div className="text-center">
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {score}
              </p>
              <p className="text-xs text-slate-500">Correct</p>
            </div>
            <div className="w-px h-7 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-lg font-black text-red-500">{total - score}</p>
              <p className="text-xs text-slate-500">Wrong</p>
            </div>
            <div className="w-px h-7 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-lg font-black text-slate-700 dark:text-slate-200">
                {total}
              </p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Answer Review
          </p>
          <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-0 text-xs">
            {total} questions
          </Badge>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {state.questions.map((q, i) => {
            const answered = state.answers[i];
            const correct = answered === q.mappedCorrect;
            return (
              <div key={q.id} className="px-4 py-3 flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    correct
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {correct ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                    {q.question}
                  </p>
                  <div className="mt-1 space-y-0.5">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ {q.shuffledOptions[q.mappedCorrect]}
                    </p>
                    {!correct && answered !== null && (
                      <p className="text-xs text-red-500 dark:text-red-400">
                        ✗ {q.shuffledOptions[answered]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          data-ocid="quiz.retake_button"
          variant="outline"
          onClick={onRetake}
          className="h-10 text-sm font-semibold rounded-xl border-slate-200 dark:border-slate-700 gap-2 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <RotateCcw className="w-4 h-4" /> Retake
        </Button>
        <Button
          data-ocid="quiz.back_to_categories"
          onClick={onBack}
          className="h-10 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
        >
          <BookOpen className="w-4 h-4" /> More Quizzes
        </Button>
      </div>
    </div>
  );
}

// ─── Main QuizTab ──────────────────────────────────────────────────────────────
export function QuizTab() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);

  const filteredQuizzes = useMemo(() => {
    if (selectedCategory === "all") return quizzes;
    return quizzes.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const startQuiz = useCallback((quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizState(buildQuizState(quiz));
  }, []);

  const handleSelect = useCallback((idx: number) => {
    setQuizState((s) => (s ? { ...s, selectedAnswer: idx } : s));
  }, []);

  const handleReveal = useCallback(() => {
    setQuizState((s) => {
      if (!s) return s;
      const updated = [...s.answers];
      updated[s.currentIndex] = s.selectedAnswer;
      return { ...s, revealed: true, answers: updated };
    });
  }, []);

  const handleNext = useCallback(() => {
    setQuizState((s) =>
      s
        ? {
            ...s,
            currentIndex: s.currentIndex + 1,
            selectedAnswer: null,
            revealed: false,
          }
        : s,
    );
  }, []);

  const handleFinish = useCallback(() => {
    setQuizState((s) => {
      if (!s) return s;
      const updated = [...s.answers];
      updated[s.currentIndex] = s.selectedAnswer;
      return { ...s, answers: updated, finished: true };
    });
  }, []);

  const handleRetake = useCallback(() => {
    if (activeQuiz) setQuizState(buildQuizState(activeQuiz));
  }, [activeQuiz]);

  const handleBack = useCallback(() => {
    setActiveQuiz(null);
    setQuizState(null);
  }, []);

  const categoryMeta: Record<
    Quiz["category"],
    { color: string; bg: string; label: string; dot: string }
  > = {
    rules: {
      color: "text-teal-700 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800",
      label: "Rules",
      dot: "#0d9488",
    },
    basics: {
      color: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
      label: "Basics",
      dot: "#10b981",
    },
    mistakes: {
      color: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      label: "Mistakes",
      dot: "#d97706",
    },
    advanced: {
      color: "text-violet-700 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800",
      label: "Advanced",
      dot: "#7c3aed",
    },
  };

  // ── Active quiz view ──
  if (activeQuiz && quizState) {
    return (
      <div className="space-y-3" data-ocid="quiz.active">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            data-ocid="quiz.back_button"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            All Quizzes
          </button>
          <span className="text-slate-300 dark:text-slate-600">›</span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[160px]">
            {activeQuiz.title}
          </span>
        </div>

        {quizState.finished ? (
          <ResultScreen
            state={quizState}
            quiz={activeQuiz}
            onRetake={handleRetake}
            onBack={handleBack}
          />
        ) : (
          <QuizCard
            state={quizState}
            onSelect={handleSelect}
            onReveal={handleReveal}
            onNext={handleNext}
            onFinish={handleFinish}
          />
        )}
      </div>
    );
  }

  // ── Quiz selection view ──
  return (
    <div className="space-y-4" data-ocid="quiz.tab">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black text-white">
              Finance Knowledge Quiz
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {quizzes.reduce((acc, q) => acc + q.questions.length, 0)}{" "}
              questions from Rules · Basics · Mistakes
            </p>
          </div>
          <div className="flex-shrink-0 text-right hidden sm:block">
            <p className="text-xl font-black text-white">{quizzes.length}</p>
            <p className="text-xs text-slate-400">quizzes</p>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
        data-ocid="quiz.category_filter"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            data-ocid={`quiz.category.${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 border transition-all duration-150 ${
              selectedCategory === cat.id
                ? `${cat.activeBg} border-transparent shadow-sm`
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {filteredQuizzes.length} quiz
        {filteredQuizzes.length !== 1 ? "zes" : ""} found
      </p>

      {/* Quiz grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredQuizzes.map((quiz) => {
          const meta = categoryMeta[quiz.category];
          return (
            <div
              key={quiz.id}
              data-ocid={`quiz.card.${quiz.id}`}
              className="group bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-200"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    className={`text-xs border ${meta.bg} ${meta.color} font-semibold`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
                      style={{ background: meta.dot }}
                    />
                    {meta.label}
                  </Badge>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {quiz.questions.length}Q
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 mb-1.5">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {quiz.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                  <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>~{Math.ceil(quiz.questions.length * 0.5)} min</span>
                  </div>
                  <Button
                    size="sm"
                    data-ocid={`quiz.start.${quiz.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      startQuiz(quiz);
                    }}
                    className="h-8 px-4 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm"
                  >
                    Start <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
