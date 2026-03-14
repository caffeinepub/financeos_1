import {
  ArrowLeftRight,
  CreditCard,
  DollarSign,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DashboardSummary } from "../backend.d";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useActor } from "../hooks/useActor";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function DashboardPage() {
  const { actor } = useActor();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [netWorth, setNetWorth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    Promise.all([actor.getDashboardSummary(), actor.getNetWorth()])
      .then(([s, nw]) => {
        setSummary(s);
        setNetWorth(nw);
      })
      .finally(() => setLoading(false));
  }, [actor]);

  return (
    <div data-ocid="dashboard.page" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Your financial overview</p>
      </div>

      {/* Net Worth */}
      <Card
        className="border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white"
        data-ocid="dashboard.networth.card"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-300 text-sm">Net Worth</span>
          </div>
          {loading ? (
            <Skeleton className="h-10 w-48 bg-slate-700" />
          ) : (
            <div className="text-4xl font-bold">{fmt(netWorth ?? 0)}</div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Goals",
            icon: Target,
            value: loading ? null : Number(summary?.goalCount ?? 0),
            path: "/goals",
            color: "text-blue-600",
          },
          {
            label: "Portfolio Holdings",
            icon: TrendingUp,
            value: loading ? null : Number(summary?.portfolioCount ?? 0),
            path: "/portfolio",
            color: "text-emerald-600",
          },
          {
            label: "Transactions",
            icon: ArrowLeftRight,
            value: loading ? null : Number(summary?.transactionCount ?? 0),
            path: "/transactions",
            color: "text-violet-600",
          },
          {
            label: "Active Loans",
            icon: CreditCard,
            value: loading ? null : Number(summary?.loanCount ?? 0),
            path: "/loans",
            color: "text-orange-600",
          },
        ].map((stat) => (
          <Link
            to={stat.path}
            key={stat.label}
            data-ocid={`dashboard.${stat.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.card`}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-sm">{stat.label}</span>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                {stat.value === null ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Income / Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card data-ocid="dashboard.income.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600">
                {fmt(summary?.totalIncome ?? 0)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card data-ocid="dashboard.expenses.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" /> Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {fmt(summary?.totalExpenses ?? 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
