import { BookOpen, Pencil, PiggyBank, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { type BudgetCategory, TransactionType } from "../backend.d";
import { AnalyseTab } from "../components/budgeting/AnalyseTab";
import { ExpensesTab } from "../components/budgeting/ExpensesTab";
import { MonthlyTrackerTab } from "../components/budgeting/MonthlyTrackerTab";
import { ModelBudgetingTab } from "../components/financial-model/ModelBudgetingTab";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useCurrency } from "../contexts/CurrencyContext";
import { useActor } from "../hooks/useActor";

const _NEEDS_KEYWORDS = [
  "rent",
  "housing",
  "mortgage",
  "groceries",
  "food",
  "utilities",
  "water",
  "electricity",
  "gas",
  "insurance",
  "healthcare",
  "medical",
  "transport",
  "commute",
  "emi",
  "loan",
  "education",
  "childcare",
  "phone",
  "internet",
];
const WANTS_KEYWORDS = [
  "dining",
  "eating out",
  "restaurant",
  "entertainment",
  "streaming",
  "netflix",
  "subscription",
  "shopping",
  "clothing",
  "travel",
  "vacation",
  "gym",
  "fitness",
  "hobbies",
  "personal care",
  "beauty",
  "salon",
  "electronics",
  "games",
  "leisure",
];
const SAVINGS_KEYWORDS = [
  "savings",
  "investment",
  "sip",
  "ppf",
  "nps",
  "fd",
  "emergency",
  "mutual fund",
  "retirement",
  "stocks",
  "retiral",
];

function inferBudgetType(name: string): string {
  const lc = name.toLowerCase();
  if (SAVINGS_KEYWORDS.some((k) => lc.includes(k))) return "Savings";
  if (WANTS_KEYWORDS.some((k) => lc.includes(k))) return "Wants";
  return "Needs";
}

const TYPE_BADGE_COLORS: Record<string, string> = {
  Needs: "bg-blue-100 text-blue-700 border border-blue-200",
  Wants: "bg-amber-100 text-amber-700 border border-amber-200",
  Savings: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const emptyForm = {
  name: "",
  categoryType: TransactionType.Expense,
  monthlyLimit: 0,
  color: "#6366f1",
  budgetType: "Needs",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

// Industry-standard budget categories
const STANDARD_CATEGORIES: Array<{
  name: string;
  categoryType: TransactionType;
  monthlyLimit: number;
  color: string;
}> = [
  {
    name: "Salary & Wages",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#10b981",
  },
  {
    name: "Business Income",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#059669",
  },
  {
    name: "Freelance / Consulting",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#34d399",
  },
  {
    name: "Investment Returns",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#6ee7b7",
  },
  {
    name: "Rental Income",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#a7f3d0",
  },
  {
    name: "Other Income",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#d1fae5",
  },
  {
    name: "Housing & Rent",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#6366f1",
  },
  {
    name: "Groceries & Food",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#f59e0b",
  },
  {
    name: "Utilities & Bills",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#3b82f6",
  },
  {
    name: "Transportation",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#8b5cf6",
  },
  {
    name: "Healthcare & Medical",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#ef4444",
  },
  {
    name: "Insurance",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#ec4899",
  },
  {
    name: "Education",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#06b6d4",
  },
  {
    name: "Entertainment & Leisure",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#a855f7",
  },
  {
    name: "Dining & Restaurants",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#f97316",
  },
  {
    name: "Personal Care & Wellness",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#db2777",
  },
  {
    name: "Clothing & Apparel",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#7c3aed",
  },
  {
    name: "Savings & Investments",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#0ea5e9",
  },
  {
    name: "Debt Payments & EMI",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#dc2626",
  },
  {
    name: "Subscriptions & Software",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#4f46e5",
  },
  {
    name: "Travel & Vacation",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#0891b2",
  },
  {
    name: "Gifts & Donations",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#be185d",
  },
  {
    name: "Childcare & Family",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#d97706",
  },
  {
    name: "Home Maintenance",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#78716c",
  },
  {
    name: "Miscellaneous",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#94a3b8",
  },
];

// ─── ImproveBudgetContent ────────────────────────────────────────────────────
interface ImproveBudgetProps {
  autofillData: {
    income: number;
    needs: number;
    wants: number;
    savings: number;
    // Per-category amounts mapped by keyword
    categoryAmounts?: Record<string, number>;
  } | null;
}

const NEEDS_CATEGORIES = [
  { key: "housing", label: "Housing & Rent", default: 15000 },
  { key: "groceries", label: "Groceries & Food", default: 8000 },
  { key: "utilities", label: "Utilities & Bills", default: 3000 },
  { key: "transport", label: "Transportation", default: 5000 },
  { key: "healthcare", label: "Healthcare & Medical", default: 2000 },
  { key: "insurance", label: "Insurance Premiums", default: 2000 },
  { key: "education", label: "Education", default: 3000 },
  { key: "emi", label: "Debt Payments & EMI", default: 5000 },
];
const WANTS_CATEGORIES = [
  { key: "dining", label: "Dining & Restaurants", default: 4000 },
  { key: "entertainment", label: "Entertainment & Leisure", default: 2000 },
  { key: "personalcare", label: "Personal Care & Wellness", default: 1500 },
  { key: "clothing", label: "Clothing & Apparel", default: 2000 },
  { key: "subscriptions", label: "Subscriptions & Software", default: 1000 },
  { key: "travel", label: "Travel & Vacation", default: 1500 },
];
const SAVINGS_CATEGORIES = [
  { key: "investments", label: "Savings & Investments", default: 5000 },
  { key: "emergency", label: "Emergency Fund", default: 2000 },
  { key: "retirement", label: "Retirement / NPS / PPF", default: 1000 },
];

function ImproveBudgetContent({ autofillData }: ImproveBudgetProps) {
  const { formatCurrency } = useCurrency();
  const [income, setIncome] = useState(50000);
  const [needs, setNeeds] = useState<Record<string, number>>(
    Object.fromEntries(NEEDS_CATEGORIES.map((c) => [c.key, c.default])),
  );
  const [wants, setWants] = useState<Record<string, number>>(
    Object.fromEntries(WANTS_CATEGORIES.map((c) => [c.key, c.default])),
  );
  const [savings, setSavings] = useState<Record<string, number>>(
    Object.fromEntries(SAVINGS_CATEGORIES.map((c) => [c.key, c.default])),
  );
  const [applied, setApplied] = useState(false);
  const [analysed, setAnalysed] = useState(false);
  const [monthlyReductionTarget, setMonthlyReductionTarget] = useState(0);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [minIncome, setMinIncome] = useState(0);
  const [maxIncome, setMaxIncome] = useState(0);

  const totalNeeds = Object.values(needs).reduce((s, v) => s + v, 0);
  const totalWants = Object.values(wants).reduce((s, v) => s + v, 0);
  const totalSavings = Object.values(savings).reduce((s, v) => s + v, 0);
  const totalExpenses = totalNeeds + totalWants + totalSavings;
  const surplus = income - totalExpenses;

  const needsPct = income > 0 ? (totalNeeds / income) * 100 : 0;
  const wantsPct = income > 0 ? (totalWants / income) * 100 : 0;
  const savingsPct = income > 0 ? (totalSavings / income) * 100 : 0;

  const applyAutofillData = (data: typeof autofillData) => {
    if (!data) return;
    setIncome(data.income || 50000);

    if (data.categoryAmounts && Object.keys(data.categoryAmounts).length > 0) {
      // Use per-category amounts directly
      const catAmts = data.categoryAmounts;
      setNeeds(
        Object.fromEntries(
          NEEDS_CATEGORIES.map((c) => [
            c.key,
            catAmts[c.key] !== undefined ? catAmts[c.key] : c.default,
          ]),
        ),
      );
      setWants(
        Object.fromEntries(
          WANTS_CATEGORIES.map((c) => [
            c.key,
            catAmts[c.key] !== undefined ? catAmts[c.key] : c.default,
          ]),
        ),
      );
      setSavings(
        Object.fromEntries(
          SAVINGS_CATEGORIES.map((c) => [
            c.key,
            catAmts[c.key] !== undefined ? catAmts[c.key] : c.default,
          ]),
        ),
      );
    } else {
      // Fallback: distribute proportionally
      if (data.needs > 0) {
        const ratio =
          data.needs / NEEDS_CATEGORIES.reduce((s, c) => s + c.default, 0);
        setNeeds(
          Object.fromEntries(
            NEEDS_CATEGORIES.map((c) => [c.key, Math.round(c.default * ratio)]),
          ),
        );
      }
      if (data.wants > 0) {
        const ratio =
          data.wants / WANTS_CATEGORIES.reduce((s, c) => s + c.default, 0);
        setWants(
          Object.fromEntries(
            WANTS_CATEGORIES.map((c) => [c.key, Math.round(c.default * ratio)]),
          ),
        );
      }
      if (data.savings > 0) {
        const ratio =
          data.savings / SAVINGS_CATEGORIES.reduce((s, c) => s + c.default, 0);
        setSavings(
          Object.fromEntries(
            SAVINGS_CATEGORIES.map((c) => [
              c.key,
              Math.round(c.default * ratio),
            ]),
          ),
        );
      }
    }
    setApplied(true);
  };

  const _handleApplyAutofill = () => {
    applyAutofillData(autofillData);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: auto-apply when data changes
  useEffect(() => {
    if (autofillData && !applied) {
      applyAutofillData(autofillData);
    }
  }, [autofillData]);

  return (
    <div className="space-y-4">
      {applied && (
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
          <span className="text-xs text-emerald-700 font-medium flex-1">
            ✓ Actual data applied for selected month. Adjust values as needed,
            then click Analyse Budget.
          </span>
          <button
            type="button"
            onClick={() => {
              setApplied(false);
              setNeeds(
                Object.fromEntries(
                  NEEDS_CATEGORIES.map((c) => [c.key, c.default]),
                ),
              );
              setWants(
                Object.fromEntries(
                  WANTS_CATEGORIES.map((c) => [c.key, c.default]),
                ),
              );
              setSavings(
                Object.fromEntries(
                  SAVINGS_CATEGORIES.map((c) => [c.key, c.default]),
                ),
              );
              setIncome(50000);
            }}
            className="h-7 px-3 rounded-lg bg-white border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* Income Section */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-2xl">
          <CardTitle className="text-sm font-bold text-emerald-800">
            💰 Income
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4 pt-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label
                htmlFor="improve-income"
                className="text-xs font-medium text-slate-600 block mb-1"
              >
                Monthly Income (consolidated)
              </label>
              <input
                id="improve-income"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value) || 0)}
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-0.5">
                Total Monthly Income
              </p>
              <p className="text-lg font-bold text-emerald-700">
                {formatCurrency(income)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Needs Section */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-blue-800">
              🏠 Needs (Target: 50%)
            </CardTitle>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${needsPct <= 50 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {needsPct.toFixed(1)}% of income
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {NEEDS_CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 min-w-[140px] flex-shrink-0">
                  {cat.label}
                </span>
                <input
                  type="number"
                  value={needs[cat.key] ?? cat.default}
                  onChange={(e) =>
                    setNeeds((prev) => ({
                      ...prev,
                      [cat.key]: Number(e.target.value) || 0,
                    }))
                  }
                  className="flex-1 h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600">
              Total Needs
            </span>
            <span className="text-sm font-bold text-blue-700">
              {formatCurrency(totalNeeds)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Wants Section */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-amber-800">
              🎉 Wants (Target: 30%)
            </CardTitle>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${wantsPct <= 30 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {wantsPct.toFixed(1)}% of income
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WANTS_CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 min-w-[140px] flex-shrink-0">
                  {cat.label}
                </span>
                <input
                  type="number"
                  value={wants[cat.key] ?? cat.default}
                  onChange={(e) =>
                    setWants((prev) => ({
                      ...prev,
                      [cat.key]: Number(e.target.value) || 0,
                    }))
                  }
                  className="flex-1 h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600">
              Total Wants
            </span>
            <span className="text-sm font-bold text-amber-700">
              {formatCurrency(totalWants)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Savings Section */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-emerald-800">
              💎 Savings (Target: 20%)
            </CardTitle>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${savingsPct >= 20 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
            >
              {savingsPct.toFixed(1)}% of income
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SAVINGS_CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 min-w-[140px] flex-shrink-0">
                  {cat.label}
                </span>
                <input
                  type="number"
                  value={savings[cat.key] ?? cat.default}
                  onChange={(e) =>
                    setSavings((prev) => ({
                      ...prev,
                      [cat.key]: Number(e.target.value) || 0,
                    }))
                  }
                  className="flex-1 h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600">
              Total Savings
            </span>
            <span className="text-sm font-bold text-emerald-700">
              {formatCurrency(totalSavings)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Optional Goals Section */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-2xl">
          <CardTitle className="text-sm font-bold text-purple-800">
            🎯 Optional Goals & Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4 pt-3 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label
                htmlFor="monthly-reduction"
                className="text-xs font-medium text-slate-600 block mb-1"
              >
                Monthly Savings Target ({formatCurrency(0).replace("0", "")}0)
              </label>
              <input
                id="monthly-reduction"
                type="number"
                value={monthlyReductionTarget}
                onChange={(e) =>
                  setMonthlyReductionTarget(Number(e.target.value) || 0)
                }
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="freelancer-check"
              type="checkbox"
              checked={isFreelancer}
              onChange={(e) => setIsFreelancer(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-400"
            />
            <label
              htmlFor="freelancer-check"
              className="text-xs font-medium text-slate-700"
            >
              I am a freelancer / have variable income
            </label>
          </div>
          {isFreelancer && (
            <div className="grid grid-cols-2 gap-3 pl-7">
              <div>
                <label
                  htmlFor="min-income"
                  className="text-xs font-medium text-slate-600 block mb-1"
                >
                  Min Monthly Income
                </label>
                <input
                  id="min-income"
                  type="number"
                  value={minIncome}
                  onChange={(e) => setMinIncome(Number(e.target.value) || 0)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label
                  htmlFor="max-income"
                  className="text-xs font-medium text-slate-600 block mb-1"
                >
                  Max Monthly Income
                </label>
                <input
                  id="max-income"
                  type="number"
                  value={maxIncome}
                  onChange={(e) => setMaxIncome(Number(e.target.value) || 0)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={() => setAnalysed(true)}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
        data-ocid="improve_budget.submit_button"
      >
        🔍 Analyse Budget
      </button>

      {analysed && (
        <div className="space-y-4">
          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-white border border-slate-200 border-l-4 border-l-emerald-500 px-3 py-2.5 shadow-sm">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                Monthly Income
              </p>
              <p className="text-sm font-bold text-emerald-700">
                {formatCurrency(income)}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">Actual</p>
            </div>
            <div
              className={`rounded-xl bg-white border border-l-4 px-3 py-2.5 shadow-sm ${needsPct <= 50 ? "border-blue-200 border-l-blue-500" : "border-red-200 border-l-red-500"}`}
            >
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                Needs (50% ideal)
              </p>
              <p
                className={`text-sm font-bold ${needsPct <= 50 ? "text-blue-700" : "text-red-600"}`}
              >
                {formatCurrency(totalNeeds)}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                Ideal: {formatCurrency(income * 0.5)}
              </p>
            </div>
            <div
              className={`rounded-xl bg-white border border-l-4 px-3 py-2.5 shadow-sm ${wantsPct <= 30 ? "border-amber-200 border-l-amber-500" : "border-red-200 border-l-red-500"}`}
            >
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                Wants (30% ideal)
              </p>
              <p
                className={`text-sm font-bold ${wantsPct <= 30 ? "text-amber-700" : "text-red-600"}`}
              >
                {formatCurrency(totalWants)}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                Ideal: {formatCurrency(income * 0.3)}
              </p>
            </div>
            <div
              className={`rounded-xl bg-white border border-l-4 px-3 py-2.5 shadow-sm ${savingsPct >= 20 ? "border-violet-200 border-l-violet-500" : "border-amber-200 border-l-amber-500"}`}
            >
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                Savings Rate
              </p>
              <p
                className={`text-sm font-bold ${savingsPct >= 20 ? "text-violet-700" : "text-amber-600"}`}
              >
                {savingsPct.toFixed(1)}%
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">Ideal: 20%</p>
            </div>
          </div>

          {/* 50/30/20 Summary Table */}
          {/* Summary */}
          <Card className="rounded-2xl border border-slate-100 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-2xl">
              <CardTitle className="text-sm font-bold text-slate-800">
                📊 50/30/20 Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-3 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-center shadow-sm">
                  <p className="text-[11px] text-slate-400 font-medium mb-0.5">
                    Income
                  </p>
                  <p className="text-sm font-bold text-emerald-700">
                    {formatCurrency(income)}
                  </p>
                </div>
                <div
                  className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${needsPct <= 50 ? "border-blue-100 bg-blue-50" : "border-red-100 bg-red-50"}`}
                >
                  <p className="text-[11px] text-slate-400 font-medium mb-0.5">
                    Needs
                  </p>
                  <p
                    className={`text-sm font-bold ${needsPct <= 50 ? "text-blue-700" : "text-red-600"}`}
                  >
                    {needsPct.toFixed(1)}%{" "}
                    <span className="text-xs font-normal">(target 50%)</span>
                  </p>
                </div>
                <div
                  className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${wantsPct <= 30 ? "border-amber-100 bg-amber-50" : "border-red-100 bg-red-50"}`}
                >
                  <p className="text-[11px] text-slate-400 font-medium mb-0.5">
                    Wants
                  </p>
                  <p
                    className={`text-sm font-bold ${wantsPct <= 30 ? "text-amber-700" : "text-red-600"}`}
                  >
                    {wantsPct.toFixed(1)}%{" "}
                    <span className="text-xs font-normal">(target 30%)</span>
                  </p>
                </div>
                <div
                  className={`rounded-xl border px-3 py-2.5 text-center shadow-sm ${savingsPct >= 20 ? "border-emerald-100 bg-emerald-50" : "border-amber-100 bg-amber-50"}`}
                >
                  <p className="text-[11px] text-slate-400 font-medium mb-0.5">
                    Savings
                  </p>
                  <p
                    className={`text-sm font-bold ${savingsPct >= 20 ? "text-emerald-700" : "text-amber-600"}`}
                  >
                    {savingsPct.toFixed(1)}%{" "}
                    <span className="text-xs font-normal">(target 20%)</span>
                  </p>
                </div>
              </div>

              {/* Ideal vs Actual */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-2.5 font-semibold text-slate-600">
                        Category
                      </th>
                      <th className="text-right p-2.5 font-semibold text-slate-600">
                        Ideal %
                      </th>
                      <th className="text-right p-2.5 font-semibold text-slate-600">
                        Actual %
                      </th>
                      <th className="text-right p-2.5 font-semibold text-slate-600">
                        Ideal Amount
                      </th>
                      <th className="text-right p-2.5 font-semibold text-slate-600">
                        Actual Amount
                      </th>
                      <th className="text-right p-2.5 font-semibold text-slate-600">
                        Variance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Needs",
                        ideal: 50,
                        actual: needsPct,
                        actualAmt: totalNeeds,
                      },
                      {
                        name: "Wants",
                        ideal: 30,
                        actual: wantsPct,
                        actualAmt: totalWants,
                      },
                      {
                        name: "Savings",
                        ideal: 20,
                        actual: savingsPct,
                        actualAmt: totalSavings,
                      },
                    ].map((row) => {
                      const idealAmt = (income * row.ideal) / 100;
                      const variance = row.actualAmt - idealAmt;
                      return (
                        <tr key={row.name} className="border-t border-slate-50">
                          <td className="p-2.5 font-medium text-slate-700">
                            {row.name}
                          </td>
                          <td className="p-2.5 text-right text-slate-500">
                            {row.ideal}%
                          </td>
                          <td
                            className={`p-2.5 text-right font-semibold ${Math.abs(row.actual - row.ideal) <= 5 ? "text-emerald-600" : "text-amber-600"}`}
                          >
                            {row.actual.toFixed(1)}%
                          </td>
                          <td className="p-2.5 text-right text-slate-600">
                            {formatCurrency(idealAmt)}
                          </td>
                          <td className="p-2.5 text-right text-slate-700 font-medium">
                            {formatCurrency(row.actualAmt)}
                          </td>
                          <td
                            className={`p-2.5 text-right font-semibold ${variance <= 0 ? "text-emerald-600" : "text-red-500"}`}
                          >
                            {variance > 0 ? "+" : ""}
                            {formatCurrency(variance)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 border-slate-200 bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-800">Total</td>
                      <td className="p-2.5 text-right text-slate-500">100%</td>
                      <td className="p-2.5 text-right font-bold text-slate-700">
                        {(needsPct + wantsPct + savingsPct).toFixed(1)}%
                      </td>
                      <td className="p-2.5 text-right text-slate-600">
                        {formatCurrency(income)}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-800">
                        {formatCurrency(totalExpenses)}
                      </td>
                      <td
                        className={`p-2.5 text-right font-bold ${surplus >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {surplus >= 0 ? "Surplus " : "Deficit "}
                        {formatCurrency(Math.abs(surplus))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {surplus < 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-800">
                    ⚠️ Budget Deficit of {formatCurrency(Math.abs(surplus))}
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Your expenses exceed income. Consider reducing Wants
                    categories or finding additional income sources.
                  </p>
                </div>
              )}
              {surplus >= 0 && savingsPct >= 20 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-emerald-800">
                    ✅ On Track with 50/30/20 Rule
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    You have a surplus of {formatCurrency(surplus)} and are
                    saving {savingsPct.toFixed(1)}% of income. Consider
                    investing the surplus for wealth creation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Money Leakage Areas */}
          <Card className="rounded-2xl border border-red-100 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl">
              <CardTitle className="text-sm font-bold text-red-800">
                🚨 Top Money Leakage Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-3">
              {(() => {
                const leaks: Array<{
                  area: string;
                  message: string;
                  saving: number;
                }> = [];
                const {
                  dining: d = 0,
                  entertainment: ent = 0,
                  subscriptions: sub = 0,
                  clothing = 0,
                } = wants;
                const { housing: rent = 0, emi = 0 } = needs;
                if (income > 0 && d + ent > income * 0.07) {
                  const excess = Math.max(0, d + ent - income * 0.07);
                  leaks.push({
                    area: "Dining & Entertainment",
                    message: `Spending ${(((d + ent) / income) * 100).toFixed(1)}% on dining & entertainment (ideal ≤7%)`,
                    saving: Math.round(excess),
                  });
                }
                if (income > 0 && sub > income * 0.025) {
                  const excess = Math.max(0, sub - income * 0.025);
                  leaks.push({
                    area: "Subscriptions",
                    message: `Subscriptions at ${((sub / income) * 100).toFixed(1)}% of income (ideal ≤2.5%)`,
                    saving: Math.round(excess),
                  });
                }
                if (income > 0 && rent > income * 0.3) {
                  const excess = Math.max(0, rent - income * 0.3);
                  leaks.push({
                    area: "Housing & Rent",
                    message: `Rent is ${((rent / income) * 100).toFixed(1)}% of income (ideal ≤30%)`,
                    saving: Math.round(excess),
                  });
                }
                if (income > 0 && emi > income * 0.35) {
                  const excess = Math.max(0, emi - income * 0.35);
                  leaks.push({
                    area: "EMIs & Loan Payments",
                    message: `Debt payments at ${((emi / income) * 100).toFixed(1)}% of income (ideal ≤35%)`,
                    saving: Math.round(excess),
                  });
                }
                if (income > 0 && clothing > income * 0.05) {
                  const excess = Math.max(0, clothing - income * 0.05);
                  leaks.push({
                    area: "Clothing & Shopping",
                    message: `Clothing at ${((clothing / income) * 100).toFixed(1)}% of income (ideal ≤5%)`,
                    saving: Math.round(excess),
                  });
                }
                if (leaks.length === 0) {
                  return (
                    <div className="text-xs text-emerald-700 font-medium py-2">
                      ✅ No major leakage areas detected. Your budget looks
                      well-controlled!
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {leaks.slice(0, 4).map((leak) => (
                      <div
                        key={leak.area}
                        className="rounded-xl border border-red-200 bg-red-50 p-3"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base">🚨</span>
                          <p className="text-xs font-bold text-red-800">
                            {leak.area}
                          </p>
                        </div>
                        <p className="text-[11px] text-red-700">
                          {leak.message}
                        </p>
                        <p className="text-[10px] text-emerald-700 mt-1.5 font-semibold">
                          💡 Save {formatCurrency(leak.saving)}/mo by reducing
                          this
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Your Quick Win */}
          <Card className="rounded-2xl border border-emerald-100 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
              <CardTitle className="text-sm font-bold text-emerald-800">
                ⚡ Your Quick Win — Do This Today
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-3">
              {(() => {
                const {
                  dining: d = 0,
                  entertainment: ent = 0,
                  subscriptions: sub = 0,
                } = wants;
                const { housing: rent = 0 } = needs;
                if (income > 0 && sub > income * 0.025) {
                  return (
                    <p className="text-xs text-slate-700">
                      📱 <strong>Cancel or downgrade 1–2 subscriptions.</strong>{" "}
                      You&apos;re spending {formatCurrency(sub)}/mo on
                      subscriptions. Cutting unused ones can save{" "}
                      {formatCurrency(
                        Math.max(0, sub - Math.round(income * 0.025)),
                      )}
                      /mo immediately.
                    </p>
                  );
                }
                if (income > 0 && d + ent > income * 0.07) {
                  return (
                    <p className="text-xs text-slate-700">
                      🍽️ <strong>Cut dining out by 30% this month.</strong> At{" "}
                      {formatCurrency(d + ent)}/mo, reducing by 30% saves{" "}
                      {formatCurrency(Math.round((d + ent) * 0.3))}/mo with no
                      major lifestyle change.
                    </p>
                  );
                }
                if (savingsPct < 10 && income > 0) {
                  return (
                    <p className="text-xs text-slate-700">
                      💰{" "}
                      <strong>
                        Set up a {formatCurrency(Math.round(income * 0.05))}{" "}
                        auto-SIP today.
                      </strong>{" "}
                      Even saving 5% (
                      {formatCurrency(Math.round(income * 0.05))}/mo) compounds
                      to {formatCurrency(Math.round(income * 0.05 * 12 * 1.12))}{" "}
                      in 1 year.
                    </p>
                  );
                }
                if (rent > income * 0.3) {
                  return (
                    <p className="text-xs text-slate-700">
                      🏠{" "}
                      <strong>
                        Consider downsizing or finding a flatmate.
                      </strong>{" "}
                      Housing at {((rent / income) * 100).toFixed(0)}% of income
                      is high. Reducing by{" "}
                      {formatCurrency(Math.round(rent * 0.1))}/mo frees up
                      significant cash flow.
                    </p>
                  );
                }
                return (
                  <p className="text-xs text-slate-700">
                    📊{" "}
                    <strong>
                      Increase your SIP by{" "}
                      {formatCurrency(Math.round(income * 0.02))}/mo.
                    </strong>{" "}
                    You&apos;re in a good position. Adding just 2% more to
                    investments accelerates wealth creation significantly.
                  </p>
                );
              })()}
            </CardContent>
          </Card>

          {/* Freelancer-Specific Budget Rules */}
          {isFreelancer && (
            <Card className="rounded-2xl border border-blue-100 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl">
                <CardTitle className="text-sm font-bold text-blue-800">
                  💼 Freelancer Budget Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 pt-3 space-y-2">
                {[
                  {
                    tip: "Build a 6-month emergency fund (≥6×monthly expenses) before investing aggressively.",
                    icon: "🛡️",
                  },
                  {
                    tip: `Plan around your min income (${formatCurrency(minIncome)}). Treat extra income as a bonus to invest.`,
                    icon: "📉",
                  },
                  {
                    tip: "Set aside 30% of every payment for taxes immediately. Keep it in a separate account.",
                    icon: "💸",
                  },
                  {
                    tip: "Use the variable income range to plan for worst-case budgeting. Your buffer needs = Max-Min gap.",
                    icon: "📊",
                  },
                  {
                    tip: "Automate savings on good months. Invest the surplus from high-income months systematically.",
                    icon: "⚡",
                  },
                ].map((item) => (
                  <div
                    key={item.tip.slice(0, 20)}
                    className="flex items-start gap-2"
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <p className="text-xs text-slate-700">{item.tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Monthly Reduction Suggestions */}
          {monthlyReductionTarget > 0 && (
            <Card className="rounded-2xl border border-amber-100 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-2xl">
                <CardTitle className="text-sm font-bold text-amber-800">
                  📉 Reduction Suggestions to Hit{" "}
                  {formatCurrency(monthlyReductionTarget)}/mo Target
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 pt-3 space-y-2">
                {(() => {
                  const currentSavings = Math.max(0, income - totalExpenses);
                  const gap = Math.max(
                    0,
                    monthlyReductionTarget - currentSavings,
                  );
                  if (gap <= 0)
                    return (
                      <p className="text-xs text-emerald-700 font-medium">
                        ✅ Your current savings (
                        {formatCurrency(currentSavings)}/mo) already meets your
                        target!
                      </p>
                    );
                  const suggestions: string[] = [];
                  const {
                    dining: d = 0,
                    entertainment: ent = 0,
                    subscriptions: sub = 0,
                    clothing = 0,
                  } = wants;
                  if (d + ent > 0)
                    suggestions.push(
                      `Reduce dining & entertainment by ${formatCurrency(Math.min(Math.round((d + ent) * 0.25), gap))}/mo`,
                    );
                  if (sub > 500)
                    suggestions.push(
                      `Review subscriptions — save ${formatCurrency(Math.min(Math.round(sub * 0.4), gap))}/mo`,
                    );
                  if (clothing > 0)
                    suggestions.push(
                      `Pause clothing spending for 1-2 months — save ${formatCurrency(Math.min(clothing, gap))}/mo`,
                    );
                  if (suggestions.length === 0)
                    suggestions.push(
                      "Focus on reducing wants categories to bridge the gap.",
                    );
                  return (
                    <div>
                      <p className="text-xs text-amber-700 mb-2">
                        You need {formatCurrency(gap)}/mo more in savings:
                      </p>
                      {suggestions.map((s) => (
                        <p
                          key={s.slice(0, 20)}
                          className="text-xs text-slate-700 flex items-start gap-1.5"
                        >
                          <span className="text-amber-500 flex-shrink-0">
                            →
                          </span>
                          {s}
                        </p>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function BudgetingPage() {
  const { actor } = useActor();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showAllPlanIncome, setShowAllPlanIncome] = useState(false);
  const _lastMonthDate = new Date();
  _lastMonthDate.setMonth(_lastMonthDate.getMonth() - 1);
  const [autofillMonth, setAutofillMonth] = useState<number>(
    _lastMonthDate.getMonth(),
  );
  const [autofillYear, setAutofillYear] = useState<number>(
    _lastMonthDate.getFullYear(),
  );
  const [autofillData, setAutofillData] = useState<{
    income: number;
    needs: number;
    wants: number;
    savings: number;
    categoryAmounts?: Record<string, number>;
  } | null>(null);
  const [transactions, setTransactions] = useState<
    Array<{
      amount: number;
      transactionType: { Income?: null; Expense?: null };
      categoryId: string;
      date: string;
    }>
  >([]);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    Promise.all([
      actor.getAllBudgetCategories(),
      actor.getAllTransactions().catch(() => []),
    ])
      .then(([cats, txns]) => {
        setCategories(cats);
        setTransactions(txns as typeof transactions);
      })
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (c: BudgetCategory) => {
    setEditing(c);
    setForm({
      name: c.name,
      categoryType: c.categoryType,
      monthlyLimit: c.monthlyLimit,
      color: c.color,
      budgetType: inferBudgetType(c.name),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = { ...editing, ...form };
        await actor.updateBudgetCategory(editing.id, updated);
        setCategories((prev) =>
          prev.map((c) => (c.id === editing.id ? updated : c)),
        );
      } else {
        const newCat = { id: crypto.randomUUID(), ...form };
        await actor.createBudgetCategory(newCat);
        setCategories((prev) => [...prev, newCat]);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deleteBudgetCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const seedStandardCategories = async () => {
    if (!actor) return;
    setSeeding(true);
    try {
      const existingNames = new Set(
        categories.map((c) => c.name.toLowerCase()),
      );
      const toCreate = STANDARD_CATEGORIES.filter(
        (sc) => !existingNames.has(sc.name.toLowerCase()),
      );
      await Promise.all(
        toCreate.map((sc) =>
          actor.createBudgetCategory({ id: crypto.randomUUID(), ...sc }),
        ),
      );
      load();
    } finally {
      setSeeding(false);
    }
  };

  const handleAutofill = () => {
    const monthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === autofillMonth && d.getFullYear() === autofillYear;
    });
    if (monthTx.length === 0) {
      toast.error("No transactions found for the selected month");
      return;
    }
    const income = monthTx
      .filter((t) => Object.keys(t.transactionType)[0] === "Income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = monthTx.filter(
      (t) => Object.keys(t.transactionType)[0] === "Expense",
    );
    // Build category type map
    const catTypeMap: Record<string, string> = {};
    for (const c of categories) {
      const lc = c.name.toLowerCase();
      if (
        [
          "savings",
          "investment",
          "sip",
          "ppf",
          "nps",
          "fd",
          "emergency",
          "mutual fund",
          "retirement",
        ].some((k) => lc.includes(k))
      ) {
        catTypeMap[c.id] = "Savings";
      } else if (
        [
          "dining",
          "eating out",
          "entertainment",
          "streaming",
          "subscription",
          "shopping",
          "clothing",
          "travel",
          "gym",
          "leisure",
        ].some((k) => lc.includes(k))
      ) {
        catTypeMap[c.id] = "Wants";
      } else {
        catTypeMap[c.id] = "Needs";
      }
    }
    const needs = expenses
      .filter((t) => (catTypeMap[t.categoryId] ?? "Needs") === "Needs")
      .reduce((s, t) => s + t.amount, 0);
    const wants = expenses
      .filter((t) => (catTypeMap[t.categoryId] ?? "Needs") === "Wants")
      .reduce((s, t) => s + t.amount, 0);
    const savings = expenses
      .filter((t) => (catTypeMap[t.categoryId] ?? "Needs") === "Savings")
      .reduce((s, t) => s + t.amount, 0);
    // Build per-category amounts using NEEDS/WANTS category keywords
    const categoryAmounts: Record<string, number> = {};

    // Map expense amounts to improve budget category keys
    const KEY_MAP: Record<string, string[]> = {
      housing: ["housing", "rent", "mortgage"],
      groceries: ["groceries", "food", "grocery"],
      utilities: ["utilities", "water", "electricity", "gas", "bill"],
      transport: ["transport", "commute", "petrol", "fuel", "metro", "cab"],
      healthcare: ["healthcare", "medical", "health", "pharmacy"],
      insurance: ["insurance", "premium"],
      education: ["education", "school", "college", "tuition", "childcare"],
      emi: ["emi", "loan payment", "debt payment"],
      dining: [
        "dining",
        "eating out",
        "restaurant",
        "takeout",
        "zomato",
        "swiggy",
      ],
      entertainment: ["entertainment", "leisure", "games", "cinema", "movie"],
      personalcare: ["personal care", "salon", "beauty", "grooming"],
      clothing: ["clothing", "shopping", "apparel", "fashion"],
      subscriptions: [
        "subscription",
        "streaming",
        "netflix",
        "spotify",
        "amazon prime",
      ],
      travel: ["travel", "vacation", "holiday", "trip"],
      investments: ["savings", "investment", "sip", "mutual fund", "stocks"],
      emergency: ["emergency fund", "emergency"],
      retirement: ["retirement", "nps", "ppf", "pension"],
    };

    for (const exp of expenses) {
      const cat = categories.find((c) => c.id === exp.categoryId);
      const catName = cat?.name?.toLowerCase() ?? "";
      for (const [budgetKey, keywords] of Object.entries(KEY_MAP)) {
        if (keywords.some((k) => catName.includes(k))) {
          categoryAmounts[budgetKey] =
            (categoryAmounts[budgetKey] ?? 0) + exp.amount;
          break;
        }
      }
    }

    setAutofillData({ income, needs, wants, savings, categoryAmounts });
    // Data flows silently into form fields
  };

  const totalIncome = categories
    .filter((c) => c.categoryType === TransactionType.Income)
    .reduce((s, c) => s + c.monthlyLimit, 0);
  const totalExpense = categories
    .filter((c) => c.categoryType === TransactionType.Expense)
    .reduce((s, c) => s + c.monthlyLimit, 0);

  return (
    <div data-ocid="budgeting.page" className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}
        >
          <PiggyBank className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Budgeting</h1>
      </div>

      <Tabs defaultValue="expenses">
        <div className="overflow-x-auto pb-1 mb-1">
          <TabsList
            data-ocid="budgeting.tab"
            className="h-auto bg-slate-100 p-2 gap-2 flex rounded-xl"
          >
            <TabsTrigger
              value="categories"
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border-slate-200 hover:border-emerald-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:border-emerald-600 data-[state=active]:shadow-sm"
            >
              Plan Budget
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border-slate-200 hover:border-blue-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-sm"
            >
              Track Income Vs Expense
            </TabsTrigger>
            <TabsTrigger
              value="tracker"
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border-slate-200 hover:border-purple-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:border-purple-600 data-[state=active]:shadow-sm"
            >
              Budget Insights
            </TabsTrigger>
            <TabsTrigger
              value="improve"
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border-slate-200 hover:border-violet-400 data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:border-violet-600 data-[state=active]:shadow-sm"
            >
              Improve Budget
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="grid grid-cols-2 gap-4 flex-1 min-w-0">
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 px-4 py-3 shadow-sm">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Budgeted Income
                </div>
                <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                  {fmt(totalIncome)}
                </div>
              </div>
              <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500 px-4 py-3 shadow-sm">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Budgeted Expense
                </div>
                <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                  {fmt(totalExpense)}
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                data-ocid="budgeting.seed_button"
                variant="outline"
                onClick={seedStandardCategories}
                disabled={seeding}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                {seeding ? "Loading..." : "Load Standard Categories"}
              </Button>
              <Button
                data-ocid="budgeting.add_button"
                onClick={openAdd}
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </Button>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-48" />
          ) : categories.length === 0 ? (
            <div
              data-ocid="budgeting.empty_state"
              className="flex flex-col items-center justify-center py-16 text-slate-400"
            >
              <PiggyBank className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">No budget categories yet</p>
              <p className="text-xs mt-1">
                Click "Load Standard Categories" to get started quickly
              </p>
            </div>
          ) : (
            <div
              className="overflow-x-auto rounded-xl border border-slate-200"
              data-ocid="budgeting.table"
            >
              {/* Income group */}
              {(() => {
                const INCOME_ORDER = [
                  "Salary & Wages",
                  "Business Income",
                  "Freelance / Consulting",
                  "Investment Returns",
                  "Rental Income",
                  "Other Income",
                ];
                const EXPENSE_ORDER = [
                  "Housing & Rent",
                  "Groceries & Food",
                  "Utilities & Bills",
                  "Transportation",
                  "Debt Payments & EMI",
                  "Healthcare & Medical",
                  "Insurance",
                  "Education",
                  "Savings & Investments",
                  "Dining & Restaurants",
                  "Entertainment & Leisure",
                  "Personal Care & Wellness",
                  "Clothing & Apparel",
                  "Subscriptions & Software",
                  "Travel & Vacation",
                  "Gifts & Donations",
                  "Home Maintenance",
                  "Children & Family",
                  "Taxes & Levies",
                  "Miscellaneous",
                ];
                const sortFn =
                  (order: string[]) =>
                  (a: BudgetCategory, b: BudgetCategory) => {
                    const ai = order.indexOf(a.name);
                    const bi = order.indexOf(b.name);
                    if (ai === -1 && bi === -1)
                      return a.name.localeCompare(b.name);
                    if (ai === -1) return 1;
                    if (bi === -1) return -1;
                    return ai - bi;
                  };
                const incomes = categories
                  .filter((c) => c.categoryType === TransactionType.Income)
                  .sort(sortFn(INCOME_ORDER));
                const expenses = categories
                  .filter((c) => c.categoryType === TransactionType.Expense)
                  .sort(sortFn(EXPENSE_ORDER));
                let globalIdx = 0;
                const renderRows = (list: BudgetCategory[]) =>
                  list.map((c) => {
                    const i = globalIdx++;
                    return (
                      <tr
                        key={c.id}
                        data-ocid={`budgeting.item.${i + 1}`}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-4 py-2.5 font-medium text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.name}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-right text-sm">
                          {fmt(c.monthlyLimit)}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex justify-center">
                            <div
                              className="w-5 h-5 rounded-full border border-slate-200"
                              style={{ backgroundColor: c.color }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE_COLORS[inferBudgetType(c.name)] ?? TYPE_BADGE_COLORS.Needs}`}
                          >
                            {inferBudgetType(c.name)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              data-ocid={`budgeting.edit_button.${i + 1}`}
                              onClick={() => openEdit(c)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              data-ocid={`budgeting.delete_button.${i + 1}`}
                              onClick={() => del(c.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                return (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-700 text-white text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-right">Monthly Limit</th>
                        <th className="px-4 py-3 text-center">Color</th>
                        <th className="px-4 py-3 text-center">Type</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {incomes.length > 0 && (
                        <>
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-2 bg-emerald-50 border-b border-emerald-100"
                            >
                              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                Income ({incomes.length})
                              </span>
                            </td>
                          </tr>
                          {renderRows(
                            showAllPlanIncome ? incomes : incomes.slice(0, 1),
                          )}
                          {incomes.length > 1 && (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-4 py-1.5 text-center"
                              >
                                <button
                                  type="button"
                                  className="text-xs text-emerald-600 hover:text-emerald-800 font-medium underline underline-offset-2"
                                  onClick={() =>
                                    setShowAllPlanIncome((v) => !v)
                                  }
                                >
                                  {showAllPlanIncome
                                    ? "Show less"
                                    : `Show more entries (${incomes.length - 1} more)`}
                                </button>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                      {expenses.length > 0 && (
                        <>
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-2 bg-red-50 border-b border-red-100"
                            >
                              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                                Expenses ({expenses.length})
                              </span>
                            </td>
                          </tr>
                          {renderRows(expenses)}
                        </>
                      )}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <ExpensesTab />
        </TabsContent>

        <TabsContent value="tracker" className="mt-4">
          <MonthlyTrackerTab />
        </TabsContent>
        <TabsContent value="improve" className="mt-4">
          <div className="space-y-4">
            {/* Autofill bar */}
            <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
              <span className="text-xs font-semibold text-slate-600 mr-1">
                Select Month/Year:
              </span>
              <select
                className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                value={String(autofillMonth)}
                onChange={(e) => setAutofillMonth(Number(e.target.value))}
              >
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                value={String(autofillYear)}
                onChange={(e) => setAutofillYear(Number(e.target.value))}
              >
                {[
                  new Date().getFullYear(),
                  new Date().getFullYear() - 1,
                  new Date().getFullYear() - 2,
                ].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAutofill}
                className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Load Income and Expense
              </button>
              <button
                type="button"
                onClick={() => setAutofillData(null)}
                className="text-xs text-blue-500 hover:text-blue-700 underline ml-1"
              >
                Clear
              </button>
            </div>
            <ImproveBudgetContent autofillData={autofillData} />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="budgeting.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                data-ocid="budgeting.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={form.categoryType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, categoryType: v as TransactionType }))
                }
              >
                <SelectTrigger data-ocid="budgeting.type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TransactionType.Income}>Income</SelectItem>
                  <SelectItem value={TransactionType.Expense}>
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Monthly Limit</Label>
              <Input
                data-ocid="budgeting.limit.input"
                type="number"
                value={form.monthlyLimit}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    monthlyLimit: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                data-ocid="budgeting.color.input"
                type="color"
                value={form.color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
                className="h-10 p-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="budgeting.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="budgeting.submit_button"
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
