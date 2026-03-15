import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

export function StocksCalculator() {
  const { country } = useCurrency();
  const sym = country.symbol;
  const [buyPrice, setBuyPrice] = useState("100");
  const [qty, setQty] = useState("100");
  const [sellPrice, setSellPrice] = useState("150");
  const [brokerage, setBrokerage] = useState("0.1");

  const result = useMemo(() => {
    const bp = Number.parseFloat(buyPrice) || 0;
    const q = Number.parseFloat(qty) || 0;
    const sp = Number.parseFloat(sellPrice) || 0;
    const br = (Number.parseFloat(brokerage) || 0) / 100;
    const investment = bp * q;
    const grossProfit = (sp - bp) * q;
    const brokerageCost = (investment + sp * q) * br;
    const netProfit = grossProfit - brokerageCost;
    const roi = investment > 0 ? (netProfit / investment) * 100 : 0;
    return { investment, grossProfit, brokerageCost, netProfit, roi };
  }, [buyPrice, qty, sellPrice, brokerage]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stock Trade Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Buy Price ({sym})</Label>
            <Input
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              type="number"
              data-ocid="stocks.buyprice.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Quantity</Label>
            <Input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              type="number"
              data-ocid="stocks.qty.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Sell Price ({sym})</Label>
            <Input
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              type="number"
              data-ocid="stocks.sellprice.input"
            />
          </div>
          <div className="space-y-1">
            <Label>Brokerage (%)</Label>
            <Input
              value={brokerage}
              onChange={(e) => setBrokerage(e.target.value)}
              type="number"
              step="0.01"
              data-ocid="stocks.brokerage.input"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle className="text-base">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Investment
            </span>
            <span className="font-semibold">{fmt(result.investment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Gross Profit/Loss
            </span>
            <span
              className={`font-semibold ${result.grossProfit >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {fmt(result.grossProfit)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Brokerage Cost
            </span>
            <span className="font-semibold text-orange-500">
              {fmt(result.brokerageCost)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-bold">Net Profit/Loss</span>
            <span
              className={`font-bold text-lg ${result.netProfit >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {fmt(result.netProfit)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-bold">ROI</span>
            <span
              className={`font-bold ${result.roi >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {result.roi.toFixed(2)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
