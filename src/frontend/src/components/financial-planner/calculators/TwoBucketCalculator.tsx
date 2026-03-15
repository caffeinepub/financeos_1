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

export function TwoBucketCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [corpus, setCorpus] = useState("10000000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("80000");
  const [safePct, setSafePct] = useState("40");
  const [growthRate, setGrowthRate] = useState("12");

  const result = useMemo(() => {
    const C = Number.parseFloat(corpus) || 0;
    const ME = Number.parseFloat(monthlyExpenses) || 0;
    const sp = (Number.parseFloat(safePct) || 40) / 100;
    const gr = (Number.parseFloat(growthRate) || 12) / 100 / 12;
    const safeBucket = C * sp;
    const growthBucket = C * (1 - sp);
    const safeYears = ME > 0 ? safeBucket / (ME * 12) : 0;
    const annualGrowthIncome = growthBucket * gr * 12;
    return { safeBucket, growthBucket, safeYears, annualGrowthIncome };
  }, [corpus, monthlyExpenses, safePct, growthRate]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">2-Bucket Strategy Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Total Corpus ({sym})</Label>
            <Input
              value={corpus}
              onChange={(e) => setCorpus(e.target.value)}
              type="number"
              data-ocid="twobucket.corpus.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Monthly Expenses ({sym})</Label>
            <Input
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              type="number"
              data-ocid="twobucket.expenses.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Safe Bucket % (of corpus)</Label>
            <Input
              value={safePct}
              onChange={(e) => setSafePct(e.target.value)}
              type="number"
              max="100"
              data-ocid="twobucket.safepct.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Growth Bucket Return (% p.a.)</Label>
            <Input
              value={growthRate}
              onChange={(e) => setGrowthRate(e.target.value)}
              type="number"
              data-ocid="twobucket.growthrate.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 border-cyan-200 dark:border-cyan-800">
        <CardHeader>
          <CardTitle className="text-base">Allocation Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Safe Bucket ({safePct}%)
              </span>
              <span className="font-bold text-blue-700 dark:text-blue-300">
                {fmt(result.safeBucket)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              FD, liquid | Covers ~{result.safeYears.toFixed(1)} years
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                Growth Bucket ({100 - Number.parseFloat(safePct)}%)
              </span>
              <span className="font-bold text-green-700 dark:text-green-300">
                {fmt(result.growthBucket)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Equity, MF | Annual income: {fmt(result.annualGrowthIncome)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
