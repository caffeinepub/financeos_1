import { u as useActor, a as useCurrency, b as useQuery, r as reactExports, j as jsxRuntimeExports, L as LayoutDashboard, C as ChevronDown } from "./index-CnGSD72i.js";
import { B as Budget5030Chart } from "./Budget5030Chart-DHAsz_o7.js";
import { B as Badge } from "./badge-D07Gz56W.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-CGQo_Mvk.js";
import { S as Skeleton } from "./skeleton-DvrJEQLM.js";
import { u as useGetAllGoals, a as useGetAllInvestmentsByCategory } from "./useGoals-QPo608oo.js";
import { R as ResponsiveContainer, C as Cell, T as Tooltip, a as CartesianGrid, X as XAxis, Y as YAxis, L as LabelList, b as Legend, B as Bar } from "./generateCategoricalChart-BW3OlwYa.js";
import { P as PieChart, a as Pie } from "./PieChart-BOWrVKaq.js";
import { L as LineChart, a as Line } from "./LineChart-CV3cD-jn.js";
import { B as BarChart } from "./BarChart-CeieMk4q.js";
import { A as AreaChart, a as Area } from "./AreaChart-D16fjGkT.js";
import { C as ChevronRight } from "./chevron-right-pQeiaaW2.js";
import "./index-CUmzdL5t.js";
const SLICE_COLORS = [
  "#2563eb",
  "#0891b2",
  "#059669",
  "#7c3aed",
  "#d97706",
  "#dc2626",
  "#0d9488",
  "#9333ea",
  "#e11d48",
  "#ca8a04"
];
const ASSET_CONFIG = {
  Retirement: {
    label: "Retiral",
    shortLabel: "Retiral",
    color: "#8b5cf6",
    cagr: 0.08
  },
  ETF: {
    label: "Equity (ETFs & Stocks)",
    shortLabel: "Equity",
    color: "#3b82f6",
    cagr: 0.12
  },
  MutualFund: {
    label: "Mutual Funds",
    shortLabel: "MFs",
    color: "#10b981",
    cagr: 0.12
  },
  FixedIncome: {
    label: "Fixed Deposits",
    shortLabel: "FDs",
    color: "#f59e0b",
    cagr: 0.07
  },
  Crypto: {
    label: "Crypto",
    shortLabel: "Crypto",
    color: "#ef4444",
    cagr: 0.2
  },
  Commodity: {
    label: "Commodity",
    shortLabel: "Commodity",
    color: "#f97316",
    cagr: 0.08
  },
  RealEstate: {
    label: "Real Estate",
    shortLabel: "Realty",
    color: "#06b6d4",
    cagr: 0.1
  },
  Other: {
    label: "Other Investments",
    shortLabel: "Other",
    color: "#6b7280",
    cagr: 0.08
  }
};
const ASSET_TYPES = Object.keys(ASSET_CONFIG);
const RISK_RETURN = {
  Retirement: { risk: 5, ret: 8 },
  ETF: { risk: 15, ret: 12 },
  MutualFund: { risk: 12, ret: 11 },
  FixedIncome: { risk: 2, ret: 7 },
  Crypto: { risk: 50, ret: 25 },
  Commodity: { risk: 20, ret: 8 },
  RealEstate: { risk: 8, ret: 10 },
  Other: { risk: 10, ret: 9 }
};
function getKey(val) {
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null)
    return Object.keys(val)[0] ?? "";
  return "";
}
function shortNum(n, sym, code = "INR") {
  if (code !== "INR") {
    if (n >= 1e9) return `${sym}${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${sym}${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `${sym}${(n / 1e3).toFixed(2)}K`;
    return `${sym}${Math.round(n).toLocaleString()}`;
  }
  if (n >= 1e7) return `${sym}${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `${sym}${(n / 1e5).toFixed(2)}L`;
  if (n >= 1e3) return `${sym}${(n / 1e3).toFixed(2)}K`;
  return `${sym}${Math.round(n).toLocaleString("en-IN")}`;
}
function statusBadge(pct) {
  if (pct >= 100)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-full", children: "Achieved" });
  if (pct >= 75)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium px-2 py-0.5 rounded-full", children: "On Track" });
  if (pct < 50)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-red-50 text-red-600 border border-red-200 text-[10px] font-medium px-2 py-0.5 rounded-full", children: "Need Attention" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-full", children: "In Progress" });
}
function GoalCard({
  g,
  idx,
  formatCurrency
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `dashboard.goals.item.${idx + 1}`,
      className: "rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-3 space-y-2",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700 truncate max-w-[180px]", children: g.name }),
          statusBadge(g.pct)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-slate-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full transition-all duration-300",
            style: {
              width: `${Math.min(g.pct, 100)}%`,
              background: g.pct >= 75 ? "#10b981" : g.pct >= 50 ? "#f59e0b" : "#ef4444"
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] text-slate-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: formatCurrency(g.currentAmount) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums font-medium text-slate-500", children: formatCurrency(g.targetAmount) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] text-slate-400 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "🗓 ",
            g.goalDateStr ?? ""
          ] }),
          (g.sipEstimate ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-500 font-medium", children: [
            "SIP:",
            " ",
            formatCurrency(g.sipEstimate ?? 0),
            "/mo"
          ] })
        ] })
      ]
    }
  );
}
const GoalsProgressList = reactExports.memo(function GoalsProgressList2({
  goals,
  formatCurrency
}) {
  const [showAchieved, setShowAchieved] = reactExports.useState(false);
  const activeGoals = goals.filter((g) => g.pct < 100);
  const achievedGoals = goals.filter((g) => g.pct >= 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
    activeGoals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 text-center py-4", children: "All goals achieved! 🎉" }) : activeGoals.map((g, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      GoalCard,
      {
        g,
        idx,
        formatCurrency
      },
      g.id
    )),
    achievedGoals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setShowAchieved((v) => !v),
          className: "flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 hover:bg-emerald-100 transition-colors w-full justify-between",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "🎉 Achieved Goals (",
              achievedGoals.length,
              ")"
            ] }),
            showAchieved ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
          ]
        }
      ),
      showAchieved && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2 opacity-80", children: achievedGoals.map((g, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        GoalCard,
        {
          g,
          idx: 1e3 + idx,
          formatCurrency
        },
        g.id
      )) })
    ] })
  ] });
});
const RiskOMeter = reactExports.memo(function RiskOMeter2({ score }) {
  const LEVELS = [
    { label: "Low Risk", color: "#08A04B", min: 0, max: 25 },
    { label: "Low-Mod", color: "#7FFF00", min: 25, max: 35 },
    { label: "Moderate", color: "#FFFF33", min: 35, max: 45 },
    { label: "Mod.High", color: "#C68E17", min: 45, max: 60 },
    { label: "High Risk", color: "#FF8C00", min: 60, max: 75 },
    { label: "Very High", color: "#F70D1A", min: 75, max: 100 }
  ];
  const W = 320;
  const H = 220;
  const cx = 160;
  const cy = 200;
  const R_OUT = 140;
  const R_IN = 98;
  const toRad = (s) => Math.PI - s / 100 * Math.PI;
  const ptOuter = (s) => ({
    x: cx + R_OUT * Math.cos(toRad(s)),
    y: cy - R_OUT * Math.sin(toRad(s))
  });
  const ptInner = (s) => ({
    x: cx + R_IN * Math.cos(toRad(s)),
    y: cy - R_IN * Math.sin(toRad(s))
  });
  const segments = LEVELS.map((lvl) => {
    const o1 = ptOuter(lvl.min);
    const o2 = ptOuter(lvl.max);
    const i1 = ptInner(lvl.min);
    const i2 = ptInner(lvl.max);
    const large = lvl.max - lvl.min > 50 ? 1 : 0;
    const d = [
      `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
      `A ${R_OUT} ${R_OUT} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
      `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
      `A ${R_IN} ${R_IN} 0 ${large} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
      "Z"
    ].join(" ");
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d,
        fill: lvl.color,
        stroke: "white",
        strokeWidth: "1.5"
      },
      lvl.label
    );
  });
  const segLabels = LEVELS.map((lvl) => {
    const mid = (lvl.min + lvl.max) / 2;
    const midR = (R_OUT + R_IN) / 2;
    const p = {
      x: cx + midR * Math.cos(toRad(mid)),
      y: cy - midR * Math.sin(toRad(mid))
    };
    const isDark = ["#7FFF00", "#FFFF33"].includes(lvl.color);
    const textFill = isDark ? "#374151" : "white";
    const words = lvl.label.split(" ");
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "text",
      {
        x: p.x,
        y: p.y,
        textAnchor: "middle",
        dominantBaseline: "middle",
        fontSize: "7.5",
        fontWeight: "700",
        fill: textFill,
        children: words.map((w, wi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "tspan",
          {
            x: p.x,
            dy: wi === 0 ? `${-(words.length - 1) * 4}` : "9",
            children: w
          },
          `${lvl.label}-${w}`
        ))
      },
      `lbl-${lvl.label}`
    );
  });
  const clamp = Math.min(Math.max(score, 0), 100);
  const needleAngle = toRad(clamp);
  const needleLen = R_IN - 8;
  const tip = {
    x: cx + needleLen * Math.cos(needleAngle),
    y: cy - needleLen * Math.sin(needleAngle)
  };
  const base1 = {
    x: cx + 8 * Math.cos(needleAngle + Math.PI / 2),
    y: cy - 8 * Math.sin(needleAngle + Math.PI / 2)
  };
  const base2 = {
    x: cx + 8 * Math.cos(needleAngle - Math.PI / 2),
    y: cy - 8 * Math.sin(needleAngle - Math.PI / 2)
  };
  const currentLevel = LEVELS.find((l) => score <= l.max) ?? LEVELS[5];
  const labelColor = ["#7FFF00", "#FFFF33"].includes(currentLevel.color) ? "#374151" : currentLevel.color;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: `0 0 ${W} ${H}`,
        className: "w-full max-w-[320px]",
        role: "img",
        "aria-label": "Portfolio Risk-o-meter",
        children: [
          segments,
          segLabels,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "polygon",
            {
              points: `${tip.x.toFixed(2)},${tip.y.toFixed(2)} ${base1.x.toFixed(2)},${base1.y.toFixed(2)} ${base2.x.toFixed(2)},${base2.y.toFixed(2)}`,
              fill: "#1e293b",
              stroke: "white",
              strokeWidth: "1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx,
              cy,
              r: "10",
              fill: "#1e293b",
              stroke: "white",
              strokeWidth: "2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: "4", fill: "white" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold mt-1", style: { color: labelColor }, children: [
      "Risk Level: ",
      currentLevel.label,
      " (",
      score.toFixed(0),
      "%)"
    ] })
  ] });
});
function DashboardPage() {
  const { actor, isFetching } = useActor();
  const { formatCurrency, country } = useCurrency();
  const sym = country.symbol;
  const { data: holdings = [], isLoading: hLoad } = useQuery({
    queryKey: ["portfolio", "all"],
    staleTime: 9e4,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPortfolioHoldings();
    },
    enabled: !!actor && !isFetching
  });
  const { data: transactions = [], isLoading: tLoad } = useQuery(
    {
      queryKey: ["transactions"],
      staleTime: 9e4,
      queryFn: async () => {
        if (!actor) return [];
        return actor.getAllTransactions();
      },
      enabled: !!actor && !isFetching
    }
  );
  const { data: budgetCats = [], isLoading: bLoad } = useQuery({
    queryKey: ["budgetCategories"],
    staleTime: 9e4,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBudgetCategories();
    },
    enabled: !!actor && !isFetching
  });
  const { data: goals = [], isLoading: gLoad } = useGetAllGoals();
  const { data: allInvestments = [] } = useGetAllInvestmentsByCategory();
  const { data: loans = [] } = useQuery({
    queryKey: ["loans"],
    staleTime: 9e4,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLoans();
    },
    enabled: !!actor && !isFetching
  });
  const isLoading = hLoad || tLoad || bLoad || gLoad;
  const byType = reactExports.useMemo(() => {
    const m = {};
    for (const h of holdings) {
      const k = getKey(h.assetType);
      m[k] = (m[k] ?? 0) + h.currentValue;
    }
    return m;
  }, [holdings]);
  const totalNAV = reactExports.useMemo(
    () => Object.values(byType).reduce((a, b) => a + b, 0),
    [byType]
  );
  const allocationPie = reactExports.useMemo(
    () => ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => ({
      name: ASSET_CONFIG[t].shortLabel,
      value: byType[t] ?? 0,
      color: ASSET_CONFIG[t].color,
      pct: totalNAV > 0 ? ((byType[t] ?? 0) / totalNAV * 100).toFixed(1) : "0"
    })),
    [byType, totalNAV]
  );
  const categoryBar = reactExports.useMemo(
    () => ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => ({
      name: ASSET_CONFIG[t].shortLabel,
      value: byType[t] ?? 0,
      color: ASSET_CONFIG[t].color
    })),
    [byType]
  );
  reactExports.useMemo(() => {
    const yr = (/* @__PURE__ */ new Date()).getFullYear();
    return Array.from({ length: 21 }, (_, i) => {
      const row = { year: yr + i };
      for (const t of ASSET_TYPES) {
        row[t] = Math.round((byType[t] ?? 0) * (1 + ASSET_CONFIG[t].cagr) ** i);
      }
      return row;
    });
  }, [byType]);
  const goalsProgress = reactExports.useMemo(() => {
    const invMap = /* @__PURE__ */ new Map();
    for (const inv of allInvestments)
      invMap.set(String(inv.id), inv.currentValue);
    const allGoalsWithProgress = goals.map((g) => {
      const cur = g.linkedInvestments.reduce(
        (s, id) => s + (invMap.get(String(id)) ?? 0),
        0
      );
      const pct = g.targetAmount > 0 ? Math.min(100, cur / g.targetAmount * 100) : 0;
      const deadlineMs = Number(g.targetDate) / 1e6;
      const nowMs = Date.now();
      const monthsRemaining = Math.max(
        1,
        Math.round((deadlineMs - nowMs) / (1e3 * 60 * 60 * 24 * 30))
      );
      const sipEstimate = cur < g.targetAmount ? Math.max(0, Math.round((g.targetAmount - cur) / monthsRemaining)) : 0;
      const goalDateStr = new Date(deadlineMs).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
      });
      return {
        ...g,
        currentAmount: cur,
        pct,
        goalDateStr,
        sipEstimate,
        deadlineMs
      };
    });
    if (allGoalsWithProgress.length < 4) return allGoalsWithProgress;
    const onTrack = allGoalsWithProgress.filter((g) => g.pct >= 75 && g.pct < 100).sort((a, b) => a.deadlineMs - b.deadlineMs).slice(0, 3);
    const needAttention = allGoalsWithProgress.filter((g) => g.pct < 75).sort((a, b) => a.deadlineMs - b.deadlineMs).slice(0, 3);
    const achieved = allGoalsWithProgress.filter((g) => g.pct >= 100);
    return [...onTrack, ...needAttention, ...achieved];
  }, [goals, allInvestments]);
  reactExports.useMemo(
    () => ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => ({
      x: RISK_RETURN[t].risk,
      y: RISK_RETURN[t].ret,
      label: ASSET_CONFIG[t].shortLabel,
      color: ASSET_CONFIG[t].color,
      assetType: t
    })),
    [byType]
  );
  const portfolioRiskScore = reactExports.useMemo(() => {
    if (totalNAV === 0) return 0;
    const highVolatileValue = (byType.ETF ?? 0) + (byType.MutualFund ?? 0) + (byType.Crypto ?? 0);
    return highVolatileValue / totalNAV * 100;
  }, [byType, totalNAV]);
  const incomeExpenseTrend = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const yr = d.getFullYear();
      const mo = d.getMonth();
      const label = d.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit"
      });
      const income = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getFullYear() === yr && td.getMonth() === mo && getKey(t.transactionType) === "Income";
      }).reduce((s, t) => s + t.amount, 0);
      const expense = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getFullYear() === yr && td.getMonth() === mo && getKey(t.transactionType) === "Expense";
      }).reduce((s, t) => s + t.amount, 0);
      return {
        month: label,
        Income: income,
        Expense: expense,
        Savings: income - expense
      };
    });
  }, [transactions]);
  reactExports.useMemo(() => {
    const catTotals = {};
    for (const t of transactions) {
      if (getKey(t.transactionType) === "Expense" && t.categoryId) {
        catTotals[t.categoryId] = (catTotals[t.categoryId] ?? 0) + t.amount;
      }
    }
    const rawData = budgetCats.map((c, i) => ({
      name: c.name,
      value: catTotals[c.id] ?? 0,
      color: SLICE_COLORS[i % SLICE_COLORS.length]
    })).filter((d) => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 8);
    const total = rawData.reduce((s, d) => s + d.value, 0);
    return rawData.map((d) => ({
      ...d,
      pct: total > 0 ? (d.value / total * 100).toFixed(1) : "0"
    }));
  }, [transactions, budgetCats]);
  reactExports.useMemo(
    () => incomeExpenseTrend.slice(-6).map((d) => ({
      month: d.month,
      rate: d.Income > 0 ? Math.round(d.Savings / d.Income * 100) : 0,
      savings: d.Savings
    })),
    [incomeExpenseTrend]
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.loading_state", className: "space-y-6 pb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 rounded-2xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 rounded-2xl" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.page", className: "space-y-5 pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-8 h-8 rounded-lg flex items-center justify-center",
          style: { background: "linear-gradient(135deg, #2563eb, #3b82f6)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-4 h-4 text-white" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-slate-800", children: "Dashboard" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "dashboard.nav.section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 py-2 sm:py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full sm:min-w-[160px] sm:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-[10px] uppercase tracking-widest font-medium mb-0.5", children: "Portfolio NAV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold tabular-nums leading-tight", children: formatCurrency(totalNAV) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-400 text-[11px] mt-0.5", children: [
          holdings.length,
          " holding",
          holdings.length !== 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block w-px h-10 bg-slate-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full sm:flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5", children: [
        ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `dashboard.nav.card.${ASSET_TYPES.indexOf(t) + 1}`,
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
            style: {
              background: `${ASSET_CONFIG[t].color}20`,
              border: `1px solid ${ASSET_CONFIG[t].color}40`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-1.5 h-1.5 rounded-full flex-shrink-0",
                  style: { background: ASSET_CONFIG[t].color }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: ASSET_CONFIG[t].color }, children: ASSET_CONFIG[t].shortLabel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200 font-bold text-[11px] sm:text-xs", children: shortNum(byType[t] ?? 0, sym, country.code) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: totalNAV > 0 ? `${((byType[t] ?? 0) / totalNAV * 100).toFixed(1)}%` : "0%" })
            ]
          },
          t
        )),
        ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs italic", children: "No holdings yet" })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.allocation.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Asset Allocation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Portfolio distribution by asset type" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: allocationPie.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-64 flex flex-col items-center justify-center gap-2 text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "📊" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "No portfolio data yet" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-shrink-0",
                  style: { width: 180, height: 220 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Pie,
                      {
                        data: allocationPie,
                        cx: "50%",
                        cy: "50%",
                        innerRadius: 55,
                        outerRadius: 90,
                        dataKey: "value",
                        labelLine: false,
                        children: allocationPie.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Cell,
                          {
                            fill: entry.color,
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
                        formatter: (v, _n, props) => {
                          var _a, _b;
                          return [
                            `${formatCurrency(v)} (${((_a = props.payload) == null ? void 0 : _a.pct) ?? "0"}%)`,
                            ((_b = props.payload) == null ? void 0 : _b.name) ?? ""
                          ];
                        },
                        contentStyle: {
                          fontSize: "11px",
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                        }
                      }
                    )
                  ] }) })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 flex-1 min-w-0", children: allocationPie.map((entry) => {
                const total = allocationPie.reduce(
                  (s, d) => s + d.value,
                  0
                );
                const pct = total > 0 ? (entry.value / total * 100).toFixed(1) : "0";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                            style: { background: entry.color }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-600 truncate", children: entry.name })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-slate-700 flex-shrink-0", children: [
                        pct,
                        "%"
                      ] })
                    ]
                  },
                  entry.name
                );
              }) })
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.riskometer.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700", children: "Portfolio Risk-o-meter" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Based on risk profile of portfolio investments" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskOMeter, { score: portfolioRiskScore }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.networth.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Projected Net Worth Trend" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Total assets minus liabilities over 10 years" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: (() => {
              const totalLiabilities = loans.reduce(
                (s, l) => s + l.currentBalance,
                0
              );
              const now = /* @__PURE__ */ new Date();
              const currentYear = now.getFullYear();
              const rateMap = {
                Retirement: 0.08,
                ETF: 0.12,
                MutualFund: 0.12,
                FixedIncome: 0.07,
                Commodity: 0.09,
                Crypto: 0.15,
                RealEstate: 0.06,
                Other: 0.08
              };
              const networthData = Array.from({ length: 10 }, (_, i) => {
                const year = i + 1;
                const row = {
                  year: `${currentYear + year}`
                };
                let projectedAssets = 0;
                for (const t of ASSET_TYPES) {
                  const val = byType[t] ?? 0;
                  if (val > 0) {
                    const projected = Math.round(
                      val * (1 + (rateMap[t] ?? 0.08)) ** year
                    );
                    row[ASSET_CONFIG[t].shortLabel] = projected;
                    projectedAssets += projected;
                  }
                }
                row["Net Worth"] = Math.round(
                  projectedAssets - totalLiabilities
                );
                return row;
              });
              const activeAssets = ASSET_TYPES.filter(
                (t) => (byType[t] ?? 0) > 0
              );
              return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                LineChart,
                {
                  data: networthData,
                  margin: { top: 5, right: 20, left: 10, bottom: 5 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CartesianGrid,
                      {
                        strokeDasharray: "3 3",
                        opacity: 0.15,
                        vertical: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "year", tick: { fontSize: 10 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      YAxis,
                      {
                        tick: { fontSize: 10 },
                        tickFormatter: (v) => shortNum(v, sym, country.code),
                        width: 52
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Tooltip,
                      {
                        content: ({ active, payload, label }) => {
                          if (!active || !payload || payload.length === 0)
                            return null;
                          const nwEntry = payload.find(
                            (p) => p.dataKey === "Net Worth"
                          );
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs min-w-[180px]", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-slate-700 mb-2", children: label }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                              activeAssets.map((t) => {
                                const entry = payload.find(
                                  (p) => p.dataKey === ASSET_CONFIG[t].shortLabel
                                );
                                if (!entry) return null;
                                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "div",
                                  {
                                    className: "flex justify-between gap-3",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        "span",
                                        {
                                          className: "flex items-center gap-1",
                                          style: { color: ASSET_CONFIG[t].color },
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "span",
                                              {
                                                className: "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                                style: {
                                                  background: ASSET_CONFIG[t].color
                                                }
                                              }
                                            ),
                                            ASSET_CONFIG[t].shortLabel
                                          ]
                                        }
                                      ),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700", children: shortNum(
                                        Number(entry.value ?? 0),
                                        sym,
                                        country.code
                                      ) })
                                    ]
                                  },
                                  t
                                );
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 mt-1.5 pt-1.5 flex justify-between gap-3", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-indigo-700", children: "Net Worth" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-indigo-700", children: shortNum(
                                  Number((nwEntry == null ? void 0 : nwEntry.value) ?? 0),
                                  sym,
                                  country.code
                                ) })
                              ] })
                            ] })
                          ] });
                        }
                      }
                    ),
                    activeAssets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: ASSET_CONFIG[t].shortLabel,
                        stroke: ASSET_CONFIG[t].color,
                        strokeWidth: 1.5,
                        strokeDasharray: "4 2",
                        dot: false
                      },
                      t
                    )),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Line,
                      {
                        type: "monotone",
                        dataKey: "Net Worth",
                        stroke: "#6366f1",
                        strokeWidth: 2.5,
                        dot: { fill: "#6366f1", r: 3 },
                        activeDot: { r: 6 },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          LabelList,
                          {
                            dataKey: "Net Worth",
                            position: "top",
                            style: { fontSize: "9px", fill: "#6366f1" },
                            formatter: (v) => shortNum(v, sym, country.code)
                          }
                        )
                      }
                    )
                  ]
                }
              ) });
            })() })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.liabilityasset.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Assets vs Liabilities" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Total portfolio value vs outstanding loans" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: (() => {
              const totalLiabilities = loans.reduce(
                (s, l) => s + l.currentBalance,
                0
              );
              const pieData = [
                { name: "Assets", value: totalNAV, color: "#10b981" },
                {
                  name: "Liabilities",
                  value: totalLiabilities,
                  color: "#f43f5e"
                }
              ].filter((d) => d.value > 0);
              if (pieData.length === 0) {
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[180px] flex flex-col items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "📊" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "No portfolio data yet" })
                ] });
              }
              const avslTotal = pieData.reduce((s, d) => s + d.value, 0);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex-shrink-0",
                    style: { width: 160, height: 160 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      PieChart,
                      {
                        margin: { top: 4, right: 4, bottom: 4, left: 4 },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Pie,
                            {
                              data: pieData,
                              cx: "50%",
                              cy: "50%",
                              innerRadius: 46,
                              outerRadius: 68,
                              dataKey: "value",
                              labelLine: false,
                              children: pieData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Cell,
                                {
                                  fill: entry.color,
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
                              formatter: (v, name) => [
                                formatCurrency(v),
                                name
                              ],
                              contentStyle: {
                                fontSize: "11px",
                                borderRadius: "10px"
                              }
                            }
                          )
                        ]
                      }
                    ) })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-center gap-3 flex-1 min-w-0 pl-2", children: pieData.map((d) => {
                  const pct = avslTotal > 0 ? (d.value / avslTotal * 100).toFixed(1) : "0";
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1",
                        style: { background: d.color }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500 block", children: d.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-bold text-slate-800 tabular-nums block", children: formatCurrency(d.value) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400", children: [
                        pct,
                        "%"
                      ] })
                    ] })
                  ] }, d.name);
                }) })
              ] });
            })() })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.dti.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Debt-to-Income Ratio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Monthly loan EMIs ÷ monthly income (industry standard: under 36%)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5 space-y-4", children: (() => {
              const monthlyEMI = loans.reduce(
                (s, l) => s + l.monthlyPayment,
                0
              );
              const monthlyIncome = incomeExpenseTrend.length > 0 ? incomeExpenseTrend.slice(-3).reduce((s, d) => s + d.Income, 0) / 3 : 0;
              const dti = monthlyIncome > 0 ? Math.min(100, monthlyEMI / monthlyIncome * 100) : 0;
              const color = dti < 30 ? "#10b981" : dti < 50 ? "#f59e0b" : "#ef4444";
              const label = dti < 30 ? "Healthy" : dti < 50 ? "Moderate" : "High Risk";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-extrabold", style: { color }, children: [
                      dti.toFixed(1),
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs font-semibold mt-0.5",
                        style: { color },
                        children: label
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-xs text-slate-400 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      "Monthly EMI:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700", children: formatCurrency(monthlyEMI) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      "Avg Income:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700", children: formatCurrency(monthlyIncome) })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-3 rounded-full bg-slate-100 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-all duration-700",
                    style: {
                      width: `${Math.min(100, dti)}%`,
                      background: color
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-slate-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-500 font-medium", children: "Good <30%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-500 font-medium", children: "36% threshold" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 font-medium", children: "High >50%" })
                ] })
              ] });
            })() })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.cashflow.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Cash Flow Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Monthly income vs expenses (6 months)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              BarChart,
              {
                data: incomeExpenseTrend.slice(-6),
                margin: { top: 5, right: 20, left: 10, bottom: 5 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CartesianGrid,
                    {
                      strokeDasharray: "3 3",
                      opacity: 0.15,
                      vertical: false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: { fontSize: 10 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    YAxis,
                    {
                      tick: { fontSize: 10 },
                      tickFormatter: (v) => shortNum(v, sym, country.code),
                      width: 52
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      formatter: (v, name) => [
                        formatCurrency(v),
                        name
                      ],
                      contentStyle: {
                        fontSize: "11px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "12px" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Income", fill: "#10b981", radius: [4, 4, 0, 0], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    LabelList,
                    {
                      dataKey: "Income",
                      position: "top",
                      style: { fontSize: "9px", fill: "#10b981" },
                      formatter: (v) => shortNum(v, sym, country.code)
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Expense", fill: "#f43f5e", radius: [4, 4, 0, 0], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    LabelList,
                    {
                      dataKey: "Expense",
                      position: "top",
                      style: { fontSize: "9px", fill: "#f43f5e" },
                      formatter: (v) => shortNum(v, sym, country.code)
                    }
                  ) })
                ]
              }
            ) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.incomevexpense.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Income vs Expense Trend" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "12-month view showing income, expenses & savings" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: incomeExpenseTrend.every(
              (d) => d.Income === 0 && d.Expense === 0
            ) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-64 flex flex-col items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "📊" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "No transaction data yet" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AreaChart,
              {
                data: incomeExpenseTrend,
                margin: { top: 5, right: 10, left: 10, bottom: 30 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "linearGradient",
                      {
                        id: "colorIncome",
                        x1: "0",
                        y1: "0",
                        x2: "0",
                        y2: "1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.3 }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0 })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "linearGradient",
                      {
                        id: "colorExpense",
                        x1: "0",
                        y1: "0",
                        x2: "0",
                        y2: "1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "5%", stopColor: "#ef4444", stopOpacity: 0.3 }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "95%", stopColor: "#ef4444", stopOpacity: 0 })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.15 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    XAxis,
                    {
                      dataKey: "month",
                      tick: { fontSize: 9 },
                      angle: -20,
                      textAnchor: "end",
                      height: 45
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    YAxis,
                    {
                      tick: { fontSize: 9 },
                      tickFormatter: (v) => shortNum(v, sym, country.code)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      formatter: (v, name) => [
                        formatCurrency(v),
                        name
                      ],
                      contentStyle: {
                        fontSize: "11px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "11px" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Area,
                    {
                      type: "monotone",
                      dataKey: "Income",
                      stroke: "#10b981",
                      strokeWidth: 2,
                      fill: "url(#colorIncome)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Area,
                    {
                      type: "monotone",
                      dataKey: "Expense",
                      stroke: "#ef4444",
                      strokeWidth: 2,
                      fill: "url(#colorExpense)"
                    }
                  )
                ]
              }
            ) }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.categories.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Investment Categories" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Current value by asset category" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: categoryBar.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-64 flex flex-col items-center justify-center gap-2 text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "📈" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "No portfolio data yet" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              ResponsiveContainer,
              {
                width: "100%",
                height: Math.max(120, categoryBar.length * 44),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  BarChart,
                  {
                    data: [...categoryBar].sort((a, b) => b.value - a.value),
                    layout: "vertical",
                    margin: { top: 5, right: 80, left: 8, bottom: 5 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CartesianGrid,
                        {
                          strokeDasharray: "3 3",
                          opacity: 0.15,
                          horizontal: false
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        XAxis,
                        {
                          type: "number",
                          tick: { fontSize: 10 },
                          tickFormatter: (v) => shortNum(v, sym, country.code)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        YAxis,
                        {
                          type: "category",
                          dataKey: "name",
                          tick: { fontSize: 11 },
                          width: 60
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tooltip,
                        {
                          formatter: (v) => [formatCurrency(v), "Value"],
                          contentStyle: {
                            fontSize: "11px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Bar, { dataKey: "value", radius: [0, 5, 5, 0], children: [
                        [...categoryBar].sort((a, b) => b.value - a.value).map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, entry.name)),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          LabelList,
                          {
                            dataKey: "value",
                            position: "right",
                            formatter: (v) => shortNum(v, sym, country.code),
                            style: {
                              fontSize: "10px",
                              fill: "#64748b",
                              fontWeight: 600
                            }
                          }
                        )
                      ] })
                    ]
                  }
                )
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": "dashboard.budgetrule.card",
          className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "50/30/20 Budget Rule Analysis" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Current month: Needs vs Wants vs Savings vs ideal allocation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: (() => {
              const currentDate = /* @__PURE__ */ new Date();
              const currentMonth = currentDate.getMonth();
              const currentYear = currentDate.getFullYear();
              const currentMonthTx = transactions.filter((tx) => {
                const d = new Date(tx.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
              });
              const dashIncome = currentMonthTx.filter((t) => getKey(t.transactionType) === "Income").reduce((s, t) => s + t.amount, 0);
              const dashExpenseTx = currentMonthTx.filter(
                (t) => getKey(t.transactionType) === "Expense"
              );
              if (dashIncome <= 0 && dashExpenseTx.length === 0) {
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-48 flex flex-col items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "💰" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "No transaction data for current month" })
                ] });
              }
              const SAVINGS_KEYS = [
                "savings",
                "investment",
                "sip",
                "ppf",
                "nps",
                "fd",
                "emergency",
                "mutual fund",
                "retirement",
                "stocks",
                "retiral"
              ];
              const WANTS_KEYS = [
                "dining",
                "eating out",
                "restaurant",
                "entertainment",
                "streaming",
                "netflix",
                "subscription",
                "shopping",
                "clothing",
                "travel",
                "vacation",
                "gym",
                "fitness",
                "hobbies",
                "personal care",
                "beauty",
                "salon",
                "electronics",
                "games",
                "leisure"
              ];
              const catTypeMap = {};
              for (const bc of budgetCats) {
                const lc = bc.name.toLowerCase();
                if (SAVINGS_KEYS.some((k) => lc.includes(k)))
                  catTypeMap[bc.id] = "Savings";
                else if (WANTS_KEYS.some((k) => lc.includes(k)))
                  catTypeMap[bc.id] = "Wants";
                else catTypeMap[bc.id] = "Needs";
              }
              const dashExpenses = dashExpenseTx.reduce(
                (s, t) => s + t.amount,
                0
              );
              const dashNeeds50 = dashIncome * 0.5;
              const dashWants30 = dashIncome * 0.3;
              const dashSavings20 = dashIncome * 0.2;
              const dashSavings = Math.max(0, dashIncome - dashExpenses);
              const dashSavingsRate = dashIncome > 0 ? dashSavings / dashIncome * 100 : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Budget5030Chart,
                {
                  income: dashIncome,
                  expenses: dashExpenses,
                  needs50: dashNeeds50,
                  wants30: dashWants30,
                  savings20: dashSavings20,
                  savings: dashSavings,
                  savingsRate: dashSavingsRate,
                  formatCurrency
                }
              );
            })() })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        "data-ocid": "dashboard.goals.card",
        className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Goals Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Top 5 goals linked to portfolio investments" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: goalsProgress.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "dashboard.goals.empty_state",
              className: "h-64 flex flex-col items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🎯" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "No goals yet. Add goals in the Goals module." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            GoalsProgressList,
            {
              goals: goalsProgress,
              formatCurrency
            }
          ) })
        ]
      }
    ) })
  ] });
}
export {
  DashboardPage as default
};
