import { Badge } from "@/components/ui/badge";
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
  AlertTriangle,
  BookOpen,
  CheckCircle,
  PiggyBank,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { useCurrency } from "../../contexts/CurrencyContext";

function fmt(n: number, sym: string) {
  if (n >= 1e7) return `${sym}${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `${sym}${(n / 1e5).toFixed(2)}L`;
  return `${sym}${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function ModelRetirementTab() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [inputs, setInputs] = useState({
    currentAge: 30,
    retirementAge: 60,
    currentSavings: 500000,
    monthlyContribution: 20000,
    expectedReturn: 12,
    inflationRate: 6,
    monthlyExpense: 50000,
  });

  const set =
    (k: keyof typeof inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setInputs((p) => ({ ...p, [k]: Number(e.target.value) }));

  const result = useMemo(() => {
    const years = inputs.retirementAge - inputs.currentAge;
    const r = inputs.expectedReturn / 100 / 12;
    const n = years * 12;
    const corpus =
      r === 0
        ? inputs.currentSavings + inputs.monthlyContribution * n
        : inputs.currentSavings * (1 + r) ** n +
          inputs.monthlyContribution * (((1 + r) ** n - 1) / r);

    const inflatedExpense =
      inputs.monthlyExpense * (1 + inputs.inflationRate / 100) ** years;
    const targetCorpus = (inflatedExpense * 12) / 0.04;

    const ratio = corpus / targetCorpus;
    const status =
      ratio >= 1 ? "on-track" : ratio >= 0.7 ? "needs-attention" : "critical";

    const chartData: { year: number; savings: number; target: number }[] = [];
    for (let y = 0; y <= years; y += Math.max(1, Math.floor(years / 10))) {
      const months = y * 12;
      const sv =
        r === 0
          ? inputs.currentSavings + inputs.monthlyContribution * months
          : inputs.currentSavings * (1 + r) ** months +
            inputs.monthlyContribution * (((1 + r) ** months - 1) / r);
      const targetAtY = targetCorpus * (y / years);
      chartData.push({
        year: inputs.currentAge + y,
        savings: Math.round(sv),
        target: Math.round(targetAtY),
      });
    }

    const equityNow = Math.max(20, 100 - inputs.currentAge);
    const equityAtRetirement = Math.max(20, 100 - inputs.retirementAge);

    return {
      corpus,
      targetCorpus,
      ratio,
      status,
      chartData,
      equityNow,
      equityAtRetirement,
      years,
      inflatedExpense,
    };
  }, [inputs]);

  // FIRE number
  const fireNumber = inputs.monthlyExpense * 12 * 25;
  const fireSIPRate = inputs.expectedReturn / 100 / 12;
  const fireMonths = (inputs.retirementAge - inputs.currentAge) * 12;
  const fireSIPNeeded =
    fireSIPRate === 0
      ? (fireNumber - inputs.currentSavings) / fireMonths
      : ((fireNumber -
          inputs.currentSavings * (1 + fireSIPRate) ** fireMonths) *
          fireSIPRate) /
        ((1 + fireSIPRate) ** fireMonths - 1);

  const statusConfig = {
    "on-track": {
      icon: CheckCircle,
      color: "text-success",
      label: "On Track",
      badge: "default" as const,
    },
    "needs-attention": {
      icon: AlertTriangle,
      color: "text-warning",
      label: "Needs Attention",
      badge: "secondary" as const,
    },
    critical: {
      icon: XCircle,
      color: "text-destructive",
      label: "Critical Gap",
      badge: "destructive" as const,
    },
  };
  const sc = statusConfig[result.status];
  const StatusIcon = sc.icon;

  const milestones = [
    {
      label: "Emergency Fund (6 months)",
      value: inputs.monthlyExpense * 6,
      age: inputs.currentAge + 1,
    },
    {
      label: "First 25L milestone",
      value: 2500000,
      age:
        inputs.currentAge +
        Math.ceil(
          (2500000 - inputs.currentSavings) / (inputs.monthlyContribution * 12),
        ),
    },
    {
      label: "Retirement corpus goal",
      value: result.targetCorpus,
      age: inputs.retirementAge,
    },
  ];

  const retirementRules = [
    {
      rule: "25x Rule",
      desc: "Corpus needed = 25x your annual expenses at retirement",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      rule: "4% SWR",
      desc: "Withdraw 4% of corpus annually for 30+ year sustainability (Bengen, 1994)",
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      rule: "100 − Age",
      desc: "Equity allocation % = 100 minus your age (classic glide path rule)",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      rule: "6-Month Fund",
      desc: "Always keep 6 months of expenses in liquid assets before investing",
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-premium-lg border-border/50 bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-chart-2/20">
              <PiggyBank className="h-6 w-6 text-success" />
            </div>
            Retirement Planning Model
          </CardTitle>
          <CardDescription className="text-base">
            Project your retirement corpus and assess readiness using
            industry-standard methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Education callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-success/10 to-chart-2/10 border border-success/20">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-sm">
                  4% Safe Withdrawal Rate — William Bengen, 1994
                </div>
                <div className="text-xs text-muted-foreground">
                  Bengen's landmark study showed that withdrawing 4% of your
                  retirement corpus annually (adjusted for inflation) has
                  survived all historical 30-year periods without running out of
                  money. This means you need 25x your annual expenses as your
                  retirement corpus (the "25x Rule").
                </div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30">
            {(
              [
                { label: "Current Age", key: "currentAge", min: 18, max: 80 },
                {
                  label: "Retirement Age",
                  key: "retirementAge",
                  min: 40,
                  max: 90,
                },
                {
                  label: `Current Savings (${sym})`,
                  key: "currentSavings",
                  min: 0,
                },
                {
                  label: `Monthly Contribution (${sym})`,
                  key: "monthlyContribution",
                  min: 0,
                },
                {
                  label: "Expected Return (%)",
                  key: "expectedReturn",
                  min: 1,
                  max: 30,
                  step: 0.5,
                },
                {
                  label: "Inflation Rate (%)",
                  key: "inflationRate",
                  min: 0,
                  max: 20,
                  step: 0.5,
                },
                {
                  label: `Monthly Expense (${sym})`,
                  key: "monthlyExpense",
                  min: 0,
                },
              ] as {
                label: string;
                key: keyof typeof inputs;
                min?: number;
                max?: number;
                step?: number;
              }[]
            ).map((f) => (
              <div key={f.key} className="space-y-1">
                <Label className="text-xs">{f.label}</Label>
                <Input
                  data-ocid={`financialmodel.retirement.${f.key}.input`}
                  type="number"
                  value={inputs[f.key]}
                  onChange={set(f.key)}
                  min={f.min}
                  max={f.max}
                  step={f.step ?? 1}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  Projected Corpus at {inputs.retirementAge}
                </p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {fmt(result.corpus, sym)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-1/10 to-chart-2/10">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  Target Corpus (4% rule)
                </p>
                <p className="text-2xl font-bold mt-1">
                  {fmt(result.targetCorpus, sym)}
                </p>
              </CardContent>
            </Card>
            <Card
              className={`bg-gradient-to-br ${result.status === "on-track" ? "from-success/10 to-chart-2/10" : result.status === "critical" ? "from-destructive/10 to-warning/10" : "from-warning/10 to-chart-3/10"}`}
            >
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  Retirement Readiness
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusIcon className={`h-6 w-6 ${sc.color}`} />
                  <span className={`text-lg font-bold ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(result.ratio * 100).toFixed(0)}% funded
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Savings Growth Projection
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={result.chartData}
                margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "Age",
                    position: "insideBottomRight",
                    offset: -4,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => fmt(v, sym)}
                  width={70}
                />
                <Tooltip
                  formatter={(v: number) => fmt(v, sym)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Projected Savings"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target Corpus"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Glide path */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-muted/30 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Age-Based Glide Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Equity now (age {inputs.currentAge})</span>
                  <Badge variant="outline">{result.equityNow}%</Badge>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-full transition-all"
                    style={{ width: `${result.equityNow}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Debt now</span>
                  <Badge variant="outline">{100 - result.equityNow}%</Badge>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span>Equity at retirement (age {inputs.retirementAge})</span>
                  <Badge variant="outline">{result.equityAtRetirement}%</Badge>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success/70 rounded-full transition-all"
                    style={{ width: `${result.equityAtRetirement}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span>Debt at retirement</span>
                  <Badge variant="outline">
                    {100 - result.equityAtRetirement}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-muted/30 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Key Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {milestones.map((m) => (
                  <div key={m.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-semibold">{fmt(m.value, sym)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* FIRE Number */}
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-lg">🔥</span> FIRE Number — Financial
                Independence, Retire Early
              </CardTitle>
              <CardDescription className="text-xs">
                Your FIRE number is the corpus that makes you financially
                independent — the point at which your investments can fund your
                lifestyle forever.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-violet-100/50 dark:bg-violet-900/20">
                  <div className="text-xs text-muted-foreground">
                    Annual Expenses
                  </div>
                  <div className="font-bold text-violet-600">
                    {fmt(inputs.monthlyExpense * 12, sym)}/yr
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-100/50 dark:bg-purple-900/20">
                  <div className="text-xs text-muted-foreground">
                    FIRE Number (25x)
                  </div>
                  <div className="font-bold text-purple-700 text-lg">
                    {fmt(fireNumber, sym)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/20">
                  <div className="text-xs text-muted-foreground">
                    SIP Needed to FIRE by {inputs.retirementAge}
                  </div>
                  <div className="font-bold text-indigo-600">
                    {fireSIPNeeded > 0
                      ? `${fmt(fireSIPNeeded, sym)}/mo`
                      : "Already Funded!"}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/30">
                <strong>How it works:</strong> Invest until your corpus = 25x
                annual expenses. Then withdraw 4% per year — your investments
                grow faster than you withdraw, making it theoretically infinite.
              </div>
            </CardContent>
          </Card>

          {/* Key Retirement Rules */}
          <Card className="bg-gradient-to-br from-muted/20 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Key Retirement Rules Every Investor Must Know
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {retirementRules.map((r) => (
                  <div key={r.rule} className={`p-3 rounded-lg ${r.bg}`}>
                    <div className={`font-bold text-sm mb-1 ${r.color}`}>
                      {r.rule}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.desc}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
