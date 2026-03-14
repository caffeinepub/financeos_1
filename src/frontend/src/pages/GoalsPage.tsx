import { Pencil, Plus, Target, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Goal } from "../backend.d";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";

const empty: Omit<Goal, "id"> = {
  name: "",
  category: "",
  targetAmount: 0,
  currentAmount: 0,
  deadline: "",
  notes: "",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function GoalsPage() {
  const { actor } = useActor();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [form, setForm] = useState<Omit<Goal, "id">>(empty);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllGoals()
      .then(setGoals)
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (g: Goal) => {
    setEditing(g);
    setForm({
      name: g.name,
      category: g.category,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      deadline: g.deadline,
      notes: g.notes,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        await actor.updateGoal(editing.id, { ...editing, ...form });
      } else {
        await actor.createGoal({ id: crypto.randomUUID(), ...form });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deleteGoal(id);
    load();
  };

  return (
    <div data-ocid="goals.page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Goals</h2>
          <p className="text-slate-500 text-sm mt-1">
            Track your financial goals
          </p>
        </div>
        <Button
          data-ocid="goals.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Goal
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div
          data-ocid="goals.empty_state"
          className="flex flex-col items-center justify-center py-20 text-slate-400"
        >
          <Target className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No goals yet</p>
          <p className="text-sm">
            Add your first financial goal to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((g, i) => {
            const pct =
              g.targetAmount > 0
                ? Math.min(100, (g.currentAmount / g.targetAmount) * 100)
                : 0;
            return (
              <Card key={g.id} data-ocid={`goals.item.${i + 1}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">{g.name}</h3>
                      {g.category && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {g.category}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        data-ocid={`goals.edit_button.${i + 1}`}
                        onClick={() => openEdit(g)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        data-ocid={`goals.delete_button.${i + 1}`}
                        onClick={() => del(g.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-medium">{pct.toFixed(0)}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{fmt(g.currentAmount)}</span>
                      <span>{fmt(g.targetAmount)}</span>
                    </div>
                    {g.deadline && (
                      <div className="text-xs text-slate-400">
                        Deadline: {g.deadline}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="goals.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Goal" : "Add Goal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                data-ocid="goals.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Emergency Fund"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                data-ocid="goals.category.input"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                placeholder="e.g. Savings"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Target Amount</Label>
                <Input
                  data-ocid="goals.targetamount.input"
                  type="number"
                  value={form.targetAmount}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      targetAmount: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Current Amount</Label>
                <Input
                  data-ocid="goals.currentamount.input"
                  type="number"
                  value={form.currentAmount}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      currentAmount: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input
                data-ocid="goals.deadline.input"
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, deadline: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                data-ocid="goals.notes.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="goals.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="goals.submit_button"
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
