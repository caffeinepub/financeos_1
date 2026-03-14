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

export function CAGRCalculator() {
  const [initialVal, setInitialVal] = useState("100000");
  const [finalVal, setFinalVal] = useState("250000");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const IV = Number.parseFloat(initialVal) || 0;
    const FV = Number.parseFloat(finalVal) || 0;
    const n = Number.parseFloat(years) || 1;
    if (IV <= 0) return { cagr: 0, absoluteReturn: 0 };
    const cagr = ((FV / IV) ** (1 / n) - 1) * 100;
    return { cagr, absoluteReturn: ((FV - IV) / IV) * 100 };
  }, [initialVal, finalVal, years]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CAGR Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Initial Value (₹)</Label>
            <Input
              value={initialVal}
              onChange={(e) => setInitialVal(e.target.value)}
              type="number"
              data-ocid="cagr.initial.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Final Value (₹)</Label>
            <Input
              value={finalVal}
              onChange={(e) => setFinalVal(e.target.value)}
              type="number"
              data-ocid="cagr.final.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Number of Years</Label>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              type="number"
              data-ocid="cagr.years.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Initial Value</span>
            <span className="font-semibold">
              {fmt(Number.parseFloat(initialVal) || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Final Value</span>
            <span className="font-semibold">
              {fmt(Number.parseFloat(finalVal) || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Absolute Return
            </span>
            <span className="font-semibold text-blue-600">
              {result.absoluteReturn.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">CAGR</span>
            <span className="font-bold text-2xl text-indigo-600">
              {result.cagr.toFixed(2)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
