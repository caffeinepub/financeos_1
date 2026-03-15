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

export function CarLoanEMICalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [carPrice, setCarPrice] = useState("800000");
  const [downPayment, setDownPayment] = useState("200000");
  const [interestRate, setInterestRate] = useState("9");
  const [tenure, setTenure] = useState("5");

  const result = useMemo(() => {
    const CP = Number.parseFloat(carPrice) || 0;
    const DP = Number.parseFloat(downPayment) || 0;
    const P = CP - DP;
    const r = (Number.parseFloat(interestRate) || 0) / 100 / 12;
    const n = (Number.parseFloat(tenure) || 1) * 12;
    const emi = r > 0 ? (P * r * (1 + r) ** n) / ((1 + r) ** n - 1) : P / n;
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return { loanAmount: P, emi, totalInterest, totalCost: DP + totalPayment };
  }, [carPrice, downPayment, interestRate, tenure]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Car Loan Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Car Price ({sym})</Label>
            <Input
              value={carPrice}
              onChange={(e) => setCarPrice(e.target.value)}
              type="number"
              data-ocid="carloan.price.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Down Payment ({sym})</Label>
            <Input
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              type="number"
              data-ocid="carloan.downpayment.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="carloan.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Tenure (Years)</Label>
            <Input
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              type="number"
              data-ocid="carloan.tenure.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Loan Amount</span>
            <span className="font-semibold">{fmt(result.loanAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Monthly EMI</span>
            <span className="font-bold text-amber-600">{fmt(result.emi)}</span>
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
            <span className="text-sm font-bold">Total Cost</span>
            <span className="font-bold text-lg text-amber-600">
              {fmt(result.totalCost)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
