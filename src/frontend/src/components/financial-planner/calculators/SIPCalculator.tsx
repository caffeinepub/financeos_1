import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function SIPCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const P = Number.parseFloat(monthly) || 0;
    const r = (Number.parseFloat(rate) || 0) / 100 / 12;
    const n = (Number.parseFloat(years) || 0) * 12;
    if (r === 0) return { invested: P * n, returns: 0, total: P * n };
    const total = P * (((1 + r) ** n - 1) / r) * (1 + r);
    const invested = P * n;
    return { invested, returns: total - invested, total };
  }, [monthly, rate, years]);

  const chartData = [
    { name: "Invested", value: result.invested, color: "#6366f1" },
    { name: "Returns", value: result.returns, color: "#10b981" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SIP Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Monthly Investment (₹)</Label>
            <Input
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              type="number"
              placeholder="5000"
              data-ocid="sip.monthly.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Expected Return Rate (% p.a.)</Label>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              type="number"
              placeholder="12"
              data-ocid="sip.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Investment Period (Years)</Label>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              type="number"
              placeholder="10"
              data-ocid="sip.years.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Invested
            </span>
            <span className="font-semibold">{fmt(result.invested)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Estimated Returns
            </span>
            <span className="font-semibold text-green-600">
              {fmt(result.returns)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Total Value</span>
            <span className="font-bold text-lg text-blue-600">
              {fmt(result.total)}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
