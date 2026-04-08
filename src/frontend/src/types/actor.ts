/**
 * BackendActor — full TypeScript interface for every public method on the
 * backend canister.  Generated from src/backend/main.mo + Types.mo.
 *
 * This file is the source of truth for frontend type-checking until
 * `pnpm bindgen` can run against a deployed canister and regenerate
 * backend.d.ts automatically.
 */

import type { Principal } from "@icp-sdk/core/principal";
import type {
  BudgetCategory,
  ChecklistItem,
  DashboardSummary,
  FinancialModel,
  FinancialRule,
  Goal,
  Loan,
  PlannerEvent,
  PortfolioHolding,
  TradeEntry,
  Transaction,
  UserProfile,
} from "./index";

export interface BackendActor {
  // ── User Profile ──────────────────────────────────────────────
  getCallerUserProfile(): Promise<UserProfile | undefined>;
  saveCallerUserProfile(profile: UserProfile): Promise<void>;
  getUserProfile(user: Principal): Promise<UserProfile | undefined>;

  // ── Admin ─────────────────────────────────────────────────────
  bootstrapAdmin(): Promise<boolean>;
  isCallerAdmin(): Promise<boolean>;
  isCallerBlocked(): Promise<{ blocked: boolean; reason: string }>;
  adminGetAllUsers(): Promise<Array<[string, UserProfile]>>;
  adminSuspendUser(principalText: string): Promise<boolean>;
  adminUnsuspendUser(principalText: string): Promise<boolean>;

  // ── Goals ─────────────────────────────────────────────────────
  getAllGoals(): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: Goal): Promise<Goal>;
  updateGoal(id: string, goal: Goal): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;

  // ── Portfolio ─────────────────────────────────────────────────
  getAllPortfolioHoldings(): Promise<PortfolioHolding[]>;
  getPortfolioHolding(id: string): Promise<PortfolioHolding | undefined>;
  createPortfolioHolding(holding: PortfolioHolding): Promise<PortfolioHolding>;
  updatePortfolioHolding(
    id: string,
    holding: PortfolioHolding,
  ): Promise<PortfolioHolding | undefined>;
  deletePortfolioHolding(id: string): Promise<boolean>;

  // ── Budget Categories ─────────────────────────────────────────
  getAllBudgetCategories(): Promise<BudgetCategory[]>;
  getBudgetCategory(id: string): Promise<BudgetCategory | undefined>;
  createBudgetCategory(category: BudgetCategory): Promise<BudgetCategory>;
  updateBudgetCategory(
    id: string,
    category: BudgetCategory,
  ): Promise<BudgetCategory | undefined>;
  deleteBudgetCategory(id: string): Promise<boolean>;

  // ── Transactions ──────────────────────────────────────────────
  getAllTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: Transaction): Promise<Transaction>;
  updateTransaction(
    id: string,
    transaction: Transaction,
  ): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<boolean>;

  // ── Loans ─────────────────────────────────────────────────────
  getAllLoans(): Promise<Loan[]>;
  getLoan(id: string): Promise<Loan | undefined>;
  createLoan(loan: Loan): Promise<Loan>;
  updateLoan(id: string, loan: Loan): Promise<Loan | undefined>;
  deleteLoan(id: string): Promise<boolean>;

  // ── Financial Rules ───────────────────────────────────────────
  getAllFinancialRules(): Promise<FinancialRule[]>;
  getFinancialRule(id: string): Promise<FinancialRule | undefined>;
  createFinancialRule(rule: FinancialRule): Promise<FinancialRule>;
  updateFinancialRule(
    id: string,
    rule: FinancialRule,
  ): Promise<FinancialRule | undefined>;
  deleteFinancialRule(id: string): Promise<boolean>;

  // ── Financial Planner Events ──────────────────────────────────
  getAllPlannerEvents(): Promise<PlannerEvent[]>;
  getPlannerEvent(id: string): Promise<PlannerEvent | undefined>;
  createPlannerEvent(event: PlannerEvent): Promise<PlannerEvent>;
  updatePlannerEvent(
    id: string,
    event: PlannerEvent,
  ): Promise<PlannerEvent | undefined>;
  deletePlannerEvent(id: string): Promise<boolean>;

  // ── Financial Models ──────────────────────────────────────────
  getAllFinancialModels(): Promise<FinancialModel[]>;
  getFinancialModel(id: string): Promise<FinancialModel | undefined>;
  createFinancialModel(model: FinancialModel): Promise<FinancialModel>;
  updateFinancialModel(
    id: string,
    model: FinancialModel,
  ): Promise<FinancialModel | undefined>;
  deleteFinancialModel(id: string): Promise<boolean>;

  // ── Trade Journal ─────────────────────────────────────────────
  getAllTradeEntries(): Promise<TradeEntry[]>;
  getTradeEntry(id: string): Promise<TradeEntry | undefined>;
  createTradeEntry(entry: TradeEntry): Promise<TradeEntry>;
  updateTradeEntry(
    id: string,
    entry: TradeEntry,
  ): Promise<TradeEntry | undefined>;
  deleteTradeEntry(id: string): Promise<boolean>;

  // ── Checklist Items ───────────────────────────────────────────
  getAllChecklistItems(): Promise<ChecklistItem[]>;
  createChecklistItem(item: ChecklistItem): Promise<ChecklistItem>;
  updateChecklistItem(
    id: string,
    item: ChecklistItem,
  ): Promise<ChecklistItem | undefined>;
  deleteChecklistItem(id: string): Promise<boolean>;

  // ── Dashboard & Aggregates ────────────────────────────────────
  getDashboardSummary(): Promise<DashboardSummary>;
  getNetWorth(): Promise<number>;
}
