import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

/**
 * WellKnownGuard — rendered for any path matching /.well-known/*
 * It does nothing in React and lets the IC asset canister serve the
 * file directly. If JavaScript somehow reaches here (e.g. client-side
 * navigation), we redirect to the raw URL so the browser fetches it
 * as a plain HTTP request, bypassing the SPA entirely.
 */
function WellKnownPassthrough() {
  const { pathname } = useLocation();
  // Force a hard browser navigation so the asset canister serves the file
  window.location.replace(pathname);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            {/* Explicit exclusion: /.well-known/* must never be handled by React Router.
                The IC asset canister serves these files directly from the public directory.
                This route exists only as a safety net for client-side navigations. */}
            <Route path="/.well-known/*" element={<WellKnownPassthrough />} />

            {/* Public routes — always loaded, no lazy */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected app routes — lazy-loaded per module */}
            <Route
              path="*"
              element={
                <AuthGuard>
                  <Layout>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/goals" element={<GoalsPage />} />
                        <Route
                          path="/portfolio"
                          element={
                            <Navigate to="/portfolio/Retirement" replace />
                          }
                        />
                        <Route
                          path="/portfolio/:assetType"
                          element={<PortfolioPage />}
                        />
                        <Route path="/budgeting" element={<BudgetingPage />} />
                        <Route
                          path="/financial-model"
                          element={<FinancialModelPage />}
                        />
                        <Route
                          path="/financial-planner"
                          element={<FinancialPlannerPage />}
                        />
                        <Route
                          path="/financial-rules"
                          element={<FinancialRulesPage />}
                        />
                        <Route path="/loans" element={<LoansPage />} />
                        <Route
                          path="/trade-journal"
                          element={<TradeJournalPage />}
                        />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route
                          path="*"
                          element={<Navigate to="/dashboard" replace />}
                        />
                      </Routes>
                    </Suspense>
                  </Layout>
                </AuthGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
