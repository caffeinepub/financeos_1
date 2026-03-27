import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
const fmtC = (n: number) => `₹${fmt(n)}`;

type BudgetInputs = {
  income: number;
  rent: number;
  groceries: number;
  eatingOut: number;
  transport: number;
  subscriptions: number;
  emi: number;
  otherMisc: number;
  reductionTarget: number;
  isFreelancer: boolean;
  minIncome: number;
  maxIncome: number;
};

const SCENARIOS: {
  id: string;
  title: string;
  desc: string;
  inputs: BudgetInputs;
}[] = [
  {
    id: "standard",
    title: "Salaried: Budget Setup",
    desc: "Take-home ₹65,000. Knows main expenses but unsure where the rest goes.",
    inputs: {
      income: 65000,
      rent: 18000,
      groceries: 8000,
      eatingOut: 5000,
      transport: 3000,
      subscriptions: 2500,
      emi: 0,
      otherMisc: 0,
      reductionTarget: 0,
      isFreelancer: false,
      minIncome: 0,
      maxIncome: 0,
    },
  },
  {
    id: "leakage",
    title: "Leakage Detection",
    desc: "Earns ₹80,000 but runs out of money by the 25th every month.",
    inputs: {
      income: 80000,
      rent: 22000,
      groceries: 10000,
      eatingOut: 9000,
      transport: 5000,
      subscriptions: 3500,
      emi: 15000,
      otherMisc: 9000,
      reductionTarget: 0,
      isFreelancer: false,
      minIncome: 0,
      maxIncome: 0,
    },
  },
  {
    id: "tightening",
    title: "Budget Tightening",
    desc: "Need to reduce monthly spend by ₹10,000 without giving up gym, Netflix, or outings.",
    inputs: {
      income: 75000,
      rent: 20000,
      groceries: 9000,
      eatingOut: 7000,
      transport: 4000,
      subscriptions: 4000,
      emi: 12000,
      otherMisc: 5000,
      reductionTarget: 10000,
      isFreelancer: false,
      minIncome: 0,
      maxIncome: 0,
    },
  },
  {
    id: "freelancer",
    title: "Freelancer Variable Income",
    desc: "Monthly income swings between ₹40,000 and ₹1,20,000. Needs a stable budget.",
    inputs: {
      income: 70000,
      rent: 18000,
      groceries: 8000,
      eatingOut: 5000,
      transport: 3000,
      subscriptions: 2000,
      emi: 0,
      otherMisc: 2000,
      reductionTarget: 0,
      isFreelancer: true,
      minIncome: 40000,
      maxIncome: 120000,
    },
  },
];

type BudgetRow = {
  category: string;
  current: number;
  ideal: number;
  type: "Needs" | "Wants" | "Savings";
};
type Leakage = {
  category: string;
  amount: number;
  ideal: number;
  suggestion: string;
};
type ReductionSuggestion = { category: string; cut: number; action: string };

type BudgetResult = {
  income: number;
  totalExpenses: number;
  savings: number;
  untracked: number;
  savingsRate: number;
  needs: number;
  wants: number;
  ideal50: number;
  ideal30: number;
  ideal20: number;
  leakages: Leakage[];
  reductionSuggestions: ReductionSuggestion[];
  freelancerTips: string[];
  budgetRows: BudgetRow[];
  quickWin: string;
  isFreelancer: boolean;
  reductionTarget: number;
  minIncome: number;
  maxIncome: number;
  scenario: string;
};

function analyzeBudget(inp: BudgetInputs): {
  result: BudgetResult | null;
  error: string;
} {
  if (!inp.income || inp.income <= 0)
    return {
      result: null,
      error:
        "Monthly income must be greater than 0. Please enter your take-home pay.",
    };
  if (inp.isFreelancer && inp.minIncome <= 0)
    return {
      result: null,
      error:
        "For freelancer mode, please enter your minimum expected monthly income.",
    };
  if (inp.isFreelancer && inp.maxIncome <= inp.minIncome)
    return {
      result: null,
      error: "Maximum income must be greater than minimum income.",
    };
  if (
    [
      inp.rent,
      inp.groceries,
      inp.eatingOut,
      inp.transport,
      inp.subscriptions,
      inp.emi,
      inp.otherMisc,
    ].some((v) => v < 0)
  )
    return { result: null, error: "Expense amounts cannot be negative." };

  const effectiveIncome = inp.isFreelancer ? inp.minIncome : inp.income;
  const totalExpenses =
    inp.rent +
    inp.groceries +
    inp.eatingOut +
    inp.transport +
    inp.subscriptions +
    inp.emi +
    inp.otherMisc;
  const savings = effectiveIncome - totalExpenses;
  const untracked = savings < 0 ? Math.abs(savings) : 0;
  const actualSavings = Math.max(0, savings);
  const savingsRate = Math.round((actualSavings / effectiveIncome) * 100);
  const needs = inp.rent + inp.groceries + inp.transport + inp.emi;
  const wants = inp.eatingOut + inp.subscriptions + inp.otherMisc;
  const ideal50 = Math.round(effectiveIncome * 0.5);
  const ideal30 = Math.round(effectiveIncome * 0.3);
  const ideal20 = Math.round(effectiveIncome * 0.2);

  // Leakages
  const leakages: Leakage[] = [];
  if (inp.eatingOut > effectiveIncome * 0.07) {
    const idealEat = Math.round(effectiveIncome * 0.05);
    leakages.push({
      category: "Eating Out / Dining",
      amount: inp.eatingOut,
      ideal: idealEat,
      suggestion: `You are spending ${fmtC(inp.eatingOut)} per month on dining out — the recommended ceiling is ${fmtC(idealEat)} (5% of income). Cooking 3 extra meals at home each week typically saves ${fmtC(inp.eatingOut - idealEat)} per month with minimal lifestyle impact.`,
    });
  }
  if (inp.subscriptions > effectiveIncome * 0.025) {
    const idealSub = Math.round(effectiveIncome * 0.02);
    leakages.push({
      category: "Subscriptions & Digital Services",
      amount: inp.subscriptions,
      ideal: idealSub,
      suggestion: `Your subscriptions of ${fmtC(inp.subscriptions)} are above the recommended ${fmtC(idealSub)}. List every recurring charge and cancel any service you have not used in the past 30 days. This one action often saves ${fmtC(Math.round(inp.subscriptions * 0.35))} immediately.`,
    });
  }
  if (untracked > effectiveIncome * 0.05) {
    leakages.push({
      category: "Untracked / Unknown Spending",
      amount: untracked,
      ideal: 0,
      suggestion: `You have ${fmtC(untracked)} in unaccounted expenses. Track every purchase for 14 days using any free app. Most people recover 30–40% of this amount — in your case, approximately ${fmtC(Math.round(untracked * 0.35))} per month — simply by becoming aware of where cash goes.`,
    });
  }
  if (inp.otherMisc > effectiveIncome * 0.08) {
    const idealMisc = Math.round(effectiveIncome * 0.04);
    leakages.push({
      category: "Miscellaneous / Impulse",
      amount: inp.otherMisc,
      ideal: idealMisc,
      suggestion: `Miscellaneous spending of ${fmtC(inp.otherMisc)} is high. Apply a 48-hour pause rule before any non-essential purchase above ${fmtC(500)}. Studies show this eliminates 40% of impulse buys.`,
    });
  }
  if (leakages.length === 0) {
    leakages.push({
      category: "Dining / Entertainment",
      amount: inp.eatingOut,
      ideal: Math.round(effectiveIncome * 0.05),
      suggestion: `Your spending is well-managed. Even so, trimming dining by ${fmtC(Math.round(inp.eatingOut * 0.15))} per month adds ${fmtC(Math.round(inp.eatingOut * 0.15) * 12)} to your annual savings — enough for a vacation fund SIP.`,
    });
  }

  // Reduction suggestions
  const reductionSuggestions: ReductionSuggestion[] = [];
  if (inp.reductionTarget > 0) {
    let remaining = inp.reductionTarget;
    if (inp.eatingOut > effectiveIncome * 0.04 && remaining > 0) {
      const cut = Math.min(Math.round(inp.eatingOut * 0.4), remaining);
      reductionSuggestions.push({
        category: "Dining Out",
        cut,
        action: `Reduce from ${fmtC(inp.eatingOut)} to ${fmtC(inp.eatingOut - cut)} by cooking 3 more meals at home each week. Saves ${fmtC(cut)} per month.`,
      });
      remaining -= cut;
    }
    if (inp.subscriptions > 1500 && remaining > 0) {
      const cut = Math.min(Math.round(inp.subscriptions * 0.4), remaining);
      reductionSuggestions.push({
        category: "Subscriptions",
        cut,
        action: `Cut from ${fmtC(inp.subscriptions)} to ${fmtC(inp.subscriptions - cut)} by removing 2 infrequently used streaming or app services. Saves ${fmtC(cut)} per month.`,
      });
      remaining -= cut;
    }
    if (inp.otherMisc > 2000 && remaining > 0) {
      const cut = Math.min(Math.round(inp.otherMisc * 0.35), remaining);
      reductionSuggestions.push({
        category: "Miscellaneous",
        cut,
        action: `Trim from ${fmtC(inp.otherMisc)} to ${fmtC(inp.otherMisc - cut)} by applying a 48-hour pause before non-essential purchases. Saves ${fmtC(cut)} per month.`,
      });
      remaining -= cut;
    }
    if (inp.transport > effectiveIncome * 0.07 && remaining > 0) {
      const cut = Math.min(Math.round(inp.transport * 0.25), remaining);
      reductionSuggestions.push({
        category: "Transport / Fuel",
        cut,
        action: `Reduce from ${fmtC(inp.transport)} to ${fmtC(inp.transport - cut)} by combining errands and using public transport 2 days per week. Saves ${fmtC(cut)} per month.`,
      });
      remaining -= cut;
    }
    const achieved = inp.reductionTarget - remaining;
    if (achieved < inp.reductionTarget && remaining > 0) {
      reductionSuggestions.push({
        category: "Additional Cuts Needed",
        cut: remaining,
        action: `You still need to find ${fmtC(remaining)} more in savings. Consider temporarily pausing one luxury (gym, OTT bundle) or negotiating a lower rent or phone plan.`,
      });
    }
  }

  // Freelancer tips
  const freelancerTips: string[] = [];
  if (inp.isFreelancer) {
    freelancerTips.push(
      `Base your entire fixed budget on your LOWEST expected monthly income of ${fmtC(inp.minIncome)}. Anything earned above this is surplus — never spend it until the month is closed.`,
    );
    freelancerTips.push(
      `Build a 6-month operating buffer of ${fmtC(totalExpenses * 6)} before increasing any lifestyle spend. This is your runway if income drops.`,
    );
    freelancerTips.push(
      `Pay yourself a fixed "salary" of ${fmtC(Math.round(inp.minIncome * 0.8))} from your business account each month. Deposit the rest into a separate opportunity/tax account.`,
    );
    freelancerTips.push(
      `In high-income months (above ${fmtC(Math.round((inp.minIncome + inp.maxIncome) / 2))}), direct 50% of the surplus into an FD or Liquid Mutual Fund — not lifestyle upgrades.`,
    );
    freelancerTips.push(
      "Set aside 30% of every invoice received for advance tax and GST. Failing to do this is the single biggest financial mistake freelancers make.",
    );
  }

  const budgetRows: BudgetRow[] = [
    {
      category: "Housing / Rent",
      current: inp.rent,
      ideal: Math.round(effectiveIncome * 0.27),
      type: "Needs",
    },
    {
      category: "Groceries & Daily Food",
      current: inp.groceries,
      ideal: Math.round(effectiveIncome * 0.1),
      type: "Needs",
    },
    {
      category: "Transport / Fuel",
      current: inp.transport,
      ideal: Math.round(effectiveIncome * 0.05),
      type: "Needs",
    },
    {
      category: "EMI Payments",
      current: inp.emi,
      ideal: Math.round(effectiveIncome * 0.08),
      type: "Needs",
    },
    {
      category: "Dining Out / Eating Out",
      current: inp.eatingOut,
      ideal: Math.round(effectiveIncome * 0.05),
      type: "Wants",
    },
    {
      category: "Subscriptions & Digital",
      current: inp.subscriptions,
      ideal: Math.round(effectiveIncome * 0.02),
      type: "Wants",
    },
    {
      category: "Miscellaneous / Other",
      current: inp.otherMisc,
      ideal: Math.round(effectiveIncome * 0.03),
      type: "Wants",
    },
    {
      category: "Savings / Investments / SIP",
      current: actualSavings,
      ideal: Math.round(effectiveIncome * 0.2),
      type: "Savings",
    },
  ];

  const quickWin =
    actualSavings > 1000
      ? `Start a monthly SIP of ${fmtC(Math.max(1000, Math.round(actualSavings * 0.5)))} in a Liquid Fund today. You already have the surplus — put it to work before it disappears. Set up auto-debit on salary day.`
      : `Open a zero-balance savings account and transfer ${fmtC(Math.max(500, Math.round(effectiveIncome * 0.03)))} on the day your salary arrives — before any spending. This "pay yourself first" habit creates the savings habit even when money feels tight.`;

  return {
    result: {
      income: effectiveIncome,
      totalExpenses,
      savings: actualSavings,
      untracked,
      savingsRate,
      needs,
      wants,
      ideal50,
      ideal30,
      ideal20,
      leakages,
      reductionSuggestions,
      freelancerTips,
      budgetRows,
      quickWin,
      isFreelancer: inp.isFreelancer,
      reductionTarget: inp.reductionTarget,
      minIncome: inp.minIncome,
      maxIncome: inp.maxIncome,
      scenario: "",
    },
    error: "",
  };
}

function numField(
  label: string,
  value: number,
  onChange: (v: number) => void,
  hint?: string,
) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <Input
        type="number"
        min={0}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="h-8 text-sm"
        placeholder="0"
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function ModelBudgetingTab({
  initialScenario,
}: { initialScenario?: string } = {}) {
  const initScenario =
    SCENARIOS.find((s) => s.id === initialScenario) ?? SCENARIOS[0];
  const [inputs, setInputs] = useState<BudgetInputs>(initScenario.inputs);
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [_activeScenario, setActiveScenario] = useState(initScenario.id);
  const [view, setView] = useState<"menu" | "detail">(
    initialScenario ? "detail" : "menu",
  );

  const set = (field: keyof BudgetInputs) => (val: number | boolean) =>
    setInputs((prev) => ({ ...prev, [field]: val }));

  const loadScenario = (s: (typeof SCENARIOS)[0]) => {
    setInputs(s.inputs);
    setActiveScenario(s.id);
    setResult(null);
    setError("");
  };

  const handleAnalyze = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const { result: r, error: e } = analyzeBudget(inputs);
      if (r) setResult(r);
      else setError(e);
      setLoading(false);
    }, 600);
  };

  const res = result;

  if (view === "menu") {
    const SCENARIO_COLORS_BUDGETING = [
      "#10b981",
      "#3b82f6",
      "#f59e0b",
      "#a855f7",
      "#f43f5e",
    ];
    return (
      <div className="space-y-3 animate-fade-in">
        <div className="flex items-center gap-3 px-1 mb-4">
          <Wallet className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Budgeting &amp; Expense Tracking Model
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a scenario to explore. Pre-filled with realistic numbers
              you can edit.
            </p>
          </div>
        </div>
        {SCENARIOS.map((s, idx) => {
          const accentColor =
            SCENARIO_COLORS_BUDGETING[idx % SCENARIO_COLORS_BUDGETING.length];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                loadScenario(s);
                setView("detail");
              }}
              className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl overflow-hidden transition-all duration-200 group"
              style={{ borderLeftColor: accentColor, borderLeftWidth: 4 }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: accentColor }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-100 truncate">
                    {s.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
              </div>
              <div className="px-4 pb-3">
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
        <Wallet className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-blue-800">
            Budgeting & Expense Tracking Model
          </h3>
          <p className="text-xs text-blue-600 mt-0.5">
            Enter your monthly income and expenses below. Select a scenario to
            pre-fill sample numbers, then update any value to match your
            situation and click Analyze.
          </p>
        </div>
      </div>

      {/* Input Fields */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
          Monthly Income
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {numField(
            "Take-Home Income (₹)",
            inputs.income,
            set("income") as (v: number) => void,
            "After tax and deductions",
          )}
          {inputs.isFreelancer &&
            numField(
              "Minimum Monthly Income (₹)",
              inputs.minIncome,
              set("minIncome") as (v: number) => void,
              "Budget based on this floor",
            )}
          {inputs.isFreelancer &&
            numField(
              "Maximum Monthly Income (₹)",
              inputs.maxIncome,
              set("maxIncome") as (v: number) => void,
              "Your best month",
            )}
        </div>

        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide pt-2">
          Fixed Expenses (Needs)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {numField(
            "Rent / Housing (₹)",
            inputs.rent,
            set("rent") as (v: number) => void,
          )}
          {numField(
            "Groceries / Daily Food (₹)",
            inputs.groceries,
            set("groceries") as (v: number) => void,
          )}
          {numField(
            "Transport / Fuel (₹)",
            inputs.transport,
            set("transport") as (v: number) => void,
          )}
          {numField(
            "EMI Payments (₹)",
            inputs.emi,
            set("emi") as (v: number) => void,
            "All loan EMIs combined",
          )}
        </div>

        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide pt-2">
          Variable Expenses (Wants)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {numField(
            "Eating Out / Dining (₹)",
            inputs.eatingOut,
            set("eatingOut") as (v: number) => void,
          )}
          {numField(
            "Subscriptions (₹)",
            inputs.subscriptions,
            set("subscriptions") as (v: number) => void,
            "OTT, gym, apps, etc.",
          )}
          {numField(
            "Miscellaneous / Other (₹)",
            inputs.otherMisc,
            set("otherMisc") as (v: number) => void,
            "Shopping, personal care, etc.",
          )}
        </div>

        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide pt-2">
          Goals (Optional)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {numField(
            "Monthly Reduction Target (₹)",
            inputs.reductionTarget,
            set("reductionTarget") as (v: number) => void,
            "How much you want to cut (0 = skip)",
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="freelancer"
            checked={inputs.isFreelancer}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, isFreelancer: e.target.checked }))
            }
            className="w-4 h-4 accent-blue-600"
          />
          <label
            htmlFor="freelancer"
            className="text-xs text-slate-600 font-medium"
          >
            I am a freelancer / have variable income
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        {loading ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Analyzing your budget...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Analyze My Budget
          </>
        )}
      </Button>

      {/* Results */}
      {res && (
        <div className="space-y-4 mt-2">
          {/* Freelancer Warning */}
          {res.isFreelancer && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>Freelancer Mode:</strong> Budget is calculated on your
                minimum income of {fmtC(res.minIncome)} per month. On
                high-income months (above{" "}
                {fmtC(Math.round((res.minIncome + res.maxIncome) / 2))}), your
                surplus could reach {fmtC(res.maxIncome - res.totalExpenses)} —
                treat this as investment capital, not spending money.
              </p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-500 font-medium">
                Monthly Income
              </p>
              <p className="text-sm font-bold text-blue-700 mt-0.5">
                {fmtC(res.income)}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-500 font-medium">
                Needs (50% ideal)
              </p>
              <p className="text-sm font-bold text-amber-700 mt-0.5">
                {fmtC(res.needs)}
              </p>
              <p className="text-xs text-amber-400">
                {fmtC(res.ideal50)} ideal
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
              <p className="text-xs text-purple-500 font-medium">
                Wants (30% ideal)
              </p>
              <p className="text-sm font-bold text-purple-700 mt-0.5">
                {fmtC(res.wants)}
              </p>
              <p className="text-xs text-purple-400">
                {fmtC(res.ideal30)} ideal
              </p>
            </div>
            <div
              className={`${res.savingsRate >= 20 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"} border rounded-xl p-3 text-center`}
            >
              <p
                className={`text-xs font-medium ${res.savingsRate >= 20 ? "text-green-500" : "text-red-500"}`}
              >
                Savings Rate
              </p>
              <p
                className={`text-sm font-bold mt-0.5 ${res.savingsRate >= 20 ? "text-green-700" : "text-red-700"}`}
              >
                {res.savingsRate}%
              </p>
              <p
                className={`text-xs ${res.savingsRate >= 20 ? "text-green-400" : "text-red-400"}`}
              >
                20% is minimum
              </p>
            </div>
          </div>

          {/* Savings Rate Message */}
          <div
            className={`flex items-start gap-2 p-3 rounded-xl text-sm ${res.savingsRate >= 20 ? "bg-green-50 text-green-800" : res.savingsRate >= 10 ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-800"}`}
          >
            {res.savingsRate >= 20 ? (
              <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
              <TrendingDown className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <span>
              {res.savingsRate >= 20 && (
                <>
                  You are saving <strong>{fmtC(res.savings)}</strong> per month
                  — a healthy <strong>{res.savingsRate}%</strong> of income. The
                  recommended minimum is 20%. You are on track. Consider
                  increasing your SIP by {fmtC(Math.round(res.savings * 0.2))}{" "}
                  to accelerate wealth building.
                </>
              )}
              {res.savingsRate >= 10 && res.savingsRate < 20 && (
                <>
                  You are saving <strong>{fmtC(res.savings)}</strong> per month
                  (<strong>{res.savingsRate}%</strong>). The recommended minimum
                  is 20%, which means {fmtC(res.ideal20)} per month on your
                  income. You need to find {fmtC(res.ideal20 - res.savings)}{" "}
                  more per month in cuts. The top leakages below will help you
                  find it.
                </>
              )}
              {res.savingsRate < 10 && (
                <>
                  You are saving only <strong>{fmtC(res.savings)}</strong> per
                  month (<strong>{res.savingsRate}%</strong> of income). This is
                  significantly below the 20% minimum of {fmtC(res.ideal20)}.
                  Left unaddressed, this means{" "}
                  {fmtC((res.ideal20 - res.savings) * 12)} less invested per
                  year. The leakage analysis below will help identify where to
                  start.
                </>
              )}
              {res.untracked > 0 && (
                <span className="block mt-1 text-xs font-semibold">
                  ⚠️ Warning: {fmtC(res.untracked)} of your income is unaccounted
                  for. This is the first thing to fix.
                </span>
              )}
            </span>
          </div>

          {/* Budget Table */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">
              📋 Monthly Budget Plan — 50/30/20 Rule
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-2.5 font-semibold text-slate-600">
                      Category
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Your Spend
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Ideal (50/30/20)
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Difference
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {res.budgetRows.map((row) => {
                    const diff = row.current - row.ideal;
                    const over = diff > 0 && row.type !== "Savings";
                    const under = row.type === "Savings" && diff < 0;
                    return (
                      <tr
                        key={row.category}
                        className="border-t border-slate-50 hover:bg-slate-50/50"
                      >
                        <td className="p-2.5 font-medium text-slate-700">
                          {row.category}
                        </td>
                        <td
                          className={`p-2.5 text-right font-semibold ${over ? "text-red-600" : under ? "text-amber-600" : "text-slate-600"}`}
                        >
                          {fmtC(row.current)}
                        </td>
                        <td className="p-2.5 text-right text-green-600 font-semibold">
                          {fmtC(row.ideal)}
                        </td>
                        <td
                          className={`p-2.5 text-right text-xs font-bold ${over ? "text-red-500" : under ? "text-amber-500" : "text-green-500"}`}
                        >
                          {diff === 0
                            ? "✓"
                            : over
                              ? `+${fmtC(diff)} over`
                              : `${fmtC(Math.abs(diff))} under`}
                        </td>
                        <td className="p-2.5 text-right">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              row.type === "Needs"
                                ? "bg-amber-100 text-amber-700"
                                : row.type === "Wants"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leakages */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">
              🔍 Top Money Leakage Areas
            </h4>
            <div className="space-y-2">
              {res.leakages.map((l, i) => (
                <div
                  key={l.category}
                  className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3"
                >
                  <span className="text-red-500 font-bold text-sm shrink-0">
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      {l.category} — {fmtC(l.amount)}/month
                      {l.ideal > 0 ? ` (ideal: ${fmtC(l.ideal)})` : ""}
                    </p>
                    <p className="text-xs text-red-600 mt-0.5">
                      {l.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reduction Plan */}
          {res.reductionTarget > 0 && res.reductionSuggestions.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">
                ✂️ How to Cut {fmtC(res.reductionTarget)}/month Without
                Sacrificing Lifestyle
              </h4>
              <div className="space-y-2">
                {res.reductionSuggestions.map((r, idx) => (
                  <div
                    key={r.category}
                    className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3"
                  >
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-indigo-800">
                        {r.category} — Save {fmtC(r.cut)}/month
                      </p>
                      <p className="text-xs text-indigo-700 mt-0.5">
                        {r.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Total achievable reduction:{" "}
                {fmtC(res.reductionSuggestions.reduce((s, r) => s + r.cut, 0))}
                /month — that's{" "}
                {fmtC(
                  res.reductionSuggestions.reduce((s, r) => s + r.cut, 0) * 12,
                )}{" "}
                saved per year.
              </p>
            </div>
          )}

          {/* Freelancer Tips */}
          {res.isFreelancer && res.freelancerTips.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">
                💼 Freelancer-Specific Budget Rules
              </h4>
              <div className="space-y-2">
                {res.freelancerTips.map((tip) => (
                  <div
                    key={tip.substring(0, 30)}
                    className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl p-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-teal-800">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Win */}
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-700">
                ⚡ Your Quick Win — Do This Today
              </p>
              <p className="text-sm text-emerald-700 mt-0.5">{res.quickWin}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
