import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface YearRow {
  year: number;
  invested: number;
  interest: number;
  balance: number;
}

export function PPFCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [yearlyInvestment, setYearlyInvestment] = useState("150000");
  const [period, setPeriod] = useState("15");
  const PPF_RATE = 7.1;

  const result = useMemo(() => {
    const Y = Math.min(Number.parseFloat(yearlyInvestment) || 0, 150000);
    const N = Math.max(Number.parseFloat(period) || 15, 15);
    const r = PPF_RATE / 100;
    let balance = 0;
    const yearlyData: YearRow[] = [];
    for (let i = 1; i <= N; i++) {
      balance = (balance + Y) * (1 + r);
      yearlyData.push({
        year: i,
        invested: Y * i,
        interest: balance - Y * i,
        balance,
      });
    }
    return {
      yearlyData,
      totalInvested: Y * N,
      totalInterest: balance - Y * N,
      maturityValue: balance,
    };
  }, [yearlyInvestment, period]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">PPF Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Yearly Investment ({sym}, max 1.5L)</Label>
              <Input
                value={yearlyInvestment}
                onChange={(e) => setYearlyInvestment(e.target.value)}
                type="number"
                max="150000"
                data-ocid="ppf.investment.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Investment Period (Years, min 15)</Label>
              <Input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                type="number"
                min="15"
                data-ocid="ppf.period.input"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Current PPF Rate: {PPF_RATE}% p.a.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total Invested
              </span>
              <span className="font-semibold">{fmt(result.totalInvested)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total Interest Earned
              </span>
              <span className="font-semibold text-green-600">
                {fmt(result.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-bold">Maturity Value</span>
              <span className="font-bold text-lg text-amber-600">
                {fmt(result.maturityValue)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Year-wise PPF Growth</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Invested</TableHead>
                  <TableHead className="text-right">Interest</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.yearlyData.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell className="text-right">
                      {fmt(row.invested)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {fmt(row.interest)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {fmt(row.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
