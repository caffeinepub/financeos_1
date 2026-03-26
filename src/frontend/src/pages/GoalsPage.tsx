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

      {/* Tab pills */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          data-ocid="goals.track.tab"
          onClick={() => setActiveTab("track")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "track"
              ? "bg-emerald-600 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Track Goals
        </button>
        <button
          type="button"
          data-ocid="goals.plan.tab"
          onClick={() => setActiveTab("plan")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "plan"
              ? "bg-emerald-600 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Plan Goals
        </button>
      </div>

      {activeTab === "track" && (
        <GoalsTab
          externalAddOpen={addGoalOpen}
          onExternalAddOpenChange={setAddGoalOpen}
        />
      )}

      {activeTab === "plan" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <ModelGoalPlanningTab />
        </div>
      )}
    </div>
  );
}
