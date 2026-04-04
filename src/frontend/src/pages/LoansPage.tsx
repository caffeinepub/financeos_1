import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  DollarSign,
  GraduationCap,
  Home,
  Pencil,
  PiggyBank,
  Plus,
  Shield,
  Trash2,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Loan } from "../backend.d";
import { TransactionType } from "../backend.d";
import { ModelDebtTab } from "../components/financial-model/ModelDebtTab";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useCurrency } from "../contexts/CurrencyContext";
import { useActor } from "../hooks/useActor";

const emptyForm = {
  name: "",
  loanType: "",
  principal: 0,
  interestRate: 0,
  termMonths: 12,
  startDate: "",
  currentBalance: 0,
  monthlyPayment: 0,
  notes: "",
};

const LOAN_TYPES = [
  { value: "Home", label: "Home Loan", icon: Home, color: "#3b82f6" },
  { value: "Car", label: "Car Loan", icon: CreditCard, color: "#10b981" },
  {
    value: "Personal",
    label: "Personal Loan",
    icon: DollarSign,
    color: "#f59e0b",
  },
  {
    value: "Education",
    label: "Education Loan",
    icon: GraduationCap,
    color: "#8b5cf6",
  },
  {
    value: "CreditCard",
    label: "Credit Card",
    icon: CreditCard,
    color: "#ef4444",
  },
  { value: "Other", label: "Other", icon: PiggyBank, color: "#64748b" },
];

function getLoanTypeInfo(type: string) {
  return (
    LOAN_TYPES.find((t) => t.value === type) ??
    LOAN_TYPES[LOAN_TYPES.length - 1]
  );
}

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

function calcAmortization(
  balance: number,
  annualRate: number,
  emi: number,
): { month: number; balance: number; principal: number; interest: number }[] {
  const result: {
    month: number;
    balance: number;
    principal: number;
    interest: number;
  }[] = [];
  let bal = balance;
  const r = annualRate / 12 / 100;
  let m = 0;
  while (bal > 0 && m < 600) {
    const interest = r > 0 ? bal * r : 0;
    const principal = emi - interest;
    if (principal <= 0) break; // EMI too low to cover interest, exit
    const actualPrincipal = Math.min(principal, bal);
    bal = Math.max(0, bal - actualPrincipal);
    result.push({
      month: m + 1,
      balance: Math.round(bal),
      principal: Math.round(actualPrincipal),
      interest: Math.round(interest),
    });
    m++;
  }
  return result;
}

function calcHealthScore(loan: Loan): number {
  // Score based on rate (lower = better) and progress (higher = better)
  const ratePenalty = Math.min(loan.interestRate / 36, 1) * 40; // 0-40 penalty
  const progress =
    loan.principal > 0
      ? (loan.principal - loan.currentBalance) / loan.principal
      : 0;
  const progressBonus = progress * 40; // 0-40 bonus
  return Math.round(
    Math.max(0, Math.min(100, 60 - ratePenalty + progressBonus)),
  );
}

function healthLabel(score: number) {
  if (score >= 70)
    return {
      label: "Healthy",
      color: "#10b981",
      bg: "bg-card",
      text: "text-emerald-700 dark:text-green-700",
    };
  if (score >= 40)
    return {
      label: "Moderate",
      color: "#f59e0b",
      bg: "bg-card",
      text: "text-amber-700 dark:text-amber-300",
    };
  return {
    label: "High Risk",
    color: "#ef4444",
    bg: "bg-card",
    text: "text-red-700 dark:text-red-300",
  };
}

function debtBurdenLabel(pct: number) {
  if (pct < 30)
    return {
      label: "Safe",
      color: "text-emerald-600 dark:text-green-600",
      icon: BadgeCheck,
    };
  if (pct < 50)
    return {
      label: "Caution",
      color: "text-amber-600 dark:text-amber-400",
      icon: AlertTriangle,
    };
  return {
    label: "Danger",
    color: "text-red-600 dark:text-red-400",
    icon: AlertTriangle,
  };
}

export default function LoansPage() {
  const { actor } = useActor();
  const { formatCurrency: fmt, country } = useCurrency();
  const sym = country?.symbol ?? "₹";
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Loan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Dashboard - income from Budgeting module current month
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [incomeLoaded, setIncomeLoaded] = useState(false);

  // Prepayment simulator
  const [selectedLoanId, setSelectedLoanId] = useState<string>("");
  const [extraPayment, setExtraPayment] = useState(5000);

  // Loan vs Invest
  const [lviSurplus, setLviSurplus] = useState(10000);
  const [lviLoanRate, setLviLoanRate] = useState(10);
  const [lviInvestRate, setLviInvestRate] = useState(12);

  // Affordability
  const [affIncome, setAffIncome] = useState(100000);
  const [affExistingEmi, setAffExistingEmi] = useState(0);

  // Debt-free
  const [dfExtra, setDfExtra] = useState(0);

  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllLoans()
      .then(setLoans)
      .finally(() => setLoading(false));
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is stable
  useEffect(load, [actor]);

  // Load income from budgeting module
  useEffect(() => {
    if (!actor || incomeLoaded) return;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    actor
      .getAllTransactions()
      .then((txns) => {
        const monthIncome = txns
          .filter((t) => {
            const d = new Date(t.date);
            return (
              d.getMonth() === month &&
              d.getFullYear() === year &&
              t.transactionType === TransactionType.Income
            );
          })
          .reduce((s, t) => s + t.amount, 0);
        if (monthIncome > 0) setMonthlyIncome(monthIncome);
        setIncomeLoaded(true);
      })
      .catch(() => setIncomeLoaded(true));
  }, [actor, incomeLoaded]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (l: Loan) => {
    setEditing(l);
    setForm({
      name: l.name,
      loanType: l.loanType,
      principal: l.principal,
      interestRate: l.interestRate,
      termMonths: Number(l.termMonths),
      startDate: l.startDate,
      currentBalance: l.currentBalance,
      monthlyPayment: l.monthlyPayment,
      notes: l.notes ?? "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const payload = {
        id: editing ? editing.id : crypto.randomUUID(),
        name: form.name,
        loanType: form.loanType,
        principal: Number(form.principal),
        interestRate: Number(form.interestRate),
        termMonths: BigInt(Math.round(Number(form.termMonths))),
        startDate: form.startDate,
        currentBalance: Number(form.currentBalance),
        monthlyPayment: Number(form.monthlyPayment),
        notes: form.notes,
      };
      if (editing) {
        await actor.updateLoan(editing.id, payload as never);
      } else {
        await actor.createLoan(payload as never);
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    await actor.deleteLoan(id);
    load();
  };

  const f =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const val =
        e.target.type === "number"
          ? Number.parseFloat(e.target.value) || 0
          : e.target.value;
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  // Computed stats
  const totalOutstanding = loans.reduce((s, l) => s + l.currentBalance, 0);
  const totalEMI = loans.reduce((s, l) => s + l.monthlyPayment, 0);
  const debtBurden = monthlyIncome > 0 ? (totalEMI / monthlyIncome) * 100 : 0;
  const avgHealthScore =
    loans.length > 0
      ? Math.round(
          loans.reduce((s, l) => s + calcHealthScore(l), 0) / loans.length,
        )
      : 0;

  // Prepayment simulator
  const simLoan = loans.find((l) => l.id === selectedLoanId) ?? loans[0];
  const prepaySim = useMemo(() => {
    if (!simLoan) return null;
    const monthlyRate = simLoan.interestRate / 100 / 12;
    // Use the actual EMI from loan record, or calculate from outstanding balance and remaining tenure
    const remainingTenure = Number(simLoan.termMonths);
    const emi =
      simLoan.monthlyPayment ||
      calcEMI(simLoan.currentBalance, simLoan.interestRate, remainingTenure);

    // Without prepayment: use actual amortization for accuracy
    const withoutPrepay = calcAmortization(
      simLoan.currentBalance,
      simLoan.interestRate,
      emi,
    );
    const origTotalInterest = withoutPrepay.reduce((s, r) => s + r.interest, 0);
    const origMonths = withoutPrepay.length;

    // With prepayment: run amortization with extra payment to find actual months
    const withPrepay = calcAmortization(
      simLoan.currentBalance,
      simLoan.interestRate,
      emi + extraPayment,
    );
    const newTotalInterest = withPrepay.reduce((s, r) => s + r.interest, 0);

    const _ = monthlyRate; // used for reference

    const origDate = new Date();
    origDate.setMonth(origDate.getMonth() + origMonths);
    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() + withPrepay.length);

    return {
      origMonths,
      newMonths: withPrepay.length,
      monthsSaved: Math.max(0, origMonths - withPrepay.length),
      origTotalInterest,
      newTotalInterest,
      interestSaved: Math.max(0, origTotalInterest - newTotalInterest),
      origDate: origDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      newDate: newDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [simLoan, extraPayment]);

  // Debt-free timeline
  const debtTimeline = useMemo(() => {
    if (loans.length === 0)
      return { data: [], debtFreeDate: "", withPrepayDate: "" };
    const maxMonths = 360;
    const data: { month: string; balance: number; withPrepay: number }[] = [];
    let balances = loans.map((l) => ({
      ...l,
      bal: l.currentBalance,
      termMonths: Number(l.termMonths),
    }));
    let balancesExtra = loans.map((l) => ({
      ...l,
      bal: l.currentBalance,
      termMonths: Number(l.termMonths),
    }));
    for (let m = 0; m <= maxMonths; m++) {
      const total = balances.reduce((s, l) => s + l.bal, 0);
      const totalExtra = balancesExtra.reduce((s, l) => s + l.bal, 0);
      if (m % 6 === 0) {
        const d = new Date();
        d.setMonth(d.getMonth() + m);
        data.push({
          month: d.toLocaleDateString("en-IN", {
            month: "short",
            year: "2-digit",
          }),
          balance: Math.round(total),
          withPrepay: Math.round(totalExtra),
        });
      }
      if (total <= 0 && totalExtra <= 0) break;
      balances = balances.map((l) => {
        if (l.bal <= 0) return l;
        const r = l.interestRate / 12 / 100;
        const interest = l.bal * r;
        const principal = Math.max(0, l.monthlyPayment - interest);
        return { ...l, bal: Math.max(0, l.bal - principal) };
      });
      balancesExtra = balancesExtra.map((l, idx) => {
        if (l.bal <= 0) return l;
        const r = l.interestRate / 12 / 100;
        const interest = l.bal * r;
        const extra = idx === 0 ? dfExtra : 0; // apply extra to first loan
        const principal = Math.max(0, l.monthlyPayment + extra - interest);
        return { ...l, bal: Math.max(0, l.bal - principal) };
      });
    }
    const dfMonths = data.findIndex((d) => d.balance <= 0);
    const dfDate = new Date();
    dfDate.setMonth(
      dfDate.getMonth() + (dfMonths >= 0 ? dfMonths * 6 : maxMonths),
    );
    const dfExtraMonths = data.findIndex((d) => d.withPrepay <= 0);
    const dfExtraDate = new Date();
    dfExtraDate.setMonth(
      dfExtraDate.getMonth() +
        (dfExtraMonths >= 0 ? dfExtraMonths * 6 : maxMonths),
    );
    return {
      data: data.filter((d) => d.balance > 0 || d.withPrepay > 0),
      debtFreeDate: dfDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      withPrepayDate: dfExtraDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [loans, dfExtra]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  const burden = debtBurdenLabel(debtBurden);
  const BurdenIcon = burden.icon;
  const health = healthLabel(avgHealthScore);

  // Loan vs invest calc
  const lviYears = 5;
  const recommend = lviLoanRate >= lviInvestRate;
  const lviTable = Array.from({ length: lviYears }, (_, i) => {
    const yr = i + 1;
    const invested =
      (lviSurplus * ((1 + lviInvestRate / 100 / 12) ** (yr * 12) - 1)) /
      (lviInvestRate / 100 / 12);
    const saved = lviSurplus * 12 * yr * (lviLoanRate / 100);
    return {
      year: `Year ${yr}`,
      invested: Math.round(invested),
      saved: Math.round(saved),
    };
  });

  // Affordability
  const maxEMI = affIncome * 0.5;
  const available = Math.max(0, maxEMI - affExistingEmi);
  const affStatus =
    affExistingEmi > maxEMI
      ? "danger"
      : affExistingEmi > maxEMI * 0.8
        ? "caution"
        : "safe";
  const affTenures = [60, 120, 240];
  const affRate = 9;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Loan Manager</h1>
            <p className="text-xs text-muted-foreground">
              Track, simulate &amp; optimise your debt
            </p>
          </div>
        </div>
        <Button
          data-ocid="loans.open_modal_button"
          size="sm"
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
        >
          <Plus className="w-4 h-4" /> Add Loan
        </Button>
      </div>

      <Tabs defaultValue="loantracker" className="space-y-4">
        <div className="overflow-x-auto pb-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-2">
          <TabsList className="flex gap-2 bg-transparent h-auto flex-nowrap min-w-max">
            {[
              { value: "loantracker", label: "🏦 Loan Tracker" },
              { value: "prepayment", label: "⚡ Prepayment" },
              { value: "loanandinvest", label: "🤔 Loan vs Invest" },
              { value: "affordability", label: "✅ Affordability" },
              { value: "timeline", label: "📅 Debt-Free" },
              { value: "debtmodel", label: "💳 Debt Model" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-ocid={`loans.${tab.value}.tab`}
                className="text-xs whitespace-nowrap px-3 py-1.5 rounded-full border transition-all duration-200 flex-shrink-0 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-slate-800 data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ─── TAB 1: Dashboard ─── */}
        <TabsContent value="loantracker" className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-card rounded-xl border border-border">
            <Shield className="w-4 h-4 text-blue-400 shrink-0" />
            <Label className="text-xs text-muted-foreground">
              Your Monthly Income
            </Label>
            <Input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="ml-auto w-36 h-8 text-xs bg-card border-border text-foreground"
              data-ocid="loans.income.input"
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 dark:border-blue-800 px-4 py-3">
              <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-1">
                Total Outstanding
              </p>
              <p className="text-sm font-bold text-blue-800 dark:text-blue-200 tabular-nums">
                {fmt(totalOutstanding)}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 dark:border-indigo-800 px-4 py-3">
              <p className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-1">
                Total EMI / Month
              </p>
              <p className="text-sm font-bold text-indigo-800 dark:text-indigo-200 tabular-nums">
                {fmt(totalEMI)}
              </p>
            </div>
            <div
              className={`rounded-xl border px-4 py-3 ${debtBurden > 50 ? "border-red-100 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:border-red-800" : debtBurden > 35 ? "border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:border-amber-800" : "border-green-100 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:border-green-800"}`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${debtBurden > 50 ? "text-red-700 dark:text-red-300" : debtBurden > 35 ? "text-amber-700 dark:text-amber-300" : "text-green-700 dark:text-green-300"}`}
              >
                Debt Burden
              </p>
              <p
                className={`text-sm font-bold tabular-nums ${debtBurden > 50 ? "text-red-800 dark:text-red-200" : debtBurden > 35 ? "text-amber-800 dark:text-amber-200" : "text-green-800 dark:text-green-200"}`}
              >
                {debtBurden.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <BurdenIcon className={`w-3 h-3 ${burden.color}`} />
                <span className={`text-[10px] ${burden.color}`}>
                  {burden.label}
                </span>
              </div>
            </div>
            <div
              className={`rounded-xl border px-4 py-3 ${avgHealthScore >= 70 ? "border-green-100 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:border-green-800" : avgHealthScore >= 40 ? "border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:border-amber-800" : "border-red-100 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:border-red-800"}`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${avgHealthScore >= 70 ? "text-green-700 dark:text-green-300" : avgHealthScore >= 40 ? "text-amber-700 dark:text-amber-300" : "text-red-700 dark:text-red-300"}`}
              >
                Health Score
              </p>
              <p
                className={`text-sm font-bold tabular-nums ${avgHealthScore >= 70 ? "text-green-800 dark:text-green-200" : avgHealthScore >= 40 ? "text-amber-800 dark:text-amber-200" : "text-red-800 dark:text-red-200"}`}
              >
                {loans.length > 0 ? avgHealthScore : "—"}
              </p>
              <span className={`text-[10px] ${health.text}`}>
                {loans.length > 0 ? health.label : "No loans"}
              </span>
            </div>
          </div>
          <div className="border-t border-border my-4" />

          {loans.length === 0 ? (
            <div
              data-ocid="loans.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No active loans</p>
              <p className="text-xs mt-1">
                Add your first loan to track it here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan, idx) => {
                const score = calcHealthScore(loan);
                const h = healthLabel(score);
                const typeInfo = getLoanTypeInfo(loan.loanType);
                const TypeIcon = typeInfo.icon;
                const progress =
                  loan.principal > 0
                    ? ((loan.principal - loan.currentBalance) /
                        loan.principal) *
                      100
                    : 0;
                const emi =
                  loan.monthlyPayment ||
                  calcEMI(
                    loan.currentBalance,
                    loan.interestRate,
                    Number(loan.termMonths),
                  );
                const startDate = loan.startDate
                  ? new Date(loan.startDate)
                  : new Date();
                const monthsElapsed = Math.max(
                  0,
                  Math.round(
                    (Date.now() - startDate.getTime()) /
                      (30.44 * 24 * 3600 * 1000),
                  ),
                );
                const totalPaid = emi * monthsElapsed;
                const principalPaid = loan.principal - loan.currentBalance;
                const interestPaid = Math.max(0, totalPaid - principalPaid);
                const totalInterest =
                  principalPaid + interestPaid > 0
                    ? (interestPaid / (principalPaid + interestPaid)) * 100
                    : 50;
                const _pPct = 100 - totalInterest;
                void _pPct;
                return (
                  <Card
                    key={loan.id}
                    data-ocid={`loans.item.${idx + 1}`}
                    className="bg-card border-border overflow-hidden"
                  >
                    <div
                      className="h-1"
                      style={{ backgroundColor: typeInfo.color }}
                    />
                    <CardContent className="p-4">
                      {/* Header: name + type + health score + edit/delete */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${typeInfo.color}20` }}
                          >
                            <TypeIcon
                              className="w-4 h-4"
                              style={{ color: typeInfo.color }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {loan.name}
                            </p>
                            <Badge
                              className="text-[10px] px-1.5 py-0"
                              style={{
                                backgroundColor: `${typeInfo.color}20`,
                                color: typeInfo.color,
                              }}
                            >
                              {typeInfo.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-center px-2.5 py-1 rounded-lg border ${score >= 70 ? "border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800" : score >= 40 ? "border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800" : "border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800"}`}
                          >
                            <p className={`text-base font-bold ${h.text}`}>
                              {score}
                            </p>
                            <p className={`text-[10px] ${h.text}`}>{h.label}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-muted"
                            onClick={() => openEdit(loan)}
                            data-ocid={`loans.edit_button.${idx + 1}`}
                          >
                            <Pencil className="w-3 h-3 text-muted-foreground" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-red-100 dark:hover:bg-red-900/40"
                            onClick={() => handleDelete(loan.id)}
                            data-ocid={`loans.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      {/* Metrics grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
                        <div className="bg-muted/50 dark:bg-slate-800/50 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground">
                            Outstanding
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {fmt(loan.currentBalance)}
                          </p>
                        </div>
                        <div className="bg-muted/50 dark:bg-slate-800/50 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground">
                            EMI/Month
                          </p>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-300">
                            {fmt(emi)}
                          </p>
                        </div>
                        <div className="bg-muted/50 dark:bg-slate-800/50 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground">
                            Interest Rate
                          </p>
                          <p className="text-sm font-bold text-amber-600 dark:text-amber-300">
                            {loan.interestRate}% p.a.
                          </p>
                        </div>
                        <div className="bg-muted/50 dark:bg-slate-800/50 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground">
                            Tenure
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {Number(loan.termMonths)} mo
                          </p>
                        </div>
                      </div>
                      {/* Repayment progress */}
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Repaid</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── TAB 2: Prepayment Simulator ─── */}
        <TabsContent value="prepayment" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <Zap className="w-4 h-4 text-yellow-400" /> Prepayment Impact
                Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loans.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Add a loan first to simulate prepayment impact.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-foreground/80 mb-1 block">
                        Select Loan
                      </Label>
                      <select
                        className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
                        value={selectedLoanId || (loans[0]?.id ?? "")}
                        onChange={(e) => setSelectedLoanId(e.target.value)}
                        data-ocid="loans.prepayment.select"
                      >
                        {loans.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name} ({fmt(l.currentBalance)} outstanding)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-foreground/80 mb-1 block">
                        Extra Monthly Payment ({sym})
                      </Label>
                      <Input
                        type="number"
                        value={extraPayment}
                        onChange={(e) =>
                          setExtraPayment(Number(e.target.value))
                        }
                        className="bg-card border-border text-foreground"
                        data-ocid="loans.prepayment.input"
                      />
                    </div>
                  </div>

                  {prepaySim && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="bg-muted/50 border-border">
                        <CardContent className="p-4 space-y-3">
                          <p className="text-xs font-bold text-foreground/80 uppercase tracking-wide">
                            Without Prepayment
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Tenure
                              </span>
                              <span className="text-foreground font-semibold">
                                {prepaySim.origMonths} months
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Total Interest
                              </span>
                              <span className="text-red-300 font-semibold">
                                {fmt(prepaySim.origTotalInterest)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Debt-Free Date
                              </span>
                              <span className="text-foreground font-semibold">
                                {prepaySim.origDate}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-card border-border">
                        <CardContent className="p-4 space-y-3">
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
                            With Extra {fmt(extraPayment)}/mo
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Tenure
                              </span>
                              <span className="text-green-700 font-semibold">
                                {prepaySim.newMonths} months
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Total Interest
                              </span>
                              <span className="text-green-700 font-semibold">
                                {fmt(prepaySim.newTotalInterest)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Debt-Free Date
                              </span>
                              <span className="text-green-700 font-semibold">
                                {prepaySim.newDate}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="sm:col-span-2 bg-card border-border">
                        <CardContent className="p-4">
                          <div className="flex flex-wrap gap-6 justify-center text-center">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Months Saved
                              </p>
                              <p className="text-2xl font-bold text-blue-300">
                                {prepaySim.monthsSaved}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Interest Saved
                              </p>
                              <p className="text-2xl font-bold text-green-700">
                                {fmt(prepaySim.interestSaved)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 4: Loan vs Invest ─── */}
        <TabsContent value="loanandinvest" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <TrendingUp className="w-4 h-4 text-green-600" /> Loan vs Invest
                Dilemma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-foreground/80 mb-1 block">
                    Monthly Surplus ({sym})
                  </Label>
                  <Input
                    type="number"
                    value={lviSurplus}
                    onChange={(e) => setLviSurplus(Number(e.target.value))}
                    className="bg-card border-border text-foreground"
                    data-ocid="loans.lvi.surplus.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-foreground/80 mb-1 block">
                    Loan Interest Rate (%)
                  </Label>
                  <Input
                    type="number"
                    value={lviLoanRate}
                    onChange={(e) => setLviLoanRate(Number(e.target.value))}
                    className="bg-card border-border text-foreground"
                    data-ocid="loans.lvi.loanrate.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-foreground/80 mb-1 block">
                    Expected Investment Return (%)
                  </Label>
                  <Input
                    type="number"
                    value={lviInvestRate}
                    onChange={(e) => setLviInvestRate(Number(e.target.value))}
                    className="bg-card border-border text-foreground"
                    data-ocid="loans.lvi.investrate.input"
                  />
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-4 rounded-xl border bg-card border-border">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${recommend ? "bg-blue-600/30" : "bg-emerald-600/30"}`}
                  >
                    {recommend ? (
                      <TrendingDown className="w-4 h-4 text-blue-300" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-green-700" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold ${recommend ? "text-blue-200" : "text-green-700"}`}
                    >
                      {recommend
                        ? `✅ Prepay Your Loan — You save ${(lviLoanRate - lviInvestRate).toFixed(1)}% more than investing`
                        : `📈 Invest the Surplus — Expected gain ${lviInvestRate}% vs loan cost ${lviLoanRate}%`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {recommend
                        ? `Your loan rate (${lviLoanRate}%) exceeds your expected investment return (${lviInvestRate}%). Prepaying gives a guaranteed return equal to the loan rate.`
                        : `Your expected investment return (${lviInvestRate}%) exceeds your loan rate (${lviLoanRate}%). Over 5 years, investing ${fmt(lviSurplus)}/month can build significant wealth.`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Break-even point: If investment return = {lviLoanRate}%
                      both options are equivalent.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5-year comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left text-muted-foreground">
                        Year
                      </th>
                      <th className="py-2 text-right text-green-600">
                        Invest Corpus
                      </th>
                      <th className="py-2 text-right text-blue-400">
                        Interest Saved
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lviTable.map((row) => (
                      <tr
                        key={row.year}
                        className="border-b border-slate-800 hover:bg-muted/30"
                      >
                        <td className="py-2 text-muted-foreground">
                          {row.year}
                        </td>
                        <td className="py-2 text-right font-semibold text-green-700">
                          {fmt(row.invested)}
                        </td>
                        <td className="py-2 text-right font-semibold text-blue-300">
                          {fmt(row.saved)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 5: Affordability Check ─── */}
        <TabsContent value="affordability" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> Loan
                Affordability Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-foreground/80 mb-1 block">
                    Monthly Gross Income ({sym})
                  </Label>
                  <Input
                    type="number"
                    value={affIncome}
                    onChange={(e) => setAffIncome(Number(e.target.value))}
                    className="bg-card border-border text-foreground"
                    data-ocid="loans.aff.income.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-foreground/80 mb-1 block">
                    Existing Monthly EMIs ({sym})
                  </Label>
                  <Input
                    type="number"
                    value={affExistingEmi}
                    onChange={(e) => setAffExistingEmi(Number(e.target.value))}
                    className="bg-card border-border text-foreground"
                    data-ocid="loans.aff.emi.input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center p-4 rounded-xl border bg-card border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    Max Safe EMI
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {fmt(maxEMI)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    50% of income
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    Existing EMIs
                  </p>
                  <p
                    className={`text-sm font-bold ${affStatus === "danger" ? "text-red-300" : "text-foreground"}`}
                  >
                    {fmt(affExistingEmi)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    Available Headroom
                  </p>
                  <p
                    className={`text-sm font-bold ${available > 0 ? "text-green-700" : "text-red-300"}`}
                  >
                    {fmt(available)}
                  </p>
                </div>
              </div>

              {available > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground/80 mb-2">
                    Approximate loan amount at {affRate}% p.a. with your
                    available EMI headroom:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {affTenures.map((months) => {
                      const r = affRate / 12 / 100;
                      const loanAmt =
                        (available * ((1 + r) ** months - 1)) /
                        (r * (1 + r) ** months);
                      return (
                        <div
                          key={months}
                          className="bg-muted/50 rounded-xl p-3 text-center"
                        >
                          <p className="text-[10px] text-muted-foreground">
                            {months / 12} years
                          </p>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-300">
                            {fmt(Math.round(loanAmt))}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 6: Debt-Free Timeline ─── */}
        <TabsContent value="timeline" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <CalendarDays className="w-4 h-4 text-purple-400" /> Debt-Free
                  Timeline
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Extra/month ({sym})
                  </Label>
                  <Input
                    type="number"
                    value={dfExtra}
                    onChange={(e) => setDfExtra(Number(e.target.value))}
                    className="w-28 h-8 text-xs bg-card border-border text-foreground"
                    data-ocid="loans.timeline.extra.input"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loans.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Add loans to see your debt-free projection.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Debt-Free Date (Current)
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {debtTimeline.debtFreeDate}
                      </p>
                    </div>
                    {dfExtra > 0 && (
                      <div className="bg-card border border-border rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          With Extra {fmt(dfExtra)}/mo
                        </p>
                        <p className="text-sm font-bold text-green-700 mt-1">
                          {debtTimeline.withPrepayDate}
                        </p>
                      </div>
                    )}
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart
                      data={debtTimeline.data}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="loanBalGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="loanExtraGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.1}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        tickFormatter={(v) =>
                          `${sym}${(v / 100000).toFixed(0)}L`
                        }
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                        formatter={(v: number, n: string) => [fmt(v), n]}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        name="Outstanding (No Prepay)"
                        stroke="#6366f1"
                        fill="url(#loanBalGrad)"
                        strokeWidth={2}
                      />
                      {dfExtra > 0 && (
                        <Area
                          type="monotone"
                          dataKey="withPrepay"
                          name={`Outstanding (Extra ${fmt(dfExtra)}/mo)`}
                          stroke="#10b981"
                          fill="url(#loanExtraGrad)"
                          strokeWidth={2}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="debtmodel" className="mt-2">
          <div className="bg-card rounded-2xl border border-border p-4 min-h-[400px]">
            <ModelDebtTab />
          </div>
        </TabsContent>
      </Tabs>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg" data-ocid="loans.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Loan" : "Add New Loan"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
            <div className="sm:col-span-2">
              <Label className="text-xs mb-1 block">Loan Name</Label>
              <Input
                value={form.name}
                onChange={f("name")}
                placeholder="e.g. HDFC Home Loan"
                data-ocid="loans.name.input"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Loan Type</Label>
              <select
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                value={form.loanType}
                onChange={f("loanType")}
                data-ocid="loans.type.select"
              >
                <option value="">Select type</option>
                {LOAN_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Principal Amount</Label>
              <Input
                type="number"
                value={form.principal}
                onChange={f("principal")}
                data-ocid="loans.principal.input"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Current Balance</Label>
              <Input
                type="number"
                value={form.currentBalance}
                onChange={f("currentBalance")}
                data-ocid="loans.balance.input"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">
                Interest Rate (% p.a.)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={form.interestRate}
                onChange={f("interestRate")}
                data-ocid="loans.rate.input"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Tenure (months)</Label>
              <Input
                type="number"
                value={form.termMonths}
                onChange={f("termMonths")}
                data-ocid="loans.tenure.input"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Monthly EMI</Label>
              <Input
                type="number"
                value={form.monthlyPayment}
                onChange={f("monthlyPayment")}
                data-ocid="loans.emi.input"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={f("startDate")}
                data-ocid="loans.startdate.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="loans.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name}
              data-ocid="loans.submit_button"
            >
              {saving ? "Saving..." : editing ? "Update" : "Add Loan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
