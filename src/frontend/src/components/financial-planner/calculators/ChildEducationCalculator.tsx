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

export function ChildEducationCalculator() {
  const [childAge, setChildAge] = useState("5");
  const [educationAge, setEducationAge] = useState("18");
  const [currentCost, setCurrentCost] = useState("2000000");
  const [eduInflation, setEduInflation] = useState("8");
  const [expectedReturn, setExpectedReturn] = useState("12");

  const result = useMemo(() => {
    const years =
      (Number.parseFloat(educationAge) || 18) -
      (Number.parseFloat(childAge) || 5);
    const CC = Number.parseFloat(currentCost) || 0;
    const inf = (Number.parseFloat(eduInflation) || 8) / 100;
    const r = (Number.parseFloat(expectedReturn) || 12) / 100;
    const rm = r / 12;
    const futureCost = CC * (1 + inf) ** years;
    const months = years * 12;
    const monthlySIP =
      rm > 0
        ? (futureCost * rm) / ((1 + rm) ** months - 1)
        : futureCost / months;
    return { futureCost, monthlySIP, years };
  }, [childAge, educationAge, currentCost, eduInflation, expectedReturn]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Child Education Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Child's Current Age</Label>
            <Input
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              type="number"
              data-ocid="childedu.childage.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Education Start Age</Label>
            <Input
              value={educationAge}
              onChange={(e) => setEducationAge(e.target.value)}
              type="number"
              data-ocid="childedu.eduage.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Current Education Cost (₹)</Label>
            <Input
              value={currentCost}
              onChange={(e) => setCurrentCost(e.target.value)}
              type="number"
              data-ocid="childedu.cost.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Education Inflation (%)</Label>
            <Input
              value={eduInflation}
              onChange={(e) => setEduInflation(e.target.value)}
              type="number"
              data-ocid="childedu.inflation.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Expected Return (%)</Label>
            <Input
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              type="number"
              data-ocid="childedu.return.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Years to Education
            </span>
            <span className="font-semibold">{result.years} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Future Education Cost
            </span>
            <span className="font-semibold text-pink-600">
              {fmt(result.futureCost)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Monthly SIP Needed</span>
            <span className="font-bold text-2xl text-pink-600">
              {fmt(result.monthlySIP)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
