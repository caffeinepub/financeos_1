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

export function EducationLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("1000000");
  const [interestRate, setInterestRate] = useState("10");
  const [moratorium, setMoratorium] = useState("4");
  const [repaymentPeriod, setRepaymentPeriod] = useState("7");

  const result = useMemo(() => {
    const P = Number.parseFloat(loanAmount) || 0;
    const r = (Number.parseFloat(interestRate) || 0) / 100 / 12;
    const moratoriumMonths = (Number.parseFloat(moratorium) || 0) * 12;
    const repayMonths = (Number.parseFloat(repaymentPeriod) || 1) * 12;
    const balanceAfterMoratorium = P * (1 + r) ** moratoriumMonths;
    const emi =
      r > 0
        ? (balanceAfterMoratorium * r * (1 + r) ** repayMonths) /
          ((1 + r) ** repayMonths - 1)
        : balanceAfterMoratorium / repayMonths;
    const totalPayment = emi * repayMonths;
    const totalInterest = totalPayment - P;
    return { emi, totalInterest, totalPayment, balanceAfterMoratorium };
  }, [loanAmount, interestRate, moratorium, repaymentPeriod]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Education Loan Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Loan Amount (₹)</Label>
            <Input
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              type="number"
              data-ocid="eduloan.amount.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="eduloan.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Moratorium Period (Years)</Label>
            <Input
              value={moratorium}
              onChange={(e) => setMoratorium(e.target.value)}
              type="number"
              data-ocid="eduloan.moratorium.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Repayment Period (Years)</Label>
            <Input
              value={repaymentPeriod}
              onChange={(e) => setRepaymentPeriod(e.target.value)}
              type="number"
              data-ocid="eduloan.repayment.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-yellow-50 to-lime-50 dark:from-yellow-950/30 dark:to-lime-950/30 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Balance after Moratorium
            </span>
            <span className="font-semibold">
              {fmt(result.balanceAfterMoratorium)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              EMI after Moratorium
            </span>
            <span className="font-bold text-yellow-600">{fmt(result.emi)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Interest
            </span>
            <span className="font-semibold text-orange-500">
              {fmt(result.totalInterest)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Total Payment</span>
            <span className="font-bold text-lg text-yellow-600">
              {fmt(result.totalPayment)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
