import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  PiggyBank,
  Search,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

const HELP_SECTIONS = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    color: "#2563eb",
    bg: "#eff6ff",
    title: "Dashboard",
    content: [
      {
        q: "What does the Dashboard show?",
        a: "The Dashboard is your financial command center. It shows your total Net Asset Value (NAV) across all modules, asset allocation pie chart, investment category bar chart, goals progress, 6-month budgeting comparison, and a 20-year wealth forecast table.",
      },
      {
        q: "How is the NAV calculated?",
        a: "NAV is the sum of current values across all portfolio modules: Retiral, Equity (ETF/Stocks), Mutual Fund, Crypto, Commodity, Real Estate, Fixed Income, and Other Investments.",
      },
      {
        q: "What is the 20-Year Forecast?",
        a: "The forecast table projects your wealth year-by-year using the current values and assumed growth rates per asset class. It shows Age, and values for each asset type. This helps you visualize long-term compounding.",
      },
      {
        q: "How to read the Risk vs Return chart?",
        a: "The Risk vs Return scatter chart shows each portfolio asset type plotted by its historical risk (volatility) and expected return. Assets in the upper-left zone are ideal (high return, low risk).",
      },
    ],
  },
  {
    id: "goals",
    icon: Target,
    color: "#059669",
    bg: "#f0fdf4",
    title: "Goals",
    content: [
      {
        q: "How do I add a financial goal?",
        a: 'Click the "Add Goal" button in the Goals module. Enter the goal name, target amount, target date, priority (1–5), and inflation rate. The system will automatically calculate how much SIP you need each month to reach the goal.',
      },
      {
        q: "How do I link investments to a goal?",
        a: 'In the Goals table, click the link icon (chain) on any goal row. A dialog will open showing all your portfolio investments grouped by asset type. Check the ones you want to link and click "Link Investments".',
      },
      {
        q: "How is Current Savings calculated?",
        a: "Current Savings in the top panel = sum of current values of all UNIQUE investments linked across all goals (no double-counting). This reflects your actual portfolio value working toward your goals.",
      },
      {
        q: "What does the Progress % mean?",
        a: "Progress % = (Current Savings / Total Target Amount) × 100. It shows how close you are to achieving all your combined goals.",
      },
      {
        q: "What is the Advise / SIP column?",
        a: "The Advise column shows how much you need to invest monthly (SIP) to bridge the gap between your current savings and target amount by the target date.",
      },
    ],
  },
  {
    id: "portfolio",
    icon: TrendingUp,
    color: "#0891b2",
    bg: "#ecfeff",
    title: "Portfolio",
    content: [
      {
        q: "What asset types are supported?",
        a: "Portfolio supports 8 asset classes: Retiral (PPF, NPS, EPF, LIC etc.), Equity (ETF/Stocks), Mutual Fund, Crypto, Commodity, Real Estate, Fixed Income, and Other Investments.",
      },
      {
        q: "How do I add a holding?",
        a: 'Select the asset type tab, then click "Add". Enter Name/Ticker, Category (auto-populated per asset type), Quantity, and either Buy Price (Invested auto-calculates) or Invested Value (Buy Price auto-calculates). Same logic applies for Market Price and Current Value.',
      },
      {
        q: "What is the Overview tab?",
        a: "The Overview tab shows a consolidated table with Investment Module, Total Invested, Current Value, Gain/Loss, % Gain/Loss, and % Allocation across all 8 asset types. It also includes a horizontal bar chart for Invested vs Current Value.",
      },
      {
        q: "How does the Buy Price / Invested logic work?",
        a: "If you enter Buy Price → Invested = Qty × Buy Price (auto-calculated). If you enter Invested → Buy Price = Invested / Qty (auto-calculated). Clearing either field re-enables both. Same symmetric logic applies for Market Price and Current Value.",
      },
      {
        q: "Can I sort the table columns?",
        a: "Yes. Click any column header in the Portfolio table to sort ascending or descending. This works for Name, Invested, Current Value, Gain/Loss, % Gain/Loss, and Allocation %.",
      },
    ],
  },
  {
    id: "budgeting",
    icon: PiggyBank,
    color: "#7c3aed",
    bg: "#faf5ff",
    title: "Budgeting",
    content: [
      {
        q: "How does the Budgeting module work?",
        a: "Budgeting tracks your monthly income and expenses. You can set planned amounts per category and compare against actual spending. Categories are grouped as Income (Salary, Business, Freelance, etc.) and Expenses (Housing, Food, Transport, etc.).",
      },
      {
        q: "Can I customize planned expenses per month?",
        a: 'Yes! Click "Edit Planned" in the Monthly Tracker to override planned amounts for any category for the selected month. Changes are saved locally and are independent per month. Use "Reset Month" to clear overrides.',
      },
      {
        q: "What is the currency shown in Budgeting?",
        a: "Budgeting uses the same currency you selected on the landing page. If you change the currency, all values in Budgeting will update automatically.",
      },
    ],
  },
  {
    id: "financial-planner",
    icon: CalendarDays,
    color: "#d97706",
    bg: "#fffbeb",
    title: "Financial Planner",
    content: [
      {
        q: "How many calculators are available?",
        a: "Financial Planner has 35+ calculators across 6 categories: Investment Planners (SIP, SWP, Lump Sum, CAGR, ROI, etc.), Retirement & Goals (FIRE, Retirement Readiness, Goal Planning), Loan & EMI (Home Loan, Car Loan, Education Loan, EMI, etc.), Tax Planners (Old vs New Regime, GST, LTCG), Savings & Deposits (FD, RD, PPF, Emergency Fund, Debt-to-Income), and Life Planners (Marriage, Child Education, HLV Method, Gratuity).",
      },
      {
        q: "How do SIP and SWP Step-Up options work?",
        a: 'The SIP Planner includes an "Annual Step-Up %" field (default 10%). Your monthly SIP increases by this % each year, matching salary increments. SWP Step-Up (default 5%) increases your monthly withdrawal by 5% each year. Both use compounded calculations.',
      },
      {
        q: "What is the FIRE Calculator?",
        a: "FIRE (Financial Independence, Retire Early) Calculator helps you find your FIRE Number — the corpus needed to live off investment returns forever. Enter your annual expenses, expected return, and safe withdrawal rate (usually 4% per Bengen Rule).",
      },
      {
        q: "How do I use the HLV Calculator?",
        a: "HLV (Human Life Value) Method calculates the life insurance cover you need. Enter your annual income, working years remaining, inflation rate, and discount rate. The result is the present value of your future earnings — this is your minimum insurance cover.",
      },
    ],
  },
  {
    id: "financial-model",
    icon: BarChart3,
    color: "#dc2626",
    bg: "#fef2f2",
    title: "Financial Model",
    content: [
      {
        q: "What does the Financial Model module cover?",
        a: "Financial Model has 5 tabs: Insurance (protection planning, IRDAI guidelines, HLV), Asset Allocation (MPT-based models for Conservative/Moderate/Aggressive profiles), Model Portfolio (India-specific allocation strategies), Model Retirement (FIRE, SWR, glide path), and Model Crypto (DCA strategy, market cycles).",
      },
      {
        q: "How does Asset Allocation work?",
        a: "Asset Allocation follows Modern Portfolio Theory (Markowitz, 1952). Three risk profiles are shown: Conservative (high debt, low equity), Moderate (balanced), and Aggressive (high equity/growth). Each shows exact allocation % across asset classes.",
      },
      {
        q: "What is the Model Portfolio tab?",
        a: "Model Portfolio shows India-optimized investment strategies (Nifty 50 stocks, Index funds, Mid/Small Cap) with allocation recommendations based on your risk tolerance. It also covers Factor Investing (Quality, Value, Momentum, Low-Volatility factors).",
      },
      {
        q: "What is covered in Model Retirement?",
        a: "Model Retirement covers: FIRE Number calculation, 4% Safe Withdrawal Rate (Bengen Rule), glide path portfolio transition (equity-heavy early, debt-heavy later), and key retirement rules like the 25x Rule.",
      },
      {
        q: "What is in the Model Crypto tab?",
        a: "Model Crypto covers the 4 market cycle phases (Accumulation, Uptrend, Distribution, Downtrend), Dollar Cost Averaging (DCA) strategy calculator, and 3 golden rules for crypto investing: position sizing, never invest more than you can afford to lose, and diversification within crypto.",
      },
    ],
  },
  {
    id: "learn-finance",
    icon: Shield,
    color: "#0d9488",
    bg: "#f0fdfa",
    title: "Learn Finance",
    content: [
      {
        q: "What are the three tabs in Learn Finance?",
        a: "Learn Finance has: (1) Basics — foundational financial concepts including compounding, SIP vs Lump Sum, CAGR, inflation impact, Rule of 72, and market cycles with interactive calculators. (2) Rules — 80+ financial rules filterable by Beginner/Intermediate/Advanced/Expert level. (3) My Rules — your personal rules with AI analysis.",
      },
      {
        q: "How does the Rules level filter work?",
        a: "In the Rules tab, use the level selector (All → Beginner → Intermediate → Advanced → Expert) to filter rules by complexity. Beginner rules cover basics like the 50-30-20 rule. Expert rules cover advanced topics like factor investing and tax-loss harvesting.",
      },
      {
        q: "What is AI Analysis in My Rules?",
        a: 'Click "AI Analysis" to get personalized rule recommendations based on 3 risk profiles (Conservative, Moderate, Aggressive). Each profile shows 8 recommended rules with alignment scoring. You can add any recommended rule to My Rules with one click.',
      },
      {
        q: "How do I add my own financial rule?",
        a: 'In the My Rules tab, click "Add Rule". Enter a name, rule type (e.g. Spending Limit), condition (e.g. Monthly spending > threshold), threshold value, and action (e.g. Send alert). Toggle it active/inactive anytime.',
      },
    ],
  },
  {
    id: "loans",
    icon: CreditCard,
    color: "#9333ea",
    bg: "#fdf4ff",
    title: "Loans",
    content: [
      {
        q: "How do I add a loan?",
        a: 'In the Loans module, click "Add Loan". Enter the loan name (e.g. Home Loan - HDFC), principal amount, interest rate, tenure in months, and start date. The system automatically calculates your monthly EMI, total interest, and remaining balance.',
      },
      {
        q: "What metrics does the Loans module track?",
        a: "Loans tracks: Outstanding Balance (principal remaining), EMI amount, Total Interest paid to date, Total Interest payable over the full tenure, and % of loan repaid. You can track multiple loans simultaneously.",
      },
      {
        q: "Can I see the amortization schedule?",
        a: "Yes. Each loan row shows a detailed amortization breakdown with year-by-year or month-by-month principal and interest split. This helps you understand how much of your EMI goes toward interest vs principal over time.",
      },
    ],
  },
  {
    id: "ai-assistant",
    icon: Bot,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "AI Assistant (Growfinfire)",
    content: [
      {
        q: "How do I open the AI Assistant?",
        a: "Click the pulsing purple-blue button at the bottom-right corner of any page (after login). The chat panel opens as a bottom sheet on mobile and a side panel on desktop.",
      },
      {
        q: "What can I ask the AI Assistant?",
        a: "You can ask about: all 8 app modules (how to use them), 35+ Financial Planner calculators, all Financial Model strategies, Learn Finance rules, portfolio design (Conservative/Moderate/Aggressive), and general financial topics like SIP, FIRE, compounding, mutual fund categories, insurance, tax, retirement, loans, and more.",
      },
      {
        q: "Can the AI help design my portfolio?",
        a: 'Yes! Ask "Design a portfolio for me" or "What allocation suits a moderate risk investor?" and the AI will provide detailed portfolio recommendations based on Modern Portfolio Theory, risk profiles, and India-specific strategies.',
      },
      {
        q: "What quick prompts are available?",
        a: "The chat panel shows 8 quick prompts on opening: How to use the app, SIP calculator guide, Portfolio design, FIRE planning, Mutual fund categories, Tax saving options, Insurance planning, and Retirement readiness. Tap any to instantly get guidance.",
      },
      {
        q: "Is the AI connected to my data?",
        a: "The AI Assistant provides educational guidance and app usage help. It is trained on all Growfinfire Global modules and financial best practices. It does not directly access your personal portfolio data for privacy reasons.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  const filteredSections = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return HELP_SECTIONS;
    return HELP_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.some(
          (item) =>
            item.q.toLowerCase().includes(q) ||
            item.a.toLowerCase().includes(q),
        ),
    );
  }, [search]);

  return (
    <div className="space-y-6" data-ocid="help.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow">
          <HelpCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Help &amp; Guide</h1>
          <p className="text-sm text-slate-500">
            Everything you need to know about Growfinfire Global
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative" data-ocid="help.section.panel">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search help topics..."
          className="pl-9 rounded-xl border-slate-200 bg-white shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="help.search.input"
        />
      </div>

      {/* Accordion Sections */}
      {filteredSections.length === 0 ? (
        <div
          className="text-center py-12 text-slate-400"
          data-ocid="help.empty_state"
        >
          <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No results found for &quot;{search}&quot;</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSections.map((section, si) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                data-ocid={`help.section.item.${si + 1}`}
              >
                {/* Section header */}
                <div
                  className="flex items-center gap-3 px-5 py-4 border-b border-slate-50"
                  style={{ borderLeftColor: section.color, borderLeftWidth: 3 }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: section.bg }}
                  >
                    <Icon
                      className="w-4.5 h-4.5"
                      style={{ color: section.color }}
                    />
                  </div>
                  <h2 className="text-sm font-bold text-slate-800">
                    {section.title}
                  </h2>
                </div>

                {/* Accordion Q&A */}
                <Accordion type="multiple" className="px-4 pb-2">
                  {section.content.map((item, qi) => (
                    <AccordionItem
                      key={item.q.slice(0, 30)}
                      value={`${section.id}-${qi}`}
                      className="border-slate-100"
                      data-ocid={`help.${section.id}.item.${qi + 1}`}
                    >
                      <AccordionTrigger className="text-sm font-medium text-slate-700 hover:text-indigo-600 text-left py-3">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-slate-500 leading-relaxed pb-3">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
