import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateGoal } from '../../hooks/useQueries';
import { useCurrency } from '../../contexts/CurrencyContext';
import { toast } from 'sonner';

interface AddGoalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddGoalDialog({ open, onOpenChange }: AddGoalDialogProps) {
    const { country } = useCurrency();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [priority, setPriority] = useState('1');
    const [inflationRate, setInflationRate] = useState('6');

    const createGoal = useCreateGoal();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !targetAmount || !targetDate || !priority || !inflationRate) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const date = new Date(targetDate);
            await createGoal.mutateAsync({
                name,
                targetAmount: parseFloat(targetAmount),
                targetDate: BigInt(date.getTime() * 1000000),
                priority: BigInt(priority),
                inflationRate: parseFloat(inflationRate),
            });
            toast.success('Goal added successfully');
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            console.error('Error adding goal:', error);
            toast.error(error?.message || 'Failed to add goal');
        }
    };

    const resetForm = () => {
        setName('');
        setTargetAmount('');
        setTargetDate('');
        setPriority('1');
        setInflationRate('6');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                    <DialogDescription>
                        Set a new financial goal to track your progress
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="goalName">Goal Name</Label>
                        <Input
                            id="goalName"
                            placeholder="e.g., House Down Payment"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="targetAmount">Target Amount ({country.symbol})</Label>
                            <Input
                                id="targetAmount"
                                type="number"
                                step="0.01"
                                placeholder="1000000"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetDate">Target Date</Label>
                            <Input
                                id="targetDate"
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger id="priority">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="inflationRate">Goal Inflation (%)</Label>
                            <Input
                                id="inflationRate"
                                type="number"
                                step="0.1"
                                placeholder="6.0"
                                value={inflationRate}
                                onChange={(e) => setInflationRate(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createGoal.isPending}>
                            {createGoal.isPending ? 'Adding...' : 'Add Goal'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
