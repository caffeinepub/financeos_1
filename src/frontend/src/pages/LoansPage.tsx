import { CreditCard, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Loan } from "../backend.d";
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
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";

const emptyForm = {
  name: "",
  loanType: "",
  principal: 0,
  interestRate: 0,
  termMonths: 12,
  startDate: "",
  currentBalance: 0,
  monthlyPayment: 0,
  notes: "",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function LoansPage() {
  const { actor } = useActor();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Loan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllLoans()
      .then(setLoans)
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (l: Loan) => {
    setEditing(l);
    setForm({
      name: l.name,
      loanType: l.loanType,
      principal: l.principal,
      interestRate: l.interestRate,
      termMonths: Number(l.termMonths),
      startDate: l.startDate,
      currentBalance: l.currentBalance,
      monthlyPayment: l.monthlyPayment,
      notes: l.notes,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const data = { ...form, termMonths: BigInt(form.termMonths) };
      if (editing) {
        await actor.updateLoan(editing.id, { ...editing, ...data });
      } else {
        await actor.createLoan({ id: crypto.randomUUID(), ...data });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deleteLoan(id);
    load();
  };

  return (
    <div data-ocid="loans.page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Loans</h2>
          <p className="text-slate-500 text-sm mt-1">
            Track your loan balances and payoff progress
          </p>
        </div>
        <Button
          data-ocid="loans.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Loan
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : loans.length === 0 ? (
        <div
          data-ocid="loans.empty_state"
          className="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <CreditCard className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No loans tracked yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loans.map((l, i) => {
            const paidPct =
              l.principal > 0
                ? Math.min(
                    100,
                    ((l.principal - l.currentBalance) / l.principal) * 100,
                  )
                : 0;
            return (
              <Card key={l.id} data-ocid={`loans.item.${i + 1}`}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{l.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {l.loanType}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      data-ocid={`loans.edit_button.${i + 1}`}
                      onClick={() => openEdit(l)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500"
                      data-ocid={`loans.delete_button.${i + 1}`}
                      onClick={() => del(l.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Principal:</span>{" "}
                      <span className="font-medium">{fmt(l.principal)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Rate:</span>{" "}
                      <span className="font-medium">{l.interestRate}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Balance:</span>{" "}
                      <span className="font-medium text-orange-600">
                        {fmt(l.currentBalance)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Monthly:</span>{" "}
                      <span className="font-medium">
                        {fmt(l.monthlyPayment)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Payoff Progress</span>
                      <span>{paidPct.toFixed(1)}%</span>
                    </div>
                    <Progress value={paidPct} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="loans.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Loan" : "Add Loan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input
                  data-ocid="loans.name.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Loan Type</Label>
                <Input
                  data-ocid="loans.loantype.input"
                  value={form.loanType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, loanType: e.target.value }))
                  }
                  placeholder="e.g. Mortgage, Auto"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Principal</Label>
                <Input
                  data-ocid="loans.principal.input"
                  type="number"
                  value={form.principal}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      principal: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Interest Rate (%)</Label>
                <Input
                  data-ocid="loans.rate.input"
                  type="number"
                  step="0.01"
                  value={form.interestRate}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      interestRate: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Term (months)</Label>
                <Input
                  data-ocid="loans.term.input"
                  type="number"
                  value={form.termMonths}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      termMonths: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  data-ocid="loans.startdate.input"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Current Balance</Label>
                <Input
                  data-ocid="loans.balance.input"
                  type="number"
                  value={form.currentBalance}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      currentBalance: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Monthly Payment</Label>
                <Input
                  data-ocid="loans.payment.input"
                  type="number"
                  value={form.monthlyPayment}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      monthlyPayment: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                data-ocid="loans.notes.textarea"
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
              data-ocid="loans.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="loans.submit_button"
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
