import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function FDCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7");
  const [tenure, setTenure] = useState("12");
  const [compounding, setCompounding] = useState("4");

  const result = useMemo(() => {
    const P = Number.parseFloat(principal) || 0;
    const r = (Number.parseFloat(rate) || 0) / 100;
    const t = (Number.parseFloat(tenure) || 0) / 12;
    const n = Number.parseFloat(compounding) || 4;
    const maturity = P * (1 + r / n) ** (n * t);
    return { maturity, interest: maturity - P };
  }, [principal, rate, tenure, compounding]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">FD Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Principal Amount (₹)</Label>
            <Input
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              type="number"
              data-ocid="fd.principal.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="fd.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Tenure (Months)</Label>
            <Input
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              type="number"
              data-ocid="fd.tenure.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Compounding Frequency</Label>
            <Select value={compounding} onValueChange={setCompounding}>
              <SelectTrigger data-ocid="fd.compounding.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="2">Half-Yearly</SelectItem>
                <SelectItem value="1">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Principal</span>
            <span className="font-semibold">
              {fmt(Number.parseFloat(principal) || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Interest Earned
            </span>
            <span className="font-semibold text-green-600">
              {fmt(result.interest)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Maturity Amount</span>
            <span className="font-bold text-2xl text-yellow-600">
              {fmt(result.maturity)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
