import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, LayoutDashboard } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
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
import type {
  BudgetCategory,
  Loan,
  PortfolioHolding,
  Transaction,
} from "../backend.d";
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

const SLICE_COLORS = [
  "#60a5fa",
  "#34d399",
  "#a78bfa",
  "#f87171",
  "#fbbf24",
  "#fb923c",
  "#22d3ee",
  "#94a3b8",
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
    shortLabel: "Mutual Funds",
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
    shortLabel: "Real Estate",
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

function shortNum(n: number, sym: string): string {
  if (n >= 10_000_000) return `${sym}${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `${sym}${(n / 100_000).toFixed(2)}L`;
  return `${sym}${Math.round(n).toLocaleString("en-IN")}`;
}

function statusBadge(pct: number) {
  if (pct >= 100)
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
        Completed
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
        Needs Attention
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

function GoalsProgressList({
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
}

function CustomDot(props: {
  cx?: number;
  cy?: number;
  payload?: { label: string; color: string };
}) {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload) return null;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={7}
        fill={payload.color}
        stroke="#fff"
        strokeWidth={2}
      />
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fontSize={10}
        fill="#374151"
        fontWeight={500}
      >
        {payload.label}
      </text>
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { actor, isFetching } = useActor();
  const { formatCurrency, country } = useCurrency();
  const sym = country.symbol;

  const { data: holdings = [], isLoading: hLoad } = useQuery<
    PortfolioHolding[]
  >({
    queryKey: ["dashboard", "holdings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPortfolioHoldings();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: transactions = [], isLoading: tLoad } = useQuery<Transaction[]>(
    {
      queryKey: ["dashboard", "transactions"],
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
    queryKey: ["dashboard", "budgetCats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBudgetCategories();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: goals = [], isLoading: gLoad } = useGetAllGoals();
  const { data: allInvestments = [] } = useGetAllInvestmentsByCategory();

  const { data: loans = [] } = useQuery<Loan[]>({
    queryKey: ["dashboard", "loans"],
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
    return goals.slice(0, 5).map((g) => {
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
      return { ...g, currentAmount: cur, pct, goalDateStr, sipEstimate };
    });
  }, [goals, allInvestments]);

  const budgetChart = useMemo(() => {
    const now = new Date();
    const totalPlanned = budgetCats
      .filter((c) => getKey(c.categoryType) === "Expense")
      .reduce((s, c) => s + c.monthlyLimit, 0);
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const yr = d.getFullYear();
      const mo = d.getMonth();
      const label = d.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      });
      const actual = transactions
        .filter((t) => {
          const td = new Date(t.date);
          return (
            td.getFullYear() === yr &&
            td.getMonth() === mo &&
            getKey(t.transactionType) === "Expense"
          );
        })
        .reduce((s, t) => s + t.amount, 0);
      return { month: label, Planned: totalPlanned, Actual: actual };
    });
  }, [transactions, budgetCats]);

  const riskReturn = useMemo(
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

  const expenseByCategory = useMemo(() => {
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

  const savingsRate = useMemo(
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
          <CardContent className="px-5 py-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="min-w-[160px]">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 flex-1">
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
                    <span className="text-slate-200 font-bold text-[9px] sm:text-xs">
                      {shortNum(byType[t] ?? 0, sym)}
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

      {/* ── Section 2: Allocation + Categories ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={allocationPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    dataKey="value"
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return percent > 0.04 ? (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={11}
                          fontWeight={600}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      ) : null;
                    }}
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
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
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
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={(() => {
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
                  return Array.from({ length: 10 }, (_, i) => {
                    const year = i + 1;
                    const projectedAssets = ASSET_TYPES.reduce((sum, t) => {
                      const val = byType[t] ?? 0;
                      const rate = rateMap[t] ?? 0.08;
                      return sum + val * (1 + rate) ** year;
                    }, 0);
                    return {
                      year: `${currentYear + year}`,
                      "Net Worth": Math.round(
                        projectedAssets - totalLiabilities,
                      ),
                    };
                  });
                })()}
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
                  tickFormatter={(v: number) => shortNum(v, sym)}
                  width={52}
                />
                <Tooltip
                  formatter={(v: number) => [
                    formatCurrency(v),
                    "Projected Net Worth",
                  ]}
                  contentStyle={{
                    fontSize: "11px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Net Worth"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 3+4: Goals Progress + Budget 6M in one row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* ── Section 4: Budget 6M ── */}
        <Card
          data-ocid="dashboard.budget.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Budgeting (6 Months)
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Planned budget vs actual expenses per month
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={budgetChart}
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
                  tickFormatter={(v: number) => shortNum(v, sym)}
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Planned" fill="#10b981" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="Planned"
                    position="top"
                    formatter={(v: number) => shortNum(v, sym)}
                    style={{ fontSize: "9px", fill: "#374151" }}
                  />
                </Bar>
                <Bar dataKey="Actual" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="Actual"
                    position="top"
                    formatter={(v: number) => shortNum(v, sym)}
                    style={{ fontSize: "9px", fill: "#374151" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* end goals+budget grid */}

      {/* ── Financial Health Overview ── */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
          Financial Health Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Investment Categories */}
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
                  <p className="text-sm text-slate-400">
                    No portfolio data yet
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={categoryBar}
                    margin={{ top: 5, right: 10, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      angle={-20}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v: number) => shortNum(v, sym)}
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
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {categoryBar.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="insideTop"
                        content={({
                          x,
                          y,
                          width,
                          value,
                        }: {
                          x?: number | string;
                          y?: number | string;
                          width?: number | string;
                          value?: number | string;
                        }) => {
                          const numVal = typeof value === "number" ? value : 0;
                          const numX = typeof x === "number" ? x : 0;
                          const numY = typeof y === "number" ? y : 0;
                          const numW = typeof width === "number" ? width : 0;
                          if (numVal === 0) return null;
                          return (
                            <text
                              x={numX + numW / 2}
                              y={numY + 14}
                              fill="#fff"
                              textAnchor="middle"
                              fontSize={10}
                              fontWeight={600}
                            >
                              {formatCurrency(numVal)}
                            </text>
                          );
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Cash Flow Summary */}
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
                    tickFormatter={(v: number) => shortNum(v, sym)}
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
                  <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
                const total = pieData.reduce((s, d) => s + d.value, 0);
                return (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                          label={({ value }: { name: string; value: number }) =>
                            `${total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"}%`
                          }
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
                    <div className="flex-1 space-y-3">
                      {pieData.map((d) => (
                        <div key={d.name}>
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ background: d.color }}
                            />
                            <span className="text-xs text-slate-500">
                              {d.name}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-800 ml-4">
                            {formatCurrency(d.value)}
                          </p>
                        </div>
                      ))}
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
                Monthly loan EMIs ÷ monthly income (industry standard: under
                36%)
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
                        <p
                          className="text-3xl font-extrabold"
                          style={{ color }}
                        >
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
      </div>
      {/* end financial health */}

      {/* ── Section 6: Advanced Finance Analytics ── */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
          Advanced Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Income vs Expense Trend */}
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
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorExpense"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
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
                      tickFormatter={(v: number) => shortNum(v, sym)}
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

          {/* Expense by Category Donut */}
          <Card
            data-ocid="dashboard.expcat.card"
            className="rounded-2xl shadow-sm border border-slate-100 bg-white"
          >
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
                Expense by Category
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Top spending categories breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {expenseByCategory.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl">🧾</span>
                  <p className="text-sm text-slate-400">No expense data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      dataKey="value"
                      labelLine={false}
                      label={({
                        cx: pcx,
                        cy: pcy,
                        midAngle,
                        innerRadius: ir,
                        outerRadius: or,
                        percent,
                      }: {
                        cx: number;
                        cy: number;
                        midAngle: number;
                        innerRadius: number;
                        outerRadius: number;
                        percent: number;
                      }) => {
                        if (percent < 0.04) return null;
                        const RADIAN = Math.PI / 180;
                        const radius = ir + (or - ir) * 0.5;
                        const lx = pcx + radius * Math.cos(-midAngle * RADIAN);
                        const ly = pcy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={lx}
                            y={ly}
                            fill="#fff"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={11}
                            fontWeight={700}
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                    >
                      {expenseByCategory.map((entry) => (
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
                        _name: string,
                        entry: { payload?: { pct?: string } },
                      ) => [
                        `${formatCurrency(v)} (${entry.payload?.pct ?? "0"}%)`,
                        "Spent",
                      ]}
                      contentStyle={{
                        fontSize: "11px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* end Advanced Analytics outer */}
      {/* ── Savings Rate + Risk vs Return in one row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          data-ocid="dashboard.savingsrate.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Monthly Savings Rate (%)
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Percentage of income saved each month — industry benchmark is 20%+
              (50/30/20 rule)
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {savingsRate.every((d) => d.rate === 0) ? (
              <div className="h-48 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">💰</span>
                <p className="text-sm text-slate-400">No data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={savingsRate}
                  margin={{ top: 10, right: 20, left: 5, bottom: 20 }}
                >
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
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, "Savings Rate"]}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {savingsRate.map((entry) => (
                      <Cell
                        key={entry.month}
                        fill={
                          entry.rate >= 20
                            ? "#10b981"
                            : entry.rate >= 10
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                      />
                    ))}
                    <LabelList
                      content={({
                        x,
                        y,
                        width,
                        index,
                      }: {
                        x?: number | string;
                        y?: number | string;
                        width?: number | string;
                        index?: number;
                      }) => {
                        const i = index ?? 0;
                        const entry = savingsRate[i];
                        if (!entry || entry.rate === 0) return null;
                        const numX = typeof x === "number" ? x : 0;
                        const numY = typeof y === "number" ? y : 0;
                        const numW = typeof width === "number" ? width : 0;
                        const cx = numX + numW / 2;
                        return (
                          <g>
                            <text
                              x={cx}
                              y={numY + 14}
                              fill="#fff"
                              textAnchor="middle"
                              fontSize={10}
                              fontWeight={700}
                            >
                              {`${entry.rate}%`}
                            </text>
                            <text
                              x={cx}
                              y={numY + 26}
                              fill="#fff"
                              textAnchor="middle"
                              fontSize={9}
                              fontWeight={500}
                              opacity={0.9}
                            >
                              {formatCurrency(entry.savings)}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        {/* ── Risk vs Return ── */}
        <Card
          data-ocid="dashboard.riskreturn.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              Risk vs Return
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Annual return (%) vs risk (std dev %) for held asset types
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {riskReturn.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">⚖️</span>
                <p className="text-sm text-slate-400">No portfolio data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Risk"
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "Risk (%)",
                      position: "insideBottom",
                      offset: -10,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Return"
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "Return (%)",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(v: number, name: string) => [
                      `${v}%`,
                      name === "x" ? "Risk" : "Return",
                    ]}
                    labelFormatter={(_label, payload) => {
                      const pt = (
                        payload as Array<{ payload?: { label?: string } }>
                      )?.[0]?.payload;
                      return pt?.label ?? "";
                    }}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Scatter
                    data={riskReturn}
                    shape={(p: {
                      cx?: number;
                      cy?: number;
                      payload?: { label: string; color: string };
                    }) => <CustomDot cx={p.cx} cy={p.cy} payload={p.payload} />}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      {/* end savings+risk grid */}
    </div>
  );
}
