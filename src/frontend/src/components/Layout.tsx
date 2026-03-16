import { useIsMobile } from "@/hooks/use-mobile";
import {
  BarChart3,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  PieChart,
  PiggyBank,
  Shield,
  Target,
  TrendingUp,
  X,
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
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Goals", path: "/goals", icon: Target },
  {
    label: "Portfolio",
    path: "/portfolio",
    icon: TrendingUp,
    children: portfolioSubItems,
  },
  { label: "Budgeting", path: "/budgeting", icon: PiggyBank },
  { label: "Financial Model", path: "/financial-model", icon: BarChart3 },
  {
    label: "Financial Planner",
    path: "/financial-planner",
    icon: CalendarDays,
  },
  { label: "Learn Finance", path: "/financial-rules", icon: Shield },
  { label: "Loans", path: "/loans", icon: CreditCard },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const isMobile = useIsMobile();
  const { actor, isFetching } = useActor();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [saving, setSaving] = useState(false);

  const isPortfolioActive = location.pathname.startsWith("/portfolio");

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getCallerUserProfile()
      .then((p) => {
        setProfile(p);
      })
      .catch(() => {});
  }, [actor, isFetching]);

  const navigate = useNavigate();

  const openProfileDialog = () => {
    setEditName(profile?.name || "");
    setEditEmail(profile?.email || "");
    setProfileDialogOpen(true);
  };

  const saveProfile = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: editName, email: editEmail });
      setProfile({ name: editName, email: editEmail });
      setProfileDialogOpen(false);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const Sidebar = (
    <aside className="flex flex-col h-full bg-slate-900 text-white w-64 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <PieChart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-white tracking-tight">
            FinanceOS
          </span>
        </div>
        {isMobile && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

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

      {/* Profile + Logout */}
      <div className="border-t border-slate-700 px-2 py-3 space-y-1">
        <button
          type="button"
          onClick={openProfileDialog}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
            {profile?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-xs font-semibold truncate">
              {profile?.name || "Profile"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {profile?.email || "Set your profile"}
            </p>
          </div>
          <Pencil className="w-3 h-3 flex-shrink-0 text-slate-400" />
        </button>
        <button
          type="button"
          data-ocid="nav.logout.button"
          onClick={() => {
            clear();
            navigate("/");
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-red-900/40 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
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
        <div className="hidden md:flex">{Sidebar}</div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        {isMobile && (
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
            <button
              type="button"
              data-ocid="nav.mobile_menu.button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-800 text-sm">
              {navItems.find(
                (n) =>
                  location.pathname === n.path ||
                  location.pathname.startsWith(`${n.path}/`),
              )?.label || "FinanceOS"}
            </span>
          </div>
        )}

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
