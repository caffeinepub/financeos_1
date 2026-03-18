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
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUPPORTED_CURRENCIES, useCurrency } from "../contexts/CurrencyContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const MODULE_CONFIGS = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    desc: "Net worth, asset breakdown & 20-year forecast",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    icon: Target,
    name: "Goals",
    desc: "Set, track & hit every financial milestone",
    color: "#059669",
    bg: "#f0fdf4",
    border: "#a7f3d0",
  },
  {
    icon: TrendingUp,
    name: "Portfolio",
    desc: "8 asset classes in one unified view",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
  },
  {
    icon: PiggyBank,
    name: "Budgeting",
    desc: "Income vs expense monthly tracker",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
  },
  {
    icon: BarChart3,
    name: "Financial Model",
    desc: "Insurance, allocation & retirement models",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
  },
  {
    icon: CalendarDays,
    name: "Financial Planner",
    desc: "35+ professional calculators",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    icon: Shield,
    name: "Learn Finance",
    desc: "AI-guided money rules & knowledge base",
    color: "#0d9488",
    bg: "#f0fdfa",
    border: "#99f6e4",
  },
  {
    icon: CreditCard,
    name: "Loans",
    desc: "Track EMIs, payoff & amortization",
    color: "#9333ea",
    bg: "#fdf4ff",
    border: "#e9d5ff",
  },
];

const TRUST_METRICS = [
  { icon: CalendarDays, value: "35+", label: "Calculators" },
  { icon: BarChart3, value: "8", label: "Asset Classes" },
  { icon: Shield, value: "80+", label: "Finance Rules" },
  { icon: Bot, value: "AI", label: "Assistant" },
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium bg-white hover:bg-slate-50 transition-colors shadow-sm min-w-[130px] justify-between"
        data-ocid="currency.select.toggle"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-slate-700 font-medium">{selected.country}</span>
          <span className="font-bold text-indigo-600">{selected.symbol}</span>
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 text-slate-400 transition-transform flex-shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-60 rounded-xl border border-slate-200 shadow-2xl bg-white z-50 overflow-hidden">
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
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-indigo-50 ${
                  selected.code === c.code
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span>{c.country}</span>
                </span>
                <span className="font-bold text-indigo-600 ml-2">
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
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900 leading-none tracking-tight">
                Growfinfire Global
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5 hidden sm:block">
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 h-9 rounded-lg shadow-sm"
            >
              {isLoggingIn ? "Signing in..." : "Login"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 text-center overflow-hidden">
          {/* Animated dot-grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #c7d2fe 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.55,
            }}
          />
          {/* Glow blobs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-200 rounded-full opacity-20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3 h-3" />
              AI-powered financial operating system
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your complete{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)",
                }}
              >
                financial platform
              </span>
            </h1>

            <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Track investments, plan goals, model scenarios, and learn finance
              — all in one intelligent platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                data-ocid="landing.hero.primary_button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 h-11 rounded-xl shadow-md text-sm"
              >
                {isLoggingIn ? "Signing in..." : "Get Started — Free"}
              </Button>
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="text-sm text-indigo-600 font-semibold hover:underline underline-offset-2 transition-colors"
              >
                Login to existing account →
              </button>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-slate-900 leading-none">
                      {m.value}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {m.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Module Cards */}
        <section className="mb-10">
          <div className="text-center mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              8 Powerful Modules
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {MODULE_CONFIGS.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.name}
                  data-ocid={`landing.module_card.item.${i + 1}`}
                  className="group bg-white rounded-2xl border shadow-sm p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
                  style={{ borderColor: mod.border }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: mod.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: mod.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-snug">
                    {mod.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Assistant Callout */}
        <section className="relative overflow-hidden rounded-2xl mb-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #4338ca 0%, #6d28d9 40%, #1d4ed8 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
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
              <p className="text-sm text-white/80 leading-relaxed">
                Ask anything about your finances — SIP, FIRE, portfolio design,
                tax, retirement, and more. Trained on all 8 modules &amp; 35+
                calculators.
              </p>
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="landing.ai.primary_button"
              className="bg-white text-indigo-700 hover:bg-white/90 font-semibold text-sm px-5 h-10 rounded-xl flex-shrink-0 shadow-lg"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Try it free
            </Button>
          </div>
        </section>

        {/* Feature highlights strip */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">
                Secure & Private
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Powered by Internet Identity — no passwords, no leaks.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">20 Currencies</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage wealth in INR, USD, GBP, EUR and 16 more.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-violet-100 p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">
                Institutional Models
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Insurance, retirement, crypto & portfolio models built-in.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-indigo-600 transition-colors"
        >
          Built with ❤ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
