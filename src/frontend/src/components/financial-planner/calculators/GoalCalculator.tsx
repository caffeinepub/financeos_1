import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const BAR_COLORS = ["#6366f1", "#10b981", "#f59e0b"];

export function GoalCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [goalAmount, setGoalAmount] = useState("1000000");
  const [targetYears, setTargetYears] = useState("5");
  const [currentSavings, setCurrentSavings] = useState("100000");
  const [expectedReturn, setExpectedReturn] = useState("12");

  const result = useMemo(() => {
    const G = Number.parseFloat(goalAmount) || 0;
    const n = Number.parseFloat(targetYears) || 1;
    const CS = Number.parseFloat(currentSavings) || 0;
    const r = (Number.parseFloat(expectedReturn) || 12) / 100;
    const rm = r / 12;
    const months = n * 12;
    const futureValueOfSavings = CS * (1 + r) ** n;
    const remaining = Math.max(G - futureValueOfSavings, 0);
    const monthlySIP =
      rm > 0 ? (remaining * rm) / ((1 + rm) ** months - 1) : remaining / months;
    const lumpsumNeeded = G / (1 + r) ** n;
    return { monthlySIP, lumpsumNeeded, futureValueOfSavings };
  }, [goalAmount, targetYears, currentSavings, expectedReturn]);

  const chartData = [
    { name: "Goal Amount", value: Number.parseFloat(goalAmount) || 0 },
    { name: "Savings FV", value: Math.round(result.futureValueOfSavings) },
    { name: "Lumpsum Today", value: Math.round(result.lumpsumNeeded) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Goal Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Goal Amount ({sym})</Label>
            <Input
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              type="number"
              data-ocid="goal.amount.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Target Years</Label>
            <Input
              value={targetYears}
              onChange={(e) => setTargetYears(e.target.value)}
              type="number"
              data-ocid="goal.years.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Current Savings ({sym})</Label>
            <Input
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              type="number"
              data-ocid="goal.savings.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Expected Return (% p.a.)</Label>
            <Input
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              type="number"
              data-ocid="goal.return.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Current Savings Future Value
            </span>
            <span className="font-semibold">
              {fmt(result.futureValueOfSavings)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Lumpsum Needed Today
            </span>
            <span className="font-semibold text-blue-600">
              {fmt(result.lumpsumNeeded)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Monthly SIP Needed</span>
            <span className="font-bold text-lg text-emerald-600">
              {fmt(result.monthlySIP)}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Goal Overview
            </p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`}
                  width={45}
                />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={BAR_COLORS[chartData.indexOf(entry)]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
