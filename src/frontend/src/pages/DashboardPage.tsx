import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
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
import { ScrollArea } from "../components/ui/scroll-area";
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
  if (n >= 10_000_000) return `${sym}${(n / 10_000_000).toFixed(2)}CR`;
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

// Custom scatter dot with label
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

  // ── Data Fetches ──
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

  // ── Portfolio by type ──
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

  // ── Allocation pie ──
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

  // ── Investment categories bar ──
  const categoryBar = useMemo(
    () =>
      ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => ({
        name: ASSET_CONFIG[t].shortLabel,
        value: byType[t] ?? 0,
        color: ASSET_CONFIG[t].color,
      })),
    [byType],
  );

  // ── 20-Year Forecast (stacked bar) ──
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

  // ── Goals with computed progress ──
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
      return { ...g, currentAmount: cur, pct };
    });
  }, [goals, allInvestments]);

  // ── Budget: last 6 months ──
  const budgetChart = useMemo(() => {
    const now = new Date();
    const totalPlanned = budgetCats.reduce((s, c) => s + c.monthlyLimit, 0);
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

  // ── Risk vs Return ──
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

  // ── 25-Year Forecast Table ──
  const forecast25 = useMemo(() => {
    const yr = new Date().getFullYear();
    const groups: Record<string, string[]> = {
      Retiral: ["Retirement"],
      MF: ["MutualFund"],
      ETF: ["ETF"],
      FDs: ["FixedIncome"],
      Crypto: ["Crypto"],
      Other: ["Commodity", "RealEstate", "Other"],
    };
    const baseByGroup: Record<string, number> = {};
    const cagrByGroup: Record<string, number> = {
      Retiral: 0.08,
      MF: 0.12,
      ETF: 0.12,
      FDs: 0.07,
      Crypto: 0.2,
      Other: 0.08,
    };
    for (const [grp, types] of Object.entries(groups)) {
      baseByGroup[grp] = types.reduce((s, t) => s + (byType[t] ?? 0), 0);
    }
    return Array.from({ length: 26 }, (_, i) => {
      const row: Record<string, number | string> = {
        year: yr + i,
        age: 35 + i,
      };
      let total = 0;
      for (const grp of Object.keys(groups)) {
        const v = Math.round(baseByGroup[grp] * (1 + cagrByGroup[grp]) ** i);
        row[grp] = v;
        total += v;
      }
      row.Total = total;
      return row;
    });
  }, [byType]);

  // ── Loading skeleton ──
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

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div data-ocid="dashboard.page" className="space-y-5 pb-10">
      {/* Page title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-0.5">
          Your complete financial overview
        </p>
      </div>

      {/* ── Section 1: Compact NAV Card ── */}
      <section data-ocid="dashboard.nav.section">
        <Card className="border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="px-5 py-4">
            <div className="flex items-center gap-6 flex-wrap">
              {/* Left: total NAV */}
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

              {/* Divider */}
              <div className="hidden sm:block w-px h-10 bg-slate-700" />

              {/* Right: asset pills */}
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
        {/* Asset Allocation Pie */}
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
                    label={({ name, pct }) => `${name}: ${pct}%`}
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
                    formatter={(v: number) => [formatCurrency(v), "Value"]}
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

        {/* Investment Categories Bar */}
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

      {/* ── Section 3: 20-Year Forecast + Goals Progress ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 20-Year Stacked Forecast */}
        <Card
          data-ocid="dashboard.forecast20.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
              20-Year Portfolio Forecast
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Projected growth by asset type using historical CAGR rates
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {totalNAV === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">🔮</span>
                <p className="text-sm text-slate-400">
                  Add holdings to see forecast
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={forecast20}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="year" tick={{ fontSize: 9 }} interval={4} />
                  <YAxis
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v: number) => shortNum(v, sym)}
                  />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      formatCurrency(v),
                      ASSET_CONFIG[name]?.shortLabel ?? name,
                    ]}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "10px" }}
                    formatter={(v: string) => ASSET_CONFIG[v]?.shortLabel ?? v}
                  />
                  {ASSET_TYPES.filter((t) => (byType[t] ?? 0) > 0).map((t) => (
                    <Bar
                      key={t}
                      dataKey={t}
                      stackId="a"
                      fill={ASSET_CONFIG[t].color}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Goals Progress */}
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Section 4: Budget 6M + Risk vs Return ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Budgeting 6 months */}
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

        {/* Risk vs Return Scatter */}
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
              <ResponsiveContainer width="100%" height={280}>
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

      {/* ── Section 5: 25-Year Forecast Table ── */}
      <Card
        data-ocid="dashboard.forecast25.card"
        className="rounded-2xl shadow-sm border border-slate-100 bg-white"
      >
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
            25-Year Portfolio Forecast
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Detailed year-by-year projection using asset-specific CAGR rates
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <ScrollArea className="w-full">
            <div style={{ minWidth: 700 }}>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100">
                    <TableHead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wide w-16">
                      Year
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wide w-14">
                      Age
                    </TableHead>
                    {(
                      [
                        "Retiral",
                        "MF",
                        "ETF",
                        "FDs",
                        "Crypto",
                        "Other",
                      ] as const
                    ).map((col) => (
                      <TableHead
                        key={col}
                        className="sticky top-0 z-10 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wide text-right"
                      >
                        {col}
                      </TableHead>
                    ))}
                    <TableHead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wide text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecast25.map((row, idx) => (
                    <TableRow
                      key={String(row.year)}
                      data-ocid={`dashboard.forecast.row.${idx + 1}`}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        idx % 5 === 0 ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <TableCell className="text-xs font-semibold text-slate-700 tabular-nums sticky left-0 bg-white">
                        {String(row.year)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-400 tabular-nums">
                        {String(row.age)}
                      </TableCell>
                      {(
                        [
                          "Retiral",
                          "MF",
                          "ETF",
                          "FDs",
                          "Crypto",
                          "Other",
                        ] as const
                      ).map((col) => (
                        <TableCell
                          key={col}
                          className="text-xs text-right text-slate-600 tabular-nums"
                        >
                          {shortNum(Number(row[col]), sym)}
                        </TableCell>
                      ))}
                      <TableCell className="text-xs text-right font-bold text-emerald-700 tabular-nums">
                        {shortNum(Number(row.Total), sym)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
