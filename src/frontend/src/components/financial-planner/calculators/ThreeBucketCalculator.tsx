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

export function ThreeBucketCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [corpus, setCorpus] = useState("10000000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("80000");
  const [shortRate, setShortRate] = useState("6");
  const [medRate, setMedRate] = useState("8");
  const [longRate, setLongRate] = useState("12");

  const result = useMemo(() => {
    const C = Number.parseFloat(corpus) || 0;
    const ME = Number.parseFloat(monthlyExpenses) || 0;
    const sr = (Number.parseFloat(shortRate) || 0) / 100 / 12;
    const mr = (Number.parseFloat(medRate) || 0) / 100 / 12;
    const lr = (Number.parseFloat(longRate) || 0) / 100 / 12;
    // 20% short (1-3 yrs), 30% medium (4-10 yrs), 50% long (10+ yrs)
    const shortBucket = C * 0.2;
    const medBucket = C * 0.3;
    const longBucket = C * 0.5;
    const annualIncomeShort = shortBucket * sr * 12;
    const annualIncomeMed = medBucket * mr * 12;
    const _annualIncomeLong = longBucket * lr * 12;
    const shortYears = shortBucket / (ME * 12 - annualIncomeShort) || 0;
    const medYears = medBucket / (ME * 12 - annualIncomeMed) || 0;
    return {
      shortBucket,
      medBucket,
      shortYears: Math.max(0, shortYears),
      medYears: Math.max(0, medYears),
      longBucket: longBucket,
    };
  }, [corpus, monthlyExpenses, shortRate, medRate, longRate]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">3-Bucket Strategy Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Total Corpus ({sym})</Label>
            <Input
              value={corpus}
              onChange={(e) => setCorpus(e.target.value)}
              type="number"
              data-ocid="threebucket.corpus.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Monthly Expenses ({sym})</Label>
            <Input
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              type="number"
              data-ocid="threebucket.expenses.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Short-term Return (% p.a.)</Label>
            <Input
              value={shortRate}
              onChange={(e) => setShortRate(e.target.value)}
              type="number"
              data-ocid="threebucket.shortrate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Medium-term Return (% p.a.)</Label>
            <Input
              value={medRate}
              onChange={(e) => setMedRate(e.target.value)}
              type="number"
              data-ocid="threebucket.medrate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Long-term Return (% p.a.)</Label>
            <Input
              value={longRate}
              onChange={(e) => setLongRate(e.target.value)}
              type="number"
              data-ocid="threebucket.longrate.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-200 dark:border-teal-800">
        <CardHeader>
          <CardTitle className="text-base">
            3-Bucket Allocation (20/30/50)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Bucket 1: Short-term (20%)
              </span>
              <span className="font-bold text-blue-700 dark:text-blue-300">
                {fmt(result.shortBucket)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Liquid funds, FD | Covers ~{result.shortYears.toFixed(1)} years
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                Bucket 2: Medium-term (30%)
              </span>
              <span className="font-bold text-green-700 dark:text-green-300">
                {fmt(result.medBucket)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Balanced funds, bonds | Covers ~{result.medYears.toFixed(1)} years
            </p>
          </div>
          <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                Bucket 3: Long-term (50%)
              </span>
              <span className="font-bold text-teal-700 dark:text-teal-300">
                {fmt(result.longBucket)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Equity, growth assets | 10+ years
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
