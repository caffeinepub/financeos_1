import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCurrency } from "../../contexts/CurrencyContext";

const RiskProfile = {
  conservative: "conservative",
  moderate: "moderate",
  high: "high",
} as const;
type RiskProfile = (typeof RiskProfile)[keyof typeof RiskProfile];

type AssetAllocation = {
  name: string;
  allocation: number;
};

export function ModelPortfolioTab() {
  const { formatCurrency, country } = useCurrency();
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(
    RiskProfile.moderate,
  );
  const [portfolioType, setPortfolioType] = useState<
    "mutualFunds" | "etf" | "both"
  >("both");
  const [initialCapital, setInitialCapital] = useState<string>("100000");
  const [investmentType, setInvestmentType] = useState<
    "sip" | "lumpsum" | null
  >(null);
  const [sipAmount, setSipAmount] = useState<string>("5000");
  const [allocations, setAllocations] = useState<AssetAllocation[]>([]);
  const [forecastData, setForecastData] = useState<
    Array<{ year: number; value: number }>
  >([]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF6B9D",
  ];

  // biome-ignore lint/correctness/useExhaustiveDependencies: functions are stable
  useEffect(() => {
    generateModelPortfolio();
  }, [riskProfile, portfolioType, initialCapital]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: functions are stable
  useEffect(() => {
    if (investmentType && allocations.length > 0) {
      generateForecast();
    }
  }, [investmentType, sipAmount, initialCapital, riskProfile, allocations]);

  const generateModelPortfolio = () => {
    const assets: AssetAllocation[] = [];

    if (portfolioType === "mutualFunds" || portfolioType === "both") {
      if (riskProfile === RiskProfile.conservative) {
        assets.push(
          { name: "Balanced Advantage Fund", allocation: 25 },
          { name: "Debt Fund", allocation: 30 },
          { name: "Multi-Asset Fund", allocation: 25 },
          { name: "Liquid Fund", allocation: 20 },
        );
      } else if (riskProfile === RiskProfile.moderate) {
        assets.push(
          { name: "Large Cap Fund", allocation: 30 },
          { name: "Flexi Cap Fund", allocation: 25 },
          { name: "Multi-Cap Fund", allocation: 25 },
          { name: "Mid Cap Fund", allocation: 20 },
        );
      } else {
        assets.push(
          { name: "Flexi Cap Fund", allocation: 30 },
          { name: "Small Cap Fund", allocation: 25 },
          { name: "Mid Cap Fund", allocation: 25 },
          { name: "Multi-Cap Fund", allocation: 20 },
        );
      }
    }

    if (portfolioType === "etf" || portfolioType === "both") {
      if (riskProfile === RiskProfile.conservative) {
        assets.push(
          { name: "Large Cap Index ETF", allocation: 40 },
          { name: "Nifty 50 ETF", allocation: 35 },
          { name: "Banking Sector ETF", allocation: 25 },
        );
      } else if (riskProfile === RiskProfile.moderate) {
        assets.push(
          { name: "Nifty 50 ETF", allocation: 35 },
          { name: "Large Cap ETF", allocation: 30 },
          { name: "Midcap 100 ETF", allocation: 35 },
        );
      } else {
        assets.push(
          { name: "Nifty Next 50 ETF", allocation: 35 },
          { name: "International Index ETF", allocation: 35 },
          { name: "Smallcap ETF", allocation: 30 },
        );
      }
    }

    const totalAllocation = assets.reduce(
      (sum, asset) => sum + asset.allocation,
      0,
    );
    const normalizedAssets = assets.map((asset) => ({
      ...asset,
      allocation: (asset.allocation / totalAllocation) * 100,
    }));

    setAllocations(normalizedAssets);
  };

  const generateForecast = () => {
    const capital = Number.parseFloat(initialCapital) || 0;
    const sip = Number.parseFloat(sipAmount) || 0;
    const expectedReturn =
      riskProfile === RiskProfile.conservative
        ? 0.08
        : riskProfile === RiskProfile.moderate
          ? 0.12
          : 0.15;

    const data: Array<{ year: number; value: number }> = [];

    if (investmentType === "lumpsum") {
      for (let year = 0; year <= 25; year++) {
        const value = capital * (1 + expectedReturn) ** year;
        data.push({ year, value });
      }
    } else if (investmentType === "sip") {
      for (let year = 0; year <= 25; year++) {
        const lumpsumValue = capital * (1 + expectedReturn) ** year;
        const sipValue =
          sip * 12 * (((1 + expectedReturn) ** year - 1) / expectedReturn);
        data.push({ year, value: lumpsumValue + sipValue });
      }
    }

    setForecastData(data);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm border border-slate-100 bg-white">
        <CardHeader
          style={{ borderLeft: "3px solid #2563eb", paddingLeft: "1.25rem" }}
        >
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Portfolio Configuration
          </CardTitle>
          <CardDescription>
            Configure your investment preferences - portfolio updates
            automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Investor Risk Profile</Label>
              <Select
                value={riskProfile}
                onValueChange={(value) => setRiskProfile(value as RiskProfile)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RiskProfile.conservative}>
                    Conservative
                  </SelectItem>
                  <SelectItem value={RiskProfile.moderate}>Moderate</SelectItem>
                  <SelectItem value={RiskProfile.high}>Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Portfolio Type</Label>
              <Select
                value={portfolioType}
                onValueChange={(value) =>
                  setPortfolioType(value as "mutualFunds" | "etf" | "both")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mutualFunds">Mutual Funds</SelectItem>
                  <SelectItem value="etf">ETF</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Base Initial Capital ({country.symbol})</Label>
              <Input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                placeholder="100000"
              />
            </div>
          </div>

          {allocations.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Asset Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={allocations}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, allocation }) =>
                            `${name.split(" ")[0]}: ${allocation.toFixed(1)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="allocation"
                        >
                          {allocations.map((item, index) => (
                            <Cell
                              key={item.name}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => `${value.toFixed(2)}%`}
                        />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Portfolio Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {allocations.map((asset, index) => (
                        <div
                          key={asset.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="text-sm font-medium">
                              {asset.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {asset.allocation.toFixed(2)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(
                                ((Number.parseFloat(initialCapital) || 0) *
                                  asset.allocation) /
                                  100,
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">
                    Investment Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setInvestmentType("sip")}
                      className={`h-auto py-4 rounded-lg border-2 transition-all ${
                        investmentType === "sip"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-center">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-semibold">SIP Investment</p>
                        <p className="text-xs text-muted-foreground">
                          Systematic Investment Plan
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvestmentType("lumpsum")}
                      className={`h-auto py-4 rounded-lg border-2 transition-all ${
                        investmentType === "lumpsum"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-center">
                        <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                        <p className="font-semibold">Lumpsum Investment</p>
                        <p className="text-xs text-muted-foreground">
                          One-time Investment
                        </p>
                      </div>
                    </button>
                  </div>
                  {investmentType === "sip" && (
                    <div className="space-y-2">
                      <Label>Monthly SIP Amount ({country.symbol})</Label>
                      <Input
                        type="number"
                        value={sipAmount}
                        onChange={(e) => setSipAmount(e.target.value)}
                        placeholder="5000"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {forecastData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      25-Year Portfolio Forecast
                    </CardTitle>
                    <CardDescription>
                      Projected portfolio value over 25 years (
                      {investmentType === "sip" ? "SIP" : "Lumpsum"} investment)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          label={{
                            value: "Years",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card className="bg-blue-500/5 border-blue-500/20">
                        <CardContent className="pt-6">
                          <div className="text-center space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Initial Investment
                            </p>
                            <p className="text-xl font-bold text-blue-600">
                              {formatCurrency(
                                Number.parseFloat(initialCapital) || 0,
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-500/5 border-green-500/20">
                        <CardContent className="pt-6">
                          <div className="text-center space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Projected Value (25Y)
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              {formatCurrency(
                                forecastData[forecastData.length - 1]?.value ||
                                  0,
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                          <div className="text-center space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Expected Returns
                            </p>
                            <p className="text-xl font-bold text-primary">
                              {riskProfile === RiskProfile.conservative
                                ? "8%"
                                : riskProfile === RiskProfile.moderate
                                  ? "12%"
                                  : "15%"}{" "}
                              p.a.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
