import { ChevronDown, ChevronUp, Home, Plus, Target } from "lucide-react";
import { useState } from "react";
import { ModelGoalPlanningTab } from "../components/financial-model/ModelGoalPlanningTab";
import { GoalsTab } from "../components/goals/GoalsTab";
import { Button } from "../components/ui/button";

// ─── Buy a House Planner ────────────────────────────────────────────────────

const RULES = [
  {
    id: 1,
    title: "House Cost ≤ 5× Annual Income",
    icon: "🏠",
    desc: "Anything more leads to EMI slavery and kills cash flow.",
  },
  {
    id: 2,
    title: "EMI ≤ 35% of Monthly Income",
    icon: "💸",
    desc: "Going above 35% suffocates your monthly budget.",
  },
  {
    id: 3,
    title: "Save 50% of House Value First",
    icon: "🏦",
    desc: "Loans aren't magic. Life doesn't pause after moving in.",
  },
  {
    id: 4,
    title: "Split Savings: 35% Down + 15% Emergency",
    icon: "✂️",
    desc: "35% for down payment, 15% for emergency fund. This is financial maturity.",
  },
  {
    id: 5,
    title: "Insurance Before EMI",
    icon: "🛡️",
    desc: "Medical + term plan must-have. One emergency without it = total collapse.",
  },
  {
    id: 6,
    title: "Plan to Stay 5+ Years",
    icon: "📅",
    desc: "Buying short-term is pure financial stupidity. Real estate needs time to appreciate.",
  },
];

function RuleCard({
  pass,
  icon,
  title,
  detail,
}: {
  pass: boolean;
  icon: string;
  title: string;
  detail: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 flex items-start gap-3 ${
        pass
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      }`}
    >
      <span className="text-xl mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              pass ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {pass ? "PASS" : "FAIL"}
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          {detail}
        </p>
      </div>
    </div>
  );
}

function BuyHousePlanner() {
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [houseValue, setHouseValue] = useState(6000000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [currentAge, setCurrentAge] = useState(30);
  const [emiCapacity, setEmiCapacity] = useState(35000);
  const [hasMedical, setHasMedical] = useState(false);
  const [hasTerm, setHasTerm] = useState(false);
  const [planToStay, setPlanToStay] = useState(true);
  const [results, setResults] = useState<null | ReturnType<typeof calculate>>(
    null,
  );

  function calculate() {
    const monthlyIncome = annualIncome / 12;
    const costRatio = houseValue / annualIncome;
    const emiPct = (emiCapacity / monthlyIncome) * 100;
    const savingsPct = (currentSavings / houseValue) * 100;
    const requiredSavings = houseValue * 0.5;
    const downPayment = houseValue * 0.35;
    const emergencyFund = houseValue * 0.15;
    const monthlyNeeded = Math.max(0, (requiredSavings - currentSavings) / 60);
    const monthsToReady =
      currentSavings >= requiredSavings
        ? 0
        : Math.ceil((requiredSavings - currentSavings) / (monthlyNeeded || 1));
    const loanAmount = houseValue - downPayment;
    const propertyInflationMonthly = (houseValue * 0.06) / 12;

    const r1 = costRatio <= 5;
    const r2 = emiPct <= 35;
    const r3 = savingsPct >= 50;
    const r4 = true; // informational
    const r5 = hasMedical && hasTerm;
    const r6 = planToStay;

    const passed = [r1, r2, r3, r5, r6].filter(Boolean).length;
    const score = Math.round((passed / 5) * 100);

    return {
      costRatio,
      emiPct,
      savingsPct,
      downPayment,
      emergencyFund,
      monthlyNeeded,
      monthsToReady,
      loanAmount,
      propertyInflationMonthly,
      score,
      r1,
      r2,
      r3,
      r4,
      r5,
      r6,
    };
  }

  function fmt(n: number) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)} K`;
    return `₹${Math.round(n).toLocaleString()}`;
  }

  const r = results;
  const badge = r
    ? r.score >= 70
      ? { label: "Ready to Buy 🎉", cls: "bg-emerald-500" }
      : r.score >= 40
        ? { label: "Getting There 🔧", cls: "bg-amber-500" }
        : { label: "Not Ready Yet ⚠️", cls: "bg-red-500" }
    : null;

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Annual Income (₹)",
            value: annualIncome,
            set: setAnnualIncome,
          },
          {
            label: "Target House Value (₹)",
            value: houseValue,
            set: setHouseValue,
          },
          {
            label: "Current Savings (₹)",
            value: currentSavings,
            set: setCurrentSavings,
          },
          { label: "Current Age", value: currentAge, set: setCurrentAge },
          {
            label: "Monthly EMI Capacity (₹)",
            value: emiCapacity,
            set: setEmiCapacity,
          },
        ].map(({ label, value, set }) => (
          <label key={label} className="block">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
              {label}
            </span>
            <input
              type="number"
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>
        ))}
        <div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
            Insurance Status
          </span>
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasMedical}
                onChange={(e) => setHasMedical(e.target.checked)}
                className="rounded"
              />
              Medical Insurance
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasTerm}
                onChange={(e) => setHasTerm(e.target.checked)}
                className="rounded"
              />
              Term Insurance
            </label>
          </div>
        </div>
      </div>

      {/* Rule 6 toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Plan to stay in this house for 5+ years?
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPlanToStay(true)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              planToStay
                ? "bg-emerald-500 text-white border-emerald-500"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setPlanToStay(false)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              !planToStay
                ? "bg-red-500 text-white border-red-500"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
            }`}
          >
            No
          </button>
        </div>
      </div>

      <Button
        onClick={() => setResults(calculate())}
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
      >
        Calculate My Readiness
      </Button>

      {r && badge && (
        <div className="space-y-4">
          {/* Score */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 flex flex-col items-center gap-2 min-w-[160px]">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                {r.score}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Readiness Score
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full text-white ${badge.cls}`}
              >
                {badge.label}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              {[
                {
                  label: "Monthly Savings Needed",
                  value: fmt(r.monthlyNeeded),
                },
                {
                  label: "Months to Ready",
                  value:
                    r.monthsToReady === 0 ? "Now! ✅" : `${r.monthsToReady} mo`,
                },
                { label: "Recommended Loan", value: fmt(r.loanAmount) },
                { label: "Down Payment (35%)", value: fmt(r.downPayment) },
                { label: "Emergency Fund (15%)", value: fmt(r.emergencyFund) },
                {
                  label: "Cost of 1yr Delay",
                  value: `+${fmt(r.propertyInflationMonthly * 12)}`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {label}
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rule checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RuleCard
              pass={r.r1}
              icon={RULES[0].icon}
              title={RULES[0].title}
              detail={`Your ratio: ${r.costRatio.toFixed(1)}× (max 5×). ${RULES[0].desc}`}
            />
            <RuleCard
              pass={r.r2}
              icon={RULES[1].icon}
              title={RULES[1].title}
              detail={`Your EMI is ${r.emiPct.toFixed(1)}% of income. ${RULES[1].desc}`}
            />
            <RuleCard
              pass={r.r3}
              icon={RULES[2].icon}
              title={RULES[2].title}
              detail={`You have ${r.savingsPct.toFixed(1)}% saved. ${RULES[2].desc}`}
            />
            <RuleCard
              pass={r.r4}
              icon={RULES[3].icon}
              title={RULES[3].title}
              detail={`Down: ${fmt(r.downPayment)} · Emergency: ${fmt(r.emergencyFund)}. ${RULES[3].desc}`}
            />
            <RuleCard
              pass={r.r5}
              icon={RULES[4].icon}
              title={RULES[4].title}
              detail={
                hasMedical && hasTerm
                  ? "Both insurances in place. Well done!"
                  : `Missing: ${!hasMedical ? "Medical" : ""}${!hasMedical && !hasTerm ? " & " : ""}${!hasTerm ? "Term" : ""}. ${RULES[4].desc}`
              }
            />
            <RuleCard
              pass={r.r6}
              icon={RULES[5].icon}
              title={RULES[5].title}
              detail={
                planToStay
                  ? "Great! Long-term commitment maximises ROI."
                  : RULES[5].desc
              }
            />
          </div>

          {/* Action plan */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📋 Action Plan — Fix These First:
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
              {!r.r1 && (
                <li>
                  Reduce target house value or increase income until ratio ≤ 5×
                </li>
              )}
              {!r.r2 && (
                <li>
                  Lower EMI capacity target — aim for ≤{" "}
                  {Math.floor((annualIncome / 12) * 0.35).toLocaleString()} /
                  month
                </li>
              )}
              {!r.r3 && (
                <li>
                  Save {fmt(houseValue * 0.5 - currentSavings)} more before
                  buying (need 50% of house value)
                </li>
              )}
              {!r.r5 && (
                <li>
                  Get {!hasMedical ? "Medical" : ""}
                  {!hasMedical && !hasTerm ? " and " : ""}
                  {!hasTerm ? "Term" : ""} Insurance immediately
                </li>
              )}
              {!r.r6 && (
                <li>
                  Reconsider — short-term buying destroys value. Plan 5+ year
                  stay.
                </li>
              )}
              {r.score >= 70 && (
                <li>
                  All key rules pass! You're financially ready to explore home
                  buying.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"track" | "plan">("track");
  const [houseOpen, setHouseOpen] = useState(false);

  return (
    <div data-ocid="goals.page">
      <div className="flex items-center justify-between gap-2.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
          >
            <Target className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Financial Goals
          </h1>
        </div>
        {activeTab === "track" && (
          <Button
            onClick={() => setAddGoalOpen(true)}
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow text-xs"
            data-ocid="goals.page.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Goal
          </Button>
        )}
      </div>

      {/* Tab pills */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          data-ocid="goals.track.tab"
          onClick={() => setActiveTab("track")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "track"
              ? "bg-emerald-600 text-white shadow"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Track Goals
        </button>
        <button
          type="button"
          data-ocid="goals.plan.tab"
          onClick={() => setActiveTab("plan")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "plan"
              ? "bg-emerald-600 text-white shadow"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Plan Goals
        </button>
      </div>

      {activeTab === "track" && (
        <GoalsTab
          externalAddOpen={addGoalOpen}
          onExternalAddOpenChange={setAddGoalOpen}
        />
      )}

      {activeTab === "plan" && (
        <div className="space-y-4">
          {/* Existing Goal Planning Model */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
            <ModelGoalPlanningTab />
          </div>

          {/* Buy a House Planner */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setHouseOpen((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              data-ocid="goals.house.panel"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    Buy a House Planner
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    AI-led readiness model based on 6 global financial rules
                  </p>
                </div>
              </div>
              {houseOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </button>
            {houseOpen && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
                <BuyHousePlanner />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
