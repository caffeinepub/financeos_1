import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  Edit2,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  Shield,
  Target,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
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
  { label: "Retirement", path: "/portfolio/Retirement" },
  { label: "Mutual Fund", path: "/portfolio/MutualFund" },
  { label: "ETF / Equity Stocks", path: "/portfolio/ETF" },
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
  { label: "Financial Rules", path: "/financial-rules", icon: Shield },
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

  // Profile state
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const isPortfolioActive = location.pathname.startsWith("/portfolio");

  // Auto-open on desktop, auto-close on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Load profile when actor is ready
  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getCallerUserProfile()
      .then((p) => {
        setProfile(p);
      })
      .catch(() => {
        // silently ignore
      });
  }, [actor, isFetching]);

  const openProfileDialog = () => {
    setEditName(profile?.name ?? "");
    setEditEmail(profile?.email ?? "");
    setProfileDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: editName, email: editEmail });
      const updated = await actor.getCallerUserProfile();
      setProfile(updated);
      setProfileDialogOpen(false);
    } catch {
      // silently ignore
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const closeBackdrop = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/50 cursor-default"
          onClick={closeBackdrop}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${
            isMobile
              ? `fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : `flex-shrink-0 transition-all duration-300 ${
                  sidebarOpen ? "w-64" : "w-0 overflow-hidden"
                }`
          }
          bg-slate-900 text-white flex flex-col
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-700">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">FinanceOS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.children) {
              return (
                <div key={item.path}>
                  <button
                    type="button"
                    data-ocid="nav.portfolio.toggle"
                    onClick={() => setPortfolioOpen((o) => !o)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isPortfolioActive
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {portfolioOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  {portfolioOpen && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {item.children.map((sub) => (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          onClick={handleNavClick}
                          data-ocid={`nav.portfolio.${sub.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                data-ocid={`nav.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile + Logout */}
        <div className="px-3 py-4 border-t border-slate-700 space-y-2">
          {/* Profile section */}
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
              {profile?.name ? (
                <span className="text-xs font-bold text-white">
                  {getInitials(profile.name)}
                </span>
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {profile?.name || "Set up profile"}
              </p>
              {profile?.email && (
                <p className="text-xs text-slate-400 truncate">
                  {profile.email}
                </p>
              )}
            </div>
            <button
              type="button"
              data-ocid="profile.edit_button"
              onClick={openProfileDialog}
              className="flex-shrink-0 p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Edit profile"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Logout */}
          <Button
            data-ocid="nav.logout.button"
            variant="ghost"
            size="sm"
            onClick={clear}
            className="w-full justify-start gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent data-ocid="profile.dialog" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                data-ocid="profile.name.input"
                placeholder="Your full name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                data-ocid="profile.email.input"
                type="email"
                placeholder="your@email.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="profile.cancel_button"
              variant="outline"
              onClick={() => setProfileDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              data-ocid="profile.save_button"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((o) => !o)}
            data-ocid="header.menu.button"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <h1 className="text-base font-semibold text-slate-800">
            {navItems.find((n) =>
              n.children
                ? n.children.some((c) => location.pathname === c.path)
                : location.pathname === n.path,
            )?.label ?? "FinanceOS"}
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6">{children}</main>
      </div>
    </div>
  );
}
