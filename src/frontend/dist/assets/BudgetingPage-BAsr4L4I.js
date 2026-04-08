import { c as createLucideIcon, u as useActor, a as useCurrency, r as reactExports, j as jsxRuntimeExports, z as TrendingUp, B as Button, I as Input, o as Dialog, p as DialogContent, q as DialogHeader, s as DialogTitle, v as Label, w as DialogFooter, x as Trash2, V as PiggyBank, X as BookOpen } from "./index-Ds6U6_qE.js";
import { u as ue } from "./index-tp01qzps.js";
import { T as TransactionType } from "./index-CUmzdL5t.js";
import { B as Badge } from "./badge-BrgcCSkC.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BHeTHZTG.js";
import { S as Skeleton } from "./skeleton-Mlok9hx_.js";
import { T as TrendingDown } from "./trending-down-_E3MjkEH.js";
import { P as Plus } from "./plus-DOLQmNic.js";
import { S as Search } from "./search-61p1w0nd.js";
import { W as Wallet } from "./wallet-B_GshqRC.js";
import { P as Pencil } from "./pencil-BiLQBuGr.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-aG8FMYj4.js";
import { T as Table, b as TableHeader, c as TableRow, d as TableHead, a as TableBody, e as TableCell } from "./table-BWKseIOo.js";
import { B as Budget5030Chart } from "./Budget5030Chart-DXyBrEXp.js";
import { P as PieChart, a as Pie } from "./PieChart-DQbmwGUB.js";
import { C as Cell, R as ResponsiveContainer, a as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, b as Legend, B as Bar, L as LabelList } from "./generateCategoricalChart-DEjVyPR3.js";
import { B as BarChart } from "./BarChart-CRER3XSp.js";
import { L as LineChart, a as Line } from "./LineChart-B2mkFaPg.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DJVaRNUC.js";
import "./index-CnxV3vAw.js";
import "./index-CYHAJoK-.js";
import "./index-B0wd6SMQ.js";
import "./index-o8nEW3Va.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 3 4 7l4 4", key: "9rb6wj" }],
  ["path", { d: "M4 7h16", key: "6tx8e3" }],
  ["path", { d: "m16 21 4-4-4-4", key: "siv7j2" }],
  ["path", { d: "M20 17H4", key: "h6l3hr" }]
];
const ArrowLeftRight = createLucideIcon("arrow-left-right", __iconNode);
const SAVINGS_KEYWORDS_EXP = [
  "savings",
  "investment",
  "sip",
  "ppf",
  "nps",
  "fd",
  "emergency",
  "mutual fund",
  "retirement",
  "stocks",
  "retiral"
];
const WANTS_KEYWORDS_EXP = [
  "dining",
  "eating out",
  "restaurant",
  "entertainment",
  "streaming",
  "netflix",
  "subscription",
  "shopping",
  "clothing",
  "travel",
  "vacation",
  "gym",
  "fitness",
  "hobbies",
  "personal care",
  "beauty",
  "salon",
  "electronics",
  "games",
  "leisure"
];
function inferBudgetTypeExp(name) {
  const lc = name.toLowerCase();
  if (SAVINGS_KEYWORDS_EXP.some((k) => lc.includes(k))) return "Savings";
  if (WANTS_KEYWORDS_EXP.some((k) => lc.includes(k))) return "Wants";
  return "Needs";
}
const EXP_TYPE_BADGE = {
  Needs: "bg-blue-100 text-blue-700 border border-blue-200",
  Wants: "bg-amber-100 text-amber-700 border border-amber-200",
  Savings: "bg-emerald-100 text-emerald-700 border border-emerald-200"
};
const getEmptyForm = () => ({
  // date set dynamically in openAdd
  date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  description: "",
  account: "",
  categoryId: "",
  transactionType: TransactionType.Expense,
  amount: 0
});
function ExpensesTab() {
  const { actor } = useActor();
  const { country } = useCurrency();
  function fmt2(n) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: country.code
    }).format(n);
  }
  const [transactions, setTransactions] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(getEmptyForm());
  const [saving, setSaving] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("All");
  const _now = /* @__PURE__ */ new Date();
  const [filterMonth, setFilterMonth] = reactExports.useState(
    _now.getMonth()
  );
  const [filterYear, setFilterYear] = reactExports.useState(
    _now.getFullYear()
  );
  const [incomeExpanded, setIncomeExpanded] = reactExports.useState(false);
  const load = () => {
    if (!actor) return;
    setLoading(true);
    Promise.all([actor.getAllTransactions(), actor.getAllBudgetCategories()]).then(([txns, cats]) => {
      setTransactions([...txns].sort((a, b) => b.date.localeCompare(a.date)));
      setCategories(cats);
    }).finally(() => setLoading(false));
  };
  reactExports.useEffect(load, [actor]);
  const openAdd = () => {
    setEditing(null);
    setForm(getEmptyForm());
    setOpen(true);
  };
  const openEdit = (t) => {
    setEditing(t);
    setForm({
      date: t.date,
      description: t.description,
      account: t.account,
      categoryId: t.categoryId,
      transactionType: t.transactionType,
      amount: t.amount
    });
    setOpen(true);
  };
  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = { id: editing.id, ...form };
        await actor.updateTransaction(editing.id, updated);
        setTransactions(
          (prev) => prev.map((t) => t.id === editing.id ? updated : t)
        );
      } else {
        const newTx = { id: crypto.randomUUID(), ...form };
        await actor.createTransaction(newTx);
        setTransactions(
          (prev) => [newTx, ...prev].sort((a, b) => b.date.localeCompare(a.date))
        );
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };
  const del = async (id) => {
    if (!actor) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    await actor.deleteTransaction(id);
  };
  const filtered = transactions.filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.account.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || t.transactionType === typeFilter;
    const td = new Date(t.date);
    const matchMonth = filterMonth === "all" || td.getMonth() === filterMonth;
    const matchYear = filterYear === "all" || td.getFullYear() === filterYear;
    return matchSearch && matchType && matchMonth && matchYear;
  });
  const filteredIncome = filtered.filter((t) => t.transactionType === TransactionType.Income).reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filtered.filter((t) => t.transactionType === TransactionType.Expense).reduce((s, t) => s + t.amount, 0);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }, n)) });
  }
  const incomeRows = filtered.filter(
    (t) => t.transactionType === TransactionType.Income
  );
  const expenseRows = filtered.filter(
    (t) => t.transactionType === TransactionType.Expense
  );
  const renderRow = (t, rowIndex) => {
    const cat = categories.find((c) => c.id === t.categoryId);
    const isIncome = t.transactionType === TransactionType.Income;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        "data-ocid": `expenses.item.${rowIndex}`,
        className: "border-t border-border hover:bg-muted/30 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-sm text-muted-foreground whitespace-nowrap", children: t.date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-sm", children: cat ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: cat.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-sm font-medium max-w-[120px] truncate hidden sm:table-cell", children: t.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 hidden md:table-cell", children: isIncome ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200", children: "Income" }) : cat ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${EXP_TYPE_BADGE[inferBudgetTypeExp(cat.name)] ?? EXP_TYPE_BADGE.Needs}`,
              children: inferBudgetTypeExp(cat.name)
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200", children: "Needs" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              className: `p-3 text-sm font-bold text-right ${isIncome ? "text-green-600" : "text-red-500"}`,
              children: [
                isIncome ? "+" : "-",
                fmt2(t.amount)
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": `expenses.edit_button.${rowIndex}`,
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7",
                onClick: () => openEdit(t),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": `expenses.delete_button.${rowIndex}`,
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-destructive hover:text-destructive",
                onClick: () => del(t.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
              }
            )
          ] }) })
        ]
      },
      t.id.toString()
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3 items-start md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-emerald-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Actual Income" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold text-emerald-600 tabular-nums", children: fmt2(filteredIncome) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3.5 w-3.5 text-rose-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Actual Expenses" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold text-rose-500 tabular-nums", children: fmt2(filteredExpense) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0 items-center flex-wrap", children: [
        ["All", TransactionType.Income, TransactionType.Expense].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: typeFilter === f ? "default" : "outline",
            onClick: () => setTypeFilter(f),
            "data-ocid": `expenses.filter.${String(f).toLowerCase()}.toggle`,
            children: [
              f === "All" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "h-3 w-3 mr-1" }) : f === TransactionType.Income ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3 mr-1" }),
              f === TransactionType.Income ? "Income" : f === TransactionType.Expense ? "Expense" : "All"
            ]
          },
          f
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "expenses.add.open_modal_button",
            onClick: openAdd,
            className: "gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Add"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            "data-ocid": "expenses.month.select",
            className: "h-9 rounded-md border border-input bg-background px-3 py-1 text-sm",
            value: filterMonth === "all" ? "all" : String(filterMonth),
            onChange: (e) => setFilterMonth(
              e.target.value === "all" ? "all" : Number(e.target.value)
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Months" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "0", children: "January" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1", children: "February" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2", children: "March" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "3", children: "April" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "4", children: "May" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "June" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "6", children: "July" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "7", children: "August" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "8", children: "September" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "9", children: "October" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "10", children: "November" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "11", children: "December" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            "data-ocid": "expenses.year.select",
            className: "h-9 rounded-md border border-input bg-background px-3 py-1 text-sm",
            value: filterYear === "all" ? "all" : String(filterYear),
            onChange: (e) => setFilterYear(
              e.target.value === "all" ? "all" : Number(e.target.value)
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Years" }),
              [
                (/* @__PURE__ */ new Date()).getFullYear(),
                (/* @__PURE__ */ new Date()).getFullYear() - 1,
                (/* @__PURE__ */ new Date()).getFullYear() - 2
              ].map((yr) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: yr, children: yr }, yr))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[160px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "expenses.search_input",
            className: "pl-9 h-9",
            placeholder: "Search transactions…",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "expenses.empty_state",
        className: "text-center py-16 text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No transactions found" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-700 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3 font-semibold text-xs text-white", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3 font-semibold text-xs text-white", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3 font-semibold text-xs text-white hidden sm:table-cell", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3 font-semibold text-xs text-white hidden md:table-cell", children: "Budget Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3 font-semibold text-xs text-white", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3 font-semibold text-xs text-white", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: typeFilter === "All" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        incomeRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              colSpan: 7,
              className: "px-3 py-1.5 bg-green-50 border-b border-green-100 text-xs font-bold text-green-700 uppercase tracking-wide",
              children: "Income"
            }
          ) }),
          renderRow(incomeRows[0], 1),
          incomeRows.length > 1 && !incomeExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-3 py-1.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "text-xs text-blue-600 hover:underline font-medium",
              onClick: () => setIncomeExpanded(true),
              children: [
                "Show more entries (",
                incomeRows.length - 1,
                " more)"
              ]
            }
          ) }) }),
          incomeRows.length > 1 && incomeExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            incomeRows.slice(1).map((t, i) => renderRow(t, i + 2)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 7,
                className: "px-3 py-1.5 text-center",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-xs text-blue-600 hover:underline font-medium",
                    onClick: () => setIncomeExpanded(false),
                    children: "Show less"
                  }
                )
              }
            ) })
          ] })
        ] }),
        expenseRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              colSpan: 7,
              className: "px-3 py-1.5 bg-red-50 border-b border-red-100 text-xs font-bold text-red-700 uppercase tracking-wide",
              children: "Expenses"
            }
          ) }),
          expenseRows.map(
            (t, i) => renderRow(t, incomeRows.length + i + 1)
          )
        ] })
      ] }) : filtered.map((t, i) => renderRow(t, i + 1)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "expenses.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Transaction" : "Add Transaction" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.transactionType,
                onValueChange: (v) => setForm((p) => ({
                  ...p,
                  transactionType: v,
                  categoryId: ""
                })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "expenses.type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TransactionType.Income, children: "Income" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TransactionType.Expense, children: "Expense" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.categoryId,
                onValueChange: (v) => setForm((p) => ({ ...p, categoryId: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "expenses.category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-[200px] overflow-y-auto", children: categories.filter((c) => c.categoryType === form.transactionType).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "expenses.date.input",
                type: "date",
                value: form.date,
                onChange: (e) => setForm((p) => ({ ...p, date: e.target.value }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "expenses.amount.input",
                type: "number",
                value: form.amount,
                onChange: (e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "expenses.description.input",
              value: form.description,
              onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
              placeholder: "e.g. Grocery shopping"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Amount (",
            country.symbol,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "expenses.amount.input",
              type: "number",
              value: form.amount,
              onChange: (e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "expenses.cancel_button",
            variant: "outline",
            onClick: () => setOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "expenses.submit_button",
            onClick: save,
            disabled: saving,
            children: saving ? "Saving…" : editing ? "Update" : "Add"
          }
        )
      ] })
    ] }) })
  ] });
}
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function shortNum(n, sym, code = "INR") {
  if (code !== "INR") {
    if (n >= 1e9) return `${sym}${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${sym}${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${sym}${(n / 1e3).toFixed(1)}K`;
    return `${sym}${Math.round(n)}`;
  }
  if (n >= 1e7) return `${sym}${(n / 1e7).toFixed(1)}Cr`;
  if (n >= 1e5) return `${sym}${(n / 1e5).toFixed(1)}L`;
  if (n >= 1e3) return `${sym}${(n / 1e3).toFixed(1)}K`;
  return `${sym}${Math.round(n)}`;
}
const SAVINGS_KEYWORDS$1 = [
  "savings",
  "investment",
  "sip",
  "ppf",
  "nps",
  "fd",
  "emergency",
  "mutual fund",
  "retirement",
  "stocks",
  "retiral"
];
const WANTS_KEYWORDS$1 = [
  "dining",
  "eating out",
  "restaurant",
  "entertainment",
  "streaming",
  "netflix",
  "subscription",
  "shopping",
  "clothing",
  "travel",
  "vacation",
  "gym",
  "fitness",
  "hobbies",
  "personal care",
  "beauty",
  "salon",
  "electronics",
  "games",
  "leisure"
];
function inferBudgetType$1(name) {
  const lc = name.toLowerCase();
  if (SAVINGS_KEYWORDS$1.some((k) => lc.includes(k))) return "Savings";
  if (WANTS_KEYWORDS$1.some((k) => lc.includes(k))) return "Wants";
  return "Needs";
}
const TYPE_BADGE_COLORS$1 = {
  Needs: "bg-blue-100 text-blue-700 border border-blue-200",
  Wants: "bg-amber-100 text-amber-700 border border-amber-200",
  Savings: "bg-emerald-100 text-emerald-700 border border-emerald-200"
};
const fmt$1 = (n, cur) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: (cur ?? { code: "INR" }).code,
  maximumFractionDigits: 0
}).format(n);
const emptyTx = {
  categoryId: "",
  transactionType: TransactionType.Expense,
  date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  description: "",
  account: "",
  amount: 0
};
function MonthlyTrackerTab() {
  const { country, formatCurrency } = useCurrency();
  const sym = country.symbol;
  const { actor } = useActor();
  const now = /* @__PURE__ */ new Date();
  const [selectedMonth, setSelectedMonth] = reactExports.useState(
    now.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = reactExports.useState(
    now.getFullYear()
  );
  const [showAllBudget, setShowAllBudget] = reactExports.useState(false);
  const [transactions, setTransactions] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editingTx, setEditingTx] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyTx);
  const [saving, setSaving] = reactExports.useState(false);
  const LS_KEY = "budgeting_planned_overrides";
  const monthKey = selectedMonth !== "all" && selectedYear !== "all" ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}` : "all";
  const getOverrides = () => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
    } catch {
      return {};
    }
  };
  const getPlannedAmount = (catId, defaultLimit) => {
    try {
      const allOv = JSON.parse(
        localStorage.getItem(LS_KEY) ?? "{}"
      );
      const ov = allOv[monthKey] ?? {};
      return catId in ov ? ov[catId] : defaultLimit;
    } catch {
      return defaultLimit;
    }
  };
  const saveMonthOverrides = (overrides) => {
    const all = getOverrides();
    all[monthKey] = overrides;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };
  const [editPlannedOpen, setEditPlannedOpen] = reactExports.useState(false);
  const [plannedDraft, setPlannedDraft] = reactExports.useState({});
  const openEditPlanned = () => {
    const drafts = {};
    for (const cat of expenseCategories) {
      drafts[cat.id] = getPlannedAmount(cat.id, cat.monthlyLimit);
    }
    setPlannedDraft(drafts);
    setEditPlannedOpen(true);
  };
  const savePlanned = () => {
    saveMonthOverrides(plannedDraft);
    setEditPlannedOpen(false);
  };
  const resetMonth = () => {
    const all = getOverrides();
    delete all[monthKey];
    localStorage.setItem(LS_KEY, JSON.stringify(all));
    setEditPlannedOpen(false);
  };
  const [, forceUpdate] = reactExports.useState(0);
  const refreshPlanned = () => forceUpdate((n) => n + 1);
  const load = () => {
    if (!actor) return;
    setLoading(true);
    Promise.all([actor.getAllTransactions(), actor.getAllBudgetCategories()]).then(([txns, cats]) => {
      setTransactions(txns);
      setCategories(cats);
    }).finally(() => setLoading(false));
  };
  reactExports.useEffect(load, [actor]);
  const monthTxns = reactExports.useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      const matchMonth = selectedMonth === "all" || d.getMonth() + 1 === selectedMonth;
      const matchYear = selectedYear === "all" || d.getFullYear() === selectedYear;
      return matchMonth && matchYear;
    });
  }, [transactions, selectedMonth, selectedYear]);
  const totalIncome = reactExports.useMemo(
    () => monthTxns.filter((t) => t.transactionType === TransactionType.Income).reduce((s, t) => s + t.amount, 0),
    [monthTxns]
  );
  const totalActual = reactExports.useMemo(
    () => monthTxns.filter((t) => t.transactionType === TransactionType.Expense).reduce((s, t) => s + t.amount, 0),
    [monthTxns]
  );
  const totalPlanned = reactExports.useMemo(() => {
    const allOv = (() => {
      try {
        return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
      } catch {
        return {};
      }
    })();
    const mk = selectedMonth !== "all" && selectedYear !== "all" ? `${selectedYear}-${String(selectedMonth).padStart(2, "0")}` : "all";
    const ov = allOv[mk] ?? {};
    return categories.filter((c) => c.categoryType === TransactionType.Expense).reduce((s, c) => s + (c.id in ov ? ov[c.id] : c.monthlyLimit), 0);
  }, [categories, selectedMonth, selectedYear]);
  const budgetedIncome = reactExports.useMemo(
    () => categories.filter((c) => c.categoryType === TransactionType.Income).reduce((s, c) => s + c.monthlyLimit, 0),
    [categories]
  );
  const budgetedExpenses = totalPlanned;
  const _incomePct = budgetedIncome > 0 ? Math.min(200, totalIncome / budgetedIncome * 100) : 0;
  const _expensePct = budgetedExpenses > 0 ? Math.min(200, totalActual / budgetedExpenses * 100) : 0;
  reactExports.useMemo(
    () => transactions.filter((t) => t.transactionType === TransactionType.Income).reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  reactExports.useMemo(
    () => transactions.filter((t) => t.transactionType === TransactionType.Expense).reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const chartData = [
    {
      name: "This Month",
      Income: totalIncome,
      "Planned Expenses": totalPlanned,
      "Actual Expenses": totalActual
    }
  ];
  const expenseCategories = reactExports.useMemo(
    () => categories.filter((c) => c.categoryType === TransactionType.Expense),
    [categories]
  );
  const analyticsFiltered = reactExports.useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      const matchMonth = selectedMonth === "all" || d.getMonth() + 1 === selectedMonth;
      const matchYear = selectedYear === "all" || d.getFullYear() === selectedYear;
      return matchMonth && matchYear;
    });
  }, [transactions, selectedMonth, selectedYear]);
  const analyticsIncome = reactExports.useMemo(
    () => analyticsFiltered.filter((t) => t.transactionType === TransactionType.Income).reduce((s, t) => s + t.amount, 0),
    [analyticsFiltered]
  );
  const analyticsExpenses = reactExports.useMemo(
    () => analyticsFiltered.filter((t) => t.transactionType === TransactionType.Expense).reduce((s, t) => s + t.amount, 0),
    [analyticsFiltered]
  );
  const analyticsSavings = reactExports.useMemo(
    () => Math.max(0, analyticsIncome - analyticsExpenses),
    [analyticsIncome, analyticsExpenses]
  );
  const analyticsSavingsRate = reactExports.useMemo(
    () => analyticsIncome > 0 ? analyticsSavings / analyticsIncome * 100 : 0,
    [analyticsSavings, analyticsIncome]
  );
  const analyticsNeeds50 = reactExports.useMemo(
    () => analyticsIncome * 0.5,
    [analyticsIncome]
  );
  const analyticsWants30 = reactExports.useMemo(
    () => analyticsIncome * 0.3,
    [analyticsIncome]
  );
  const analyticsSavings20 = reactExports.useMemo(
    () => analyticsIncome * 0.2,
    [analyticsIncome]
  );
  const analyticsCatMap = reactExports.useMemo(() => {
    const catMap = {};
    for (const t of analyticsFiltered.filter(
      (tx) => tx.transactionType === TransactionType.Expense
    )) {
      const cat = expenseCategories.find((c) => c.id === t.categoryId);
      const name = (cat == null ? void 0 : cat.name) ?? "Uncategorized";
      catMap[name] = (catMap[name] ?? 0) + t.amount;
    }
    return catMap;
  }, [analyticsFiltered, expenseCategories]);
  const analyticsTop5 = reactExports.useMemo(
    () => Object.entries(analyticsCatMap).sort((a, b) => b[1] - a[1]).slice(0, 5),
    [analyticsCatMap]
  );
  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editingTx) {
        const updated = { ...editingTx, ...form };
        await actor.updateTransaction(editingTx.id, updated);
        setTransactions(
          (prev) => prev.map((t) => t.id === editingTx.id ? updated : t)
        );
      } else {
        const newTx = { id: crypto.randomUUID(), ...form };
        await actor.createTransaction(newTx);
        setTransactions((prev) => [...prev, newTx]);
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };
  const yearRange = Array.from(
    { length: 5 },
    (_, i) => now.getFullYear() - 2 + i
  );
  const filteredCategories = categories.filter(
    (c) => c.categoryType === form.transactionType
  );
  const PRIORITY_CATS = [
    "Housing & Rent",
    "Groceries & Food",
    "Utilities & Bills",
    "Transportation",
    "Healthcare & Medical",
    "Education",
    "Insurance",
    "Entertainment & Leisure",
    "Clothing & Apparel",
    "Savings & Investments",
    "Travel & Vacation"
  ];
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const ai = PRIORITY_CATS.indexOf(a.name);
    const bi = PRIORITY_CATS.indexOf(b.name);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-96" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Month:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: selectedMonth === "all" ? "all" : String(selectedMonth),
            onValueChange: (v) => setSelectedMonth(v === "all" ? "all" : Number(v)),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "budgeting.month.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Months" }),
                MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, m))
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Year:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: selectedYear === "all" ? "all" : String(selectedYear),
            onValueChange: (v) => setSelectedYear(v === "all" ? "all" : Number(v)),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-28", "data-ocid": "budgeting.year.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Years" }),
                yearRange.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(y), children: y }, y))
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-slate-100 shadow-sm bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-600 mb-1", children: "% of Income Budget" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-[130px] h-[130px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { width: 130, height: 130, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Pie,
              {
                data: [
                  { value: _incomePct, fill: "#10b981" },
                  {
                    value: Math.max(0, 100 - _incomePct),
                    fill: "#f1f5f9"
                  }
                ],
                cx: 60,
                cy: 60,
                innerRadius: 45,
                outerRadius: 60,
                startAngle: 90,
                endAngle: -270,
                dataKey: "value",
                strokeWidth: 0,
                children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: i === 0 ? "#10b981" : "#f1f5f9" }, i))
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-emerald-600", children: [
              _incomePct.toFixed(0),
              "%"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
            "Budget: ",
            fmt$1(budgetedIncome, country)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
            "Balance:",
            " ",
            fmt$1(Math.max(0, budgetedIncome - totalIncome), country)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-600 mb-1", children: "% of Expenses Budget" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-[130px] h-[130px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { width: 130, height: 130, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Pie,
              {
                data: [
                  {
                    value: _expensePct,
                    fill: _expensePct > 90 ? "#ef4444" : "#f97316"
                  },
                  {
                    value: Math.max(0, 100 - _expensePct),
                    fill: "#f1f5f9"
                  }
                ],
                cx: 60,
                cy: 60,
                innerRadius: 45,
                outerRadius: 60,
                startAngle: 90,
                endAngle: -270,
                dataKey: "value",
                strokeWidth: 0,
                children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Cell,
                  {
                    fill: i === 0 ? _expensePct > 90 ? "#ef4444" : "#f97316" : "#f1f5f9"
                  },
                  i
                ))
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `text-lg font-bold ${_expensePct > 90 ? "text-red-500" : "text-orange-500"}`,
                children: [
                  _expensePct.toFixed(0),
                  "%"
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
            "Budget: ",
            fmt$1(budgetedExpenses, country)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
            "Balance:",
            " ",
            fmt$1(Math.max(0, budgetedExpenses - totalActual), country)
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "budgeting.income.card",
            className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 px-4 py-3 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 text-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Actual Income" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums", children: fmt$1(totalIncome, country) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "budgeting.actual.card",
            className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500 px-4 py-3 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3.5 h-3.5 text-rose-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Actual Expenses" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums", children: fmt$1(totalActual, country) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "budgeting.savings.card",
            className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-500 px-4 py-3 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "w-3.5 h-3.5 text-blue-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Total Savings" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `text-base font-bold tabular-nums ${totalIncome - totalActual >= 0 ? "text-blue-700" : "text-red-600"}`,
                  children: fmt$1(totalIncome - totalActual, country)
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "budgeting.savings_rate.card",
            className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-violet-500 px-4 py-3 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 text-violet-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Savings Rate" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `text-base font-bold tabular-nums ${totalIncome > 0 ? (totalIncome - totalActual) / totalIncome * 100 >= 20 ? "text-violet-700" : "text-amber-600" : "text-slate-500"}`,
                  children: [
                    totalIncome > 0 ? ((totalIncome - totalActual) / totalIncome * 100).toFixed(1) : "0.0",
                    "%"
                  ]
                }
              )
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-0 px-4 pt-2 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Budget vs Spending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "gap-1.5 h-7 text-xs",
            onClick: openEditPlanned,
            "data-ocid": "budgeting.edit_planned.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" }),
              "Edit Planned"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "overflow-x-auto",
          "data-ocid": "budgeting.breakdown.table",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-slate-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Planned Budget" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actual Spent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Variance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: "Type" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: expenseCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableCell,
              {
                colSpan: 5,
                className: "text-center text-muted-foreground py-8",
                children: "No expense categories found. Add categories in the Budget Categories tab."
              }
            ) }) : (() => {
              const rows = [...expenseCategories].map((cat) => {
                const actual = monthTxns.filter(
                  (t) => t.categoryId === cat.id && t.transactionType === TransactionType.Expense
                ).reduce((s, t) => s + t.amount, 0);
                return { cat, actual };
              }).sort((a, b) => b.actual - a.actual);
              const visibleRows = showAllBudget ? rows : rows.slice(0, 5);
              const remaining = rows.length - 5;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                visibleRows.map(({ cat, actual }) => {
                  const planned = getPlannedAmount(
                    cat.id,
                    cat.monthlyLimit
                  );
                  const variance = planned - actual;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                          style: { backgroundColor: cat.color }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: cat.name })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-sm", children: planned > 0 ? fmt$1(planned, country) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-sm", children: actual > 0 ? fmt$1(actual, country) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                      sym,
                      "0"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-sm", children: planned > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: variance >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium",
                        children: [
                          variance >= 0 ? "+" : "",
                          fmt$1(variance, country)
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE_COLORS$1[inferBudgetType$1(cat.name)] ?? TYPE_BADGE_COLORS$1.Needs}`,
                        children: inferBudgetType$1(cat.name)
                      }
                    ) })
                  ] }, cat.id);
                }),
                rows.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-xs text-blue-600 hover:text-blue-800 font-medium underline-offset-2 hover:underline",
                    onClick: () => setShowAllBudget((v) => !v),
                    "data-ocid": "budgeting.showmore.button",
                    children: showAllBudget ? "Show less" : `Show ${remaining} more entries`
                  }
                ) }) })
              ] });
            })() })
          ] })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editPlannedOpen, onOpenChange: setEditPlannedOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "budgeting.edit_planned.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Edit Planned Expenses —",
        " ",
        selectedMonth === "all" ? "All Months" : MONTHS[selectedMonth - 1],
        " ",
        selectedYear === "all" ? "All Years" : selectedYear
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-[60vh] overflow-y-auto pr-1", children: expenseCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-3 h-3 rounded-full flex-shrink-0",
            style: { backgroundColor: cat.color }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "flex-1 text-sm", children: cat.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            className: "w-32 h-8 text-sm",
            value: plannedDraft[cat.id] ?? 0,
            onChange: (e) => setPlannedDraft((d) => ({
              ...d,
              [cat.id]: Number(e.target.value)
            })),
            "data-ocid": "budgeting.planned_amount.input"
          }
        )
      ] }, cat.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "text-red-600 border-red-200 hover:bg-red-50",
            onClick: () => {
              resetMonth();
              refreshPlanned();
            },
            "data-ocid": "budgeting.reset_planned.button",
            children: "Reset Month"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setEditPlannedOpen(false),
            "data-ocid": "budgeting.cancel_planned.button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            onClick: () => {
              savePlanned();
              refreshPlanned();
            },
            "data-ocid": "budgeting.save_planned.button",
            children: "Save"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "budgeting.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingTx ? "Edit Transaction" : "Add Transaction" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.transactionType,
              onValueChange: (v) => setForm((f) => ({
                ...f,
                transactionType: v,
                categoryId: ""
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "budgeting.type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TransactionType.Income, children: "Income" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TransactionType.Expense, children: "Expense" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.categoryId,
              onValueChange: (v) => setForm((f) => ({ ...f, categoryId: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "budgeting.category.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sortedCategories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-2 h-2 rounded-full",
                      style: { backgroundColor: c.color }
                    }
                  ),
                  c.name
                ] }) }, c.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Amount (",
            sym,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "budgeting.amount.input",
              type: "number",
              value: form.amount,
              onChange: (e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "budgeting.date.input",
              type: "date",
              value: form.date,
              onChange: (e) => setForm((f) => ({ ...f, date: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "budgeting.description.input",
              value: form.description,
              onChange: (e) => setForm((f) => ({ ...f, description: e.target.value }))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            "data-ocid": "budgeting.cancel_button",
            onClick: () => setDialogOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "budgeting.submit_button",
            onClick: save,
            disabled: saving,
            children: saving ? "Saving..." : "Save"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-600 uppercase tracking-wide", children: "Budget Analytics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Month-over-Month Trend" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-ocid": "budgeting.mom_trend.chart", children: (() => {
            const now2 = /* @__PURE__ */ new Date();
            const data = Array.from({ length: 6 }, (_, i) => {
              const d = new Date(
                now2.getFullYear(),
                now2.getMonth() - 5 + i,
                1
              );
              const yr = d.getFullYear();
              const mo = d.getMonth();
              const label = d.toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit"
              });
              const income = transactions.filter((t) => {
                const td = new Date(t.date);
                return td.getFullYear() === yr && td.getMonth() === mo && t.transactionType === TransactionType.Income;
              }).reduce((s, t) => s + t.amount, 0);
              const expense = transactions.filter((t) => {
                const td = new Date(t.date);
                return td.getFullYear() === yr && td.getMonth() === mo && t.transactionType === TransactionType.Expense;
              }).reduce((s, t) => s + t.amount, 0);
              return { month: label, Income: income, Expenses: expense };
            });
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              BarChart,
              {
                data,
                margin: { top: 5, right: 20, left: 10, bottom: 5 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CartesianGrid,
                    {
                      strokeDasharray: "3 3",
                      opacity: 0.15,
                      vertical: false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: { fontSize: 10 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    YAxis,
                    {
                      tick: { fontSize: 10 },
                      tickFormatter: (v) => `${sym}${(v / 1e3).toFixed(0)}k`,
                      width: 50
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      formatter: (v, n) => [
                        formatCurrency(v),
                        n
                      ],
                      contentStyle: {
                        fontSize: "11px",
                        borderRadius: "10px"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "11px" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "Income",
                      fill: "#10b981",
                      radius: [4, 4, 0, 0]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "Expenses",
                      fill: "#f43f5e",
                      radius: [4, 4, 0, 0]
                    }
                  )
                ]
              }
            ) });
          })() })
        ] }),
        analyticsIncome > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700 flex items-center gap-2", children: "📐 50/30/20 Budget Rule Analysis" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Budget5030Chart,
            {
              income: analyticsIncome,
              expenses: analyticsExpenses,
              needs50: analyticsNeeds50,
              wants30: analyticsWants30,
              savings20: analyticsSavings20,
              savings: analyticsSavings,
              savingsRate: analyticsSavingsRate,
              formatCurrency
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Monthly Overview — Income vs Expenses" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-ocid": "budgeting.overview.chart", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            BarChart,
            {
              data: chartData,
              layout: "vertical",
              margin: { top: 5, right: 20, left: 60, bottom: 5 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YAxis,
                  {
                    type: "category",
                    dataKey: "name",
                    tick: { fontSize: 11 },
                    width: 60
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  XAxis,
                  {
                    type: "number",
                    tick: { fontSize: 11 },
                    tickFormatter: (v) => `${sym}${(v / 1e3).toFixed(0)}k`,
                    width: 50
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (v) => fmt$1(v, country) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { iconType: "circle", iconSize: 10 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "Income", fill: "#10b981", radius: [0, 4, 4, 0] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    dataKey: "Planned Expenses",
                    fill: "#6366f1",
                    radius: [0, 4, 4, 0]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bar,
                  {
                    dataKey: "Actual Expenses",
                    fill: "#ef4444",
                    radius: [0, 4, 4, 0]
                  }
                )
              ]
            }
          ) }) })
        ] }),
        analyticsIncome > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700", children: "📋 Monthly Budget Snapshot" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-[11px] font-semibold text-white uppercase", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right text-[11px] font-semibold text-white uppercase", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right text-[11px] font-semibold text-white uppercase", children: "% of Income" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-emerald-50/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs font-bold text-emerald-700", children: "✅ Total Income" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-right font-bold text-emerald-700 tabular-nums", children: formatCurrency(analyticsIncome) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-right font-bold text-emerald-700", children: "100%" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs font-semibold text-slate-600", children: "Fixed Costs (Needs)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-right tabular-nums text-slate-700", children: formatCurrency(analyticsNeeds50) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-right text-slate-500", children: "50%" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs font-semibold text-slate-600", children: "Variable Costs (Wants)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-right tabular-nums text-slate-700", children: formatCurrency(analyticsWants30) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-right text-slate-500", children: "30%" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-blue-50/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs font-bold text-blue-700", children: "💰 Savings Target" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-right font-bold text-blue-700 tabular-nums", children: formatCurrency(analyticsSavings20) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-right font-bold text-blue-700", children: "20%" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: analyticsSavings >= analyticsSavings20 ? "bg-green-50/80" : "bg-amber-50/80",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs font-bold text-slate-700", children: "Actual Savings" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: `px-4 py-2.5 text-xs text-right font-bold tabular-nums ${analyticsSavings >= analyticsSavings20 ? "text-green-700" : "text-amber-700"}`,
                        children: formatCurrency(analyticsSavings)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "td",
                      {
                        className: `px-4 py-2.5 text-xs text-right font-bold ${analyticsSavings >= analyticsSavings20 ? "text-green-700" : "text-amber-700"}`,
                        children: [
                          analyticsSavingsRate.toFixed(1),
                          "%"
                        ]
                      }
                    )
                  ]
                }
              )
            ] })
          ] }) }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700", children: "Spending by Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Top 8 categories by expense" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CardContent,
            {
              "data-ocid": "budgeting.spending_category.chart",
              className: "px-4 pb-4",
              children: (() => {
                const SC_COLORS = [
                  "#2563eb",
                  "#0891b2",
                  "#059669",
                  "#7c3aed",
                  "#d97706",
                  "#dc2626",
                  "#0d9488",
                  "#9333ea"
                ];
                const catMap = {};
                for (const t of transactions.filter(
                  (tx) => tx.transactionType === TransactionType.Expense
                )) {
                  const cat = categories.find((c) => c.id === t.categoryId);
                  if (cat) {
                    if (!catMap[cat.id]) {
                      catMap[cat.id] = {
                        name: cat.name,
                        value: 0,
                        color: cat.color || SC_COLORS[Object.keys(catMap).length % SC_COLORS.length]
                      };
                    }
                    catMap[cat.id].value += t.amount;
                  }
                }
                const catData = Object.values(catMap).filter((d) => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 8).map((d, i) => ({
                  ...d,
                  color: SC_COLORS[i % SC_COLORS.length]
                }));
                const total = catData.reduce((s, d) => s + d.value, 0);
                if (catData.length === 0)
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 flex items-center justify-center text-sm text-slate-400", children: "No expense data yet" });
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex-shrink-0",
                      style: { width: 180, height: 220 },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Pie,
                          {
                            data: catData,
                            cx: "50%",
                            cy: "50%",
                            innerRadius: 55,
                            outerRadius: 80,
                            dataKey: "value",
                            labelLine: false,
                            children: catData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Cell,
                              {
                                fill: entry.color,
                                stroke: "#fff",
                                strokeWidth: 2
                              },
                              entry.name
                            ))
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Tooltip,
                          {
                            formatter: (v) => [formatCurrency(v), ""],
                            contentStyle: {
                              fontSize: "11px",
                              borderRadius: "10px"
                            }
                          }
                        )
                      ] }) })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 flex-1 min-w-0", children: catData.map((entry) => {
                    const pct = total > 0 ? (entry.value / total * 100).toFixed(1) : "0";
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center justify-between gap-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                                style: { background: entry.color }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-600 truncate", children: entry.name })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-semibold text-slate-700 flex-shrink-0", children: [
                            pct,
                            "%"
                          ] })
                        ]
                      },
                      entry.name
                    );
                  }) })
                ] });
              })()
            }
          )
        ] }),
        analyticsIncome > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: analyticsTop5.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-slate-700", children: "🔍 Top Spending Categories" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5 space-y-3", children: analyticsTop5.map(([name, amount], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-700 truncate", children: name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-800 tabular-nums ml-2", children: formatCurrency(amount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full",
                  style: {
                    width: analyticsIncome > 0 ? `${Math.min(amount / analyticsIncome * 100, 100)}%` : "0%",
                    background: i === 0 ? "#ef4444" : i === 1 ? "#f97316" : "#f59e0b"
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-slate-400 mt-0.5", children: [
                analyticsIncome > 0 ? (amount / analyticsIncome * 100).toFixed(1) : "0",
                "% of income"
              ] })
            ] })
          ] }, name)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Budgeting (6 Months)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Planned budget vs actual expenses" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: (() => {
            const now2 = /* @__PURE__ */ new Date();
            const totalPlanned2 = categories.filter((c) => c.categoryType === TransactionType.Expense).reduce((s, c) => s + c.monthlyLimit, 0);
            const data = Array.from({ length: 6 }, (_, i) => {
              const d = new Date(
                now2.getFullYear(),
                now2.getMonth() - 5 + i,
                1
              );
              const yr = d.getFullYear();
              const mo = d.getMonth();
              const label = d.toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit"
              });
              const actual = transactions.filter((t) => {
                const td = new Date(t.date);
                return td.getFullYear() === yr && td.getMonth() === mo && t.transactionType === TransactionType.Expense;
              }).reduce((s, t) => s + t.amount, 0);
              return {
                month: label,
                Planned: totalPlanned2,
                Actual: actual
              };
            });
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              BarChart,
              {
                data,
                margin: { top: 5, right: 20, left: 10, bottom: 5 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CartesianGrid,
                    {
                      strokeDasharray: "3 3",
                      opacity: 0.15,
                      vertical: false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: { fontSize: 10 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    YAxis,
                    {
                      tick: { fontSize: 10 },
                      tickFormatter: (v) => formatCurrency(v),
                      width: 52
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      formatter: (v, name) => [
                        formatCurrency(v),
                        name
                      ],
                      contentStyle: {
                        fontSize: "11px",
                        borderRadius: "10px"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "11px" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "Planned",
                      fill: "#10b981",
                      radius: [4, 4, 0, 0],
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        LabelList,
                        {
                          dataKey: "Planned",
                          position: "top",
                          style: { fontSize: "9px", fill: "#10b981" },
                          formatter: (v) => shortNum(v, sym, country.code)
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Bar,
                    {
                      dataKey: "Actual",
                      fill: "#f43f5e",
                      radius: [4, 4, 0, 0],
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        LabelList,
                        {
                          dataKey: "Actual",
                          position: "top",
                          style: { fontSize: "9px", fill: "#f43f5e" },
                          formatter: (v) => shortNum(v, sym, country.code)
                        }
                      )
                    }
                  )
                ]
              }
            ) });
          })() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Savings Rate Trend (%)" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-ocid": "budgeting.savings_rate.chart", children: (() => {
            const now2 = /* @__PURE__ */ new Date();
            const data = Array.from({ length: 6 }, (_, i) => {
              const d = new Date(
                now2.getFullYear(),
                now2.getMonth() - 5 + i,
                1
              );
              const yr = d.getFullYear();
              const mo = d.getMonth();
              const label = d.toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit"
              });
              const income = transactions.filter((t) => {
                const td = new Date(t.date);
                return td.getFullYear() === yr && td.getMonth() === mo && t.transactionType === TransactionType.Income;
              }).reduce((s, t) => s + t.amount, 0);
              const expense = transactions.filter((t) => {
                const td = new Date(t.date);
                return td.getFullYear() === yr && td.getMonth() === mo && t.transactionType === TransactionType.Expense;
              }).reduce((s, t) => s + t.amount, 0);
              const rate = income > 0 ? Math.round((income - expense) / income * 100) : 0;
              return { month: label, "Savings Rate": rate };
            });
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              LineChart,
              {
                data,
                margin: { top: 5, right: 20, left: 10, bottom: 5 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CartesianGrid,
                    {
                      strokeDasharray: "3 3",
                      opacity: 0.15,
                      vertical: false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: { fontSize: 10 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    YAxis,
                    {
                      tick: { fontSize: 10 },
                      tickFormatter: (v) => `${v}%`,
                      width: 40,
                      domain: ["auto", "auto"]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip,
                    {
                      formatter: (v) => [`${v}%`, "Savings Rate"],
                      contentStyle: {
                        fontSize: "11px",
                        borderRadius: "10px"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "Savings Rate",
                      stroke: "#6366f1",
                      strokeWidth: 2.5,
                      dot: { fill: "#6366f1", r: 4 },
                      activeDot: { r: 6 },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        LabelList,
                        {
                          dataKey: "Savings Rate",
                          position: "top",
                          style: { fontSize: "9px", fill: "#6366f1" },
                          formatter: (v) => `${v}%`
                        }
                      )
                    }
                  )
                ]
              }
            ) });
          })() })
        ] })
      ] })
    ] })
  ] });
}
const WANTS_KEYWORDS = [
  "dining",
  "eating out",
  "restaurant",
  "entertainment",
  "streaming",
  "netflix",
  "subscription",
  "shopping",
  "clothing",
  "travel",
  "vacation",
  "gym",
  "fitness",
  "hobbies",
  "personal care",
  "beauty",
  "salon",
  "electronics",
  "games",
  "leisure"
];
const SAVINGS_KEYWORDS = [
  "savings",
  "investment",
  "sip",
  "ppf",
  "nps",
  "fd",
  "emergency",
  "mutual fund",
  "retirement",
  "stocks",
  "retiral"
];
function inferBudgetType(name) {
  const lc = name.toLowerCase();
  if (SAVINGS_KEYWORDS.some((k) => lc.includes(k))) return "Savings";
  if (WANTS_KEYWORDS.some((k) => lc.includes(k))) return "Wants";
  return "Needs";
}
const TYPE_BADGE_COLORS = {
  Needs: "bg-blue-100 text-blue-700 border border-blue-200",
  Wants: "bg-amber-100 text-amber-700 border border-amber-200",
  Savings: "bg-emerald-100 text-emerald-700 border border-emerald-200"
};
const emptyForm = {
  name: "",
  categoryType: TransactionType.Expense,
  monthlyLimit: 0,
  color: "#6366f1",
  budgetType: "Needs"
};
function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);
}
const STANDARD_CATEGORIES = [
  {
    name: "Salary & Wages",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#10b981"
  },
  {
    name: "Business Income",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#059669"
  },
  {
    name: "Freelance / Consulting",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#34d399"
  },
  {
    name: "Investment Returns",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#6ee7b7"
  },
  {
    name: "Rental Income",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#a7f3d0"
  },
  {
    name: "Other Income",
    categoryType: TransactionType.Income,
    monthlyLimit: 0,
    color: "#d1fae5"
  },
  {
    name: "Housing & Rent",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#6366f1"
  },
  {
    name: "Groceries & Food",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#f59e0b"
  },
  {
    name: "Utilities & Bills",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#3b82f6"
  },
  {
    name: "Transportation",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#8b5cf6"
  },
  {
    name: "Healthcare & Medical",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#ef4444"
  },
  {
    name: "Insurance",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#ec4899"
  },
  {
    name: "Education",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#06b6d4"
  },
  {
    name: "Entertainment & Leisure",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#a855f7"
  },
  {
    name: "Dining & Restaurants",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#f97316"
  },
  {
    name: "Personal Care & Wellness",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#db2777"
  },
  {
    name: "Clothing & Apparel",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#7c3aed"
  },
  {
    name: "Savings & Investments",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#0ea5e9"
  },
  {
    name: "Debt Payments & EMI",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#dc2626"
  },
  {
    name: "Subscriptions & Software",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#4f46e5"
  },
  {
    name: "Travel & Vacation",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#0891b2"
  },
  {
    name: "Gifts & Donations",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#be185d"
  },
  {
    name: "Childcare & Family",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#d97706"
  },
  {
    name: "Home Maintenance",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#78716c"
  },
  {
    name: "Miscellaneous",
    categoryType: TransactionType.Expense,
    monthlyLimit: 0,
    color: "#94a3b8"
  }
];
const NEEDS_CATEGORIES = [
  { key: "housing", label: "Housing & Rent", default: 15e3 },
  { key: "groceries", label: "Groceries & Food", default: 8e3 },
  { key: "utilities", label: "Utilities & Bills", default: 3e3 },
  { key: "transport", label: "Transportation", default: 5e3 },
  { key: "healthcare", label: "Healthcare & Medical", default: 2e3 },
  { key: "insurance", label: "Insurance Premiums", default: 2e3 },
  { key: "education", label: "Education", default: 3e3 },
  { key: "emi", label: "Debt Payments & EMI", default: 5e3 }
];
const WANTS_CATEGORIES = [
  { key: "dining", label: "Dining & Restaurants", default: 4e3 },
  { key: "entertainment", label: "Entertainment & Leisure", default: 2e3 },
  { key: "personalcare", label: "Personal Care & Wellness", default: 1500 },
  { key: "clothing", label: "Clothing & Apparel", default: 2e3 },
  { key: "subscriptions", label: "Subscriptions & Software", default: 1e3 },
  { key: "travel", label: "Travel & Vacation", default: 1500 }
];
const SAVINGS_CATEGORIES = [
  { key: "investments", label: "Savings & Investments", default: 5e3 },
  { key: "emergency", label: "Emergency Fund", default: 2e3 },
  { key: "retirement", label: "Retirement / NPS / PPF", default: 1e3 }
];
function ImproveBudgetContent({ autofillData }) {
  const { formatCurrency } = useCurrency();
  const [income, setIncome] = reactExports.useState(5e4);
  const [needs, setNeeds] = reactExports.useState(
    Object.fromEntries(NEEDS_CATEGORIES.map((c) => [c.key, c.default]))
  );
  const [wants, setWants] = reactExports.useState(
    Object.fromEntries(WANTS_CATEGORIES.map((c) => [c.key, c.default]))
  );
  const [savings, setSavings] = reactExports.useState(
    Object.fromEntries(SAVINGS_CATEGORIES.map((c) => [c.key, c.default]))
  );
  const [applied, setApplied] = reactExports.useState(false);
  const [analysed, setAnalysed] = reactExports.useState(false);
  const [monthlyReductionTarget, setMonthlyReductionTarget] = reactExports.useState(0);
  const [isFreelancer, setIsFreelancer] = reactExports.useState(false);
  const [minIncome, setMinIncome] = reactExports.useState(0);
  const [maxIncome, setMaxIncome] = reactExports.useState(0);
  const totalNeeds = Object.values(needs).reduce((s, v) => s + v, 0);
  const totalWants = Object.values(wants).reduce((s, v) => s + v, 0);
  const totalSavings = Object.values(savings).reduce((s, v) => s + v, 0);
  const totalExpenses = totalNeeds + totalWants + totalSavings;
  const surplus = income - totalExpenses;
  const needsPct = income > 0 ? totalNeeds / income * 100 : 0;
  const wantsPct = income > 0 ? totalWants / income * 100 : 0;
  const savingsPct = income > 0 ? totalSavings / income * 100 : 0;
  const applyAutofillData = (data) => {
    if (!data) return;
    setIncome(data.income || 5e4);
    if (data.categoryAmounts && Object.keys(data.categoryAmounts).length > 0) {
      const catAmts = data.categoryAmounts;
      setNeeds(
        Object.fromEntries(
          NEEDS_CATEGORIES.map((c) => [
            c.key,
            catAmts[c.key] !== void 0 ? catAmts[c.key] : c.default
          ])
        )
      );
      setWants(
        Object.fromEntries(
          WANTS_CATEGORIES.map((c) => [
            c.key,
            catAmts[c.key] !== void 0 ? catAmts[c.key] : c.default
          ])
        )
      );
      setSavings(
        Object.fromEntries(
          SAVINGS_CATEGORIES.map((c) => [
            c.key,
            catAmts[c.key] !== void 0 ? catAmts[c.key] : c.default
          ])
        )
      );
    } else {
      if (data.needs > 0) {
        const ratio = data.needs / NEEDS_CATEGORIES.reduce((s, c) => s + c.default, 0);
        setNeeds(
          Object.fromEntries(
            NEEDS_CATEGORIES.map((c) => [c.key, Math.round(c.default * ratio)])
          )
        );
      }
      if (data.wants > 0) {
        const ratio = data.wants / WANTS_CATEGORIES.reduce((s, c) => s + c.default, 0);
        setWants(
          Object.fromEntries(
            WANTS_CATEGORIES.map((c) => [c.key, Math.round(c.default * ratio)])
          )
        );
      }
      if (data.savings > 0) {
        const ratio = data.savings / SAVINGS_CATEGORIES.reduce((s, c) => s + c.default, 0);
        setSavings(
          Object.fromEntries(
            SAVINGS_CATEGORIES.map((c) => [
              c.key,
              Math.round(c.default * ratio)
            ])
          )
        );
      }
    }
    setApplied(true);
  };
  reactExports.useEffect(() => {
    if (autofillData && !applied) {
      applyAutofillData(autofillData);
    }
  }, [autofillData]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    applied && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-emerald-700 font-medium flex-1", children: "✓ Actual data applied for selected month. Adjust values as needed, then click Analyse Budget." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setApplied(false);
            setNeeds(
              Object.fromEntries(
                NEEDS_CATEGORIES.map((c) => [c.key, c.default])
              )
            );
            setWants(
              Object.fromEntries(
                WANTS_CATEGORIES.map((c) => [c.key, c.default])
              )
            );
            setSavings(
              Object.fromEntries(
                SAVINGS_CATEGORIES.map((c) => [c.key, c.default])
              )
            );
            setIncome(5e4);
          },
          className: "h-7 px-3 rounded-lg bg-white border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors flex-shrink-0",
          children: "Clear"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-emerald-800", children: "💰 Income" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-4 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "improve-income",
              className: "text-xs font-medium text-slate-600 block mb-1",
              children: "Monthly Income (consolidated)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "improve-income",
              type: "number",
              value: income,
              onChange: (e) => setIncome(Number(e.target.value) || 0),
              className: "w-full h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-0.5", children: "Total Monthly Income" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-emerald-700", children: formatCurrency(income) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-blue-800", children: "🏠 Needs (Target: 50%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `text-xs font-semibold px-2 py-0.5 rounded-full ${needsPct <= 50 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
            children: [
              needsPct.toFixed(1),
              "% of income"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: NEEDS_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-600 min-w-[140px] flex-shrink-0", children: cat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: needs[cat.key] ?? cat.default,
              onChange: (e) => setNeeds((prev) => ({
                ...prev,
                [cat.key]: Number(e.target.value) || 0
              })),
              className: "flex-1 h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
          )
        ] }, cat.key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-600", children: "Total Needs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-blue-700", children: formatCurrency(totalNeeds) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-amber-800", children: "🎉 Wants (Target: 30%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `text-xs font-semibold px-2 py-0.5 rounded-full ${wantsPct <= 30 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
            children: [
              wantsPct.toFixed(1),
              "% of income"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: WANTS_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-600 min-w-[140px] flex-shrink-0", children: cat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: wants[cat.key] ?? cat.default,
              onChange: (e) => setWants((prev) => ({
                ...prev,
                [cat.key]: Number(e.target.value) || 0
              })),
              className: "flex-1 h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-amber-400"
            }
          )
        ] }, cat.key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-600", children: "Total Wants" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-amber-700", children: formatCurrency(totalWants) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-emerald-800", children: "💎 Savings (Target: 20%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `text-xs font-semibold px-2 py-0.5 rounded-full ${savingsPct >= 20 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`,
            children: [
              savingsPct.toFixed(1),
              "% of income"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: SAVINGS_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-600 min-w-[140px] flex-shrink-0", children: cat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: savings[cat.key] ?? cat.default,
              onChange: (e) => setSavings((prev) => ({
                ...prev,
                [cat.key]: Number(e.target.value) || 0
              })),
              className: "flex-1 h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
            }
          )
        ] }, cat.key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-600", children: "Total Savings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-emerald-700", children: formatCurrency(totalSavings) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-purple-800", children: "🎯 Optional Goals & Settings" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-4 pt-3 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "monthly-reduction",
              className: "text-xs font-medium text-slate-600 block mb-1",
              children: [
                "Monthly Savings Target (",
                formatCurrency(0).replace("0", ""),
                "0)"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "monthly-reduction",
              type: "number",
              value: monthlyReductionTarget,
              onChange: (e) => setMonthlyReductionTarget(Number(e.target.value) || 0),
              className: "w-full h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400",
              placeholder: "0"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "freelancer-check",
              type: "checkbox",
              checked: isFreelancer,
              onChange: (e) => setIsFreelancer(e.target.checked),
              className: "w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-400"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "freelancer-check",
              className: "text-xs font-medium text-slate-700",
              children: "I am a freelancer / have variable income"
            }
          )
        ] }),
        isFreelancer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 pl-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "min-income",
                className: "text-xs font-medium text-slate-600 block mb-1",
                children: "Min Monthly Income"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "min-income",
                type: "number",
                value: minIncome,
                onChange: (e) => setMinIncome(Number(e.target.value) || 0),
                className: "w-full h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "max-income",
                className: "text-xs font-medium text-slate-600 block mb-1",
                children: "Max Monthly Income"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "max-income",
                type: "number",
                value: maxIncome,
                onChange: (e) => setMaxIncome(Number(e.target.value) || 0),
                className: "w-full h-8 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setAnalysed(true),
        className: "w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm",
        "data-ocid": "improve_budget.submit_button",
        children: "🔍 Analyse Budget"
      }
    ),
    analysed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white border border-slate-200 border-l-4 border-l-emerald-500 px-3 py-2.5 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5", children: "Monthly Income" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-emerald-700", children: formatCurrency(income) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-slate-400 mt-0.5", children: "Actual" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-xl bg-white border border-l-4 px-3 py-2.5 shadow-sm ${needsPct <= 50 ? "border-blue-200 border-l-blue-500" : "border-red-200 border-l-red-500"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5", children: "Needs (50% ideal)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-bold ${needsPct <= 50 ? "text-blue-700" : "text-red-600"}`,
                  children: formatCurrency(totalNeeds)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-slate-400 mt-0.5", children: [
                "Ideal: ",
                formatCurrency(income * 0.5)
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-xl bg-white border border-l-4 px-3 py-2.5 shadow-sm ${wantsPct <= 30 ? "border-amber-200 border-l-amber-500" : "border-red-200 border-l-red-500"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5", children: "Wants (30% ideal)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-bold ${wantsPct <= 30 ? "text-amber-700" : "text-red-600"}`,
                  children: formatCurrency(totalWants)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-slate-400 mt-0.5", children: [
                "Ideal: ",
                formatCurrency(income * 0.3)
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-xl bg-white border border-l-4 px-3 py-2.5 shadow-sm ${savingsPct >= 20 ? "border-violet-200 border-l-violet-500" : "border-amber-200 border-l-amber-500"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5", children: "Savings Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-sm font-bold ${savingsPct >= 20 ? "text-violet-700" : "text-amber-600"}`,
                  children: [
                    savingsPct.toFixed(1),
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-slate-400 mt-0.5", children: "Ideal: 20%" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-slate-100 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-slate-800", children: "📊 50/30/20 Analysis Summary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-5 pb-5 pt-3 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-center shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 font-medium mb-0.5", children: "Income" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-emerald-700", children: formatCurrency(income) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-xl border px-3 py-2.5 text-center shadow-sm ${needsPct <= 50 ? "border-blue-100 bg-blue-50" : "border-red-100 bg-red-50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 font-medium mb-0.5", children: "Needs" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: `text-sm font-bold ${needsPct <= 50 ? "text-blue-700" : "text-red-600"}`,
                      children: [
                        needsPct.toFixed(1),
                        "%",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: "(target 50%)" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-xl border px-3 py-2.5 text-center shadow-sm ${wantsPct <= 30 ? "border-amber-100 bg-amber-50" : "border-red-100 bg-red-50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 font-medium mb-0.5", children: "Wants" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: `text-sm font-bold ${wantsPct <= 30 ? "text-amber-700" : "text-red-600"}`,
                      children: [
                        wantsPct.toFixed(1),
                        "%",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: "(target 30%)" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `rounded-xl border px-3 py-2.5 text-center shadow-sm ${savingsPct >= 20 ? "border-emerald-100 bg-emerald-50" : "border-amber-100 bg-amber-50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 font-medium mb-0.5", children: "Savings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: `text-sm font-bold ${savingsPct >= 20 ? "text-emerald-700" : "text-amber-600"}`,
                      children: [
                        savingsPct.toFixed(1),
                        "%",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: "(target 20%)" })
                      ]
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-2.5 font-semibold text-slate-600", children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Ideal %" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Actual %" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Ideal Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Actual Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Variance" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              [
                {
                  name: "Needs",
                  ideal: 50,
                  actual: needsPct,
                  actualAmt: totalNeeds
                },
                {
                  name: "Wants",
                  ideal: 30,
                  actual: wantsPct,
                  actualAmt: totalWants
                },
                {
                  name: "Savings",
                  ideal: 20,
                  actual: savingsPct,
                  actualAmt: totalSavings
                }
              ].map((row) => {
                const idealAmt = income * row.ideal / 100;
                const variance = row.actualAmt - idealAmt;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-slate-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 font-medium text-slate-700", children: row.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 text-right text-slate-500", children: [
                    row.ideal,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "td",
                    {
                      className: `p-2.5 text-right font-semibold ${Math.abs(row.actual - row.ideal) <= 5 ? "text-emerald-600" : "text-amber-600"}`,
                      children: [
                        row.actual.toFixed(1),
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-600", children: formatCurrency(idealAmt) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-700 font-medium", children: formatCurrency(row.actualAmt) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "td",
                    {
                      className: `p-2.5 text-right font-semibold ${variance <= 0 ? "text-emerald-600" : "text-red-500"}`,
                      children: [
                        variance > 0 ? "+" : "",
                        formatCurrency(variance)
                      ]
                    }
                  )
                ] }, row.name);
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-slate-200 bg-slate-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 font-bold text-slate-800", children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-500", children: "100%" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 text-right font-bold text-slate-700", children: [
                  (needsPct + wantsPct + savingsPct).toFixed(1),
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-600", children: formatCurrency(income) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right font-bold text-slate-800", children: formatCurrency(totalExpenses) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    className: `p-2.5 text-right font-bold ${surplus >= 0 ? "text-emerald-600" : "text-red-600"}`,
                    children: [
                      surplus >= 0 ? "Surplus " : "Deficit ",
                      formatCurrency(Math.abs(surplus))
                    ]
                  }
                )
              ] })
            ] })
          ] }) }),
          surplus < 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-red-800", children: [
              "⚠️ Budget Deficit of ",
              formatCurrency(Math.abs(surplus))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-600 mt-0.5", children: "Your expenses exceed income. Consider reducing Wants categories or finding additional income sources." })
          ] }),
          surplus >= 0 && savingsPct >= 20 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50 border border-emerald-200 rounded-xl p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-emerald-800", children: "✅ On Track with 50/30/20 Rule" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-700 mt-0.5", children: [
              "You have a surplus of ",
              formatCurrency(surplus),
              " and are saving ",
              savingsPct.toFixed(1),
              "% of income. Consider investing the surplus for wealth creation."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-red-100 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-red-800", children: "🚨 Top Money Leakage Areas" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-4 pt-3", children: (() => {
          const leaks = [];
          const {
            dining: d = 0,
            entertainment: ent = 0,
            subscriptions: sub = 0,
            clothing = 0
          } = wants;
          const { housing: rent = 0, emi = 0 } = needs;
          if (income > 0 && d + ent > income * 0.07) {
            const excess = Math.max(0, d + ent - income * 0.07);
            leaks.push({
              area: "Dining & Entertainment",
              message: `Spending ${((d + ent) / income * 100).toFixed(1)}% on dining & entertainment (ideal ≤7%)`,
              saving: Math.round(excess)
            });
          }
          if (income > 0 && sub > income * 0.025) {
            const excess = Math.max(0, sub - income * 0.025);
            leaks.push({
              area: "Subscriptions",
              message: `Subscriptions at ${(sub / income * 100).toFixed(1)}% of income (ideal ≤2.5%)`,
              saving: Math.round(excess)
            });
          }
          if (income > 0 && rent > income * 0.3) {
            const excess = Math.max(0, rent - income * 0.3);
            leaks.push({
              area: "Housing & Rent",
              message: `Rent is ${(rent / income * 100).toFixed(1)}% of income (ideal ≤30%)`,
              saving: Math.round(excess)
            });
          }
          if (income > 0 && emi > income * 0.35) {
            const excess = Math.max(0, emi - income * 0.35);
            leaks.push({
              area: "EMIs & Loan Payments",
              message: `Debt payments at ${(emi / income * 100).toFixed(1)}% of income (ideal ≤35%)`,
              saving: Math.round(excess)
            });
          }
          if (income > 0 && clothing > income * 0.05) {
            const excess = Math.max(0, clothing - income * 0.05);
            leaks.push({
              area: "Clothing & Shopping",
              message: `Clothing at ${(clothing / income * 100).toFixed(1)}% of income (ideal ≤5%)`,
              saving: Math.round(excess)
            });
          }
          if (leaks.length === 0) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-emerald-700 font-medium py-2", children: "✅ No major leakage areas detected. Your budget looks well-controlled!" });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: leaks.slice(0, 4).map((leak) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-red-200 bg-red-50 p-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🚨" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-red-800", children: leak.area })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-700", children: leak.message }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-700 mt-1.5 font-semibold", children: [
                  "💡 Save ",
                  formatCurrency(leak.saving),
                  "/mo by reducing this"
                ] })
              ]
            },
            leak.area
          )) });
        })() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-emerald-100 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-emerald-800", children: "⚡ Your Quick Win — Do This Today" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-4 pt-3", children: (() => {
          const {
            dining: d = 0,
            entertainment: ent = 0,
            subscriptions: sub = 0
          } = wants;
          const { housing: rent = 0 } = needs;
          if (income > 0 && sub > income * 0.025) {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-700", children: [
              "📱 ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Cancel or downgrade 1–2 subscriptions." }),
              " ",
              "You're spending ",
              formatCurrency(sub),
              "/mo on subscriptions. Cutting unused ones can save",
              " ",
              formatCurrency(
                Math.max(0, sub - Math.round(income * 0.025))
              ),
              "/mo immediately."
            ] });
          }
          if (income > 0 && d + ent > income * 0.07) {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-700", children: [
              "🍽️ ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Cut dining out by 30% this month." }),
              " At",
              " ",
              formatCurrency(d + ent),
              "/mo, reducing by 30% saves",
              " ",
              formatCurrency(Math.round((d + ent) * 0.3)),
              "/mo with no major lifestyle change."
            ] });
          }
          if (savingsPct < 10 && income > 0) {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-700", children: [
              "💰",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                "Set up a ",
                formatCurrency(Math.round(income * 0.05)),
                " ",
                "auto-SIP today."
              ] }),
              " ",
              "Even saving 5% (",
              formatCurrency(Math.round(income * 0.05)),
              "/mo) compounds to ",
              formatCurrency(Math.round(income * 0.05 * 12 * 1.12)),
              " ",
              "in 1 year."
            ] });
          }
          if (rent > income * 0.3) {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-700", children: [
              "🏠",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Consider downsizing or finding a flatmate." }),
              " ",
              "Housing at ",
              (rent / income * 100).toFixed(0),
              "% of income is high. Reducing by",
              " ",
              formatCurrency(Math.round(rent * 0.1)),
              "/mo frees up significant cash flow."
            ] });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-700", children: [
            "📊",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              "Increase your SIP by",
              " ",
              formatCurrency(Math.round(income * 0.02)),
              "/mo."
            ] }),
            " ",
            "You're in a good position. Adding just 2% more to investments accelerates wealth creation significantly."
          ] });
        })() })
      ] }),
      isFreelancer && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-blue-100 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-blue-800", children: "💼 Freelancer Budget Rules" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-4 pt-3 space-y-2", children: [
          {
            tip: "Build a 6-month emergency fund (≥6×monthly expenses) before investing aggressively.",
            icon: "🛡️"
          },
          {
            tip: `Plan around your min income (${formatCurrency(minIncome)}). Treat extra income as a bonus to invest.`,
            icon: "📉"
          },
          {
            tip: "Set aside 30% of every payment for taxes immediately. Keep it in a separate account.",
            icon: "💸"
          },
          {
            tip: "Use the variable income range to plan for worst-case budgeting. Your buffer needs = Max-Min gap.",
            icon: "📊"
          },
          {
            tip: "Automate savings on good months. Invest the surplus from high-income months systematically.",
            icon: "⚡"
          }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base flex-shrink-0", children: item.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-700", children: item.tip })
            ]
          },
          item.tip.slice(0, 20)
        )) })
      ] }),
      monthlyReductionTarget > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-2xl border border-amber-100 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-bold text-amber-800", children: [
          "📉 Reduction Suggestions to Hit",
          " ",
          formatCurrency(monthlyReductionTarget),
          "/mo Target"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-4 pt-3 space-y-2", children: (() => {
          const currentSavings = Math.max(0, income - totalExpenses);
          const gap = Math.max(
            0,
            monthlyReductionTarget - currentSavings
          );
          if (gap <= 0)
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-700 font-medium", children: [
              "✅ Your current savings (",
              formatCurrency(currentSavings),
              "/mo) already meets your target!"
            ] });
          const suggestions = [];
          const {
            dining: d = 0,
            entertainment: ent = 0,
            subscriptions: sub = 0,
            clothing = 0
          } = wants;
          if (d + ent > 0)
            suggestions.push(
              `Reduce dining & entertainment by ${formatCurrency(Math.min(Math.round((d + ent) * 0.25), gap))}/mo`
            );
          if (sub > 500)
            suggestions.push(
              `Review subscriptions — save ${formatCurrency(Math.min(Math.round(sub * 0.4), gap))}/mo`
            );
          if (clothing > 0)
            suggestions.push(
              `Pause clothing spending for 1-2 months — save ${formatCurrency(Math.min(clothing, gap))}/mo`
            );
          if (suggestions.length === 0)
            suggestions.push(
              "Focus on reducing wants categories to bridge the gap."
            );
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 mb-2", children: [
              "You need ",
              formatCurrency(gap),
              "/mo more in savings:"
            ] }),
            suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs text-slate-700 flex items-start gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-500 flex-shrink-0", children: "→" }),
                  s
                ]
              },
              s.slice(0, 20)
            ))
          ] });
        })() })
      ] })
    ] })
  ] });
}
function BudgetingPage() {
  const { actor } = useActor();
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [saving, setSaving] = reactExports.useState(false);
  const [seeding, setSeeding] = reactExports.useState(false);
  const [showAllPlanIncome, setShowAllPlanIncome] = reactExports.useState(false);
  const _lastMonthDate = /* @__PURE__ */ new Date();
  _lastMonthDate.setMonth(_lastMonthDate.getMonth() - 1);
  const [autofillMonth, setAutofillMonth] = reactExports.useState(
    _lastMonthDate.getMonth()
  );
  const [autofillYear, setAutofillYear] = reactExports.useState(
    _lastMonthDate.getFullYear()
  );
  const [autofillData, setAutofillData] = reactExports.useState(null);
  const [transactions, setTransactions] = reactExports.useState([]);
  const load = () => {
    if (!actor) return;
    setLoading(true);
    Promise.all([
      actor.getAllBudgetCategories(),
      actor.getAllTransactions().catch(() => [])
    ]).then(([cats, txns]) => {
      setCategories(cats);
      setTransactions(txns);
    }).finally(() => setLoading(false));
  };
  reactExports.useEffect(load, [actor]);
  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name,
      categoryType: c.categoryType,
      monthlyLimit: c.monthlyLimit,
      color: c.color,
      budgetType: inferBudgetType(c.name)
    });
    setOpen(true);
  };
  const save = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = { ...editing, ...form };
        await actor.updateBudgetCategory(editing.id, updated);
        setCategories(
          (prev) => prev.map((c) => c.id === editing.id ? updated : c)
        );
      } else {
        const newCat = { id: crypto.randomUUID(), ...form };
        await actor.createBudgetCategory(newCat);
        setCategories((prev) => [...prev, newCat]);
      }
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };
  const del = async (id) => {
    if (!actor) return;
    await actor.deleteBudgetCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };
  const seedStandardCategories = async () => {
    if (!actor) return;
    setSeeding(true);
    try {
      const existingNames = new Set(
        categories.map((c) => c.name.toLowerCase())
      );
      const toCreate = STANDARD_CATEGORIES.filter(
        (sc) => !existingNames.has(sc.name.toLowerCase())
      );
      await Promise.all(
        toCreate.map(
          (sc) => actor.createBudgetCategory({ id: crypto.randomUUID(), ...sc })
        )
      );
      load();
    } finally {
      setSeeding(false);
    }
  };
  const handleAutofill = () => {
    var _a;
    const monthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === autofillMonth && d.getFullYear() === autofillYear;
    });
    if (monthTx.length === 0) {
      ue.error("No transactions found for the selected month");
      return;
    }
    const income = monthTx.filter((t) => Object.keys(t.transactionType)[0] === "Income").reduce((s, t) => s + t.amount, 0);
    const expenses = monthTx.filter(
      (t) => Object.keys(t.transactionType)[0] === "Expense"
    );
    const catTypeMap = {};
    for (const c of categories) {
      const lc = c.name.toLowerCase();
      if ([
        "savings",
        "investment",
        "sip",
        "ppf",
        "nps",
        "fd",
        "emergency",
        "mutual fund",
        "retirement"
      ].some((k) => lc.includes(k))) {
        catTypeMap[c.id] = "Savings";
      } else if ([
        "dining",
        "eating out",
        "entertainment",
        "streaming",
        "subscription",
        "shopping",
        "clothing",
        "travel",
        "gym",
        "leisure"
      ].some((k) => lc.includes(k))) {
        catTypeMap[c.id] = "Wants";
      } else {
        catTypeMap[c.id] = "Needs";
      }
    }
    const needs = expenses.filter((t) => (catTypeMap[t.categoryId] ?? "Needs") === "Needs").reduce((s, t) => s + t.amount, 0);
    const wants = expenses.filter((t) => (catTypeMap[t.categoryId] ?? "Needs") === "Wants").reduce((s, t) => s + t.amount, 0);
    const savings = expenses.filter((t) => (catTypeMap[t.categoryId] ?? "Needs") === "Savings").reduce((s, t) => s + t.amount, 0);
    const categoryAmounts = {};
    const KEY_MAP = {
      housing: ["housing", "rent", "mortgage"],
      groceries: ["groceries", "food", "grocery"],
      utilities: ["utilities", "water", "electricity", "gas", "bill"],
      transport: ["transport", "commute", "petrol", "fuel", "metro", "cab"],
      healthcare: ["healthcare", "medical", "health", "pharmacy"],
      insurance: ["insurance", "premium"],
      education: ["education", "school", "college", "tuition", "childcare"],
      emi: ["emi", "loan payment", "debt payment"],
      dining: [
        "dining",
        "eating out",
        "restaurant",
        "takeout",
        "zomato",
        "swiggy"
      ],
      entertainment: ["entertainment", "leisure", "games", "cinema", "movie"],
      personalcare: ["personal care", "salon", "beauty", "grooming"],
      clothing: ["clothing", "shopping", "apparel", "fashion"],
      subscriptions: [
        "subscription",
        "streaming",
        "netflix",
        "spotify",
        "amazon prime"
      ],
      travel: ["travel", "vacation", "holiday", "trip"],
      investments: ["savings", "investment", "sip", "mutual fund", "stocks"],
      emergency: ["emergency fund", "emergency"],
      retirement: ["retirement", "nps", "ppf", "pension"]
    };
    for (const exp of expenses) {
      const cat = categories.find((c) => c.id === exp.categoryId);
      const catName = ((_a = cat == null ? void 0 : cat.name) == null ? void 0 : _a.toLowerCase()) ?? "";
      for (const [budgetKey, keywords] of Object.entries(KEY_MAP)) {
        if (keywords.some((k) => catName.includes(k))) {
          categoryAmounts[budgetKey] = (categoryAmounts[budgetKey] ?? 0) + exp.amount;
          break;
        }
      }
    }
    setAutofillData({ income, needs, wants, savings, categoryAmounts });
  };
  const totalIncome = categories.filter((c) => c.categoryType === TransactionType.Income).reduce((s, c) => s + c.monthlyLimit, 0);
  const totalExpense = categories.filter((c) => c.categoryType === TransactionType.Expense).reduce((s, c) => s + c.monthlyLimit, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "budgeting.page", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-8 h-8 rounded-lg flex items-center justify-center",
          style: { background: "linear-gradient(135deg, #7c3aed, #a78bfa)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "w-4 h-4 text-white" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-slate-800", children: "Budgeting" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "expenses", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto pb-1 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsList,
        {
          "data-ocid": "budgeting.tab",
          className: "h-auto bg-slate-100 p-2 gap-2 flex rounded-xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "categories",
                className: "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border-slate-200 hover:border-emerald-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:border-emerald-600 data-[state=active]:shadow-sm",
                children: "Plan Budget"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "expenses",
                className: "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border-slate-200 hover:border-blue-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600 data-[state=active]:shadow-sm",
                children: "Track Income Vs Expense"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "tracker",
                className: "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border-slate-200 hover:border-purple-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:border-purple-600 data-[state=active]:shadow-sm",
                children: "Budget Insights"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "improve",
                className: "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap bg-white text-slate-600 border-slate-200 hover:border-violet-400 data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:border-violet-600 data-[state=active]:shadow-sm",
                children: "Improve Budget"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "categories", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 px-4 py-3 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Budgeted Income" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums", children: fmt(totalIncome) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-rose-500 px-4 py-3 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1", children: "Budgeted Expense" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums", children: fmt(totalExpense) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "budgeting.seed_button",
                variant: "outline",
                onClick: seedStandardCategories,
                disabled: seeding,
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
                  seeding ? "Loading..." : "Load Standard Categories"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "budgeting.add_button",
                onClick: openAdd,
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  " Add Category"
                ]
              }
            )
          ] })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48" }) : categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "budgeting.empty_state",
            className: "flex flex-col items-center justify-center py-16 text-slate-400",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "w-12 h-12 mb-3 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No budget categories yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: 'Click "Load Standard Categories" to get started quickly' })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "overflow-x-auto rounded-xl border border-slate-200",
            "data-ocid": "budgeting.table",
            children: (() => {
              const INCOME_ORDER = [
                "Salary & Wages",
                "Business Income",
                "Freelance / Consulting",
                "Investment Returns",
                "Rental Income",
                "Other Income"
              ];
              const EXPENSE_ORDER = [
                "Housing & Rent",
                "Groceries & Food",
                "Utilities & Bills",
                "Transportation",
                "Debt Payments & EMI",
                "Healthcare & Medical",
                "Insurance",
                "Education",
                "Savings & Investments",
                "Dining & Restaurants",
                "Entertainment & Leisure",
                "Personal Care & Wellness",
                "Clothing & Apparel",
                "Subscriptions & Software",
                "Travel & Vacation",
                "Gifts & Donations",
                "Home Maintenance",
                "Children & Family",
                "Taxes & Levies",
                "Miscellaneous"
              ];
              const sortFn = (order) => (a, b) => {
                const ai = order.indexOf(a.name);
                const bi = order.indexOf(b.name);
                if (ai === -1 && bi === -1)
                  return a.name.localeCompare(b.name);
                if (ai === -1) return 1;
                if (bi === -1) return -1;
                return ai - bi;
              };
              const incomes = categories.filter((c) => c.categoryType === TransactionType.Income).sort(sortFn(INCOME_ORDER));
              const expenses = categories.filter((c) => c.categoryType === TransactionType.Expense).sort(sortFn(EXPENSE_ORDER));
              let globalIdx = 0;
              const renderRows = (list) => list.map((c) => {
                const i = globalIdx++;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    "data-ocid": `budgeting.item.${i + 1}`,
                    className: "hover:bg-slate-50",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-3 h-3 rounded-full flex-shrink-0",
                            style: { backgroundColor: c.color }
                          }
                        ),
                        c.name
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-sm", children: fmt(c.monthlyLimit) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-5 h-5 rounded-full border border-slate-200",
                          style: { backgroundColor: c.color }
                        }
                      ) }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_BADGE_COLORS[inferBudgetType(c.name)] ?? TYPE_BADGE_COLORS.Needs}`,
                          children: inferBudgetType(c.name)
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 justify-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "icon",
                            className: "h-7 w-7",
                            "data-ocid": `budgeting.edit_button.${i + 1}`,
                            onClick: () => openEdit(c),
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "icon",
                            className: "h-7 w-7 text-red-500",
                            "data-ocid": `budgeting.delete_button.${i + 1}`,
                            onClick: () => del(c.id),
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                          }
                        )
                      ] }) })
                    ]
                  },
                  c.id
                );
              });
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-700 text-white text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Monthly Limit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Color" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Actions" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
                  incomes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        colSpan: 5,
                        className: "px-4 py-2 bg-emerald-50 border-b border-emerald-100",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-emerald-700 uppercase tracking-wider", children: [
                          "Income (",
                          incomes.length,
                          ")"
                        ] })
                      }
                    ) }),
                    renderRows(
                      showAllPlanIncome ? incomes : incomes.slice(0, 1)
                    ),
                    incomes.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        colSpan: 5,
                        className: "px-4 py-1.5 text-center",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "text-xs text-emerald-600 hover:text-emerald-800 font-medium underline underline-offset-2",
                            onClick: () => setShowAllPlanIncome((v) => !v),
                            children: showAllPlanIncome ? "Show less" : `Show more entries (${incomes.length - 1} more)`
                          }
                        )
                      }
                    ) })
                  ] }),
                  expenses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        colSpan: 5,
                        className: "px-4 py-2 bg-red-50 border-b border-red-100",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-red-700 uppercase tracking-wider", children: [
                          "Expenses (",
                          expenses.length,
                          ")"
                        ] })
                      }
                    ) }),
                    renderRows(expenses)
                  ] })
                ] })
              ] });
            })()
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "expenses", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExpensesTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tracker", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyTrackerTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "improve", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-600 mr-1", children: "Select Month/Year:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              className: "h-8 rounded-md border border-input bg-background px-2 py-1 text-xs",
              value: String(autofillMonth),
              onChange: (e) => setAutofillMonth(Number(e.target.value)),
              children: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
              ].map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i, children: m }, m))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              className: "h-8 rounded-md border border-input bg-background px-2 py-1 text-xs",
              value: String(autofillYear),
              onChange: (e) => setAutofillYear(Number(e.target.value)),
              children: [
                (/* @__PURE__ */ new Date()).getFullYear(),
                (/* @__PURE__ */ new Date()).getFullYear() - 1,
                (/* @__PURE__ */ new Date()).getFullYear() - 2
              ].map((yr) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: yr, children: yr }, yr))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleAutofill,
              className: "h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors",
              children: "Load Income and Expense"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setAutofillData(null),
              className: "text-xs text-blue-500 hover:text-blue-700 underline ml-1",
              children: "Clear"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ImproveBudgetContent, { autofillData })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "budgeting.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Category" : "Add Category" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "budgeting.name.input",
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.categoryType,
              onValueChange: (v) => setForm((f) => ({ ...f, categoryType: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "budgeting.type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TransactionType.Income, children: "Income" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: TransactionType.Expense, children: "Expense" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Monthly Limit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "budgeting.limit.input",
              type: "number",
              value: form.monthlyLimit,
              onChange: (e) => setForm((f) => ({
                ...f,
                monthlyLimit: Number(e.target.value)
              }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Color" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "budgeting.color.input",
              type: "color",
              value: form.color,
              onChange: (e) => setForm((f) => ({ ...f, color: e.target.value })),
              className: "h-10 p-1"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            "data-ocid": "budgeting.cancel_button",
            onClick: () => setOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "budgeting.submit_button",
            onClick: save,
            disabled: saving,
            children: saving ? "Saving..." : "Save"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  BudgetingPage as default
};
