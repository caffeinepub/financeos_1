import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  Car,
  DollarSign,
  Home,
  Percent,
  PiggyBank,
  Scale,
  Search,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";

interface FinancialRule {
  id: string;
  name: string;
  category: string;
  description: string;
  formula: string;
  icon: any;
  keyPoints: string[];
  example: string;
  practicalTakeaway: string;
}

const financialRules: FinancialRule[] = [
  {
    id: "80-20-savings",
    name: "80/20 Savings Rule",
    category: "Investment Rules",
    description: "Save 20% of income, spend 80%",
    formula: "Savings = Income × 20%",
    icon: PiggyBank,
    keyPoints: [
      "Simple and effective savings approach",
      "Automate 20% savings first",
      "Flexible spending with remaining 80%",
      "Foundation for wealth building",
    ],
    example: "On ₹100,000 income: Save ₹20,000, spend ₹80,000",
    practicalTakeaway:
      "Set up automatic transfer of 20% to savings account on payday",
  },
  {
    id: "70-20-10",
    name: "70/20/10 Rule",
    category: "Investment Rules",
    description: "70% living expenses, 20% savings, 10% giving/debt",
    formula: "Living: 70% | Savings: 20% | Giving: 10%",
    icon: Wallet,
    keyPoints: [
      "Balanced approach to money management",
      "70% covers all living expenses",
      "20% builds wealth through savings",
      "10% for charity or debt repayment",
    ],
    example: "On ₹100,000: ₹70,000 expenses, ₹20,000 savings, ₹10,000 giving",
    practicalTakeaway:
      "Allocate income into three separate accounts for clarity",
  },
  {
    id: "60-40-budget",
    name: "60/40 Budget Rule",
    category: "Investment Rules",
    description: "60% committed expenses, 40% flexible spending and savings",
    formula: "Committed: 60% | Flexible: 40%",
    icon: BarChart3,
    keyPoints: [
      "60% for fixed obligations",
      "40% split between savings and discretionary",
      "Provides spending flexibility",
      "Easier to maintain than strict budgets",
    ],
    example: "On ₹100,000: ₹60,000 fixed costs, ₹40,000 flexible",
    practicalTakeaway:
      "Keep committed expenses below 60% for financial flexibility",
  },
  {
    id: "1-percent-lifestyle",
    name: "1% Rule for Lifestyle Creep",
    category: "Investment Rules",
    description: "Increase lifestyle spending by only 1% when income rises",
    formula: "New Lifestyle = Old Lifestyle × 1.01",
    icon: TrendingUp,
    keyPoints: [
      "Prevents lifestyle inflation",
      "Save majority of raises",
      "Gradual lifestyle improvements",
      "Accelerates wealth building",
    ],
    example: "With 10% raise, increase spending by 1%, save 9%",
    practicalTakeaway:
      "When you get a raise, immediately increase savings rate",
  },
  {
    id: "24-hour-rule",
    name: "24-Hour Rule",
    category: "Investment Rules",
    description: "Wait 24 hours before making non-essential purchases",
    formula: "Wait Time = 24 hours minimum",
    icon: Activity,
    keyPoints: [
      "Reduces impulse buying",
      "Allows emotional cooling off",
      "Helps distinguish wants from needs",
      "Simple but effective",
    ],
    example: "See a gadget you want? Wait 24 hours before buying",
    practicalTakeaway: "Add items to cart but complete purchase next day",
  },
  {
    id: "30-day-rule",
    name: "30-Day Rule",
    category: "Investment Rules",
    description: "Wait 30 days before major purchases",
    formula: "Wait Time = 30 days for purchases >₹10,000",
    icon: Activity,
    keyPoints: [
      "For significant purchases",
      "Prevents buyer's remorse",
      "Time to research alternatives",
      "Often realize you don't need it",
    ],
    example: "Want a new TV? Wait 30 days and reassess",
    practicalTakeaway: 'Create a "30-day wishlist" for big-ticket items',
  },
  {
    id: "25x-retirement",
    name: "25x Retirement Rule",
    category: "Investment Rules",
    description: "Retirement corpus = 25 times annual expenses",
    formula: "Retirement Corpus = Annual Expenses × 25",
    icon: Target,
    keyPoints: [
      "Based on 4% withdrawal rate",
      "Corpus should last 30+ years",
      "Adjust for inflation",
      "Foundation of FIRE movement",
    ],
    example: "Need ₹10L annually? Save ₹2.5 Crore",
    practicalTakeaway: "Calculate your retirement number and work backwards",
  },
  {
    id: "housing-30",
    name: "Housing 30% Income Rule",
    category: "Investment Rules",
    description: "Housing costs should not exceed 30% of gross income",
    formula: "Housing Cost ≤ Gross Income × 30%",
    icon: Home,
    keyPoints: [
      "Includes rent/EMI, utilities, maintenance",
      "Prevents house-poor situation",
      "Leaves room for other goals",
      "Standard affordability guideline",
    ],
    example: "On ₹100,000 income: Max ₹30,000 for housing",
    practicalTakeaway:
      "If housing exceeds 30%, consider downsizing or increasing income",
  },
  {
    id: "income-by-age-30",
    name: "Income by Age: 1x by 30",
    category: "Investment Rules",
    description: "Save 1x annual salary by age 30",
    formula: "Savings at 30 = Annual Salary × 1",
    icon: TrendingUp,
    keyPoints: [
      "First major savings milestone",
      "Includes all investments",
      "Sets foundation for future",
      "Achievable with discipline",
    ],
    example: "Earning ₹10L at 30? Have ₹10L saved",
    practicalTakeaway: "Start saving aggressively in your 20s",
  },
  {
    id: "income-by-age-40",
    name: "Income by Age: 3x by 40",
    category: "Investment Rules",
    description: "Save 3x annual salary by age 40",
    formula: "Savings at 40 = Annual Salary × 3",
    icon: TrendingUp,
    keyPoints: [
      "Mid-career milestone",
      "Compound growth accelerates",
      "Critical decade for wealth",
      "Retirement planning intensifies",
    ],
    example: "Earning ₹20L at 40? Have ₹60L saved",
    practicalTakeaway: "Your 30s are crucial for wealth accumulation",
  },
  {
    id: "income-by-age-50",
    name: "Income by Age: 6x by 50",
    category: "Investment Rules",
    description: "Save 6x annual salary by age 50",
    formula: "Savings at 50 = Annual Salary × 6",
    icon: TrendingUp,
    keyPoints: [
      "Peak earning years",
      "Retirement in sight",
      "Compound growth powerful",
      "Final push for corpus",
    ],
    example: "Earning ₹30L at 50? Have ₹1.8Cr saved",
    practicalTakeaway: "Maximize savings in your 40s while income is high",
  },
  {
    id: "income-by-age-60",
    name: "Income by Age: 10x by 60",
    category: "Investment Rules",
    description: "Save 10x annual salary by age 60",
    formula: "Savings at 60 = Annual Salary × 10",
    icon: Target,
    keyPoints: [
      "Retirement readiness",
      "Sufficient for 4% withdrawal",
      "Includes all assets",
      "Goal for comfortable retirement",
    ],
    example: "Earning ₹40L at 60? Have ₹4Cr saved",
    practicalTakeaway: "This corpus supports retirement at current lifestyle",
  },
  {
    id: "core-satellite",
    name: "Core-Satellite Allocation",
    category: "Investment Rules",
    description: "70-80% in core index funds, 20-30% in satellite active picks",
    formula: "Core: 70-80% | Satellite: 20-30%",
    icon: Target,
    keyPoints: [
      "Core provides stability",
      "Satellite for outperformance",
      "Balances risk and return",
      "Professional approach",
    ],
    example: "₹10L portfolio: ₹7.5L index funds, ₹2.5L active stocks",
    practicalTakeaway: "Build core first, then add satellites gradually",
  },
  {
    id: "global-diversification",
    name: "Global Diversification",
    category: "Investment Rules",
    description: "Allocate 20-30% to international markets",
    formula: "International Allocation = 20-30% of portfolio",
    icon: Briefcase,
    keyPoints: [
      "Reduces country-specific risk",
      "Access to global growth",
      "Currency diversification",
      "Lower correlation with domestic",
    ],
    example: "₹10L portfolio: ₹2-3L in international funds",
    practicalTakeaway: "Use international index funds for easy global exposure",
  },
  {
    id: "eggs-basket",
    name: "Don't Put All Eggs in One Basket",
    category: "Investment Rules",
    description: "Diversify across multiple asset classes and investments",
    formula: "Diversification = Multiple Assets + Multiple Sectors",
    icon: Shield,
    keyPoints: [
      "Spread risk across assets",
      "No single point of failure",
      "Reduces volatility",
      "Core principle of investing",
    ],
    example: "Mix of stocks, bonds, real estate, gold",
    practicalTakeaway: "Never invest more than 10% in any single stock",
  },
  {
    id: "rebalance-annually",
    name: "Rebalance Annually",
    category: "Investment Rules",
    description: "Restore target allocation once per year",
    formula: "Rebalance Frequency = 1 year",
    icon: Scale,
    keyPoints: [
      "Maintains risk profile",
      "Sells high, buys low",
      "Disciplined approach",
      "Tax-efficient timing",
    ],
    example: "If equity grows to 75%, sell to restore 60% target",
    practicalTakeaway: "Set calendar reminder for annual rebalancing",
  },
  {
    id: "strategic-tactical",
    name: "Strategic vs Tactical Allocation",
    category: "Investment Rules",
    description: "Maintain long-term strategy, allow 5-10% tactical shifts",
    formula: "Tactical Range = Strategic ± 5-10%",
    icon: BarChart3,
    keyPoints: [
      "Strategic is long-term plan",
      "Tactical for opportunities",
      "Limited deviation allowed",
      "Prevents emotional decisions",
    ],
    example: "60% equity target, allow 55-65% range",
    practicalTakeaway: "Write down your strategic allocation and stick to it",
  },
  {
    id: "100-minus-age",
    name: "100 Minus Age Asset Allocation",
    category: "Investment Rules",
    description: "Equity allocation = 100 minus your age",
    formula: "Equity % = 100 - Age",
    icon: Calculator,
    keyPoints: [
      "Simple age-based allocation",
      "Reduces equity as you age",
      "Automatic risk adjustment",
      "Easy to remember and apply",
    ],
    example: "Age 30? 70% equity. Age 60? 40% equity",
    practicalTakeaway: "Review and adjust allocation on your birthday",
  },
  {
    id: "10-percent-diversification",
    name: "10% Diversification Rule",
    category: "Investment Rules",
    description: "No single investment should exceed 10% of portfolio",
    formula: "Single Investment ≤ Portfolio × 10%",
    icon: Shield,
    keyPoints: [
      "Limits concentration risk",
      "Protects against single failure",
      "Forces diversification",
      "Professional standard",
    ],
    example: "₹10L portfolio? Max ₹1L in any single stock",
    practicalTakeaway: "Sell or rebalance when any position exceeds 10%",
  },
  {
    id: "3-fund-portfolio",
    name: "3-Fund Portfolio Rule",
    category: "Investment Rules",
    description:
      "Build portfolio with just 3 index funds: domestic equity, international equity, bonds",
    formula: "Portfolio = Domestic Index + International Index + Bond Index",
    icon: Briefcase,
    keyPoints: [
      "Simple yet effective",
      "Low cost with index funds",
      "Broad diversification",
      "Easy to maintain",
    ],
    example: "60% domestic equity, 30% international, 10% bonds",
    practicalTakeaway: "Start with 3-fund portfolio before adding complexity",
  },
  {
    id: "rule-of-72",
    name: "Rule of 72",
    category: "Investment Rules",
    description: "Years to double = 72 ÷ annual return rate",
    formula: "Doubling Time = 72 ÷ Return %",
    icon: Calculator,
    keyPoints: [
      "Quick mental math for doubling",
      "Works for any return rate",
      "Helps compare investments",
      "Shows power of compounding",
    ],
    example: "8% return? Money doubles in 9 years (72÷8)",
    practicalTakeaway: "Use to quickly estimate investment growth",
  },
  {
    id: "rule-of-114",
    name: "Rule of 114",
    category: "Investment Rules",
    description: "Years to triple = 114 ÷ annual return rate",
    formula: "Tripling Time = 114 ÷ Return %",
    icon: Calculator,
    keyPoints: [
      "Quick mental math for tripling",
      "Extension of Rule of 72",
      "Useful for long-term planning",
      "Shows compound growth power",
    ],
    example: "12% return? Money triples in 9.5 years (114÷12)",
    practicalTakeaway: "Use for longer-term investment projections",
  },
  {
    id: "rule-of-144",
    name: "Rule of 144",
    category: "Investment Rules",
    description: "Years to quadruple = 144 ÷ annual return rate",
    formula: "Quadrupling Time = 144 ÷ Return %",
    icon: Calculator,
    keyPoints: [
      "Quick mental math for quadrupling",
      "Useful for retirement planning",
      "Shows long-term growth potential",
      "Motivates early investing",
    ],
    example: "10% return? Money quadruples in 14.4 years (144÷10)",
    practicalTakeaway: "Use to visualize long-term wealth building",
  },
  {
    id: "50-30-20-budgeting",
    name: "50/30/20 Budgeting Rule",
    category: "Budgeting Rules",
    description: "50% needs, 30% wants, 20% savings",
    formula: "Needs: 50% | Wants: 30% | Savings: 20%",
    icon: Wallet,
    keyPoints: [
      "Simple budgeting framework",
      "50% for essential needs",
      "30% for lifestyle wants",
      "20% for savings and debt",
    ],
    example: "On ₹100,000: ₹50,000 needs, ₹30,000 wants, ₹20,000 savings",
    practicalTakeaway: "Track spending for a month to see your current split",
  },
  {
    id: "pay-yourself-first",
    name: "Pay Yourself First Rule",
    category: "Budgeting Rules",
    description: "Save before spending on anything else",
    formula: "Savings = First Priority",
    icon: PiggyBank,
    keyPoints: [
      "Automate savings on payday",
      "Treat savings as non-negotiable",
      "Spend what remains after saving",
      "Builds wealth automatically",
    ],
    example: "Get paid? Transfer 20% to savings immediately",
    practicalTakeaway: "Set up automatic transfer on salary day",
  },
  {
    id: "emergency-fund",
    name: "Emergency Fund Rule",
    category: "Emergency & Risk Rules",
    description: "Maintain 6 months of expenses in liquid savings",
    formula: "Emergency Fund = Monthly Expenses × 6",
    icon: Shield,
    keyPoints: [
      "Covers unexpected expenses",
      "Prevents debt in emergencies",
      "Keep in liquid accounts",
      "Build before investing",
    ],
    example: "₹50,000 monthly expenses? Keep ₹3L emergency fund",
    practicalTakeaway: "Build emergency fund as priority #1",
  },
  {
    id: "life-insurance-coverage",
    name: "Life Insurance Coverage Rule",
    category: "Emergency & Risk Rules",
    description: "Life insurance = 10-15x annual income",
    formula: "Coverage = Annual Income × 10-15",
    icon: Shield,
    keyPoints: [
      "Protects family financially",
      "Term insurance is cheapest",
      "Adjust for liabilities",
      "Review coverage annually",
    ],
    example: "₹10L annual income? Get ₹1-1.5Cr term insurance",
    practicalTakeaway: "Buy term insurance early when premiums are low",
  },
  {
    id: "4-percent-withdrawal",
    name: "4% Retirement Withdrawal Rule",
    category: "Retirement Rules",
    description: "Withdraw 4% of corpus annually in retirement",
    formula: "Annual Withdrawal = Corpus × 4%",
    icon: PiggyBank,
    keyPoints: [
      "Corpus should last 30+ years",
      "Adjust for inflation annually",
      "Based on historical data",
      "Foundation of retirement planning",
    ],
    example: "₹2.5Cr corpus? Withdraw ₹10L annually",
    practicalTakeaway: "Calculate required corpus: Annual need ÷ 0.04",
  },
  {
    id: "multiple-income-streams",
    name: "Retire with Multiple Income Streams",
    category: "Retirement Rules",
    description: "Have 3-5 different income sources in retirement",
    formula: "Retirement Income = 3-5 Different Sources",
    icon: PiggyBank,
    keyPoints: [
      "Reduces single-source risk",
      "Pension + Dividends + Rental + Interest",
      "Provides stability",
      "Flexibility in withdrawals",
    ],
    example: "Pension, mutual fund SWP, rental income, FD interest",
    practicalTakeaway: "Build diverse income sources before retirement",
  },
  {
    id: "inflation-adjusted",
    name: "Inflation-Adjusted Planning",
    category: "Retirement Rules",
    description: "Plan for 6-7% annual inflation in retirement",
    formula: "Future Cost = Current Cost × (1.06)^Years",
    icon: TrendingUp,
    keyPoints: [
      "Inflation erodes purchasing power",
      "Healthcare inflation is higher",
      "Plan for 30+ year retirement",
      "Increase withdrawals annually",
    ],
    example: "₹50K monthly today = ₹1.5L in 20 years at 6%",
    practicalTakeaway: "Calculate retirement needs with inflation",
  },
  {
    id: "healthcare-buffer",
    name: "Healthcare Buffer",
    category: "Retirement Rules",
    description:
      "Keep separate corpus for healthcare equal to 2-3 years expenses",
    formula: "Healthcare Corpus = Annual Expenses × 2-3",
    icon: Shield,
    keyPoints: [
      "Medical costs rise with age",
      "Insurance may not cover all",
      "Separate from retirement corpus",
      "Peace of mind",
    ],
    example: "₹10L annual expenses? Keep ₹20-30L healthcare fund",
    practicalTakeaway: "Build healthcare corpus in 50s",
  },
  {
    id: "longevity-risk",
    name: "Longevity Risk",
    category: "Retirement Rules",
    description: "Plan for living until 90-95 years",
    formula: "Planning Age = 90-95 years",
    icon: Activity,
    keyPoints: [
      "People living longer",
      "Better to overestimate",
      "Corpus must last longer",
      "Consider annuities",
    ],
    example: "Retire at 60? Plan for 30-35 year retirement",
    practicalTakeaway: "Add 5-10 years to life expectancy in planning",
  },
  {
    id: "downsize-retirement",
    name: "Downsize in Retirement",
    category: "Retirement Rules",
    description: "Consider moving to smaller home or lower-cost area",
    formula: "Retirement Home = Smaller + Lower Cost",
    icon: Home,
    keyPoints: [
      "Reduces maintenance costs",
      "Frees up capital",
      "Lower property taxes",
      "Easier to manage",
    ],
    example: "Sell 3BHK, buy 2BHK, invest difference",
    practicalTakeaway: "Plan housing transition before retirement",
  },
  {
    id: "tax-efficient-withdrawals",
    name: "Tax-Efficient Withdrawals",
    category: "Retirement Rules",
    description: "Withdraw from taxable accounts first, then tax-deferred",
    formula: "Withdrawal Order = Taxable → Tax-Deferred → Tax-Free",
    icon: DollarSign,
    keyPoints: [
      "Minimizes tax burden",
      "Maximizes corpus longevity",
      "Strategic withdrawal planning",
      "Consult tax advisor",
    ],
    example: "Withdraw from equity first, then PPF/EPF",
    practicalTakeaway: "Plan withdrawal strategy with tax implications",
  },
  {
    id: "maximize-employer-match",
    name: "Maximize Employer Match",
    category: "Retirement Rules",
    description: "Always contribute enough to get full employer match",
    formula: "Contribution ≥ Employer Match Threshold",
    icon: DollarSign,
    keyPoints: [
      "Free money from employer",
      "Instant 100% return",
      "Don't leave on table",
      "Priority over other savings",
    ],
    example: "Employer matches 5%? Contribute at least 5%",
    practicalTakeaway: "This is the best investment return you'll ever get",
  },
  {
    id: "tax-advantaged-first",
    name: "Use Tax-Advantaged Accounts First",
    category: "Retirement Rules",
    description: "Max out PPF, EPF, NPS before taxable investments",
    formula: "Priority: PPF/EPF/NPS → Taxable Accounts",
    icon: Shield,
    keyPoints: [
      "Tax deduction on contribution",
      "Tax-free growth",
      "Tax benefits on withdrawal",
      "Forced long-term discipline",
    ],
    example: "Max PPF ₹1.5L, then invest in mutual funds",
    practicalTakeaway: "Exhaust Section 80C limit every year",
  },
  {
    id: "glide-path",
    name: "Glide Path Allocation",
    category: "Retirement Rules",
    description: "Gradually reduce equity as retirement approaches",
    formula: "Equity % = 100 - Age (adjust over time)",
    icon: TrendingDown,
    keyPoints: [
      "Reduces risk near retirement",
      "Smooth transition",
      "Protects accumulated wealth",
      "Automatic rebalancing",
    ],
    example: "Age 50: 50% equity, Age 60: 40% equity",
    practicalTakeaway: "Reduce equity 1-2% per year after 50",
  },
  {
    id: "bucket-strategy",
    name: "Retirement Bucket Strategy",
    category: "Retirement Rules",
    description: "Divide corpus into 3 buckets: cash, bonds, equity",
    formula:
      "Bucket 1: 2 years cash | Bucket 2: 8 years bonds | Bucket 3: Equity",
    icon: Briefcase,
    keyPoints: [
      "Cash for immediate needs",
      "Bonds for medium-term",
      "Equity for long-term growth",
      "Refill buckets periodically",
    ],
    example: "₹1Cr corpus: ₹10L cash, ₹40L bonds, ₹50L equity",
    practicalTakeaway: "Implement bucket strategy at retirement",
  },
  {
    id: "good-bad-debt",
    name: "Good Debt vs Bad Debt",
    category: "Debt Management Rules",
    description: "Good debt builds assets, bad debt funds consumption",
    formula: "Good Debt = Asset Building | Bad Debt = Consumption",
    icon: DollarSign,
    keyPoints: [
      "Good: Home loan, education loan",
      "Bad: Credit card debt, personal loans",
      "Good debt has tax benefits",
      "Bad debt has high interest",
    ],
    example: "Home loan at 8% is good, credit card at 36% is bad",
    practicalTakeaway:
      "Eliminate bad debt first, manage good debt strategically",
  },
  {
    id: "snowball-debt",
    name: "Snowball Debt Method",
    category: "Debt Management Rules",
    description: "Pay off smallest debts first for psychological wins",
    formula: "Order: Smallest Balance → Largest Balance",
    icon: TrendingDown,
    keyPoints: [
      "Quick wins build momentum",
      "Psychological motivation",
      "Simplifies debt management",
      "May cost more in interest",
    ],
    example: "Pay ₹10K debt before ₹1L debt",
    practicalTakeaway: "List all debts by balance and attack smallest first",
  },
  {
    id: "avalanche-debt",
    name: "Avalanche Debt Method",
    category: "Debt Management Rules",
    description: "Pay off highest interest rate debts first",
    formula: "Order: Highest Interest → Lowest Interest",
    icon: TrendingDown,
    keyPoints: [
      "Mathematically optimal",
      "Saves most on interest",
      "Faster debt freedom",
      "Requires discipline",
    ],
    example: "Pay 36% credit card before 8% home loan",
    practicalTakeaway: "Calculate total interest saved with this method",
  },
  {
    id: "credit-utilization",
    name: "Credit Utilization 30%",
    category: "Debt Management Rules",
    description: "Keep credit card usage below 30% of limit",
    formula: "Credit Utilization = Balance ÷ Limit ≤ 30%",
    icon: Percent,
    keyPoints: [
      "Improves credit score",
      "Shows responsible usage",
      "Ideal is below 10%",
      "Affects loan approvals",
    ],
    example: "₹1L limit? Keep balance below ₹30,000",
    practicalTakeaway: "Pay off cards multiple times per month if needed",
  },
  {
    id: "emergency-credit",
    name: "Emergency Credit Avoidance",
    category: "Debt Management Rules",
    description: "Never use credit for emergencies, maintain emergency fund",
    formula: "Emergency Fund = 6 months expenses",
    icon: Shield,
    keyPoints: [
      "Credit is expensive",
      "Emergency fund is essential",
      "Prevents debt spiral",
      "Financial security foundation",
    ],
    example: "Medical emergency? Use emergency fund, not credit card",
    practicalTakeaway: "Build emergency fund before investing",
  },
  {
    id: "no-new-debt",
    name: "No New Debt Rule",
    category: "Debt Management Rules",
    description: "Stop taking new debt while paying off existing debt",
    formula: "New Debt = 0 while Old Debt > 0",
    icon: AlertTriangle,
    keyPoints: [
      "Focus on elimination",
      "Prevents debt accumulation",
      "Accelerates freedom",
      "Requires discipline",
    ],
    example: "Paying off car loan? Don't take personal loan",
    practicalTakeaway: "Freeze credit cards while in debt payoff mode",
  },
  {
    id: "leverage-prudence",
    name: "Leverage Prudence",
    category: "Debt Management Rules",
    description: "Total debt should not exceed 3x annual income",
    formula: "Total Debt ≤ Annual Income × 3",
    icon: Scale,
    keyPoints: [
      "Prevents over-leveraging",
      "Manageable debt levels",
      "Includes all debts",
      "Conservative guideline",
    ],
    example: "₹20L income? Max ₹60L total debt",
    practicalTakeaway: "Calculate your debt-to-income ratio quarterly",
  },
  {
    id: "20-4-10-car",
    name: "20/4/10 Car Buying Rule",
    category: "Debt Management Rules",
    description: "20% down, 4-year loan max, 10% of income for car expenses",
    formula: "20% Down | 4 Years Max | 10% Income",
    icon: Car,
    keyPoints: [
      "20% down payment minimum",
      "Loan term max 4 years",
      "Total car costs ≤ 10% income",
      "Prevents car-poor situation",
    ],
    example: "₹10L car? ₹2L down, ₹8L loan over 4 years",
    practicalTakeaway: "If you can't afford 20% down, you can't afford the car",
  },
  {
    id: "1-10th-car",
    name: "1/10th Car Buying Rule",
    category: "Debt Management Rules",
    description: "Car price should not exceed 1/10th of annual income",
    formula: "Car Price ≤ Annual Income ÷ 10",
    icon: Car,
    keyPoints: [
      "Conservative car affordability",
      "Prevents overspending on depreciating asset",
      "Leaves room for other goals",
      "Financial independence friendly",
    ],
    example: "₹10L annual income? Max ₹1L car",
    practicalTakeaway: "Buy used cars to maximize value",
  },
  {
    id: "debt-to-income-36",
    name: "Debt-to-Income ≤36% Rule",
    category: "Debt Management Rules",
    description:
      "Total monthly debt payments should not exceed 36% of gross income",
    formula: "Total Debt Payments ≤ Gross Income × 36%",
    icon: Percent,
    keyPoints: [
      "Lender standard for approval",
      "Includes all debt payments",
      "Ensures manageable debt load",
      "Below 36% is healthy",
    ],
    example: "₹100,000 income? Max ₹36,000 total debt payments",
    practicalTakeaway: "Calculate your DTI before taking new loans",
  },
  {
    id: "28-36-housing",
    name: "28/36 Housing Rule",
    category: "Debt Management Rules",
    description: "Housing ≤28% of income, total debt ≤36% of income",
    formula: "Housing ≤ 28% | Total Debt ≤ 36%",
    icon: Home,
    keyPoints: [
      "Front-end ratio: 28% for housing",
      "Back-end ratio: 36% for all debt",
      "Mortgage lender standard",
      "Ensures affordability",
    ],
    example: "₹100,000 income? Max ₹28,000 housing, ₹36,000 total debt",
    practicalTakeaway: "Use this to determine home loan eligibility",
  },
  {
    id: "intrinsic-value",
    name: "Buy Below Intrinsic Value",
    category: "Valuation & Stock Selection Rules",
    description: "Purchase stocks trading below calculated intrinsic value",
    formula: "Buy when Market Price < Intrinsic Value",
    icon: TrendingUp,
    keyPoints: [
      "Value investing foundation",
      "Requires fundamental analysis",
      "Provides margin of safety",
      "Long-term approach",
    ],
    example: "Intrinsic value ₹500, buy at ₹350",
    practicalTakeaway: "Learn DCF valuation or use simple PE comparison",
  },
  {
    id: "margin-safety-30",
    name: "Margin of Safety 30%",
    category: "Valuation & Stock Selection Rules",
    description: "Buy at least 30% below intrinsic value",
    formula: "Purchase Price ≤ Intrinsic Value × 0.7",
    icon: Shield,
    keyPoints: [
      "Minimum 30% discount",
      "Protects against valuation errors",
      "Provides upside potential",
      "Reduces downside risk",
    ],
    example: "Intrinsic value ₹1000? Buy at ₹700 or below",
    practicalTakeaway: "Be patient and wait for significant discounts",
  },
  {
    id: "low-debt-equity",
    name: "Low Debt-to-Equity",
    category: "Valuation & Stock Selection Rules",
    description: "Prefer companies with debt-to-equity ratio below 1",
    formula: "Debt-to-Equity Ratio < 1",
    icon: Scale,
    keyPoints: [
      "Lower financial risk",
      "Better recession resilience",
      "More financial flexibility",
      "Sustainable business model",
    ],
    example: "Debt ₹50Cr, Equity ₹100Cr = 0.5 ratio (Good)",
    practicalTakeaway: "Check debt levels before investing in any stock",
  },
  {
    id: "free-cash-flow",
    name: "Consistent Free Cash Flow",
    category: "Valuation & Stock Selection Rules",
    description: "Invest in companies with positive, growing free cash flow",
    formula: "FCF = Operating Cash Flow - Capital Expenditure > 0",
    icon: DollarSign,
    keyPoints: [
      "Real profitability indicator",
      "Funds dividends and growth",
      "Better than accounting profit",
      "Shows business quality",
    ],
    example: "Operating CF ₹100Cr - Capex ₹30Cr = ₹70Cr FCF",
    practicalTakeaway: "Positive FCF for 5+ years shows quality business",
  },
  {
    id: "high-roe",
    name: "High ROE",
    category: "Valuation & Stock Selection Rules",
    description: "Target companies with ROE above 15%",
    formula: "ROE = Net Income ÷ Shareholder Equity > 15%",
    icon: TrendingUp,
    keyPoints: [
      "Efficient capital usage",
      "Competitive advantage indicator",
      "Sustainable above 15%",
      "Compare within industry",
    ],
    example: "Net Income ₹20Cr, Equity ₹100Cr = 20% ROE",
    practicalTakeaway: "Consistent high ROE indicates quality management",
  },
  {
    id: "earnings-quality",
    name: "Earnings Quality",
    category: "Valuation & Stock Selection Rules",
    description: "Verify earnings are backed by cash flow",
    formula: "Quality = Cash Flow ≈ Net Income",
    icon: BarChart3,
    keyPoints: [
      "Prevents accounting manipulation",
      "Cash is king",
      "Sustainable earnings",
      "Red flag if divergent",
    ],
    example: "Net Income ₹100Cr, Operating CF ₹95Cr (Good)",
    practicalTakeaway: "If cash flow << earnings, investigate further",
  },
  {
    id: "avoid-story-stocks",
    name: "Avoid Story Stocks",
    category: "Valuation & Stock Selection Rules",
    description: "Focus on fundamentals, not exciting narratives",
    formula: "Investment = Fundamentals > Story",
    icon: AlertTriangle,
    keyPoints: [
      "Stories often disappoint",
      "Fundamentals matter long-term",
      "Avoid hype and FOMO",
      "Boring businesses often win",
    ],
    example: 'Avoid "next Tesla" hype, buy proven businesses',
    practicalTakeaway: "If you can't explain the business simply, don't invest",
  },
  {
    id: "avoid-ipo-hype",
    name: "Avoid IPO Hype",
    category: "Valuation & Stock Selection Rules",
    description: "Wait 6-12 months after IPO before investing",
    formula: "Wait Period = 6-12 months post-IPO",
    icon: AlertTriangle,
    keyPoints: [
      "IPOs often overpriced",
      "Lock-in period ends",
      "True performance emerges",
      "Better entry points later",
    ],
    example: "IPO at ₹500, often available at ₹300 after 6 months",
    practicalTakeaway: "Let the dust settle and valuations normalize",
  },
  {
    id: "no-past-performance",
    name: "Don't Chase Past Performance",
    category: "Valuation & Stock Selection Rules",
    description: "Past returns don't guarantee future results",
    formula: "Future Returns ≠ Past Returns",
    icon: Activity,
    keyPoints: [
      "Mean reversion is real",
      "High returns attract competition",
      "Valuation matters more",
      "Avoid recency bias",
    ],
    example: "Stock up 100% last year? May correct this year",
    practicalTakeaway: "Buy based on future potential, not past glory",
  },
  {
    id: "sell-thesis-breaks",
    name: "Sell When Thesis Breaks",
    category: "Valuation & Stock Selection Rules",
    description: "Exit when original investment reason no longer valid",
    formula: "Sell Trigger = Thesis Invalidation",
    icon: TrendingDown,
    keyPoints: [
      "Know why you bought",
      "Monitor thesis continuously",
      "Don't fall in love with stocks",
      "Admit mistakes quickly",
    ],
    example: "Bought for growth, growth stops? Sell",
    practicalTakeaway: "Write down investment thesis and review quarterly",
  },
  {
    id: "never-risk-ruin",
    name: "Never Risk Ruin",
    category: "Risk Management Rules",
    description: "Never risk more than you can afford to lose",
    formula: "Risk Amount ≤ Affordable Loss",
    icon: Shield,
    keyPoints: [
      "Survival is paramount",
      "One big loss can end game",
      "Preserve capital always",
      "Live to invest another day",
    ],
    example: "Don't bet entire portfolio on one stock",
    practicalTakeaway: "Never invest money needed in next 5 years",
  },
  {
    id: "position-sizing",
    name: "Position Sizing",
    category: "Risk Management Rules",
    description: "No single position should exceed 5-10% of portfolio",
    formula: "Position Size ≤ Portfolio × 5-10%",
    icon: Scale,
    keyPoints: [
      "Limits single-stock risk",
      "Allows diversification",
      "Professional approach",
      "Prevents concentration",
    ],
    example: "₹10L portfolio? Max ₹50K-₹1L per stock",
    practicalTakeaway: "Rebalance when any position exceeds 10%",
  },
  {
    id: "max-drawdown",
    name: "Max Drawdown Tolerance",
    category: "Risk Management Rules",
    description: "Know maximum acceptable portfolio decline",
    formula: "Max Drawdown = Peak to Trough Decline",
    icon: TrendingDown,
    keyPoints: [
      "Define risk tolerance",
      "Typically 20-30% for equity",
      "Adjust allocation accordingly",
      "Prevents panic selling",
    ],
    example: "Can handle 25% drop? 60% equity allocation",
    practicalTakeaway: "Test your risk tolerance before market crashes",
  },
  {
    id: "sleep-night-risk",
    name: "Sleep-at-Night Risk",
    category: "Risk Management Rules",
    description: "Take only as much risk as lets you sleep peacefully",
    formula: "Risk Level = Comfortable Sleep Level",
    icon: Shield,
    keyPoints: [
      "Personal risk tolerance",
      "Mental health matters",
      "No amount of return worth stress",
      "Adjust allocation for peace",
    ],
    example: "Losing sleep over stocks? Reduce equity allocation",
    practicalTakeaway: "If you check portfolio daily with anxiety, reduce risk",
  },
  {
    id: "know-what-own",
    name: "Know What You Own",
    category: "Risk Management Rules",
    description: "Understand every investment in your portfolio",
    formula: "Investment = Understanding × Conviction",
    icon: Brain,
    keyPoints: [
      "No blind investments",
      "Understand business model",
      "Know the risks",
      "Can explain to others",
    ],
    example: "Can't explain what company does? Don't invest",
    practicalTakeaway: "Write one-page summary of each investment",
  },
  {
    id: "circle-competence",
    name: "Circle of Competence",
    category: "Risk Management Rules",
    description: "Invest only in industries and businesses you understand",
    formula: "Investment Universe = Your Expertise",
    icon: Target,
    keyPoints: [
      "Warren Buffett principle",
      "Reduces mistakes",
      "Leverages your knowledge",
      "Expands with learning",
    ],
    example: "IT professional? Understand tech stocks better",
    practicalTakeaway: "Stick to what you know or learn before investing",
  },
  {
    id: "avoid-leverage-equity",
    name: "Avoid Leverage in Equities",
    category: "Risk Management Rules",
    description: "Never use borrowed money for stock investments",
    formula: "Equity Investment = Own Money Only",
    icon: AlertTriangle,
    keyPoints: [
      "Leverage amplifies losses",
      "Forced selling in downturn",
      "High interest costs",
      "Recipe for disaster",
    ],
    example: "Market drops 30%, leveraged portfolio drops 60%+",
    practicalTakeaway: "If you need leverage, you're taking too much risk",
  },
  {
    id: "avoid-timing",
    name: "Avoid Timing the Market",
    category: "Risk Management Rules",
    description: "Time in market beats timing the market",
    formula: "Success = Time in Market > Market Timing",
    icon: Activity,
    keyPoints: [
      "Impossible to time consistently",
      "Missing best days is costly",
      "Stay invested long-term",
      "SIP is better than timing",
    ],
    example: "Missing 10 best days reduces returns by 50%",
    practicalTakeaway: "Invest regularly regardless of market levels",
  },
  {
    id: "no-emotion-trading",
    name: "Don't Trade on Emotion",
    category: "Risk Management Rules",
    description: "Make decisions based on logic, not fear or greed",
    formula: "Decision = Logic - Emotion",
    icon: Brain,
    keyPoints: [
      "Fear and greed are enemies",
      "Follow your plan",
      "Avoid impulsive decisions",
      "Discipline beats emotion",
    ],
    example: "Market crashes? Stick to plan, don't panic sell",
    practicalTakeaway: "Write investment rules and follow them mechanically",
  },
  {
    id: "have-ips",
    name: "Have IPS (Investment Policy Statement)",
    category: "Risk Management Rules",
    description: "Document your investment strategy and rules",
    formula: "IPS = Goals + Strategy + Rules",
    icon: BookOpen,
    keyPoints: [
      "Written investment plan",
      "Defines goals and constraints",
      "Guides all decisions",
      "Prevents emotional mistakes",
    ],
    example: "Document: 60% equity, rebalance annually, no leverage",
    practicalTakeaway: "Write your IPS today and review annually",
  },
  {
    id: "margin-safety",
    name: "Margin of Safety",
    category: "Risk Management Rules",
    description: "Buy assets at 30-50% below intrinsic value",
    formula: "Purchase Price ≤ Intrinsic Value × 0.5-0.7",
    icon: Shield,
    keyPoints: [
      "Benjamin Graham principle",
      "Protects against errors",
      "Provides upside potential",
      "Core of value investing",
    ],
    example: "Stock worth ₹100? Buy at ₹50-70",
    practicalTakeaway: "Be patient and wait for the right price",
  },
  {
    id: "capital-preservation",
    name: "Capital Preservation First",
    category: "Risk Management Rules",
    description: "Don't lose money is rule #1",
    formula: "Rule 1: Don't Lose | Rule 2: Remember Rule 1",
    icon: Shield,
    keyPoints: [
      "Warren Buffett principle",
      "Avoid permanent loss",
      "Risk management priority",
      "Compound growth requires capital",
    ],
    example: "Better to earn 8% safely than risk 20% with high loss chance",
    practicalTakeaway: "Understand downside before chasing upside",
  },
  {
    id: "never-borrow-consume",
    name: "Never Borrow to Consume",
    category: "Risk Management Rules",
    description: "Only borrow for assets, never for consumption",
    formula: "Borrowing Purpose = Asset Building Only",
    icon: AlertTriangle,
    keyPoints: [
      "Consumption debt is toxic",
      "Assets appreciate, consumption depreciates",
      "High interest on consumer debt",
      "Path to financial trouble",
    ],
    example: "OK: Home loan | Not OK: Vacation loan",
    practicalTakeaway:
      "If you can't afford it without debt, you can't afford it",
  },
  {
    id: "positive-npv",
    name: "Positive NPV Only",
    category: "Business/Corporate Finance Rules",
    description: "Accept projects only with positive Net Present Value",
    formula: "NPV = PV(Cash Inflows) - PV(Cash Outflows) > 0",
    icon: TrendingUp,
    keyPoints: [
      "Creates shareholder value",
      "Accounts for time value",
      "Risk-adjusted returns",
      "Gold standard for decisions",
    ],
    example: "Project NPV ₹10L? Accept. NPV -₹5L? Reject",
    practicalTakeaway: "Calculate NPV for all major business decisions",
  },
  {
    id: "irr-hurdle",
    name: "IRR Above Hurdle Rate",
    category: "Business/Corporate Finance Rules",
    description: "Project IRR must exceed company's cost of capital",
    formula: "IRR > Hurdle Rate (WACC)",
    icon: BarChart3,
    keyPoints: [
      "Ensures adequate returns",
      "Covers cost of capital",
      "Risk-adjusted threshold",
      "Comparable across projects",
    ],
    example: "WACC 12%, Project IRR 15%? Accept",
    practicalTakeaway: "Know your cost of capital before evaluating projects",
  },
  {
    id: "payback-period",
    name: "Payback Period",
    category: "Business/Corporate Finance Rules",
    description: "Prefer projects with payback period under 3-5 years",
    formula: "Payback Period = Initial Investment ÷ Annual Cash Flow",
    icon: Activity,
    keyPoints: [
      "Simple liquidity measure",
      "Risk indicator",
      "Shorter is better",
      "Supplement with NPV/IRR",
    ],
    example: "₹10L investment, ₹3L annual return = 3.3 years",
    practicalTakeaway: "Use as initial filter, not sole criterion",
  },
  {
    id: "working-capital",
    name: "Working Capital Discipline",
    category: "Business/Corporate Finance Rules",
    description: "Maintain working capital ratio between 1.5-2.0",
    formula: "Working Capital Ratio = Current Assets ÷ Current Liabilities",
    icon: Scale,
    keyPoints: [
      "Ensures liquidity",
      "Too high = inefficiency",
      "Too low = risk",
      "Industry-specific norms",
    ],
    example: "Current Assets ₹150Cr, Liabilities ₹100Cr = 1.5",
    practicalTakeaway: "Monitor working capital monthly",
  },
  {
    id: "cash-is-king",
    name: "Cash Is King",
    category: "Business/Corporate Finance Rules",
    description: "Prioritize cash flow over accounting profit",
    formula: "Cash Flow > Accounting Profit",
    icon: DollarSign,
    keyPoints: [
      "Cash pays bills",
      "Profit can be manipulated",
      "Operating cash flow critical",
      "Free cash flow is best",
    ],
    example: "High profit but negative cash flow? Red flag",
    practicalTakeaway: "Focus on cash flow statement, not just P&L",
  },
  {
    id: "conservative-forecasting",
    name: "Conservative Forecasting",
    category: "Business/Corporate Finance Rules",
    description: "Underestimate revenues, overestimate costs",
    formula: "Forecast = Conservative Assumptions",
    icon: Shield,
    keyPoints: [
      "Builds in safety margin",
      "Prevents over-optimism",
      "Better to exceed than miss",
      "Credibility with stakeholders",
    ],
    example: "Expect 10% growth? Plan for 7%",
    practicalTakeaway: "Add 20% buffer to cost estimates",
  },
  {
    id: "scenario-sensitivity",
    name: "Scenario & Sensitivity Analysis",
    category: "Business/Corporate Finance Rules",
    description: "Test decisions under best, base, and worst case scenarios",
    formula: "Analysis = Best Case + Base Case + Worst Case",
    icon: BarChart3,
    keyPoints: [
      "Identifies key risks",
      "Tests assumptions",
      "Prepares for uncertainty",
      "Informs contingency plans",
    ],
    example: "Revenue scenarios: +20%, 0%, -20%",
    practicalTakeaway: "Always run sensitivity analysis on key variables",
  },
  {
    id: "capex-opex",
    name: "Capex vs Opex",
    category: "Business/Corporate Finance Rules",
    description: "Distinguish capital expenditure from operating expenses",
    formula: "Capex = Long-term Assets | Opex = Day-to-day Costs",
    icon: Building2,
    keyPoints: [
      "Different accounting treatment",
      "Capex creates assets",
      "Opex is immediate expense",
      "Tax implications differ",
    ],
    example: "Machinery = Capex, Salaries = Opex",
    practicalTakeaway: "Properly categorize for accurate financial analysis",
  },
  {
    id: "debt-service-coverage",
    name: "Debt Service Coverage",
    category: "Business/Corporate Finance Rules",
    description: "Maintain DSCR above 1.5",
    formula: "DSCR = Operating Income ÷ Debt Service > 1.5",
    icon: Shield,
    keyPoints: [
      "Measures debt repayment ability",
      "Lenders require minimum DSCR",
      "Above 1.5 is comfortable",
      "Below 1.0 is danger zone",
    ],
    example: "Operating Income ₹150Cr, Debt Service ₹100Cr = 1.5",
    practicalTakeaway: "Monitor DSCR quarterly to avoid default risk",
  },
  {
    id: "interest-coverage",
    name: "Interest Coverage",
    category: "Business/Corporate Finance Rules",
    description: "Maintain interest coverage ratio above 3",
    formula: "Interest Coverage = EBIT ÷ Interest Expense > 3",
    icon: Scale,
    keyPoints: [
      "Measures interest payment ability",
      "Higher is safer",
      "Below 2 is risky",
      "Industry-specific norms",
    ],
    example: "EBIT ₹300Cr, Interest ₹100Cr = 3x coverage",
    practicalTakeaway: "Aim for 3-5x coverage for financial safety",
  },
  {
    id: "protect-downside",
    name: "Protect the Downside",
    category: "Global Heuristics/Mental Models",
    description: "Focus on avoiding losses rather than maximizing gains",
    formula: "Priority = Downside Protection > Upside Capture",
    icon: Shield,
    keyPoints: [
      "Losses hurt more than gains help",
      "Asymmetric risk-reward",
      "Preservation first, growth second",
      "Warren Buffett principle",
    ],
    example: "Lose 50%? Need 100% gain to recover",
    practicalTakeaway: 'Always ask "What can go wrong?" before investing',
  },
  {
    id: "luck-skill",
    name: "Don't Confuse Luck with Skill",
    category: "Global Heuristics/Mental Models",
    description: "Distinguish between lucky outcomes and skillful decisions",
    formula: "Success = Skill + Luck (separate them)",
    icon: Brain,
    keyPoints: [
      "Good outcome ≠ good decision",
      "Bad outcome ≠ bad decision",
      "Focus on process, not results",
      "Humility in success",
    ],
    example: "Made money in bull market? Maybe just luck",
    practicalTakeaway: "Evaluate decisions by process, not just outcomes",
  },
  {
    id: "skin-in-game",
    name: "Skin in the Game",
    category: "Global Heuristics/Mental Models",
    description: "Trust those who have personal stake in outcomes",
    formula: "Trust = Personal Risk Exposure",
    icon: Users,
    keyPoints: [
      "Aligned incentives matter",
      "Advisors should invest own money",
      "Management should own stock",
      "Nassim Taleb principle",
    ],
    example: "Fund manager invests in own fund? Good sign",
    practicalTakeaway: "Check if advisors/managers have skin in the game",
  },
  {
    id: "incentive-alignment",
    name: "Incentive Alignment",
    category: "Global Heuristics/Mental Models",
    description: "Ensure your interests align with advisors/partners",
    formula: "Success = Aligned Incentives",
    icon: Target,
    keyPoints: [
      "Misaligned incentives cause problems",
      "Fee structure matters",
      "Commission-based advice is biased",
      "Seek fee-only advisors",
    ],
    example: "Commission-based advisor? Incentive to churn",
    practicalTakeaway: 'Always ask "How does this person make money?"',
  },
  {
    id: "second-order-effects",
    name: "Second-Order Effects",
    category: "Global Heuristics/Mental Models",
    description: "Consider consequences of consequences",
    formula: "Analysis = Direct Effects + Indirect Effects",
    icon: Brain,
    keyPoints: [
      "First-order thinking is common",
      "Second-order thinking is rare",
      "Long-term implications matter",
      "Unintended consequences",
    ],
    example: "Low interest rates → asset bubbles → crashes",
    practicalTakeaway: 'Always ask "And then what happens?"',
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    category: "Global Heuristics/Mental Models",
    description: "Extreme outcomes tend to revert to average over time",
    formula: "Long-term Trend = Reversion to Mean",
    icon: Activity,
    keyPoints: [
      "High returns attract competition",
      "Low returns improve eventually",
      "Nothing stays extreme forever",
      "Powerful in investing",
    ],
    example: "High PE ratios eventually fall, low ones rise",
    practicalTakeaway: "Be contrarian when extremes are reached",
  },
  {
    id: "survivorship-bias",
    name: "Survivorship Bias Awareness",
    category: "Global Heuristics/Mental Models",
    description: "Remember the failures, not just the successes",
    formula: "Reality = Successes + Failures (both matter)",
    icon: AlertTriangle,
    keyPoints: [
      "We only see survivors",
      "Failures disappear from view",
      "Distorts probability assessment",
      "Common in investing",
    ],
    example: "Successful startups visible, 90% failures invisible",
    practicalTakeaway: "Study failures as much as successes",
  },
  {
    id: "regime-change",
    name: "Regime Change Awareness",
    category: "Global Heuristics/Mental Models",
    description: "Recognize when fundamental conditions change",
    formula: "Strategy = Adapt to New Regime",
    icon: TrendingUp,
    keyPoints: [
      "Past patterns may not continue",
      "Structural changes happen",
      "Adapt or become obsolete",
      "Question assumptions regularly",
    ],
    example: "Low interest era ending? Change strategy",
    practicalTakeaway: "Review macro environment quarterly",
  },
  {
    id: "keep-costs-low",
    name: "Keep Costs Low",
    category: "Global Heuristics/Mental Models",
    description: "Minimize fees, taxes, and transaction costs",
    formula: "Net Return = Gross Return - All Costs",
    icon: DollarSign,
    keyPoints: [
      "Costs compound negatively",
      "1% fee = 25% less wealth over 30 years",
      "Index funds beat active after fees",
      "Every rupee saved is earned",
    ],
    example: "1% vs 2% fee = ₹50L difference on ₹1Cr over 30 years",
    practicalTakeaway:
      "Choose low-cost index funds over expensive active funds",
  },
  {
    id: "simplicity-complexity",
    name: "Simplicity Over Complexity",
    category: "Global Heuristics/Mental Models",
    description: "Simple strategies often outperform complex ones",
    formula: "Effectiveness = Simplicity > Complexity",
    icon: Target,
    keyPoints: [
      "Complexity adds costs and errors",
      "Simple is easier to maintain",
      "Complexity doesn't guarantee better",
      "Warren Buffett keeps it simple",
    ],
    example: "Index fund portfolio beats complex hedge fund strategies",
    practicalTakeaway: "If you can't explain it simply, don't do it",
  },
];

const categories = [
  {
    name: "Investment Rules",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    name: "Budgeting Rules",
    icon: Wallet,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    name: "Emergency & Risk Rules",
    icon: Shield,
    gradient: "from-orange-500 to-red-600",
  },
  {
    name: "Retirement Rules",
    icon: PiggyBank,
    gradient: "from-amber-500 to-yellow-600",
  },
  {
    name: "Debt Management Rules",
    icon: Scale,
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    name: "Valuation & Stock Selection Rules",
    icon: BarChart3,
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    name: "Risk Management Rules",
    icon: AlertTriangle,
    gradient: "from-red-500 to-pink-600",
  },
  {
    name: "Business/Corporate Finance Rules",
    icon: Building2,
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    name: "Global Heuristics/Mental Models",
    icon: Brain,
    gradient: "from-pink-500 to-rose-600",
  },
];

function RuleCalculator({ rule }: { rule: FinancialRule }) {
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string>("");

  const handleCalculate = () => {
    switch (rule.id) {
      case "80-20-savings": {
        const income = inputs.income || 0;
        setResult(
          `Save: ₹${(income * 0.2).toLocaleString("en-IN")} | Spend: ₹${(income * 0.8).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "70-20-10": {
        const income = inputs.income || 0;
        setResult(
          `Living: ₹${(income * 0.7).toLocaleString("en-IN")} | Savings: ₹${(income * 0.2).toLocaleString("en-IN")} | Giving: ₹${(income * 0.1).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "60-40-budget": {
        const income = inputs.income || 0;
        setResult(
          `Committed: ₹${(income * 0.6).toLocaleString("en-IN")} | Flexible: ₹${(income * 0.4).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "50-30-20-budgeting": {
        const income = inputs.income || 0;
        setResult(
          `Needs: ₹${(income * 0.5).toLocaleString("en-IN")} | Wants: ₹${(income * 0.3).toLocaleString("en-IN")} | Savings: ₹${(income * 0.2).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "25x-retirement": {
        const ae = inputs.annualExpenses || 0;
        setResult(
          `Retirement Corpus Needed: ₹${(ae * 25).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "housing-30": {
        const income = inputs.income || 0;
        setResult(
          `Maximum Housing Cost: ₹${(income * 0.3).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "income-by-age-30":
      case "income-by-age-40":
      case "income-by-age-50":
      case "income-by-age-60": {
        const salary = inputs.salary || 0;
        const mult =
          rule.id === "income-by-age-30"
            ? 1
            : rule.id === "income-by-age-40"
              ? 3
              : rule.id === "income-by-age-50"
                ? 6
                : 10;
        setResult(
          `Target Savings: ₹${(salary * mult).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "core-satellite": {
        const p = inputs.portfolio || 0;
        setResult(
          `Core (75%): ₹${(p * 0.75).toLocaleString("en-IN")} | Satellite (25%): ₹${(p * 0.25).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "global-diversification": {
        const p = inputs.portfolio || 0;
        setResult(
          `Domestic (75%): ₹${(p * 0.75).toLocaleString("en-IN")} | International (25%): ₹${(p * 0.25).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "position-sizing":
      case "10-percent-diversification": {
        const p = inputs.portfolio || 0;
        setResult(
          `Maximum Position Size (10%): ₹${(p * 0.1).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "credit-utilization": {
        const cl = inputs.creditLimit || 0;
        setResult(
          `Maximum Credit Usage (30%): ₹${(cl * 0.3).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "debt-to-income-36": {
        const income = inputs.income || 0;
        setResult(
          `Maximum Total Debt (36%): ₹${(income * 0.36).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "28-36-housing": {
        const income = inputs.income || 0;
        setResult(
          `Max Housing (28%): ₹${(income * 0.28).toLocaleString("en-IN")} | Max Total Debt (36%): ₹${(income * 0.36).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "emergency-fund": {
        const me = inputs.monthlyExpenses || 0;
        setResult(
          `Emergency Fund Needed: ₹${(me * 6).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "life-insurance-coverage": {
        const ai = inputs.annualIncome || 0;
        setResult(
          `Coverage Range: ₹${(ai * 10).toLocaleString("en-IN")} - ₹${(ai * 15).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "4-percent-withdrawal": {
        const corpus = inputs.corpus || 0;
        setResult(
          `Annual Withdrawal: ₹${(corpus * 0.04).toLocaleString("en-IN")}`,
        );
        break;
      }
      case "100-minus-age": {
        const age = inputs.age || 0;
        setResult(`Equity: ${100 - age}% | Bonds: ${age}%`);
        break;
      }
      case "rule-of-72": {
        const r = inputs.returnRate || 0;
        setResult(`Money doubles in ${r > 0 ? (72 / r).toFixed(1) : 0} years`);
        break;
      }
      case "rule-of-114": {
        const r = inputs.returnRate || 0;
        setResult(`Money triples in ${r > 0 ? (114 / r).toFixed(1) : 0} years`);
        break;
      }
      case "rule-of-144": {
        const r = inputs.returnRate || 0;
        setResult(
          `Money quadruples in ${r > 0 ? (144 / r).toFixed(1) : 0} years`,
        );
        break;
      }
      case "multiple-income-streams": {
        const total =
          (inputs.stream1 || 0) + (inputs.stream2 || 0) + (inputs.stream3 || 0);
        setResult(`Total Monthly Income: ₹${total.toLocaleString("en-IN")}`);
        break;
      }
      default:
        setResult("Calculator coming soon for this rule");
    }
  };

  const renderInputs = () => {
    switch (rule.id) {
      case "80-20-savings":
      case "70-20-10":
      case "60-40-budget":
      case "50-30-20-budgeting":
      case "housing-30":
      case "debt-to-income-36":
      case "28-36-housing":
        return (
          <div className="space-y-2">
            <Label htmlFor="income" className="text-xs">
              Monthly Income (₹)
            </Label>
            <Input
              id="income"
              type="number"
              placeholder="100000"
              value={inputs.income || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  income: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "25x-retirement":
        return (
          <div className="space-y-2">
            <Label htmlFor="annualExpenses" className="text-xs">
              Annual Expenses (₹)
            </Label>
            <Input
              id="annualExpenses"
              type="number"
              placeholder="1000000"
              value={inputs.annualExpenses || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  annualExpenses: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "income-by-age-30":
      case "income-by-age-40":
      case "income-by-age-50":
      case "income-by-age-60":
        return (
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-xs">
              Annual Salary (₹)
            </Label>
            <Input
              id="salary"
              type="number"
              placeholder="1000000"
              value={inputs.salary || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  salary: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "core-satellite":
      case "global-diversification":
      case "position-sizing":
      case "10-percent-diversification":
        return (
          <div className="space-y-2">
            <Label htmlFor="portfolio" className="text-xs">
              Portfolio Value (₹)
            </Label>
            <Input
              id="portfolio"
              type="number"
              placeholder="1000000"
              value={inputs.portfolio || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  portfolio: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "credit-utilization":
        return (
          <div className="space-y-2">
            <Label htmlFor="creditLimit" className="text-xs">
              Credit Card Limit (₹)
            </Label>
            <Input
              id="creditLimit"
              type="number"
              placeholder="100000"
              value={inputs.creditLimit || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  creditLimit: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "emergency-fund":
        return (
          <div className="space-y-2">
            <Label htmlFor="monthlyExpenses" className="text-xs">
              Monthly Expenses (₹)
            </Label>
            <Input
              id="monthlyExpenses"
              type="number"
              placeholder="50000"
              value={inputs.monthlyExpenses || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  monthlyExpenses: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "life-insurance-coverage":
        return (
          <div className="space-y-2">
            <Label htmlFor="annualIncome" className="text-xs">
              Annual Income (₹)
            </Label>
            <Input
              id="annualIncome"
              type="number"
              placeholder="1000000"
              value={inputs.annualIncome || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  annualIncome: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "4-percent-withdrawal":
        return (
          <div className="space-y-2">
            <Label htmlFor="corpus" className="text-xs">
              Retirement Corpus (₹)
            </Label>
            <Input
              id="corpus"
              type="number"
              placeholder="25000000"
              value={inputs.corpus || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  corpus: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "100-minus-age":
        return (
          <div className="space-y-2">
            <Label htmlFor="age" className="text-xs">
              Your Age
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="35"
              value={inputs.age || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  age: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "rule-of-72":
      case "rule-of-114":
      case "rule-of-144":
        return (
          <div className="space-y-2">
            <Label htmlFor="returnRate" className="text-xs">
              Annual Return Rate (%)
            </Label>
            <Input
              id="returnRate"
              type="number"
              placeholder="10"
              value={inputs.returnRate || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  returnRate: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      case "multiple-income-streams":
        return (
          <div className="space-y-2">
            <Label htmlFor="stream1" className="text-xs">
              Income Stream 1 (₹)
            </Label>
            <Input
              id="stream1"
              type="number"
              placeholder="50000"
              value={inputs.stream1 || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  stream1: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
            <Label htmlFor="stream2" className="text-xs">
              Income Stream 2 (₹)
            </Label>
            <Input
              id="stream2"
              type="number"
              placeholder="30000"
              value={inputs.stream2 || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  stream2: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
            <Label htmlFor="stream3" className="text-xs">
              Income Stream 3 (₹)
            </Label>
            <Input
              id="stream3"
              type="number"
              placeholder="20000"
              value={inputs.stream3 || ""}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  stream3: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-sm"
            />
          </div>
        );
      default:
        return (
          <p className="text-xs text-muted-foreground italic">
            Interactive calculator for this rule is coming soon
          </p>
        );
    }
  };

  const hasCalculator = [
    "80-20-savings",
    "70-20-10",
    "60-40-budget",
    "50-30-20-budgeting",
    "25x-retirement",
    "housing-30",
    "income-by-age-30",
    "income-by-age-40",
    "income-by-age-50",
    "income-by-age-60",
    "core-satellite",
    "global-diversification",
    "position-sizing",
    "10-percent-diversification",
    "credit-utilization",
    "debt-to-income-36",
    "28-36-housing",
    "emergency-fund",
    "life-insurance-coverage",
    "4-percent-withdrawal",
    "100-minus-age",
    "rule-of-72",
    "rule-of-114",
    "rule-of-144",
    "multiple-income-streams",
  ].includes(rule.id);

  if (!hasCalculator) {
    return (
      <Card className="shadow-sm border-border/50 bg-gradient-to-br from-muted/30 to-accent/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Interactive Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground italic">
            Calculator for this rule is coming soon
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border/50 bg-gradient-to-br from-primary/5 to-accent/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Interactive Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {renderInputs()}
        <Button
          onClick={handleCalculate}
          className="w-full h-8 text-xs"
          size="sm"
        >
          Calculate
        </Button>
        {result && (
          <Alert className="shadow-sm bg-gradient-to-br from-green-50 to-transparent border-green-200">
            <Target className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <p className="text-xs font-semibold">{result}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export function FinancialRulesSection() {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedRuleData = financialRules.find((r) => r.id === selectedRule);

  const filteredRules = financialRules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.formula.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const matches = financialRules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(query.toLowerCase()) ||
        rule.description.toLowerCase().includes(query.toLowerCase()) ||
        rule.category.toLowerCase().includes(query.toLowerCase()) ||
        rule.formula.toLowerCase().includes(query.toLowerCase()),
    );
    if (matches.length === 1) setSelectedRule(matches[0].id);
  };

  if (selectedRule && selectedRuleData) {
    const RuleIcon = selectedRuleData.icon;
    return (
      <div className="space-y-4 p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRule(null);
              setSearchQuery("");
            }}
            className="gap-1.5 h-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Rules
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <RuleIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <h2 className="text-base font-bold">{selectedRuleData.name}</h2>
          </div>
        </div>

        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <RuleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {selectedRuleData.name}
                </CardTitle>
                <CardDescription>{selectedRuleData.category}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedRuleData.description}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-muted/50 to-accent/10 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Formula:</p>
              <p className="text-base font-mono font-semibold">
                {selectedRuleData.formula}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Key Points</h3>
              <div className="space-y-2">
                {selectedRuleData.keyPoints.map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <Alert className="bg-gradient-to-br from-green-50 to-transparent border-green-200">
              <Target className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <p className="text-sm font-semibold mb-1">Example:</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRuleData.example}
                </p>
              </AlertDescription>
            </Alert>
            <Alert className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
              <AlertDescription>
                <p className="text-sm font-semibold mb-1">
                  Practical Takeaway:
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedRuleData.practicalTakeaway}
                </p>
              </AlertDescription>
            </Alert>
            <RuleCalculator rule={selectedRuleData} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-4 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search financial rules by name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-gradient-to-r from-muted/50 to-accent/10 border-border/50 focus:border-primary/50"
            />
          </div>
          <div className="grid gap-4">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              const categoryRules = filteredRules.filter(
                (r) => r.category === category.name,
              );
              if (categoryRules.length === 0) return null;
              return (
                <Card
                  key={category.name}
                  className="border-border/50 overflow-hidden hover:shadow-md transition-all"
                >
                  <CardHeader
                    className={`pb-3 pt-3 px-4 bg-gradient-to-r ${category.gradient}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md">
                        <CategoryIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-white">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-white/80">
                          {categoryRules.length} Rules
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-3">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryRules.map((rule) => {
                        const Icon = rule.icon;
                        return (
                          <Card
                            key={rule.id}
                            className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50 hover:scale-105 bg-gradient-to-br from-card to-primary/5"
                            onClick={() => setSelectedRule(rule.id)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                                  <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-xs leading-tight">
                                  {rule.name}
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {rule.description}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {filteredRules.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No rules found matching "{searchQuery}"
              </p>
            </div>
          )}
          {!searchQuery && (
            <div className="text-center pt-2 pb-1">
              <p className="text-xs text-muted-foreground">
                Click any rule to learn more and use interactive calculators
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
