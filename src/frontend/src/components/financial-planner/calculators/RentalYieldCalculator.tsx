import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function RentalYieldCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [propertyValue, setPropertyValue] = useState("5000000");
  const [monthlyRent, setMonthlyRent] = useState("25000");
  const [annualMaintenance, setAnnualMaintenance] = useState("24000");
  const [propertyTax, setPropertyTax] = useState("12000");

  const result = useMemo(() => {
    const PV = Number.parseFloat(propertyValue) || 1;
    const annualRent = (Number.parseFloat(monthlyRent) || 0) * 12;
    const maintenance = Number.parseFloat(annualMaintenance) || 0;
    const tax = Number.parseFloat(propertyTax) || 0;
    const grossYield = (annualRent / PV) * 100;
    const netIncome = annualRent - maintenance - tax;
    const netYield = (netIncome / PV) * 100;
    return { grossYield, netYield, netIncome, annualRent };
  }, [propertyValue, monthlyRent, annualMaintenance, propertyTax]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rental Yield Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Property Value ({sym})</Label>
            <Input
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              type="number"
              data-ocid="rentalyield.value.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Monthly Rent ({sym})</Label>
            <Input
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              type="number"
              data-ocid="rentalyield.rent.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Annual Maintenance ({sym})</Label>
            <Input
              value={annualMaintenance}
              onChange={(e) => setAnnualMaintenance(e.target.value)}
              type="number"
              data-ocid="rentalyield.maintenance.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Annual Property Tax ({sym})</Label>
            <Input
              value={propertyTax}
              onChange={(e) => setPropertyTax(e.target.value)}
              type="number"
              data-ocid="rentalyield.tax.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Annual Rental Income
            </span>
            <span className="font-semibold">{fmt(result.annualRent)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Gross Yield</span>
            <span className="font-semibold text-blue-600">
              {result.grossYield.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Annual Net Income
            </span>
            <span className="font-semibold">{fmt(result.netIncome)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Net Yield</span>
            <span className="font-bold text-2xl text-red-600">
              {result.netYield.toFixed(2)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
