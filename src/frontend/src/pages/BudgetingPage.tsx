import { Pencil, PiggyBank, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { type BudgetCategory, TransactionType } from "../backend.d";
import { BudgetingTab } from "../components/budgeting/BudgetingTab";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useActor } from "../hooks/useActor";

const emptyForm = {
  name: "",
  categoryType: TransactionType.Expense,
  monthlyLimit: 0,
  color: "#6366f1",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function BudgetingPage() {
  const { actor } = useActor();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllBudgetCategories()
      .then(setCategories)
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
    });
    setOpen(true);
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        await actor.updateBudgetCategory(editing.id, { ...editing, ...form });
      } else {
        await actor.createBudgetCategory({ id: crypto.randomUUID(), ...form });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deleteBudgetCategory(id);
    load();
  };

  const totalIncome = categories
    .filter((c) => c.categoryType === TransactionType.Income)
    .reduce((s, c) => s + c.monthlyLimit, 0);
  const totalExpense = categories
    .filter((c) => c.categoryType === TransactionType.Expense)
    .reduce((s, c) => s + c.monthlyLimit, 0);

  return (
    <div data-ocid="budgeting.page" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Budgeting</h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage income, expense categories and transactions
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList data-ocid="budgeting.tab">
          <TabsTrigger value="categories">Budget Categories</TabsTrigger>
          <TabsTrigger value="expenses">Income &amp; Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-2 gap-4 flex-1 mr-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="text-xs text-emerald-600 font-medium">
                  Total Income Budget
                </div>
                <div className="text-xl font-bold text-emerald-700">
                  {fmt(totalIncome)}
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="text-xs text-red-600 font-medium">
                  Total Expense Budget
                </div>
                <div className="text-xl font-bold text-red-700">
                  {fmt(totalExpense)}
                </div>
              </div>
            </div>
            <Button
              data-ocid="budgeting.add_button"
              onClick={openAdd}
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Add Category
            </Button>
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
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm" data-ocid="budgeting.table">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-right">Monthly Limit</th>
                    <th className="px-4 py-3 text-center">Color</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((c, i) => (
                    <tr
                      key={c.id}
                      data-ocid={`budgeting.item.${i + 1}`}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            c.categoryType === TransactionType.Income
                              ? "default"
                              : "destructive"
                          }
                          className={
                            c.categoryType === TransactionType.Income
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {c.categoryType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {fmt(c.monthlyLimit)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <div
                            className="w-6 h-6 rounded-full border border-slate-200"
                            style={{ backgroundColor: c.color }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <BudgetingTab />
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
