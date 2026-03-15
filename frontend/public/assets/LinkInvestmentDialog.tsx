import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Goal, useGetAllInvestmentsByCategory, useUpdateGoalProgress } from '../../hooks/useQueries';
import { formatCurrency } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface LinkInvestmentDialogProps {
    goal: Goal;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LinkInvestmentDialog({ goal, open, onOpenChange }: LinkInvestmentDialogProps) {
    const [selectedInvestments, setSelectedInvestments] = useState<bigint[]>([]);
    const { data: investments = [], isLoading } = useGetAllInvestmentsByCategory();
    const updateGoal = useUpdateGoalProgress();

    useEffect(() => {
        if (open) {
            setSelectedInvestments(goal.linkedInvestments);
        }
    }, [open, goal.linkedInvestments]);

    const handleToggleInvestment = (investmentId: bigint) => {
        setSelectedInvestments(prev => {
            const exists = prev.some(id => id === investmentId);
            if (exists) {
                return prev.filter(id => id !== investmentId);
            } else {
                return [...prev, investmentId];
            }
        });
    };

    const handleSave = async () => {
        try {
            await updateGoal.mutateAsync({
                goalId: goal.id,
                name: goal.name,
                targetAmount: goal.targetAmount,
                targetDate: goal.targetDate,
                linkedInvestments: selectedInvestments,
                priority: goal.priority,
                inflationRate: goal.inflationRate,
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Error linking investments:', error);
        }
    };

    // Group investments by category
    const groupedInvestments = investments.reduce((acc, inv) => {
        if (!acc[inv.category]) {
            acc[inv.category] = [];
        }
        acc[inv.category].push(inv);
        return acc;
    }, {} as Record<string, typeof investments>);

    // Define category order
    const categoryOrder = [
        'Retiral',
        'Mutual Funds',
        'Equity (ETFs & Stocks)',
        'Fixed Deposits (FDs)',
        'Crypto',
        'Commodity',
        'Real Estate',
        'Other Investments',
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Link Investments to Goal</DialogTitle>
                    <DialogDescription>
                        Select investments to link with "{goal.name}". Progress will be calculated based on the total current value of linked investments.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : investments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No investments available to link. Add investments first.
                        </div>
                    ) : (
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-6">
                                {categoryOrder.map(category => {
                                    const categoryInvestments = groupedInvestments[category];
                                    if (!categoryInvestments || categoryInvestments.length === 0) return null;

                                    return (
                                        <div key={category} className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="font-semibold">
                                                    {category}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    ({categoryInvestments.length} {categoryInvestments.length === 1 ? 'investment' : 'investments'})
                                                </span>
                                            </div>
                                            <div className="space-y-2 pl-2">
                                                {categoryInvestments.map(investment => {
                                                    const isSelected = selectedInvestments.some(id => id === investment.id);
                                                    return (
                                                        <div
                                                            key={investment.id.toString()}
                                                            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                                                            onClick={() => handleToggleInvestment(investment.id)}
                                                        >
                                                            <Checkbox
                                                                id={`investment-${investment.id.toString()}`}
                                                                checked={isSelected}
                                                                onCheckedChange={() => handleToggleInvestment(investment.id)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <Label
                                                                htmlFor={`investment-${investment.id.toString()}`}
                                                                className="flex-1 cursor-pointer"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">{investment.name}</span>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {formatCurrency(investment.currentValue)}
                                                                    </span>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                </div>
                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-muted-foreground">
                            {selectedInvestments.length} {selectedInvestments.length === 1 ? 'investment' : 'investments'} selected
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={updateGoal.isPending}>
                                {updateGoal.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
