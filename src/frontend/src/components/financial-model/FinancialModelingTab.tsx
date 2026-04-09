import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useActor } from "@/hooks/useActor";
import { AssetType, type PortfolioHolding } from "@/types";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ModelBudgetingTab } from "./ModelBudgetingTab";
import { ModelCryptoPortfolioTab } from "./ModelCryptoPortfolioTab";
import { ModelDebtTab } from "./ModelDebtTab";
import { ModelGoalPlanningTab } from "./ModelGoalPlanningTab";
import { ModelInsuranceTab } from "./ModelInsuranceTab";
import { ModelPortfolioTab } from "./ModelPortfolioTab";
import { ModelRetirementTab } from "./ModelRetirementTab";

const SECTIONS = [
  {
    id: "goalmodel",
    label: "Goal Planning",
    emoji: "🎯",
    borderColor: "#8b5cf6",
    count: "SIP Calculator · Inflation-Adjusted · Goal Stack",
  },
  {
    id: "assetallocation",
    label: "Asset Allocation",
    emoji: "📊",
    borderColor: "#6366f1",
    count: "Conservative · Moderate · Aggressive",
  },
  {
    id: "modelportfolio",
    label: "Model Portfolio & Investments",
    emoji: "💼",
    borderColor: "#10b981",
    count: "MF · ETF · Mixed",
  },
  {
    id: "modelinsurance",
    label: "Model Insurance",
    emoji: "🛡️",
    borderColor: "#0ea5e9",
    count: "Term · Health · HLV",
  },
  {
    id: "modelretirement",
    label: "Model Retirement",
    emoji: "🌅",
    borderColor: "#14b8a6",
    count: "Early · Regular · Late",
  },
  {
    id: "budgetingmodel",
    label: "Budget & Expense Tracking",
    emoji: "💰",
    borderColor: "#3b82f6",
    count: "50/30/20 Rule · Leakage Detection · Budget Plan",
  },
  {
    id: "debtmodel",
    label: "Loan Management & Repayment",
    emoji: "📉",
    borderColor: "#ef4444",
    count: "Avalanche · Snowball · Debt Freedom Date",
  },
  {
    id: "modelcrypto",
    label: "Model Crypto",
    emoji: "₿",
    borderColor: "#f97316",
    count: "Conservative · Balanced · Growth",
  },
];

const MODEL_SCENARIOS: Record<
  string,
  Array<{ id: string; title: string; description: string }>
> = {
  budgetingmodel: [
    {
      id: "budget_setup",
      title: "Initial Budget Setup",
      description:
        "Build a structured monthly budget from your income and known expenses using the 50/30/20 rule.",
    },
    {
      id: "leakage",
      title: "Leakage Detection",
      description:
        "Running out of money before month-end? Identify hidden spending leaks by category.",
    },
    {
      id: "tighten",
      title: "Budget Tightening",
      description:
        "Need to cut expenses by a target amount without sacrificing key lifestyle items.",
    },
    {
      id: "irregular",
      title: "Irregular Income",
      description:
        "Freelancer or variable income? Build a flexible budget that works across high and low months.",
    },
  ],
  debtmodel: [
    {
      id: "inventory",
      title: "Debt Inventory & Strategy",
      description:
        "List all debts, compare Avalanche vs Snowball strategies, and find your debt-free date.",
    },
    {
      id: "overwhelm",
      title: "Prioritize Multiple Debts",
      description:
        "Have extra money each month but unsure which debt to tackle first? Get a clear roadmap.",
    },
    {
      id: "cc_trap",
      title: "Credit Card Minimum Payment Trap",
      description:
        "Paying only minimums? See the true cost and get an escape plan.",
    },
    {
      id: "consolidation",
      title: "Debt Consolidation Analysis",
      description:
        "Should you take a personal loan to close credit card debt? Get a data-driven answer.",
    },
    {
      id: "sip_vs_debt",
      title: "SIP vs Debt Repayment Dilemma",
      description:
        "Should you pause investments to pay off loans faster? Find the optimal balance.",
    },
  ],
  goalmodel: [
    {
      id: "single_goal",
      title: "Single Goal Planning",
      description:
        "Buy a car, fund a vacation, or save for a course — get the exact monthly saving required.",
    },
    {
      id: "multi_goal",
      title: "Multiple Goals Prioritization",
      description:
        "Education, home down payment, and retirement — allocate your savings optimally across all goals.",
    },
    {
      id: "retirement",
      title: "Retirement Corpus Calculator",
      description:
        "Inflation-adjusted retirement planning: how much do you need and how to get there.",
    },
    {
      id: "cost_of_delay",
      title: "Cost of Delay Analysis",
      description:
        "See in rupees what 1-2 years of delay has already cost you in compounding returns.",
    },
    {
      id: "windfall",
      title: "Windfall Allocation",
      description:
        "Got a salary hike or bonus? Prioritize between emergency fund, retirement, and goal SIPs.",
    },
  ],
};

function getModelScenarios(modelId: string) {
  return MODEL_SCENARIOS[modelId] ?? [];
}

function FinancialModelingTab() {
  const [searchQuery, setSearchQuery] = useState("");
  // activeSectionId: which section is open full-page
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  // activeScenarioId: for model tabs with sub-scenarios
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const _isMobile = useIsMobile();

  const MODEL_IDS = new Set(["budgetingmodel"]);

  const filteredSections = searchQuery.trim()
    ? SECTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.count.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : SECTIONS;

  const backBtn = (onClick: () => void, label = "Back to Menu") => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-lg mb-4 transition-colors"
      data-ocid="financialmodel.back_button"
    >
      ← {label}
    </button>
  );

  // Full-page scenario view for model tabs
  if (
    activeSectionId &&
    MODEL_IDS.has(activeSectionId) &&
    activeScenarioId?.startsWith(`${activeSectionId}::`)
  ) {
    return (
      <div className="space-y-4 animate-fade-in">
        {backBtn(() => {
          setActiveScenarioId(null);
          // For model tabs, go back to the scenario list; otherwise go to main menu
          if (!MODEL_IDS.has(activeSectionId ?? "")) {
            setActiveSectionId(null);
          }
        })}
        {activeSectionId === "budgetingmodel" && (
          <ModelBudgetingTab
            initialScenario={activeScenarioId.split("::")[1]}
          />
        )}
        {activeSectionId === "debtmodel" && (
          <ModelDebtTab initialScenario={activeScenarioId.split("::")[1]} />
        )}
        {activeSectionId === "goalmodel" && (
          <ModelGoalPlanningTab
            initialScenario={activeScenarioId.split("::")[1]}
          />
        )}
      </div>
    );
  }

  // Full-page model tab with scenario list (for model tabs) or direct content (for calculator tabs)
  if (activeSectionId) {
    const section = SECTIONS.find((s) => s.id === activeSectionId);
    if (!section) return null;
    return (
      <div className="space-y-4 animate-fade-in">
        {backBtn(() => {
          setActiveSectionId(null);
          setActiveScenarioId(null);
        })}
        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          style={{ borderLeft: `4px solid ${section.borderColor}` }}
        >
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            <span className="text-xl">{section.emoji}</span>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {section.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{section.count}</p>
            </div>
          </div>
          <div className="px-4 py-4">
            {/* Direct calculators */}
            {section.id === "modelinsurance" && <ModelInsuranceTab />}
            {section.id === "assetallocation" && <AssetAllocationTab />}
            {section.id === "modelportfolio" && <ModelPortfolioTab />}
            {section.id === "modelretirement" && <ModelRetirementTab />}
            {section.id === "modelcrypto" && <ModelCryptoPortfolioTab />}
            {section.id === "goalmodel" && <ModelGoalPlanningTab />}
            {section.id === "debtmodel" && <ModelDebtTab />}
            {/* Model tabs: show scenario cards */}
            {MODEL_IDS.has(section.id) && (
              <div className="space-y-2">
                {getModelScenarios(section.id).map((scenario, idx) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => {
                      setActiveScenarioId(`${section.id}::${scenario.id}`);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-violet-50 hover:border-violet-300 transition-all group flex items-center gap-3"
                    style={{ borderLeft: `3px solid ${section.borderColor}` }}
                    data-ocid={`financialmodel.${section.id}.scenario.${idx + 1}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:border-violet-400 group-hover:text-violet-700 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-800">
                        {scenario.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {scenario.description}
                      </p>
                    </div>
                    <span className="text-xs text-violet-500 group-hover:text-violet-700 flex-shrink-0">
                      →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main menu: show all section cards
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search financial models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-ocid="financialmodel.search_input"
        />
      </div>
      {filteredSections.map((section) => (
        <button
          key={section.id}
          type="button"
          className="w-full text-left bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:bg-slate-50 transition-all flex items-center gap-3 px-4 py-3"
          style={{ borderLeft: `4px solid ${section.borderColor}` }}
          onClick={() => {
            setActiveSectionId(section.id);
            setActiveScenarioId(null);
          }}
          data-ocid={`financialmodel.${section.id}.toggle`}
        >
          <span className="text-xl flex-shrink-0">{section.emoji}</span>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-800">
              {section.label}
            </span>
            <p className="text-xs text-slate-400 mt-0.5">{section.count}</p>
          </div>
          <span className="text-slate-400 text-sm flex-shrink-0">→</span>
        </button>
      ))}
    </div>
  );
}

const ASSET_TYPE_TO_KEY: Record<string, string> = {
  [AssetType.Retirement]: "Retiral",
  [AssetType.ETF]: "Equity (ETF & Stocks)",
  [AssetType.MutualFund]: "Mutual Funds",
  [AssetType.Commodity]: "Commodities",
  [AssetType.RealEstate]: "Real Estate",
  [AssetType.FixedIncome]: "Fixed Income",
  [AssetType.Crypto]: "Crypto",
  [AssetType.Other]: "IPO/Unlisted/Other",
};

function AssetAllocationTab() {
  const [selectedProfile, setSelectedProfile] = useState<
    "conservative" | "moderate" | "aggressive"
  >("moderate");

  const { actor } = useActor();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllPortfolioHoldings()
      .then(setHoldings)
      .catch(() => setHoldings([]));
  }, [actor]);

  const actualAllocations = useMemo(() => {
    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const result: Record<string, number> = {};
    if (totalValue === 0) return result;
    for (const h of holdings) {
      const key = ASSET_TYPE_TO_KEY[h.assetType] ?? "IPO/Unlisted/Other";
      result[key] = (result[key] ?? 0) + (h.currentValue / totalValue) * 100;
    }
    return result;
  }, [holdings]);

  function generateRecommendations(
    planned: Record<string, number>,
    actual: Record<string, number>,
  ): string[] {
    const recs: string[] = [];
    const totalActual = Object.values(actual).reduce((s, v) => s + v, 0);
    if (totalActual === 0) {
      recs.push(
        "No portfolio data found. Start adding investments to see personalized allocation recommendations.",
      );
      recs.push(
        `For a ${selectedProfile} profile, prioritize ${selectedProfile === "conservative" ? "Retiral (30%) and Fixed Income (25%)" : selectedProfile === "moderate" ? "Equity (22%) and Mutual Funds (20%)" : "Equity (35%) and Mutual Funds (22%)"} as your core allocation.`,
      );
      recs.push(
        "Diversify across at least 4–5 asset classes to reduce concentration risk.",
      );
      return recs;
    }
    for (const [asset, plannedPct] of Object.entries(planned)) {
      const actualPct = actual[asset] ?? 0;
      const variance = actualPct - plannedPct;
      if (variance < -5) {
        recs.push(
          `${asset} is under-allocated (Actual: ${actualPct.toFixed(1)}% vs Target: ${plannedPct}%). Consider increasing exposure to rebalance.`,
        );
      } else if (variance > 5) {
        recs.push(
          `${asset} is over-allocated (Actual: ${actualPct.toFixed(1)}% vs Target: ${plannedPct}%). Consider booking partial profits or redirecting new investments elsewhere.`,
        );
      }
    }
    if (recs.length === 0) {
      recs.push(
        "Your portfolio allocation is well-balanced and aligns closely with your risk profile targets.",
      );
      recs.push(
        "Continue SIP investments to maintain this allocation as markets move.",
      );
    }
    recs.push(
      `Industry standard for ${selectedProfile} profile: rebalance quarterly when any asset class deviates more than 5% from target allocation.`,
    );
    return recs;
  }

  const riskProfiles = {
    conservative: {
      name: "Conservative",
      description: "Low risk, stable returns with capital preservation focus",
      allocation: {
        Retiral: 30,
        "Equity (ETF & Stocks)": 15,
        "Mutual Funds": 15,
        Commodities: 5,
        "Real Estate": 5,
        "Fixed Income": 25,
        Crypto: 0,
        "IPO/Unlisted/Other": 5,
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
        Retiral: 20,
        "Equity (ETF & Stocks)": 22,
        "Mutual Funds": 20,
        Commodities: 8,
        "Real Estate": 10,
        "Fixed Income": 15,
        Crypto: 5,
        "IPO/Unlisted/Other": 0,
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
        Retiral: 10,
        "Equity (ETF & Stocks)": 35,
        "Mutual Funds": 22,
        Commodities: 5,
        "Real Estate": 8,
        "Fixed Income": 5,
        Crypto: 10,
        "IPO/Unlisted/Other": 5,
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Risk Profile Dropdown */}
      <div className="flex items-center gap-3 max-w-xs">
        <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
          Risk Profile
        </span>
        <Select
          value={selectedProfile}
          onValueChange={(v) =>
            setSelectedProfile(v as keyof typeof riskProfiles)
          }
        >
          <SelectTrigger
            data-ocid="financialmodel.assetallocation.select"
            className="w-[200px]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conservative">🛡️ Conservative</SelectItem>
            <SelectItem value="moderate">⚖️ Moderate</SelectItem>
            <SelectItem value="aggressive">🚀 Aggressive</SelectItem>
          </SelectContent>
        </Select>
        <Badge className={`text-xs ${riskProfiles[selectedProfile].riskBadge}`}>
          {riskProfiles[selectedProfile].riskLabel}
        </Badge>
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
          <h3 className="text-base font-semibold mb-4">Portfolio Pie Chart</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RechartsPieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: { name: string; percent: number }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
                innerRadius="30%"
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
                    Focus on capital preservation with high allocation to bonds
                    and FD
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${profile.bullet} font-bold`}>•</span>
                  <span>Minimal exposure to volatile assets like crypto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${profile.bullet} font-bold`}>•</span>
                  <span>
                    Suitable for investors nearing retirement or with low risk
                    tolerance
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
                    Balanced approach with diversification across asset classes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${profile.bullet} font-bold`}>•</span>
                  <span>
                    Moderate exposure to equities and mutual funds for growth
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${profile.bullet} font-bold`}>•</span>
                  <span>
                    Suitable for investors with medium-term goals (5–10 years)
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
                    Growth-oriented with high equity and mutual fund allocation
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

      {/* Planned vs Actual Allocation Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2.5 border-b border-border">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Planned vs Actual Allocation
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {holdings.length === 0
              ? "No portfolio data — showing 0% actual. Add investments to see your real allocation."
              : `Based on ${holdings.length} portfolio holdings`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs border-b border-border">
                <th className="text-left px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">
                  Asset Class
                </th>
                <th className="text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">
                  Planned %
                </th>
                <th className="text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">
                  Actual %
                </th>
                <th className="text-right px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">
                  Variance
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(profile.allocation).map(
                ([asset, planned], idx) => {
                  const actual = actualAllocations[asset] ?? 0;
                  const variance = actual - planned;
                  return (
                    <tr
                      key={asset}
                      className={`border-t border-border ${idx % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-slate-800/20"} hover:bg-muted/30`}
                    >
                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">
                        {asset}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                        {planned}%
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {actual.toFixed(1)}%
                      </td>
                      <td
                        className={`px-3 py-2 text-right tabular-nums font-semibold ${variance > 2 ? "text-emerald-600" : variance < -2 ? "text-red-500" : "text-slate-500"}`}
                      >
                        {variance > 0 ? "+" : ""}
                        {variance.toFixed(1)}%
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🤖</span>
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            AI Portfolio Recommendations
          </h3>
        </div>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {generateRecommendations(profile.allocation, actualAllocations).map(
            (rec) => (
              <div key={rec.slice(0, 30)} className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5 flex-shrink-0">→</span>
                <p>{rec}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export { FinancialModelingTab };
export default FinancialModelingTab;
