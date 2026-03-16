import {
  Brain,
  GraduationCap,
  Pencil,
  Plus,
  Shield,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FinancialRule } from "../backend.d";
import { AIRulesAnalysis } from "../components/AIRulesAnalysis";
import { FinancialRulesSection } from "../components/FinancialRulesSection";
import { ModelFundamentalsTab } from "../components/financial-model/ModelFundamentalsTab";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
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

const LEVEL_STEPS = [
  {
    label: "All",
    color: "bg-slate-500",
    textColor: "text-slate-600",
    desc: "All rules",
  },
  {
    label: "Beginner",
    color: "bg-green-500",
    textColor: "text-green-600",
    desc: "Foundations",
  },
  {
    label: "Intermediate",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    desc: "Growth",
  },
  {
    label: "Advanced",
    color: "bg-orange-500",
    textColor: "text-orange-600",
    desc: "Advanced",
  },
  {
    label: "Expert",
    color: "bg-purple-500",
    textColor: "text-purple-600",
    desc: "Expert",
  },
];

export default function FinancialRulesPage() {
  const { actor } = useActor();
  const [rules, setRules] = useState<FinancialRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialRule | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [levelFilter, setLevelFilter] = useState("All");

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

  const handleAIAddRule = async (ruleData: {
    name: string;
    ruleType: string;
    condition: string;
    threshold: number;
    action: string;
    isActive: true;
  }) => {
    if (!actor) return;
    await actor.createFinancialRule({ id: crypto.randomUUID(), ...ruleData });
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
      </div>

      <Tabs defaultValue="knowledge">
        <TabsList>
          <TabsTrigger
            value="knowledge"
            data-ocid="financialrules.knowledge.tab"
          >
            Rules
          </TabsTrigger>
          <TabsTrigger value="basics" data-ocid="financialrules.basics.tab">
            <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
            Basics
          </TabsTrigger>
          <TabsTrigger value="my-rules" data-ocid="financialrules.myrules.tab">
            My Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge" className="mt-4 space-y-4">
          {/* Level Selector Banner */}
          <div className="rounded-xl border border-border/60 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-950/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-foreground">
                Filter by Level
              </span>
              {levelFilter !== "All" && (
                <Badge
                  className={`ml-auto text-xs ${
                    levelFilter === "Beginner"
                      ? "bg-green-100 text-green-700"
                      : levelFilter === "Intermediate"
                        ? "bg-blue-100 text-blue-700"
                        : levelFilter === "Advanced"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {levelFilter}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-0">
              {LEVEL_STEPS.map((step, idx) => (
                <div key={step.label} className="flex items-center flex-1">
                  <button
                    type="button"
                    data-ocid={`financialrules.level.${step.label.toLowerCase()}.toggle`}
                    className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
                    onClick={() => setLevelFilter(step.label)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300 ${
                        levelFilter === step.label
                          ? `${step.color} ring-2 ring-offset-2 ring-offset-background scale-110`
                          : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                      }`}
                    >
                      {idx === 0 ? "★" : idx}
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-xs font-semibold transition-colors ${
                          levelFilter === step.label
                            ? step.textColor
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground hidden sm:block">
                        {step.desc}
                      </div>
                    </div>
                  </button>
                  {idx < LEVEL_STEPS.length - 1 && (
                    <div className="h-0.5 flex-1 mx-1 rounded-full bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <FinancialRulesSection levelFilter={levelFilter} />
        </TabsContent>

        <TabsContent value="basics" className="mt-4">
          <ModelFundamentalsTab />
        </TabsContent>

        <TabsContent value="my-rules" className="mt-4">
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Button
                variant={showAIAnalysis ? "default" : "outline"}
                className={`gap-2 ${
                  showAIAnalysis
                    ? "bg-gradient-to-r from-violet-500 to-purple-700 text-white border-0 hover:opacity-90"
                    : "border-violet-200 text-violet-700 hover:bg-violet-50"
                }`}
                onClick={() => setShowAIAnalysis((v) => !v)}
                data-ocid="ai_analysis.toggle_button"
              >
                <Brain className="w-4 h-4" />
                {showAIAnalysis ? "Hide AI Analysis" : "AI Analysis"}
              </Button>
              <Button
                data-ocid="financialrules.add_button"
                onClick={openAdd}
                className="gap-2"
              >
                <Plus className="w-4 h-4" /> Add Rule
              </Button>
            </div>

            {/* AI Analysis Panel */}
            {showAIAnalysis && (
              <Card className="border-violet-200 shadow-sm">
                <CardContent className="p-5">
                  <AIRulesAnalysis
                    userRules={rules}
                    onAddRule={handleAIAddRule}
                  />
                </CardContent>
              </Card>
            )}

            {/* Rules List */}
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
                            className={`text-xs ${
                              r.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : ""
                            }`}
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
                              <span className="text-slate-400">Threshold:</span>{" "}
                              ${r.threshold.toLocaleString()}
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
          </div>
        </TabsContent>
      </Tabs>

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
