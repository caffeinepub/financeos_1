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

export function FlatVsReducingCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [loanAmount, setLoanAmount] = useState("500000");
  const [flatRate, setFlatRate] = useState("10");
  const [reducingRate, setReducingRate] = useState("10");
  const [tenure, setTenure] = useState("36");

  const result = useMemo(() => {
    const P = Number.parseFloat(loanAmount) || 0;
    const fr = (Number.parseFloat(flatRate) || 0) / 100;
    const rr = (Number.parseFloat(reducingRate) || 0) / 100 / 12;
    const n = Number.parseFloat(tenure) || 1;
    const flatEMI = (P + P * fr * (n / 12)) / n;
    const flatInterest = P * fr * (n / 12);
    const reducingEMI =
      rr > 0 ? (P * rr * (1 + rr) ** n) / ((1 + rr) ** n - 1) : P / n;
    const reducingInterest = reducingEMI * n - P;
    return {
      flatEMI,
      flatInterest,
      reducingEMI,
      reducingInterest,
      saving: flatInterest - reducingInterest,
    };
  }, [loanAmount, flatRate, reducingRate, tenure]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flat vs Reducing Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Loan Amount ({sym})</Label>
            <Input
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              type="number"
              data-ocid="flatreducing.amount.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Flat Rate (%)</Label>
            <Input
              value={flatRate}
              onChange={(e) => setFlatRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="flatreducing.flatrate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Reducing Rate (%)</Label>
            <Input
              value={reducingRate}
              onChange={(e) => setReducingRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="flatreducing.reducingrate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Tenure (Months)</Label>
            <Input
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              type="number"
              data-ocid="flatreducing.tenure.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800">
        <CardHeader>
          <CardTitle className="text-base">Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-muted-foreground border-b pb-2">
            <span />
            <span className="text-center">Flat</span>
            <span className="text-center">Reducing</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground">Monthly EMI</span>
            <span className="text-center font-semibold text-rose-600">
              {fmt(result.flatEMI)}
            </span>
            <span className="text-center font-semibold text-green-600">
              {fmt(result.reducingEMI)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground">Total Interest</span>
            <span className="text-center font-semibold text-rose-600">
              {fmt(result.flatInterest)}
            </span>
            <span className="text-center font-semibold text-green-600">
              {fmt(result.reducingInterest)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">You Save with Reducing</span>
            <span className="font-bold text-lg text-green-600">
              {fmt(Math.max(result.saving, 0))}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
