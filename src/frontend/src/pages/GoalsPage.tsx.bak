import { Plus, Target } from "lucide-react";
import { useState } from "react";
import { ModelGoalPlanningTab } from "../components/financial-model/ModelGoalPlanningTab";
import { GoalsTab } from "../components/goals/GoalsTab";
import { Button } from "../components/ui/button";

export default function GoalsPage() {
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"track" | "plan">("track");

  return (
    <div data-ocid="goals.page">
      {/* Header row with title + Add Goal */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
          >
            <Target className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Financial Goals
          </h1>
        </div>
        {activeTab === "track" && (
          <Button
            onClick={() => setAddGoalOpen(true)}
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow text-xs"
            data-ocid="goals.page.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Goal
          </Button>
        )}
      </div>

      {/* Tab navigation row */}
      <div className="overflow-x-auto pb-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-2 mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            data-ocid="goals.track.tab"
            onClick={() => setActiveTab("track")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap ${
              activeTab === "track"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            Track Goals
          </button>
          <button
            type="button"
            data-ocid="goals.plan.tab"
            onClick={() => setActiveTab("plan")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap ${
              activeTab === "plan"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            Plan Goals
          </button>
        </div>
      </div>

      {activeTab === "track" && (
        <GoalsTab
          externalAddOpen={addGoalOpen}
          onExternalAddOpenChange={setAddGoalOpen}
        />
      )}

      {activeTab === "plan" && <ModelGoalPlanningTab />}
    </div>
  );
}
