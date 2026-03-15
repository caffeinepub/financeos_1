import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function MarriagePlanningCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [years, setYears] = useState("5");
  const [currentCost, setCurrentCost] = useState("2000000");
  const [inflation, setInflation] = useState("6");
  const [expectedReturn, setExpectedReturn] = useState("12");

  const result = useMemo(() => {
    const n = Number.parseFloat(years) || 1;
    const CC = Number.parseFloat(currentCost) || 0;
    const inf = (Number.parseFloat(inflation) || 6) / 100;
    const r = (Number.parseFloat(expectedReturn) || 12) / 100;
    const rm = r / 12;
    const futureCost = CC * (1 + inf) ** n;
    const months = n * 12;
    const monthlySIP =
      rm > 0
        ? (futureCost * rm) / ((1 + rm) ** months - 1)
        : futureCost / months;
    const lumpsumToday = futureCost / (1 + r) ** n;
    return { futureCost, monthlySIP, lumpsumToday };
  }, [years, currentCost, inflation, expectedReturn]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marriage Planning Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Marriage in N Years</Label>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              type="number"
              data-ocid="marriage.years.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Expected Cost Today ({sym})</Label>
            <Input
              value={currentCost}
              onChange={(e) => setCurrentCost(e.target.value)}
              type="number"
              data-ocid="marriage.cost.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Inflation Rate (%)</Label>
            <Input
              value={inflation}
              onChange={(e) => setInflation(e.target.value)}
              type="number"
              data-ocid="marriage.inflation.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Expected Return (%)</Label>
            <Input
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              type="number"
              data-ocid="marriage.return.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Future Cost (inflation-adj.)
            </span>
            <span className="font-semibold text-rose-600">
              {fmt(result.futureCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Lumpsum Needed Today
            </span>
            <span className="font-semibold text-blue-600">
              {fmt(result.lumpsumToday)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Monthly SIP Needed</span>
            <span className="font-bold text-2xl text-rose-600">
              {fmt(result.monthlySIP)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
