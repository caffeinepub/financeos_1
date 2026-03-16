import { Badge } from "@/components/ui/badge";
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
  TrendingUp,
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

const TABS = [
  {
    id: "assetallocation",
    label: "Asset Allocation",
    shortLabel: "Allocation",
    icon: PieChart,
    level: "Beginner",
    levelColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    activeGradient: "from-blue-500 to-indigo-600",
    activeBg:
      "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg",
    borderColor: "border-t-blue-500",
  },
  {
    id: "modelportfolio",
    label: "Model Portfolio",
    shortLabel: "Portfolio",
    icon: Briefcase,
    level: "Intermediate",
    levelColor:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    activeGradient: "from-green-500 to-emerald-600",
    activeBg:
      "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg",
    borderColor: "border-t-green-500",
  },
  {
    id: "modelretirement",
    label: "Retirement",
    shortLabel: "Retire",
    icon: PiggyBank,
    level: "Intermediate",
    levelColor:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    activeGradient: "from-emerald-500 to-teal-600",
    activeBg:
      "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg",
    borderColor: "border-t-emerald-500",
  },
  {
    id: "modelinsurance",
    label: "Insurance",
    shortLabel: "Insurance",
    icon: Shield,
    level: "Beginner",
    levelColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    activeGradient: "from-sky-500 to-cyan-600",
    activeBg: "bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-lg",
    borderColor: "border-t-sky-500",
  },
  {
    id: "modelcrypto",
    label: "Crypto",
    shortLabel: "Crypto",
    icon: Bitcoin,
    level: "Advanced",
    levelColor:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    activeGradient: "from-orange-500 to-amber-600",
    activeBg:
      "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg",
    borderColor: "border-t-orange-500",
  },
  {
    id: "fundamentals",
    label: "Fundamentals",
    shortLabel: "Learn",
    icon: GraduationCap,
    level: "All Levels",
    levelColor:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    activeGradient: "from-violet-500 to-purple-600",
    activeBg:
      "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg",
    borderColor: "border-t-violet-500",
  },
];

const PROGRESSION_STEPS = [
  {
    label: "Beginner",
    desc: "Basics & protection",
    color: "bg-blue-500",
    textColor: "text-blue-600",
    tabs: ["Asset Allocation", "Insurance"],
  },
  {
    label: "Intermediate",
    desc: "Building wealth",
    color: "bg-green-500",
    textColor: "text-green-600",
    tabs: ["Model Portfolio", "Retirement"],
  },
  {
    label: "Advanced",
    desc: "High-risk assets",
    color: "bg-orange-500",
    textColor: "text-orange-600",
    tabs: ["Crypto"],
  },
  {
    label: "Expert",
    desc: "Core concepts",
    color: "bg-violet-500",
    textColor: "text-violet-600",
    tabs: ["Fundamentals"],
  },
];

function SkillProgressionBanner({ activeTab }: { activeTab: string }) {
  const activeTabInfo = TABS.find((t) => t.id === activeTab);
  const levelMap: Record<string, number> = {
    Beginner: 0,
    Intermediate: 1,
    Advanced: 2,
    "All Levels": 3,
  };
  const activeLevel = levelMap[activeTabInfo?.level ?? "Beginner"] ?? 0;

  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-950/20 p-4 mb-2">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-semibold text-foreground">
          Learning Path — Beginner to Expert
        </span>
        {activeTabInfo && (
          <Badge className={`ml-auto text-xs ${activeTabInfo.levelColor}`}>
            {activeTabInfo.level}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-0">
        {PROGRESSION_STEPS.map((step, idx) => (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300 ${
                  idx <= activeLevel
                    ? `${step.color} ring-2 ring-offset-2 ring-offset-background ${step.color}/50 scale-110`
                    : "bg-muted-foreground/20"
                }`}
              >
                {idx + 1}
              </div>
              <div className="text-center">
                <div
                  className={`text-xs font-semibold transition-colors ${
                    idx <= activeLevel
                      ? step.textColor
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[10px] text-muted-foreground hidden sm:block">
                  {step.desc}
                </div>
              </div>
            </div>
            {idx < PROGRESSION_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 rounded-full transition-all duration-300 ${
                  idx < activeLevel
                    ? "bg-gradient-to-r from-blue-400 to-green-400"
                    : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FinancialModelingTab() {
  const [activeSubTab, setActiveSubTab] = useState("assetallocation");

  return (
    <div className="space-y-4">
      {/* Skill Progression Banner */}
      <SkillProgressionBanner activeTab={activeSubTab} />

      <Tabs
        value={activeSubTab}
        onValueChange={setActiveSubTab}
        className="space-y-6"
      >
        {/* Scrollable Tab Bar */}
        <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
          <TabsList className="flex w-max min-w-full gap-1.5 p-1.5 h-auto bg-muted/60 rounded-xl">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  data-ocid={`financialmodel.${tab.id}.tab`}
                  className={`
                    relative flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-300 whitespace-nowrap
                    data-[state=inactive]:hover:bg-background/80 data-[state=inactive]:text-muted-foreground
                    data-[state=active]:shadow-md
                    ${isActive ? tab.activeBg : ""}
                  `}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 hidden md:inline-flex ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : tab.levelColor
                    }`}
                  >
                    {tab.level}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

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
      color: "from-green-500 to-emerald-600",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      topBorder: "border-t-green-500",
      badge:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      bullet: "text-green-600",
      returnRange: "6–8% p.a.",
      riskLabel: "Low Risk",
      riskBadge: "bg-green-100 text-green-700 border-green-200",
      icon: "🛡️",
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
      color: "from-blue-500 to-indigo-600",
      bgGradient:
        "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      topBorder: "border-t-blue-500",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      bullet: "text-blue-600",
      returnRange: "10–12% p.a.",
      riskLabel: "Medium Risk",
      riskBadge: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "⚖️",
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
      color: "from-orange-500 to-red-600",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      topBorder: "border-t-orange-500",
      badge:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      bullet: "text-orange-600",
      returnRange: "14–18% p.a.",
      riskLabel: "High Risk",
      riskBadge: "bg-orange-100 text-orange-700 border-orange-200",
      icon: "🚀",
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
      {/* Header Card */}
      <Card className="border-t-4 border-t-blue-500 shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                  <PieChart className="h-5 w-5 text-blue-600" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Asset Allocation Models
                </span>
              </CardTitle>
              <CardDescription className="mt-1">
                Industry-standard strategies based on Modern Portfolio Theory
              </CardDescription>
            </div>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
              Beginner Friendly
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* MPT Education Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-800/40">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                  Modern Portfolio Theory (MPT) — Harry Markowitz, 1952
                </div>
                <div className="text-xs text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                  Combining assets with low or negative correlation reduces
                  overall portfolio risk without sacrificing returns. The
                  optimal portfolio maximises return for a given level of risk —
                  the "Efficient Frontier".
                </div>
              </div>
            </div>
          </div>

          {/* Risk Profile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(
              Object.keys(riskProfiles) as Array<keyof typeof riskProfiles>
            ).map((key) => {
              const rp = riskProfiles[key];
              const isSelected = selectedProfile === key;
              return (
                <Card
                  key={key}
                  data-ocid={`financialmodel.assetallocation.${key}.card`}
                  className={`cursor-pointer transition-all duration-300 border-t-4 ${
                    rp.topBorder
                  } hover:shadow-md ${
                    isSelected
                      ? `ring-2 ring-offset-2 ring-offset-background shadow-lg bg-gradient-to-br ${rp.bgGradient} ${rp.borderColor}`
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedProfile(key)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{rp.icon}</span>
                      <div className="flex gap-1.5">
                        <Badge className={`text-xs ${rp.riskBadge}`}>
                          {rp.riskLabel}
                        </Badge>
                        {isSelected && (
                          <Badge className="text-xs bg-foreground text-background">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle
                      className={`text-base bg-gradient-to-r ${rp.color} bg-clip-text text-transparent font-bold`}
                    >
                      {rp.name}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {rp.description}
                    </CardDescription>
                    <div className="text-xs font-semibold mt-2 opacity-80">
                      Expected Return: {rp.returnRange}
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Allocation Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <div
                  className={`h-1 w-6 rounded-full bg-gradient-to-r ${profile.color}`}
                />
                Allocation Breakdown — {profile.name}
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

            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-muted/30 to-transparent border border-border/40">
              <h3 className="text-base font-semibold mb-4">
                Portfolio Pie Chart
              </h3>
              <ResponsiveContainer width="100%" height={280}>
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

          {/* Recommendations */}
          <Card
            className={`border-t-4 ${profile.topBorder} bg-gradient-to-br ${profile.bgGradient} ${profile.borderColor} border`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span>{profile.icon}</span>
                <span
                  className={`bg-gradient-to-r ${profile.color} bg-clip-text text-transparent`}
                >
                  Recommendations for {profile.name} Profile
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {selectedProfile === "conservative" && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Focus on capital preservation with high allocation to
                        bonds and FD
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Minimal exposure to volatile assets like crypto
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Suitable for investors nearing retirement or with low
                        risk tolerance
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span className="font-semibold">
                        Expected annual return: 6–8%
                      </span>
                    </li>
                  </>
                )}
                {selectedProfile === "moderate" && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Balanced approach with diversification across asset
                        classes
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Moderate exposure to equities and mutual funds for
                        growth
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Suitable for investors with medium-term goals (5–10
                        years)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span className="font-semibold">
                        Expected annual return: 10–12%
                      </span>
                    </li>
                  </>
                )}
                {selectedProfile === "aggressive" && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Growth-oriented with high equity and mutual fund
                        allocation
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Higher exposure to volatile assets including crypto
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
                      <span>
                        Suitable for young investors with long-term horizon (10+
                        years)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`${profile.bullet} font-bold`}>•</span>
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
          <Card className="border-t-4 border-t-slate-400">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base">
                  Historical Asset Class Returns (India)
                </CardTitle>
                <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs">
                  Reference Data
                </Badge>
              </div>
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
                      <th className="text-left p-2.5 text-xs font-semibold">
                        Asset
                      </th>
                      <th className="text-right p-2.5 text-xs font-semibold">
                        10yr CAGR
                      </th>
                      <th className="text-right p-2.5 text-xs font-semibold">
                        20yr CAGR
                      </th>
                      <th className="text-right p-2.5 text-xs font-semibold">
                        30yr CAGR
                      </th>
                      <th className="text-right p-2.5 text-xs font-semibold">
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
                        <td className="p-2.5 text-xs font-medium">{r.asset}</td>
                        <td className="p-2.5 text-xs text-right">
                          {r["10yr"]}
                        </td>
                        <td className="p-2.5 text-xs text-right">
                          {r["20yr"]}
                        </td>
                        <td className="p-2.5 text-xs text-right">
                          {r["30yr"]}
                        </td>
                        <td className="p-2.5 text-xs text-right text-green-600 font-semibold">
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
