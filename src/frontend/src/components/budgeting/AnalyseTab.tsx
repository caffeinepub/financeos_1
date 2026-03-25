import { useEffect, useMemo, useState } from "react";
import {
  type BudgetCategory,
  type Transaction,
  TransactionType,
} from "../../backend.d";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useActor } from "../../hooks/useActor";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function AnalyseTab() {
  const { actor } = useActor();
  const { country } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [filterMonth] = useState<number>(now.getMonth());
  const [filterYear] = useState<number>(now.getFullYear());

  function fmt(n: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: country.code,
      maximumFractionDigits: 0,
    }).format(n);
  }

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    Promise.all([actor.getAllTransactions(), actor.getAllBudgetCategories()])
      .then(([txns, cats]) => {
        setTransactions([...txns]);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, [actor]);

  const analysis = useMemo(() => {
    // Filter to current month
    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    });

    const income = filtered
      .filter((t) => t.transactionType === TransactionType.Income)
      .reduce((s, t) => s + t.amount, 0);

    const expenses = filtered
      .filter((t) => t.transactionType === TransactionType.Expense)
      .reduce((s, t) => s + t.amount, 0);

    const savings = Math.max(0, income - expenses);
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // 50/30/20 targets
    const needs50 = income * 0.5;
    const wants30 = income * 0.3;
    const savings20 = income * 0.2;

    // Category breakdown for expenses
    const catMap: Record<string, number> = {};
    for (const t of filtered.filter(
      (tx) => tx.transactionType === TransactionType.Expense,
    )) {
      const cat = categories.find((c) => c.id === t.categoryId);
      const name = cat?.name ?? "Uncategorized";
      catMap[name] = (catMap[name] ?? 0) + t.amount;
    }
    const top3 = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Quick win
    let quickWin =
      "Start tracking your expenses daily to identify spending patterns.";
    if (savingsRate < 10) {
      quickWin = `Your savings rate is ${savingsRate.toFixed(1)}% — try to move to 20%. Cut one discretionary spend today.`;
    } else if (top3[0]?.[1] > income * 0.25) {
      quickWin = `"${top3[0][0]}" is consuming ${((top3[0][1] / income) * 100).toFixed(0)}% of income. Review and reduce by 10% next month.`;
    } else if (savingsRate >= 20) {
      quickWin = `Great! You saved ${savingsRate.toFixed(1)}% this month. Invest the surplus in a SIP to beat inflation.`;
    }

    return {
      income,
      expenses,
      savings,
      savingsRate,
      needs50,
      wants30,
      savings20,
      top3,
      quickWin,
    };
  }, [transactions, categories, filterMonth, filterYear]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) return <Skeleton className="h-64 rounded-2xl" />;

  const {
    income,
    expenses,
    savings,
    savingsRate,
    needs50,
    wants30,
    savings20,
    top3,
    quickWin,
  } = analysis;

  function RatioBar({
    actual,
    target,
    color,
  }: { actual: number; target: number; color: string }) {
    const pct = target > 0 ? Math.min((actual / target) * 100, 150) : 0;
    const over = actual > target;
    return (
      <div className="mt-1">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(pct, 100)}%`,
              background: over ? "#ef4444" : color,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
          <span>Actual: {fmt(actual)}</span>
          <span>Target: {fmt(target)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}
        >
          <span className="text-white text-sm">📊</span>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Budget Analysis
          </h2>
          <p className="text-xs text-slate-400">
            {monthNames[filterMonth]} {filterYear}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
          <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide">
            Actual Income
          </p>
          <p className="text-lg font-bold text-emerald-700 mt-0.5">
            {fmt(income)}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-[10px] text-red-600 font-medium uppercase tracking-wide">
            Total Expenses
          </p>
          <p className="text-lg font-bold text-red-700 mt-0.5">
            {fmt(expenses)}
          </p>
        </div>
        <div
          className={`${savings >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"} rounded-xl p-3 border`}
        >
          <p
            className={`text-[10px] font-medium uppercase tracking-wide ${savings >= 0 ? "text-blue-600" : "text-orange-600"}`}
          >
            Net Savings
          </p>
          <p
            className={`text-lg font-bold mt-0.5 ${savings >= 0 ? "text-blue-700" : "text-orange-700"}`}
          >
            {fmt(savings)}
          </p>
        </div>
        <div
          className={`${savingsRate >= 20 ? "bg-violet-50 border-violet-100" : savingsRate >= 10 ? "bg-amber-50 border-amber-100" : "bg-rose-50 border-rose-100"} rounded-xl p-3 border`}
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Savings Rate
          </p>
          <p
            className={`text-lg font-bold mt-0.5 ${savingsRate >= 20 ? "text-violet-700" : savingsRate >= 10 ? "text-amber-700" : "text-rose-700"}`}
          >
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-[9px] text-slate-400">Target: 20%</p>
        </div>
      </div>

      {/* 50/30/20 Analysis */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            📐 50/30/20 Budget Rule Analysis
            <Badge className="text-[9px] bg-violet-50 text-violet-700 border border-violet-200">
              Based on {monthNames[filterMonth]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-4">
          {income === 0 && (
            <p className="text-sm text-slate-400">
              No income recorded for this month. Add income transactions to see
              the analysis.
            </p>
          )}
          {income > 0 && (
            <>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">
                    🏠 Needs (50% — fixed costs)
                  </span>
                  {expenses > needs50 && (
                    <Badge className="text-[9px] bg-red-50 text-red-600 border border-red-200">
                      Over budget
                    </Badge>
                  )}
                  {expenses <= needs50 && (
                    <Badge className="text-[9px] bg-green-50 text-green-600 border border-green-200">
                      On track
                    </Badge>
                  )}
                </div>
                <RatioBar
                  actual={Math.min(expenses, needs50)}
                  target={needs50}
                  color="#6366f1"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Rent, groceries, utilities, EMIs — essentials only
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">
                    🎭 Wants (30% — discretionary)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Target: {fmt(wants30)}
                  </span>
                </div>
                <RatioBar
                  actual={Math.max(0, expenses - needs50)}
                  target={wants30}
                  color="#f59e0b"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Dining, entertainment, subscriptions, travel
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">
                    💰 Savings (20% — goals)
                  </span>
                  {savings >= savings20 ? (
                    <Badge className="text-[9px] bg-green-50 text-green-600 border border-green-200">
                      ✓ Achieved
                    </Badge>
                  ) : (
                    <Badge className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200">
                      Below target
                    </Badge>
                  )}
                </div>
                <RatioBar actual={savings} target={savings20} color="#10b981" />
                <p className="text-[10px] text-slate-400 mt-1">
                  Emergency fund, SIPs, retirement — pay yourself first
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Monthly Budget Table */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">
            📋 Monthly Budget Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-white uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-white uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-white uppercase tracking-wide">
                    % of Income
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-emerald-50/60">
                  <td className="px-4 py-2.5 text-xs font-bold text-emerald-700">
                    ✅ Total Income
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right font-bold text-emerald-700 tabular-nums">
                    {fmt(income)}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right font-bold text-emerald-700">
                    100%
                  </td>
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                    Fixed Costs (Needs)
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right tabular-nums text-slate-700">
                    {fmt(needs50)}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right text-slate-500">
                    50%
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-xs font-semibold text-slate-600">
                    Variable Costs (Wants)
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right tabular-nums text-slate-700">
                    {fmt(wants30)}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right text-slate-500">
                    30%
                  </td>
                </tr>
                <tr className="bg-blue-50/60">
                  <td className="px-4 py-2.5 text-xs font-bold text-blue-700">
                    💰 Savings Target
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right font-bold text-blue-700 tabular-nums">
                    {fmt(savings20)}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-right font-bold text-blue-700">
                    20%
                  </td>
                </tr>
                <tr
                  className={
                    savings >= savings20 ? "bg-green-50/80" : "bg-amber-50/80"
                  }
                >
                  <td className="px-4 py-2.5 text-xs font-bold text-slate-700">
                    Actual Savings
                  </td>
                  <td
                    className={`px-4 py-2.5 text-xs text-right font-bold tabular-nums ${savings >= savings20 ? "text-green-700" : "text-amber-700"}`}
                  >
                    {fmt(savings)}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-xs text-right font-bold ${savings >= savings20 ? "text-green-700" : "text-amber-700"}`}
                  >
                    {income > 0 ? savingsRate.toFixed(1) : "0"}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Expense Categories */}
      {top3.length > 0 && (
        <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700">
              🔍 Top Spending Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {top3.map(([name, amount], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-700 truncate">
                      {name}
                    </span>
                    <span className="text-xs font-bold text-slate-800 tabular-nums ml-2">
                      {fmt(amount)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:
                          income > 0
                            ? `${Math.min((amount / income) * 100, 100)}%`
                            : "0%",
                        background:
                          i === 0 ? "#ef4444" : i === 1 ? "#f97316" : "#f59e0b",
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    {income > 0 ? ((amount / income) * 100).toFixed(1) : "0"}%
                    of income
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Win */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚡</span>
          <div>
            <p className="text-sm font-bold text-violet-800">
              Quick Win for Today
            </p>
            <p className="text-xs text-violet-700 mt-1 leading-relaxed">
              {quickWin}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
