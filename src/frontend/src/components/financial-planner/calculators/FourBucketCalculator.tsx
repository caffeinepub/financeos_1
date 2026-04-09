import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";

const BUCKETS = [
  {
    key: "b1",
    label: "Bucket 1: Monthly Expenses",
    subtitle: "Liquid / Cash",
    horizon: "1–2 years",
    pct: 0.1,
    rateDefault: "4",
    rateLabel: "Liquid Return (% p.a.)",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-500",
    borderColor: "#3b82f6",
    tip: "Park in savings account, liquid funds, or short-term FD. Must be instantly accessible.",
  },
  {
    key: "b2",
    label: "Bucket 2: Short-Term Income",
    subtitle: "Bonds / Stable Assets",
    horizon: "1–5 years",
    pct: 0.15,
    rateDefault: "7",
    rateLabel: "Short-term Return (% p.a.)",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    badge: "bg-green-500",
    borderColor: "#10b981",
    tip: "Bonds, debt mutual funds, RDs. Refills Bucket 1 every 1–2 years.",
  },
  {
    key: "b3",
    label: "Bucket 3: Medium-Term Income",
    subtitle: "Balanced / Income Assets",
    horizon: "5–10 years",
    pct: 0.25,
    rateDefault: "9",
    rateLabel: "Medium-term Return (% p.a.)",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    badge: "bg-amber-500",
    borderColor: "#f59e0b",
    tip: "Balanced funds, REITs, dividend stocks. Refills Bucket 2 every 3–5 years.",
  },
  {
    key: "b4",
    label: "Bucket 4: Long-Term Growth",
    subtitle: "Equity / Growth Assets",
    horizon: "10+ years",
    pct: 0.5,
    rateDefault: "12",
    rateLabel: "Long-term Return (% p.a.)",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    badge: "bg-purple-500",
    borderColor: "#8b5cf6",
    tip: "Index funds, equity mutual funds, growth stocks. Feeds all other buckets over time.",
  },
];

export function FourBucketCalculator() {
  const { formatCurrency, country } = useCurrency();
  const sym = country.symbol;

  const [corpus, setCorpus] = useState("10000000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("80000");
  const [rates, setRates] = useState<Record<string, string>>({
    b1: "4",
    b2: "7",
    b3: "9",
    b4: "12",
  });

  const result = useMemo(() => {
    const C = Number.parseFloat(corpus) || 0;
    const ME = Number.parseFloat(monthlyExpenses) || 0;
    const annualExpenses = ME * 12;

    return BUCKETS.map((b) => {
      const amount = C * b.pct;
      const rate = (Number.parseFloat(rates[b.key]) || 0) / 100;
      const annualIncome = amount * rate;
      // Net annual draw from bucket (expenses share proportional to its weight among non-growth buckets)
      const netDraw = annualExpenses * b.pct - annualIncome;
      const years = netDraw > 0 ? amount / netDraw : amount > 0 ? 99 : 0;
      return {
        ...b,
        amount,
        rate,
        annualIncome,
        years: Math.min(99, Math.max(0, years)),
        pctLabel: `${(b.pct * 100).toFixed(0)}%`,
      };
    });
  }, [corpus, monthlyExpenses, rates]);

  const totalCorpus = Number.parseFloat(corpus) || 0;

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <Card className="rounded-2xl shadow-sm border border-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span>🪣</span>
            4-Bucket Strategy Inputs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <Label>Total Corpus ({sym})</Label>
              <Input
                value={corpus}
                onChange={(e) => setCorpus(e.target.value)}
                type="number"
                min="0"
                step="100000"
                data-ocid="fourbucket.corpus.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Monthly Expenses ({sym})</Label>
              <Input
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                type="number"
                min="0"
                step="1000"
                data-ocid="fourbucket.expenses.input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BUCKETS.map((b) => (
              <div key={b.key} className="space-y-1">
                <Label className="text-xs">
                  B{b.key.slice(1)} Return (% p.a.)
                </Label>
                <Input
                  value={rates[b.key]}
                  onChange={(e) =>
                    setRates((prev) => ({ ...prev, [b.key]: e.target.value }))
                  }
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  data-ocid={`fourbucket.${b.key}.rate`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bucket Results */}
      <Card className="rounded-2xl shadow-sm border border-slate-100 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-200 dark:border-teal-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">4-Bucket Allocation</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total corpus: {formatCurrency(totalCorpus)} — split across 4 buckets
            by time horizon
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.map((b, idx) => (
            <div
              key={b.key}
              className={`p-3 ${b.bg} rounded-xl border-l-4`}
              style={{ borderLeftColor: b.borderColor }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full ${b.badge} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${b.text}`}>
                      {b.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.subtitle} · {b.horizon}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold ${b.text} text-sm`}>
                    {formatCurrency(b.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{b.pctLabel}</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${b.pct * 100}%`,
                    backgroundColor: b.borderColor,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                <span title={b.tip}>💡 {b.tip}</span>
              </div>
              {b.annualIncome > 0 && (
                <p className={`text-xs mt-1 ${b.text} font-medium`}>
                  Annual income: {formatCurrency(b.annualIncome)} · Sustains ~
                  {b.years > 50 ? "50+" : b.years.toFixed(1)} years
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Flow diagram */}
      <Card className="rounded-2xl shadow-sm border border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>🔄</span>
            How Money Flows Between Buckets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {(
              [
                { label: "B4\nGrowth", color: "bg-purple-100 text-purple-700" },
                { label: "→", color: "" },
                { label: "B3\nMedium", color: "bg-amber-100 text-amber-700" },
                { label: "→", color: "" },
                { label: "B2\nShort", color: "bg-green-100 text-green-700" },
                { label: "→", color: "" },
                { label: "B1\nExpenses", color: "bg-blue-100 text-blue-700" },
              ] as { label: string; color: string }[]
            ).map((item) => {
              if (item.label === "→") {
                return (
                  <span
                    key={item.label + item.color}
                    className="text-muted-foreground text-lg flex-shrink-0"
                  >
                    →
                  </span>
                );
              }
              return (
                <div
                  key={item.label}
                  className={`${item.color} rounded-lg px-3 py-2 text-xs font-semibold text-center flex-shrink-0 whitespace-pre-line`}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Bucket 4 (growth) feeds Bucket 3 every 5–10 years → Bucket 3 feeds
            Bucket 2 every 3–5 years → Bucket 2 refills Bucket 1 every 1–2 years
            → Bucket 1 covers monthly expenses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
