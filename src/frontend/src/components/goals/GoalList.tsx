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
import type { Goal, Investment } from "../../hooks/useGoals";
import { DeleteGoalDialog } from "./dialogs/DeleteGoalDialog";
import { EditGoalDialog } from "./dialogs/EditGoalDialog";
import { LinkInvestmentDialog } from "./dialogs/LinkInvestmentDialog";

interface GoalListProps {
  goals: Goal[];
  allInvestments: Investment[];
}

export function GoalList({ goals, allInvestments }: GoalListProps) {
  const { formatCurrency } = useCurrency();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [linkingGoal, setLinkingGoal] = useState<Goal | null>(null);

  const investmentMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const inv of allInvestments) map.set(inv.id, inv.name);
    return map;
  }, [allInvestments]);

  const calculateCurrentAmount = (goal: Goal): number => {
    if (goal.linkedInvestments.length === 0) return 0;
    return goal.linkedInvestments.reduce((sum, invId) => {
      const investment = allInvestments.find((inv) => inv.id === invId);
      return sum + (investment?.currentValue ?? 0);
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

  const getPriorityBadgeStyle = (
    priority: bigint | number,
  ): { bg: string; text: string; label: string } => {
    const p = Number(priority);
    if (p === 1) return { bg: "#fef2f2", text: "#dc2626", label: "P1" };
    if (p === 2) return { bg: "#fffbeb", text: "#d97706", label: "P2" };
    return { bg: "#f0fdf4", text: "#16a34a", label: `P${p}` };
  };

  const getProgressGradient = (progress: number): string => {
    if (progress >= 80) return "linear-gradient(90deg, #16a34a, #4ade80)";
    if (progress >= 50) return "linear-gradient(90deg, #d97706, #fbbf24)";
    return "linear-gradient(90deg, #dc2626, #f87171)";
  };

  return (
    <>
      <div className="w-full relative">
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
          <div style={{ transform: "rotateX(180deg)", minWidth: "1200px" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800 hover:bg-slate-800">
                  <TableHead className="text-white text-xs font-semibold w-[60px] min-w-[60px]">
                    Priority
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold w-[120px] min-w-[120px]">
                    Goal Name
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold w-[90px] min-w-[90px]">
                    Goal Date
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold text-right w-[100px] min-w-[100px]">
                    Target
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold text-right w-[100px] min-w-[100px]">
                    Current
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold w-[200px] min-w-[200px]">
                    Linked Inv.
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold text-center w-[70px] min-w-[70px]">
                    Months
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold w-[120px] min-w-[120px]">
                    Advise
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold w-[180px] min-w-[180px]">
                    Progress
                  </TableHead>
                  <TableHead className="text-white text-xs font-semibold text-right w-[100px] min-w-[100px] pr-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...goals]
                  .sort((a, b) => b.targetAmount - a.targetAmount)
                  .map((goal, idx) => {
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
                    const priorityStyle = getPriorityBadgeStyle(goal.priority);

                    const linkedInvestmentNames = goal.linkedInvestments
                      .map((id) => investmentMap.get(id))
                      .filter(Boolean) as string[];

                    return (
                      <TableRow
                        key={goal.id}
                        data-ocid={`goals.item.${idx + 1}`}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="py-2.5">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              background: priorityStyle.bg,
                              color: priorityStyle.text,
                            }}
                          >
                            {priorityStyle.label}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-xs py-2.5 text-slate-800">
                          {goal.name}
                        </TableCell>
                        <TableCell className="text-xs py-2.5 text-slate-600">
                          {targetDate.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right text-xs py-2.5 font-semibold text-slate-700">
                          {formatCurrency(goal.targetAmount)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-blue-600 text-xs py-2.5">
                          {formatCurrency(currentAmount)}
                        </TableCell>
                        <TableCell className="py-2.5">
                          {linkedInvestmentNames.length > 0 ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex flex-wrap gap-1 cursor-help">
                                    {linkedInvestmentNames
                                      .slice(0, 3)
                                      .map((name) => (
                                        <Badge
                                          key={name}
                                          variant="secondary"
                                          className="text-xs px-1.5 py-0"
                                        >
                                          {name.length > 12
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
                                    <p className="font-semibold text-xs mb-1">
                                      Linked Investments:
                                    </p>
                                    {linkedInvestmentNames.map((name) => (
                                      <p
                                        key={`linked-${name}`}
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
                            <span className="text-xs text-slate-400">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center py-2.5">
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
                        <TableCell className="py-2.5">
                          <div className="space-y-0.5 text-xs">
                            <div className="text-slate-500">
                              <span className="font-medium text-slate-600">
                                Need:
                              </span>{" "}
                              {formatCurrency(amountNeeded)}
                            </div>
                            <div className="text-indigo-600 font-semibold">
                              <span className="font-medium">SIP:</span>{" "}
                              {monthsLeft > 0
                                ? formatCurrency(sipPerMonth)
                                : "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-700">
                                {progress.toFixed(1)}%
                              </span>
                              <Badge
                                className={`text-xs px-2 py-0.5 font-semibold ${
                                  isAchieved
                                    ? "bg-green-100 text-green-700 border border-green-200"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {isAchieved ? "✓ Done" : "In Progress"}
                              </Badge>
                            </div>
                            {/* Taller pill-shaped gradient progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(progress, 100)}%`,
                                  background: getProgressGradient(progress),
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2.5 pr-4">
                          <div className="flex justify-end gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => setLinkingGoal(goal)}
                              data-ocid={`goals.link.button.${idx + 1}`}
                            >
                              <LinkIcon className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                              onClick={() => setEditingGoal(goal)}
                              data-ocid={`goals.edit_button.${idx + 1}`}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
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
        {/* Mobile scroll hint */}
        <p className="text-[10px] text-slate-400 text-center mt-1 sm:hidden">
          ← Scroll table to see more →
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
