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
  LabelList,
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
  viewMode?: "table" | "card";
  onViewModeChange?: (mode: "table" | "card") => void;
}

export function GoalsTab({
  externalAddOpen,
  onExternalAddOpenChange,
  viewMode,
  onViewModeChange,
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
          goalNames: goals
            .filter((g) => getProgress(g) >= 100)
            .map((g) => g.name),
        },
        {
          name: "On Track",
          value: goals.filter(
            (g) => getProgress(g) >= 75 && getProgress(g) < 100,
          ).length,
          color: "#3b82f6",
          goalNames: goals
            .filter((g) => getProgress(g) >= 75 && getProgress(g) < 100)
            .map((g) => g.name),
        },
        {
          name: "Behind",
          value: goals.filter(
            (g) => getProgress(g) >= 50 && getProgress(g) < 75,
          ).length,
          color: "#f59e0b",
          goalNames: goals
            .filter((g) => getProgress(g) >= 50 && getProgress(g) < 75)
            .map((g) => g.name),
        },
        {
          name: "Need Attention",
          value: goals.filter((g) => getProgress(g) < 50).length,
          color: "#ef4444",
          goalNames: goals
            .filter((g) => getProgress(g) < 50)
            .map((g) => g.name),
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
          goalNames: goals
            .filter((g) => {
              const y =
                Number(g.targetDate - BigInt(Date.now() * 1000000)) /
                (365 * 24 * 60 * 60 * 1e9);
              return y < 2;
            })
            .map((g) => g.name),
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
          goalNames: goals
            .filter((g) => {
              const y =
                Number(g.targetDate - BigInt(Date.now() * 1000000)) /
                (365 * 24 * 60 * 60 * 1e9);
              return y >= 2 && y < 5;
            })
            .map((g) => g.name),
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
          goalNames: goals
            .filter((g) => {
              const y =
                Number(g.targetDate - BigInt(Date.now() * 1000000)) /
                (365 * 24 * 60 * 60 * 1e9);
              return y >= 5;
            })
            .map((g) => g.name),
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
      {/* Goals Content - no outer card wrapper */}
      <div data-ocid="goals.main.card" className="space-y-4">
        <div>
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
              {/* Summary Cards — Budget Insights style, 2 per row on mobile, 4 on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {/* Total Target */}
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Total Target
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums truncate">
                    {formatCurrency(totalTargetAmount)}
                  </p>
                </div>

                {/* Current Savings */}
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-violet-500 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <PieChart className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Current Savings
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums truncate">
                    {formatCurrency(currentSavings)}
                  </p>
                </div>

                {/* Amount Required */}
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-amber-500 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MinusCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Amount Required
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums truncate">
                    {formatCurrency(amountRequired)}
                  </p>
                </div>

                {/* Overall Progress */}
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-500 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Overall Progress
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {overallProgress.toFixed(1)}%
                  </p>
                </div>
              </div>

              <GoalList
                goals={goals}
                allInvestments={allInvestments}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Analytics Section */}
      {goals.length > 0 && (
        <div data-ocid="goals.analytics.card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-700">
              Goals Analytics
            </h3>
          </div>
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
                      >
                        <LabelList
                          dataKey="target"
                          position="top"
                          formatter={(v: number) => formatCurrency(v)}
                          style={{
                            fontSize: "9px",
                            fill: "#3b82f6",
                            fontWeight: 600,
                          }}
                        />
                      </Bar>
                      <Bar
                        dataKey="current"
                        fill="#10b981"
                        name="Current Value"
                        radius={[3, 3, 0, 0]}
                      >
                        <LabelList
                          dataKey="current"
                          position="top"
                          formatter={(v: number) => formatCurrency(v)}
                          style={{
                            fontSize: "9px",
                            fill: "#10b981",
                            fontWeight: 600,
                          }}
                        />
                      </Bar>
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
                  <div className="flex items-center gap-2 overflow-visible">
                    <div
                      className="flex-shrink-0 overflow-visible"
                      style={{ width: 150, height: 150 }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart
                          margin={{ top: 0, right: 0, bottom: 0, left: 4 }}
                        >
                          <Pie
                            data={analyticsData.achievementQuality}
                            cx="50%"
                            cy="50%"
                            innerRadius={44}
                            outerRadius={68}
                            dataKey="value"
                            labelLine={false}
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
                          <Tooltip
                            content={({
                              active,
                              payload,
                            }: {
                              active?: boolean;
                              payload?: Array<{
                                payload?: {
                                  name?: string;
                                  value?: number;
                                  color?: string;
                                  goalNames?: string[];
                                };
                              }>;
                            }) => {
                              if (!active || !payload?.[0]) return null;
                              const entry = payload[0].payload;
                              if (!entry) return null;
                              return (
                                <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-lg text-xs max-w-[200px]">
                                  <p
                                    className="font-semibold text-slate-700 mb-1"
                                    style={{ color: entry.color }}
                                  >
                                    {entry.name}: {entry.value} goal
                                    {(entry.value ?? 0) !== 1 ? "s" : ""}
                                  </p>
                                  {entry.goalNames?.map((n: string) => (
                                    <p key={n} className="text-slate-500">
                                      • {n}
                                    </p>
                                  ))}
                                </div>
                              );
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      {analyticsData.achievementQuality.map((entry) => (
                        <div
                          key={entry.name}
                          className="flex items-center gap-1"
                        >
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: entry.color }}
                          />
                          <span className="text-[10px] text-slate-600 truncate flex-1 min-w-0">
                            {entry.name}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-700 flex-shrink-0 ml-1">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  <div className="flex items-center gap-2 overflow-visible">
                    <div
                      className="flex-shrink-0 overflow-visible"
                      style={{ width: 150, height: 150 }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart
                          margin={{ top: 0, right: 0, bottom: 0, left: 4 }}
                        >
                          <Pie
                            data={analyticsData.goalDiversification}
                            cx="50%"
                            cy="50%"
                            innerRadius={44}
                            outerRadius={68}
                            dataKey="value"
                            labelLine={false}
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
                          <Tooltip
                            content={({
                              active,
                              payload,
                            }: {
                              active?: boolean;
                              payload?: Array<{
                                payload?: {
                                  name?: string;
                                  value?: number;
                                  color?: string;
                                  goalNames?: string[];
                                };
                              }>;
                            }) => {
                              if (!active || !payload?.[0]) return null;
                              const entry = payload[0].payload;
                              if (!entry) return null;
                              return (
                                <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-lg text-xs max-w-[200px]">
                                  <p
                                    className="font-semibold text-slate-700 mb-1"
                                    style={{ color: entry.color }}
                                  >
                                    {entry.name}: {entry.value} goal
                                    {(entry.value ?? 0) !== 1 ? "s" : ""}
                                  </p>
                                  {entry.goalNames?.map((n: string) => (
                                    <p key={n} className="text-slate-500">
                                      • {n}
                                    </p>
                                  ))}
                                </div>
                              );
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      {analyticsData.goalDiversification.map((entry) => (
                        <div
                          key={entry.name}
                          className="flex items-center gap-1"
                        >
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: entry.color }}
                          />
                          <span className="text-[10px] text-slate-600 truncate flex-1 min-w-0">
                            {entry.name}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-700 flex-shrink-0 ml-1">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-slate-300 text-xs">
                    No data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
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
