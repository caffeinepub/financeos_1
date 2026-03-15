import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  BarChart,
  BarChart2,
  BookOpen,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function fmt(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function CompoundingSection() {
  const [principal, setPrincipal] = useState(100000);
  const [sip, setSip] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    return Array.from({ length: years + 1 }, (_, y) => {
      const n = y * 12;
      const r12 = rate / 100 / 12;
      const r8 = 8 / 100 / 12;
      const invested = principal + sip * n;
      const fv12 =
        r12 === 0
          ? invested
          : principal * (1 + r12) ** n + sip * (((1 + r12) ** n - 1) / r12);
      const fv8 =
        r8 === 0
          ? invested
          : principal * (1 + r8) ** n + sip * (((1 + r8) ** n - 1) / r8);
      return {
        year: y,
        Invested: Math.round(invested),
        [`@${rate}%`]: Math.round(fv12),
        "@8%": Math.round(fv8),
      };
    });
  }, [principal, sip, rate, years]);

  const final = data[data.length - 1];
  const wealthGained = final[`@${rate}%`] - final.Invested;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          1. Power of Compounding
        </CardTitle>
        <CardDescription className="text-xs">
          Einstein called it the 8th wonder. A small SIP grows into a fortune
          given enough time and consistent returns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Lump Sum (₹)</Label>
            <Input
              data-ocid="fundamentals.compounding.principal.input"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Monthly SIP (₹)</Label>
            <Input
              data-ocid="fundamentals.compounding.sip.input"
              type="number"
              value={sip}
              onChange={(e) => setSip(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Expected Return (%)</Label>
            <Input
              data-ocid="fundamentals.compounding.rate.input"
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="h-8 text-sm"
              min={1}
              max={30}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Years</Label>
            <Input
              data-ocid="fundamentals.compounding.years.input"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="h-8 text-sm"
              min={1}
              max={40}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground">Total Invested</div>
            <div className="font-bold text-sm">{fmt(final.Invested)}</div>
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <div className="text-xs text-muted-foreground">Final Value</div>
            <div className="font-bold text-sm text-primary">
              {fmt(final[`@${rate}%`])}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-success/10">
            <div className="text-xs text-muted-foreground">Wealth Gained</div>
            <div className="font-bold text-sm text-green-600">
              {fmt(wealthGained)}
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.4}
            />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10 }}
              label={{
                value: "Years",
                position: "insideBottomRight",
                offset: -4,
                fontSize: 10,
              }}
            />
            <YAxis
              tick={{ fontSize: 9 }}
              tickFormatter={(v) => fmt(v)}
              width={70}
            />
            <Tooltip
              formatter={(v: number) => fmt(v)}
              contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line
              type="monotone"
              dataKey="Invested"
              stroke="#94a3b8"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={`@${rate}%`}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="@8%"
              stroke="#10b981"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-xs">
          <span className="text-primary font-bold">Pro Tip:</span>
          <span className="text-muted-foreground">
            Starting 10 years earlier can double your final corpus. Time is your
            greatest asset.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Rule72Section() {
  const [rate, setRate] = useState(12);
  const doublingYears = (72 / rate).toFixed(1);
  const rateRows = [4, 6, 8, 10, 12, 15, 18];

  return (
    <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-900/10 dark:to-yellow-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          2. Rule of 72
        </CardTitle>
        <CardDescription className="text-xs">
          Divide 72 by your expected return rate to find how many years it takes
          to double your money.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-amber-100/50 dark:bg-amber-900/20">
          <div className="text-center">
            <div className="text-3xl font-black text-amber-600">72</div>
            <div className="text-xs text-muted-foreground">÷ Rate</div>
          </div>
          <div className="text-2xl font-bold text-muted-foreground">=</div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Your Rate (%)</Label>
            <Input
              data-ocid="fundamentals.rule72.rate.input"
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="h-8 text-sm"
              min={1}
              max={50}
            />
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-primary">
              {doublingYears}
            </div>
            <div className="text-xs text-muted-foreground">Years to Double</div>
          </div>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-2 text-xs font-semibold">
                  Return Rate
                </th>
                <th className="text-right p-2 text-xs font-semibold">
                  Years to Double
                </th>
                <th className="text-right p-2 text-xs font-semibold">
                  ₹1L → ₹2L by
                </th>
              </tr>
            </thead>
            <tbody>
              {rateRows.map((r) => (
                <tr
                  key={r}
                  className={`border-t border-border transition-colors ${r === rate ? "bg-primary/10 font-semibold" : "hover:bg-muted/30"}`}
                >
                  <td className="p-2 text-xs">
                    {r}%{" "}
                    {r === rate && (
                      <Badge variant="outline" className="ml-1 text-xs">
                        Selected
                      </Badge>
                    )}
                  </td>
                  <td className="p-2 text-xs text-right">
                    {(72 / r).toFixed(1)} yrs
                  </td>
                  <td className="p-2 text-xs text-right">
                    Age {30 + Math.round(72 / r)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 text-xs">
          <span className="text-amber-600 font-bold">Pro Tip:</span>
          <span className="text-muted-foreground">
            At 12% (typical equity return), your money doubles every 6 years —
            5x doubling in 30 years turns ₹1L into ₹32L.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function SipVsLumpSumSection() {
  const [amount, setAmount] = useState(1200000);
  const [rate, setRate] = useState(12);

  const data = useMemo(() => {
    return [5, 10, 15, 20].map((y) => {
      const n = y * 12;
      const r = rate / 100 / 12;
      const monthlyAmt = amount / (y * 12);
      const lumpFV = r === 0 ? amount : amount * (1 + r) ** n;
      const sipFV = r === 0 ? amount : monthlyAmt * (((1 + r) ** n - 1) / r);
      return {
        year: `${y}yr`,
        "Lump Sum": Math.round(lumpFV),
        SIP: Math.round(sipFV),
      };
    });
  }, [amount, rate]);

  return (
    <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
            <BarChart2 className="h-4 w-4 text-green-600" />
          </div>
          3. SIP vs Lump Sum
        </CardTitle>
        <CardDescription className="text-xs">
          Compare investing a fixed amount all at once versus spreading it as
          monthly SIPs over the same period.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Total Amount (₹)</Label>
            <Input
              data-ocid="fundamentals.sip.amount.input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Annual Return (%)</Label>
            <Input
              data-ocid="fundamentals.sip.rate.input"
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="h-8 text-sm"
              min={1}
              max={30}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <RechartsBarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.4}
            />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 9 }}
              tickFormatter={(v) => fmt(v)}
              width={70}
            />
            <Tooltip
              formatter={(v: number) => fmt(v)}
              contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="Lump Sum" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="SIP" fill="#10b981" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-100/50 dark:bg-green-900/20 text-xs">
          <span className="text-green-600 font-bold">Pro Tip:</span>
          <span className="text-muted-foreground">
            Lump sum wins in rising markets; SIP wins in volatile markets by
            averaging out purchase cost (Rupee Cost Averaging).
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function InflationSection() {
  const [expense, setExpense] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    return Array.from({ length: years + 1 }, (_, y) => ({
      year: y,
      "Future Value": Math.round(expense * (1 + inflation / 100) ** y),
      "Real Value (Today's ₹)": Math.round(expense),
    }));
  }, [expense, inflation, years]);

  const futureExpense = expense * (1 + inflation / 100) ** years;
  const erosion = ((1 - expense / futureExpense) * 100).toFixed(0);

  return (
    <Card className="border-red-200/50 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30">
            <Activity className="h-4 w-4 text-red-600" />
          </div>
          4. Inflation Impact
        </CardTitle>
        <CardDescription className="text-xs">
          Inflation silently erodes purchasing power. Your investments must beat
          inflation to grow in real terms.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Monthly Expense (₹)</Label>
            <Input
              data-ocid="fundamentals.inflation.expense.input"
              type="number"
              value={expense}
              onChange={(e) => setExpense(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Inflation Rate (%)</Label>
            <Input
              data-ocid="fundamentals.inflation.rate.input"
              type="number"
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="h-8 text-sm"
              min={1}
              max={20}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Years</Label>
            <Input
              data-ocid="fundamentals.inflation.years.input"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="h-8 text-sm"
              min={1}
              max={40}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-red-100/50 dark:bg-red-900/20 text-center">
            <div className="text-xs text-muted-foreground">
              Expense needed in {years} yrs
            </div>
            <div className="font-bold text-red-600">
              {fmt(futureExpense)}/mo
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground">
              Purchasing Power Lost
            </div>
            <div className="font-bold text-destructive">{erosion}%</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.4}
            />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
            <YAxis
              tick={{ fontSize: 9 }}
              tickFormatter={(v) => fmt(v)}
              width={70}
            />
            <Tooltip
              formatter={(v: number) => fmt(v)}
              contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line
              type="monotone"
              dataKey="Future Value"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Real Value (Today's ₹)"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-red-100/50 dark:bg-red-900/20 text-xs">
          <span className="text-red-600 font-bold">Pro Tip:</span>
          <span className="text-muted-foreground">
            India's average inflation is ~6%. Any investment returning less than
            6% is losing real value. Equity is the best long-term inflation
            hedge.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function CAGRSection() {
  const [initial, setInitial] = useState(100000);
  const [final, setFinal] = useState(500000);
  const [years, setYears] = useState(10);

  const cagr = (((final / initial) ** (1 / years) - 1) * 100).toFixed(2);

  const benchmarks = [
    { name: "Sensex (30yr avg)", cagr: 15, color: "#3b82f6" },
    { name: "Nifty 50 (20yr avg)", cagr: 14, color: "#6366f1" },
    { name: "Gold (20yr avg)", cagr: 11, color: "#f59e0b" },
    { name: "Real Estate (avg)", cagr: 9, color: "#10b981" },
    { name: "PPF / EPF", cagr: 7.1, color: "#22c55e" },
    { name: "Fixed Deposit", cagr: 7, color: "#64748b" },
    { name: "Savings Account", cagr: 3.5, color: "#94a3b8" },
  ];

  return (
    <Card className="border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <BarChart className="h-4 w-4 text-purple-600" />
          </div>
          5. CAGR Calculator & Benchmarks
        </CardTitle>
        <CardDescription className="text-xs">
          CAGR (Compound Annual Growth Rate) is the true measure of investment
          performance over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Initial Value (₹)</Label>
            <Input
              data-ocid="fundamentals.cagr.initial.input"
              type="number"
              value={initial}
              onChange={(e) => setInitial(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Final Value (₹)</Label>
            <Input
              data-ocid="fundamentals.cagr.final.input"
              type="number"
              value={final}
              onChange={(e) => setFinal(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Years</Label>
            <Input
              data-ocid="fundamentals.cagr.years.input"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="h-8 text-sm"
              min={1}
            />
          </div>
        </div>
        <div className="p-3 rounded-xl bg-purple-100/50 dark:bg-purple-900/20 text-center">
          <div className="text-xs text-muted-foreground mb-1">Your CAGR</div>
          <div className="text-4xl font-black text-purple-600">{cagr}%</div>
          <div className="text-xs text-muted-foreground mt-1">
            = ((Final / Initial)^(1/n) − 1) × 100
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            India Asset Class Benchmarks
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RechartsBarChart
              data={benchmarks}
              layout="vertical"
              margin={{ top: 4, right: 30, left: 0, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.4}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10 }}
                width={120}
              />
              <Tooltip
                formatter={(v: number) => `${v}% CAGR`}
                contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
              />
              <Bar dataKey="cagr" radius={[0, 4, 4, 0]}>
                {benchmarks.map((b) => (
                  <Cell key={b.name} fill={b.color} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-100/50 dark:bg-purple-900/20 text-xs">
          <span className="text-purple-600 font-bold">Pro Tip:</span>
          <span className="text-muted-foreground">
            Even a 2% CAGR difference compounds dramatically over 20+ years.
            Always compare net-of-fees, inflation-adjusted returns.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function MarketCyclesSection() {
  const phases = [
    {
      name: "Accumulation",
      color: "bg-blue-100 dark:bg-blue-900/30 border-blue-200",
      textColor: "text-blue-700",
      icon: "📥",
      desc: "Smart money quietly buys. Market sentiment is fearful. Valuations are low. Best time to invest.",
    },
    {
      name: "Bull Run",
      color: "bg-green-100 dark:bg-green-900/30 border-green-200",
      textColor: "text-green-700",
      icon: "🚀",
      desc: "Prices rise. Optimism grows. Retail investors enter. Media is euphoric. Stay invested.",
    },
    {
      name: "Distribution",
      color: "bg-amber-100 dark:bg-amber-900/30 border-amber-200",
      textColor: "text-amber-700",
      icon: "📤",
      desc: "Smart money sells to retail. Euphoria at peak. Valuations stretched. Start booking profits.",
    },
    {
      name: "Bear Market",
      color: "bg-red-100 dark:bg-red-900/30 border-red-200",
      textColor: "text-red-700",
      icon: "📉",
      desc: "Prices fall sharply. Panic selling. Media is fearful. Prepare cash for next accumulation phase.",
    },
  ];
  const facts = [
    { label: "Avg Bear Market Duration", value: "14 months" },
    { label: "Avg Bull Market Duration", value: "4.5 years" },
    { label: "Avg Nifty Drawdown", value: "~27% from peak" },
    { label: "₹1L in Nifty (2003→2023)", value: "₹20L+" },
    { label: "Corrections > 20% since 1990", value: "12 times" },
    { label: "Nifty recovered every time", value: "100%" },
  ];
  return (
    <Card className="border-indigo-200/50 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/10 dark:to-blue-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <Activity className="h-4 w-4 text-indigo-600" />
          </div>
          6. Market Cycles
        </CardTitle>
        <CardDescription className="text-xs">
          Markets move in cycles. Understanding them helps you stay calm in
          downturns and seize opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {phases.map((p) => (
            <div key={p.name} className={`p-3 rounded-lg border ${p.color}`}>
              <div className={`font-semibold text-sm mb-1 ${p.textColor}`}>
                {p.icon} {p.name}
              </div>
              <div className="text-xs text-muted-foreground">{p.desc}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-2 text-xs font-semibold">Fact</th>
                <th className="text-right p-2 text-xs font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {facts.map((f) => (
                <tr key={f.label} className="border-t border-border">
                  <td className="p-2 text-xs text-muted-foreground">
                    {f.label}
                  </td>
                  <td className="p-2 text-xs font-semibold text-right">
                    {f.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/20 text-xs">
          <span className="text-indigo-600 font-bold">Pro Tip:</span>
          <span className="text-muted-foreground">
            "Time in the market beats timing the market." Every major crash has
            been followed by new highs. Stay invested.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function PERatioSection() {
  const zones = [
    {
      range: "Below 15",
      label: "Undervalued",
      action: "Strong Buy",
      color: "bg-green-100 dark:bg-green-900/30 text-green-700",
      bar: "w-[40%] bg-green-500",
    },
    {
      range: "15 – 20",
      label: "Fair Value",
      action: "Hold / Accumulate",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700",
      bar: "w-[60%] bg-blue-500",
    },
    {
      range: "20 – 25",
      label: "Slightly Overvalued",
      action: "Selective Buying",
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700",
      bar: "w-[80%] bg-amber-500",
    },
    {
      range: "25+",
      label: "Overvalued",
      action: "Caution / Book Profits",
      color: "bg-red-100 dark:bg-red-900/30 text-red-700",
      bar: "w-full bg-red-500",
    },
  ];
  return (
    <Card className="border-teal-200/50 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-900/10 dark:to-cyan-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/30">
            <Target className="h-4 w-4 text-teal-600" />
          </div>
          7. P/E Ratio & Market Valuation
        </CardTitle>
        <CardDescription className="text-xs">
          The Price-to-Earnings (P/E) ratio tells you how much the market is
          paying for each ₹1 of earnings. It is the key valuation metric.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-xl bg-teal-100/50 dark:bg-teal-900/20 space-y-2">
          <div className="text-xs font-semibold">
            P/E = Market Price per Share ÷ Earnings per Share (EPS)
          </div>
          <div className="text-xs text-muted-foreground">
            A P/E of 20 means investors pay ₹20 for every ₹1 of profit. Higher
            P/E = more expensive market.
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Nifty 50 P/E (Mar 2026): ~22x
            </Badge>
            <Badge variant="outline" className="text-xs">
              Historical Avg: ~20x
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Nifty P/E Valuation Zones
          </div>
          {zones.map((z) => (
            <div key={z.range} className={`p-3 rounded-lg ${z.color}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">{z.range}</span>
                <div className="text-right">
                  <div className="text-xs font-semibold">{z.label}</div>
                  <div className="text-xs opacity-70">{z.action}</div>
                </div>
              </div>
              <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${z.bar}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-teal-100/50 dark:bg-teal-900/20 text-xs">
          <span className="text-teal-600 font-bold">Pro Tip:</span>
          <span className="text-muted-foreground">
            P/E is a guide, not a signal. The market can stay expensive for
            years. Combine P/E with earnings growth (PEG ratio) for a better
            picture.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DiversificationSection() {
  const assets = [
    { name: "100% Equity", return: 15, risk: 25, sharpe: 0.6 },
    { name: "80% Eq + 20% Debt", return: 13, risk: 19, sharpe: 0.68 },
    { name: "60% Eq + 40% Debt", return: 11, risk: 14, sharpe: 0.79 },
    { name: "50% Eq + 50% Debt", return: 10, risk: 12, sharpe: 0.83 },
    { name: "100% Debt", return: 7, risk: 5, sharpe: 1.4 },
  ];
  return (
    <Card className="border-pink-200/50 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-900/10 dark:to-rose-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30">
            <DollarSign className="h-4 w-4 text-pink-600" />
          </div>
          8. Diversification & Risk-Return
        </CardTitle>
        <CardDescription className="text-xs">
          Diversification reduces risk without proportionally reducing returns —
          the only free lunch in investing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-2 text-xs font-semibold">
                  Portfolio Mix
                </th>
                <th className="text-right p-2 text-xs font-semibold">Return</th>
                <th className="text-right p-2 text-xs font-semibold">
                  Risk (σ)
                </th>
                <th className="text-right p-2 text-xs font-semibold">Sharpe</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr
                  key={a.name}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <td className="p-2 text-xs">{a.name}</td>
                  <td className="p-2 text-xs text-right font-semibold text-green-600">
                    {a.return}%
                  </td>
                  <td className="p-2 text-xs text-right text-red-500">
                    {a.risk}%
                  </td>
                  <td className="p-2 text-xs text-right">{a.sharpe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-pink-100/50 dark:bg-pink-900/20">
            <div className="text-xs text-muted-foreground">Golden Rule</div>
            <div className="font-bold text-sm text-pink-600">
              Don't put all eggs in one basket
            </div>
          </div>
          <div className="p-2 rounded-lg bg-pink-100/50 dark:bg-pink-900/20">
            <div className="text-xs text-muted-foreground">MPT Insight</div>
            <div className="font-bold text-sm text-pink-600">
              Negatively correlated assets reduce portfolio volatility
            </div>
          </div>
          <div className="p-2 rounded-lg bg-pink-100/50 dark:bg-pink-900/20">
            <div className="text-xs text-muted-foreground">Rebalance</div>
            <div className="font-bold text-sm text-pink-600">
              Review allocation annually or after ±5% drift
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-pink-100/50 dark:bg-pink-900/20 text-xs">
          <span className="text-pink-600 font-bold">Pro Tip:</span>
          <span className="text-muted-foreground">
            A 60/40 equity-debt portfolio has historically delivered 80% of
            equity returns at 50% of the risk. Rebalance annually.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ModelFundamentalsTab() {
  return (
    <div className="space-y-6">
      <Card className="shadow-premium-lg border-border/50 bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            Investment Fundamentals
          </CardTitle>
          <CardDescription className="text-base">
            Master 8 core concepts that every successful investor must
            understand — with interactive calculators and real data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompoundingSection />
            <Rule72Section />
            <SipVsLumpSumSection />
            <InflationSection />
            <CAGRSection />
            <MarketCyclesSection />
            <PERatioSection />
            <DiversificationSection />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
