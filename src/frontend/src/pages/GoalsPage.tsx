import { Plus, Target } from "lucide-react";
import { useState } from "react";
import { GoalsTab } from "../components/goals/GoalsTab";
import { Button } from "../components/ui/button";

export default function GoalsPage() {
  const [addGoalOpen, setAddGoalOpen] = useState(false);

  return (
    <div data-ocid="goals.page">
      <div className="flex items-center justify-between gap-2.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
          >
            <Target className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800">Financial Goals</h1>
        </div>
        <Button
          onClick={() => setAddGoalOpen(true)}
          size="sm"
          className="gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow text-xs"
          data-ocid="goals.page.add_button"
        >
          <Plus className="h-3.5 w-3.5" /> Add Goal
        </Button>
      </div>
      <GoalsTab
        externalAddOpen={addGoalOpen}
        onExternalAddOpenChange={setAddGoalOpen}
      />
    </div>
  );
}
