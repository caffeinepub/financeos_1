import { useGetMonthlyExpenseSummary } from "../../hooks/useQueries";
import { Alert, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { ExpensesTab } from "./ExpensesTab";

export function BudgetingTab() {
  const currentYear = new Date().getFullYear();

  const { isLoading, isError, error } = useGetMonthlyExpenseSummary(
    BigInt(currentYear),
  );

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="budgeting.loading_state">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" data-ocid="budgeting.error_state">
          <AlertDescription>
            Failed to load budgeting data:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
        <ExpensesTab />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ExpensesTab />
    </div>
  );
}
