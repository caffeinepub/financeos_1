import { CalendarDays } from "lucide-react";
import { CalculatorsTab } from "../components/financial-planner/CalculatorsTab";

export default function FinancialPlannerPage() {
  return (
    <div className="h-full" data-ocid="financialplanner.page">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #d97706, #fbbf24)" }}
        >
          <CalendarDays className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Financial Planner</h1>
      </div>
      <CalculatorsTab />
    </div>
  );
}
