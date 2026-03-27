import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type FIREStrategy = "fat" | "lean" | "barista";

interface YearlyData {
  year: number;
  age: number;
  corpus: number;
  withdrawals: number;
}

const COUNTRY_INFLATION: Record<string, number> = {
  India: 6.0,
  "United States": 3.0,
  "United Kingdom": 2.5,
  Canada: 2.8,
  Australia: 3.2,
  Germany: 2.0,
  France: 2.3,
  Japan: 1.5,
  Singapore: 2.0,
  UAE: 2.5,
};

const COUNTRY_EXPENSE_MULTIPLIER: Record<string, number> = {
  India: 1.0,
  "United States": 4.5,
  "United Kingdom": 4.0,
  Canada: 3.8,
  Australia: 3.5,
  Germany: 3.2,
  France: 3.0,
  Japan: 3.3,
  Singapore: 3.8,
  UAE: 3.5,
};

export function FIRECalculator() {
  const { formatCurrency, country } = useCurrency();
  const [strategy, setStrategy] = useState<FIREStrategy>("fat");
  const [currentAge, setCurrentAge] = useState(30);
  const [targetAge, setTargetAge] = useState(45);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [monthlySavings, setMonthlySavings] = useState(30000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [inflationRate, setInflationRate] = useState(
    COUNTRY_INFLATION[country?.country ?? "India"] ?? 6.0,
  );
  const [results, setResults] = useState<{
    totalCorpus: number;
    requiredCorpus: number;
    futureMonthlyExpenses: number;
    annualWithdrawal: number;
    yearsCorpusLasts: number;
    shortfall: number;
    isFeasible: boolean;
    requiredMonthlySavings: number;
    yearlyData: YearlyData[];
    strategy: FIREStrategy;
  } | null>(null);

  useEffect(() => {
    const countryInflation = COUNTRY_INFLATION[country?.country ?? ""];
    if (countryInflation) setInflationRate(countryInflation);
  }, [country?.country]);

  const calculateFIRE = () => {
    const yearsToFIRE = targetAge - currentAge;
    if (yearsToFIRE <= 0) return;
    const monthlyRate = expectedReturn / 12 / 100;
    const months = yearsToFIRE * 12;
    const expenseMultiplier =
      COUNTRY_EXPENSE_MULTIPLIER[country?.country ?? "India"] ?? 1.0;

    let adjustedMonthlyExpenses = monthlyExpenses;
    if (strategy === "fat")
      adjustedMonthlyExpenses = monthlyExpenses * 1.5 * expenseMultiplier;
    else if (strategy === "lean")
      adjustedMonthlyExpenses = monthlyExpenses * 0.6 * expenseMultiplier;
    else adjustedMonthlyExpenses = monthlyExpenses * 0.8 * expenseMultiplier;

    const fvCurrentSavings =
      currentSavings * (1 + expectedReturn / 100) ** yearsToFIRE;
    const fvMonthlySavings =
      monthlySavings *
      ((((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate));
    const totalCorpus = fvCurrentSavings + fvMonthlySavings;
    const futureMonthlyExpenses =
      adjustedMonthlyExpenses * (1 + inflationRate / 100) ** yearsToFIRE;
    const annualExpenses = futureMonthlyExpenses * 12;
    const requiredCorpus = annualExpenses * 25;
    const shortfall = requiredCorpus - totalCorpus;
    const isFeasible = shortfall <= 0;

    let requiredMonthlySavings = monthlySavings;
    if (shortfall > 0) {
      const targetFV = requiredCorpus - fvCurrentSavings;
      requiredMonthlySavings =
        targetFV /
        ((((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate));
    }

    const annualWithdrawal = totalCorpus * 0.04;
    const yearsCorpusLasts = totalCorpus / annualExpenses;

    const yearlyData: YearlyData[] = [];
    for (let year = 1; year <= yearsToFIRE; year++) {
      const m = year * 12;
      const fvCS = currentSavings * (1 + expectedReturn / 100) ** year;
      const fvMS =
        monthlySavings *
        ((((1 + monthlyRate) ** m - 1) / monthlyRate) * (1 + monthlyRate));
      yearlyData.push({
        year,
        age: currentAge + year,
        corpus: fvCS + fvMS,
        withdrawals: 0,
      });
    }

    let remainingCorpus = totalCorpus;
    for (let year = 1; year <= 30; year++) {
      const withdrawal = annualWithdrawal * (1 + inflationRate / 100) ** year;
      remainingCorpus =
        remainingCorpus * (1 + expectedReturn / 100) - withdrawal;
      if (remainingCorpus < 0) remainingCorpus = 0;
      yearlyData.push({
        year: yearsToFIRE + year,
        age: targetAge + year,
        corpus: remainingCorpus,
        withdrawals: withdrawal,
      });
    }

    setResults({
      totalCorpus,
      requiredCorpus,
      futureMonthlyExpenses,
      annualWithdrawal,
      yearsCorpusLasts,
      shortfall,
      isFeasible,
      requiredMonthlySavings,
      yearlyData,
      strategy,
    });
  };

  const getStrategyInfo = (strat: FIREStrategy) => {
    switch (strat) {
      case "fat":
        return {
          name: "FAT FIRE",
          description: "Premium lifestyle with higher expenses and comfort",
          colorClass:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
          badgeClass: "bg-purple-500 text-white",
        };
      case "lean":
        return {
          name: "Lean FIRE",
          description: "Minimalist lifestyle with reduced expenses",
          colorClass:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
          badgeClass: "bg-emerald-500 text-white",
        };
      case "barista":
        return {
          name: "Barista FIRE",
          description: "Part-time work supplements retirement income",
          colorClass:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
          badgeClass: "bg-blue-500 text-white",
        };
    }
  };

  const strategyInfo = getStrategyInfo(strategy);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Flame className="h-5 w-5 text-orange-500" />
            FIRE Calculator
          </CardTitle>
          <CardDescription>
            Financial Independence, Retire Early Planning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>FIRE Strategy</Label>
            <Select
              value={strategy}
              onValueChange={(v) => setStrategy(v as FIREStrategy)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fat">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    FAT FIRE — Premium Lifestyle
                  </div>
                </SelectItem>
                <SelectItem value="lean">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    Lean FIRE — Minimalist
                  </div>
                </SelectItem>
                <SelectItem value="barista">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    Barista FIRE — Part-time Work
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {strategyInfo.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Current Age</Label>
              <Input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                min={18}
                max={100}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Target FIRE Age</Label>
              <Input
                type="number"
                value={targetAge}
                onChange={(e) => setTargetAge(Number(e.target.value))}
                min={currentAge + 1}
                max={100}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Current Monthly Expenses</Label>
            <Input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              min={1000}
              step={1000}
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Adjusted for {country?.country ?? "your country"} cost of living
            </p>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Current Savings</Label>
            <Input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              min={0}
              step={10000}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Monthly Savings</Label>
            <Input
              type="number"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              min={0}
              step={1000}
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Expected Return (%)</Label>
              <Input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                min={1}
                max={30}
                step={0.5}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Inflation Rate (%)</Label>
              <Input
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                min={1}
                max={15}
                step={0.5}
                className="rounded-xl"
              />
            </div>
          </div>

          <Button onClick={calculateFIRE} className="w-full rounded-xl">
            Calculate FIRE Plan
          </Button>

          {results && (
            <div className="space-y-3 pt-4 border-t">
              <div
                className={`p-3 rounded-xl flex items-center justify-between ${strategyInfo.colorClass}`}
              >
                <span className="text-sm font-medium">Strategy</span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${strategyInfo.badgeClass}`}
                >
                  {strategyInfo.name}
                </span>
              </div>
              <div
                className={`flex justify-between items-center p-3 rounded-xl ${results.isFeasible ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-amber-50 dark:bg-amber-900/20"}`}
              >
                <span className="text-sm font-medium text-foreground">
                  Status
                </span>
                <span
                  className={`text-sm font-bold ${results.isFeasible ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {results.isFeasible ? "✓ Feasible" : "⚠ Needs Adjustment"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl">
                <span className="text-sm font-medium text-foreground">
                  Required Corpus
                </span>
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(results.requiredCorpus)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/40 rounded-xl">
                <span className="text-sm font-medium text-foreground">
                  Projected Corpus
                </span>
                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(results.totalCorpus)}
                </span>
              </div>
              {!results.isFeasible && (
                <>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <span className="text-sm font-medium text-foreground">
                      Shortfall
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {formatCurrency(results.shortfall)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <span className="text-sm font-medium text-foreground">
                      Required Monthly Savings
                    </span>
                    <span className="text-sm font-bold text-amber-600">
                      {formatCurrency(results.requiredMonthlySavings)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center p-3 bg-muted/40 rounded-xl">
                <span className="text-sm font-medium text-foreground">
                  Annual Withdrawal (4% Rule)
                </span>
                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(results.annualWithdrawal)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <span className="text-sm font-medium text-foreground">
                  Corpus Duration
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {results.yearsCorpusLasts.toFixed(1)} years
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                FIRE Journey Projection
              </CardTitle>
              <CardDescription>
                Corpus growth and withdrawal phase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="age"
                    label={{
                      value: "Age",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis tickFormatter={(v) => formatCurrency(v)} width={80} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="corpus"
                    stroke="hsl(var(--primary))"
                    name="Corpus"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawals"
                    stroke="#ef4444"
                    name="Annual Withdrawals"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Year-wise Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto rounded-xl">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead className="text-right">Corpus</TableHead>
                      <TableHead className="text-right">Withdrawals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.yearlyData.slice(0, 40).map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium">
                          {row.year}
                        </TableCell>
                        <TableCell>{row.age}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(row.corpus)}
                        </TableCell>
                        <TableCell className="text-right text-red-500">
                          {row.withdrawals > 0
                            ? formatCurrency(row.withdrawals)
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
