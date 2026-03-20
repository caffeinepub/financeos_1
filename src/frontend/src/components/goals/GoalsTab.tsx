import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  BarChart3,
  MinusCircle,
  PieChart,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCurrency } from "../../contexts/CurrencyContext";
import {
  useGetAllCommodities,
  useGetAllCryptos,
  useGetAllETFStocks,
  useGetAllFDs,
  useGetAllGoals,
  useGetAllMutualFunds,
  useGetAllOtherInvestments,
  useGetAllRealEstates,
  useGetAllRetirals,
} from "../../hooks/useGoals";
import { GoalList } from "./GoalList";
import { AddGoalDialog } from "./dialogs/AddGoalDialog";

interface GoalsTabProps {
  externalAddOpen?: boolean;
  onExternalAddOpenChange?: (open: boolean) => void;
}

export function GoalsTab({
  externalAddOpen,
  onExternalAddOpenChange,
}: GoalsTabProps = {}) {
  const { data: goals = [], isLoading, isError } = useGetAllGoals();
  const [_internalAddOpen, _setInternalAddOpen] = useState(false);
  const isAddDialogOpen =
    externalAddOpen !== undefined ? externalAddOpen : _internalAddOpen;
  const setIsAddDialogOpen = (v: boolean) => {
    _setInternalAddOpen(v);
    if (onExternalAddOpenChange) onExternalAddOpenChange(v);
  };
  const { formatCurrency } = useCurrency();

  const { data: retirals = [] } = useGetAllRetirals();
  const { data: equityStocks = [] } = useGetAllETFStocks();
  const { data: mutualFunds = [] } = useGetAllMutualFunds();
  const { data: cryptos = [] } = useGetAllCryptos();
  const { data: fds = [] } = useGetAllFDs();
  const { data: commodities = [] } = useGetAllCommodities();
  const { data: realEstates = [] } = useGetAllRealEstates();
  const { data: otherInvestments = [] } = useGetAllOtherInvestments();

  const allInvestments = useMemo(
    () => [
      ...retirals,
      ...equityStocks,
      ...mutualFunds,
      ...cryptos,
      ...fds,
      ...commodities,
      ...realEstates,
      ...otherInvestments,
    ],
    [
      retirals,
      equityStocks,
      mutualFunds,
      cryptos,
      fds,
      commodities,
      realEstates,
      otherInvestments,
    ],
  );

  const goalCurrentSavings = useMemo(() => {
    const map = new Map<string, number>();
    for (const goal of goals) {
      const savings = goal.linkedInvestments.reduce((sum, invId) => {
        const inv = allInvestments.find((i) => i.id === invId);
        return sum + (inv?.currentValue ?? 0);
      }, 0);
      map.set(goal.id, savings);
    }
    return map;
  }, [goals, allInvestments]);

  const currentSavings = useMemo(() => {
    const uniqueIds = new Set<string>();
    for (const goal of goals) {
      for (const id of goal.linkedInvestments) uniqueIds.add(id);
    }
    let total = 0;
    for (const invId of uniqueIds) {
      const inv = allInvestments.find((i) => i.id === invId);
      total += inv?.currentValue ?? 0;
    }
    return total;
  }, [goals, allInvestments]);

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const amountRequired = Math.max(0, totalTargetAmount - currentSavings);

  const overallProgress = useMemo(() => {
    if (totalTargetAmount === 0) return 0;
    return (currentSavings / totalTargetAmount) * 100;
  }, [currentSavings, totalTargetAmount]);

  const analyticsData = useMemo(() => {
    if (goals.length === 0)
      return {
        achievementQuality: [],
        savingsAdequacy: [],
        goalDiversification: [],
      };

    const getProgress = (g: (typeof goals)[0]) => {
      const savings = goalCurrentSavings.get(g.id) || 0;
      return g.targetAmount > 0 ? (savings / g.targetAmount) * 100 : 0;
    };

    return {
      achievementQuality: [
        {
          name: "Ahead",
          value: goals.filter((g) => getProgress(g) >= 100).length,
          color: "#10b981",
        },
        {
          name: "On Track",
          value: goals.filter(
            (g) => getProgress(g) >= 75 && getProgress(g) < 100,
          ).length,
          color: "#3b82f6",
        },
        {
          name: "Behind",
          value: goals.filter(
            (g) => getProgress(g) >= 50 && getProgress(g) < 75,
          ).length,
          color: "#f59e0b",
        },
        {
          name: "Needs Attention",
          value: goals.filter((g) => getProgress(g) < 50).length,
          color: "#ef4444",
        },
      ].filter((d) => d.value > 0),

      savingsAdequacy: goals.slice(0, 5).map((g) => ({
        name: g.name.length > 20 ? `${g.name.substring(0, 20)}...` : g.name,
        target: g.targetAmount,
        current: goalCurrentSavings.get(g.id) || 0,
      })),

      goalDiversification: [
        {
          name: "Short (<2y)",
          value: goals.filter((g) => {
            const y =
              Number(g.targetDate - BigInt(Date.now() * 1000000)) /
              (365 * 24 * 60 * 60 * 1e9);
            return y < 2;
          }).length,
          color: "#3b82f6",
        },
        {
          name: "Medium (2-5y)",
          value: goals.filter((g) => {
            const y =
              Number(g.targetDate - BigInt(Date.now() * 1000000)) /
              (365 * 24 * 60 * 60 * 1e9);
            return y >= 2 && y < 5;
          }).length,
          color: "#10b981",
        },
        {
          name: "Long (5y+)",
          value: goals.filter((g) => {
            const y =
              Number(g.targetDate - BigInt(Date.now() * 1000000)) /
              (365 * 24 * 60 * 60 * 1e9);
            return y >= 5;
          }).length,
          color: "#8b5cf6",
        },
      ].filter((d) => d.value > 0),
    };
  }, [goals, goalCurrentSavings]);

  if (isLoading) return <GoalsSkeleton />;

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert
          variant="destructive"
          className="max-w-md"
          data-ocid="goals.error_state"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load goals. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Goals Card */}
      <Card
        data-ocid="goals.main.card"
        className="rounded-2xl shadow-sm border border-slate-100 bg-white"
      >
        <CardContent className="px-5 pb-5 pt-4">
          {goals.length === 0 ? (
            <div className="text-center py-12" data-ocid="goals.empty_state">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-base font-semibold mb-1 text-slate-700">
                No goals set yet
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Define your financial goals and track your progress
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow text-xs"
                data-ocid="goals.empty.add_button"
              >
                <Plus className="h-3.5 w-3.5" /> Set Your First Goal
              </Button>
            </div>
          ) : (
            <>
              {/* Summary Cards — 4 cards, 2 per row on mobile, 4 on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {/* Total Target */}
                <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-100 px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                      Total Target
                    </p>
                    <p className="text-lg font-extrabold text-emerald-600 tabular-nums truncate">
                      {formatCurrency(totalTargetAmount)}
                    </p>
                  </div>
                </div>

                {/* Current Savings */}
                <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-100 px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                    <PieChart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wide">
                      Current Savings
                    </p>
                    <p className="text-lg font-extrabold text-purple-600 tabular-nums truncate">
                      {formatCurrency(currentSavings)}
                    </p>
                  </div>
                </div>

                {/* Amount Required */}
                <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-100 px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <MinusCircle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                      Amount Required
                    </p>
                    <p className="text-lg font-extrabold text-amber-600 tabular-nums truncate">
                      {formatCurrency(amountRequired)}
                    </p>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-100 px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide">
                      Overall Progress
                    </p>
                    <p className="text-lg font-extrabold text-blue-600">
                      {overallProgress.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <GoalList goals={goals} allInvestments={allInvestments} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      {goals.length > 0 && (
        <Card
          data-ocid="goals.analytics.card"
          className="rounded-2xl shadow-sm border border-slate-100 bg-white"
        >
          <CardHeader
            className="pb-2 pt-4 px-5"
            style={{ borderLeft: "3px solid #6366f1" }}
          >
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Goals Analytics
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Achievement quality, savings adequacy, and diversification
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-xl border border-slate-100 shadow-sm">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
                    Savings Adequacy
                  </CardTitle>
                  <CardDescription className="text-[11px] text-slate-400">
                    Current vs target
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  {analyticsData.savingsAdequacy.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={analyticsData.savingsAdequacy}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 9 }}
                          angle={-15}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis
                          tick={{ fontSize: 9 }}
                          tickFormatter={(v) => formatCurrency(v)}
                        />
                        <Tooltip
                          formatter={(v: number) => formatCurrency(v)}
                          contentStyle={{
                            fontSize: "11px",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Bar
                          dataKey="target"
                          fill="#3b82f6"
                          name="Target"
                          radius={[3, 3, 0, 0]}
                        />
                        <Bar
                          dataKey="current"
                          fill="#10b981"
                          name="Current Value"
                          radius={[3, 3, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-slate-300 text-xs">
                      No data
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-slate-100 shadow-sm">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <PieChart className="h-3.5 w-3.5 text-emerald-500" />
                    Achievement Quality
                  </CardTitle>
                  <CardDescription className="text-[11px] text-slate-400">
                    By progress status
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  {analyticsData.achievementQuality.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <RechartsPieChart>
                        <Pie
                          data={analyticsData.achievementQuality}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => {
                            const total =
                              analyticsData.achievementQuality.reduce(
                                (s, d) => s + d.value,
                                0,
                              );
                            return `${((entry.value / total) * 100).toFixed(0)}%`;
                          }}
                          innerRadius={40}
                          outerRadius={75}
                          dataKey="value"
                        >
                          {analyticsData.achievementQuality.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: "11px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-slate-300 text-xs">
                      No data
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-xl border border-slate-100 shadow-sm">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Target className="h-3.5 w-3.5 text-purple-500" />
                    Goal Diversification
                  </CardTitle>
                  <CardDescription className="text-[11px] text-slate-400">
                    By time horizon
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  {analyticsData.goalDiversification.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <RechartsPieChart>
                        <Pie
                          data={analyticsData.goalDiversification}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => {
                            const total =
                              analyticsData.goalDiversification.reduce(
                                (s, d) => s + d.value,
                                0,
                              );
                            return `${((entry.value / total) * 100).toFixed(0)}%`;
                          }}
                          innerRadius={40}
                          outerRadius={75}
                          dataKey="value"
                        >
                          {analyticsData.goalDiversification.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: "11px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[220px] flex items-center justify-center text-slate-300 text-xs">
                      No data
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      <AddGoalDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}

function GoalsSkeleton() {
  return (
    <Card
      data-ocid="goals.loading_state"
      className="rounded-2xl shadow-sm border border-slate-100 bg-white"
    >
      <CardContent className="px-5 pb-5 pt-4">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
