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
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function RetirementCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("60");
  const [monthlyExpenses, setMonthlyExpenses] = useState("50000");
  const [lifeExpectancy, setLifeExpectancy] = useState("85");
  const [preReturnRate, setPreReturnRate] = useState("12");
  const [postReturnRate, setPostReturnRate] = useState("7");
  const [inflationRate, setInflationRate] = useState("6");

  const result = useMemo(() => {
    const yearsToRetirement =
      (Number.parseFloat(retirementAge) || 60) -
      (Number.parseFloat(currentAge) || 30);
    const yearsInRetirement =
      (Number.parseFloat(lifeExpectancy) || 85) -
      (Number.parseFloat(retirementAge) || 60);
    const ME = Number.parseFloat(monthlyExpenses) || 50000;
    const inflation = (Number.parseFloat(inflationRate) || 6) / 100;
    const preReturn = (Number.parseFloat(preReturnRate) || 12) / 100;
    const postReturn = (Number.parseFloat(postReturnRate) || 7) / 100 / 12;
    const futureMonthlyExpenses = ME * (1 + inflation) ** yearsToRetirement;
    const n = yearsInRetirement * 12;
    const corpusRequired =
      postReturn > 0
        ? futureMonthlyExpenses * ((1 - (1 + postReturn) ** -n) / postReturn)
        : futureMonthlyExpenses * n;
    const monthlyPreReturn = preReturn / 12;
    const months = yearsToRetirement * 12;
    const monthlySIP =
      (corpusRequired * monthlyPreReturn) /
      ((1 + monthlyPreReturn) ** months - 1);
    return { corpusRequired, monthlySIP, futureMonthlyExpenses };
  }, [
    currentAge,
    retirementAge,
    monthlyExpenses,
    lifeExpectancy,
    preReturnRate,
    postReturnRate,
    inflationRate,
  ]);

  const chartData = [
    {
      name: "Monthly",
      "Current Expenses": Number.parseFloat(monthlyExpenses) || 0,
      "Future Expenses": Math.round(result.futureMonthlyExpenses),
      "SIP Needed": Math.round(result.monthlySIP),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Retirement Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Current Age</Label>
              <Input
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                type="number"
                data-ocid="retirement.currentage.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Retirement Age</Label>
              <Input
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                type="number"
                data-ocid="retirement.retirementage.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Life Expectancy</Label>
              <Input
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(e.target.value)}
                type="number"
                data-ocid="retirement.lifeexpectancy.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Monthly Expenses ({sym})</Label>
              <Input
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                type="number"
                data-ocid="retirement.expenses.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Pre-Retirement Return (%)</Label>
              <Input
                value={preReturnRate}
                onChange={(e) => setPreReturnRate(e.target.value)}
                type="number"
                data-ocid="retirement.prereturn.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Post-Retirement Return (%)</Label>
              <Input
                value={postReturnRate}
                onChange={(e) => setPostReturnRate(e.target.value)}
                type="number"
                data-ocid="retirement.postreturn.input"
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Inflation Rate (%)</Label>
              <Input
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                type="number"
                data-ocid="retirement.inflation.input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Future Monthly Expenses
            </span>
            <span className="font-semibold">
              {fmt(result.futureMonthlyExpenses)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Corpus Required
            </span>
            <span className="font-semibold text-green-600">
              {fmt(result.corpusRequired)}
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
              Monthly Comparison
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`}
                  width={45}
                />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend iconType="circle" iconSize={8} />
                <Bar
                  dataKey="Current Expenses"
                  fill="#6366f1"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="Future Expenses"
                  fill="#f97316"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="SIP Needed"
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
