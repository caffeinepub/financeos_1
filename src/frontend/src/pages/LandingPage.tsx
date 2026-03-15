import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  PiggyBank,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SUPPORTED_CURRENCIES, useCurrency } from "../contexts/CurrencyContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// Module icon colors — distinct per module
const MODULE_COLORS = [
  {
    bg: "oklch(0.93 0.06 240)",
    icon: "oklch(0.45 0.20 240)",
    border: "oklch(0.85 0.10 240)",
  }, // Dashboard → blue
  {
    bg: "oklch(0.93 0.06 290)",
    icon: "oklch(0.45 0.20 290)",
    border: "oklch(0.85 0.10 290)",
  }, // Goals → violet
  {
    bg: "oklch(0.93 0.06 185)",
    icon: "oklch(0.45 0.15 185)",
    border: "oklch(0.85 0.10 185)",
  }, // Portfolio → teal
  {
    bg: "oklch(0.93 0.06 145)",
    icon: "oklch(0.42 0.18 145)",
    border: "oklch(0.85 0.10 145)",
  }, // Budgeting → green
  {
    bg: "oklch(0.93 0.06 265)",
    icon: "oklch(0.40 0.20 265)",
    border: "oklch(0.85 0.10 265)",
  }, // Financial Model → indigo
  {
    bg: "oklch(0.95 0.08 55)",
    icon: "oklch(0.55 0.18 55)",
    border: "oklch(0.88 0.12 55)",
  }, // Financial Planner → orange
  {
    bg: "oklch(0.94 0.06 355)",
    icon: "oklch(0.52 0.18 355)",
    border: "oklch(0.87 0.10 355)",
  }, // Financial Rules → pink
  {
    bg: "oklch(0.95 0.07 85)",
    icon: "oklch(0.58 0.18 85)",
    border: "oklch(0.88 0.12 85)",
  }, // Loans → amber
];

const modules = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    tagline: "Complete financial overview",
    description:
      "Net worth, asset breakdown, and key performance metrics at a glance.",
    path: "/dashboard",
  },
  {
    icon: Target,
    name: "Goals",
    tagline: "Turn ambitions into milestones",
    description:
      "Set, track, and achieve financial goals with visual progress and milestone planning.",
    path: "/goals",
  },
  {
    icon: TrendingUp,
    name: "Portfolio",
    tagline: "8 asset classes, one view",
    description:
      "Manage Retirement, Mutual Funds, ETFs, Crypto, Commodities, Real Estate, and more.",
    path: "/portfolio",
  },
  {
    icon: PiggyBank,
    name: "Budgeting",
    tagline: "Know your savings position",
    description:
      "Monthly income vs. planned vs. actual expense tracking with category-level insights.",
    path: "/budgeting",
  },
  {
    icon: BarChart3,
    name: "Financial Model",
    tagline: "Scenario-plan your future",
    description:
      "Advanced modeling across Asset Allocation, Portfolio, Retirement, Insurance, and Crypto.",
    path: "/financial-model",
  },
  {
    icon: CalendarDays,
    name: "Financial Planner",
    tagline: "35+ professional calculators",
    description:
      "Calculators across Investment, Retirement, Loan & EMI, Tax, Savings, and Life Planning.",
    path: "/financial-planner",
  },
  {
    icon: Shield,
    name: "Financial Rules",
    tagline: "AI-guided money decisions",
    description:
      "80+ knowledge-base rules with AI-driven risk-profile recommendations (Conservative, Moderate, Aggressive).",
    path: "/financial-rules",
  },
  {
    icon: CreditCard,
    name: "Loans",
    tagline: "Know every debt detail",
    description:
      "Track all loan accounts with amortization schedules, payoff planning, and interest analysis.",
    path: "/loans",
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
      "Track 8 asset classes in one unified view. Real-time allocation breakdowns, growth projections, and diversification analysis.",
    stat: "8",
    statLabel: "Asset Classes",
    color: "oklch(0.45 0.20 240)",
    bgColor: "oklch(0.93 0.06 240)",
  },
  {
    icon: PiggyBank,
    title: "Smart Budgeting",
    description:
      "Monthly income vs. planned vs. actual expense tracking with visual breakdowns. Know your net savings position at every moment.",
    stat: "360°",
    statLabel: "Budget View",
    color: "oklch(0.42 0.18 145)",
    bgColor: "oklch(0.93 0.06 145)",
  },
  {
    icon: CalendarDays,
    title: "Financial Planning",
    description:
      "From SIP to FIRE to retirement readiness — 35+ professional-grade calculators with charts, projections, and actionable insights.",
    stat: "35+",
    statLabel: "Calculators",
    color: "oklch(0.55 0.18 55)",
    bgColor: "oklch(0.95 0.08 55)",
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
  selected: { country: string; code: string; symbol: string; flag: string };
  onSelect: (c: {
    country: string;
    code: string;
    symbol: string;
    flag: string;
  }) => void;
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
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:shadow-sm"
        style={{
          borderColor: "oklch(0.88 0.02 240)",
          color: "oklch(0.30 0.02 240)",
          background: "oklch(0.97 0.005 240)",
        }}
        data-ocid="currency.select.toggle"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="font-bold" style={{ color: "oklch(0.45 0.20 270)" }}>
          {selected.symbol}
        </span>
        <span
          className="hidden sm:inline text-xs font-semibold"
          style={{ color: "oklch(0.40 0.02 240)" }}
        >
          {selected.code}
        </span>
        <ChevronDown
          className="w-3 h-3 transition-transform"
          style={{
            color: "oklch(0.55 0.02 240)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl border overflow-hidden z-50"
          style={{
            background: "#ffffff",
            borderColor: "oklch(0.90 0.01 240)",
            maxHeight: "320px",
            overflowY: "auto",
            boxShadow: "0 8px 32px oklch(0.15 0.05 240 / 0.15)",
          }}
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onSelect(c);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
              style={{
                color:
                  c.code === selected.code
                    ? "oklch(0.45 0.20 270)"
                    : "oklch(0.30 0.02 240)",
                background:
                  c.code === selected.code
                    ? "oklch(0.93 0.06 270)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (c.code !== selected.code) {
                  (e.currentTarget as HTMLElement).style.background =
                    "oklch(0.97 0.005 240)";
                }
              }}
              onMouseLeave={(e) => {
                if (c.code !== selected.code) {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }
              }}
              data-ocid={`currency.option.${c.code.toLowerCase()}`}
            >
              <span className="text-base">{c.flag}</span>
              <span
                className="font-bold w-8"
                style={{ color: "oklch(0.45 0.20 270)" }}
              >
                {c.symbol}
              </span>
              <span className="flex-1 font-medium">{c.code}</span>
              <span
                className="text-xs"
                style={{ color: "oklch(0.58 0.01 240)" }}
              >
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
  const { login, isLoggingIn } = useInternetIdentity();
  const { country: selectedCurrency, setCountry: setSelectedCurrency } =
    useCurrency();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "#ffffff", color: "oklch(0.15 0.01 240)" }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 border-b"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          borderColor: "oklch(0.92 0.01 240)",
          boxShadow: "0 1px 8px oklch(0.15 0.05 240 / 0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "oklch(0.93 0.06 270)" }}
          >
            <DollarSign
              className="w-4.5 h-4.5"
              style={{ color: "oklch(0.45 0.20 270)" }}
            />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "oklch(0.45 0.20 270)" }}
          >
            FinanceOS
          </span>
        </div>

        {/* Right: Currency + Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          <CurrencyDropdown
            selected={selectedCurrency}
            onSelect={setSelectedCurrency}
          />
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="text-xs sm:text-sm font-bold px-4 py-2 h-auto rounded-lg"
            style={{
              background: "oklch(0.45 0.20 270)",
              color: "#ffffff",
            }}
            data-ocid="nav.login.primary_button"
          >
            {isLoggingIn ? "Signing in..." : "Login"}
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative px-4 sm:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #ffffff 0%, oklch(0.96 0.015 265) 50%, oklch(0.94 0.02 270) 100%)",
        }}
        data-ocid="hero.section"
      >
        {/* Subtle grid lines background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.88 0.04 270 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.04 270 / 0.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Right glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, oklch(0.70 0.15 270 / 0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Trust badge */}
          <AnimatedSection delay={0}>
            <div className="mb-6 sm:mb-8">
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border"
                style={{
                  background: "oklch(0.93 0.06 270)",
                  borderColor: "oklch(0.80 0.12 270)",
                  color: "oklch(0.40 0.20 270)",
                }}
              >
                <Zap className="w-3 h-3" />
                All-in-One Financial Platform
              </span>
            </div>
          </AnimatedSection>

          {/* Headline */}
          <AnimatedSection delay={100}>
            <h1
              className="font-display font-bold mb-5 leading-tight"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
                color: "oklch(0.15 0.01 240)",
                letterSpacing: "-0.02em",
              }}
            >
              Smart Investing,{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.45 0.20 270), oklch(0.55 0.15 185))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Starts Here
              </span>
            </h1>
          </AnimatedSection>

          {/* Sub-headline */}
          <AnimatedSection delay={200}>
            <p
              className="text-base sm:text-lg max-w-2xl mb-8 sm:mb-10 leading-relaxed"
              style={{ color: "oklch(0.42 0.02 240)" }}
            >
              One intelligent platform to track your portfolio, plan your goals,
              and manage every{" "}
              <span
                className="font-bold"
                style={{ color: "oklch(0.45 0.20 270)" }}
              >
                {selectedCurrency.symbol}
              </span>{" "}
              with precision. Built for serious investors.
            </p>
          </AnimatedSection>

          {/* CTAs */}
          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12 sm:mb-16">
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full sm:w-auto px-8 py-3 text-base font-bold rounded-xl transition-all hover:opacity-90"
                style={{
                  background: "oklch(0.45 0.20 270)",
                  color: "#ffffff",
                  boxShadow: "0 4px 20px oklch(0.45 0.20 270 / 0.35)",
                }}
                data-ocid="hero.login.primary_button"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToFeatures}
                className="w-full sm:w-auto px-8 py-3 text-base font-semibold rounded-xl transition-all"
                style={{
                  borderColor: "oklch(0.75 0.10 270)",
                  color: "oklch(0.45 0.20 270)",
                  background: "transparent",
                }}
                data-ocid="hero.explore.secondary_button"
              >
                Explore Modules
              </Button>
            </div>
          </AnimatedSection>

          {/* Stats bar */}
          <AnimatedSection delay={400}>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {[
                { value: "35+", label: "Calculators" },
                { value: "8", label: "Asset Classes" },
                { value: "8", label: "Core Modules" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border"
                  style={{
                    background: "#ffffff",
                    borderColor: "oklch(0.88 0.04 270)",
                    boxShadow: "0 2px 8px oklch(0.45 0.20 270 / 0.08)",
                  }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "oklch(0.45 0.20 270)" }}
                  >
                    {value}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.50 0.02 240)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Module Grid */}
      <section
        id="features"
        className="py-16 sm:py-24 px-4 sm:px-8"
        style={{ background: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-10 sm:mb-14">
              <p
                className="text-sm font-bold tracking-widest uppercase mb-2"
                style={{ color: "oklch(0.45 0.20 270)" }}
              >
                Everything you need
              </p>
              <h2
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  color: "oklch(0.15 0.01 240)",
                  letterSpacing: "-0.02em",
                }}
              >
                8 Powerful Modules
              </h2>
              <p
                className="mt-3 max-w-lg text-base"
                style={{ color: "oklch(0.48 0.02 240)" }}
              >
                From daily budgeting to long-term retirement modeling — every
                dimension of your financial life, in one place.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {modules.map((mod, i) => {
              const colors = MODULE_COLORS[i];
              return (
                <AnimatedSection key={mod.name} delay={i * 60}>
                  <Link
                    to={mod.path}
                    className="block h-full"
                    data-ocid={`modules.item.${i + 1}`}
                  >
                    <div
                      className="group h-full p-5 rounded-2xl border cursor-pointer transition-all duration-200"
                      style={{
                        background: "#ffffff",
                        borderColor: "oklch(0.91 0.01 240)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = colors.border;
                        el.style.boxShadow = `0 4px 24px ${colors.icon}22`;
                        el.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.borderColor = "oklch(0.91 0.01 240)";
                        el.style.boxShadow = "none";
                        el.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Icon circle */}
                      <div
                        className="flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                        style={{ background: colors.bg }}
                      >
                        <mod.icon
                          className="w-5 h-5"
                          style={{ color: colors.icon }}
                        />
                      </div>

                      {/* Module name */}
                      <h3
                        className="font-bold text-base mb-1"
                        style={{ color: "oklch(0.18 0.01 240)" }}
                      >
                        {mod.name}
                      </h3>

                      {/* Tagline */}
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{ color: colors.icon }}
                      >
                        {mod.tagline}
                      </p>

                      {/* Description */}
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "oklch(0.52 0.01 240)" }}
                      >
                        {mod.description}
                      </p>

                      {/* Arrow on hover */}
                      <div
                        className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: colors.icon }}
                      >
                        Open module <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section
        className="py-16 sm:py-24 px-4 sm:px-8"
        style={{ background: "oklch(0.97 0.005 240)" }}
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 sm:mb-16">
              <p
                className="text-sm font-bold tracking-widest uppercase mb-2"
                style={{ color: "oklch(0.45 0.20 270)" }}
              >
                Core strengths
              </p>
              <h2
                className="font-display font-bold"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  color: "oklch(0.15 0.01 240)",
                  letterSpacing: "-0.02em",
                }}
              >
                Built on Three Pillars
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <AnimatedSection key={pillar.title} delay={i * 100}>
                <div
                  className="relative p-6 sm:p-8 rounded-2xl border h-full"
                  style={{
                    background: "#ffffff",
                    borderColor: "oklch(0.91 0.01 240)",
                    borderLeft: `4px solid ${pillar.color}`,
                    boxShadow: "0 2px 12px oklch(0.15 0.05 240 / 0.05)",
                  }}
                >
                  {/* Large stat number */}
                  <div
                    className="font-display font-bold mb-1"
                    style={{
                      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                      color: pillar.color,
                      lineHeight: 1,
                    }}
                  >
                    {pillar.stat}
                  </div>
                  <div
                    className="text-sm font-bold mb-5 tracking-wide uppercase"
                    style={{ color: pillar.color }}
                  >
                    {pillar.statLabel}
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-lg"
                      style={{ background: pillar.bgColor }}
                    >
                      <pillar.icon
                        className="w-5 h-5"
                        style={{ color: pillar.color }}
                      />
                    </div>
                    <h3
                      className="font-bold text-lg"
                      style={{ color: "oklch(0.18 0.01 240)" }}
                    >
                      {pillar.title}
                    </h3>
                  </div>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.50 0.01 240)" }}
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
      <section
        className="py-16 sm:py-24 px-4 sm:px-8"
        style={{ background: "#ffffff" }}
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div
              className="relative rounded-3xl overflow-hidden p-8 sm:p-12 md:p-14"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.20 270) 0%, oklch(0.55 0.15 185) 100%)",
              }}
            >
              {/* Subtle dot overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              {/* Top-right decorative circles */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.20)" }}
                  >
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white/80 tracking-wide uppercase">
                    Financial Planner Module
                  </span>
                </div>

                <h2
                  className="font-display font-bold text-white mb-3"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Professional-Grade Financial Calculators
                </h2>
                <p
                  className="max-w-xl mb-8 text-base leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.80)" }}
                >
                  From SIP step-up to FIRE number to loan amortization — 35+
                  calculators with live charts for every financial decision.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {calculatorCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold border"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        borderColor: "rgba(255,255,255,0.30)",
                        color: "rgba(255,255,255,0.95)",
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <Button
                  size="lg"
                  onClick={() => navigate("/financial-planner")}
                  className="px-8 font-bold rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
                  style={{
                    background: "#ffffff",
                    color: "oklch(0.45 0.20 270)",
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

      {/* Trust / Feature highlights strip */}
      <section
        className="py-12 px-4 sm:px-8 border-y"
        style={{
          background: "oklch(0.97 0.005 240)",
          borderColor: "oklch(0.91 0.01 240)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: CheckCircle2,
                text: "Per-user data isolation & privacy",
                color: "oklch(0.42 0.18 145)",
              },
              {
                icon: Shield,
                text: "Secured with Internet Identity",
                color: "oklch(0.45 0.20 270)",
              },
              {
                icon: Zap,
                text: "Instant calculations, zero lag",
                color: "oklch(0.55 0.18 55)",
              },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex flex-col items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.35 0.02 240)" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-20 sm:py-28 px-4 sm:px-8 text-center"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.45 0.20 270) 0%, oklch(0.38 0.18 290) 50%, oklch(0.35 0.15 300) 100%)",
        }}
        data-ocid="cta.section"
      >
        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-display font-bold text-white mb-4"
              style={{
                fontSize: "clamp(1.75rem, 5vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Take Control of Your Financial Future
            </h2>
            <p
              className="text-base sm:text-lg mb-10 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              Join thousands of investors managing every{" "}
              <span className="font-bold text-white">
                {selectedCurrency.symbol}
              </span>{" "}
              with clarity and confidence.
            </p>
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="px-10 py-4 text-base font-bold rounded-xl transition-all hover:shadow-2xl hover:scale-105"
              style={{
                background: "#ffffff",
                color: "oklch(0.45 0.20 270)",
                boxShadow: "0 4px 32px rgba(0,0,0,0.20)",
              }}
              data-ocid="cta.login.primary_button"
            >
              {isLoggingIn ? "Signing in..." : "Get Started — It's Free"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer
        className="py-10 px-4 sm:px-8 border-t"
        style={{
          background: "oklch(0.97 0.005 240)",
          borderColor: "oklch(0.91 0.01 240)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ background: "oklch(0.93 0.06 270)" }}
              >
                <DollarSign
                  className="w-4 h-4"
                  style={{ color: "oklch(0.45 0.20 270)" }}
                />
              </div>
              <span
                className="text-lg font-bold"
                style={{ color: "oklch(0.45 0.20 270)" }}
              >
                FinanceOS
              </span>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                { label: "Dashboard", path: "/dashboard" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Financial Planner", path: "/financial-planner" },
                { label: "Loans", path: "/loans" },
              ].map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  style={{ color: "oklch(0.50 0.02 240)" }}
                  data-ocid={`footer.${label.toLowerCase().replace(" ", "-")}.link`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <p
              className="text-xs text-center md:text-right"
              style={{ color: "oklch(0.58 0.01 240)" }}
            >
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "oklch(0.45 0.20 270)" }}
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
