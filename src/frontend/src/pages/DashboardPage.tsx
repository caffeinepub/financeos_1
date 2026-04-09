import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, LayoutDashboard } from "lucide-react";
import type React from "react";
import { memo, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Budget5030Chart } from "../components/budgeting/Budget5030Chart";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useCurrency } from "../contexts/CurrencyContext";
import { useActor } from "../hooks/useActor";
import {
  useGetAllGoals,
  useGetAllInvestmentsByCategory,
} from "../hooks/useGoals";
import type {
  BudgetCategory,
  Loan,
  PortfolioHolding,
  Transaction,
} from "../types";

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
  "#ca8a04",
];

// ─── Asset Config ────────────────────────────────────────────────────────────
const ASSET_CONFIG: Record<
  string,
  { label: string; shortLabel: string; color: string; cagr: number }
> = {
  Retirement: {
    label: "Retiral",
    shortLabel: "Retiral",
    color: "#8b5cf6",
    cagr: 0.08,
  },
  ETF: {
    label: "Equity (ETFs & Stocks)",
    shortLabel: "Equity",
    color: "#3b82f6",
    cagr: 0.12,
  },
  MutualFund: {
    label: "Mutual Funds",
    shortLabel: "MFs",
    color: "#10b981",
    cagr: 0.12,
  },
  FixedIncome: {
    label: "Fixed Deposits",
    shortLabel: "FDs",
    color: "#f59e0b",
    cagr: 0.07,
  },
  Crypto: {
    label: "Crypto",
    shortLabel: "Crypto",
    color: "#ef4444",
    cagr: 0.2,
  },
  Commodity: {
    label: "Commodity",
    shortLabel: "Commodity",
    color: "#f97316",
    cagr: 0.08,
  },
  RealEstate: {
    label: "Real Estate",
    shortLabel: "Realty",
    color: "#06b6d4",
    cagr: 0.1,
  },
  Other: {
    label: "Other Investments",
    shortLabel: "Other",
    color: "#6b7280",
    cagr: 0.08,
  },
};

const ASSET_TYPES = Object.keys(ASSET_CONFIG);

const RISK_RETURN: Record<string, { risk: number; ret: number }> = {
  Retirement: { risk: 5, ret: 8 },
  ETF: { risk: 15, ret: 12 },
  MutualFund: { risk: 12, ret: 11 },
  FixedIncome: { risk: 2, ret: 7 },
  Crypto: { risk: 50, ret: 25 },
  Commodity: { risk: 20, ret: 8 },
  RealEstate: { risk: 8, ret: 10 },
  Other: { risk: 10, ret: 9 },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getKey(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null)
    return Object.keys(val as object)[0] ?? "";
  return "";
}

function shortNum(n: number, sym: string, code = "INR"): string {
  if (code !== "INR") {
    if (n >= 1_000_000_000) return `${sym}${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${sym}${(n / 1_000).toFixed(2)}K`;
    return `${sym}${Math.round(n).toLocaleString()}`;
  }
  if (n >= 10_000_000) return `${sym}${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000) return `${sym}${(n / 100_000).toFixed(2)}L`;
  if (n >= 1_000) return `${sym}${(n / 1_000).toFixed(2)}K`;
  return `${sym}${Math.round(n).toLocaleString("en-IN")}`;
}

function statusBadge(pct: number) {
  if (pct >= 100)
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
        Achieved
      </Badge>
    );
  if (pct >= 75)
    return (
      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
        On Track
      </Badge>
    );
  if (pct < 50)
    return (
      <Badge className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
        Need Attention
      </Badge>
    );
  return (
    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
      In Progress
    </Badge>
  );
}

function GoalCard({
  g,
  idx,
  formatCurrency,
}: { g: any; idx: number; formatCurrency: (n: number) => string }) {
  return (
    <div
      data-ocid={`dashboard.goals.item.${idx + 1}`}
      className="rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-3 space-y-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
          {g.name}
        </span>
        {statusBadge(g.pct)}
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(g.pct, 100)}%`,
            background:
              g.pct >= 75 ? "#10b981" : g.pct >= 50 ? "#f59e0b" : "#ef4444",
          }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-slate-400">
        <span className="tabular-nums">{formatCurrency(g.currentAmount)}</span>
        <span className="tabular-nums font-medium text-slate-500">
          {formatCurrency(g.targetAmount)}
        </span>
      </div>
      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
        <span>🗓 {(g as { goalDateStr?: string }).goalDateStr ?? ""}</span>
        {((g as { sipEstimate?: number }).sipEstimate ?? 0) > 0 && (
          <span className="text-indigo-500 font-medium">
            SIP:{" "}
            {formatCurrency((g as { sipEstimate?: number }).sipEstimate ?? 0)}
            /mo
          </span>
        )}
      </div>
    </div>
  );
}

const GoalsProgressList = memo(function GoalsProgressList({
  goals,
  formatCurrency,
}: { goals: any[]; formatCurrency: (n: number) => string }) {
  const [showAchieved, setShowAchieved] = useState(false);
  const activeGoals = goals.filter((g) => g.pct < 100);
  const achievedGoals = goals.filter((g) => g.pct >= 100);
  return (
    <div className="space-y-3 pt-1">
      {activeGoals.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">
          All goals achieved! 🎉
        </p>
      ) : (
        activeGoals.map((g, idx) => (
          <GoalCard
            key={g.id}
            g={g}
            idx={idx}
            formatCurrency={formatCurrency}
          />
        ))
      )}
      {achievedGoals.length > 0 && (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setShowAchieved((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 hover:bg-emerald-100 transition-colors w-full justify-between"
          >
            <span>🎉 Achieved Goals ({achievedGoals.length})</span>
            {showAchieved ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
          {showAchieved && (
            <div className="mt-2 space-y-2 opacity-80">
              {achievedGoals.map((g, idx) => (
                <GoalCard
                  key={g.id}
                  g={g}
                  idx={1000 + idx}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ─── Risk-o-Meter Component ───────────────────────────────────────────────────
const RiskOMeter = memo(function RiskOMeter({ score }: { score: number }) {
  const LEVELS = [
    { label: "Low Risk", color: "#08A04B", min: 0, max: 25 },
    { label: "Low-Mod", color: "#7FFF00", min: 25, max: 35 },
    { label: "Moderate", color: "#FFFF33", min: 35, max: 45 },
    { label: "Mod.High", color: "#C68E17", min: 45, max: 60 },
    { label: "High Risk", color: "#FF8C00", min: 60, max: 75 },
    { label: "Very High", color: "#F70D1A", min: 75, max: 100 },
  ];

  const W = 320;
  const H = 220;
  const cx = 160;
  const cy = 200;
  const R_OUT = 140;
  const R_IN = 98;

  // score 0 → left (180°), score 100 → right (0°)
  const toRad = (s: number) => Math.PI - (s / 100) * Math.PI;

  const ptOuter = (s: number) => ({
    x: cx + R_OUT * Math.cos(toRad(s)),
    y: cy - R_OUT * Math.sin(toRad(s)),
  });
  const ptInner = (s: number) => ({
    x: cx + R_IN * Math.cos(toRad(s)),
    y: cy - R_IN * Math.sin(toRad(s)),
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
      "Z",
    ].join(" ");
    return (
      <path
        key={lvl.label}
        d={d}
        fill={lvl.color}
        stroke="white"
        strokeWidth="1.5"
      />
    );
  });

  const segLabels = LEVELS.map((lvl) => {
    const mid = (lvl.min + lvl.max) / 2;
    const midR = (R_OUT + R_IN) / 2;
    const p = {
      x: cx + midR * Math.cos(toRad(mid)),
      y: cy - midR * Math.sin(toRad(mid)),
    };
    const isDark = ["#7FFF00", "#FFFF33"].includes(lvl.color);
    const textFill = isDark ? "#374151" : "white";
    const words = lvl.label.split(" ");
    return (
      <text
        key={`lbl-${lvl.label}`}
        x={p.x}
        y={p.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7.5"
        fontWeight="700"
        fill={textFill}
      >
        {words.map((w, wi) => (
          <tspan
            key={`${lvl.label}-${w}`}
            x={p.x}
            dy={wi === 0 ? `${-(words.length - 1) * 4}` : "9"}
          >
            {w}
          </tspan>
        ))}
      </text>
    );
  });

  const clamp = Math.min(Math.max(score, 0), 100);
  const needleAngle = toRad(clamp);
  const needleLen = R_IN - 8;
  const tip = {
    x: cx + needleLen * Math.cos(needleAngle),
    y: cy - needleLen * Math.sin(needleAngle),
  };
  const base1 = {
    x: cx + 8 * Math.cos(needleAngle + Math.PI / 2),
    y: cy - 8 * Math.sin(needleAngle + Math.PI / 2),
  };
  const base2 = {
    x: cx + 8 * Math.cos(needleAngle - Math.PI / 2),
    y: cy - 8 * Math.sin(needleAngle - Math.PI / 2),
  };

  const currentLevel = LEVELS.find((l) => score <= l.max) ?? LEVELS[5];
  const labelColor = ["#7FFF00", "#FFFF33"].includes(currentLevel.color)
    ? "#374151"
    : currentLevel.color;

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[320px]"
        role="img"
        aria-label="Portfolio Risk-o-meter"
      >
        {segments}
        {segLabels}
        <polygon
          points={`${tip.x.toFixed(2)},${tip.y.toFixed(2)} ${base1.x.toFixed(2)},${base1.y.toFixed(2)} ${base2.x.toFixed(2)},${base2.y.toFixed(2)}`}
          fill="#1e293b"
          stroke="white"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={cy}
          r="10"
          fill="#1e293b"
          stroke="white"
          strokeWidth="2"
        />
        <circle cx={cx} cy={cy} r="4" fill="white" />
      </svg>
      <p className="text-xs font-semibold mt-1" style={{ color: labelColor }}>
        Risk Level: {currentLevel.label} ({score.toFixed(0)}%)
      </p>
    </div>
  );
});

export default function DashboardPage() {
  const { actor, isFetching } = useActor();
  const { formatCurrency, country } = useCurrency();
  const sym = country.symbol;

  const { data: holdings = [], isLoading: hLoad } = useQuery<
    PortfolioHolding[]
  >({
    queryKey: ["portfolio", "all"],
    staleTime: 90_000,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPortfolioHoldings();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: transactions = [], isLoading: tLoad } = useQuery<Transaction[]>(
    {
      queryKey: ["transactions"],
      staleTime: 90_000,
      queryFn: async () => {
        if (!actor) return [];
        return actor.getAllTransactions();
      },
      enabled: !!actor && !isFetching,
    },
  );

  const { data: budgetCats = [], isLoading: bLoad } = useQuery<
    BudgetCategory[]
  >({
    queryKey: ["budgetCategories"],
    staleTime: 90_000,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBudgetCategories();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: goals = [], isLoading: gLoad } = useGetAllGoals();
  const { data: allInvestments = [] } = useGetAllInvestmentsByCategory();

  const { data: loans = [] } = useQuery<Loan[]>({
    queryKey: ["loans"],
    staleTime: 90_000,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLoans();
    },
    enabled: !!actor && !isFetching,
  });

  const isLoading = hLoad || tLoad || bLoad || gLoad;

  const byType = useMemo(() => {
    const m: Record<string, number> = {};
    for (const h of holdings) {
      const k = getKey(h.assetType);
      m[k] = (m[k] ?? 0) + h.currentValue;
    }
    return m;
  }, [holdings]);

  const totalNAV = useMemo(
    () => Object.values(byType).reduce((a, b) => a + b, 0),
    [byType],
  );

  const allocationPie = useMemo(
    () =>
      ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => ({
        name: ASSET_CONFIG[t].shortLabel,
        value: byType[t] ?? 0,
        color: ASSET_CONFIG[t].color,
        pct:
          totalNAV > 0 ? (((byType[t] ?? 0) / totalNAV) * 100).toFixed(1) : "0",
      })),
    [byType, totalNAV],
  );

  const categoryBar = useMemo(
    () =>
      ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => ({
        name: ASSET_CONFIG[t].shortLabel,
        value: byType[t] ?? 0,
        color: ASSET_CONFIG[t].color,
      })),
    [byType],
  );

  const _forecast20 = useMemo(() => {
    const yr = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, i) => {
      const row: Record<string, number | string> = { year: yr + i };
      for (const t of ASSET_TYPES) {
        row[t] = Math.round((byType[t] ?? 0) * (1 + ASSET_CONFIG[t].cagr) ** i);
      }
      return row;
    });
  }, [byType]);

  const goalsProgress = useMemo(() => {
    const invMap = new Map<string, number>();
    for (const inv of allInvestments)
      invMap.set(String(inv.id), inv.currentValue);

    const allGoalsWithProgress = goals.map((g) => {
      const cur = g.linkedInvestments.reduce(
        (s, id) => s + (invMap.get(String(id)) ?? 0),
        0,
      );
      const pct =
        g.targetAmount > 0 ? Math.min(100, (cur / g.targetAmount) * 100) : 0;
      const deadlineMs = Number(g.targetDate) / 1_000_000;
      const nowMs = Date.now();
      const monthsRemaining = Math.max(
        1,
        Math.round((deadlineMs - nowMs) / (1000 * 60 * 60 * 24 * 30)),
      );
      const sipEstimate =
        cur < g.targetAmount
          ? Math.max(0, Math.round((g.targetAmount - cur) / monthsRemaining))
          : 0;
      const goalDateStr = new Date(deadlineMs).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
      return {
        ...g,
        currentAmount: cur,
        pct,
        goalDateStr,
        sipEstimate,
        deadlineMs,
      };
    });

    // If total goals < 4, show all
    if (allGoalsWithProgress.length < 4) return allGoalsWithProgress;

    // Otherwise show max 3 on-track + max 3 need-attention, sorted by nearest goal date
    const onTrack = allGoalsWithProgress
      .filter((g) => g.pct >= 75 && g.pct < 100)
      .sort((a, b) => a.deadlineMs - b.deadlineMs)
      .slice(0, 3);
    const needAttention = allGoalsWithProgress
      .filter((g) => g.pct < 75)
      .sort((a, b) => a.deadlineMs - b.deadlineMs)
      .slice(0, 3);
    const achieved = allGoalsWithProgress.filter((g) => g.pct >= 100);

    return [...onTrack, ...needAttention, ...achieved];
  }, [goals, allInvestments]);

  const _riskReturn = useMemo(
    () =>
      ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => ({
        x: RISK_RETURN[t].risk,
        y: RISK_RETURN[t].ret,
        label: ASSET_CONFIG[t].shortLabel,
        color: ASSET_CONFIG[t].color,
        assetType: t,
      })),
    [byType],
  );

  const portfolioRiskScore = useMemo(() => {
    if (totalNAV === 0) return 0;
    // Risk = allocation % of high-volatility assets: Equity (ETF), Mutual Funds, Crypto
    const highVolatileValue =
      (byType.ETF ?? 0) + (byType.MutualFund ?? 0) + (byType.Crypto ?? 0);
    return (highVolatileValue / totalNAV) * 100;
  }, [byType, totalNAV]);

  // ── Section 6 data ──
  const incomeExpenseTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const yr = d.getFullYear();
      const mo = d.getMonth();
      const label = d.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      });
      const income = transactions
        .filter((t) => {
          const td = new Date(t.date);
          return (
            td.getFullYear() === yr &&
            td.getMonth() === mo &&
            getKey(t.transactionType) === "Income"
          );
        })
        .reduce((s, t) => s + t.amount, 0);
      const expense = transactions
        .filter((t) => {
          const td = new Date(t.date);
          return (
            td.getFullYear() === yr &&
            td.getMonth() === mo &&
            getKey(t.transactionType) === "Expense"
          );
        })
        .reduce((s, t) => s + t.amount, 0);
      return {
        month: label,
        Income: income,
        Expense: expense,
        Savings: income - expense,
      };
    });
  }, [transactions]);

  const _expenseByCategory = useMemo(() => {
    const catTotals: Record<string, number> = {};
    for (const t of transactions) {
      if (getKey(t.transactionType) === "Expense" && t.categoryId) {
        catTotals[t.categoryId] = (catTotals[t.categoryId] ?? 0) + t.amount;
      }
    }
    const rawData = budgetCats
      .map((c, i) => ({
        name: c.name,
        value: catTotals[c.id] ?? 0,
        color: SLICE_COLORS[i % SLICE_COLORS.length],
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
    const total = rawData.reduce((s, d) => s + d.value, 0);
    return rawData.map((d) => ({
      ...d,
      pct: total > 0 ? ((d.value / total) * 100).toFixed(1) : "0",
    }));
  }, [transactions, budgetCats]);

  const _savingsRate = useMemo(
    () =>
      incomeExpenseTrend.slice(-6).map((d) => ({
        month: d.month,
        rate: d.Income > 0 ? Math.round((d.Savings / d.Income) * 100) : 0,
        savings: d.Savings,
      })),
    [incomeExpenseTrend],
  );

  if (isLoading) {
    return (
      <div data-ocid="dashboard.loading_state" className="space-y-6 pb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div data-ocid="dashboard.page" className="space-y-5 pb-10">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
        >
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
      </div>

      {/* ── Section 1: Compact NAV Card ── */}
      <section data-ocid="dashboard.nav.section">
        <Card className="border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="px-5 py-2 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
              <div className="w-full sm:min-w-[160px] sm:w-auto">
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-medium mb-0.5">
                  Portfolio NAV
                </p>
                <p className="text-3xl font-bold tabular-nums leading-tight">
                  {formatCurrency(totalNAV)}
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {holdings.length} holding{holdings.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-700" />
              <div className="w-full sm:flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                {ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => (
                  <div
                    key={t}
                    data-ocid={`dashboard.nav.card.${ASSET_TYPES.indexOf(t) + 1}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: `${ASSET_CONFIG[t].color}20`,
                      border: `1px solid ${ASSET_CONFIG[t].color}40`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: ASSET_CONFIG[t].color }}
                    />
                    <span style={{ color: ASSET_CONFIG[t].color }}>
                      {ASSET_CONFIG[t].shortLabel}
                    </span>
                    <span className="text-slate-200 font-bold text-[11px] sm:text-xs">
                      {shortNum(byType[t] ?? 0, sym, country.code)}
                    </span>
                    <span className="text-slate-500">
                      {totalNAV > 0
                        ? `${(((byType[t] ?? 0) / totalNAV) * 100).toFixed(1)}%`
                        : "0%"}
                    </span>
                  </div>
                ))}
                {ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).length ===
                  0 && (
                  <span className="text-slate-500 text-xs italic">
                    No holdings yet
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Section 2: Allocation + Net Worth + Risk-o-meter ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          data-ocid="dashboard.allocation.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Asset Allocation
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Portfolio distribution by asset type
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {allocationPie.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-300">
                <span className="text-3xl">📊</span>
                <p className="text-sm text-slate-400">No portfolio data yet</p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0"
                  style={{ width: 180, height: 220 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        dataKey="value"
                        labelLine={false}
                      >
                        {allocationPie.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(
                          v: number,
                          _n: string,
                          props: { payload?: { name: string; pct: string } },
                        ) => [
                          `${formatCurrency(v)} (${props.payload?.pct ?? "0"}%)`,
                          props.payload?.name ?? "",
                        ]}
                        contentStyle={{
                          fontSize: "11px",
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {allocationPie.map((entry) => {
                    const total = allocationPie.reduce(
                      (s, d) => s + d.value,
                      0,
                    );
                    const pct =
                      total > 0
                        ? ((entry.value / total) * 100).toFixed(1)
                        : "0";
                    return (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: entry.color }}
                          />
                          <span className="text-[11px] text-slate-600 truncate">
                            {entry.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 flex-shrink-0">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk-o-meter */}
        <Card
          data-ocid="dashboard.riskometer.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Portfolio Risk-o-meter
            </CardTitle>
            <p className="text-xs text-slate-400">
              Based on risk profile of portfolio investments
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <RiskOMeter score={portfolioRiskScore} />
          </CardContent>
        </Card>
        <Card
          data-ocid="dashboard.networth.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Projected Net Worth Trend
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Total assets minus liabilities over 10 years
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {(() => {
              const totalLiabilities = loans.reduce(
                (s, l) => s + l.currentBalance,
                0,
              );
              const now = new Date();
              const currentYear = now.getFullYear();
              const rateMap: Record<string, number> = {
                Retirement: 0.08,
                ETF: 0.12,
                MutualFund: 0.12,
                FixedIncome: 0.07,
                Commodity: 0.09,
                Crypto: 0.15,
                RealEstate: 0.06,
                Other: 0.08,
              };
              const networthData = Array.from({ length: 10 }, (_, i) => {
                const year = i + 1;
                const row: Record<string, number | string> = {
                  year: `${currentYear + year}`,
                };
                let projectedAssets = 0;
                for (const t of ASSET_TYPES) {
                  const val = byType[t] ?? 0;
                  if (val > 0) {
                    const projected = Math.round(
                      val * (1 + (rateMap[t] ?? 0.08)) ** year,
                    );
                    row[ASSET_CONFIG[t].shortLabel] = projected;
                    projectedAssets += projected;
                  }
                }
                row["Net Worth"] = Math.round(
                  projectedAssets - totalLiabilities,
                );
                return row;
              });
              const activeAssets = ASSET_TYPES.filter(
                (t) => (byType[t] ?? 0) > 0,
              );
              return (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={networthData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.15}
                      vertical={false}
                    />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: number) =>
                        shortNum(v, sym, country.code)
                      }
                      width={52}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || payload.length === 0)
                          return null;
                        const nwEntry = payload.find(
                          (p) => p.dataKey === "Net Worth",
                        );
                        return (
                          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs min-w-[180px]">
                            <p className="font-bold text-slate-700 mb-2">
                              {label}
                            </p>
                            <div className="space-y-1">
                              {activeAssets.map((t) => {
                                const entry = payload.find(
                                  (p) =>
                                    p.dataKey === ASSET_CONFIG[t].shortLabel,
                                );
                                if (!entry) return null;
                                return (
                                  <div
                                    key={t}
                                    className="flex justify-between gap-3"
                                  >
                                    <span
                                      className="flex items-center gap-1"
                                      style={{ color: ASSET_CONFIG[t].color }}
                                    >
                                      <span
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                        style={{
                                          background: ASSET_CONFIG[t].color,
                                        }}
                                      />
                                      {ASSET_CONFIG[t].shortLabel}
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                      {shortNum(
                                        Number(entry.value ?? 0),
                                        sym,
                                        country.code,
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                              <div className="border-t border-slate-100 mt-1.5 pt-1.5 flex justify-between gap-3">
                                <span className="font-bold text-indigo-700">
                                  Net Worth
                                </span>
                                <span className="font-bold text-indigo-700">
                                  {shortNum(
                                    Number(nwEntry?.value ?? 0),
                                    sym,
                                    country.code,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    {activeAssets.map((t) => (
                      <Line
                        key={t}
                        type="monotone"
                        dataKey={ASSET_CONFIG[t].shortLabel}
                        stroke={ASSET_CONFIG[t].color}
                        strokeWidth={1.5}
                        strokeDasharray="4 2"
                        dot={false}
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="Net Worth"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={{ fill: "#6366f1", r: 3 }}
                      activeDot={{ r: 6 }}
                    >
                      <LabelList
                        dataKey="Net Worth"
                        position="top"
                        style={{ fontSize: "9px", fill: "#6366f1" }}
                        formatter={(v: number) =>
                          shortNum(v, sym, country.code)
                        }
                      />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* ── Assets vs Liabilities + DTI ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Liability vs Asset */}
        <Card
          data-ocid="dashboard.liabilityasset.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Assets vs Liabilities
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Total portfolio value vs outstanding loans
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {(() => {
              const totalLiabilities = loans.reduce(
                (s, l) => s + l.currentBalance,
                0,
              );
              const pieData = [
                { name: "Assets", value: totalNAV, color: "#10b981" },
                {
                  name: "Liabilities",
                  value: totalLiabilities,
                  color: "#f43f5e",
                },
              ].filter((d) => d.value > 0);
              if (pieData.length === 0) {
                return (
                  <div className="h-[180px] flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📊</span>
                    <p className="text-sm text-slate-400">
                      No portfolio data yet
                    </p>
                  </div>
                );
              }
              const avslTotal = pieData.reduce((s, d) => s + d.value, 0);
              return (
                <div className="flex items-center gap-0">
                  {/* Donut chart — give it enough room so the full circle is unclipped */}
                  <div
                    className="flex-shrink-0"
                    style={{ width: 160, height: 160 }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart
                        margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
                      >
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={46}
                          outerRadius={68}
                          dataKey="value"
                          labelLine={false}
                        >
                          {pieData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: number, name: string) => [
                            formatCurrency(v),
                            name,
                          ]}
                          contentStyle={{
                            fontSize: "11px",
                            borderRadius: "10px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend — sits at far right, never overlaps the chart */}
                  <div className="flex flex-col justify-center gap-3 flex-1 min-w-0 pl-2">
                    {pieData.map((d) => {
                      const pct =
                        avslTotal > 0
                          ? ((d.value / avslTotal) * 100).toFixed(1)
                          : "0";
                      return (
                        <div key={d.name} className="flex items-start gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                            style={{ background: d.color }}
                          />
                          <div className="min-w-0">
                            <span className="text-[11px] text-slate-500 block">
                              {d.name}
                            </span>
                            <span className="text-[12px] font-bold text-slate-800 tabular-nums block">
                              {formatCurrency(d.value)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {pct}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Debt-to-Income Ratio */}
        <Card
          data-ocid="dashboard.dti.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Debt-to-Income Ratio
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Monthly loan EMIs ÷ monthly income (industry standard: under 36%)
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-4">
            {(() => {
              const monthlyEMI = loans.reduce(
                (s, l) => s + l.monthlyPayment,
                0,
              );
              const monthlyIncome =
                incomeExpenseTrend.length > 0
                  ? incomeExpenseTrend
                      .slice(-3)
                      .reduce((s, d) => s + d.Income, 0) / 3
                  : 0;
              const dti =
                monthlyIncome > 0
                  ? Math.min(100, (monthlyEMI / monthlyIncome) * 100)
                  : 0;
              const color =
                dti < 30 ? "#10b981" : dti < 50 ? "#f59e0b" : "#ef4444";
              const label =
                dti < 30 ? "Healthy" : dti < 50 ? "Moderate" : "High Risk";
              return (
                <div className="space-y-5">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-extrabold" style={{ color }}>
                        {dti.toFixed(1)}%
                      </p>
                      <p
                        className="text-xs font-semibold mt-0.5"
                        style={{ color }}
                      >
                        {label}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-400 space-y-1">
                      <p>
                        Monthly EMI:{" "}
                        <span className="font-semibold text-slate-700">
                          {formatCurrency(monthlyEMI)}
                        </span>
                      </p>
                      <p>
                        Avg Income:{" "}
                        <span className="font-semibold text-slate-700">
                          {formatCurrency(monthlyIncome)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="relative h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, dti)}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0%</span>
                    <span className="text-emerald-500 font-medium">
                      Good &lt;30%
                    </span>
                    <span className="text-amber-500 font-medium">
                      36% threshold
                    </span>
                    <span className="text-red-500 font-medium">
                      High &gt;50%
                    </span>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* ── Cash Flow Summary + Income vs Expense Trend ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          data-ocid="dashboard.cashflow.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Cash Flow Summary
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Monthly income vs expenses (6 months)
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={incomeExpenseTrend.slice(-6)}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.15}
                  vertical={false}
                />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v: number) => shortNum(v, sym, country.code)}
                  width={52}
                />
                <Tooltip
                  formatter={(v: number, name: string) => [
                    formatCurrency(v),
                    name,
                  ]}
                  contentStyle={{
                    fontSize: "11px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="Income"
                    position="top"
                    style={{ fontSize: "9px", fill: "#10b981" }}
                    formatter={(v: number) => shortNum(v, sym, country.code)}
                  />
                </Bar>
                <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="Expense"
                    position="top"
                    style={{ fontSize: "9px", fill: "#f43f5e" }}
                    formatter={(v: number) => shortNum(v, sym, country.code)}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card
          data-ocid="dashboard.incomevexpense.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Income vs Expense Trend
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              12-month view showing income, expenses &amp; savings
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {incomeExpenseTrend.every(
              (d) => d.Income === 0 && d.Expense === 0,
            ) ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">📊</span>
                <p className="text-sm text-slate-400">
                  No transaction data yet
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={incomeExpenseTrend}
                  margin={{ top: 5, right: 10, left: 10, bottom: 30 }}
                >
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorExpense"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 9 }}
                    angle={-20}
                    textAnchor="end"
                    height={45}
                  />
                  <YAxis
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v: number) =>
                      shortNum(v, sym, country.code)
                    }
                  />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      formatCurrency(v),
                      name,
                    ]}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area
                    type="monotone"
                    dataKey="Income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Investment Categories + 50/30/20 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Investment Categories - Horizontal Bar */}
        <Card
          data-ocid="dashboard.categories.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Investment Categories
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Current value by asset category
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {categoryBar.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-300">
                <span className="text-3xl">📈</span>
                <p className="text-sm text-slate-400">No portfolio data yet</p>
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(120, categoryBar.length * 44)}
              >
                <BarChart
                  data={[...categoryBar].sort((a, b) => b.value - a.value)}
                  layout="vertical"
                  margin={{ top: 5, right: 80, left: 8, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.15}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v: number) =>
                      shortNum(v, sym, country.code)
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={60}
                  />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), "Value"]}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                    {[...categoryBar]
                      .sort((a, b) => b.value - a.value)
                      .map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(v: number) => shortNum(v, sym, country.code)}
                      style={{
                        fontSize: "10px",
                        fill: "#64748b",
                        fontWeight: 600,
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card
          data-ocid="dashboard.budgetrule.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              50/30/20 Budget Rule Analysis
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Current month: Needs vs Wants vs Savings vs ideal allocation
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {(() => {
              const currentDate = new Date();
              const currentMonth = currentDate.getMonth();
              const currentYear = currentDate.getFullYear();
              const currentMonthTx = transactions.filter((tx) => {
                const d = new Date(tx.date);
                return (
                  d.getMonth() === currentMonth &&
                  d.getFullYear() === currentYear
                );
              });
              const dashIncome = currentMonthTx
                .filter((t) => getKey(t.transactionType) === "Income")
                .reduce((s, t) => s + t.amount, 0);
              const dashExpenseTx = currentMonthTx.filter(
                (t) => getKey(t.transactionType) === "Expense",
              );
              if (dashIncome <= 0 && dashExpenseTx.length === 0) {
                return (
                  <div className="h-48 flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">💰</span>
                    <p className="text-sm text-slate-400">
                      No transaction data for current month
                    </p>
                  </div>
                );
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
                "retiral",
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
                "leisure",
              ];
              const catTypeMap: Record<string, string> = {};
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
                0,
              );
              const dashNeeds50 = dashIncome * 0.5;
              const dashWants30 = dashIncome * 0.3;
              const dashSavings20 = dashIncome * 0.2;
              const dashSavings = Math.max(0, dashIncome - dashExpenses);
              const dashSavingsRate =
                dashIncome > 0 ? (dashSavings / dashIncome) * 100 : 0;
              return (
                <Budget5030Chart
                  income={dashIncome}
                  expenses={dashExpenses}
                  needs50={dashNeeds50}
                  wants30={dashWants30}
                  savings20={dashSavings20}
                  savings={dashSavings}
                  savingsRate={dashSavingsRate}
                  formatCurrency={formatCurrency}
                />
              );
            })()}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card
          data-ocid="dashboard.goals.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Goals Progress
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Top 5 goals linked to portfolio investments
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {goalsProgress.length === 0 ? (
              <div
                data-ocid="dashboard.goals.empty_state"
                className="h-64 flex flex-col items-center justify-center gap-2"
              >
                <span className="text-3xl">🎯</span>
                <p className="text-sm text-slate-400">
                  No goals yet. Add goals in the Goals module.
                </p>
              </div>
            ) : (
              <GoalsProgressList
                goals={goalsProgress}
                formatCurrency={formatCurrency}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
