import { c as createLucideIcon, a as useCurrency, r as reactExports, j as jsxRuntimeExports, B as Button, Y as Sparkles, _ as Send, z as TrendingUp, v as Label, I as Input, $ as Shield, A as ChartPie, E as ChartColumn, C as ChevronDown, V as PiggyBank, a0 as useIsMobile, u as useActor } from "./index-CcAdyV8c.js";
import { B as Badge } from "./badge-DKFP_X1n.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-CIFSpWCs.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Ck1ZzOVc.js";
import { A as AssetType } from "./index-CUmzdL5t.js";
import { W as Wallet } from "./wallet-D3VswIiD.js";
import { C as ChevronRight } from "./chevron-right-D6ZKNeRa.js";
import { C as ChevronLeft, a as CircleCheck } from "./circle-check-DcT5rTtD.js";
import { C as CircleAlert } from "./circle-alert-Mn1wbFeG.js";
import { T as TrendingDown } from "./trending-down-BSjTjym5.js";
import { R as ResponsiveContainer, C as Cell, T as Tooltip, a as CartesianGrid, X as XAxis, Y as YAxis, b as Legend } from "./generateCategoricalChart-45UMGlbz.js";
import { P as PieChart, a as Pie } from "./PieChart-DIrW41cI.js";
import { L as LineChart, a as Line } from "./LineChart-BVhKOsIF.js";
import { M as ModelDebtTab } from "./ModelDebtTab-Bg1dFrWC.js";
import { I as Info, M as ModelGoalPlanningTab } from "./ModelGoalPlanningTab-BBooN86p.js";
import { H as Heart, F as FIRECalculator, T as ThreeBucketCalculator, a as TwoBucketCalculator, R as RetirementReadinessCalculator } from "./TwoBucketCalculator-CW_deo-o.js";
import { T as TriangleAlert } from "./triangle-alert-D2CwNg09.js";
import { A as Alert, a as AlertDescription } from "./alert-Da5SMKmJ.js";
import { S as Search } from "./search-DN4rpkpq.js";
import "./index-hpWq3JlZ.js";
import "./index-DY-eC9Jm.js";
import "./index-qWuCqi_a.js";
import "./plus-lkKcuMdA.js";
import "./index-DtVllATs.js";
import "./table-r4OK_UH-.js";
import "./progress-CtymBatL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",
      key: "yr8idg"
    }
  ]
];
const Bitcoin = createLucideIcon("bitcoin", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode);
const fmt$1 = (n) => Math.round(n).toLocaleString("en-IN");
let _currencySymbol = "₹";
const fmtC = (n) => `${_currencySymbol}${fmt$1(n)}`;
const SCENARIOS = [
  {
    id: "standard",
    title: "Fresh Graduate: First Budget",
    desc: "Take-home ₹65,000. Just started working, learning to manage expenses.",
    inputs: {
      income: 65e3,
      rent: 18e3,
      groceries: 8e3,
      eatingOut: 5e3,
      transport: 3e3,
      subscriptions: 2500,
      emi: 0,
      otherMisc: 0,
      reductionTarget: 0,
      isFreelancer: false,
      minIncome: 0,
      maxIncome: 0
    }
  },
  {
    id: "leakage",
    title: "Salaried Professional: Optimize Spending",
    desc: "Earns ₹80,000 but runs out of money every month. Optimize spending.",
    inputs: {
      income: 8e4,
      rent: 22e3,
      groceries: 1e4,
      eatingOut: 9e3,
      transport: 5e3,
      subscriptions: 3500,
      emi: 15e3,
      otherMisc: 9e3,
      reductionTarget: 0,
      isFreelancer: false,
      minIncome: 0,
      maxIncome: 0
    }
  },
  {
    id: "tightening",
    title: "Small Business Owner: Irregular Income",
    desc: "Business income varies month to month. Needs a stable budget plan.",
    inputs: {
      income: 75e3,
      rent: 2e4,
      groceries: 9e3,
      eatingOut: 7e3,
      transport: 4e3,
      subscriptions: 4e3,
      emi: 12e3,
      otherMisc: 5e3,
      reductionTarget: 1e4,
      isFreelancer: false,
      minIncome: 0,
      maxIncome: 0
    }
  },
  {
    id: "freelancer",
    title: "Family Budget: Dual Income",
    desc: "Dual income household. Plan household budget and maximize savings.",
    inputs: {
      income: 7e4,
      rent: 18e3,
      groceries: 8e3,
      eatingOut: 5e3,
      transport: 3e3,
      subscriptions: 2e3,
      emi: 0,
      otherMisc: 2e3,
      reductionTarget: 0,
      isFreelancer: true,
      minIncome: 4e4,
      maxIncome: 12e4
    }
  }
];
function analyzeBudget(inp) {
  if (!inp.income || inp.income <= 0)
    return {
      result: null,
      error: "Monthly income must be greater than 0. Please enter your take-home pay."
    };
  if (inp.isFreelancer && inp.minIncome <= 0)
    return {
      result: null,
      error: "For freelancer mode, please enter your minimum expected monthly income."
    };
  if (inp.isFreelancer && inp.maxIncome <= inp.minIncome)
    return {
      result: null,
      error: "Maximum income must be greater than minimum income."
    };
  if ([
    inp.rent,
    inp.groceries,
    inp.eatingOut,
    inp.transport,
    inp.subscriptions,
    inp.emi,
    inp.otherMisc
  ].some((v) => v < 0))
    return { result: null, error: "Expense amounts cannot be negative." };
  const effectiveIncome = inp.isFreelancer ? inp.minIncome : inp.income;
  const totalExpenses = inp.rent + inp.groceries + inp.eatingOut + inp.transport + inp.subscriptions + inp.emi + inp.otherMisc;
  const savings = effectiveIncome - totalExpenses;
  const untracked = savings < 0 ? Math.abs(savings) : 0;
  const actualSavings = Math.max(0, savings);
  const savingsRate = Math.round(actualSavings / effectiveIncome * 100);
  const needs = inp.rent + inp.groceries + inp.transport + inp.emi;
  const wants = inp.eatingOut + inp.subscriptions + inp.otherMisc;
  const ideal50 = Math.round(effectiveIncome * 0.5);
  const ideal30 = Math.round(effectiveIncome * 0.3);
  const ideal20 = Math.round(effectiveIncome * 0.2);
  const leakages = [];
  if (inp.eatingOut > effectiveIncome * 0.07) {
    const idealEat = Math.round(effectiveIncome * 0.05);
    leakages.push({
      category: "Eating Out / Dining",
      amount: inp.eatingOut,
      ideal: idealEat,
      suggestion: `You are spending ${fmtC(inp.eatingOut)} per month on dining out — the recommended ceiling is ${fmtC(idealEat)} (5% of income). Cooking 3 extra meals at home each week typically saves ${fmtC(inp.eatingOut - idealEat)} per month with minimal lifestyle impact.`
    });
  }
  if (inp.subscriptions > effectiveIncome * 0.025) {
    const idealSub = Math.round(effectiveIncome * 0.02);
    leakages.push({
      category: "Subscriptions & Digital Services",
      amount: inp.subscriptions,
      ideal: idealSub,
      suggestion: `Your subscriptions of ${fmtC(inp.subscriptions)} are above the recommended ${fmtC(idealSub)}. List every recurring charge and cancel any service you have not used in the past 30 days. This one action often saves ${fmtC(Math.round(inp.subscriptions * 0.35))} immediately.`
    });
  }
  if (untracked > effectiveIncome * 0.05) {
    leakages.push({
      category: "Untracked / Unknown Spending",
      amount: untracked,
      ideal: 0,
      suggestion: `You have ${fmtC(untracked)} in unaccounted expenses. Track every purchase for 14 days using any free app. Most people recover 30–40% of this amount — in your case, approximately ${fmtC(Math.round(untracked * 0.35))} per month — simply by becoming aware of where cash goes.`
    });
  }
  if (inp.otherMisc > effectiveIncome * 0.08) {
    const idealMisc = Math.round(effectiveIncome * 0.04);
    leakages.push({
      category: "Miscellaneous / Impulse",
      amount: inp.otherMisc,
      ideal: idealMisc,
      suggestion: `Miscellaneous spending of ${fmtC(inp.otherMisc)} is high. Apply a 48-hour pause rule before any non-essential purchase above ${fmtC(500)}. Studies show this eliminates 40% of impulse buys.`
    });
  }
  if (leakages.length === 0) {
    leakages.push({
      category: "Dining / Entertainment",
      amount: inp.eatingOut,
      ideal: Math.round(effectiveIncome * 0.05),
      suggestion: `Your spending is well-managed. Even so, trimming dining by ${fmtC(Math.round(inp.eatingOut * 0.15))} per month adds ${fmtC(Math.round(inp.eatingOut * 0.15) * 12)} to your annual savings — enough for a vacation fund SIP.`
    });
  }
  const reductionSuggestions = [];
  if (inp.reductionTarget > 0) {
    let remaining = inp.reductionTarget;
    if (inp.eatingOut > effectiveIncome * 0.04 && remaining > 0) {
      const cut = Math.min(Math.round(inp.eatingOut * 0.4), remaining);
      reductionSuggestions.push({
        category: "Dining Out",
        cut,
        action: `Reduce from ${fmtC(inp.eatingOut)} to ${fmtC(inp.eatingOut - cut)} by cooking 3 more meals at home each week. Saves ${fmtC(cut)} per month.`
      });
      remaining -= cut;
    }
    if (inp.subscriptions > 1500 && remaining > 0) {
      const cut = Math.min(Math.round(inp.subscriptions * 0.4), remaining);
      reductionSuggestions.push({
        category: "Subscriptions",
        cut,
        action: `Cut from ${fmtC(inp.subscriptions)} to ${fmtC(inp.subscriptions - cut)} by removing 2 infrequently used streaming or app services. Saves ${fmtC(cut)} per month.`
      });
      remaining -= cut;
    }
    if (inp.otherMisc > 2e3 && remaining > 0) {
      const cut = Math.min(Math.round(inp.otherMisc * 0.35), remaining);
      reductionSuggestions.push({
        category: "Miscellaneous",
        cut,
        action: `Trim from ${fmtC(inp.otherMisc)} to ${fmtC(inp.otherMisc - cut)} by applying a 48-hour pause before non-essential purchases. Saves ${fmtC(cut)} per month.`
      });
      remaining -= cut;
    }
    if (inp.transport > effectiveIncome * 0.07 && remaining > 0) {
      const cut = Math.min(Math.round(inp.transport * 0.25), remaining);
      reductionSuggestions.push({
        category: "Transport / Fuel",
        cut,
        action: `Reduce from ${fmtC(inp.transport)} to ${fmtC(inp.transport - cut)} by combining errands and using public transport 2 days per week. Saves ${fmtC(cut)} per month.`
      });
      remaining -= cut;
    }
    const achieved = inp.reductionTarget - remaining;
    if (achieved < inp.reductionTarget && remaining > 0) {
      reductionSuggestions.push({
        category: "Additional Cuts Needed",
        cut: remaining,
        action: `You still need to find ${fmtC(remaining)} more in savings. Consider temporarily pausing one luxury (gym, OTT bundle) or negotiating a lower rent or phone plan.`
      });
    }
  }
  const freelancerTips = [];
  if (inp.isFreelancer) {
    freelancerTips.push(
      `Base your entire fixed budget on your LOWEST expected monthly income of ${fmtC(inp.minIncome)}. Anything earned above this is surplus — never spend it until the month is closed.`
    );
    freelancerTips.push(
      `Build a 6-month operating buffer of ${fmtC(totalExpenses * 6)} before increasing any lifestyle spend. This is your runway if income drops.`
    );
    freelancerTips.push(
      `Pay yourself a fixed "salary" of ${fmtC(Math.round(inp.minIncome * 0.8))} from your business account each month. Deposit the rest into a separate opportunity/tax account.`
    );
    freelancerTips.push(
      `In high-income months (above ${fmtC(Math.round((inp.minIncome + inp.maxIncome) / 2))}), direct 50% of the surplus into an FD or Liquid Mutual Fund — not lifestyle upgrades.`
    );
    freelancerTips.push(
      "Set aside 30% of every invoice received for advance tax and GST. Failing to do this is the single biggest financial mistake freelancers make."
    );
  }
  const budgetRows = [
    {
      category: "Housing / Rent",
      current: inp.rent,
      ideal: Math.round(effectiveIncome * 0.27),
      type: "Needs"
    },
    {
      category: "Groceries & Daily Food",
      current: inp.groceries,
      ideal: Math.round(effectiveIncome * 0.1),
      type: "Needs"
    },
    {
      category: "Transport / Fuel",
      current: inp.transport,
      ideal: Math.round(effectiveIncome * 0.05),
      type: "Needs"
    },
    {
      category: "EMI Payments",
      current: inp.emi,
      ideal: Math.round(effectiveIncome * 0.08),
      type: "Needs"
    },
    {
      category: "Dining Out / Eating Out",
      current: inp.eatingOut,
      ideal: Math.round(effectiveIncome * 0.05),
      type: "Wants"
    },
    {
      category: "Subscriptions & Digital",
      current: inp.subscriptions,
      ideal: Math.round(effectiveIncome * 0.02),
      type: "Wants"
    },
    {
      category: "Miscellaneous / Other",
      current: inp.otherMisc,
      ideal: Math.round(effectiveIncome * 0.03),
      type: "Wants"
    },
    {
      category: "Savings / Investments / SIP",
      current: actualSavings,
      ideal: Math.round(effectiveIncome * 0.2),
      type: "Savings"
    }
  ];
  const quickWin = actualSavings > 1e3 ? `Start a monthly SIP of ${fmtC(Math.max(1e3, Math.round(actualSavings * 0.5)))} in a Liquid Fund today. You already have the surplus — put it to work before it disappears. Set up auto-debit on salary day.` : `Open a zero-balance savings account and transfer ${fmtC(Math.max(500, Math.round(effectiveIncome * 0.03)))} on the day your salary arrives — before any spending. This "pay yourself first" habit creates the savings habit even when money feels tight.`;
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
      scenario: ""
    },
    error: ""
  };
}
function numField(label, value, onChange, hint) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-slate-600", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        type: "number",
        min: 0,
        value: value || "",
        onChange: (e) => onChange(Number(e.target.value) || 0),
        className: "h-8 text-sm",
        placeholder: "0"
      }
    ),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: hint })
  ] });
}
function ModelBudgetingTab({
  initialScenario,
  autofillData
} = {}) {
  const { country } = useCurrency();
  _currencySymbol = country.symbol;
  const initScenario = SCENARIOS.find((s) => s.id === initialScenario) ?? SCENARIOS[0];
  const [inputs, setInputs] = reactExports.useState(initScenario.inputs);
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [_activeScenario, setActiveScenario] = reactExports.useState(initScenario.id);
  const [view, setView] = reactExports.useState(
    initialScenario ? "detail" : "menu"
  );
  const set = (field) => (val) => setInputs((prev) => ({ ...prev, [field]: val }));
  const loadScenario = (s) => {
    setInputs(s.inputs);
    setActiveScenario(s.id);
    setResult(null);
    setError("");
  };
  const applyAutofill = reactExports.useCallback(() => {
    if (!autofillData) return;
    setInputs((prev) => ({
      ...prev,
      income: autofillData.income || prev.income,
      rent: autofillData.needs > 0 ? Math.round(autofillData.needs * 0.4) : prev.rent,
      groceries: autofillData.needs > 0 ? Math.round(autofillData.needs * 0.25) : prev.groceries,
      transport: autofillData.needs > 0 ? Math.round(autofillData.needs * 0.15) : prev.transport,
      emi: autofillData.needs > 0 ? Math.round(autofillData.needs * 0.2) : prev.emi,
      eatingOut: autofillData.wants > 0 ? Math.round(autofillData.wants * 0.4) : prev.eatingOut,
      subscriptions: autofillData.wants > 0 ? Math.round(autofillData.wants * 0.3) : prev.subscriptions,
      otherMisc: autofillData.wants > 0 ? Math.round(autofillData.wants * 0.3) : prev.otherMisc
    }));
    setResult(null);
    setError("");
    if (view === "menu") setView("detail");
  }, [autofillData, view]);
  reactExports.useEffect(() => {
    if (autofillData) {
      applyAutofill();
    }
  }, [autofillData, applyAutofill]);
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
      "#f43f5e"
    ];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-1 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-gray-900 dark:text-white", children: "Budgeting & Expense Tracking Model" }) })
      ] }),
      autofillData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-emerald-700", children: "✓ Autofill data available:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-emerald-600", children: [
          "Income ",
          fmtC(autofillData.income),
          ", Needs",
          " ",
          fmtC(autofillData.needs),
          ", Wants ",
          fmtC(autofillData.wants)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: applyAutofill,
            className: "ml-auto h-7 px-3 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors",
            children: "Apply & Analyze"
          }
        )
      ] }),
      SCENARIOS.map((s, idx) => {
        const accentColor = SCENARIO_COLORS_BUDGETING[idx % SCENARIO_COLORS_BUDGETING.length];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              loadScenario(s);
              setView("detail");
            },
            className: "w-full text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 rounded-xl overflow-hidden transition-all duration-200 group shadow-sm hover:shadow-md",
            style: { borderLeftColor: accentColor, borderLeftWidth: 4 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
                      style: { backgroundColor: accentColor },
                      children: idx + 1
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-slate-100 truncate", children: s.title })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-slate-400", children: s.desc }) })
            ]
          },
          s.id
        );
      })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setView("menu"),
        className: "flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2 font-medium",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
          "Back to Menu"
        ]
      }
    ),
    autofillData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-emerald-700", children: "✓ Autofill ready:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-emerald-600", children: [
        "Income ",
        fmtC(autofillData.income),
        ", Needs ",
        fmtC(autofillData.needs),
        ", Wants ",
        fmtC(autofillData.wants),
        ", Savings",
        " ",
        fmtC(autofillData.savings)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: applyAutofill,
          className: "ml-auto h-7 px-3 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors",
          children: "Apply to Scenario"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-600 uppercase tracking-wide", children: "Monthly Income" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
        numField(
          "Take-Home Income (₹)",
          inputs.income,
          set("income"),
          "After tax and deductions"
        ),
        inputs.isFreelancer && numField(
          "Minimum Monthly Income (₹)",
          inputs.minIncome,
          set("minIncome"),
          "Budget based on this floor"
        ),
        inputs.isFreelancer && numField(
          "Maximum Monthly Income (₹)",
          inputs.maxIncome,
          set("maxIncome"),
          "Your best month"
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-600 uppercase tracking-wide pt-2", children: "Fixed Expenses (Needs)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
        numField(
          "Rent / Housing (₹)",
          inputs.rent,
          set("rent")
        ),
        numField(
          "Groceries / Daily Food (₹)",
          inputs.groceries,
          set("groceries")
        ),
        numField(
          "Transport / Fuel (₹)",
          inputs.transport,
          set("transport")
        ),
        numField(
          "EMI Payments (₹)",
          inputs.emi,
          set("emi"),
          "All loan EMIs combined"
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-600 uppercase tracking-wide pt-2", children: "Variable Expenses (Wants)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
        numField(
          "Eating Out / Dining (₹)",
          inputs.eatingOut,
          set("eatingOut")
        ),
        numField(
          "Subscriptions (₹)",
          inputs.subscriptions,
          set("subscriptions"),
          "OTT, gym, apps, etc."
        ),
        numField(
          "Miscellaneous / Other (₹)",
          inputs.otherMisc,
          set("otherMisc"),
          "Shopping, personal care, etc."
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-600 uppercase tracking-wide pt-2", children: "Goals (Optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: numField(
        "Monthly Reduction Target (₹)",
        inputs.reductionTarget,
        set("reductionTarget"),
        "How much you want to cut (0 = skip)"
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            id: "freelancer",
            checked: inputs.isFreelancer,
            onChange: (e) => setInputs((prev) => ({ ...prev, isFreelancer: e.target.checked })),
            className: "w-4 h-4 accent-blue-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "freelancer",
            className: "text-xs text-slate-600 font-medium",
            children: "I am a freelancer / have variable income"
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-red-500 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-700", children: error })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: handleAnalyze,
        disabled: loading,
        className: "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white",
        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 mr-2 animate-spin" }),
          "Analyzing your budget..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2" }),
          "Analyze My Budget"
        ] })
      }
    ),
    res && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
      res.isFreelancer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-amber-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Freelancer Mode:" }),
          " Budget is calculated on your minimum income of ",
          fmtC(res.minIncome),
          " per month. On high-income months (above",
          " ",
          fmtC(Math.round((res.minIncome + res.maxIncome) / 2)),
          "), your surplus could reach ",
          fmtC(res.maxIncome - res.totalExpenses),
          " — treat this as investment capital, not spending money."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 border border-blue-100 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-500 font-medium", children: "Monthly Income" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-blue-700 mt-0.5", children: fmtC(res.income) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 border border-amber-100 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-500 font-medium", children: "Needs (50% ideal)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-700 mt-0.5", children: fmtC(res.needs) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-400", children: [
            fmtC(res.ideal50),
            " ideal"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50 border border-purple-100 rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-purple-500 font-medium", children: "Wants (30% ideal)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-purple-700 mt-0.5", children: fmtC(res.wants) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-purple-400", children: [
            fmtC(res.ideal30),
            " ideal"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `${res.savingsRate >= 20 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"} border rounded-xl p-3 text-center`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-xs font-medium ${res.savingsRate >= 20 ? "text-green-500" : "text-red-500"}`,
                  children: "Savings Rate"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-sm font-bold mt-0.5 ${res.savingsRate >= 20 ? "text-green-700" : "text-red-700"}`,
                  children: [
                    res.savingsRate,
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-xs ${res.savingsRate >= 20 ? "text-green-400" : "text-red-400"}`,
                  children: "20% is minimum"
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-start gap-2 p-3 rounded-xl text-sm ${res.savingsRate >= 20 ? "bg-green-50 text-green-800" : res.savingsRate >= 10 ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-800"}`,
          children: [
            res.savingsRate >= 20 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 mt-0.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-4 h-4 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              res.savingsRate >= 20 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "You are saving ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: fmtC(res.savings) }),
                " per month — a healthy ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  res.savingsRate,
                  "%"
                ] }),
                " of income. The recommended minimum is 20%. You are on track. Consider increasing your SIP by ",
                fmtC(Math.round(res.savings * 0.2)),
                " ",
                "to accelerate wealth building."
              ] }),
              res.savingsRate >= 10 && res.savingsRate < 20 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "You are saving ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: fmtC(res.savings) }),
                " per month (",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  res.savingsRate,
                  "%"
                ] }),
                "). The recommended minimum is 20%, which means ",
                fmtC(res.ideal20),
                " per month on your income. You need to find ",
                fmtC(res.ideal20 - res.savings),
                " ",
                "more per month in cuts. The top leakages below will help you find it."
              ] }),
              res.savingsRate < 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                "You are saving only ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: fmtC(res.savings) }),
                " per month (",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  res.savingsRate,
                  "%"
                ] }),
                " of income). This is significantly below the 20% minimum of ",
                fmtC(res.ideal20),
                ". Left unaddressed, this means",
                " ",
                fmtC((res.ideal20 - res.savings) * 12),
                " less invested per year. The leakage analysis below will help identify where to start."
              ] }),
              res.untracked > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block mt-1 text-xs font-semibold", children: [
                "⚠️ Warning: ",
                fmtC(res.untracked),
                " of your income is unaccounted for. This is the first thing to fix."
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: "📋 Monthly Budget Plan — 50/30/20 Rule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-2.5 font-semibold text-slate-600", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Your Spend" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Ideal (50/30/20)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Difference" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Type" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: res.budgetRows.map((row) => {
            const diff = row.current - row.ideal;
            const over = diff > 0 && row.type !== "Savings";
            const under = row.type === "Savings" && diff < 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-slate-50 hover:bg-slate-50/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 font-medium text-slate-700", children: row.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: `p-2.5 text-right font-semibold ${over ? "text-red-600" : under ? "text-amber-600" : "text-slate-600"}`,
                      children: fmtC(row.current)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-green-600 font-semibold", children: fmtC(row.ideal) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      className: `p-2.5 text-right text-xs font-bold ${over ? "text-red-500" : under ? "text-amber-500" : "text-green-500"}`,
                      children: diff === 0 ? "✓" : over ? `+${fmtC(diff)} over` : `${fmtC(Math.abs(diff))} under`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs px-2 py-0.5 rounded-full font-medium ${row.type === "Needs" ? "bg-amber-100 text-amber-700" : row.type === "Wants" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`,
                      children: row.type
                    }
                  ) })
                ]
              },
              row.category
            );
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: "🔍 Top Money Leakage Areas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: res.leakages.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-500 font-bold text-sm shrink-0", children: [
                "#",
                i + 1
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-red-700", children: [
                  l.category,
                  " — ",
                  fmtC(l.amount),
                  "/month",
                  l.ideal > 0 ? ` (ideal: ${fmtC(l.ideal)})` : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-600 mt-0.5", children: l.suggestion })
              ] })
            ]
          },
          l.category
        )) })
      ] }),
      res.reductionTarget > 0 && res.reductionSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: [
          "✂️ How to Cut ",
          fmtC(res.reductionTarget),
          "/month Without Sacrificing Lifestyle"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: res.reductionSuggestions.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-indigo-800", children: [
                  r.category,
                  " — Save ",
                  fmtC(r.cut),
                  "/month"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-700 mt-0.5", children: r.action })
              ] })
            ]
          },
          r.category
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-2", children: [
          "Total achievable reduction:",
          " ",
          fmtC(res.reductionSuggestions.reduce((s, r) => s + r.cut, 0)),
          "/month — that's",
          " ",
          fmtC(
            res.reductionSuggestions.reduce((s, r) => s + r.cut, 0) * 12
          ),
          " ",
          "saved per year."
        ] })
      ] }),
      res.isFreelancer && res.freelancerTips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: "💼 Freelancer-Specific Budget Rules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: res.freelancerTips.map((tip) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-teal-600 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-teal-800", children: tip })
            ]
          },
          tip.substring(0, 30)
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "w-5 h-5 text-emerald-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-emerald-700", children: "⚡ Your Quick Win — Do This Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-emerald-700 mt-0.5", children: res.quickWin })
        ] })
      ] })
    ] })
  ] });
}
const cryptoPortfolios = {
  conservative: { large: 70, mid: 20, small: 10 },
  moderate: { large: 50, mid: 30, small: 20 },
  aggressive: { large: 30, mid: 40, small: 30 }
};
const COLORS = ["#f7931a", "#627eea", "#00d395", "#8247e5", "#26a17b"];
function ModelCryptoPortfolioTab() {
  var _a, _b, _c;
  const { formatCurrency, country } = useCurrency();
  const [riskProfile, setRiskProfile] = reactExports.useState("moderate");
  const [initialCapital, setInitialCapital] = reactExports.useState("100000");
  const [sipAmount, setSipAmount] = reactExports.useState("10000");
  const allocation = cryptoPortfolios[riskProfile];
  const capital = Number.parseFloat(initialCapital) || 0;
  const sip = Number.parseFloat(sipAmount) || 0;
  const allocationData = [
    {
      name: "Large Cap (BTC, ETH)",
      value: allocation.large,
      amount: capital * allocation.large / 100
    },
    {
      name: "Mid Cap (SOL, ADA, DOT)",
      value: allocation.mid,
      amount: capital * allocation.mid / 100
    },
    {
      name: "Small Cap (Emerging)",
      value: allocation.small,
      amount: capital * allocation.small / 100
    }
  ];
  const years = 25;
  const avgReturn = riskProfile === "conservative" ? 0.15 : riskProfile === "moderate" ? 0.25 : 0.35;
  const forecastData = Array.from({ length: years }, (_, i) => {
    const year = (/* @__PURE__ */ new Date()).getFullYear() + i;
    const lumpsumValue = capital * (1 + avgReturn) ** i;
    let sipValue = 0;
    for (let j = 0; j <= i * 12; j++) {
      sipValue += sip * (1 + avgReturn / 12) ** (i * 12 - j);
    }
    return { year, value: lumpsumValue + sipValue };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl shadow-sm border border-slate-100 bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardHeader,
      {
        style: { borderLeft: "3px solid #f59e0b", paddingLeft: "1.25rem" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-bold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "h-5 w-5 text-amber-500" }),
            "Model Crypto Portfolio Builder"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Build a diversified cryptocurrency portfolio based on your risk appetite" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Risk Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: riskProfile,
              onValueChange: (v) => setRiskProfile(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "conservative", children: "Conservative (15% avg return)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "moderate", children: "Moderate (25% avg return)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "aggressive", children: "Aggressive (35% avg return)" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Initial Capital (",
            country.symbol,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: initialCapital,
              onChange: (e) => setInitialCapital(e.target.value),
              placeholder: "100000"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Monthly SIP (",
            country.symbol,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: sipAmount,
              onChange: (e) => setSipAmount(e.target.value),
              placeholder: "10000"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Suggested Allocation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
              "Based on ",
              riskProfile,
              " risk profile"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Pie,
                {
                  data: allocationData,
                  cx: "50%",
                  cy: "50%",
                  labelLine: false,
                  label: (entry) => `${entry.name.split(" ")[0]}: ${entry.value}%`,
                  innerRadius: 35,
                  outerRadius: 80,
                  dataKey: "value",
                  children: allocationData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Cell,
                    {
                      fill: COLORS[index % COLORS.length]
                    },
                    entry.name
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => `${value}%` })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: allocationData.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex justify-between items-center p-2 rounded bg-muted/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-3 w-3 rounded",
                        style: { backgroundColor: COLORS[index] }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: item.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: formatCurrency(item.amount) })
                ]
              },
              item.name
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Top Crypto Suggestions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Recommended cryptocurrencies by category" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold text-sm mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-[#f7931a]" }),
                "Large Cap (",
                allocation.large,
                "%)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm space-y-1 ml-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Bitcoin (BTC) - Digital Gold" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Ethereum (ETH) - Smart Contracts" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold text-sm mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-[#627eea]" }),
                "Mid Cap (",
                allocation.mid,
                "%)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm space-y-1 ml-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Solana (SOL) - High Performance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Cardano (ADA) - Research-Based" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Polkadot (DOT) - Interoperability" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold text-sm mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-[#00d395]" }),
                "Small Cap (",
                allocation.small,
                "%)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm space-y-1 ml-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Emerging DeFi Projects" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Layer 2 Solutions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Web3 Infrastructure" })
              ] })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "25-Year Portfolio Forecast" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "Projected growth with ",
            formatCurrency(capital),
            " initial +",
            " ",
            formatCurrency(sip),
            "/month SIP"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: forecastData, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "year" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tickFormatter: (value) => formatCurrency(value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                formatter: (value) => formatCurrency(value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "value",
                stroke: "#f7931a",
                strokeWidth: 2,
                name: "Portfolio Value"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-muted/30 border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "5 Year Value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-primary", children: formatCurrency(((_a = forecastData[4]) == null ? void 0 : _a.value) || 0) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-muted/30 border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "15 Year Value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-emerald-600", children: formatCurrency(((_b = forecastData[14]) == null ? void 0 : _b.value) || 0) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-muted/30 border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "25 Year Value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-violet-600", children: formatCurrency(((_c = forecastData[24]) == null ? void 0 : _c.value) || 0) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-amber-50 border-amber-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base text-amber-700", children: "⚠️ Important Disclaimer" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-sm space-y-2 text-amber-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Cryptocurrency investments are highly volatile and risky" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Only invest what you can afford to lose" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Past performance does not guarantee future results" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Diversification does not eliminate risk" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Consult with a financial advisor before investing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Keep your crypto assets secure with hardware wallets" })
        ] })
      ] })
    ] })
  ] }) });
}
function fmt(n, sym) {
  if (n >= 1e7) return `${sym}${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `${sym}${(n / 1e5).toFixed(2)} L`;
  return `${sym}${n.toLocaleString("en-IN")}`;
}
function ModelInsuranceTab() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [life, setLife] = reactExports.useState({
    annualIncome: 12e5,
    liabilities: 2e6,
    dependents: 2,
    currentCover: 5e6
  });
  const [health, setHealth] = reactExports.useState({
    familySize: 4,
    age: 35,
    cityTier: "tier1",
    currentCover: 5e5
  });
  const [term, setTerm] = reactExports.useState({
    age: 30,
    income: 12e5,
    termYears: 30,
    currentCover: 0
  });
  const [critical, setCritical] = reactExports.useState({
    age: 35,
    income: 12e5,
    currentCover: 0
  });
  const lifeRecommended = life.annualIncome * 12 + life.liabilities;
  const lifeGap = Math.max(0, lifeRecommended - life.currentCover);
  const healthBase = health.cityTier === "tier1" ? 1e6 : health.cityTier === "tier2" ? 7e5 : 5e5;
  const healthExtra = (health.familySize - 1) * 2e5 + (health.age > 45 ? 5e5 : 0);
  const healthRecommended = healthBase + healthExtra;
  const healthGap = Math.max(0, healthRecommended - health.currentCover);
  const termRecommended = term.income * 15;
  const termPremiumEstimate = Math.round(term.income * 15 * 4e-3 / 12);
  const termGap = Math.max(0, termRecommended - term.currentCover);
  const criticalRecommended = critical.income * 5;
  const criticalGap = Math.max(0, criticalRecommended - critical.currentCover);
  const CoverageBar = ({
    recommended,
    current,
    label
  }) => {
    const pct = Math.min(100, current / recommended * 100);
    const color = pct >= 100 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-destructive";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          pct.toFixed(0),
          "% covered"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `h-full rounded-full transition-all duration-700 ${color}`,
          style: { width: `${pct}%` }
        }
      ) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl shadow-sm border border-slate-100 bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardHeader,
      {
        style: { borderLeft: "3px solid #0891b2", paddingLeft: "1.25rem" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-xl font-bold text-slate-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-gradient-to-br from-info/20 to-chart-4/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-info" }) }),
            "Insurance Planning Model"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-base", children: "Calculate your optimal insurance coverage across all categories" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 text-primary" }),
            " Life Insurance"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                  "Annual Income (",
                  sym,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.life.income.input",
                    type: "number",
                    value: life.annualIncome,
                    onChange: (e) => setLife((p) => ({
                      ...p,
                      annualIncome: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                  "Liabilities (",
                  sym,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.life.liabilities.input",
                    type: "number",
                    value: life.liabilities,
                    onChange: (e) => setLife((p) => ({
                      ...p,
                      liabilities: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Dependents" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.life.dependents.input",
                    type: "number",
                    value: life.dependents,
                    onChange: (e) => setLife((p) => ({
                      ...p,
                      dependents: Number(e.target.value)
                    })),
                    className: "h-8 text-sm",
                    min: 0
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                  "Current Cover (",
                  sym,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.life.cover.input",
                    type: "number",
                    value: life.currentCover,
                    onChange: (e) => setLife((p) => ({
                      ...p,
                      currentCover: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-3 bg-primary/10 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Recommended Cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary", children: fmt(lifeRecommended, sym) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Coverage Gap" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: lifeGap > 0 ? "destructive" : "default", children: lifeGap > 0 ? fmt(lifeGap, sym) : "Fully Covered" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CoverageBar,
              {
                recommended: lifeRecommended,
                current: life.currentCover,
                label: "Life Insurance Coverage"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-success/5 to-chart-2/5 border-success/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-success" }),
            " Health Insurance"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Family Size" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.health.family.input",
                    type: "number",
                    value: health.familySize,
                    onChange: (e) => setHealth((p) => ({
                      ...p,
                      familySize: Number(e.target.value)
                    })),
                    className: "h-8 text-sm",
                    min: 1
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Primary Age" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.health.age.input",
                    type: "number",
                    value: health.age,
                    onChange: (e) => setHealth((p) => ({
                      ...p,
                      age: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "City Tier" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: health.cityTier,
                    onValueChange: (v) => setHealth((p) => ({ ...p, cityTier: v })),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          "data-ocid": "financialmodel.insurance.health.city.select",
                          className: "h-8 text-sm",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "tier1", children: "Tier 1 (Metro)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "tier2", children: "Tier 2" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "tier3", children: "Tier 3" })
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                  "Current Cover (",
                  sym,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.health.cover.input",
                    type: "number",
                    value: health.currentCover,
                    onChange: (e) => setHealth((p) => ({
                      ...p,
                      currentCover: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-3 bg-success/10 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Recommended Cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-success", children: fmt(healthRecommended, sym) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Coverage Gap" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: healthGap > 0 ? "destructive" : "default", children: healthGap > 0 ? fmt(healthGap, sym) : "Fully Covered" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CoverageBar,
              {
                recommended: healthRecommended,
                current: health.currentCover,
                label: "Health Insurance Coverage"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-warning/5 to-chart-3/5 border-warning/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-warning" }),
            " Term Insurance"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Age" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.term.age.input",
                    type: "number",
                    value: term.age,
                    onChange: (e) => setTerm((p) => ({ ...p, age: Number(e.target.value) })),
                    className: "h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                  "Annual Income (",
                  sym,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.term.income.input",
                    type: "number",
                    value: term.income,
                    onChange: (e) => setTerm((p) => ({
                      ...p,
                      income: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Term Period (yrs)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.term.period.input",
                    type: "number",
                    value: term.termYears,
                    onChange: (e) => setTerm((p) => ({
                      ...p,
                      termYears: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                  "Current Cover (",
                  sym,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.term.cover.input",
                    type: "number",
                    value: term.currentCover,
                    onChange: (e) => setTerm((p) => ({
                      ...p,
                      currentCover: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-3 bg-warning/10 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Recommended Cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: fmt(termRecommended, sym) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Est. Monthly Premium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-warning", children: [
                  fmt(termPremiumEstimate, sym),
                  "/mo"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Coverage Gap" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: termGap > 0 ? "destructive" : "default", children: termGap > 0 ? fmt(termGap, sym) : "Fully Covered" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CoverageBar,
              {
                recommended: termRecommended,
                current: term.currentCover,
                label: "Term Insurance Coverage"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-destructive/5 to-chart-4/5 border-destructive/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive" }),
            " ",
            "Critical Illness"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Age" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.critical.age.input",
                    type: "number",
                    value: critical.age,
                    onChange: (e) => setCritical((p) => ({
                      ...p,
                      age: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                  "Annual Income (",
                  sym,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.critical.income.input",
                    type: "number",
                    value: critical.income,
                    onChange: (e) => setCritical((p) => ({
                      ...p,
                      income: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                  "Current Critical Illness Cover (",
                  sym,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "financialmodel.insurance.critical.cover.input",
                    type: "number",
                    value: critical.currentCover,
                    onChange: (e) => setCritical((p) => ({
                      ...p,
                      currentCover: Number(e.target.value)
                    })),
                    className: "h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg p-3 bg-destructive/10 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Recommended Cover (5x income)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-destructive", children: fmt(criticalRecommended, sym) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Coverage Gap" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: criticalGap > 0 ? "destructive" : "default",
                    children: criticalGap > 0 ? fmt(criticalGap, sym) : "Fully Covered"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CoverageBar,
              {
                recommended: criticalRecommended,
                current: critical.currentCover,
                label: "Critical Illness Coverage"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-info/10 to-chart-4/10 border-info/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-info" }),
          " Key Insurance Tips"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-info font-bold", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Buy term insurance early — premiums increase significantly with age" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-info font-bold", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Health insurance should be bought when young and healthy for better terms" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-info font-bold", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Life cover = 10–15x annual income + all outstanding liabilities (IRDAI guideline)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-info font-bold", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Critical illness cover protects against income loss during treatment periods" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-info font-bold", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Review insurance needs every 3–5 years or after major life events (marriage, child, home loan)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-info font-bold", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Never mix insurance and investment — avoid ULIPs and endowment plans; buy pure term + invest the rest" })
          ] })
        ] }) })
      ] })
    ] })
  ] }) });
}
const RiskProfile = {
  conservative: "conservative",
  moderate: "moderate",
  high: "high"
};
function ModelPortfolioTab() {
  var _a;
  const { formatCurrency, country } = useCurrency();
  const [riskProfile, setRiskProfile] = reactExports.useState(
    RiskProfile.moderate
  );
  const [portfolioType, setPortfolioType] = reactExports.useState("both");
  const [initialCapital, setInitialCapital] = reactExports.useState("100000");
  const [investmentType, setInvestmentType] = reactExports.useState(null);
  const [sipAmount, setSipAmount] = reactExports.useState("5000");
  const [allocations, setAllocations] = reactExports.useState([]);
  const [forecastData, setForecastData] = reactExports.useState([]);
  const COLORS2 = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF6B9D"
  ];
  reactExports.useEffect(() => {
    generateModelPortfolio();
  }, [riskProfile, portfolioType, initialCapital]);
  reactExports.useEffect(() => {
    if (investmentType && allocations.length > 0) {
      generateForecast();
    }
  }, [investmentType, sipAmount, initialCapital, riskProfile, allocations]);
  const generateModelPortfolio = () => {
    const assets = [];
    if (portfolioType === "mutualFunds" || portfolioType === "both") {
      if (riskProfile === RiskProfile.conservative) {
        assets.push(
          { name: "Balanced Advantage Fund", allocation: 25 },
          { name: "Debt Fund", allocation: 30 },
          { name: "Multi-Asset Fund", allocation: 25 },
          { name: "Liquid Fund", allocation: 20 }
        );
      } else if (riskProfile === RiskProfile.moderate) {
        assets.push(
          { name: "Large Cap Fund", allocation: 30 },
          { name: "Flexi Cap Fund", allocation: 25 },
          { name: "Multi-Cap Fund", allocation: 25 },
          { name: "Mid Cap Fund", allocation: 20 }
        );
      } else {
        assets.push(
          { name: "Flexi Cap Fund", allocation: 30 },
          { name: "Small Cap Fund", allocation: 25 },
          { name: "Mid Cap Fund", allocation: 25 },
          { name: "Multi-Cap Fund", allocation: 20 }
        );
      }
    }
    if (portfolioType === "etf" || portfolioType === "both") {
      if (riskProfile === RiskProfile.conservative) {
        assets.push(
          { name: "Large Cap Index ETF", allocation: 40 },
          { name: "Nifty 50 ETF", allocation: 35 },
          { name: "Banking Sector ETF", allocation: 25 }
        );
      } else if (riskProfile === RiskProfile.moderate) {
        assets.push(
          { name: "Nifty 50 ETF", allocation: 35 },
          { name: "Large Cap ETF", allocation: 30 },
          { name: "Midcap 100 ETF", allocation: 35 }
        );
      } else {
        assets.push(
          { name: "Nifty Next 50 ETF", allocation: 35 },
          { name: "International Index ETF", allocation: 35 },
          { name: "Smallcap ETF", allocation: 30 }
        );
      }
    }
    const totalAllocation = assets.reduce(
      (sum, asset) => sum + asset.allocation,
      0
    );
    const normalizedAssets = assets.map((asset) => ({
      ...asset,
      allocation: asset.allocation / totalAllocation * 100
    }));
    setAllocations(normalizedAssets);
  };
  const generateForecast = () => {
    const capital = Number.parseFloat(initialCapital) || 0;
    const sip = Number.parseFloat(sipAmount) || 0;
    const expectedReturn = riskProfile === RiskProfile.conservative ? 0.08 : riskProfile === RiskProfile.moderate ? 0.12 : 0.15;
    const data = [];
    if (investmentType === "lumpsum") {
      for (let year = 0; year <= 25; year++) {
        const value = capital * (1 + expectedReturn) ** year;
        data.push({ year, value });
      }
    } else if (investmentType === "sip") {
      for (let year = 0; year <= 25; year++) {
        const lumpsumValue = capital * (1 + expectedReturn) ** year;
        const sipValue = sip * 12 * (((1 + expectedReturn) ** year - 1) / expectedReturn);
        data.push({ year, value: lumpsumValue + sipValue });
      }
    }
    setForecastData(data);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl shadow-sm border border-slate-100 bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      CardHeader,
      {
        style: { borderLeft: "3px solid #2563eb", paddingLeft: "1.25rem" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-bold text-slate-800 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { className: "h-5 w-5" }),
            "Portfolio Configuration"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure your investment preferences - portfolio updates automatically" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Investor Risk Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: riskProfile,
              onValueChange: (value) => setRiskProfile(value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: RiskProfile.conservative, children: "Conservative" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: RiskProfile.moderate, children: "Moderate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: RiskProfile.high, children: "Aggressive" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Portfolio Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: portfolioType,
              onValueChange: (value) => setPortfolioType(value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mutualFunds", children: "Mutual Funds" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "etf", children: "ETF" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "both", children: "Both" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Base Initial Capital (",
            country.symbol,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: initialCapital,
              onChange: (e) => setInitialCapital(e.target.value),
              placeholder: "100000"
            }
          )
        ] })
      ] }),
      allocations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Asset Allocation" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Pie,
                {
                  data: allocations,
                  cx: "50%",
                  cy: "50%",
                  labelLine: false,
                  label: ({
                    name,
                    allocation
                  }) => `${name.split(" ")[0]}: ${allocation.toFixed(1)}%`,
                  innerRadius: 55,
                  outerRadius: 80,
                  fill: "#8884d8",
                  dataKey: "allocation",
                  children: allocations.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Cell,
                    {
                      fill: COLORS2[index % COLORS2.length]
                    },
                    item.name
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (value) => `${value.toFixed(2)}%`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Portfolio Details" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: allocations.map((asset, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between p-3 rounded-lg bg-muted/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-4 h-4 rounded",
                        style: {
                          backgroundColor: COLORS2[index % COLORS2.length]
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: asset.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
                      asset.allocation.toFixed(2),
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatCurrency(
                      (Number.parseFloat(initialCapital) || 0) * asset.allocation / 100
                    ) })
                  ] })
                ]
              },
              asset.name
            )) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Investment Strategy" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setInvestmentType("sip"),
                  className: `h-auto py-4 rounded-lg border-2 transition-all ${investmentType === "sip" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-6 w-6 mx-auto mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "SIP Investment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Systematic Investment Plan" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setInvestmentType("lumpsum"),
                  className: `h-auto py-4 rounded-lg border-2 transition-all ${investmentType === "lumpsum" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-6 w-6 mx-auto mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: "Lumpsum Investment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "One-time Investment" })
                  ] })
                }
              )
            ] }),
            investmentType === "sip" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Monthly SIP Amount (",
                country.symbol,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: sipAmount,
                  onChange: (e) => setSipAmount(e.target.value),
                  placeholder: "5000"
                }
              )
            ] })
          ] })
        ] }),
        forecastData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5" }),
              "25-Year Portfolio Forecast"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
              "Projected portfolio value over 25 years (",
              investmentType === "sip" ? "SIP" : "Lumpsum",
              " investment)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 400, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: forecastData, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "year",
                  label: {
                    value: "Years",
                    position: "insideBottom",
                    offset: -5
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  tickFormatter: (value) => formatCurrency(value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (value) => formatCurrency(value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Line,
                {
                  type: "monotone",
                  dataKey: "value",
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 3
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-blue-500/5 border-blue-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Initial Investment" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-blue-600", children: formatCurrency(
                  Number.parseFloat(initialCapital) || 0
                ) })
              ] }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-green-500/5 border-green-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Projected Value (25Y)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-green-600", children: formatCurrency(
                  ((_a = forecastData[forecastData.length - 1]) == null ? void 0 : _a.value) || 0
                ) })
              ] }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-primary/5 border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Expected Returns" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-bold text-primary", children: [
                  riskProfile === RiskProfile.conservative ? "8%" : riskProfile === RiskProfile.moderate ? "12%" : "15%",
                  " ",
                  "p.a."
                ] })
              ] }) }) })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
const allocationModels = {
  conservative: {
    name: "Conservative (Low Risk)",
    allocation: [
      { name: "Debt Mutual Funds", value: 40, fill: "#3b82f6" },
      { name: "Fixed Deposits", value: 30, fill: "#f59e0b" },
      { name: "Bonds", value: 20, fill: "#8b5cf6" },
      { name: "Index ETFs", value: 10, fill: "#10b981" }
    ],
    description: "Focus on capital preservation with minimal risk. Suitable for those nearing retirement or with low risk tolerance.",
    expectedReturn: 7.5
  },
  moderate: {
    name: "Moderate (Balanced Risk)",
    allocation: [
      { name: "Debt Mutual Funds", value: 35, fill: "#3b82f6" },
      { name: "Index ETFs", value: 30, fill: "#10b981" },
      { name: "Fixed Deposits", value: 20, fill: "#f59e0b" },
      { name: "Bonds", value: 15, fill: "#8b5cf6" }
    ],
    description: "Balanced approach with moderate growth potential. Suitable for mid-career professionals planning retirement.",
    expectedReturn: 9.5
  },
  aggressive: {
    name: "Aggressive (Higher Risk)",
    allocation: [
      { name: "Index ETFs", value: 40, fill: "#10b981" },
      { name: "Debt Mutual Funds", value: 30, fill: "#3b82f6" },
      { name: "Equity Mutual Funds", value: 20, fill: "#ef4444" },
      { name: "Bonds", value: 10, fill: "#8b5cf6" }
    ],
    description: "Growth-focused with higher risk tolerance. Suitable for younger investors with longer time horizons.",
    expectedReturn: 12
  }
};
function RetirementPlannerContent() {
  const { formatCurrency, country } = useCurrency();
  const [selectedProfile, setSelectedProfile] = reactExports.useState("moderate");
  const [initialCapital, setInitialCapital] = reactExports.useState("1000000");
  const [monthlySIP, setMonthlySIP] = reactExports.useState("25000");
  const [yearsToRetirement, setYearsToRetirement] = reactExports.useState("20");
  const model = allocationModels[selectedProfile];
  const capital = Number.parseFloat(initialCapital) || 0;
  const sip = Number.parseFloat(monthlySIP) || 0;
  const years = Number.parseInt(yearsToRetirement) || 20;
  const calculateProjection = () => {
    const monthlyRate = model.expectedReturn / 100 / 12;
    const months = years * 12;
    const lumpsumFV = capital * (1 + monthlyRate) ** months;
    const sipFV = sip * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    return lumpsumFV + sipFV;
  };
  const projectedCorpus = calculateProjection();
  const projectionData = Array.from({ length: Math.min(years, 25) }, (_, i) => {
    const year = i + 1;
    const months = year * 12;
    const monthlyRate = model.expectedReturn / 100 / 12;
    const lumpsumFV = capital * (1 + monthlyRate) ** months;
    const sipFV = sip * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    return { year: `Year ${year}`, corpus: Math.round(lumpsumFV + sipFV) };
  });
  const allocationAmounts = model.allocation.map((item) => ({
    ...item,
    amount: capital * item.value / 100
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl shadow-sm border border-slate-100 bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CardHeader,
          {
            style: { borderLeft: "3px solid #10b981", paddingLeft: "1.25rem" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-bold text-slate-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-primary" }),
              "Retirement Planner"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Risk Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: selectedProfile,
                onValueChange: (value) => setSelectedProfile(value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "conservative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-emerald-500" }),
                      "Conservative (Low Risk)"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "moderate", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-primary" }),
                      "Moderate (Balanced)"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "aggressive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-amber-500" }),
                      "Aggressive (Growth)"
                    ] }) })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Initial Capital (",
                country.symbol,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: initialCapital,
                  onChange: (e) => setInitialCapital(e.target.value),
                  min: "0",
                  step: "10000"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Monthly SIP (",
                country.symbol,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: monthlySIP,
                  onChange: (e) => setMonthlySIP(e.target.value),
                  min: "0",
                  step: "1000"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Years to Retirement" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: yearsToRetirement,
                  onChange: (e) => setYearsToRetirement(e.target.value),
                  min: "1",
                  max: "40"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-emerald-50 border-emerald-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Projected Retirement Corpus" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-emerald-600", children: formatCurrency(projectedCorpus) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
              "After ",
              years,
              " years at ",
              model.expectedReturn,
              "% annual return"
            ] })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl shadow-sm border border-slate-100 bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          CardHeader,
          {
            style: { borderLeft: "3px solid #10b981", paddingLeft: "1.25rem" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-bold text-slate-800 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary" }),
                "Suggested Asset Allocation"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
                "Recommended distribution for ",
                model.name
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Pie,
              {
                data: model.allocation,
                cx: "50%",
                cy: "50%",
                labelLine: false,
                label: (entry) => `${entry.name.split(" ")[0]}: ${entry.value}%`,
                innerRadius: 50,
                outerRadius: 100,
                dataKey: "value",
                children: model.allocation.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.fill }, entry.name))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                formatter: (value) => `${value}%`,
                contentStyle: { fontSize: "12px" }
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm mb-3", children: "Allocation Breakdown" }),
            allocationAmounts.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between p-2 rounded-lg bg-muted/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-3 h-3 rounded-full",
                        style: { backgroundColor: item.fill }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: item.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: formatCurrency(item.amount) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      item.value,
                      "%"
                    ] })
                  ] })
                ]
              },
              item.name
            ))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl shadow-sm border border-slate-100 bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        CardHeader,
        {
          style: { borderLeft: "3px solid #10b981", paddingLeft: "1.25rem" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-bold text-slate-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary" }),
              "Corpus Growth Projection"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
              "Year-wise retirement corpus growth over ",
              years,
              " years"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 350, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: projectionData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "year",
            tick: { fontSize: 11 },
            angle: -45,
            textAnchor: "end",
            height: 80
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            tick: { fontSize: 11 },
            tickFormatter: (value) => formatCurrency(value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            formatter: (value) => [formatCurrency(value), "Corpus"],
            contentStyle: {
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              fontSize: "12px"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Line,
          {
            type: "monotone",
            dataKey: "corpus",
            stroke: "#10b981",
            strokeWidth: 3,
            dot: { fill: "#10b981", r: 4 },
            activeDot: { r: 6 }
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-xl border border-indigo-100 bg-indigo-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-primary mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-1", children: "Capital Preservation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Focus on safer instruments to protect your retirement corpus" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-xl border border-emerald-100 bg-emerald-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-emerald-500 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-1", children: "Steady Income" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Generate regular income through dividends and interest" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-xl border border-amber-100 bg-amber-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "h-5 w-5 text-amber-500 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-1", children: "Tax Efficiency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Optimize tax benefits through strategic asset allocation" })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Disclaimer:" }),
      " This is a suggested model portfolio for retirement planning based on industry standards. Actual returns may vary based on market conditions. Please consult with a certified financial advisor before making investment decisions. Past performance does not guarantee future results."
    ] }) })
  ] });
}
function ModelRetirementTab() {
  const [open, setOpen] = reactExports.useState(null);
  const toggle = (id) => setOpen((p) => p === id ? null : id);
  const subCards = [
    {
      id: "retirement",
      title: "Retirement Planner",
      emoji: "🌅",
      content: /* @__PURE__ */ jsxRuntimeExports.jsx(RetirementPlannerContent, {})
    },
    {
      id: "fire",
      title: "FIRE Planner",
      emoji: "🔥",
      content: /* @__PURE__ */ jsxRuntimeExports.jsx(FIRECalculator, {})
    },
    {
      id: "threebucket",
      title: "3-Bucket Planner",
      emoji: "🪣",
      content: /* @__PURE__ */ jsxRuntimeExports.jsx(ThreeBucketCalculator, {})
    },
    {
      id: "twobucket",
      title: "2-Bucket Planner",
      emoji: "💼",
      content: /* @__PURE__ */ jsxRuntimeExports.jsx(TwoBucketCalculator, {})
    },
    {
      id: "readiness",
      title: "Retirement Readiness Score",
      emoji: "✅",
      content: /* @__PURE__ */ jsxRuntimeExports.jsx(RetirementReadinessCalculator, {})
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: subCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden",
      style: { borderLeft: "4px solid #14b8a6" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => toggle(card.id),
            className: "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: card.emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-slate-800", children: card.title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  className: `w-4 h-4 text-slate-400 transition-transform duration-200 ${open === card.id ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        open === card.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 border-t border-slate-50", children: card.content })
      ]
    },
    card.id
  )) });
}
const SECTIONS = [
  {
    id: "assetallocation",
    label: "Asset Allocation",
    emoji: "📊",
    borderColor: "#6366f1",
    count: "Conservative · Moderate · Aggressive"
  },
  {
    id: "goalmodel",
    label: "Goal Planning",
    emoji: "🎯",
    borderColor: "#8b5cf6",
    count: "SIP Calculator · Inflation-Adjusted · Goal Stack"
  },
  {
    id: "budgetingmodel",
    label: "Budget & Expense Tracking",
    emoji: "💰",
    borderColor: "#3b82f6",
    count: "50/30/20 Rule · Leakage Detection · Budget Plan"
  },
  {
    id: "modelportfolio",
    label: "Model Portfolio & Investments",
    emoji: "💼",
    borderColor: "#10b981",
    count: "MF · ETF · Mixed"
  },
  {
    id: "debtmodel",
    label: "Loan Management & Repayment",
    emoji: "📉",
    borderColor: "#ef4444",
    count: "Avalanche · Snowball · Debt Freedom Date"
  },
  {
    id: "modelretirement",
    label: "Model Retirement",
    emoji: "🌅",
    borderColor: "#14b8a6",
    count: "Early · Regular · Late"
  },
  {
    id: "modelinsurance",
    label: "Model Insurance",
    emoji: "🛡️",
    borderColor: "#0ea5e9",
    count: "Term · Health · HLV"
  },
  {
    id: "modelcrypto",
    label: "Model Crypto",
    emoji: "₿",
    borderColor: "#f97316",
    count: "Conservative · Balanced · Growth"
  }
];
const MODEL_SCENARIOS = {
  budgetingmodel: [
    {
      id: "budget_setup",
      title: "Initial Budget Setup",
      description: "Build a structured monthly budget from your income and known expenses using the 50/30/20 rule."
    },
    {
      id: "leakage",
      title: "Leakage Detection",
      description: "Running out of money before month-end? Identify hidden spending leaks by category."
    },
    {
      id: "tighten",
      title: "Budget Tightening",
      description: "Need to cut expenses by a target amount without sacrificing key lifestyle items."
    },
    {
      id: "irregular",
      title: "Irregular Income",
      description: "Freelancer or variable income? Build a flexible budget that works across high and low months."
    }
  ],
  debtmodel: [
    {
      id: "inventory",
      title: "Debt Inventory & Strategy",
      description: "List all debts, compare Avalanche vs Snowball strategies, and find your debt-free date."
    },
    {
      id: "overwhelm",
      title: "Prioritize Multiple Debts",
      description: "Have extra money each month but unsure which debt to tackle first? Get a clear roadmap."
    },
    {
      id: "cc_trap",
      title: "Credit Card Minimum Payment Trap",
      description: "Paying only minimums? See the true cost and get an escape plan."
    },
    {
      id: "consolidation",
      title: "Debt Consolidation Analysis",
      description: "Should you take a personal loan to close credit card debt? Get a data-driven answer."
    },
    {
      id: "sip_vs_debt",
      title: "SIP vs Debt Repayment Dilemma",
      description: "Should you pause investments to pay off loans faster? Find the optimal balance."
    }
  ],
  goalmodel: [
    {
      id: "single_goal",
      title: "Single Goal Planning",
      description: "Buy a car, fund a vacation, or save for a course — get the exact monthly saving required."
    },
    {
      id: "multi_goal",
      title: "Multiple Goals Prioritization",
      description: "Education, home down payment, and retirement — allocate your savings optimally across all goals."
    },
    {
      id: "retirement",
      title: "Retirement Corpus Calculator",
      description: "Inflation-adjusted retirement planning: how much do you need and how to get there."
    },
    {
      id: "cost_of_delay",
      title: "Cost of Delay Analysis",
      description: "See in rupees what 1-2 years of delay has already cost you in compounding returns."
    },
    {
      id: "windfall",
      title: "Windfall Allocation",
      description: "Got a salary hike or bonus? Prioritize between emergency fund, retirement, and goal SIPs."
    }
  ]
};
function getModelScenarios(modelId) {
  return MODEL_SCENARIOS[modelId] ?? [];
}
function FinancialModelingTab() {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [activeSectionId, setActiveSectionId] = reactExports.useState(null);
  const [activeScenarioId, setActiveScenarioId] = reactExports.useState(null);
  useIsMobile();
  const MODEL_IDS = /* @__PURE__ */ new Set(["budgetingmodel"]);
  const filteredSections = searchQuery.trim() ? SECTIONS.filter(
    (s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.count.toLowerCase().includes(searchQuery.toLowerCase())
  ) : SECTIONS;
  const backBtn = (onClick, label = "Back to Menu") => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: "flex items-center gap-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-lg mb-4 transition-colors",
      "data-ocid": "financialmodel.back_button",
      children: [
        "← ",
        label
      ]
    }
  );
  if (activeSectionId && MODEL_IDS.has(activeSectionId) && (activeScenarioId == null ? void 0 : activeScenarioId.startsWith(`${activeSectionId}::`))) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-fade-in", children: [
      backBtn(() => {
        setActiveScenarioId(null);
        if (!MODEL_IDS.has(activeSectionId ?? "")) {
          setActiveSectionId(null);
        }
      }),
      activeSectionId === "budgetingmodel" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ModelBudgetingTab,
        {
          initialScenario: activeScenarioId.split("::")[1]
        }
      ),
      activeSectionId === "debtmodel" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModelDebtTab, { initialScenario: activeScenarioId.split("::")[1] }),
      activeSectionId === "goalmodel" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        ModelGoalPlanningTab,
        {
          initialScenario: activeScenarioId.split("::")[1]
        }
      )
    ] });
  }
  if (activeSectionId) {
    const section = SECTIONS.find((s) => s.id === activeSectionId);
    if (!section) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-fade-in", children: [
      backBtn(() => {
        setActiveSectionId(null);
        setActiveScenarioId(null);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden",
          style: { borderLeft: `4px solid ${section.borderColor}` },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-slate-100 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: section.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-800", children: section.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: section.count })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", children: [
              section.id === "modelinsurance" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModelInsuranceTab, {}),
              section.id === "assetallocation" && /* @__PURE__ */ jsxRuntimeExports.jsx(AssetAllocationTab, {}),
              section.id === "modelportfolio" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModelPortfolioTab, {}),
              section.id === "modelretirement" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModelRetirementTab, {}),
              section.id === "modelcrypto" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModelCryptoPortfolioTab, {}),
              section.id === "goalmodel" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModelGoalPlanningTab, {}),
              section.id === "debtmodel" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModelDebtTab, {}),
              MODEL_IDS.has(section.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: getModelScenarios(section.id).map((scenario, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setActiveScenarioId(`${section.id}::${scenario.id}`);
                  },
                  className: "w-full text-left px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 transition-all group flex items-center gap-3",
                  style: { borderLeft: `3px solid ${section.borderColor}` },
                  "data-ocid": `financialmodel.${section.id}.scenario.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:border-violet-400 group-hover:text-violet-700 flex-shrink-0", children: idx + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-800 group-hover:text-violet-800", children: scenario.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5 line-clamp-1", children: scenario.description })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-violet-500 group-hover:text-violet-700 flex-shrink-0", children: "→" })
                  ]
                },
                scenario.id
              )) })
            ] })
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "text",
          placeholder: "Search financial models...",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          className: "pl-10",
          "data-ocid": "financialmodel.search_input"
        }
      )
    ] }),
    filteredSections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "w-full text-left bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:bg-slate-50 transition-all flex items-center gap-3 px-4 py-3",
        style: { borderLeft: `4px solid ${section.borderColor}` },
        onClick: () => {
          setActiveSectionId(section.id);
          setActiveScenarioId(null);
        },
        "data-ocid": `financialmodel.${section.id}.toggle`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl flex-shrink-0", children: section.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-slate-800", children: section.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: section.count })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-sm flex-shrink-0", children: "→" })
        ]
      },
      section.id
    ))
  ] });
}
const ASSET_TYPE_TO_KEY = {
  [AssetType.Retirement]: "Retiral",
  [AssetType.ETF]: "Equity (ETF & Stocks)",
  [AssetType.MutualFund]: "Mutual Funds",
  [AssetType.Commodity]: "Commodities",
  [AssetType.RealEstate]: "Real Estate",
  [AssetType.FixedIncome]: "Fixed Income",
  [AssetType.Crypto]: "Crypto",
  [AssetType.Other]: "IPO/Unlisted/Other"
};
function AssetAllocationTab() {
  const [selectedProfile, setSelectedProfile] = reactExports.useState("moderate");
  const { actor } = useActor();
  const [holdings, setHoldings] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!actor) return;
    actor.getAllPortfolioHoldings().then(setHoldings).catch(() => setHoldings([]));
  }, [actor]);
  const actualAllocations = reactExports.useMemo(() => {
    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const result = {};
    if (totalValue === 0) return result;
    for (const h of holdings) {
      const key = ASSET_TYPE_TO_KEY[h.assetType] ?? "IPO/Unlisted/Other";
      result[key] = (result[key] ?? 0) + h.currentValue / totalValue * 100;
    }
    return result;
  }, [holdings]);
  function generateRecommendations(planned, actual) {
    const recs = [];
    const totalActual = Object.values(actual).reduce((s, v) => s + v, 0);
    if (totalActual === 0) {
      recs.push(
        "No portfolio data found. Start adding investments to see personalized allocation recommendations."
      );
      recs.push(
        `For a ${selectedProfile} profile, prioritize ${selectedProfile === "conservative" ? "Retiral (30%) and Fixed Income (25%)" : selectedProfile === "moderate" ? "Equity (22%) and Mutual Funds (20%)" : "Equity (35%) and Mutual Funds (22%)"} as your core allocation.`
      );
      recs.push(
        "Diversify across at least 4–5 asset classes to reduce concentration risk."
      );
      return recs;
    }
    for (const [asset, plannedPct] of Object.entries(planned)) {
      const actualPct = actual[asset] ?? 0;
      const variance = actualPct - plannedPct;
      if (variance < -5) {
        recs.push(
          `${asset} is under-allocated (Actual: ${actualPct.toFixed(1)}% vs Target: ${plannedPct}%). Consider increasing exposure to rebalance.`
        );
      } else if (variance > 5) {
        recs.push(
          `${asset} is over-allocated (Actual: ${actualPct.toFixed(1)}% vs Target: ${plannedPct}%). Consider booking partial profits or redirecting new investments elsewhere.`
        );
      }
    }
    if (recs.length === 0) {
      recs.push(
        "Your portfolio allocation is well-balanced and aligns closely with your risk profile targets."
      );
      recs.push(
        "Continue SIP investments to maintain this allocation as markets move."
      );
    }
    recs.push(
      `Industry standard for ${selectedProfile} profile: rebalance quarterly when any asset class deviates more than 5% from target allocation.`
    );
    return recs;
  }
  const riskProfiles = {
    conservative: {
      name: "Conservative",
      description: "Low risk, stable returns with capital preservation focus",
      allocation: {
        Retiral: 30,
        "Equity (ETF & Stocks)": 15,
        "Mutual Funds": 15,
        Commodities: 5,
        "Real Estate": 5,
        "Fixed Income": 25,
        Crypto: 0,
        "IPO/Unlisted/Other": 5
      },
      color: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      topBorder: "border-t-green-500",
      badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      bullet: "text-green-600",
      returnRange: "6–8% p.a.",
      riskLabel: "Low Risk",
      riskBadge: "bg-green-100 text-green-700 border-green-200",
      icon: "🛡️"
    },
    moderate: {
      name: "Moderate",
      description: "Balanced risk-return with diversified portfolio",
      allocation: {
        Retiral: 20,
        "Equity (ETF & Stocks)": 22,
        "Mutual Funds": 20,
        Commodities: 8,
        "Real Estate": 10,
        "Fixed Income": 15,
        Crypto: 5,
        "IPO/Unlisted/Other": 0
      },
      color: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      topBorder: "border-t-blue-500",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      bullet: "text-blue-600",
      returnRange: "10–12% p.a.",
      riskLabel: "Medium Risk",
      riskBadge: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "⚖️"
    },
    aggressive: {
      name: "Aggressive",
      description: "High risk, high return with growth-oriented investments",
      allocation: {
        Retiral: 10,
        "Equity (ETF & Stocks)": 35,
        "Mutual Funds": 22,
        Commodities: 5,
        "Real Estate": 8,
        "Fixed Income": 5,
        Crypto: 10,
        "IPO/Unlisted/Other": 5
      },
      color: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      topBorder: "border-t-orange-500",
      badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      bullet: "text-orange-600",
      returnRange: "14–18% p.a.",
      riskLabel: "High Risk",
      riskBadge: "bg-orange-100 text-orange-700 border-orange-200",
      icon: "🚀"
    }
  };
  const profile = riskProfiles[selectedProfile];
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#14b8a6"
  ];
  const pieChartData = Object.entries(profile.allocation).map(
    ([name, value], idx) => ({
      name,
      value,
      fill: colors[idx % colors.length]
    })
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 max-w-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-slate-700 whitespace-nowrap", children: "Risk Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: selectedProfile,
          onValueChange: (v) => setSelectedProfile(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                "data-ocid": "financialmodel.assetallocation.select",
                className: "w-[200px]",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "conservative", children: "🛡️ Conservative" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "moderate", children: "⚖️ Moderate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "aggressive", children: "🚀 Aggressive" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-xs ${riskProfiles[selectedProfile].riskBadge}`, children: riskProfiles[selectedProfile].riskLabel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-1 w-6 rounded-full bg-gradient-to-r ${profile.color}`
            }
          ),
          "Allocation Breakdown — ",
          profile.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Object.entries(profile.allocation).map(
          ([asset, percentage], idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "space-y-1 p-2 rounded-lg hover:bg-muted/50 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: asset }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-semibold", children: [
                    percentage,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 bg-muted rounded-full overflow-hidden shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full transition-all duration-700 ease-out shadow-sm",
                    style: {
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${colors[idx % colors.length]}, ${colors[(idx + 1) % colors.length]})`
                    }
                  }
                ) })
              ]
            },
            asset
          )
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-muted/30 to-transparent border border-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold mb-4", children: "Portfolio Pie Chart" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pie,
            {
              data: pieChartData,
              cx: "50%",
              cy: "50%",
              labelLine: false,
              label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`,
              innerRadius: "30%",
              outerRadius: "70%",
              dataKey: "value",
              children: pieChartData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cell,
                {
                  fill: entry.fill,
                  stroke: "#fff",
                  strokeWidth: 2
                },
                entry.name
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              formatter: (value) => `${value}%`,
              contentStyle: {
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "11px"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "11px" } })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: `border-t-4 ${profile.topBorder} bg-gradient-to-br ${profile.bgGradient} ${profile.borderColor} border`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: profile.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `bg-gradient-to-r ${profile.color} bg-clip-text text-transparent`,
                children: [
                  "Recommendations for ",
                  profile.name,
                  " Profile"
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
            selectedProfile === "conservative" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Focus on capital preservation with high allocation to bonds and FD" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Minimal exposure to volatile assets like crypto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Suitable for investors nearing retirement or with low risk tolerance" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Expected annual return: 6–8%" })
              ] })
            ] }),
            selectedProfile === "moderate" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balanced approach with diversification across asset classes" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Moderate exposure to equities and mutual funds for growth" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Suitable for investors with medium-term goals (5–10 years)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Expected annual return: 10–12%" })
              ] })
            ] }),
            selectedProfile === "aggressive" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Growth-oriented with high equity and mutual fund allocation" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Higher exposure to volatile assets including crypto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Suitable for young investors with long-term horizon (10+ years)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${profile.bullet} font-bold`, children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Expected annual return: 14–18%" })
              ] })
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 dark:bg-slate-800 px-4 py-2.5 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-700 dark:text-slate-200", children: "Planned vs Actual Allocation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: holdings.length === 0 ? "No portfolio data — showing 0% actual. Add investments to see your real allocation." : `Based on ${holdings.length} portfolio holdings` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50 dark:bg-slate-800/50 text-xs border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300", children: "Asset Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300", children: "Planned %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300", children: "Actual %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300", children: "Variance" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: Object.entries(profile.allocation).map(
          ([asset, planned], idx) => {
            const actual = actualAllocations[asset] ?? 0;
            const variance = actual - planned;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: `border-t border-border ${idx % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-slate-800/20"} hover:bg-muted/30`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-slate-700 dark:text-slate-300", children: asset }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-400", children: [
                    planned,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right tabular-nums font-semibold text-slate-800 dark:text-slate-200", children: [
                    actual.toFixed(1),
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "td",
                    {
                      className: `px-3 py-2 text-right tabular-nums font-semibold ${variance > 2 ? "text-emerald-600" : variance < -2 ? "text-red-500" : "text-slate-500"}`,
                      children: [
                        variance > 0 ? "+" : "",
                        variance.toFixed(1),
                        "%"
                      ]
                    }
                  )
                ]
              },
              asset
            );
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🤖" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-amber-800 dark:text-amber-200", children: "AI Portfolio Recommendations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-sm text-slate-700 dark:text-slate-300", children: generateRecommendations(profile.allocation, actualAllocations).map(
        (rec) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 mt-0.5 flex-shrink-0", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: rec })
        ] }, rec.slice(0, 30))
      ) })
    ] })
  ] });
}
function FinancialModelPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "financialmodel.page", className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-8 h-8 rounded-lg flex items-center justify-center",
          style: { background: "linear-gradient(135deg, #dc2626, #f87171)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-white" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-slate-800", children: "Financial Model" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialModelingTab, {})
  ] });
}
export {
  FinancialModelPage as default
};
