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

export function SWPCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [initial, setInitial] = useState("1000000");
  const [withdrawal, setWithdrawal] = useState("10000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [stepUp, setStepUp] = useState("5");

  const result = useMemo(() => {
    const P = Number.parseFloat(initial) || 0;
    let W = Number.parseFloat(withdrawal) || 0;
    const r = (Number.parseFloat(rate) || 0) / 100 / 12;
    const n = (Number.parseFloat(years) || 0) * 12;
    const stepUpRate = (Number.parseFloat(stepUp) || 0) / 100;

    let balance = P;
    let totalWithdrawal = 0;

    for (let i = 0; i < n; i++) {
      // Increase withdrawal amount each year
      if (i > 0 && i % 12 === 0) {
        W = W * (1 + stepUpRate);
      }
      balance = balance * (1 + r) - W;
      totalWithdrawal += W;
      if (balance < 0) {
        balance = 0;
        break;
      }
    }
    return {
      totalWithdrawal,
      finalValue: Math.max(balance, 0),
      totalReturns: Math.max(balance + totalWithdrawal - P, 0),
    };
  }, [initial, withdrawal, rate, years, stepUp]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SWP Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Initial Investment ({sym})</Label>
            <Input
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              type="number"
              data-ocid="swp.initial.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Monthly Withdrawal ({sym})</Label>
            <Input
              value={withdrawal}
              onChange={(e) => setWithdrawal(e.target.value)}
              type="number"
              data-ocid="swp.withdrawal.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Expected Return Rate (% p.a.)</Label>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              type="number"
              data-ocid="swp.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Period (Years)</Label>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              type="number"
              data-ocid="swp.years.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Annual Step-Up (% per year)</Label>
            <Input
              value={stepUp}
              onChange={(e) => setStepUp(e.target.value)}
              type="number"
              data-ocid="swp.stepup.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-sky-200 dark:border-sky-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Withdrawal
            </span>
            <span className="font-semibold text-orange-600">
              {fmt(result.totalWithdrawal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Final Corpus Value
            </span>
            <span className="font-semibold text-blue-600">
              {fmt(result.finalValue)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Total Returns Generated</span>
            <span className="font-bold text-lg text-green-600">
              {fmt(result.totalReturns)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
