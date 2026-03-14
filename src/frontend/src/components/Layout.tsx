import {
  ArrowLeftRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  Shield,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "./ui/button";

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
  { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(
    location.pathname.startsWith("/portfolio"),
  );

  const isPortfolioActive = location.pathname.startsWith("/portfolio");

  // Auto-open on desktop, auto-close on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

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

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-700">
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
