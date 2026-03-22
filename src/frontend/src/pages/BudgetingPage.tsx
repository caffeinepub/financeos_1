import { BookOpen, Pencil, PiggyBank, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { type BudgetCategory, TransactionType } from "../backend.d";
import { ExpensesTab } from "../components/budgeting/ExpensesTab";
import { MonthlyTrackerTab } from "../components/budgeting/MonthlyTrackerTab";
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

export default function BudgetingPage() {
  const { actor } = useActor();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BudgetCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

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

      <Tabs defaultValue="categories">
        <div className="overflow-x-auto pb-1 mb-1">
          <TabsList
            data-ocid="budgeting.tab"
            className="h-auto bg-transparent p-0 gap-2 flex"
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
          </TabsList>
        </div>

        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="grid grid-cols-2 gap-4 flex-1 min-w-0">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="text-xs text-emerald-600 font-medium">
                  Budgeted Income
                </div>
                <div className="text-xl font-bold text-emerald-700">
                  {fmt(totalIncome)}
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="text-xs text-red-600 font-medium">
                  Budgeted Expense
                </div>
                <div className="text-xl font-bold text-red-700">
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
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {incomes.length > 0 && (
                        <>
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-2 bg-emerald-50 border-b border-emerald-100"
                            >
                              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                Income ({incomes.length})
                              </span>
                            </td>
                          </tr>
                          {renderRows(incomes)}
                        </>
                      )}
                      {expenses.length > 0 && (
                        <>
                          <tr>
                            <td
                              colSpan={4}
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
