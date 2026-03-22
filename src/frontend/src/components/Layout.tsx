import { useIsMobile } from "@/hooks/use-mobile";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  PiggyBank,
  Shield,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { GrowfinfireChat } from "./GrowfinfireChat";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const portfolioSubItems = [
  { label: "Overview", path: "/portfolio/overview" },
  { label: "Retiral", path: "/portfolio/Retirement" },
  { label: "Mutual Fund", path: "/portfolio/MutualFund" },
  { label: "Equity (ETF/Stocks)", path: "/portfolio/ETF" },
  { label: "Crypto", path: "/portfolio/Crypto" },
  { label: "Commodity", path: "/portfolio/Commodity" },
  { label: "Real Estate", path: "/portfolio/RealEstate" },
  { label: "Fixed Income", path: "/portfolio/FixedIncome" },
  { label: "Other Investments", path: "/portfolio/Other" },
];

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    color: "#2563eb",
  },
  {
    label: "Goals",
    path: "/goals",
    icon: Target,
    color: "#059669",
  },
  {
    label: "Portfolio",
    path: "/portfolio",
    icon: TrendingUp,
    color: "#0891b2",
    children: portfolioSubItems,
  },
  {
    label: "Budgeting",
    path: "/budgeting",
    icon: PiggyBank,
    color: "#7c3aed",
  },
  {
    label: "Financial Model",
    path: "/financial-model",
    icon: BarChart3,
    color: "#dc2626",
  },
  {
    label: "Financial Planner",
    path: "/financial-planner",
    icon: CalendarDays,
    color: "#d97706",
  },
  {
    label: "Learn Finance",
    path: "/financial-rules",
    icon: Shield,
    color: "#0d9488",
  },
  {
    label: "Loans",
    path: "/loans",
    icon: CreditCard,
    color: "#9333ea",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const isMobile = useIsMobile();
  const { actor, isFetching } = useActor();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(
    location.pathname.startsWith("/portfolio"),
  );

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDob, setEditDob] = useState("");
  const [_profileDob, setProfileDob] = useState(
    () => localStorage.getItem("gff_dob") || "",
  );
  const [saving, setSaving] = useState(false);

  // Blocked status
  const [blockedStatus, setBlockedStatus] = useState<{
    blocked: boolean;
    reason: string;
  } | null>(null);

  const isPortfolioActive = location.pathname.startsWith("/portfolio");

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!actor || isFetching) return;

    Promise.all([
      actor.getCallerUserProfile().catch(() => null),
      actor.isCallerBlocked().catch(() => ({ blocked: false, reason: "" })),
    ]).then(([p, blocked]) => {
      if (p) setProfile(p);
      setBlockedStatus(blocked as { blocked: boolean; reason: string });
    });
  }, [actor, isFetching]);

  const navigate = useNavigate();

  const openProfileDialog = () => {
    setEditName(profile?.name || "");
    setEditEmail(profile?.email || "");
    setEditDob(localStorage.getItem("gff_dob") || "");
    setProfileDialogOpen(true);
  };

  const saveProfile = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: editName, email: editEmail });
      if (editDob) {
        localStorage.setItem("gff_dob", editDob);
        setProfileDob(editDob);
      } else {
        localStorage.removeItem("gff_dob");
        setProfileDob("");
      }
      setProfile({ name: editName, email: editEmail });
      setProfileDialogOpen(false);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = () => {
    if (isMobile) {
      setSidebarOpen((o) => !o);
    } else {
      setSidebarCollapsed((c) => !c);
    }
  };

  const Sidebar = (
    <aside className="flex flex-col h-full bg-slate-900 text-white w-64 flex-shrink-0">
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  type="button"
                  data-ocid="nav.portfolio.toggle"
                  onClick={() => setPortfolioOpen((o) => !o)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isPortfolioActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </span>
                  <span className="text-xs">{portfolioOpen ? "▲" : "▼"}</span>
                </button>
                {portfolioOpen && (
                  <div className="ml-7 mt-1 space-y-0.5">
                    {item.children.map((sub) => (
                      <button
                        key={sub.path}
                        type="button"
                        data-ocid={`nav.portfolio.${sub.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                        onClick={() => {
                          navigate(sub.path);
                          if (isMobile) setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          location.pathname === sub.path
                            ? "bg-slate-700 text-white font-semibold"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              data-ocid={`nav.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  // Collapsed horizontal menu items
  const collapsedNavItems = navItems
    .filter((item) => !item.children)
    .concat(
      navItems
        .filter((item) => !!item.children)
        .map((item) => ({
          label: item.label,
          path: "/portfolio/overview",
          icon: item.icon,
          color: item.color ?? "#64748b",
        })),
    )
    .sort((a, b) => {
      const order = navItems.map((n) => n.label);
      return order.indexOf(a.label) - order.indexOf(b.label);
    });

  // Blocked user overlay
  if (blockedStatus?.blocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div
          className="bg-white rounded-2xl shadow-xl border border-red-200 p-10 max-w-md w-full text-center space-y-5"
          data-ocid="blocked.dialog"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Account Blocked</h2>
          <p className="text-slate-500 text-sm">
            Your account has been restricted by an administrator.
          </p>
          {blockedStatus.reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-left">
              <p className="text-xs font-semibold text-red-700 mb-1">Reason:</p>
              <p className="text-sm text-red-600">{blockedStatus.reason}</p>
            </div>
          )}
          <p className="text-xs text-slate-400">
            Please contact support if you believe this is an error.
          </p>
          <Button
            variant="destructive"
            className="w-full"
            data-ocid="blocked.signout.button"
            onClick={() => {
              clear();
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* ── TOP HEADER ────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-3 md:px-4 bg-slate-900 border-b border-slate-700 flex-shrink-0 h-14 z-50">
        {/* Left: toggle + brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="nav.mobile_menu.button"
            onClick={handleToggle}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <PieChart className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-teal-400 tracking-tight leading-none">
                Growfinfire Global
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5 hidden sm:block">
                Learn Finance. Grow Wealth. Achieve Freedom.
              </p>
            </div>
          </div>
        </div>

        {/* Right: status + user + help + sign out */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-xs text-slate-300 hidden sm:block truncate max-w-[120px]">
            {profile?.name || "User"}
          </span>

          <button
            type="button"
            onClick={openProfileDialog}
            data-ocid="header.profile.button"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white hover:opacity-90 transition-opacity flex-shrink-0"
            title="Edit Profile"
          >
            {profile?.name?.charAt(0)?.toUpperCase() || "U"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/help")}
            data-ocid="header.help.button"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity flex-shrink-0"
            title="Help & Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="header.logout.button"
            onClick={() => {
              clear();
              navigate("/");
            }}
            className="text-slate-300 hover:text-red-400 hover:bg-red-900/30 gap-1.5 text-xs px-2 h-8"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* ── COLLAPSED HORIZONTAL NAV (desktop only, when sidebar collapsed) ── */}
      {!isMobile && sidebarCollapsed && (
        <div className="bg-slate-800 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-1 px-3 overflow-x-auto py-1.5 scrollbar-thin">
            {collapsedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.label === "Portfolio" &&
                  location.pathname.startsWith("/portfolio"));
              return (
                <button
                  key={item.label}
                  type="button"
                  data-ocid={`nav.collapsed.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                  style={
                    isActive ? { background: item.color ?? "#2563eb" } : {}
                  }
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop
          <div
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
        )}

        {/* Sidebar */}
        {isMobile ? (
          <div
            className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {Sidebar}
          </div>
        ) : (
          !sidebarCollapsed && <div className="hidden md:flex">{Sidebar}</div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Profile dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent data-ocid="profile.dialog">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                data-ocid="profile.name.input"
              />
            </div>
            <div>
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                data-ocid="profile.email.input"
              />
            </div>
            <div>
              <Label htmlFor="profile-dob">Date of Birth</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="profile-dob"
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  data-ocid="profile.dob.input"
                  className="flex-1"
                />
                {editDob && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full whitespace-nowrap">
                    Age:{" "}
                    {Math.floor(
                      (Date.now() - new Date(editDob).getTime()) /
                        (365.25 * 24 * 3600 * 1000),
                    )}{" "}
                    yrs
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProfileDialogOpen(false)}
              data-ocid="profile.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveProfile}
              disabled={saving}
              data-ocid="profile.save_button"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <GrowfinfireChat />
    </div>
  );
}
