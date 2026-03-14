import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, BarChart2, Briefcase, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Strategy = "growth" | "value" | "dividend" | "index";

interface Holding {
  ticker: string;
  name: string;
  sector: string;
  weight: number;
  rationale: string;
  dividendYield?: string;
}

const portfolios: Record<
  Strategy,
  {
    holdings: Holding[];
    metrics: {
      expectedReturn: string;
      volatility: string;
      sharpeRatio: string;
    };
    description: string;
    color: string;
    bgGradient: string;
  }
> = {
  growth: {
    description: "High-growth technology and innovation-focused companies",
    color: "from-primary to-accent",
    bgGradient: "from-primary/10 to-accent/10",
    holdings: [
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        sector: "Technology",
        weight: 15,
        rationale: "Ecosystem dominance & services growth",
      },
      {
        ticker: "MSFT",
        name: "Microsoft Corp.",
        sector: "Technology",
        weight: 15,
        rationale: "Cloud & AI leadership with Azure",
      },
      {
        ticker: "NVDA",
        name: "NVIDIA Corp.",
        sector: "Semiconductors",
        weight: 12,
        rationale: "AI infrastructure backbone",
      },
      {
        ticker: "GOOGL",
        name: "Alphabet Inc.",
        sector: "Technology",
        weight: 10,
        rationale: "Search monopoly + cloud growth",
      },
      {
        ticker: "AMZN",
        name: "Amazon.com",
        sector: "E-Commerce",
        weight: 10,
        rationale: "AWS cloud + retail dominance",
      },
      {
        ticker: "META",
        name: "Meta Platforms",
        sector: "Social Media",
        weight: 8,
        rationale: "Ad revenue recovery + Reels",
      },
      {
        ticker: "TSLA",
        name: "Tesla Inc.",
        sector: "EV / Energy",
        weight: 8,
        rationale: "EV market leader + energy storage",
      },
      {
        ticker: "AMD",
        name: "Advanced Micro Devices",
        sector: "Semiconductors",
        weight: 7,
        rationale: "CPU/GPU challenger to Intel/NVIDIA",
      },
      {
        ticker: "NFLX",
        name: "Netflix Inc.",
        sector: "Streaming",
        weight: 8,
        rationale: "Streaming profitability inflection",
      },
      {
        ticker: "ADBE",
        name: "Adobe Inc.",
        sector: "Software",
        weight: 7,
        rationale: "Creative cloud + AI tools moat",
      },
    ],
    metrics: {
      expectedReturn: "15–20%",
      volatility: "High",
      sharpeRatio: "1.2",
    },
  },
  value: {
    description: "Undervalued blue-chip companies with strong fundamentals",
    color: "from-chart-1 to-chart-2",
    bgGradient: "from-chart-1/10 to-chart-2/10",
    holdings: [
      {
        ticker: "BRK.B",
        name: "Berkshire Hathaway",
        sector: "Conglomerate",
        weight: 15,
        rationale: "Buffett-managed diversified value play",
      },
      {
        ticker: "JPM",
        name: "JPMorgan Chase",
        sector: "Banking",
        weight: 12,
        rationale: "Best-in-class US bank by ROE",
      },
      {
        ticker: "JNJ",
        name: "Johnson & Johnson",
        sector: "Healthcare",
        weight: 10,
        rationale: "Pharma + medtech diversification",
      },
      {
        ticker: "PG",
        name: "Procter & Gamble",
        sector: "Consumer Staples",
        weight: 10,
        rationale: "Recession-proof consumer brands",
      },
      {
        ticker: "KO",
        name: "Coca-Cola Co.",
        sector: "Beverages",
        weight: 10,
        rationale: "Global brand moat + pricing power",
      },
      {
        ticker: "WMT",
        name: "Walmart Inc.",
        sector: "Retail",
        weight: 10,
        rationale: "Low-cost retail dominance",
      },
      {
        ticker: "XOM",
        name: "Exxon Mobil",
        sector: "Energy",
        weight: 8,
        rationale: "Energy transition beneficiary",
      },
      {
        ticker: "CVX",
        name: "Chevron Corp.",
        sector: "Energy",
        weight: 8,
        rationale: "Strong cash flow + dividend",
      },
      {
        ticker: "T",
        name: "AT&T Inc.",
        sector: "Telecom",
        weight: 9,
        rationale: "Deep value + high yield",
      },
      {
        ticker: "VZ",
        name: "Verizon Comm.",
        sector: "Telecom",
        weight: 8,
        rationale: "5G infrastructure + stable cash",
      },
    ],
    metrics: {
      expectedReturn: "8–12%",
      volatility: "Low-Medium",
      sharpeRatio: "0.9",
    },
  },
  dividend: {
    description: "High-yield dividend payers for income-focused investors",
    color: "from-success to-chart-2",
    bgGradient: "from-success/10 to-chart-2/10",
    holdings: [
      {
        ticker: "T",
        name: "AT&T Inc.",
        sector: "Telecom",
        weight: 12,
        rationale: "7%+ dividend yield",
        dividendYield: "7.2%",
      },
      {
        ticker: "VZ",
        name: "Verizon Comm.",
        sector: "Telecom",
        weight: 10,
        rationale: "Stable telecom dividend",
        dividendYield: "6.8%",
      },
      {
        ticker: "KO",
        name: "Coca-Cola Co.",
        sector: "Beverages",
        weight: 10,
        rationale: "Dividend King 60+ years",
        dividendYield: "3.1%",
      },
      {
        ticker: "JNJ",
        name: "Johnson & Johnson",
        sector: "Healthcare",
        weight: 10,
        rationale: "Dividend Aristocrat",
        dividendYield: "3.0%",
      },
      {
        ticker: "PG",
        name: "Procter & Gamble",
        sector: "Consumer",
        weight: 10,
        rationale: "66-year dividend growth streak",
        dividendYield: "2.5%",
      },
      {
        ticker: "XOM",
        name: "Exxon Mobil",
        sector: "Energy",
        weight: 8,
        rationale: "Increased dividend 40+ years",
        dividendYield: "3.8%",
      },
      {
        ticker: "CVX",
        name: "Chevron Corp.",
        sector: "Energy",
        weight: 8,
        rationale: "Dividend Aristocrat",
        dividendYield: "4.1%",
      },
      {
        ticker: "MO",
        name: "Altria Group",
        sector: "Tobacco",
        weight: 8,
        rationale: "Highest S&P 500 yield",
        dividendYield: "8.9%",
      },
      {
        ticker: "PM",
        name: "Philip Morris",
        sector: "Tobacco",
        weight: 8,
        rationale: "International smoke-free pivot",
        dividendYield: "5.5%",
      },
      {
        ticker: "MMM",
        name: "3M Company",
        sector: "Industrial",
        weight: 8,
        rationale: "64-year dividend streak",
        dividendYield: "5.8%",
      },
    ],
    metrics: { expectedReturn: "6–9%", volatility: "Low", sharpeRatio: "0.8" },
  },
  index: {
    description: "Passive index fund strategy with broad market exposure",
    color: "from-warning to-chart-3",
    bgGradient: "from-warning/10 to-chart-3/10",
    holdings: [
      {
        ticker: "SPY",
        name: "SPDR S&P 500 ETF",
        sector: "US Large Cap",
        weight: 40,
        rationale: "Core US market exposure",
      },
      {
        ticker: "QQQ",
        name: "Invesco QQQ Trust",
        sector: "US Tech",
        weight: 20,
        rationale: "NASDAQ-100 tech tilt",
      },
      {
        ticker: "VTI",
        name: "Vanguard Total Market",
        sector: "US Total Market",
        weight: 15,
        rationale: "Broad US equity coverage",
      },
      {
        ticker: "IWM",
        name: "iShares Russell 2000",
        sector: "US Small Cap",
        weight: 10,
        rationale: "Small-cap diversification",
      },
      {
        ticker: "EFA",
        name: "iShares MSCI EAFE",
        sector: "International Dev.",
        weight: 10,
        rationale: "Developed market exposure",
      },
      {
        ticker: "VWO",
        name: "Vanguard FTSE EM",
        sector: "Emerging Markets",
        weight: 5,
        rationale: "EM growth potential",
      },
    ],
    metrics: {
      expectedReturn: "8–10%",
      volatility: "Medium",
      sharpeRatio: "1.0",
    },
  },
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#14b8a6",
  "#f97316",
  "#84cc16",
];

const strategyLabels: Record<Strategy, string> = {
  growth: "Growth",
  value: "Value",
  dividend: "Dividend",
  index: "Index",
};

export function ModelPortfolioTab() {
  const [strategy, setStrategy] = useState<Strategy>("growth");
  const port = portfolios[strategy];

  const chartData = port.holdings.map((h, i) => ({
    name: h.ticker,
    weight: h.weight,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <Card className="shadow-premium-lg border-border/50 bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            Model Portfolio
          </CardTitle>
          <CardDescription className="text-base">
            Recommended equity portfolios for different investment strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strategy selector */}
          <div className="flex flex-wrap gap-3">
            {(Object.keys(portfolios) as Strategy[]).map((key) => (
              <button
                type="button"
                key={key}
                data-ocid={`financialmodel.portfolio.${key}.tab`}
                onClick={() => setStrategy(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  strategy === key
                    ? `bg-gradient-to-r ${portfolios[key].color} text-white shadow-md`
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {strategyLabels[key]}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">{port.description}</p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className={`bg-gradient-to-br ${port.bgGradient}`}>
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-4 w-4" /> Expected Return
                </div>
                <div className="text-xl font-bold">
                  {port.metrics.expectedReturn}
                </div>
              </CardContent>
            </Card>
            <Card className={`bg-gradient-to-br ${port.bgGradient}`}>
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="h-4 w-4" /> Volatility
                </div>
                <div className="text-xl font-bold">
                  {port.metrics.volatility}
                </div>
              </CardContent>
            </Card>
            <Card className={`bg-gradient-to-br ${port.bgGradient}`}>
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BarChart2 className="h-4 w-4" /> Sharpe Ratio
                </div>
                <div className="text-xl font-bold">
                  {port.metrics.sharpeRatio}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart + Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Weight Distribution
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: -20, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v: number) => `${v}%`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="weight" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Holdings
              </h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table data-ocid="financialmodel.portfolio.table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs">Ticker</TableHead>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Sector</TableHead>
                      <TableHead className="text-xs text-right">Wt%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {port.holdings.map((h, i) => (
                      <TableRow
                        key={h.ticker}
                        data-ocid={`financialmodel.portfolio.item.${i + 1}`}
                        className="hover:bg-muted/30"
                      >
                        <TableCell
                          className="font-mono font-bold text-xs"
                          style={{ color: COLORS[i % COLORS.length] }}
                        >
                          {h.ticker}
                        </TableCell>
                        <TableCell className="text-xs">{h.name}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-xs">
                            {h.sector}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold">
                          {h.weight}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
