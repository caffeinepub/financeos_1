import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function InflationImpactPlanner() {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const A = Number.parseFloat(amount) || 0;
    const r = (Number.parseFloat(rate) || 0) / 100;
    const n = Number.parseFloat(years) || 0;
    const futureValueNeeded = A * (1 + r) ** n;
    const realValue = A / (1 + r) ** n;
    const powerLoss = ((futureValueNeeded - A) / futureValueNeeded) * 100;
    return { futureValueNeeded, realValue, powerLoss };
  }, [amount, rate, years]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inflation Impact Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Current Amount (₹)</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              data-ocid="inflationimpact.amount.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Inflation Rate (% p.a.)</Label>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              type="number"
              data-ocid="inflationimpact.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Years</Label>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              type="number"
              data-ocid="inflationimpact.years.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Future Value Needed
            </span>
            <span className="font-semibold text-orange-600">
              {fmt(result.futureValueNeeded)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Real Value of Current Amount
            </span>
            <span className="font-semibold text-red-500">
              {fmt(result.realValue)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Purchasing Power Loss</span>
            <span className="font-bold text-lg text-red-600">
              {result.powerLoss.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your {fmt(Number.parseFloat(amount) || 0)} today will only be worth{" "}
            {fmt(result.realValue)} after {years} years due to inflation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
