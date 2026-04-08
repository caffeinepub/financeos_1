import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, I as Input, x as Trash2, v as Label, Y as Sparkles, _ as Send } from "./index-Ds6U6_qE.js";
import { C as ChevronRight } from "./chevron-right-DCMaCAwf.js";
import { P as Plus } from "./plus-DOLQmNic.js";
import { C as CircleAlert } from "./circle-alert-BGc0rOCA.js";
import { T as TriangleAlert } from "./triangle-alert-CyhhuOAA.js";
import { a as CircleCheckBig } from "./circle-check-CHreh_cm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
const fmt = (n) => Math.round(n).toLocaleString("en-IN");
const fmtC = (n) => `₹${fmt(n)}`;
function calcEMI(principal, annualRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate <= 0) return Math.round(principal / months);
  const r = annualRate / 12 / 100;
  return Math.round(
    principal * r * (1 + r) ** months / ((1 + r) ** months - 1)
  );
}
function monthsFromNow(months) {
  const d = /* @__PURE__ */ new Date();
  d.setMonth(d.getMonth() + Math.max(0, Math.round(months)));
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}
const SCENARIOS = [
  {
    id: "multi",
    title: "Multiple Debts, Full Plan",
    desc: "Personal loan + credit card + car loan. EMIs total ₹22,000. ₹5,000 extra available.",
    debts: [
      { name: "Personal Loan", balance: 35e4, rate: 14, months: 30, emi: 0 },
      { name: "Credit Card", balance: 85e3, rate: 36, months: 12, emi: 0 },
      { name: "Car Loan", balance: 12e4, rate: 9, months: 18, emi: 0 }
    ],
    extra: 5e3
  },
  {
    id: "fourloans",
    title: "4 Loans, ₹15,000 Extra",
    desc: "4 different loans, ₹15,000 free each month. Which one to pay first?",
    debts: [
      { name: "Credit Card A", balance: 6e4, rate: 36, months: 8, emi: 0 },
      { name: "Personal Loan", balance: 2e5, rate: 16, months: 24, emi: 0 },
      { name: "Education Loan", balance: 3e5, rate: 10, months: 36, emi: 0 },
      { name: "Vehicle Loan", balance: 15e4, rate: 9, months: 20, emi: 0 }
    ],
    extra: 15e3
  },
  {
    id: "minpay",
    title: "Credit Card Minimum Payment Trap",
    desc: "Paying only minimum due for 8 months. Balance keeps growing.",
    debts: [
      { name: "Credit Card", balance: 12e4, rate: 42, months: 12, emi: 0 }
    ],
    extra: 3e3
  },
  {
    id: "consolidation",
    title: "Credit Card Consolidation Decision",
    desc: "Consider taking a personal loan at 14% to close ₹2,40,000 in credit card debt at 36%.",
    debts: [
      {
        name: "Credit Card Debt (Total)",
        balance: 24e4,
        rate: 36,
        months: 18,
        emi: 0
      }
    ],
    extra: 0
  },
  {
    id: "sipvsdebt",
    title: "SIP vs Debt Payoff",
    desc: "Should you stop your SIP to repay a personal loan faster?",
    debts: [
      { name: "Personal Loan", balance: 25e4, rate: 13, months: 24, emi: 0 }
    ],
    extra: 1e4
  }
];
function analyzeDebts(debts, extra) {
  var _a, _b, _c;
  const valid = debts.filter((d) => d.balance > 0 && d.months > 0);
  if (valid.length === 0)
    return {
      result: null,
      error: "Please add at least one debt with a balance greater than 0 and months remaining greater than 0."
    };
  if (valid.some((d) => d.rate < 0 || d.rate > 100))
    return {
      result: null,
      error: "Interest rate must be between 0% and 100%. Check your entries."
    };
  if (valid.some((d) => d.balance < 0))
    return { result: null, error: "Debt balance cannot be negative." };
  if (extra < 0)
    return { result: null, error: "Extra monthly payment cannot be negative." };
  const enriched = valid.map((d) => {
    const emi = d.emi > 0 ? d.emi : calcEMI(d.balance, d.rate, d.months);
    const totalInterest2 = Math.max(0, emi * d.months - d.balance);
    const danger = d.rate >= 24 ? "high" : d.rate >= 12 ? "medium" : "low";
    return { ...d, emi, totalInterest: totalInterest2, danger };
  });
  const sortedAvalanche = [...enriched].sort((a, b) => b.rate - a.rate);
  [...enriched].sort((a, b) => a.balance - b.balance);
  const totalBalance = enriched.reduce((s, d) => s + d.balance, 0);
  const totalEMI = enriched.reduce((s, d) => s + d.emi, 0);
  const totalInterest = enriched.reduce((s, d) => s + d.totalInterest, 0);
  const monthlyPayment = totalEMI + extra;
  const avalancheMonths = monthlyPayment > 0 ? Math.max(1, Math.round(totalBalance / monthlyPayment * 1.15)) : 999;
  const snowballMonths = monthlyPayment > 0 ? Math.max(1, Math.round(totalBalance / monthlyPayment * 1.25)) : 999;
  const normalMonths = totalEMI > 0 ? Math.round(totalBalance / totalEMI * 1.35) : 999;
  const avalancheInterestSaved = Math.round(
    totalInterest * (normalMonths - avalancheMonths) / normalMonths * 0.6
  );
  let runBal = totalBalance;
  const sixMonthPlan = Array.from({ length: 6 }, (_, i) => {
    runBal = Math.max(0, runBal - monthlyPayment);
    const topDebt = sortedAvalanche[0];
    return {
      month: i + 1,
      action: i === 0 ? `Pay minimum EMIs on all debts. Direct entire ${fmtC(extra)} extra toward ${(topDebt == null ? void 0 : topDebt.name) || "highest-rate debt"} (${(topDebt == null ? void 0 : topDebt.rate) || 0}% interest). This alone saves more than any other action.` : i === 1 ? `Continue. ${(topDebt == null ? void 0 : topDebt.name) || "High-rate debt"} balance is shrinking. Stay consistent — momentum is building.` : i === 2 ? `If ${(topDebt == null ? void 0 : topDebt.name) || "first debt"} is cleared by month 3, immediately roll that freed EMI of ${fmtC((topDebt == null ? void 0 : topDebt.emi) || 0)} toward the next highest-rate debt.` : i === 3 ? `Debt snowball is accelerating. Total balance should be near ${fmtC(runBal)} by now. Review and adjust if income changed.` : i === 4 ? "Continue the avalanche. Consider a balance-transfer card or personal loan to consolidate any remaining high-rate credit card debt at a lower rate." : `Month 6 review: recalculate remaining balances and update your debt-free date. Celebrate your progress — you have repaid ${fmtC(totalBalance - runBal)} in 6 months.`,
      balanceRemaining: runBal
    };
  });
  const highRateDebt = enriched.find((d) => d.rate >= 30);
  const consolidationNote = highRateDebt ? `Consolidation Analysis: Your ${highRateDebt.name} at ${highRateDebt.rate}% is costing you ${fmtC(Math.round(highRateDebt.balance * highRateDebt.rate / 100 / 12))} per month in interest alone. A personal loan at 13–16% on the same balance of ${fmtC(highRateDebt.balance)} would cost only ${fmtC(Math.round(highRateDebt.balance * 14 / 100 / 12))} per month in interest — saving ${fmtC(Math.round(highRateDebt.balance * (highRateDebt.rate - 14) / 100 / 12))} monthly. Consolidation makes strong financial sense here if you have a credit score above 700.` : "";
  const sipNote = enriched.some((d) => d.rate > 10) ? `SIP vs Debt: If your SIP earns 12% annually but your loan charges ${Math.max(...enriched.map((d) => d.rate))}% interest, you are losing ${Math.max(...enriched.map((d) => d.rate)) - 12}% net every year by keeping the SIP running. Pause SIPs on debts above 13% and redirect that money to debt repayment. Once debt-free, restart the SIP with the same amount plus the freed EMIs.` : "SIP vs Debt: Your loan rates are moderate (below 12%). In this case, keep your SIPs running — equity compounding at 12%+ over time outpaces the loan cost. Only pause SIPs if you have a cash-flow crisis.";
  const minPayNote = enriched.some((d) => d.rate >= 36) ? `Minimum Payment Danger: On a credit card charging ${Math.max(...enriched.filter((d) => d.rate >= 36).map((d) => d.rate))}% per year, paying only the minimum due (typically 5% of balance) means your balance barely reduces. At 36%, a balance of ${fmtC(((_a = enriched.filter((d) => d.rate >= 36)[0]) == null ? void 0 : _a.balance) || 0)} accumulates interest of ${fmtC(Math.round((((_b = enriched.filter((d) => d.rate >= 36)[0]) == null ? void 0 : _b.balance) || 0) * 0.03))} per month. After 8 months of minimum payments, you have likely paid ${fmtC(Math.round((((_c = enriched.filter((d) => d.rate >= 36)[0]) == null ? void 0 : _c.balance) || 0) * 0.03 * 8))} in interest while the principal barely moved. Stop paying minimums immediately and pay as much as possible.` : "";
  return {
    result: {
      debts: sortedAvalanche.map(
        (d) => enriched.find((e) => e.id === d.id) || d
      ),
      totalBalance,
      totalEMI,
      totalInterest,
      extraAvailable: extra,
      avalancheMonths,
      snowballMonths,
      avalancheInterestSaved,
      sixMonthPlan,
      consolidationNote,
      sipNote,
      minPayNote
    },
    error: ""
  };
}
let nextId = 1;
function ModelDebtTab({
  initialScenario
} = {}) {
  const initScenario = SCENARIOS.find((s) => s.id === initialScenario) ?? SCENARIOS[0];
  const [debts, setDebts] = reactExports.useState(
    initScenario.debts.map((d) => ({ ...d, id: nextId++ }))
  );
  const [extra, setExtra] = reactExports.useState(initScenario.extra);
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [_activeScenario, setActiveScenario] = reactExports.useState(initScenario.id);
  const [view, setView] = reactExports.useState(
    initialScenario ? "detail" : "menu"
  );
  const loadScenario = (s) => {
    setDebts(s.debts.map((d) => ({ ...d, id: nextId++ })));
    setExtra(s.extra);
    setActiveScenario(s.id);
    setResult(null);
    setError("");
  };
  const updateDebt = (id, field, value) => setDebts(
    (prev) => prev.map(
      (d) => d.id === id ? {
        ...d,
        [field]: typeof value === "string" ? value : Number(value) || 0
      } : d
    )
  );
  const addDebt = () => setDebts((prev) => [
    ...prev,
    {
      id: nextId++,
      name: "New Debt",
      balance: 1e5,
      rate: 12,
      months: 24,
      emi: 0
    }
  ]);
  const removeDebt = (id) => setDebts((prev) => prev.filter((d) => d.id !== id));
  const handleAnalyze = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const { result: r, error: e } = analyzeDebts(debts, extra);
      if (r) setResult(r);
      else setError(e);
      setLoading(false);
    }, 700);
  };
  const res = result;
  if (view === "menu") {
    const SCENARIO_COLORS_DEBT = [
      "#10b981",
      "#3b82f6",
      "#f59e0b",
      "#a855f7",
      "#f43f5e"
    ];
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 animate-fade-in", children: SCENARIOS.map((s, idx) => {
      const accentColor = SCENARIO_COLORS_DEBT[idx % SCENARIO_COLORS_DEBT.length];
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
    }) });
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-600 uppercase tracking-wide", children: "Your Debts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: addDebt,
            className: "h-7 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
              " Add Debt"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-1.5 pr-2 font-semibold text-slate-500", children: "Creditor / Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5 px-2 font-semibold text-slate-500", children: "Balance (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5 px-2 font-semibold text-slate-500", children: "Rate (%/yr)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5 px-2 font-semibold text-slate-500", children: "Months Left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5 px-2 font-semibold text-slate-500", children: "Known EMI (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: debts.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 pr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: d.name,
              onChange: (e) => updateDebt(d.id, "name", e.target.value),
              className: "h-7 text-xs min-w-[110px]"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              value: d.balance || "",
              onChange: (e) => updateDebt(d.id, "balance", e.target.value),
              className: "h-7 text-xs text-right min-w-[90px]",
              placeholder: "0"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              max: 100,
              value: d.rate || "",
              onChange: (e) => updateDebt(d.id, "rate", e.target.value),
              className: "h-7 text-xs text-right min-w-[60px]",
              placeholder: "0"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 1,
              value: d.months || "",
              onChange: (e) => updateDebt(d.id, "months", e.target.value),
              className: "h-7 text-xs text-right min-w-[60px]",
              placeholder: "12"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              value: d.emi || "",
              onChange: (e) => updateDebt(d.id, "emi", e.target.value),
              className: "h-7 text-xs text-right min-w-[80px]",
              placeholder: "Auto-calc"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 pl-1", children: debts.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => removeDebt(d.id),
              className: "text-red-400 hover:text-red-600 p-1",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          ) })
        ] }, d.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Leave EMI as 0 to auto-calculate from balance, rate, and months." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-slate-600", children: "Extra Monthly Payment (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: 0,
            value: extra || "",
            onChange: (e) => setExtra(Number(e.target.value) || 0),
            className: "h-8 text-sm",
            placeholder: "0"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Amount you can pay above all EMIs each month. Enter 0 if none." })
      ] }) })
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
        className: "w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white",
        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 mr-2 animate-spin" }),
          "Building your debt plan..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2" }),
          "Build My Debt Freedom Plan"
        ] })
      }
    ),
    res && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: "📋 Debt Inventory — Ranked by Danger (Highest Rate First)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-2.5 font-semibold text-slate-600", children: "Debt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Outstanding Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Monthly EMI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Total Interest" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Months" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            res.debts.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-slate-50 hover:bg-slate-50/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 font-medium text-slate-700 flex items-center gap-1.5", children: [
                    d.danger === "high" && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 text-red-500" }),
                    d.danger === "medium" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-amber-500" }),
                    d.name
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right font-semibold text-slate-700", children: fmtC(d.balance) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "td",
                    {
                      className: `p-2.5 text-right font-bold ${d.danger === "high" ? "text-red-600" : d.danger === "medium" ? "text-amber-600" : "text-green-600"}`,
                      children: [
                        d.rate,
                        "%",
                        d.danger === "high" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs font-normal text-red-400", children: "Danger ⚠️" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-600", children: fmtC(d.emi) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-red-500", children: fmtC(d.totalInterest) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-600", children: d.months })
                ]
              },
              d.id
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-slate-200 bg-slate-50 font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-slate-700", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-800", children: fmtC(res.totalBalance) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-800", children: fmtC(res.totalEMI) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-red-600", children: fmtC(res.totalInterest) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5" })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: "⚖️ Repayment Strategy Comparison" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 border-2 border-blue-300 rounded-xl p-3 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2.5 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold", children: "Recommended ✓" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-blue-800", children: "🏔️ Avalanche Method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-600 mt-1", children: "Pay highest interest rate debt first. Mathematically optimal — saves the most money." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-blue-700 mt-2", children: [
              "Debt-free by:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: monthsFromNow(res.avalancheMonths) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-blue-700", children: [
              res.avalancheMonths,
              " months from today"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-700 mt-1 font-semibold", children: [
              "Interest saved vs doing nothing:",
              " ",
              fmtC(res.avalancheInterestSaved)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 border border-slate-200 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-700", children: "⛄ Snowball Method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Pay smallest balance first. Better for motivation but costs more in interest." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-slate-600 mt-2", children: [
              "Debt-free by:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: monthsFromNow(res.snowballMonths) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-slate-600", children: [
              res.snowballMonths,
              " months from today"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Best if you need quick psychological wins to stay motivated." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-50 border border-amber-100 rounded-lg p-3 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-800", children: [
          "💡 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Which to choose?" }),
          " Use",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Avalanche" }),
          " if you are disciplined and want to minimize total interest paid. Use ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Snowball" }),
          " if you have struggled to stick to debt plans before — the quick wins of clearing small debts first keep you motivated. Both work; consistency matters more than method."
        ] }) })
      ] }),
      res.consolidationNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-indigo-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-indigo-800", children: "Balance Transfer / Consolidation Analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-700 mt-0.5", children: res.consolidationNote })
        ] })
      ] }),
      res.minPayNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-red-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-red-800", children: "⚠️ Minimum Payment Danger Zone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-700 mt-0.5", children: res.minPayNote })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-teal-50 border border-teal-100 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-teal-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-teal-800", children: "SIP vs Debt Repayment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-teal-700 mt-0.5", children: res.sipNote })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: "🗓️ 6-Month Repayment Roadmap (Avalanche)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: res.sixMonthPlan.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 bg-white border border-slate-100 rounded-lg p-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0", children: [
                "M",
                m.month
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-700", children: m.action }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-600", children: fmtC(m.balanceRemaining) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "remaining" })
              ] })
            ]
          },
          m.month
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-8 h-8 text-emerald-600 mx-auto mb-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-emerald-800", children: "🎯 Your Debt Freedom Date (Avalanche)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-emerald-700 mt-1", children: monthsFromNow(res.avalancheMonths) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-emerald-600 mt-1", children: [
          res.avalancheMonths,
          " months from today with",
          " ",
          fmtC(res.extraAvailable),
          "/month extra payment"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600 mt-1", children: [
          "Total interest saved by using Avalanche:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: fmtC(res.avalancheInterestSaved) })
        ] })
      ] })
    ] })
  ] });
}
export {
  ChevronLeft as C,
  ModelDebtTab as M
};
