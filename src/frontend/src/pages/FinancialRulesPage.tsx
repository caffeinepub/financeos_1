import { Pencil, Plus, Shield, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { FinancialRule } from "../backend.d";
import { Badge } from "../components/ui/badge";
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
import { Skeleton } from "../components/ui/skeleton";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";

const emptyForm = {
  name: "",
  ruleType: "",
  condition: "",
  threshold: 0,
  action: "",
  isActive: true,
};

export default function FinancialRulesPage() {
  const { actor } = useActor();
  const [rules, setRules] = useState<FinancialRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialRule | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllFinancialRules()
      .then(setRules)
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (r: FinancialRule) => {
    setEditing(r);
    setForm({
      name: r.name,
      ruleType: r.ruleType,
      condition: r.condition,
      threshold: r.threshold,
      action: r.action,
      isActive: r.isActive,
    });
    setOpen(true);
  };

  const toggleActive = async (r: FinancialRule) => {
    if (!actor) return;
    await actor.updateFinancialRule(r.id, { ...r, isActive: !r.isActive });
    load();
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        await actor.updateFinancialRule(editing.id, { ...editing, ...form });
      } else {
        await actor.createFinancialRule({ id: crypto.randomUUID(), ...form });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deleteFinancialRule(id);
    load();
  };

  return (
    <div data-ocid="financialrules.page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Rules</h2>
          <p className="text-slate-500 text-sm mt-1">
            Define your financial guardrails
          </p>
        </div>
        <Button
          data-ocid="financialrules.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Rule
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <div
          data-ocid="financialrules.empty_state"
          className="flex flex-col items-center justify-center py-16 text-slate-400"
        >
          <Shield className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium">No financial rules yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((r, i) => (
            <Card key={r.id} data-ocid={`financialrules.item.${i + 1}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">
                      {r.name}
                    </span>
                    {r.ruleType && (
                      <Badge variant="outline" className="text-xs">
                        {r.ruleType}
                      </Badge>
                    )}
                    <Badge
                      variant={r.isActive ? "default" : "secondary"}
                      className={`text-xs ${r.isActive ? "bg-emerald-100 text-emerald-700" : ""}`}
                    >
                      {r.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-slate-500 space-y-0.5">
                    {r.condition && (
                      <div>
                        <span className="text-slate-400">Condition:</span>{" "}
                        {r.condition}
                      </div>
                    )}
                    {r.threshold > 0 && (
                      <div>
                        <span className="text-slate-400">Threshold:</span> $
                        {r.threshold.toLocaleString()}
                      </div>
                    )}
                    {r.action && (
                      <div>
                        <span className="text-slate-400">Action:</span>{" "}
                        {r.action}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    data-ocid={`financialrules.switch.${i + 1}`}
                    checked={r.isActive}
                    onCheckedChange={() => toggleActive(r)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    data-ocid={`financialrules.edit_button.${i + 1}`}
                    onClick={() => openEdit(r)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    data-ocid={`financialrules.delete_button.${i + 1}`}
                    onClick={() => del(r.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="financialrules.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Rule" : "Add Rule"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                data-ocid="financialrules.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Rule Type</Label>
              <Input
                data-ocid="financialrules.ruletype.input"
                value={form.ruleType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ruleType: e.target.value }))
                }
                placeholder="e.g. Spending Limit, Savings Ratio"
              />
            </div>
            <div>
              <Label>Condition</Label>
              <Input
                data-ocid="financialrules.condition.input"
                value={form.condition}
                onChange={(e) =>
                  setForm((f) => ({ ...f, condition: e.target.value }))
                }
                placeholder="e.g. Monthly spending > threshold"
              />
            </div>
            <div>
              <Label>Threshold ($)</Label>
              <Input
                data-ocid="financialrules.threshold.input"
                type="number"
                value={form.threshold}
                onChange={(e) =>
                  setForm((f) => ({ ...f, threshold: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <Label>Action</Label>
              <Input
                data-ocid="financialrules.action.input"
                value={form.action}
                onChange={(e) =>
                  setForm((f) => ({ ...f, action: e.target.value }))
                }
                placeholder="e.g. Send alert, Notify"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                data-ocid="financialrules.active.switch"
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="financialrules.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="financialrules.submit_button"
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
