/**
 * Domain types derived from the backend Motoko Types.mo.
 * These are the canonical frontend type definitions used across all modules.
 * When `pnpm bindgen` runs, the Candid-generated types in backend.d.ts will
 * supersede these — until then these definitions keep the frontend building.
 */

export type AssetType =
  | "Retirement"
  | "MutualFund"
  | "ETF"
  | "Crypto"
  | "Commodity"
  | "RealEstate"
  | "FixedIncome"
  | "Other";

// Namespace-style object for enum-like access (AssetType.Retirement, etc.)
export const AssetType = {
  Retirement: "Retirement" as const,
  MutualFund: "MutualFund" as const,
  ETF: "ETF" as const,
  Crypto: "Crypto" as const,
  Commodity: "Commodity" as const,
  RealEstate: "RealEstate" as const,
  FixedIncome: "FixedIncome" as const,
  Other: "Other" as const,
};

export type TransactionType = "Income" | "Expense";

export const TransactionType = {
  Income: "Income" as const,
  Expense: "Expense" as const,
};

export interface UserProfile {
  name: string;
  email: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  notes: string;
}

export interface PortfolioHolding {
  id: string;
  assetType: AssetType;
  name: string;
  ticker: string;
  quantity: number;
  costBasis: number;
  currentValue: number;
  notes: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  categoryType: TransactionType;
  monthlyLimit: number;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  categoryId: string;
  description: string;
  account: string;
  transactionType: TransactionType;
}

export interface Loan {
  id: string;
  name: string;
  loanType: string;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  currentBalance: number;
  monthlyPayment: number;
  notes: string;
}

export interface FinancialRule {
  id: string;
  name: string;
  ruleType: string;
  threshold: number;
  condition: string;
  action: string;
  isActive: boolean;
}

export interface PlannerEvent {
  id: string;
  title: string;
  date: string;
  amount: number;
  eventType: string;
  notes: string;
  isCompleted: boolean;
}

export interface FinancialModel {
  id: string;
  name: string;
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  notes: string;
}

export interface DashboardSummary {
  goalCount: number;
  portfolioCount: number;
  budgetCategoryCount: number;
  transactionCount: number;
  loanCount: number;
  ruleCount: number;
  eventCount: number;
  modelCount: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface TradeEntry {
  id: string;
  ticker: string;
  entryDate: string;
  entryTime: string;
  positionType: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  strategy: string;
  marketConditions: string;
  emotions: string;
  notes: string;
  tags: string;
  commission: number;
  isOpen: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
  isCustom: boolean;
  sortOrder: bigint;
}
