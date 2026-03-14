import { ArrowLeftRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type BudgetCategory,
  type Transaction,
  TransactionType,
} from "../backend.d";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
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
import { useActor } from "../hooks/useActor";

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

export default function TransactionsPage() {
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
    categories.find((c) => c.id === id)?.name ?? id;

  const filtered = transactions.filter((t) => {
    const matchType = typeFilter === "All" || t.transactionType === typeFilter;
    const matchSearch =
      !search || t.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div data-ocid="transactions.page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Transactions</h2>
          <p className="text-slate-500 text-sm mt-1">
            View and manage your transactions
          </p>
        </div>
        <Button
          data-ocid="transactions.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            data-ocid="transactions.search_input"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-64"
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
              data-ocid={`transactions.${t.toLowerCase()}.tab`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : filtered.length === 0 ? (
        <div
          data-ocid="transactions.empty_state"
          className="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <ArrowLeftRight className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No transactions found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm" data-ocid="transactions.table">
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
                  data-ocid={`transactions.item.${i + 1}`}
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
                  <td className="px-4 py-3 text-slate-500">
                    {catName(t.categoryId) || "-"}
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
                    className={`px-4 py-3 text-right font-semibold ${t.transactionType === TransactionType.Income ? "text-emerald-600" : "text-red-600"}`}
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
                        data-ocid={`transactions.edit_button.${i + 1}`}
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        data-ocid={`transactions.delete_button.${i + 1}`}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="transactions.dialog">
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
                  data-ocid="transactions.date.input"
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
                  data-ocid="transactions.amount.input"
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
                data-ocid="transactions.description.input"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Account</Label>
              <Input
                data-ocid="transactions.account.input"
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
                <SelectTrigger data-ocid="transactions.type.select">
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
                <SelectTrigger data-ocid="transactions.category.select">
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="transactions.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="transactions.submit_button"
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
