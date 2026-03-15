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

function calcOldRegimeTax(taxableIncome: number): number {
  let tax = 0;
  if (taxableIncome <= 250000) tax = 0;
  else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
  else if (taxableIncome <= 1000000)
    tax = 12500 + (taxableIncome - 500000) * 0.2;
  else tax = 112500 + (taxableIncome - 1000000) * 0.3;
  return tax * 1.04; // 4% cess
}

function calcNewRegimeTax(income: number): number {
  let tax = 0;
  if (income <= 300000) tax = 0;
  else if (income <= 600000) tax = (income - 300000) * 0.05;
  else if (income <= 900000) tax = 15000 + (income - 600000) * 0.1;
  else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15;
  else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.2;
  else tax = 150000 + (income - 1500000) * 0.3;
  return tax * 1.04; // 4% cess
}

export function TaxCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [income, setIncome] = useState("1200000");
  const [hra, setHra] = useState("120000");
  const [section80C, setSection80C] = useState("150000");
  const [section80D, setSection80D] = useState("25000");
  const [otherDeductions, setOtherDeductions] = useState("50000");

  const result = useMemo(() => {
    const I = Number.parseFloat(income) || 0;
    const hraEx = Number.parseFloat(hra) || 0;
    const c80 = Math.min(Number.parseFloat(section80C) || 0, 150000);
    const d80 = Number.parseFloat(section80D) || 0;
    const other = Number.parseFloat(otherDeductions) || 0;
    const standardDeduction = 50000;
    const oldTaxableIncome = Math.max(
      0,
      I - standardDeduction - hraEx - c80 - d80 - other,
    );
    const oldTax = calcOldRegimeTax(oldTaxableIncome);
    const newTax = calcNewRegimeTax(I);
    const recommendation = newTax < oldTax ? "New Regime" : "Old Regime";
    const saving = Math.abs(newTax - oldTax);
    return { oldTaxableIncome, oldTax, newTax, recommendation, saving };
  }, [income, hra, section80C, section80D, otherDeductions]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Income Tax Inputs (FY 2024-25)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Annual Income ({sym})</Label>
            <Input
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              type="number"
              data-ocid="tax.income.input"
            />
          </div>
          <div className="space-y-1">
            <Label>HRA Exemption ({sym})</Label>
            <Input
              value={hra}
              onChange={(e) => setHra(e.target.value)}
              type="number"
              data-ocid="tax.hra.input"
            />
          </div>
          <div className="space-y-1">
            <Label>80C Investments ({sym}, max 1.5L)</Label>
            <Input
              value={section80C}
              onChange={(e) => setSection80C(e.target.value)}
              type="number"
              data-ocid="tax.80c.input"
            />
          </div>
          <div className="space-y-1">
            <Label>80D Health Insurance ({sym})</Label>
            <Input
              value={section80D}
              onChange={(e) => setSection80D(e.target.value)}
              type="number"
              data-ocid="tax.80d.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Other Deductions ({sym})</Label>
            <Input
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
              type="number"
              data-ocid="tax.other.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-base">Tax Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Old Regime Taxable Income
            </span>
            <span className="font-semibold">
              {fmt(result.oldTaxableIncome)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Old Regime Tax (incl. cess)
            </span>
            <span className="font-semibold text-purple-600">
              {fmt(result.oldTax)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              New Regime Tax (incl. cess)
            </span>
            <span className="font-semibold text-violet-600">
              {fmt(result.newTax)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Recommended</span>
            <span className="font-bold text-lg text-green-600">
              {result.recommendation}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-bold">Tax Saving</span>
            <span className="font-bold text-green-600">
              {fmt(result.saving)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
