import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  RotateCcw,
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
  learningResource?: string;
}

interface Quiz {
  id: string;
  title: string;
  category:
    | "technical"
    | "fundamental"
    | "advanced"
    | "investment"
    | "financial-education";
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
  {
    id: "financial-education-ch1",
    title: "Chapter 1: Financial Basics",
    category: "financial-education",
    description:
      "Fundamental concepts of personal finance and money management",
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of creating a personal budget?",
        options: [
          "To restrict spending completely",
          "To track income and expenses for better financial control",
          "To impress financial advisors",
          "To avoid paying taxes",
        ],
        correctAnswer: 1,
        explanation:
          "A personal budget helps track income and expenses, enabling better financial control and informed decision-making about spending and saving.",
      },
      {
        id: 2,
        question: "What is compound interest?",
        options: [
          "Interest calculated only on principal",
          "Interest calculated on principal plus accumulated interest",
          "A type of bank fee",
          "Interest paid monthly",
        ],
        correctAnswer: 1,
        explanation:
          "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods, leading to exponential growth over time.",
      },
      {
        id: 3,
        question: "What is the recommended emergency fund size?",
        options: [
          "1-2 months of expenses",
          "3-6 months of expenses",
          "12 months of expenses",
          "No emergency fund needed",
        ],
        correctAnswer: 1,
        explanation:
          "Financial experts recommend maintaining an emergency fund covering 3-6 months of living expenses to handle unexpected financial situations.",
      },
      {
        id: 4,
        question: "What is inflation?",
        options: [
          "Decrease in prices over time",
          "Increase in prices over time, reducing purchasing power",
          "Interest rate on loans",
          "Stock market growth",
        ],
        correctAnswer: 1,
        explanation:
          "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power over time.",
      },
      {
        id: 5,
        question: "What is the time value of money principle?",
        options: [
          "Money loses value over time",
          "Money available now is worth more than the same amount in the future",
          "Future money is more valuable",
          "Money has no time-related value",
        ],
        correctAnswer: 1,
        explanation:
          "The time value of money principle states that money available now is worth more than the same amount in the future due to its potential earning capacity.",
      },
      {
        id: 6,
        question: "What is net worth?",
        options: [
          "Total income minus taxes",
          "Total assets minus total liabilities",
          "Annual salary",
          "Investment returns",
        ],
        correctAnswer: 1,
        explanation:
          "Net worth is calculated by subtracting total liabilities (debts) from total assets, providing a snapshot of financial health.",
      },
      {
        id: 7,
        question: "What is liquidity in personal finance?",
        options: [
          "Amount of water in investments",
          "How quickly assets can be converted to cash",
          "Investment returns",
          "Debt levels",
        ],
        correctAnswer: 1,
        explanation:
          "Liquidity refers to how easily and quickly an asset can be converted into cash without significant loss of value.",
      },
      {
        id: 8,
        question: "What is the 50/30/20 budgeting rule?",
        options: [
          "50% savings, 30% needs, 20% wants",
          "50% needs, 30% wants, 20% savings",
          "50% wants, 30% needs, 20% savings",
          "50% investments, 30% savings, 20% spending",
        ],
        correctAnswer: 1,
        explanation:
          "The 50/30/20 rule suggests allocating 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.",
      },
      {
        id: 9,
        question: "What is a financial goal?",
        options: [
          "Any purchase you want to make",
          "A specific, measurable financial objective with a timeline",
          "Your annual income target",
          "Monthly expense limit",
        ],
        correctAnswer: 1,
        explanation:
          "A financial goal is a specific, measurable objective with a defined timeline, such as saving for retirement or buying a home.",
      },
      {
        id: 10,
        question: "What is the difference between gross income and net income?",
        options: [
          "No difference",
          "Gross is before taxes/deductions, net is after",
          "Gross is monthly, net is annual",
          "Gross is from salary, net is from investments",
        ],
        correctAnswer: 1,
        explanation:
          "Gross income is total earnings before taxes and deductions, while net income is what remains after all deductions.",
      },
      {
        id: 11,
        question: "What is a credit score?",
        options: [
          "Amount of credit available",
          "Numerical representation of creditworthiness",
          "Total debt amount",
          "Bank account balance",
        ],
        correctAnswer: 1,
        explanation:
          "A credit score is a numerical representation of creditworthiness based on credit history, used by lenders to assess risk.",
      },
      {
        id: 12,
        question: "What is diversification?",
        options: [
          "Investing all money in one asset",
          "Spreading investments across different assets to reduce risk",
          "Buying only stocks",
          "Keeping all money in savings",
        ],
        correctAnswer: 1,
        explanation:
          "Diversification involves spreading investments across various assets to reduce risk and minimize the impact of poor performance in any single investment.",
      },
      {
        id: 13,
        question: "What is a liability?",
        options: [
          "An asset you own",
          "A financial obligation or debt",
          "Investment income",
          "Savings account",
        ],
        correctAnswer: 1,
        explanation:
          "A liability is a financial obligation or debt that you owe to others, such as loans, mortgages, or credit card balances.",
      },
      {
        id: 14,
        question: "What is the purpose of financial planning?",
        options: [
          "To avoid spending money",
          "To create a roadmap for achieving financial goals",
          "To impress others",
          "To avoid taxes completely",
        ],
        correctAnswer: 1,
        explanation:
          "Financial planning creates a comprehensive roadmap for managing finances and achieving short-term and long-term financial goals.",
      },
      {
        id: 15,
        question: "What is cash flow?",
        options: [
          "Total savings",
          "Movement of money in and out of accounts",
          "Investment returns",
          "Credit card limit",
        ],
        correctAnswer: 1,
        explanation:
          "Cash flow refers to the movement of money into and out of your accounts, tracking income received and expenses paid.",
      },
    ],
  },
  {
    id: "financial-education-ch2",
    title: "Chapter 2: Banking & Savings",
    category: "financial-education",
    description: "Understanding banking products and savings strategies",
    questions: [
      {
        id: 1,
        question:
          "What is the difference between a savings account and a current account?",
        options: [
          "No difference",
          "Savings earns interest, current is for business transactions",
          "Current earns more interest",
          "Savings is only for businesses",
        ],
        correctAnswer: 1,
        explanation:
          "Savings accounts earn interest and are for personal savings, while current accounts are designed for frequent business transactions with no interest.",
      },
      {
        id: 2,
        question: "What does APY (Annual Percentage Yield) represent?",
        options: [
          "Annual bank fees",
          "Total interest earned in a year including compounding",
          "Loan interest rate",
          "Tax rate on savings",
        ],
        correctAnswer: 1,
        explanation:
          "APY represents the total amount of interest earned in a year, including the effect of compounding, providing a true picture of returns.",
      },
      {
        id: 3,
        question: "What is a Certificate of Deposit (CD)?",
        options: [
          "A type of credit card",
          "A time deposit with fixed term and interest rate",
          "A savings account",
          "An investment in stocks",
        ],
        correctAnswer: 1,
        explanation:
          "A CD is a time deposit offered by banks with a fixed term and interest rate, typically offering higher rates than regular savings accounts.",
      },
      {
        id: 4,
        question: "What is deposit insurance?",
        options: [
          "Insurance for loans",
          "Government insurance protecting bank deposits up to a certain limit",
          "Credit card insurance",
          "Investment insurance",
        ],
        correctAnswer: 1,
        explanation:
          "Deposit insurance protects bank deposits up to a certain limit per depositor per bank in case of bank failure, providing security for savers.",
      },
      {
        id: 5,
        question: "What is a high-yield savings account?",
        options: [
          "Account with high fees",
          "Savings account offering higher interest rates than traditional accounts",
          "Account for high-income individuals only",
          "Account with no withdrawal limits",
        ],
        correctAnswer: 1,
        explanation:
          "A high-yield savings account offers significantly higher interest rates than traditional savings accounts, helping savings grow faster.",
      },
      {
        id: 6,
        question: "What is compound frequency in savings?",
        options: [
          "How often you deposit",
          "How often interest is calculated and added to principal",
          "Withdrawal frequency",
          "Statement frequency",
        ],
        correctAnswer: 1,
        explanation:
          "Compound frequency refers to how often interest is calculated and added to the principal, affecting total returns (daily, monthly, quarterly, annually).",
      },
      {
        id: 7,
        question: "What is automatic savings?",
        options: [
          "Manual transfers",
          "Scheduled automatic transfers from checking to savings",
          "Investment strategy",
          "Loan payment",
        ],
        correctAnswer: 1,
        explanation:
          "Automatic savings involves setting up scheduled transfers from checking to savings accounts, making saving effortless and consistent.",
      },
      {
        id: 8,
        question: "What is the Rule of 72?",
        options: [
          "Tax calculation method",
          "Formula to estimate years to double money at given interest rate",
          "Retirement age",
          "Loan repayment rule",
        ],
        correctAnswer: 1,
        explanation:
          "The Rule of 72 is a simple formula (72 divided by interest rate) to estimate how many years it takes to double your money at a given interest rate.",
      },
      {
        id: 9,
        question: "What is overdraft protection?",
        options: [
          "Insurance for bank failures",
          "Service that covers transactions exceeding account balance",
          "Credit card benefit",
          "Investment protection",
        ],
        correctAnswer: 1,
        explanation:
          "Overdraft protection is a service that covers transactions when account balance is insufficient, typically for a fee.",
      },
      {
        id: 10,
        question: "What is a minimum balance requirement?",
        options: [
          "Maximum you can deposit",
          "Minimum amount required to avoid fees or earn interest",
          "Loan requirement",
          "Credit card limit",
        ],
        correctAnswer: 1,
        explanation:
          "A minimum balance requirement is the lowest amount that must be maintained in an account to avoid fees or qualify for benefits.",
      },
    ],
  },
  {
    id: "financial-education-ch3",
    title: "Chapter 3: Credit & Debt Management",
    category: "financial-education",
    description: "Managing credit cards, loans, and debt effectively",
    questions: [
      {
        id: 1,
        question: "What is a credit card?",
        options: [
          "Debit card",
          "Card allowing purchases on credit with repayment later",
          "Gift card",
          "Savings card",
        ],
        correctAnswer: 1,
        explanation:
          "A credit card allows you to make purchases on credit, borrowing money from the issuer that must be repaid, typically with interest if not paid in full.",
      },
      {
        id: 2,
        question: "What is APR on a credit card?",
        options: [
          "Annual Payment Required",
          "Annual Percentage Rate - yearly interest cost",
          "Account Protection Rate",
          "Automatic Payment Rate",
        ],
        correctAnswer: 1,
        explanation:
          "APR (Annual Percentage Rate) represents the yearly cost of borrowing on a credit card, including interest charges.",
      },
      {
        id: 3,
        question: "What is credit utilization?",
        options: [
          "Total credit available",
          "Percentage of available credit being used",
          "Number of credit cards",
          "Credit score",
        ],
        correctAnswer: 1,
        explanation:
          "Credit utilization is the percentage of available credit being used, calculated by dividing total balances by total credit limits.",
      },
      {
        id: 4,
        question: "What is the recommended credit utilization ratio?",
        options: ["100%", "Below 30%", "50%", "75%"],
        correctAnswer: 1,
        explanation:
          "Financial experts recommend keeping credit utilization below 30% to maintain a good credit score and demonstrate responsible credit management.",
      },
      {
        id: 5,
        question: "What is the debt avalanche method?",
        options: [
          "Paying debts randomly",
          "Paying highest interest rate debts first",
          "Paying smallest debts first",
          "Ignoring debts",
        ],
        correctAnswer: 1,
        explanation:
          "The debt avalanche method prioritizes paying off debts with the highest interest rates first, minimizing total interest paid over time.",
      },
      {
        id: 6,
        question: "What is the debt snowball method?",
        options: [
          "Paying highest balance first",
          "Paying smallest balance first for psychological wins",
          "Paying highest interest first",
          "Not paying debts",
        ],
        correctAnswer: 1,
        explanation:
          "The debt snowball method focuses on paying off the smallest debts first, providing psychological motivation through quick wins.",
      },
      {
        id: 7,
        question: "What is good debt vs bad debt?",
        options: [
          "All debt is bad",
          "Good debt builds wealth (mortgage), bad debt depreciates (credit cards)",
          "All debt is good",
          "No difference",
        ],
        correctAnswer: 1,
        explanation:
          "Good debt typically finances assets that appreciate or generate income (like mortgages or student loans), while bad debt finances depreciating items or consumption.",
      },
      {
        id: 8,
        question: "What is the debt-to-income ratio?",
        options: [
          "Total debt amount",
          "Monthly debt payments divided by gross monthly income",
          "Credit score",
          "Interest rate",
        ],
        correctAnswer: 1,
        explanation:
          "The debt-to-income ratio compares monthly debt payments to gross monthly income, used by lenders to assess borrowing capacity.",
      },
      {
        id: 9,
        question: "What is a balance transfer?",
        options: [
          "Closing an account",
          "Moving debt from one card to another, often for lower rate",
          "Increasing credit limit",
          "Paying off debt",
        ],
        correctAnswer: 1,
        explanation:
          "A balance transfer involves moving debt from one credit card to another, typically to take advantage of a lower interest rate or promotional offer.",
      },
      {
        id: 10,
        question: "What is a credit report?",
        options: [
          "Bank statement",
          "Detailed record of credit history and accounts",
          "Tax document",
          "Investment report",
        ],
        correctAnswer: 1,
        explanation:
          "A credit report is a detailed record of your credit history, including accounts, payment history, and inquiries, used to calculate credit scores.",
      },
    ],
  },
  {
    id: "financial-education-ch4",
    title: "Chapter 4: Investment Fundamentals",
    category: "financial-education",
    description: "Basic investment concepts and principles",
    questions: [
      {
        id: 1,
        question: "What is a stock?",
        options: [
          "Company debt",
          "Ownership share in a company",
          "Bank deposit",
          "Government bond",
        ],
        correctAnswer: 1,
        explanation:
          "A stock represents an ownership share in a company, giving shareholders a claim on assets and earnings.",
      },
      {
        id: 2,
        question: "What is a bond?",
        options: [
          "Company ownership",
          "Debt security where investor loans money to entity",
          "Savings account",
          "Stock option",
        ],
        correctAnswer: 1,
        explanation:
          "A bond is a debt security where an investor loans money to an entity (government or corporation) that borrows funds for a defined period at a fixed interest rate.",
      },
      {
        id: 3,
        question: "What is a mutual fund?",
        options: [
          "Individual stock",
          "Pooled investment vehicle managed by professionals",
          "Bank account",
          "Insurance policy",
        ],
        correctAnswer: 1,
        explanation:
          "A mutual fund pools money from multiple investors to invest in a diversified portfolio of stocks, bonds, or other securities, managed by professionals.",
      },
      {
        id: 4,
        question: "What is an ETF (Exchange-Traded Fund)?",
        options: [
          "Individual stock",
          "Fund that trades on exchange like stock, tracking index or sector",
          "Savings account",
          "Bond",
        ],
        correctAnswer: 1,
        explanation:
          "An ETF is a fund that trades on stock exchanges like individual stocks, typically tracking an index, sector, commodity, or other assets.",
      },
      {
        id: 5,
        question: "What is asset allocation?",
        options: [
          "Buying one stock",
          "Distribution of investments across different asset classes",
          "Selling investments",
          "Checking account balance",
        ],
        correctAnswer: 1,
        explanation:
          "Asset allocation is the strategy of distributing investments across different asset classes (stocks, bonds, cash) to balance risk and reward.",
      },
      {
        id: 6,
        question: "What is dollar-cost averaging?",
        options: [
          "Investing lump sum",
          "Investing fixed amount regularly regardless of price",
          "Timing the market",
          "Selling investments",
        ],
        correctAnswer: 1,
        explanation:
          "Dollar-cost averaging involves investing a fixed amount regularly regardless of market conditions, reducing the impact of volatility.",
      },
      {
        id: 7,
        question: "What is a dividend?",
        options: [
          "Stock price increase",
          "Portion of company profits distributed to shareholders",
          "Bond interest",
          "Investment fee",
        ],
        correctAnswer: 1,
        explanation:
          "A dividend is a portion of a company's profits distributed to shareholders, typically paid quarterly in cash or additional shares.",
      },
      {
        id: 8,
        question: "What is a bull market?",
        options: [
          "Declining market",
          "Rising market with investor optimism",
          "Stable market",
          "Closed market",
        ],
        correctAnswer: 1,
        explanation:
          "A bull market is characterized by rising prices and investor optimism, typically defined as a 20% or more increase from recent lows.",
      },
      {
        id: 9,
        question: "What is a bear market?",
        options: [
          "Rising market",
          "Declining market with investor pessimism",
          "Stable market",
          "New market",
        ],
        correctAnswer: 1,
        explanation:
          "A bear market is characterized by falling prices and investor pessimism, typically defined as a 20% or more decline from recent highs.",
      },
      {
        id: 10,
        question: "What is a capital gain?",
        options: [
          "Dividend payment",
          "Profit from selling asset for more than purchase price",
          "Interest income",
          "Salary increase",
        ],
        correctAnswer: 1,
        explanation:
          "A capital gain is the profit realized from selling an asset for more than its purchase price, subject to capital gains tax.",
      },
    ],
  },
  {
    id: "financial-education-ch5",
    title: "Chapter 5: Retirement Planning",
    category: "financial-education",
    description: "Planning and saving for retirement",
    questions: [
      {
        id: 1,
        question: "What is the 4% rule in retirement?",
        options: [
          "Savings rate",
          "Guideline to withdraw 4% of portfolio annually in retirement",
          "Investment return",
          "Tax rate",
        ],
        correctAnswer: 1,
        explanation:
          "The 4% rule suggests withdrawing 4% of retirement portfolio in the first year, adjusting for inflation annually, to make savings last 30 years.",
      },
      {
        id: 2,
        question: "What is vesting?",
        options: [
          "Investment strategy",
          "Earning ownership of employer retirement contributions over time",
          "Retirement age",
          "Account type",
        ],
        correctAnswer: 1,
        explanation:
          "Vesting is the process of earning full ownership of employer retirement contributions over time, with schedules varying by employer.",
      },
      {
        id: 3,
        question: "What is a target-date fund?",
        options: [
          "Savings account",
          "Fund that automatically adjusts allocation as target retirement date approaches",
          "Individual stock",
          "Bond",
        ],
        correctAnswer: 1,
        explanation:
          "A target-date fund automatically adjusts its asset allocation to become more conservative as the target retirement date approaches.",
      },
      {
        id: 4,
        question: "What is sequence of returns risk?",
        options: [
          "Investment strategy",
          "Risk that order of returns affects retirement portfolio value",
          "Account type",
          "Tax rate",
        ],
        correctAnswer: 1,
        explanation:
          "Sequence of returns risk is the danger that the order of investment returns, especially negative returns early in retirement, can significantly impact portfolio longevity.",
      },
      {
        id: 5,
        question: "What is longevity risk?",
        options: [
          "Investment risk",
          "Risk of outliving retirement savings",
          "Market risk",
          "Inflation risk",
        ],
        correctAnswer: 1,
        explanation:
          "Longevity risk is the possibility of outliving your retirement savings due to longer-than-expected lifespan.",
      },
      {
        id: 6,
        question: "What is NPS (National Pension System) in India?",
        options: [
          "A private pension fund",
          "Government-regulated retirement savings scheme with tax benefits",
          "Bank savings account",
          "Insurance policy",
        ],
        correctAnswer: 1,
        explanation:
          "NPS is a government-regulated, voluntary retirement savings scheme that provides tax benefits under Section 80C and 80CCD(1B).",
      },
      {
        id: 7,
        question: "What is the EPF interest rate for 2024-25?",
        options: ["7.1%", "8.25%", "6.5%", "9%"],
        correctAnswer: 1,
        explanation:
          "The EPFO declared 8.25% interest rate for EPF for FY 2024-25, one of the highest in recent years.",
      },
      {
        id: 8,
        question: "What is the PPF lock-in period?",
        options: ["5 years", "10 years", "15 years", "20 years"],
        correctAnswer: 2,
        explanation:
          "PPF has a lock-in period of 15 years, after which it can be extended in 5-year blocks. Partial withdrawal is allowed from year 7.",
      },
      {
        id: 9,
        question:
          "Under which section can NPS contribution get extra ₹50,000 deduction?",
        options: ["80C", "80D", "80CCD(1B)", "10(10D)"],
        correctAnswer: 2,
        explanation:
          "Section 80CCD(1B) allows an additional deduction of up to ₹50,000 for NPS contributions, over and above the ₹1.5L limit of Section 80C.",
      },
      {
        id: 10,
        question:
          "What percentage of NPS corpus must be used to buy annuity at retirement?",
        options: ["20%", "30%", "40%", "50%"],
        correctAnswer: 2,
        explanation:
          "At retirement (age 60), at least 40% of the NPS Tier-1 corpus must be used to purchase a life annuity. The remaining 60% can be withdrawn tax-free.",
      },
    ],
  },
  {
    id: "technical-moving-average",
    title: "Moving Average Crossover",
    category: "technical",
    description: "Understanding moving average crossover strategy",
    questions: [
      {
        id: 1,
        question: "What is a moving average?",
        options: [
          "Current stock price",
          "Average price over specific time period",
          "Trading volume",
          "Market capitalization",
        ],
        correctAnswer: 1,
        explanation:
          "A moving average is the average price of a security over a specific time period, smoothing out price fluctuations to identify trends.",
      },
      {
        id: 2,
        question: "What is a golden cross?",
        options: [
          "Bearish signal",
          "Bullish signal when short-term MA crosses above long-term MA",
          "Neutral signal",
          "Volume indicator",
        ],
        correctAnswer: 1,
        explanation:
          "A golden cross is a bullish signal that occurs when a short-term moving average crosses above a long-term moving average.",
      },
      {
        id: 3,
        question: "What is a death cross?",
        options: [
          "Bullish signal",
          "Bearish signal when short-term MA crosses below long-term MA",
          "Neutral signal",
          "Volume indicator",
        ],
        correctAnswer: 1,
        explanation:
          "A death cross is a bearish signal that occurs when a short-term moving average crosses below a long-term moving average.",
      },
      {
        id: 4,
        question: "What is the most common moving average pair?",
        options: [
          "10 and 20 day",
          "50 and 200 day",
          "5 and 10 day",
          "100 and 300 day",
        ],
        correctAnswer: 1,
        explanation:
          "The 50-day and 200-day moving averages are the most commonly used pair for identifying major trend changes.",
      },
      {
        id: 5,
        question: "What is an exponential moving average (EMA)?",
        options: [
          "Simple average",
          "Weighted average giving more importance to recent prices",
          "Volume-based average",
          "Price range average",
        ],
        correctAnswer: 1,
        explanation:
          "An EMA is a weighted moving average that gives more importance to recent prices, making it more responsive to new information.",
      },
    ],
  },
  {
    id: "technical-rsi",
    title: "RSI (Relative Strength Index)",
    category: "technical",
    description: "Using RSI for momentum trading",
    questions: [
      {
        id: 1,
        question: "What does RSI measure?",
        options: [
          "Trading volume",
          "Speed and magnitude of price changes",
          "Market capitalization",
          "Dividend yield",
        ],
        correctAnswer: 1,
        explanation:
          "RSI measures the speed and magnitude of recent price changes to evaluate overbought or oversold conditions.",
      },
      {
        id: 2,
        question: "What is the RSI range?",
        options: ["0 to 50", "0 to 100", "-100 to 100", "1 to 10"],
        correctAnswer: 1,
        explanation:
          "RSI ranges from 0 to 100, with readings above 70 typically indicating overbought conditions and below 30 indicating oversold conditions.",
      },
      {
        id: 3,
        question: "What RSI level indicates overbought?",
        options: ["Below 30", "Above 70", "Around 50", "Below 20"],
        correctAnswer: 1,
        explanation:
          "An RSI reading above 70 typically indicates overbought conditions, suggesting the asset may be due for a pullback.",
      },
      {
        id: 4,
        question: "What RSI level indicates oversold?",
        options: ["Above 70", "Below 30", "Around 50", "Above 80"],
        correctAnswer: 1,
        explanation:
          "An RSI reading below 30 typically indicates oversold conditions, suggesting the asset may be due for a bounce.",
      },
      {
        id: 5,
        question: "What is RSI divergence?",
        options: [
          "RSI staying constant",
          "RSI moving opposite to price, signaling potential reversal",
          "RSI matching price",
          "RSI at 50",
        ],
        correctAnswer: 1,
        explanation:
          "RSI divergence occurs when price moves in one direction while RSI moves in the opposite direction, often signaling a potential trend reversal.",
      },
    ],
  },
  {
    id: "technical-macd",
    title: "MACD Strategy",
    category: "technical",
    description: "Trading with MACD indicator",
    questions: [
      {
        id: 1,
        question: "What does MACD stand for?",
        options: [
          "Market Average Convergence Divergence",
          "Moving Average Convergence Divergence",
          "Multiple Asset Convergence Divergence",
          "Momentum Average Convergence Divergence",
        ],
        correctAnswer: 1,
        explanation:
          "MACD stands for Moving Average Convergence Divergence, a trend-following momentum indicator.",
      },
      {
        id: 2,
        question: "What are the three components of MACD?",
        options: [
          "Price, volume, time",
          "MACD line, signal line, histogram",
          "High, low, close",
          "Open, close, volume",
        ],
        correctAnswer: 1,
        explanation:
          "MACD consists of three components: the MACD line, signal line, and histogram showing the difference between them.",
      },
      {
        id: 3,
        question: "What is a bullish MACD crossover?",
        options: [
          "MACD line crosses below signal line",
          "MACD line crosses above signal line",
          "MACD line stays flat",
          "Signal line disappears",
        ],
        correctAnswer: 1,
        explanation:
          "A bullish MACD crossover occurs when the MACD line crosses above the signal line, suggesting upward momentum.",
      },
      {
        id: 4,
        question: "What is a bearish MACD crossover?",
        options: [
          "MACD line crosses above signal line",
          "MACD line crosses below signal line",
          "MACD line stays constant",
          "Histogram turns green",
        ],
        correctAnswer: 1,
        explanation:
          "A bearish MACD crossover occurs when the MACD line crosses below the signal line, suggesting downward momentum.",
      },
      {
        id: 5,
        question: "What does the MACD histogram represent?",
        options: [
          "Trading volume",
          "Difference between MACD line and signal line",
          "Price range",
          "Market capitalization",
        ],
        correctAnswer: 1,
        explanation:
          "The MACD histogram represents the difference between the MACD line and signal line, visualizing momentum strength.",
      },
    ],
  },
  {
    id: "technical-bollinger",
    title: "Bollinger Bands",
    category: "technical",
    description: "Using Bollinger Bands for volatility trading",
    questions: [
      {
        id: 1,
        question: "What are Bollinger Bands?",
        options: [
          "Price levels",
          "Volatility bands around moving average",
          "Volume indicators",
          "Trend lines",
        ],
        correctAnswer: 1,
        explanation:
          "Bollinger Bands are volatility bands placed above and below a moving average, expanding and contracting based on market volatility.",
      },
      {
        id: 2,
        question: "How many standard deviations are typical Bollinger Bands?",
        options: [
          "1 standard deviation",
          "2 standard deviations",
          "3 standard deviations",
          "4 standard deviations",
        ],
        correctAnswer: 1,
        explanation:
          "Typical Bollinger Bands are set at 2 standard deviations above and below a 20-period moving average.",
      },
      {
        id: 3,
        question: "What is a Bollinger Squeeze?",
        options: [
          "Bands expanding",
          "Bands contracting, indicating low volatility before breakout",
          "Price at middle band",
          "Bands disappearing",
        ],
        correctAnswer: 1,
        explanation:
          "A Bollinger Squeeze occurs when bands contract due to low volatility, often preceding a significant price breakout.",
      },
      {
        id: 4,
        question: "What does band width indicate?",
        options: [
          "Price direction",
          "Market volatility level",
          "Trading volume",
          "Trend strength",
        ],
        correctAnswer: 1,
        explanation:
          "Band width indicates market volatility - wider bands suggest higher volatility, while narrower bands suggest lower volatility.",
      },
      {
        id: 5,
        question: "What does it mean when price touches the upper band?",
        options: [
          "Oversold condition",
          "Potentially overbought, may reverse down",
          "Neutral signal",
          "Strong buy signal",
        ],
        correctAnswer: 1,
        explanation:
          "When price touches the upper Bollinger Band, it may indicate overbought conditions and potential for downward reversal.",
      },
    ],
  },
  {
    id: "fundamental-pe-ratio",
    title: "P/E Ratio Analysis",
    category: "fundamental",
    description: "Understanding Price-to-Earnings ratio",
    questions: [
      {
        id: 1,
        question: "What does P/E ratio measure?",
        options: [
          "Company revenue",
          "Price per share relative to earnings per share",
          "Total assets",
          "Market share",
        ],
        correctAnswer: 1,
        explanation:
          "P/E ratio measures the price per share relative to earnings per share, indicating how much investors pay for each dollar of earnings.",
      },
      {
        id: 2,
        question: "How is P/E ratio calculated?",
        options: [
          "Revenue / Shares",
          "Stock Price / Earnings Per Share",
          "Assets / Liabilities",
          "Profit / Revenue",
        ],
        correctAnswer: 1,
        explanation:
          "P/E ratio is calculated by dividing the current stock price by earnings per share (EPS).",
      },
      {
        id: 3,
        question: "What does a high P/E ratio typically indicate?",
        options: [
          "Undervalued stock",
          "High growth expectations or overvaluation",
          "Low risk",
          "High dividends",
        ],
        correctAnswer: 1,
        explanation:
          "A high P/E ratio typically indicates high growth expectations or potential overvaluation, as investors are paying more for each dollar of earnings.",
      },
      {
        id: 4,
        question: "What is the Nifty 50 historical average P/E?",
        options: ["Around 10x", "Around 20x", "Around 30x", "Around 40x"],
        correctAnswer: 1,
        explanation:
          "The Nifty 50 has historically traded at an average P/E of around 20x. Above 25x is considered expensive; below 16x is attractive.",
      },
      {
        id: 5,
        question: "What is the PEG ratio?",
        options: [
          "P/E divided by price",
          "P/E divided by earnings growth rate",
          "Price divided by growth",
          "Earnings divided by growth",
        ],
        correctAnswer: 1,
        explanation:
          "PEG (Price/Earnings-to-Growth) ratio is calculated by dividing P/E by the annual earnings growth rate. PEG < 1 indicates potential undervaluation.",
      },
    ],
  },
  {
    id: "advanced-options",
    title: "Options Trading Basics",
    category: "advanced",
    description: "Understanding options contracts and strategies",
    questions: [
      {
        id: 1,
        question: "What is a call option?",
        options: [
          "Right to sell at strike price",
          "Right to buy at strike price",
          "Obligation to buy",
          "Obligation to sell",
        ],
        correctAnswer: 1,
        explanation:
          "A call option gives the holder the right, but not the obligation, to buy an asset at the strike price before expiration.",
      },
      {
        id: 2,
        question: "What is theta in options?",
        options: [
          "Price sensitivity to volatility",
          "Time decay — loss of value as expiry approaches",
          "Sensitivity to underlying price",
          "Interest rate sensitivity",
        ],
        correctAnswer: 1,
        explanation:
          "Theta measures time decay — how much an option's value decreases each day as it approaches expiration, all else equal.",
      },
      {
        id: 3,
        question: "What is the SEBI FY2025 finding on F&O traders?",
        options: [
          "70% made profits",
          "91% of retail F&O traders lost money",
          "50% broke even",
          "Only 5% traded F&O",
        ],
        correctAnswer: 1,
        explanation:
          "SEBI's FY2025 study found that 91% of individual F&O traders lost money, with total retail losses of ₹1.06 lakh crore.",
      },
      {
        id: 4,
        question: "What is implied volatility (IV)?",
        options: [
          "Historical price range",
          "Market's expectation of future price movement",
          "Current stock price",
          "Option premium",
        ],
        correctAnswer: 1,
        explanation:
          "Implied volatility reflects the market's forecast of likely price movement and is derived from option prices.",
      },
      {
        id: 5,
        question: "What is a covered call strategy?",
        options: [
          "Buying calls on owned stock",
          "Selling calls against stock you own for premium income",
          "Buying puts for protection",
          "Selling naked calls",
        ],
        correctAnswer: 1,
        explanation:
          "A covered call involves selling a call option against stock you already own to earn premium income, capping upside in exchange for income.",
      },
    ],
  },
  {
    id: "investment-india",
    title: "Indian Markets",
    category: "investment",
    description: "India-specific investment knowledge",
    questions: [
      {
        id: 1,
        question: "What is SEBI's role in Indian markets?",
        options: [
          "Sets interest rates",
          "Regulates stock brokers, exchanges, mutual funds, and listed companies",
          "Manages government bonds",
          "Controls foreign exchange",
        ],
        correctAnswer: 1,
        explanation:
          "SEBI (Securities and Exchange Board of India) regulates and develops the securities market in India, protecting investor interests.",
      },
      {
        id: 2,
        question: "What is the LTCG tax rate on equity after Budget 2024?",
        options: ["10%", "12.5%", "15%", "20%"],
        correctAnswer: 1,
        explanation:
          "Budget 2024 revised LTCG (Long-Term Capital Gains) tax on equity to 12.5% on gains above ₹1.25 lakh per year (from 10% previously).",
      },
      {
        id: 3,
        question: "What is the STCG tax rate on equity after Budget 2024?",
        options: ["10%", "15%", "20%", "30%"],
        correctAnswer: 2,
        explanation:
          "Budget 2024 increased STCG (Short-Term Capital Gains) tax on equity to 20% (from 15% previously) for holdings less than 1 year.",
      },
      {
        id: 4,
        question:
          "What is the expense ratio of a typical Nifty 50 index fund in India?",
        options: ["1–2%", "0.5–1%", "0.1–0.2%", "2–3%"],
        correctAnswer: 2,
        explanation:
          "Nifty 50 index funds in India have expense ratios of approximately 0.1–0.2%, making them among the most cost-efficient investments available.",
      },
      {
        id: 5,
        question: "What is the DICGC insurance limit per bank in India?",
        options: ["₹1 lakh", "₹5 lakh", "₹10 lakh", "₹25 lakh"],
        correctAnswer: 1,
        explanation:
          "DICGC (Deposit Insurance and Credit Guarantee Corporation) insures bank deposits up to ₹5 lakh per depositor per bank in India.",
      },
      {
        id: 6,
        question:
          "What is the LRS limit for overseas remittances by Indian residents?",
        options: ["USD 100,000", "USD 250,000", "USD 500,000", "USD 1,000,000"],
        correctAnswer: 1,
        explanation:
          "Under LRS (Liberalised Remittance Scheme), Indian residents can remit up to USD 250,000 per financial year for investments, education, and travel.",
      },
      {
        id: 7,
        question: "Which REIT is the largest in India by market cap?",
        options: [
          "Mindspace REIT",
          "Embassy REIT",
          "Brookfield REIT",
          "Nexus REIT",
        ],
        correctAnswer: 1,
        explanation:
          "Embassy REIT was India's first listed REIT (2019) and remains one of the largest by AUM, owning ~45 million sq ft of office space.",
      },
      {
        id: 8,
        question:
          "What is the tax treatment of Sovereign Gold Bonds on maturity?",
        options: [
          "20% LTCG tax",
          "10% LTCG tax",
          "Fully exempt from capital gains tax",
          "Taxed at slab rate",
        ],
        correctAnswer: 2,
        explanation:
          "Sovereign Gold Bonds held to maturity (8 years) are fully exempt from capital gains tax — making them the most tax-efficient form of gold investment.",
      },
    ],
  },
];

type Category =
  | "all"
  | "technical"
  | "fundamental"
  | "advanced"
  | "investment"
  | "financial-education";

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
    id: "financial-education",
    label: "Finance",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-600 text-white",
    dotColor: "#10b981",
  },
  {
    id: "investment",
    label: "India Markets",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: "text-blue-600 dark:text-blue-400",
    activeBg: "bg-blue-600 text-white",
    dotColor: "#2563eb",
  },
  {
    id: "fundamental",
    label: "Fundamental",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    color: "text-violet-600 dark:text-violet-400",
    activeBg: "bg-violet-600 text-white",
    dotColor: "#7c3aed",
  },
  {
    id: "technical",
    label: "Technical",
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    color: "text-orange-600 dark:text-orange-400",
    activeBg: "bg-orange-600 text-white",
    dotColor: "#ea580c",
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: <Trophy className="w-3.5 h-3.5" />,
    color: "text-red-600 dark:text-red-400",
    activeBg: "bg-red-600 text-white",
    dotColor: "#dc2626",
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
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  const bgColor = pct >= 80 ? "#f0fdf4" : pct >= 50 ? "#fffbeb" : "#fef2f2";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={140}
        height={140}
        className="-rotate-90"
        aria-label="Score gauge"
      >
        <title>Score gauge</title>
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={12}
          className="dark:stroke-slate-700"
        />
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center w-[88px] h-[88px] rounded-full"
        style={{ background: bgColor }}
      >
        <span className="text-3xl font-black leading-none" style={{ color }}>
          {pct}%
        </span>
        <span className="text-xs font-semibold mt-0.5" style={{ color }}>
          {score}/{total}
        </span>
      </div>
    </div>
  );
}

// ─── Quiz Card (active question) ──────────────────────────────────────────────
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
  const answeredCount =
    state.answers.filter((a) => a !== null).length + (revealed ? 1 : 0);
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
      "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer hover:shadow-sm",
    selected:
      "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-700 cursor-pointer shadow-sm",
    correct:
      "border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
    wrong:
      "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
  };

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1}{" "}
            <span className="text-slate-300 dark:text-slate-600">of</span>{" "}
            {questions.length}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
              {correctSoFar} correct
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {answeredCount}/{questions.length} done
            </span>
          </div>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-slate-100 dark:bg-slate-700 [&>div]:bg-blue-500 [&>div]:transition-all [&>div]:duration-500"
        />
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </span>
          <p className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed pt-0.5">
            {q.question}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {q.shuffledOptions.map((opt, i) => {
          const st = optionState(i);
          return (
            <button
              key={`${q.id}-opt-${opt.substring(0, 12)}`}
              type="button"
              data-ocid={`quiz.option.${i + 1}`}
              disabled={revealed}
              onClick={() => !revealed && onSelect(i)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left text-sm transition-all duration-150 ${optionClasses[st]}`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border-2 transition-all ${
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
                  <CheckCircle2 className="w-4 h-4" />
                ) : st === "wrong" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="flex-1 leading-snug font-medium">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div
          className={`rounded-xl border p-4 text-sm leading-relaxed ${
            selectedAnswer === q.mappedCorrect
              ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {selectedAnswer === q.mappedCorrect ? (
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <div>
              <p className="font-bold text-sm mb-1">
                {selectedAnswer === q.mappedCorrect
                  ? "✓ Correct!"
                  : "✗ Not quite right"}
              </p>
              <p className="text-sm opacity-90">{q.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {!revealed ? (
          <Button
            data-ocid="quiz.check_answer"
            onClick={onReveal}
            disabled={selectedAnswer === null}
            className="flex-1 h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Check Answer
          </Button>
        ) : isLast ? (
          <Button
            data-ocid="quiz.finish"
            onClick={onFinish}
            className="flex-1 h-11 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2"
          >
            <Trophy className="w-4 h-4" /> See Results
          </Button>
        ) : (
          <Button
            data-ocid="quiz.next_question"
            onClick={onNext}
            className="flex-1 h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2"
          >
            Next Question <ChevronRight className="w-4 h-4" />
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
    <div className="space-y-5">
      {/* Score hero card */}
      <div
        className={`bg-gradient-to-br ${feedback.bg} rounded-2xl border ${feedback.border} p-6`}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {quiz.title}
            </p>
          </div>
          <ScoreGauge score={score} total={total} />
          <div>
            <p className={`text-xl font-black ${feedback.color}`}>
              {feedback.label}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {feedback.sub}
            </p>
          </div>
          {/* Stats row */}
          <div className="flex items-center gap-6 pt-2">
            <div className="text-center">
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {score}
              </p>
              <p className="text-xs text-slate-500">Correct</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-lg font-black text-red-500">{total - score}</p>
              <p className="text-xs text-slate-500">Wrong</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
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
              <div key={q.id} className="px-4 py-3.5 flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                    correct
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {correct ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
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

      {/* CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          data-ocid="quiz.retake_button"
          variant="outline"
          onClick={onRetake}
          className="h-11 text-sm font-semibold rounded-xl border-slate-200 dark:border-slate-700 gap-2 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <RotateCcw className="w-4 h-4" /> Retake Quiz
        </Button>
        <Button
          data-ocid="quiz.back_to_categories"
          onClick={onBack}
          className="h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
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
    "financial-education": {
      color: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
      label: "Finance",
      dot: "#10b981",
    },
    investment: {
      color: "text-blue-700 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      label: "India Markets",
      dot: "#2563eb",
    },
    fundamental: {
      color: "text-violet-700 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800",
      label: "Fundamental",
      dot: "#7c3aed",
    },
    technical: {
      color: "text-orange-700 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
      label: "Technical",
      dot: "#ea580c",
    },
    advanced: {
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      label: "Advanced",
      dot: "#dc2626",
    },
  };

  // ── Active quiz view ──
  if (activeQuiz && quizState) {
    return (
      <div className="space-y-4" data-ocid="quiz.active">
        {/* Breadcrumb nav */}
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
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
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
    <div className="space-y-5" data-ocid="quiz.tab">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-white">Finance Quiz</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {quizzes.length} quizzes across {CATEGORIES.length - 1} topics ·
              Test your knowledge
            </p>
          </div>
          <div className="flex-shrink-0 text-right hidden sm:block">
            <p className="text-2xl font-black text-white">
              {quizzes.reduce((acc, q) => acc + q.questions.length, 0)}
            </p>
            <p className="text-xs text-slate-400">total questions</p>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
        data-ocid="quiz.category_filter"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            data-ocid={`quiz.category.${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold flex-shrink-0 border transition-all duration-150 ${
              selectedCategory === cat.id
                ? `${cat.activeBg} border-transparent shadow-sm`
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {filteredQuizzes.length} quiz
          {filteredQuizzes.length !== 1 ? "zes" : ""} found
        </p>
      </div>

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
                {/* Badge + question count */}
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
                    {quiz.questions.length} questions
                  </span>
                </div>

                {/* Title + description */}
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 mb-1.5">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {quiz.description}
                </p>

                {/* Start CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
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
                    className="h-8 px-4 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm group-hover:shadow"
                  >
                    Start Quiz <ChevronRight className="w-3.5 h-3.5" />
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
