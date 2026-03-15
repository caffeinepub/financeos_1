import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bitcoin,
  BookOpen,
  Briefcase,
  GraduationCap,
  PieChart,
  PiggyBank,
  Shield,
} from "lucide-react";
import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ModelCryptoPortfolioTab } from "./ModelCryptoPortfolioTab";
import { ModelFundamentalsTab } from "./ModelFundamentalsTab";
import { ModelInsuranceTab } from "./ModelInsuranceTab";
import { ModelPortfolioTab } from "./ModelPortfolioTab";
import { ModelRetirementTab } from "./ModelRetirementTab";

function FinancialModelingTab() {
  const [activeSubTab, setActiveSubTab] = useState("assetallocation");

  return (
    <div className="space-y-6">
      <Tabs
        value={activeSubTab}
        onValueChange={setActiveSubTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-5xl grid-cols-6 h-auto gap-1 p-1 bg-gradient-to-r from-primary/10 to-accent/10">
          <TabsTrigger
            value="assetallocation"
            data-ocid="financialmodel.assetallocation.tab"
            className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:shadow-md"
          >
            <PieChart className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">Asset Allocation</span>
            <span className="sm:hidden">Alloc</span>
          </TabsTrigger>
          <TabsTrigger
            value="modelportfolio"
            data-ocid="financialmodel.modelportfolio.tab"
            className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-chart-1 data-[state=active]:to-chart-2 data-[state=active]:text-white transition-all duration-300 hover:shadow-md"
          >
            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">Model Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </TabsTrigger>
          <TabsTrigger
            value="modelretirement"
            data-ocid="financialmodel.modelretirement.tab"
            className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-success data-[state=active]:to-chart-2 data-[state=active]:text-white transition-all duration-300 hover:shadow-md"
          >
            <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">Retirement</span>
            <span className="sm:hidden">Retire</span>
          </TabsTrigger>
          <TabsTrigger
            value="modelinsurance"
            data-ocid="financialmodel.modelinsurance.tab"
            className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-info data-[state=active]:to-chart-4 data-[state=active]:text-white transition-all duration-300 hover:shadow-md"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">Insurance</span>
            <span className="sm:hidden">Insure</span>
          </TabsTrigger>
          <TabsTrigger
            value="modelcrypto"
            data-ocid="financialmodel.modelcrypto.tab"
            className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-warning data-[state=active]:to-chart-3 data-[state=active]:text-white transition-all duration-300 hover:shadow-md"
          >
            <Bitcoin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">Crypto</span>
            <span className="sm:hidden">Crypto</span>
          </TabsTrigger>
          <TabsTrigger
            value="fundamentals"
            data-ocid="financialmodel.fundamentals.tab"
            className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 hover:shadow-md"
          >
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">Fundamentals</span>
            <span className="sm:hidden">Learn</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assetallocation" className="space-y-6">
          <AssetAllocationTab />
        </TabsContent>
        <TabsContent value="modelportfolio" className="space-y-6">
          <ModelPortfolioTab />
        </TabsContent>
        <TabsContent value="modelretirement" className="space-y-6">
          <ModelRetirementTab />
        </TabsContent>
        <TabsContent value="modelinsurance" className="space-y-6">
          <ModelInsuranceTab />
        </TabsContent>
        <TabsContent value="modelcrypto" className="space-y-6">
          <ModelCryptoPortfolioTab />
        </TabsContent>
        <TabsContent value="fundamentals" className="space-y-6">
          <ModelFundamentalsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AssetAllocationTab() {
  const [selectedProfile, setSelectedProfile] = useState<
    "conservative" | "moderate" | "aggressive"
  >("moderate");

  const riskProfiles = {
    conservative: {
      name: "Conservative",
      description: "Low risk, stable returns with capital preservation focus",
      allocation: {
        Equity: 20,
        "Mutual Fund": 15,
        Gold: 15,
        Silver: 5,
        Crypto: 0,
        Bond: 30,
        "Debt Fund": 10,
        FD: 5,
      },
      color: "from-success to-chart-2",
      bgGradient: "from-success/10 to-chart-2/10",
      borderColor: "border-success/50",
    },
    moderate: {
      name: "Moderate",
      description: "Balanced risk-return with diversified portfolio",
      allocation: {
        Equity: 35,
        "Mutual Fund": 25,
        Gold: 10,
        Silver: 5,
        Crypto: 5,
        Bond: 10,
        "Debt Fund": 5,
        FD: 5,
      },
      color: "from-primary to-accent",
      bgGradient: "from-primary/10 to-accent/10",
      borderColor: "border-primary/50",
    },
    aggressive: {
      name: "Aggressive",
      description: "High risk, high return with growth-oriented investments",
      allocation: {
        Equity: 45,
        "Mutual Fund": 30,
        Gold: 5,
        Silver: 3,
        Crypto: 10,
        Bond: 3,
        "Debt Fund": 2,
        FD: 2,
      },
      color: "from-destructive to-warning",
      bgGradient: "from-destructive/10 to-warning/10",
      borderColor: "border-destructive/50",
    },
  };

  const profile = riskProfiles[selectedProfile];
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#14b8a6",
  ];

  const pieChartData = Object.entries(profile.allocation).map(
    ([name, value], idx) => ({
      name,
      value,
      fill: colors[idx % colors.length],
    }),
  );

  // Historical returns by asset class
  const historicalReturns = [
    {
      asset: "Nifty 50",
      "10yr": "14%",
      "20yr": "15%",
      "30yr": "16%",
      inflation_adj: "9%",
    },
    {
      asset: "Gold",
      "10yr": "10%",
      "20yr": "11%",
      "30yr": "10%",
      inflation_adj: "5%",
    },
    {
      asset: "Debt/Bonds",
      "10yr": "8%",
      "20yr": "8%",
      "30yr": "9%",
      inflation_adj: "2%",
    },
    {
      asset: "Real Estate",
      "10yr": "7%",
      "20yr": "9%",
      "30yr": "10%",
      inflation_adj: "3%",
    },
    {
      asset: "Fixed Deposit",
      "10yr": "7%",
      "20yr": "7%",
      "30yr": "8%",
      inflation_adj: "1%",
    },
    {
      asset: "Crypto (BTC)",
      "10yr": "60%+",
      "20yr": "N/A",
      "30yr": "N/A",
      inflation_adj: "High",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-premium-lg border-border/50 bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
            Asset Allocation Models
          </CardTitle>
          <CardDescription className="text-base">
            Industry-standard asset allocation strategies based on Modern
            Portfolio Theory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* MPT Education Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-sm">
                  Modern Portfolio Theory (MPT) — Harry Markowitz, 1952
                </div>
                <div className="text-xs text-muted-foreground">
                  Combining assets with low or negative correlation reduces
                  overall portfolio risk without sacrificing returns. This is
                  the mathematical foundation for diversification. The optimal
                  portfolio maximises return for a given level of risk (the
                  "Efficient Frontier").
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              Object.keys(riskProfiles) as Array<keyof typeof riskProfiles>
            ).map((key) => {
              const rp = riskProfiles[key];
              return (
                <Card
                  key={key}
                  data-ocid={`financialmodel.assetallocation.${key}.card`}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-premium-lg ${
                    selectedProfile === key
                      ? `ring-2 ring-primary shadow-premium-xl bg-gradient-to-br ${rp.bgGradient} ${rp.borderColor}`
                      : "hover:shadow-premium bg-gradient-to-br from-card to-muted/10"
                  }`}
                  onClick={() => setSelectedProfile(key)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className={`text-lg bg-gradient-to-r ${rp.color} bg-clip-text text-transparent font-bold`}
                    >
                      {rp.name}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {rp.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div
                  className={`h-1 w-8 rounded-full bg-gradient-to-r ${profile.color}`}
                />
                Allocation Breakdown
              </h3>
              <div className="space-y-2">
                {Object.entries(profile.allocation).map(
                  ([asset, percentage], idx) => (
                    <div
                      key={asset}
                      className="space-y-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{asset}</span>
                        <span className="text-muted-foreground font-semibold">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full transition-all duration-700 ease-out shadow-sm"
                          style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${colors[idx % colors.length]}, ${colors[(idx + 1) % colors.length]})`,
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-muted/30 to-transparent">
              <h3 className="text-lg font-semibold mb-4">
                Asset Allocation Pie Chart
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                      name,
                      percent,
                    }: { name: string; percent: number }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius="70%"
                    dataKey="value"
                  >
                    {pieChartData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.fill}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Card
            className={`shadow-md bg-gradient-to-br ${profile.bgGradient} ${profile.borderColor} border-2`}
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div
                  className={`h-1 w-6 rounded-full bg-gradient-to-r ${profile.color}`}
                />
                Recommendations for {profile.name} Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {selectedProfile === "conservative" && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">•</span>
                      <span>
                        Focus on capital preservation with high allocation to
                        bonds and FD
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">•</span>
                      <span>
                        Minimal exposure to volatile assets like crypto
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">•</span>
                      <span>
                        Suitable for investors nearing retirement or with low
                        risk tolerance
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success font-bold">•</span>
                      <span className="font-semibold">
                        Expected annual return: 6–8%
                      </span>
                    </li>
                  </>
                )}
                {selectedProfile === "moderate" && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        Balanced approach with diversification across asset
                        classes
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        Moderate exposure to equities and mutual funds for
                        growth
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        Suitable for investors with medium-term goals (5–10
                        years)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span className="font-semibold">
                        Expected annual return: 10–12%
                      </span>
                    </li>
                  </>
                )}
                {selectedProfile === "aggressive" && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>
                        Growth-oriented with high equity and mutual fund
                        allocation
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>
                        Higher exposure to volatile assets including crypto
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span>
                        Suitable for young investors with long-term horizon (10+
                        years)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">•</span>
                      <span className="font-semibold">
                        Expected annual return: 14–18%
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Historical Returns Table */}
          <Card className="bg-gradient-to-br from-muted/20 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Historical Asset Class Returns (India)
              </CardTitle>
              <CardDescription className="text-xs">
                Approximate annualised returns; actual results vary. Inflation
                ~6% avg.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-2 text-xs font-semibold">
                        Asset
                      </th>
                      <th className="text-right p-2 text-xs font-semibold">
                        10yr CAGR
                      </th>
                      <th className="text-right p-2 text-xs font-semibold">
                        20yr CAGR
                      </th>
                      <th className="text-right p-2 text-xs font-semibold">
                        30yr CAGR
                      </th>
                      <th className="text-right p-2 text-xs font-semibold">
                        Real Return
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalReturns.map((r) => (
                      <tr
                        key={r.asset}
                        className="border-t border-border hover:bg-muted/30"
                      >
                        <td className="p-2 text-xs font-medium">{r.asset}</td>
                        <td className="p-2 text-xs text-right">{r["10yr"]}</td>
                        <td className="p-2 text-xs text-right">{r["20yr"]}</td>
                        <td className="p-2 text-xs text-right">{r["30yr"]}</td>
                        <td className="p-2 text-xs text-right text-green-600 font-semibold">
                          {r.inflation_adj}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export { FinancialModelingTab };
export default FinancialModelingTab;
