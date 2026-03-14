import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  PiggyBank,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TOP_20_CURRENCIES = [
  { country: "India", code: "INR", symbol: "₹", flag: "🇮🇳" },
  { country: "United States", code: "USD", symbol: "$", flag: "🇺🇸" },
  { country: "European Union", code: "EUR", symbol: "€", flag: "🇪🇺" },
  { country: "United Kingdom", code: "GBP", symbol: "£", flag: "🇬🇧" },
  { country: "Japan", code: "JPY", symbol: "¥", flag: "🇯🇵" },
  { country: "China", code: "CNY", symbol: "¥", flag: "🇨🇳" },
  { country: "Canada", code: "CAD", symbol: "CA$", flag: "🇨🇦" },
  { country: "Australia", code: "AUD", symbol: "A$", flag: "🇦🇺" },
  { country: "Switzerland", code: "CHF", symbol: "Fr", flag: "🇨🇭" },
  { country: "South Korea", code: "KRW", symbol: "₩", flag: "🇰🇷" },
  { country: "Singapore", code: "SGD", symbol: "S$", flag: "🇸🇬" },
  { country: "Hong Kong", code: "HKD", symbol: "HK$", flag: "🇭🇰" },
  { country: "Sweden", code: "SEK", symbol: "kr", flag: "🇸🇪" },
  { country: "Norway", code: "NOK", symbol: "kr", flag: "🇳🇴" },
  { country: "Brazil", code: "BRL", symbol: "R$", flag: "🇧🇷" },
  { country: "Mexico", code: "MXN", symbol: "MX$", flag: "🇲🇽" },
  { country: "UAE", code: "AED", symbol: "د.إ", flag: "🇦🇪" },
  { country: "Saudi Arabia", code: "SAR", symbol: "﷼", flag: "🇸🇦" },
  { country: "South Africa", code: "ZAR", symbol: "R", flag: "🇿🇦" },
  { country: "Russia", code: "RUB", symbol: "₽", flag: "🇷🇺" },
];

const modules = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    description:
      "At-a-glance financial health with net worth, asset breakdown, and key performance metrics. Your complete financial picture in one view.",
    path: "/dashboard",
  },
  {
    icon: Target,
    name: "Goals",
    description:
      "Set, track, and achieve financial goals with milestone planning and visual progress tracking. Turn ambitions into measurable targets.",
    path: "/goals",
  },
  {
    icon: TrendingUp,
    name: "Portfolio",
    description:
      "Multi-asset portfolio management across 8 asset classes — Retirement, Mutual Funds, ETFs, Crypto, Commodities, Real Estate, Fixed Income, and more.",
    path: "/portfolio",
  },
  {
    icon: PiggyBank,
    name: "Budgeting",
    description:
      "Monthly budget tracking with income vs. planned vs. actual expense analysis. Category-level insights and net savings overview at a glance.",
    path: "/budgeting",
  },
  {
    icon: BarChart3,
    name: "Financial Model",
    description:
      "Advanced tabbed modeling across Asset Allocation, Portfolio, Retirement, Insurance, and Crypto. Scenario-plan your financial future with precision.",
    path: "/financial-model",
  },
  {
    icon: CalendarDays,
    name: "Financial Planner",
    description:
      "35+ professional-grade calculators across 6 categories: Investment, Retirement, Loan & EMI, Tax, Savings, and Life Planning. Every decision, data-driven.",
    path: "/financial-planner",
  },
  {
    icon: Shield,
    name: "Financial Rules",
    description:
      "Define smart financial rules to automate and guide your money decisions. Build discipline into your financial workflow with intelligent guardrails.",
    path: "/financial-rules",
  },
  {
    icon: CreditCard,
    name: "Loans",
    description:
      "Track and manage all loan accounts with amortization schedules, payoff planning, and interest analysis. Know exactly where you stand on every debt.",
    path: "/loans",
  },
  {
    icon: ArrowLeftRight,
    name: "Transactions",
    description:
      "Comprehensive transaction history with powerful search, filters, and categorization. Every rupee tracked, every pattern revealed.",
    path: "/transactions",
  },
];

const calculatorCategories = [
  "Investment Planners",
  "Retirement & Goals",
  "Loan & EMI",
  "Tax Planners",
  "Savings & Deposits",
  "Life Planners",
];

const pillars = [
  {
    icon: TrendingUp,
    title: "Portfolio Intelligence",
    description:
      "Track 8 asset classes in one unified view. Real-time allocation breakdowns, growth projections, and diversification analysis help you make smarter investment decisions.",
    stat: "8 Asset Classes",
  },
  {
    icon: PiggyBank,
    title: "Smart Budgeting",
    description:
      "Monthly income vs. planned vs. actual expense tracking with visual breakdowns and category-level insights. Know your net savings position at every moment.",
    stat: "360° Budget View",
  },
  {
    icon: CalendarDays,
    title: "Financial Planning",
    description:
      "From SIP to FIRE to retirement readiness — 35+ professional-grade calculators to model every financial decision with charts, projections, and actionable insights.",
    stat: "35+ Calculators",
  },
];

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {children}
    </div>
  );
}

function CurrencyDropdown({
  selected,
  onSelect,
}: {
  selected: (typeof TOP_20_CURRENCIES)[0];
  onSelect: (c: (typeof TOP_20_CURRENCIES)[0]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" data-ocid="currency.dropdown_menu">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:bg-white/5"
        style={{
          borderColor: "oklch(0.28 0.01 240)",
          color: "oklch(0.85 0 0)",
          background: "oklch(0.13 0.01 240)",
        }}
        data-ocid="currency.select.toggle"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span
          className="font-semibold"
          style={{ color: "oklch(0.72 0.17 160)" }}
        >
          {selected.symbol}
        </span>
        <span>{selected.code}</span>
        <ChevronDown
          className="w-3.5 h-3.5 transition-transform"
          style={{
            color: "oklch(0.55 0 0)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-xl border overflow-hidden shadow-2xl z-50"
          style={{
            background: "oklch(0.13 0.01 240)",
            borderColor: "oklch(0.22 0.01 240)",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {TOP_20_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onSelect(c);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
              style={{
                color:
                  c.code === selected.code
                    ? "oklch(0.72 0.17 160)"
                    : "oklch(0.80 0 0)",
                background:
                  c.code === selected.code
                    ? "oklch(0.72 0.17 160 / 0.08)"
                    : "transparent",
              }}
              data-ocid={`currency.option.${c.code.toLowerCase()}`}
            >
              <span className="text-base">{c.flag}</span>
              <span
                className="font-semibold w-8"
                style={{ color: "oklch(0.72 0.17 160)" }}
              >
                {c.symbol}
              </span>
              <span className="flex-1">{c.code}</span>
              <span className="text-xs" style={{ color: "oklch(0.50 0 0)" }}>
                {c.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState(
    TOP_20_CURRENCIES[0], // default INR
  );

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "oklch(0.08 0.01 240)" }}
    >
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: "oklch(0.08 0.01 240 / 0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "oklch(0.20 0.01 240)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-md"
            style={{ background: "oklch(0.72 0.17 160 / 0.15)" }}
          >
            <DollarSign
              className="w-5 h-5"
              style={{ color: "oklch(0.72 0.17 160)" }}
            />
          </div>
          <span
            className="text-xl font-bold tracking-tight font-display"
            style={{ color: "oklch(0.95 0 0)" }}
          >
            FinanceOS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {["Dashboard", "Portfolio", "Planner", "Loans"].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() =>
                navigate(`/${item.toLowerCase().replace(" ", "-")}`)
              }
              className="text-sm transition-colors hover:text-primary"
              style={{ color: "oklch(0.60 0 0)" }}
              data-ocid={`nav.${item.toLowerCase()}.link`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <CurrencyDropdown
            selected={selectedCurrency}
            onSelect={setSelectedCurrency}
          />
          <Button
            onClick={() => navigate("/dashboard")}
            className="text-sm"
            style={{
              background: "oklch(0.72 0.17 160)",
              color: "oklch(0.08 0.01 240)",
            }}
            data-ocid="nav.launch.primary_button"
          >
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20 overflow-hidden"
        data-ocid="hero.section"
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.3 0.02 240) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Emerald glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, oklch(0.72 0.17 160 / 0.12) 0%, transparent 70%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, oklch(0.08 0.01 240), transparent)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <AnimatedSection delay={0}>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 border"
              style={{
                background: "oklch(0.72 0.17 160 / 0.10)",
                borderColor: "oklch(0.72 0.17 160 / 0.30)",
                color: "oklch(0.72 0.17 160)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              9 Modules · 35+ Calculators · 8 Asset Classes
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h1
              className="font-display font-bold leading-tight mb-6"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                color: "oklch(0.95 0 0)",
                lineHeight: 1.1,
              }}
            >
              Your Financial{" "}
              <span style={{ color: "oklch(0.72 0.17 160)" }}>Operating</span>
              <br />
              System
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "oklch(0.60 0 0)" }}
            >
              One intelligent platform to manage your portfolio, plan your
              future, and track every{" "}
              <span
                className="font-semibold"
                style={{ color: "oklch(0.72 0.17 160)" }}
              >
                {selectedCurrency.symbol}
              </span>{" "}
              — powered by cutting-edge financial tools.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 text-base font-semibold rounded-lg transition-all hover:opacity-90 hover:shadow-lg"
                style={{
                  background: "oklch(0.72 0.17 160)",
                  color: "oklch(0.08 0.01 240)",
                  boxShadow: "0 0 30px oklch(0.72 0.17 160 / 0.3)",
                }}
                data-ocid="hero.launch.primary_button"
              >
                Launch App
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToFeatures}
                className="px-8 py-3 text-base font-semibold rounded-lg transition-all hover:bg-white/5"
                style={{
                  borderColor: "oklch(0.30 0.01 240)",
                  color: "oklch(0.80 0 0)",
                  background: "transparent",
                }}
                data-ocid="hero.explore.secondary_button"
              >
                Explore Features
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="py-12 px-6 border-y"
        style={{
          background: "oklch(0.11 0.01 240)",
          borderColor: "oklch(0.20 0.01 240)",
        }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "35+", label: "Calculators" },
            { value: "8", label: "Asset Classes" },
            { value: "9", label: "Core Modules" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div
                className="text-5xl md:text-6xl font-bold font-display mb-1"
                style={{ color: "oklch(0.72 0.17 160)" }}
              >
                {value}
              </div>
              <div
                className="text-sm tracking-widest uppercase"
                style={{ color: "oklch(0.50 0 0)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module Showcase */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p
                className="text-sm tracking-widest uppercase mb-3 font-medium"
                style={{ color: "oklch(0.72 0.17 160)" }}
              >
                Everything you need
              </p>
              <h2
                className="font-display font-bold mb-4"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "oklch(0.95 0 0)",
                }}
              >
                9 Modules. One Platform.
              </h2>
              <p
                className="max-w-xl mx-auto"
                style={{ color: "oklch(0.55 0 0)" }}
              >
                From daily transaction tracking to long-term retirement
                modeling, FinanceOS covers every dimension of your financial
                life.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod, i) => (
              <AnimatedSection key={mod.name} delay={i * 60}>
                <Link to={mod.path} data-ocid={`modules.item.${i + 1}`}>
                  <div
                    className="group h-full p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "oklch(0.12 0.01 240)",
                      borderColor: "oklch(0.20 0.01 240)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "oklch(0.72 0.17 160 / 0.4)";
                      (e.currentTarget as HTMLElement).style.background =
                        "oklch(0.13 0.015 200)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "oklch(0.20 0.01 240)";
                      (e.currentTarget as HTMLElement).style.background =
                        "oklch(0.12 0.01 240)";
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg mb-4"
                      style={{ background: "oklch(0.72 0.17 160 / 0.12)" }}
                    >
                      <mod.icon
                        className="w-5 h-5"
                        style={{ color: "oklch(0.72 0.17 160)" }}
                      />
                    </div>
                    <h3
                      className="font-semibold mb-2 text-base"
                      style={{ color: "oklch(0.92 0 0)" }}
                    >
                      {mod.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      {mod.description}
                    </p>
                    <div
                      className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "oklch(0.72 0.17 160)" }}
                    >
                      Open module <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section
        className="py-24 px-6"
        style={{ background: "oklch(0.10 0.01 240)" }}
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p
                className="text-sm tracking-widest uppercase mb-3 font-medium"
                style={{ color: "oklch(0.72 0.17 160)" }}
              >
                Core strengths
              </p>
              <h2
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "oklch(0.95 0 0)",
                }}
              >
                Built on Three Pillars
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <AnimatedSection key={pillar.title} delay={i * 100}>
                <div
                  className="relative p-8 rounded-2xl border h-full"
                  style={{
                    background: "oklch(0.12 0.01 240)",
                    borderColor: "oklch(0.20 0.01 240)",
                  }}
                >
                  <div
                    className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "oklch(0.72 0.17 160 / 0.12)",
                      color: "oklch(0.72 0.17 160)",
                    }}
                  >
                    {pillar.stat}
                  </div>
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl mb-6"
                    style={{ background: "oklch(0.72 0.17 160 / 0.10)" }}
                  >
                    <pillar.icon
                      className="w-6 h-6"
                      style={{ color: "oklch(0.72 0.17 160)" }}
                    />
                  </div>
                  <h3
                    className="font-display font-semibold text-xl mb-3"
                    style={{ color: "oklch(0.92 0 0)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    {pillar.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Planner Highlight */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div
              className="relative rounded-2xl overflow-hidden p-10 md:p-14 text-center border"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.12 0.02 220) 0%, oklch(0.10 0.02 180) 50%, oklch(0.12 0.015 160) 100%)",
                borderColor: "oklch(0.72 0.17 160 / 0.25)",
                boxShadow: "0 0 80px oklch(0.72 0.17 160 / 0.08)",
              }}
            >
              {/* bg accent */}
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, oklch(0.72 0.17 160) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border"
                  style={{
                    background: "oklch(0.72 0.17 160 / 0.10)",
                    borderColor: "oklch(0.72 0.17 160 / 0.30)",
                    color: "oklch(0.72 0.17 160)",
                  }}
                >
                  Financial Planner Module
                </div>
                <h2
                  className="font-display font-bold mb-4"
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    color: "oklch(0.95 0 0)",
                  }}
                >
                  Professional-Grade Financial Calculators
                </h2>
                <p
                  className="max-w-2xl mx-auto mb-8 leading-relaxed"
                  style={{ color: "oklch(0.58 0 0)" }}
                >
                  Make data-driven financial decisions with our comprehensive
                  calculator suite. From compound interest to retirement
                  readiness, every tool you need in one place.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {calculatorCategories.map((cat) => (
                    <Badge
                      key={cat}
                      className="px-4 py-1.5 text-sm font-medium rounded-full border"
                      style={{
                        background: "oklch(0.72 0.17 160 / 0.10)",
                        borderColor: "oklch(0.72 0.17 160 / 0.25)",
                        color: "oklch(0.80 0.08 160)",
                      }}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate("/financial-planner")}
                  className="px-8 font-semibold rounded-lg transition-all hover:opacity-90"
                  style={{
                    background: "oklch(0.72 0.17 160)",
                    color: "oklch(0.08 0.01 240)",
                  }}
                  data-ocid="planner.explore.primary_button"
                >
                  Explore All Calculators
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-24 px-6 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.20 0.08 160) 0%, oklch(0.15 0.06 180) 50%, oklch(0.18 0.07 155) 100%)",
        }}
        data-ocid="cta.section"
      >
        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-display font-bold mb-5"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "oklch(0.95 0 0)",
              }}
            >
              Take Control of Your Financial Future
            </h2>
            <p
              className="text-lg mb-10 leading-relaxed"
              style={{ color: "oklch(0.78 0.05 160)" }}
            >
              Join thousands of users who've moved from spreadsheets to a
              unified financial OS. Start today — it's free.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 text-base font-bold rounded-lg transition-all hover:shadow-2xl hover:scale-105"
              style={{
                background: "oklch(0.95 0 0)",
                color: "oklch(0.12 0.05 200)",
              }}
              data-ocid="cta.getstarted.primary_button"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-6 border-t"
        style={{
          background: "oklch(0.07 0.01 240)",
          borderColor: "oklch(0.18 0.01 240)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-md"
                style={{ background: "oklch(0.72 0.17 160 / 0.15)" }}
              >
                <DollarSign
                  className="w-5 h-5"
                  style={{ color: "oklch(0.72 0.17 160)" }}
                />
              </div>
              <span
                className="text-xl font-bold font-display"
                style={{ color: "oklch(0.92 0 0)" }}
              >
                FinanceOS
              </span>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: "Dashboard", path: "/dashboard" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Financial Planner", path: "/financial-planner" },
                { label: "Loans", path: "/loans" },
              ].map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="text-sm transition-colors hover:text-primary"
                  style={{ color: "oklch(0.50 0 0)" }}
                  data-ocid={`footer.${label.toLowerCase().replace(" ", "-")}.link`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs" style={{ color: "oklch(0.40 0 0)" }}>
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Built with ♥ using caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
