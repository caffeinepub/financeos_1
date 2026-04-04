import {
  Pencil,
  PiggyBank,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type BudgetCategory,
  type Transaction,
  TransactionType,
} from "../../backend.d";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useActor } from "../../hooks/useActor";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function shortNum(n: number, sym: string, code = "INR"): string {
  if (code !== "INR") {
    if (n >= 1_000_000_000) return `${sym}${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`;
    return `${sym}${Math.round(n)}`;
  }
  if (n >= 10_000_000) return `${sym}${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `${sym}${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`;
  return `${sym}${Math.round(n)}`;
}

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

const fmt = (n: number, cur?: { code: string }) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: (cur ?? { code: "INR" }).code,
    maximumFractionDigits: 0,
  }).format(n);

const emptyTx: Omit<Transaction, "id"> = {
  categoryId: "",
  transactionType: TransactionType.Expense,
  date: new Date().toISOString().slice(0, 10),
  description: "",
  account: "",
  amount: 0,
};

export function MonthlyTrackerTab() {
  const { country, formatCurrency } = useCurrency();
  const sym = country.symbol;
  const { actor } = useActor();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number | "all">(
    now.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number | "all">(
    now.getFullYear(),
  );
  const [showAllBudget, setShowAllBudget] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [form, setForm] = useState<Omit<Transaction, "id">>(emptyTx);
  const [saving, setSaving] = useState(false);

  // Per-month planned expense overrides (localStorage only, no backend)
  const LS_KEY = "budgeting_planned_overrides";
  const monthKey =
    selectedMonth !== "all" && selectedYear !== "all"
      ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`
      : "all";

  const getOverrides = (): Record<string, Record<string, number>> => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
    } catch {
      return {};
    }
  };
  const getPlannedAmount = (catId: string, defaultLimit: number): number => {
    try {
      const allOv: Record<string, Record<string, number>> = JSON.parse(
        localStorage.getItem(LS_KEY) ?? "{}",
      );
      const ov = allOv[monthKey] ?? {};
      return catId in ov ? ov[catId] : defaultLimit;
    } catch {
      return defaultLimit;
    }
  };
  const saveMonthOverrides = (overrides: Record<string, number>) => {
    const all = getOverrides();
    all[monthKey] = overrides;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  const [editPlannedOpen, setEditPlannedOpen] = useState(false);
  const [plannedDraft, setPlannedDraft] = useState<Record<string, number>>({});

  const openEditPlanned = () => {
    const drafts: Record<string, number> = {};
    for (const cat of expenseCategories) {
      drafts[cat.id] = getPlannedAmount(cat.id, cat.monthlyLimit);
    }
    setPlannedDraft(drafts);
    setEditPlannedOpen(true);
  };
  const savePlanned = () => {
    saveMonthOverrides(plannedDraft);
    setEditPlannedOpen(false);
  };
  const resetMonth = () => {
    const all = getOverrides();
    delete all[monthKey];
    localStorage.setItem(LS_KEY, JSON.stringify(all));
    setEditPlannedOpen(false);
  };

  // Recompute when month/year changes (trigger re-render by accessing monthKey in render)
  const [, forceUpdate] = useState(0);
  const refreshPlanned = () => forceUpdate((n) => n + 1);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    Promise.all([actor.getAllTransactions(), actor.getAllBudgetCategories()])
      .then(([txns, cats]) => {
        setTransactions(txns);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const monthTxns = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      const matchMonth =
        selectedMonth === "all" || d.getMonth() + 1 === selectedMonth;
      const matchYear =
        selectedYear === "all" || d.getFullYear() === selectedYear;
      return matchMonth && matchYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totalIncome = useMemo(
    () =>
      monthTxns
        .filter((t) => t.transactionType === TransactionType.Income)
        .reduce((s, t) => s + t.amount, 0),
    [monthTxns],
  );
  const totalActual = useMemo(
    () =>
      monthTxns
        .filter((t) => t.transactionType === TransactionType.Expense)
        .reduce((s, t) => s + t.amount, 0),
    [monthTxns],
  );
  // totalPlanned uses per-month overrides when available
  const totalPlanned = useMemo(() => {
    const allOv = (() => {
      try {
        return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
      } catch {
        return {};
      }
    })() as Record<string, Record<string, number>>;
    const mk =
      selectedMonth !== "all" && selectedYear !== "all"
        ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`
        : "all";
    const ov = allOv[mk] ?? {};
    return categories
      .filter((c) => c.categoryType === TransactionType.Expense)
      .reduce((s, c) => s + (c.id in ov ? ov[c.id] : c.monthlyLimit), 0);
  }, [categories, selectedMonth, selectedYear]);

  const budgetedIncome = useMemo(
    () =>
      categories
        .filter((c) => c.categoryType === TransactionType.Income)
        .reduce((s, c) => s + c.monthlyLimit, 0),
    [categories],
  );
  const budgetedExpenses = totalPlanned;
  const _incomePct =
    budgetedIncome > 0
      ? Math.min(200, (totalIncome / budgetedIncome) * 100)
      : 0;
  const _expensePct =
    budgetedExpenses > 0
      ? Math.min(200, (totalActual / budgetedExpenses) * 100)
      : 0;

  // All-months aggregated values for top metric cards (not filtered by month/year)
  const allMonthsIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.transactionType === TransactionType.Income)
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const allMonthsExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.transactionType === TransactionType.Expense)
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const _allMonthsIncomePct =
    budgetedIncome > 0
      ? Math.min(200, (allMonthsIncome / budgetedIncome) * 100)
      : 0;
  const _allMonthsExpensePct =
    budgetedExpenses > 0
      ? Math.min(200, (allMonthsExpense / budgetedExpenses) * 100)
      : 0;

  const chartData = [
    {
      name: "This Month",
      Income: totalIncome,
      "Planned Expenses": totalPlanned,
      "Actual Expenses": totalActual,
    },
  ];

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.categoryType === TransactionType.Expense),
    [categories],
  );
  // Pre-computed values for Budget Insights charts
  const analyticsFiltered = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      const matchMonth =
        selectedMonth === "all" || d.getMonth() + 1 === selectedMonth;
      const matchYear =
        selectedYear === "all" || d.getFullYear() === selectedYear;
      return matchMonth && matchYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const analyticsIncome = useMemo(
    () =>
      analyticsFiltered
        .filter((t) => t.transactionType === TransactionType.Income)
        .reduce((s, t) => s + t.amount, 0),
    [analyticsFiltered],
  );

  const analyticsExpenses = useMemo(
    () =>
      analyticsFiltered
        .filter((t) => t.transactionType === TransactionType.Expense)
        .reduce((s, t) => s + t.amount, 0),
    [analyticsFiltered],
  );

  const analyticsSavings = useMemo(
    () => Math.max(0, analyticsIncome - analyticsExpenses),
    [analyticsIncome, analyticsExpenses],
  );
  const analyticsSavingsRate = useMemo(
    () =>
      analyticsIncome > 0 ? (analyticsSavings / analyticsIncome) * 100 : 0,
    [analyticsSavings, analyticsIncome],
  );
  const analyticsNeeds50 = useMemo(
    () => analyticsIncome * 0.5,
    [analyticsIncome],
  );
  const analyticsWants30 = useMemo(
    () => analyticsIncome * 0.3,
    [analyticsIncome],
  );
  const analyticsSavings20 = useMemo(
    () => analyticsIncome * 0.2,
    [analyticsIncome],
  );

  const analyticsCatMap = useMemo(() => {
    const catMap: Record<string, number> = {};
    for (const t of analyticsFiltered.filter(
      (tx) => tx.transactionType === TransactionType.Expense,
    )) {
      const cat = expenseCategories.find((c) => c.id === t.categoryId);
      const name = cat?.name ?? "Uncategorized";
      catMap[name] = (catMap[name] ?? 0) + t.amount;
    }
    return catMap;
  }, [analyticsFiltered, expenseCategories]);

  const analyticsTop5 = useMemo(
    () =>
      Object.entries(analyticsCatMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    [analyticsCatMap],
  );

  const _openAdd = () => {
    setEditingTx(null);
    setForm({
      ...emptyTx,
      date: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`,
    });
    setDialogOpen(true);
  };
  const _openEdit = (tx: Transaction) => {
    setEditingTx(tx);
    setForm({
      categoryId: tx.categoryId,
      transactionType: tx.transactionType,
      date: tx.date,
      description: tx.description,
      account: tx.account,
      amount: tx.amount,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editingTx) {
        const updated = { ...editingTx, ...form };
        await actor.updateTransaction(editingTx.id, updated);
        setTransactions((prev) =>
          prev.map((t) => (t.id === editingTx.id ? updated : t)),
        );
      } else {
        const newTx = { id: crypto.randomUUID(), ...form };
        await actor.createTransaction(newTx);
        setTransactions((prev) => [...prev, newTx]);
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const _del = async (id: string) => {
    if (!actor) return;
    await actor.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const yearRange = Array.from(
    { length: 5 },
    (_, i) => now.getFullYear() - 2 + i,
  );

  const filteredCategories = categories.filter(
    (c) => c.categoryType === form.transactionType,
  );

  const PRIORITY_CATS = [
    "Housing & Rent",
    "Groceries & Food",
    "Utilities & Bills",
    "Transportation",
    "Healthcare & Medical",
    "Education",
    "Insurance",
    "Entertainment & Leisure",
    "Clothing & Apparel",
    "Savings & Investments",
    "Travel & Vacation",
  ];
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const ai = PRIORITY_CATS.indexOf(a.name);
    const bi = PRIORITY_CATS.indexOf(b.name);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-4">
      {/* Month/Year Selector */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Month:</Label>
          <Select
            value={selectedMonth === "all" ? "all" : String(selectedMonth)}
            onValueChange={(v) =>
              setSelectedMonth(v === "all" ? "all" : Number(v))
            }
          >
            <SelectTrigger className="w-36" data-ocid="budgeting.month.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Year:</Label>
          <Select
            value={selectedYear === "all" ? "all" : String(selectedYear)}
            onValueChange={(v) =>
              setSelectedYear(v === "all" ? "all" : Number(v))
            }
          >
            <SelectTrigger className="w-28" data-ocid="budgeting.year.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {yearRange.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Budget Insights Top Panel — Donut Charts + Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Two donut charts */}
        <Card className="border border-slate-100 shadow-sm bg-white">
          <CardContent className="pt-4 pb-3 px-3">
            <div className="grid grid-cols-2 gap-2">
              {/* Income Budget Donut */}
              <div className="flex flex-col items-center">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  % of Income Budget
                </p>
                <div className="relative w-[130px] h-[130px]">
                  <PieChart width={130} height={130}>
                    <Pie
                      data={[
                        { value: _incomePct, fill: "#10b981" },
                        {
                          value: Math.max(0, 100 - _incomePct),
                          fill: "#f1f5f9",
                        },
                      ]}
                      cx={60}
                      cy={60}
                      innerRadius={45}
                      outerRadius={60}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {[0, 1].map((i) => (
                        <Cell key={i} fill={i === 0 ? "#10b981" : "#f1f5f9"} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-emerald-600">
                      {_incomePct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Budget: {fmt(budgetedIncome, country)}
                </p>
                <p className="text-xs text-slate-500">
                  Balance:{" "}
                  {fmt(Math.max(0, budgetedIncome - totalIncome), country)}
                </p>
              </div>
              {/* Expenses Budget Donut */}
              <div className="flex flex-col items-center">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  % of Expenses Budget
                </p>
                <div className="relative w-[130px] h-[130px]">
                  <PieChart width={130} height={130}>
                    <Pie
                      data={[
                        {
                          value: _expensePct,
                          fill: _expensePct > 90 ? "#ef4444" : "#f97316",
                        },
                        {
                          value: Math.max(0, 100 - _expensePct),
                          fill: "#f1f5f9",
                        },
                      ]}
                      cx={60}
                      cy={60}
                      innerRadius={45}
                      outerRadius={60}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {[0, 1].map((i) => (
                        <Cell
                          key={i}
                          fill={
                            i === 0
                              ? _expensePct > 90
                                ? "#ef4444"
                                : "#f97316"
                              : "#f1f5f9"
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-lg font-bold ${_expensePct > 90 ? "text-red-500" : "text-orange-500"}`}
                    >
                      {_expensePct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Budget: {fmt(budgetedExpenses, country)}
                </p>
                <p className="text-xs text-slate-500">
                  Balance:{" "}
                  {fmt(Math.max(0, budgetedExpenses - totalActual), country)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Actual Income */}
          <div
            data-ocid="budgeting.income.card"
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Actual Income
              </span>
            </div>
            <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {fmt(totalIncome, country)}
            </div>
          </div>
          {/* Actual Expenses */}
          <div
            data-ocid="budgeting.actual.card"
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500 px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Actual Expenses
              </span>
            </div>
            <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {fmt(totalActual, country)}
            </div>
          </div>
          {/* Total Savings */}
          <div
            data-ocid="budgeting.savings.card"
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-500 px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <PiggyBank className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Total Savings
              </span>
            </div>
            <div
              className={`text-base font-bold tabular-nums ${(totalIncome - totalActual) >= 0 ? "text-blue-700" : "text-red-600"}`}
            >
              {fmt(totalIncome - totalActual, country)}
            </div>
          </div>
          {/* Savings Rate */}
          <div
            data-ocid="budgeting.savings_rate.card"
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-violet-500 px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Savings Rate
              </span>
            </div>
            <div
              className={`text-base font-bold tabular-nums ${totalIncome > 0 ? (((totalIncome - totalActual) / totalIncome) * 100 >= 20 ? "text-violet-700" : "text-amber-600") : "text-slate-500"}`}
            >
              {totalIncome > 0
                ? (((totalIncome - totalActual) / totalIncome) * 100).toFixed(1)
                : "0.0"}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader className="py-0 px-4 pt-2 pb-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-sm">Budget vs Spending</CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-7 text-xs"
              onClick={openEditPlanned}
              data-ocid="budgeting.edit_planned.button"
            >
              <Pencil className="w-3 h-3" />
              Edit Planned
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div
            className="overflow-x-auto"
            data-ocid="budgeting.breakdown.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Planned Budget</TableHead>
                  <TableHead className="text-right">Actual Spent</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No expense categories found. Add categories in the Budget
                      Categories tab.
                    </TableCell>
                  </TableRow>
                ) : (
                  (() => {
                    const rows = [...expenseCategories]
                      .map((cat) => {
                        const actual = monthTxns
                          .filter(
                            (t) =>
                              t.categoryId === cat.id &&
                              t.transactionType === TransactionType.Expense,
                          )
                          .reduce((s, t) => s + t.amount, 0);
                        return { cat, actual };
                      })
                      .sort((a, b) => b.actual - a.actual);
                    const visibleRows = showAllBudget ? rows : rows.slice(0, 5);
                    const remaining = rows.length - 5;
                    return (
                      <>
                        {visibleRows.map(({ cat, actual }) => {
                          const planned = getPlannedAmount(
                            cat.id,
                            cat.monthlyLimit,
                          );
                          const variance = planned - actual;
                          return (
                            <TableRow key={cat.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: cat.color }}
                                  />
                                  <span className="text-sm">{cat.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {planned > 0 ? (
                                  fmt(planned, country)
                                ) : (
                                  <span className="text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {actual > 0 ? (
                                  fmt(actual, country)
                                ) : (
                                  <span className="text-muted-foreground">
                                    {sym}0
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {planned > 0 ? (
                                  <span
                                    className={
                                      variance >= 0
                                        ? "text-green-600 font-medium"
                                        : "text-red-600 font-medium"
                                    }
                                  >
                                    {variance >= 0 ? "+" : ""}
                                    {fmt(variance, country)}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE_COLORS[inferBudgetType(cat.name)] ?? TYPE_BADGE_COLORS.Needs}`}
                                >
                                  {inferBudgetType(cat.name)}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {rows.length > 5 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-2">
                              <button
                                type="button"
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline-offset-2 hover:underline"
                                onClick={() => setShowAllBudget((v) => !v)}
                                data-ocid="budgeting.showmore.button"
                              >
                                {showAllBudget
                                  ? "Show less"
                                  : `Show ${remaining} more entries`}
                              </button>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })()
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Transaction Dialog */}
      {/* Edit Planned Expenses Dialog */}
      <Dialog open={editPlannedOpen} onOpenChange={setEditPlannedOpen}>
        <DialogContent data-ocid="budgeting.edit_planned.dialog">
          <DialogHeader>
            <DialogTitle>
              Edit Planned Expenses —{" "}
              {selectedMonth === "all"
                ? "All Months"
                : MONTHS[(selectedMonth as number) - 1]}{" "}
              {selectedYear === "all" ? "All Years" : selectedYear}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {expenseCategories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <Label className="flex-1 text-sm">{cat.name}</Label>
                <Input
                  type="number"
                  className="w-32 h-8 text-sm"
                  value={plannedDraft[cat.id] ?? 0}
                  onChange={(e) =>
                    setPlannedDraft((d) => ({
                      ...d,
                      [cat.id]: Number(e.target.value),
                    }))
                  }
                  data-ocid="budgeting.planned_amount.input"
                />
              </div>
            ))}
          </div>
          <DialogFooter className="flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                resetMonth();
                refreshPlanned();
              }}
              data-ocid="budgeting.reset_planned.button"
            >
              Reset Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditPlannedOpen(false)}
              data-ocid="budgeting.cancel_planned.button"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                savePlanned();
                refreshPlanned();
              }}
              data-ocid="budgeting.save_planned.button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="budgeting.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingTx ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Type</Label>
              <Select
                value={form.transactionType}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    transactionType: v as TransactionType,
                    categoryId: "",
                  }))
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
              <Label>Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
              >
                <SelectTrigger data-ocid="budgeting.category.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {sortedCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount ({sym})</Label>
              <Input
                data-ocid="budgeting.amount.input"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                data-ocid="budgeting.date.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                data-ocid="budgeting.description.input"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="budgeting.cancel_button"
              onClick={() => setDialogOpen(false)}
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
      {/* ── Budget Analytics Section ── */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          Budget Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Monthly Overview — Income vs Expenses */}
          {/* 4. Monthly Overview — Income vs Expenses (Horizontal) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Monthly Overview — Income vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent data-ocid="budgeting.overview.chart">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={60}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`}
                    width={50}
                  />
                  <Tooltip formatter={(v: number) => fmt(v, country)} />
                  <Legend iconType="circle" iconSize={10} />
                  <Bar dataKey="Income" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar
                    dataKey="Planned Expenses"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="Actual Expenses"
                    fill="#ef4444"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {analyticsIncome > 0 && (
            <>
              {/* 2. 50/30/20 Budget Rule Analysis */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    📐 50/30/20 Budget Rule Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">
                        🏠 Needs (50%)
                      </span>
                      <Badge
                        className={`text-[9px] ${analyticsExpenses > analyticsNeeds50 ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}
                      >
                        {analyticsExpenses > analyticsNeeds50
                          ? "Over budget"
                          : "On track"}
                      </Badge>
                    </div>
                    <div className="mt-1">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(analyticsIncome > 0 ? (Math.min(analyticsExpenses, analyticsNeeds50) / analyticsNeeds50) * 100 : 0, 100)}%`,
                            background:
                              analyticsExpenses > analyticsNeeds50
                                ? "#ef4444"
                                : "#6366f1",
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>
                          Actual:{" "}
                          {formatCurrency(
                            Math.min(analyticsExpenses, analyticsNeeds50),
                          )}
                        </span>
                        <span>Target: {formatCurrency(analyticsNeeds50)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">
                        🎭 Wants (30%)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Target: {formatCurrency(analyticsWants30)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(analyticsIncome > 0 ? (Math.max(0, analyticsExpenses - analyticsNeeds50) / analyticsWants30) * 100 : 0, 100)}%`,
                            background: "#f59e0b",
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>
                          Actual:{" "}
                          {formatCurrency(
                            Math.max(0, analyticsExpenses - analyticsNeeds50),
                          )}
                        </span>
                        <span>Target: {formatCurrency(analyticsWants30)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">
                        💰 Savings (20%)
                      </span>
                      <Badge
                        className={`text-[9px] ${analyticsSavings >= analyticsSavings20 ? "bg-green-50 text-green-600 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}
                      >
                        {analyticsSavings >= analyticsSavings20
                          ? "✓ Achieved"
                          : "Below target"}
                      </Badge>
                    </div>
                    <div className="mt-1">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(analyticsSavings20 > 0 ? (analyticsSavings / analyticsSavings20) * 100 : 0, 100)}%`,
                            background: "#10b981",
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                        <span>Actual: {formatCurrency(analyticsSavings)}</span>
                        <span>
                          Target: {formatCurrency(analyticsSavings20)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                    Savings Rate:{" "}
                    <strong
                      className={
                        analyticsSavingsRate >= 20
                          ? "text-green-700"
                          : analyticsSavingsRate >= 10
                            ? "text-amber-700"
                            : "text-red-700"
                      }
                    >
                      {analyticsSavingsRate.toFixed(1)}%
                    </strong>{" "}
                    (target: 20%)
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          {/* 3. Month-over-Month Trend */}
          {/* 2. Month-over-Month Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Month-over-Month Trend</CardTitle>
            </CardHeader>
            <CardContent data-ocid="budgeting.mom_trend.chart">
              {(() => {
                const now = new Date();
                const data = Array.from({ length: 6 }, (_, i) => {
                  const d = new Date(
                    now.getFullYear(),
                    now.getMonth() - 5 + i,
                    1,
                  );
                  const yr = d.getFullYear();
                  const mo = d.getMonth();
                  const label = d.toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                  });
                  const income = transactions
                    .filter((t) => {
                      const td = new Date(t.date);
                      return (
                        td.getFullYear() === yr &&
                        td.getMonth() === mo &&
                        t.transactionType === TransactionType.Income
                      );
                    })
                    .reduce((s, t) => s + t.amount, 0);
                  const expense = transactions
                    .filter((t) => {
                      const td = new Date(t.date);
                      return (
                        td.getFullYear() === yr &&
                        td.getMonth() === mo &&
                        t.transactionType === TransactionType.Expense
                      );
                    })
                    .reduce((s, t) => s + t.amount, 0);
                  return { month: label, Income: income, Expenses: expense };
                });
                return (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={data}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.15}
                        vertical={false}
                      />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`}
                        width={50}
                      />
                      <Tooltip
                        formatter={(v: number, n: string) => [
                          formatCurrency(v),
                          n,
                        ]}
                        contentStyle={{
                          fontSize: "11px",
                          borderRadius: "10px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar
                        dataKey="Income"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="Expenses"
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </CardContent>
          </Card>

          {analyticsIncome > 0 && (
            <>
              {/* Monthly Budget Snapshot */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">
                    📋 Monthly Budget Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-700">
                          <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-white uppercase">
                            Category
                          </th>
                          <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-white uppercase">
                            Amount
                          </th>
                          <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-white uppercase">
                            % of Income
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-emerald-50/60">
                          <td className="px-4 py-2.5 text-xs font-bold text-emerald-700">
                            ✅ Total Income
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right font-bold text-emerald-700 tabular-nums">
                            {formatCurrency(analyticsIncome)}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right font-bold text-emerald-700">
                            100%
                          </td>
                        </tr>
                        <tr className="bg-slate-50/60">
                          <td className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                            Fixed Costs (Needs)
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right tabular-nums text-slate-700">
                            {formatCurrency(analyticsNeeds50)}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right text-slate-500">
                            50%
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                            Variable Costs (Wants)
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right tabular-nums text-slate-700">
                            {formatCurrency(analyticsWants30)}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right text-slate-500">
                            30%
                          </td>
                        </tr>
                        <tr className="bg-blue-50/60">
                          <td className="px-4 py-2.5 text-xs font-bold text-blue-700">
                            💰 Savings Target
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right font-bold text-blue-700 tabular-nums">
                            {formatCurrency(analyticsSavings20)}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-right font-bold text-blue-700">
                            20%
                          </td>
                        </tr>
                        <tr
                          className={
                            analyticsSavings >= analyticsSavings20
                              ? "bg-green-50/80"
                              : "bg-amber-50/80"
                          }
                        >
                          <td className="px-4 py-2.5 text-xs font-bold text-slate-700">
                            Actual Savings
                          </td>
                          <td
                            className={`px-4 py-2.5 text-xs text-right font-bold tabular-nums ${analyticsSavings >= analyticsSavings20 ? "text-green-700" : "text-amber-700"}`}
                          >
                            {formatCurrency(analyticsSavings)}
                          </td>
                          <td
                            className={`px-4 py-2.5 text-xs text-right font-bold ${analyticsSavings >= analyticsSavings20 ? "text-green-700" : "text-amber-700"}`}
                          >
                            {analyticsSavingsRate.toFixed(1)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          {/* 5. Spending by Category */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Spending by Category
              </CardTitle>
              <p className="text-xs text-slate-400">
                Top 8 categories by expense
              </p>
            </CardHeader>
            <CardContent
              data-ocid="budgeting.spending_category.chart"
              className="px-4 pb-4"
            >
              {(() => {
                const SC_COLORS = [
                  "#2563eb",
                  "#0891b2",
                  "#059669",
                  "#7c3aed",
                  "#d97706",
                  "#dc2626",
                  "#0d9488",
                  "#9333ea",
                ];
                const catMap: Record<
                  string,
                  { name: string; value: number; color: string }
                > = {};
                for (const t of transactions.filter(
                  (tx) => tx.transactionType === TransactionType.Expense,
                )) {
                  const cat = categories.find((c) => c.id === t.categoryId);
                  if (cat) {
                    if (!catMap[cat.id]) {
                      catMap[cat.id] = {
                        name: cat.name,
                        value: 0,
                        color:
                          cat.color ||
                          SC_COLORS[
                            Object.keys(catMap).length % SC_COLORS.length
                          ],
                      };
                    }
                    catMap[cat.id].value += t.amount;
                  }
                }
                const catData = Object.values(catMap)
                  .filter((d) => d.value > 0)
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 8)
                  .map((d, i) => ({
                    ...d,
                    color: SC_COLORS[i % SC_COLORS.length],
                  }));
                const total = catData.reduce((s, d) => s + d.value, 0);
                if (catData.length === 0)
                  return (
                    <div className="h-44 flex items-center justify-center text-sm text-slate-400">
                      No expense data yet
                    </div>
                  );
                return (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0"
                      style={{ width: 180, height: 220 }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={catData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            dataKey="value"
                            labelLine={false}
                          >
                            {catData.map((entry) => (
                              <Cell
                                key={entry.name}
                                fill={entry.color}
                                stroke="#fff"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(v: number) => [formatCurrency(v), ""]}
                            contentStyle={{
                              fontSize: "11px",
                              borderRadius: "10px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      {catData.map((entry) => {
                        const pct =
                          total > 0
                            ? ((entry.value / total) * 100).toFixed(1)
                            : "0";
                        return (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between gap-1"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ background: entry.color }}
                              />
                              <span className="text-[11px] text-slate-600 truncate">
                                {entry.name}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700 flex-shrink-0">
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {analyticsIncome > 0 && (
            <>
              {/* Top Spending Categories */}
              {analyticsTop5.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-700">
                      🔍 Top Spending Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-3">
                    {analyticsTop5.map(([name, amount], i) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-700 truncate">
                              {name}
                            </span>
                            <span className="text-xs font-bold text-slate-800 tabular-nums ml-2">
                              {formatCurrency(amount)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width:
                                  analyticsIncome > 0
                                    ? `${Math.min((amount / analyticsIncome) * 100, 100)}%`
                                    : "0%",
                                background:
                                  i === 0
                                    ? "#ef4444"
                                    : i === 1
                                      ? "#f97316"
                                      : "#f59e0b",
                              }}
                            />
                          </div>
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            {analyticsIncome > 0
                              ? ((amount / analyticsIncome) * 100).toFixed(1)
                              : "0"}
                            % of income
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
          {/* 7. Savings Rate Trend */}
          {/* 3. Savings Rate Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Savings Rate Trend (%)</CardTitle>
            </CardHeader>
            <CardContent data-ocid="budgeting.savings_rate.chart">
              {(() => {
                const now = new Date();
                const data = Array.from({ length: 6 }, (_, i) => {
                  const d = new Date(
                    now.getFullYear(),
                    now.getMonth() - 5 + i,
                    1,
                  );
                  const yr = d.getFullYear();
                  const mo = d.getMonth();
                  const label = d.toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                  });
                  const income = transactions
                    .filter((t) => {
                      const td = new Date(t.date);
                      return (
                        td.getFullYear() === yr &&
                        td.getMonth() === mo &&
                        t.transactionType === TransactionType.Income
                      );
                    })
                    .reduce((s, t) => s + t.amount, 0);
                  const expense = transactions
                    .filter((t) => {
                      const td = new Date(t.date);
                      return (
                        td.getFullYear() === yr &&
                        td.getMonth() === mo &&
                        t.transactionType === TransactionType.Expense
                      );
                    })
                    .reduce((s, t) => s + t.amount, 0);
                  const rate =
                    income > 0
                      ? Math.round(((income - expense) / income) * 100)
                      : 0;
                  return { month: label, "Savings Rate": rate };
                });
                return (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart
                      data={data}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.15}
                        vertical={false}
                      />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `${v}%`}
                        width={40}
                        domain={["auto", "auto"]}
                      />
                      <Tooltip
                        formatter={(v: number) => [`${v}%`, "Savings Rate"]}
                        contentStyle={{
                          fontSize: "11px",
                          borderRadius: "10px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Savings Rate"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={{ fill: "#6366f1", r: 4 }}
                        activeDot={{ r: 6 }}
                      >
                        <LabelList
                          dataKey="Savings Rate"
                          position="top"
                          style={{ fontSize: "9px", fill: "#6366f1" }}
                          formatter={(v: number) => `${v}%`}
                        />
                      </Line>
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </CardContent>
          </Card>

          {/* Budgeting (6 Months) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budgeting (6 Months)</CardTitle>
              <p className="text-xs text-slate-400">
                Planned budget vs actual expenses
              </p>
            </CardHeader>
            <CardContent>
              {(() => {
                const now = new Date();
                const totalPlanned = categories
                  .filter((c) => c.categoryType === TransactionType.Expense)
                  .reduce((s, c) => s + c.monthlyLimit, 0);
                const data = Array.from({ length: 6 }, (_, i) => {
                  const d = new Date(
                    now.getFullYear(),
                    now.getMonth() - 5 + i,
                    1,
                  );
                  const yr = d.getFullYear();
                  const mo = d.getMonth();
                  const label = d.toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                  });
                  const actual = transactions
                    .filter((t) => {
                      const td = new Date(t.date);
                      return (
                        td.getFullYear() === yr &&
                        td.getMonth() === mo &&
                        t.transactionType === TransactionType.Expense
                      );
                    })
                    .reduce((s, t) => s + t.amount, 0);
                  return {
                    month: label,
                    Planned: totalPlanned,
                    Actual: actual,
                  };
                });
                return (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={data}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.15}
                        vertical={false}
                      />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => formatCurrency(v)}
                        width={52}
                      />
                      <Tooltip
                        formatter={(v: number, name: string) => [
                          formatCurrency(v),
                          name,
                        ]}
                        contentStyle={{
                          fontSize: "11px",
                          borderRadius: "10px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar
                        dataKey="Planned"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList
                          dataKey="Planned"
                          position="top"
                          style={{ fontSize: "9px", fill: "#10b981" }}
                          formatter={(v: number) =>
                            shortNum(v, sym, country.code)
                          }
                        />
                      </Bar>
                      <Bar
                        dataKey="Actual"
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList
                          dataKey="Actual"
                          position="top"
                          style={{ fontSize: "9px", fill: "#f43f5e" }}
                          formatter={(v: number) =>
                            shortNum(v, sym, country.code)
                          }
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
