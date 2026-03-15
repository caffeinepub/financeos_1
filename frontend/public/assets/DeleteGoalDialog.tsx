import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDeleteGoal, Goal } from '../../hooks/useQueries';

interface DeleteGoalDialogProps {
    goal: Goal;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteGoalDialog({ goal, open, onOpenChange }: DeleteGoalDialogProps) {
    const deleteGoalMutation = useDeleteGoal();

    const handleDelete = async () => {
        try {
            await deleteGoalMutation.mutateAsync(goal.id);
            onOpenChange(false);
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{goal.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleteGoalMutation.isPending}
                    >
                        {deleteGoalMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
