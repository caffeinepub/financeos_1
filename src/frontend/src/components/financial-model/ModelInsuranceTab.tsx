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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  BookOpen,
  Heart,
  Info,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

function fmt(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function ModelInsuranceTab() {
  const [life, setLife] = useState({
    annualIncome: 1200000,
    liabilities: 2000000,
    dependents: 2,
    currentCover: 5000000,
  });
  const [health, setHealth] = useState({
    familySize: 4,
    age: 35,
    cityTier: "tier1",
    currentCover: 500000,
  });
  const [term, setTerm] = useState({
    age: 30,
    income: 1200000,
    termYears: 30,
    currentCover: 0,
  });
  const [critical, setCritical] = useState({
    age: 35,
    income: 1200000,
    currentCover: 0,
  });
  const [hlv, setHlv] = useState({
    currentAge: 30,
    retirementAge: 60,
    annualIncome: 1200000,
    consumptionPct: 30,
  });

  // Life insurance
  const lifeRecommended = life.annualIncome * 12 + life.liabilities;
  const lifeGap = Math.max(0, lifeRecommended - life.currentCover);

  // Health insurance
  const healthBase =
    health.cityTier === "tier1"
      ? 1000000
      : health.cityTier === "tier2"
        ? 700000
        : 500000;
  const healthExtra =
    (health.familySize - 1) * 200000 + (health.age > 45 ? 500000 : 0);
  const healthRecommended = healthBase + healthExtra;
  const healthGap = Math.max(0, healthRecommended - health.currentCover);

  // Term insurance
  const termRecommended = term.income * 15;
  const termPremiumEstimate = Math.round((term.income * 15 * 0.004) / 12);
  const termGap = Math.max(0, termRecommended - term.currentCover);

  // Critical illness
  const criticalRecommended = critical.income * 5;
  const criticalGap = Math.max(0, criticalRecommended - critical.currentCover);

  // HLV calculation
  const workingYears = Math.max(0, hlv.retirementAge - hlv.currentAge);
  const personalConsumption = hlv.annualIncome * (hlv.consumptionPct / 100);
  const hlvRecommended =
    (hlv.annualIncome - personalConsumption) * workingYears;

  const CoverageBar = ({
    recommended,
    current,
    label,
  }: { recommended: number; current: number; label: string }) => {
    const pct = Math.min(100, (current / recommended) * 100);
    const color =
      pct >= 100 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-destructive";
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold">{pct.toFixed(0)}% covered</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-premium-lg border-border/50 bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-info/20 to-chart-4/20">
              <Shield className="h-6 w-6 text-info" />
            </div>
            Insurance Planning Model
          </CardTitle>
          <CardDescription className="text-base">
            Calculate your optimal insurance coverage across all categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* HLV Method */}
          <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Human Life Value (HLV) Method — IRDAI Recommended
              </CardTitle>
              <CardDescription className="text-xs">
                HLV calculates the economic value of your life based on future
                earnings, determining the life insurance needed to replace your
                income for dependents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Current Age</Label>
                  <Input
                    data-ocid="financialmodel.insurance.hlv.age.input"
                    type="number"
                    value={hlv.currentAge}
                    onChange={(e) =>
                      setHlv((p) => ({
                        ...p,
                        currentAge: Number(e.target.value),
                      }))
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Retirement Age</Label>
                  <Input
                    data-ocid="financialmodel.insurance.hlv.retirement.input"
                    type="number"
                    value={hlv.retirementAge}
                    onChange={(e) =>
                      setHlv((p) => ({
                        ...p,
                        retirementAge: Number(e.target.value),
                      }))
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Annual Income (₹)</Label>
                  <Input
                    data-ocid="financialmodel.insurance.hlv.income.input"
                    type="number"
                    value={hlv.annualIncome}
                    onChange={(e) =>
                      setHlv((p) => ({
                        ...p,
                        annualIncome: Number(e.target.value),
                      }))
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Personal Consumption (%)</Label>
                  <Input
                    data-ocid="financialmodel.insurance.hlv.consumption.input"
                    type="number"
                    value={hlv.consumptionPct}
                    onChange={(e) =>
                      setHlv((p) => ({
                        ...p,
                        consumptionPct: Number(e.target.value),
                      }))
                    }
                    className="h-8 text-sm"
                    min={0}
                    max={100}
                  />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-100/50 dark:bg-blue-900/20 space-y-2">
                <div className="text-xs font-mono text-muted-foreground">
                  HLV = (Annual Income − Personal Consumption) × Working Years
                  Remaining
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">
                      Working Years
                    </div>
                    <div className="font-bold text-blue-700">
                      {workingYears} yrs
                    </div>
                  </div>
                  <div className="text-2xl text-muted-foreground">=</div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">
                      HLV-Based Cover
                    </div>
                    <div className="font-bold text-blue-700 text-xl">
                      {fmt(hlvRecommended)}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    IRDAI Recommended
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Life Insurance */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" /> Life Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Annual Income (₹)</Label>
                    <Input
                      data-ocid="financialmodel.insurance.life.income.input"
                      type="number"
                      value={life.annualIncome}
                      onChange={(e) =>
                        setLife((p) => ({
                          ...p,
                          annualIncome: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Liabilities (₹)</Label>
                    <Input
                      data-ocid="financialmodel.insurance.life.liabilities.input"
                      type="number"
                      value={life.liabilities}
                      onChange={(e) =>
                        setLife((p) => ({
                          ...p,
                          liabilities: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Dependents</Label>
                    <Input
                      data-ocid="financialmodel.insurance.life.dependents.input"
                      type="number"
                      value={life.dependents}
                      onChange={(e) =>
                        setLife((p) => ({
                          ...p,
                          dependents: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                      min={0}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Current Cover (₹)</Label>
                    <Input
                      data-ocid="financialmodel.insurance.life.cover.input"
                      type="number"
                      value={life.currentCover}
                      onChange={(e) =>
                        setLife((p) => ({
                          ...p,
                          currentCover: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-primary/10 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Recommended Cover
                    </span>
                    <span className="font-bold text-primary">
                      {fmt(lifeRecommended)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage Gap</span>
                    <Badge variant={lifeGap > 0 ? "destructive" : "default"}>
                      {lifeGap > 0 ? fmt(lifeGap) : "Fully Covered"}
                    </Badge>
                  </div>
                </div>
                <CoverageBar
                  recommended={lifeRecommended}
                  current={life.currentCover}
                  label="Life Insurance Coverage"
                />
              </CardContent>
            </Card>

            {/* Health Insurance */}
            <Card className="bg-gradient-to-br from-success/5 to-chart-2/5 border-success/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" /> Health
                  Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Family Size</Label>
                    <Input
                      data-ocid="financialmodel.insurance.health.family.input"
                      type="number"
                      value={health.familySize}
                      onChange={(e) =>
                        setHealth((p) => ({
                          ...p,
                          familySize: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                      min={1}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Primary Age</Label>
                    <Input
                      data-ocid="financialmodel.insurance.health.age.input"
                      type="number"
                      value={health.age}
                      onChange={(e) =>
                        setHealth((p) => ({
                          ...p,
                          age: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">City Tier</Label>
                    <Select
                      value={health.cityTier}
                      onValueChange={(v) =>
                        setHealth((p) => ({ ...p, cityTier: v }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="financialmodel.insurance.health.city.select"
                        className="h-8 text-sm"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tier1">Tier 1 (Metro)</SelectItem>
                        <SelectItem value="tier2">Tier 2</SelectItem>
                        <SelectItem value="tier3">Tier 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Current Cover (₹)</Label>
                    <Input
                      data-ocid="financialmodel.insurance.health.cover.input"
                      type="number"
                      value={health.currentCover}
                      onChange={(e) =>
                        setHealth((p) => ({
                          ...p,
                          currentCover: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-success/10 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Recommended Cover
                    </span>
                    <span className="font-bold text-success">
                      {fmt(healthRecommended)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage Gap</span>
                    <Badge variant={healthGap > 0 ? "destructive" : "default"}>
                      {healthGap > 0 ? fmt(healthGap) : "Fully Covered"}
                    </Badge>
                  </div>
                </div>
                <CoverageBar
                  recommended={healthRecommended}
                  current={health.currentCover}
                  label="Health Insurance Coverage"
                />
              </CardContent>
            </Card>

            {/* Term Insurance */}
            <Card className="bg-gradient-to-br from-warning/5 to-chart-3/5 border-warning/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-warning" /> Term Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Age</Label>
                    <Input
                      data-ocid="financialmodel.insurance.term.age.input"
                      type="number"
                      value={term.age}
                      onChange={(e) =>
                        setTerm((p) => ({ ...p, age: Number(e.target.value) }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Annual Income (₹)</Label>
                    <Input
                      data-ocid="financialmodel.insurance.term.income.input"
                      type="number"
                      value={term.income}
                      onChange={(e) =>
                        setTerm((p) => ({
                          ...p,
                          income: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Term Period (yrs)</Label>
                    <Input
                      data-ocid="financialmodel.insurance.term.period.input"
                      type="number"
                      value={term.termYears}
                      onChange={(e) =>
                        setTerm((p) => ({
                          ...p,
                          termYears: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Current Cover (₹)</Label>
                    <Input
                      data-ocid="financialmodel.insurance.term.cover.input"
                      type="number"
                      value={term.currentCover}
                      onChange={(e) =>
                        setTerm((p) => ({
                          ...p,
                          currentCover: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-warning/10 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Recommended Cover
                    </span>
                    <span className="font-bold">{fmt(termRecommended)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Est. Monthly Premium
                    </span>
                    <span className="font-bold text-warning">
                      {fmt(termPremiumEstimate)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage Gap</span>
                    <Badge variant={termGap > 0 ? "destructive" : "default"}>
                      {termGap > 0 ? fmt(termGap) : "Fully Covered"}
                    </Badge>
                  </div>
                </div>
                <CoverageBar
                  recommended={termRecommended}
                  current={term.currentCover}
                  label="Term Insurance Coverage"
                />
              </CardContent>
            </Card>

            {/* Critical Illness */}
            <Card className="bg-gradient-to-br from-destructive/5 to-chart-4/5 border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />{" "}
                  Critical Illness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Age</Label>
                    <Input
                      data-ocid="financialmodel.insurance.critical.age.input"
                      type="number"
                      value={critical.age}
                      onChange={(e) =>
                        setCritical((p) => ({
                          ...p,
                          age: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Annual Income (₹)</Label>
                    <Input
                      data-ocid="financialmodel.insurance.critical.income.input"
                      type="number"
                      value={critical.income}
                      onChange={(e) =>
                        setCritical((p) => ({
                          ...p,
                          income: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs">
                      Current Critical Illness Cover (₹)
                    </Label>
                    <Input
                      data-ocid="financialmodel.insurance.critical.cover.input"
                      type="number"
                      value={critical.currentCover}
                      onChange={(e) =>
                        setCritical((p) => ({
                          ...p,
                          currentCover: Number(e.target.value),
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-destructive/10 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Recommended Cover (5x income)
                    </span>
                    <span className="font-bold text-destructive">
                      {fmt(criticalRecommended)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage Gap</span>
                    <Badge
                      variant={criticalGap > 0 ? "destructive" : "default"}
                    >
                      {criticalGap > 0 ? fmt(criticalGap) : "Fully Covered"}
                    </Badge>
                  </div>
                </div>
                <CoverageBar
                  recommended={criticalRecommended}
                  current={critical.currentCover}
                  label="Critical Illness Coverage"
                />
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-info/10 to-chart-4/10 border-info/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-info" /> Key Insurance Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-info font-bold">•</span>
                  <span>
                    Buy term insurance early — premiums increase significantly
                    with age
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info font-bold">•</span>
                  <span>
                    Health insurance should be bought when young and healthy for
                    better terms
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info font-bold">•</span>
                  <span>
                    Life cover = 10–15x annual income + all outstanding
                    liabilities (IRDAI guideline)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info font-bold">•</span>
                  <span>
                    Critical illness cover protects against income loss during
                    treatment periods
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info font-bold">•</span>
                  <span>
                    Review insurance needs every 3–5 years or after major life
                    events (marriage, child, home loan)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-info font-bold">•</span>
                  <span>
                    Never mix insurance and investment — avoid ULIPs and
                    endowment plans; buy pure term + invest the rest
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
