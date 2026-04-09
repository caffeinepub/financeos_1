import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Info,
  Plus,
  Sparkles,
  Star,
  Target,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useActor } from "../../hooks/useActor";

const _fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
// Module-level formatter (used in analyzeGoals for text notes)
const fmtModuleLevel = (n: number, sym = "₹") => `${sym}${_fmt(n)}`;

const INFLATION_RATE = 0.06;

function sipRequired(
  target: number,
  annualRate: number,
  years: number,
): number {
  if (years <= 0 || target <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r <= 0) return Math.round(target / n);
  return Math.round((target * r) / ((1 + r) ** n - 1));
}

function getInstrument(years: number): { name: string; reason: string } {
  if (years <= 1)
    return {
      name: "Savings Account / Liquid Fund",
      reason:
        "Very short horizon. Capital safety is paramount. No market exposure.",
    };
  if (years <= 3)
    return {
      name: "Short-term Debt Fund / Bank FD",
      reason:
        "Short horizon. Debt funds offer better post-tax returns than FDs for amounts above \u20b95,00,000.",
    };
  if (years <= 5)
    return {
      name: "Hybrid / Balanced Advantage Fund",
      reason:
        "Medium horizon. Balanced funds reduce volatility while capturing some equity upside.",
    };
  if (years <= 7)
    return {
      name: "Aggressive Hybrid / ELSS Fund",
      reason:
        "7-year horizon allows meaningful equity exposure. ELSS also provides Section 80C tax benefit.",
    };
  return {
    name: "Equity Mutual Fund SIP / NPS",
    reason:
      "Long horizon. Equity compounding at 12% over 10+ years is the most powerful wealth builder available.",
  };
}

function getReturnRate(years: number): number {
  if (years <= 1) return 5;
  if (years <= 3) return 7;
  if (years <= 5) return 9;
  if (years <= 7) return 10;
  return 12;
}

function getGoalEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("car") || n.includes("vehicle") || n.includes("bike"))
    return "🚗";
  if (
    n.includes("home") ||
    n.includes("house") ||
    n.includes("flat") ||
    n.includes("apartment")
  )
    return "🏠";
  if (
    n.includes("education") ||
    n.includes("child") ||
    n.includes("college") ||
    n.includes("school")
  )
    return "🎓";
  if (n.includes("retire")) return "🌅";
  if (
    n.includes("vacation") ||
    n.includes("travel") ||
    n.includes("trip") ||
    n.includes("holiday")
  )
    return "✈️";
  if (n.includes("wedding") || n.includes("marriage")) return "💍";
  if (n.includes("emergency")) return "🛡️";
  if (n.includes("business") || n.includes("startup")) return "💼";
  return "🎯";
}

type GoalEntry = {
  id: number;
  name: string;
  targetToday: number;
  years: number;
  availableToday?: number;
};

const SCENARIOS: {
  id: string;
  title: string;
  desc: string;
  goals: Omit<GoalEntry, "id">[];
  monthlyAvailable: number;
  currentAge: number;
  retirementAge: number;
}[] = [
  {
    id: "single",
    title: "Single Goal: Buy a Car",
    desc: "Car worth \u20b98,00,000 in 3 years. No loan. How much to save monthly?",
    goals: [{ name: "Buy a Car", targetToday: 800000, years: 3 }],
    monthlyAvailable: 20000,
    currentAge: 28,
    retirementAge: 60,
  },
  {
    id: "multi",
    title: "3 Goals, \u20b920,000/month",
    desc: "Child education in 12 yrs (\u20b930L today), home down payment in 5 yrs (\u20b915L), retirement. Split \u20b920,000/month.",
    goals: [
      { name: "Child Education", targetToday: 3000000, years: 12 },
      { name: "Home Down Payment", targetToday: 1500000, years: 5 },
      { name: "Retirement Corpus", targetToday: 24000000, years: 28 },
    ],
    monthlyAvailable: 20000,
    currentAge: 32,
    retirementAge: 60,
  },
  {
    id: "retire",
    title: "Retirement at 55",
    desc: "Age 32. Retire at 55 with \u20b980,000/month in today\u2019s value. Monthly SIP required?",
    goals: [{ name: "Retirement Corpus", targetToday: 24000000, years: 23 }],
    monthlyAvailable: 30000,
    currentAge: 32,
    retirementAge: 55,
  },
  {
    id: "delay",
    title: "Cost of 2-Year Delay",
    desc: "Age 30, want to retire at 60. Started investing 2 years late. What did waiting cost?",
    goals: [{ name: "Retirement Corpus", targetToday: 30000000, years: 30 }],
    monthlyAvailable: 15000,
    currentAge: 30,
    retirementAge: 60,
  },
  {
    id: "raise",
    title: "Income Increase, Reprioritize",
    desc: "Income up by \u20b915,000/month. Existing child education SIP running. How to allocate the extra?",
    goals: [
      { name: "Child Education (Existing)", targetToday: 2500000, years: 10 },
      { name: "Retirement Corpus", targetToday: 20000000, years: 25 },
      { name: "Emergency Fund", targetToday: 300000, years: 2 },
      { name: "Vacation Fund", targetToday: 200000, years: 3 },
    ],
    monthlyAvailable: 35000,
    currentAge: 35,
    retirementAge: 60,
  },
];

type GoalResult = {
  name: string;
  emoji: string;
  targetToday: number;
  targetInflated: number;
  years: number;
  returnRate: number;
  sipRequired: number;
  sipNoReturn: number;
  availableToday: number;
  fvAvailable: number;
  instrument: { name: string; reason: string };
};

type GoalAnalysis = {
  goals: GoalResult[];
  totalSIPRequired: number;
  monthlyAvailable: number;
  surplus: number;
  allocationSplit: { goal: string; amount: number; pct: number }[];
  delayImpact: {
    primaryGoal: string;
    sipNow: number;
    sipDelay2yrs: number;
    costOfDelay: number;
    totalLostDelay2: number;
  };
  retirementNote: string;
  insufficientNote: string;
};

function analyzeGoals(
  goals: GoalEntry[],
  monthlyAvailable: number,
  currentAge: number,
): { result: GoalAnalysis | null; error: string } {
  const retirementAge = 65;
  const valid = goals.filter((g) => g.targetToday > 0 && g.years > 0);
  if (valid.length === 0)
    return {
      result: null,
      error:
        "Please add at least one goal with a target amount greater than 0 and years greater than 0.",
    };
  if (valid.some((g) => g.targetToday < 0))
    return { result: null, error: "Goal target amounts cannot be negative." };
  if (valid.some((g) => g.years <= 0))
    return { result: null, error: "Years to goal must be at least 1." };
  if (valid.some((g) => g.years > 50))
    return {
      result: null,
      error: "Years to goal cannot exceed 50. Please check your entries.",
    };
  if (currentAge <= 0 || currentAge > 80)
    return {
      result: null,
      error: "Please enter a valid current age between 1 and 80.",
    };
  if (retirementAge <= currentAge) {
    // Use a safe fallback - retirement age defaults to 65
  }

  const goalResults: GoalResult[] = valid.map((g) => {
    const inflated = g.targetToday * (1 + INFLATION_RATE) ** g.years;
    const rate = getReturnRate(g.years);
    const fvAvailable = (g.availableToday ?? 0) * (1 + rate / 100) ** g.years;
    const adjustedTarget = Math.max(0, inflated - fvAvailable);
    const sip = sipRequired(adjustedTarget, rate, g.years);
    const sipNR =
      g.years > 0
        ? Math.round(adjustedTarget / (g.years * 12))
        : adjustedTarget;
    return {
      name: g.name,
      emoji: getGoalEmoji(g.name),
      targetToday: g.targetToday,
      targetInflated: Math.round(inflated),
      years: g.years,
      returnRate: rate,
      sipRequired: sip,
      sipNoReturn: sipNR,
      availableToday: g.availableToday ?? 0,
      fvAvailable: Math.round(fvAvailable),
      instrument: getInstrument(g.years),
    };
  });

  const totalSIPRequired = goalResults.reduce((s, g) => s + g.sipRequired, 0);
  const surplus = monthlyAvailable - totalSIPRequired;

  // Allocation split proportional to SIP required
  const allocationSplit = goalResults.map((g) => ({
    goal: g.name,
    amount: Math.round(monthlyAvailable * (g.sipRequired / totalSIPRequired)),
    pct: Math.round((g.sipRequired / totalSIPRequired) * 100),
  }));

  // Cost of delay for primary goal
  const primary = goalResults[0];
  const sipNow = primary.sipRequired;
  const _avail = primary.availableToday ?? 0;
  const _delayYears = Math.max(1, primary.years - 2);
  const _rate = primary.returnRate;
  const _fvAvailableDelay =
    _avail > 0 ? _avail * (1 + _rate / 100) ** _delayYears : 0;
  const _adjustedDelayTarget = Math.max(
    0,
    primary.targetInflated - _fvAvailableDelay,
  );
  const sipDelay2 = sipRequired(_adjustedDelayTarget, _rate, _delayYears);
  const costOfDelay = Math.round(
    (sipDelay2 - sipNow) * (primary.years - 2) * 12,
  );
  const totalLostDelay2 = Math.round(
    sipNow * 24 * (1 + primary.returnRate / 100) ** (primary.years - 1),
  );

  // Notes
  const hasRetirement = goalResults.some((g) =>
    g.name.toLowerCase().includes("retire"),
  );
  const retirementGoal = goalResults.find((g) =>
    g.name.toLowerCase().includes("retire"),
  );
  const retirementNote =
    hasRetirement && retirementGoal
      ? `Retirement Planning: To generate ${fmtModuleLevel(Math.round(retirementGoal.targetToday / 12 / 25))} per month in today's value at age ${retirementAge}, you need a corpus of ${fmtModuleLevel(retirementGoal.targetToday)} today — or ${fmtModuleLevel(retirementGoal.targetInflated)} at retirement after ${INFLATION_RATE * 100}% annual inflation over ${retirementGoal.years} years. At ${retirementGoal.returnRate}% equity returns, your required SIP is ${fmtModuleLevel(retirementGoal.sipRequired)} per month. Starting at age ${currentAge} gives you ${retirementGoal.years * 12} months of compounding. Every year delayed raises your required SIP by approximately ${fmtModuleLevel(Math.round(sipRequired(retirementGoal.targetInflated, retirementGoal.returnRate, retirementGoal.years - 1) - retirementGoal.sipRequired))} per month.`
      : "";

  const insufficientNote =
    surplus < 0
      ? `You need ${fmtModuleLevel(totalSIPRequired)} per month for all your goals but have ${fmtModuleLevel(monthlyAvailable)} available — a shortfall of ${fmtModuleLevel(Math.abs(surplus))} per month. Options: (1) Extend timelines for lower-priority goals. (2) Reduce target amounts on flexible goals like vacation. (3) Increase income or reduce expenses. (4) Start with your top-priority goal only and add others as income grows.`
      : "";

  return {
    result: {
      goals: goalResults,
      totalSIPRequired,
      monthlyAvailable,
      surplus,
      allocationSplit,
      delayImpact: {
        primaryGoal: primary.name,
        sipNow,
        sipDelay2yrs: sipDelay2,
        costOfDelay,
        totalLostDelay2,
      },
      retirementNote,
      insufficientNote,
    },
    error: "",
  };
}

let nextId = 1;

export function ModelGoalPlanningTab({
  initialScenario,
}: { initialScenario?: string } = {}) {
  const { actor } = useActor();
  const { formatCurrency } = useCurrency();
  const fmtC = (n: number) => formatCurrency(n);
  const [planMode, setPlanMode] = useState<"single" | "multi">("single");
  const initScenario =
    SCENARIOS.find((s) => s.id === (initialScenario ?? "single")) ??
    SCENARIOS[0];
  const [goals, setGoals] = useState<GoalEntry[]>(
    initScenario.goals.map((g) => ({ ...g, id: nextId++, availableToday: 0 })),
  );
  const [monthlyAvailable, setMonthlyAvailable] = useState(
    initScenario.monthlyAvailable,
  );
  const [currentAge, setCurrentAge] = useState<number>(() => {
    const dob = localStorage.getItem("gff_dob");
    if (dob) {
      const age = Math.floor(
        (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000),
      );
      if (age > 0 && age < 100) return age;
    }
    return initScenario.currentAge;
  });
  const [result, setResult] = useState<GoalAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingToTrack, setAddingToTrack] = useState(false);
  const [error, setError] = useState("");
  const [_activeScenario, setActiveScenario] = useState(initScenario.id);

  const loadScenario = (s: (typeof SCENARIOS)[0]) => {
    setGoals(s.goals.map((g) => ({ ...g, id: nextId++, availableToday: 0 })));
    setMonthlyAvailable(s.monthlyAvailable);
    setActiveScenario(s.id);
    setResult(null);
    setError("");
  };

  const updateGoal = (
    id: number,
    field: keyof GoalEntry,
    value: string | number,
  ) =>
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              [field]: typeof value === "string" ? value : Number(value) || 0,
            }
          : g,
      ),
    );

  const addGoal = () =>
    setGoals((prev) => [
      ...prev,
      {
        id: nextId++,
        name: "New Goal",
        targetToday: 500000,
        years: 5,
        availableToday: 0,
      },
    ]);
  const removeGoal = (id: number) =>
    setGoals((prev) => prev.filter((g) => g.id !== id));

  const handleAnalyze = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const { result: r, error: e } = analyzeGoals(
        goals,
        monthlyAvailable,
        currentAge,
      );
      if (r) setResult(r);
      else setError(e);
      setLoading(false);
    }, 700);
  };

  const res = result;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Planning Mode Radio Buttons */}
      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <span className="text-xs font-semibold text-slate-600">
          Planning Mode:
        </span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="planMode"
            value="single"
            checked={planMode === "single"}
            onChange={() => {
              setPlanMode("single");
              const s = SCENARIOS.find((sc) => sc.id === "single");
              if (s) {
                loadScenario(s);
              }
              setResult(null);
            }}
            className="accent-green-600"
          />
          <span className="text-xs font-medium text-slate-700">
            Single Goal
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="planMode"
            value="multi"
            checked={planMode === "multi"}
            onChange={() => {
              setPlanMode("multi");
              const s = SCENARIOS.find((sc) => sc.id === "multi");
              if (s) {
                loadScenario(s);
              }
              setResult(null);
            }}
            className="accent-green-600"
          />
          <span className="text-xs font-medium text-slate-700">Multi Goal</span>
        </label>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
          Your Profile
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-600">
              Current Age
            </Label>
            <Input
              type="number"
              min={18}
              max={80}
              value={currentAge || ""}
              onChange={(e) => setCurrentAge(Number(e.target.value) || 0)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Label className="text-xs font-semibold text-slate-600">
                Monthly Savings
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Total you can invest each month across all goals
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="number"
              min={0}
              value={monthlyAvailable || ""}
              onChange={(e) => setMonthlyAvailable(Number(e.target.value) || 0)}
              className="h-8 text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Your Goals
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={addGoal}
            className="h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Goal
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-1.5 pr-2 font-semibold text-slate-500">
                  Goal Name
                </th>
                <th className="text-right py-1.5 px-2 font-semibold text-slate-500">
                  Target Today
                </th>
                <th className="text-right py-1.5 px-2 font-semibold text-slate-500">
                  Years to Goal
                </th>
                <th className="text-right py-1.5 px-2 font-semibold text-slate-500">
                  Available Today
                </th>
                <th className="py-1.5" />
              </tr>
            </thead>
            <tbody>
              {goals.map((g) => (
                <tr key={g.id} className="border-b border-slate-50">
                  <td className="py-1.5 pr-2">
                    <Input
                      value={g.name}
                      onChange={(e) => updateGoal(g.id, "name", e.target.value)}
                      className="h-7 text-xs min-w-[130px]"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={0}
                      value={g.targetToday || ""}
                      onChange={(e) =>
                        updateGoal(g.id, "targetToday", e.target.value)
                      }
                      className="h-7 text-xs text-right min-w-[110px]"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={g.years || ""}
                      onChange={(e) =>
                        updateGoal(g.id, "years", e.target.value)
                      }
                      className="h-7 text-xs text-right min-w-[60px]"
                      placeholder="5"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={0}
                      value={(g.availableToday ?? 0) || ""}
                      onChange={(e) =>
                        updateGoal(g.id, "availableToday", e.target.value)
                      }
                      className="h-7 text-xs text-right min-w-[110px]"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-1.5 pl-1">
                    {goals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(g.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400">
          Target Today = the cost in today's money. The model will automatically
          inflate it at 6% per year to calculate your future target.
        </p>
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
        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
      >
        {loading ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Building your goal plan...
          </>
        ) : (
          <>
            <ArrowRight className="w-4 h-4 mr-2" />
            Build My Goal Plan
          </>
        )}
      </Button>

      {/* Results */}
      {res && (
        <div className="space-y-4 mt-2">
          {/* Insufficient Warning */}
          {res.insufficientNote && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800">
                  ⚠️ Monthly Savings Shortfall
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  {res.insufficientNote}
                </p>
              </div>
            </div>
          )}

          {res.surplus >= 0 && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
              <Star className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <p className="text-xs text-green-800">
                Your monthly savings of {fmtC(res.monthlyAvailable)} are{" "}
                <strong>sufficient</strong> to fund all your goals. You will
                have {fmtC(res.surplus)} per month as surplus after allocating
                to all goals. Consider investing this surplus in an index fund
                or NPS for additional wealth creation.
              </p>
            </div>
          )}

          {/* Goal Cards */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">
              🎯 Your Goal Plan — Inflation-Adjusted
            </h4>
            <div className="space-y-3">
              {res.goals.map((g) => (
                <div
                  key={g.name}
                  className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{g.emoji}</span>
                      <span className="text-sm font-bold text-slate-800">
                        {g.name}
                      </span>
                    </div>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {g.years} years
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-400">Target Today</p>
                      <p className="font-bold text-slate-700 mt-0.5">
                        {fmtC(g.targetToday)}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2">
                      <p className="text-orange-400">
                        Inflation-Adjusted (@6%)
                      </p>
                      <p className="font-bold text-orange-700 mt-0.5">
                        {fmtC(g.targetInflated)}
                      </p>
                      {g.availableToday > 0 && (
                        <p className="text-orange-300 text-[10px]">
                          Available FV: {fmtC(g.fvAvailable)}
                        </p>
                      )}
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-green-400">
                        SIP Required (@{g.returnRate}%)
                      </p>
                      <p className="font-bold text-green-700 mt-0.5">
                        {fmtC(g.sipRequired)}
                      </p>
                      <p className="text-green-300 text-xs">
                        Without returns: {fmtC(g.sipNoReturn)}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-blue-400">Best Instrument</p>
                      <p className="font-bold text-blue-700 mt-0.5 leading-tight">
                        {g.instrument.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-500">
                      💡 <strong>Why this instrument:</strong>{" "}
                      {g.instrument.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation Split */}
          {res.goals.length > 1 && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">
                📊 Priority Goal Stack — How to Split{" "}
                {fmtC(res.monthlyAvailable)}/month
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-2.5 font-semibold text-slate-600">
                        Goal
                      </th>
                      <th className="text-right p-2.5 font-semibold text-slate-600">
                        SIP Required
                      </th>
                      <th className="text-right p-2.5 font-semibold text-slate-600">
                        Suggested Allocation
                      </th>
                      <th className="text-right p-2.5 font-semibold text-slate-600">
                        Share
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.goals.map((g, i) => (
                      <tr key={g.name} className="border-t border-slate-50">
                        <td className="p-2.5 font-medium text-slate-700">
                          {g.emoji} {g.name}
                        </td>
                        <td className="p-2.5 text-right text-slate-600">
                          {fmtC(g.sipRequired)}/mo
                        </td>
                        <td className="p-2.5 text-right font-bold text-indigo-600">
                          {fmtC(res.allocationSplit[i]?.amount || 0)}/mo
                        </td>
                        <td className="p-2.5 text-right">
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            {res.allocationSplit[i]?.pct || 0}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                      <td className="p-2.5 text-slate-700">Total</td>
                      <td className="p-2.5 text-right text-slate-800">
                        {fmtC(res.totalSIPRequired)}/mo
                      </td>
                      <td className="p-2.5 text-right text-slate-800">
                        {fmtC(res.monthlyAvailable)}/mo
                      </td>
                      <td className="p-2.5 text-right text-slate-500">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Retirement Note */}
          {res.retirementNote && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
              <Star className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">
                  🌅 Retirement Deep Dive
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  {res.retirementNote}
                </p>
              </div>
            </div>
          )}

          {/* Cost of Delay */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">
              ⏰ Start Today vs Wait 2 Years — Cost of Delay (
              {res.delayImpact.primaryGoal})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 text-center">
                <p className="text-xs text-green-600 font-semibold">
                  If You Start TODAY
                </p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {fmtC(res.delayImpact.sipNow)}
                  <span className="text-xs font-normal">/month</span>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Lower monthly commitment. More compounding time.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-xs text-red-500 font-semibold">
                  If You Wait 2 Years
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {fmtC(res.delayImpact.sipDelay2yrs)}
                  <span className="text-xs font-normal">/month</span>
                </p>
                <p className="text-xs text-red-500 mt-1">
                  Extra per month:{" "}
                  <strong>
                    {fmtC(
                      res.delayImpact.sipDelay2yrs - res.delayImpact.sipNow,
                    )}
                  </strong>
                </p>
                <p className="text-xs text-red-500">
                  Total compounding lost:{" "}
                  <strong>{fmtC(res.delayImpact.totalLostDelay2)}</strong>
                </p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
              <p className="text-xs text-slate-600">
                💡 <strong>The Math:</strong> Waiting 2 years means you need{" "}
                {fmtC(res.delayImpact.sipDelay2yrs - res.delayImpact.sipNow)}{" "}
                more per month for the remaining years to hit the same target.
                The total additional contribution required is approximately{" "}
                {fmtC(res.delayImpact.costOfDelay)}. This is money that could
                have been compounding for you instead.
              </p>
            </div>
          </div>

          {/* Quick Win */}
          <div className="flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl p-3">
            <Star className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-violet-700">
                ⚡ Your Action Step for Today
              </p>
              <p className="text-sm text-violet-700 mt-0.5">
                Open a SIP of{" "}
                {fmtC(
                  Math.max(500, Math.round(res.goals[0].sipRequired * 0.25)),
                )}{" "}
                per month today for your <strong>{res.goals[0].name}</strong>.
                Starting at 25% of the required amount and increasing by 10%
                each year gets you to your full goal on schedule. The habit of
                starting matters more than the amount.
              </p>
            </div>
          </div>

          {/* Add to Track Goals */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={addingToTrack}
              onClick={async () => {
                if (!actor) return;
                setAddingToTrack(true);
                try {
                  for (const g of res.goals) {
                    const goalDateMs =
                      Date.now() + g.years * 365 * 24 * 3600 * 1000;
                    const targetDate =
                      BigInt(Math.round(goalDateMs)) * BigInt(1_000_000);
                    const deadline = new Date(goalDateMs)
                      .toISOString()
                      .split("T")[0];
                    const notes = JSON.stringify({
                      targetDate: targetDate.toString(),
                      priority: "1",
                      inflationRate: 6,
                      linkedInvestments: [],
                      investmentAllocations: {},
                      plannedSip: Math.round(g.sipRequired),
                    });
                    await actor.createGoal({
                      id: crypto.randomUUID(),
                      name: g.name,
                      targetAmount: g.targetInflated,
                      currentAmount: 0,
                      deadline,
                      notes,
                      category: "",
                    });
                  }
                  toast.success("Goals added to Track Goals!");
                } catch {
                  toast.error("Failed to add goals. Please try again.");
                } finally {
                  setTimeout(() => setAddingToTrack(false), 1500);
                }
              }}
              className={`w-full py-2.5 px-4 text-white text-sm font-semibold rounded-xl transition-all ${
                addingToTrack
                  ? "bg-green-400 cursor-not-allowed scale-95"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              data-ocid="goal_planning.add_to_track_button"
            >
              {addingToTrack ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                "+ Add to Track Goals"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
