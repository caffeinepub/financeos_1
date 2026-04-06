import { c as createLucideIcon, u as useActor, r as reactExports, j as jsxRuntimeExports, $ as Shield, B as Button } from "./index-DaY7P1ze.js";
import { R as RefreshCw } from "./refresh-cw-CO-ziTeb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
function AdminPage() {
  const { actor } = useActor();
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [actionLoading, setActionLoading] = reactExports.useState(null);
  const [bootstrapped, setBootstrapped] = reactExports.useState(false);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const admin = await actor.bootstrapAdmin().catch(() => false);
        setBootstrapped(true);
        const check = await actor.isCallerAdmin().catch(() => false);
        setIsAdmin(!!check || !!admin);
        if (check || admin) await loadUsers();
      } catch {
        setError("Failed to initialize admin");
      } finally {
        setLoading(false);
      }
    })();
  }, [actor]);
  const loadUsers = async () => {
    if (!actor) return;
    try {
      const raw = await actor.adminGetAllUsers();
      const list = raw.map((entry) => {
        const principal = Array.isArray(entry) ? entry[0] : entry.principal;
        const profile = Array.isArray(entry) ? entry[1] : entry;
        return {
          principal: String(principal),
          name: (profile == null ? void 0 : profile.name) || "—",
          email: (profile == null ? void 0 : profile.email) || "—",
          suspended: false
        };
      });
      setUsers(list);
    } catch {
      setError("Failed to load users");
    }
  };
  const handleSuspend = async (u) => {
    if (!actor) return;
    setActionLoading(u.principal);
    try {
      if (u.suspended) {
        await actor.adminUnsuspendUser(u.principal);
        setUsers(
          (prev) => prev.map(
            (x) => x.principal === u.principal ? { ...x, suspended: false } : x
          )
        );
      } else {
        await actor.adminSuspendUser(u.principal);
        setUsers(
          (prev) => prev.map(
            (x) => x.principal === u.principal ? { ...x, suspended: true } : x
          )
        );
      }
    } catch {
    } finally {
      setActionLoading(null);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 animate-pulse", children: "Loading admin panel..." }) });
  }
  if (!isAdmin && bootstrapped) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-sm", children: "Access denied. Admin only." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-800", children: "Admin Panel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: loadUsers, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 mr-1" }),
        " Refresh"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-slate-700", children: [
        "Registered Users (",
        users.length,
        ")"
      ] }) }),
      users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-8 text-center text-slate-400 text-sm", children: "No registered users yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-2.5 text-xs font-semibold text-slate-500", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-2.5 text-xs font-semibold text-slate-500 hidden md:table-cell", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-2.5 text-xs font-semibold text-slate-500 hidden lg:table-cell", children: "Principal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-5 py-2.5 text-xs font-semibold text-slate-500", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-5 py-2.5 text-xs font-semibold text-slate-500", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-50", children: users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "hover:bg-slate-50 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 font-medium text-slate-800", children: u.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-slate-500 hidden md:table-cell", children: u.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3 text-slate-400 font-mono text-xs hidden lg:table-cell", children: [
                u.principal.slice(0, 20),
                "..."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs font-semibold px-2 py-0.5 rounded-full ${u.suspended ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`,
                  children: u.suspended ? "Suspended" : "Active"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: u.suspended ? "outline" : "destructive",
                  disabled: actionLoading === u.principal,
                  onClick: () => handleSuspend(u),
                  className: "text-xs h-7",
                  children: u.suspended ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3 h-3 mr-1" }),
                    " Unsuspend"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "w-3 h-3 mr-1" }),
                    " Suspend"
                  ] })
                }
              ) })
            ]
          },
          u.principal
        )) })
      ] })
    ] })
  ] });
}
export {
  AdminPage as default
};
