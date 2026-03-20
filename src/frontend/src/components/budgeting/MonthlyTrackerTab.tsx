import {
  Pencil,
  PiggyBank,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
  const { country } = useCurrency();
  const sym = country.symbol;
  const { actor } = useActor();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [form, setForm] = useState<Omit<Transaction, "id">>(emptyTx);
  const [saving, setSaving] = useState(false);

  // Per-month planned expense overrides (localStorage only, no backend)
  const LS_KEY = "budgeting_planned_overrides";
  const monthKey = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;

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
      return (
        d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth
      );
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
    const mk = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
    const ov = allOv[mk] ?? {};
    return categories
      .filter((c) => c.categoryType === TransactionType.Expense)
      .reduce((s, c) => s + (c.id in ov ? ov[c.id] : c.monthlyLimit), 0);
  }, [categories, selectedMonth, selectedYear]);
  const netSavings = totalIncome - totalActual;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const budgetedIncome = useMemo(
    () =>
      categories
        .filter((c) => c.categoryType === TransactionType.Income)
        .reduce((s, c) => s + c.monthlyLimit, 0),
    [categories],
  );
  const budgetedExpenses = totalPlanned;
  const incomePct =
    budgetedIncome > 0
      ? Math.min(200, (totalIncome / budgetedIncome) * 100)
      : 0;
  const expensePct =
    budgetedExpenses > 0
      ? Math.min(200, (totalActual / budgetedExpenses) * 100)
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

  const openAdd = () => {
    setEditingTx(null);
    setForm({
      ...emptyTx,
      date: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`,
    });
    setDialogOpen(true);
  };
  const openEdit = (tx: Transaction) => {
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
        await actor.updateTransaction(editingTx.id, { ...editingTx, ...form });
      } else {
        await actor.createTransaction({ id: crypto.randomUUID(), ...form });
      }
      setDialogOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deleteTransaction(id);
    load();
  };

  const yearRange = Array.from(
    { length: 5 },
    (_, i) => now.getFullYear() - 2 + i,
  );

  const filteredCategories = categories.filter(
    (c) => c.categoryType === form.transactionType,
  );

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-4">
      {/* Month/Year Selector */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Month:</Label>
          <Select
            value={String(selectedMonth)}
            onValueChange={(v) => setSelectedMonth(Number(v))}
          >
            <SelectTrigger className="w-36" data-ocid="budgeting.month.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-28" data-ocid="budgeting.year.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
                        { value: incomePct, fill: "#10b981" },
                        {
                          value: Math.max(0, 100 - incomePct),
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
                      {incomePct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Budget: {fmt(budgetedIncome, country)}
                </p>
                <p className="text-[10px] text-slate-500">
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
                          value: expensePct,
                          fill: expensePct > 90 ? "#ef4444" : "#f97316",
                        },
                        {
                          value: Math.max(0, 100 - expensePct),
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
                              ? expensePct > 90
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
                      className={`text-lg font-bold ${expensePct > 90 ? "text-red-500" : "text-orange-500"}`}
                    >
                      {expensePct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Budget: {fmt(budgetedExpenses, country)}
                </p>
                <p className="text-[10px] text-slate-500">
                  Balance:{" "}
                  {fmt(Math.max(0, budgetedExpenses - totalActual), country)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            data-ocid="budgeting.income.card"
            className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50"
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide">
                  Actual Income
                </span>
              </div>
              <p className="text-base font-bold text-emerald-700">
                {fmt(totalIncome, country)}
              </p>
            </CardContent>
          </Card>
          <Card
            data-ocid="budgeting.actual.card"
            className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50"
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] text-red-600 font-medium uppercase tracking-wide">
                  Actual Expenses
                </span>
              </div>
              <p className="text-base font-bold text-red-600">
                {fmt(totalActual, country)}
              </p>
            </CardContent>
          </Card>
          <Card
            data-ocid="budgeting.savings.card"
            className={
              netSavings >= 0
                ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                : "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
            }
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <PiggyBank
                  className={`w-3.5 h-3.5 ${netSavings >= 0 ? "text-blue-500" : "text-orange-500"}`}
                />
                <span
                  className={`text-[10px] font-medium uppercase tracking-wide ${netSavings >= 0 ? "text-blue-600" : "text-orange-600"}`}
                >
                  Net Savings
                </span>
              </div>
              <p
                className={`text-base font-bold ${netSavings >= 0 ? "text-blue-700" : "text-orange-600"}`}
              >
                {fmt(netSavings, country)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[10px] text-purple-600 font-medium uppercase tracking-wide">
                  Savings Rate
                </span>
              </div>
              <p
                className={`text-base font-bold ${savingsRate >= 20 ? "text-purple-700" : "text-orange-600"}`}
              >
                {savingsRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-sm">
              Category Breakdown — Expense Categories
            </CardTitle>
            <div className="flex gap-2">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No expense categories found. Add categories in the Budget
                      Categories tab.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenseCategories.map((cat) => {
                    const actual = monthTxns
                      .filter(
                        (t) =>
                          t.categoryId === cat.id &&
                          t.transactionType === TransactionType.Expense,
                      )
                      .reduce((s, t) => s + t.amount, 0);
                    const planned = getPlannedAmount(cat.id, cat.monthlyLimit);
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
                            <span className="text-muted-foreground">—</span>
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
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">
              Transactions — {MONTHS[selectedMonth - 1]} {selectedYear}
            </CardTitle>
            <Button
              size="sm"
              onClick={openAdd}
              className="gap-1"
              data-ocid="budgeting.add_transaction.button"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {monthTxns.length === 0 ? (
            <div
              data-ocid="budgeting.empty_state"
              className="text-center text-muted-foreground py-10"
            >
              <p className="text-sm">No transactions for this month.</p>
              <p className="text-xs mt-1">
                Click "Add" to record your first transaction.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const incomeRows = monthTxns.filter(
                      (t) => t.transactionType === TransactionType.Income,
                    );
                    const expenseRows = monthTxns.filter(
                      (t) => t.transactionType === TransactionType.Expense,
                    );
                    const renderTx = (tx: Transaction, i: number) => {
                      const cat = categories.find(
                        (c) => c.id === tx.categoryId,
                      );
                      return (
                        <TableRow
                          key={tx.id}
                          data-ocid={`budgeting.item.${i + 1}`}
                        >
                          <TableCell className="text-sm">{tx.date}</TableCell>
                          <TableCell className="text-sm">
                            {tx.description || "—"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {cat ? (
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.name}
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                tx.transactionType === TransactionType.Income
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-red-100 text-red-700 hover:bg-red-100"
                              }
                            >
                              {tx.transactionType}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold text-sm ${tx.transactionType === TransactionType.Income ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {tx.transactionType === TransactionType.Income
                              ? "+"
                              : "-"}
                            {fmt(tx.amount, country)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                data-ocid={`budgeting.edit_button.${i + 1}`}
                                onClick={() => openEdit(tx)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500"
                                data-ocid={`budgeting.delete_button.${i + 1}`}
                                onClick={() => del(tx.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    };
                    return (
                      <>
                        {incomeRows.length > 0 && (
                          <>
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="py-1.5 px-4 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide border-b border-green-100"
                              >
                                Income
                              </TableCell>
                            </TableRow>
                            {incomeRows.map((tx, i) => renderTx(tx, i))}
                          </>
                        )}
                        {expenseRows.length > 0 && (
                          <>
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="py-1.5 px-4 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wide border-b border-red-100"
                              >
                                Expenses
                              </TableCell>
                            </TableRow>
                            {expenseRows.map((tx, i) =>
                              renderTx(tx, incomeRows.length + i),
                            )}
                          </>
                        )}
                      </>
                    );
                  })()}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Transaction Dialog */}
      {/* Edit Planned Expenses Dialog */}
      <Dialog open={editPlannedOpen} onOpenChange={setEditPlannedOpen}>
        <DialogContent data-ocid="budgeting.edit_planned.dialog">
          <DialogHeader>
            <DialogTitle>
              Edit Planned Expenses — {MONTHS[selectedMonth - 1]} {selectedYear}
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
                  {filteredCategories.map((c) => (
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
            <div>
              <Label>Account</Label>
              <Input
                data-ocid="budgeting.account.input"
                value={form.account}
                onChange={(e) =>
                  setForm((f) => ({ ...f, account: e.target.value }))
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
      {/* Bar Chart */}
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
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`}
                width={50}
              />
              <Tooltip formatter={(v: number) => fmt(v, country)} />
              <Legend iconType="circle" iconSize={10} />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="Planned Expenses"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Actual Expenses"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
