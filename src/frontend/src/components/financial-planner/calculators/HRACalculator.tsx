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
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function HRACalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [basicSalary, setBasicSalary] = useState("50000");
  const [hraReceived, setHraReceived] = useState("20000");
  const [rentPaid, setRentPaid] = useState("18000");
  const [city, setCity] = useState("metro");

  const result = useMemo(() => {
    const basic = Number.parseFloat(basicSalary) || 0;
    const hra = Number.parseFloat(hraReceived) || 0;
    const rent = Number.parseFloat(rentPaid) || 0;
    const cityPercent = city === "metro" ? 0.5 : 0.4;
    const condition1 = hra;
    const condition2 = rent - 0.1 * basic;
    const condition3 = basic * cityPercent;
    const exemption = Math.max(0, Math.min(condition1, condition2, condition3));
    const taxableHRA = hra - exemption;
    return { exemption, taxableHRA, condition1, condition2, condition3 };
  }, [basicSalary, hraReceived, rentPaid, city]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">HRA Inputs (Monthly)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Basic Salary ({sym}/month)</Label>
            <Input
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              type="number"
              data-ocid="hra.basic.input"
            />
          </div>
          <div className="space-y-1">
            <Label>HRA Received ({sym}/month)</Label>
            <Input
              value={hraReceived}
              onChange={(e) => setHraReceived(e.target.value)}
              type="number"
              data-ocid="hra.received.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Rent Paid ({sym}/month)</Label>
            <Input
              value={rentPaid}
              onChange={(e) => setRentPaid(e.target.value)}
              type="number"
              data-ocid="hra.rent.input"
            />
          </div>
          <div className="space-y-1">
            <Label>City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger data-ocid="hra.city.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metro">
                  Metro (Delhi, Mumbai, Chennai, Kolkata)
                </SelectItem>
                <SelectItem value="nonmetro">Non-Metro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30 border-fuchsia-200 dark:border-fuchsia-800">
        <CardHeader>
          <CardTitle className="text-base">HRA Exemption (Monthly)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Actual HRA Received
            </span>
            <span className="font-semibold">{fmt(result.condition1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Rent Paid - 10% Basic
            </span>
            <span className="font-semibold">
              {fmt(Math.max(0, result.condition2))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              {city === "metro" ? "50%" : "40%"} of Basic
            </span>
            <span className="font-semibold">{fmt(result.condition3)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">HRA Exemption</span>
            <span className="font-bold text-lg text-green-600">
              {fmt(result.exemption)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-bold">Taxable HRA</span>
            <span className="font-bold text-fuchsia-600">
              {fmt(result.taxableHRA)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
