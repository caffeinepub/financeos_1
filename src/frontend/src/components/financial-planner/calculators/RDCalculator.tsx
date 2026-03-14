import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

export function RDCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("7");
  const [tenure, setTenure] = useState("24");

  const result = useMemo(() => {
    const P = Number.parseFloat(monthly) || 0;
    const r = (Number.parseFloat(rate) || 0) / 100 / 4;
    const n = Number.parseFloat(tenure) || 0;
    let maturity = 0;
    for (let i = 1; i <= n; i++) {
      maturity += P * (1 + r) ** ((n - i + 1) * (1 / 3));
    }
    const totalDeposited = P * n;
    return { maturity, interest: maturity - totalDeposited, totalDeposited };
  }, [monthly, rate, tenure]);

  const chartData = [
    {
      name: "Summary",
      "Total Deposited": Math.round(result.totalDeposited),
      "Interest Earned": Math.round(result.interest),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">RD Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Monthly Deposit (₹)</Label>
            <Input
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              type="number"
              data-ocid="rd.monthly.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="rd.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Tenure (Months)</Label>
            <Input
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              type="number"
              data-ocid="rd.tenure.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30 border-lime-200 dark:border-lime-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Deposited
            </span>
            <span className="font-semibold">{fmt(result.totalDeposited)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Interest Earned
            </span>
            <span className="font-semibold text-green-600">
              {fmt(result.interest)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Maturity Amount</span>
            <span className="font-bold text-2xl text-lime-600">
              {fmt(result.maturity)}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Breakdown
            </p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  width={45}
                />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend iconType="circle" iconSize={8} />
                <Bar
                  dataKey="Total Deposited"
                  fill="#06b6d4"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="Interest Earned"
                  fill="#10b981"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
