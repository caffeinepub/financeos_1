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

export function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState("50000");
  const [monthlyRate, setMonthlyRate] = useState("3.5");
  const [monthlyPayment, setMonthlyPayment] = useState("3000");

  const result = useMemo(() => {
    const B = Number.parseFloat(balance) || 0;
    const r = (Number.parseFloat(monthlyRate) || 0) / 100;
    const P = Number.parseFloat(monthlyPayment) || 0;
    if (P <= B * r)
      return {
        months: Number.POSITIVE_INFINITY,
        totalInterest: Number.POSITIVE_INFINITY,
        totalAmount: Number.POSITIVE_INFINITY,
      };
    const months = Math.ceil(-Math.log(1 - (B * r) / P) / Math.log(1 + r));
    const totalAmount = P * months;
    const totalInterest = totalAmount - B;
    return { months, totalInterest, totalAmount };
  }, [balance, monthlyRate, monthlyPayment]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Credit Card Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Outstanding Balance (₹)</Label>
            <Input
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              type="number"
              data-ocid="creditcard.balance.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Interest Rate (% per month)</Label>
            <Input
              value={monthlyRate}
              onChange={(e) => setMonthlyRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="creditcard.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Monthly Payment (₹)</Label>
            <Input
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              type="number"
              data-ocid="creditcard.payment.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.months === Number.POSITIVE_INFINITY ? (
            <p className="text-sm text-red-500 font-semibold">
              Monthly payment is too low to cover interest. Increase payment.
            </p>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Months to Payoff
                </span>
                <span className="font-bold text-pink-600">
                  {result.months} months
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Interest Paid
                </span>
                <span className="font-semibold text-red-500">
                  {fmt(result.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-bold">Total Amount Paid</span>
                <span className="font-bold text-lg text-pink-600">
                  {fmt(result.totalAmount)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
