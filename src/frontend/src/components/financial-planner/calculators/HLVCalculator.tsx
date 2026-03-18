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
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";

function fmt(n: number, sym: string) {
  if (n >= 1e7) return `${sym}${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `${sym}${(n / 1e5).toFixed(2)} L`;
  return `${sym}${n.toLocaleString("en-IN")}`;
}

export function HLVCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [hlv, setHlv] = useState({
    currentAge: 30,
    retirementAge: 60,
    annualIncome: 1200000,
    consumptionPct: 30,
  });

  const workingYears = Math.max(0, hlv.retirementAge - hlv.currentAge);
  const personalConsumption = hlv.annualIncome * (hlv.consumptionPct / 100);
  const hlvRecommended =
    (hlv.annualIncome - personalConsumption) * workingYears;

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Human Life Value (HLV) Method — IRDAI Recommended
        </CardTitle>
        <CardDescription className="text-xs">
          HLV calculates the economic value of your life based on future
          earnings, determining the life insurance needed to replace your income
          for dependents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Current Age</Label>
            <Input
              data-ocid="financialplanner.hlv.age.input"
              type="number"
              value={hlv.currentAge}
              onChange={(e) =>
                setHlv((p) => ({ ...p, currentAge: Number(e.target.value) }))
              }
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Retirement Age</Label>
            <Input
              data-ocid="financialplanner.hlv.retirement.input"
              type="number"
              value={hlv.retirementAge}
              onChange={(e) =>
                setHlv((p) => ({ ...p, retirementAge: Number(e.target.value) }))
              }
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Annual Income ({sym})</Label>
            <Input
              data-ocid="financialplanner.hlv.income.input"
              type="number"
              value={hlv.annualIncome}
              onChange={(e) =>
                setHlv((p) => ({ ...p, annualIncome: Number(e.target.value) }))
              }
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Personal Consumption (%)</Label>
            <Input
              data-ocid="financialplanner.hlv.consumption.input"
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
              <div className="text-xs text-muted-foreground">Working Years</div>
              <div className="font-bold text-blue-700">{workingYears} yrs</div>
            </div>
            <div className="text-2xl text-muted-foreground">=</div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">
                HLV-Based Cover
              </div>
              <div className="font-bold text-blue-700 text-xl">
                {fmt(hlvRecommended, sym)}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              IRDAI Recommended
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
