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
    maximumFractionDigits: 2,
  }).format(n);

export function GSTCalculator() {
  const [amount, setAmount] = useState("10000");
  const [gstRate, setGstRate] = useState("18");
  const [calcType, setCalcType] = useState("add");

  const result = useMemo(() => {
    const A = Number.parseFloat(amount) || 0;
    const rate = (Number.parseFloat(gstRate) || 0) / 100;
    if (calcType === "add") {
      const gstAmount = A * rate;
      const total = A + gstAmount;
      return {
        baseAmount: A,
        gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        total,
      };
    }
    const baseAmount = A / (1 + rate);
    const gstAmount = A - baseAmount;
    return {
      baseAmount,
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      total: A,
    };
  }, [amount, gstRate, calcType]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">GST Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Amount (₹)</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              data-ocid="gst.amount.input"
            />
          </div>
          <div className="space-y-1">
            <Label>GST Rate</Label>
            <Select value={gstRate} onValueChange={setGstRate}>
              <SelectTrigger data-ocid="gst.rate.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Calculation Type</Label>
            <Select value={calcType} onValueChange={setCalcType}>
              <SelectTrigger data-ocid="gst.type.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add GST to Amount</SelectItem>
                <SelectItem value="extract">Extract GST from Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="text-base">GST Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Base Amount</span>
            <span className="font-semibold">{fmt(result.baseAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              CGST ({Number.parseFloat(gstRate) / 2}%)
            </span>
            <span className="font-semibold text-violet-600">
              {fmt(result.cgst)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              SGST ({Number.parseFloat(gstRate) / 2}%)
            </span>
            <span className="font-semibold text-violet-600">
              {fmt(result.sgst)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total GST</span>
            <span className="font-semibold text-purple-600">
              {fmt(result.gstAmount)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Total Amount</span>
            <span className="font-bold text-lg text-violet-600">
              {fmt(result.total)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
