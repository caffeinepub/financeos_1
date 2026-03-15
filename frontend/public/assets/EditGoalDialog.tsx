import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Goal, useUpdateGoalProgress } from '../../hooks/useQueries';
import { useCurrency } from '../../contexts/CurrencyContext';
import { Loader2 } from 'lucide-react';

interface EditGoalDialogProps {
    goal: Goal;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditGoalDialog({ goal, open, onOpenChange }: EditGoalDialogProps) {
    const { country } = useCurrency();
    const [targetAmount, setTargetAmount] = useState(goal.targetAmount.toString());
    const updateGoal = useUpdateGoalProgress();

    useEffect(() => {
        if (open) {
            setTargetAmount(goal.targetAmount.toString());
        }
    }, [goal, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!targetAmount) {
            return;
        }

        const targetAmountNum = parseFloat(targetAmount);

        if (targetAmountNum <= 0) {
            return;
        }

        try {
            await updateGoal.mutateAsync({
                goalId: goal.id,
                name: goal.name,
                targetAmount: targetAmountNum,
                targetDate: goal.targetDate,
                linkedInvestments: goal.linkedInvestments,
                priority: goal.priority,
                inflationRate: goal.inflationRate,
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                    <DialogDescription>
                        Update the target amount for {goal.name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Goal Name</Label>
                            <div className="text-sm font-medium">{goal.name}</div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="targetAmount">Target Amount ({country.symbol}) *</Label>
                            <Input
                                id="targetAmount"
                                type="number"
                                step="0.01"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateGoal.isPending}>
                            {updateGoal.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
