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

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function ExpensesTab() {
  const { actor } = useActor();
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
        await actor.updateTransaction(editing.id, { ...editing, ...form });
      } else {
        await actor.createTransaction({ id: crypto.randomUUID(), ...form });
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

  const catName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "-";

  const filtered = transactions.filter((t) => {
    const matchType = typeFilter === "All" || t.transactionType === typeFilter;
    const matchSearch =
      !search ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      catName(t.categoryId).toLowerCase().includes(search.toLowerCase()) ||
      t.account.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Totals computed from ALL transactions (not just filtered) for summary
  const allIncome = transactions
    .filter((t) => t.transactionType === TransactionType.Income)
    .reduce((s, t) => s + t.amount, 0);
  const allExpense = transactions
    .filter((t) => t.transactionType === TransactionType.Expense)
    .reduce((s, t) => s + t.amount, 0);
  const netBalance = allIncome - allExpense;

  // Totals for filtered view
  const filteredIncome = filtered
    .filter((t) => t.transactionType === TransactionType.Income)
    .reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filtered
    .filter((t) => t.transactionType === TransactionType.Expense)
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-center gap-3">
          <div className="bg-emerald-100 rounded-lg p-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-emerald-600 font-medium">
              Total Income
            </div>
            <div className="text-xl font-bold text-emerald-700">
              {fmt(allIncome)}
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 flex items-center gap-3">
          <div className="bg-red-100 rounded-lg p-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-xs text-red-600 font-medium">
              Total Expenses
            </div>
            <div className="text-xl font-bold text-red-700">
              {fmt(allExpense)}
            </div>
          </div>
        </div>
        <div
          className={`rounded-xl p-4 border flex items-center gap-3 ${
            netBalance >= 0
              ? "bg-blue-50 border-blue-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <div
            className={`rounded-lg p-2 ${
              netBalance >= 0 ? "bg-blue-100" : "bg-orange-100"
            }`}
          >
            <Wallet
              className={`w-5 h-5 ${
                netBalance >= 0 ? "text-blue-600" : "text-orange-600"
              }`}
            />
          </div>
          <div>
            <div
              className={`text-xs font-medium ${
                netBalance >= 0 ? "text-blue-600" : "text-orange-600"
              }`}
            >
              Net Balance
            </div>
            <div
              className={`text-xl font-bold ${
                netBalance >= 0 ? "text-blue-700" : "text-orange-700"
              }`}
            >
              {netBalance >= 0 ? "+" : ""}
              {fmt(netBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input
              data-ocid="expenses.search_input"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-56"
            />
          </div>
          <div className="flex gap-2">
            {(
              ["All", TransactionType.Income, TransactionType.Expense] as const
            ).map((t) => (
              <Button
                key={t}
                variant={typeFilter === t ? "default" : "outline"}
                size="sm"
                data-ocid={`expenses.${t === "All" ? "all" : t === TransactionType.Income ? "income" : "expense"}.tab`}
                onClick={() => setTypeFilter(t)}
              >
                {t}
                {t !== "All" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    (
                    {
                      transactions.filter((tx) => tx.transactionType === t)
                        .length
                    }
                    )
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
        <Button
          data-ocid="expenses.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </Button>
      </div>

      {/* Filtered subtotals when filter is active */}
      {(typeFilter !== "All" || search) && filtered.length > 0 && (
        <div className="flex gap-3 text-sm text-slate-500 bg-slate-50 rounded-lg px-4 py-2 border border-slate-100">
          <span>
            Showing {filtered.length} transaction
            {filtered.length !== 1 ? "s" : ""}
          </span>
          {filteredIncome > 0 && (
            <span className="text-emerald-600">
              Income: {fmt(filteredIncome)}
            </span>
          )}
          {filteredExpense > 0 && (
            <span className="text-red-600">
              Expenses: {fmt(filteredExpense)}
            </span>
          )}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <Skeleton data-ocid="expenses.loading_state" className="h-64" />
      ) : filtered.length === 0 ? (
        <div
          data-ocid="expenses.empty_state"
          className="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <ArrowLeftRight className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No transactions found</p>
          {search || typeFilter !== "All" ? (
            <p className="text-xs mt-1">Try adjusting your filters</p>
          ) : (
            <p className="text-xs mt-1">
              Click "Add Transaction" to log your first entry
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm" data-ocid="expenses.table">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Account</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-center">Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t, i) => (
                <tr
                  key={t.id}
                  data-ocid={`expenses.item.${i + 1}`}
                  className="hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {t.description}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {t.account || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {(() => {
                        const cat = categories.find(
                          (c) => c.id === t.categoryId,
                        );
                        return cat ? (
                          <>
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-slate-500">{cat.name}</span>
                          </>
                        ) : (
                          <span className="text-slate-400">-</span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <Badge
                        className={
                          t.transactionType === TransactionType.Income
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        {t.transactionType}
                      </Badge>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      t.transactionType === TransactionType.Income
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.transactionType === TransactionType.Income ? "+" : "-"}
                    {fmt(t.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        data-ocid={`expenses.edit_button.${i + 1}`}
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        data-ocid={`expenses.delete_button.${i + 1}`}
                        onClick={() => del(t.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input
                  data-ocid="expenses.date.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  data-ocid="expenses.amount.input"
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                data-ocid="expenses.description.input"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Account</Label>
              <Input
                data-ocid="expenses.account.input"
                value={form.account}
                onChange={(e) =>
                  setForm((f) => ({ ...f, account: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={form.transactionType}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    transactionType: v as TransactionType,
                  }))
                }
              >
                <SelectTrigger data-ocid="expenses.type.select">
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
                <SelectTrigger data-ocid="expenses.category.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c.categoryType === form.transactionType)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  {categories.filter(
                    (c) => c.categoryType === form.transactionType,
                  ).length === 0 && (
                    <SelectItem value="" disabled>
                      No categories for this type
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="expenses.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="expenses.submit_button"
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
