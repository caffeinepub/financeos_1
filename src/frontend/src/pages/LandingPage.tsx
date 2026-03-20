import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Bot,
  CalendarDays,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUPPORTED_CURRENCIES, useCurrency } from "../contexts/CurrencyContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const MODULE_CONFIGS = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    desc: "Net worth, asset breakdown & 20-year forecast",
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
  },
  {
    icon: Target,
    name: "Goals",
    desc: "Set, track & hit every financial milestone",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.15)",
  },
  {
    icon: TrendingUp,
    name: "Portfolio",
    desc: "8 asset classes in one unified view",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.15)",
  },
  {
    icon: PiggyBank,
    name: "Budgeting",
    desc: "Income vs expense monthly tracker",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
  },
  {
    icon: BarChart3,
    name: "Financial Model",
    desc: "Insurance, allocation & retirement models",
    accent: "#f87171",
    glow: "rgba(248,113,113,0.15)",
  },
  {
    icon: CalendarDays,
    name: "Financial Planner",
    desc: "35+ professional calculators",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.15)",
  },
  {
    icon: Shield,
    name: "Learn Finance",
    desc: "AI-guided money rules & knowledge base",
    accent: "#2dd4bf",
    glow: "rgba(45,212,191,0.15)",
  },
  {
    icon: CreditCard,
    name: "Loans",
    desc: "Track EMIs, payoff & amortization",
    accent: "#c084fc",
    glow: "rgba(192,132,252,0.15)",
  },
];

const STATS = [
  { value: "35+", label: "Calculators" },
  { value: "8", label: "Asset Classes" },
  { value: "80+", label: "Finance Rules" },
  { value: "50", label: "Mistake Guides" },
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
          <span className="font-bold text-indigo-300">{selected.symbol}</span>
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 text-white/60 transition-transform flex-shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-60 rounded-xl border border-white/20 shadow-2xl bg-slate-900/95 backdrop-blur-xl z-50 overflow-hidden">
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
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-indigo-500/20 ${
                  selected.code === c.code
                    ? "bg-indigo-500/30 text-indigo-300 font-semibold"
                    : "text-slate-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span>{c.country}</span>
                </span>
                <span className="font-bold text-indigo-400 ml-2">
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
  const navigate = useNavigate();
  const isLoggingIn = loginStatus === "logging-in";

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
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 70%, #0c1a2e 100%)",
      }}
    >
      {/* Decorative ambient glows */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #2563eb 0%, transparent 70%)",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl bg-slate-900/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              }}
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-white leading-none tracking-tight">
                Growfinfire Global
              </p>
              <p className="text-[10px] text-indigo-300 leading-none mt-0.5 hidden sm:block">
                Learn Finance. Grow Wealth. Achieve Freedom.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <CurrencyDropdown selected={country} onSelect={setCountry} />
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="landing.login.primary_button"
              className="text-sm font-semibold px-5 h-9 rounded-lg shadow-lg border-0"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 4px 15px rgba(79,70,229,0.4)",
              }}
            >
              {isLoggingIn ? "Signing in..." : "Login"}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3 h-3" />
              AI-powered financial operating system
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Learn Finance.{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #60a5fa 100%)",
                }}
              >
                Grow Wealth.
              </span>
              <br />
              Achieve Freedom.
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Your complete financial companion — track, plan, and grow your
              wealth with institutional-grade tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                data-ocid="landing.hero.primary_button"
                className="font-bold px-8 h-12 rounded-xl text-sm border-0 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 8px 25px rgba(79,70,229,0.45)",
                }}
              >
                {isLoggingIn ? "Signing in..." : "Get Started — Free"}
              </Button>
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="text-sm text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
              >
                Login to existing account →
              </button>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-14 inline-flex items-center gap-6 sm:gap-10 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-2xl font-extrabold text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${["#818cf8", "#34d399", "#fbbf24", "#f87171"][i % 4]} 0%, white 100%)`,
                  }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Module Cards */}
        <section className="mb-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Everything you need in one place
            </h2>
            <p className="text-sm text-slate-500">
              8 powerful modules covering every aspect of personal finance
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {MODULE_CONFIGS.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.name}
                  data-ocid={`landing.module_card.item.${i + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.07,
                    ease: "easeOut",
                  }}
                  className="group rounded-2xl border border-white/10 p-4 cursor-default hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 0 0 0 ${mod.glow}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      `0 8px 30px ${mod.glow}, 0 0 0 1px ${mod.accent}30`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      `0 0 0 0 ${mod.glow}`;
                  }}
                >
                  {/* Accent line top */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: mod.accent }}
                  />
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${mod.accent}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: mod.accent }} />
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight mb-1">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-snug">
                    {mod.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* AI Assistant Callout */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl mb-10 border border-indigo-500/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.3) 0%, rgba(124,58,237,0.25) 50%, rgba(37,99,235,0.2) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20"
              style={{ background: "rgba(79,70,229,0.4)" }}
            >
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-base">
                  Growfinfire AI Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wide">
                  Included
                </span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Ask anything about your finances — SIP, FIRE, portfolio design,
                tax, retirement, and more. Trained on all 8 modules &amp; 35+
                calculators.
              </p>
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="landing.ai.primary_button"
              className="bg-white text-indigo-700 hover:bg-white/90 font-bold text-sm px-5 h-10 rounded-xl flex-shrink-0 border-0"
              style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
            >
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Try it free
            </Button>
          </div>
        </motion.section>

        {/* Feature highlights strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            {
              icon: Shield,
              color: "#34d399",
              title: "Secure & Private",
              desc: "Powered by Internet Identity — no passwords, no leaks.",
            },
            {
              icon: TrendingUp,
              color: "#60a5fa",
              title: "20 Currencies",
              desc: "Manage wealth in INR, USD, GBP, EUR and 16 more.",
            },
            {
              icon: BarChart3,
              color: "#a78bfa",
              title: "Institutional Models",
              desc: "Insurance, retirement, crypto & portfolio models built-in.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 p-5 flex items-start gap-3"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${f.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{f.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-indigo-400 transition-colors"
        >
          Built with ❤ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
