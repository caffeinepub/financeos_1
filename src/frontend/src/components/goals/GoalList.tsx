import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link as LinkIcon, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrency } from "../../contexts/CurrencyContext";
import {
  type Goal,
  useGetAllInvestmentsByCategory,
} from "../../hooks/useGoals";
import { DeleteGoalDialog } from "./dialogs/DeleteGoalDialog";
import { EditGoalDialog } from "./dialogs/EditGoalDialog";
import { LinkInvestmentDialog } from "./dialogs/LinkInvestmentDialog";

interface GoalListProps {
  goals: Goal[];
}

export function GoalList({ goals }: GoalListProps) {
  const { formatCurrency } = useCurrency();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [linkingGoal, setLinkingGoal] = useState<Goal | null>(null);
  const { data: allInvestments = [] } = useGetAllInvestmentsByCategory();

  const investmentMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const inv of allInvestments) {
      map.set(inv.id.toString(), inv.name);
    }
    return map;
  }, [allInvestments]);

  const calculateCurrentAmount = (goal: Goal): number => {
    if (goal.linkedInvestments.length === 0) return 0;
    return goal.linkedInvestments.reduce((sum, invId) => {
      const investment = allInvestments.find((inv) => inv.id === invId);
      return sum + (investment?.currentValue || 0);
    }, 0);
  };

  const calculateMonthsLeft = (goal: Goal): number => {
    const now = new Date();
    const targetDate = new Date(Number(goal.targetDate) / 1000000);
    const yearsDiff = targetDate.getFullYear() - now.getFullYear();
    const monthsDiff = targetDate.getMonth() - now.getMonth();
    return Math.max(0, yearsDiff * 12 + monthsDiff);
  };

  const calculateProgress = (goal: Goal): number => {
    if (goal.linkedInvestments.length === 0) return 0;
    const currentAmount = calculateCurrentAmount(goal);
    return goal.targetAmount > 0
      ? (currentAmount / goal.targetAmount) * 100
      : 0;
  };

  const getProgressBarColor = (progress: number): string => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <div className="w-full relative">
        {/* rotateX(180deg) flip trick: scrollbar appears at the BOTTOM on all browsers including mobile Safari */}
        <div
          style={
            {
              transform: "rotateX(180deg)",
              overflowX: "auto",
              overflowY: "visible",
              paddingBottom: "12px",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#94a3b8 #f1f5f9",
            } as React.CSSProperties
          }
        >
          <div style={{ transform: "rotateX(180deg)", minWidth: "1100px" }}>
            <Table data-ocid="goals.table">
              <TableHeader>
                <TableRow className="bg-slate-700 hover:bg-slate-700">
                  <TableHead className="text-white w-[120px] min-w-[120px]">
                    Goal Name
                  </TableHead>
                  <TableHead className="text-white text-right w-[100px] min-w-[100px]">
                    Target
                  </TableHead>
                  <TableHead className="text-white w-[90px] min-w-[90px]">
                    Date
                  </TableHead>
                  <TableHead className="text-white w-[60px] min-w-[60px]">
                    Priority
                  </TableHead>
                  <TableHead className="text-white w-[200px] min-w-[200px]">
                    Linked Inv.
                  </TableHead>
                  <TableHead className="text-white text-right w-[100px] min-w-[100px]">
                    Current
                  </TableHead>
                  <TableHead className="text-white text-center w-[70px] min-w-[70px]">
                    Months
                  </TableHead>
                  <TableHead className="text-white w-[120px] min-w-[120px]">
                    Advise
                  </TableHead>
                  <TableHead className="text-white w-[180px] min-w-[180px]">
                    Progress
                  </TableHead>
                  <TableHead className="text-white text-right w-[100px] min-w-[100px] pr-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goals.map((goal, idx) => {
                  const targetDate = new Date(
                    Number(goal.targetDate) / 1000000,
                  );
                  const progress = calculateProgress(goal);
                  const currentAmount = calculateCurrentAmount(goal);
                  const monthsLeft = calculateMonthsLeft(goal);
                  const amountNeeded = Math.max(
                    0,
                    goal.targetAmount - currentAmount,
                  );
                  const sipPerMonth =
                    monthsLeft > 0 ? amountNeeded / monthsLeft : 0;
                  const isAchieved = progress >= 100;
                  const progressBarColor = getProgressBarColor(progress);

                  const linkedInvestmentNames = goal.linkedInvestments
                    .map((id) => investmentMap.get(id.toString()))
                    .filter(Boolean);

                  return (
                    <TableRow key={goal.id} data-ocid={`goals.row.${idx + 1}`}>
                      <TableCell className="font-medium text-xs py-2">
                        {goal.name}
                      </TableCell>
                      <TableCell className="text-right text-xs py-2">
                        {formatCurrency(goal.targetAmount)}
                      </TableCell>
                      <TableCell className="text-xs py-2">
                        {targetDate.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          P{goal.priority.toString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        {linkedInvestmentNames.length > 0 ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex flex-wrap gap-1 cursor-help">
                                  {linkedInvestmentNames
                                    .slice(0, 3)
                                    .map((name, i) => (
                                      <Badge
                                        key={name || String(i)}
                                        variant="secondary"
                                        className="text-xs px-1.5 py-0"
                                      >
                                        {name && name.length > 12
                                          ? `${name.substring(0, 12)}...`
                                          : name}
                                      </Badge>
                                    ))}
                                  {linkedInvestmentNames.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-1.5 py-0"
                                    >
                                      +{linkedInvestmentNames.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-semibold text-xs mb-2">
                                    Linked Investments:
                                  </p>
                                  {linkedInvestmentNames.map((name, i) => (
                                    <p
                                      key={name || String(i)}
                                      className="text-xs"
                                    >
                                      • {name}
                                    </p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-blue-600 text-xs py-2">
                        {formatCurrency(currentAmount)}
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <Badge
                          variant={
                            monthsLeft > 12
                              ? "default"
                              : monthsLeft > 6
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs px-1.5 py-0"
                        >
                          {monthsLeft}m
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="space-y-0.5 text-xs">
                          <div className="text-muted-foreground">
                            <span className="font-medium">Need:</span>{" "}
                            {formatCurrency(amountNeeded)}
                          </div>
                          <div className="text-primary font-semibold">
                            <span className="font-medium">SIP:</span>{" "}
                            {monthsLeft > 0
                              ? formatCurrency(sipPerMonth)
                              : "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium">
                              {progress.toFixed(1)}%
                            </span>
                            <Badge
                              variant={isAchieved ? "default" : "secondary"}
                              className={`text-xs px-2 py-0.5 ${isAchieved ? "bg-green-600 text-white" : ""}`}
                            >
                              {isAchieved ? "✓ Achieved" : "In Progress"}
                            </Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${progressBarColor}`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 pr-4">
                        <div className="flex justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setLinkingGoal(goal)}
                            data-ocid={`goals.link_button.${idx + 1}`}
                          >
                            <LinkIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditingGoal(goal)}
                            data-ocid={`goals.edit_button.${idx + 1}`}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setDeletingGoal(goal)}
                            data-ocid={`goals.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 sm:hidden text-center">
          ← Scroll to see more →
        </p>
      </div>

      {editingGoal && (
        <EditGoalDialog
          goal={editingGoal}
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
        />
      )}
      {deletingGoal && (
        <DeleteGoalDialog
          goal={deletingGoal}
          open={!!deletingGoal}
          onOpenChange={(open) => !open && setDeletingGoal(null)}
        />
      )}
      {linkingGoal && (
        <LinkInvestmentDialog
          goal={linkingGoal}
          open={!!linkingGoal}
          onOpenChange={(open) => !open && setLinkingGoal(null)}
        />
      )}
    </>
  );
}
