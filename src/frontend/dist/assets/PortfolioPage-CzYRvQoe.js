import { c as createLucideIcon, Q as useParams, U as useNavigate, u as useActor, a as useCurrency, r as reactExports, j as jsxRuntimeExports, z as TrendingUp, B as Button, Z as Zap, E as ChartColumn, V as PiggyBank, x as Trash2, o as Dialog, p as DialogContent, q as DialogHeader, s as DialogTitle, v as Label, I as Input, w as DialogFooter, C as ChevronDown } from "./index-Ds6U6_qE.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-aG8FMYj4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as ChevronUp } from "./select-BHeTHZTG.js";
import { S as Skeleton } from "./skeleton-Mlok9hx_.js";
import { T as Table, b as TableHeader, c as TableRow, d as TableHead, a as TableBody, e as TableCell } from "./table-BWKseIOo.js";
import { A as AssetType } from "./index-CUmzdL5t.js";
import { L as LayoutList } from "./layout-list-B8yikXsJ.js";
import { L as LayoutGrid } from "./layout-grid-i8AQtGOP.js";
import { P as Plus } from "./plus-DOLQmNic.js";
import { L as Landmark } from "./landmark-Dk-DMnN8.js";
import { B as Building2 } from "./building-2-C5-gRlc0.js";
import { P as Pencil } from "./pencil-BiLQBuGr.js";
import { R as ResponsiveContainer, C as Cell, T as Tooltip, a as CartesianGrid, X as XAxis, Y as YAxis, b as Legend, B as Bar, L as LabelList } from "./generateCategoricalChart-DEjVyPR3.js";
import { P as PieChart, a as Pie } from "./PieChart-DQbmwGUB.js";
import { B as BarChart } from "./BarChart-CRER3XSp.js";
import { L as LineChart, a as Line } from "./LineChart-B2mkFaPg.js";
import "./index-CnxV3vAw.js";
import "./index-CYHAJoK-.js";
import "./index-B0wd6SMQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
  ["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }]
];
const ChevronsUpDown = createLucideIcon("chevrons-up-down", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M6 3h12l4 6-10 13L2 9Z", key: "1pcd5k" }],
  ["path", { d: "M11 3 8 9l4 13 4-13-3-6", key: "1fcu3u" }],
  ["path", { d: "M2 9h20", key: "16fsjt" }]
];
const Gem = createLucideIcon("gem", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode);
function shortNum(n, sym, code = "INR") {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (code !== "INR") {
    if (abs >= 1e9)
      return `${sign}${sym}${(abs / 1e9).toFixed(2)}B`;
    if (abs >= 1e6)
      return `${sign}${sym}${(abs / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `${sign}${sym}${(abs / 1e3).toFixed(1)}K`;
    return `${sign}${sym}${Math.round(abs).toLocaleString()}`;
  }
  if (abs >= 1e7)
    return `${sign}${sym}${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}${sym}${(abs / 1e5).toFixed(2)}L`;
  if (abs >= 1e3) return `${sign}${sym}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${sym}${Math.round(abs).toLocaleString("en-IN")}`;
}
const SLICE_COLORS = [
  "#2563eb",
  "#0891b2",
  "#059669",
  "#7c3aed",
  "#d97706",
  "#dc2626",
  "#0d9488",
  "#9333ea",
  "#e11d48",
  "#ca8a04"
];
const assetTypes = [
  { value: AssetType.Retirement, label: "Retiral", color: "#f43f5e" },
  { value: AssetType.MutualFund, label: "Mutual Fund", color: "#3b82f6" },
  { value: AssetType.ETF, label: "Equity (ETF/Stocks)", color: "#10b981" },
  { value: AssetType.Crypto, label: "Crypto", color: "#a855f7" },
  { value: AssetType.Commodity, label: "Commodity", color: "#f59e0b" },
  { value: AssetType.RealEstate, label: "Real Estate", color: "#f97316" },
  { value: AssetType.FixedIncome, label: "Fixed Income", color: "#14b8a6" },
  { value: AssetType.Other, label: "Other", color: "#78716c" }
];
const categoryOptions = {
  [AssetType.Retirement]: [
    "PPF",
    "NPS",
    "EPF",
    "LIC",
    "Superannuation",
    "Pension",
    "Gratuity",
    "Other"
  ],
  [AssetType.ETF]: [
    "Large Cap",
    "Mid Cap",
    "Small Cap",
    "Multi Cap",
    "Factor",
    "Other"
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
    "Other"
  ],
  [AssetType.Crypto]: [
    "Large Cap",
    "Mid Cap",
    "Small Cap",
    "Micro Cap",
    "Stablecoin",
    "Memecoin",
    "Other"
  ],
  [AssetType.Commodity]: [
    "Gold",
    "Silver",
    "Platinum",
    "Gold ETF",
    "Silver ETF",
    "Other"
  ],
  [AssetType.RealEstate]: ["Residential", "Commercial", "Land"],
  [AssetType.FixedIncome]: [
    "Fixed Deposit",
    "Bonds",
    "Post Office Bonds",
    "Cash",
    "Other"
  ],
  [AssetType.Other]: [
    "IPO",
    "PMS",
    "SIF",
    "Startup",
    "Unlisted/Pre-IPO",
    "P2P Lending",
    "Invoice Discounting",
    "Other"
  ]
};
const emptyForm = {
  name: "",
  ticker: "",
  assetType: AssetType.Retirement,
  category: "",
  quantity: 1,
  buyPrice: 0,
  invested: 0,
  marketPrice: 0,
  currentValue: 0
};
function SortIcon({
  col,
  sortCol,
  sortDir
}) {
  if (sortCol !== col)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "inline w-3 h-3 ml-0.5 opacity-40" });
  return sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "inline w-3 h-3 ml-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "inline w-3 h-3 ml-0.5" });
}
function PortfolioPage() {
  const { assetType } = useParams();
  const navigate = useNavigate();
  const { actor } = useActor();
  const { formatCurrency: fmt } = useCurrency();
  const [holdings, setHoldings] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [saving, setSaving] = reactExports.useState(false);
  const [investedMode, setInvestedMode] = reactExports.useState(null);
  const [currentMode, setCurrentMode] = reactExports.useState(null);
  const [sortCol, setSortCol] = reactExports.useState("invested");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [viewMode, setViewMode] = reactExports.useState("card");
  (() => {
    const dob = localStorage.getItem("gff_dob");
    if (!dob) return 30;
    return Math.floor(
      (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1e3)
    );
  })();
  const isOverview = assetType === "overview";
  const currentType = assetType || AssetType.Retirement;
  const rawFiltered = holdings.filter((h) => h.assetType === currentType);
  const totalValue = rawFiltered.reduce((s, h) => s + h.currentValue, 0);
  const toggleSort = (col) => {
    if (sortCol === col) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };
  const filtered = reactExports.useMemo(() => {
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
          return sortDir === "asc" ? as2.localeCompare(bs2) : bs2.localeCompare(as2);
        case "category":
          as2 = (a.notes || "").toLowerCase();
          bs2 = (b.notes || "").toLowerCase();
          return sortDir === "asc" ? as2.localeCompare(bs2) : bs2.localeCompare(as2);
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
  }, [rawFiltered, sortCol, sortDir, totalValue]);
  rawFiltered.map((h, idx) => ({
    name: h.name,
    value: h.currentValue,
    color: SLICE_COLORS[idx % SLICE_COLORS.length],
    pct: totalValue > 0 ? (h.currentValue / totalValue * 100).toFixed(1) : "0"
  }));
  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor.getAllPortfolioHoldings().then(setHoldings).finally(() => setLoading(false));
  };
  reactExports.useEffect(load, [actor]);
  const openAdd = () => {
    var _a;
    setEditing(null);
    setForm({
      ...emptyForm,
      assetType: currentType,
      category: ((_a = categoryOptions[currentType]) == null ? void 0 : _a[0]) ?? ""
    });
    setInvestedMode(null);
    setCurrentMode(null);
    setOpen(true);
  };
  const openEdit = (h) => {
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
      currentValue: h.currentValue
    });
    setInvestedMode(h.costBasis > 0 ? "buyPrice" : null);
    setCurrentMode(h.currentValue > 0 && h.quantity > 0 ? "marketPrice" : null);
    setOpen(true);
  };
  const handleAssetTypeChange = (v) => {
    var _a;
    const firstCategory = ((_a = categoryOptions[v]) == null ? void 0 : _a[0]) ?? "";
    setForm((f) => ({ ...f, assetType: v, category: firstCategory }));
  };
  const handleQuantityChange = (qty) => {
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
  const handleBuyPriceChange = (val) => {
    if (val > 0) {
      setInvestedMode("buyPrice");
      setForm((f) => ({ ...f, buyPrice: val, invested: f.quantity * val }));
    } else {
      setInvestedMode(null);
      setForm((f) => ({ ...f, buyPrice: val, invested: 0 }));
    }
  };
  const handleInvestedChange = (val) => {
    if (val > 0) {
      setInvestedMode("invested");
      setForm((f) => ({
        ...f,
        invested: val,
        buyPrice: f.quantity > 0 ? val / f.quantity : 0
      }));
    } else {
      setInvestedMode(null);
      setForm((f) => ({ ...f, invested: val, buyPrice: 0 }));
    }
  };
  const handleMarketPriceChange = (val) => {
    if (val > 0) {
      setCurrentMode("marketPrice");
      setForm((f) => ({
        ...f,
        marketPrice: val,
        currentValue: f.quantity * val
      }));
    } else {
      setCurrentMode(null);
      setForm((f) => ({ ...f, marketPrice: val, currentValue: 0 }));
    }
  };
  const handleCurrentValueChange = (val) => {
    if (val > 0) {
      setCurrentMode("currentValue");
      setForm((f) => ({
        ...f,
        currentValue: val,
        marketPrice: f.quantity > 0 ? val / f.quantity : 0
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
        notes: form.category
      };
      if (editing) {
        await actor.updatePortfolioHolding(editing.id, {
          ...editing,
          ...holdingData
        });
      } else {
        await actor.createPortfolioHolding({
          id: crypto.randomUUID(),
          ...holdingData
        });
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };
  const del = async (id) => {
    if (!actor) return;
    await actor.deletePortfolioHolding(id);
    load();
  };
  const thClass = "px-4 py-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide cursor-pointer select-none hover:bg-white/10 transition-colors";
  const thClassRight = "px-4 py-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide cursor-pointer select-none hover:bg-white/10 transition-colors";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "portfolio.page", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-8 rounded-lg flex items-center justify-center",
            style: { background: "linear-gradient(135deg, #0891b2, #06b6d4)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-white" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-slate-800", children: "Portfolio" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              title: "Table View",
              onClick: () => setViewMode("table"),
              className: `p-1.5 transition-colors ${viewMode === "table" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"}`,
              "data-ocid": "portfolio.table_view.toggle",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutList, { className: "w-3.5 h-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              title: "Card View",
              onClick: () => setViewMode("card"),
              className: `p-1.5 transition-colors ${viewMode === "card" ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"}`,
              "data-ocid": "portfolio.card_view.toggle",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "portfolio.add_button",
            onClick: openAdd,
            size: "sm",
            className: "gap-1.5 h-8 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              " Add Holding"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto pb-2 bg-slate-100 rounded-xl p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-row items-center gap-2 min-w-max justify-between w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "portfolio.overview.tab",
          onClick: () => navigate("/portfolio/overview"),
          className: `flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${isOverview ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`,
          children: "Overview"
        }
      ),
      assetTypes.map((at) => {
        const isActive = !isOverview && currentType === at.value;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `portfolio.${at.value.toLowerCase()}.tab`,
            onClick: () => navigate(`/portfolio/${at.value}`),
            className: "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            style: isActive ? {
              backgroundColor: "#0f172a",
              color: "#fff",
              borderColor: "#0f172a"
            } : {
              backgroundColor: "#ffffff",
              color: "#475569",
              borderColor: "#e2e8f0"
            },
            children: at.label
          },
          at.value
        );
      })
    ] }) }) }),
    isOverview ? /* @__PURE__ */ jsxRuntimeExports.jsx(PortfolioOverview, { holdings, fmt, viewMode }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-2xl" }) : rawFiltered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "portfolio.empty_state",
        className: "flex flex-col items-center justify-center py-20 text-slate-300 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-10 h-10 mb-3 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-400", children: "No holdings in this category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-300 mt-1", children: 'Click "Add Holding" to get started' })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      (() => {
        const tabInvested = rawFiltered.reduce(
          (s, h) => s + h.costBasis * h.quantity,
          0
        );
        const tabCurrent = rawFiltered.reduce(
          (s, h) => s + h.currentValue,
          0
        );
        const tabGL = tabCurrent - tabInvested;
        const tabGLPct = tabInvested > 0 ? tabGL / tabInvested * 100 : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-500 px-4 py-3 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Total Invested" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums", children: fmt(tabInvested) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-indigo-500 px-4 py-3 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Current Value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums", children: fmt(tabCurrent) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 px-4 py-3 shadow-sm ${tabGL >= 0 ? "border-l-emerald-500" : "border-l-red-500"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Gain/Loss" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: `text-base font-bold tabular-nums ${tabGL >= 0 ? "text-emerald-600" : "text-red-500"}`,
                    children: [
                      tabGL >= 0 ? "+" : "",
                      fmt(tabGL)
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 px-4 py-3 shadow-sm ${tabGLPct >= 0 ? "border-l-emerald-500" : "border-l-red-500"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Gain/Loss%" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: `text-base font-bold tabular-nums ${tabGLPct >= 0 ? "text-emerald-600" : "text-red-500"}`,
                    children: [
                      tabGLPct >= 0 ? "+" : "",
                      tabGLPct.toFixed(2),
                      "%"
                    ]
                  }
                )
              ]
            }
          )
        ] });
      })(),
      viewMode === "card" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 gap-3",
          "data-ocid": "portfolio.card_list",
          children: filtered.map((h, i) => {
            const invested = h.costBasis * h.quantity;
            const gl = h.currentValue - invested;
            const glPct = invested > 0 ? gl / invested * 100 : 0;
            const allocPct = totalValue > 0 ? h.currentValue / totalValue * 100 : 0;
            const typeInfo = assetTypes.find(
              (a) => a.value === h.assetType
            );
            const iconInfo = assetIcons[h.assetType];
            const IconComp = iconInfo == null ? void 0 : iconInfo.Icon;
            const barColor = (typeInfo == null ? void 0 : typeInfo.color) ?? (iconInfo == null ? void 0 : iconInfo.color) ?? "#64748b";
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": `portfolio.item.${i + 1}`,
                className: "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                      IconComp && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                          style: {
                            backgroundColor: `${iconInfo == null ? void 0 : iconInfo.color}20`
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            IconComp,
                            {
                              className: "w-3.5 h-3.5",
                              style: { color: iconInfo == null ? void 0 : iconInfo.color }
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-gray-900 dark:text-slate-100 truncate", children: h.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0",
                          style: { backgroundColor: barColor },
                          children: h.notes || (typeInfo == null ? void 0 : typeInfo.label) || h.assetType
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Invested" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-slate-200 tabular-nums", children: fmt(invested) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Current" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-slate-200 tabular-nums", children: fmt(h.currentValue) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Gain/Loss %" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "p",
                          {
                            className: `text-sm font-bold tabular-nums ${glPct >= 0 ? "text-emerald-600" : "text-red-500"}`,
                            children: [
                              glPct >= 0 ? "+" : "",
                              glPct.toFixed(1),
                              "%"
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Gain/Loss" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "p",
                          {
                            className: `text-sm font-bold tabular-nums ${gl >= 0 ? "text-emerald-600" : "text-red-500"}`,
                            children: [
                              gl >= 0 ? "+" : "",
                              fmt(gl)
                            ]
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex flex-col items-end gap-1.5 min-w-[80px]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-gray-800 dark:text-slate-200 tabular-nums leading-none", children: [
                        allocPct.toFixed(1),
                        "%"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 mt-0.5", children: "Allocation" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all duration-500",
                        style: {
                          width: `${Math.min(allocPct, 100)}%`,
                          backgroundColor: barColor
                        }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mt-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "outline",
                          size: "icon",
                          className: "h-7 w-7 border-gray-200 dark:border-slate-600 text-gray-500 hover:text-blue-600 hover:border-blue-300 rounded-lg",
                          "data-ocid": `portfolio.edit_button.${i + 1}`,
                          onClick: () => openEdit(h),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "outline",
                          size: "icon",
                          className: "h-7 w-7 border-gray-200 dark:border-slate-600 text-gray-400 hover:text-red-500 hover:border-red-300 rounded-lg",
                          "data-ocid": `portfolio.delete_button.${i + 1}`,
                          onClick: () => del(h.id),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                        }
                      )
                    ] })
                  ] })
                ] })
              },
              h.id
            );
          })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-100 shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "table",
        {
          className: "w-full text-sm",
          "data-ocid": "portfolio.table",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "th",
                {
                  className: thClass,
                  onClick: () => toggleSort("name"),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") toggleSort("name");
                  },
                  children: [
                    "Name/Ticker",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SortIcon,
                      {
                        col: "name",
                        sortCol,
                        sortDir
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "th",
                {
                  className: thClassRight,
                  onClick: () => toggleSort("invested"),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") toggleSort("invested");
                  },
                  children: [
                    "Invested",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SortIcon,
                      {
                        col: "invested",
                        sortCol,
                        sortDir
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "th",
                {
                  className: thClassRight,
                  onClick: () => toggleSort("currentValue"),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") toggleSort("currentValue");
                  },
                  children: [
                    "Current",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SortIcon,
                      {
                        col: "currentValue",
                        sortCol,
                        sortDir
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "th",
                {
                  className: thClassRight,
                  onClick: () => toggleSort("glPct"),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") toggleSort("glPct");
                  },
                  children: [
                    "Gain/Loss%",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SortIcon,
                      {
                        col: "glPct",
                        sortCol,
                        sortDir
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "th",
                {
                  className: thClassRight,
                  onClick: () => toggleSort("gl"),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") toggleSort("gl");
                  },
                  children: [
                    "Gain/Loss",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SortIcon,
                      {
                        col: "gl",
                        sortCol,
                        sortDir
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "th",
                {
                  className: thClass,
                  onClick: () => toggleSort("category"),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") toggleSort("category");
                  },
                  children: [
                    "Category",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SortIcon,
                      {
                        col: "category",
                        sortCol,
                        sortDir
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "th",
                {
                  className: thClassRight,
                  onClick: () => toggleSort("allocPct"),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") toggleSort("allocPct");
                  },
                  children: [
                    "Allocation%",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SortIcon,
                      {
                        col: "allocPct",
                        sortCol,
                        sortDir
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center text-[11px] font-semibold text-white uppercase tracking-wide", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: filtered.map((h, i) => {
              const invested = h.costBasis * h.quantity;
              const gl = h.currentValue - invested;
              const glPct = invested > 0 ? gl / invested * 100 : 0;
              const allocPct = totalValue > 0 ? h.currentValue / totalValue * 100 : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `portfolio.item.${i + 1}`,
                  className: "hover:bg-slate-50/80 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-medium text-slate-800", children: h.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-right tabular-nums text-slate-700 font-medium whitespace-nowrap", children: fmt(invested) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-right tabular-nums font-medium text-slate-800 whitespace-nowrap", children: fmt(h.currentValue) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "td",
                      {
                        className: `px-4 py-3 text-xs text-right tabular-nums font-semibold whitespace-nowrap ${glPct >= 0 ? "text-emerald-600" : "text-red-500"}`,
                        children: [
                          glPct >= 0 ? "+" : "",
                          glPct.toFixed(1),
                          "%"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "td",
                      {
                        className: `px-4 py-3 text-xs text-right tabular-nums font-semibold whitespace-nowrap ${gl >= 0 ? "text-emerald-600" : "text-red-500"}`,
                        children: [
                          gl >= 0 ? "+" : "",
                          fmt(gl)
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-slate-500", children: h.notes || "-" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-sm text-right tabular-nums text-slate-600", children: [
                      allocPct.toFixed(1),
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 justify-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-slate-400 hover:text-slate-700",
                          "data-ocid": `portfolio.edit_button.${i + 1}`,
                          onClick: () => openEdit(h),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-slate-300 hover:text-red-500",
                          "data-ocid": `portfolio.delete_button.${i + 1}`,
                          onClick: () => del(h.id),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                        }
                      )
                    ] }) })
                  ]
                },
                h.id
              );
            }) })
          ]
        }
      ) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "portfolio.dialog", className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Holding" : "Add Holding" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name/Ticker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "portfolio.name.input",
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Asset Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.assetType,
                onValueChange: (v) => handleAssetTypeChange(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "portfolio.assettype.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: assetTypes.map((at) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: at.value, children: at.label }, at.value)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.category,
                onValueChange: (v) => setForm((f) => ({ ...f, category: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "portfolio.category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (categoryOptions[form.assetType] ?? []).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat)) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "portfolio.quantity.input",
              type: "number",
              value: form.quantity,
              onChange: (e) => handleQuantityChange(Number(e.target.value)),
              autoFocus: !!editing
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2", children: "Buy Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Buy Price (per unit)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "portfolio.buyprice.input",
                  type: "number",
                  value: form.buyPrice,
                  disabled: investedMode === "invested",
                  onChange: (e) => handleBuyPriceChange(Number(e.target.value)),
                  className: investedMode === "invested" ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Invested Value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "portfolio.invested.input",
                  type: "number",
                  value: form.invested,
                  disabled: investedMode === "buyPrice",
                  onChange: (e) => handleInvestedChange(Number(e.target.value)),
                  className: investedMode === "buyPrice" ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2", children: "Current Value Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Market Price (per unit)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "portfolio.marketprice.input",
                  type: "number",
                  value: form.marketPrice,
                  disabled: currentMode === "currentValue",
                  onChange: (e) => handleMarketPriceChange(Number(e.target.value)),
                  className: currentMode === "currentValue" ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current Value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "portfolio.currentvalue.input",
                  type: "number",
                  value: form.currentValue,
                  disabled: currentMode === "marketPrice",
                  onChange: (e) => handleCurrentValueChange(Number(e.target.value)),
                  className: currentMode === "marketPrice" ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            "data-ocid": "portfolio.cancel_button",
            onClick: () => setOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "portfolio.submit_button",
            onClick: save,
            disabled: saving,
            children: saving ? "Saving..." : "Save"
          }
        )
      ] })
    ] }) })
  ] });
}
const assetIcons = {
  [AssetType.Retirement]: { Icon: PiggyBank, color: "#6366f1" },
  [AssetType.MutualFund]: { Icon: ChartColumn, color: "#22c55e" },
  [AssetType.ETF]: { Icon: TrendingUp, color: "#10b981" },
  [AssetType.Crypto]: { Icon: Zap, color: "#f97316" },
  [AssetType.Commodity]: { Icon: Gem, color: "#eab308" },
  [AssetType.RealEstate]: { Icon: Building2, color: "#a855f7" },
  [AssetType.FixedIncome]: { Icon: Landmark, color: "#06b6d4" },
  [AssetType.Other]: { Icon: Package, color: "#64748b" }
};
function PortfolioOverview({
  holdings,
  fmt,
  viewMode = "table"
}) {
  const { country: ovCountry } = useCurrency();
  const assetSummaries = reactExports.useMemo(() => {
    return assetTypes.map((at) => {
      const group = holdings.filter((h) => h.assetType === at.value);
      const invested = group.reduce((s, h) => s + h.costBasis * h.quantity, 0);
      const current = group.reduce((s, h) => s + h.currentValue, 0);
      const gl = current - invested;
      const glPct = invested > 0 ? gl / invested * 100 : 0;
      return { ...at, invested, current, gl, glPct, count: group.length };
    });
  }, [holdings]);
  const equityCapData = reactExports.useMemo(() => {
    const eq = holdings.filter((h) => h.assetType === AssetType.ETF);
    const buckets = {
      "Large Cap": 0,
      "Mid Cap": 0,
      "Small Cap": 0,
      Other: 0
    };
    for (const h of eq) {
      const cat = h.notes || "Other";
      if (cat === "Large Cap") buckets["Large Cap"] += h.currentValue;
      else if (cat === "Mid Cap") buckets["Mid Cap"] += h.currentValue;
      else if (cat === "Small Cap") buckets["Small Cap"] += h.currentValue;
      else buckets.Other += h.currentValue;
    }
    const total = Object.values(buckets).reduce((s, v) => s + v, 0);
    return Object.entries(buckets).filter(([, v]) => v > 0).map(([name, value]) => ({
      name,
      value,
      pct: total > 0 ? (value / total * 100).toFixed(1) : "0"
    }));
  }, [holdings]);
  const mfCapData = reactExports.useMemo(() => {
    const mf = holdings.filter((h) => h.assetType === AssetType.MutualFund);
    const buckets = {
      "Large Cap": 0,
      "Mid Cap": 0,
      "Small Cap": 0,
      Other: 0
    };
    const largeBucket = /* @__PURE__ */ new Set([
      "Large Cap",
      "Flexi Cap",
      "Multi Cap",
      "Multi Asset"
    ]);
    for (const h of mf) {
      const cat = h.notes || "Other";
      if (largeBucket.has(cat)) buckets["Large Cap"] += h.currentValue;
      else if (cat === "Mid Cap") buckets["Mid Cap"] += h.currentValue;
      else if (cat === "Small Cap") buckets["Small Cap"] += h.currentValue;
      else buckets.Other += h.currentValue;
    }
    const total = Object.values(buckets).reduce((s, v) => s + v, 0);
    return Object.entries(buckets).filter(([, v]) => v > 0).map(([name, value]) => ({
      name,
      value,
      pct: total > 0 ? (value / total * 100).toFixed(1) : "0"
    }));
  }, [holdings]);
  const CAP_COLORS = {
    "Large Cap": "#3b82f6",
    "Mid Cap": "#f59e0b",
    "Small Cap": "#ef4444",
    Other: "#94a3b8"
  };
  const totalInvested = assetSummaries.reduce((s, a) => s + a.invested, 0);
  const totalCurrent = assetSummaries.reduce((s, a) => s + a.current, 0);
  const barData = assetSummaries.filter((s) => s.invested > 0 || s.current > 0).map((s) => ({
    name: s.label.replace(" (ETF/Stocks)", "").replace("Fixed Income", "Fixed Inc."),
    Invested: s.invested,
    Current: s.current
  }));
  const [overviewSort, setOverviewSort] = reactExports.useState({ col: "current", dir: "desc" });
  const sortedSummaries = reactExports.useMemo(() => {
    const totCur = assetSummaries.reduce((s, a) => s + a.current, 0);
    const withAlloc = assetSummaries.map((s) => ({
      ...s,
      alloc: totCur > 0 ? s.current / totCur * 100 : 0
    }));
    return [...withAlloc].sort((a, b) => {
      let av = 0;
      let bv = 0;
      if (overviewSort.col === "label") {
        const cmp = a.label.localeCompare(b.label);
        return overviewSort.dir === "asc" ? cmp : -cmp;
      }
      av = a[overviewSort.col];
      bv = b[overviewSort.col];
      return overviewSort.dir === "asc" ? av - bv : bv - av;
    });
  }, [assetSummaries, overviewSort]);
  const toggleSort = (col) => {
    setOverviewSort(
      (prev) => prev.col === col ? { col, dir: prev.dir === "asc" ? "desc" : "asc" } : { col, dir: "desc" }
    );
  };
  const SortArrow = ({ col }) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 opacity-70", children: overviewSort.col === col ? overviewSort.dir === "asc" ? "▲" : "▼" : "▽" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    (() => {
      const gl = totalCurrent - totalInvested;
      const glPct = totalInvested > 0 ? gl / totalInvested * 100 : 0;
      const sym = ovCountry.symbol;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-500 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Total Invested" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums", children: shortNum(totalInvested, sym) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-indigo-500 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Current Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums", children: shortNum(totalCurrent, sym) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 px-4 py-3 shadow-sm ${gl >= 0 ? "border-l-emerald-500" : "border-l-red-500"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Gain / Loss" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-base font-bold tabular-nums ${gl >= 0 ? "text-emerald-600" : "text-red-500"}`,
                  children: [
                    gl >= 0 ? "+" : "",
                    fmt(gl)
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 px-4 py-3 shadow-sm ${glPct >= 0 ? "border-l-emerald-500" : "border-l-red-500"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "% Gain/Loss" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-base font-bold tabular-nums ${glPct >= 0 ? "text-emerald-600" : "text-red-500"}`,
                  children: [
                    glPct >= 0 ? "+" : "",
                    glPct.toFixed(2),
                    "%"
                  ]
                }
              )
            ]
          }
        )
      ] });
    })(),
    viewMode === "card" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 gap-3",
        "data-ocid": "portfolio.overview_card_list",
        children: sortedSummaries.filter((s) => s.invested > 0 || s.current > 0).map((s, i) => {
          const iconInfo = assetIcons[s.value];
          const IconComp = iconInfo == null ? void 0 : iconInfo.Icon;
          const barColor = s.color ?? (iconInfo == null ? void 0 : iconInfo.color) ?? "#64748b";
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": `portfolio.overview.item.${i + 1}`,
              className: "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    IconComp && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                        style: { backgroundColor: `${iconInfo == null ? void 0 : iconInfo.color}20` },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          IconComp,
                          {
                            className: "w-3.5 h-3.5",
                            style: { color: iconInfo == null ? void 0 : iconInfo.color }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-gray-900 dark:text-slate-100", children: s.label.replace(" (ETF/Stocks)", " ETF/Stocks") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-gray-500 dark:text-slate-400", children: [
                        s.count,
                        " holding",
                        s.count !== 1 ? "s" : ""
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Invested" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-slate-200 tabular-nums", children: fmt(s.invested) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Current" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-slate-200 tabular-nums", children: fmt(s.current) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Gain/Loss %" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: `text-sm font-bold tabular-nums ${s.glPct >= 0 ? "text-emerald-600" : "text-red-500"}`,
                          children: [
                            s.glPct >= 0 ? "+" : "",
                            s.glPct.toFixed(1),
                            "%"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Gain/Loss" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: `text-sm font-bold tabular-nums ${s.gl >= 0 ? "text-emerald-600" : "text-red-500"}`,
                          children: [
                            s.gl >= 0 ? "+" : "",
                            fmt(s.gl)
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex flex-col items-end gap-1.5 min-w-[80px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-gray-800 dark:text-slate-200 tabular-nums leading-none", children: [
                      s.alloc.toFixed(1),
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 mt-0.5", children: "Allocation" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full transition-all duration-500",
                      style: {
                        width: `${Math.min(s.alloc, 100)}%`,
                        backgroundColor: barColor
                      }
                    }
                  ) })
                ] })
              ] })
            },
            s.value
          );
        })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "rounded-2xl border border-slate-100 shadow-sm bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 pb-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-slate-700 hover:bg-slate-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "text-white text-xs font-semibold uppercase cursor-pointer select-none",
            onClick: () => toggleSort("label"),
            children: [
              "Investment",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortArrow, { col: "label" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "text-white text-xs font-semibold uppercase text-right cursor-pointer select-none",
            onClick: () => toggleSort("invested"),
            children: [
              "Invested",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortArrow, { col: "invested" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "text-white text-xs font-semibold uppercase text-right cursor-pointer select-none",
            onClick: () => toggleSort("current"),
            children: [
              "Current",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortArrow, { col: "current" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "text-white text-xs font-semibold uppercase text-right cursor-pointer select-none",
            onClick: () => toggleSort("glPct"),
            children: [
              "Gain/Loss%",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortArrow, { col: "glPct" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "text-white text-xs font-semibold uppercase text-right cursor-pointer select-none",
            onClick: () => toggleSort("gl"),
            children: [
              "Gain/Loss",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortArrow, { col: "gl" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "text-white text-xs font-semibold uppercase text-right cursor-pointer select-none",
            onClick: () => toggleSort("alloc"),
            children: [
              "Allocation%",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortArrow, { col: "alloc" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
        sortedSummaries.map((s) => {
          const iconInfo = assetIcons[s.value];
          const IconComp = iconInfo == null ? void 0 : iconInfo.Icon;
          const alloc = s.alloc;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-slate-50/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0",
                  style: {
                    backgroundColor: `${iconInfo == null ? void 0 : iconInfo.color}18`
                  },
                  children: IconComp && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    IconComp,
                    {
                      className: "w-3.5 h-3.5",
                      style: { color: iconInfo == null ? void 0 : iconInfo.color }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-700", children: s.label.replace(" (ETF/Stocks)", " ETF/Stocks") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs tabular-nums text-slate-600 py-2.5", children: fmt(s.invested) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs tabular-nums font-semibold text-slate-800 py-2.5", children: fmt(s.current) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `text-xs font-semibold px-1.5 py-0.5 rounded ${s.glPct >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`,
                children: [
                  s.glPct >= 0 ? "+" : "",
                  s.glPct.toFixed(1),
                  "%"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableCell,
              {
                className: `text-right text-xs tabular-nums font-semibold py-2.5 ${s.gl >= 0 ? "text-emerald-600" : "text-red-500"}`,
                children: [
                  s.gl >= 0 ? "+" : "",
                  fmt(s.gl)
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right text-xs tabular-nums text-slate-600 py-2.5", children: [
              alloc.toFixed(1),
              "%"
            ] })
          ] }, s.value);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-slate-50 border-t-2 border-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5 text-xs font-bold text-slate-700", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs tabular-nums font-bold text-slate-700 py-2.5", children: fmt(totalInvested) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs tabular-nums font-bold text-slate-800 py-2.5", children: fmt(totalCurrent) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableCell,
            {
              className: `text-right text-xs tabular-nums font-bold py-2.5 ${totalCurrent - totalInvested >= 0 ? "text-emerald-600" : "text-red-500"}`,
              children: [
                totalCurrent - totalInvested >= 0 ? "+" : "",
                fmt(totalCurrent - totalInvested)
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right py-2.5", children: totalInvested > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs font-bold px-1.5 py-0.5 rounded ${(totalCurrent - totalInvested) / totalInvested * 100 >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`,
              children: [
                (totalCurrent - totalInvested) / totalInvested * 100 >= 0 ? "+" : "",
                ((totalCurrent - totalInvested) / totalInvested * 100).toFixed(1),
                "%"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs tabular-nums font-bold text-slate-700 py-2.5", children: "100%" })
        ] })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Allocation%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "By asset type" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: (() => {
          const totCur = assetSummaries.reduce((s, a) => s + a.current, 0);
          const donutData = assetSummaries.filter((a) => a.current > 0).map((a) => ({
            name: a.label.replace(" (ETF/Stocks)", ""),
            value: totCur > 0 ? Number.parseFloat(
              (a.current / totCur * 100).toFixed(1)
            ) : 0,
            color: a.color
          }));
          if (donutData.length === 0)
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 flex items-center justify-center text-slate-300 text-sm", children: "No data" });
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-shrink-0",
                style: { width: 180, height: 220 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Pie,
                    {
                      data: donutData,
                      cx: "50%",
                      cy: "50%",
                      innerRadius: 55,
                      outerRadius: 90,
                      dataKey: "value",
                      strokeWidth: 2,
                      stroke: "#fff",
                      labelLine: false,
                      children: donutData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, entry.name))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      formatter: (v, n) => [`${v}%`, n],
                      contentStyle: {
                        fontSize: "11px",
                        borderRadius: "8px"
                      }
                    }
                  )
                ] }) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 flex-1 min-w-0", children: donutData.map((entry) => {
              const total = donutData.reduce((s, d) => s + d.value, 0);
              const pct = total > 0 ? (entry.value / total * 100).toFixed(1) : "0";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                          style: { background: entry.color }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-600 truncate", children: entry.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-slate-700 flex-shrink-0", children: [
                      pct,
                      "%"
                    ] })
                  ]
                },
                entry.name
              );
            }) })
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700", children: "Equity - Allocation%" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: equityCapData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-shrink-0",
              style: { width: 180, height: 220 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Pie,
                  {
                    data: equityCapData,
                    cx: "40%",
                    cy: "50%",
                    innerRadius: 55,
                    outerRadius: 90,
                    dataKey: "value",
                    labelLine: false,
                    children: equityCapData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Cell,
                      {
                        fill: CAP_COLORS[entry.name] ?? "#94a3b8",
                        stroke: "#fff",
                        strokeWidth: 2
                      },
                      entry.name
                    ))
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    formatter: (v, _n, p) => {
                      var _a;
                      return [
                        `${fmt(v)} (${((_a = p.payload) == null ? void 0 : _a.pct) ?? "0"}%)`,
                        "Current Value"
                      ];
                    },
                    contentStyle: {
                      fontSize: "11px",
                      borderRadius: "10px"
                    }
                  }
                )
              ] }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 flex-1 min-w-0", children: equityCapData.map((entry) => {
            const tot = equityCapData.reduce((s, d) => s + d.value, 0);
            const pct = tot > 0 ? (entry.value / tot * 100).toFixed(1) : "0";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                        style: {
                          background: CAP_COLORS[entry.name] ?? "#94a3b8"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-600 truncate", children: entry.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-slate-700 flex-shrink-0", children: [
                    pct,
                    "%"
                  ] })
                ]
              },
              entry.name
            );
          }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] flex items-center justify-center text-slate-300 text-sm", children: "No equity holdings yet" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700", children: "Mutual Fund - Allocation%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: "Flexi, Multi Cap & Multi Asset counted as Large Cap" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: mfCapData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-shrink-0",
              style: { width: 180, height: 220 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Pie,
                  {
                    data: mfCapData,
                    cx: "40%",
                    cy: "50%",
                    innerRadius: 55,
                    outerRadius: 90,
                    dataKey: "value",
                    labelLine: false,
                    children: mfCapData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Cell,
                      {
                        fill: CAP_COLORS[entry.name] ?? "#94a3b8",
                        stroke: "#fff",
                        strokeWidth: 2
                      },
                      entry.name
                    ))
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    formatter: (v, _n, p) => {
                      var _a;
                      return [
                        `${fmt(v)} (${((_a = p.payload) == null ? void 0 : _a.pct) ?? "0"}%)`,
                        "Current Value"
                      ];
                    },
                    contentStyle: {
                      fontSize: "11px",
                      borderRadius: "10px"
                    }
                  }
                )
              ] }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 flex-1 min-w-0", children: mfCapData.map((entry) => {
            const tot = mfCapData.reduce((s, d) => s + d.value, 0);
            const pct = tot > 0 ? (entry.value / tot * 100).toFixed(1) : "0";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                        style: {
                          background: CAP_COLORS[entry.name] ?? "#94a3b8"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-600 truncate", children: entry.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-slate-700 flex-shrink-0", children: [
                    pct,
                    "%"
                  ] })
                ]
              },
              entry.name
            );
          }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] flex items-center justify-center text-slate-300 text-sm", children: "No mutual fund holdings yet" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 tracking-tight", children: "Invested vs Current Value — All Asset Types" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-slate-400", children: "Horizontal comparison across modules" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: barData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 flex items-center justify-center text-slate-300 text-sm", children: "No holdings yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          ResponsiveContainer,
          {
            width: "100%",
            height: Math.max(200, barData.length * 52),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              BarChart,
              {
                data: barData,
                layout: "vertical",
                margin: { top: 5, right: 40, left: 10, bottom: 5 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CartesianGrid,
                    {
                      strokeDasharray: "3 3",
                      stroke: "#f1f5f9",
                      horizontal: false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    XAxis,
                    {
                      type: "number",
                      tick: { fontSize: 10, fill: "#94a3b8" },
                      tickFormatter: (v) => fmt(v)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    YAxis,
                    {
                      type: "category",
                      dataKey: "name",
                      tick: { fontSize: 11, fill: "#475569" },
                      width: 80
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      formatter: (value, name) => [
                        fmt(value),
                        name
                      ],
                      contentStyle: {
                        fontSize: "11px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "11px" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "Invested",
                      name: "Invested",
                      fill: "#3b82f6",
                      radius: [0, 4, 4, 0],
                      barSize: 16,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        LabelList,
                        {
                          dataKey: "Invested",
                          position: "right",
                          formatter: (v) => shortNum(v, ovCountry.symbol),
                          style: {
                            fontSize: "9px",
                            fill: "#3b82f6",
                            fontWeight: 600
                          }
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "Current",
                      name: "Current Value",
                      fill: "#10b981",
                      radius: [0, 4, 4, 0],
                      barSize: 16,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        LabelList,
                        {
                          dataKey: "Current",
                          position: "right",
                          formatter: (v) => shortNum(v, ovCountry.symbol),
                          style: {
                            fontSize: "9px",
                            fill: "#10b981",
                            fontWeight: 600
                          }
                        }
                      )
                    }
                  )
                ]
              }
            )
          }
        ) })
      ] }),
      (() => {
        const PFCFG = {
          Retirement: { shortLabel: "Retiral", color: "#8b5cf6", cagr: 0.08 },
          ETF: { shortLabel: "Equity", color: "#3b82f6", cagr: 0.12 },
          MutualFund: {
            shortLabel: "Mutual Fund",
            color: "#10b981",
            cagr: 0.12
          },
          FixedIncome: { shortLabel: "FDs", color: "#f59e0b", cagr: 0.07 },
          Crypto: { shortLabel: "Crypto", color: "#ef4444", cagr: 0.2 },
          Commodity: {
            shortLabel: "Commodity",
            color: "#f97316",
            cagr: 0.08
          },
          RealEstate: {
            shortLabel: "Real Estate",
            color: "#06b6d4",
            cagr: 0.1
          },
          Other: { shortLabel: "Other", color: "#6b7280", cagr: 0.08 }
        };
        const PTYPES = Object.keys(PFCFG);
        const pByType = {};
        for (const t of PTYPES) {
          pByType[t] = holdings.filter((h) => h.assetType === t).reduce((s, h) => s + h.currentValue, 0);
        }
        const activeTypes = PTYPES.filter((t) => (pByType[t] ?? 0) > 0);
        if (activeTypes.length === 0) return null;
        const yr = (/* @__PURE__ */ new Date()).getFullYear();
        const forecast = Array.from({ length: 21 }, (_, i) => {
          const row = { year: yr + i };
          for (const t of activeTypes) {
            row[t] = Math.round((pByType[t] ?? 0) * (1 + PFCFG[t].cagr) ** i);
          }
          return row;
        });
        const sym = ovCountry.symbol;
        const forecastLineData = forecast.slice(0, 21).map((row) => {
          const r = {
            year: String(row.year)
          };
          for (const t of activeTypes) r[t] = Number(row[t] ?? 0);
          return r;
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm bg-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700", children: "20-Year Portfolio Forecast" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Total portfolio growth projection" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-2 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 380, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            LineChart,
            {
              data: forecastLineData,
              margin: { top: 10, right: 20, left: 0, bottom: 5 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    dataKey: "year",
                    tick: { fontSize: 9 },
                    interval: 4
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    tickFormatter: (v) => shortNum(Number(v), sym),
                    tick: { fontSize: 10 },
                    width: 56
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    formatter: (v, name) => {
                      const cfg = PFCFG[name];
                      return [shortNum(v, sym), (cfg == null ? void 0 : cfg.shortLabel) ?? name];
                    },
                    contentStyle: {
                      fontSize: "11px",
                      borderRadius: "8px"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "10px" } }),
                activeTypes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Line,
                  {
                    type: "monotone",
                    dataKey: t,
                    name: PFCFG[t].shortLabel,
                    stroke: PFCFG[t].color,
                    strokeWidth: 2,
                    dot: false,
                    activeDot: { r: 4, fill: PFCFG[t].color }
                  },
                  t
                ))
              ]
            }
          ) }) })
        ] }) });
      })()
    ] }),
    (() => {
      const PFCFG2 = {
        Retirement: { shortLabel: "Retiral", color: "#8b5cf6", cagr: 0.08 },
        ETF: { shortLabel: "Equity", color: "#3b82f6", cagr: 0.12 },
        MutualFund: {
          shortLabel: "Mutual Fund",
          color: "#10b981",
          cagr: 0.12
        },
        FixedIncome: { shortLabel: "FDs", color: "#f59e0b", cagr: 0.07 },
        Crypto: { shortLabel: "Crypto", color: "#ef4444", cagr: 0.2 },
        Commodity: { shortLabel: "Commodity", color: "#f97316", cagr: 0.08 },
        RealEstate: {
          shortLabel: "Real Estate",
          color: "#06b6d4",
          cagr: 0.1
        },
        Other: { shortLabel: "Other", color: "#6b7280", cagr: 0.08 }
      };
      const PTYPES2 = Object.keys(PFCFG2);
      const pByType2 = {};
      for (const t of PTYPES2) {
        pByType2[t] = holdings.filter((h) => h.assetType === t).reduce((s, h) => s + h.currentValue, 0);
      }
      const activeTypes2 = PTYPES2.filter((t) => (pByType2[t] ?? 0) > 0);
      if (activeTypes2.length === 0) return null;
      const yr2 = (/* @__PURE__ */ new Date()).getFullYear();
      const forecast2 = Array.from({ length: 21 }, (_, i) => {
        const row = { year: yr2 + i };
        for (const t of activeTypes2) {
          row[t] = Math.round((pByType2[t] ?? 0) * (1 + PFCFG2[t].cagr) ** i);
        }
        return row;
      });
      const sym2 = ovCountry.symbol;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700", children: "20-Year Forecast Table" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              transform: "rotateX(180deg)",
              overflowX: "auto"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: "rotateX(180deg)", minWidth: 600 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "bg-slate-700 text-white text-[11px] font-medium uppercase tracking-wide w-16", children: "Year" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "bg-slate-700 text-white text-[11px] font-medium uppercase tracking-wide w-16", children: "Age" }),
                activeTypes2.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TableHead,
                  {
                    className: "bg-slate-700 text-white text-[11px] font-medium uppercase tracking-wide text-right",
                    children: PFCFG2[t].shortLabel
                  },
                  t
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "bg-slate-700 text-white text-[11px] font-medium uppercase tracking-wide text-right", children: "Total" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: forecast2.map((row, idx) => {
                const total = activeTypes2.reduce(
                  (s, t) => s + Number(row[t] ?? 0),
                  0
                );
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TableRow,
                  {
                    className: `hover:bg-slate-50/80 ${idx % 5 === 0 ? "bg-blue-50/30" : ""}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-semibold text-slate-700 tabular-nums", children: String(row.year) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-semibold text-blue-600 tabular-nums", children: (() => {
                        const dob = localStorage.getItem("gff_dob");
                        const base = dob ? Math.floor(
                          (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1e3)
                        ) : 30;
                        return base + idx;
                      })() }),
                      activeTypes2.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TableCell,
                        {
                          className: "text-xs text-right text-slate-600 tabular-nums",
                          children: shortNum(Number(row[t] ?? 0), sym2)
                        },
                        t
                      )),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-right font-bold text-emerald-700 tabular-nums", children: shortNum(total, sym2) })
                    ]
                  },
                  String(row.year)
                );
              }) })
            ] }) })
          }
        ) })
      ] });
    })()
  ] });
}
export {
  PortfolioPage as default
};
