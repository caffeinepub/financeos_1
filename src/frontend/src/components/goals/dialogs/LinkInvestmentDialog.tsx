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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

export function LinkInvestmentDialog({
  goal,
  open,
  onOpenChange,
}: LinkInvestmentDialogProps) {
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
  }, [open, goal.linkedInvestments]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
      });
      toast.success("Investments linked successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error linking investments:", error);
      toast.error("Failed to link investments");
    }
  };

  const assetTypeLabel: Record<string, string> = {
    ETF: "Equity (ETF/Stocks)",
    MutualFund: "Mutual Fund",
    Crypto: "Crypto",
    FixedIncome: "Fixed Deposit",
    Commodity: "Commodity",
    RealEstate: "Real Estate",
    Other: "Other",
    Retirement: "Retiral",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg"
        data-ocid="goals.link_investment.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Link Investments to Goal
          </DialogTitle>
          <DialogDescription>
            Select portfolio investments to link to "{goal.name}". Their current
            values will count toward your goal progress.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
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
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {allInvestments.map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer text-left"
                  onClick={() => toggle(inv.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selected.has(inv.id)}
                      onCheckedChange={() => toggle(inv.id)}
                      onClick={(e) => e.stopPropagation()}
                      data-ocid="goals.link.checkbox"
                    />
                    <div>
                      <Label className="cursor-pointer font-medium text-sm">
                        {inv.name}
                      </Label>
                      {inv.assetType && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {assetTypeLabel[inv.assetType] || inv.assetType}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    ₹{inv.currentValue.toLocaleString("en-IN")}
                  </span>
                </button>
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
            Save Links
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
