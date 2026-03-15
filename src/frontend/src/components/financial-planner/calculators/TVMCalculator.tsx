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
    maximumFractionDigits: 2,
  }).format(n);

export function TVMCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [mode, setMode] = useState<"fv" | "pv" | "pmt">("fv");
  const [pv, setPv] = useState("100000");
  const [fv, setFv] = useState("200000");
  const [pmt, setPmt] = useState("5000");
  const [rate, setRate] = useState("8");
  const [periods, setPeriods] = useState("60");

  const result = useMemo(() => {
    const r = (Number.parseFloat(rate) || 0) / 100 / 12;
    const n = Number.parseFloat(periods) || 1;
    const PV = Number.parseFloat(pv) || 0;
    const FV = Number.parseFloat(fv) || 0;
    const PMT = Number.parseFloat(pmt) || 0;
    if (mode === "fv") {
      const computedFV =
        PV * (1 + r) ** n + (r > 0 ? PMT * (((1 + r) ** n - 1) / r) : PMT * n);
      return { label: "Future Value", value: computedFV };
    }
    if (mode === "pv") {
      const computedPV =
        FV / (1 + r) ** n + (r > 0 ? PMT * ((1 - (1 + r) ** -n) / r) : PMT * n);
      return { label: "Present Value", value: computedPV };
    }
    const computedPMT =
      r > 0 ? (PV * r * (1 + r) ** n) / ((1 + r) ** n - 1) : PV / n;
    return { label: "Payment (PMT)", value: computedPMT };
  }, [mode, pv, fv, pmt, rate, periods]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Time Value of Money Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Solve For</Label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as "fv" | "pv" | "pmt")}
            >
              <SelectTrigger data-ocid="tvm.mode.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fv">Future Value (FV)</SelectItem>
                <SelectItem value="pv">Present Value (PV)</SelectItem>
                <SelectItem value="pmt">Payment (PMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {mode !== "fv" && (
            <div className="space-y-1">
              <Label>Present Value ({sym})</Label>
              <Input
                value={pv}
                onChange={(e) => setPv(e.target.value)}
                type="number"
                data-ocid="tvm.pv.input"
              />
            </div>
          )}
          {mode === "pv" && (
            <div className="space-y-1">
              <Label>Future Value ({sym})</Label>
              <Input
                value={fv}
                onChange={(e) => setFv(e.target.value)}
                type="number"
                data-ocid="tvm.fv.input"
              />
            </div>
          )}
          {mode !== "pmt" && (
            <div className="space-y-1">
              <Label>Monthly Payment ({sym})</Label>
              <Input
                value={pmt}
                onChange={(e) => setPmt(e.target.value)}
                type="number"
                data-ocid="tvm.pmt.input"
              />
            </div>
          )}
          {mode === "fv" && (
            <div className="space-y-1">
              <Label>Present Value ({sym})</Label>
              <Input
                value={pv}
                onChange={(e) => setPv(e.target.value)}
                type="number"
                data-ocid="tvm.pv2.input"
              />
            </div>
          )}
          <div className="space-y-1">
            <Label>Annual Interest Rate (%)</Label>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              type="number"
              step="0.1"
              data-ocid="tvm.rate.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Number of Periods (Months)</Label>
            <Input
              value={periods}
              onChange={(e) => setPeriods(e.target.value)}
              type="number"
              data-ocid="tvm.periods.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-950/30 dark:to-purple-950/30 border-fuchsia-200 dark:border-fuchsia-800">
        <CardHeader>
          <CardTitle className="text-base">Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground mb-2">{result.label}</p>
            <p className="font-bold text-4xl text-fuchsia-600">
              {fmt(result.value)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
