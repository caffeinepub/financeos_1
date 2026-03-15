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

const BAR_COLORS = ["#f97316", "#ef4444"];

export function FIRECalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [currentAge, setCurrentAge] = useState("28");
  const [fireAge, setFireAge] = useState("45");
  const [annualExpenses, setAnnualExpenses] = useState("600000");
  const [currentSavings, setCurrentSavings] = useState("1000000");
  const [expectedReturn, setExpectedReturn] = useState("12");
  const [inflation, setInflation] = useState("6");

  const result = useMemo(() => {
    const years =
      (Number.parseFloat(fireAge) || 45) -
      (Number.parseFloat(currentAge) || 28);
    const AE = Number.parseFloat(annualExpenses) || 600000;
    const CS = Number.parseFloat(currentSavings) || 0;
    const r = (Number.parseFloat(expectedReturn) || 12) / 100;
    const inf = (Number.parseFloat(inflation) || 6) / 100;
    const fireNumber = AE * 25;
    const futureFireNumber = AE * (1 + inf) ** years * 25;
    const futureValueCurrentSavings = CS * (1 + r) ** years;
    const needed = futureFireNumber - futureValueCurrentSavings;
    const monthlySavingsNeeded =
      needed > 0 ? (needed * (r / 12)) / ((1 + r / 12) ** (years * 12) - 1) : 0;
    return {
      fireNumber,
      futureFireNumber,
      monthlySavingsNeeded,
      yearsToFire: years,
      realReturn: ((1 + r) / (1 + inf) - 1) * 100,
    };
  }, [
    currentAge,
    fireAge,
    annualExpenses,
    currentSavings,
    expectedReturn,
    inflation,
  ]);

  const chartData = [
    { name: "FIRE Number", value: Math.round(result.fireNumber) },
    { name: "Adj. FIRE", value: Math.round(result.futureFireNumber) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">FIRE Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Current Age</Label>
              <Input
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                type="number"
                data-ocid="fire.currentage.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Target FIRE Age</Label>
              <Input
                value={fireAge}
                onChange={(e) => setFireAge(e.target.value)}
                type="number"
                data-ocid="fire.fireage.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Annual Expenses ({sym})</Label>
              <Input
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(e.target.value)}
                type="number"
                data-ocid="fire.expenses.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Current Savings ({sym})</Label>
              <Input
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                type="number"
                data-ocid="fire.savings.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Expected Return (%)</Label>
              <Input
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                type="number"
                data-ocid="fire.return.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Inflation (%)</Label>
              <Input
                value={inflation}
                onChange={(e) => setInflation(e.target.value)}
                type="number"
                data-ocid="fire.inflation.input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="text-base">FIRE Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              FIRE Number (25x)
            </span>
            <span className="font-semibold">{fmt(result.fireNumber)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Inflation-adjusted FIRE Number
            </span>
            <span className="font-semibold text-orange-600">
              {fmt(result.futureFireNumber)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Years to FIRE</span>
            <span className="font-semibold">{result.yearsToFire} years</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Monthly Savings Needed</span>
            <span className="font-bold text-lg text-orange-600">
              {fmt(result.monthlySavingsNeeded)}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              FIRE Numbers
            </p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${sym}${(v / 100000).toFixed(0)}L`}
                  width={40}
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
