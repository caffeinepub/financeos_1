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
          "₹1,00,000 at 12% annual return for 20 years = ₹9,64,629 — nearly 10x your money.",
        ],
      },
      {
        heading: "Why Starting Early Matters",
        bullets: [
          "Start at 25: ₹5,000/month for 35 years at 12% = ₹3.2 Crore.",
          "Start at 35: ₹5,000/month for 25 years at 12% = ₹94 Lakh.",
          "10 years of delay costs ₹2.3 Crore — that is the price of waiting.",
          "Key rule: Never interrupt compounding. Even one year of pause can cost years of growth at the end.",
        ],
      },
      {
        heading: "Compounding in SIPs",
        bullets: [
          "Every SIP payment starts its own compounding journey. The first payment compounds the longest.",
          "SIPs exploit compounding automatically — discipline is your greatest edge.",
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
          "FD at 7% doubles in ~10 years. Equity at 14% doubles in ~5 years.",
          "Over 30 years, equity doubles 6 times vs FD doubling just 3 times.",
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
          "Uses Rupee Cost Averaging — buy more units when markets fall, fewer when they rise.",
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
          "Data over 10-year rolling periods: SIP beats lump sum ~60% of the time in volatile markets.",
          "For salaried investors, SIP wins through discipline.",
          "For windfall money, use a Systematic Transfer Plan (STP) — park in liquid funds, transfer monthly.",
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
          "India's average inflation: 5–7% per year (CPI). At 6% inflation, prices double every 12 years.",
          "₹1,00,000 today = ₹74,409 in 5 years at 6% inflation.",
          "₹1,00,000 today = ₹55,368 in 10 years at 6% inflation.",
          "₹1,00,000 today = ₹23,305 in 25 years at 6% inflation.",
        ],
      },
      {
        heading: "Real Returns After Inflation",
        bullets: [
          "Golden rule: Your investment return must beat Inflation + Tax to create real wealth.",
          "FD at 7% → After 30% tax = 4.9% → Real return = -1.1% (negative!).",
          "PPF at 7.1% → Tax-free → Real return = +1.1%.",
          "Equity at 13% → After 10% LTCG = 11.7% → Real return = +5.7%.",
          "Best hedge: Equity (historically 12–15% vs 6% inflation). Gold also works as partial inflation hedge.",
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
          "Example: ₹1,00,000 → ₹2,50,000 in 5 years = CAGR of 20.1% per year.",
        ],
      },
      {
        heading: "Why CAGR Beats Absolute Returns",
        bullets: [
          "Fund A: ₹1L → ₹2L in 4 years = 100% absolute, 18.9% CAGR.",
          "Fund B: ₹1L → ₹3L in 8 years = 200% absolute, 14.7% CAGR.",
          "Fund A is the better investment despite lower absolute return — CAGR reveals this truth.",
          "Rule: Always compare investments using CAGR. Never trust absolute return claims without knowing the time period.",
        ],
      },
      {
        heading: "CAGR Benchmarks (India)",
        bullets: [
          "Nifty 50 20-year CAGR: ~13–14%.",
          "Sensex 30-year CAGR: ~15%.",
          "FD average CAGR: ~6–7%.",
          "Gold 20-year CAGR: ~10%.",
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
          "P/E of 20 means you pay ₹20 for every ₹1 of annual earnings.",
          "Compare P/E within the same sector — Tech commands 30–50x, Banks trade at 10–15x.",
        ],
      },
      {
        heading: "Nifty 50 Historical P/E Bands",
        bullets: [
          "Below 16: Severely undervalued — strong buy zone.",
          "16–20: Fair value — accumulate.",
          "20–25: Slightly expensive — invest selectively.",
          "Above 25: Expensive — avoid lump sum.",
          "Above 30: Bubble territory — trim holdings.",
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
          "Index funds: Inherently diversified — a Nifty 50 index fund gives exposure to 50 companies across 13 sectors.",
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
            <span className={lbl}>Principal (₹)</span>
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
            ₹{result.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <p className="text-xs text-slate-400">
            Growth: {((result / p - 1) * 100).toFixed(1)}% · Gain: ₹
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
            <span className={lbl}>Monthly SIP (₹)</span>
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
              ₹{sipFV.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
          <div className={res}>
            <p className="text-xs text-slate-500">Lump Sum FV</p>
            <p className="text-base font-bold text-blue-600">
              ₹{lumpFV.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
            <span className={lbl}>Current Amount (₹)</span>
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
              ₹{futureValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
          <div className={res}>
            <p className="text-xs text-slate-500">Today's Purchasing Power</p>
            <p className="text-base font-bold text-red-600">
              ₹
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
            <span className={lbl}>Start Value (₹)</span>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(+e.target.value)}
              className={inp}
            />
          </div>
          <div>
            <span className={lbl}>End Value (₹)</span>
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
            <span className={lbl}>EPS (₹)</span>
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
            ₹{(p * r).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
          "Real return = Nominal return − Inflation. If your FD gives 6% and inflation is 5%, your real gain is just 1%.",
          "India CPI inflation averages 5–6% per year (RBI target: 4% ± 2%).",
          "₹1 lakh today ≈ ₹61,000 in real value after 10 years at 5% inflation.",
        ],
      },
      {
        heading: "Net Worth — What It Is",
        bullets: [
          "Net Worth = Total Assets − Total Liabilities.",
          "Assets: savings, investments, property, gold, vehicles.",
          "Liabilities: home loan, car loan, credit card debt, personal loans.",
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
          "₹1,000 today is worth more than ₹1,000 a year from now because it can be invested.",
          "Compounding: ₹1 lakh at 12% for 30 years grows to ₹29.96 lakhs.",
          "Rule of 72: Divide 72 by your return rate to find years to double. At 12% → money doubles in 6 years.",
          "Start investing early: a 25-year-old investing ₹5,000/month beats a 35-year-old investing ₹10,000/month by retirement.",
        ],
      },
    ],
  },
  {
    id: 2,
    tier: 1,
    title: "The Indian Financial Ecosystem",
    description:
      "Who regulates what, how exchanges work, and why you need both a DEMAT and trading account.",
    content: [
      {
        heading: "Regulators",
        bullets: [
          "SEBI: Regulates stock brokers, exchanges, mutual funds, and listed companies.",
          "RBI: Regulates banks, NBFCs, currency, and monetary policy.",
          "AMFI: Regulates mutual fund distributors and AMCs.",
          "IRDAI: Regulates all insurance products.",
          "PFRDA: Regulates NPS and pension funds.",
        ],
      },
      {
        heading: "Financial Institutions",
        bullets: [
          "AMC (Asset Management Company): Manages pooled investor money in mutual funds (e.g., HDFC AMC, SBI AMC, Mirae).",
          "Broker: Facilitates buying/selling of securities (e.g., Zerodha, Groww, ICICI Direct).",
          "Depository: Holds your securities electronically. India has two: CDSL and NSDL.",
        ],
      },
      {
        heading: "Stock Exchanges",
        bullets: [
          "NSE (National Stock Exchange): Largest by trading volume. Home of Nifty 50.",
          "BSE (Bombay Stock Exchange): Oldest in Asia. Home of Sensex (30 stocks).",
          "Nifty 50 represents the top 50 companies by market cap on NSE.",
          "Sensex represents the top 30 companies on BSE.",
        ],
      },
      {
        heading: "DEMAT & Trading Accounts",
        bullets: [
          "DEMAT account: Holds your shares/securities in electronic form — like a bank account for stocks.",
          "Trading account: Used to place buy/sell orders on the exchange.",
          "Both accounts are linked; needed together to invest in stocks and ETFs.",
          "Opening a DEMAT account requires KYC (PAN, Aadhaar).",
        ],
      },
    ],
  },
  {
    id: 3,
    tier: 1,
    title: "Goal-Based Investing",
    description:
      "Link your money to real life goals — home, child's education, retirement — and prioritise when capital is limited.",
    content: [
      {
        heading: "Short / Medium / Long-Term Goal Framework",
        bullets: [
          "Short-term (0–3 years): Emergency fund, vacation, car down payment → liquid funds, FDs, savings accounts.",
          "Medium-term (3–7 years): Child's school fees, home renovation → debt mutual funds, hybrid funds.",
          "Long-term (7+ years): Retirement, child's higher education → equity mutual funds, direct equity, NPS.",
        ],
      },
      {
        heading: "Emergency Fund",
        bullets: [
          "Keep 6 months of monthly expenses in a liquid, accessible account.",
          "Park it in: savings account, liquid mutual fund, or short-term FD.",
          "Do NOT invest emergency funds in equity or illiquid assets.",
          "Without an emergency fund, any financial shock forces you to break long-term investments at the worst time.",
        ],
      },
      {
        heading: "Linking Money to Life Goals",
        bullets: [
          "Each investment should have a purpose: 'This SIP of ₹5,000 is for my child's college in 15 years.'",
          "Goal-based investing reduces panic selling — you know the timeline and purpose.",
          "Use the Growfinfire Goals module to map each investment to a specific goal.",
        ],
      },
      {
        heading: "Prioritisation When Capital is Limited",
        bullets: [
          "Priority order: Emergency fund → High-interest debt repayment → Retirement → Other goals.",
          "Never invest in long-term goals while carrying high-interest debt (credit cards at 36–42% p.a.).",
          "Even ₹500/month invested consistently beats doing nothing.",
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
          "Listed on NSE/BSE; prices change every second during market hours (9:15 AM – 3:30 PM IST).",
        ],
      },
      {
        heading: "Market Cap Categories",
        bullets: [
          "Large cap: Top 100 companies by market cap. Stable, lower risk (e.g., Reliance, TCS, HDFC Bank).",
          "Mid cap: Companies ranked 101–250. Higher growth potential, moderate risk.",
          "Small cap: Companies ranked 251+. High risk, high potential returns.",
          "SEBI-defined classification used by all mutual funds in India.",
        ],
      },
      {
        heading: "Indices",
        bullets: [
          "Nifty 50: 50 largest NSE companies; represents ~68% of total NSE market cap.",
          "Sensex: 30 largest BSE companies; oldest Indian index (since 1979).",
          "Nifty Next 50: 50 companies just below Nifty 50; more volatile but higher historical returns.",
        ],
      },
      {
        heading: "Bull & Bear Markets",
        bullets: [
          "Bull market: Sustained rise of 20%+ from recent lows. Investor confidence is high.",
          "Bear market: Sustained fall of 20%+ from recent highs.",
          "Correction: 10–20% fall from peak. Normal and healthy.",
          "Crash: Sharp, rapid fall (e.g., March 2020: Sensex fell 38% in weeks due to COVID panic).",
        ],
      },
      {
        heading: "Key Valuation Ratios",
        bullets: [
          "P/E (Price-to-Earnings): Share price ÷ Earnings per share. Higher P/E = market expects high growth OR stock is expensive.",
          "P/B (Price-to-Book): Share price ÷ Book value per share. Below 1 = trading below asset value.",
          "Nifty 50 historical average P/E: ~20x. Above 25x = expensive. Below 16x = attractive.",
        ],
      },
    ],
  },
  {
    id: 5,
    tier: 2,
    title: "Mutual Funds",
    description:
      "Pooled investing made simple — understand NAV, SIP mechanics, direct vs regular plans, and how costs erode returns.",
    content: [
      {
        heading: "What an AMC Does & NAV",
        bullets: [
          "AMC collects money from many investors and invests it in a portfolio of stocks, bonds, or both.",
          "NAV (Net Asset Value) = Total portfolio value ÷ Total units. Calculated daily after market close.",
          "Buying at a lower NAV doesn't mean cheaper — it's the portfolio quality that matters.",
        ],
      },
      {
        heading: "Types of Mutual Funds",
        bullets: [
          "Equity funds: Invest primarily in stocks. Higher risk, higher potential returns.",
          "Debt funds: Invest in bonds/fixed income. Lower risk, stable returns.",
          "Hybrid funds: Mix of equity and debt (e.g., Balanced Advantage Funds).",
          "Index funds: Passively track an index (Nifty 50, Sensex). Low cost.",
          "Sectoral/Thematic funds: Invest in specific sectors (IT, pharma). High concentration risk.",
        ],
      },
      {
        heading: "Regular vs Direct Plans",
        bullets: [
          "Direct plan: Buy directly from AMC. No distributor commission. Lower expense ratio by ~0.5–1.5%.",
          "Regular plan: Buy via distributor/broker. Includes trail commission. Higher expense ratio.",
          "Impact over 20 years on a ₹10,000/month SIP: Direct plan creates ₹10–15 lakh MORE than regular.",
          "Always choose Direct plans if you're investing yourself (via AMC website, MF Central, Groww, Zerodha Coin).",
        ],
      },
      {
        heading: "SIP & Rupee Cost Averaging",
        bullets: [
          "SIP: Fixed amount invested at regular intervals (monthly).",
          "Rupee cost averaging: When NAV falls, you buy more units. When NAV rises, you buy fewer units.",
          "SIPs remove the need to time the market — you invest regardless of market conditions.",
          "Never stop your SIP in a bear market — those cheap units drive your long-term returns.",
        ],
      },
      {
        heading: "Costs & Returns",
        bullets: [
          "Exit load: Penalty for redeeming before a set period. Typically 1% if within 1 year.",
          "Expense ratio: Annual fee deducted from NAV daily. Active funds: ~1–2.5%. Index funds: ~0.1–0.2%.",
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
          "Index Mutual Fund: Bought/sold at end-of-day NAV. Easier for SIPs.",
          "Both track the same index; both are passive. Key difference is liquidity and how you buy.",
        ],
      },
      {
        heading: "Tracking Error",
        bullets: [
          "Tracking error: Difference between the fund's return and the index's return.",
          "Lower tracking error = better fund management.",
          "Causes: cash held for redemptions, expense ratio, rebalancing timing.",
          "Choose ETFs/index funds with consistently low tracking error (check AMC factsheets).",
        ],
      },
      {
        heading: "Types of ETFs in India",
        bullets: [
          "Nifty ETF: Tracks Nifty 50 (e.g., Nippon Nifty BeES, HDFC Nifty 50 ETF).",
          "Gold ETF: Tracks domestic gold prices. Each unit ≈ 1 gram gold. No storage risk.",
          "International ETFs: Track foreign indices (e.g., Mirae Asset NYSE FANG+ ETF, Motilal Oswal Nasdaq 100 ETF).",
          "Banking, IT, Pharma sector ETFs available on NSE.",
        ],
      },
      {
        heading: "Why Passive Beats Active Over Long Run",
        bullets: [
          "Data (2026): Index funds beat 73–80% of active fund managers over 15+ year periods in India.",
          "Average active equity fund expense: ~1.5%. Average index fund expense: ~0.2%. Difference: 1.3% per year.",
          "Over 20 years, that 1.3% difference on ₹10,000/month SIP = ₹15–20 lakh gap.",
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
      "Safe-ish investments — FDs, bonds, G-Secs, and why rising interest rates hurt bond prices.",
    content: [
      {
        heading: "Types of Fixed Income Instruments",
        bullets: [
          "FD (Fixed Deposit): Bank deposit at fixed rate for fixed tenure. Insured up to ₹5 lakh per bank by DICGC.",
          "RD (Recurring Deposit): Monthly deposits at fixed rate.",
          "G-Sec (Government Securities): Bonds issued by the Government of India. Zero credit risk. Tenures 1–40 years.",
          "T-Bills (Treasury Bills): Short-term G-Secs (91, 182, 364 days). Highly liquid.",
          "Corporate Bonds: Issued by companies. Higher yield than G-Secs but carry credit risk.",
        ],
      },
      {
        heading: "Credit Ratings",
        bullets: [
          "Credit rating agencies (CRISIL, ICRA, CARE) rate bonds on creditworthiness.",
          "AAA: Highest safety. AA: High safety. A: Adequate safety. Below BBB = speculative (junk).",
          "Higher rating = lower yield. Lower rating = higher yield (risk premium).",
          "Stick to AAA/AA-rated bonds or G-Secs for safety.",
        ],
      },
      {
        heading: "Yield, Coupon, and Interest Rate Risk",
        bullets: [
          "Coupon: Fixed interest payment (e.g., 7% of face value annually).",
          "Yield: Actual return based on current market price.",
          "When RBI raises rates, new bonds offer higher coupons → existing bonds become less attractive → prices fall.",
          "Bond price and yield move in OPPOSITE directions — the most important concept in fixed income.",
        ],
      },
      {
        heading: "Special Government Instruments",
        bullets: [
          "RBI Floating Rate Bonds: Rate linked to NSC rate + 0.35%. Currently ~8.05%. 7-year tenure.",
          "Sovereign Gold Bonds (SGBs): Government-issued, gold-linked bonds. 8-year tenure, 2.5% annual interest + gold price appreciation.",
          "SGBs are exempt from capital gains tax on maturity — best form of gold investment for long-term investors.",
        ],
      },
    ],
  },
  {
    id: 8,
    tier: 2,
    title: "Retiral Instruments",
    description:
      "EPF, PPF, and NPS — India's core retirement savings tools with significant tax benefits.",
    content: [
      {
        heading: "EPF (Employee Provident Fund)",
        bullets: [
          "12% of basic salary from employee + 12% from employer. Total: 24% of basic salary.",
          "UAN (Universal Account Number): Portable across jobs. Always link new employer to same UAN.",
          "Withdrawal fully tax-free after 5 years of continuous service.",
          "Current interest rate: 8.25% p.a. (2024–25). Declared annually by EPFO.",
        ],
      },
      {
        heading: "PPF (Public Provident Fund)",
        bullets: [
          "15-year lock-in period. Can be extended in 5-year blocks after maturity.",
          "Partial withdrawal allowed from year 7 onwards. Loan available from year 3 to year 6.",
          "Current interest rate: ~7.1% p.a. (government-set, reviewed quarterly).",
          "Interest and maturity proceeds fully tax-free. EEE status.",
        ],
      },
      {
        heading: "NPS (National Pension System)",
        bullets: [
          "Tier 1: Retirement account. Locked until age 60. Mandatory 40% annuity at retirement.",
          "Tier 2: Voluntary savings account. Withdraw anytime. No additional tax benefit.",
          "8 pension fund managers to choose from (SBI, LIC, HDFC, ICICI, Kotak, Birla, UTI, Axis).",
          "At retirement: 60% lump sum (tax-free) + 40% must be used to buy annuity.",
          "Extra ₹50,000 deduction under Section 80CCD(1B) — over and above the ₹1.5L limit under Section 80C.",
        ],
      },
      {
        heading: "80C Tax Benefits",
        bullets: [
          "Section 80C: Up to ₹1.5 lakh deduction per year. Instruments: ELSS, EPF, PPF, NSC, tax-saving FD, life insurance premium, home loan principal.",
          "ELSS: Mutual fund with 3-year lock-in. Best return potential among 80C instruments.",
          "80CCD(1B): Additional ₹50,000 for NPS contribution. Total tax saving: up to ₹2 lakh per year.",
        ],
      },
    ],
  },
  {
    id: 9,
    tier: 2,
    title: "Commodities",
    description:
      "Gold, silver, crude oil — commodities as an inflation hedge and how to invest via MCX.",
    content: [
      {
        heading: "Gold Investment Forms",
        bullets: [
          "Physical gold (jewellery/coins): High making charges (10–25%), storage risk. Poor investment form.",
          "Digital gold (Paytm/PhonePe): Small amounts, but charges and counterparty risk. Not SEBI-regulated.",
          "Gold ETF: Exchange-traded, each unit ≈ 1 gram gold. SEBI-regulated. Ideal for most investors.",
          "Sovereign Gold Bonds (SGB): Best for long-term. 2.5% annual interest + gold appreciation. Tax-free on maturity.",
          "Gold Mutual Funds: FOF investing in Gold ETFs. Good for SIP investors without a DEMAT account.",
        ],
      },
      {
        heading: "Silver & Crude Oil",
        bullets: [
          "Silver: More volatile than gold. Industrial use (EVs, solar panels) adds demand beyond safe-haven.",
          "Crude oil: India is 85% import-dependent. Rising oil prices impact inflation, currency, and markets.",
          "Both traded on MCX (Multi Commodity Exchange) in India.",
        ],
      },
      {
        heading: "Commodities as Inflation Hedge",
        bullets: [
          "Gold has historically preserved purchasing power over centuries.",
          "Commodities tend to move opposite to equity in crisis periods — portfolio diversifier.",
          "Recommended allocation: 5–10% in gold as portfolio hedge. Not a standalone investment.",
        ],
      },
      {
        heading: "MCX — How Commodity Trading Works",
        bullets: [
          "MCX: India's largest commodity exchange. Trades gold, silver, copper, crude, natural gas.",
          "Commodity futures: Derivative contracts — specify delivery of commodity at future date at agreed price.",
          "High leverage in commodity futures = high risk. Mostly for hedging, not retail investing.",
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
          "Historically seen as safe in India, but returns have been moderate post-2013.",
          "Illiquid: Cannot sell quickly without significant price discount.",
          "High transaction costs: Registration, stamp duty, brokerage (7–10% of property value).",
          "Rental yield in Indian cities: typically 2–3% gross (net even lower after maintenance, vacancy).",
          "True return = rental yield + capital appreciation. Inflation-adjusted returns often 4–6% in major cities.",
        ],
      },
      {
        heading: "REITs (Real Estate Investment Trusts)",
        bullets: [
          "REIT: A company that owns income-producing real estate (offices, malls, warehouses).",
          "Traded on stock exchange. Can buy even 1 unit (₹300–500 per unit).",
          "India's listed REITs: Embassy REIT, Mindspace REIT, Brookfield REIT.",
          "By law, 90% of net distributable cash flows must be distributed to unitholders (quarterly).",
        ],
      },
      {
        heading: "REIT Distributions",
        bullets: [
          "Distributions come from: rental income, dividend from SPVs, interest income.",
          "Current REIT yields in India: ~6–8% annually from distributions alone.",
          "Distribution tax treatment: Dividend portion taxed at slab rate; interest/amortisation portions differ.",
        ],
      },
      {
        heading: "Why Illiquidity Matters",
        bullets: [
          "Illiquid assets cannot be sold quickly at fair value.",
          "In emergencies, you may sell property at 20–30% discount.",
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
      "Blockchain basics, Bitcoin risk profile, India's 30% flat tax, and safe allocation principles.",
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
        heading: "Indian Tax Treatment (Budget 2022 onwards)",
        bullets: [
          "Flat 30% tax on all crypto/VDA (Virtual Digital Asset) gains — regardless of holding period.",
          "1% TDS on transactions above ₹50,000 (₹10,000 for specified persons).",
          "Crypto losses cannot be set off against any other income.",
          "Cannot carry forward crypto losses to offset future crypto gains.",
          "India has one of the strictest crypto tax regimes globally.",
        ],
      },
      {
        heading: "Safe Allocation Principles",
        bullets: [
          "Maximum allocation: 5–10% of investable portfolio for high-risk tolerant investors.",
          "Conservative/moderate investors: 0–2%.",
          "Crypto is speculative — treat it as high-risk speculation, not a core investment.",
          "Store on regulated Indian exchanges (WazirX, CoinDCX) or hardware wallet.",
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
          "A Nifty 50 index fund has lower SD than a small-cap fund, but also lower expected return.",
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
          "Core (70–80%): Low-cost, diversified, long-term holdings. Nifty 50 index fund, mid-cap index, Nifty Next 50.",
          "Satellite (20–30%): Higher-conviction, higher-risk bets. Sectoral funds, small-cap, international ETFs, direct stocks.",
          "Core protects wealth; satellite creates alpha.",
        ],
      },
      {
        heading: "Diversification vs Diworsification",
        bullets: [
          "True diversification: Owning uncorrelated assets that reduce risk.",
          "Diworsification: Owning too many similar funds (5 large-cap active funds that all track Nifty 50).",
          "Ideal portfolio: 4–6 funds maximum, across market cap and asset class. Not 15 funds.",
        ],
      },
      {
        heading: "Overlap Analysis in Mutual Funds",
        bullets: [
          "Two large-cap funds often hold the same top 20 stocks — no diversification benefit.",
          "Use tools like Morningstar/Value Research to check portfolio overlap before buying a new fund.",
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
          "P/E (Price-to-Earnings): Most common. Compare to: same stock history, industry peers, and Nifty average.",
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
          "Nifty CAPE above 30 = historically expensive. Below 18 = historically attractive.",
          "CAPE helps assess whether the overall market is cheap or expensive — useful for tactical rebalancing.",
        ],
      },
    ],
  },
  {
    id: 17,
    tier: 4,
    title: "Investment Taxation in India",
    description:
      "STCG, LTCG, dividend tax, indexation changes post-Budget 2024 — know exactly what you owe.",
    content: [
      {
        heading: "Equity Taxation (Post-Budget 2024)",
        bullets: [
          "STCG (Short-Term Capital Gains): Holding < 1 year → 20% tax (increased from 15% in Budget 2024).",
          "LTCG (Long-Term Capital Gains): Holding ≥ 1 year → 12.5% on gains above ₹1.25 lakh per year.",
          "No indexation benefit for equity.",
          "These rates apply to: direct stocks, equity mutual funds, equity ETFs.",
        ],
      },
      {
        heading: "Debt Mutual Fund Taxation",
        bullets: [
          "Post April 1, 2023: Debt mutual funds taxed at SLAB RATE regardless of holding period.",
          "No LTCG benefit. No indexation. Treated like FD income.",
        ],
      },
      {
        heading: "Other Asset Class Taxation",
        bullets: [
          "Gold ETF/Fund: LTCG of 12.5% after 24 months (indexation removed in Budget 2024).",
          "Physical gold LTCG: 12.5% after 24 months.",
          "Sovereign Gold Bonds: Fully exempt on maturity (8-year hold).",
          "Real estate LTCG: 12.5% after 24 months (indexation removed for property bought after July 23, 2024).",
        ],
      },
      {
        heading: "Dividend Taxation",
        bullets: [
          "Dividends taxed at investor's income slab rate.",
          "TDS of 10% on dividends above ₹5,000 per year from equity mutual funds/stocks.",
        ],
      },
      {
        heading: "Tax-Loss Harvesting",
        bullets: [
          "Legally book losses on underperforming investments to offset capital gains.",
          "Short-term losses can offset both STCG and LTCG. Long-term losses can only offset LTCG.",
          "Best done before March 31 each financial year.",
          "Can save significant LTCG tax — e.g., ₹2L gains minus ₹50K losses minus ₹1.25L exemption = ₹25K taxable.",
        ],
      },
      {
        heading: "Form 26AS & AIS",
        bullets: [
          "Form 26AS: Tax credit statement showing TDS deducted by all deductors.",
          "AIS (Annual Information Statement): Comprehensive record of all financial transactions reported to income tax.",
          "Always reconcile AIS before filing ITR to avoid tax notices.",
        ],
      },
    ],
  },
  {
    id: 18,
    tier: 4,
    title: "Tax-Efficient Investing",
    description:
      "Rank your 80C options, compare ELSS vs PPF vs NPS, and understand how smart tax planning boosts returns.",
    content: [
      {
        heading: "80C Instruments Ranked by Return Potential",
        bullets: [
          "1st: ELSS — market-linked returns historically 12–15% CAGR; 3-year lock-in.",
          "2nd: NPS via 80CCD(1B) — market-linked with equity allocation; locked till 60.",
          "3rd: EPF — guaranteed ~8.25% p.a. tax-free. No active investment needed.",
          "4th: PPF — guaranteed ~7.1% p.a. tax-free. 15-year lock-in.",
          "5th: NSC (National Savings Certificate) — ~7.7% p.a. but interest taxable.",
          "6th: Tax-saving FD (5-year) — ~6.5–7.5% p.a. Interest fully taxable at slab rate.",
        ],
      },
      {
        heading: "ELSS vs PPF vs NPS",
        bullets: [
          "ELSS: Shortest lock-in (3 years), highest return potential, market risk. Best for: Young investors.",
          "PPF: Zero risk, tax-free, but low liquidity (15-year lock-in). Best for: Conservative investors.",
          "NPS: Best tax efficiency (80C + 80CCD(1B) = ₹2L deduction), partially annuitised at retirement.",
          "Practical tip: Use ELSS for 80C (growth), NPS for extra ₹50K deduction, EPF as baseline.",
        ],
      },
      {
        heading: "HUF (Hindu Undivided Family)",
        bullets: [
          "HUF is a legal tax entity in India for Hindu families. Gets its own PAN and separate ₹2.5L basic exemption.",
          "Can invest in its own name — effectively creates another slot for tax-free income.",
          "Relevant for high-income families; consult a CA for setup.",
        ],
      },
      {
        heading: "NRI Taxation Basics",
        bullets: [
          "NRIs investing in Indian equity: STCG 20%, LTCG 12.5% (same as residents).",
          "NRI interest income (NRO account): Taxed in India. NRE account interest: Tax-free in India.",
          "DTAA (Double Taxation Avoidance Agreement): India has DTAA with 90+ countries to avoid double taxation.",
        ],
      },
    ],
  },
  {
    id: 19,
    tier: 5,
    title: "Investor Psychology",
    description:
      "Why smart people make terrible investment decisions — loss aversion, recency bias, and India-specific herd examples.",
    content: [
      {
        heading: "Loss Aversion",
        bullets: [
          "Kahneman & Tversky (Nobel-winning research): Losses feel psychologically 2× more painful than equivalent gains.",
          "Losing ₹10,000 hurts more than gaining ₹10,000 feels good — even though the math is identical.",
          "This causes investors to: hold losers too long (hoping to break even) and sell winners too early.",
          "Counter: Focus on portfolio percentage, not absolute loss amounts.",
        ],
      },
      {
        heading: "Recency Bias",
        bullets: [
          "Recency bias: Overweighting recent events and assuming they will continue.",
          "Example: Investors poured money into IT funds in 2021 at peak valuations, then panic-sold in 2022 crash.",
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
          "Counter: Track your actual returns vs Nifty 50 over 5+ years before calling yourself a good stock picker.",
        ],
      },
      {
        heading: "Herd Mentality — Indian Market Examples",
        bullets: [
          "January 2008: Sensex hit 21,000 all-time high. Retail investors poured in at peak. Then fell 60% in 12 months.",
          "March 2020: COVID panic. Sensex fell 38% in weeks. Retail investors sold at lows. Market fully recovered in 6 months.",
          "SME IPO mania 2023–24: 200–400% oversubscriptions on dubious SME companies. Many fell 50–80% post-listing.",
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
      "The most expensive mistakes Indian investors make — and the data to prove it.",
    content: [
      {
        heading: "Timing the Market vs Time in the Market",
        bullets: [
          "Missing just the 10 best trading days in the Nifty 50 over the last 20 years cuts your return by more than half.",
          "No one consistently predicts market tops and bottoms — not fund managers, not economists.",
          "Time in market, not timing the market, drives long-term wealth.",
        ],
      },
      {
        heading: "Chasing Past Returns in Mutual Funds",
        bullets: [
          "SEBI study: The best-performing fund of the previous 3 years is rarely the best performer in the next 3 years.",
          "Investors buy after a fund has run 40–50%, near the peak of its outperformance cycle.",
          "Check 5–10 year CAGR and risk-adjusted returns (Sharpe ratio), not just last-year returns.",
        ],
      },
      {
        heading: "Stopping SIPs in Bear Markets",
        bullets: [
          "Bear markets are when SIPs buy cheapest units — the units that drive your long-term returns.",
          "₹10,000/month SIP stopped during March 2020 crash: missed buying Nifty units at 7,500 levels.",
          "Missing 3 months of SIP during a bear market can cost 5–10% of 20-year final corpus.",
          "Rule: Never stop SIP unless you genuinely cannot afford the payment.",
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
          "Every rupee invested in Asset A is not invested in Asset B.",
          "Opportunity cost of holding cash at 3.5% (savings account) = giving up equity returns of potentially 12% CAGR.",
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
      "Understand what options and futures are — and why 91% of retail traders lose money in F&O.",
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
        heading: "SEBI Data: 91% of Retail Traders Lose Money",
        bullets: [
          "SEBI study FY2025: 91% of individual F&O traders lost money.",
          "Total losses by retail traders in F&O: ₹1.06 lakh crore in FY2025.",
          "F&O trader count declined from 1.05 crore to 75.42 lakh in FY2026 as awareness grew.",
          "Average retail trader loss per year: ₹1.1 lakh.",
          "The 9% who profit largely include high-frequency traders and institutions — not typical retail investors.",
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
      "How Indian investors can access US markets and international ETFs via LRS — and the currency advantage.",
    content: [
      {
        heading: "LRS (Liberalised Remittance Scheme)",
        bullets: [
          "Allows Indian residents to remit up to USD 250,000 per financial year for investments, education, travel.",
          "Can invest in: US stocks, international ETFs, bonds, overseas deposits.",
          "TCS: 20% Tax Collected at Source on remittances above ₹7 lakh (claimable as credit in ITR).",
        ],
      },
      {
        heading: "US Stocks & International ETFs from India",
        bullets: [
          "Can buy fractional shares of US companies (Apple, Microsoft, Amazon) via LRS-enabled platforms.",
          "International ETFs on Indian exchanges: Mirae Asset NYSE FANG+ ETF, Motilal Oswal Nasdaq 100, Kotak Nasdaq 100 FOF.",
          "No LRS required for internationally investing via Indian mutual fund FOFs/ETFs.",
        ],
      },
      {
        heading: "INR Depreciation as a Tailwind",
        bullets: [
          "INR has historically depreciated ~4–5% per year vs USD over the last 20 years.",
          "Example: S&P 500 returns ~10% in USD + ~4–5% INR depreciation = ~14–15% INR-equivalent return.",
          "Currency risk can also work against you if INR appreciates (rare historically).",
        ],
      },
      {
        heading: "Platforms for International Investing",
        bullets: [
          "Vested Finance, INDmoney (direct US stocks via LRS).",
          "Stockal, Winvesta (US stocks and ETFs via LRS).",
          "Zerodha, Groww, HDFC Securities (Indian international ETFs/FOFs — no LRS needed).",
          "SEBI has paused fresh international MF investing limits periodically — check current status before investing.",
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
          "P2P lending: Lend directly to borrowers via an RBI-licensed NBFC-P2P platform.",
          "Returns claimed: 10–14% p.a. Actual realised returns (after defaults): 8–11% for cautious investors.",
          "Platforms: Faircent, LenDenClub, Liquiloans.",
          "RBI has capped individual lender exposure: max ₹50 lakh total across all P2P platforms.",
          "Illiquid — cannot exit before loan tenure in most cases.",
        ],
      },
      {
        heading: "Invoice Discounting",
        bullets: [
          "Invest in short-term invoices of businesses waiting for payment from large corporates.",
          "Returns: 9–13% p.a. for 30–90 day tenures.",
          "Platforms: TradeCred, Jiraaf, Grip Invest.",
          "Risk: SME default if the invoice isn't honoured. Choose platforms with credit insurance.",
        ],
      },
      {
        heading: "Unlisted Shares & Pre-IPO Investing",
        bullets: [
          "Buy shares of companies before they list on the stock exchange.",
          "High return potential if company IPOs at higher valuation. High risk: no liquidity until IPO.",
          "Platforms: Unlisted Arena, Planify, Altius Investech.",
          "Use for max 2–5% of portfolio. Only for investors who can lock money for 3–5 years.",
        ],
      },
      {
        heading: "Angel Investing Basics",
        bullets: [
          "Invest in early-stage startups in exchange for equity.",
          "Minimum typical ticket: ₹5–25 lakh per startup.",
          "10:1 failure ratio: Expect most startups to fail; returns come from the 1–2 that succeed.",
          "Access via SEBI-registered angel networks: Indian Angel Network, AngelList India, LetsVenture.",
          "Only for high-net-worth investors with high risk tolerance and long-time horizons.",
        ],
      },
    ],
  },
  {
    id: 25,
    tier: 6,
    title: "Retirement Planning Deep Dive",
    description:
      "Calculate your real retirement corpus, apply the 4% rule to India, and choose between annuity and SWP.",
    content: [
      {
        heading: "Retirement Corpus Calculation (Inflation-Adjusted)",
        bullets: [
          "Step 1: Calculate current monthly expenses.",
          "Step 2: Project at retirement using inflation. At 6% for 25 years: ₹50,000/month today = ₹2.15 lakh/month at retirement.",
          "Step 3: Required corpus = Monthly expense at retirement × 12 ÷ safe withdrawal rate.",
          "Example: ₹2.15L × 12 ÷ 0.04 = ₹6.45 crore corpus required.",
        ],
      },
      {
        heading: "The 4% Rule (Indian Context)",
        bullets: [
          "4% rule (Bengen Rule): Withdraw 4% of corpus in year 1, then adjust for inflation annually. Corpus lasts 30 years.",
          "India context: With higher inflation (6% vs US 2–3%), consider 3–3.5% withdrawal rate for safety.",
          "A ₹5 crore corpus at 3.5% SWR = ₹17.5 lakh/year = ₹1.46 lakh/month (at today's equivalent).",
          "Invest corpus in: 50% equity (for growth) + 50% debt/gold (for stability and withdrawal).",
        ],
      },
      {
        heading: "Sequence of Returns Risk",
        bullets: [
          "If markets crash in the first 5 years of retirement, your corpus may not recover even if returns normalise later.",
          "Example: A 30% crash in year 1 + withdrawals = corpus permanently impaired.",
          "Counter: Keep 2–3 years of expenses in liquid/debt. Draw from this in bear markets. Let equity portion recover.",
          "This is why 100% equity portfolio at retirement is dangerous.",
        ],
      },
      {
        heading: "Annuity vs Systematic Withdrawal Plan (SWP)",
        bullets: [
          "Annuity: Buy from insurance company. Guaranteed income for life. Fully taxable. Rate: 5–7% p.a. currently.",
          "Annuity is irreversible — once bought, cannot get capital back. Inflation erodes fixed annuity payments.",
          "SWP: Redeem fixed amount monthly from your mutual fund corpus.",
          "SWP advantages: Capital remains invested, higher potential returns, flexible, tax-efficient (only gains taxed).",
          "Recommended: SWP from a balanced/hybrid fund for most retirees. Annuity only for 30–40% of corpus for longevity insurance.",
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
