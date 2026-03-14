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
import { AlertTriangle, Bitcoin, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type CryptoProfile = "conservative" | "balanced" | "aggressive";

interface CryptoHolding {
  coin: string;
  symbol: string;
  allocation: number;
  category: string;
  rationale: string;
}

const portfolios: Record<
  CryptoProfile,
  {
    holdings: CryptoHolding[];
    volatility: string;
    returnRange: string;
    description: string;
    color: string;
    bgGradient: string;
  }
> = {
  conservative: {
    description: "Capital preservation with dominant blue-chip crypto assets",
    color: "from-success to-chart-2",
    bgGradient: "from-success/10 to-chart-2/10",
    volatility: "Medium (30-50% swings)",
    returnRange: "20-60% annually",
    holdings: [
      {
        coin: "Bitcoin",
        symbol: "BTC",
        allocation: 60,
        category: "Large Cap",
        rationale: "Digital gold, store of value",
      },
      {
        coin: "Ethereum",
        symbol: "ETH",
        allocation: 30,
        category: "Large Cap",
        rationale: "Smart contract platform leader",
      },
      {
        coin: "USD Coin",
        symbol: "USDC",
        allocation: 10,
        category: "Stablecoin",
        rationale: "Stable yield + dry powder",
      },
    ],
  },
  balanced: {
    description: "Mix of large-cap assets with selective alt-coin exposure",
    color: "from-primary to-accent",
    bgGradient: "from-primary/10 to-accent/10",
    volatility: "High (50-80% swings)",
    returnRange: "40-150% annually",
    holdings: [
      {
        coin: "Bitcoin",
        symbol: "BTC",
        allocation: 40,
        category: "Large Cap",
        rationale: "Digital gold foundation",
      },
      {
        coin: "Ethereum",
        symbol: "ETH",
        allocation: 25,
        category: "Large Cap",
        rationale: "DeFi & NFT ecosystem hub",
      },
      {
        coin: "BNB",
        symbol: "BNB",
        allocation: 10,
        category: "Large Cap",
        rationale: "Exchange token + BSC ecosystem",
      },
      {
        coin: "Solana",
        symbol: "SOL",
        allocation: 10,
        category: "Large Cap",
        rationale: "High-performance L1 chain",
      },
      {
        coin: "Polygon",
        symbol: "MATIC",
        allocation: 8,
        category: "Layer 2",
        rationale: "Ethereum scaling solution",
      },
      {
        coin: "Polkadot",
        symbol: "DOT",
        allocation: 7,
        category: "Mid Cap",
        rationale: "Cross-chain interoperability",
      },
    ],
  },
  aggressive: {
    description:
      "High-conviction growth bets across DeFi and Layer 1/2 ecosystems",
    color: "from-destructive to-warning",
    bgGradient: "from-destructive/10 to-warning/10",
    volatility: "Very High (80-200% swings)",
    returnRange: "100-500%+ annually",
    holdings: [
      {
        coin: "Bitcoin",
        symbol: "BTC",
        allocation: 25,
        category: "Large Cap",
        rationale: "Portfolio anchor",
      },
      {
        coin: "Ethereum",
        symbol: "ETH",
        allocation: 20,
        category: "Large Cap",
        rationale: "Base layer exposure",
      },
      {
        coin: "Solana",
        symbol: "SOL",
        allocation: 15,
        category: "Large Cap",
        rationale: "High-growth L1 challenger",
      },
      {
        coin: "Avalanche",
        symbol: "AVAX",
        allocation: 10,
        category: "Layer 1",
        rationale: "Fast finality + subnets",
      },
      {
        coin: "Polygon",
        symbol: "MATIC",
        allocation: 8,
        category: "Layer 2",
        rationale: "Ethereum scaling leader",
      },
      {
        coin: "Polkadot",
        symbol: "DOT",
        allocation: 7,
        category: "Mid Cap",
        rationale: "Parachain ecosystem",
      },
      {
        coin: "Chainlink",
        symbol: "LINK",
        allocation: 8,
        category: "DeFi / Oracle",
        rationale: "Oracle market monopoly",
      },
      {
        coin: "Uniswap",
        symbol: "UNI",
        allocation: 7,
        category: "DeFi",
        rationale: "Dominant DEX by volume",
      },
    ],
  },
};

const COLORS = [
  "#f59e0b",
  "#6366f1",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

const categoryColors: Record<string, string> = {
  "Large Cap": "bg-primary/10 text-primary",
  Stablecoin: "bg-success/10 text-success",
  "Layer 2": "bg-accent/10 text-accent-foreground",
  "Mid Cap": "bg-chart-3/10 text-chart-3",
  "Layer 1": "bg-chart-1/10 text-chart-1",
  "DeFi / Oracle": "bg-warning/10 text-warning",
  DeFi: "bg-chart-4/10 text-chart-4",
};

export function ModelCryptoPortfolioTab() {
  const [profile, setProfile] = useState<CryptoProfile>("balanced");
  const port = portfolios[profile];

  const pieData = port.holdings.map((h, i) => ({
    name: h.symbol,
    value: h.allocation,
    fill: COLORS[i % COLORS.length],
  }));

  // Market cap tier breakdown
  const tierMap: Record<string, number> = {};
  for (const h of port.holdings) {
    tierMap[h.category] = (tierMap[h.category] ?? 0) + h.allocation;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-premium-lg border-border/50 bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-chart-3/20">
              <Bitcoin className="h-6 w-6 text-warning" />
            </div>
            Model Crypto Portfolio
          </CardTitle>
          <CardDescription className="text-base">
            Risk-adjusted cryptocurrency allocation models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk selector */}
          <div className="flex flex-wrap gap-3">
            {(
              ["conservative", "balanced", "aggressive"] as CryptoProfile[]
            ).map((key) => (
              <button
                type="button"
                key={key}
                data-ocid={`financialmodel.crypto.${key}.tab`}
                onClick={() => setProfile(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  profile === key
                    ? `bg-gradient-to-r ${portfolios[key].color} text-white shadow-md`
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">{port.description}</p>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <Card className={`bg-gradient-to-br ${port.bgGradient}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" /> Potential Return
                </div>
                <div className="text-lg font-bold">{port.returnRange}</div>
              </CardContent>
            </Card>
            <Card className={`bg-gradient-to-br ${port.bgGradient}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <AlertTriangle className="h-4 w-4" /> Expected Volatility
                </div>
                <div className="text-lg font-bold">{port.volatility}</div>
              </CardContent>
            </Card>
          </div>

          {/* Pie + Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-muted/30 to-transparent">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Portfolio Allocation
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      name,
                      percent,
                    }: { name: string; percent: number }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius="65%"
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.fill}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `${v}%`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Holdings
              </h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table data-ocid="financialmodel.crypto.table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs">Coin</TableHead>
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs text-right">
                        Alloc%
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {port.holdings.map((h, i) => (
                      <TableRow
                        key={h.symbol}
                        data-ocid={`financialmodel.crypto.item.${i + 1}`}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="text-xs">
                          <div
                            className="font-bold"
                            style={{ color: COLORS[i % COLORS.length] }}
                          >
                            {h.symbol}
                          </div>
                          <div className="text-muted-foreground">{h.coin}</div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge
                            className={`text-xs ${categoryColors[h.category] ?? ""}`}
                            variant="outline"
                          >
                            {h.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs font-bold">
                          {h.allocation}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Tier breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Category Breakdown
                </h4>
                {Object.entries(tierMap).map(([cat, pct]) => (
                  <div key={cat} className="space-y-0.5">
                    <div className="flex justify-between text-xs">
                      <span>{cat}</span>
                      <span className="font-semibold">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warning/70 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-destructive">Risk Disclaimer:</strong>{" "}
                  Cryptocurrency investments are highly volatile and
                  speculative. Past performance does not guarantee future
                  results. You may lose all invested capital. These model
                  portfolios are for educational purposes only and do not
                  constitute financial advice. Always consult a qualified
                  financial advisor before investing in cryptocurrencies.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
