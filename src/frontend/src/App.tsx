import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import BudgetingPage from "./pages/BudgetingPage";
import DashboardPage from "./pages/DashboardPage";
import FinancialModelPage from "./pages/FinancialModelPage";
import FinancialPlannerPage from "./pages/FinancialPlannerPage";
import FinancialRulesPage from "./pages/FinancialRulesPage";
import GoalsPage from "./pages/GoalsPage";
import LoansPage from "./pages/LoansPage";
import LoginPage from "./pages/LoginPage";
import PortfolioPage from "./pages/PortfolioPage";
import TransactionsPage from "./pages/TransactionsPage";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white text-lg animate-pulse">
          Loading FinanceOS...
        </div>
      </div>
    );
  }
  if (!identity || identity.getPrincipal().isAnonymous()) {
    return <LoginPage />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route
              path="/portfolio"
              element={<Navigate to="/portfolio/Retirement" replace />}
            />
            <Route path="/portfolio/:assetType" element={<PortfolioPage />} />
            <Route path="/budgeting" element={<BudgetingPage />} />
            <Route path="/financial-model" element={<FinancialModelPage />} />
            <Route
              path="/financial-planner"
              element={<FinancialPlannerPage />}
            />
            <Route path="/financial-rules" element={<FinancialRulesPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </AuthGuard>
    </BrowserRouter>
  );
}
