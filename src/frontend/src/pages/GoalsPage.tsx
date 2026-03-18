import { Target } from "lucide-react";
import { GoalsTab } from "../components/goals/GoalsTab";

export default function GoalsPage() {
  return (
    <div data-ocid="goals.page">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
        >
          <Target className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Financial Goals</h1>
      </div>
      <GoalsTab />
    </div>
  );
}
