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

export function DebtToIncomeCalculator() {
  const [income, setIncome] = useState("100000");
  const [homeLoan, setHomeLoan] = useState("30000");
  const [carLoan, setCarLoan] = useState("10000");
  const [creditCard, setCreditCard] = useState("5000");
  const [otherDebt, setOtherDebt] = useState("0");

  const result = useMemo(() => {
    const I = Number.parseFloat(income) || 1;
    const totalDebt =
      (Number.parseFloat(homeLoan) || 0) +
      (Number.parseFloat(carLoan) || 0) +
      (Number.parseFloat(creditCard) || 0) +
      (Number.parseFloat(otherDebt) || 0);
    const dti = (totalDebt / I) * 100;
    let assessment = "Excellent";
    let color = "text-green-600";
    if (dti > 50) {
      assessment = "Poor";
      color = "text-red-500";
    } else if (dti > 36) {
      assessment = "Fair";
      color = "text-yellow-500";
    } else if (dti > 20) {
      assessment = "Good";
      color = "text-blue-500";
    }
    return { totalDebt, dti, assessment, color };
  }, [income, homeLoan, carLoan, creditCard, otherDebt]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income & Debt Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Monthly Income (₹)</Label>
            <Input
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              type="number"
              data-ocid="debtincome.income.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Home Loan EMI (₹)</Label>
            <Input
              value={homeLoan}
              onChange={(e) => setHomeLoan(e.target.value)}
              type="number"
              data-ocid="debtincome.homeloan.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Car Loan EMI (₹)</Label>
            <Input
              value={carLoan}
              onChange={(e) => setCarLoan(e.target.value)}
              type="number"
              data-ocid="debtincome.carloan.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Credit Card Payment (₹)</Label>
            <Input
              value={creditCard}
              onChange={(e) => setCreditCard(e.target.value)}
              type="number"
              data-ocid="debtincome.creditcard.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Other Debt (₹)</Label>
            <Input
              value={otherDebt}
              onChange={(e) => setOtherDebt(e.target.value)}
              type="number"
              data-ocid="debtincome.other.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Monthly Debt
            </span>
            <span className="font-semibold">{fmt(result.totalDebt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Monthly Income
            </span>
            <span className="font-semibold">
              {fmt(Number.parseFloat(income) || 0)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">DTI Ratio</span>
            <span className={`font-bold text-2xl ${result.color}`}>
              {result.dti.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-bold">Assessment</span>
            <span className={`font-bold text-lg ${result.color}`}>
              {result.assessment}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Below 20%: Excellent | 20-36%: Good | 36-50%: Fair | Above 50%: Poor
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
