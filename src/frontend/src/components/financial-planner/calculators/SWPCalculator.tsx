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

export function SWPCalculator() {
  const [initial, setInitial] = useState("1000000");
  const [withdrawal, setWithdrawal] = useState("10000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const P = Number.parseFloat(initial) || 0;
    const W = Number.parseFloat(withdrawal) || 0;
    const r = (Number.parseFloat(rate) || 0) / 100 / 12;
    const n = (Number.parseFloat(years) || 0) * 12;
    let balance = P;
    for (let i = 0; i < n; i++) {
      balance = balance * (1 + r) - W;
      if (balance < 0) {
        balance = 0;
        break;
      }
    }
    const totalWithdrawal = W * n;
    return {
      totalWithdrawal,
      finalValue: Math.max(balance, 0),
      totalReturns: Math.max(balance + totalWithdrawal - P, 0),
    };
  }, [initial, withdrawal, rate, years]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SWP Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Initial Investment (₹)</Label>
            <Input
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              type="number"
              data-ocid="swp.initial.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Monthly Withdrawal (₹)</Label>
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
