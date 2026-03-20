import {
  Activity,
  AlertTriangle,
  BarChart,
  BarChart2,
  BookOpen,
  Brain,
  Clock,
  DollarSign,
  GraduationCap,
  Pencil,
  Plus,
  Shield,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import type { FinancialRule } from "../backend.d";
import { AIRulesAnalysis } from "../components/AIRulesAnalysis";
import { FinancialRulesSection } from "../components/FinancialRulesSection";
import type { FinancialRule as FinancialRuleData } from "../components/FinancialRulesSection";
import { financialRules as ALL_FINANCIAL_RULES } from "../components/FinancialRulesSection";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
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

const BASICS_TOPICS = [
  {
    id: "compounding",
    name: "Compounding",
    desc: "The 8th wonder of the world",
    Icon: TrendingUp,
  },
  {
    id: "rule-of-72",
    name: "Rule of 72",
    desc: "Estimate how fast money doubles",
    Icon: Clock,
  },
  {
    id: "sip-vs-lump",
    name: "SIP vs Lump Sum",
    desc: "Which strategy wins?",
    Icon: BarChart2,
  },
  {
    id: "inflation",
    name: "Inflation Impact",
    desc: "Preserve your purchasing power",
    Icon: Activity,
  },
  {
    id: "cagr",
    name: "CAGR",
    desc: "Measure true investment growth",
    Icon: Target,
  },
  {
    id: "market-cycles",
    name: "Market Cycles",
    desc: "Bull, bear and beyond",
    Icon: BarChart,
  },
  {
    id: "pe-ratio",
    name: "P/E Ratio & Valuation",
    desc: "Is a stock cheap or expensive?",
    Icon: DollarSign,
  },
  {
    id: "diversification",
    name: "Diversification",
    desc: "Don't put all eggs in one basket",
    Icon: BookOpen,
  },
];

const RULE_CATEGORIES = [
  "Investment Rules",
  "Budgeting Rules",
  "Emergency & Risk Rules",
  "Retirement Rules",
  "Debt Management Rules",
  "Risk Management Rules",
  "Valuation & Stock Selection Rules",
  "Business/Corporate Finance Rules",
  "Global Heuristics/Mental Models",
];

const LEVEL_BORDER_COLORS: Record<string, string> = {
  All: "#64748b",
  Beginner: "#16a34a",
  Intermediate: "#2563eb",
  Advanced: "#ea580c",
  Expert: "#7c3aed",
};

const MISTAKES = [
  {
    id: 1,
    mistake: "Not tracking expenses at all",
    principle:
      "Track every rupee: Use zero-based budgeting or detailed monthly expense log",
    ruleId: "50-30-20-budgeting",
    ruleName: "50/30/20 Budgeting Rule",
  },
  {
    id: 2,
    mistake: "Underestimating real monthly outflows",
    principle:
      "Build awareness: Track all outflows for 2-3 months to reveal true spending",
    ruleId: "pay-yourself-first",
    ruleName: "Pay Yourself First Rule",
  },
  {
    id: 3,
    mistake: "Multiple overlapping loans/EMIs spiraling",
    principle:
      "Avoid bad debt: Live below your means; pay high-interest debt first (avalanche method)",
    ruleId: "avalanche-debt",
    ruleName: "Avalanche Debt Method",
  },
  {
    id: 4,
    mistake: "No emergency fund built",
    principle:
      "Build 3-12 months' expenses in liquid savings (6+ months ideal for private job)",
    ruleId: "emergency-fund",
    ruleName: "Emergency Fund Rule",
  },
  {
    id: 5,
    mistake: "Addicted to get-rich-quick schemes (F&O, crypto)",
    principle:
      "Invest long-term: Time in market > timing the market; avoid speculation",
    ruleId: "eggs-basket",
    ruleName: "Don't Put All Eggs in One Basket",
  },
  {
    id: 6,
    mistake: "Living lifestyle on EMIs",
    principle:
      "Use cash/debit for non-essentials: No lifestyle on credit; EMIs ≤ 30-40% of take-home",
    ruleId: "debt-to-income-36",
    ruleName: "Debt-to-Income ≤36% Rule",
  },
  {
    id: 7,
    mistake: "Never discussing money in family",
    principle:
      "Open family money talks: Teach kids budgeting, debt, and saving early",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 8,
    mistake: "Buying insurance only for tax saving",
    principle:
      "Buy pure protection: Term life (15-25x annual income) + separate health cover",
    ruleId: "life-insurance-coverage",
    ruleName: "Life Insurance Coverage Rule",
  },
  {
    id: 9,
    mistake: "Buying home too early (20s/early 30s)",
    principle:
      "Rent + invest first: Buy home after 35+ when stable; aim for EMI ≤ 30% income",
    ruleId: "housing-30",
    ruleName: "Housing 30% Income Rule",
  },
  {
    id: 10,
    mistake: "Treating children as retirement plan",
    principle:
      "Set boundaries: Parents build own retirement corpus; discuss mutual support",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 11,
    mistake: "Chasing shortcuts instead of consistent change",
    principle:
      "Focus on consistency: Small daily habits compound (pay yourself first)",
    ruleId: "pay-yourself-first",
    ruleName: "Pay Yourself First Rule",
  },
  {
    id: 12,
    mistake: "No health/term insurance for self or parents",
    principle:
      "Insure protection first: Term life + comprehensive health (family floater)",
    ruleId: "life-insurance-coverage",
    ruleName: "Life Insurance Coverage Rule",
  },
  {
    id: 13,
    mistake: "Low self-belief / avoiding the mirror",
    principle:
      "Face reality: Monthly net worth review + mindset of abundance & ownership",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 14,
    mistake: "Not having a budget or financial plan",
    principle:
      "Follow 50/30/20 (or 60/30/10) rule: Needs 50-60%, wants 30%, savings/debt 20%",
    ruleId: "50-30-20-budgeting",
    ruleName: "50/30/20 Budgeting Rule",
  },
  {
    id: 15,
    mistake: "Overspending / lifestyle inflation",
    principle:
      "Live below means: Cap spending increases; save raises/bonuses first",
    ruleId: "1-percent-lifestyle",
    ruleName: "1% Rule for Lifestyle Creep",
  },
  {
    id: 16,
    mistake: "Paying only minimum due on credit cards",
    principle:
      "Pay full balance monthly: Avoid 30-45% interest; use 0% balance transfers if needed",
    ruleId: "credit-utilization",
    ruleName: "Credit Utilization 30%",
  },
  {
    id: 17,
    mistake: "Delaying investments / starting late",
    principle:
      "Start early: Benefit from compounding (Rule of 72: years to double ≈ 72/return %)",
    ruleId: "rule-of-72",
    ruleName: "Rule of 72",
  },
  {
    id: 18,
    mistake: "Ignoring inflation impact",
    principle:
      "Beat inflation: Invest in equities/mutual funds (aim 10-12% long-term return)",
    ruleId: "inflation-adjusted",
    ruleName: "Inflation-Adjusted Planning",
  },
  {
    id: 19,
    mistake: "Not diversifying investments",
    principle:
      "Diversify portfolio: Spread across asset classes (equity, debt, gold)",
    ruleId: "3-fund-portfolio",
    ruleName: "3-Fund Portfolio Rule",
  },
  {
    id: 20,
    mistake: "Following tips/herd mentality",
    principle:
      "Do your own research: Invest based on goals/risk, not trends or social media",
    ruleId: "avoid-story-stocks",
    ruleName: "Avoid Story Stocks",
  },
  {
    id: 21,
    mistake: "No retirement planning",
    principle: "Save 15-20%+ of income: Automate to retirement accounts",
    ruleId: "25x-retirement",
    ruleName: "25x Retirement Rule",
  },
  {
    id: 22,
    mistake: "Over-relying on conservative investments",
    principle:
      "Balance growth: Age-based allocation (e.g., 100 - age % in equities)",
    ruleId: "100-minus-age",
    ruleName: "100 Minus Age Asset Allocation",
  },
  {
    id: 23,
    mistake: "Not reviewing credit score regularly",
    principle:
      "Monitor credit: Check score annually; maintain low utilization (<30%)",
    ruleId: "credit-utilization",
    ruleName: "Credit Utilization 30%",
  },
  {
    id: 24,
    mistake: "Availing unnecessary debt/loans",
    principle:
      "Borrow only for assets: No consumer debt; good debt (home/education) only if affordable",
    ruleId: "good-bad-debt",
    ruleName: "Good Debt vs Bad Debt",
  },
  {
    id: 25,
    mistake: "Having too many credit cards",
    principle:
      "Limit to 2-3: One for rewards, one backup; close unused to reduce temptation",
    ruleId: "no-new-debt",
    ruleName: "No New Debt Rule",
  },
  {
    id: 26,
    mistake: "Not claiming tax benefits properly",
    principle: "Maximize deductions: Use tax-advantaged accounts",
    ruleId: "tax-advantaged-first",
    ruleName: "Use Tax-Advantaged Accounts First",
  },
  {
    id: 27,
    mistake: "Ignoring small recurring expenses",
    principle:
      'Cut leaks: Audit subscriptions/apps; apply "pay yourself first" to small savings',
    ruleId: "1-percent-lifestyle",
    ruleName: "1% Rule for Lifestyle Creep",
  },
  {
    id: 28,
    mistake: "Emotional spending / impulse buys",
    principle: "Implement 24-48 hour rule: Wait before non-essential purchases",
    ruleId: "24-hour-rule",
    ruleName: "24-Hour Rule",
  },
  {
    id: 29,
    mistake: "Not negotiating salaries or side income",
    principle:
      "Build leverage: Negotiate raises; create multiple income streams",
    ruleId: "multiple-income-streams",
    ruleName: "Retire with Multiple Income Streams",
  },
  {
    id: 30,
    mistake: "Cosigning loans for others",
    principle:
      "Protect yourself: Never cosign unless you can afford to pay fully",
    ruleId: "leverage-prudence",
    ruleName: "Leverage Prudence",
  },
  {
    id: 31,
    mistake: "Not having life insurance (pure term)",
    principle: "Cover dependents: Term policy = 10-20x annual expenses",
    ruleId: "life-insurance-coverage",
    ruleName: "Life Insurance Coverage Rule",
  },
  {
    id: 32,
    mistake: "Mixing insurance with investment",
    principle:
      "Separate tools: Insurance for protection only; invest separately for growth",
    ruleId: "life-insurance-coverage",
    ruleName: "Life Insurance Coverage Rule",
  },
  {
    id: 33,
    mistake: 'Waiting for "perfect time" to invest',
    principle:
      "Start now: Dollar-cost average (SIP monthly) regardless of market",
    ruleId: "rule-of-72",
    ruleName: "Rule of 72",
  },
  {
    id: 34,
    mistake: "Not automating savings/investments",
    principle:
      "Automate everything: Pay yourself first via auto-transfers to savings/invest",
    ruleId: "pay-yourself-first",
    ruleName: "Pay Yourself First Rule",
  },
  {
    id: 35,
    mistake: "Spending windfalls carelessly",
    principle:
      "Allocate windfalls: 50% debt/savings, 30% fun, 20% invest (or similar split)",
    ruleId: "80-20-savings",
    ruleName: "80/20 Savings Rule",
  },
  {
    id: 36,
    mistake: "Ignoring professional financial advice",
    principle:
      "Seek help when needed: Use fiduciary advisor for complex situations",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 37,
    mistake: "Not building multiple income streams",
    principle:
      "Diversify income: Salary + side hustle/freelance + passive (dividends/rent)",
    ruleId: "multiple-income-streams",
    ruleName: "Retire with Multiple Income Streams",
  },
  {
    id: 38,
    mistake: "Overexposure to real estate",
    principle:
      "Limit illiquids: Real estate ≤ 30-40% net worth; maintain liquidity",
    ruleId: "10-percent-diversification",
    ruleName: "10% Diversification Rule",
  },
  {
    id: 39,
    mistake: "Paying high fees on mutual funds",
    principle:
      "Choose low-cost: Direct plans/index funds (expense ratio <0.5%)",
    ruleId: "3-fund-portfolio",
    ruleName: "3-Fund Portfolio Rule",
  },
  {
    id: 40,
    mistake: "Not rebalancing portfolio",
    principle:
      "Rebalance annually: Sell winners/buy losers to maintain target allocation",
    ruleId: "rebalance-annually",
    ruleName: "Rebalance Annually",
  },
  {
    id: 41,
    mistake: "Borrowing from future self",
    principle: "Build buffer: Emergency fund before credit reliance",
    ruleId: "emergency-credit",
    ruleName: "Emergency Credit Avoidance",
  },
  {
    id: 42,
    mistake: "No goals tied to money",
    principle:
      "Set SMART goals: Link savings to specific targets (house, kids, retirement)",
    ruleId: "25x-retirement",
    ruleName: "25x Retirement Rule",
  },
  {
    id: 43,
    mistake: "Underestimating medical inflation",
    principle:
      "Plan for 10-15% rise: Adequate health cover + buffer for parents/self",
    ruleId: "healthcare-buffer",
    ruleName: "Healthcare Buffer",
  },
  {
    id: 44,
    mistake: "Giving in to social pressure (weddings, status)",
    principle:
      "Prioritize values: Spend on what matters; ignore status symbols",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 45,
    mistake: "Not tracking net worth",
    principle: "Track quarterly: Assets - liabilities = progress dashboard",
    ruleId: "income-by-age-40",
    ruleName: "Income by Age: 3x by 40",
  },
  {
    id: 46,
    mistake: 'Falling for "guaranteed returns" scams',
    principle:
      "Verify always: If too good to be true, avoid; stick to regulated options",
    ruleId: "avoid-ipo-hype",
    ruleName: "Avoid IPO Hype",
  },
  {
    id: 47,
    mistake: "Not updating nominee details",
    principle:
      "Review annually: Update nominees/beneficiaries on all accounts/policies",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 48,
    mistake: 'Treating salary as "free money" post-tax',
    principle:
      "Allocate take-home: Follow budget rule immediately after credit",
    ruleId: "pay-yourself-first",
    ruleName: "Pay Yourself First Rule",
  },
  {
    id: 49,
    mistake: "Neglecting skill upgradation",
    principle: "Invest in self: Continuous learning = higher earning potential",
    ruleId: null,
    ruleName: null,
  },
  {
    id: 50,
    mistake: "Avoiding money conversations",
    principle:
      "Normalize talks: Regular check-ins with partner/family on finances",
    ruleId: null,
    ruleName: null,
  },
];

const _linkedToRulesCount = MISTAKES.filter((m) => m.ruleId !== null).length;

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
  const [activeTab, setActiveTab] = useState("knowledge");
  const [activeBasic, setActiveBasic] = useState<string | null>(null);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [dialogCategory, setDialogCategory] = useState("");
  const [dialogRuleId, setDialogRuleId] = useState("");

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
    setDialogCategory("");
    setDialogRuleId("");
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
    setDialogCategory("");
    setDialogRuleId("");
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

  const goToRulesTab = () => {
    setActiveTab("knowledge");
    window.scrollTo(0, 0);
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Pill-style tab bar */}
        <TabsList className="bg-slate-100 p-1 rounded-xl gap-1 h-auto flex-wrap">
          <TabsTrigger
            value="knowledge"
            data-ocid="financialrules.knowledge.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            Rules
          </TabsTrigger>
          <TabsTrigger
            value="basics"
            data-ocid="financialrules.basics.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
            Basics
          </TabsTrigger>
          <TabsTrigger
            value="mistakes"
            data-ocid="financialrules.mistakes.tab"
            className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Learn from Mistakes
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

        <TabsContent value="basics" className="mt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BASICS_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  data-ocid={`basics.${topic.id}.card`}
                  onClick={() =>
                    setActiveBasic(activeBasic === topic.id ? null : topic.id)
                  }
                  className={`text-left rounded-xl border p-3.5 transition-all shadow-sm hover:shadow-md ${
                    activeBasic === topic.id
                      ? "border-teal-400 bg-teal-50 shadow-teal-100"
                      : "border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/40"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      activeBasic === topic.id ? "bg-teal-500" : "bg-slate-100"
                    }`}
                  >
                    <topic.Icon
                      className={`w-4 h-4 ${activeBasic === topic.id ? "text-white" : "text-slate-500"}`}
                    />
                  </div>
                  <p
                    className={`text-xs font-semibold leading-snug ${activeBasic === topic.id ? "text-teal-700" : "text-slate-700"}`}
                  >
                    {topic.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    {topic.desc}
                  </p>
                </button>
              ))}
            </div>
            {activeBasic && (
              <div className="rounded-2xl border border-teal-100 bg-white shadow-sm overflow-hidden">
                <ModelFundamentalsTab showSection={activeBasic} />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mistakes" className="mt-4">
          {(() => {
            const MISTAKE_CATEGORIES = [
              {
                name: "Debt & Loans",
                icon: "💳",
                color: "#ef4444",
                bg: "bg-red-50",
                border: "border-red-200",
                ids: [3, 6, 9, 16, 24, 25, 30, 38, 41],
              },
              {
                name: "Savings & Emergency Fund",
                icon: "🏦",
                color: "#10b981",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                ids: [4, 11, 14, 15, 27, 34, 35, 42, 48],
              },
              {
                name: "Insurance",
                icon: "🛡️",
                color: "#6366f1",
                bg: "bg-indigo-50",
                border: "border-indigo-200",
                ids: [8, 12, 31, 32, 43],
              },
              {
                name: "Investments",
                icon: "📈",
                color: "#2563eb",
                bg: "bg-blue-50",
                border: "border-blue-200",
                ids: [5, 17, 18, 19, 20, 22, 33, 37, 39, 40, 46],
              },
              {
                name: "Tax & Planning",
                icon: "📋",
                color: "#d97706",
                bg: "bg-amber-50",
                border: "border-amber-200",
                ids: [10, 21, 26, 36, 44, 47],
              },
              {
                name: "Behaviour & Mindset",
                icon: "🧠",
                color: "#7c3aed",
                bg: "bg-violet-50",
                border: "border-violet-200",
                ids: [1, 2, 7, 13, 28, 29, 49, 50],
              },
              {
                name: "Income & Lifestyle",
                icon: "💼",
                color: "#0891b2",
                bg: "bg-cyan-50",
                border: "border-cyan-200",
                ids: [15, 29, 37, 45],
              },
            ];
            const toggleCat = (name: string) =>
              setOpenCats((prev) => ({ ...prev, [name]: !prev[name] }));

            return (
              <div className="space-y-4">
                {/* Categories */}
                {MISTAKE_CATEGORIES.map((cat) => {
                  const catMistakes = MISTAKES.filter((m) =>
                    cat.ids.includes(m.id),
                  );
                  const isOpen = openCats[cat.name] ?? false;
                  return (
                    <div
                      key={cat.name}
                      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${cat.border}`}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        onClick={() => toggleCat(cat.name)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cat.icon}</span>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">
                              {cat.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {catMistakes.length} mistakes
                            </p>
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                            style={{ background: cat.color }}
                          >
                            {catMistakes.length}
                          </span>
                        </div>
                        <span className="text-slate-400 text-sm">
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className={`px-4 pb-4 ${cat.bg}`}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {catMistakes.map((item) => {
                              const hasRule = item.ruleId !== null;
                              const globalIdx = MISTAKES.findIndex(
                                (m) => m.id === item.id,
                              );
                              return (
                                <div
                                  key={item.id}
                                  data-ocid={`mistakes.item.${globalIdx + 1}`}
                                  className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex"
                                  style={{
                                    borderLeftColor: hasRule
                                      ? "#14b8a6"
                                      : "#cbd5e1",
                                    borderLeftWidth: 3,
                                  }}
                                >
                                  <div className="p-4 flex items-start gap-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg">
                                      {(
                                        {
                                          1: "📊",
                                          2: "📊",
                                          3: "💳",
                                          4: "🏦",
                                          5: "🎰",
                                          6: "💳",
                                          7: "👨‍👩‍👧",
                                          8: "🏥",
                                          9: "🏠",
                                          10: "👨‍👩‍👧",
                                          11: "📊",
                                          12: "🏥",
                                          13: "🧠",
                                          14: "📊",
                                          15: "🛍️",
                                          16: "💳",
                                          17: "📉",
                                          18: "📈",
                                          19: "📉",
                                          20: "🎰",
                                          21: "🌅",
                                          22: "📉",
                                          23: "💳",
                                          24: "📝",
                                          25: "💳",
                                          26: "📋",
                                          27: "🛍️",
                                          28: "🛍️",
                                          29: "💼",
                                          30: "📝",
                                          31: "🏥",
                                          32: "🏥",
                                          33: "📉",
                                          34: "🏦",
                                          35: "🛍️",
                                          36: "💼",
                                          37: "💼",
                                          38: "🏠",
                                          39: "📉",
                                          40: "📈",
                                          41: "📝",
                                          42: "🌅",
                                          43: "🏥",
                                          44: "🛍️",
                                          45: "📈",
                                          46: "🎰",
                                          47: "📝",
                                          48: "💼",
                                          49: "🎓",
                                          50: "👨‍👩‍👧",
                                        } as Record<number, string>
                                      )[item.id] ?? "📌"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-slate-800 leading-snug">
                                        {item.mistake}
                                      </p>
                                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {item.principle}
                                      </p>
                                      {item.ruleId && item.ruleName && (
                                        <button
                                          type="button"
                                          data-ocid={`mistakes.item.${globalIdx + 1}.link`}
                                          onClick={goToRulesTab}
                                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 cursor-pointer transition-colors"
                                        >
                                          → {item.ruleName}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
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
              <Label>Rule Category</Label>
              <Select
                value={dialogCategory}
                onValueChange={(v) => {
                  setDialogCategory(v);
                  setDialogRuleId("");
                }}
              >
                <SelectTrigger data-ocid="financialrules.category.select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {RULE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {dialogCategory && (
              <div>
                <Label>Rule</Label>
                <Select
                  value={dialogRuleId}
                  onValueChange={(v) => {
                    setDialogRuleId(v);
                    const rule = ALL_FINANCIAL_RULES.find((r) => r.id === v);
                    if (rule)
                      setForm((f) => ({
                        ...f,
                        name: rule.name,
                        ruleType: rule.category,
                      }));
                  }}
                >
                  <SelectTrigger data-ocid="financialrules.rule.select">
                    <SelectValue placeholder="Select a rule" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_FINANCIAL_RULES.filter(
                      (r) => r.category === dialogCategory,
                    ).map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
                readOnly
                className="bg-slate-50 text-slate-500 cursor-default"
                placeholder="Auto-filled from selected rule"
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
