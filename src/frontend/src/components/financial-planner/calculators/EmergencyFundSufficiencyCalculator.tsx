import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function EmergencyFundSufficiencyCalculator() {
  const [currentFund, setCurrentFund] = useState("200000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("50000");
  const [jobStability, setJobStability] = useState("stable");

  const result = useMemo(() => {
    const CF = Number.parseFloat(currentFund) || 0;
    const ME = Number.parseFloat(monthlyExpenses) || 1;
    const monthsCovered = CF / ME;
    const requiredMonths =
      jobStability === "stable" ? 3 : jobStability === "moderate" ? 6 : 9;
    const score = Math.min(
      100,
      Math.round((monthsCovered / requiredMonths) * 100),
    );
    let recommendation = "";
    if (score >= 100) recommendation = "Your emergency fund is sufficient!";
    else if (score >= 70) recommendation = "Almost there — add a bit more.";
    else
      recommendation = `Build up to ${fmt(ME * requiredMonths)} (${requiredMonths} months coverage).`;
    return { monthsCovered, requiredMonths, score, recommendation };
  }, [currentFund, monthlyExpenses, jobStability]);

  const scoreColor =
    result.score >= 100
      ? "text-green-600"
      : result.score >= 70
        ? "text-yellow-600"
        : "text-red-500";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sufficiency Check Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Current Emergency Fund (₹)</Label>
            <Input
              value={currentFund}
              onChange={(e) => setCurrentFund(e.target.value)}
              type="number"
              data-ocid="emergencysufficiency.fund.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Monthly Expenses (₹)</Label>
            <Input
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              type="number"
              data-ocid="emergencysufficiency.expenses.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Job Stability</Label>
            <Select value={jobStability} onValueChange={setJobStability}>
              <SelectTrigger data-ocid="emergencysufficiency.stability.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stable">Stable (Govt/Large Corp)</SelectItem>
                <SelectItem value="moderate">
                  Moderate (Mid-size corp)
                </SelectItem>
                <SelectItem value="unstable">
                  Unstable (Freelance/Startup)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-base">Adequacy Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Months Covered
            </span>
            <span className="font-bold text-lg">
              {result.monthsCovered.toFixed(1)} months
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Recommended Coverage
            </span>
            <span className="font-semibold">
              {result.requiredMonths} months
            </span>
          </div>
          <div className="text-center">
            <span className={`text-4xl font-bold ${scoreColor}`}>
              {result.score}
            </span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <Progress value={result.score} className="h-3" />
          <p className="text-sm text-center font-medium">
            {result.recommendation}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
