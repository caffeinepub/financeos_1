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

export function ROICalculator() {
  const [invested, setInvested] = useState("100000");
  const [finalVal, setFinalVal] = useState("150000");
  const [years, setYears] = useState("3");

  const result = useMemo(() => {
    const I = Number.parseFloat(invested) || 0;
    const FV = Number.parseFloat(finalVal) || 0;
    const n = Number.parseFloat(years) || 1;
    const totalReturn = FV - I;
    const roi = I > 0 ? (totalReturn / I) * 100 : 0;
    const annualizedRoi = I > 0 ? ((FV / I) ** (1 / n) - 1) * 100 : 0;
    return { totalReturn, roi, annualizedRoi };
  }, [invested, finalVal, years]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ROI Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Initial Investment (₹)</Label>
            <Input
              value={invested}
              onChange={(e) => setInvested(e.target.value)}
              type="number"
              data-ocid="roi.invested.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Final Value (₹)</Label>
            <Input
              value={finalVal}
              onChange={(e) => setFinalVal(e.target.value)}
              type="number"
              data-ocid="roi.final.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Investment Period (Years)</Label>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              type="number"
              data-ocid="roi.years.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Return</span>
            <span
              className={`font-semibold ${result.totalReturn >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {fmt(result.totalReturn)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">ROI</span>
            <span className="font-semibold text-blue-600">
              {result.roi.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Annualized ROI</span>
            <span className="font-bold text-lg text-indigo-600">
              {result.annualizedRoi.toFixed(2)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
