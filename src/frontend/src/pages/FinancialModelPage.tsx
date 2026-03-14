import { BarChart3, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { FinancialModel } from "../backend.d";
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
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";

const emptyForm = {
  name: "",
  initialAmount: 0,
  monthlyContribution: 0,
  annualReturn: 7,
  years: 10,
  notes: "",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function calcFV(
  initial: number,
  monthly: number,
  annualRate: number,
  years: number,
) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return initial + monthly * n;
  return initial * (1 + r) ** n + monthly * (((1 + r) ** n - 1) / r);
}

export default function FinancialModelPage() {
  const { actor } = useActor();
  const [models, setModels] = useState<FinancialModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialModel | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllFinancialModels()
      .then(setModels)
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (m: FinancialModel) => {
    setEditing(m);
    setForm({
      name: m.name,
      initialAmount: m.initialAmount,
      monthlyContribution: m.monthlyContribution,
      annualReturn: m.annualReturn,
      years: Number(m.years),
      notes: m.notes,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const data = { ...form, years: BigInt(form.years) };
      if (editing) {
        await actor.updateFinancialModel(editing.id, { ...editing, ...data });
      } else {
        await actor.createFinancialModel({ id: crypto.randomUUID(), ...data });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deleteFinancialModel(id);
    load();
  };

  return (
    <div data-ocid="financialmodel.page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Model</h2>
          <p className="text-slate-500 text-sm mt-1">
            Project your financial growth
          </p>
        </div>
        <Button
          data-ocid="financialmodel.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Model
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : models.length === 0 ? (
        <div
          data-ocid="financialmodel.empty_state"
          className="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No financial models yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((m, i) => {
            const fv = calcFV(
              m.initialAmount,
              m.monthlyContribution,
              m.annualReturn,
              Number(m.years),
            );
            return (
              <Card key={m.id} data-ocid={`financialmodel.item.${i + 1}`}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <CardTitle className="text-base">{m.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      data-ocid={`financialmodel.edit_button.${i + 1}`}
                      onClick={() => openEdit(m)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      data-ocid={`financialmodel.delete_button.${i + 1}`}
                      onClick={() => del(m.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400">Initial:</span>{" "}
                      {fmt(m.initialAmount)}
                    </div>
                    <div>
                      <span className="text-slate-400">Monthly:</span>{" "}
                      {fmt(m.monthlyContribution)}
                    </div>
                    <div>
                      <span className="text-slate-400">Return:</span>{" "}
                      {m.annualReturn}% p.a.
                    </div>
                    <div>
                      <span className="text-slate-400">Years:</span>{" "}
                      {Number(m.years)}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      Projected Future Value
                    </span>
                    <div className="text-2xl font-bold text-emerald-600">
                      {fmt(fv)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="financialmodel.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Model" : "Add Model"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                data-ocid="financialmodel.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Initial Amount</Label>
                <Input
                  data-ocid="financialmodel.initial.input"
                  type="number"
                  value={form.initialAmount}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      initialAmount: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Monthly Contribution</Label>
                <Input
                  data-ocid="financialmodel.monthly.input"
                  type="number"
                  value={form.monthlyContribution}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      monthlyContribution: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Annual Return (%)</Label>
                <Input
                  data-ocid="financialmodel.return.input"
                  type="number"
                  step="0.1"
                  value={form.annualReturn}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      annualReturn: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Years</Label>
                <Input
                  data-ocid="financialmodel.years.input"
                  type="number"
                  value={form.years}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, years: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                data-ocid="financialmodel.notes.textarea"
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
              data-ocid="financialmodel.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="financialmodel.submit_button"
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
