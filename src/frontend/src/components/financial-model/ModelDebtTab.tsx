import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Plus,
  Send,
  Sparkles,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";

const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
const fmtC = (n: number) => `₹${fmt(n)}`;

function calcEMI(
  principal: number,
  annualRate: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate <= 0) return Math.round(principal / months);
  const r = annualRate / 12 / 100;
  return Math.round(
    (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1),
  );
}

function monthsFromNow(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + Math.max(0, Math.round(months)));
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

type DebtEntry = {
  id: number;
  name: string;
  balance: number;
  rate: number;
  months: number;
  emi: number;
};

const SCENARIOS: {
  id: string;
  title: string;
  desc: string;
  debts: Omit<DebtEntry, "id">[];
  extra: number;
}[] = [
  {
    id: "multi",
    title: "Scenario 1 — Multiple Debts, Full Plan",
    desc: "Personal loan + credit card + car loan. EMIs total \u20b922,000. \u20b95,000 extra available.",
    debts: [
      { name: "Personal Loan", balance: 350000, rate: 14, months: 30, emi: 0 },
      { name: "Credit Card", balance: 85000, rate: 36, months: 12, emi: 0 },
      { name: "Car Loan", balance: 120000, rate: 9, months: 18, emi: 0 },
    ],
    extra: 5000,
  },
  {
    id: "fourloans",
    title: "Scenario 2 — 4 Loans, \u20b915,000 Extra",
    desc: "4 different loans, \u20b915,000 free each month. Which one to pay first?",
    debts: [
      { name: "Credit Card A", balance: 60000, rate: 36, months: 8, emi: 0 },
      { name: "Personal Loan", balance: 200000, rate: 16, months: 24, emi: 0 },
      { name: "Education Loan", balance: 300000, rate: 10, months: 36, emi: 0 },
      { name: "Vehicle Loan", balance: 150000, rate: 9, months: 20, emi: 0 },
    ],
    extra: 15000,
  },
  {
    id: "minpay",
    title: "Scenario 3 — Credit Card Minimum Payment Trap",
    desc: "Paying only minimum due for 8 months. Balance keeps growing.",
    debts: [
      { name: "Credit Card", balance: 120000, rate: 42, months: 12, emi: 0 },
    ],
    extra: 3000,
  },
  {
    id: "consolidation",
    title: "Scenario 4 — Credit Card Consolidation Decision",
    desc: "Consider taking a personal loan at 14% to close \u20b92,40,000 in credit card debt at 36%.",
    debts: [
      {
        name: "Credit Card Debt (Total)",
        balance: 240000,
        rate: 36,
        months: 18,
        emi: 0,
      },
    ],
    extra: 0,
  },
  {
    id: "sipvsdebt",
    title: "Scenario 5 — SIP vs Debt Payoff",
    desc: "Should you stop your SIP to repay a personal loan faster?",
    debts: [
      { name: "Personal Loan", balance: 250000, rate: 13, months: 24, emi: 0 },
    ],
    extra: 10000,
  },
];

type DebtAnalysis = {
  debts: (DebtEntry & {
    danger: "high" | "medium" | "low";
    totalInterest: number;
  })[];
  totalBalance: number;
  totalEMI: number;
  totalInterest: number;
  extraAvailable: number;
  avalancheMonths: number;
  snowballMonths: number;
  avalancheInterestSaved: number;
  sixMonthPlan: { month: number; action: string; balanceRemaining: number }[];
  consolidationNote: string;
  sipNote: string;
  minPayNote: string;
};

function analyzeDebts(
  debts: DebtEntry[],
  extra: number,
): { result: DebtAnalysis | null; error: string } {
  const valid = debts.filter((d) => d.balance > 0 && d.months > 0);
  if (valid.length === 0)
    return {
      result: null,
      error:
        "Please add at least one debt with a balance greater than 0 and months remaining greater than 0.",
    };
  if (valid.some((d) => d.rate < 0 || d.rate > 100))
    return {
      result: null,
      error: "Interest rate must be between 0% and 100%. Check your entries.",
    };
  if (valid.some((d) => d.balance < 0))
    return { result: null, error: "Debt balance cannot be negative." };
  if (extra < 0)
    return { result: null, error: "Extra monthly payment cannot be negative." };

  const enriched = valid.map((d) => {
    const emi = d.emi > 0 ? d.emi : calcEMI(d.balance, d.rate, d.months);
    const totalInterest = Math.max(0, emi * d.months - d.balance);
    const danger: "high" | "medium" | "low" =
      d.rate >= 24 ? "high" : d.rate >= 12 ? "medium" : "low";
    return { ...d, emi, totalInterest, danger };
  });

  const sortedAvalanche = [...enriched].sort((a, b) => b.rate - a.rate);
  const _sortedSnowball = [...enriched].sort((a, b) => a.balance - b.balance);
  const totalBalance = enriched.reduce((s, d) => s + d.balance, 0);
  const totalEMI = enriched.reduce((s, d) => s + d.emi, 0);
  const totalInterest = enriched.reduce((s, d) => s + d.totalInterest, 0);

  // Estimate months to debt free with extra payments
  const monthlyPayment = totalEMI + extra;
  const avalancheMonths =
    monthlyPayment > 0
      ? Math.max(1, Math.round((totalBalance / monthlyPayment) * 1.15))
      : 999;
  const snowballMonths =
    monthlyPayment > 0
      ? Math.max(1, Math.round((totalBalance / monthlyPayment) * 1.25))
      : 999;
  const normalMonths =
    totalEMI > 0 ? Math.round((totalBalance / totalEMI) * 1.35) : 999;
  const avalancheInterestSaved = Math.round(
    ((totalInterest * (normalMonths - avalancheMonths)) / normalMonths) * 0.6,
  );

  // 6-month plan using avalanche order
  let runBal = totalBalance;
  const sixMonthPlan = Array.from({ length: 6 }, (_, i) => {
    runBal = Math.max(0, runBal - monthlyPayment);
    const topDebt = sortedAvalanche[0];
    return {
      month: i + 1,
      action:
        i === 0
          ? `Pay minimum EMIs on all debts. Direct entire ${fmtC(extra)} extra toward ${topDebt?.name || "highest-rate debt"} (${topDebt?.rate || 0}% interest). This alone saves more than any other action.`
          : i === 1
            ? `Continue. ${topDebt?.name || "High-rate debt"} balance is shrinking. Stay consistent — momentum is building.`
            : i === 2
              ? `If ${topDebt?.name || "first debt"} is cleared by month 3, immediately roll that freed EMI of ${fmtC(topDebt?.emi || 0)} toward the next highest-rate debt.`
              : i === 3
                ? `Debt snowball is accelerating. Total balance should be near ${fmtC(runBal)} by now. Review and adjust if income changed.`
                : i === 4
                  ? "Continue the avalanche. Consider a balance-transfer card or personal loan to consolidate any remaining high-rate credit card debt at a lower rate."
                  : `Month 6 review: recalculate remaining balances and update your debt-free date. Celebrate your progress — you have repaid ${fmtC(totalBalance - runBal)} in 6 months.`,
      balanceRemaining: runBal,
    };
  });

  // Special scenario notes
  const highRateDebt = enriched.find((d) => d.rate >= 30);
  const consolidationNote = highRateDebt
    ? `Consolidation Analysis: Your ${highRateDebt.name} at ${highRateDebt.rate}% is costing you ${fmtC(Math.round((highRateDebt.balance * highRateDebt.rate) / 100 / 12))} per month in interest alone. A personal loan at 13–16% on the same balance of ${fmtC(highRateDebt.balance)} would cost only ${fmtC(Math.round((highRateDebt.balance * 14) / 100 / 12))} per month in interest — saving ${fmtC(Math.round((highRateDebt.balance * (highRateDebt.rate - 14)) / 100 / 12))} monthly. Consolidation makes strong financial sense here if you have a credit score above 700.`
    : "";

  const sipNote = enriched.some((d) => d.rate > 10)
    ? `SIP vs Debt: If your SIP earns 12% annually but your loan charges ${Math.max(...enriched.map((d) => d.rate))}% interest, you are losing ${Math.max(...enriched.map((d) => d.rate)) - 12}% net every year by keeping the SIP running. Pause SIPs on debts above 13% and redirect that money to debt repayment. Once debt-free, restart the SIP with the same amount plus the freed EMIs.`
    : "SIP vs Debt: Your loan rates are moderate (below 12%). In this case, keep your SIPs running — equity compounding at 12%+ over time outpaces the loan cost. Only pause SIPs if you have a cash-flow crisis.";

  const minPayNote = enriched.some((d) => d.rate >= 36)
    ? `Minimum Payment Danger: On a credit card charging ${Math.max(...enriched.filter((d) => d.rate >= 36).map((d) => d.rate))}% per year, paying only the minimum due (typically 5% of balance) means your balance barely reduces. At 36%, a balance of ${fmtC(enriched.filter((d) => d.rate >= 36)[0]?.balance || 0)} accumulates interest of ${fmtC(Math.round((enriched.filter((d) => d.rate >= 36)[0]?.balance || 0) * 0.03))} per month. After 8 months of minimum payments, you have likely paid ${fmtC(Math.round((enriched.filter((d) => d.rate >= 36)[0]?.balance || 0) * 0.03 * 8))} in interest while the principal barely moved. Stop paying minimums immediately and pay as much as possible.`
    : "";

  return {
    result: {
      debts: sortedAvalanche.map(
        (d) => enriched.find((e) => e.id === d.id) || d,
      ) as DebtAnalysis["debts"],
      totalBalance,
      totalEMI,
      totalInterest,
      extraAvailable: extra,
      avalancheMonths,
      snowballMonths,
      avalancheInterestSaved,
      sixMonthPlan,
      consolidationNote,
      sipNote,
      minPayNote,
    },
    error: "",
  };
}

let nextId = 1;

export function ModelDebtTab() {
  const [debts, setDebts] = useState<DebtEntry[]>(
    SCENARIOS[0].debts.map((d) => ({ ...d, id: nextId++ })),
  );
  const [extra, setExtra] = useState(SCENARIOS[0].extra);
  const [result, setResult] = useState<DebtAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeScenario, setActiveScenario] = useState("multi");

  const loadScenario = (s: (typeof SCENARIOS)[0]) => {
    setDebts(s.debts.map((d) => ({ ...d, id: nextId++ })));
    setExtra(s.extra);
    setActiveScenario(s.id);
    setResult(null);
    setError("");
  };

  const updateDebt = (
    id: number,
    field: keyof DebtEntry,
    value: string | number,
  ) =>
    setDebts((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              [field]: typeof value === "string" ? value : Number(value) || 0,
            }
          : d,
      ),
    );

  const addDebt = () =>
    setDebts((prev) => [
      ...prev,
      {
        id: nextId++,
        name: "New Debt",
        balance: 100000,
        rate: 12,
        months: 24,
        emi: 0,
      },
    ]);
  const removeDebt = (id: number) =>
    setDebts((prev) => prev.filter((d) => d.id !== id));

  const handleAnalyze = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const { result: r, error: e } = analyzeDebts(debts, extra);
      if (r) setResult(r);
      else setError(e);
      setLoading(false);
    }, 700);
  };

  const res = result;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl">
        <TrendingDown className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-red-800">
            Debt Management & Repayment Model
          </h3>
          <p className="text-xs text-red-600 mt-0.5">
            Enter each of your debts below. Select a scenario to pre-fill sample
            numbers, then update the values to match your real situation. All
            amounts are in full numbers (e.g., 350000 means ₹3,50,000).
          </p>
        </div>
      </div>

      {/* Scenario Buttons */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">
          Select a scenario (numbers will pre-fill — update any field before
          analyzing):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => loadScenario(s)}
              className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                activeScenario === s.id
                  ? "bg-red-50 border-red-400 text-red-800 font-semibold"
                  : "bg-white border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600"
              }`}
            >
              <span className="font-bold block">{s.title}</span>
              <span className="text-slate-500">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Debt Table Inputs */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Your Debts
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={addDebt}
            className="h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Debt
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-1.5 pr-2 font-semibold text-slate-500">
                  Creditor / Name
                </th>
                <th className="text-right py-1.5 px-2 font-semibold text-slate-500">
                  Balance (₹)
                </th>
                <th className="text-right py-1.5 px-2 font-semibold text-slate-500">
                  Rate (%/yr)
                </th>
                <th className="text-right py-1.5 px-2 font-semibold text-slate-500">
                  Months Left
                </th>
                <th className="text-right py-1.5 px-2 font-semibold text-slate-500">
                  Known EMI (₹)
                </th>
                <th className="py-1.5" />
              </tr>
            </thead>
            <tbody>
              {debts.map((d) => (
                <tr key={d.id} className="border-b border-slate-50">
                  <td className="py-1.5 pr-2">
                    <Input
                      value={d.name}
                      onChange={(e) => updateDebt(d.id, "name", e.target.value)}
                      className="h-7 text-xs min-w-[110px]"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={0}
                      value={d.balance || ""}
                      onChange={(e) =>
                        updateDebt(d.id, "balance", e.target.value)
                      }
                      className="h-7 text-xs text-right min-w-[90px]"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={d.rate || ""}
                      onChange={(e) => updateDebt(d.id, "rate", e.target.value)}
                      className="h-7 text-xs text-right min-w-[60px]"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={1}
                      value={d.months || ""}
                      onChange={(e) =>
                        updateDebt(d.id, "months", e.target.value)
                      }
                      className="h-7 text-xs text-right min-w-[60px]"
                      placeholder="12"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <Input
                      type="number"
                      min={0}
                      value={d.emi || ""}
                      onChange={(e) => updateDebt(d.id, "emi", e.target.value)}
                      className="h-7 text-xs text-right min-w-[80px]"
                      placeholder="Auto-calc"
                    />
                  </td>
                  <td className="py-1.5 pl-1">
                    {debts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDebt(d.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400">
          Leave EMI as 0 to auto-calculate from balance, rate, and months.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-600">
              Extra Monthly Payment (₹)
            </Label>
            <Input
              type="number"
              min={0}
              value={extra || ""}
              onChange={(e) => setExtra(Number(e.target.value) || 0)}
              className="h-8 text-sm"
              placeholder="0"
            />
            <p className="text-xs text-slate-400">
              Amount you can pay above all EMIs each month. Enter 0 if none.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
      >
        {loading ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Building your debt plan...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Build My Debt Freedom Plan
          </>
        )}
      </Button>

      {/* Results */}
      {res && (
        <div className="space-y-4 mt-2">
          {/* Debt Inventory */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">
              📋 Debt Inventory — Ranked by Danger (Highest Rate First)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-2.5 font-semibold text-slate-600">
                      Debt
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Outstanding Balance
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Rate
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Monthly EMI
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Total Interest
                    </th>
                    <th className="text-right p-2.5 font-semibold text-slate-600">
                      Months
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {res.debts.map((d) => (
                    <tr
                      key={d.id}
                      className="border-t border-slate-50 hover:bg-slate-50/50"
                    >
                      <td className="p-2.5 font-medium text-slate-700 flex items-center gap-1.5">
                        {d.danger === "high" && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        )}
                        {d.danger === "medium" && (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        {d.name}
                      </td>
                      <td className="p-2.5 text-right font-semibold text-slate-700">
                        {fmtC(d.balance)}
                      </td>
                      <td
                        className={`p-2.5 text-right font-bold ${
                          d.danger === "high"
                            ? "text-red-600"
                            : d.danger === "medium"
                              ? "text-amber-600"
                              : "text-green-600"
                        }`}
                      >
                        {d.rate}%
                        {d.danger === "high" && (
                          <span className="block text-xs font-normal text-red-400">
                            Danger ⚠️
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-right text-slate-600">
                        {fmtC(d.emi)}
                      </td>
                      <td className="p-2.5 text-right text-red-500">
                        {fmtC(d.totalInterest)}
                      </td>
                      <td className="p-2.5 text-right text-slate-600">
                        {d.months}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
                    <td className="p-2.5 text-slate-700">Total</td>
                    <td className="p-2.5 text-right text-slate-800">
                      {fmtC(res.totalBalance)}
                    </td>
                    <td className="p-2.5" />
                    <td className="p-2.5 text-right text-slate-800">
                      {fmtC(res.totalEMI)}
                    </td>
                    <td className="p-2.5 text-right text-red-600">
                      {fmtC(res.totalInterest)}
                    </td>
                    <td className="p-2.5" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategy Comparison */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">
              ⚖️ Repayment Strategy Comparison
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3 relative">
                <div className="absolute -top-2.5 right-3">
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    Recommended ✓
                  </span>
                </div>
                <p className="text-sm font-bold text-blue-800">
                  🏔️ Avalanche Method
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Pay highest interest rate debt first. Mathematically optimal —
                  saves the most money.
                </p>
                <p className="text-sm font-semibold text-blue-700 mt-2">
                  Debt-free by:{" "}
                  <strong>{monthsFromNow(res.avalancheMonths)}</strong>
                </p>
                <p className="text-sm font-semibold text-blue-700">
                  {res.avalancheMonths} months from today
                </p>
                <p className="text-xs text-green-700 mt-1 font-semibold">
                  Interest saved vs doing nothing:{" "}
                  {fmtC(res.avalancheInterestSaved)}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-sm font-bold text-slate-700">
                  ⛄ Snowball Method
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Pay smallest balance first. Better for motivation but costs
                  more in interest.
                </p>
                <p className="text-sm font-semibold text-slate-600 mt-2">
                  Debt-free by:{" "}
                  <strong>{monthsFromNow(res.snowballMonths)}</strong>
                </p>
                <p className="text-sm font-semibold text-slate-600">
                  {res.snowballMonths} months from today
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Best if you need quick psychological wins to stay motivated.
                </p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mt-2">
              <p className="text-xs text-amber-800">
                💡 <strong>Which to choose?</strong> Use{" "}
                <strong>Avalanche</strong> if you are disciplined and want to
                minimize total interest paid. Use <strong>Snowball</strong> if
                you have struggled to stick to debt plans before — the quick
                wins of clearing small debts first keep you motivated. Both
                work; consistency matters more than method.
              </p>
            </div>
          </div>

          {/* Consolidation Note */}
          {res.consolidationNote && (
            <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-indigo-800">
                  Balance Transfer / Consolidation Analysis
                </p>
                <p className="text-xs text-indigo-700 mt-0.5">
                  {res.consolidationNote}
                </p>
              </div>
            </div>
          )}

          {/* Min Payment Warning */}
          {res.minPayNote && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800">
                  ⚠️ Minimum Payment Danger Zone
                </p>
                <p className="text-xs text-red-700 mt-0.5">{res.minPayNote}</p>
              </div>
            </div>
          )}

          {/* SIP Note */}
          <div className="flex items-start gap-2 bg-teal-50 border border-teal-100 rounded-xl p-3">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-teal-800">
                SIP vs Debt Repayment
              </p>
              <p className="text-xs text-teal-700 mt-0.5">{res.sipNote}</p>
            </div>
          </div>

          {/* 6-Month Roadmap */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">
              🗓️ 6-Month Repayment Roadmap (Avalanche)
            </h4>
            <div className="space-y-2">
              {res.sixMonthPlan.map((m) => (
                <div
                  key={m.month}
                  className="flex items-start gap-3 bg-white border border-slate-100 rounded-lg p-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                    M{m.month}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700">{m.action}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-600">
                      {fmtC(m.balanceRemaining)}
                    </p>
                    <p className="text-xs text-slate-400">remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debt Freedom Date */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
            <p className="text-base font-bold text-emerald-800">
              🎯 Your Debt Freedom Date (Avalanche)
            </p>
            <p className="text-xl font-bold text-emerald-700 mt-1">
              {monthsFromNow(res.avalancheMonths)}
            </p>
            <p className="text-sm text-emerald-600 mt-1">
              {res.avalancheMonths} months from today with{" "}
              {fmtC(res.extraAvailable)}/month extra payment
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              Total interest saved by using Avalanche:{" "}
              <strong>{fmtC(res.avalancheInterestSaved)}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
