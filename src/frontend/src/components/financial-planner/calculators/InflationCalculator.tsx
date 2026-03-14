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

export function InflationCalculator() {
  const [currentPrice, setCurrentPrice] = useState("100000");
  const [inflationRate, setInflationRate] = useState("6");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const P = Number.parseFloat(currentPrice) || 0;
    const r = (Number.parseFloat(inflationRate) || 0) / 100;
    const n = Number.parseFloat(years) || 0;
    const futureValue = P * (1 + r) ** n;
    const realValueToday = P / (1 + r) ** n;
    return { futureValue, realValueToday };
  }, [currentPrice, inflationRate, years]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inflation Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Current Price/Amount (₹)</Label>
            <Input
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              type="number"
              data-ocid="inflation.price.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Inflation Rate (% p.a.)</Label>
            <Input
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="inflation.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Years</Label>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              type="number"
              data-ocid="inflation.years.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Future Value of Amount
            </span>
            <span className="font-semibold text-orange-600">
              {fmt(result.futureValue)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">
              Real Purchasing Power Today
            </span>
            <span className="font-bold text-lg text-muted-foreground">
              {fmt(result.realValueToday)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            What costs {fmt(Number.parseFloat(currentPrice) || 0)} today will
            cost {fmt(result.futureValue)} in {years} years at {inflationRate}%
            inflation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
