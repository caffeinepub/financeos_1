import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useMemo, useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function RetirementReadinessCalculator() {
  const [currentAge, setCurrentAge] = useState("35");
  const [retirementAge, setRetirementAge] = useState("60");
  const [currentSavings, setCurrentSavings] = useState("500000");
  const [monthlySIP, setMonthlySIP] = useState("20000");
  const [expectedReturn, setExpectedReturn] = useState("12");
  const [monthlyExpenses, setMonthlyExpenses] = useState("60000");

  const result = useMemo(() => {
    const years =
      (Number.parseFloat(retirementAge) || 60) -
      (Number.parseFloat(currentAge) || 35);
    const r = (Number.parseFloat(expectedReturn) || 12) / 100 / 12;
    const n = years * 12;
    const SIP = Number.parseFloat(monthlySIP) || 0;
    const savings = Number.parseFloat(currentSavings) || 0;
    const ME = Number.parseFloat(monthlyExpenses) || 60000;
    const projectedCorpus =
      savings * (1 + r * 12) ** years +
      SIP * (((1 + r) ** n - 1) / r) * (1 + r);
    const requiredCorpus = ME * 12 * 25;
    const score = Math.min(
      100,
      Math.round((projectedCorpus / requiredCorpus) * 100),
    );
    const gap = requiredCorpus - projectedCorpus;
    return { projectedCorpus, requiredCorpus, score, gap };
  }, [
    currentAge,
    retirementAge,
    currentSavings,
    monthlySIP,
    expectedReturn,
    monthlyExpenses,
  ]);

  const scoreColor =
    result.score >= 80
      ? "text-green-600"
      : result.score >= 50
        ? "text-yellow-600"
        : "text-red-500";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Readiness Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Current Age</Label>
              <Input
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value)}
                type="number"
                data-ocid="retirementreadiness.currentage.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Retirement Age</Label>
              <Input
                value={retirementAge}
                onChange={(e) => setRetirementAge(e.target.value)}
                type="number"
                data-ocid="retirementreadiness.retirementage.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Current Savings (₹)</Label>
              <Input
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                type="number"
                data-ocid="retirementreadiness.savings.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Monthly SIP (₹)</Label>
              <Input
                value={monthlySIP}
                onChange={(e) => setMonthlySIP(e.target.value)}
                type="number"
                data-ocid="retirementreadiness.sip.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Expected Return (%)</Label>
              <Input
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                type="number"
                data-ocid="retirementreadiness.return.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Monthly Expenses (₹)</Label>
              <Input
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                type="number"
                data-ocid="retirementreadiness.expenses.input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 border-teal-200 dark:border-teal-800">
        <CardHeader>
          <CardTitle className="text-base">Readiness Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <span className={`text-5xl font-bold ${scoreColor}`}>
              {result.score}
            </span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <Progress value={result.score} className="h-3" />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Projected Corpus
            </span>
            <span className="font-semibold text-teal-600">
              {fmt(result.projectedCorpus)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Required Corpus (25x)
            </span>
            <span className="font-semibold">{fmt(result.requiredCorpus)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">
              {result.gap > 0 ? "Gap" : "Surplus"}
            </span>
            <span
              className={`font-bold text-lg ${result.gap > 0 ? "text-red-500" : "text-green-600"}`}
            >
              {fmt(Math.abs(result.gap))}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
