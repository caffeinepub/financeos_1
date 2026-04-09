import { Badge } from "@/components/ui/badge";
import {
  Activity,
  BarChart,
  BarChart2,
  BookOpen,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  LayoutGrid,
  Lock,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const LS_KEY = "growfinfire_chapters_read";

interface ContentSection {
  heading: string;
  bullets: string[];
}

interface Chapter {
  id: number;
  tier: number;
  title: string;
  description: string;
  content: ContentSection[];
  calculatorId?: string;
}

interface Tier {
  number: number;
  name: string;
  color: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  headerBg: string;
  locked?: boolean;
  chapterIds: number[];
}

const TIERS: Tier[] = [
  {
    number: 0,
    name: "Starter",
    color: "#64748b",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    borderClass: "border-slate-200",
    bgClass: "bg-slate-50/40 dark:bg-slate-900/10",
    headerBg: "bg-slate-50 dark:bg-slate-800/40",
    chapterIds: [101, 102, 103, 104, 105, 106, 107, 108],
  },
  {
    number: 1,
    name: "Foundations",
    color: "#16a34a",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    borderClass: "border-green-200",
    bgClass: "bg-green-50/40 dark:bg-green-900/10",
    headerBg: "bg-green-50 dark:bg-green-900/20",
    chapterIds: [1, 2, 3],
  },
  {
    number: 2,
    name: "Asset Classes",
    color: "#2563eb",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    borderClass: "border-blue-200",
    bgClass: "bg-blue-50/40 dark:bg-blue-900/10",
    headerBg: "bg-blue-50 dark:bg-blue-900/20",
    chapterIds: [4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    number: 3,
    name: "Core Investor Skills",
    color: "#ea580c",
    badgeClass: "bg-orange-100 text-orange-700 border-orange-200",
    borderClass: "border-orange-200",
    bgClass: "bg-orange-50/40 dark:bg-orange-900/10",
    headerBg: "bg-orange-50 dark:bg-orange-900/20",
    chapterIds: [12, 13, 14, 15, 16],
  },
  {
    number: 4,
    name: "Tax & Compliance",
    color: "#dc2626",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
    borderClass: "border-red-200",
    bgClass: "bg-red-50/40 dark:bg-red-900/10",
    headerBg: "bg-red-50 dark:bg-red-900/20",
    chapterIds: [17, 18],
  },
  {
    number: 5,
    name: "Behavioural Finance",
    color: "#7c3aed",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    borderClass: "border-purple-200",
    bgClass: "bg-purple-50/40 dark:bg-purple-900/10",
    headerBg: "bg-purple-50 dark:bg-purple-900/20",
    chapterIds: [19, 20, 21],
  },
  {
    number: 6,
    name: "Advanced Topics (Unlockable)",
    color: "#d97706",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    borderClass: "border-amber-200",
    bgClass: "bg-amber-50/40 dark:bg-amber-900/10",
    headerBg: "bg-amber-50 dark:bg-amber-900/20",
    locked: true,
    chapterIds: [22, 23, 24, 25],
  },
];

// Tier 0 Starter chapters — migrated from the original Basics tab
const TIER0_CHAPTERS: Chapter[] = [
  {
    id: 101,
    tier: 0,
    title: "Compounding",
    description: "The 8th wonder of the world — earn returns on your returns.",
    calculatorId: "compounding",
    content: [
      {
        heading: "What Is Compounding?",
        bullets: [
          "Compounding is the process of earning returns on your returns — often called the 8th wonder of the world.",
          "Formula: A = P(1 + r/n)^(nt) — where P = Principal, r = annual rate, n = compounding frequency, t = years.",
          "$100,000 at 12% annual return for 20 years = $964,629 — nearly 10x your money.",
        ],
      },
      {
        heading: "Why Starting Early Matters",
        bullets: [
          "Start at 25: $500/month for 35 years at 12% = ~$3.2 Million.",
          "Start at 35: $500/month for 25 years at 12% = ~$940,000.",
          "10 years of delay costs over $2 Million — that is the price of waiting.",
          "Key rule: Never interrupt compounding. Even one year of pause can cost years of growth at the end.",
        ],
      },
      {
        heading: "Compounding in Systematic Investments",
        bullets: [
          "Every periodic investment starts its own compounding journey. The first payment compounds the longest.",
          "Systematic investing exploits compounding automatically — discipline is your greatest edge.",
          "Even small amounts invested consistently for decades create extraordinary wealth.",
        ],
      },
    ],
  },
  {
    id: 102,
    tier: 0,
    title: "Rule of 72",
    description: "Estimate how fast your money doubles at any return rate.",
    calculatorId: "rule-of-72",
    content: [
      {
        heading: "The Formula",
        bullets: [
          "Rule of 72: Years to Double = 72 ÷ Annual Return Rate.",
          "6% return (FD): 72 ÷ 6 = 12 years to double.",
          "12% return (Equity): 72 ÷ 12 = 6 years to double.",
          "18% return (Small Cap): 72 ÷ 18 = 4 years to double.",
        ],
      },
      {
        heading: "Inflation Version",
        bullets: [
          "At 6% inflation, purchasing power halves in 72 ÷ 6 = 12 years.",
          "A savings account at 4% doubles in ~18 years. Equity at 12% doubles in ~6 years.",
          "Over 30 years, equity doubles ~5× vs a savings account doubling just 1–2×.",
          "Used by all investment advisors for quick suitability checks and goal planning.",
        ],
      },
    ],
  },
  {
    id: 103,
    tier: 0,
    title: "SIP vs Lump Sum",
    description: "Which investment strategy wins in which market conditions?",
    calculatorId: "sip-vs-lump",
    content: [
      {
        heading: "SIP (Systematic Investment Plan)",
        bullets: [
          "Invest a fixed amount every month regardless of market level.",
          "Uses Cost Averaging — buy more units when markets fall, fewer when they rise.",
          "Best for: Salaried investors, volatile markets, investors with no market timing ability.",
        ],
      },
      {
        heading: "Lump Sum",
        bullets: [
          "Invest the entire amount at once.",
          "Wins decisively when markets are at a confirmed bottom.",
          "Loses badly if you invest at a market peak.",
          "Best for: Large one-time inflows (bonus, inheritance, property sale).",
        ],
      },
      {
        heading: "Verdict",
        bullets: [
          "Data over 10-year rolling periods: Systematic investing beats lump sum ~60% of the time in volatile markets.",
          "For salaried investors, systematic investing wins through discipline.",
          "For windfall money, use a Systematic Transfer Plan (STP) — park in a money market/liquid fund, transfer monthly to equities.",
        ],
      },
    ],
  },
  {
    id: 104,
    tier: 0,
    title: "Inflation Impact",
    description:
      "Understand how inflation silently erodes your purchasing power.",
    calculatorId: "inflation",
    content: [
      {
        heading: "The Silent Wealth Destroyer",
        bullets: [
          "Global average inflation: 2–7% per year depending on country. At 6% inflation, prices double every 12 years (Rule of 72).",
          "$100,000 today = ~$74,000 in real value after 5 years at 6% inflation.",
          "$100,000 today = ~$55,000 in real value after 10 years at 6% inflation.",
          "$100,000 today = ~$23,000 in real value after 25 years at 6% inflation.",
        ],
      },
      {
        heading: "Real Returns After Inflation",
        bullets: [
          "Golden rule: Your investment return must beat Inflation + Tax to create real wealth.",
          "Savings account at 4% → After tax = ~3% → At 4% inflation → Real return ≈ -1% (negative!).",
          "Government bonds at 4.5% → Tax-free account → Real return ≈ +0.5%.",
          "Equity at 10% → After 15% CGT = 8.5% → Real return at 4% inflation ≈ +4.5%.",
          "Best hedge: Equity (historically 8–14% globally vs 2–6% inflation). Gold also works as a partial hedge.",
        ],
      },
    ],
  },
  {
    id: 105,
    tier: 0,
    title: "CAGR",
    description: "Measure true investment growth and compare funds correctly.",
    calculatorId: "cagr",
    content: [
      {
        heading: "What Is CAGR?",
        bullets: [
          "CAGR (Compound Annual Growth Rate) is the single most important metric for comparing investment performance.",
          "Formula: CAGR = (End Value ÷ Start Value)^(1 ÷ Years) − 1.",
          "Example: $100,000 → $250,000 in 5 years = CAGR of 20.1% per year.",
        ],
      },
      {
        heading: "Why CAGR Beats Absolute Returns",
        bullets: [
          "Fund A: $10K → $20K in 4 years = 100% absolute, 18.9% CAGR.",
          "Fund B: $10K → $30K in 8 years = 200% absolute, 14.7% CAGR.",
          "Fund A is the better investment despite lower absolute return — CAGR reveals this truth.",
          "Rule: Always compare investments using CAGR. Never trust absolute return claims without knowing the time period.",
        ],
      },
      {
        heading: "CAGR Benchmarks (Global)",
        bullets: [
          "S&P 500 (US) 20-year CAGR: ~10–11% (total return including dividends).",
          "MSCI World 20-year CAGR: ~8–10%.",
          "Government bonds typical CAGR: ~3–5%.",
          "Gold 20-year CAGR: ~8–10%.",
        ],
      },
    ],
  },
  {
    id: 106,
    tier: 0,
    title: "Market Cycles",
    description:
      "Understand bull, bear, accumulation, and distribution phases.",
    calculatorId: "market-cycles",
    content: [
      {
        heading: "The 4 Phases",
        bullets: [
          "Accumulation: Smart money buys quietly. Markets are flat. News is still negative. P/E ratios are low. Best time to buy.",
          "Markup (Bull Market): Public starts buying. Prices rise steadily. Optimism spreads. FOMO kicks in near the top.",
          "Distribution: Smart money sells to retail buyers. Markets plateau. Insiders exit while public is most bullish.",
          "Markdown (Bear Market): Panic selling. Markets fall 20–50%. Smart money starts accumulating again.",
        ],
      },
      {
        heading: "Historical Data",
        bullets: [
          "Average bull market duration: 4–5 years.",
          "Average bear market duration: 12–18 months.",
          "Markets have recovered 100% of the time from every crash in history.",
          "Rule: Never exit quality investments during the bear phase. Bear markets are sales on quality assets.",
        ],
      },
    ],
  },
  {
    id: 107,
    tier: 0,
    title: "P/E Ratio & Valuation",
    description: "Is a stock cheap or expensive? How to read valuation ratios.",
    calculatorId: "pe-ratio",
    content: [
      {
        heading: "Understanding P/E Ratio",
        bullets: [
          "Formula: P/E = Market Price per Share ÷ Earnings per Share (EPS).",
          "P/E of 20 means you pay $20 for every $1 of annual earnings.",
          "Compare P/E within the same sector — Tech commands 25–40x, Banks trade at 8–15x.",
        ],
      },
      {
        heading: "Historical P/E Bands (S&P 500)",
        bullets: [
          "Below 12: Historically undervalued — strong accumulation zone.",
          "12–17: Fair value — invest regularly.",
          "17–25: Slightly expensive — invest selectively.",
          "Above 25: Expensive — avoid large lump sums.",
          "Above 30: Elevated — trim if rebalancing.",
        ],
      },
      {
        heading: "PEG Ratio",
        bullets: [
          "PEG = P/E ÷ Annual Earnings Growth Rate.",
          "PEG < 1: Potentially undervalued. PEG > 2: Expensive relative to growth.",
          "Graham's rule: Never pay more than 15× trailing 12-month earnings for a defensive stock.",
        ],
      },
    ],
  },
  {
    id: 108,
    tier: 0,
    title: "Diversification",
    description:
      "The only free lunch in investing — reduce risk without reducing returns.",
    calculatorId: "diversification",
    content: [
      {
        heading: "Core Principle",
        bullets: [
          "Combining assets with low or negative correlation reduces portfolio volatility without reducing expected returns.",
          "15–20 stocks across 5–6 sectors provides ~95% of maximum diversification benefit.",
          "Beyond 20 stocks: diminishing returns on risk reduction.",
          "Too few stocks (<8): single-company failure can be devastating.",
        ],
      },
      {
        heading: "Asset Class Diversification",
        bullets: [
          "Equity: Long-term wealth creation (12–15% historical CAGR).",
          "Debt/Bonds: Stability and income (6–8%).",
          "Gold: Hedge against inflation and currency risk.",
          "Real Estate: Inflation hedge and passive income.",
        ],
      },
      {
        heading: "Key Warnings",
        bullets: [
          "Index funds: Inherently diversified — a broad market index fund (e.g., S&P 500, FTSE All-World) gives exposure to hundreds of companies across many sectors.",
          "Graham's recommendation: Hold 10–30 stocks maximum. Beyond this, you are better off with an index fund.",
          "Warning: Diversification into assets you don't understand is called diworsification (Peter Lynch).",
        ],
      },
    ],
  },
];

const TIER0_ICON_MAP: Record<
  number,
  React.ComponentType<{ className?: string }>
> = {
  101: TrendingUp,
  102: Clock,
  103: BarChart2,
  104: Activity,
  105: BarChart,
  106: BarChart,
  107: DollarSign,
  108: LayoutGrid,
};

// ─── Starter Chapter Calculator ───────────────────────────────────────────────
function StarterCalculator({ calcId }: { calcId: string }) {
  const [p, setP] = useState(100000);
  const [r, setR] = useState(12);
  const [t, setT] = useState(10);
  const [n, setN] = useState(12);
  const [endVal, setEndVal] = useState(250000);
  const [assets, setAssets] = useState(5);

  const inp =
    "w-full mt-1 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400";
  const lbl = "text-xs text-slate-500 dark:text-slate-400 font-medium";
  const res =
    "bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-600";

  if (calcId === "compounding") {
    const result = p * (1 + r / 100 / n) ** (n * t);
    return (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          🧮 Compounding Calculator
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={lbl}>Principal ($)</span>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Annual Rate (%)</span>
            <input
              type="number"
              value={r}
              onChange={(e) => setR(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Years</span>
            <input
              type="number"
              value={t}
              onChange={(e) => setT(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Compounding/yr</span>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(+e.target.value)}
              className={inp}
            />
          </div>
        </div>
        <div className={res}>
          <p className="text-xs text-slate-500">Future Value</p>
          <p className="text-lg font-bold text-emerald-600">
            ${result.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <p className="text-xs text-slate-400">
            Growth: {((result / p - 1) * 100).toFixed(1)}% · Gain: $
            {(result - p).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
      </div>
    );
  }
  if (calcId === "rule-of-72") {
    const years = r > 0 ? (72 / r).toFixed(1) : "∞";
    return (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          🧮 Rule of 72 Calculator
        </h4>
        <div>
          <span className={lbl}>Annual Return Rate (%)</span>
          <input
            type="number"
            value={r}
            onChange={(e) => setR(+e.target.value)}
            className={inp}
          />
        </div>
        <div className={res}>
          <p className="text-xs text-slate-500">Years to Double</p>
          <p className="text-lg font-bold text-blue-600">{years} years</p>
        </div>
      </div>
    );
  }
  if (calcId === "sip-vs-lump") {
    const monthlyRate = r / 100 / 12;
    const months = t * 12;
    const sipFV =
      p * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    const lumpFV = p * 12 * (1 + r / 100) ** t;
    return (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          🧮 SIP vs Lump Sum
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={lbl}>Monthly Amount ($)</span>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Annual Return (%)</span>
            <input
              type="number"
              value={r}
              onChange={(e) => setR(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Years</span>
            <input
              type="number"
              value={t}
              onChange={(e) => setT(+e.target.value)}
              className={inp}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={res}>
            <p className="text-xs text-slate-500">SIP Final Value</p>
            <p className="text-base font-bold text-emerald-600">
              ${sipFV.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
          <div className={res}>
            <p className="text-xs text-slate-500">Lump Sum FV</p>
            <p className="text-base font-bold text-blue-600">
              ${lumpFV.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (calcId === "inflation") {
    const futureValue = p * (1 + r / 100) ** t;
    const purchasingPower = p / (1 + r / 100) ** t;
    return (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          🧮 Inflation Impact Calculator
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={lbl}>Current Amount ($)</span>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Inflation Rate (%)</span>
            <input
              type="number"
              value={r}
              onChange={(e) => setR(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Years</span>
            <input
              type="number"
              value={t}
              onChange={(e) => setT(+e.target.value)}
              className={inp}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={res}>
            <p className="text-xs text-slate-500">Future Cost</p>
            <p className="text-base font-bold text-orange-600">
              ${futureValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
          <div className={res}>
            <p className="text-xs text-slate-500">Today's Purchasing Power</p>
            <p className="text-base font-bold text-red-600">
              $
              {purchasingPower.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (calcId === "cagr") {
    const cagrResult =
      t > 0 ? (((endVal / p) ** (1 / t) - 1) * 100).toFixed(2) : "0";
    return (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          🧮 CAGR Calculator
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={lbl}>Start Value ($)</span>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>End Value ($)</span>
            <input
              type="number"
              value={endVal}
              onChange={(e) => setEndVal(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Years</span>
            <input
              type="number"
              value={t}
              onChange={(e) => setT(+e.target.value)}
              className={inp}
            />
          </div>
        </div>
        <div className={res}>
          <p className="text-xs text-slate-500">CAGR</p>
          <p className="text-lg font-bold text-violet-600">
            {cagrResult}% per year
          </p>
        </div>
      </div>
    );
  }
  if (calcId === "market-cycles" || calcId === "pe-ratio") {
    return (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          🧮 P/E Fair Value Calculator
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className={lbl}>EPS ($)</span>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(+e.target.value)}
              placeholder="e.g. 50"
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>Fair P/E Ratio</span>
            <input
              type="number"
              value={r}
              onChange={(e) => setR(+e.target.value)}
              placeholder="e.g. 25"
              className={inp}
            />
          </div>
        </div>
        <div className={res}>
          <p className="text-xs text-slate-500">Fair Value Price</p>
          <p className="text-lg font-bold text-indigo-600">
            ${(p * r).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
      </div>
    );
  }
  if (calcId === "diversification") {
    const riskReduction = assets > 1 ? (1 - 1 / assets) * 100 : 0;
    return (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          🧮 Diversification Benefit
        </h4>
        <div>
          <span className={lbl}>Number of Assets</span>
          <input
            type="number"
            value={assets}
            onChange={(e) => setAssets(Math.max(1, +e.target.value))}
            min={1}
            max={50}
            className={inp}
          />
        </div>
        <div className={res}>
          <p className="text-xs text-slate-500">Unsystematic Risk Reduction</p>
          <p className="text-lg font-bold text-cyan-600">
            {riskReduction.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400">vs single asset portfolio</p>
        </div>
      </div>
    );
  }
  return null;
}

const CHAPTERS: Chapter[] = [
  ...TIER0_CHAPTERS,
  {
    id: 1,
    tier: 1,
    title: "Money Basics",
    description:
      "Understand how money works — inflation, time value, and the difference between income and wealth.",
    content: [
      {
        heading: "How Money Loses Value (Inflation)",
        bullets: [
          "Inflation is the rate at which prices rise over time, eroding purchasing power.",
          "Real return = Nominal return − Inflation. If your savings account gives 4% and inflation is 3%, your real gain is just 1%.",
          "Global inflation ranges: developed markets target 2%, emerging markets typically run 4–7%.",
          "$100,000 today ≈ $74,000 in real value after 10 years at 3% inflation; ≈ $55,000 at 6% inflation.",
        ],
      },
      {
        heading: "Net Worth — What It Is",
        bullets: [
          "Net Worth = Total Assets − Total Liabilities.",
          "Assets: savings, investments, property, gold, vehicles, retirement accounts.",
          "Liabilities: mortgage, car loan, credit card debt, personal loans.",
          "Track net worth every 6–12 months to measure financial progress.",
        ],
      },
      {
        heading: "Income vs Wealth",
        bullets: [
          "Income is what you earn. Wealth is what you keep and grow.",
          "High income without savings = no wealth. Low income with disciplined savings = growing wealth.",
          "Wealth is built by: Earning → Saving → Investing consistently over time.",
        ],
      },
      {
        heading: "Time Value of Money",
        bullets: [
          "$1,000 today is worth more than $1,000 a year from now because it can be invested.",
          "Compounding: $10,000 at 10% for 30 years grows to ~$174,494.",
          "Rule of 72: Divide 72 by your return rate to find years to double. At 10% → money doubles in ~7 years.",
          "Start investing early: a 25-year-old investing $500/month beats a 35-year-old investing $1,000/month by retirement.",
        ],
      },
    ],
  },
  {
    id: 2,
    tier: 1,
    title: "The Global Financial Ecosystem",
    description:
      "Who regulates what, how exchanges work, and why you need a brokerage account to invest.",
    content: [
      {
        heading: "Regulators (Global Examples)",
        bullets: [
          "Securities regulators: SEC (US), FCA (UK), SEBI (India), MAS (Singapore), ASIC (Australia) — oversee exchanges, brokers, mutual funds, and listed companies.",
          "Central banks: US Federal Reserve, Bank of England, ECB, Reserve Bank of India — manage monetary policy, interest rates, and banking.",
          "Insurance regulators: PRA (UK), IRDAI (India) — oversee insurance products.",
          "Pension regulators: DOL (US), TPR (UK), PFRDA (India) — oversee retirement savings schemes.",
        ],
      },
      {
        heading: "Financial Institutions",
        bullets: [
          "Asset Managers / Fund Companies: Manage pooled investor money in mutual funds (e.g., Vanguard, BlackRock, Fidelity, HDFC AMC).",
          "Broker / Trading Platform: Facilitates buying/selling of securities (e.g., Charles Schwab, Hargreaves Lansdown, Zerodha, Interactive Brokers).",
          "Custodian / Depository: Holds your securities electronically — DTCC (US), Euroclear (Europe), CDSL/NSDL (India).",
        ],
      },
      {
        heading: "Stock Exchanges",
        bullets: [
          "NYSE and NASDAQ (US): World's largest by market cap. Home of S&P 500 and Nasdaq-100 indices.",
          "LSE (UK): London Stock Exchange. Home of FTSE 100.",
          "NSE/BSE (India): National Stock Exchange and BSE. Home of Nifty 50 and Sensex.",
          "Indices represent the performance of a selected group of stocks — used as market benchmarks globally.",
        ],
      },
      {
        heading: "Investment Accounts",
        bullets: [
          "Brokerage account: Holds your shares, ETFs, and funds in electronic form — the foundation for all investing.",
          "Retirement accounts: Tax-advantaged accounts for long-term saving (401k/IRA in US, ISA/SIPP in UK, NPS/PPF in India).",
          "Both types are needed — retirement accounts for long-term tax efficiency, brokerage for flexibility.",
          "Opening requires identity verification (KYC/AML) in every country.",
        ],
      },
    ],
  },
  {
    id: 3,
    tier: 1,
    title: "Goal-Based Investing",
    description:
      "Link your money to real life goals — home, education, retirement — and prioritise when capital is limited.",
    content: [
      {
        heading: "Short / Medium / Long-Term Goal Framework",
        bullets: [
          "Short-term (0–3 years): Emergency fund, vacation, car down payment → money market, savings accounts, short-duration bonds.",
          "Medium-term (3–7 years): Home renovation, education savings → bond funds, balanced/hybrid funds.",
          "Long-term (7+ years): Retirement, children's higher education → equity index funds, growth ETFs.",
        ],
      },
      {
        heading: "Emergency Fund",
        bullets: [
          "Keep 3–6 months of monthly expenses in a liquid, accessible account.",
          "Park it in: high-yield savings account, money market fund, or short-term government bonds.",
          "Do NOT invest emergency funds in equity or illiquid assets.",
          "Without an emergency fund, any financial shock forces you to break long-term investments at the worst time.",
        ],
      },
      {
        heading: "Linking Money to Life Goals",
        bullets: [
          "Each investment should have a purpose: 'This $500/month goes toward my retirement in 30 years.'",
          "Goal-based investing reduces panic selling — you know the timeline and purpose.",
          "Use the Growfinfire Goals module to map each investment to a specific goal.",
        ],
      },
      {
        heading: "Prioritisation When Capital is Limited",
        bullets: [
          "Priority order: Emergency fund → High-interest debt repayment → Retirement savings → Other goals.",
          "Never invest in long-term goals while carrying high-interest consumer debt (credit cards at 20–40%).",
          "Even $100/month invested consistently beats doing nothing — start small, increase as income grows.",
        ],
      },
    ],
  },
  {
    id: 4,
    tier: 2,
    title: "Equity",
    description:
      "Stocks represent ownership in a company. Learn about indices, market cycles, and key valuation ratios.",
    content: [
      {
        heading: "What Are Stocks?",
        bullets: [
          "Buying a share = owning a fraction of the company.",
          "Returns come from: price appreciation (capital gains) and dividends (share of profits).",
          "Listed on stock exchanges; prices change every second during market hours.",
        ],
      },
      {
        heading: "Market Cap Categories",
        bullets: [
          "Large cap: The largest companies by market cap. Stable, lower risk (e.g., Apple, HSBC, Reliance).",
          "Mid cap: Medium-sized companies. Higher growth potential, moderate risk.",
          "Small cap: Smaller companies. High risk, high potential returns.",
          "Classification defined differently per country/index provider — check your local exchange guidelines.",
        ],
      },
      {
        heading: "Indices",
        bullets: [
          "S&P 500 (US): 500 largest US companies; the global benchmark for equity performance.",
          "FTSE 100 (UK): 100 largest London-listed companies.",
          "Nifty 50 / Sensex (India): 50/30 largest Indian companies.",
          "Indices represent the performance of a selected basket of stocks — used as benchmarks globally.",
        ],
      },
      {
        heading: "Bull & Bear Markets",
        bullets: [
          "Bull market: Sustained rise of 20%+ from recent lows. Investor confidence is high.",
          "Bear market: Sustained fall of 20%+ from recent highs.",
          "Correction: 10–20% fall from peak. Normal and healthy.",
          "Crash: Sharp, rapid fall (e.g., March 2020: global markets fell 30–40% in weeks due to COVID panic).",
        ],
      },
      {
        heading: "Key Valuation Ratios",
        bullets: [
          "P/E (Price-to-Earnings): Share price ÷ Earnings per share. Higher P/E = market expects high growth OR stock is expensive.",
          "P/B (Price-to-Book): Share price ÷ Book value per share. Below 1 = trading below asset value.",
          "Historical average P/E: S&P 500 ~15–17x, above 25x = expensive, below 12x = attractive. Compare within the same sector.",
        ],
      },
    ],
  },
  {
    id: 5,
    tier: 2,
    title: "Mutual Funds",
    description:
      "Pooled investing made simple — understand NAV, systematic investing mechanics, direct vs commission plans, and how costs erode returns.",
    content: [
      {
        heading: "What an Asset Manager Does & NAV",
        bullets: [
          "An Asset Management Company (AMC) collects money from many investors and invests it in a portfolio of stocks, bonds, or both.",
          "NAV (Net Asset Value) = Total portfolio value ÷ Total units. Calculated daily after market close.",
          "Buying at a lower NAV doesn't mean cheaper — it's the portfolio quality that matters.",
        ],
      },
      {
        heading: "Types of Mutual Funds",
        bullets: [
          "Equity funds: Invest primarily in stocks. Higher risk, higher potential returns.",
          "Debt/bond funds: Invest in fixed-income securities. Lower risk, stable returns.",
          "Hybrid/balanced funds: Mix of equity and debt.",
          "Index funds: Passively track an index (S&P 500, FTSE 100, Nifty 50). Low cost.",
          "Sectoral/thematic funds: Invest in specific sectors (tech, healthcare). High concentration risk.",
        ],
      },
      {
        heading: "Direct vs Commission-Based Plans",
        bullets: [
          "Direct plan: Buy directly from AMC without a distributor. No commission. Lower expense ratio by ~0.5–1.5%.",
          "Commission-based plan: Buy via a broker/adviser who earns a trail commission. Higher expense ratio.",
          "Impact over 20 years on a $500/month SIP: Direct plan can create $50,000–$80,000 more than a commission plan due to compounding.",
          "Always choose the lowest-cost option available for your situation.",
        ],
      },
      {
        heading: "Systematic Investing & Cost Averaging",
        bullets: [
          "Systematic Investment Plan (SIP): Fixed amount invested at regular intervals (monthly).",
          "Cost averaging: When NAV falls, you buy more units. When NAV rises, you buy fewer units.",
          "Systematic investing removes the need to time the market — you invest regardless of market conditions.",
          "Never stop your systematic investments in a bear market — those cheap units drive your long-term returns.",
        ],
      },
      {
        heading: "Costs & Returns",
        bullets: [
          "Exit load / redemption fee: Penalty for redeeming before a set period. Typically 1% if within 1 year.",
          "Expense ratio: Annual fee deducted from NAV daily. Active funds: ~0.5–2.5%. Index funds: ~0.03–0.2%.",
          "CAGR (Compound Annual Growth Rate): Best metric to compare fund performance across different time periods.",
          "Absolute returns mislead — a 50% return over 5 years is only ~8.4% CAGR.",
        ],
      },
    ],
  },
  {
    id: 6,
    tier: 2,
    title: "ETFs & Index Investing",
    description:
      "Passive investing — why index funds beat most active managers over the long run, and how to use them.",
    content: [
      {
        heading: "ETF vs Index Mutual Fund",
        bullets: [
          "ETF: Trades on the stock exchange like a stock. Buy/sell anytime during market hours.",
          "Index Mutual Fund: Bought/sold at end-of-day NAV. Easier for systematic/automatic investing.",
          "Both track the same index; both are passive. Key difference is liquidity and how you buy.",
        ],
      },
      {
        heading: "Tracking Error",
        bullets: [
          "Tracking error: Difference between the fund's return and the index's return.",
          "Lower tracking error = better fund management.",
          "Causes: cash held for redemptions, expense ratio, rebalancing timing.",
          "Choose ETFs/index funds with consistently low tracking error (check fund factsheets).",
        ],
      },
      {
        heading: "Types of ETFs (Global Examples)",
        bullets: [
          "Broad market ETFs: Track S&P 500 (Vanguard VOO, iShares IVV), FTSE All-World (VWRL), Nifty 50.",
          "Gold ETFs: Track spot gold prices. Convenient and SEBI/SEC-regulated depending on country.",
          "International ETFs: Track foreign indices (e.g., MSCI World, Nasdaq 100, Emerging Markets).",
          "Sector ETFs: Technology, healthcare, energy, financials — available in most major markets.",
        ],
      },
      {
        heading: "Why Passive Beats Active Over Long Run",
        bullets: [
          "Data consistently shows index funds beat 73–85% of active fund managers over 15+ year periods globally (SPIVA reports).",
          "Average active equity fund expense: ~0.5–2.5%. Average index fund expense: ~0.03–0.2%.",
          "Over 20 years, a 1% expense difference on $500/month can mean $50,000+ in lost wealth due to compounding.",
          "Most fund managers fail to consistently beat the index after costs.",
        ],
      },
    ],
  },
  {
    id: 7,
    tier: 2,
    title: "Fixed Income",
    description:
      "Safe-ish investments — savings accounts, bonds, government securities, and why rising interest rates hurt bond prices.",
    content: [
      {
        heading: "Types of Fixed Income Instruments",
        bullets: [
          "Savings/Term Deposits: Bank deposit at a fixed rate for a fixed tenure. Government-insured up to a limit (e.g., $250K FDIC in US, £85K FSCS in UK, ₹5L DICGC in India).",
          "Government Bonds: Issued by national governments. Zero credit risk for local-currency bonds (e.g., US Treasuries, UK Gilts, German Bunds, India G-Secs).",
          "Treasury Bills: Short-term government bonds (90 days to 1 year). Highly liquid.",
          "Corporate Bonds: Issued by companies. Higher yield than government bonds but carry credit risk.",
        ],
      },
      {
        heading: "Credit Ratings",
        bullets: [
          "Credit rating agencies (Moody's, S&P, Fitch) rate bonds on creditworthiness.",
          "AAA: Highest safety. AA: High safety. A: Adequate safety. Below BBB = speculative (junk/high-yield).",
          "Higher rating = lower yield. Lower rating = higher yield (risk premium).",
          "Stick to investment-grade bonds (BBB and above) for core fixed income allocations.",
        ],
      },
      {
        heading: "Yield, Coupon, and Interest Rate Risk",
        bullets: [
          "Coupon: Fixed interest payment (e.g., 4% of face value annually).",
          "Yield: Actual return based on current market price.",
          "When central banks raise interest rates, new bonds offer higher coupons → existing bonds become less attractive → prices fall.",
          "Bond price and yield move in OPPOSITE directions — the most important concept in fixed income.",
        ],
      },
      {
        heading: "Special Government Instruments",
        bullets: [
          "Inflation-linked bonds: Return adjusts with inflation (TIPS in US, index-linked gilts in UK, IIBs in India).",
          "Savings bonds: Government-backed, often tax-advantaged (e.g., I-Bonds in US, NS&I in UK, Sovereign Gold Bonds in India).",
          "Money market funds: Invest in very short-term government debt — near-zero risk, slightly better than savings accounts.",
        ],
      },
    ],
  },
  {
    id: 8,
    tier: 2,
    title: "Retirement Instruments",
    description:
      "Employer pension schemes, government savings plans, and personal retirement accounts — with significant tax benefits.",
    content: [
      {
        heading: "Workplace / Employer Retirement Plans",
        bullets: [
          "Most employers offer a workplace pension or retirement plan (401k in US, workplace pension in UK, EPF in India, Superannuation in Australia).",
          "Typically: employee contributes a % of salary, employer matches some or all of it — the employer match is free money.",
          "Always contribute enough to capture the full employer match — it's an instant 50–100% return.",
          "These accounts are tax-advantaged: contributions reduce your taxable income and growth is tax-deferred.",
        ],
      },
      {
        heading: "Government / Personal Retirement Savings Plans",
        bullets: [
          "Most countries offer personal tax-advantaged retirement accounts (IRA in US, ISA/SIPP in UK, PPF/NPS in India, RRSP in Canada).",
          "Two common types: Traditional (pre-tax contributions, taxed on withdrawal) and Roth-style (post-tax contributions, tax-free growth and withdrawal).",
          "Annual contribution limits apply — check your country's limits and max them out if you can.",
          "These accounts compound tax-free or tax-deferred — the single most powerful wealth-building structure available to individual investors.",
        ],
      },
      {
        heading: "Pension Fund Managers & Asset Allocation",
        bullets: [
          "Retirement accounts allow you to choose investment options — equity funds for growth when young, gradually shifting to bonds as you near retirement.",
          "Target-date funds automatically rebalance your allocation as you age — a good default option for many investors.",
          "Review your fund selection annually — default options in workplace plans are often conservative/low-return.",
        ],
      },
      {
        heading: "Tax Benefits Summary",
        bullets: [
          "Traditional retirement accounts: Reduce taxable income now. Pay tax on withdrawal in retirement (usually at a lower tax rate).",
          "Roth/ISA-style accounts: Pay tax now. All growth and withdrawals are completely tax-free.",
          "Employer pension contributions are typically tax-free in the employer's hands too — reducing their payroll tax.",
          "Always maximize tax-advantaged retirement accounts before investing in taxable accounts.",
        ],
      },
    ],
  },
  {
    id: 9,
    tier: 2,
    title: "Commodities",
    description:
      "Gold, silver, crude oil — commodities as an inflation hedge and how to invest in them.",
    content: [
      {
        heading: "Gold Investment Forms",
        bullets: [
          "Physical gold (jewellery/coins): High making/premium charges, storage risk. Poor investment form.",
          "Digital gold: Small amounts, but charges and counterparty risk vary by platform.",
          "Gold ETFs: Exchange-traded, each unit tracks gold price. Regulated and transparent — ideal for most investors.",
          "Government gold bonds (e.g., Sovereign Gold Bonds in India): Annual interest + gold appreciation. Tax-advantaged on maturity.",
          "Gold mutual funds/FOFs: Good for systematic investing without needing a brokerage account.",
        ],
      },
      {
        heading: "Silver & Crude Oil",
        bullets: [
          "Silver: More volatile than gold. Industrial use (EVs, solar panels) adds demand beyond safe-haven.",
          "Crude oil: Rising oil prices impact inflation, currency, and markets globally — especially in oil-importing countries.",
          "Both traded on commodity exchanges (CME in US, MCX in India, ICE in Europe).",
        ],
      },
      {
        heading: "Commodities as Inflation Hedge",
        bullets: [
          "Gold has historically preserved purchasing power over centuries.",
          "Commodities tend to move opposite to equity in crisis periods — useful portfolio diversifier.",
          "Recommended allocation: 5–10% in gold as portfolio hedge. Not a standalone investment.",
        ],
      },
      {
        heading: "Commodity Trading",
        bullets: [
          "Commodity futures: Derivative contracts — specify delivery of commodity at a future date at an agreed price.",
          "High leverage in commodity futures = high risk. Mostly used for hedging by producers/consumers, not retail investing.",
          "For retail investors: gold/silver ETFs or commodity funds are safer and simpler than futures trading.",
        ],
      },
    ],
  },
  {
    id: 10,
    tier: 2,
    title: "Real Estate",
    description:
      "Physical property vs REITs — understanding rental yield, illiquidity, and why REITs changed the game.",
    content: [
      {
        heading: "Physical Property",
        bullets: [
          "Real estate can offer capital appreciation and rental income, but returns vary widely by city and market conditions.",
          "Illiquid: Cannot sell quickly without significant price discount.",
          "High transaction costs: Agent fees, taxes, legal costs (typically 5–10% of property value).",
          "Rental yield in major global cities: typically 2–5% gross (net even lower after maintenance, vacancy).",
          "True return = rental yield + capital appreciation. Inflation-adjusted returns vary significantly by market.",
        ],
      },
      {
        heading: "REITs (Real Estate Investment Trusts)",
        bullets: [
          "REIT: A company that owns income-producing real estate (offices, malls, warehouses, apartments).",
          "Traded on stock exchanges globally. Can buy even fractional shares.",
          "By law in most countries, REITs must distribute 90%+ of taxable income to shareholders (quarterly/annual).",
          "Examples: Prologis (US), Land Securities (UK), Embassy REIT (India), CapitaLand (Singapore).",
        ],
      },
      {
        heading: "REIT Distributions",
        bullets: [
          "Distributions come from rental income, interest, and property sale gains.",
          "REIT yields globally: typically 3–8% annually from distributions alone.",
          "Tax treatment varies by country — check whether distributions are taxed as ordinary income or dividends.",
        ],
      },
      {
        heading: "Why Illiquidity Matters",
        bullets: [
          "Illiquid assets cannot be sold quickly at fair value.",
          "In emergencies, you may sell property at a 15–30% discount.",
          "REITs solve the illiquidity problem of real estate investing.",
          "Allocate to real estate based on your liquidity needs — don't over-allocate to illiquid assets.",
        ],
      },
    ],
  },
  {
    id: 11,
    tier: 2,
    title: "Crypto",
    description:
      "Blockchain basics, Bitcoin risk profile, tax treatment globally, and safe allocation principles.",
    content: [
      {
        heading: "What is Blockchain (1-Minute Version)",
        bullets: [
          "Blockchain: A decentralised, distributed ledger that records transactions across many computers.",
          "No single authority controls it — records are immutable once added.",
          "Bitcoin: First and largest crypto. Capped at 21 million coins. 'Digital gold' narrative.",
          "Thousands of altcoins exist (Ethereum, Solana, etc.) with varying use cases and risk profiles.",
        ],
      },
      {
        heading: "Bitcoin vs Altcoin Risk",
        bullets: [
          "Bitcoin is the most established. Still highly volatile (50%+ drawdowns in bear markets).",
          "Altcoins: Higher potential returns but also higher risk of total loss.",
          "Most altcoins from 2017–2021 have lost 90%+ of their peak value.",
          "Rule: Never invest more in crypto than you can afford to lose completely.",
        ],
      },
      {
        heading: "Tax Treatment (Global Principles)",
        bullets: [
          "Crypto is taxable in most countries — either as capital gains or income depending on activity.",
          "Tax rates vary significantly: some countries apply flat rates on gains, others use progressive income tax rates.",
          "Examples: UK — 10–20% CGT; US — 0–37% depending on holding period and income; India — flat 30% regardless of holding period.",
          "Record all transactions — most tax authorities require detailed reporting of crypto trades, even small ones.",
          "Losses can often be used to offset gains, but rules vary by country.",
        ],
      },
      {
        heading: "Safe Allocation Principles",
        bullets: [
          "Maximum allocation: 5–10% of investable portfolio for high-risk tolerant investors.",
          "Conservative/moderate investors: 0–2%.",
          "Crypto is speculative — treat it as high-risk speculation, not a core investment.",
          "Use regulated, reputable exchanges and consider self-custody for large holdings.",
        ],
      },
    ],
  },
  {
    id: 12,
    tier: 3,
    title: "Risk & Return",
    description:
      "Risk is not just the chance of loss — it's volatility. Learn to measure it and match it to your profile.",
    content: [
      {
        heading: "Risk = Volatility",
        bullets: [
          "Risk in investing is primarily measured by volatility — how much an investment's value fluctuates.",
          "A volatile investment may give 30% one year and -20% the next — even if average return is 15%.",
          "Higher potential return always comes with higher volatility risk.",
        ],
      },
      {
        heading: "Measuring Risk",
        bullets: [
          "Standard Deviation: Measures how much returns deviate from average. Higher SD = more volatile.",
          "Sharpe Ratio: Return earned per unit of risk (excess return ÷ standard deviation). Higher is better.",
          "A broad market index fund has lower SD than a small-cap fund, but also lower expected return.",
        ],
      },
      {
        heading: "Risk Capacity vs Risk Appetite",
        bullets: [
          "Risk appetite: How much risk you WANT to take (psychological tolerance for losses).",
          "Risk capacity: How much risk you CAN take (based on income, expenses, goals, time horizon).",
          "Mismatch danger: High appetite + low capacity = financial disaster if markets fall.",
          "Match your portfolio to the LOWER of the two: capacity or appetite.",
        ],
      },
      {
        heading: "Age and Risk Profile",
        bullets: [
          "Younger investors: Longer time horizon → higher capacity for equity risk.",
          "Older investors: Shorter time horizon, less time to recover losses → reduce equity.",
          "A 60-year-old with 80% equity portfolio risks permanent loss of retirement corpus in a crash.",
          "Portfolio volatility is lower than individual stock volatility due to diversification.",
        ],
      },
    ],
  },
  {
    id: 13,
    tier: 3,
    title: "Asset Allocation",
    description:
      "How you split money across asset classes matters more than any single investment decision.",
    content: [
      {
        heading: "Why Allocation Matters More Than Stock Picking",
        bullets: [
          "Research shows 90%+ of portfolio returns are determined by asset allocation, not stock selection.",
          "A well-allocated portfolio with average stocks beats a poorly allocated portfolio with great stocks.",
          "Equity, debt, gold, real estate behave differently in different market conditions.",
        ],
      },
      {
        heading: "The 100-Minus-Age Rule (And Why It's Outdated)",
        bullets: [
          "Old rule: % in equity = 100 − age. At 30 → 70% equity. At 60 → 40% equity.",
          "Outdated because: People live longer (equity needed to fight 20–30 years of retirement inflation).",
          "Modern approach: 110 or 120 minus age, adjusted for individual risk capacity.",
        ],
      },
      {
        heading: "Strategic vs Tactical Allocation",
        bullets: [
          "Strategic allocation: Your long-term target mix (e.g., 70% equity, 20% debt, 10% gold).",
          "Tactical allocation: Temporary deviation based on market conditions. High risk — most retail investors should avoid.",
          "Stick to strategic allocation and rebalance annually.",
        ],
      },
      {
        heading: "Rebalancing",
        bullets: [
          "If equity outperforms and becomes 80% of portfolio (vs 70% target) → sell some equity, buy debt/gold.",
          "Rebalance annually or when any asset class drifts 5%+ from target.",
          "Rebalancing enforces 'buy low, sell high' discipline automatically.",
        ],
      },
      {
        heading: "Correlation",
        bullets: [
          "Correlation: How two assets move relative to each other. Range: −1 (opposite) to +1 (identical).",
          "Gold and equity often have negative or zero correlation — gold rises when equity falls.",
          "Adding uncorrelated assets reduces portfolio volatility without sacrificing returns.",
        ],
      },
    ],
  },
  {
    id: 14,
    tier: 3,
    title: "Portfolio Construction",
    description:
      "Build a resilient portfolio using the core-satellite framework, manage overlap, and size positions correctly.",
    content: [
      {
        heading: "Core + Satellite Approach",
        bullets: [
          "Core (70–80%): Low-cost, diversified, long-term holdings. Broad market index fund, developed-market index, bond index.",
          "Satellite (20–30%): Higher-conviction, higher-risk bets. Sectoral funds, small-cap, international ETFs, direct stocks.",
          "Core protects wealth; satellite creates alpha.",
        ],
      },
      {
        heading: "Diversification vs Diworsification",
        bullets: [
          "True diversification: Owning uncorrelated assets that reduce risk.",
          "Diworsification: Owning too many similar funds (5 large-cap active funds that all track the same broad index).",
          "Ideal portfolio: 4–6 funds maximum, across market cap and asset class. Not 15 funds.",
        ],
      },
      {
        heading: "Overlap Analysis in Mutual Funds",
        bullets: [
          "Two large-cap funds often hold the same top 20 stocks — no diversification benefit.",
          "Use tools like Morningstar, Value Research, or ETF overlap checkers before buying a new fund.",
          "If two funds have 60%+ overlap, owning both is redundant.",
        ],
      },
      {
        heading: "Position Sizing",
        bullets: [
          "Never put more than 5–10% of total portfolio in a single stock.",
          "For mutual funds, each fund should ideally not exceed 25–30% of portfolio.",
          "Larger positions should be in lower-risk assets (index funds), not higher-risk bets (small-cap, crypto).",
        ],
      },
    ],
  },
  {
    id: 15,
    tier: 3,
    title: "Reading Financial Statements",
    description:
      "Decode a company's health from its balance sheet, P&L, and cash flow statement.",
    content: [
      {
        heading: "Three Key Financial Statements",
        bullets: [
          "Balance Sheet: What a company owns (assets) vs owes (liabilities). Net worth = Assets − Liabilities.",
          "P&L (Profit & Loss): Revenue, expenses, and profit over a period.",
          "Cash Flow Statement: Actual cash inflows and outflows. Operations, investing, financing.",
        ],
      },
      {
        heading: "Revenue vs Profit vs Free Cash Flow",
        bullets: [
          "Revenue (Sales): Total money earned from business. Growing revenue is good.",
          "Net Profit: Revenue minus all costs. Can be positive even when cash flow is negative (accruals).",
          "Free Cash Flow (FCF): Cash from operations minus capex. The REAL measure of business health.",
          "A company with growing profits but negative FCF is often a warning sign.",
        ],
      },
      {
        heading: "Key Ratios to Watch",
        bullets: [
          "Debt-to-Equity (D/E) ratio: Total debt ÷ Equity. Below 1 is generally safe. Above 2 = high leverage.",
          "Interest Coverage Ratio: EBIT ÷ Interest expense. Above 3 = comfortable. Below 1.5 = danger zone.",
          "Net Profit Margin: Net profit ÷ Revenue. Higher is better. Compare vs industry peers.",
        ],
      },
      {
        heading: "Red Flags",
        bullets: [
          "Declining profit margins year-over-year.",
          "Rising debt despite low growth.",
          "Promoter pledging shares (using own company shares as loan collateral — signals cash stress).",
          "Revenue growing but cash flow declining (aggressive revenue recognition).",
          "Frequent related-party transactions with promoter companies.",
        ],
      },
    ],
  },
  {
    id: 16,
    tier: 3,
    title: "Valuation Basics",
    description:
      "Understand intrinsic value, key valuation ratios, and Benjamin Graham's margin of safety principle.",
    content: [
      {
        heading: "Intrinsic Value",
        bullets: [
          "Intrinsic value: What a stock is actually worth, based on fundamentals — independent of market price.",
          "If market price < intrinsic value → potentially undervalued.",
          "Intrinsic value is estimated, not exact. Different analysts will get different numbers.",
        ],
      },
      {
        heading: "Key Valuation Ratios",
        bullets: [
          "P/E (Price-to-Earnings): Most common. Compare to: same stock's history, industry peers, and broad market average.",
          "PEG (Price/Earnings-to-Growth): P/E divided by earnings growth rate. PEG < 1 = potentially undervalued.",
          "EV/EBITDA: Enterprise value ÷ Operating profit. Used for capital-intensive industries (cement, telecom).",
          "P/B (Price-to-Book): Useful for asset-heavy companies (banks, manufacturing).",
        ],
      },
      {
        heading: "Benjamin Graham's Margin of Safety",
        bullets: [
          "Buy only when market price is significantly below intrinsic value (20–30% discount).",
          "The margin of safety cushions you if your intrinsic value estimate is wrong.",
          "Graham's principle: Never overpay. Price is what you pay, value is what you get.",
        ],
      },
      {
        heading: "CAPE Ratio for Market-Level Valuation",
        bullets: [
          "CAPE (Cyclically Adjusted P/E): Average P/E over 10 years, inflation-adjusted.",
          "Historical context: Global markets tend to be expensive above CAPE 30, attractive below 15.",
          "CAPE helps assess whether the overall market is cheap or expensive — useful for tactical rebalancing decisions.",
        ],
      },
    ],
  },
  {
    id: 17,
    tier: 4,
    title: "Investment Taxation",
    description:
      "How investments are taxed globally — capital gains, dividends, and strategies to minimise your tax bill.",
    content: [
      {
        heading: "Capital Gains Tax — Global Principles",
        bullets: [
          "Most countries tax investment profits (capital gains) at the time of sale.",
          "Short-term gains (held < 1 year): Usually taxed at higher ordinary income rates.",
          "Long-term gains (held ≥ 1 year): Usually taxed at preferential lower rates to reward patient investing.",
          "Examples: US — 0/15/20% LTCG; UK — 10/20% CGT; India — 12.5% LTCG on equity (above exemption threshold).",
        ],
      },
      {
        heading: "Dividend Taxation",
        bullets: [
          "Dividends received from stocks and funds are usually taxable as income.",
          "Some countries offer preferential 'qualified dividend' rates (US: 0–20%). Others tax at full income rates.",
          "Reinvesting dividends in tax-advantaged accounts (retirement, ISA) defers or eliminates this tax.",
          "Always check your country's dividend tax treaties — foreign dividends may be withheld at source.",
        ],
      },
      {
        heading: "Tax-Advantaged Accounts — Use Them First",
        bullets: [
          "Retirement accounts (401k, IRA, SIPP, NPS): Growth is tax-deferred or tax-free depending on account type.",
          "ISA (UK): £20,000/year tax-free investing — no capital gains or dividend tax ever.",
          "Roth IRA (US): After-tax contributions, all growth and withdrawals permanently tax-free.",
          "Always max tax-advantaged accounts before investing in taxable brokerage accounts.",
        ],
      },
      {
        heading: "Tax-Loss Harvesting",
        bullets: [
          "Strategically sell investments at a loss to offset capital gains realized elsewhere — reducing your tax bill.",
          "Then reinvest in similar (but not identical) assets to maintain market exposure.",
          "Best executed before your tax year ends — check wash-sale rules in your country.",
          "Can save significant tax: $10,000 in gains offset by $5,000 in losses = $5,000 taxable instead of $10,000.",
        ],
      },
      {
        heading: "Record-Keeping & Reporting",
        bullets: [
          "Keep records of every investment: purchase date, cost basis, sale price.",
          "Most brokers provide annual tax statements — reconcile before filing.",
          "Crypto transactions must be individually reported in most countries.",
          "International investments may trigger additional reporting requirements (FBAR, FATCA in US).",
        ],
      },
    ],
  },
  {
    id: 18,
    tier: 4,
    title: "Tax-Efficient Investing",
    description:
      "Rank your tax-saving options, choose the right account types, and understand how smart tax planning boosts returns.",
    content: [
      {
        heading: "Tax-Advantaged Accounts Ranked by Return Potential",
        bullets: [
          "1st: Employer retirement match (401k/workplace pension) — capture 100% of match first. Instant 50–100% return.",
          "2nd: Roth/ISA-style accounts — tax-free growth forever. Best for young investors.",
          "3rd: Traditional retirement accounts (IRA/SIPP/NPS) — reduces taxable income now. Deferred growth.",
          "4th: Health Savings Account (HSA, if available) — triple tax advantage for medical expenses.",
          "5th: 529/Education savings plans — tax-free growth for education costs.",
          "6th: Taxable brokerage — most flexible, least tax-efficient for income-generating assets.",
        ],
      },
      {
        heading: "Asset Location Strategy",
        bullets: [
          "Tax-inefficient assets (bonds, REITs, high-dividend stocks) → Put in tax-advantaged accounts (retirement, ISA).",
          "Tax-efficient assets (index funds, buy-and-hold equities) → OK in taxable accounts.",
          "This simple strategy can add 0.5–1% annually to after-tax returns without changing your investments.",
        ],
      },
      {
        heading: "Long-Term Holding Advantage",
        bullets: [
          "In most countries, investments held longer than 1 year qualify for lower capital gains tax rates.",
          "Buy-and-hold index investing is inherently tax-efficient: no annual capital gains from trading.",
          "Frequent trading in taxable accounts is a double penalty: higher taxes + higher transaction costs.",
        ],
      },
      {
        heading: "Cross-Border & NRI Considerations",
        bullets: [
          "If you have investments in multiple countries, check Double Taxation Avoidance Agreements (DTAAs).",
          "Foreign withholding taxes on dividends can often be credited against domestic tax liability.",
          "Report foreign accounts as required — US FBAR, UK/EU FATCA equivalents, and similar rules.",
          "Consult a qualified cross-border tax adviser if you have significant international investments.",
        ],
      },
    ],
  },
  {
    id: 19,
    tier: 5,
    title: "Investor Psychology",
    description:
      "Why smart people make terrible investment decisions — loss aversion, recency bias, and herd mentality examples.",
    content: [
      {
        heading: "Loss Aversion",
        bullets: [
          "Kahneman & Tversky (Nobel-winning research): Losses feel psychologically 2× more painful than equivalent gains.",
          "Losing $10,000 hurts more than gaining $10,000 feels good — even though the math is identical.",
          "This causes investors to: hold losers too long (hoping to break even) and sell winners too early.",
          "Counter: Focus on portfolio percentage, not absolute loss amounts.",
        ],
      },
      {
        heading: "Recency Bias",
        bullets: [
          "Recency bias: Overweighting recent events and assuming they will continue.",
          "Example: Investors poured money into tech stocks in 2021 at peak valuations, then panic-sold in 2022 crash.",
          "Recency bias causes: buying high (after bull run) and selling low (after bear market).",
          "Counter: Commit to asset allocation rules. Never change allocation based on last 3–6 months of market performance.",
        ],
      },
      {
        heading: "Overconfidence",
        bullets: [
          "Most investors rate themselves as 'above average' — mathematically impossible.",
          "Overconfidence leads to: excessive trading, inadequate diversification, ignoring risk.",
          "Studies show: frequent traders underperform passive investors by 3–5% annually.",
          "Counter: Track your actual returns vs a broad index over 5+ years before calling yourself a good stock picker.",
        ],
      },
      {
        heading: "Herd Mentality — Global Examples",
        bullets: [
          "2000 dot-com bubble: Retail investors poured into unprofitable tech companies at peak. Nasdaq fell 78% over next 2 years.",
          "2008 housing crisis: Everyone bought property assuming prices would always rise. Global crash followed.",
          "Crypto 2021: Bitcoin and altcoins hit all-time highs; retail poured in. Major assets fell 70–90% in 2022.",
          "Counter: Ask 'Why is everyone excited about this right now?' If you can't answer fundamentally, don't buy.",
        ],
      },
    ],
  },
  {
    id: 20,
    tier: 5,
    title: "Common Investor Mistakes",
    description:
      "The most expensive mistakes investors make globally — and the data to prove it.",
    content: [
      {
        heading: "Timing the Market vs Time in the Market",
        bullets: [
          "Missing just the 10 best trading days in the S&P 500 over the last 20 years cuts your return by more than half.",
          "No one consistently predicts market tops and bottoms — not fund managers, not economists.",
          "Time in market, not timing the market, drives long-term wealth.",
        ],
      },
      {
        heading: "Chasing Past Returns in Mutual Funds",
        bullets: [
          "Studies consistently show: the best-performing fund of the previous 3 years rarely tops the next 3 years.",
          "Investors buy after a fund has run 40–50%, near the peak of its outperformance cycle.",
          "Check 5–10 year CAGR and risk-adjusted returns (Sharpe ratio), not just last-year returns.",
        ],
      },
      {
        heading: "Stopping Systematic Investments in Bear Markets",
        bullets: [
          "Bear markets are when systematic investments buy the cheapest units — the units that drive your long-term returns.",
          "Missing 3 months of systematic investing during a bear market can cost 5–10% of your 20-year final portfolio value.",
          "Rule: Never stop investing unless you genuinely cannot afford the payment.",
        ],
      },
      {
        heading: "Checking Portfolio Daily",
        bullets: [
          "Daily checking increases anxiety and triggers emotional decisions.",
          "Markets move daily due to noise — 90% of daily price moves are mean-reverting noise.",
          "Quarterly review is sufficient for long-term investors. Annual rebalancing is better than frequent trading.",
          "Set alerts only for extreme events (±5% index move). Otherwise, check monthly at most.",
        ],
      },
    ],
  },
  {
    id: 21,
    tier: 5,
    title: "Mental Models for Investing",
    description:
      "Powerful thinking frameworks that make you a better investor — first principles, inversion, circle of competence.",
    content: [
      {
        heading: "First Principles Thinking",
        bullets: [
          "Break down any investment thesis to its fundamental assumptions.",
          "Example: 'Should I buy this stock?' → What is the revenue? Is it growing? Is the business model sustainable? What is it actually worth?",
          "Avoid: 'My friend made money on this, so I should buy it.'",
        ],
      },
      {
        heading: "Inversion",
        bullets: [
          "Charlie Munger: 'Invert, always invert.' Instead of 'How do I make money?', ask 'What would make me lose money?'",
          "Applied to investing: What would make this stock fail? What are the risks I'm not seeing?",
          "Pre-mortem: Before investing, imagine you lost 50% on this investment. What would have caused it?",
        ],
      },
      {
        heading: "Circle of Competence",
        bullets: [
          "Only invest in businesses you genuinely understand.",
          "You don't need to understand every sector. You need to be right about a few.",
          "Warren Buffett avoided tech in the 1990s — not because it was bad, but because it was outside his circle.",
          "Honest self-assessment: Can you explain the business model to a 10-year-old? If not, don't invest directly.",
        ],
      },
      {
        heading: "Opportunity Cost",
        bullets: [
          "Every dollar invested in Asset A is not invested in Asset B.",
          "Opportunity cost of holding cash at 2–3% (savings account) = giving up equity returns of potentially 8–12% CAGR historically.",
          "Evaluate investments not just on absolute return, but relative to the next best alternative.",
          "Holding underperforming assets 'hoping they'll recover' has a real opportunity cost.",
        ],
      },
    ],
  },
  {
    id: 22,
    tier: 6,
    title: "Derivatives Awareness",
    description:
      "Understand what options and futures are — and why most retail traders lose money in derivatives.",
    content: [
      {
        heading: "What Are Derivatives?",
        bullets: [
          "Derivatives: Financial contracts whose value derives from an underlying asset (stock, index, commodity).",
          "Two types: Futures (obligation to buy/sell at a future date) and Options (right, not obligation).",
          "Used for: hedging (reducing risk) and speculation (amplifying risk).",
        ],
      },
      {
        heading: "Options Basics",
        bullets: [
          "Call option: Right to BUY an asset at a set price (strike) before expiry.",
          "Put option: Right to SELL an asset at a set price before expiry.",
          "Premium: Price paid for the option. If the option expires worthless, you lose the entire premium.",
          "Options have time decay (theta) — value erodes daily as expiry approaches.",
        ],
      },
      {
        heading: "Why Most Retail Traders Lose Money",
        bullets: [
          "Studies globally show 70–91% of retail derivatives traders lose money over any sustained period.",
          "Reasons: options have negative expected value for buyers (premium decay), market makers and algorithms have information and speed advantages, and overconfidence leads to excessive risk-taking.",
          "Average retail derivatives trader losses are significant — often thousands of dollars per year.",
          "The minority who profit are largely high-frequency traders and institutions — not typical retail investors.",
        ],
      },
      {
        heading: "Covered Calls (Conceptual)",
        bullets: [
          "Covered call: Sell a call option against stocks you already hold to earn premium income.",
          "Reduces upside if stock rises sharply, but earns extra income in sideways/mildly bullish markets.",
          "Used by experienced investors as an income strategy. Not recommended for beginners.",
        ],
      },
    ],
  },
  {
    id: 23,
    tier: 6,
    title: "International Investing",
    description:
      "How investors can access global markets and international ETFs — and the currency advantage.",
    content: [
      {
        heading: "Accessing International Markets",
        bullets: [
          "Most countries allow residents to invest abroad, often with annual limits or reporting requirements.",
          "Examples: India's LRS scheme ($250,000/year), US allows unrestricted international investing, UK ISA holders can invest globally.",
          "Key considerations: currency risk, withholding taxes, additional regulatory reporting.",
        ],
      },
      {
        heading: "Global Stocks & International ETFs",
        bullets: [
          "You can invest in global companies (Apple, Microsoft, LVMH, etc.) via international brokers or local platforms offering overseas access.",
          "International ETFs: MSCI World ETF, S&P 500 ETFs, FTSE All-World ETF — available in most major markets.",
          "No need for direct overseas accounts if your local market offers internationally-focused funds.",
        ],
      },
      {
        heading: "Currency Risk & Opportunity",
        bullets: [
          "Investing internationally exposes you to currency fluctuations — can work for or against you.",
          "Historically, currencies of developing economies tend to depreciate vs USD/EUR over long periods — this acts as a tailwind for investors in those currencies holding USD/EUR assets.",
          "Currency risk can also work against you — hedge if needed for short-term goals.",
        ],
      },
      {
        heading: "Platforms & Access",
        bullets: [
          "Global brokers: Interactive Brokers, Saxo Bank, Charles Schwab International — available in many countries.",
          "Local platforms with international exposure: Many local apps now offer S&P 500 ETFs, global funds, or fractional shares.",
          "Check your country's regulations before investing internationally — some platforms have country-specific restrictions.",
        ],
      },
    ],
  },
  {
    id: 24,
    tier: 6,
    title: "Alternative Investments",
    description:
      "P2P lending, invoice discounting, unlisted shares — higher yields but understand the risks first.",
    content: [
      {
        heading: "P2P Lending",
        bullets: [
          "P2P lending: Lend directly to borrowers via a regulated online platform.",
          "Returns claimed: 8–15% p.a. Actual realised returns (after defaults): lower for cautious investors.",
          "Examples: LendingClub (US), Zopa (UK), Faircent/LenDenClub (India).",
          "Illiquid — cannot exit before loan tenure in most cases. Regulators cap individual exposure to limit risk.",
        ],
      },
      {
        heading: "Invoice Discounting",
        bullets: [
          "Invest in short-term invoices of businesses waiting for payment from large corporates.",
          "Returns: 8–15% p.a. for 30–90 day tenures depending on market.",
          "Risk: SME default if the invoice isn't honoured. Choose platforms with credit insurance and strong track records.",
        ],
      },
      {
        heading: "Unlisted Shares & Pre-IPO Investing",
        bullets: [
          "Buy shares of companies before they list on the stock exchange.",
          "High return potential if company IPOs at higher valuation. High risk: no liquidity until IPO.",
          "Use for max 2–5% of portfolio. Only for investors who can lock money for 3–5+ years.",
        ],
      },
      {
        heading: "Angel Investing Basics",
        bullets: [
          "Invest in early-stage startups in exchange for equity.",
          "Minimum typical ticket varies by market — often $5,000–$25,000+ per startup.",
          "10:1 failure ratio: Expect most startups to fail; returns come from the 1–2 that succeed.",
          "Access via angel networks (AngelList, SyndicateRoom, Indian Angel Network) or equity crowdfunding platforms.",
          "Only for investors with high risk tolerance and long time horizons.",
        ],
      },
    ],
  },
  {
    id: 25,
    tier: 6,
    title: "Retirement Planning Deep Dive",
    description:
      "Calculate your real retirement corpus, apply the 4% rule, and choose between annuity and systematic withdrawals.",
    content: [
      {
        heading: "Retirement Corpus Calculation (Inflation-Adjusted)",
        bullets: [
          "Step 1: Calculate current monthly expenses.",
          "Step 2: Project at retirement using inflation. At 4% for 25 years: $5,000/month today = ~$13,300/month at retirement.",
          "Step 3: Required corpus = Annual expenses at retirement ÷ safe withdrawal rate.",
          "Example: $13,300 × 12 ÷ 0.04 = ~$4 million corpus required at 4% withdrawal rate.",
        ],
      },
      {
        heading: "The 4% Rule",
        bullets: [
          "4% rule (Bengen Rule): Withdraw 4% of corpus in year 1, then adjust for inflation annually. Corpus lasts 30 years.",
          "Based on US market data 1926–1994 (Trinity Study) — 60/40 equity/bond portfolio survived in 95% of 30-year scenarios.",
          "For higher-inflation countries or longer retirements, use a more conservative 3–3.5% withdrawal rate.",
          "Invest corpus in: 50–60% equity (for growth) + 40–50% bonds/cash (for stability and withdrawals).",
        ],
      },
      {
        heading: "Sequence of Returns Risk",
        bullets: [
          "If markets crash in the first 5 years of retirement, your corpus may not recover even if returns normalize later.",
          "Example: A 30% crash in year 1 + withdrawals = corpus permanently impaired.",
          "Counter: Keep 2–3 years of expenses in liquid/cash or short-term bonds. Draw from this in bear markets. Let equity portion recover.",
          "This is why 100% equity portfolio at retirement is dangerous.",
        ],
      },
      {
        heading: "Annuity vs Systematic Withdrawal (SWP)",
        bullets: [
          "Annuity: Buy from insurance company. Guaranteed income for life. Fully taxable. Typical yields: 4–7% p.a. depending on market rates.",
          "Annuity is irreversible — once bought, cannot reclaim capital. Fixed annuity payments erode in real value due to inflation.",
          "SWP: Redeem a fixed amount monthly/annually from your investment portfolio.",
          "SWP advantages: Capital remains invested, higher potential returns, flexible, more tax-efficient.",
          "Recommended: Use SWP from a balanced/diversified fund for most retirees. Annuitize only 25–40% of corpus for guaranteed longevity income.",
        ],
      },
    ],
  },
];

function useReadState() {
  const [readIds, setReadIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? (JSON.parse(stored) as number[]) : [];
    } catch {
      return [];
    }
  });

  const toggleRead = (id: number) => {
    setReadIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        // silently ignore storage errors
      }
      return next;
    });
  };

  return { readIds, toggleRead };
}

function ChapterCard({
  chapter,
  tier,
  isRead,
  onToggleRead,
}: {
  chapter: Chapter;
  tier: Tier;
  isRead: boolean;
  onToggleRead: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isStarter = tier.number === 0;
  const IconComp = isStarter ? (TIER0_ICON_MAP[chapter.id] ?? Brain) : null;
  const displayId = isStarter
    ? String(chapter.id - 100).padStart(2, "0")
    : String(chapter.id).padStart(2, "0");

  return (
    <div
      data-ocid={`chapters.chapter.${chapter.id}`}
      className={`rounded-2xl border bg-white dark:bg-slate-800/60 shadow-sm overflow-hidden transition-all duration-200 ${tier.borderClass} dark:border-slate-700`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: tier.color }}
            >
              {isStarter ? "S" : "Ch"} {displayId}
            </span>
            {isRead && (
              <CheckCircle
                className="w-4 h-4 text-emerald-500"
                aria-label="Read"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {IconComp && (
                <span style={{ color: tier.color }}>
                  <IconComp className="w-4 h-4 flex-shrink-0" />
                </span>
              )}
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {chapter.title}
              </h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${tier.badgeClass}`}
              >
                {isStarter ? "Starter" : `Tier ${tier.number}`}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {chapter.description}
            </p>
          </div>

          <button
            type="button"
            data-ocid={`chapters.chapter.${chapter.id}.expand`}
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            aria-label={expanded ? "Collapse chapter" : "Read chapter"}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {expanded ? "Collapse" : "Read"}
            {expanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className={`border-t border-slate-100 dark:border-slate-700 px-4 pb-4 pt-3 ${tier.bgClass}`}
        >
          <div className="space-y-4">
            {chapter.content.map((section) => (
              <div key={section.heading}>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                  {section.heading}
                </h4>
                <ul className="space-y-1.5">
                  {section.bullets.map((bullet, bi) => (
                    <li
                      key={`${section.heading}-${bi}`}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: tier.color }}
                        aria-hidden="true"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Starter calculator */}
          {isStarter && chapter.calculatorId && (
            <StarterCalculator calcId={chapter.calculatorId} />
          )}

          <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              data-ocid={`chapters.chapter.${chapter.id}.mark_read`}
              onClick={() => onToggleRead(chapter.id)}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border transition-colors ${
                isRead
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                  : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
              }`}
            >
              <CheckCircle
                className={`w-4 h-4 ${isRead ? "text-emerald-500" : "text-slate-400"}`}
              />
              {isRead ? "Marked as Read ✓" : "Mark as Read"}
            </button>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Collapse ▲
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TierAccordion({
  tier,
  chapters,
  readIds,
  onToggleRead,
}: {
  tier: Tier;
  chapters: Chapter[];
  readIds: number[];
  onToggleRead: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const readCount = chapters.filter((c) => readIds.includes(c.id)).length;
  const isStarter = tier.number === 0;

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden ${tier.borderClass} dark:border-slate-700`}
    >
      <button
        type="button"
        data-ocid={`chapters.tier.${tier.number}`}
        className={`w-full flex items-center justify-between p-4 hover:opacity-90 transition-opacity ${tier.headerBg} dark:bg-slate-800/60`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: tier.color }}
          >
            {isStarter ? "S" : tier.number}
          </span>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {isStarter
                  ? "Tier 0: Starter"
                  : `Tier ${tier.number}: ${tier.name}`}
              </p>
              {isStarter && (
                <Badge className="bg-slate-100 text-slate-600 border border-slate-200 text-xs">
                  Start Here
                </Badge>
              )}
              {tier.locked && (
                <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-xs gap-1">
                  <Lock className="w-3 h-3" /> Unlockable
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {chapters.length} chapters · {readCount}/{chapters.length} read
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
            style={{ background: tier.color }}
          >
            {chapters.length}
          </span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 space-y-3 bg-white dark:bg-slate-900/40">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              tier={tier}
              isRead={readIds.includes(chapter.id)}
              onToggleRead={onToggleRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChaptersTab() {
  const { readIds, toggleRead } = useReadState();
  const totalChapters = CHAPTERS.length;
  const readCount = readIds.filter((id) =>
    CHAPTERS.some((c) => c.id === id),
  ).length;
  const progressPct = totalChapters > 0 ? (readCount / totalChapters) * 100 : 0;

  return (
    <div className="space-y-5" data-ocid="chapters.tab">
      {/* Progress bar */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Learning Progress
            </span>
          </div>
          <span
            className="text-sm font-bold text-emerald-600 dark:text-emerald-400"
            data-ocid="chapters.progress.label"
          >
            {readCount} / {totalChapters} chapters read
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
            data-ocid="chapters.progress.bar"
          />
        </div>
        {readCount === totalChapters && totalChapters > 0 && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
            🎉 You've completed all chapters! Excellent work.
          </p>
        )}
      </div>

      {/* Tier accordions */}
      <div className="space-y-3">
        {TIERS.map((tier) => {
          const tierChapters = CHAPTERS.filter((c) => c.tier === tier.number);
          return (
            <TierAccordion
              key={tier.number}
              tier={tier}
              chapters={tierChapters}
              readIds={readIds}
              onToggleRead={toggleRead}
            />
          );
        })}
      </div>
    </div>
  );
}
