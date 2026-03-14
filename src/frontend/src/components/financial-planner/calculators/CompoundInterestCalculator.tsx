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

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("10");
  const [time, setTime] = useState("5");
  const [frequency, setFrequency] = useState("12");

  const result = useMemo(() => {
    const P = Number.parseFloat(principal) || 0;
    const r = (Number.parseFloat(rate) || 0) / 100;
    const t = Number.parseFloat(time) || 0;
    const n = Number.parseFloat(frequency) || 1;
    const totalAmount = P * (1 + r / n) ** (n * t);
    const compoundInterest = totalAmount - P;
    const simpleInterest = P * r * t;
    return {
      totalAmount,
      compoundInterest,
      simpleInterest,
      extra: compoundInterest - simpleInterest,
    };
  }, [principal, rate, time, frequency]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compound Interest Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Principal (₹)</Label>
            <Input
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              type="number"
              data-ocid="compoundinterest.principal.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="compoundinterest.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Time (Years)</Label>
            <Input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              type="number"
              data-ocid="compoundinterest.time.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Compounding Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger data-ocid="compoundinterest.frequency.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="365">Daily</SelectItem>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="1">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Compound Interest
            </span>
            <span className="font-semibold text-orange-600">
              {fmt(result.compoundInterest)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Simple Interest (comparison)
            </span>
            <span className="font-semibold text-muted-foreground">
              {fmt(result.simpleInterest)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Extra from Compounding
            </span>
            <span className="font-semibold text-green-600">
              {fmt(result.extra)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Total Amount</span>
            <span className="font-bold text-2xl text-orange-600">
              {fmt(result.totalAmount)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
