import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bitcoin,
  Briefcase,
  ChevronDown,
  PieChart,
  PiggyBank,
  Search,
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
import { ModelInsuranceTab } from "./ModelInsuranceTab";
import { ModelPortfolioTab } from "./ModelPortfolioTab";
import { ModelRetirementTab } from "./ModelRetirementTab";

const SECTIONS = [
  {
    id: "modelinsurance",
    label: "Insurance",
    emoji: "🛡️",
    borderColor: "#0ea5e9",
    count: "Term · Health · HLV",
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
    label: "Model Portfolio",
    emoji: "💼",
    borderColor: "#10b981",
    count: "MF · ETF · Mixed",
  },
  {
    id: "modelretirement",
    label: "Model Retirement",
    emoji: "🌅",
    borderColor: "#14b8a6",
    count: "Early · Regular · Late",
  },
  {
    id: "modelcrypto",
    label: "Model Crypto",
    emoji: "₿",
    borderColor: "#f97316",
    count: "Conservative · Balanced · Growth",
  },
];

function FinancialModelingTab() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredSections = searchQuery.trim()
    ? SECTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.count.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : SECTIONS;

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
      {filteredSections.map((section) => {
        const isExpanded =
          expandedSections.has(section.id) || searchQuery.trim() !== "";
        return (
          <div
            key={section.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all"
            style={{ borderLeft: `4px solid ${section.borderColor}` }}
          >
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              onClick={() => toggleSection(section.id)}
              data-ocid={`financialmodel.${section.id}.toggle`}
            >
              <span className="text-xl flex-shrink-0">{section.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800">
                  {section.label}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{section.count}</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100 px-4 py-4 animate-fade-in">
                {section.id === "modelinsurance" && <ModelInsuranceTab />}
                {section.id === "assetallocation" && <AssetAllocationTab />}
                {section.id === "modelportfolio" && <ModelPortfolioTab />}
                {section.id === "modelretirement" && <ModelRetirementTab />}
                {section.id === "modelcrypto" && <ModelCryptoPortfolioTab />}
              </div>
            )}
          </div>
        );
      })}
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
    </div>
  );
}

export { FinancialModelingTab };
export default FinancialModelingTab;
