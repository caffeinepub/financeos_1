import { c as createLucideIcon, u as useActor, a as useCurrency, r as reactExports, j as jsxRuntimeExports, a7 as CreditCard, B as Button, $ as Shield, v as Label, I as Input, x as Trash2, Z as Zap, z as TrendingUp, a9 as CalendarDays, o as Dialog, p as DialogContent, q as DialogHeader, s as DialogTitle, a8 as DollarSign, V as PiggyBank, w as DialogFooter } from "./index-Ds6U6_qE.js";
import { M as ModelDebtTab } from "./ModelDebtTab-h4GmTYYS.js";
import { B as Badge } from "./badge-BrgcCSkC.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-aG8FMYj4.js";
import { P as Progress } from "./progress-CMDQ-QJB.js";
import { S as Skeleton } from "./skeleton-Mlok9hx_.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DJVaRNUC.js";
import { T as TransactionType } from "./index-CUmzdL5t.js";
import { P as Plus } from "./plus-DOLQmNic.js";
import { P as Pencil } from "./pencil-BiLQBuGr.js";
import { T as TrendingDown } from "./trending-down-_E3MjkEH.js";
import { C as CircleCheck } from "./circle-check-CHreh_cm.js";
import { R as ResponsiveContainer, a as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, b as Legend } from "./generateCategoricalChart-DEjVyPR3.js";
import { A as AreaChart, a as Area } from "./AreaChart-DYEOGQbj.js";
import { H as House, G as GraduationCap } from "./house-U1SeZota.js";
import { T as TriangleAlert } from "./triangle-alert-CyhhuOAA.js";
import "./chevron-right-DCMaCAwf.js";
import "./circle-alert-BGc0rOCA.js";
import "./index-o8nEW3Va.js";
import "./index-CYHAJoK-.js";
import "./index-B0wd6SMQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const BadgeCheck = createLucideIcon("badge-check", __iconNode);
const emptyForm = {
  name: "",
  loanType: "",
  principal: 0,
  interestRate: 0,
  termMonths: 12,
  startDate: "",
  currentBalance: 0,
  monthlyPayment: 0,
  notes: ""
};
const LOAN_TYPES = [
  { value: "Home", label: "Home Loan", icon: House, color: "#3b82f6" },
  { value: "Car", label: "Car Loan", icon: CreditCard, color: "#10b981" },
  {
    value: "Personal",
    label: "Personal Loan",
    icon: DollarSign,
    color: "#f59e0b"
  },
  {
    value: "Education",
    label: "Education Loan",
    icon: GraduationCap,
    color: "#8b5cf6"
  },
  {
    value: "CreditCard",
    label: "Credit Card",
    icon: CreditCard,
    color: "#ef4444"
  },
  { value: "Other", label: "Other", icon: PiggyBank, color: "#64748b" }
];
function getLoanTypeInfo(type) {
  return LOAN_TYPES.find((t) => t.value === type) ?? LOAN_TYPES[LOAN_TYPES.length - 1];
}
function calcEMI(principal, annualRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate <= 0) return Math.round(principal / months);
  const r = annualRate / 12 / 100;
  return Math.round(
    principal * r * (1 + r) ** months / ((1 + r) ** months - 1)
  );
}
function calcAmortization(balance, annualRate, emi) {
  const result = [];
  let bal = balance;
  const r = annualRate / 12 / 100;
  let m = 0;
  while (bal > 0 && m < 600) {
    const interest = r > 0 ? bal * r : 0;
    const principal = emi - interest;
    if (principal <= 0) break;
    const actualPrincipal = Math.min(principal, bal);
    bal = Math.max(0, bal - actualPrincipal);
    result.push({
      month: m + 1,
      balance: Math.round(bal),
      principal: Math.round(actualPrincipal),
      interest: Math.round(interest)
    });
    m++;
  }
  return result;
}
function calcHealthScore(loan) {
  const ratePenalty = Math.min(loan.interestRate / 36, 1) * 40;
  const progress = loan.principal > 0 ? (loan.principal - loan.currentBalance) / loan.principal : 0;
  const progressBonus = progress * 40;
  return Math.round(
    Math.max(0, Math.min(100, 60 - ratePenalty + progressBonus))
  );
}
function healthLabel(score) {
  if (score >= 70)
    return {
      label: "Healthy",
      color: "#10b981",
      bg: "bg-card",
      text: "text-emerald-700 dark:text-green-700"
    };
  if (score >= 40)
    return {
      label: "Moderate",
      color: "#f59e0b",
      bg: "bg-card",
      text: "text-amber-700 dark:text-amber-300"
    };
  return {
    label: "High Risk",
    color: "#ef4444",
    bg: "bg-card",
    text: "text-red-700 dark:text-red-300"
  };
}
function debtBurdenLabel(pct) {
  if (pct < 30)
    return {
      label: "Safe",
      color: "text-emerald-600 dark:text-green-600",
      icon: BadgeCheck
    };
  if (pct < 50)
    return {
      label: "Caution",
      color: "text-amber-600 dark:text-amber-400",
      icon: TriangleAlert
    };
  return {
    label: "Danger",
    color: "text-red-600 dark:text-red-400",
    icon: TriangleAlert
  };
}
function LoansPage() {
  var _a;
  const { actor } = useActor();
  const { formatCurrency: fmt, country } = useCurrency();
  const sym = (country == null ? void 0 : country.symbol) ?? "₹";
  const [loans, setLoans] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [saving, setSaving] = reactExports.useState(false);
  const [monthlyIncome, setMonthlyIncome] = reactExports.useState(1e5);
  const [incomeLoaded, setIncomeLoaded] = reactExports.useState(false);
  const [selectedLoanId, setSelectedLoanId] = reactExports.useState("");
  const [extraPayment, setExtraPayment] = reactExports.useState(5e3);
  const [lviSurplus, setLviSurplus] = reactExports.useState(1e4);
  const [lviLoanRate, setLviLoanRate] = reactExports.useState(10);
  const [lviInvestRate, setLviInvestRate] = reactExports.useState(12);
  const [affIncome, setAffIncome] = reactExports.useState(1e5);
  const [affExistingEmi, setAffExistingEmi] = reactExports.useState(0);
  const [dfExtra, setDfExtra] = reactExports.useState(0);
  const load = () => {
    if (!actor) return;
    setLoading(true);
    actor.getAllLoans().then(setLoans).finally(() => setLoading(false));
  };
  reactExports.useEffect(load, [actor]);
  reactExports.useEffect(() => {
    if (!actor || incomeLoaded) return;
    const now = /* @__PURE__ */ new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    actor.getAllTransactions().then((txns) => {
      const monthIncome = txns.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year && t.transactionType === TransactionType.Income;
      }).reduce((s, t) => s + t.amount, 0);
      if (monthIncome > 0) setMonthlyIncome(monthIncome);
      setIncomeLoaded(true);
    }).catch(() => setIncomeLoaded(true));
  }, [actor, incomeLoaded]);
  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (l) => {
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
      notes: l.notes ?? ""
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
        notes: form.notes
      };
      if (editing) {
        await actor.updateLoan(editing.id, payload);
      } else {
        await actor.createLoan(payload);
      }
      setOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    await actor.deleteLoan(id);
    load();
  };
  const f = (field) => (e) => {
    const val = e.target.type === "number" ? Number.parseFloat(e.target.value) || 0 : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };
  const totalOutstanding = loans.reduce((s, l) => s + l.currentBalance, 0);
  const totalEMI = loans.reduce((s, l) => s + l.monthlyPayment, 0);
  const debtBurden = monthlyIncome > 0 ? totalEMI / monthlyIncome * 100 : 0;
  const avgHealthScore = loans.length > 0 ? Math.round(
    loans.reduce((s, l) => s + calcHealthScore(l), 0) / loans.length
  ) : 0;
  const simLoan = loans.find((l) => l.id === selectedLoanId) ?? loans[0];
  const prepaySim = reactExports.useMemo(() => {
    if (!simLoan) return null;
    simLoan.interestRate / 100 / 12;
    const remainingTenure = Number(simLoan.termMonths);
    const emi = simLoan.monthlyPayment || calcEMI(simLoan.currentBalance, simLoan.interestRate, remainingTenure);
    const withoutPrepay = calcAmortization(
      simLoan.currentBalance,
      simLoan.interestRate,
      emi
    );
    const origTotalInterest = withoutPrepay.reduce((s, r) => s + r.interest, 0);
    const origMonths = withoutPrepay.length;
    const withPrepay = calcAmortization(
      simLoan.currentBalance,
      simLoan.interestRate,
      emi + extraPayment
    );
    const newTotalInterest = withPrepay.reduce((s, r) => s + r.interest, 0);
    const origDate = /* @__PURE__ */ new Date();
    origDate.setMonth(origDate.getMonth() + origMonths);
    const newDate = /* @__PURE__ */ new Date();
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
        year: "numeric"
      }),
      newDate: newDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
      })
    };
  }, [simLoan, extraPayment]);
  const debtTimeline = reactExports.useMemo(() => {
    if (loans.length === 0)
      return { data: [], debtFreeDate: "", withPrepayDate: "" };
    const maxMonths = 360;
    const data = [];
    let balances = loans.map((l) => ({
      ...l,
      bal: l.currentBalance,
      termMonths: Number(l.termMonths)
    }));
    let balancesExtra = loans.map((l) => ({
      ...l,
      bal: l.currentBalance,
      termMonths: Number(l.termMonths)
    }));
    for (let m = 0; m <= maxMonths; m++) {
      const total = balances.reduce((s, l) => s + l.bal, 0);
      const totalExtra = balancesExtra.reduce((s, l) => s + l.bal, 0);
      if (m % 6 === 0) {
        const d = /* @__PURE__ */ new Date();
        d.setMonth(d.getMonth() + m);
        data.push({
          month: d.toLocaleDateString("en-IN", {
            month: "short",
            year: "2-digit"
          }),
          balance: Math.round(total),
          withPrepay: Math.round(totalExtra)
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
        const extra = idx === 0 ? dfExtra : 0;
        const principal = Math.max(0, l.monthlyPayment + extra - interest);
        return { ...l, bal: Math.max(0, l.bal - principal) };
      });
    }
    const dfMonths = data.findIndex((d) => d.balance <= 0);
    const dfDate = /* @__PURE__ */ new Date();
    dfDate.setMonth(
      dfDate.getMonth() + (dfMonths >= 0 ? dfMonths * 6 : maxMonths)
    );
    const dfExtraMonths = data.findIndex((d) => d.withPrepay <= 0);
    const dfExtraDate = /* @__PURE__ */ new Date();
    dfExtraDate.setMonth(
      dfExtraDate.getMonth() + (dfExtraMonths >= 0 ? dfExtraMonths * 6 : maxMonths)
    );
    return {
      data: data.filter((d) => d.balance > 0 || d.withPrepay > 0),
      debtFreeDate: dfDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
      }),
      withPrepayDate: dfExtraDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
      })
    };
  }, [loans, dfExtra]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 rounded-2xl" })
    ] });
  }
  const burden = debtBurdenLabel(debtBurden);
  const BurdenIcon = burden.icon;
  const health = healthLabel(avgHealthScore);
  const lviYears = 5;
  const recommend = lviLoanRate >= lviInvestRate;
  const lviTable = Array.from({ length: lviYears }, (_, i) => {
    const yr = i + 1;
    const invested = lviSurplus * ((1 + lviInvestRate / 100 / 12) ** (yr * 12) - 1) / (lviInvestRate / 100 / 12);
    const saved = lviSurplus * 12 * yr * (lviLoanRate / 100);
    return {
      year: `Year ${yr}`,
      invested: Math.round(invested),
      saved: Math.round(saved)
    };
  });
  const maxEMI = affIncome * 0.5;
  const available = Math.max(0, maxEMI - affExistingEmi);
  const affStatus = affExistingEmi > maxEMI ? "danger" : affExistingEmi > maxEMI * 0.8 ? "caution" : "safe";
  const affTenures = [60, 120, 240];
  const affRate = 9;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-blue-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-foreground", children: "Loan Manager" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Track, simulate & optimise your debt" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "loans.open_modal_button",
          size: "sm",
          onClick: openAdd,
          className: "bg-blue-600 hover:bg-blue-700 text-white gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            " Add Loan"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "loantracker", className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto pb-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "flex gap-2 bg-transparent h-auto flex-nowrap min-w-max", children: [
        { value: "loantracker", label: "🏦 Loan Tracker" },
        { value: "prepayment", label: "⚡ Prepayment" },
        { value: "loanandinvest", label: "🤔 Loan vs Invest" },
        { value: "affordability", label: "✅ Affordability" },
        { value: "timeline", label: "📅 Debt-Free" },
        { value: "debtmodel", label: "💳 Debt Model" }
      ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsTrigger,
        {
          value: tab.value,
          "data-ocid": `loans.${tab.value}.tab`,
          className: "text-xs whitespace-nowrap px-3 py-1.5 rounded-full border transition-all duration-200 flex-shrink-0 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-blue-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-slate-800 data-[state=active]:shadow-sm",
          children: tab.label
        },
        tab.value
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "loantracker", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-card rounded-xl border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-blue-400 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Your Monthly Income" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: monthlyIncome,
              onChange: (e) => setMonthlyIncome(Number(e.target.value)),
              className: "ml-auto w-36 h-8 text-xs bg-card border-border text-foreground",
              "data-ocid": "loans.income.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 dark:border-blue-800 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-1", children: "Total Outstanding" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-blue-800 dark:text-blue-200 tabular-nums", children: fmt(totalOutstanding) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 dark:border-indigo-800 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-1", children: "Total EMI / Month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-indigo-800 dark:text-indigo-200 tabular-nums", children: fmt(totalEMI) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-xl border px-4 py-3 ${debtBurden > 50 ? "border-red-100 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:border-red-800" : debtBurden > 35 ? "border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:border-amber-800" : "border-green-100 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:border-green-800"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-[10px] font-semibold uppercase tracking-wide mb-1 ${debtBurden > 50 ? "text-red-700 dark:text-red-300" : debtBurden > 35 ? "text-amber-700 dark:text-amber-300" : "text-green-700 dark:text-green-300"}`,
                    children: "Debt Burden"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: `text-sm font-bold tabular-nums ${debtBurden > 50 ? "text-red-800 dark:text-red-200" : debtBurden > 35 ? "text-amber-800 dark:text-amber-200" : "text-green-800 dark:text-green-200"}`,
                    children: [
                      debtBurden.toFixed(1),
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BurdenIcon, { className: `w-3 h-3 ${burden.color}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] ${burden.color}`, children: burden.label })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-xl border px-4 py-3 ${avgHealthScore >= 70 ? "border-green-100 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:border-green-800" : avgHealthScore >= 40 ? "border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:border-amber-800" : "border-red-100 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:border-red-800"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-[10px] font-semibold uppercase tracking-wide mb-1 ${avgHealthScore >= 70 ? "text-green-700 dark:text-green-300" : avgHealthScore >= 40 ? "text-amber-700 dark:text-amber-300" : "text-red-700 dark:text-red-300"}`,
                    children: "Health Score"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-sm font-bold tabular-nums ${avgHealthScore >= 70 ? "text-green-800 dark:text-green-200" : avgHealthScore >= 40 ? "text-amber-800 dark:text-amber-200" : "text-red-800 dark:text-red-200"}`,
                    children: loans.length > 0 ? avgHealthScore : "—"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] ${health.text}`, children: loans.length > 0 ? health.label : "No loans" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border my-4" }),
        loans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "loans.empty_state",
            className: "text-center py-16 text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No active loans" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Add your first loan to track it here" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: loans.map((loan, idx) => {
          const score = calcHealthScore(loan);
          const h = healthLabel(score);
          const typeInfo = getLoanTypeInfo(loan.loanType);
          const TypeIcon = typeInfo.icon;
          const progress = loan.principal > 0 ? (loan.principal - loan.currentBalance) / loan.principal * 100 : 0;
          const emi = loan.monthlyPayment || calcEMI(
            loan.currentBalance,
            loan.interestRate,
            Number(loan.termMonths)
          );
          const startDate = loan.startDate ? new Date(loan.startDate) : /* @__PURE__ */ new Date();
          Math.max(
            0,
            Math.round(
              (Date.now() - startDate.getTime()) / (30.44 * 24 * 3600 * 1e3)
            )
          );
          loan.principal - loan.currentBalance;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              "data-ocid": `loans.item.${idx + 1}`,
              className: "bg-card border-border overflow-hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-1",
                    style: { backgroundColor: typeInfo.color }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-8 h-8 rounded-lg flex items-center justify-center",
                          style: { backgroundColor: `${typeInfo.color}20` },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            TypeIcon,
                            {
                              className: "w-4 h-4",
                              style: { color: typeInfo.color }
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: loan.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            className: "text-[10px] px-1.5 py-0",
                            style: {
                              backgroundColor: `${typeInfo.color}20`,
                              color: typeInfo.color
                            },
                            children: typeInfo.label
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `text-center px-2.5 py-1 rounded-lg border ${score >= 70 ? "border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800" : score >= 40 ? "border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800" : "border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-base font-bold ${h.text}`, children: score }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] ${h.text}`, children: h.label })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          className: "h-7 w-7 hover:bg-muted",
                          onClick: () => openEdit(loan),
                          "data-ocid": `loans.edit_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3 text-muted-foreground" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "icon",
                          variant: "ghost",
                          className: "h-7 w-7 hover:bg-red-100 dark:hover:bg-red-900/40",
                          onClick: () => handleDelete(loan.id),
                          "data-ocid": `loans.delete_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 text-red-500" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 dark:bg-slate-800/50 rounded-lg p-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Outstanding" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: fmt(loan.currentBalance) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 dark:bg-slate-800/50 rounded-lg p-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "EMI/Month" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-blue-600 dark:text-blue-300", children: fmt(emi) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 dark:bg-slate-800/50 rounded-lg p-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Interest Rate" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-amber-600 dark:text-amber-300", children: [
                        loan.interestRate,
                        "% p.a."
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 dark:bg-slate-800/50 rounded-lg p-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Tenure" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground", children: [
                        Number(loan.termMonths),
                        " mo"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-slate-500", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Repaid" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        progress.toFixed(0),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-1.5 bg-muted" })
                  ] })
                ] })
              ]
            },
            loan.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "prepayment", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-yellow-400" }),
          " Prepayment Impact Simulator"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: loans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "Add a loan first to simulate prepayment impact." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-foreground/80 mb-1 block", children: "Select Loan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  className: "w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none",
                  value: selectedLoanId || (((_a = loans[0]) == null ? void 0 : _a.id) ?? ""),
                  onChange: (e) => setSelectedLoanId(e.target.value),
                  "data-ocid": "loans.prepayment.select",
                  children: loans.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: l.id, children: [
                    l.name,
                    " (",
                    fmt(l.currentBalance),
                    " outstanding)"
                  ] }, l.id))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-foreground/80 mb-1 block", children: [
                "Extra Monthly Payment (",
                sym,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: extraPayment,
                  onChange: (e) => setExtraPayment(Number(e.target.value)),
                  className: "bg-card border-border text-foreground",
                  "data-ocid": "loans.prepayment.input"
                }
              )
            ] })
          ] }),
          prepaySim && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-muted/50 border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground/80 uppercase tracking-wide", children: "Without Prepayment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tenure" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                    prepaySim.origMonths,
                    " months"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Interest" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-300 font-semibold", children: fmt(prepaySim.origTotalInterest) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Debt-Free Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: prepaySim.origDate })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-green-700 uppercase tracking-wide", children: [
                "With Extra ",
                fmt(extraPayment),
                "/mo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tenure" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-700 font-semibold", children: [
                    prepaySim.newMonths,
                    " months"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Interest" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-700 font-semibold", children: fmt(prepaySim.newTotalInterest) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Debt-Free Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-700 font-semibold", children: prepaySim.newDate })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "sm:col-span-2 bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-6 justify-center text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Months Saved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-blue-300", children: prepaySim.monthsSaved })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Interest Saved" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-700", children: fmt(prepaySim.interestSaved) })
              ] })
            ] }) }) })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "loanandinvest", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-green-600" }),
          " Loan vs Invest Dilemma"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-foreground/80 mb-1 block", children: [
                "Monthly Surplus (",
                sym,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: lviSurplus,
                  onChange: (e) => setLviSurplus(Number(e.target.value)),
                  className: "bg-card border-border text-foreground",
                  "data-ocid": "loans.lvi.surplus.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-foreground/80 mb-1 block", children: "Loan Interest Rate (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: lviLoanRate,
                  onChange: (e) => setLviLoanRate(Number(e.target.value)),
                  className: "bg-card border-border text-foreground",
                  "data-ocid": "loans.lvi.loanrate.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-foreground/80 mb-1 block", children: "Expected Investment Return (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: lviInvestRate,
                  onChange: (e) => setLviInvestRate(Number(e.target.value)),
                  className: "bg-card border-border text-foreground",
                  "data-ocid": "loans.lvi.investrate.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-xl border bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${recommend ? "bg-blue-600/30" : "bg-emerald-600/30"}`,
                children: recommend ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-4 h-4 text-blue-300" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-green-700" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-bold ${recommend ? "text-blue-200" : "text-green-700"}`,
                  children: recommend ? `✅ Prepay Your Loan — You save ${(lviLoanRate - lviInvestRate).toFixed(1)}% more than investing` : `📈 Invest the Surplus — Expected gain ${lviInvestRate}% vs loan cost ${lviLoanRate}%`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: recommend ? `Your loan rate (${lviLoanRate}%) exceeds your expected investment return (${lviInvestRate}%). Prepaying gives a guaranteed return equal to the loan rate.` : `Your expected investment return (${lviInvestRate}%) exceeds your loan rate (${lviLoanRate}%). Over 5 years, investing ${fmt(lviSurplus)}/month can build significant wealth.` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                "Break-even point: If investment return = ",
                lviLoanRate,
                "% both options are equivalent."
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-left text-muted-foreground", children: "Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-right text-green-600", children: "Invest Corpus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-right text-blue-400", children: "Interest Saved" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: lviTable.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-slate-800 hover:bg-muted/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-muted-foreground", children: row.year }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-semibold text-green-700", children: fmt(row.invested) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-semibold text-blue-300", children: fmt(row.saved) })
                ]
              },
              row.year
            )) })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "affordability", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-teal-400" }),
          " Loan Affordability Check"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-foreground/80 mb-1 block", children: [
                "Monthly Gross Income (",
                sym,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: affIncome,
                  onChange: (e) => setAffIncome(Number(e.target.value)),
                  className: "bg-card border-border text-foreground",
                  "data-ocid": "loans.aff.income.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-foreground/80 mb-1 block", children: [
                "Existing Monthly EMIs (",
                sym,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: affExistingEmi,
                  onChange: (e) => setAffExistingEmi(Number(e.target.value)),
                  className: "bg-card border-border text-foreground",
                  "data-ocid": "loans.aff.emi.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 text-center p-4 rounded-xl border bg-card border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Max Safe EMI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: fmt(maxEMI) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "50% of income" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Existing EMIs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-bold ${affStatus === "danger" ? "text-red-300" : "text-foreground"}`,
                  children: fmt(affExistingEmi)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Available Headroom" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-bold ${available > 0 ? "text-green-700" : "text-red-300"}`,
                  children: fmt(available)
                }
              )
            ] })
          ] }),
          available > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground/80 mb-2", children: [
              "Approximate loan amount at ",
              affRate,
              "% p.a. with your available EMI headroom:"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: affTenures.map((months) => {
              const r = affRate / 12 / 100;
              const loanAmt = available * ((1 + r) ** months - 1) / (r * (1 + r) ** months);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bg-muted/50 rounded-xl p-3 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                      months / 12,
                      " years"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-blue-600 dark:text-blue-300", children: fmt(Math.round(loanAmt)) })
                  ]
                },
                months
              );
            }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "timeline", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2 text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4 text-purple-400" }),
            " Debt-Free Timeline"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
              "Extra/month (",
              sym,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: dfExtra,
                onChange: (e) => setDfExtra(Number(e.target.value)),
                className: "w-28 h-8 text-xs bg-card border-border text-foreground",
                "data-ocid": "loans.timeline.extra.input"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: loans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "Add loans to see your debt-free projection." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-xl p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Debt-Free Date (Current)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mt-1", children: debtTimeline.debtFreeDate })
            ] }),
            dfExtra > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "With Extra ",
                fmt(dfExtra),
                "/mo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-green-700 mt-1", children: debtTimeline.withPrepayDate })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            AreaChart,
            {
              data: debtTimeline.data,
              margin: { top: 5, right: 20, left: 10, bottom: 5 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "linearGradient",
                    {
                      id: "loanBalGrad",
                      x1: "0",
                      y1: "0",
                      x2: "0",
                      y2: "1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "stop",
                          {
                            offset: "5%",
                            stopColor: "#6366f1",
                            stopOpacity: 0.4
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "stop",
                          {
                            offset: "95%",
                            stopColor: "#6366f1",
                            stopOpacity: 0
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "linearGradient",
                    {
                      id: "loanExtraGrad",
                      x1: "0",
                      y1: "0",
                      x2: "0",
                      y2: "1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "stop",
                          {
                            offset: "5%",
                            stopColor: "#10b981",
                            stopOpacity: 0.4
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "stop",
                          {
                            offset: "95%",
                            stopColor: "#10b981",
                            stopOpacity: 0
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CartesianGrid,
                  {
                    strokeDasharray: "3 3",
                    opacity: 0.1,
                    vertical: false
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    dataKey: "month",
                    tick: { fontSize: 10, fill: "#94a3b8" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    tick: { fontSize: 10, fill: "#94a3b8" },
                    tickFormatter: (v) => `${sym}${(v / 1e5).toFixed(0)}L`,
                    width: 50
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Tooltip,
                  {
                    contentStyle: {
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      fontSize: 11
                    },
                    formatter: (v, n) => [fmt(v), n]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: 11 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Area,
                  {
                    type: "monotone",
                    dataKey: "balance",
                    name: "Outstanding (No Prepay)",
                    stroke: "#6366f1",
                    fill: "url(#loanBalGrad)",
                    strokeWidth: 2
                  }
                ),
                dfExtra > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Area,
                  {
                    type: "monotone",
                    dataKey: "withPrepay",
                    name: `Outstanding (Extra ${fmt(dfExtra)}/mo)`,
                    stroke: "#10b981",
                    fill: "url(#loanExtraGrad)",
                    strokeWidth: 2
                  }
                )
              ]
            }
          ) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "debtmodel", className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border p-4 min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ModelDebtTab, {}) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "loans.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Loan" : "Add New Loan" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Loan Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.name,
              onChange: f("name"),
              placeholder: "e.g. HDFC Home Loan",
              "data-ocid": "loans.name.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Loan Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "w-full border border-input rounded-md px-3 py-2 text-sm bg-background",
              value: form.loanType,
              onChange: f("loanType"),
              "data-ocid": "loans.type.select",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select type" }),
                LOAN_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.value, children: t.label }, t.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Principal Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: form.principal,
              onChange: f("principal"),
              "data-ocid": "loans.principal.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Current Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: form.currentBalance,
              onChange: f("currentBalance"),
              "data-ocid": "loans.balance.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Interest Rate (% p.a.)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              step: "0.1",
              value: form.interestRate,
              onChange: f("interestRate"),
              "data-ocid": "loans.rate.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Tenure (months)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: form.termMonths,
              onChange: f("termMonths"),
              "data-ocid": "loans.tenure.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Monthly EMI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: form.monthlyPayment,
              onChange: f("monthlyPayment"),
              "data-ocid": "loans.emi.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-1 block", children: "Start Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: form.startDate,
              onChange: f("startDate"),
              "data-ocid": "loans.startdate.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setOpen(false),
            "data-ocid": "loans.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleSave,
            disabled: saving || !form.name,
            "data-ocid": "loans.submit_button",
            children: saving ? "Saving..." : editing ? "Update" : "Add Loan"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  LoansPage as default
};
