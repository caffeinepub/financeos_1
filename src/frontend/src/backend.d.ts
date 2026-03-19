import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FinancialRule {
    id: string;
    ruleType: string;
    action: string;
    threshold: number;
    name: string;
    isActive: boolean;
    condition: string;
}
export interface BudgetCategory {
    id: string;
    categoryType: TransactionType;
    monthlyLimit: number;
    name: string;
    color: string;
}
export interface Loan {
    id: string;
    principal: number;
    currentBalance: number;
    name: string;
    loanType: string;
    termMonths: bigint;
    interestRate: number;
    notes: string;
    monthlyPayment: number;
    startDate: string;
}
export interface FinancialModel {
    id: string;
    name: string;
    initialAmount: number;
    notes: string;
    annualReturn: number;
    years: bigint;
    monthlyContribution: number;
}
export interface DashboardSummary {
    modelCount: bigint;
    totalIncome: number;
    loanCount: bigint;
    goalCount: bigint;
    budgetCategoryCount: bigint;
    totalExpenses: number;
    portfolioCount: bigint;
    eventCount: bigint;
    ruleCount: bigint;
    transactionCount: bigint;
}
export interface PlannerEvent {
    id: string;
    title: string;
    isCompleted: boolean;
    date: string;
    notes: string;
    amount: number;
    eventType: string;
}
export interface Transaction {
    id: string;
    categoryId: string;
    transactionType: TransactionType;
    date: string;
    description: string;
    account: string;
    amount: number;
}
export interface PortfolioHolding {
    id: string;
    ticker: string;
    name: string;
    currentValue: number;
    notes: string;
    quantity: number;
    costBasis: number;
    assetType: AssetType;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Goal {
    id: string;
    name: string;
    deadline: string;
    targetAmount: number;
    notes: string;
    category: string;
    currentAmount: number;
}
export enum AssetType {
    ETF = "ETF",
    RealEstate = "RealEstate",
    MutualFund = "MutualFund",
    Commodity = "Commodity",
    FixedIncome = "FixedIncome",
    Crypto = "Crypto",
    Other = "Other",
    Retirement = "Retirement"
}
export enum TransactionType {
    Income = "Income",
    Expense = "Expense"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBudgetCategory(category: BudgetCategory): Promise<BudgetCategory>;
    createFinancialModel(model: FinancialModel): Promise<FinancialModel>;
    createFinancialRule(rule: FinancialRule): Promise<FinancialRule>;
    createGoal(goal: Goal): Promise<Goal>;
    createLoan(loan: Loan): Promise<Loan>;
    createPlannerEvent(event: PlannerEvent): Promise<PlannerEvent>;
    createPortfolioHolding(holding: PortfolioHolding): Promise<PortfolioHolding>;
    createTransaction(transaction: Transaction): Promise<Transaction>;
    deleteBudgetCategory(id: string): Promise<boolean>;
    deleteFinancialModel(id: string): Promise<boolean>;
    deleteFinancialRule(id: string): Promise<boolean>;
    deleteGoal(id: string): Promise<boolean>;
    deleteLoan(id: string): Promise<boolean>;
    deletePlannerEvent(id: string): Promise<boolean>;
    deletePortfolioHolding(id: string): Promise<boolean>;
    deleteTransaction(id: string): Promise<boolean>;
    getAllBudgetCategories(): Promise<Array<BudgetCategory>>;
    getAllFinancialModels(): Promise<Array<FinancialModel>>;
    getAllFinancialRules(): Promise<Array<FinancialRule>>;
    getAllGoals(): Promise<Array<Goal>>;
    getAllLoans(): Promise<Array<Loan>>;
    getAllPlannerEvents(): Promise<Array<PlannerEvent>>;
    getAllPortfolioHoldings(): Promise<Array<PortfolioHolding>>;
    getAllTransactions(): Promise<Array<Transaction>>;
    getBudgetCategory(id: string): Promise<BudgetCategory | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardSummary(): Promise<DashboardSummary>;
    getFinancialModel(id: string): Promise<FinancialModel | null>;
    getFinancialRule(id: string): Promise<FinancialRule | null>;
    getGoal(id: string): Promise<Goal | null>;
    getLoan(id: string): Promise<Loan | null>;
    getNetWorth(): Promise<number>;
    getPlannerEvent(id: string): Promise<PlannerEvent | null>;
    getPortfolioHolding(id: string): Promise<PortfolioHolding | null>;
    getTransaction(id: string): Promise<Transaction | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerBlocked(): Promise<{ blocked: boolean; reason: string }>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBudgetCategory(id: string, category: BudgetCategory): Promise<BudgetCategory | null>;
    updateFinancialModel(id: string, model: FinancialModel): Promise<FinancialModel | null>;
    updateFinancialRule(id: string, rule: FinancialRule): Promise<FinancialRule | null>;
    updateGoal(id: string, goal: Goal): Promise<Goal | null>;
    updateLoan(id: string, loan: Loan): Promise<Loan | null>;
    updatePlannerEvent(id: string, event: PlannerEvent): Promise<PlannerEvent | null>;
    updatePortfolioHolding(id: string, holding: PortfolioHolding): Promise<PortfolioHolding | null>;
    updateTransaction(id: string, transaction: Transaction): Promise<Transaction | null>;
}
