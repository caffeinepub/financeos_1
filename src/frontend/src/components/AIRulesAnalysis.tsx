import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  Plus,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AIRulesAnalysisProps {
  userRules: Array<{
    name: string;
    ruleType: string;
    condition: string;
    threshold: number;
    action: string;
    isActive: boolean;
  }>;
  onAddRule: (ruleData: {
    name: string;
    ruleType: string;
    condition: string;
    threshold: number;
    action: string;
    isActive: true;
  }) => void;
}

type RiskProfile = "conservative" | "moderate" | "aggressive";
type Priority = "Critical" | "High" | "Medium";

interface RecommendedRule {
  id: string;
  name: string;
  category: string;
  description: string;
  formula: string;
  practicalTakeaway: string;
  priority: Priority;
}

// ─── Recommended Rule Datasets ───────────────────────────────────────────────

const conservativeRules: RecommendedRule[] = [
  {
    id: "emergency-fund",
    name: "Emergency Fund Rule",
    category: "Emergency & Risk Rules",
    description: "Maintain 6 months of expenses in liquid savings",
    formula: "Emergency Fund = Monthly Expenses × 6",
    practicalTakeaway: "Build emergency fund as priority #1",
    priority: "Critical",
  },
  {
    id: "life-insurance",
    name: "Life Insurance 10-15x Rule",
    category: "Emergency & Risk Rules",
    description: "Life insurance = 10-15x annual income",
    formula: "Coverage = Annual Income × 10-15",
    practicalTakeaway: "Buy term insurance early when premiums are low",
    priority: "Critical",
  },
  {
    id: "50-30-20",
    name: "50/30/20 Budgeting Rule",
    category: "Budgeting Rules",
    description: "50% needs, 30% wants, 20% savings",
    formula: "Needs: 50% | Wants: 30% | Savings: 20%",
    practicalTakeaway: "Track spending for a month to see your current split",
    priority: "High",
  },
  {
    id: "capital-preservation",
    name: "Capital Preservation First",
    category: "Risk Management Rules",
    description: "Don't lose money is rule #1",
    formula: "Rule 1: Don't Lose | Rule 2: Remember Rule 1",
    practicalTakeaway: "Understand downside before chasing upside",
    priority: "Critical",
  },
  {
    id: "sleep-night",
    name: "Sleep-at-Night Risk Rule",
    category: "Risk Management Rules",
    description: "Take only as much risk as lets you sleep peacefully",
    formula: "Risk Level = Comfortable Sleep Level",
    practicalTakeaway: "If you check portfolio daily with anxiety, reduce risk",
    priority: "High",
  },
  {
    id: "tax-advantaged",
    name: "Tax-Advantaged Accounts First",
    category: "Retirement Rules",
    description: "Max out PPF, EPF, NPS before taxable investments",
    formula: "Priority: PPF/EPF/NPS → Taxable Accounts",
    practicalTakeaway: "Exhaust Section 80C limit every year",
    priority: "High",
  },
  {
    id: "never-borrow-consume",
    name: "Never Borrow to Consume",
    category: "Risk Management Rules",
    description: "Only borrow for assets, never for consumption",
    formula: "Borrowing Purpose = Asset Building Only",
    practicalTakeaway:
      "If you can't afford it without debt, you can't afford it",
    priority: "High",
  },
  {
    id: "80-20-savings",
    name: "80/20 Savings Rule",
    category: "Budgeting Rules",
    description: "Save 20% of income, spend 80%",
    formula: "Savings = Income × 20%",
    practicalTakeaway:
      "Set up automatic transfer of 20% to savings account on payday",
    priority: "Medium",
  },
];

const moderateRules: RecommendedRule[] = [
  {
    id: "100-minus-age",
    name: "100 Minus Age Allocation",
    category: "Investment Rules",
    description: "Equity allocation = 100 minus your age",
    formula: "Equity % = 100 - Age",
    practicalTakeaway: "Review and adjust allocation on your birthday",
    priority: "Critical",
  },
  {
    id: "core-satellite",
    name: "Core-Satellite Allocation",
    category: "Investment Rules",
    description: "70-80% in core index funds, 20-30% in satellite active picks",
    formula: "Core: 70-80% | Satellite: 20-30%",
    practicalTakeaway: "Build core first, then add satellites gradually",
    priority: "High",
  },
  {
    id: "3-fund-portfolio",
    name: "3-Fund Portfolio Rule",
    category: "Investment Rules",
    description: "Domestic equity + international equity + bonds",
    formula: "Portfolio = Domestic Index + International Index + Bond Index",
    practicalTakeaway: "Start with 3-fund portfolio before adding complexity",
    priority: "High",
  },
  {
    id: "rebalance-annually",
    name: "Rebalance Annually",
    category: "Investment Rules",
    description: "Restore target allocation once per year",
    formula: "Rebalance Frequency = 1 year",
    practicalTakeaway: "Set calendar reminder for annual rebalancing",
    priority: "High",
  },
  {
    id: "25x-retirement",
    name: "25x Retirement Rule",
    category: "Retirement Rules",
    description: "Retirement corpus = 25 times annual expenses",
    formula: "Retirement Corpus = Annual Expenses × 25",
    practicalTakeaway: "Calculate your retirement number and work backwards",
    priority: "Critical",
  },
  {
    id: "avalanche-debt",
    name: "Avalanche Debt Method",
    category: "Debt Management Rules",
    description: "Pay off highest interest rate debts first",
    formula: "Order: Highest Interest → Lowest Interest",
    practicalTakeaway: "Calculate total interest saved with this method",
    priority: "High",
  },
  {
    id: "global-div",
    name: "Global Diversification Rule",
    category: "Investment Rules",
    description: "Allocate 20-30% to international markets",
    formula: "International Allocation = 20-30% of portfolio",
    practicalTakeaway: "Use international index funds for easy global exposure",
    priority: "Medium",
  },
  {
    id: "position-sizing",
    name: "Position Sizing Rule",
    category: "Risk Management Rules",
    description: "No single position should exceed 5-10% of portfolio",
    formula: "Position Size ≤ Portfolio × 5-10%",
    practicalTakeaway: "Rebalance when any position exceeds 10%",
    priority: "High",
  },
];

const aggressiveRules: RecommendedRule[] = [
  {
    id: "rule-72",
    name: "Rule of 72",
    category: "Investment Rules",
    description: "Years to double = 72 ÷ annual return rate",
    formula: "Doubling Time = 72 ÷ Return %",
    practicalTakeaway: "Use to quickly estimate investment growth",
    priority: "High",
  },
  {
    id: "intrinsic-value",
    name: "Buy Below Intrinsic Value",
    category: "Valuation Rules",
    description: "Purchase stocks trading below calculated intrinsic value",
    formula: "Buy when Market Price < Intrinsic Value",
    practicalTakeaway: "Learn DCF valuation or use simple PE comparison",
    priority: "Critical",
  },
  {
    id: "margin-safety",
    name: "Margin of Safety 30%",
    category: "Valuation Rules",
    description: "Buy at least 30% below intrinsic value",
    formula: "Purchase Price ≤ Intrinsic Value × 0.7",
    practicalTakeaway: "Be patient and wait for significant discounts",
    priority: "Critical",
  },
  {
    id: "high-roe",
    name: "High ROE Rule",
    category: "Valuation Rules",
    description: "Target companies with ROE above 15%",
    formula: "ROE = Net Income ÷ Shareholder Equity > 15%",
    practicalTakeaway: "Consistent high ROE indicates quality management",
    priority: "High",
  },
  {
    id: "income-age-milestones",
    name: "Savings Milestones by Age",
    category: "Investment Rules",
    description: "1x at 30, 3x at 40, 6x at 50, 10x at 60",
    formula: "Target = Annual Salary × Multiplier by Age",
    practicalTakeaway: "Start saving aggressively in your 20s",
    priority: "Critical",
  },
  {
    id: "circle-competence",
    name: "Circle of Competence",
    category: "Risk Management Rules",
    description: "Invest only in industries and businesses you understand",
    formula: "Investment Universe = Your Expertise",
    practicalTakeaway: "Stick to what you know or learn before investing",
    priority: "High",
  },
  {
    id: "avoid-timing",
    name: "Avoid Timing the Market",
    category: "Risk Management Rules",
    description: "Time in market beats timing the market",
    formula: "Success = Time in Market > Market Timing",
    practicalTakeaway: "Invest regularly regardless of market levels",
    priority: "High",
  },
  {
    id: "ips",
    name: "Investment Policy Statement",
    category: "Risk Management Rules",
    description: "Document your investment strategy and rules",
    formula: "IPS = Goals + Strategy + Rules",
    practicalTakeaway: "Write your IPS today and review annually",
    priority: "High",
  },
];

const profileRules: Record<RiskProfile, RecommendedRule[]> = {
  conservative: conservativeRules,
  moderate: moderateRules,
  aggressive: aggressiveRules,
};

// ─── Scoring Logic ────────────────────────────────────────────────────────────

function computeScores(
  userRules: AIRulesAnalysisProps["userRules"],
  profile: RiskProfile,
) {
  const allText = userRules
    .map((r) =>
      `${r.name} ${r.ruleType} ${r.condition} ${r.action}`.toLowerCase(),
    )
    .join(" ");

  const protectionKeywords = [
    "emergency",
    "insurance",
    "shield",
    "protection",
    "risk",
    "safe",
    "capital",
    "preservation",
  ];
  const growthKeywords = [
    "invest",
    "equity",
    "portfolio",
    "return",
    "growth",
    "fund",
    "stock",
    "index",
    "savings",
    "allocation",
  ];
  const debtKeywords = [
    "debt",
    "loan",
    "credit",
    "borrow",
    "emi",
    "repay",
    "avalanche",
    "snowball",
  ];
  const retirementKeywords = [
    "retire",
    "pension",
    "ppf",
    "epf",
    "nps",
    "corpus",
    "withdrawal",
    "age",
  ];

  const scoreAxis = (keywords: string[]) => {
    const matches = keywords.filter((kw) => allText.includes(kw)).length;
    const raw =
      userRules.length === 0
        ? 0
        : Math.min(100, Math.round((matches / keywords.length) * 100 * 1.5));
    // Adjust by profile bias
    if (profile === "conservative") {
      if (keywords === protectionKeywords) return Math.min(100, raw + 10);
      if (keywords === growthKeywords) return Math.max(0, raw - 10);
    }
    if (profile === "aggressive") {
      if (keywords === growthKeywords) return Math.min(100, raw + 15);
      if (keywords === protectionKeywords) return Math.max(0, raw - 10);
    }
    return raw;
  };

  const protection = scoreAxis(protectionKeywords);
  const growth = scoreAxis(growthKeywords);
  const debtMgmt = scoreAxis(debtKeywords);
  const retirement = scoreAxis(retirementKeywords);
  const overall = Math.round((protection + growth + debtMgmt + retirement) / 4);

  return { protection, growth, debtMgmt, retirement, overall };
}

// ─── Profile Config ───────────────────────────────────────────────────────────

const profileConfig = {
  conservative: {
    label: "Conservative",
    tagline: "Capital preservation, low risk, stable returns",
    bestFor:
      "Near-retirement investors, risk-averse individuals, first-time savers",
    icon: Shield,
    color: "emerald",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    bgLight: "bg-emerald-50",
    bgMed: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    progressColor: "bg-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  moderate: {
    label: "Moderate",
    tagline: "Balanced growth with managed risk",
    bestFor:
      "Mid-career professionals, long-term wealth builders, balanced investors",
    icon: BarChart3,
    color: "blue",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    bgLight: "bg-blue-50",
    bgMed: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    progressColor: "bg-blue-500",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  aggressive: {
    label: "Aggressive",
    tagline: "Maximum growth, high risk tolerance",
    bestFor:
      "Young investors, high income earners, experienced market participants",
    icon: TrendingUp,
    color: "orange",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-600",
    bgLight: "bg-orange-50",
    bgMed: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    progressColor: "bg-orange-500",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
  },
};

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  Critical: {
    label: "Critical",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  High: {
    label: "High",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  Medium: {
    label: "Medium",
    className: "bg-sky-100 text-sky-700 border-sky-200",
  },
};

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({
  label,
  value,
  progressClass,
}: {
  label: string;
  value: number;
  progressClass: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-700">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${progressClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ─── Rule Card ────────────────────────────────────────────────────────────────

function RuleRecommendationCard({
  rule,
  index,
  profileCfg,
  isAdded,
  isAlreadyOwned,
  onAdd,
}: {
  rule: RecommendedRule;
  index: number;
  profileCfg: (typeof profileConfig)[RiskProfile];
  isAdded: boolean;
  isAlreadyOwned: boolean;
  onAdd: () => void;
}) {
  const priority = priorityConfig[rule.priority];
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border ${
        isAdded || isAlreadyOwned
          ? "border-slate-200 bg-slate-50"
          : `${profileCfg.border} bg-white`
      } p-4 space-y-3 transition-all duration-200`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${priority.className}`}
            >
              {priority.label}
            </Badge>
            <Badge variant="outline" className="text-xs text-slate-500">
              {rule.category}
            </Badge>
          </div>
          <h4 className="font-semibold text-sm text-slate-800 leading-snug">
            {rule.name}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {rule.description}
          </p>
        </div>
        <Button
          size="sm"
          variant={isAdded || isAlreadyOwned ? "outline" : "default"}
          className={`shrink-0 h-8 gap-1.5 text-xs ${
            isAdded || isAlreadyOwned
              ? "text-slate-400 cursor-default"
              : `bg-gradient-to-r ${profileCfg.gradientFrom} ${profileCfg.gradientTo} text-white border-0 hover:opacity-90`
          }`}
          disabled={isAdded || isAlreadyOwned}
          onClick={onAdd}
          data-ocid={`ai_analysis.add_button.${index + 1}`}
        >
          {isAdded || isAlreadyOwned ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isAlreadyOwned ? "Owned" : "Added"}
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add Rule
            </>
          )}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        {expanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
        {expanded ? "Hide" : "Show"} formula & takeaway
      </button>

      {expanded && (
        <div className="space-y-2 pt-1">
          <div
            className={`rounded-lg ${profileCfg.bgLight} ${profileCfg.border} border p-3`}
          >
            <p className="text-xs text-slate-400 mb-1 font-medium">Formula</p>
            <code className="text-xs font-mono font-semibold text-slate-700">
              {rule.formula}
            </code>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
            <p className="text-xs text-slate-400 mb-1 font-medium">Takeaway</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {rule.practicalTakeaway}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AIRulesAnalysis({
  userRules,
  onAddRule,
}: AIRulesAnalysisProps) {
  const [profile, setProfile] = useState<RiskProfile | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const scores = profile ? computeScores(userRules, profile) : null;
  const cfg = profile ? profileConfig[profile] : null;
  const recommended = profile ? profileRules[profile] : [];
  const ownedNames = new Set(userRules.map((r) => r.name.toLowerCase()));

  const handleAdd = (rule: RecommendedRule) => {
    onAddRule({
      name: rule.name,
      ruleType: rule.category,
      condition: rule.formula,
      threshold: 0,
      action: rule.practicalTakeaway,
      isActive: true,
    });
    setAddedIds((prev) => new Set([...prev, rule.id]));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-md">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base leading-tight">
            AI Risk Profile Analysis
          </h3>
          <p className="text-xs text-slate-500">
            Select a risk profile to see your alignment score and curated rule
            recommendations
          </p>
        </div>
      </div>

      {/* Profile Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(profileConfig) as RiskProfile[]).map((key) => {
          const config = profileConfig[key];
          const Icon = config.icon;
          const isSelected = profile === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setProfile(key)}
              data-ocid={`ai_analysis.${key}_tab`}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 group ${
                isSelected
                  ? `border-transparent shadow-lg ring-2 ${
                      key === "conservative"
                        ? "ring-emerald-400"
                        : key === "moderate"
                          ? "ring-blue-400"
                          : "ring-orange-400"
                    }`
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {isSelected && (
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} opacity-5`}
                />
              )}
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center shadow-sm ${
                    isSelected
                      ? `bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo}`
                      : config.bgMed
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? "text-white" : config.text
                    }`}
                  />
                </div>
                <div className="font-bold text-sm text-slate-800">
                  {config.label}
                </div>
                <div
                  className={`text-xs mt-0.5 font-medium ${
                    isSelected ? config.text : "text-slate-500"
                  }`}
                >
                  {config.tagline}
                </div>
                <div className="text-xs text-slate-400 mt-2 leading-relaxed">
                  <span className="font-medium text-slate-500">Best for:</span>{" "}
                  {config.bestFor}
                </div>
              </div>
              {isSelected && (
                <div
                  className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo}`}
                >
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Analysis Results */}
      {profile && scores && cfg && (
        <div className="space-y-5">
          {/* Alignment Score Card */}
          <Card
            className={`border ${
              profile === "conservative"
                ? "border-emerald-200"
                : profile === "moderate"
                  ? "border-blue-200"
                  : "border-orange-200"
            } overflow-hidden`}
          >
            <div
              className={`h-1.5 bg-gradient-to-r ${cfg.gradientFrom} ${cfg.gradientTo}`}
            />
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  Your Rules Alignment Score
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div
                    className={`text-3xl font-black ${
                      scores.overall >= 60
                        ? cfg.text
                        : scores.overall >= 30
                          ? "text-amber-600"
                          : "text-slate-400"
                    }`}
                  >
                    {scores.overall}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">/100</div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {userRules.length === 0
                  ? "No rules yet — add some to see your alignment improve"
                  : scores.overall >= 70
                    ? `Strong alignment with ${cfg.label} profile. Keep adding rules to reinforce your strategy.`
                    : scores.overall >= 40
                      ? `Moderate alignment. The recommended rules below will strengthen your ${cfg.label} approach.`
                      : `Low alignment detected. The AI suggests adding the recommended rules to build a solid ${cfg.label} foundation.`}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 pb-5">
              <ScoreBar
                label="Protection & Risk Cover"
                value={scores.protection}
                progressClass={cfg.progressColor}
              />
              <ScoreBar
                label="Growth & Investment"
                value={scores.growth}
                progressClass={cfg.progressColor}
              />
              <ScoreBar
                label="Debt Management"
                value={scores.debtMgmt}
                progressClass={cfg.progressColor}
              />
              <ScoreBar
                label="Retirement Planning"
                value={scores.retirement}
                progressClass={cfg.progressColor}
              />
            </CardContent>
          </Card>

          {/* AI Insights */}
          <div
            className={`rounded-xl ${cfg.bgLight} ${cfg.border} border p-4 flex gap-3`}
          >
            <Zap className={`w-4 h-4 ${cfg.text} shrink-0 mt-0.5`} />
            <div className="space-y-1">
              <p className={`text-xs font-bold ${cfg.text}`}>AI Insight</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {profile === "conservative" &&
                  "A Conservative approach prioritises financial safety nets and guaranteed returns. Focus on building your emergency fund, insurance coverage, and tax-advantaged retirement accounts before seeking market exposure."}
                {profile === "moderate" &&
                  "A Moderate approach balances growth with protection. A core index-fund portfolio with annual rebalancing forms the foundation, while controlled debt elimination and retirement corpus tracking complete the strategy."}
                {profile === "aggressive" &&
                  "An Aggressive approach seeks maximum compounding through direct equity, valuation discipline, and consistent long-term investing. The key differentiator is intellectual edge — only invest where you have a genuine circle of competence."}
              </p>
            </div>
          </div>

          {/* Recommended Rules */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-1 h-5 rounded-full bg-gradient-to-b ${cfg.gradientFrom} ${cfg.gradientTo}`}
              />
              <h4 className="font-bold text-sm text-slate-800">
                Recommended Rules for {cfg.label} Profile
              </h4>
              <Badge variant="outline" className={`text-xs ${cfg.badgeClass}`}>
                {recommended.length} rules
              </Badge>
            </div>

            <ScrollArea className="h-[520px] pr-1">
              <div className="space-y-3 pr-2">
                {recommended.map((rule, i) => (
                  <RuleRecommendationCard
                    key={rule.id}
                    rule={rule}
                    index={i}
                    profileCfg={cfg}
                    isAdded={addedIds.has(rule.id)}
                    isAlreadyOwned={ownedNames.has(rule.name.toLowerCase())}
                    onAdd={() => handleAdd(rule)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Stat Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: Wallet,
                label: "Your Rules",
                value: userRules.length,
                suffix: "total",
              },
              {
                icon: CheckCircle2,
                label: "Active",
                value: userRules.filter((r) => r.isActive).length,
                suffix: "enabled",
              },
              {
                icon: PiggyBank,
                label: "Suggested",
                value: recommended.filter(
                  (r) =>
                    !ownedNames.has(r.name.toLowerCase()) &&
                    !addedIds.has(r.id),
                ).length,
                suffix: "to add",
              },
            ].map(({ icon: Icon, label, value, suffix }) => (
              <div
                key={label}
                className={`rounded-xl ${cfg.bgLight} ${cfg.border} border p-3 text-center`}
              >
                <Icon className={`w-4 h-4 ${cfg.text} mx-auto mb-1`} />
                <div className={`text-xl font-black ${cfg.text}`}>{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
                <div className="text-xs text-slate-400">{suffix}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!profile && (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-slate-300" />
          <p className="text-sm text-slate-400">
            Select a risk profile above to get your personalised AI analysis
          </p>
        </div>
      )}
    </div>
  );
}
