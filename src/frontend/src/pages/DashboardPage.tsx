import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  BudgetCategory,
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

  const forecast20 = useMemo(() => {
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
                <p className="text-2xl font-bold tabular-nums leading-tight">
                  {formatCurrency(totalNAV)}
                </p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {holdings.length} holding{holdings.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-700" />
              <div className="flex flex-wrap gap-1.5 flex-1">
                {ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => (
                  <div
                    key={t}
                    data-ocid={`dashboard.nav.card.${ASSET_TYPES.indexOf(t) + 1}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
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
                    <span className="text-slate-300">
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
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

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
              <ResponsiveContainer width="100%" height={280}>
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
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
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
              <div className="space-y-3 pt-1">
                {goalsProgress.map((g, idx) => (
                  <div
                    key={g.id}
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
                          width: `${g.pct}%`,
                          background:
                            g.pct >= 75
                              ? "#10b981"
                              : g.pct >= 50
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span className="tabular-nums">
                        {formatCurrency(g.currentAmount)}
                      </span>
                      <span className="tabular-nums font-medium text-slate-500">
                        {formatCurrency(g.targetAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>
                        🗓 {(g as { goalDateStr?: string }).goalDateStr ?? ""}
                      </span>
                      {((g as { sipEstimate?: number }).sipEstimate ?? 0) >
                        0 && (
                        <span className="text-indigo-500 font-medium">
                          SIP:{" "}
                          {formatCurrency(
                            (g as { sipEstimate?: number }).sipEstimate ?? 0,
                          )}
                          /mo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={budgetChart}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
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
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Planned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* end goals+budget grid */}

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
                      label={({ name, pct }: { name: string; pct: string }) =>
                        `${name} (${pct}%)`
                      }
                      labelLine={true}
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
      {/* ── 20-Year Forecast Table ── */}
      <Card
        data-ocid="dashboard.forecast20_table.card"
        className="rounded-2xl shadow-sm border border-slate-100 bg-white"
      >
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
            20-Year Portfolio Forecast
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Year-by-year projection using asset-specific CAGR rates
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div
            style={
              {
                transform: "rotateX(180deg)",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              } as React.CSSProperties
            }
          >
            <div style={{ transform: "rotateX(180deg)", minWidth: 600 }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-slate-700 text-white text-[11px] font-medium uppercase tracking-wide w-16">
                      Year
                    </TableHead>
                    {ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map(
                      (t) => (
                        <TableHead
                          key={t}
                          className="bg-slate-700 text-white text-[11px] font-medium uppercase tracking-wide text-right"
                        >
                          {ASSET_CONFIG[t].shortLabel}
                        </TableHead>
                      ),
                    )}
                    <TableHead className="bg-slate-700 text-white text-[11px] font-medium uppercase tracking-wide text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecast20.map((row, idx) => {
                    const total = ASSET_TYPES.filter(
                      (t) => (byType[t] ?? 0) > 0,
                    ).reduce((s, t) => s + Number(row[t] ?? 0), 0);
                    return (
                      <TableRow
                        key={String(row.year)}
                        data-ocid={`dashboard.forecast20.row.${idx + 1}`}
                        className={`hover:bg-slate-50/80 ${idx % 5 === 0 ? "bg-blue-50/30" : ""}`}
                      >
                        <TableCell className="text-xs font-semibold text-slate-700 tabular-nums">
                          {String(row.year)}
                        </TableCell>
                        {ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map(
                          (t) => (
                            <TableCell
                              key={t}
                              className="text-xs text-right text-slate-600 tabular-nums"
                            >
                              {shortNum(Number(row[t] ?? 0), sym)}
                            </TableCell>
                          ),
                        )}
                        <TableCell className="text-xs text-right font-bold text-emerald-700 tabular-nums">
                          {shortNum(total, sym)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
