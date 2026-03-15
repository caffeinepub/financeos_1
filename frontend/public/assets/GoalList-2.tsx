import { useState, useMemo } from 'react';
import { Goal, useGetAllInvestmentsByCategory } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Trash2, Link as LinkIcon } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { EditGoalDialog } from './dialogs/EditGoalDialog';
import { DeleteGoalDialog } from './dialogs/DeleteGoalDialog';
import { LinkInvestmentDialog } from './dialogs/LinkInvestmentDialog';

interface GoalListProps {
    goals: Goal[];
}

export function GoalList({ goals }: GoalListProps) {
    const { formatCurrency } = useCurrency();
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
    const [linkingGoal, setLinkingGoal] = useState<Goal | null>(null);
    const { data: allInvestments = [] } = useGetAllInvestmentsByCategory();

    // Create a map of investment IDs to names for quick lookup
    const investmentMap = useMemo(() => {
        const map = new Map<string, string>();
        allInvestments.forEach(inv => {
            map.set(inv.id.toString(), inv.name);
        });
        return map;
    }, [allInvestments]);

    // Calculate current amount from linked investments
    const calculateCurrentAmount = (goal: Goal): number => {
        if (goal.linkedInvestments.length === 0) return 0;
        
        return goal.linkedInvestments.reduce((sum, invId) => {
            const investment = allInvestments.find(inv => inv.id === invId);
            return sum + (investment?.currentValue || 0);
        }, 0);
    };

    // Calculate months left until target date
    const calculateMonthsLeft = (goal: Goal): number => {
        const now = new Date();
        const targetDate = new Date(Number(goal.targetDate) / 1000000);
        
        const yearsDiff = targetDate.getFullYear() - now.getFullYear();
        const monthsDiff = targetDate.getMonth() - now.getMonth();
        
        const totalMonths = yearsDiff * 12 + monthsDiff;
        return Math.max(0, totalMonths);
    };

    // Calculate progress based on linked investments
    const calculateProgress = (goal: Goal): number => {
        if (goal.linkedInvestments.length === 0) return 0;
        
        const currentAmount = calculateCurrentAmount(goal);
        return goal.targetAmount > 0 ? (currentAmount / goal.targetAmount) * 100 : 0;
    };

    // Calculate status text
    const calculateStatus = (goal: Goal): string => {
        const progress = calculateProgress(goal);
        if (progress >= 100) {
            return 'Goal Achieved';
        }
        return `${progress.toFixed(1)}% Goal Achieved`;
    };

    // Get progress bar color based on percentage
    const getProgressBarColor = (progress: number): string => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <>
            {/* Enhanced mobile-optimized horizontal scrollable container with always-visible scrollbar */}
            <div className="w-full relative">
                <div className="goals-table-scroll-wrapper overflow-x-auto overflow-y-visible pb-4">
                    <div className="inline-block min-w-full align-middle">
                        <div className="goals-table-inner" style={{ minWidth: '1200px' }}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px] min-w-[120px]">Goal Name</TableHead>
                                        <TableHead className="text-right w-[100px] min-w-[100px]">Target</TableHead>
                                        <TableHead className="w-[90px] min-w-[90px]">Date</TableHead>
                                        <TableHead className="w-[60px] min-w-[60px]">Priority</TableHead>
                                        <TableHead className="w-[200px] min-w-[200px]">Linked Inv.</TableHead>
                                        <TableHead className="text-right w-[100px] min-w-[100px]">Current</TableHead>
                                        <TableHead className="text-center w-[70px] min-w-[70px]">Months</TableHead>
                                        <TableHead className="w-[120px] min-w-[120px]">Advise</TableHead>
                                        <TableHead className="w-[180px] min-w-[180px]">Progress</TableHead>
                                        <TableHead className="text-right w-[100px] min-w-[100px] pr-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {goals.map((goal) => {
                                        const targetDate = new Date(Number(goal.targetDate) / 1000000);
                                        const progress = calculateProgress(goal);
                                        const currentAmount = calculateCurrentAmount(goal);
                                        const monthsLeft = calculateMonthsLeft(goal);
                                        const amountNeeded = Math.max(0, goal.targetAmount - currentAmount);
                                        const sipPerMonth = monthsLeft > 0 ? amountNeeded / monthsLeft : 0;
                                        const status = calculateStatus(goal);
                                        const isAchieved = progress >= 100;
                                        const progressBarColor = getProgressBarColor(progress);
                                        
                                        const linkedInvestmentNames = goal.linkedInvestments
                                            .map(id => investmentMap.get(id.toString()))
                                            .filter(Boolean);
                                        
                                        return (
                                            <TableRow key={goal.id.toString()}>
                                                <TableCell className="font-medium text-xs py-2">{goal.name}</TableCell>
                                                <TableCell className="text-right text-xs py-2">{formatCurrency(goal.targetAmount)}</TableCell>
                                                <TableCell className="text-xs py-2">{targetDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</TableCell>
                                                <TableCell className="py-2">
                                                    <Badge variant="outline" className="text-xs px-1.5 py-0">P{goal.priority.toString()}</Badge>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    {linkedInvestmentNames.length > 0 ? (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex flex-wrap gap-1 cursor-help">
                                                                        {linkedInvestmentNames.slice(0, 3).map((name, idx) => (
                                                                            <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
                                                                                {name && name.length > 12 ? name.substring(0, 12) + '...' : name}
                                                                            </Badge>
                                                                        ))}
                                                                        {linkedInvestmentNames.length > 3 && (
                                                                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                                                                +{linkedInvestmentNames.length - 3}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="max-w-xs">
                                                                    <div className="space-y-1">
                                                                        <p className="font-semibold text-xs mb-2">Linked Investments:</p>
                                                                        {linkedInvestmentNames.map((name, idx) => (
                                                                            <p key={idx} className="text-xs">• {name}</p>
                                                                        ))}
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">None</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-blue-600 dark:text-blue-400 text-xs py-2">
                                                    {formatCurrency(currentAmount)}
                                                </TableCell>
                                                <TableCell className="text-center py-2">
                                                    <Badge variant={monthsLeft > 12 ? "default" : monthsLeft > 6 ? "secondary" : "destructive"} className="text-xs px-1.5 py-0">
                                                        {monthsLeft}m
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <div className="space-y-0.5 text-xs">
                                                        <div className="text-muted-foreground">
                                                            <span className="font-medium">Need:</span> {formatCurrency(amountNeeded)}
                                                        </div>
                                                        <div className="text-primary font-semibold">
                                                            <span className="font-medium">SIP:</span> {monthsLeft > 0 ? formatCurrency(sipPerMonth) : 'N/A'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-xs font-medium">{progress.toFixed(1)}%</span>
                                                            <Badge 
                                                                variant={isAchieved ? "default" : "secondary"} 
                                                                className={`text-xs px-2 py-0.5 ${isAchieved ? 'bg-green-600 text-white' : ''}`}
                                                            >
                                                                {isAchieved ? '✓ Achieved' : 'In Progress'}
                                                            </Badge>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
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
                                                        >
                                                            <LinkIcon className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => setEditingGoal(goal)}
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => setDeletingGoal(goal)}
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
                </div>
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
