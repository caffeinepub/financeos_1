import { useEffect, useState } from "react";
import { useActor } from "../../hooks/useActor";
import type { BudgetCategory, Transaction } from "../../types";
import { Alert, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { ExpensesTab } from "./ExpensesTab";

/**
 * Standalone wrapper for ExpensesTab that fetches its own data.
 * Used when ExpensesTab is rendered outside of BudgetingPage (which lifts state).
 */
export function BudgetingTab() {
  const { actor } = useActor();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    setError(null);
    Promise.all([actor.getAllTransactions(), actor.getAllBudgetCategories()])
      .then(([txns, cats]) => {
        setTransactions([...txns].sort((a, b) => b.date.localeCompare(a.date)));
        setCategories(cats);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, [actor]);

  if (loading) {
    return (
      <div className="space-y-4" data-ocid="budgeting.loading_state">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" data-ocid="budgeting.error_state">
        <AlertDescription>
          Failed to load budgeting data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <ExpensesTab
        categories={categories}
        transactions={transactions}
        loading={loading}
        onAddTransaction={(tx) =>
          setTransactions((prev) =>
            [tx, ...prev].sort((a, b) => b.date.localeCompare(a.date)),
          )
        }
        onUpdateTransaction={(tx) =>
          setTransactions((prev) => prev.map((t) => (t.id === tx.id ? tx : t)))
        }
        onDeleteTransaction={(id) =>
          setTransactions((prev) => prev.filter((t) => t.id !== id))
        }
      />
    </div>
  );
}
