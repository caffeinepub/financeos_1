import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Baby,
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  Car,
  ChevronDown,
  Coins,
  CreditCard,
  DollarSign,
  FileText,
  Flame,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  Layers,
  Percent,
  PiggyBank,
  Receipt,
  Search,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { CAGRCalculator } from "./calculators/CAGRCalculator";
import { CarLoanEMICalculator } from "./calculators/CarLoanEMICalculator";
import { ChildEducationCalculator } from "./calculators/ChildEducationCalculator";
import { CompoundInterestCalculator } from "./calculators/CompoundInterestCalculator";
import { CreditCardPayoffCalculator } from "./calculators/CreditCardPayoffCalculator";
import { DebtToIncomeCalculator } from "./calculators/DebtToIncomeCalculator";
import { EMICalculator } from "./calculators/EMICalculator";
import { EducationLoanCalculator } from "./calculators/EducationLoanCalculator";
import { EmergencyFundCalculator } from "./calculators/EmergencyFundCalculator";
import { EmergencyFundSufficiencyCalculator } from "./calculators/EmergencyFundSufficiencyCalculator";
import { FDCalculator } from "./calculators/FDCalculator";
import { FIRECalculator } from "./calculators/FIRECalculator";
import { FlatVsReducingCalculator } from "./calculators/FlatVsReducingCalculator";
import { GSTCalculator } from "./calculators/GSTCalculator";
import { GoalCalculator } from "./calculators/GoalCalculator";
import { GratuityCalculator } from "./calculators/GratuityCalculator";
import { HLVCalculator } from "./calculators/HLVCalculator";
import { HRACalculator } from "./calculators/HRACalculator";
import { HomeLoanCalculator } from "./calculators/HomeLoanCalculator";
import { InflationCalculator } from "./calculators/InflationCalculator";
import { InflationImpactPlanner } from "./calculators/InflationImpactPlanner";
import { LumpsumCalculator } from "./calculators/LumpsumCalculator";
import { MarriagePlanningCalculator } from "./calculators/MarriagePlanningCalculator";
import { PPFCalculator } from "./calculators/PPFCalculator";
import { RDCalculator } from "./calculators/RDCalculator";
import { ROICalculator } from "./calculators/ROICalculator";
import { RentalYieldCalculator } from "./calculators/RentalYieldCalculator";
import { RetirementCalculator } from "./calculators/RetirementCalculator";
import { RetirementReadinessCalculator } from "./calculators/RetirementReadinessCalculator";
import { SIPCalculator } from "./calculators/SIPCalculator";
import { SWPCalculator } from "./calculators/SWPCalculator";
import { StocksCalculator } from "./calculators/StocksCalculator";
import { TVMCalculator } from "./calculators/TVMCalculator";
import { TaxCalculator } from "./calculators/TaxCalculator";
import { ThreeBucketCalculator } from "./calculators/ThreeBucketCalculator";
import { TwoBucketCalculator } from "./calculators/TwoBucketCalculator";

type CalculatorId =
  | "sip"
  | "lumpsum"
  | "cagr"
  | "tvm"
  | "compoundinterest"
  | "roi"
  | "stocks"
  | "retirement"
  | "swp"
  | "ppf"
  | "threebucket"
  | "twobucket"
  | "emi"
  | "homeloan"
  | "carloan"
  | "eduloan"
  | "creditcard"
  | "flatvsreducing"
  | "tax"
  | "hra"
  | "gst"
  | "fd"
  | "rd"
  | "rentalyield"
  | "goal"
  | "gratuity"
  | "emergency"
  | "childedu"
  | "marriage"
  | "inflation"
  | "fire"
  | "debtincome"
  | "emergencysufficiency"
  | "retirementreadiness"
  | "inflationimpact"
  | "hlv";

interface CalculatorItem {
  id: CalculatorId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverColor: string;
  keywords: string[];
}

interface CalculatorCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  calculators: CalculatorItem[];
  gradient: string;
}

export function CalculatorsTab() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorId | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const categories: CalculatorCategory[] = [
    {
      name: "Investment Planners",
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-600",
      calculators: [
        {
          id: "sip",
          name: "SIP Planner",
          icon: TrendingUp,
          color: "bg-blue-500",
          hoverColor: "hover:bg-blue-600",
          keywords: ["sip", "systematic", "investment", "plan", "monthly"],
        },
        {
          id: "lumpsum",
          name: "Lumpsum Planner",
          icon: Wallet,
          color: "bg-cyan-500",
          hoverColor: "hover:bg-cyan-600",
          keywords: ["lumpsum", "one time", "investment", "bulk"],
        },
        {
          id: "swp",
          name: "SWP Planner",
          icon: Activity,
          color: "bg-sky-500",
          hoverColor: "hover:bg-sky-600",
          keywords: ["swp", "systematic", "withdrawal", "plan"],
        },
        {
          id: "cagr",
          name: "CAGR Planner",
          icon: BarChart3,
          color: "bg-indigo-500",
          hoverColor: "hover:bg-indigo-600",
          keywords: ["cagr", "compound", "annual", "growth", "rate"],
        },
        {
          id: "roi",
          name: "ROI Planner",
          icon: TrendingUp,
          color: "bg-blue-600",
          hoverColor: "hover:bg-blue-700",
          keywords: ["roi", "return", "investment"],
        },
        {
          id: "stocks",
          name: "Stocks Planner",
          icon: BarChart3,
          color: "bg-violet-500",
          hoverColor: "hover:bg-violet-600",
          keywords: ["stocks", "shares", "equity"],
        },
        {
          id: "inflationimpact",
          name: "Inflation Impact Planner",
          icon: TrendingDown,
          color: "bg-orange-600",
          hoverColor: "hover:bg-orange-700",
          keywords: ["inflation", "impact", "purchasing", "power"],
        },
      ],
    },
    {
      name: "Retirement & Goals",
      icon: PiggyBank,
      gradient: "from-green-500 to-emerald-600",
      calculators: [
        {
          id: "retirement",
          name: "Retirement Planner",
          icon: PiggyBank,
          color: "bg-green-500",
          hoverColor: "hover:bg-green-600",
          keywords: ["retirement", "pension", "corpus"],
        },
        {
          id: "retirementreadiness",
          name: "Retirement Readiness Score",
          icon: Target,
          color: "bg-teal-500",
          hoverColor: "hover:bg-teal-600",
          keywords: ["retirement", "readiness", "score", "assessment"],
        },
        {
          id: "fire",
          name: "FIRE Planner",
          icon: Flame,
          color: "bg-orange-500",
          hoverColor: "hover:bg-orange-600",
          keywords: ["fire", "financial", "independence", "retire", "early"],
        },
        {
          id: "goal",
          name: "Goal Planner",
          icon: Target,
          color: "bg-emerald-500",
          hoverColor: "hover:bg-emerald-600",
          keywords: ["goal", "target", "objective"],
        },
        {
          id: "threebucket",
          name: "3-Bucket Planner",
          icon: Layers,
          color: "bg-teal-500",
          hoverColor: "hover:bg-teal-600",
          keywords: ["bucket", "strategy", "retirement"],
        },
        {
          id: "twobucket",
          name: "2-Bucket Planner",
          icon: Layers,
          color: "bg-cyan-600",
          hoverColor: "hover:bg-cyan-700",
          keywords: ["bucket", "strategy", "retirement"],
        },
      ],
    },
    {
      name: "Loan & EMI",
      icon: Home,
      gradient: "from-orange-500 to-red-600",
      calculators: [
        {
          id: "emi",
          name: "EMI Planner",
          icon: Calculator,
          color: "bg-orange-500",
          hoverColor: "hover:bg-orange-600",
          keywords: ["emi", "equated", "monthly", "installment"],
        },
        {
          id: "homeloan",
          name: "Home Loan Planner",
          icon: Home,
          color: "bg-red-500",
          hoverColor: "hover:bg-red-600",
          keywords: ["home", "loan", "mortgage", "housing"],
        },
        {
          id: "carloan",
          name: "Car Loan Planner",
          icon: Car,
          color: "bg-amber-500",
          hoverColor: "hover:bg-amber-600",
          keywords: ["car", "loan", "vehicle", "auto"],
        },
        {
          id: "eduloan",
          name: "Education Loan Planner",
          icon: GraduationCap,
          color: "bg-yellow-500",
          hoverColor: "hover:bg-yellow-600",
          keywords: ["education", "loan", "student"],
        },
        {
          id: "creditcard",
          name: "Credit Card Payoff Planner",
          icon: CreditCard,
          color: "bg-pink-500",
          hoverColor: "hover:bg-pink-600",
          keywords: ["credit", "card", "payoff", "debt"],
        },
        {
          id: "flatvsreducing",
          name: "Flat vs Reducing Planner",
          icon: TrendingDown,
          color: "bg-rose-600",
          hoverColor: "hover:bg-rose-700",
          keywords: ["flat", "reducing", "interest", "rate"],
        },
      ],
    },
    {
      name: "Tax Planners",
      icon: FileText,
      gradient: "from-purple-500 to-fuchsia-600",
      calculators: [
        {
          id: "tax",
          name: "Income Tax Planner",
          icon: FileText,
          color: "bg-purple-500",
          hoverColor: "hover:bg-purple-600",
          keywords: ["tax", "income", "itr"],
        },
        {
          id: "hra",
          name: "HRA Planner",
          icon: Building2,
          color: "bg-fuchsia-500",
          hoverColor: "hover:bg-fuchsia-600",
          keywords: ["hra", "house", "rent", "allowance"],
        },
        {
          id: "gst",
          name: "GST Planner",
          icon: Receipt,
          color: "bg-violet-500",
          hoverColor: "hover:bg-violet-600",
          keywords: ["gst", "goods", "services", "tax"],
        },
        {
          id: "gratuity",
          name: "Gratuity Planner",
          icon: Briefcase,
          color: "bg-indigo-500",
          hoverColor: "hover:bg-indigo-600",
          keywords: ["gratuity", "retirement", "benefit"],
        },
      ],
    },
    {
      name: "Savings & Deposits",
      icon: DollarSign,
      gradient: "from-amber-500 to-yellow-600",
      calculators: [
        {
          id: "ppf",
          name: "PPF Planner",
          icon: DollarSign,
          color: "bg-amber-500",
          hoverColor: "hover:bg-amber-600",
          keywords: ["ppf", "public", "provident", "fund"],
        },
        {
          id: "fd",
          name: "FD Planner",
          icon: Coins,
          color: "bg-yellow-500",
          hoverColor: "hover:bg-yellow-600",
          keywords: ["fd", "fixed", "deposit"],
        },
        {
          id: "rd",
          name: "RD Planner",
          icon: Receipt,
          color: "bg-lime-500",
          hoverColor: "hover:bg-lime-600",
          keywords: ["rd", "recurring", "deposit"],
        },
        {
          id: "compoundinterest",
          name: "Compound Interest Planner",
          icon: Percent,
          color: "bg-orange-400",
          hoverColor: "hover:bg-orange-500",
          keywords: ["compound", "interest"],
        },
        {
          id: "emergency",
          name: "Emergency Fund Planner",
          icon: Heart,
          color: "bg-rose-500",
          hoverColor: "hover:bg-rose-600",
          keywords: ["emergency", "fund", "contingency"],
        },
        {
          id: "debtincome",
          name: "Debt-to-Income Ratio",
          icon: DollarSign,
          color: "bg-red-400",
          hoverColor: "hover:bg-red-500",
          keywords: ["debt", "income", "ratio", "dti"],
        },
      ],
    },
    {
      name: "Life Planners",
      icon: Users,
      gradient: "from-pink-500 to-rose-600",
      calculators: [
        {
          id: "hlv",
          name: "Human Life Value (HLV)",
          icon: Shield,
          color: "bg-blue-600",
          hoverColor: "hover:bg-blue-700",
          keywords: [
            "hlv",
            "human life value",
            "insurance",
            "irdai",
            "life cover",
          ],
        },
        {
          id: "childedu",
          name: "Child Education Planner",
          icon: Baby,
          color: "bg-pink-500",
          hoverColor: "hover:bg-pink-600",
          keywords: ["child", "education", "school", "college"],
        },
        {
          id: "marriage",
          name: "Marriage Planner",
          icon: Users,
          color: "bg-rose-500",
          hoverColor: "hover:bg-rose-600",
          keywords: ["marriage", "wedding"],
        },
        {
          id: "rentalyield",
          name: "Rental Yield Planner",
          icon: Landmark,
          color: "bg-red-400",
          hoverColor: "hover:bg-red-500",
          keywords: ["rental", "yield", "property", "real estate"],
        },
        {
          id: "inflation",
          name: "Inflation Impact Planner",
          icon: Percent,
          color: "bg-orange-600",
          hoverColor: "hover:bg-orange-700",
          keywords: ["inflation", "impact"],
        },
        {
          id: "tvm",
          name: "Time Value Planner",
          icon: Calculator,
          color: "bg-fuchsia-600",
          hoverColor: "hover:bg-fuchsia-700",
          keywords: ["time", "value", "money", "tvm"],
        },
      ],
    },
  ];

  const allCalculators = categories.flatMap((cat) => cat.calculators);

  const filteredCategories =
    searchQuery.trim() === ""
      ? categories
      : categories
          .map((cat) => ({
            ...cat,
            calculators: cat.calculators.filter(
              (calc) =>
                calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                calc.keywords.some((keyword) =>
                  keyword.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
            ),
          }))
          .filter((cat) => cat.calculators.length > 0);

  const handleSearchSelect = (calcId: CalculatorId) => {
    setActiveCalculator(calcId);
    setSearchQuery("");
  };

  const renderCalculator = (calcId: CalculatorId) => {
    switch (calcId) {
      case "sip":
        return <SIPCalculator />;
      case "lumpsum":
        return <LumpsumCalculator />;
      case "cagr":
        return <CAGRCalculator />;
      case "tvm":
        return <TVMCalculator />;
      case "compoundinterest":
        return <CompoundInterestCalculator />;
      case "roi":
        return <ROICalculator />;
      case "stocks":
        return <StocksCalculator />;
      case "retirement":
        return <RetirementCalculator />;
      case "retirementreadiness":
        return <RetirementReadinessCalculator />;
      case "fire":
        return <FIRECalculator />;
      case "swp":
        return <SWPCalculator />;
      case "ppf":
        return <PPFCalculator />;
      case "threebucket":
        return <ThreeBucketCalculator />;
      case "twobucket":
        return <TwoBucketCalculator />;
      case "emi":
        return <EMICalculator />;
      case "homeloan":
        return <HomeLoanCalculator />;
      case "carloan":
        return <CarLoanEMICalculator />;
      case "eduloan":
        return <EducationLoanCalculator />;
      case "creditcard":
        return <CreditCardPayoffCalculator />;
      case "flatvsreducing":
        return <FlatVsReducingCalculator />;
      case "tax":
        return <TaxCalculator />;
      case "hra":
        return <HRACalculator />;
      case "gst":
        return <GSTCalculator />;
      case "fd":
        return <FDCalculator />;
      case "rd":
        return <RDCalculator />;
      case "rentalyield":
        return <RentalYieldCalculator />;
      case "goal":
        return <GoalCalculator />;
      case "gratuity":
        return <GratuityCalculator />;
      case "emergency":
        return <EmergencyFundCalculator />;
      case "emergencysufficiency":
        return <EmergencyFundSufficiencyCalculator />;
      case "childedu":
        return <ChildEducationCalculator />;
      case "marriage":
        return <MarriagePlanningCalculator />;
      case "inflation":
        return <InflationCalculator />;
      case "debtincome":
        return <DebtToIncomeCalculator />;
      case "inflationimpact":
        return <InflationImpactPlanner />;
      case "hlv":
        return <HLVCalculator />;
      default:
        return null;
    }
  };

  const categoryMeta: Record<string, { emoji: string; borderColor: string }> = {
    "Investment Planners": { emoji: "📈", borderColor: "#3b82f6" },
    "Retirement & Goals": { emoji: "🎯", borderColor: "#10b981" },
    "Loan & EMI": { emoji: "🏠", borderColor: "#f97316" },
    "Tax Planners": { emoji: "📋", borderColor: "#8b5cf6" },
    "Savings & Deposits": { emoji: "💰", borderColor: "#f59e0b" },
    "Life Planners": { emoji: "👨‍👩‍👧", borderColor: "#ec4899" },
  };

  if (activeCalculator) {
    const selectedCalc = allCalculators.find((c) => c.id === activeCalculator);
    const CalcIcon = selectedCalc?.icon || Calculator;
    return (
      <div className="space-y-2 p-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveCalculator(null)}
            className="gap-1.5 h-8"
            data-ocid="financialplanner.back_button"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Menu
          </Button>
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg ${selectedCalc?.color} flex items-center justify-center shadow-md`}
            >
              <CalcIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <h2 className="text-base font-bold">{selectedCalc?.name}</h2>
          </div>
        </div>
        <div className="animate-fade-in">
          {renderCalculator(activeCalculator)}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-3 p-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold whitespace-nowrap">
              Financial Planner
            </h2>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search calculators by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    filteredCategories.length > 0 &&
                    filteredCategories[0].calculators.length > 0
                  ) {
                    handleSearchSelect(filteredCategories[0].calculators[0].id);
                  }
                }}
                className="pl-10 h-10"
                data-ocid="financialplanner.search_input"
              />
            </div>
          </div>

          <div className="grid gap-3">
            {filteredCategories.map((category) => {
              const meta = categoryMeta[category.name] ?? {
                emoji: "📊",
                borderColor: "#64748b",
              };
              const isExpanded =
                searchQuery.trim() !== "" ||
                expandedCategories.has(category.name);
              return (
                <div
                  key={category.name}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all"
                  style={{ borderLeft: `4px solid ${meta.borderColor}` }}
                >
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => toggleCategory(category.name)}
                    data-ocid={`financialplanner.${category.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.toggle`}
                  >
                    <span className="text-xl flex-shrink-0">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-slate-800">
                        {category.name}
                      </span>
                    </div>
                    <span
                      className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: meta.borderColor }}
                    >
                      {category.calculators.length}
                    </span>
                    <ChevronDown
                      className="h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200"
                      style={{
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                        {category.calculators.map((calc) => {
                          const Icon = calc.icon;
                          return (
                            <button
                              key={calc.id}
                              type="button"
                              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                              onClick={() => handleSearchSelect(calc.id)}
                              data-ocid={`financialplanner.${calc.id}.button`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg ${calc.color} flex items-center justify-center shadow-sm`}
                              >
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-[10px] font-medium text-center text-slate-700 leading-tight">
                                {calc.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredCategories.length === 0 && searchQuery.trim() !== "" && (
            <div
              className="text-center py-8"
              data-ocid="financialplanner.empty_state"
            >
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                No calculators found matching "{searchQuery}"
              </p>
            </div>
          )}

          <div className="text-center pt-2 pb-1">
            <p className="text-xs text-muted-foreground">
              {searchQuery.trim() === ""
                ? "Click any planner to get started"
                : "Press Enter to open first result"}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
