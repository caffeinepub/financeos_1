import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function EmergencyFundCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [monthlyExpenses, setMonthlyExpenses] = useState("50000");
  const [monthsCover, setMonthsCover] = useState("6");

  const result = useMemo(() => {
    const ME = Number.parseFloat(monthlyExpenses) || 0;
    const M = Number.parseFloat(monthsCover) || 6;
    return { target: ME * M, monthlyExpenses: ME, months: M };
  }, [monthlyExpenses, monthsCover]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emergency Fund Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Monthly Expenses ({sym})</Label>
            <Input
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              type="number"
              data-ocid="emergency.expenses.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Months to Cover</Label>
            <Select value={monthsCover} onValueChange={setMonthsCover}>
              <SelectTrigger data-ocid="emergency.months.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months (Recommended)</SelectItem>
                <SelectItem value="9">9 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800">
        <CardHeader>
          <CardTitle className="text-base">Emergency Fund Target</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Monthly Expenses
            </span>
            <span className="font-semibold">{fmt(result.monthlyExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Coverage Period
            </span>
            <span className="font-semibold">{result.months} months</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Emergency Fund Target</span>
            <span className="font-bold text-2xl text-rose-600">
              {fmt(result.target)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Keep this in a liquid savings account or liquid mutual fund for
            quick access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
