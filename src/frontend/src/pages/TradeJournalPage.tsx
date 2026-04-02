import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart2,
  BookOpen,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  Filter,
  GripVertical,
  MoreVertical,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useCurrency } from "../contexts/CurrencyContext";
import { useActor } from "../hooks/useActor";

// ─── Types ───────────────────────────────────────────────────────────────────
interface TradeEntry {
  id: string;
  ticker: string;
  entryDate: string;
  entryTime: string;
  positionType: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  strategy: string;
  marketConditions: string;
  emotions: string;
  notes: string;
  tags: string;
  commission: number;
  isOpen: boolean;
}

interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
  isCustom: boolean;
  sortOrder: bigint;
}

const EMPTY_TRADE: Omit<TradeEntry, "id"> = {
  ticker: "",
  entryDate: new Date().toISOString().split("T")[0],
  entryTime: "09:30",
  positionType: "Long",
  entryPrice: 0,
  exitPrice: 0,
  quantity: 0,
  stopLoss: 0,
  takeProfit: 0,
  strategy: "",
  marketConditions: "",
  emotions: "Neutral",
  notes: "",
  tags: "",
  commission: 0,
  isOpen: false,
};

const DEFAULT_CHECKLIST: Omit<ChecklistItem, "id">[] = [
  {
    text: "Market trend confirmed?",
    isChecked: false,
    isCustom: false,
    sortOrder: BigInt(0),
  },
  {
    text: "Risk/Reward ≥ 2:1?",
    isChecked: false,
    isCustom: false,
    sortOrder: BigInt(1),
  },
  {
    text: "Stop loss defined?",
    isChecked: false,
    isCustom: false,
    sortOrder: BigInt(2),
  },
  {
    text: "Position size calculated?",
    isChecked: false,
    isCustom: false,
    sortOrder: BigInt(3),
  },
  {
    text: "No major news events?",
    isChecked: false,
    isCustom: false,
    sortOrder: BigInt(4),
  },
];

const EMOTION_OPTIONS = [
  "Calm",
  "Confident",
  "Fearful",
  "Greedy",
  "Neutral",
  "FOMO",
  "Disciplined",
];

// ─── Calculations ─────────────────────────────────────────────────────────────
function calcPnL(t: TradeEntry): number {
  if (t.isOpen || t.exitPrice === 0) return 0;
  const dir = t.positionType === "Long" ? 1 : -1;
  return (t.exitPrice - t.entryPrice) * t.quantity * dir - t.commission;
}

function calcPnLPct(t: TradeEntry): number {
  if (t.isOpen || t.exitPrice === 0 || t.entryPrice === 0) return 0;
  return (calcPnL(t) / (t.entryPrice * t.quantity)) * 100;
}

function calcRR(t: Partial<TradeEntry>): number {
  const ep = t.entryPrice ?? 0;
  const ex = t.exitPrice ?? 0;
  const sl = t.stopLoss ?? 0;
  if (ep === 0 || sl === 0) return 0;
  const risk = Math.abs(ep - sl);
  const reward = Math.abs(ex - ep);
  return risk === 0 ? 0 : reward / risk;
}

function calcPositionSize(t: Partial<TradeEntry>): number {
  return (t.entryPrice ?? 0) * (t.quantity ?? 0);
}

function fmtCurrency(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

function fmtNum(val: number, decimals = 2): string {
  return val.toFixed(decimals);
}

function getSession(time: string): string {
  if (!time) return "Regular";
  const [h] = time.split(":").map(Number);
  if (h < 9 || (h === 9 && 0 < 30)) return "Pre-market";
  if (h >= 16) return "After-hours";
  return "Regular";
}

function getDayName(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
}

// ─── Subcomponents ──────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  color = "text-white",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
        <Icon className="h-4 w-4 text-slate-400 opacity-60" />
      </div>
      <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TradeJournalPage() {
  const { actor, isFetching } = useActor();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "log" | "journal" | "analytics"
  >("dashboard");
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"daily" | "weekly" | "monthly">(
    "monthly",
  );

  // Dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTrade, setEditingTrade] = useState<TradeEntry | null>(null);
  const [form, setForm] = useState<Omit<TradeEntry, "id">>(EMPTY_TRADE);

  // Trade Log filters
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterTicker, setFilterTicker] = useState("");
  const [filterStrategy, setFilterStrategy] = useState("all");
  const [filterOutcome, setFilterOutcome] = useState("all");
  const [filterSearch, setFilterSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  // Checklist
  const [newCheckItem, setNewCheckItem] = useState("");

  // Journal expanded trades
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(
    new Set(),
  );

  // ── Load Data ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!actor || isFetching) return;
    const load = async () => {
      try {
        setLoading(true);
        const [tradeData, checkData] = await Promise.all([
          actor.getAllTradeEntries(),
          actor.getAllChecklistItems(),
        ]);
        const tradeArr: TradeEntry[] = Array.isArray(tradeData)
          ? tradeData
          : [];
        setTrades(tradeArr);
        const checkArr: ChecklistItem[] = Array.isArray(checkData)
          ? checkData
          : [];
        if (checkArr.length === 0) {
          // Bootstrap defaults
          const created = await Promise.all(
            DEFAULT_CHECKLIST.map((item) =>
              actor.createChecklistItem({
                ...item,
                id: crypto.randomUUID(),
              }),
            ),
          );
          setChecklist(created);
        } else {
          setChecklist(
            checkArr.sort((a: ChecklistItem, b: ChecklistItem) =>
              a.sortOrder < b.sortOrder
                ? -1
                : a.sortOrder > b.sortOrder
                  ? 1
                  : 0,
            ),
          );
        }
      } catch {
        toast.error("Failed to load trade data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [actor, isFetching]);

  // ── Filtered Trades by Time ───────────────────────────────────────────────
  const filteredByTime = useMemo(() => {
    const now = new Date();
    return trades.filter((t) => {
      if (!t.entryDate) return true;
      const d = new Date(t.entryDate);
      if (timeFilter === "daily") {
        return d.toDateString() === now.toDateString();
      }
      if (timeFilter === "weekly") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return d >= monthAgo;
    });
  }, [trades, timeFilter]);

  // ── Dashboard Metrics ────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const closed = filteredByTime.filter((t) => !t.isOpen && t.exitPrice > 0);
    const total = closed.length;
    const wins = closed.filter((t) => calcPnL(t) > 0);
    const losses = closed.filter((t) => calcPnL(t) <= 0);
    const winRate = total === 0 ? 0 : (wins.length / total) * 100;
    const totalPnL = closed.reduce((sum, t) => sum + calcPnL(t), 0);
    const avgWin =
      wins.length === 0
        ? 0
        : wins.reduce((s, t) => s + calcPnL(t), 0) / wins.length;
    const avgLoss =
      losses.length === 0
        ? 0
        : Math.abs(losses.reduce((s, t) => s + calcPnL(t), 0) / losses.length);
    const profitFactor =
      avgLoss === 0
        ? 0
        : (avgWin * wins.length) / (avgLoss * losses.length || 1);
    const bestTrade =
      closed.length === 0
        ? null
        : closed.reduce(
            (best, t) => (calcPnL(t) > calcPnL(best) ? t : best),
            closed[0],
          );
    const _worstTrade =
      closed.length === 0
        ? null
        : closed.reduce(
            (worst, t) => (calcPnL(t) < calcPnL(worst) ? t : worst),
            closed[0],
          );

    // Streak
    let streak = 0;
    let streakType = "";
    const sorted = [...closed].sort(
      (a, b) =>
        new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
    );
    for (const t of sorted) {
      const w = calcPnL(t) > 0;
      if (streak === 0) {
        streak = 1;
        streakType = w ? "Win" : "Loss";
      } else if ((w && streakType === "Win") || (!w && streakType === "Loss"))
        streak++;
      else break;
    }

    return {
      total,
      winRate,
      totalPnL,
      avgWin,
      avgLoss,
      profitFactor,
      bestTrade,
      streak,
      streakType,
      wins: wins.length,
      losses: losses.length,
    };
  }, [filteredByTime]);

  // ── Equity Curve ─────────────────────────────────────────────────────────
  const equityCurve = useMemo(() => {
    const closed = [...trades.filter((t) => !t.isOpen && t.exitPrice > 0)].sort(
      (a, b) =>
        new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime(),
    );
    let cum = 0;
    return closed.map((t) => {
      cum += calcPnL(t);
      return { date: t.entryDate, pnl: Math.round(cum) };
    });
  }, [trades]);

  // ── P&L by Strategy ──────────────────────────────────────────────────────
  const pnlByStrategy = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of filteredByTime.filter((t) => !t.isOpen)) {
      const s = t.strategy || "Unknown";
      map[s] = (map[s] ?? 0) + calcPnL(t);
    }
    return Object.entries(map)
      .map(([name, pnl]) => ({ name, pnl: Math.round(pnl) }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 6);
  }, [filteredByTime]);

  // ── P&L by Instrument ────────────────────────────────────────────────────
  const pnlByTicker = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of filteredByTime.filter((t) => !t.isOpen)) {
      const s = t.ticker || "Unknown";
      map[s] = (map[s] ?? 0) + calcPnL(t);
    }
    return Object.entries(map)
      .map(([name, pnl]) => ({ name, pnl: Math.round(pnl) }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 6);
  }, [filteredByTime]);

  // ── Scatter (Risk/Reward) ────────────────────────────────────────────────
  const scatterData = useMemo(() => {
    return filteredByTime
      .filter((t) => !t.isOpen && t.stopLoss > 0)
      .map((t) => ({
        risk: Math.abs(t.entryPrice - t.stopLoss),
        reward: Math.abs(t.exitPrice - t.entryPrice),
        pnl: calcPnL(t),
      }));
  }, [filteredByTime]);

  // ── Trade Log Filtered ────────────────────────────────────────────────────
  const logFiltered = useMemo(() => {
    return trades
      .filter((t) => {
        if (filterFrom && t.entryDate < filterFrom) return false;
        if (filterTo && t.entryDate > filterTo) return false;
        if (
          filterTicker &&
          !t.ticker.toLowerCase().includes(filterTicker.toLowerCase())
        )
          return false;
        if (filterStrategy !== "all" && t.strategy !== filterStrategy)
          return false;
        if (filterOutcome !== "all") {
          if (filterOutcome === "open" && !t.isOpen) return false;
          if (filterOutcome === "win" && (t.isOpen || calcPnL(t) <= 0))
            return false;
          if (filterOutcome === "loss" && (t.isOpen || calcPnL(t) > 0))
            return false;
        }
        if (
          tagFilter &&
          !t.tags.toLowerCase().includes(tagFilter.toLowerCase())
        )
          return false;
        if (filterSearch) {
          const q = filterSearch.toLowerCase();
          if (
            !t.notes.toLowerCase().includes(q) &&
            !t.tags.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
      );
  }, [
    trades,
    filterFrom,
    filterTo,
    filterTicker,
    filterStrategy,
    filterOutcome,
    filterSearch,
    tagFilter,
  ]);

  // ── All Strategy Names ────────────────────────────────────────────────────
  const allStrategies = useMemo(
    () => [...new Set(trades.map((t) => t.strategy).filter(Boolean))],
    [trades],
  );

  // ── All Tags ──────────────────────────────────────────────────────────────
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const t of trades) {
      for (const x of t.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)) {
        set.add(x);
      }
    }
    return [...set];
  }, [trades]);

  // ── Day of week analytics ────────────────────────────────────────────────
  const dayStats = useMemo(() => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days.map((day) => {
      const dayTrades = trades.filter(
        (t) => !t.isOpen && getDayName(t.entryDate) === day,
      );
      const wins = dayTrades.filter((t) => calcPnL(t) > 0).length;
      const total = dayTrades.length;
      const avgPnL =
        total === 0 ? 0 : dayTrades.reduce((s, t) => s + calcPnL(t), 0) / total;
      const totalPnL = dayTrades.reduce((s, t) => s + calcPnL(t), 0);
      return {
        day,
        trades: total,
        wins,
        winRate: total === 0 ? 0 : (wins / total) * 100,
        avgPnL,
        totalPnL,
      };
    });
  }, [trades]);

  // ── Session Performance ──────────────────────────────────────────────────
  const sessionStats = useMemo(() => {
    const sessions = ["Pre-market", "Regular", "After-hours"];
    return sessions.map((sess) => {
      const st = trades.filter(
        (t) => !t.isOpen && getSession(t.entryTime) === sess,
      );
      const wins = st.filter((t) => calcPnL(t) > 0).length;
      const total = st.length;
      const avgPnL =
        total === 0 ? 0 : st.reduce((s, t) => s + calcPnL(t), 0) / total;
      return {
        session: sess,
        trades: total,
        wins,
        winRate: total === 0 ? 0 : (wins / total) * 100,
        avgPnL,
      };
    });
  }, [trades]);

  // ─── CRUD ─────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingTrade(null);
    setForm(EMPTY_TRADE);
    setShowAddDialog(true);
  };

  const openEdit = (t: TradeEntry) => {
    setEditingTrade(t);
    setForm({ ...t });
    setShowAddDialog(true);
  };

  const saveTrade = useCallback(async () => {
    if (!actor) return;
    try {
      if (editingTrade) {
        await actor.updateTradeEntry(editingTrade.id, {
          ...form,
          id: editingTrade.id,
        });
        setTrades((prev) =>
          prev.map((t) =>
            t.id === editingTrade.id ? { ...form, id: editingTrade.id } : t,
          ),
        );
        toast.success("Trade updated");
      } else {
        const id = crypto.randomUUID();
        await actor.createTradeEntry({ ...form, id });
        setTrades((prev) => [...prev, { ...form, id }]);
        toast.success("Trade logged");
      }
      setShowAddDialog(false);
    } catch {
      toast.error("Failed to save trade");
    }
  }, [actor, form, editingTrade]);

  const deleteTrade = useCallback(
    async (id: string) => {
      if (!actor) return;
      try {
        await actor.deleteTradeEntry(id);
        setTrades((prev) => prev.filter((t) => t.id !== id));
        toast.success("Trade deleted");
      } catch {
        toast.error("Failed to delete trade");
      }
    },
    [actor],
  );

  const closeTrade = useCallback(
    async (t: TradeEntry) => {
      if (!actor) return;
      const updated = { ...t, isOpen: false };
      try {
        await actor.updateTradeEntry(t.id, updated);
        setTrades((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
        toast.success("Trade closed");
      } catch {
        toast.error("Failed to close trade");
      }
    },
    [actor],
  );

  const toggleChecklist = useCallback(
    async (item: ChecklistItem) => {
      if (!actor) return;
      const updated = { ...item, isChecked: !item.isChecked };
      try {
        await actor.updateChecklistItem(item.id, updated);
        setChecklist((prev) =>
          prev.map((c) => (c.id === item.id ? updated : c)),
        );
      } catch {
        toast.error("Failed to update checklist");
      }
    },
    [actor],
  );

  const deleteChecklistItem = useCallback(
    async (id: string) => {
      if (!actor) return;
      try {
        await actor.deleteChecklistItem(id);
        setChecklist((prev) => prev.filter((c) => c.id !== id));
      } catch {
        toast.error("Failed to delete item");
      }
    },
    [actor],
  );

  const addChecklistItem = useCallback(async () => {
    if (!actor || !newCheckItem.trim()) return;
    const item: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newCheckItem.trim(),
      isChecked: false,
      isCustom: true,
      sortOrder: BigInt(checklist.length),
    };
    try {
      await actor.createChecklistItem(item);
      setChecklist((prev) => [...prev, item]);
      setNewCheckItem("");
    } catch {
      toast.error("Failed to add item");
    }
  }, [actor, newCheckItem, checklist.length]);

  // ── Inline P&L Calculations for Form ─────────────────────────────────────
  const formPnL = useMemo(() => {
    if (form.isOpen || !form.exitPrice) return null;
    const dir = form.positionType === "Long" ? 1 : -1;
    const pnl =
      (form.exitPrice - form.entryPrice) * form.quantity * dir -
      form.commission;
    const pct =
      form.entryPrice > 0 ? (pnl / (form.entryPrice * form.quantity)) * 100 : 0;
    const rr = calcRR(form);
    const size = calcPositionSize(form);
    return { pnl, pct, rr, size };
  }, [form]);

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="animate-pulse space-y-4">
          {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
            <div key={k} className="h-16 bg-card rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "log", label: "Trade Log", icon: BookOpen },
    { id: "journal", label: "Journal & Review", icon: CheckSquare },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-4 md:px-6 pt-2 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h1 className="text-lg font-bold text-black dark:text-white">
              Trade Journal
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Log, track &amp; analyze your trades
          </p>
        </div>
        <Button
          data-ocid="trade.open_modal_button"
          onClick={openAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Log Trade
        </Button>
      </div>

      {/* Pill Tabs */}
      <div className="overflow-x-auto pb-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-2">
        <div className="flex gap-2 min-w-max">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              data-ocid={`trade.${id}.tab`}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border flex-shrink-0 ${
                activeTab === id
                  ? "bg-foreground text-background border-foreground shadow"
                  : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-6">
        {/* ═══ TAB 1: Dashboard ═══════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Time Filter */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 w-fit">
              {(["daily", "weekly", "monthly"] as const).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    timeFilter === f
                      ? "bg-slate-800 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard
                label="Total Trades"
                value={String(metrics.total)}
                icon={Activity}
                color="text-black dark:text-white"
              />
              <MetricCard
                label="Win Rate"
                value={`${fmtNum(metrics.winRate)}%`}
                sub={`${metrics.wins}W / ${metrics.losses}L`}
                icon={Target}
                color={
                  metrics.winRate >= 50 ? "text-emerald-400" : "text-red-400"
                }
              />
              <MetricCard
                label="Profit Factor"
                value={fmtNum(metrics.profitFactor)}
                icon={TrendingUp}
                color={
                  metrics.profitFactor >= 1.5
                    ? "text-emerald-400"
                    : "text-amber-400"
                }
              />
              <MetricCard
                label="Total P&L"
                value={fmtCurrency(metrics.totalPnL)}
                icon={metrics.totalPnL >= 0 ? TrendingUp : TrendingDown}
                color={
                  metrics.totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
                }
              />
              <MetricCard
                label="Avg Win"
                value={fmtCurrency(metrics.avgWin)}
                icon={TrendingUp}
                color="text-emerald-400"
              />
              <MetricCard
                label="Avg Loss"
                value={fmtCurrency(metrics.avgLoss)}
                icon={TrendingDown}
                color="text-red-400"
              />
              <MetricCard
                label="Best Trade"
                value={metrics.bestTrade ? metrics.bestTrade.ticker : "-"}
                sub={
                  metrics.bestTrade
                    ? fmtCurrency(calcPnL(metrics.bestTrade))
                    : ""
                }
                icon={Award}
                color="text-emerald-400"
              />
              <MetricCard
                label="Current Streak"
                value={
                  metrics.streak > 0
                    ? `${metrics.streak} ${metrics.streakType}`
                    : "-"
                }
                icon={Activity}
                color={
                  metrics.streakType === "Win"
                    ? "text-emerald-400"
                    : "text-red-400"
                }
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Equity Curve */}
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-slate-600 p-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Equity Curve
                </h3>
                {equityCurve.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                    No closed trades yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={equityCurve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <ReTooltip
                        contentStyle={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: 8,
                        }}
                        labelStyle={{ color: "#94a3b8" }}
                        formatter={(v: number) => [fmtCurrency(v), "Cum. P&L"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="pnl"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Win/Loss Distribution - Donut Charts */}
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-slate-600 p-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Win / Loss Distribution
                </h3>
                <div className="flex items-center justify-center gap-8">
                  {/* Wins Donut */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-[120px] h-[120px]">
                      <PieChart width={120} height={120}>
                        <Pie
                          data={[
                            { value: metrics.wins },
                            {
                              value: Math.max(metrics.total - metrics.wins, 0),
                            },
                          ]}
                          cx={60}
                          cy={60}
                          innerRadius={35}
                          outerRadius={55}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-emerald-500">
                          {metrics.wins}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      Wins
                    </span>
                    {metrics.total > 0 && (
                      <span className="text-xs text-emerald-600 font-semibold">
                        {((metrics.wins / metrics.total) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  {/* Losses Donut */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-[120px] h-[120px]">
                      <PieChart width={120} height={120}>
                        <Pie
                          data={[
                            { value: metrics.losses },
                            {
                              value: Math.max(
                                metrics.total - metrics.losses,
                                0,
                              ),
                            },
                          ]}
                          cx={60}
                          cy={60}
                          innerRadius={35}
                          outerRadius={55}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill="#ef4444" />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-red-500">
                          {metrics.losses}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      Losses
                    </span>
                    {metrics.total > 0 && (
                      <span className="text-xs text-red-600 font-semibold">
                        {((metrics.losses / metrics.total) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* P&L by Strategy */}
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-slate-600 p-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  P&L by Strategy
                </h3>
                {pnlByStrategy.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                    No data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={pnlByStrategy} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        type="number"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                        width={80}
                      />
                      <ReTooltip
                        contentStyle={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: 8,
                        }}
                        formatter={(v: number) => [fmtCurrency(v), "P&L"]}
                      />
                      <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                        {pnlByStrategy.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* P&L by Instrument */}
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-slate-600 p-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  P&L by Instrument
                </h3>
                {pnlByTicker.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                    No data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={pnlByTicker} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        type="number"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                        width={60}
                      />
                      <ReTooltip
                        contentStyle={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: 8,
                        }}
                        formatter={(v: number) => [fmtCurrency(v), "P&L"]}
                      />
                      <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                        {pnlByTicker.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Scatter + Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Risk/Reward Scatter */}
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-slate-600 p-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Risk / Reward Scatter
                </h3>
                {scatterData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                    No data with stop loss
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis
                        dataKey="risk"
                        name="Risk"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                        label={{
                          value: "Risk",
                          fill: "#64748b",
                          fontSize: 10,
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis
                        dataKey="reward"
                        name="Reward"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <ReTooltip
                        contentStyle={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: 8,
                        }}
                        cursor={{ strokeDasharray: "3 3" }}
                      />
                      <Scatter data={scatterData}>
                        {scatterData.map((d) => (
                          <Cell
                            key={`${d.risk}-${d.reward}-${d.pnl}`}
                            fill={d.pnl >= 0 ? "#10b981" : "#ef4444"}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Monthly Heatmap */}
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-slate-600 p-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Monthly Performance Heatmap
                </h3>
                <MonthlyHeatmap trades={filteredByTime} />
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: Trade Log ════════════════════════════════════════════════ */}
        {activeTab === "log" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-4 space-y-3">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-slate-400">From</Label>
                  <Input
                    type="date"
                    value={filterFrom}
                    onChange={(e) => setFilterFrom(e.target.value)}
                    className="bg-white dark:bg-[#112240] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 h-8 text-xs w-36"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-slate-400">To</Label>
                  <Input
                    type="date"
                    value={filterTo}
                    onChange={(e) => setFilterTo(e.target.value)}
                    className="bg-white dark:bg-[#112240] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 h-8 text-xs w-36"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-slate-400">Ticker</Label>
                  <Input
                    placeholder="e.g. NIFTY"
                    value={filterTicker}
                    onChange={(e) => setFilterTicker(e.target.value)}
                    className="bg-white dark:bg-[#112240] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 h-8 text-xs w-28"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-slate-400">Strategy</Label>
                  <Select
                    value={filterStrategy}
                    onValueChange={setFilterStrategy}
                  >
                    <SelectTrigger className="bg-white dark:bg-[#112240] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 h-8 text-xs w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#112240] border-slate-200 dark:border-slate-700">
                      <SelectItem value="all">All</SelectItem>
                      {allStrategies.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-slate-400">Outcome</Label>
                  <Select
                    value={filterOutcome}
                    onValueChange={setFilterOutcome}
                  >
                    <SelectTrigger className="bg-white dark:bg-[#112240] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 h-8 text-xs w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#112240] border-slate-200 dark:border-slate-700">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="win">Win</SelectItem>
                      <SelectItem value="loss">Loss</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-36">
                  <Label className="text-xs text-slate-400">
                    Search notes/tags
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Search..."
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      className="bg-white dark:bg-[#112240] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 h-8 text-xs pl-7"
                    />
                  </div>
                </div>
                {tagFilter && (
                  <button
                    type="button"
                    onClick={() => setTagFilter("")}
                    className="flex items-center gap-1 px-2 py-1 bg-card rounded-lg text-xs text-amber-400 hover:bg-muted"
                  >
                    <Filter className="h-3 w-3" /> Tag: {tagFilter}{" "}
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            {logFiltered.length === 0 ? (
              <div
                data-ocid="trade.log.empty_state"
                className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-12 flex flex-col items-center gap-3 text-center"
              >
                <BookOpen className="h-12 w-12 text-slate-400" />
                <p className="text-slate-400 font-medium">
                  No trades logged yet
                </p>
                <p className="text-slate-400 text-sm">
                  Click "Log Trade" to get started
                </p>
              </div>
            ) : (
              <div
                className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 overflow-hidden"
                data-ocid="trade.log.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-transparent">
                        {[
                          "Date",
                          "Ticker",
                          "L/S",
                          "Entry",
                          "Exit",
                          "Qty",
                          "P&L",
                          "P&L%",
                          "R:R",
                          "Strategy",
                          "Tags",
                          "",
                        ].map((h) => (
                          <TableHead
                            key={h}
                            className="text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap font-semibold uppercase tracking-wide"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logFiltered.map((t, idx) => {
                        const pnl = calcPnL(t);
                        const pct = calcPnLPct(t);
                        const rr = calcRR(t);
                        return (
                          <TableRow
                            key={t.id}
                            data-ocid={`trade.log.item.${idx + 1}`}
                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {t.entryDate}
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                              {t.ticker}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  t.positionType === "Long"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                                }`}
                              >
                                {t.positionType === "Long" ? "L" : "S"}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                              {t.entryPrice}
                            </TableCell>
                            <TableCell className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                              {t.isOpen ? "-" : t.exitPrice}
                            </TableCell>
                            <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                              {t.quantity}
                            </TableCell>
                            <TableCell>
                              {t.isOpen ? (
                                <span className="text-xs text-slate-400 font-mono">
                                  -
                                </span>
                              ) : (
                                <span
                                  className={`text-xs font-semibold font-mono ${pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                                >
                                  {fmtCurrency(pnl)}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {!t.isOpen && (
                                <span
                                  className={`text-xs font-mono ${pct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                                >
                                  {fmtNum(pct)}%
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                              {rr > 0 ? `${fmtNum(rr, 1)}:1` : "-"}
                            </TableCell>
                            <TableCell className="text-xs text-slate-600 dark:text-slate-400 max-w-24 truncate">
                              {t.strategy || "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {t.tags
                                  .split(",")
                                  .filter(Boolean)
                                  .slice(0, 2)
                                  .map((tag) => (
                                    <button
                                      type="button"
                                      key={tag}
                                      onClick={() => setTagFilter(tag.trim())}
                                      className="text-xs px-1.5 py-0.5 rounded-full bg-card text-slate-400 hover:bg-muted"
                                    >
                                      {tag.trim()}
                                    </button>
                                  ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400"
                                  >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white dark:bg-[#112240] border-slate-200 dark:border-slate-700">
                                  <DropdownMenuItem
                                    data-ocid={`trade.log.edit_button.${idx + 1}`}
                                    onClick={() => openEdit(t)}
                                    className="text-slate-400 hover:text-slate-100 cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  {t.isOpen && (
                                    <DropdownMenuItem
                                      onClick={() => closeTrade(t)}
                                      className="text-amber-600 dark:text-amber-400 hover:text-amber-500 cursor-pointer"
                                    >
                                      <X className="h-3.5 w-3.5 mr-2" /> Close
                                      Trade
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    data-ocid={`trade.log.delete_button.${idx + 1}`}
                                    onClick={() => deleteTrade(t.id)}
                                    className="text-red-400 hover:text-red-300 cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-2" />{" "}
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 3: Journal & Review ════════════════════════════════════════ */}
        {activeTab === "journal" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pre-Trade Checklist */}
              <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-5">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-400" /> Pre-Trade
                  Checklist
                </h3>
                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-card/50 rounded-xl"
                    >
                      <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
                      <Checkbox
                        checked={item.isChecked}
                        onCheckedChange={() => toggleChecklist(item)}
                        className="border-slate-500"
                      />
                      <span
                        className={`flex-1 text-sm ${item.isChecked ? "line-through text-slate-400" : "text-slate-400"}`}
                      >
                        {item.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteChecklistItem(item.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Add checklist item..."
                    value={newCheckItem}
                    onChange={(e) => setNewCheckItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
                    className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 text-sm"
                    data-ocid="trade.checklist.input"
                  />
                  <Button
                    onClick={addChecklistItem}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-ocid="trade.checklist.add_button"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Post-Trade Reviews */}
              <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-5">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-400" /> Post-Trade
                  Reviews
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {trades.filter((t) => !t.isOpen).length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">
                      No closed trades yet
                    </p>
                  ) : (
                    trades
                      .filter((t) => !t.isOpen)
                      .sort(
                        (a, b) =>
                          new Date(b.entryDate).getTime() -
                          new Date(a.entryDate).getTime(),
                      )
                      .map((t) => {
                        const pnl = calcPnL(t);
                        const expanded = expandedReviews.has(t.id);
                        const lesson = t.notes.includes("Lesson:")
                          ? t.notes.split("Lesson:")[1]?.trim()
                          : null;
                        return (
                          <div
                            key={t.id}
                            className="bg-slate-50 dark:bg-card/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700"
                          >
                            <button
                              type="button"
                              className="w-full flex items-center justify-between cursor-pointer bg-transparent border-0 p-0 text-left"
                              onClick={() =>
                                setExpandedReviews((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(t.id)) next.delete(t.id);
                                  else next.add(t.id);
                                  return next;
                                })
                              }
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                  {t.ticker}
                                </span>
                                <span className="text-slate-400 text-xs">
                                  {t.entryDate}
                                </span>
                                <span
                                  className={`text-xs font-semibold font-mono ${pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                                >
                                  {fmtCurrency(pnl)}
                                </span>
                              </div>
                              {expanded ? (
                                <ChevronUp className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              )}
                            </button>
                            {expanded && (
                              <div className="mt-3 space-y-2">
                                {t.emotions && (
                                  <div className="text-xs text-slate-400">
                                    <span className="text-slate-400">
                                      Emotions:{" "}
                                    </span>
                                    {t.emotions}
                                  </div>
                                )}
                                {t.notes && (
                                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-card rounded-lg p-2">
                                    {t.notes}
                                  </div>
                                )}
                                {lesson && (
                                  <div className="text-xs bg-amber-900/30 text-amber-300 rounded-lg p-2">
                                    <span className="font-semibold">
                                      Lesson:{" "}
                                    </span>
                                    {lesson}
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-1">
                                  {t.tags
                                    .split(",")
                                    .filter(Boolean)
                                    .map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-xs px-1.5 py-0.5 rounded-full bg-card text-slate-400"
                                      >
                                        {tag.trim()}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            {/* Tag Cloud */}
            {allTags.length > 0 && (
              <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-5">
                <h3 className="text-sm font-semibold text-slate-100 mb-3">
                  Tag Cloud
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        setTagFilter(tag);
                        setActiveTab("log");
                      }}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        tagFilter === tag
                          ? "bg-emerald-600 text-white"
                          : "bg-card text-slate-400 hover:bg-muted"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 4: Analytics ═══════════════════════════════════════════════ */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Pattern Recognition */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Pattern Recognition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Most Profitable Setup */}
                <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Most Profitable Setup
                    </span>
                  </div>
                  {pnlByStrategy.length > 0 ? (
                    <>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {pnlByStrategy[0].name}
                      </div>
                      <div className="text-sm text-emerald-400">
                        {fmtCurrency(pnlByStrategy[0].pnl)}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400 text-sm">No data</p>
                  )}
                </div>

                {/* Most Profitable Instrument */}
                <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Most Profitable Instrument
                    </span>
                  </div>
                  {pnlByTicker.length > 0 ? (
                    <>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {pnlByTicker[0].name}
                      </div>
                      <div className="text-sm text-emerald-400">
                        {fmtCurrency(pnlByTicker[0].pnl)}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400 text-sm">No data</p>
                  )}
                </div>

                {/* Best Day of Week */}
                <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Best Day of Week
                    </span>
                  </div>
                  {(() => {
                    const best = dayStats
                      .filter((d) => d.trades > 0)
                      .sort((a, b) => b.winRate - a.winRate)[0];
                    return best ? (
                      <>
                        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {best.day}
                        </div>
                        <div className="text-sm text-emerald-400">
                          {fmtNum(best.winRate)}% win rate
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-400 text-sm">No data</p>
                    );
                  })()}
                </div>

                {/* Common Losing Patterns */}
                <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Common Losing Patterns
                    </span>
                  </div>
                  {(() => {
                    const lossMap: Record<string, number> = {};
                    for (const t of trades.filter(
                      (t) => !t.isOpen && calcPnL(t) < 0,
                    )) {
                      const s = t.strategy || "Unknown";
                      lossMap[s] = (lossMap[s] ?? 0) + 1;
                    }
                    const top3 = Object.entries(lossMap)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3);
                    return top3.length > 0 ? (
                      <div className="space-y-1">
                        {top3.map(([s, cnt]) => (
                          <div key={s} className="flex justify-between text-xs">
                            <span className="text-slate-800 dark:text-slate-100 truncate">
                              {s}
                            </span>
                            <span className="text-red-400 ml-2">
                              {cnt} losses
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">No data</p>
                    );
                  })()}
                </div>

                {/* Best Time Period */}
                <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 p-4 md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Session Performance
                    </span>
                  </div>
                  <div className="space-y-2">
                    {sessionStats.map((s) => (
                      <div key={s.session} className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-24">
                          {s.session}
                        </span>
                        <div className="flex-1 bg-card rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${s.winRate >= 50 ? "bg-emerald-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min(s.winRate, 100)}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-semibold w-12 text-right ${s.winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {fmtNum(s.winRate)}%
                        </span>
                        <span className="text-xs text-slate-400 w-16 text-right">
                          {s.trades} trades
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Day of Week Table */}
            <div className="bg-card rounded-2xl border border-slate-300 dark:border-slate-600 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Day of Week Performance
                </h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-transparent">
                      {[
                        "Day",
                        "Trades",
                        "Win Rate",
                        "Avg P&L",
                        "Total P&L",
                      ].map((h) => (
                        <TableHead key={h} className="text-slate-400 text-xs">
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dayStats.map((d) => (
                      <TableRow
                        key={d.day}
                        className={`border-slate-200 dark:border-slate-700 ${
                          d.trades === 0
                            ? "opacity-40"
                            : d.avgPnL >= 0
                              ? "hover:bg-emerald-900/10"
                              : "hover:bg-red-900/10"
                        }`}
                      >
                        <TableCell className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {d.day}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                          {d.trades}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-sm font-semibold ${d.trades === 0 ? "text-slate-400" : d.winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {d.trades === 0 ? "-" : `${fmtNum(d.winRate)}%`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-sm ${d.avgPnL >= 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {d.trades === 0 ? "-" : fmtCurrency(d.avgPnL)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-sm font-semibold ${d.totalPnL >= 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {d.trades === 0 ? "-" : fmtCurrency(d.totalPnL)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ Add/Edit Trade Dialog ════════════════════════════════════════════ */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent
          className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto"
          data-ocid="trade.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingTrade ? "Edit Trade" : "Log New Trade"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Row 1: Ticker + Position + Date + Time */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs text-slate-400">
                  Ticker / Instrument
                </Label>
                <Input
                  data-ocid="trade.dialog.input"
                  placeholder="e.g. NIFTY"
                  value={form.ticker}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      ticker: e.target.value.toUpperCase(),
                    }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Position Type</Label>
                <div className="flex gap-1 mt-1">
                  {["Long", "Short"].map((pt) => (
                    <button
                      type="button"
                      key={pt}
                      onClick={() =>
                        setForm((p) => ({ ...p, positionType: pt }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        form.positionType === pt
                          ? pt === "Long"
                            ? "bg-emerald-600 text-white"
                            : "bg-red-600 text-white"
                          : "bg-card text-slate-400 hover:bg-muted"
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-400">Entry Date</Label>
                <Input
                  type="date"
                  value={form.entryDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, entryDate: e.target.value }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Entry Time</Label>
                <Input
                  type="time"
                  value={form.entryTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, entryTime: e.target.value }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
            </div>

            {/* TradingView Widget */}
            {form.ticker.length >= 3 && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <iframe
                  src={`https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(form.ticker)}&interval=D&theme=dark&style=1&locale=en`}
                  width="100%"
                  height="220"
                  frameBorder="0"
                  allowTransparency={true}
                  scrolling="no"
                  title={`TradingView chart for ${form.ticker}`}
                />
              </div>
            )}

            {/* Row 2: Prices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs text-slate-400">Entry Price</Label>
                <Input
                  type="number"
                  value={form.entryPrice || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      entryPrice: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Exit Price</Label>
                <Input
                  type="number"
                  disabled={form.isOpen}
                  value={form.exitPrice || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      exitPrice: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1 disabled:opacity-50"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Quantity</Label>
                <Input
                  type="number"
                  value={form.quantity || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      quantity: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">
                  Commission / Fees
                </Label>
                <Input
                  type="number"
                  value={form.commission || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      commission: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
            </div>

            {/* Row 3: SL/TP/Strategy */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs text-slate-400">Stop Loss</Label>
                <Input
                  type="number"
                  value={form.stopLoss || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      stopLoss: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Take Profit</Label>
                <Input
                  type="number"
                  value={form.takeProfit || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      takeProfit: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">
                  Strategy / Setup
                </Label>
                <Select
                  value={form.strategy || ""}
                  onValueChange={(v) => setForm((p) => ({ ...p, strategy: v }))}
                >
                  <SelectTrigger className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#112240] border-slate-200 dark:border-slate-700">
                    {[
                      "Trend Following",
                      "Momentum",
                      "Breakout",
                      "Scalping",
                      "Swing Trading",
                      "Mean Reversion",
                      "Gap Fill",
                      "News-Based",
                      "Options Strategy",
                      "Position Trading",
                      "Arbitrage",
                      "Pairs Trading",
                      "Range Trading",
                      "VWAP Strategy",
                      "Order Flow",
                      "Custom",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-400">
                  Market Conditions
                </Label>
                <Select
                  value={form.marketConditions || ""}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, marketConditions: v }))
                  }
                >
                  <SelectTrigger className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#112240] border-slate-200 dark:border-slate-700">
                    {[
                      "Bullish Trend",
                      "Bearish Trend",
                      "Sideways/Range-bound",
                      "High Volatility",
                      "Low Volatility",
                      "Pre-Market",
                      "Post-Market",
                      "News-Driven",
                      "Earnings Season",
                      "Fed/RBI Event",
                      "Market Open",
                      "Market Close",
                      "Sector Rotation",
                      "Custom",
                    ].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Emotions + Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-400">Emotions</Label>
                <Select
                  value={form.emotions}
                  onValueChange={(v) => setForm((p) => ({ ...p, emotions: v }))}
                >
                  <SelectTrigger className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#112240] border-slate-200 dark:border-slate-700">
                    {EMOTION_OPTIONS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-400">
                  Tags (comma-separated)
                </Label>
                <Input
                  placeholder="e.g. breakout, earnings, gap"
                  value={form.tags}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tags: e.target.value }))
                  }
                  className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1"
                />
              </div>
            </div>

            {/* Row 5: Notes */}
            <div>
              <Label className="text-xs text-slate-400">
                Notes (use "Lesson:" prefix for lesson learned)
              </Label>
              <Textarea
                placeholder="Trade notes, observations, Lesson: what you learned..."
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="bg-[#112240] border-slate-200 dark:border-slate-700 text-slate-100 mt-1 min-h-24"
                data-ocid="trade.dialog.textarea"
              />
            </div>

            {/* Row 6: Open Trade */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="is-open"
                checked={form.isOpen}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isOpen: !!v }))}
                className="border-slate-500"
                data-ocid="trade.dialog.checkbox"
              />
              <Label
                htmlFor="is-open"
                className="text-sm text-slate-400 cursor-pointer"
              >
                This is an open/active trade
              </Label>
            </div>

            {/* Auto-Calculations */}
            {formPnL && (
              <div className="bg-card rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-400 mb-2">Auto-calculated</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-slate-400">P&L</p>
                    <p
                      className={`text-sm font-semibold ${formPnL.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {fmtCurrency(formPnL.pnl)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">P&L %</p>
                    <p
                      className={`text-sm font-semibold ${formPnL.pct >= 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {fmtNum(formPnL.pct)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Risk/Reward</p>
                    <p className="text-sm font-semibold text-slate-100">
                      {formPnL.rr > 0 ? `${fmtNum(formPnL.rr, 1)}:1` : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Position Size</p>
                    <p className="text-sm font-semibold text-slate-100">
                      {fmtCurrency(formPnL.size)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-card"
                data-ocid="trade.dialog.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={saveTrade}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-ocid="trade.dialog.submit_button"
              >
                {editingTrade ? "Update Trade" : "Log Trade"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Monthly Heatmap ──────────────────────────────────────────────────────────
function MonthlyHeatmap({ trades }: { trades: TradeEntry[] }) {
  const now = new Date();
  const [navYear, setNavYear] = useState(now.getFullYear());
  const [navMonth, setNavMonth] = useState(now.getMonth());
  const year = navYear;
  const month = navMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const goPrev = () => {
    if (month === 0) {
      setNavYear((y) => y - 1);
      setNavMonth(11);
    } else setNavMonth((m) => m - 1);
  };
  const goNext = () => {
    if (month === 11) {
      setNavYear((y) => y + 1);
      setNavMonth(0);
    } else setNavMonth((m) => m + 1);
  };
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const dayPnL: Record<number, number> = {};
  for (const t of trades.filter((t) => !t.isOpen && t.entryDate)) {
    const d = new Date(t.entryDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      dayPnL[day] = (dayPnL[day] ?? 0) + calcPnL(t);
    }
  }

  const maxAbs = Math.max(...Object.values(dayPnL).map(Math.abs), 1);

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goPrev}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 4L6 8L10 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={isCurrentMonth}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((d) => (
          <div key={d} className="text-center text-xs text-slate-400">
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week) => (
        <div
          key={week.find(Boolean) ?? "empty"}
          className="grid grid-cols-7 gap-1 mb-1"
        >
          {week.map((day, dayOfWeek) => {
            const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
            const dayKey = day ? `day-${day}` : `empty-${dayNames[dayOfWeek]}`;
            if (!day) return <div key={dayKey} className="h-8 rounded" />;
            const pnl = dayPnL[day] ?? null;
            const intensity =
              pnl !== null ? Math.round((Math.abs(pnl) / maxAbs) * 100) : 0;
            const bg =
              pnl === null
                ? "bg-[#112240]"
                : pnl > 0
                  ? intensity > 60
                    ? "bg-emerald-600"
                    : "bg-emerald-800"
                  : intensity > 60
                    ? "bg-red-600"
                    : "bg-red-900";
            return (
              <div
                key={`day-${day}`}
                title={
                  pnl !== null
                    ? `Day ${day}: ${fmtCurrency(pnl)}`
                    : `Day ${day}`
                }
                className={`h-8 rounded flex items-center justify-center text-xs font-medium cursor-default ${bg} ${
                  pnl !== null ? "text-white" : "text-slate-400"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
        <div className="w-3 h-3 rounded bg-red-600" /> Loss
        <div className="w-3 h-3 rounded bg-card" /> No trades
        <div className="w-3 h-3 rounded bg-emerald-600" /> Profit
      </div>
    </div>
  );
}
