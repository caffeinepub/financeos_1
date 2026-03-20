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

function getGoalEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("home") || lower.includes("house")) return "\uD83C\uDFE0";
  if (lower.includes("marriage") || lower.includes("wedding"))
    return "\uD83D\uDC8D";
  if (
    lower.includes("education") ||
    lower.includes("school") ||
    lower.includes("college")
  )
    return "\uD83C\uDF93";
  if (lower.includes("retirement") || lower.includes("retir"))
    return "\uD83C\uDF05";
  return "\uD83D\uDCB0";
}

const formatTimeLeft = (months: number): string => {
  if (months <= 0) return "Done";
  const yrs = Math.floor(months / 12);
  const mo = months % 12;
  if (yrs === 0) return `${mo} mo`;
  if (mo === 0) return `${yrs} yr${yrs > 1 ? "s" : ""}`;
  return `${yrs} yr${yrs > 1 ? "s" : ""} ${mo} mo`;
};

export function GoalList({ goals, allInvestments }: GoalListProps) {
  const { formatCurrency } = useCurrency();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [linkingGoal, setLinkingGoal] = useState<Goal | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "On Track" | "Needs Attention" | "Achieved"
  >("All");

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

  const getProgressGradient = (progress: number): string => {
    if (progress >= 80) return "linear-gradient(90deg, #16a34a, #4ade80)";
    if (progress >= 50) return "linear-gradient(90deg, #d97706, #fbbf24)";
    return "linear-gradient(90deg, #dc2626, #f87171)";
  };

  const sortedGoals = useMemo(
    () => [...goals].sort((a, b) => b.targetAmount - a.targetAmount),
    [goals],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: calculateProgress is a stable local function
  const filteredGoals = useMemo(() => {
    return sortedGoals.filter((g) => {
      const p = calculateProgress(g);
      if (statusFilter === "All") return true;
      if (statusFilter === "On Track") return p >= 50 && p < 100;
      if (statusFilter === "Needs Attention") return p < 50;
      if (statusFilter === "Achieved") return p >= 100;
      return true;
    });
  }, [sortedGoals, statusFilter]);

  const renderGoalRow = (goal: Goal, idx: number, isAchievedRow = false) => {
    const targetDate = new Date(Number(goal.targetDate) / 1000000);
    const progress = calculateProgress(goal);
    const currentAmount = calculateCurrentAmount(goal);
    const monthsLeft = calculateMonthsLeft(goal);
    const amountNeeded = Math.max(0, goal.targetAmount - currentAmount);
    const sipPerMonth = monthsLeft > 0 ? amountNeeded / monthsLeft : 0;
    const emoji = getGoalEmoji(goal.name);

    const linkedInvestmentNames = goal.linkedInvestments
      .map((id) => investmentMap.get(id))
      .filter(Boolean) as string[];

    return (
      <TableRow
        key={goal.id}
        data-ocid={`goals.item.${idx + 1}`}
        className="hover:bg-slate-50 transition-colors"
      >
        <TableCell className="font-medium text-xs py-2.5 text-slate-800">
          <span className="flex items-center gap-1.5">
            <span>{emoji}</span>
            {isAchievedRow && (
              <span className="text-emerald-600 font-bold">✓</span>
            )}
            {goal.name}
          </span>
        </TableCell>
        <TableCell className="text-right text-xs py-2.5 font-semibold text-slate-700">
          {formatCurrency(goal.targetAmount)}
        </TableCell>
        <TableCell
          className={`text-right font-bold text-xs py-2.5 ${
            currentAmount > goal.targetAmount
              ? "text-green-600"
              : "text-blue-600"
          }`}
        >
          {formatCurrency(currentAmount)}
        </TableCell>
        <TableCell className="py-2.5">
          {linkedInvestmentNames.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-wrap gap-1 cursor-help">
                    {linkedInvestmentNames.slice(0, 3).map((name) => (
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
                      Linked Investments
                    </p>
                    {linkedInvestmentNames.map((name) => (
                      <p key={name} className="text-xs">
                        • {name}
                      </p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </TableCell>
        {/* Goal Date — just before Months */}
        <TableCell className="text-xs py-2.5 text-slate-600">
          {targetDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })}
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
            className="text-xs px-1.5 py-0 whitespace-nowrap"
          >
            {formatTimeLeft(monthsLeft)}
          </Badge>
        </TableCell>
        <TableCell className="py-2.5">
          <div className="space-y-0.5 text-xs">
            <div className="text-slate-500">
              <span className="font-medium text-slate-600">Need:</span>{" "}
              {formatCurrency(amountNeeded)}
            </div>
            <div className="text-indigo-600 font-semibold">
              <span className="font-medium">SIP:</span>{" "}
              {monthsLeft > 0 ? formatCurrency(sipPerMonth) : "N/A"}
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
                  progress >= 100
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {progress >= 100 ? "✓ Done" : "In Progress"}
              </Badge>
            </div>
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
  };

  const tableHeader = (
    <TableHeader>
      <TableRow className="bg-slate-800 hover:bg-slate-800">
        <TableHead className="text-white text-xs font-semibold w-[120px] min-w-[120px]">
          Goal Name
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
        <TableHead className="text-white text-xs font-semibold w-[90px] min-w-[90px]">
          Goal Date
        </TableHead>
        <TableHead className="text-white text-xs font-semibold text-center w-[90px] min-w-[90px]">
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
  );

  return (
    <>
      <div className="w-full relative">
        {/* Filter chips */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {(["All", "On Track", "Needs Attention", "Achieved"] as const).map(
            (f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                data-ocid={`goals.filter.${f.toLowerCase().replace(" ", "_")}.toggle`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  statusFilter === f
                    ? f === "Achieved"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : f === "On Track"
                        ? "bg-blue-600 text-white border-blue-600"
                        : f === "Needs Attention"
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                {f}
              </button>
            ),
          )}
        </div>

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
            <Table>
              {tableHeader}
              <TableBody>
                {filteredGoals.map((goal, idx) =>
                  renderGoalRow(goal, idx, calculateProgress(goal) >= 100),
                )}
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
