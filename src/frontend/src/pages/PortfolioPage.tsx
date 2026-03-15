import { Pencil, Plus, Trash2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AssetType, type PortfolioHolding } from "../backend.d";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { useActor } from "../hooks/useActor";

const SLICE_COLORS = [
  "#60a5fa",
  "#34d399",
  "#a78bfa",
  "#f87171",
  "#fbbf24",
  "#fb923c",
  "#22d3ee",
  "#94a3b8",
  "#e879f9",
  "#4ade80",
];

const assetTypes: { value: AssetType; label: string; color: string }[] = [
  { value: AssetType.Retirement, label: "Retiral", color: "#6366f1" },
  { value: AssetType.MutualFund, label: "Mutual Fund", color: "#22c55e" },
  { value: AssetType.ETF, label: "Equity (ETF/Stocks)", color: "#10b981" },
  { value: AssetType.Crypto, label: "Crypto", color: "#f97316" },
  { value: AssetType.Commodity, label: "Commodity", color: "#eab308" },
  { value: AssetType.RealEstate, label: "Real Estate", color: "#a855f7" },
  { value: AssetType.FixedIncome, label: "Fixed Income", color: "#06b6d4" },
  { value: AssetType.Other, label: "Other", color: "#64748b" },
];

const categoryOptions: Record<string, string[]> = {
  [AssetType.Retirement]: [
    "PPF",
    "NPS",
    "EPF",
    "LIC",
    "Superannuation",
    "Pension",
    "Gratuity",
    "Other",
  ],
  [AssetType.ETF]: [
    "Large Cap",
    "Mid Cap",
    "Small Cap",
    "Multi Cap",
    "Factor",
    "Other",
  ],
  [AssetType.MutualFund]: [
    "Large Cap",
    "Mid Cap",
    "Small Cap",
    "Flexi Cap",
    "Multi Cap",
    "Multi Asset",
    "Index",
    "Debt",
    "Hybrid",
    "ELSS",
    "Liquid",
    "Balance Advantage",
    "Arbitrage",
    "International",
    "Factor",
    "Other",
  ],
  [AssetType.Crypto]: [
    "Large Cap",
    "Mid Cap",
    "Small Cap",
    "Micro Cap",
    "Stablecoin",
    "Memecoin",
    "Other",
  ],
  [AssetType.Commodity]: [
    "Gold",
    "Silver",
    "Platinum",
    "Gold ETF",
    "Silver ETF",
    "Other",
  ],
  [AssetType.RealEstate]: ["Residential", "Commercial", "Land"],
  [AssetType.FixedIncome]: [
    "Fixed Deposit",
    "Bonds",
    "Post Office Bonds",
    "Cash",
    "Other",
  ],
  [AssetType.Other]: [
    "IPO",
    "PMS",
    "SIF",
    "Startup",
    "Unlisted/Pre-IPO",
    "P2P Lending",
    "Invoice Discounting",
    "Other",
  ],
};

const emptyForm = {
  name: "",
  ticker: "",
  assetType: AssetType.Retirement,
  category: "",
  quantity: 0,
  buyPrice: 0,
  invested: 0,
  marketPrice: 0,
  currentValue: 0,
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function PortfolioPage() {
  const { assetType } = useParams<{ assetType: string }>();
  const navigate = useNavigate();
  const { actor } = useActor();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioHolding | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [investedMode, setInvestedMode] = useState<
    "buyPrice" | "invested" | null
  >(null);
  const [currentMode, setCurrentMode] = useState<
    "marketPrice" | "currentValue" | null
  >(null);

  const currentType = (assetType as AssetType) || AssetType.Retirement;
  const filtered = holdings.filter((h) => h.assetType === currentType);
  const totalValue = filtered.reduce((s, h) => s + h.currentValue, 0);
  const activeTabColor =
    assetTypes.find((at) => at.value === currentType)?.color ?? "#6366f1";

  // Pie data for holdings distribution
  const pieData = filtered.map((h, idx) => ({
    name: h.name,
    value: h.currentValue,
    color: SLICE_COLORS[idx % SLICE_COLORS.length],
  }));

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllPortfolioHoldings()
      .then(setHoldings)
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      assetType: currentType,
      category: categoryOptions[currentType]?.[0] ?? "",
    });
    setInvestedMode(null);
    setCurrentMode(null);
    setOpen(true);
  };

  const openEdit = (h: PortfolioHolding) => {
    setEditing(h);
    setForm({
      name: h.name,
      ticker: "",
      assetType: h.assetType,
      category: h.notes || "",
      quantity: h.quantity,
      buyPrice: h.costBasis,
      invested: h.costBasis * h.quantity,
      marketPrice: h.quantity > 0 ? h.currentValue / h.quantity : 0,
      currentValue: h.currentValue,
    });
    setInvestedMode(h.costBasis > 0 ? "buyPrice" : null);
    setCurrentMode(h.currentValue > 0 && h.quantity > 0 ? "marketPrice" : null);
    setOpen(true);
  };

  const handleAssetTypeChange = (v: AssetType) => {
    const firstCategory = categoryOptions[v]?.[0] ?? "";
    setForm((f) => ({ ...f, assetType: v, category: firstCategory }));
  };

  const handleQuantityChange = (qty: number) => {
    setForm((f) => {
      const next = { ...f, quantity: qty };
      if (investedMode === "buyPrice") {
        next.invested = qty * f.buyPrice;
      } else if (investedMode === "invested") {
        next.buyPrice = qty > 0 ? f.invested / qty : 0;
      }
      if (currentMode === "marketPrice") {
        next.currentValue = qty * f.marketPrice;
      } else if (currentMode === "currentValue") {
        next.marketPrice = qty > 0 ? f.currentValue / qty : 0;
      }
      return next;
    });
  };

  const handleBuyPriceChange = (val: number) => {
    if (val > 0) {
      setInvestedMode("buyPrice");
      setForm((f) => ({ ...f, buyPrice: val, invested: f.quantity * val }));
    } else {
      setInvestedMode(null);
      setForm((f) => ({ ...f, buyPrice: val, invested: 0 }));
    }
  };

  const handleInvestedChange = (val: number) => {
    if (val > 0) {
      setInvestedMode("invested");
      setForm((f) => ({
        ...f,
        invested: val,
        buyPrice: f.quantity > 0 ? val / f.quantity : 0,
      }));
    } else {
      setInvestedMode(null);
      setForm((f) => ({ ...f, invested: val, buyPrice: 0 }));
    }
  };

  const handleMarketPriceChange = (val: number) => {
    if (val > 0) {
      setCurrentMode("marketPrice");
      setForm((f) => ({
        ...f,
        marketPrice: val,
        currentValue: f.quantity * val,
      }));
    } else {
      setCurrentMode(null);
      setForm((f) => ({ ...f, marketPrice: val, currentValue: 0 }));
    }
  };

  const handleCurrentValueChange = (val: number) => {
    if (val > 0) {
      setCurrentMode("currentValue");
      setForm((f) => ({
        ...f,
        currentValue: val,
        marketPrice: f.quantity > 0 ? val / f.quantity : 0,
      }));
    } else {
      setCurrentMode(null);
      setForm((f) => ({ ...f, currentValue: val, marketPrice: 0 }));
    }
  };

  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const holdingData = {
        name: form.name,
        ticker: form.ticker,
        assetType: form.assetType,
        quantity: form.quantity,
        costBasis: form.buyPrice,
        currentValue: form.currentValue,
        notes: form.category,
      };
      if (editing) {
        await actor.updatePortfolioHolding(editing.id, {
          ...editing,
          ...holdingData,
        });
      } else {
        await actor.createPortfolioHolding({
          id: crypto.randomUUID(),
          ...holdingData,
        });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!actor) return;
    await actor.deletePortfolioHolding(id);
    load();
  };

  return (
    <div data-ocid="portfolio.page" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portfolio</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage your investment holdings
          </p>
        </div>
        <Button
          data-ocid="portfolio.add_button"
          onClick={openAdd}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add Holding
        </Button>
      </div>

      {/* Industry-standard pill tab bar */}
      <div className="overflow-x-auto pb-1">
        <div className="flex flex-row gap-2 min-w-max">
          {assetTypes.map((at) => {
            const isActive = currentType === at.value;
            return (
              <button
                key={at.value}
                type="button"
                data-ocid={`portfolio.${at.value.toLowerCase()}.tab`}
                onClick={() => navigate(`/portfolio/${at.value}`)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={
                  isActive
                    ? {
                        backgroundColor: at.color,
                        color: "#fff",
                        boxShadow: `0 2px 8px ${at.color}55`,
                      }
                    : {
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                      }
                }
              >
                {at.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary row */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
          {filtered.length} holding{filtered.length !== 1 ? "s" : ""}
        </span>
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-semibold tabular-nums"
          style={{ backgroundColor: activeTabColor }}
        >
          Total: {fmt(totalValue)}
        </span>
      </div>

      {loading ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : filtered.length === 0 ? (
        <div
          data-ocid="portfolio.empty_state"
          className="flex flex-col items-center justify-center py-20 text-slate-300 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50"
        >
          <TrendingUp className="w-10 h-10 mb-3 opacity-40" />
          <p className="font-medium text-slate-400">
            No holdings in this category
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Click "Add Holding" to get started
          </p>
        </div>
      ) : (
        <>
          {/* Holdings Table */}
          <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="portfolio.table">
                <thead>
                  <tr style={{ backgroundColor: activeTabColor }}>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide">
                      Name/Ticker
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide">
                      Buy Price
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide">
                      Invested Value
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide">
                      Current Value
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide">
                      Gain / Loss
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold text-white uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((h, i) => {
                    const invested = h.costBasis * h.quantity;
                    const gl = h.currentValue - invested;
                    const glPct = invested > 0 ? (gl / invested) * 100 : 0;
                    return (
                      <tr
                        key={h.id}
                        data-ocid={`portfolio.item.${i + 1}`}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          {h.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {h.notes || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums text-slate-600">
                          {h.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums text-slate-600">
                          {fmt(h.costBasis)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums text-slate-700 font-medium">
                          {fmt(invested)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right tabular-nums font-medium text-slate-800">
                          {fmt(h.currentValue)}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm text-right tabular-nums font-semibold ${
                            gl >= 0 ? "text-emerald-600" : "text-red-500"
                          }`}
                        >
                          {gl >= 0 ? "+" : ""}
                          {fmt(gl)}{" "}
                          <span className="text-xs font-normal opacity-75">
                            ({glPct.toFixed(1)}%)
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-slate-700"
                              data-ocid={`portfolio.edit_button.${i + 1}`}
                              onClick={() => openEdit(h)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-300 hover:text-red-500"
                              data-ocid={`portfolio.delete_button.${i + 1}`}
                              onClick={() => del(h.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Holdings Distribution Pie Chart */}
          {filtered.length > 0 && (
            <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
                  {currentType} Holdings Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(
                        v: number,
                        _name: string,
                        props: { payload?: { name: string } },
                      ) => [fmt(v), props.payload?.name ?? ""]}
                      contentStyle={{
                        fontSize: "11px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px" }}
                      formatter={(value: string) => (
                        <span className="text-slate-600">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="portfolio.dialog" className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Holding" : "Add Holding"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name/Ticker</Label>
              <Input
                data-ocid="portfolio.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>

            {/* Asset Type + Category side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Asset Type</Label>
                <Select
                  value={form.assetType}
                  onValueChange={(v) => handleAssetTypeChange(v as AssetType)}
                >
                  <SelectTrigger data-ocid="portfolio.assettype.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((at) => (
                      <SelectItem key={at.value} value={at.value}>
                        {at.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger data-ocid="portfolio.category.select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categoryOptions[form.assetType] ?? []).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Label>Quantity</Label>
              <Input
                data-ocid="portfolio.quantity.input"
                type="number"
                value={form.quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
              />
            </div>

            {/* Buy Details */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Buy Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Buy Price (per unit)</Label>
                  <Input
                    data-ocid="portfolio.buyprice.input"
                    type="number"
                    value={form.buyPrice}
                    disabled={investedMode === "invested"}
                    onChange={(e) =>
                      handleBuyPriceChange(Number(e.target.value))
                    }
                    className={
                      investedMode === "invested"
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                        : ""
                    }
                  />
                </div>
                <div>
                  <Label>Invested Value</Label>
                  <Input
                    data-ocid="portfolio.invested.input"
                    type="number"
                    value={form.invested}
                    disabled={investedMode === "buyPrice"}
                    onChange={(e) =>
                      handleInvestedChange(Number(e.target.value))
                    }
                    className={
                      investedMode === "buyPrice"
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                        : ""
                    }
                  />
                </div>
              </div>
            </div>

            {/* Current Value Details */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Current Value Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Market Price (per unit)</Label>
                  <Input
                    data-ocid="portfolio.marketprice.input"
                    type="number"
                    value={form.marketPrice}
                    disabled={currentMode === "currentValue"}
                    onChange={(e) =>
                      handleMarketPriceChange(Number(e.target.value))
                    }
                    className={
                      currentMode === "currentValue"
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                        : ""
                    }
                  />
                </div>
                <div>
                  <Label>Current Value</Label>
                  <Input
                    data-ocid="portfolio.currentvalue.input"
                    type="number"
                    value={form.currentValue}
                    disabled={currentMode === "marketPrice"}
                    onChange={(e) =>
                      handleCurrentValueChange(Number(e.target.value))
                    }
                    className={
                      currentMode === "marketPrice"
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="portfolio.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="portfolio.submit_button"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
