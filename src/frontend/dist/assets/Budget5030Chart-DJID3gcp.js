import { j as jsxRuntimeExports } from "./index-CSLSSYV9.js";
import { B as Badge } from "./badge-BnRrfMEi.js";
function Budget5030Chart({
  income,
  expenses,
  needs50,
  wants30,
  savings20,
  savings,
  savingsRate,
  formatCurrency
}) {
  if (income <= 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 flex items-center justify-center text-sm text-slate-400", children: "No income data for this period" });
  const needsActual = Math.min(expenses, needs50);
  const needsOver = expenses > needs50;
  const needsFill = needs50 > 0 ? Math.min(needsActual / needs50 * 100, 100) : 0;
  const wantsActual = Math.max(0, expenses - needs50);
  const wantsFill = wants30 > 0 ? Math.min(wantsActual / wants30 * 100, 100) : 0;
  const savingsFill = savings20 > 0 ? Math.min(savings / savings20 * 100, 100) : 0;
  const savingsAchieved = savings >= savings20;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "🏠 Needs (50%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: `text-[9px] ${needsOver ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`,
            children: needsOver ? "Over budget" : "On track"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full",
            style: {
              width: `${needsFill}%`,
              background: needsOver ? "#ef4444" : "#6366f1"
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Actual: ",
            formatCurrency(needsActual)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Target: ",
            formatCurrency(needs50)
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "🎭 Wants (30%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400", children: [
          "Target: ",
          formatCurrency(wants30)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full",
            style: { width: `${wantsFill}%`, background: "#f59e0b" }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Actual: ",
            formatCurrency(wantsActual)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Target: ",
            formatCurrency(wants30)
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "💰 Savings (20%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            className: `text-[9px] ${savingsAchieved ? "bg-green-50 text-green-600 border border-green-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`,
            children: savingsAchieved ? "✓ Achieved" : "Below target"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full",
            style: { width: `${savingsFill}%`, background: "#10b981" }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Actual: ",
            formatCurrency(savings)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Target: ",
            formatCurrency(savings20)
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 bg-slate-50 rounded-lg p-2", children: [
      "Savings Rate:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "strong",
        {
          className: savingsRate >= 20 ? "text-green-700" : savingsRate >= 10 ? "text-amber-700" : "text-red-700",
          children: [
            savingsRate.toFixed(1),
            "%"
          ]
        }
      ),
      " ",
      "(target: 20%)"
    ] })
  ] });
}
export {
  Budget5030Chart as B
};
