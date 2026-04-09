import { c as createLucideIcon, a as useCurrency, r as reactExports, j as jsxRuntimeExports, v as Label, I as Input } from "./index-CSLSSYV9.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-BK3u_c6l.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-2feIA6Ym.js";
import { T as Table, b as TableHeader, c as TableRow, d as TableHead, a as TableBody, e as TableCell } from "./table-_x62dJN5.js";
import { R as ResponsiveContainer, a as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, b as Legend } from "./generateCategoricalChart-DTDaXDHQ.js";
import { L as LineChart, a as Line } from "./LineChart-CxY9dSpy.js";
import { P as Progress } from "./progress-d3PDxQjK.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
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
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
const COUNTRY_INFLATION = {
  India: 6,
  "United States": 3,
  "United Kingdom": 2.5,
  Canada: 2.8,
  Australia: 3.2,
  Germany: 2,
  France: 2.3,
  Japan: 1.5,
  Singapore: 2,
  UAE: 2.5
};
const COUNTRY_EXPENSE_MULTIPLIER = {
  India: 1,
  "United States": 4.5,
  "United Kingdom": 4,
  Canada: 3.8,
  Australia: 3.5,
  Germany: 3.2,
  France: 3,
  Japan: 3.3,
  Singapore: 3.8,
  UAE: 3.5
};
function FIRECalculator() {
  const { formatCurrency, country } = useCurrency();
  const [strategy, setStrategy] = reactExports.useState("fat");
  const [currentAge, setCurrentAge] = reactExports.useState(30);
  const [targetAge, setTargetAge] = reactExports.useState(45);
  const [currentSavings, setCurrentSavings] = reactExports.useState(5e5);
  const [monthlyExpenses, setMonthlyExpenses] = reactExports.useState(5e4);
  const [monthlySavings, setMonthlySavings] = reactExports.useState(3e4);
  const [expectedReturn, setExpectedReturn] = reactExports.useState(10);
  const [inflationRate, setInflationRate] = reactExports.useState(
    COUNTRY_INFLATION[(country == null ? void 0 : country.country) ?? "India"] ?? 6
  );
  const [results, setResults] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const countryInflation = COUNTRY_INFLATION[(country == null ? void 0 : country.country) ?? ""];
    if (countryInflation) setInflationRate(countryInflation);
  }, [country == null ? void 0 : country.country]);
  const calculateFIRE = () => {
    const yearsToFIRE = targetAge - currentAge;
    if (yearsToFIRE <= 0) return;
    const monthlyRate = expectedReturn / 12 / 100;
    const months = yearsToFIRE * 12;
    const expenseMultiplier = COUNTRY_EXPENSE_MULTIPLIER[(country == null ? void 0 : country.country) ?? "India"] ?? 1;
    let adjustedMonthlyExpenses = monthlyExpenses;
    if (strategy === "fat")
      adjustedMonthlyExpenses = monthlyExpenses * 1.5 * expenseMultiplier;
    else if (strategy === "lean")
      adjustedMonthlyExpenses = monthlyExpenses * 0.6 * expenseMultiplier;
    else adjustedMonthlyExpenses = monthlyExpenses * 0.8 * expenseMultiplier;
    const fvCurrentSavings = currentSavings * (1 + expectedReturn / 100) ** yearsToFIRE;
    const fvMonthlySavings = monthlySavings * (((1 + monthlyRate) ** months - 1) / monthlyRate * (1 + monthlyRate));
    const totalCorpus = fvCurrentSavings + fvMonthlySavings;
    const futureMonthlyExpenses = adjustedMonthlyExpenses * (1 + inflationRate / 100) ** yearsToFIRE;
    const annualExpenses = futureMonthlyExpenses * 12;
    const requiredCorpus = annualExpenses * 25;
    const shortfall = requiredCorpus - totalCorpus;
    const isFeasible = shortfall <= 0;
    let requiredMonthlySavings = monthlySavings;
    if (shortfall > 0) {
      const targetFV = requiredCorpus - fvCurrentSavings;
      requiredMonthlySavings = targetFV / (((1 + monthlyRate) ** months - 1) / monthlyRate * (1 + monthlyRate));
    }
    const annualWithdrawal = totalCorpus * 0.04;
    const yearsCorpusLasts = totalCorpus / annualExpenses;
    const yearlyData = [];
    for (let year = 1; year <= yearsToFIRE; year++) {
      const m = year * 12;
      const fvCS = currentSavings * (1 + expectedReturn / 100) ** year;
      const fvMS = monthlySavings * (((1 + monthlyRate) ** m - 1) / monthlyRate * (1 + monthlyRate));
      yearlyData.push({
        year,
        age: currentAge + year,
        corpus: fvCS + fvMS,
        withdrawals: 0
      });
    }
    let remainingCorpus = totalCorpus;
    for (let year = 1; year <= 30; year++) {
      const withdrawal = annualWithdrawal * (1 + inflationRate / 100) ** year;
      remainingCorpus = remainingCorpus * (1 + expectedReturn / 100) - withdrawal;
      if (remainingCorpus < 0) remainingCorpus = 0;
      yearlyData.push({
        year: yearsToFIRE + year,
        age: targetAge + year,
        corpus: remainingCorpus,
        withdrawals: withdrawal
      });
    }
    setResults({
      totalCorpus,
      requiredCorpus,
      futureMonthlyExpenses,
      annualWithdrawal,
      yearsCorpusLasts,
      shortfall,
      isFeasible,
      requiredMonthlySavings,
      yearlyData,
      strategy
    });
  };
  reactExports.useEffect(() => {
    calculateFIRE();
  }, [
    strategy,
    currentAge,
    targetAge,
    currentSavings,
    monthlyExpenses,
    monthlySavings,
    expectedReturn,
    inflationRate
  ]);
  const getStrategyInfo = (strat) => {
    switch (strat) {
      case "fat":
        return {
          name: "FAT FIRE",
          description: "Premium lifestyle with higher expenses and comfort",
          colorClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
          badgeClass: "bg-purple-500 text-white"
        };
      case "lean":
        return {
          name: "Lean FIRE",
          description: "Minimalist lifestyle with reduced expenses",
          colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
          badgeClass: "bg-emerald-500 text-white"
        };
      case "barista":
        return {
          name: "Barista FIRE",
          description: "Part-time work supplements retirement income",
          colorClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
          badgeClass: "bg-blue-500 text-white"
        };
    }
  };
  const strategyInfo = getStrategyInfo(strategy);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-border shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-5 w-5 text-orange-500" }),
          "FIRE Calculator"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Financial Independence, Retire Early Planning" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "FIRE Strategy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: strategy,
              onValueChange: (v) => setStrategy(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fat", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-purple-500" }),
                    "FAT FIRE — Premium Lifestyle"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "lean", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-emerald-500" }),
                    "Lean FIRE — Minimalist"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "barista", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-blue-500" }),
                    "Barista FIRE — Part-time Work"
                  ] }) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: strategyInfo.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Current Age" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: currentAge,
                onChange: (e) => setCurrentAge(Number(e.target.value)),
                min: 18,
                max: 100,
                className: "rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Target FIRE Age" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: targetAge,
                onChange: (e) => setTargetAge(Number(e.target.value)),
                min: currentAge + 1,
                max: 100,
                className: "rounded-xl"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Current Monthly Expenses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: monthlyExpenses,
              onChange: (e) => setMonthlyExpenses(Number(e.target.value)),
              min: 1e3,
              step: 1e3,
              className: "rounded-xl"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Adjusted for ",
            (country == null ? void 0 : country.country) ?? "your country",
            " cost of living"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Current Savings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: currentSavings,
              onChange: (e) => setCurrentSavings(Number(e.target.value)),
              min: 0,
              step: 1e4,
              className: "rounded-xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Monthly Savings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: monthlySavings,
              onChange: (e) => setMonthlySavings(Number(e.target.value)),
              min: 0,
              step: 1e3,
              className: "rounded-xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Expected Return (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: expectedReturn,
                onChange: (e) => setExpectedReturn(Number(e.target.value)),
                min: 1,
                max: 30,
                step: 0.5,
                className: "rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Inflation Rate (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: inflationRate,
                onChange: (e) => setInflationRate(Number(e.target.value)),
                min: 1,
                max: 15,
                step: 0.5,
                className: "rounded-xl"
              }
            )
          ] })
        ] }),
        results && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `p-3 rounded-xl flex items-center justify-between ${strategyInfo.colorClass}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Strategy" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-semibold px-2 py-1 rounded-full ${strategyInfo.badgeClass}`,
                    children: strategyInfo.name
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex justify-between items-center p-3 rounded-xl ${results.isFeasible ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-amber-50 dark:bg-amber-900/20"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-sm font-bold ${results.isFeasible ? "text-emerald-600" : "text-amber-600"}`,
                    children: results.isFeasible ? "✓ Feasible" : "⚠ Needs Adjustment"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 bg-primary/5 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Required Corpus" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary", children: formatCurrency(results.requiredCorpus) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 bg-muted/40 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Projected Corpus" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: formatCurrency(results.totalCorpus) })
          ] }),
          !results.isFeasible && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Shortfall" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-red-600", children: formatCurrency(results.shortfall) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Required Monthly Savings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-amber-600", children: formatCurrency(results.requiredMonthlySavings) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 bg-muted/40 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Annual Withdrawal (4% Rule)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: formatCurrency(results.annualWithdrawal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Corpus Duration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-emerald-600", children: [
              results.yearsCorpusLasts.toFixed(1),
              " years"
            ] })
          ] })
        ] })
      ] })
    ] }),
    results && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "FIRE Journey Projection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Corpus growth and withdrawal phase" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: results.yearlyData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            XAxis,
            {
              dataKey: "age",
              label: {
                value: "Age",
                position: "insideBottom",
                offset: -5
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tickFormatter: (v) => formatCurrency(v), width: 80 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              formatter: (value) => formatCurrency(value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Line,
            {
              type: "monotone",
              dataKey: "corpus",
              stroke: "hsl(var(--primary))",
              name: "Corpus",
              strokeWidth: 2,
              dot: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Line,
            {
              type: "monotone",
              dataKey: "withdrawals",
              stroke: "#ef4444",
              name: "Annual Withdrawals",
              strokeWidth: 2,
              dot: false
            }
          )
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Year-wise Projection" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-96 overflow-auto rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Year" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Age" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Corpus" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Withdrawals" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: results.yearlyData.slice(0, 40).map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: row.year }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: row.age }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-semibold", children: formatCurrency(row.corpus) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-red-500", children: row.withdrawals > 0 ? formatCurrency(row.withdrawals) : "—" })
          ] }, row.year)) })
        ] }) }) })
      ] })
    ] })
  ] });
}
function RetirementReadinessCalculator() {
  const formatCurrency = (v) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  const sym = "₹";
  const [currentAge, setCurrentAge] = reactExports.useState("35");
  const [retirementAge, setRetirementAge] = reactExports.useState("60");
  const [currentSavings, setCurrentSavings] = reactExports.useState("500000");
  const [monthlySIP, setMonthlySIP] = reactExports.useState("20000");
  const [expectedReturn, setExpectedReturn] = reactExports.useState("12");
  const [monthlyExpenses, setMonthlyExpenses] = reactExports.useState("60000");
  const result = reactExports.useMemo(() => {
    const years = (Number.parseFloat(retirementAge) || 60) - (Number.parseFloat(currentAge) || 35);
    const r = (Number.parseFloat(expectedReturn) || 12) / 100 / 12;
    const n = years * 12;
    const SIP = Number.parseFloat(monthlySIP) || 0;
    const savings = Number.parseFloat(currentSavings) || 0;
    const ME = Number.parseFloat(monthlyExpenses) || 6e4;
    const projectedCorpus = savings * (1 + r * 12) ** years + SIP * (((1 + r) ** n - 1) / r) * (1 + r);
    const requiredCorpus = ME * 12 * 25;
    const score = Math.min(
      100,
      Math.round(projectedCorpus / requiredCorpus * 100)
    );
    const gap = requiredCorpus - projectedCorpus;
    return { projectedCorpus, requiredCorpus, score, gap };
  }, [
    currentAge,
    retirementAge,
    currentSavings,
    monthlySIP,
    expectedReturn,
    monthlyExpenses
  ]);
  const scoreColor = result.score >= 80 ? "text-green-600" : result.score >= 50 ? "text-yellow-600" : "text-red-500";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Readiness Inputs" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current Age" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: currentAge,
              onChange: (e) => setCurrentAge(e.target.value),
              type: "number",
              "data-ocid": "retirementreadiness.currentage.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Retirement Age" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: retirementAge,
              onChange: (e) => setRetirementAge(e.target.value),
              type: "number",
              "data-ocid": "retirementreadiness.retirementage.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Current Savings (",
            sym,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: currentSavings,
              onChange: (e) => setCurrentSavings(e.target.value),
              type: "number",
              "data-ocid": "retirementreadiness.savings.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Monthly SIP (",
            sym,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: monthlySIP,
              onChange: (e) => setMonthlySIP(e.target.value),
              type: "number",
              "data-ocid": "retirementreadiness.sip.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Expected Return (%)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: expectedReturn,
              onChange: (e) => setExpectedReturn(e.target.value),
              type: "number",
              "data-ocid": "retirementreadiness.return.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Monthly Expenses (",
            sym,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: monthlyExpenses,
              onChange: (e) => setMonthlyExpenses(e.target.value),
              type: "number",
              "data-ocid": "retirementreadiness.expenses.input"
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 border-teal-200 dark:border-teal-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Readiness Score" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-5xl font-bold ${scoreColor}`, children: result.score }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "/100" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: result.score, className: "h-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Projected Corpus" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-teal-600", children: formatCurrency(result.projectedCorpus) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Required Corpus (25x)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatCurrency(result.requiredCorpus) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: result.gap > 0 ? "Gap" : "Surplus" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `font-bold text-lg ${result.gap > 0 ? "text-red-500" : "text-green-600"}`,
              children: formatCurrency(Math.abs(result.gap))
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ThreeBucketCalculator() {
  const formatCurrency = (v) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  const sym = "₹";
  const [corpus, setCorpus] = reactExports.useState("10000000");
  const [monthlyExpenses, setMonthlyExpenses] = reactExports.useState("80000");
  const [shortRate, setShortRate] = reactExports.useState("6");
  const [medRate, setMedRate] = reactExports.useState("8");
  const [longRate, setLongRate] = reactExports.useState("12");
  const result = reactExports.useMemo(() => {
    const C = Number.parseFloat(corpus) || 0;
    const ME = Number.parseFloat(monthlyExpenses) || 0;
    const sr = (Number.parseFloat(shortRate) || 0) / 100 / 12;
    const mr = (Number.parseFloat(medRate) || 0) / 100 / 12;
    const shortBucket = C * 0.2;
    const medBucket = C * 0.3;
    const longBucket = C * 0.5;
    const annualIncomeShort = shortBucket * sr * 12;
    const annualIncomeMed = medBucket * mr * 12;
    const shortYears = shortBucket / (ME * 12 - annualIncomeShort) || 0;
    const medYears = medBucket / (ME * 12 - annualIncomeMed) || 0;
    return {
      shortBucket,
      medBucket,
      shortYears: Math.max(0, shortYears),
      medYears: Math.max(0, medYears),
      longBucket
    };
  }, [corpus, monthlyExpenses, shortRate, medRate, longRate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "3-Bucket Strategy Inputs" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Total Corpus (",
            sym,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: corpus,
              onChange: (e) => setCorpus(e.target.value),
              type: "number",
              "data-ocid": "threebucket.corpus.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Monthly Expenses (",
            sym,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: monthlyExpenses,
              onChange: (e) => setMonthlyExpenses(e.target.value),
              type: "number",
              "data-ocid": "threebucket.expenses.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Short-term Return (% p.a.)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: shortRate,
              onChange: (e) => setShortRate(e.target.value),
              type: "number",
              "data-ocid": "threebucket.shortrate.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Medium-term Return (% p.a.)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: medRate,
              onChange: (e) => setMedRate(e.target.value),
              type: "number",
              "data-ocid": "threebucket.medrate.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Long-term Return (% p.a.)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: longRate,
              onChange: (e) => setLongRate(e.target.value),
              type: "number",
              "data-ocid": "threebucket.longrate.input"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-200 dark:border-teal-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "3-Bucket Allocation (20/30/50)" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-blue-700 dark:text-blue-300", children: "Bucket 1: Short-term (20%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-700 dark:text-blue-300", children: formatCurrency(result.shortBucket) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Liquid funds, FD | Covers ~",
            result.shortYears.toFixed(1),
            " years"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-green-100 dark:bg-green-900/30 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-green-700 dark:text-green-300", children: "Bucket 2: Medium-term (30%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-green-700 dark:text-green-300", children: formatCurrency(result.medBucket) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Balanced funds, bonds | Covers ~",
            result.medYears.toFixed(1),
            " years"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-teal-700 dark:text-teal-300", children: "Bucket 3: Long-term (50%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-teal-700 dark:text-teal-300", children: formatCurrency(result.longBucket) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Equity, growth assets | 10+ years" })
        ] })
      ] })
    ] })
  ] });
}
function TwoBucketCalculator() {
  const formatCurrency = (v) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  const sym = "₹";
  const [corpus, setCorpus] = reactExports.useState("10000000");
  const [monthlyExpenses, setMonthlyExpenses] = reactExports.useState("80000");
  const [safePct, setSafePct] = reactExports.useState("40");
  const [growthRate, setGrowthRate] = reactExports.useState("12");
  const result = reactExports.useMemo(() => {
    const C = Number.parseFloat(corpus) || 0;
    const ME = Number.parseFloat(monthlyExpenses) || 0;
    const sp = (Number.parseFloat(safePct) || 40) / 100;
    const gr = (Number.parseFloat(growthRate) || 12) / 100 / 12;
    const safeBucket = C * sp;
    const growthBucket = C * (1 - sp);
    const safeYears = ME > 0 ? safeBucket / (ME * 12) : 0;
    const annualGrowthIncome = growthBucket * gr * 12;
    return { safeBucket, growthBucket, safeYears, annualGrowthIncome };
  }, [corpus, monthlyExpenses, safePct, growthRate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "2-Bucket Strategy Inputs" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Total Corpus (",
            sym,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: corpus,
              onChange: (e) => setCorpus(e.target.value),
              type: "number",
              "data-ocid": "twobucket.corpus.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Monthly Expenses (",
            sym,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: monthlyExpenses,
              onChange: (e) => setMonthlyExpenses(e.target.value),
              type: "number",
              "data-ocid": "twobucket.expenses.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Safe Bucket % (of corpus)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: safePct,
              onChange: (e) => setSafePct(e.target.value),
              type: "number",
              max: "100",
              "data-ocid": "twobucket.safepct.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Growth Bucket Return (% p.a.)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: growthRate,
              onChange: (e) => setGrowthRate(e.target.value),
              type: "number",
              "data-ocid": "twobucket.growthrate.input"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 border-cyan-200 dark:border-cyan-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Allocation Results" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-blue-700 dark:text-blue-300", children: [
              "Safe Bucket (",
              safePct,
              "%)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-700 dark:text-blue-300", children: formatCurrency(result.safeBucket) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "FD, liquid | Covers ~",
            result.safeYears.toFixed(1),
            " years"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-green-100 dark:bg-green-900/30 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-green-700 dark:text-green-300", children: [
              "Growth Bucket (",
              100 - Number.parseFloat(safePct),
              "%)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-green-700 dark:text-green-300", children: formatCurrency(result.growthBucket) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Equity, MF | Annual income:",
            " ",
            formatCurrency(result.annualGrowthIncome)
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  FIRECalculator as F,
  Heart as H,
  RetirementReadinessCalculator as R,
  ThreeBucketCalculator as T,
  TwoBucketCalculator as a,
  Flame as b
};
