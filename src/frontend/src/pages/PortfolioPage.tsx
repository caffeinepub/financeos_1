import {
  BarChart3,
  Building2,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Gem,
  Landmark,
  Package,
  Pencil,
  PiggyBank,
  Plus,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
import { useCurrency } from "../contexts/CurrencyContext";
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

type SortDir = "asc" | "desc";
type SortCol =
  | "name"
  | "category"
  | "invested"
  | "currentValue"
  | "gl"
  | "glPct"
  | "allocPct"
  | null;

function SortIcon({
  col,
  sortCol,
  sortDir,
}: { col: SortCol; sortCol: SortCol; sortDir: SortDir }) {
  if (sortCol !== col)
    return <ChevronsUpDown className="inline w-3 h-3 ml-0.5 opacity-40" />;
  return sortDir === "asc" ? (
    <ChevronUp className="inline w-3 h-3 ml-0.5" />
  ) : (
    <ChevronDown className="inline w-3 h-3 ml-0.5" />
  );
}

export default function PortfolioPage() {
  const { assetType } = useParams<{ assetType: string }>();
  const navigate = useNavigate();
  const { actor } = useActor();
  const { formatCurrency: fmt } = useCurrency();
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
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const isOverview = assetType === "overview";
  const currentType = (assetType as AssetType) || AssetType.Retirement;
  const rawFiltered = holdings.filter((h) => h.assetType === currentType);
  const totalValue = rawFiltered.reduce((s, h) => s + h.currentValue, 0);
  const activeTabColor =
    assetTypes.find((at) => at.value === currentType)?.color ?? "#6366f1";

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const arr = [...rawFiltered];
    if (!sortCol) return arr;
    arr.sort((a, b) => {
      let av = 0;
      let bv = 0;
      let as2 = "";
      let bs2 = "";
      switch (sortCol) {
        case "name":
          as2 = a.name.toLowerCase();
          bs2 = b.name.toLowerCase();
          return sortDir === "asc"
            ? as2.localeCompare(bs2)
            : bs2.localeCompare(as2);
        case "category":
          as2 = (a.notes || "").toLowerCase();
          bs2 = (b.notes || "").toLowerCase();
          return sortDir === "asc"
            ? as2.localeCompare(bs2)
            : bs2.localeCompare(as2);
        case "invested":
          av = a.costBasis * a.quantity;
          bv = b.costBasis * b.quantity;
          break;
        case "currentValue":
          av = a.currentValue;
          bv = b.currentValue;
          break;
        case "gl":
          av = a.currentValue - a.costBasis * a.quantity;
          bv = b.currentValue - b.costBasis * b.quantity;
          break;
        case "glPct": {
          const ai = a.costBasis * a.quantity;
          const bi = b.costBasis * b.quantity;
          av = ai > 0 ? (a.currentValue - ai) / ai : 0;
          bv = bi > 0 ? (b.currentValue - bi) / bi : 0;
          break;
        }
        case "allocPct":
          av = totalValue > 0 ? a.currentValue / totalValue : 0;
          bv = totalValue > 0 ? b.currentValue / totalValue : 0;
          break;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawFiltered, sortCol, sortDir, totalValue]);

  // Pie data with pct
  const pieData = rawFiltered.map((h, idx) => ({
    name: h.name,
    value: h.currentValue,
    color: SLICE_COLORS[idx % SLICE_COLORS.length],
    pct:
      totalValue > 0 ? ((h.currentValue / totalValue) * 100).toFixed(1) : "0",
  }));

  const renderPieLabel = ({
    pct,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
  }: {
    pct: string;
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
  }) => {
    const pctNum = Number.parseFloat(pct);
    if (pctNum < 5) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={600}
      >
        {pct}%
      </text>
    );
  };

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
      if (investedMode === "buyPrice") next.invested = qty * f.buyPrice;
      else if (investedMode === "invested")
        next.buyPrice = qty > 0 ? f.invested / qty : 0;
      if (currentMode === "marketPrice")
        next.currentValue = qty * f.marketPrice;
      else if (currentMode === "currentValue")
        next.marketPrice = qty > 0 ? f.currentValue / qty : 0;
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

  const thClass =
    "px-4 py-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide cursor-pointer select-none hover:bg-white/10 transition-colors";
  const thClassRight =
    "px-4 py-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide cursor-pointer select-none hover:bg-white/10 transition-colors";

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
          <button
            type="button"
            data-ocid="portfolio.overview.tab"
            onClick={() => navigate("/portfolio/overview")}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={
              isOverview
                ? {
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(30,41,59,0.3)",
                  }
                : { backgroundColor: "#f1f5f9", color: "#64748b" }
            }
          >
            Overview
          </button>
          {assetTypes.map((at) => {
            const isActive = !isOverview && currentType === at.value;
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
                    : { backgroundColor: "#f1f5f9", color: "#64748b" }
                }
              >
                {at.label}
              </button>
            );
          })}
        </div>
      </div>

      {isOverview ? (
        <PortfolioOverview holdings={holdings} fmt={fmt} />
      ) : (
        <>
          {/* Summary row */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
              {rawFiltered.length} holding{rawFiltered.length !== 1 ? "s" : ""}
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
          ) : rawFiltered.length === 0 ? (
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
                      <tr className="bg-slate-700">
                        <th
                          className={thClass}
                          onClick={() => toggleSort("name")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") toggleSort("name");
                          }}
                        >
                          Name/Ticker{" "}
                          <SortIcon
                            col="name"
                            sortCol={sortCol}
                            sortDir={sortDir}
                          />
                        </th>
                        <th
                          className={thClass}
                          onClick={() => toggleSort("category")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") toggleSort("category");
                          }}
                        >
                          Category{" "}
                          <SortIcon
                            col="category"
                            sortCol={sortCol}
                            sortDir={sortDir}
                          />
                        </th>
                        <th
                          className={thClassRight}
                          onClick={() => toggleSort("invested")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") toggleSort("invested");
                          }}
                        >
                          Invested Value{" "}
                          <SortIcon
                            col="invested"
                            sortCol={sortCol}
                            sortDir={sortDir}
                          />
                        </th>
                        <th
                          className={thClassRight}
                          onClick={() => toggleSort("currentValue")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") toggleSort("currentValue");
                          }}
                        >
                          Current Value{" "}
                          <SortIcon
                            col="currentValue"
                            sortCol={sortCol}
                            sortDir={sortDir}
                          />
                        </th>
                        <th
                          className={thClassRight}
                          onClick={() => toggleSort("allocPct")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") toggleSort("allocPct");
                          }}
                        >
                          Allocation %{" "}
                          <SortIcon
                            col="allocPct"
                            sortCol={sortCol}
                            sortDir={sortDir}
                          />
                        </th>
                        <th
                          className={thClassRight}
                          onClick={() => toggleSort("gl")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") toggleSort("gl");
                          }}
                        >
                          Gain/Loss{" "}
                          <SortIcon
                            col="gl"
                            sortCol={sortCol}
                            sortDir={sortDir}
                          />
                        </th>
                        <th
                          className={thClassRight}
                          onClick={() => toggleSort("glPct")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") toggleSort("glPct");
                          }}
                        >
                          Gain/Loss %{" "}
                          <SortIcon
                            col="glPct"
                            sortCol={sortCol}
                            sortDir={sortDir}
                          />
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
                        const allocPct =
                          totalValue > 0
                            ? (h.currentValue / totalValue) * 100
                            : 0;
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
                            <td className="px-4 py-3 text-sm text-right tabular-nums text-slate-700 font-medium">
                              {fmt(invested)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right tabular-nums font-medium text-slate-800">
                              {fmt(h.currentValue)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right tabular-nums text-slate-600">
                              {allocPct.toFixed(1)}%
                            </td>
                            <td
                              className={`px-4 py-3 text-sm text-right tabular-nums font-semibold ${
                                gl >= 0 ? "text-emerald-600" : "text-red-500"
                              }`}
                            >
                              {gl >= 0 ? "+" : ""}
                              {fmt(gl)}
                            </td>
                            <td
                              className={`px-4 py-3 text-sm text-right tabular-nums font-semibold ${
                                glPct >= 0 ? "text-emerald-600" : "text-red-500"
                              }`}
                            >
                              {glPct >= 0 ? "+" : ""}
                              {glPct.toFixed(1)}%
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
              {rawFiltered.length > 0 && (
                <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold text-slate-700 tracking-tight">
                      {currentType} Holdings Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="#fff"
                          labelLine={false}
                          label={renderPieLabel}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(
                            v: number,
                            _name: string,
                            props: { payload?: { name: string; pct: string } },
                          ) => [
                            `${fmt(v)} (${props.payload?.pct ?? "0"}%)`,
                            props.payload?.name ?? "",
                          ]}
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
            <div>
              <Label>Quantity</Label>
              <Input
                data-ocid="portfolio.quantity.input"
                type="number"
                value={form.quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
              />
            </div>
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

// ─── Portfolio Overview Component ────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const assetIcons: Record<string, { Icon: any; color: string }> = {
  [AssetType.Retirement]: { Icon: PiggyBank, color: "#6366f1" },
  [AssetType.MutualFund]: { Icon: BarChart3, color: "#22c55e" },
  [AssetType.ETF]: { Icon: TrendingUp, color: "#10b981" },
  [AssetType.Crypto]: { Icon: Zap, color: "#f97316" },
  [AssetType.Commodity]: { Icon: Gem, color: "#eab308" },
  [AssetType.RealEstate]: { Icon: Building2, color: "#a855f7" },
  [AssetType.FixedIncome]: { Icon: Landmark, color: "#06b6d4" },
  [AssetType.Other]: { Icon: Package, color: "#64748b" },
};

function PortfolioOverview({
  holdings,
  fmt,
}: {
  holdings: PortfolioHolding[];
  fmt: (v: number) => string;
}) {
  // Per-asset-type aggregation
  const assetSummaries = useMemo(() => {
    return assetTypes.map((at) => {
      const group = holdings.filter((h) => h.assetType === at.value);
      const invested = group.reduce((s, h) => s + h.costBasis * h.quantity, 0);
      const current = group.reduce((s, h) => s + h.currentValue, 0);
      const gl = current - invested;
      const glPct = invested > 0 ? (gl / invested) * 100 : 0;
      return { ...at, invested, current, gl, glPct, count: group.length };
    });
  }, [holdings]);

  // Bar chart data
  const barData = assetSummaries.map((s) => ({
    name: s.label
      .replace(" (ETF/Stocks)", "")
      .replace("Fixed Income", "Fixed Inc."),
    invested: s.invested,
    current: s.current,
  }));

  // Equity cap distribution (assetType === ETF, category stored in notes)
  const equityCapData = useMemo(() => {
    const eq = holdings.filter((h) => h.assetType === AssetType.ETF);
    const buckets: Record<string, number> = {
      "Large Cap": 0,
      "Mid Cap": 0,
      "Small Cap": 0,
      Other: 0,
    };
    for (const h of eq) {
      const cat = h.notes || "Other";
      if (cat === "Large Cap") buckets["Large Cap"] += h.currentValue;
      else if (cat === "Mid Cap") buckets["Mid Cap"] += h.currentValue;
      else if (cat === "Small Cap") buckets["Small Cap"] += h.currentValue;
      else buckets.Other += h.currentValue;
    }
    const total = Object.values(buckets).reduce((s, v) => s + v, 0);
    return Object.entries(buckets)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value,
        pct: total > 0 ? ((value / total) * 100).toFixed(1) : "0",
      }));
  }, [holdings]);

  // Mutual Fund cap distribution
  const mfCapData = useMemo(() => {
    const mf = holdings.filter((h) => h.assetType === AssetType.MutualFund);
    const buckets: Record<string, number> = {
      "Large Cap": 0,
      "Mid Cap": 0,
      "Small Cap": 0,
      Other: 0,
    };
    const largeBucket = new Set([
      "Large Cap",
      "Flexi Cap",
      "Multi Cap",
      "Multi Asset",
    ]);
    for (const h of mf) {
      const cat = h.notes || "Other";
      if (largeBucket.has(cat)) buckets["Large Cap"] += h.currentValue;
      else if (cat === "Mid Cap") buckets["Mid Cap"] += h.currentValue;
      else if (cat === "Small Cap") buckets["Small Cap"] += h.currentValue;
      else buckets.Other += h.currentValue;
    }
    const total = Object.values(buckets).reduce((s, v) => s + v, 0);
    return Object.entries(buckets)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value,
        pct: total > 0 ? ((value / total) * 100).toFixed(1) : "0",
      }));
  }, [holdings]);

  const CAP_COLORS: Record<string, string> = {
    "Large Cap": "#3b82f6",
    "Mid Cap": "#f59e0b",
    "Small Cap": "#ef4444",
    Other: "#94a3b8",
  };

  const CustomCapLabel = ({
    x,
    y,
    width,
    value,
    pct,
  }: {
    x?: number;
    y?: number;
    width?: number;
    value?: number;
    pct?: string;
  }) => {
    if (!value || value === 0) return null;
    return (
      <text
        x={(x ?? 0) + (width ?? 0) / 2}
        y={(y ?? 0) - 4}
        textAnchor="middle"
        fontSize={10}
        fill="#64748b"
      >
        {pct}%
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Asset Type Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {assetSummaries.map((s) => {
          const iconInfo = assetIcons[s.value];
          const IconComp = iconInfo?.Icon;
          return (
            <Card
              key={s.value}
              className="rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${iconInfo?.color}18` }}
                  >
                    {IconComp && (
                      <IconComp
                        className="w-4 h-4"
                        style={{ color: iconInfo?.color }}
                      />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 leading-tight">
                    {s.label.replace(" (ETF/Stocks)", "")}
                  </span>
                </div>
                <div className="space-y-1">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Invested
                    </p>
                    <p className="text-sm font-bold text-slate-700 tabular-nums">
                      {fmt(s.invested)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      Current
                    </p>
                    <p className="text-sm font-bold text-slate-800 tabular-nums">
                      {fmt(s.current)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <span
                      className={`text-xs font-semibold tabular-nums ${s.gl >= 0 ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {s.gl >= 0 ? "+" : ""}
                      {fmt(s.gl)}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1 py-0.5 rounded ${s.glPct >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}
                    >
                      {s.glPct >= 0 ? "+" : ""}
                      {s.glPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Consolidated Invested vs Current Bar Chart */}
      <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Invested vs Current Value — All Asset Types
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickFormatter={(v) => fmt(v)}
                width={80}
              />
              <Tooltip
                formatter={(value: number, name: string) => [fmt(value), name]}
                contentStyle={{
                  fontSize: "11px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar
                dataKey="invested"
                name="Invested Value"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="current"
                name="Current Value"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cap Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Equity Cap Distribution */}
        <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Equity — Cap Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {equityCapData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={equityCapData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickFormatter={(v) => fmt(v)}
                    width={80}
                  />
                  <Tooltip
                    formatter={(
                      value: number,
                      _name: string,
                      props: { payload?: { pct?: string } },
                    ) => [
                      `${fmt(value)} (${props.payload?.pct ?? "0"}%)`,
                      "Current Value",
                    ]}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Current Value"
                    radius={[4, 4, 0, 0]}
                    label={<CustomCapLabel />}
                  >
                    {equityCapData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CAP_COLORS[entry.name] ?? "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-slate-300 text-sm">
                No equity holdings yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mutual Fund Cap Distribution */}
        <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Mutual Fund — Cap Distribution
            </CardTitle>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Flexi, Multi Cap & Multi Asset counted as Large Cap
            </p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {mfCapData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={mfCapData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickFormatter={(v) => fmt(v)}
                    width={80}
                  />
                  <Tooltip
                    formatter={(
                      value: number,
                      _name: string,
                      props: { payload?: { pct?: string } },
                    ) => [
                      `${fmt(value)} (${props.payload?.pct ?? "0"}%)`,
                      "Current Value",
                    ]}
                    contentStyle={{
                      fontSize: "11px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Current Value"
                    radius={[4, 4, 0, 0]}
                    label={<CustomCapLabel />}
                  >
                    {mfCapData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CAP_COLORS[entry.name] ?? "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-slate-300 text-sm">
                No mutual fund holdings yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
