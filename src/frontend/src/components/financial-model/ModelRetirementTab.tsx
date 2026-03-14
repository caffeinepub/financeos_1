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

function fmt(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function ModelRetirementTab() {
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
    const targetCorpus = (inflatedExpense * 12) / 0.04; // 4% withdrawal rule

    const ratio = corpus / targetCorpus;
    const status =
      ratio >= 1 ? "on-track" : ratio >= 0.7 ? "needs-attention" : "critical";

    // Growth chart data (every 5 years)
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

    // Glide path — age-based equity allocation
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
            Project your retirement corpus and assess readiness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                { label: "Current Savings (₹)", key: "currentSavings", min: 0 },
                {
                  label: "Monthly Contribution (₹)",
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
                { label: "Monthly Expense (₹)", key: "monthlyExpense", min: 0 },
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
                  {fmt(result.corpus)}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-chart-1/10 to-chart-2/10">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  Target Corpus (4% rule)
                </p>
                <p className="text-2xl font-bold mt-1">
                  {fmt(result.targetCorpus)}
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
                  tickFormatter={(v) => fmt(v)}
                  width={70}
                />
                <Tooltip
                  formatter={(v: number) => fmt(v)}
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
                <div className="flex justify-between items-center">
                  <span>Debt now</span>
                  <Badge variant="outline">{100 - result.equityNow}%</Badge>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span>Equity at retirement (age {inputs.retirementAge})</span>
                  <Badge variant="outline">{result.equityAtRetirement}%</Badge>
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
                    <span className="font-semibold">{fmt(m.value)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
