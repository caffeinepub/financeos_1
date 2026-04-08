import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Info,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Trophy,
  XCircle,
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
        question: "What is a money market account?",
        options: [
          "Stock trading account",
          "Savings account with higher interest and limited transactions",
          "Checking account",
          "Investment account",
        ],
        correctAnswer: 1,
        explanation:
          "A money market account typically offers higher interest rates than regular savings accounts but may have limited monthly transactions.",
      },
      {
        id: 7,
        question: "What is the purpose of a checking account?",
        options: [
          "Long-term savings",
          "Daily transactions and bill payments",
          "Investment purposes",
          "Retirement savings",
        ],
        correctAnswer: 1,
        explanation:
          "Checking accounts are designed for daily transactions, bill payments, and easy access to funds through checks, debit cards, and ATMs.",
      },
      {
        id: 8,
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
        id: 9,
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
      {
        id: 10,
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
        id: 11,
        question: "What is an online savings account?",
        options: [
          "Account only for online shopping",
          "Bank account operated entirely online, often with higher rates",
          "Social media account",
          "Investment account",
        ],
        correctAnswer: 1,
        explanation:
          "Online savings accounts are operated entirely through digital platforms, often offering higher interest rates due to lower overhead costs.",
      },
      {
        id: 12,
        question: "What is a joint account?",
        options: [
          "Account for businesses only",
          "Account shared by two or more people",
          "Investment account",
          "Loan account",
        ],
        correctAnswer: 1,
        explanation:
          "A joint account is shared by two or more individuals, with all parties having equal access and responsibility.",
      },
      {
        id: 13,
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
        id: 14,
        question: "What is a savings goal?",
        options: [
          "Bank requirement",
          "Specific amount targeted for a particular purpose",
          "Interest rate target",
          "Account balance limit",
        ],
        correctAnswer: 1,
        explanation:
          "A savings goal is a specific target amount you aim to save for a particular purpose, such as vacation, emergency fund, or down payment.",
      },
      {
        id: 15,
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
        question: "What is a grace period?",
        options: [
          "Late payment penalty",
          "Time to pay balance without interest charges",
          "Credit limit increase period",
          "Account closure period",
        ],
        correctAnswer: 1,
        explanation:
          "A grace period is the time between purchase and payment due date during which no interest is charged if the balance is paid in full.",
      },
      {
        id: 4,
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
        id: 5,
        question: "What is the recommended credit utilization ratio?",
        options: ["100%", "Below 30%", "50%", "75%"],
        correctAnswer: 1,
        explanation:
          "Financial experts recommend keeping credit utilization below 30% to maintain a good credit score and demonstrate responsible credit management.",
      },
      {
        id: 6,
        question: "What is a minimum payment?",
        options: [
          "Full balance",
          "Smallest amount required to keep account in good standing",
          "Interest charge",
          "Annual fee",
        ],
        correctAnswer: 1,
        explanation:
          "The minimum payment is the smallest amount you must pay by the due date to keep your account in good standing, though paying only this accrues interest.",
      },
      {
        id: 7,
        question: "What is debt consolidation?",
        options: [
          "Ignoring debts",
          "Combining multiple debts into single loan with lower rate",
          "Increasing debt",
          "Declaring bankruptcy",
        ],
        correctAnswer: 1,
        explanation:
          "Debt consolidation involves combining multiple debts into a single loan, ideally with a lower interest rate, simplifying payments and potentially reducing costs.",
      },
      {
        id: 8,
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
        id: 9,
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
        id: 10,
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
        id: 11,
        question: "What is a secured credit card?",
        options: [
          "Card with no fees",
          "Card requiring cash deposit as collateral",
          "Premium credit card",
          "Business credit card",
        ],
        correctAnswer: 1,
        explanation:
          "A secured credit card requires a cash deposit as collateral, making it easier to obtain for those building or rebuilding credit.",
      },
      {
        id: 12,
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
      {
        id: 13,
        question: "What is a hard inquiry?",
        options: [
          "Checking your own credit",
          "Credit check by lender when applying for credit",
          "Bank statement review",
          "Tax audit",
        ],
        correctAnswer: 1,
        explanation:
          "A hard inquiry occurs when a lender checks your credit for a lending decision, potentially lowering your credit score temporarily.",
      },
      {
        id: 14,
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
        id: 15,
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
        question: "What is an investment?",
        options: [
          "Spending money",
          "Allocating money to generate returns or profit",
          "Saving in checking account",
          "Buying consumer goods",
        ],
        correctAnswer: 1,
        explanation:
          "An investment is the allocation of money or resources with the expectation of generating returns or profit over time.",
      },
      {
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
        question: "What is risk tolerance?",
        options: [
          "Investment returns",
          "Ability and willingness to endure investment losses",
          "Account balance",
          "Interest rate",
        ],
        correctAnswer: 1,
        explanation:
          "Risk tolerance is an investor's ability and willingness to endure losses in investment value, influenced by financial situation and emotional capacity.",
      },
      {
        id: 7,
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
        id: 8,
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
        id: 9,
        question: "What is market capitalization?",
        options: [
          "Company revenue",
          "Total market value of company's outstanding shares",
          "Stock price",
          "Company profit",
        ],
        correctAnswer: 1,
        explanation:
          "Market capitalization is the total market value of a company's outstanding shares, calculated by multiplying share price by total shares outstanding.",
      },
      {
        id: 10,
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
        id: 11,
        question: "What is portfolio rebalancing?",
        options: [
          "Selling all investments",
          "Adjusting portfolio to maintain target asset allocation",
          "Buying more stocks",
          "Closing accounts",
        ],
        correctAnswer: 1,
        explanation:
          "Portfolio rebalancing involves periodically adjusting holdings to maintain the target asset allocation, buying or selling assets as needed.",
      },
      {
        id: 12,
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
        id: 13,
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
        id: 14,
        question: "What is volatility?",
        options: [
          "Investment returns",
          "Degree of variation in investment prices over time",
          "Interest rate",
          "Account balance",
        ],
        correctAnswer: 1,
        explanation:
          "Volatility measures the degree of variation in investment prices over time, indicating the level of risk or uncertainty.",
      },
      {
        id: 15,
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
        question: "What is a 401(k)?",
        options: [
          "Savings account",
          "Employer-sponsored retirement savings plan",
          "Investment strategy",
          "Insurance policy",
        ],
        correctAnswer: 1,
        explanation:
          "A 401(k) is an employer-sponsored retirement savings plan allowing employees to contribute pre-tax income, often with employer matching.",
      },
      {
        id: 2,
        question: "What is an IRA (Individual Retirement Account)?",
        options: [
          "Business account",
          "Personal retirement savings account with tax advantages",
          "Checking account",
          "Credit card",
        ],
        correctAnswer: 1,
        explanation:
          "An IRA is a personal retirement savings account offering tax advantages, available to anyone with earned income.",
      },
      {
        id: 3,
        question: "What is the difference between Traditional and Roth IRA?",
        options: [
          "No difference",
          "Traditional: tax-deferred, Roth: tax-free withdrawals",
          "Traditional is better",
          "Roth is for businesses",
        ],
        correctAnswer: 1,
        explanation:
          "Traditional IRA contributions are tax-deductible with taxed withdrawals, while Roth IRA uses after-tax contributions with tax-free qualified withdrawals.",
      },
      {
        id: 4,
        question: "What is employer matching?",
        options: [
          "Salary increase",
          "Employer contribution matching employee retirement contributions",
          "Bonus payment",
          "Stock option",
        ],
        correctAnswer: 1,
        explanation:
          "Employer matching is when an employer contributes to an employee's retirement account, matching a percentage of the employee's contributions.",
      },
      {
        id: 5,
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
        id: 6,
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
        id: 7,
        question: "What is Social Security?",
        options: [
          "Private insurance",
          "Government program providing retirement income",
          "Investment account",
          "Savings account",
        ],
        correctAnswer: 1,
        explanation:
          "Social Security is a government program providing retirement income to eligible individuals based on work history and contributions.",
      },
      {
        id: 8,
        question: "What is full retirement age for Social Security?",
        options: ["60", "66-67 depending on birth year", "70", "55"],
        correctAnswer: 1,
        explanation:
          "Full retirement age for Social Security is 66-67 depending on birth year, when you can receive full benefits without reduction.",
      },
      {
        id: 9,
        question: "What is a pension?",
        options: [
          "Savings account",
          "Employer-funded retirement plan providing regular payments",
          "Investment strategy",
          "Insurance policy",
        ],
        correctAnswer: 1,
        explanation:
          "A pension is an employer-funded retirement plan that provides regular payments to retirees, based on salary and years of service.",
      },
      {
        id: 10,
        question: "What is required minimum distribution (RMD)?",
        options: [
          "Contribution limit",
          "Minimum amount that must be withdrawn from retirement accounts annually",
          "Investment return",
          "Account balance",
        ],
        correctAnswer: 1,
        explanation:
          "RMD is the minimum amount that must be withdrawn annually from certain retirement accounts starting at age 72 (or 73 for those born after 1950).",
      },
      {
        id: 11,
        question: "What is catch-up contribution?",
        options: [
          "Regular contribution",
          "Additional contribution allowed for those 50 and older",
          "Employer match",
          "Penalty payment",
        ],
        correctAnswer: 1,
        explanation:
          "Catch-up contributions are additional amounts those aged 50 and older can contribute to retirement accounts beyond regular limits.",
      },
      {
        id: 12,
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
        id: 13,
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
        id: 14,
        question: "What is a Roth conversion?",
        options: [
          "Opening new account",
          "Converting Traditional IRA to Roth IRA, paying taxes now",
          "Closing account",
          "Investment strategy",
        ],
        correctAnswer: 1,
        explanation:
          "A Roth conversion involves converting a Traditional IRA to a Roth IRA, paying taxes on the converted amount now for tax-free withdrawals later.",
      },
      {
        id: 15,
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
      {
        id: 4,
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
        id: 5,
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
    ],
  },
  {
    id: "technical-stochastic",
    title: "Stochastic Oscillator",
    category: "technical",
    description: "Trading with Stochastic Oscillator",
    questions: [
      {
        id: 1,
        question: "What does the Stochastic Oscillator measure?",
        options: [
          "Trading volume",
          "Current price relative to price range over period",
          "Market capitalization",
          "Dividend yield",
        ],
        correctAnswer: 1,
        explanation:
          "The Stochastic Oscillator measures the current price relative to the price range over a specific period, indicating momentum.",
      },
      {
        id: 2,
        question: "What is the range of Stochastic Oscillator?",
        options: ["0 to 50", "0 to 100", "-100 to 100", "1 to 10"],
        correctAnswer: 1,
        explanation:
          "The Stochastic Oscillator ranges from 0 to 100, with readings above 80 indicating overbought and below 20 indicating oversold.",
      },
      {
        id: 3,
        question: "What are the two lines in Stochastic Oscillator?",
        options: [
          "Price and volume",
          "%K (fast) and %D (slow)",
          "High and low",
          "Open and close",
        ],
        correctAnswer: 1,
        explanation:
          "The Stochastic Oscillator consists of %K (fast line) and %D (slow line, which is a moving average of %K).",
      },
      {
        id: 4,
        question: "What is a bullish Stochastic signal?",
        options: [
          "%K crosses below %D",
          "%K crosses above %D in oversold zone",
          "%K stays flat",
          "%D disappears",
        ],
        correctAnswer: 1,
        explanation:
          "A bullish signal occurs when %K crosses above %D, especially in the oversold zone (below 20).",
      },
      {
        id: 5,
        question: "What is a bearish Stochastic signal?",
        options: [
          "%K crosses above %D",
          "%K crosses below %D in overbought zone",
          "%K stays constant",
          "%D turns green",
        ],
        correctAnswer: 1,
        explanation:
          "A bearish signal occurs when %K crosses below %D, especially in the overbought zone (above 80).",
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
        question: "What does a low P/E ratio typically indicate?",
        options: [
          "Overvalued stock",
          "Undervaluation or low growth expectations",
          "High growth",
          "Strong momentum",
        ],
        correctAnswer: 1,
        explanation:
          "A low P/E ratio may indicate undervaluation or low growth expectations, suggesting the stock is cheaper relative to earnings.",
      },
      {
        id: 5,
        question: "What is forward P/E?",
        options: [
          "Historical P/E",
          "P/E based on projected future earnings",
          "Average P/E",
          "Industry P/E",
        ],
        correctAnswer: 1,
        explanation:
          "Forward P/E uses projected future earnings instead of historical earnings, providing insight into expected valuation.",
      },
    ],
  },
  {
    id: "fundamental-roe",
    title: "Return on Equity (ROE)",
    category: "fundamental",
    description: "Analyzing company profitability with ROE",
    questions: [
      {
        id: 1,
        question: "What does ROE measure?",
        options: [
          "Total revenue",
          "Profitability relative to shareholder equity",
          "Market share",
          "Asset value",
        ],
        correctAnswer: 1,
        explanation:
          "ROE measures how efficiently a company generates profits from shareholder equity, indicating management effectiveness.",
      },
      {
        id: 2,
        question: "How is ROE calculated?",
        options: [
          "Revenue / Assets",
          "Net Income / Shareholder Equity",
          "Profit / Sales",
          "Assets / Liabilities",
        ],
        correctAnswer: 1,
        explanation:
          "ROE is calculated by dividing net income by shareholder equity, expressed as a percentage.",
      },
      {
        id: 3,
        question: "What is considered a good ROE?",
        options: ["Below 5%", "Above 15-20%", "Exactly 10%", "Negative"],
        correctAnswer: 1,
        explanation:
          "An ROE above 15-20% is generally considered good, though this varies by industry and should be compared to peers.",
      },
      {
        id: 4,
        question: "What can artificially inflate ROE?",
        options: [
          "Increasing revenue",
          "High debt levels reducing equity",
          "Cutting costs",
          "Expanding operations",
        ],
        correctAnswer: 1,
        explanation:
          "High debt levels can artificially inflate ROE by reducing shareholder equity, making the ratio appear better than it is.",
      },
      {
        id: 5,
        question: "What is the DuPont analysis of ROE?",
        options: [
          "Simple ROE calculation",
          "Breaking ROE into profit margin, asset turnover, and leverage",
          "Industry comparison",
          "Historical trend",
        ],
        correctAnswer: 1,
        explanation:
          "DuPont analysis breaks ROE into three components: profit margin, asset turnover, and financial leverage, providing deeper insight.",
      },
    ],
  },
  {
    id: "fundamental-debt-equity",
    title: "Debt-to-Equity Ratio",
    category: "fundamental",
    description: "Evaluating company leverage",
    questions: [
      {
        id: 1,
        question: "What does debt-to-equity ratio measure?",
        options: [
          "Profitability",
          "Financial leverage and capital structure",
          "Market share",
          "Revenue growth",
        ],
        correctAnswer: 1,
        explanation:
          "Debt-to-equity ratio measures financial leverage by comparing total debt to shareholder equity, indicating capital structure.",
      },
      {
        id: 2,
        question: "How is debt-to-equity ratio calculated?",
        options: [
          "Assets / Liabilities",
          "Total Debt / Shareholder Equity",
          "Revenue / Expenses",
          "Profit / Sales",
        ],
        correctAnswer: 1,
        explanation:
          "Debt-to-equity ratio is calculated by dividing total debt by shareholder equity.",
      },
      {
        id: 3,
        question: "What does a high debt-to-equity ratio indicate?",
        options: [
          "Low risk",
          "High financial leverage and risk",
          "Strong profitability",
          "Low debt",
        ],
        correctAnswer: 1,
        explanation:
          "A high debt-to-equity ratio indicates high financial leverage and potentially higher risk, as the company relies heavily on debt.",
      },
      {
        id: 4,
        question: "What does a low debt-to-equity ratio indicate?",
        options: [
          "High risk",
          "Conservative capital structure with less leverage",
          "Poor management",
          "Declining business",
        ],
        correctAnswer: 1,
        explanation:
          "A low debt-to-equity ratio indicates a conservative capital structure with less financial leverage and lower risk.",
      },
      {
        id: 5,
        question: "Why does optimal debt-to-equity vary by industry?",
        options: [
          "It doesn't vary",
          "Different industries have different capital requirements and risk profiles",
          "All industries are the same",
          "Random variation",
        ],
        correctAnswer: 1,
        explanation:
          "Optimal debt-to-equity varies by industry due to different capital requirements, asset bases, and risk profiles.",
      },
    ],
  },
  {
    id: "fundamental-eps",
    title: "Earnings Per Share (EPS)",
    category: "fundamental",
    description: "Understanding EPS and its importance",
    questions: [
      {
        id: 1,
        question: "What is EPS?",
        options: [
          "Total company earnings",
          "Portion of profit allocated to each outstanding share",
          "Stock price",
          "Revenue per share",
        ],
        correctAnswer: 1,
        explanation:
          "EPS is the portion of a company's profit allocated to each outstanding share of common stock, indicating profitability per share.",
      },
      {
        id: 2,
        question: "How is basic EPS calculated?",
        options: [
          "Revenue / Shares",
          "Net Income / Outstanding Shares",
          "Assets / Shares",
          "Sales / Shares",
        ],
        correctAnswer: 1,
        explanation:
          "Basic EPS is calculated by dividing net income by the number of outstanding shares.",
      },
      {
        id: 3,
        question: "What is diluted EPS?",
        options: [
          "Same as basic EPS",
          "EPS assuming all convertible securities are exercised",
          "EPS before taxes",
          "EPS after dividends",
        ],
        correctAnswer: 1,
        explanation:
          "Diluted EPS assumes all convertible securities (options, warrants, convertible bonds) are exercised, showing worst-case earnings per share.",
      },
      {
        id: 4,
        question: "Why is EPS growth important?",
        options: [
          "It's not important",
          "Indicates improving profitability and potential stock price appreciation",
          "Only matters for dividends",
          "Irrelevant to investors",
        ],
        correctAnswer: 1,
        explanation:
          "EPS growth indicates improving profitability and is often correlated with stock price appreciation, making it important for investors.",
      },
      {
        id: 5,
        question: "What is the relationship between EPS and P/E ratio?",
        options: [
          "No relationship",
          "P/E = Stock Price / EPS",
          "EPS = P/E x Stock Price",
          "They are the same",
        ],
        correctAnswer: 1,
        explanation:
          "P/E ratio is calculated by dividing stock price by EPS, showing how much investors pay for each dollar of earnings.",
      },
    ],
  },
  {
    id: "fundamental-cash-flow",
    title: "Cash Flow Analysis",
    category: "fundamental",
    description: "Understanding company cash flows",
    questions: [
      {
        id: 1,
        question: "What is free cash flow?",
        options: [
          "Total revenue",
          "Cash from operations minus capital expenditures",
          "Net income",
          "Total assets",
        ],
        correctAnswer: 1,
        explanation:
          "Free cash flow is cash from operations minus capital expenditures, representing cash available for distribution to investors.",
      },
      {
        id: 2,
        question: "Why is cash flow important?",
        options: [
          "It's not important",
          "Shows actual cash generation, harder to manipulate than earnings",
          "Only for accounting",
          "Irrelevant to investors",
        ],
        correctAnswer: 1,
        explanation:
          "Cash flow is important because it shows actual cash generation and is harder to manipulate than accounting earnings.",
      },
      {
        id: 3,
        question: "What are the three types of cash flow?",
        options: [
          "Revenue, expenses, profit",
          "Operating, investing, financing",
          "Assets, liabilities, equity",
          "Income, balance, statement",
        ],
        correctAnswer: 1,
        explanation:
          "The three types of cash flow are operating (from business operations), investing (from investments), and financing (from debt/equity).",
      },
      {
        id: 4,
        question: "What does positive operating cash flow indicate?",
        options: [
          "Company is losing money",
          "Company generates cash from core business operations",
          "Company has high debt",
          "Company is unprofitable",
        ],
        correctAnswer: 1,
        explanation:
          "Positive operating cash flow indicates the company generates sufficient cash from its core business operations.",
      },
      {
        id: 5,
        question: "What is the cash conversion cycle?",
        options: [
          "Annual cash flow",
          "Time to convert investments in inventory to cash",
          "Dividend payment schedule",
          "Loan repayment period",
        ],
        correctAnswer: 1,
        explanation:
          "The cash conversion cycle measures the time it takes to convert investments in inventory and other resources into cash from sales.",
      },
    ],
  },
  {
    id: "advanced-monte-carlo",
    title: "Monte Carlo Simulation",
    category: "advanced",
    description: "Using Monte Carlo for portfolio modeling",
    questions: [
      {
        id: 1,
        question: "What is Monte Carlo simulation?",
        options: [
          "Historical analysis",
          "Statistical technique using random sampling to model outcomes",
          "Technical indicator",
          "Fundamental analysis",
        ],
        correctAnswer: 1,
        explanation:
          "Monte Carlo simulation is a statistical technique that uses random sampling to model a range of possible outcomes and their probabilities.",
      },
      {
        id: 2,
        question: "Why use Monte Carlo in portfolio analysis?",
        options: [
          "It's not useful",
          "To model range of possible returns and assess risk",
          "Only for day trading",
          "To predict exact returns",
        ],
        correctAnswer: 1,
        explanation:
          "Monte Carlo simulation helps model a range of possible portfolio returns and assess risk by running thousands of scenarios.",
      },
      {
        id: 3,
        question: "What does Monte Carlo require as inputs?",
        options: [
          "Only current prices",
          "Expected returns, volatility, and correlations",
          "Just historical prices",
          "Only dividends",
        ],
        correctAnswer: 1,
        explanation:
          "Monte Carlo simulation requires inputs including expected returns, volatility (standard deviation), and correlations between assets.",
      },
      {
        id: 4,
        question: "What is a confidence interval in Monte Carlo?",
        options: [
          "Exact prediction",
          "Range where outcomes likely fall with certain probability",
          "Average return",
          "Maximum loss",
        ],
        correctAnswer: 1,
        explanation:
          "A confidence interval shows the range where outcomes are likely to fall with a certain probability (e.g., 95% confidence interval).",
      },
      {
        id: 5,
        question: "What is a limitation of Monte Carlo?",
        options: [
          "Too simple",
          "Assumes normal distribution and past patterns continue",
          "Too accurate",
          "No limitations",
        ],
        correctAnswer: 1,
        explanation:
          "Monte Carlo often assumes normal distribution and that past patterns will continue, which may not hold during market crises or regime changes.",
      },
    ],
  },
  {
    id: "advanced-black-scholes",
    title: "Black-Scholes Model",
    category: "advanced",
    description: "Options pricing with Black-Scholes",
    questions: [
      {
        id: 1,
        question: "What does Black-Scholes model price?",
        options: ["Stocks", "European-style options", "Bonds", "Real estate"],
        correctAnswer: 1,
        explanation:
          "The Black-Scholes model is used to price European-style options, which can only be exercised at expiration.",
      },
      {
        id: 2,
        question: "What are the key inputs to Black-Scholes?",
        options: [
          "Only stock price",
          "Stock price, strike, time, volatility, risk-free rate",
          "Just volatility",
          "Only dividends",
        ],
        correctAnswer: 1,
        explanation:
          "Black-Scholes requires five inputs: current stock price, strike price, time to expiration, volatility, and risk-free interest rate.",
      },
      {
        id: 3,
        question: "What is implied volatility?",
        options: [
          "Historical volatility",
          "Market's expectation of future volatility derived from option prices",
          "Current price movement",
          "Trading volume",
        ],
        correctAnswer: 1,
        explanation:
          "Implied volatility is the market's expectation of future volatility, derived by working backwards from observed option prices.",
      },
      {
        id: 4,
        question: "What is a key assumption of Black-Scholes?",
        options: [
          "Markets are inefficient",
          "Log-normal distribution of returns and constant volatility",
          "High transaction costs",
          "Dividends are unpredictable",
        ],
        correctAnswer: 1,
        explanation:
          "Black-Scholes assumes log-normal distribution of returns, constant volatility, no transaction costs, and efficient markets.",
      },
      {
        id: 5,
        question: "What are the Greeks in options?",
        options: [
          "Greek investors",
          "Measures of option price sensitivity to various factors",
          "Greek stocks",
          "Currency rates",
        ],
        correctAnswer: 1,
        explanation:
          "The Greeks (Delta, Gamma, Theta, Vega, Rho) measure option price sensitivity to changes in underlying factors.",
      },
    ],
  },
  {
    id: "advanced-var",
    title: "Value at Risk (VaR)",
    category: "advanced",
    description: "Risk measurement with VaR",
    questions: [
      {
        id: 1,
        question: "What is Value at Risk (VaR)?",
        options: [
          "Average return",
          "Maximum potential loss over time period at confidence level",
          "Expected profit",
          "Stock price",
        ],
        correctAnswer: 1,
        explanation:
          "VaR estimates the maximum potential loss over a specific time period at a given confidence level (e.g., 95% or 99%).",
      },
      {
        id: 2,
        question: "What does 95% VaR of $1M mean?",
        options: [
          "Will lose $1M",
          "95% confident losses won't exceed $1M",
          "Will gain $1M",
          "Average loss is $1M",
        ],
        correctAnswer: 1,
        explanation:
          "A 95% VaR of $1M means there's 95% confidence that losses won't exceed $1M over the specified period.",
      },
      {
        id: 3,
        question: "What are the three main VaR methods?",
        options: [
          "Only historical",
          "Historical, variance-covariance, Monte Carlo",
          "Just Monte Carlo",
          "Only fundamental",
        ],
        correctAnswer: 1,
        explanation:
          "The three main VaR methods are historical simulation, variance-covariance (parametric), and Monte Carlo simulation.",
      },
      {
        id: 4,
        question: "What is a limitation of VaR?",
        options: [
          "Too accurate",
          "Doesn't capture tail risk beyond confidence level",
          "Too simple",
          "No limitations",
        ],
        correctAnswer: 1,
        explanation:
          "VaR doesn't capture the magnitude of losses beyond the confidence level (tail risk) and can underestimate extreme events.",
      },
      {
        id: 5,
        question: "What is Conditional VaR (CVaR)?",
        options: [
          "Same as VaR",
          "Expected loss given that loss exceeds VaR threshold",
          "Minimum loss",
          "Average return",
        ],
        correctAnswer: 1,
        explanation:
          "CVaR (also called Expected Shortfall) measures the expected loss given that the loss exceeds the VaR threshold, capturing tail risk.",
      },
    ],
  },
  {
    id: "advanced-factor-models",
    title: "Factor Models",
    category: "advanced",
    description: "Multi-factor portfolio analysis",
    questions: [
      {
        id: 1,
        question: "What is a factor model?",
        options: [
          "Single variable model",
          "Model explaining returns through multiple systematic factors",
          "Price prediction",
          "Volume analysis",
        ],
        correctAnswer: 1,
        explanation:
          "A factor model explains asset returns through exposure to multiple systematic factors like market, size, value, and momentum.",
      },
      {
        id: 2,
        question: "What is the Fama-French three-factor model?",
        options: [
          "Only market factor",
          "Market, size (SMB), and value (HML) factors",
          "Just momentum",
          "Only volatility",
        ],
        correctAnswer: 1,
        explanation:
          "The Fama-French model includes three factors: market excess return, size (SMB - Small Minus Big), and value (HML - High Minus Low).",
      },
      {
        id: 3,
        question: "What does SMB factor represent?",
        options: [
          "Large cap premium",
          "Small cap minus big cap returns",
          "Value premium",
          "Momentum",
        ],
        correctAnswer: 1,
        explanation:
          "SMB (Small Minus Big) represents the size premium, measuring the excess return of small-cap stocks over large-cap stocks.",
      },
      {
        id: 4,
        question: "What does HML factor represent?",
        options: [
          "Growth premium",
          "Value premium - high book-to-market minus low",
          "Size premium",
          "Momentum",
        ],
        correctAnswer: 1,
        explanation:
          "HML (High Minus Low) represents the value premium, measuring excess returns of high book-to-market (value) stocks over low (growth) stocks.",
      },
      {
        id: 5,
        question: "What is factor loading?",
        options: [
          "Total return",
          "Sensitivity of asset returns to specific factor",
          "Price level",
          "Volume",
        ],
        correctAnswer: 1,
        explanation:
          "Factor loading measures the sensitivity of an asset's returns to a specific factor, indicating how much the factor influences returns.",
      },
    ],
  },
  {
    id: "advanced-sharpe-ratio",
    title: "Sharpe Ratio & Risk Metrics",
    category: "advanced",
    description: "Risk-adjusted return measurement",
    questions: [
      {
        id: 1,
        question: "What does Sharpe Ratio measure?",
        options: [
          "Total return",
          "Risk-adjusted return - excess return per unit of risk",
          "Volatility only",
          "Maximum drawdown",
        ],
        correctAnswer: 1,
        explanation:
          "Sharpe Ratio measures risk-adjusted return by calculating excess return (above risk-free rate) per unit of total risk (standard deviation).",
      },
      {
        id: 2,
        question: "How is Sharpe Ratio calculated?",
        options: [
          "Return / Price",
          "(Return - Risk-free Rate) / Standard Deviation",
          "Return x Volatility",
          "Price / Earnings",
        ],
        correctAnswer: 1,
        explanation:
          "Sharpe Ratio = (Portfolio Return - Risk-free Rate) / Standard Deviation of Portfolio Returns.",
      },
      {
        id: 3,
        question: "What is a good Sharpe Ratio?",
        options: [
          "Below 0",
          "Above 1, with >2 being very good",
          "Exactly 0.5",
          "Negative",
        ],
        correctAnswer: 1,
        explanation:
          "A Sharpe Ratio above 1 is considered good, above 2 is very good, and above 3 is excellent, though this varies by asset class.",
      },
      {
        id: 4,
        question: "What is the Sortino Ratio?",
        options: [
          "Same as Sharpe",
          "Like Sharpe but only considers downside volatility",
          "Total return measure",
          "Price ratio",
        ],
        correctAnswer: 1,
        explanation:
          "Sortino Ratio is similar to Sharpe but only considers downside volatility, focusing on harmful volatility rather than total volatility.",
      },
      {
        id: 5,
        question: "What is maximum drawdown?",
        options: [
          "Average loss",
          "Largest peak-to-trough decline in portfolio value",
          "Daily volatility",
          "Annual return",
        ],
        correctAnswer: 1,
        explanation:
          "Maximum drawdown measures the largest peak-to-trough decline in portfolio value, indicating worst-case historical loss.",
      },
    ],
  },
  {
    id: "investment-stocks",
    title: "Stock Investments",
    category: "investment",
    description: "Understanding stock market investing",
    questions: [
      {
        id: 1,
        question: "What is a stock?",
        options: [
          "Company debt",
          "Ownership share in a company",
          "Loan to company",
          "Insurance policy",
        ],
        correctAnswer: 1,
        explanation:
          "A stock represents an ownership share in a company, giving shareholders voting rights and a claim on profits.",
      },
      {
        id: 2,
        question: "What is a dividend?",
        options: [
          "Stock price increase",
          "Portion of profits distributed to shareholders",
          "Trading fee",
          "Tax payment",
        ],
        correctAnswer: 1,
        explanation:
          "A dividend is a portion of company profits distributed to shareholders, typically paid quarterly in cash or additional shares.",
      },
      {
        id: 3,
        question: "What is market capitalization?",
        options: [
          "Company revenue",
          "Total market value of outstanding shares",
          "Stock price",
          "Annual profit",
        ],
        correctAnswer: 1,
        explanation:
          "Market capitalization is the total market value of a company's outstanding shares, calculated by multiplying share price by shares outstanding.",
      },
      {
        id: 4,
        question: "What is a blue-chip stock?",
        options: [
          "New startup",
          "Large, established, financially sound company",
          "Penny stock",
          "Foreign stock",
        ],
        correctAnswer: 1,
        explanation:
          "A blue-chip stock is from a large, established, financially sound company with a history of reliable performance.",
      },
      {
        id: 5,
        question: "What is stock volatility?",
        options: [
          "Dividend amount",
          "Degree of price fluctuation over time",
          "Trading volume",
          "Company size",
        ],
        correctAnswer: 1,
        explanation:
          "Stock volatility measures the degree of price fluctuation over time, indicating the level of risk or uncertainty.",
      },
    ],
  },
  {
    id: "investment-mutual-funds",
    title: "Mutual Funds",
    category: "investment",
    description: "Investing in mutual funds",
    questions: [
      {
        id: 1,
        question: "What is a mutual fund?",
        options: [
          "Individual stock",
          "Pooled investment vehicle managed by professionals",
          "Bank account",
          "Insurance policy",
        ],
        correctAnswer: 1,
        explanation:
          "A mutual fund pools money from multiple investors to invest in a diversified portfolio of securities, managed by professionals.",
      },
      {
        id: 2,
        question: "What is NAV (Net Asset Value)?",
        options: [
          "Total assets",
          "Per-share value of fund's assets minus liabilities",
          "Stock price",
          "Dividend amount",
        ],
        correctAnswer: 1,
        explanation:
          "NAV is the per-share value of a mutual fund, calculated by dividing total assets minus liabilities by number of shares outstanding.",
      },
      {
        id: 3,
        question: "What is an expense ratio?",
        options: [
          "Investment return",
          "Annual fee as percentage of assets for fund management",
          "Tax rate",
          "Dividend yield",
        ],
        correctAnswer: 1,
        explanation:
          "The expense ratio is the annual fee charged as a percentage of assets under management, covering fund operating costs.",
      },
      {
        id: 4,
        question: "What is a load fund?",
        options: [
          "No-fee fund",
          "Fund charging sales commission when buying or selling",
          "Index fund",
          "Money market fund",
        ],
        correctAnswer: 1,
        explanation:
          "A load fund charges a sales commission (load) when buying (front-end load) or selling (back-end load) shares.",
      },
      {
        id: 5,
        question: "What is an index fund?",
        options: [
          "Actively managed fund",
          "Fund tracking specific market index",
          "Bond fund",
          "Money market fund",
        ],
        correctAnswer: 1,
        explanation:
          "An index fund is a passively managed fund that tracks a specific market index, offering broad diversification at low cost.",
      },
    ],
  },
  {
    id: "investment-etfs",
    title: "ETFs (Exchange-Traded Funds)",
    category: "investment",
    description: "Understanding ETF investments",
    questions: [
      {
        id: 1,
        question: "What is an ETF?",
        options: [
          "Individual stock",
          "Fund trading on exchange like stock, tracking index or sector",
          "Mutual fund",
          "Bond",
        ],
        correctAnswer: 1,
        explanation:
          "An ETF is a fund that trades on stock exchanges like individual stocks, typically tracking an index, sector, or commodity.",
      },
      {
        id: 2,
        question: "How do ETFs differ from mutual funds?",
        options: [
          "No difference",
          "ETFs trade intraday like stocks, mutual funds price once daily",
          "ETFs are more expensive",
          "Mutual funds are better",
        ],
        correctAnswer: 1,
        explanation:
          "ETFs trade throughout the day like stocks with real-time pricing, while mutual funds are priced once daily at market close.",
      },
      {
        id: 3,
        question: "What is an ETF expense ratio typically?",
        options: [
          "Very high (>2%)",
          "Generally low (0.03-0.5%)",
          "Always 1%",
          "No expenses",
        ],
        correctAnswer: 1,
        explanation:
          "ETF expense ratios are typically low, ranging from 0.03% to 0.5%, due to passive management and operational efficiency.",
      },
      {
        id: 4,
        question: "What is a sector ETF?",
        options: [
          "Broad market ETF",
          "ETF focusing on specific industry sector",
          "Bond ETF",
          "International ETF",
        ],
        correctAnswer: 1,
        explanation:
          "A sector ETF focuses on a specific industry sector like technology, healthcare, or energy, providing targeted exposure.",
      },
      {
        id: 5,
        question: "What is ETF liquidity?",
        options: [
          "Dividend amount",
          "Ease of buying/selling shares without price impact",
          "Expense ratio",
          "NAV",
        ],
        correctAnswer: 1,
        explanation:
          "ETF liquidity refers to how easily shares can be bought or sold without significantly impacting the price, important for trading.",
      },
    ],
  },
  {
    id: "investment-bonds",
    title: "Bond Investments",
    category: "investment",
    description: "Fixed income investing with bonds",
    questions: [
      {
        id: 1,
        question: "What is a bond?",
        options: [
          "Company ownership",
          "Debt security where investor loans money to entity",
          "Stock",
          "Mutual fund",
        ],
        correctAnswer: 1,
        explanation:
          "A bond is a debt security where an investor loans money to an entity that borrows funds for a defined period at a fixed interest rate.",
      },
      {
        id: 2,
        question: "What is bond yield?",
        options: [
          "Bond price",
          "Return on bond investment, inverse to price",
          "Maturity date",
          "Credit rating",
        ],
        correctAnswer: 1,
        explanation:
          "Bond yield is the return on investment, moving inversely to bond price - when prices rise, yields fall, and vice versa.",
      },
      {
        id: 3,
        question: "What is a coupon rate?",
        options: [
          "Bond price",
          "Annual interest rate paid by bond",
          "Maturity period",
          "Credit score",
        ],
        correctAnswer: 1,
        explanation:
          "The coupon rate is the annual interest rate paid by the bond, typically expressed as a percentage of face value.",
      },
      {
        id: 4,
        question: "What is bond maturity?",
        options: [
          "Interest rate",
          "Date when principal is repaid to investor",
          "Purchase date",
          "Yield",
        ],
        correctAnswer: 1,
        explanation:
          "Bond maturity is the date when the bond's principal (face value) is repaid to the investor, ending the bond's life.",
      },
      {
        id: 5,
        question: "What is credit risk in bonds?",
        options: [
          "Interest rate risk",
          "Risk that issuer may default on payments",
          "Market risk",
          "Inflation risk",
        ],
        correctAnswer: 1,
        explanation:
          "Credit risk is the risk that the bond issuer may default on interest or principal payments, varying by issuer creditworthiness.",
      },
    ],
  },
  {
    id: "investment-real-estate",
    title: "Real Estate Investing",
    category: "investment",
    description: "Property investment strategies",
    questions: [
      {
        id: 1,
        question: "What is a REIT?",
        options: [
          "Real estate loan",
          "Real Estate Investment Trust - company owning income properties",
          "Property insurance",
          "Mortgage type",
        ],
        correctAnswer: 1,
        explanation:
          "A REIT is a company that owns, operates, or finances income-producing real estate, allowing investors to invest in real estate portfolios.",
      },
      {
        id: 2,
        question: "What is rental yield?",
        options: [
          "Property price",
          "Annual rental income as percentage of property value",
          "Mortgage rate",
          "Property tax",
        ],
        correctAnswer: 1,
        explanation:
          "Rental yield is the annual rental income expressed as a percentage of the property's value, measuring investment return.",
      },
      {
        id: 3,
        question: "What is property appreciation?",
        options: [
          "Rental income",
          "Increase in property value over time",
          "Mortgage payment",
          "Property tax",
        ],
        correctAnswer: 1,
        explanation:
          "Property appreciation is the increase in property value over time, providing capital gains when the property is sold.",
      },
      {
        id: 4,
        question: "What is leverage in real estate?",
        options: [
          "Property size",
          "Using borrowed money (mortgage) to increase investment",
          "Rental income",
          "Property location",
        ],
        correctAnswer: 1,
        explanation:
          "Leverage in real estate involves using borrowed money (mortgage) to purchase property, amplifying both potential returns and risks.",
      },
      {
        id: 5,
        question: "What is cap rate?",
        options: [
          "Mortgage rate",
          "Net operating income divided by property value",
          "Rental yield",
          "Property tax rate",
        ],
        correctAnswer: 1,
        explanation:
          "Cap rate (capitalization rate) is net operating income divided by property value, used to estimate investment return and compare properties.",
      },
    ],
  },
];

export function QuizTab() {
  const [selectedCategory, setSelectedCategory] = useState<Quiz["category"]>(
    "financial-education",
  );
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // selectedAnswers stores the TEXT of the selected option (not index) for reliable score comparison
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const filteredQuizzes = useMemo(
    () => quizzes.filter((q) => q.category === selectedCategory),
    [selectedCategory],
  );
  const currentQuestion = useMemo(
    () => selectedQuiz?.questions[currentQuestionIndex],
    [selectedQuiz, currentQuestionIndex],
  );
  const progress = useMemo(
    () =>
      selectedQuiz
        ? ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100
        : 0,
    [selectedQuiz, currentQuestionIndex],
  );

  // Randomize answer options for current question — recalculates each time the question changes
  const randomizedQuestion = useMemo(() => {
    if (!selectedQuiz || !currentQuestion) return null;
    const originalOptions = currentQuestion.options;
    const indices = originalOptions.map((_, idx) => idx);
    const shuffledIndices = shuffleArray(indices);
    const shuffledOptions = shuffledIndices.map((idx) => originalOptions[idx]);
    return {
      ...currentQuestion,
      options: shuffledOptions,
    };
  }, [selectedQuiz, currentQuestion]);

  const handleSelectQuiz = useCallback((quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  }, []);

  // Store selected answer as OPTION TEXT so score comparison works regardless of shuffle order
  const handleAnswerSelect = useCallback(
    (answerIndex: number) => {
      if (!randomizedQuestion) return;
      const selectedText = randomizedQuestion.options[answerIndex];
      setSelectedAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = selectedText;
        return newAnswers;
      });
    },
    [currentQuestionIndex, randomizedQuestion],
  );

  const handleNext = useCallback(() => {
    if (!selectedQuiz) return;
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Score: compare stored option text to the correct option text from original question
      let correctCount = 0;
      selectedQuiz.questions.forEach((question, idx) => {
        const userSelectedText = selectedAnswers[idx];
        const correctOptionText = question.options[question.correctAnswer];
        if (userSelectedText === correctOptionText) correctCount++;
      });
      setScore(correctCount);
      setShowResults(true);
    }
  }, [selectedQuiz, currentQuestionIndex, selectedAnswers]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  }, [currentQuestionIndex]);

  const handleRetake = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  }, []);

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case "technical":
        return <TrendingUp className="h-5 w-5" />;
      case "fundamental":
        return <BarChart3 className="h-5 w-5" />;
      case "advanced":
        return <Sparkles className="h-5 w-5" />;
      case "investment":
        return <BookOpen className="h-5 w-5" />;
      case "financial-education":
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  }, []);

  // Quiz list view
  if (!selectedQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quiz Platform</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Test your knowledge across financial education, technical
              analysis, fundamental analysis, advanced modeling, and investment
              strategies
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {(
            [
              {
                key: "financial-education" as const,
                label: "Financial Education",
                desc: "5 chapters",
                icon: <GraduationCap className="h-5 w-5 text-orange-600" />,
                activeCls:
                  "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
                iconBg: "bg-orange-100 dark:bg-orange-900/30",
              },
              {
                key: "technical" as const,
                label: "Technical Analysis",
                desc: "5 strategies",
                icon: <TrendingUp className="h-5 w-5 text-primary" />,
                activeCls: "border-primary bg-primary/5",
                iconBg: "bg-primary/10",
              },
              {
                key: "fundamental" as const,
                label: "Fundamental Analysis",
                desc: "5 metrics",
                icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
                activeCls: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                iconBg: "bg-blue-100 dark:bg-blue-900/30",
              },
              {
                key: "advanced" as const,
                label: "Advanced Modeling",
                desc: "5 models",
                icon: <Sparkles className="h-5 w-5 text-purple-600" />,
                activeCls:
                  "border-purple-500 bg-purple-50 dark:bg-purple-950/20",
                iconBg: "bg-purple-100 dark:bg-purple-900/30",
              },
              {
                key: "investment" as const,
                label: "Investment Modules",
                desc: "5 types",
                icon: <BookOpen className="h-5 w-5 text-green-600" />,
                activeCls: "border-green-500 bg-green-50 dark:bg-green-950/20",
                iconBg: "bg-green-100 dark:bg-green-900/30",
              },
            ] as const
          ).map((cat) => (
            <Card
              key={cat.key}
              data-ocid={`quiz.category.${cat.key}`}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === cat.key ? `${cat.activeCls} shadow-md` : "hover:border-primary/40"}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${cat.iconBg}`}>
                    {cat.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm leading-tight">
                      {cat.label}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {cat.desc}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quiz List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => (
            <Card
              key={quiz.id}
              data-ocid={`quiz.item.${quiz.id}`}
              className="hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-primary/50"
              onClick={() => handleSelectQuiz(quiz)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      {getCategoryIcon(quiz.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm leading-tight">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {quiz.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {quiz.questions.length} Questions
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ~{quiz.questions.length * 2} min
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Results view
  if (showResults) {
    const percentage = (score / selectedQuiz.questions.length) * 100;
    const passed = percentage >= 60;
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className="border-border/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {passed ? (
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Trophy className="h-12 w-12 text-green-600" />
                </div>
              ) : (
                <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <RotateCcw className="h-12 w-12 text-orange-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription className="text-base mt-2">
              You scored {score} out of {selectedQuiz.questions.length} (
              {percentage.toFixed(0)}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {percentage.toFixed(0)}%
              </div>
              <Progress value={percentage} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {passed
                  ? "Great job! You have a solid understanding."
                  : "Keep learning! Review the explanations below."}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Answer Review</h3>
              {selectedQuiz.questions.map((question, idx) => {
                const userSelectedText = selectedAnswers[idx];
                const correctOptionText =
                  question.options[question.correctAnswer];
                const isCorrect = userSelectedText === correctOptionText;
                return (
                  <Card
                    key={question.id}
                    className={`border-2 ${isCorrect ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <CardTitle className="text-sm font-medium">
                          Question {idx + 1}: {question.question}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">
                            Your answer:
                          </span>
                          <Badge
                            variant={isCorrect ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {userSelectedText ?? "Not answered"}
                          </Badge>
                        </div>
                        {!isCorrect && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">
                              Correct answer:
                            </span>
                            <Badge
                              variant="default"
                              className="text-xs bg-green-600"
                            >
                              {correctOptionText}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="text-sm">Explanation</AlertTitle>
                        <AlertDescription className="text-xs mt-1">
                          {question.explanation}
                        </AlertDescription>
                      </Alert>
                      {question.learningResource && (
                        <a
                          href={question.learningResource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <BookOpen className="h-3 w-3" />
                          Learn more
                        </a>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleRetake}
                className="flex-1"
                variant="outline"
                data-ocid="quiz.retake_button"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
              <Button
                onClick={handleBackToList}
                className="flex-1"
                data-ocid="quiz.back_to_list_button"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Question view
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{selectedQuiz.title}</CardTitle>
              <CardDescription className="mt-1">
                {selectedQuiz.description}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
              data-ocid="quiz.back_button"
            >
              Back to List
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of{" "}
                {selectedQuiz.questions.length}
              </span>
              <Badge variant="secondary">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {randomizedQuestion && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {randomizedQuestion.question}
                </h3>
                <div className="space-y-3">
                  {randomizedQuestion.options.map((option, idx) => {
                    // Compare stored text to current option text for selection state
                    const isSelected =
                      selectedAnswers[currentQuestionIndex] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        data-ocid={`quiz.option.${idx}`}
                        onClick={() => handleAnswerSelect(idx)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-3 h-3 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="flex-1"
                  data-ocid="quiz.prev_button"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  className="flex-1"
                  data-ocid="quiz.next_button"
                >
                  {currentQuestionIndex === selectedQuiz.questions.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
