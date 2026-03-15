import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  BarChart3,
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

export function GoalsTab() {
  const { data: goals = [], isLoading, isError } = useGetAllGoals();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { formatCurrency } = useCurrency();

  // Fetch all investments to calculate current savings
  const { data: retirals = [] } = useGetAllRetirals();
  const { data: equityStocks = [] } = useGetAllETFStocks();
  const { data: mutualFunds = [] } = useGetAllMutualFunds();
  const { data: cryptos = [] } = useGetAllCryptos();
  const { data: fds = [] } = useGetAllFDs();
  const { data: commodities = [] } = useGetAllCommodities();
  const { data: realEstates = [] } = useGetAllRealEstates();
  const { data: otherInvestments = [] } = useGetAllOtherInvestments();

  // All investments combined for lookup
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

  // Calculate current savings from linked investments for each goal
  const goalCurrentSavings = useMemo(() => {
    const savingsMap = new Map<string, number>();
    for (const goal of goals) {
      let goalSavings = 0;
      for (const invId of goal.linkedInvestments) {
        const inv = allInvestments.find((i) => i.id === invId);
        if (inv) goalSavings += inv.currentValue;
      }
      savingsMap.set(goal.id, goalSavings);
    }
    return savingsMap;
  }, [goals, allInvestments]);

  // Calculate total current savings
  const currentSavings = useMemo(() => {
    return Array.from(goalCurrentSavings.values()).reduce(
      (acc, v) => acc + v,
      0,
    );
  }, [goalCurrentSavings]);

  // Calculate weighted average progress
  const avgProgress = useMemo(() => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, g) => {
      const savings = goalCurrentSavings.get(g.id) || 0;
      const pct = g.targetAmount > 0 ? (savings / g.targetAmount) * 100 : 0;
      return sum + pct;
    }, 0);
    return totalProgress / goals.length;
  }, [goals, goalCurrentSavings]);

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  // AI Analytics Data
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
          name: "Short-term (<2y)",
          value: goals.filter((g) => {
            const yearsLeft =
              Number(g.targetDate - BigInt(Date.now() * 1000000)) /
              (365 * 24 * 60 * 60 * 1e9);
            return yearsLeft < 2;
          }).length,
          color: "#3b82f6",
        },
        {
          name: "Medium-term (2-5y)",
          value: goals.filter((g) => {
            const yearsLeft =
              Number(g.targetDate - BigInt(Date.now() * 1000000)) /
              (365 * 24 * 60 * 60 * 1e9);
            return yearsLeft >= 2 && yearsLeft < 5;
          }).length,
          color: "#10b981",
        },
        {
          name: "Long-term (5y+)",
          value: goals.filter((g) => {
            const yearsLeft =
              Number(g.targetDate - BigInt(Date.now() * 1000000)) /
              (365 * 24 * 60 * 60 * 1e9);
            return yearsLeft >= 5;
          }).length,
          color: "#8b5cf6",
        },
      ].filter((d) => d.value > 0),
    };
  }, [goals, goalCurrentSavings]);

  if (isLoading) {
    return <GoalsSkeleton />;
  }

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
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Financial Goals
                </span>
              </CardTitle>
              <CardDescription>
                Track your progress toward achieving your financial objectives
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600">
                  Advise
                </div>
                <div className="text-xs text-gray-600">
                  Investment recommendations
                </div>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                data-ocid="goals.add_button"
              >
                <Plus className="h-4 w-4" />
                Add Goal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-12" data-ocid="goals.empty_state">
              <Target className="h-16 w-16 mx-auto mb-4 text-green-400 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No goals set yet</h3>
              <p className="text-gray-600 mb-4">
                Define your financial goals and track your progress
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                data-ocid="goals.empty.add_button"
              >
                <Plus className="h-4 w-4" />
                Set Your First Goal
              </Button>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="shadow-sm border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-900">
                      Total Target
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalTargetAmount)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Combined goal amount
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-purple-900">
                      Current Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(currentSavings)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      From linked investments
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border-blue-200/50 bg-gradient-to-br from-blue-50 to-cyan-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-blue-900">
                      Average Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {avgProgress.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across {goals.length} goals
                    </p>
                  </CardContent>
                </Card>
              </div>

              <ScrollArea className="w-full">
                <GoalList goals={goals} />
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>

      {/* AI Analytics Section */}
      {goals.length > 0 && (
        <Card className="shadow-sm border-gray-200/50 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Goals Analytics
              </span>
            </CardTitle>
            <CardDescription>
              Industry-standard analysis of your goal achievement quality,
              savings adequacy, and diversification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Savings Adequacy */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Savings Adequacy
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Current vs target amounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.savingsAdequacy.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analyticsData.savingsAdequacy}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          tickFormatter={(v) => formatCurrency(v)}
                        />
                        <Tooltip
                          formatter={(v: number) => formatCurrency(v)}
                          contentStyle={{
                            fontSize: "11px",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar
                          dataKey="target"
                          fill="#3b82f6"
                          name="Target"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="current"
                          fill="#10b981"
                          name="Current"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Goal Achievement Quality */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <PieChart className="h-4 w-4 text-primary" />
                    Achievement Quality
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Distribution by progress status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.achievementQuality.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
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
                            return `${entry.name}: ${((entry.value / total) * 100).toFixed(0)}%`;
                          }}
                          outerRadius={80}
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
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Goal Diversification */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-4 w-4 text-primary" />
                    Goal Diversification
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Distribution by time horizon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.goalDiversification.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
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
                            return `${entry.name}: ${((entry.value / total) * 100).toFixed(0)}%`;
                          }}
                          outerRadius={80}
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
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                      No data available
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
    <Card data-ocid="goals.loading_state">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
