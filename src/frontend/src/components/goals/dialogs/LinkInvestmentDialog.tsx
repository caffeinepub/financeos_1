import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCurrency } from "../../../contexts/CurrencyContext";
import {
  type Goal,
  useGetAllInvestmentsByCategory,
  useUpdateGoalProgress,
} from "../../../hooks/useGoals";

interface LinkInvestmentDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ASSET_TYPE_LABELS: Record<string, string> = {
  ETF: "Equity (ETF/Stocks)",
  MutualFund: "Mutual Fund",
  Crypto: "Crypto",
  FixedIncome: "Fixed Income",
  Commodity: "Commodity",
  RealEstate: "Real Estate",
  Other: "Other",
  Retirement: "Retiral",
};

const ASSET_TYPE_ORDER = [
  "Retirement",
  "ETF",
  "MutualFund",
  "FixedIncome",
  "RealEstate",
  "Commodity",
  "Crypto",
  "Other",
];

const ASSET_TYPE_COLORS: Record<string, string> = {
  Retirement: "#6366f1",
  ETF: "#10b981",
  MutualFund: "#22c55e",
  FixedIncome: "#06b6d4",
  RealEstate: "#a855f7",
  Commodity: "#eab308",
  Crypto: "#f97316",
  Other: "#64748b",
};

export function LinkInvestmentDialog({
  goal,
  open,
  onOpenChange,
}: LinkInvestmentDialogProps) {
  const { formatCurrency } = useCurrency();
  const { data: allInvestments = [], isLoading } =
    useGetAllInvestmentsByCategory();
  const updateGoal = useUpdateGoalProgress();

  const [selected, setSelected] = useState<Set<string>>(
    new Set(goal.linkedInvestments),
  );

  useEffect(() => {
    if (open) {
      setSelected(new Set(goal.linkedInvestments));
    }
  }, [open, goal]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await updateGoal.mutateAsync({
        goalId: goal.id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
        priority: goal.priority,
        inflationRate: goal.inflationRate,
        linkedInvestments: Array.from(selected),
        investmentAllocations: {},
      });
      toast.success("Investments linked successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error linking investments:", error);
      toast.error("Failed to link investments");
    }
  };

  // Group investments by asset type
  const grouped = useMemo(() => {
    const groups: Record<string, typeof allInvestments> = {};
    for (const inv of allInvestments) {
      const key = inv.assetType || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(inv);
    }
    return groups;
  }, [allInvestments]);

  const sortedTypes = ASSET_TYPE_ORDER.filter(
    (t) => (grouped[t]?.length ?? 0) > 0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        data-ocid="goals.link_investment.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Link Investments to Goal
          </DialogTitle>
          <DialogDescription>
            Select portfolio investments to link to &ldquo;{goal.name}&rdquo;.
            Their current values will count toward your goal progress.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : allInvestments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No investments found in your portfolio.</p>
            <p className="text-xs mt-1">
              Add investments in the Portfolio module first.
            </p>
          </div>
        ) : sortedTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No investments found to link.</p>
          </div>
        ) : (
          <ScrollArea className="h-72">
            <div className="space-y-4 pr-2">
              {sortedTypes.map((type) => (
                <div key={type}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: ASSET_TYPE_COLORS[type] ?? "#94a3b8",
                      }}
                    />
                    <span
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: ASSET_TYPE_COLORS[type] ?? "#94a3b8" }}
                    >
                      {ASSET_TYPE_LABELS[type] ?? type}
                    </span>
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-[10px] text-slate-400">
                      {grouped[type].length} holding
                      {grouped[type].length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Investments in this group */}
                  <div className="space-y-1.5">
                    {grouped[type].map((inv) => {
                      const isChecked = selected.has(inv.id);

                      return (
                        <button
                          key={inv.id}
                          type="button"
                          className={`flex items-center gap-3 w-full p-2.5 rounded-lg border transition-colors text-left ${
                            isChecked
                              ? "bg-blue-50 border-blue-200"
                              : "border-slate-100 hover:bg-slate-50"
                          }`}
                          onClick={() => toggle(inv.id)}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggle(inv.id)}
                            onClick={(e) => e.stopPropagation()}
                            data-ocid="goals.link.checkbox"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-700 truncate">
                              {inv.name}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Current Value: {formatCurrency(inv.currentValue)}
                            </p>
                          </div>
                          {isChecked && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 flex-shrink-0 text-blue-600 bg-blue-100"
                            >
                              Linked
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="text-xs text-muted-foreground">
          {selected.size} investment{selected.size !== 1 ? "s" : ""} selected
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="goals.link_investment.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateGoal.isPending}
            data-ocid="goals.link_investment.save_button"
          >
            {updateGoal.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Link Investments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
