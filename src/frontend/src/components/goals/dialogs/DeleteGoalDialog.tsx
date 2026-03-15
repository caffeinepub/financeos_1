import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Goal, useDeleteGoal } from "../../../hooks/useGoals";

interface DeleteGoalDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteGoalDialog({
  goal,
  open,
  onOpenChange,
}: DeleteGoalDialogProps) {
  const deleteGoalMutation = useDeleteGoal();

  const handleDelete = async () => {
    try {
      await deleteGoalMutation.mutateAsync(goal.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-ocid="goals.delete_goal.dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Goal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{goal.name}"? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-ocid="goals.delete_goal.cancel_button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteGoalMutation.isPending}
            data-ocid="goals.delete_goal.confirm_button"
          >
            {deleteGoalMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
