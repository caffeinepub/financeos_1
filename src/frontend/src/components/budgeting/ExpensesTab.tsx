import {
  ArrowLeftRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  type BudgetCategory,
  type Transaction,
  TransactionType,
} from "../../backend.d";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useActor } from "../../hooks/useActor";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
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

const emptyForm = {
  date: "",
  description: "",
  account: "",
  categoryId: "",
  transactionType: TransactionType.Expense,
  amount: 0,
};

export function ExpensesTab() {
  const { actor } = useActor();
  const { country } = useCurrency();

  function fmt(n: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: country.code,
    }).format(n);
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | TransactionType>("All");

  const load = () => {
    if (!actor) return;
    setLoading(true);
    Promise.all([actor.getAllTransactions(), actor.getAllBudgetCategories()])
      .then(([txns, cats]) => {
        setTransactions([...txns].sort((a, b) => b.date.localeCompare(a.date)));
        setCategories(cats);
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
  const openEdit = (t: Transaction) => {
    setEditing(t);
    setForm({
      date: t.date,
      description: t.description,
      account: t.account,
      categoryId: t.categoryId,
      transactionType: t.transactionType,
      amount: t.amount,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        await actor.updateTransaction(editing.id, { id: editing.id, ...form });
      } else {
        await actor.createTransaction({ id: "", ...form });
      }
      setOpen(false);
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

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.account.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || t.transactionType === typeFilter;
    return matchSearch && matchType;
  });

  const allIncome = transactions
    .filter((t) => t.transactionType === TransactionType.Income)
    .reduce((s, t) => s + t.amount, 0);
  const allExpense = transactions
    .filter((t) => t.transactionType === TransactionType.Expense)
    .reduce((s, t) => s + t.amount, 0);
  const netBalance = allIncome - allExpense;

  const filteredIncome = filtered
    .filter((t) => t.transactionType === TransactionType.Income)
    .reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filtered
    .filter((t) => t.transactionType === TransactionType.Expense)
    .reduce((s, t) => s + t.amount, 0);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <Skeleton key={n} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  // Separate income and expense rows for grouped display
  const incomeRows = filtered.filter(
    (t) => t.transactionType === TransactionType.Income,
  );
  const expenseRows = filtered.filter(
    (t) => t.transactionType === TransactionType.Expense,
  );

  const renderRow = (t: Transaction, rowIndex: number) => {
    const cat = categories.find((c) => c.id === t.categoryId);
    const isIncome = t.transactionType === TransactionType.Income;
    return (
      <tr
        key={t.id.toString()}
        data-ocid={`expenses.item.${rowIndex}`}
        className="border-t border-border hover:bg-muted/30 transition-colors"
      >
        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
          {t.date}
        </td>
        <td className="p-3 text-xs font-medium max-w-[120px] truncate">
          {t.description}
        </td>
        <td className="p-3 text-xs hidden sm:table-cell text-muted-foreground">
          {t.account}
        </td>
        <td className="p-3 text-xs hidden md:table-cell">
          {cat ? (
            <Badge variant="secondary" className="text-xs">
              {cat.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
        <td className="p-3">
          <Badge
            variant={isIncome ? "default" : "destructive"}
            className={`text-xs ${isIncome ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}`}
          >
            {isIncome ? "Income" : "Expense"}
          </Badge>
        </td>
        <td
          className={`p-3 text-xs font-bold text-right ${isIncome ? "text-green-600" : "text-red-500"}`}
        >
          {isIncome ? "+" : "-"}
          {fmt(t.amount)}
        </td>
        <td className="p-3 text-right">
          <div className="flex justify-end gap-1">
            <Button
              data-ocid={`expenses.edit_button.${rowIndex}`}
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => openEdit(t)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              data-ocid={`expenses.delete_button.${rowIndex}`}
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => del(t.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-muted-foreground">
              Total Income
            </span>
          </div>
          <div className="text-xl font-bold text-green-600">
            {fmt(allIncome)}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium text-muted-foreground">
              Total Expenses
            </span>
          </div>
          <div className="text-xl font-bold text-red-500">
            {fmt(allExpense)}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-muted-foreground">
              Net Balance
            </span>
          </div>
          <div
            className={`text-xl font-bold ${netBalance >= 0 ? "text-blue-600" : "text-red-500"}`}
          >
            {fmt(netBalance)}
          </div>
        </div>
      </div>

      {/* Filters + Add */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="expenses.search_input"
            className="pl-9"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(
            ["All", TransactionType.Income, TransactionType.Expense] as const
          ).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={typeFilter === f ? "default" : "outline"}
              onClick={() => setTypeFilter(f)}
              data-ocid={`expenses.filter.${String(f).toLowerCase()}.toggle`}
            >
              {f === "All" ? (
                <ArrowLeftRight className="h-3 w-3 mr-1" />
              ) : f === TransactionType.Income ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {f === TransactionType.Income
                ? "Income"
                : f === TransactionType.Expense
                  ? "Expense"
                  : "All"}
            </Button>
          ))}
          <Button
            data-ocid="expenses.add.open_modal_button"
            onClick={openAdd}
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {/* Filtered summary */}
      {(search || typeFilter !== "All") && (
        <div className="flex gap-4 text-sm text-muted-foreground px-1">
          <span>
            Income:{" "}
            <strong className="text-green-600">{fmt(filteredIncome)}</strong>
          </span>
          <span>
            Expenses:{" "}
            <strong className="text-red-500">{fmt(filteredExpense)}</strong>
          </span>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div
          data-ocid="expenses.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Wallet className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 border-b border-border">
                  <th className="text-left p-3 font-semibold text-xs text-white">
                    Date
                  </th>
                  <th className="text-left p-3 font-semibold text-xs text-white">
                    Description
                  </th>
                  <th className="text-left p-3 font-semibold text-xs text-white hidden sm:table-cell">
                    Account
                  </th>
                  <th className="text-left p-3 font-semibold text-xs text-white hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left p-3 font-semibold text-xs text-white">
                    Type
                  </th>
                  <th className="text-right p-3 font-semibold text-xs text-white">
                    Amount
                  </th>
                  <th className="text-right p-3 font-semibold text-xs text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {typeFilter === "All" ? (
                  <>
                    {incomeRows.length > 0 && (
                      <>
                        <tr>
                          <td
                            colSpan={7}
                            className="px-3 py-1.5 bg-green-50 border-b border-green-100 text-xs font-bold text-green-700 uppercase tracking-wide"
                          >
                            Income
                          </td>
                        </tr>
                        {incomeRows.map((t, i) => renderRow(t, i + 1))}
                      </>
                    )}
                    {expenseRows.length > 0 && (
                      <>
                        <tr>
                          <td
                            colSpan={7}
                            className="px-3 py-1.5 bg-red-50 border-b border-red-100 text-xs font-bold text-red-700 uppercase tracking-wide"
                          >
                            Expenses
                          </td>
                        </tr>
                        {expenseRows.map((t, i) =>
                          renderRow(t, incomeRows.length + i + 1),
                        )}
                      </>
                    )}
                  </>
                ) : (
                  filtered.map((t, i) => renderRow(t, i + 1))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="expenses.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  data-ocid="expenses.date.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.transactionType as string}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      transactionType: v as TransactionType,
                    }))
                  }
                >
                  <SelectTrigger data-ocid="expenses.type.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TransactionType.Income as string}>
                      Income
                    </SelectItem>
                    <SelectItem value={TransactionType.Expense as string}>
                      Expense
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                data-ocid="expenses.description.input"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="e.g. Grocery shopping"
              />
            </div>
            <div className="space-y-2">
              <Label>Account</Label>
              <Input
                data-ocid="expenses.account.input"
                value={form.account}
                onChange={(e) =>
                  setForm((p) => ({ ...p, account: e.target.value }))
                }
                placeholder="e.g. HDFC Savings"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}
              >
                <SelectTrigger data-ocid="expenses.category.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount ({country.symbol})</Label>
              <Input
                data-ocid="expenses.amount.input"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: Number(e.target.value) }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="expenses.cancel_button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="expenses.submit_button"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : editing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
