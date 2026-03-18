import { BarChart3 } from "lucide-react";
import { FinancialModelingTab } from "../components/financial-model/FinancialModelingTab";

export default function FinancialModelPage() {
  return (
    <div data-ocid="financialmodel.page" className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #dc2626, #f87171)" }}
        >
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Financial Model</h1>
      </div>
      <FinancialModelingTab />
    </div>
  );
}
