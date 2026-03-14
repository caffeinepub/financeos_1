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

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState("1000000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [tenure, setTenure] = useState("240");

  const result = useMemo(() => {
    const P = Number.parseFloat(loanAmount) || 0;
    const r = (Number.parseFloat(interestRate) || 0) / 100 / 12;
    const n = Number.parseFloat(tenure) || 1;
    const emi = r > 0 ? (P * r * (1 + r) ** n) / ((1 + r) ** n - 1) : P / n;
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return { emi, totalPayment, totalInterest };
  }, [loanAmount, interestRate, tenure]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">EMI Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Loan Amount (₹)</Label>
            <Input
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              type="number"
              data-ocid="emi.amount.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="emi.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Tenure (Months)</Label>
            <Input
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              type="number"
              data-ocid="emi.tenure.input"
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
              Principal Amount
            </span>
            <span className="font-semibold">
              {fmt(Number.parseFloat(loanAmount) || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Interest
            </span>
            <span className="font-semibold text-orange-600">
              {fmt(result.totalInterest)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Payment</span>
            <span className="font-semibold">{fmt(result.totalPayment)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Monthly EMI</span>
            <span className="font-bold text-2xl text-orange-600">
              {fmt(result.emi)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
