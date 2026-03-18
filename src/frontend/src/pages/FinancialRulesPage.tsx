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
    color: "#64748b",
    bg: "bg-slate-500",
    textColor: "text-slate-600",
  },
  {
    label: "Beginner",
    color: "#16a34a",
    bg: "bg-green-500",
    textColor: "text-green-700",
  },
  {
    label: "Intermediate",
    color: "#2563eb",
    bg: "bg-blue-500",
    textColor: "text-blue-700",
  },
  {
    label: "Advanced",
    color: "#ea580c",
    bg: "bg-orange-500",
    textColor: "text-orange-700",
  },
  {
    label: "Expert",
    color: "#7c3aed",
    bg: "bg-purple-500",
    textColor: "text-purple-700",
  },
];

const LEVEL_BORDER_COLORS: Record<string, string> = {
  All: "#64748b",
  Beginner: "#16a34a",
  Intermediate: "#2563eb",
  Advanced: "#ea580c",
  Expert: "#7c3aed",
};

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
      {/* Page header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)" }}
        >
          <Shield className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Learn Finance</h1>
      </div>
      <div className="hidden">
        <div>
          <p className="text-sm text-slate-500">
            Build your financial knowledge from basics to expert
          </p>
        </div>
      </div>

      <Tabs defaultValue="basics">
        {/* Pill-style tab bar */}
        <TabsList className="bg-slate-100 p-1 rounded-xl gap-1 h-auto flex-wrap">
          <TabsTrigger
            value="basics"
            data-ocid="financialrules.basics.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
            Basics
          </TabsTrigger>
          <TabsTrigger
            value="knowledge"
            data-ocid="financialrules.knowledge.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            Rules
          </TabsTrigger>
          <TabsTrigger
            value="my-rules"
            data-ocid="financialrules.myrules.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <Brain className="w-3.5 h-3.5 mr-1.5" />
            My Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="mt-4">
          <ModelFundamentalsTab />
        </TabsContent>

        <TabsContent value="knowledge" className="mt-4 space-y-4">
          {/* Level Filter Pills */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Filter by Level
            </p>
            <div className="flex flex-wrap gap-2">
              {LEVEL_STEPS.map((step) => (
                <button
                  key={step.label}
                  type="button"
                  data-ocid={`financialrules.level.${step.label.toLowerCase()}.toggle`}
                  onClick={() => setLevelFilter(step.label)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    levelFilter === step.label
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                  style={
                    levelFilter === step.label ? { background: step.color } : {}
                  }
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>
          <FinancialRulesSection levelFilter={levelFilter} />
        </TabsContent>

        <TabsContent value="my-rules" className="mt-4">
          <div className="space-y-4">
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

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : rules.length === 0 ? (
              <div
                data-ocid="financialrules.empty_state"
                className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700 text-sm">
                  No rules yet
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs text-center">
                  Add your own financial guardrails or use AI Analysis to get
                  personalized recommendations.
                </p>
                <Button
                  onClick={openAdd}
                  size="sm"
                  className="mt-4 gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
                  data-ocid="financialrules.empty.add_button"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Rule
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {rules.map((r, i) => {
                  const levelColor =
                    LEVEL_BORDER_COLORS[r.ruleType] ?? "#64748b";
                  return (
                    <Card
                      key={r.id}
                      data-ocid={`financialrules.item.${i + 1}`}
                      className="rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                      style={{
                        borderLeftColor: levelColor,
                        borderLeftWidth: 3,
                      }}
                    >
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800 text-sm">
                              {r.name}
                            </span>
                            {r.ruleType && (
                              <Badge
                                className="text-xs"
                                style={{
                                  background: `${
                                    LEVEL_BORDER_COLORS[r.ruleType] ?? "#64748b"
                                  }20`,
                                  color:
                                    LEVEL_BORDER_COLORS[r.ruleType] ??
                                    "#64748b",
                                  border: `1px solid ${LEVEL_BORDER_COLORS[r.ruleType] ?? "#64748b"}40`,
                                }}
                              >
                                {r.ruleType}
                              </Badge>
                            )}
                            <Badge
                              variant={r.isActive ? "default" : "secondary"}
                              className={`text-xs ${
                                r.isActive
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : ""
                              }`}
                            >
                              {r.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-xs text-slate-500 space-y-0.5">
                            {r.condition && (
                              <div>
                                <span className="text-slate-400 font-medium">
                                  Condition:
                                </span>{" "}
                                {r.condition}
                              </div>
                            )}
                            {r.threshold > 0 && (
                              <div>
                                <span className="text-slate-400 font-medium">
                                  Threshold:
                                </span>{" "}
                                {r.threshold.toLocaleString()}
                              </div>
                            )}
                            {r.action && (
                              <div>
                                <span className="text-slate-400 font-medium">
                                  Action:
                                </span>{" "}
                                {r.action}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
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
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            data-ocid={`financialrules.delete_button.${i + 1}`}
                            onClick={() => del(r.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
              <Label>Rule Type / Level</Label>
              <Input
                data-ocid="financialrules.ruletype.input"
                value={form.ruleType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ruleType: e.target.value }))
                }
                placeholder="e.g. Beginner, Intermediate, Spending Limit"
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
              <Label>Threshold</Label>
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
