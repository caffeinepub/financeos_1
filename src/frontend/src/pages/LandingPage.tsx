import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LineChart,
  Moon,
  PiggyBank,
  Shield,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SUPPORTED_CURRENCIES, useCurrency } from "../contexts/CurrencyContext";
import { useTheme } from "../contexts/ThemeContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useNavigate } from "../lib/router-compat";

const MODULE_CONFIGS = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    tagline: "Your complete financial health at a glance",
    desc: "Net worth, Risk-o-meter, 10+ charts & 20-year forecast",
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.18)",
    gradientFrom: "#1e40af",
    gradientTo: "#3b82f6",
  },
  {
    icon: Target,
    name: "Goals",
    tagline: "Turn life dreams into actionable saving plans",
    desc: "Track & plan every financial milestone with SIP guidance",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.18)",
    gradientFrom: "#065f46",
    gradientTo: "#10b981",
  },
  {
    icon: TrendingUp,
    name: "Portfolio",
    tagline: "Track all your investments — equity, MFs, gold, crypto and more",
    desc: "8 asset classes with real-time P&L and allocation analysis",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.18)",
    gradientFrom: "#0c4a6e",
    gradientTo: "#0ea5e9",
  },
  {
    icon: PiggyBank,
    name: "Budgeting",
    tagline: "Understand where your money goes with 50/30/20 intelligence",
    desc: "Income vs expense tracker, insights & improvement plans",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.18)",
    gradientFrom: "#4c1d95",
    gradientTo: "#8b5cf6",
  },
  {
    icon: BarChart3,
    name: "Financial Model",
    tagline: "Run institutional-grade scenarios on your own finances",
    desc: "8 models: Asset Allocation, Goal Planning, Debt, Retirement",
    accent: "#f87171",
    glow: "rgba(248,113,113,0.18)",
    gradientFrom: "#7f1d1d",
    gradientTo: "#ef4444",
  },
  {
    icon: CalendarDays,
    name: "Financial Planner",
    tagline: "35+ calculators built for the Indian investor",
    desc: "SIP, FIRE, EMI, Tax, Retirement — all in one place",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.18)",
    gradientFrom: "#78350f",
    gradientTo: "#f59e0b",
  },
  {
    icon: Shield,
    name: "Learn Finance",
    tagline: "25 chapters, 50 mistake maps, and AI-guided rules",
    desc: "Tier-by-tier learning from basics to advanced investing",
    accent: "#2dd4bf",
    glow: "rgba(45,212,191,0.18)",
    gradientFrom: "#134e4a",
    gradientTo: "#14b8a6",
  },
  {
    icon: CreditCard,
    name: "Loans",
    tagline: "Track debt, simulate prepayments, and plan your debt-free date",
    desc: "Loan health dashboard, affordability check & repayment model",
    accent: "#c084fc",
    glow: "rgba(192,132,252,0.18)",
    gradientFrom: "#581c87",
    gradientTo: "#a855f7",
  },
  {
    icon: BookOpen,
    name: "Trade Journal",
    tagline: "Log, analyze, and improve every trade you make",
    desc: "Live P&L, analytics, strategy breakdown & monthly heatmap",
    accent: "#fb923c",
    glow: "rgba(251,146,60,0.18)",
    gradientFrom: "#7c2d12",
    gradientTo: "#f97316",
  },
];

const STATS = [
  { value: "35+", label: "Calculators", color: "#818cf8" },
  { value: "10", label: "Modules", color: "#34d399" },
  { value: "50", label: "Mistake Guides", color: "#fbbf24" },
  { value: "8", label: "Asset Classes", color: "#f87171" },
  { value: "25", label: "Learn Chapters", color: "#38bdf8" },
];

const FEATURE_PILLS = [
  { icon: "⚡", text: "Instant Calculations" },
  { icon: "📱", text: "Mobile-First Design" },
  { icon: "🔒", text: "Blockchain Security" },
  { icon: "🌍", text: "20+ Currencies" },
  { icon: "🧠", text: "AI-Guided Insights" },
  { icon: "📊", text: "Institutional Models" },
];

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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" data-ocid="currency.dropdown_menu">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors min-w-[130px] justify-between backdrop-blur-sm"
        data-ocid="currency.select.toggle"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-white/90 font-medium">{selected.country}</span>
          <span className="font-bold" style={{ color: "#a5b4fc" }}>
            {selected.symbol}
          </span>
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 text-white/60 transition-transform flex-shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-60 rounded-xl border border-white/20 shadow-2xl z-50 overflow-hidden"
          style={{
            background: "rgba(15,23,42,0.98)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="max-h-72 overflow-y-auto">
            {SUPPORTED_CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                data-ocid={`currency.${c.code.toLowerCase()}.select`}
                onClick={() => {
                  onSelect(c);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  selected.code === c.code
                    ? "bg-indigo-500/30 font-semibold"
                    : "hover:bg-white/8"
                }`}
                style={{
                  color:
                    selected.code === c.code
                      ? "#a5b4fc"
                      : "rgba(203,213,225,0.9)",
                }}
              >
                <span className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span>{c.country}</span>
                </span>
                <span
                  className="font-bold"
                  style={{ color: "#818cf8", marginLeft: 8 }}
                >
                  {c.symbol}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { country, setCountry } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isLoggingIn = loginStatus === "logging-in";

  // Hidden admin trigger
  const [_adminClickCount, setAdminClickCount] = useState(0);
  const [adminClickTimer, setAdminClickTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleAdminZoneClick = useCallback(() => {
    setAdminClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowAdminModal(true);
        setAdminClickTimer((t) => {
          if (t) clearTimeout(t);
          return null;
        });
        return 0;
      }
      setAdminClickTimer((t) => {
        if (t) clearTimeout(t);
        return setTimeout(() => setAdminClickCount(0), 10000);
      });
      return next;
    });
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === "288nitK!") {
      setShowAdminModal(false);
      setAdminPassword("");
      navigate("/admin");
    } else {
      setAdminError("Incorrect password");
    }
  };

  useEffect(() => {
    return () => {
      if (adminClickTimer) clearTimeout(adminClickTimer);
    };
  }, [adminClickTimer]);

  useEffect(() => {
    if (identity && !identity.getPrincipal().isAnonymous()) {
      navigate("/dashboard");
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    await login();
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #070d1f 0%, #0d1535 20%, #160b2e 45%, #071220 70%, #050e20 100%)",
      }}
    >
      {/* Decorative ambient glows */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(79,70,229,0.22) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-2/3 left-[-5%] w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 65%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Top Nav */}
      <header
        className="sticky top-0 z-40 border-b border-white/8 backdrop-blur-2xl"
        style={{ background: "rgba(7,13,31,0.75)" }}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 4px 20px rgba(79,70,229,0.5)",
              }}
            >
              <LineChart
                className="w-4.5 h-4.5 text-white"
                style={{ width: 18, height: 18 }}
              />
            </div>
            <div>
              <p className="font-extrabold text-sm text-white leading-none tracking-tight">
                Growfinfire Global
              </p>
              <p
                className="text-[10px] leading-none mt-0.5 hidden sm:block"
                style={{ color: "#a5b4fc" }}
              >
                Learn Finance. Grow Wealth. Achieve Freedom.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              data-ocid="landing.theme.toggle"
              className="p-2 rounded-lg border border-white/15 bg-white/8 hover:bg-white/15 text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.07)" }}
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <CurrencyDropdown selected={country} onSelect={setCountry} />
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="landing.login.primary_button"
              className="text-sm font-bold px-5 h-9 rounded-xl shadow-lg border-0 transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 4px 18px rgba(79,70,229,0.45)",
              }}
            >
              {isLoggingIn ? "Signing in..." : "Login"}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        {/* ── Hero Section ── */}
        <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="space-y-7"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold"
              style={{
                borderColor: "rgba(99,102,241,0.5)",
                background: "rgba(79,70,229,0.12)",
                color: "#a5b4fc",
              }}
            >
              <Sparkles className="w-3 h-3" />
              AI-powered financial operating system for India &amp; beyond
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
              Learn Finance.{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, #00C9FF 0%, #43e97b 45%, #f8c030 80%, #00C9FF 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Grow Wealth.
              </span>
              <br />
              <span className="text-white">Achieve Freedom.</span>
            </h1>

            {/* Sub-headline — the WHY */}
            <p
              className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
              style={{ color: "rgba(148,163,184,0.95)" }}
            >
              One platform for every financial decision —{" "}
              <span style={{ color: "#93c5fd" }}>invest smarter</span>,{" "}
              <span style={{ color: "#6ee7b7" }}>budget better</span>,{" "}
              <span style={{ color: "#fde68a" }}>retire free</span>.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                data-ocid="landing.hero.primary_button"
                className="font-bold px-8 h-12 rounded-xl text-sm border-0 relative overflow-hidden transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #4f46e5 100%)",
                  boxShadow:
                    "0 8px 30px rgba(79,70,229,0.5), 0 2px 8px rgba(0,0,0,0.3)",
                  minWidth: 200,
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                {isLoggingIn ? "Signing in..." : "Start for Free"}
              </Button>
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: "#818cf8" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#c4b5fd";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#818cf8";
                }}
              >
                Login to existing account
                <span aria-hidden>→</span>
              </button>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
            className="mt-16 inline-flex flex-wrap justify-center items-center gap-0 rounded-2xl border overflow-hidden"
            style={{
              borderColor: "rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-6 sm:px-8 py-4 text-center relative"
                style={{
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                }}
              >
                <div
                  className="text-3xl font-black tracking-tight leading-none"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[11px] font-medium mt-1 uppercase tracking-wider"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="mt-7 flex flex-wrap justify-center gap-2"
          >
            {FEATURE_PILLS.map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(203,213,225,0.8)",
                }}
              >
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Module Cards Section ── */}
        <section className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Everything you need in one platform
            </h2>
            <p
              className="text-sm sm:text-base max-w-xl mx-auto"
              style={{ color: "rgba(100,116,139,1)" }}
            >
              9 purpose-built modules covering every aspect of personal finance
              — from daily budgets to 20-year retirement projections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MODULE_CONFIGS.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.name}
                  data-ocid={`landing.module_card.item.${i + 1}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: "easeOut",
                  }}
                  className="group rounded-2xl border relative overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1.5"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${mod.accent}50`;
                    el.style.boxShadow = `0 12px 40px ${mod.glow}, 0 0 0 1px ${mod.accent}20`;
                    el.style.background = "rgba(255,255,255,0.065)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                    el.style.boxShadow = "none";
                    el.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  {/* Colored top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${mod.gradientFrom}, ${mod.accent})`,
                    }}
                  />

                  <div className="p-5 pt-6">
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${mod.gradientFrom}60 0%, ${mod.gradientTo}30 100%)`,
                        border: `1px solid ${mod.accent}25`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: mod.accent }} />
                    </div>

                    {/* Module name */}
                    <h3 className="text-sm font-extrabold text-white leading-tight mb-1">
                      {mod.name}
                    </h3>

                    {/* Tagline — the WHY */}
                    <p
                      className="text-[11px] font-semibold mb-2 leading-snug"
                      style={{ color: mod.accent }}
                    >
                      {mod.tagline}
                    </p>

                    {/* Description */}
                    <p
                      className="text-[12px] leading-relaxed"
                      style={{ color: "rgba(100,116,139,1)" }}
                    >
                      {mod.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── AI Assistant Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl mb-14 border"
          style={{
            borderColor: "rgba(99,102,241,0.35)",
            background:
              "linear-gradient(135deg, rgba(55,48,163,0.4) 0%, rgba(109,40,217,0.3) 50%, rgba(30,64,175,0.25) 100%)",
          }}
        >
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(165,180,252,0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Glow accent */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 65%)",
            }}
          />

          <div className="relative z-10 p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Bot icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border"
              style={{
                background:
                  "linear-gradient(135deg, rgba(79,70,229,0.6) 0%, rgba(124,58,237,0.5) 100%)",
                borderColor: "rgba(165,180,252,0.3)",
                boxShadow: "0 8px 24px rgba(79,70,229,0.35)",
              }}
            >
              <Bot className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-extrabold text-white text-lg">
                  Growfinfire AI Assistant
                </h3>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    background: "rgba(165,180,252,0.15)",
                    borderColor: "rgba(165,180,252,0.3)",
                    color: "#a5b4fc",
                  }}
                >
                  Included Free
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mb-1"
                style={{ color: "rgba(203,213,225,0.75)" }}
              >
                Your personal CFO in your pocket. Ask about SIPs, FIRE goals,
                portfolio design, tax-saving strategies, and more — trained on
                all 10 modules, 35+ calculators, 50 financial mistake maps, and
                real Indian market data.
              </p>
              <p className="text-xs font-medium" style={{ color: "#818cf8" }}>
                Available on every page after you log in.
              </p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="landing.ai.primary_button"
              className="font-bold text-sm px-6 h-11 rounded-xl flex-shrink-0 border-0 transition-all duration-200 hover:scale-[1.04] hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
                color: "#4338ca",
                boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
              }}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Try it free
            </Button>
          </div>
        </motion.section>

        {/* ── Value Proposition Cards ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4"
        >
          {[
            {
              icon: Shield,
              color: "#34d399",
              glow: "rgba(52,211,153,0.15)",
              title: "Secure & Private",
              desc: "Powered by Internet Identity — no passwords, no data leaks, no third-party access.",
            },
            {
              icon: TrendingUp,
              color: "#60a5fa",
              glow: "rgba(96,165,250,0.15)",
              title: "20+ Currencies",
              desc: "Manage wealth in INR, USD, GBP, EUR and 16 more with smart Cr/L/K or M/B formatting.",
            },
            {
              icon: BarChart3,
              color: "#a78bfa",
              glow: "rgba(167,139,250,0.15)",
              title: "Institutional Models",
              desc: "Insurance, retirement, crypto & portfolio models — the kind only wealth managers had before.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border p-5 flex items-start gap-4 group transition-all duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${f.color}35`;
                  el.style.boxShadow = `0 8px 30px ${f.glow}`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}25`,
                  }}
                >
                  <Icon
                    className="w-4.5 h-4.5"
                    style={{ width: 18, height: 18, color: f.color }}
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-white mb-1">{f.title}</p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(100,116,139,1)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.section>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t py-6 text-center text-xs"
        style={{
          borderColor: "rgba(255,255,255,0.07)",
          color: "rgba(71,85,105,0.9)",
        }}
      >
        &copy; {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="transition-colors"
          style={{ color: "rgba(71,85,105,0.9)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#818cf8";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(71,85,105,0.9)";
          }}
        >
          Built with &#10084; using caffeine.ai
        </a>
      </footer>

      {/* Hidden admin trigger zone — bottom-right corner */}
      <div
        className="fixed bottom-0 right-0 w-8 h-8 z-50 cursor-default"
        onClick={handleAdminZoneClick}
        onKeyDown={handleAdminZoneClick}
        aria-hidden="true"
        role="presentation"
      />

      {/* Admin password modal */}
      {showAdminModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.65)" }}
        >
          <div
            className="rounded-2xl p-6 w-80 shadow-2xl border"
            style={{
              background: "rgba(15,23,42,0.98)",
              borderColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(24px)",
            }}
          >
            <h2 className="text-base font-semibold text-white mb-4">
              Admin Access
            </h2>
            <input
              type="password"
              placeholder="Enter admin password"
              className="w-full rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 border"
              style={{
                background: "rgba(255,255,255,0.07)",
                borderColor: "rgba(255,255,255,0.15)",
                color: "white",
              }}
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                setAdminError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
            />
            {adminError && (
              <p className="text-xs mb-2" style={{ color: "#f87171" }}>
                {adminError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAdminLogin}
                className="flex-1 text-white text-sm py-2 rounded-lg font-medium transition-colors"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdminModal(false);
                  setAdminPassword("");
                  setAdminError("");
                }}
                className="flex-1 text-sm py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(148,163,184,1)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
