import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function GratuityCalculator() {
  const [salary, setSalary] = useState("50000");
  const [yearsOfService, setYearsOfService] = useState("10");

  const result = useMemo(() => {
    const S = Number.parseFloat(salary) || 0;
    const Y = Number.parseFloat(yearsOfService) || 0;
    const gratuity = (S * Y * 15) / 26;
    return {
      gratuity,
      taxFreeLimit: 2000000,
      taxable: Math.max(0, gratuity - 2000000),
    };
  }, [salary, yearsOfService]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gratuity Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Last Basic + DA Salary (₹/month)</Label>
            <Input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              type="number"
              data-ocid="gratuity.salary.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Years of Service</Label>
            <Input
              value={yearsOfService}
              onChange={(e) => setYearsOfService(e.target.value)}
              type="number"
              step="0.5"
              data-ocid="gratuity.years.input"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Formula: (Basic + DA) × Years of Service × 15/26
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-200 dark:border-indigo-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Gratuity Amount
            </span>
            <span className="font-bold text-2xl text-indigo-600">
              {fmt(result.gratuity)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Tax-Free Limit
            </span>
            <span className="font-semibold">{fmt(result.taxFreeLimit)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Taxable Gratuity</span>
            <span
              className={`font-bold text-lg ${result.taxable > 0 ? "text-orange-500" : "text-green-600"}`}
            >
              {fmt(result.taxable)}
            </span>
          </div>
          {result.gratuity < 5 * 12 * (Number.parseFloat(salary) || 0) && (
            <p className="text-xs text-muted-foreground">
              Note: Gratuity is payable after 5 years of continuous service.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
