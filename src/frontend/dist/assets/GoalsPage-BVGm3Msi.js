import { c as createLucideIcon, r as reactExports, d as createDialogScope, j as jsxRuntimeExports, R as Root, e as useComposedRefs, W as WarningProvider, f as createContextScope, g as Content, h as composeEventHandlers, i as createSlottable, T as Title, D as Description, k as Close, P as Portal, O as Overlay, l as Trigger, m as cn, n as buttonVariants, a as useCurrency, o as Dialog, p as DialogContent, q as DialogHeader, s as DialogTitle, t as DialogDescription, v as Label, I as Input, w as DialogFooter, B as Button, x as Trash2, y as Target, z as TrendingUp, A as ChartPie, E as ChartColumn } from "./index-DvhgNlyZ.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent, M as ModelGoalPlanningTab } from "./ModelGoalPlanningTab-CmmSPLGv.js";
import { A as Alert, a as AlertDescription } from "./alert-B5_fkzVT.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-xIOWZVpC.js";
import { S as Skeleton } from "./skeleton-Bh0g169y.js";
import { b as useDeleteGoal, c as useUpdateGoalProgress, a as useGetAllInvestmentsByCategory, d as useCreateGoal, u as useGetAllGoals, e as useGetAllRetirals, f as useGetAllETFStocks, g as useGetAllMutualFunds, h as useGetAllCryptos, i as useGetAllFDs, j as useGetAllCommodities, k as useGetAllRealEstates, l as useGetAllOtherInvestments } from "./useGoals-CoehqMnW.js";
import { B as Badge } from "./badge-DxPY_rPw.js";
import { T as Table, a as TableBody, b as TableHeader, c as TableRow, d as TableHead, e as TableCell } from "./table-CGXCI7pR.js";
import { C as Checkbox } from "./checkbox-uYbNKhIF.js";
import { S as ScrollArea } from "./scroll-area-D7Yct7Qz.js";
import { u as ue } from "./index-BR31Kkfb.js";
import { P as Pencil } from "./pencil-BC07HexS.js";
import { C as CircleAlert } from "./circle-alert-HNt6uGo-.js";
import { P as Plus } from "./plus-ChYSURAt.js";
import { R as ResponsiveContainer, a as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip$1, b as Legend, B as Bar, L as LabelList, C as Cell } from "./generateCategoricalChart-BqHwqmh_.js";
import { B as BarChart } from "./BarChart-CJykoZr_.js";
import { P as PieChart, a as Pie } from "./PieChart-BghNQh0V.js";
import { L as LayoutList } from "./layout-list-3pP5z8F5.js";
import { L as LayoutGrid } from "./layout-grid-CjR-jsj2.js";
import "./index-ClEZc6uJ.js";
import "./backend.d-qPvSsPTs.js";
import "./index-CnVY9t_6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }]
];
const CircleMinus = createLucideIcon("circle-minus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
];
const Link = createLucideIcon("link", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
function DeleteGoalDialog({
  goal,
  open,
  onOpenChange
}) {
  const deleteGoalMutation = useDeleteGoal();
  const handleDelete = async () => {
    try {
      await deleteGoalMutation.mutateAsync(goal.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "goals.delete_goal.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Goal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
        'Are you sure you want to delete "',
        goal.name,
        '"? This action cannot be undone.'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "goals.delete_goal.cancel_button", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialogAction,
        {
          onClick: handleDelete,
          className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          disabled: deleteGoalMutation.isPending,
          "data-ocid": "goals.delete_goal.confirm_button",
          children: deleteGoalMutation.isPending ? "Deleting..." : "Delete"
        }
      )
    ] })
  ] }) });
}
const toDateString = (nanos) => {
  const ms = Number(nanos) / 1e6;
  return new Date(ms).toISOString().split("T")[0];
};
function EditGoalDialog({
  goal,
  open,
  onOpenChange
}) {
  const { country } = useCurrency();
  const [targetAmount, setTargetAmount] = reactExports.useState(
    goal.targetAmount.toString()
  );
  const [targetDate, setTargetDate] = reactExports.useState(toDateString(goal.targetDate));
  const updateGoal = useUpdateGoalProgress();
  reactExports.useEffect(() => {
    if (open) {
      setTargetAmount(goal.targetAmount.toString());
      setTargetDate(toDateString(goal.targetDate));
    }
  }, [goal, open]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetAmount || !targetDate) return;
    const targetAmountNum = Number.parseFloat(targetAmount);
    if (targetAmountNum <= 0) return;
    const targetDateNanos = BigInt(new Date(targetDate).getTime()) * BigInt(1e6);
    try {
      await updateGoal.mutateAsync({
        goalId: goal.id,
        name: goal.name,
        targetAmount: targetAmountNum,
        targetDate: targetDateNanos,
        linkedInvestments: goal.linkedInvestments,
        investmentAllocations: goal.investmentAllocations ?? {},
        priority: goal.priority,
        inflationRate: goal.inflationRate
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-[425px]",
      "data-ocid": "goals.edit_goal.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Goal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            "Update the target amount and date for ",
            goal.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Goal Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: goal.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "targetAmount", children: [
                "Target Amount (",
                country.symbol,
                ") *"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "targetAmount",
                  type: "number",
                  step: "0.01",
                  value: targetAmount,
                  onChange: (e) => setTargetAmount(e.target.value),
                  required: true,
                  "data-ocid": "goals.edit.targetamount.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "targetDate", children: "Goal Date *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "targetDate",
                  type: "date",
                  value: targetDate,
                  onChange: (e) => setTargetDate(e.target.value),
                  required: true,
                  "data-ocid": "goals.edit.targetdate.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => onOpenChange(false),
                "data-ocid": "goals.edit_goal.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                disabled: updateGoal.isPending,
                "data-ocid": "goals.edit_goal.submit_button",
                children: [
                  updateGoal.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Update"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
const ASSET_TYPE_LABELS = {
  ETF: "Equity (ETF/Stocks)",
  MutualFund: "Mutual Fund",
  Crypto: "Crypto",
  FixedIncome: "Fixed Income",
  Commodity: "Commodity",
  RealEstate: "Real Estate",
  Other: "Other",
  Retirement: "Retiral"
};
const ASSET_TYPE_ORDER = [
  "Retirement",
  "ETF",
  "MutualFund",
  "FixedIncome",
  "RealEstate",
  "Commodity",
  "Crypto",
  "Other"
];
const ASSET_TYPE_COLORS = {
  Retirement: "#6366f1",
  ETF: "#10b981",
  MutualFund: "#22c55e",
  FixedIncome: "#06b6d4",
  RealEstate: "#a855f7",
  Commodity: "#eab308",
  Crypto: "#f97316",
  Other: "#64748b"
};
function LinkInvestmentDialog({
  goal,
  open,
  onOpenChange
}) {
  const { formatCurrency } = useCurrency();
  const { data: allInvestments = [], isLoading } = useGetAllInvestmentsByCategory();
  const updateGoal = useUpdateGoalProgress();
  const [selected, setSelected] = reactExports.useState(
    new Set(goal.linkedInvestments)
  );
  reactExports.useEffect(() => {
    if (open) {
      setSelected(new Set(goal.linkedInvestments));
    }
  }, [open, goal]);
  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  const handleSave = async () => {
    try {
      await updateGoal.mutateAsync({
        goalId: goal.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
        priority: goal.priority,
        inflationRate: goal.inflationRate,
        linkedInvestments: Array.from(selected),
        investmentAllocations: {}
      });
      ue.success("Investments linked successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error linking investments:", error);
      ue.error("Failed to link investments");
    }
  };
  const grouped = reactExports.useMemo(() => {
    const groups = {};
    for (const inv of allInvestments) {
      const key = inv.assetType || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(inv);
    }
    return groups;
  }, [allInvestments]);
  const sortedTypes = ASSET_TYPE_ORDER.filter(
    (t) => {
      var _a;
      return (((_a = grouped[t]) == null ? void 0 : _a.length) ?? 0) > 0;
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md",
      "data-ocid": "goals.link_investment.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-4 w-4" }),
            "Link Investments to Goal"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
            "Select portfolio investments to link to “",
            goal.name,
            "”. Their current values will count toward your goal progress."
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ] }) : allInvestments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No investments found in your portfolio." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Add investments in the Portfolio module first." })
        ] }) : sortedTypes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No investments found to link." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 pr-2", children: sortedTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 px-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-2 h-2 rounded-full flex-shrink-0",
                style: {
                  backgroundColor: ASSET_TYPE_COLORS[type] ?? "#94a3b8"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-semibold uppercase tracking-wide",
                style: { color: ASSET_TYPE_COLORS[type] ?? "#94a3b8" },
                children: ASSET_TYPE_LABELS[type] ?? type
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-slate-100" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400", children: [
              grouped[type].length,
              " holding",
              grouped[type].length !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: grouped[type].map((inv) => {
            const isChecked = selected.has(inv.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: `flex items-center gap-3 w-full p-2.5 rounded-lg border transition-colors text-left ${isChecked ? "bg-blue-50 border-blue-200" : "border-slate-100 hover:bg-slate-50"}`,
                onClick: () => toggle(inv.id),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Checkbox,
                    {
                      checked: isChecked,
                      onCheckedChange: () => toggle(inv.id),
                      onClick: (e) => e.stopPropagation(),
                      "data-ocid": "goals.link.checkbox"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-700 truncate", children: inv.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-slate-400 mt-0.5", children: [
                      "Current Value: ",
                      formatCurrency(inv.currentValue)
                    ] })
                  ] }),
                  isChecked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-[10px] px-1.5 py-0 flex-shrink-0 text-blue-600 bg-blue-100",
                      children: "Linked"
                    }
                  )
                ]
              },
              inv.id
            );
          }) })
        ] }, type)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          selected.size,
          " investment",
          selected.size !== 1 ? "s" : "",
          " selected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => onOpenChange(false),
              "data-ocid": "goals.link_investment.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSave,
              disabled: updateGoal.isPending,
              "data-ocid": "goals.link_investment.save_button",
              children: [
                updateGoal.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Link Investments"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function getGoalEmoji(name) {
  const lower = name.toLowerCase();
  if (lower.includes("home") || lower.includes("house")) return "🏠";
  if (lower.includes("marriage") || lower.includes("wedding"))
    return "💍";
  if (lower.includes("education") || lower.includes("school") || lower.includes("college"))
    return "🎓";
  if (lower.includes("retirement") || lower.includes("retir"))
    return "🌅";
  return "💰";
}
const formatTimeLeft = (months) => {
  if (months <= 0) return "Done";
  const yrs = Math.floor(months / 12);
  const mo = months % 12;
  if (yrs === 0) return `${mo} mo`;
  if (mo === 0) return `${yrs} yr${yrs > 1 ? "s" : ""}`;
  return `${yrs} yr${yrs > 1 ? "s" : ""} ${mo} mo`;
};
function GoalList({
  goals,
  allInvestments,
  viewMode: externalViewMode,
  onViewModeChange: _onViewModeChange
}) {
  const { formatCurrency } = useCurrency();
  const [editingGoal, setEditingGoal] = reactExports.useState(null);
  const [deletingGoal, setDeletingGoal] = reactExports.useState(null);
  const [linkingGoal, setLinkingGoal] = reactExports.useState(null);
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [_ivm] = reactExports.useState("card");
  const viewMode = externalViewMode ?? _ivm;
  const investmentMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const inv of allInvestments) map.set(inv.id, inv.name);
    return map;
  }, [allInvestments]);
  const calculateCurrentAmount = (goal) => {
    if (goal.linkedInvestments.length === 0) return 0;
    return goal.linkedInvestments.reduce((sum, invId) => {
      const investment = allInvestments.find((inv) => inv.id === invId);
      return sum + ((investment == null ? void 0 : investment.currentValue) ?? 0);
    }, 0);
  };
  const calculateMonthsLeft = (goal) => {
    const now = /* @__PURE__ */ new Date();
    const targetDate = new Date(Number(goal.targetDate) / 1e6);
    const yearsDiff = targetDate.getFullYear() - now.getFullYear();
    const monthsDiff = targetDate.getMonth() - now.getMonth();
    return Math.max(0, yearsDiff * 12 + monthsDiff);
  };
  const calculateProgress = (goal) => {
    if (goal.linkedInvestments.length === 0) return 0;
    const currentAmount = calculateCurrentAmount(goal);
    return goal.targetAmount > 0 ? currentAmount / goal.targetAmount * 100 : 0;
  };
  const getProgressGradient = (progress) => {
    if (progress >= 80) return "linear-gradient(90deg, #16a34a, #4ade80)";
    if (progress >= 50) return "linear-gradient(90deg, #d97706, #fbbf24)";
    return "linear-gradient(90deg, #dc2626, #f87171)";
  };
  const sortedGoals = reactExports.useMemo(
    () => [...goals].sort((a, b) => b.targetAmount - a.targetAmount),
    [goals]
  );
  const filteredGoals = reactExports.useMemo(() => {
    return sortedGoals.filter((g) => {
      const p = calculateProgress(g);
      if (statusFilter === "All") return true;
      if (statusFilter === "On Track") return p >= 50 && p < 100;
      if (statusFilter === "Need Attention") return p < 50;
      if (statusFilter === "Achieved") return p >= 100;
      return true;
    });
  }, [sortedGoals, statusFilter]);
  const renderGoalRow = (goal, idx, isAchievedRow = false) => {
    const targetDate = new Date(Number(goal.targetDate) / 1e6);
    const progress = calculateProgress(goal);
    const currentAmount = calculateCurrentAmount(goal);
    const monthsLeft = calculateMonthsLeft(goal);
    const amountNeeded = Math.max(0, goal.targetAmount - currentAmount);
    const sipPerMonth = monthsLeft > 0 ? amountNeeded / monthsLeft : 0;
    const emoji = getGoalEmoji(goal.name);
    const linkedInvestmentNames = goal.linkedInvestments.map((id) => investmentMap.get(id)).filter(Boolean);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      TableRow,
      {
        "data-ocid": `goals.item.${idx + 1}`,
        className: "hover:bg-slate-50 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-xs py-2.5 text-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: emoji }),
            isAchievedRow && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-bold", children: "✓" }),
            goal.name
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs py-2.5 font-semibold text-slate-700", children: formatCurrency(goal.targetAmount) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TableCell,
            {
              className: `text-right font-bold text-xs py-2.5 ${currentAmount > goal.targetAmount ? "text-green-600" : "text-blue-600"}`,
              children: formatCurrency(currentAmount)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5", children: linkedInvestmentNames.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 cursor-help", children: [
              linkedInvestmentNames.slice(0, 3).map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs px-1.5 py-0",
                  children: name.length > 12 ? `${name.substring(0, 12)}...` : name
                },
                name
              )),
              linkedInvestmentNames.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs px-1.5 py-0",
                  children: [
                    "+",
                    linkedInvestmentNames.length - 3
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-xs mb-1", children: "Linked Investments" }),
              linkedInvestmentNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", children: [
                "• ",
                name
              ] }, name))
            ] }) })
          ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 text-xs", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs py-2.5 text-slate-600", children: targetDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "2-digit"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: monthsLeft > 12 ? "default" : monthsLeft > 6 ? "secondary" : "destructive",
              className: "text-xs px-1.5 py-0 whitespace-nowrap",
              children: formatTimeLeft(monthsLeft)
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-600", children: "Need:" }),
              " ",
              formatCurrency(amountNeeded)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-indigo-600 font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "SIP:" }),
              " ",
              monthsLeft > 0 ? formatCurrency(sipPerMonth) : "N/A"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-slate-700", children: [
                progress.toFixed(1),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `text-xs px-2 py-0.5 font-semibold ${progress >= 100 ? "bg-green-100 text-green-700 border border-green-200" : "bg-slate-100 text-slate-600"}`,
                  children: progress >= 100 ? "✓ Done" : "In Progress"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-100 rounded-full h-3 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-500",
                style: {
                  width: `${Math.min(progress, 100)}%`,
                  background: getProgressGradient(progress)
                }
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right py-2.5 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50",
                onClick: () => setLinkingGoal(goal),
                "data-ocid": `goals.link.button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-slate-500 hover:text-amber-600 hover:bg-amber-50",
                onClick: () => setEditingGoal(goal),
                "data-ocid": `goals.edit_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50",
                onClick: () => setDeletingGoal(goal),
                "data-ocid": `goals.delete_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
              }
            )
          ] }) })
        ]
      },
      goal.id
    );
  };
  const tableHeader = /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-slate-800 hover:bg-slate-800", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold w-[120px] min-w-[120px]", children: "Goal Name" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold text-right w-[100px] min-w-[100px]", children: "Target" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold text-right w-[100px] min-w-[100px]", children: "Current" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold w-[200px] min-w-[200px]", children: "Linked Inv." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold w-[90px] min-w-[90px]", children: "Goal Date" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold text-center w-[90px] min-w-[90px]", children: "Months" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold w-[120px] min-w-[120px]", children: "Advise" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold w-[180px] min-w-[180px]", children: "Progress" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white text-xs font-semibold text-right w-[100px] min-w-[100px] pr-4", children: "Actions" })
  ] }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3 flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ["All", "On Track", "Need Attention", "Achieved"].map(
        (f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setStatusFilter(f),
            "data-ocid": `goals.filter.${f.toLowerCase().replace(" ", "_")}.toggle`,
            className: `px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === f ? f === "Achieved" ? "bg-emerald-600 text-white border-emerald-600" : f === "On Track" ? "bg-blue-600 text-white border-blue-600" : f === "Need Attention" ? "bg-amber-500 text-white border-amber-500" : "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`,
            children: f
          },
          f
        )
      ) }) }),
      viewMode === "card" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", "data-ocid": "goals.card_list", children: filteredGoals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "goals.empty_state",
          className: "text-center py-16 text-muted-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No goals match the current filter" })
        }
      ) : filteredGoals.map((goal, idx) => {
        const targetDate = new Date(Number(goal.targetDate) / 1e6);
        const progress = calculateProgress(goal);
        const currentAmount = calculateCurrentAmount(goal);
        const monthsLeft = calculateMonthsLeft(goal);
        const amountNeeded = Math.max(
          0,
          goal.targetAmount - currentAmount
        );
        const sipPerMonth = monthsLeft > 0 ? amountNeeded / monthsLeft : 0;
        const emoji = getGoalEmoji(goal.name);
        const isAchieved = progress >= 100;
        const ringColor = isAchieved ? "#16a34a" : progress >= 80 ? "#16a34a" : progress >= 50 ? "#d97706" : "#dc2626";
        const statusLabel = isAchieved ? "Achieved" : progress >= 50 ? "On Track" : "Need Attention";
        const statusClass = isAchieved ? "bg-green-100 text-green-700" : progress >= 50 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";
        const linkedNames = goal.linkedInvestments.map((id) => investmentMap.get(id)).filter(Boolean);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": `goals.item.${idx + 1}`,
            className: "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-wrap mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-gray-900 dark:text-slate-100", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: emoji }),
                    goal.name
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${statusClass}`,
                      children: statusLabel
                    }
                  )
                ] }),
                linkedNames.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mb-2", children: [
                  linkedNames.slice(0, 3).map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-[10px] font-medium rounded-full px-2 py-0.5",
                      children: name.length > 14 ? `${name.slice(0, 14)}…` : name
                    },
                    name
                  )),
                  linkedNames.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-slate-300 text-[10px] font-semibold rounded-full px-2 py-0.5 cursor-help", children: [
                      "+",
                      linkedNames.length - 3,
                      " more"
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { className: "max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-xs mb-1", children: "All Linked Investments" }),
                      linkedNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", children: [
                        "• ",
                        name
                      ] }, name))
                    ] }) })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Target" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-slate-200 tabular-nums", children: formatCurrency(goal.targetAmount) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Current" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: `text-sm font-semibold tabular-nums ${isAchieved || currentAmount >= goal.targetAmount ? "text-green-600" : "text-gray-800 dark:text-slate-200"}`,
                        children: formatCurrency(currentAmount)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "Goal Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-slate-200", children: targetDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-0.5", children: "SIP/Mo" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-slate-200", children: isAchieved ? "N/A" : monthsLeft > 0 ? formatCurrency(sipPerMonth) : "N/A" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors",
                      onClick: () => setLinkingGoal(goal),
                      "data-ocid": `goals.link.button.${idx + 1}`,
                      title: "Link Investments",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors",
                      onClick: () => setEditingGoal(goal),
                      "data-ocid": `goals.edit_button.${idx + 1}`,
                      title: "Edit",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                      onClick: () => setDeletingGoal(goal),
                      "data-ocid": `goals.delete_button.${idx + 1}`,
                      title: "Delete",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-[96px] h-[96px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "svg",
                    {
                      width: "96",
                      height: "96",
                      viewBox: "0 0 100 100",
                      className: "-rotate-90",
                      "aria-hidden": "true",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "circle",
                          {
                            cx: "50",
                            cy: "50",
                            r: "42",
                            fill: "none",
                            stroke: "#e2e8f0",
                            strokeWidth: "7"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "circle",
                          {
                            cx: "50",
                            cy: "50",
                            r: "42",
                            fill: "none",
                            stroke: ringColor,
                            strokeWidth: "7",
                            strokeDasharray: `${2 * Math.PI * 42} ${2 * Math.PI * 42}`,
                            strokeDashoffset: isAchieved ? 0 : 2 * Math.PI * 42 * (1 - Math.min(progress, 100) / 100),
                            strokeLinecap: "round",
                            className: "transition-all duration-500"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: isAchieved ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl text-green-600 font-bold", children: "✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-sm font-bold tabular-nums leading-none",
                      style: { color: ringColor },
                      children: [
                        Math.round(progress),
                        "%"
                      ]
                    }
                  ) })
                ] })
              ] })
            ] })
          },
          goal.id
        );
      }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            transform: "rotateX(180deg)",
            overflowX: "auto",
            overflowY: "visible",
            paddingBottom: "12px",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "#94a3b8 #f1f5f9"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: "rotateX(180deg)", minWidth: "1100px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
              tableHeader,
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredGoals.map(
                (goal, idx) => renderGoalRow(goal, idx, calculateProgress(goal) >= 100)
              ) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-400 text-center mt-1 sm:hidden", children: "\\u2190 Scroll table to see more \\u2192" })
          ]
        }
      )
    ] }),
    editingGoal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditGoalDialog,
      {
        goal: editingGoal,
        open: !!editingGoal,
        onOpenChange: (open) => !open && setEditingGoal(null)
      }
    ),
    deletingGoal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteGoalDialog,
      {
        goal: deletingGoal,
        open: !!deletingGoal,
        onOpenChange: (open) => !open && setDeletingGoal(null)
      }
    ),
    linkingGoal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LinkInvestmentDialog,
      {
        goal: linkingGoal,
        open: !!linkingGoal,
        onOpenChange: (open) => !open && setLinkingGoal(null)
      }
    )
  ] });
}
function AddGoalDialog({ open, onOpenChange }) {
  const { country } = useCurrency();
  const [name, setName] = reactExports.useState("");
  const [targetAmount, setTargetAmount] = reactExports.useState("");
  const [targetDate, setTargetDate] = reactExports.useState("");
  const [inflationRate, setInflationRate] = reactExports.useState("6");
  const createGoal = useCreateGoal();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate || !inflationRate) {
      ue.error("Please fill in all fields");
      return;
    }
    try {
      const date = new Date(targetDate);
      await createGoal.mutateAsync({
        name,
        targetAmount: Number.parseFloat(targetAmount),
        targetDate: BigInt(date.getTime() * 1e6),
        priority: BigInt(1),
        inflationRate: Number.parseFloat(inflationRate)
      });
      ue.success("Goal added successfully");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error adding goal:", error);
      ue.error((error == null ? void 0 : error.message) || "Failed to add goal");
    }
  };
  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setTargetDate("");
    setInflationRate("6");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "goals.add_goal.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add New Goal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Set a new financial goal to track your progress" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "goalName", children: "Goal Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "goalName",
            placeholder: "e.g., House Down Payment",
            value: name,
            onChange: (e) => setName(e.target.value),
            "data-ocid": "goals.name.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "targetAmount", children: [
            "Target Amount (",
            country.symbol,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "targetAmount",
              type: "number",
              step: "0.01",
              placeholder: "1000000",
              value: targetAmount,
              onChange: (e) => setTargetAmount(e.target.value),
              "data-ocid": "goals.targetamount.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "targetDate", children: "Target Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "targetDate",
              type: "date",
              value: targetDate,
              onChange: (e) => setTargetDate(e.target.value),
              "data-ocid": "goals.targetdate.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "inflationRate", children: "Goal Inflation (%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "inflationRate",
            type: "number",
            step: "0.1",
            placeholder: "6.0",
            value: inflationRate,
            onChange: (e) => setInflationRate(e.target.value),
            "data-ocid": "goals.inflation.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            "data-ocid": "goals.add_goal.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: createGoal.isPending,
            "data-ocid": "goals.add_goal.submit_button",
            children: createGoal.isPending ? "Adding..." : "Add Goal"
          }
        )
      ] })
    ] })
  ] }) });
}
function GoalsTab({
  externalAddOpen,
  onExternalAddOpenChange,
  viewMode,
  onViewModeChange
} = {}) {
  const { data: goals = [], isLoading, isError } = useGetAllGoals();
  const [_internalAddOpen, _setInternalAddOpen] = reactExports.useState(false);
  const isAddDialogOpen = externalAddOpen !== void 0 ? externalAddOpen : _internalAddOpen;
  const setIsAddDialogOpen = (v) => {
    _setInternalAddOpen(v);
    if (onExternalAddOpenChange) onExternalAddOpenChange(v);
  };
  const { formatCurrency } = useCurrency();
  const { data: retirals = [] } = useGetAllRetirals();
  const { data: equityStocks = [] } = useGetAllETFStocks();
  const { data: mutualFunds = [] } = useGetAllMutualFunds();
  const { data: cryptos = [] } = useGetAllCryptos();
  const { data: fds = [] } = useGetAllFDs();
  const { data: commodities = [] } = useGetAllCommodities();
  const { data: realEstates = [] } = useGetAllRealEstates();
  const { data: otherInvestments = [] } = useGetAllOtherInvestments();
  const allInvestments = reactExports.useMemo(
    () => [
      ...retirals,
      ...equityStocks,
      ...mutualFunds,
      ...cryptos,
      ...fds,
      ...commodities,
      ...realEstates,
      ...otherInvestments
    ],
    [
      retirals,
      equityStocks,
      mutualFunds,
      cryptos,
      fds,
      commodities,
      realEstates,
      otherInvestments
    ]
  );
  const goalCurrentSavings = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const goal of goals) {
      const savings = goal.linkedInvestments.reduce((sum, invId) => {
        const inv = allInvestments.find((i) => i.id === invId);
        return sum + ((inv == null ? void 0 : inv.currentValue) ?? 0);
      }, 0);
      map.set(goal.id, savings);
    }
    return map;
  }, [goals, allInvestments]);
  const currentSavings = reactExports.useMemo(() => {
    const uniqueIds = /* @__PURE__ */ new Set();
    for (const goal of goals) {
      for (const id of goal.linkedInvestments) uniqueIds.add(id);
    }
    let total = 0;
    for (const invId of uniqueIds) {
      const inv = allInvestments.find((i) => i.id === invId);
      total += (inv == null ? void 0 : inv.currentValue) ?? 0;
    }
    return total;
  }, [goals, allInvestments]);
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const amountRequired = Math.max(0, totalTargetAmount - currentSavings);
  const overallProgress = reactExports.useMemo(() => {
    if (totalTargetAmount === 0) return 0;
    return currentSavings / totalTargetAmount * 100;
  }, [currentSavings, totalTargetAmount]);
  const analyticsData = reactExports.useMemo(() => {
    if (goals.length === 0)
      return {
        achievementQuality: [],
        savingsAdequacy: [],
        goalDiversification: []
      };
    const getProgress = (g) => {
      const savings = goalCurrentSavings.get(g.id) || 0;
      return g.targetAmount > 0 ? savings / g.targetAmount * 100 : 0;
    };
    return {
      achievementQuality: [
        {
          name: "Ahead",
          value: goals.filter((g) => getProgress(g) >= 100).length,
          color: "#10b981",
          goalNames: goals.filter((g) => getProgress(g) >= 100).map((g) => g.name)
        },
        {
          name: "On Track",
          value: goals.filter(
            (g) => getProgress(g) >= 75 && getProgress(g) < 100
          ).length,
          color: "#3b82f6",
          goalNames: goals.filter((g) => getProgress(g) >= 75 && getProgress(g) < 100).map((g) => g.name)
        },
        {
          name: "Behind",
          value: goals.filter(
            (g) => getProgress(g) >= 50 && getProgress(g) < 75
          ).length,
          color: "#f59e0b",
          goalNames: goals.filter((g) => getProgress(g) >= 50 && getProgress(g) < 75).map((g) => g.name)
        },
        {
          name: "Need Attention",
          value: goals.filter((g) => getProgress(g) < 50).length,
          color: "#ef4444",
          goalNames: goals.filter((g) => getProgress(g) < 50).map((g) => g.name)
        }
      ].filter((d) => d.value > 0),
      savingsAdequacy: goals.slice(0, 5).map((g) => ({
        name: g.name.length > 20 ? `${g.name.substring(0, 20)}...` : g.name,
        target: g.targetAmount,
        current: goalCurrentSavings.get(g.id) || 0
      })),
      goalDiversification: [
        {
          name: "Short (<2y)",
          value: goals.filter((g) => {
            const y = Number(g.targetDate - BigInt(Date.now() * 1e6)) / (365 * 24 * 60 * 60 * 1e9);
            return y < 2;
          }).length,
          color: "#3b82f6",
          goalNames: goals.filter((g) => {
            const y = Number(g.targetDate - BigInt(Date.now() * 1e6)) / (365 * 24 * 60 * 60 * 1e9);
            return y < 2;
          }).map((g) => g.name)
        },
        {
          name: "Medium (2-5y)",
          value: goals.filter((g) => {
            const y = Number(g.targetDate - BigInt(Date.now() * 1e6)) / (365 * 24 * 60 * 60 * 1e9);
            return y >= 2 && y < 5;
          }).length,
          color: "#10b981",
          goalNames: goals.filter((g) => {
            const y = Number(g.targetDate - BigInt(Date.now() * 1e6)) / (365 * 24 * 60 * 60 * 1e9);
            return y >= 2 && y < 5;
          }).map((g) => g.name)
        },
        {
          name: "Long (5y+)",
          value: goals.filter((g) => {
            const y = Number(g.targetDate - BigInt(Date.now() * 1e6)) / (365 * 24 * 60 * 60 * 1e9);
            return y >= 5;
          }).length,
          color: "#8b5cf6",
          goalNames: goals.filter((g) => {
            const y = Number(g.targetDate - BigInt(Date.now() * 1e6)) / (365 * 24 * 60 * 60 * 1e9);
            return y >= 5;
          }).map((g) => g.name)
        }
      ].filter((d) => d.value > 0)
    };
  }, [goals, goalCurrentSavings]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsSkeleton, {});
  if (isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Alert,
      {
        variant: "destructive",
        className: "max-w-md",
        "data-ocid": "goals.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: "Unable to load goals. Please refresh the page or try again later." })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "goals.main.card", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: goals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", "data-ocid": "goals.empty_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-8 w-8 text-green-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold mb-1 text-slate-700", children: "No goals set yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mb-4", children: "Define your financial goals and track your progress" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setIsAddDialogOpen(true),
          size: "sm",
          className: "gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow text-xs",
          "data-ocid": "goals.empty.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Set Your First Goal"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Total Target" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums truncate", children: formatCurrency(totalTargetAmount) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-violet-500 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { className: "w-3.5 h-3.5 text-violet-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Current Savings" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums truncate", children: formatCurrency(currentSavings) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-amber-500 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "w-3.5 h-3.5 text-amber-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Amount Required" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums truncate", children: formatCurrency(amountRequired) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-500 px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-3.5 h-3.5 text-blue-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide", children: "Overall Progress" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-slate-800 dark:text-slate-100", children: [
            overallProgress.toFixed(1),
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GoalList,
        {
          goals,
          allInvestments,
          viewMode,
          onViewModeChange
        }
      )
    ] }) }) }),
    goals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "goals.analytics.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-indigo-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-700", children: "Goals Analytics" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-xl border border-slate-100 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-3 px-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-xs font-semibold text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3.5 w-3.5 text-blue-500" }),
              "Savings Adequacy"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-[11px] text-slate-400", children: "Current vs target" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-3 pb-3", children: analyticsData.savingsAdequacy.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: analyticsData.savingsAdequacy, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "name",
                tick: { fontSize: 9 },
                angle: -15,
                textAnchor: "end",
                height: 50
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                tick: { fontSize: 9 },
                tickFormatter: (v) => formatCurrency(v)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip$1,
              {
                formatter: (v) => formatCurrency(v),
                contentStyle: {
                  fontSize: "11px",
                  borderRadius: "8px"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: { fontSize: "11px" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Bar,
              {
                dataKey: "target",
                fill: "#3b82f6",
                name: "Target",
                radius: [3, 3, 0, 0],
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LabelList,
                  {
                    dataKey: "target",
                    position: "top",
                    formatter: (v) => formatCurrency(v),
                    style: {
                      fontSize: "9px",
                      fill: "#3b82f6",
                      fontWeight: 600
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Bar,
              {
                dataKey: "current",
                fill: "#10b981",
                name: "Current Value",
                radius: [3, 3, 0, 0],
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LabelList,
                  {
                    dataKey: "current",
                    position: "top",
                    formatter: (v) => formatCurrency(v),
                    style: {
                      fontSize: "9px",
                      fill: "#10b981",
                      fontWeight: 600
                    }
                  }
                )
              }
            )
          ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[220px] flex items-center justify-center text-slate-300 text-xs", children: "No data" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-xl border border-slate-100 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-3 px-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-xs font-semibold text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { className: "h-3.5 w-3.5 text-emerald-500" }),
              "Achievement Quality"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-[11px] text-slate-400", children: "By progress status" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-3 pb-3", children: analyticsData.achievementQuality.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-visible", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-shrink-0 overflow-visible",
                style: { width: 150, height: 150 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  PieChart,
                  {
                    margin: { top: 0, right: 0, bottom: 0, left: 4 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Pie,
                        {
                          data: analyticsData.achievementQuality,
                          cx: "50%",
                          cy: "50%",
                          innerRadius: 44,
                          outerRadius: 68,
                          dataKey: "value",
                          labelLine: false,
                          children: analyticsData.achievementQuality.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                        Tooltip$1,
                        {
                          content: ({
                            active,
                            payload
                          }) => {
                            var _a;
                            if (!active || !(payload == null ? void 0 : payload[0])) return null;
                            const entry = payload[0].payload;
                            if (!entry) return null;
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-2.5 shadow-lg text-xs max-w-[200px]", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "p",
                                {
                                  className: "font-semibold text-slate-700 mb-1",
                                  style: { color: entry.color },
                                  children: [
                                    entry.name,
                                    ": ",
                                    entry.value,
                                    " goal",
                                    (entry.value ?? 0) !== 1 ? "s" : ""
                                  ]
                                }
                              ),
                              (_a = entry.goalNames) == null ? void 0 : _a.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500", children: [
                                "• ",
                                n
                              ] }, n))
                            ] });
                          }
                        }
                      )
                    ]
                  }
                ) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 flex-1 min-w-0", children: analyticsData.achievementQuality.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-2 h-2 rounded-full flex-shrink-0",
                      style: { background: entry.color }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-600 truncate flex-1 min-w-0", children: entry.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-slate-700 flex-shrink-0 ml-1", children: entry.value })
                ]
              },
              entry.name
            )) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[220px] flex items-center justify-center text-slate-300 text-xs", children: "No data" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "rounded-xl border border-slate-100 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-3 px-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-xs font-semibold text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3.5 w-3.5 text-purple-500" }),
              "Goal Diversification"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-[11px] text-slate-400", children: "By time horizon" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-3 pb-3", children: analyticsData.goalDiversification.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-visible", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-shrink-0 overflow-visible",
                style: { width: 150, height: 150 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  PieChart,
                  {
                    margin: { top: 0, right: 0, bottom: 0, left: 4 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Pie,
                        {
                          data: analyticsData.goalDiversification,
                          cx: "50%",
                          cy: "50%",
                          innerRadius: 44,
                          outerRadius: 68,
                          dataKey: "value",
                          labelLine: false,
                          children: analyticsData.goalDiversification.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                        Tooltip$1,
                        {
                          content: ({
                            active,
                            payload
                          }) => {
                            var _a;
                            if (!active || !(payload == null ? void 0 : payload[0])) return null;
                            const entry = payload[0].payload;
                            if (!entry) return null;
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-2.5 shadow-lg text-xs max-w-[200px]", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "p",
                                {
                                  className: "font-semibold text-slate-700 mb-1",
                                  style: { color: entry.color },
                                  children: [
                                    entry.name,
                                    ": ",
                                    entry.value,
                                    " goal",
                                    (entry.value ?? 0) !== 1 ? "s" : ""
                                  ]
                                }
                              ),
                              (_a = entry.goalNames) == null ? void 0 : _a.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500", children: [
                                "• ",
                                n
                              ] }, n))
                            ] });
                          }
                        }
                      )
                    ]
                  }
                ) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 flex-1 min-w-0", children: analyticsData.goalDiversification.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-2 h-2 rounded-full flex-shrink-0",
                      style: { background: entry.color }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-600 truncate flex-1 min-w-0", children: entry.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-slate-700 flex-shrink-0 ml-1", children: entry.value })
                ]
              },
              entry.name
            )) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[220px] flex items-center justify-center text-slate-300 text-xs", children: "No data" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddGoalDialog, { open: isAddDialogOpen, onOpenChange: setIsAddDialogOpen })
  ] });
}
function GoalsSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      "data-ocid": "goals.loading_state",
      className: "rounded-2xl shadow-sm border border-slate-100 bg-white",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) })
    }
  );
}
function GoalsPage() {
  const [addGoalOpen, setAddGoalOpen] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("track");
  const [viewMode, setViewMode] = reactExports.useState("card");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "goals.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-8 rounded-lg flex items-center justify-center",
            style: { background: "linear-gradient(135deg, #059669, #10b981)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 text-white" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-slate-800 dark:text-slate-100", children: "Financial Goals" })
      ] }),
      activeTab === "track" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setAddGoalOpen(true),
          size: "sm",
          className: "gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow text-xs",
          "data-ocid": "goals.page.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
            " Add Goal"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-100 dark:bg-slate-800 rounded-xl p-2 mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 overflow-x-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "goals.track.tab",
            onClick: () => setActiveTab("track"),
            className: `px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap ${activeTab === "track" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`,
            children: "Track Goals"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "goals.plan.tab",
            onClick: () => setActiveTab("plan"),
            className: `px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap ${activeTab === "plan" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`,
            children: "Plan Goals"
          }
        )
      ] }),
      activeTab === "track" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-slate-200 rounded-lg overflow-hidden ml-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            title: "Table View",
            onClick: () => setViewMode("table"),
            className: `p-1.5 transition-colors ${viewMode === "table" ? "bg-slate-800 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`,
            "data-ocid": "goals.table_view.toggle",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutList, { className: "w-3.5 h-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            title: "Card View",
            onClick: () => setViewMode("card"),
            className: `p-1.5 transition-colors ${viewMode === "card" ? "bg-slate-800 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`,
            "data-ocid": "goals.card_view.toggle",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-3.5 h-3.5" })
          }
        )
      ] })
    ] }),
    activeTab === "track" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GoalsTab,
      {
        externalAddOpen: addGoalOpen,
        onExternalAddOpenChange: setAddGoalOpen,
        viewMode,
        onViewModeChange: setViewMode
      }
    ),
    activeTab === "plan" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModelGoalPlanningTab, {})
  ] });
}
export {
  GoalsPage as default
};
