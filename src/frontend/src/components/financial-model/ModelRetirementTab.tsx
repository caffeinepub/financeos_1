import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { PiggyBank, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCurrency } from "../../contexts/CurrencyContext";

type RetirementRiskProfile = "conservative" | "moderate" | "aggressive";

interface AllocationModel {
  name: string;
  allocation: Array<{ name: string; value: number; fill: string }>;
  description: string;
  expectedReturn: number;
}

const allocationModels: Record<RetirementRiskProfile, AllocationModel> = {
  conservative: {
    name: "Conservative (Low Risk)",
    allocation: [
      { name: "Debt Mutual Funds", value: 40, fill: "#3b82f6" },
      { name: "Fixed Deposits", value: 30, fill: "#f59e0b" },
      { name: "Bonds", value: 20, fill: "#8b5cf6" },
      { name: "Index ETFs", value: 10, fill: "#10b981" },
    ],
    description:
      "Focus on capital preservation with minimal risk. Suitable for those nearing retirement or with low risk tolerance.",
    expectedReturn: 7.5,
  },
  moderate: {
    name: "Moderate (Balanced Risk)",
    allocation: [
      { name: "Debt Mutual Funds", value: 35, fill: "#3b82f6" },
      { name: "Index ETFs", value: 30, fill: "#10b981" },
      { name: "Fixed Deposits", value: 20, fill: "#f59e0b" },
      { name: "Bonds", value: 15, fill: "#8b5cf6" },
    ],
    description:
      "Balanced approach with moderate growth potential. Suitable for mid-career professionals planning retirement.",
    expectedReturn: 9.5,
  },
  aggressive: {
    name: "Aggressive (Higher Risk)",
    allocation: [
      { name: "Index ETFs", value: 40, fill: "#10b981" },
      { name: "Debt Mutual Funds", value: 30, fill: "#3b82f6" },
      { name: "Equity Mutual Funds", value: 20, fill: "#ef4444" },
      { name: "Bonds", value: 10, fill: "#8b5cf6" },
    ],
    description:
      "Growth-focused with higher risk tolerance. Suitable for younger investors with longer time horizons.",
    expectedReturn: 12,
  },
};

export function ModelRetirementTab() {
  const { formatCurrency, country } = useCurrency();
  const [selectedProfile, setSelectedProfile] =
    useState<RetirementRiskProfile>("moderate");
  const [initialCapital, setInitialCapital] = useState<string>("1000000");
  const [monthlySIP, setMonthlySIP] = useState<string>("25000");
  const [yearsToRetirement, setYearsToRetirement] = useState<string>("20");

  const model = allocationModels[selectedProfile];
  const capital = Number.parseFloat(initialCapital) || 0;
  const sip = Number.parseFloat(monthlySIP) || 0;
  const years = Number.parseInt(yearsToRetirement) || 20;

  const calculateProjection = () => {
    const monthlyRate = model.expectedReturn / 100 / 12;
    const months = years * 12;
    const lumpsumFV = capital * (1 + monthlyRate) ** months;
    const sipFV =
      sip *
      (((1 + monthlyRate) ** months - 1) / monthlyRate) *
      (1 + monthlyRate);
    return lumpsumFV + sipFV;
  };

  const projectedCorpus = calculateProjection();

  const projectionData = Array.from({ length: Math.min(years, 25) }, (_, i) => {
    const year = i + 1;
    const months = year * 12;
    const monthlyRate = model.expectedReturn / 100 / 12;
    const lumpsumFV = capital * (1 + monthlyRate) ** months;
    const sipFV =
      sip *
      (((1 + monthlyRate) ** months - 1) / monthlyRate) *
      (1 + monthlyRate);
    return { year: `Year ${year}`, corpus: Math.round(lumpsumFV + sipFV) };
  });

  const allocationAmounts = model.allocation.map((item) => ({
    ...item,
    amount: (capital * item.value) / 100,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-sm border border-slate-100 bg-white">
          <CardHeader
            style={{ borderLeft: "3px solid #10b981", paddingLeft: "1.25rem" }}
          >
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Select Your Risk Profile
            </CardTitle>
            <CardDescription>
              Choose a retirement strategy based on your risk tolerance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Risk Profile</Label>
              <Select
                value={selectedProfile}
                onValueChange={(value) =>
                  setSelectedProfile(value as RetirementRiskProfile)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      Conservative (Low Risk)
                    </div>
                  </SelectItem>
                  <SelectItem value="moderate">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Moderate (Balanced)
                    </div>
                  </SelectItem>
                  <SelectItem value="aggressive">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-500" />
                      Aggressive (Growth)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>{model.name}</strong>
                <p className="mt-1">{model.description}</p>
                <p className="mt-2 text-xs">
                  Expected Annual Return:{" "}
                  <strong>{model.expectedReturn}%</strong>
                </p>
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Initial Capital ({country.symbol})</Label>
                <Input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  min="0"
                  step="10000"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly SIP ({country.symbol})</Label>
                <Input
                  type="number"
                  value={monthlySIP}
                  onChange={(e) => setMonthlySIP(e.target.value)}
                  min="0"
                  step="1000"
                />
              </div>
              <div className="space-y-2">
                <Label>Years to Retirement</Label>
                <Input
                  type="number"
                  value={yearsToRetirement}
                  onChange={(e) => setYearsToRetirement(e.target.value)}
                  min="1"
                  max="40"
                />
              </div>
            </div>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Projected Retirement Corpus
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatCurrency(projectedCorpus)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    After {years} years at {model.expectedReturn}% annual return
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-slate-100 bg-white">
          <CardHeader
            style={{ borderLeft: "3px solid #10b981", paddingLeft: "1.25rem" }}
          >
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Suggested Asset Allocation
            </CardTitle>
            <CardDescription>
              Recommended distribution for {model.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={model.allocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) =>
                    `${entry.name.split(" ")[0]}: ${entry.value}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {model.allocation.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm mb-3">
                Allocation Breakdown
              </h4>
              {allocationAmounts.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatCurrency(item.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.value}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm border border-slate-100 bg-white">
        <CardHeader
          style={{ borderLeft: "3px solid #10b981", paddingLeft: "1.25rem" }}
        >
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Corpus Growth Projection
          </CardTitle>
          <CardDescription>
            Year-wise retirement corpus growth over {years} years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Corpus"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="corpus"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-xl border border-indigo-100 bg-indigo-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Capital Preservation</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on safer instruments to protect your retirement corpus
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-emerald-100 bg-emerald-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Steady Income</h4>
                <p className="text-sm text-muted-foreground">
                  Generate regular income through dividends and interest
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-amber-100 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <PiggyBank className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Tax Efficiency</h4>
                <p className="text-sm text-muted-foreground">
                  Optimize tax benefits through strategic asset allocation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertDescription className="text-sm">
          <strong>Disclaimer:</strong> This is a suggested model portfolio for
          retirement planning based on industry standards. Actual returns may
          vary based on market conditions. Please consult with a certified
          financial advisor before making investment decisions. Past performance
          does not guarantee future results.
        </AlertDescription>
      </Alert>
    </div>
  );
}
