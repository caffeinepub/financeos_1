import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function HomeLoanCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [propertyValue, setPropertyValue] = useState("5000000");
  const [downPayment, setDownPayment] = useState("1000000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");

  const result = useMemo(() => {
    const PV = Number.parseFloat(propertyValue) || 0;
    const DP = Number.parseFloat(downPayment) || 0;
    const P = PV - DP;
    const r = (Number.parseFloat(interestRate) || 0) / 100 / 12;
    const n = (Number.parseFloat(tenure) || 1) * 12;
    const emi = r > 0 ? (P * r * (1 + r) ** n) / ((1 + r) ** n - 1) : P / n;
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return {
      loanAmount: P,
      emi,
      totalInterest,
      totalCost: DP + totalPayment,
      downPayment: DP,
    };
  }, [propertyValue, downPayment, interestRate, tenure]);

  const pieData = [
    { name: "Down Payment", value: result.downPayment },
    { name: "Loan Principal", value: result.loanAmount },
    { name: "Total Interest", value: result.totalInterest },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Home Loan Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Property Value ({sym})</Label>
            <Input
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              type="number"
              data-ocid="homeloan.value.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Down Payment ({sym})</Label>
            <Input
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              type="number"
              data-ocid="homeloan.downpayment.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="homeloan.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Tenure (Years)</Label>
            <Input
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              type="number"
              data-ocid="homeloan.tenure.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800">
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
            <span className="font-bold text-red-600">{fmt(result.emi)}</span>
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
            <span className="text-sm font-bold">Total Cost of Property</span>
            <span className="font-bold text-lg text-red-600">
              {fmt(result.totalCost)}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Cost Breakdown
            </p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={55}
                  dataKey="value"
                  label={false}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#6366f1" />
                  <Cell fill="#f97316" />
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
