import {
  Navigate,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";

// Lazy-load all page-level modules so their code is only downloaded when needed
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const GoalsPage = lazy(() => import("./pages/GoalsPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const BudgetingPage = lazy(() => import("./pages/BudgetingPage"));
const FinancialModelPage = lazy(() => import("./pages/FinancialModelPage"));
const FinancialPlannerPage = lazy(() => import("./pages/FinancialPlannerPage"));
const FinancialRulesPage = lazy(() => import("./pages/FinancialRulesPage"));
const LoansPage = lazy(() => import("./pages/LoansPage"));
const TradeJournalPage = lazy(() => import("./pages/TradeJournalPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-slate-700 text-lg animate-pulse">
          Loading Growfinfire Global...
        </div>
      </div>
    );
  }
  if (!identity || identity.getPrincipal().isAnonymous()) {
    return <Navigate to={"/" as never} />;
  }
  return <>{children}</>;
}

function WellKnownPassthrough() {
  const loc = useLocation();
  window.location.replace(loc.pathname);
  return null;
}

// Root route
const rootRoute = createRootRoute({
  component: () => <RootLayout />,
});

function RootLayout() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        {/* Outlet rendered by child routes */}
        <ChildRoutes />
      </CurrencyProvider>
    </ThemeProvider>
  );
}

// Separate component to avoid circular reference
import { Outlet } from "@tanstack/react-router";

function ChildRoutes() {
  return <Outlet />;
}

const wellKnownRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/.well-known/$",
  component: WellKnownPassthrough,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Protected routes wrapper
function ProtectedLayout() {
  return (
    <AuthGuard>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Layout>
    </AuthGuard>
  );
}

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const goalsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/goals",
  component: GoalsPage,
});

const portfolioIndexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/portfolio",
  component: () => <Navigate to={"/portfolio/Retirement" as never} />,
});

const portfolioRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/portfolio/$assetType",
  component: PortfolioPage,
});

const budgetingRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/budgeting",
  component: BudgetingPage,
});

const financialModelRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/financial-model",
  component: FinancialModelPage,
});

const financialPlannerRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/financial-planner",
  component: FinancialPlannerPage,
});

const financialRulesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/financial-rules",
  component: FinancialRulesPage,
});

const loansRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/loans",
  component: LoansPage,
});

const tradeJournalRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/trade-journal",
  component: TradeJournalPage,
});

const helpRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/help",
  component: HelpPage,
});

const adminRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/admin",
  component: AdminPage,
});

const catchAllRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "*",
  component: () => <Navigate to={"/dashboard" as never} />,
});

const routeTree = rootRoute.addChildren([
  wellKnownRoute,
  indexRoute,
  loginRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    goalsRoute,
    portfolioIndexRoute,
    portfolioRoute,
    budgetingRoute,
    financialModelRoute,
    financialPlannerRoute,
    financialRulesRoute,
    loansRoute,
    tradeJournalRoute,
    helpRoute,
    adminRoute,
    catchAllRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
