import { LayoutGrid, LayoutList, Plus, Target } from "lucide-react";
import { useState } from "react";
import { ModelGoalPlanningTab } from "../components/financial-model/ModelGoalPlanningTab";
import { GoalsTab } from "../components/goals/GoalsTab";
import { Button } from "../components/ui/button";

export default function GoalsPage() {
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"track" | "plan">("track");

  return (
    <div data-ocid="goals.page">
      {/* Header row with title + tabs + Add Goal */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
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
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-0.5 gap-0.5">
            <button
              type="button"
              data-ocid="goals.track.tab"
              onClick={() => setActiveTab("track")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "track"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="inline w-3 h-3 mr-1" />
              Track
            </button>
            <button
              type="button"
              data-ocid="goals.plan.tab"
              onClick={() => setActiveTab("plan")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "plan"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <LayoutList className="inline w-3 h-3 mr-1" />
              Plan
            </button>
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
      </div>

      {activeTab === "track" && (
        <GoalsTab
          externalAddOpen={addGoalOpen}
          onExternalAddOpenChange={setAddGoalOpen}
        />
      )}

      {activeTab === "plan" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
          <ModelGoalPlanningTab />
        </div>
      )}
    </div>
  );
}
