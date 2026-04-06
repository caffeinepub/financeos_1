import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, f as createContextScope, a2 as useId, a3 as useControllableState, e as useComposedRefs, a4 as Primitive, h as composeEventHandlers, a5 as Presence, a6 as Portal$1, a7 as DismissableLayer, i as createSlottable, m as cn, u as useActor, a as useCurrency, v as Label, I as Input, B as Button, x as Trash2, Y as Sparkles } from "./index-DvhgNlyZ.js";
import { c as createPopperScope, R as Root2, A as Anchor, a as Arrow, C as Content, b as Root } from "./index-ClEZc6uJ.js";
import { u as ue } from "./index-BR31Kkfb.js";
import { P as Plus } from "./plus-ChYSURAt.js";
import { C as CircleAlert } from "./circle-alert-HNt6uGo-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$1);
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
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
var [createTooltipContext] = createContextScope("Tooltip", [
  createPopperScope
]);
var usePopperScope = createPopperScope();
var PROVIDER_NAME = "TooltipProvider";
var DEFAULT_DELAY_DURATION = 700;
var TOOLTIP_OPEN = "tooltip.open";
var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
var TooltipProvider$1 = (props) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children
  } = props;
  const isOpenDelayedRef = reactExports.useRef(true);
  const isPointerInTransitRef = reactExports.useRef(false);
  const skipDelayTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipProviderContextProvider,
    {
      scope: __scopeTooltip,
      isOpenDelayedRef,
      delayDuration,
      onOpen: reactExports.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        isOpenDelayedRef.current = false;
      }, []),
      onClose: reactExports.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(
          () => isOpenDelayedRef.current = true,
          skipDelayDuration
        );
      }, [skipDelayDuration]),
      isPointerInTransitRef,
      onPointerInTransitChange: reactExports.useCallback((inTransit) => {
        isPointerInTransitRef.current = inTransit;
      }, []),
      disableHoverableContent,
      children
    }
  );
};
TooltipProvider$1.displayName = PROVIDER_NAME;
var TOOLTIP_NAME = "Tooltip";
var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
var Tooltip$1 = (props) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp
  } = props;
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
  const popperScope = usePopperScope(__scopeTooltip);
  const [trigger, setTrigger] = reactExports.useState(null);
  const contentId = useId();
  const openTimerRef = reactExports.useRef(0);
  const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
  const delayDuration = delayDurationProp ?? providerContext.delayDuration;
  const wasOpenDelayedRef = reactExports.useRef(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (open2) => {
      if (open2) {
        providerContext.onOpen();
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else {
        providerContext.onClose();
      }
      onOpenChange == null ? void 0 : onOpenChange(open2);
    },
    caller: TOOLTIP_NAME
  });
  const stateAttribute = reactExports.useMemo(() => {
    return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
  }, [open]);
  const handleOpen = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    wasOpenDelayedRef.current = false;
    setOpen(true);
  }, [setOpen]);
  const handleClose = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    setOpen(false);
  }, [setOpen]);
  const handleDelayedOpen = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true;
      setOpen(true);
      openTimerRef.current = 0;
    }, delayDuration);
  }, [delayDuration, setOpen]);
  reactExports.useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = 0;
      }
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipContextProvider,
    {
      scope: __scopeTooltip,
      contentId,
      open,
      stateAttribute,
      trigger,
      onTriggerChange: setTrigger,
      onTriggerEnter: reactExports.useCallback(() => {
        if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
        else handleOpen();
      }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen]),
      onTriggerLeave: reactExports.useCallback(() => {
        if (disableHoverableContent) {
          handleClose();
        } else {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      }, [handleClose, disableHoverableContent]),
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      children
    }
  ) });
};
Tooltip$1.displayName = TOOLTIP_NAME;
var TRIGGER_NAME = "TooltipTrigger";
var TooltipTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...triggerProps } = props;
    const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip);
    const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
    const isPointerDownRef = reactExports.useRef(false);
    const hasPointerMoveOpenedRef = reactExports.useRef(false);
    const handlePointerUp = reactExports.useCallback(() => isPointerDownRef.current = false, []);
    reactExports.useEffect(() => {
      return () => document.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerUp]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        "aria-describedby": context.open ? context.contentId : void 0,
        "data-state": context.stateAttribute,
        ...triggerProps,
        ref: composedRefs,
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          if (event.pointerType === "touch") return;
          if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
            context.onTriggerEnter();
            hasPointerMoveOpenedRef.current = true;
          }
        }),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
          context.onTriggerLeave();
          hasPointerMoveOpenedRef.current = false;
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, () => {
          if (context.open) {
            context.onClose();
          }
          isPointerDownRef.current = true;
          document.addEventListener("pointerup", handlePointerUp, { once: true });
        }),
        onFocus: composeEventHandlers(props.onFocus, () => {
          if (!isPointerDownRef.current) context.onOpen();
        }),
        onBlur: composeEventHandlers(props.onBlur, context.onClose),
        onClick: composeEventHandlers(props.onClick, context.onClose)
      }
    ) });
  }
);
TooltipTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "TooltipPortal";
var [PortalProvider, usePortalContext] = createTooltipContext(PORTAL_NAME, {
  forceMount: void 0
});
var TooltipPortal = (props) => {
  const { __scopeTooltip, forceMount, children, container } = props;
  const context = useTooltipContext(PORTAL_NAME, __scopeTooltip);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeTooltip, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children }) }) });
};
TooltipPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "TooltipContent";
var TooltipContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeTooltip);
    const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
  }
);
var TooltipContentHoverable = reactExports.forwardRef((props, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
  const providerContext = useTooltipProviderContext(CONTENT_NAME, props.__scopeTooltip);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const [pointerGraceArea, setPointerGraceArea] = reactExports.useState(null);
  const { trigger, onClose } = context;
  const content = ref.current;
  const { onPointerInTransitChange } = providerContext;
  const handleRemoveGraceArea = reactExports.useCallback(() => {
    setPointerGraceArea(null);
    onPointerInTransitChange(false);
  }, [onPointerInTransitChange]);
  const handleCreateGraceArea = reactExports.useCallback(
    (event, hoverTarget) => {
      const currentTarget = event.currentTarget;
      const exitPoint = { x: event.clientX, y: event.clientY };
      const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
      const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
      const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
      const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
      setPointerGraceArea(graceArea);
      onPointerInTransitChange(true);
    },
    [onPointerInTransitChange]
  );
  reactExports.useEffect(() => {
    return () => handleRemoveGraceArea();
  }, [handleRemoveGraceArea]);
  reactExports.useEffect(() => {
    if (trigger && content) {
      const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
      const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
      trigger.addEventListener("pointerleave", handleTriggerLeave);
      content.addEventListener("pointerleave", handleContentLeave);
      return () => {
        trigger.removeEventListener("pointerleave", handleTriggerLeave);
        content.removeEventListener("pointerleave", handleContentLeave);
      };
    }
  }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
  reactExports.useEffect(() => {
    if (pointerGraceArea) {
      const handleTrackPointerGrace = (event) => {
        const target = event.target;
        const pointerPosition = { x: event.clientX, y: event.clientY };
        const hasEnteredTarget = (trigger == null ? void 0 : trigger.contains(target)) || (content == null ? void 0 : content.contains(target));
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
        if (hasEnteredTarget) {
          handleRemoveGraceArea();
        } else if (isPointerOutsideGraceArea) {
          handleRemoveGraceArea();
          onClose();
        }
      };
      document.addEventListener("pointermove", handleTrackPointerGrace);
      return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
    }
  }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { ...props, ref: composedRefs });
});
var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
var Slottable = createSlottable("TooltipContent");
var TooltipContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTooltip,
      children,
      "aria-label": ariaLabel,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useTooltipContext(CONTENT_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const { onClose } = context;
    reactExports.useEffect(() => {
      document.addEventListener(TOOLTIP_OPEN, onClose);
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
    }, [onClose]);
    reactExports.useEffect(() => {
      if (context.trigger) {
        const handleScroll = (event) => {
          const target = event.target;
          if (target == null ? void 0 : target.contains(context.trigger)) onClose();
        };
        window.addEventListener("scroll", handleScroll, { capture: true });
        return () => window.removeEventListener("scroll", handleScroll, { capture: true });
      }
    }, [context.trigger, onClose]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DismissableLayer,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside: (event) => event.preventDefault(),
        onDismiss: onClose,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            "data-state": context.stateAttribute,
            ...popperScope,
            ...contentProps,
            ref: forwardedRef,
            style: {
              ...contentProps.style,
              // re-namespace exposed content custom properties
              ...{
                "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
            ]
          }
        )
      }
    );
  }
);
TooltipContent$1.displayName = CONTENT_NAME;
var ARROW_NAME = "TooltipArrow";
var TooltipArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeTooltip);
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
      ARROW_NAME,
      __scopeTooltip
    );
    return visuallyHiddenContentContext.isInside ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
TooltipArrow.displayName = ARROW_NAME;
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const paddedExitPoints = [];
  switch (exitSide) {
    case "top":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "bottom":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      );
      break;
    case "left":
      paddedExitPoints.push(
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "right":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      );
      break;
  }
  return paddedExitPoints;
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
    return upperHull;
  } else {
    return upperHull.concat(lowerHull);
  }
}
var Provider = TooltipProvider$1;
var Root3 = Tooltip$1;
var Trigger = TooltipTrigger$1;
var Portal = TooltipPortal;
var Content2 = TooltipContent$1;
var Arrow2 = TooltipArrow;
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root3, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
const _fmt = (n) => Math.round(n).toLocaleString("en-IN");
const fmtModuleLevel = (n, sym = "₹") => `${sym}${_fmt(n)}`;
const INFLATION_RATE = 0.06;
function sipRequired(target, annualRate, years) {
  if (years <= 0 || target <= 0) return 0;
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r <= 0) return Math.round(target / n);
  return Math.round(target * r / ((1 + r) ** n - 1));
}
function getInstrument(years) {
  if (years <= 1)
    return {
      name: "Savings Account / Liquid Fund",
      reason: "Very short horizon. Capital safety is paramount. No market exposure."
    };
  if (years <= 3)
    return {
      name: "Short-term Debt Fund / Bank FD",
      reason: "Short horizon. Debt funds offer better post-tax returns than FDs for amounts above ₹5,00,000."
    };
  if (years <= 5)
    return {
      name: "Hybrid / Balanced Advantage Fund",
      reason: "Medium horizon. Balanced funds reduce volatility while capturing some equity upside."
    };
  if (years <= 7)
    return {
      name: "Aggressive Hybrid / ELSS Fund",
      reason: "7-year horizon allows meaningful equity exposure. ELSS also provides Section 80C tax benefit."
    };
  return {
    name: "Equity Mutual Fund SIP / NPS",
    reason: "Long horizon. Equity compounding at 12% over 10+ years is the most powerful wealth builder available."
  };
}
function getReturnRate(years) {
  if (years <= 1) return 5;
  if (years <= 3) return 7;
  if (years <= 5) return 9;
  if (years <= 7) return 10;
  return 12;
}
function getGoalEmoji(name) {
  const n = name.toLowerCase();
  if (n.includes("car") || n.includes("vehicle") || n.includes("bike"))
    return "🚗";
  if (n.includes("home") || n.includes("house") || n.includes("flat") || n.includes("apartment"))
    return "🏠";
  if (n.includes("education") || n.includes("child") || n.includes("college") || n.includes("school"))
    return "🎓";
  if (n.includes("retire")) return "🌅";
  if (n.includes("vacation") || n.includes("travel") || n.includes("trip") || n.includes("holiday"))
    return "✈️";
  if (n.includes("wedding") || n.includes("marriage")) return "💍";
  if (n.includes("emergency")) return "🛡️";
  if (n.includes("business") || n.includes("startup")) return "💼";
  return "🎯";
}
const SCENARIOS = [
  {
    id: "single",
    title: "Single Goal: Buy a Car",
    desc: "Car worth ₹8,00,000 in 3 years. No loan. How much to save monthly?",
    goals: [{ name: "Buy a Car", targetToday: 8e5, years: 3 }],
    monthlyAvailable: 2e4,
    currentAge: 28,
    retirementAge: 60
  },
  {
    id: "multi",
    title: "3 Goals, ₹20,000/month",
    desc: "Child education in 12 yrs (₹30L today), home down payment in 5 yrs (₹15L), retirement. Split ₹20,000/month.",
    goals: [
      { name: "Child Education", targetToday: 3e6, years: 12 },
      { name: "Home Down Payment", targetToday: 15e5, years: 5 },
      { name: "Retirement Corpus", targetToday: 24e6, years: 28 }
    ],
    monthlyAvailable: 2e4,
    currentAge: 32,
    retirementAge: 60
  },
  {
    id: "retire",
    title: "Retirement at 55",
    desc: "Age 32. Retire at 55 with ₹80,000/month in today’s value. Monthly SIP required?",
    goals: [{ name: "Retirement Corpus", targetToday: 24e6, years: 23 }],
    monthlyAvailable: 3e4,
    currentAge: 32,
    retirementAge: 55
  },
  {
    id: "delay",
    title: "Cost of 2-Year Delay",
    desc: "Age 30, want to retire at 60. Started investing 2 years late. What did waiting cost?",
    goals: [{ name: "Retirement Corpus", targetToday: 3e7, years: 30 }],
    monthlyAvailable: 15e3,
    currentAge: 30,
    retirementAge: 60
  },
  {
    id: "raise",
    title: "Income Increase, Reprioritize",
    desc: "Income up by ₹15,000/month. Existing child education SIP running. How to allocate the extra?",
    goals: [
      { name: "Child Education (Existing)", targetToday: 25e5, years: 10 },
      { name: "Retirement Corpus", targetToday: 2e7, years: 25 },
      { name: "Emergency Fund", targetToday: 3e5, years: 2 },
      { name: "Vacation Fund", targetToday: 2e5, years: 3 }
    ],
    monthlyAvailable: 35e3,
    currentAge: 35,
    retirementAge: 60
  }
];
function analyzeGoals(goals, monthlyAvailable, currentAge) {
  const retirementAge = 65;
  const valid = goals.filter((g) => g.targetToday > 0 && g.years > 0);
  if (valid.length === 0)
    return {
      result: null,
      error: "Please add at least one goal with a target amount greater than 0 and years greater than 0."
    };
  if (valid.some((g) => g.targetToday < 0))
    return { result: null, error: "Goal target amounts cannot be negative." };
  if (valid.some((g) => g.years <= 0))
    return { result: null, error: "Years to goal must be at least 1." };
  if (valid.some((g) => g.years > 50))
    return {
      result: null,
      error: "Years to goal cannot exceed 50. Please check your entries."
    };
  if (currentAge <= 0 || currentAge > 80)
    return {
      result: null,
      error: "Please enter a valid current age between 1 and 80."
    };
  const goalResults = valid.map((g) => {
    const inflated = g.targetToday * (1 + INFLATION_RATE) ** g.years;
    const rate = getReturnRate(g.years);
    const fvAvailable = (g.availableToday ?? 0) * (1 + rate / 100) ** g.years;
    const adjustedTarget = Math.max(0, inflated - fvAvailable);
    const sip = sipRequired(adjustedTarget, rate, g.years);
    const sipNR = g.years > 0 ? Math.round(adjustedTarget / (g.years * 12)) : adjustedTarget;
    return {
      name: g.name,
      emoji: getGoalEmoji(g.name),
      targetToday: g.targetToday,
      targetInflated: Math.round(inflated),
      years: g.years,
      returnRate: rate,
      sipRequired: sip,
      sipNoReturn: sipNR,
      availableToday: g.availableToday ?? 0,
      fvAvailable: Math.round(fvAvailable),
      instrument: getInstrument(g.years)
    };
  });
  const totalSIPRequired = goalResults.reduce((s, g) => s + g.sipRequired, 0);
  const surplus = monthlyAvailable - totalSIPRequired;
  const allocationSplit = goalResults.map((g) => ({
    goal: g.name,
    amount: Math.round(monthlyAvailable * (g.sipRequired / totalSIPRequired)),
    pct: Math.round(g.sipRequired / totalSIPRequired * 100)
  }));
  const primary = goalResults[0];
  const sipNow = primary.sipRequired;
  const _avail = primary.availableToday ?? 0;
  const _delayYears = Math.max(1, primary.years - 2);
  const _rate = primary.returnRate;
  const _fvAvailableDelay = _avail > 0 ? _avail * (1 + _rate / 100) ** _delayYears : 0;
  const _adjustedDelayTarget = Math.max(
    0,
    primary.targetInflated - _fvAvailableDelay
  );
  const sipDelay2 = sipRequired(_adjustedDelayTarget, _rate, _delayYears);
  const costOfDelay = Math.round(
    (sipDelay2 - sipNow) * (primary.years - 2) * 12
  );
  const totalLostDelay2 = Math.round(
    sipNow * 24 * (1 + primary.returnRate / 100) ** (primary.years - 1)
  );
  const hasRetirement = goalResults.some(
    (g) => g.name.toLowerCase().includes("retire")
  );
  const retirementGoal = goalResults.find(
    (g) => g.name.toLowerCase().includes("retire")
  );
  const retirementNote = hasRetirement && retirementGoal ? `Retirement Planning: To generate ${fmtModuleLevel(Math.round(retirementGoal.targetToday / 12 / 25))} per month in today's value at age ${retirementAge}, you need a corpus of ${fmtModuleLevel(retirementGoal.targetToday)} today — or ${fmtModuleLevel(retirementGoal.targetInflated)} at retirement after ${INFLATION_RATE * 100}% annual inflation over ${retirementGoal.years} years. At ${retirementGoal.returnRate}% equity returns, your required SIP is ${fmtModuleLevel(retirementGoal.sipRequired)} per month. Starting at age ${currentAge} gives you ${retirementGoal.years * 12} months of compounding. Every year delayed raises your required SIP by approximately ${fmtModuleLevel(Math.round(sipRequired(retirementGoal.targetInflated, retirementGoal.returnRate, retirementGoal.years - 1) - retirementGoal.sipRequired))} per month.` : "";
  const insufficientNote = surplus < 0 ? `You need ${fmtModuleLevel(totalSIPRequired)} per month for all your goals but have ${fmtModuleLevel(monthlyAvailable)} available — a shortfall of ${fmtModuleLevel(Math.abs(surplus))} per month. Options: (1) Extend timelines for lower-priority goals. (2) Reduce target amounts on flexible goals like vacation. (3) Increase income or reduce expenses. (4) Start with your top-priority goal only and add others as income grows.` : "";
  return {
    result: {
      goals: goalResults,
      totalSIPRequired,
      monthlyAvailable,
      surplus,
      allocationSplit,
      delayImpact: {
        primaryGoal: primary.name,
        sipNow,
        sipDelay2yrs: sipDelay2,
        costOfDelay,
        totalLostDelay2
      },
      retirementNote,
      insufficientNote
    },
    error: ""
  };
}
let nextId = 1;
function ModelGoalPlanningTab({
  initialScenario
} = {}) {
  const { actor } = useActor();
  const { formatCurrency } = useCurrency();
  const fmtC = (n) => formatCurrency(n);
  const [planMode, setPlanMode] = reactExports.useState("single");
  const initScenario = SCENARIOS.find((s) => s.id === (initialScenario ?? "single")) ?? SCENARIOS[0];
  const [goals, setGoals] = reactExports.useState(
    initScenario.goals.map((g) => ({ ...g, id: nextId++, availableToday: 0 }))
  );
  const [monthlyAvailable, setMonthlyAvailable] = reactExports.useState(
    initScenario.monthlyAvailable
  );
  const [currentAge, setCurrentAge] = reactExports.useState(() => {
    const dob = localStorage.getItem("gff_dob");
    if (dob) {
      const age = Math.floor(
        (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1e3)
      );
      if (age > 0 && age < 100) return age;
    }
    return initScenario.currentAge;
  });
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [addingToTrack, setAddingToTrack] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [_activeScenario, setActiveScenario] = reactExports.useState(initScenario.id);
  const loadScenario = (s) => {
    setGoals(s.goals.map((g) => ({ ...g, id: nextId++, availableToday: 0 })));
    setMonthlyAvailable(s.monthlyAvailable);
    setActiveScenario(s.id);
    setResult(null);
    setError("");
  };
  const updateGoal = (id, field, value) => setGoals(
    (prev) => prev.map(
      (g) => g.id === id ? {
        ...g,
        [field]: typeof value === "string" ? value : Number(value) || 0
      } : g
    )
  );
  const addGoal = () => setGoals((prev) => [
    ...prev,
    {
      id: nextId++,
      name: "New Goal",
      targetToday: 5e5,
      years: 5,
      availableToday: 0
    }
  ]);
  const removeGoal = (id) => setGoals((prev) => prev.filter((g) => g.id !== id));
  const handleAnalyze = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const { result: r, error: e } = analyzeGoals(
        goals,
        monthlyAvailable,
        currentAge
      );
      if (r) setResult(r);
      else setError(e);
      setLoading(false);
    }, 700);
  };
  const res = result;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-600", children: "Planning Mode:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "radio",
            name: "planMode",
            value: "single",
            checked: planMode === "single",
            onChange: () => {
              setPlanMode("single");
              const s = SCENARIOS.find((sc) => sc.id === "single");
              if (s) {
                loadScenario(s);
              }
              setResult(null);
            },
            className: "accent-green-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-700", children: "Single Goal" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "radio",
            name: "planMode",
            value: "multi",
            checked: planMode === "multi",
            onChange: () => {
              setPlanMode("multi");
              const s = SCENARIOS.find((sc) => sc.id === "multi");
              if (s) {
                loadScenario(s);
              }
              setResult(null);
            },
            className: "accent-green-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-700", children: "Multi Goal" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-100 rounded-xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-600 uppercase tracking-wide", children: "Your Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-slate-600", children: "Current Age" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 18,
              max: 80,
              value: currentAge || "",
              onChange: (e) => setCurrentAge(Number(e.target.value) || 0),
              className: "h-8 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-slate-600", children: "Monthly Savings Available" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5 text-slate-400 cursor-help" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Total you can invest each month across all goals" }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              value: monthlyAvailable || "",
              onChange: (e) => setMonthlyAvailable(Number(e.target.value) || 0),
              className: "h-8 text-sm",
              placeholder: "0"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-slate-600 uppercase tracking-wide", children: "Your Goals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: addGoal,
            className: "h-7 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
              " Add Goal"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-1.5 pr-2 font-semibold text-slate-500", children: "Goal Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5 px-2 font-semibold text-slate-500", children: "Target Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5 px-2 font-semibold text-slate-500", children: "Years to Goal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-1.5 px-2 font-semibold text-slate-500", children: "Available Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: goals.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 pr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: g.name,
              onChange: (e) => updateGoal(g.id, "name", e.target.value),
              className: "h-7 text-xs min-w-[130px]"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              value: g.targetToday || "",
              onChange: (e) => updateGoal(g.id, "targetToday", e.target.value),
              className: "h-7 text-xs text-right min-w-[110px]",
              placeholder: "0"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 1,
              max: 50,
              value: g.years || "",
              onChange: (e) => updateGoal(g.id, "years", e.target.value),
              className: "h-7 text-xs text-right min-w-[60px]",
              placeholder: "5"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              value: (g.availableToday ?? 0) || "",
              onChange: (e) => updateGoal(g.id, "availableToday", e.target.value),
              className: "h-7 text-xs text-right min-w-[110px]",
              placeholder: "0"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 pl-1", children: goals.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => removeGoal(g.id),
              className: "text-red-400 hover:text-red-600 p-1",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          ) })
        ] }, g.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Target Today = the cost in today's money. The model will automatically inflate it at 6% per year to calculate your future target." })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-red-500 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-700", children: error })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: handleAnalyze,
        disabled: loading,
        className: "w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white",
        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 mr-2 animate-spin" }),
          "Building your goal plan..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 mr-2" }),
          "Build My Goal Plan"
        ] })
      }
    ),
    res && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
      res.insufficientNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-red-500 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-red-800", children: "⚠️ Monthly Savings Shortfall" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-700 mt-0.5", children: res.insufficientNote })
        ] })
      ] }),
      res.surplus >= 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-green-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-800", children: [
          "Your monthly savings of ",
          fmtC(res.monthlyAvailable),
          " are",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "sufficient" }),
          " to fund all your goals. You will have ",
          fmtC(res.surplus),
          " per month as surplus after allocating to all goals. Consider investing this surplus in an index fund or NPS for additional wealth creation."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: "🎯 Your Goal Plan — Inflation-Adjusted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: res.goals.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-white border border-slate-100 rounded-xl p-3 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: g.emoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-slate-800", children: g.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium", children: [
                  g.years,
                  " years"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 rounded-lg p-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400", children: "Target Today" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-slate-700 mt-0.5", children: fmtC(g.targetToday) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-orange-50 rounded-lg p-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-orange-400", children: "Inflation-Adjusted (@6%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-orange-700 mt-0.5", children: fmtC(g.targetInflated) }),
                  g.availableToday > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-orange-300 text-[10px]", children: [
                    "Available FV: ",
                    fmtC(g.fvAvailable)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 rounded-lg p-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-green-400", children: [
                    "SIP Required (@",
                    g.returnRate,
                    "%)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-green-700 mt-0.5", children: fmtC(g.sipRequired) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-green-300 text-xs", children: [
                    "Without returns: ",
                    fmtC(g.sipNoReturn)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 rounded-lg p-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-400", children: "Best Instrument" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-blue-700 mt-0.5 leading-tight", children: g.instrument.name })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 bg-slate-50 rounded-lg p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
                "💡 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Why this instrument:" }),
                " ",
                g.instrument.reason
              ] }) })
            ]
          },
          g.name
        )) })
      ] }),
      res.goals.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: [
          "📊 Priority Goal Stack — How to Split",
          " ",
          fmtC(res.monthlyAvailable),
          "/month"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-2.5 font-semibold text-slate-600", children: "Goal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "SIP Required" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Suggested Allocation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2.5 font-semibold text-slate-600", children: "Share" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            res.goals.map((g, i) => {
              var _a, _b;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-slate-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 font-medium text-slate-700", children: [
                  g.emoji,
                  " ",
                  g.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 text-right text-slate-600", children: [
                  fmtC(g.sipRequired),
                  "/mo"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 text-right font-bold text-indigo-600", children: [
                  fmtC(((_a = res.allocationSplit[i]) == null ? void 0 : _a.amount) || 0),
                  "/mo"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full", children: [
                  ((_b = res.allocationSplit[i]) == null ? void 0 : _b.pct) || 0,
                  "%"
                ] }) })
              ] }, g.name);
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-slate-200 bg-slate-50 font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-slate-700", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 text-right text-slate-800", children: [
                fmtC(res.totalSIPRequired),
                "/mo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-2.5 text-right text-slate-800", children: [
                fmtC(res.monthlyAvailable),
                "/mo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2.5 text-right text-slate-500", children: "100%" })
            ] })
          ] })
        ] }) })
      ] }),
      res.retirementNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-amber-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-800", children: "🌅 Retirement Deep Dive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-800 mt-0.5", children: res.retirementNote })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold text-slate-700 mb-2", children: [
          "⏰ Start Today vs Wait 2 Years — Cost of Delay (",
          res.delayImpact.primaryGoal,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 border-2 border-green-300 rounded-xl p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 font-semibold", children: "If You Start TODAY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-green-700 mt-1", children: [
              fmtC(res.delayImpact.sipNow),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: "/month" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 mt-1", children: "Lower monthly commitment. More compounding time." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 font-semibold", children: "If You Wait 2 Years" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-red-600 mt-1", children: [
              fmtC(res.delayImpact.sipDelay2yrs),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: "/month" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500 mt-1", children: [
              "Extra per month:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: fmtC(
                res.delayImpact.sipDelay2yrs - res.delayImpact.sipNow
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-500", children: [
              "Total compounding lost:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: fmtC(res.delayImpact.totalLostDelay2) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-600", children: [
          "💡 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "The Math:" }),
          " Waiting 2 years means you need",
          " ",
          fmtC(res.delayImpact.sipDelay2yrs - res.delayImpact.sipNow),
          " ",
          "more per month for the remaining years to hit the same target. The total additional contribution required is approximately",
          " ",
          fmtC(res.delayImpact.costOfDelay),
          ". This is money that could have been compounding for you instead."
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 bg-violet-50 border border-violet-200 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-violet-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-violet-700", children: "⚡ Your Action Step for Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-violet-700 mt-0.5", children: [
            "Open a SIP of",
            " ",
            fmtC(
              Math.max(500, Math.round(res.goals[0].sipRequired * 0.25))
            ),
            " ",
            "per month today for your ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: res.goals[0].name }),
            ". Starting at 25% of the required amount and increasing by 10% each year gets you to your full goal on schedule. The habit of starting matters more than the amount."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          disabled: addingToTrack,
          onClick: async () => {
            if (!actor) return;
            setAddingToTrack(true);
            try {
              for (const g of res.goals) {
                const goalDateMs = Date.now() + g.years * 365 * 24 * 3600 * 1e3;
                const targetDate = BigInt(Math.round(goalDateMs)) * BigInt(1e6);
                const deadline = new Date(goalDateMs).toISOString().split("T")[0];
                const notes = JSON.stringify({
                  targetDate: targetDate.toString(),
                  priority: "1",
                  inflationRate: 6,
                  linkedInvestments: [],
                  investmentAllocations: {},
                  plannedSip: Math.round(g.sipRequired)
                });
                await actor.createGoal({
                  id: crypto.randomUUID(),
                  name: g.name,
                  targetAmount: g.targetInflated,
                  currentAmount: 0,
                  deadline,
                  notes,
                  category: ""
                });
              }
              ue.success("Goals added to Track Goals!");
            } catch {
              ue.error("Failed to add goals. Please try again.");
            } finally {
              setTimeout(() => setAddingToTrack(false), 1500);
            }
          },
          className: `w-full py-2.5 px-4 text-white text-sm font-semibold rounded-xl transition-all ${addingToTrack ? "bg-green-400 cursor-not-allowed scale-95" : "bg-green-600 hover:bg-green-700"}`,
          "data-ocid": "goal_planning.add_to_track_button",
          children: addingToTrack ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                className: "animate-spin h-4 w-4",
                viewBox: "0 0 24 24",
                fill: "none",
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      className: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      strokeWidth: "4"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      className: "opacity-75",
                      fill: "currentColor",
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    }
                  )
                ]
              }
            ),
            "Adding..."
          ] }) : "+ Add to Track Goals"
        }
      ) })
    ] })
  ] });
}
export {
  Info as I,
  ModelGoalPlanningTab as M,
  TooltipProvider as T,
  Tooltip as a,
  TooltipTrigger as b,
  TooltipContent as c
};
