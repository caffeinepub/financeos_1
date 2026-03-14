import { useEffect, useState } from "react";
import { type Transaction, TransactionType } from "../backend.d";
import { useActor } from "./useActor";

export interface MonthlyExpenseSummary {
  month: number;
  year: number;
  totalExpenses: number;
  totalIncome: number;
  transactions: Transaction[];
}

export function useGetMonthlyExpenseSummary(year: bigint) {
  const { actor } = useActor();
  const [data, setData] = useState<MonthlyExpenseSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!actor) return;
    setIsLoading(true);
    setIsError(false);
    actor
      .getAllTransactions()
      .then((txns: Transaction[]) => {
        const yearNum = Number(year);
        const filtered = txns.filter((t) => {
          const txYear = new Date(t.date).getFullYear();
          return txYear === yearNum;
        });

        const monthMap = new Map<number, MonthlyExpenseSummary>();
        for (let m = 1; m <= 12; m++) {
          monthMap.set(m, {
            month: m,
            year: yearNum,
            totalExpenses: 0,
            totalIncome: 0,
            transactions: [],
          });
        }

        for (const t of filtered) {
          const month = new Date(t.date).getMonth() + 1;
          const entry = monthMap.get(month)!;
          entry.transactions.push(t);
          if (t.transactionType === TransactionType.Expense) {
            entry.totalExpenses += t.amount;
          } else {
            entry.totalIncome += t.amount;
          }
        }

        setData(Array.from(monthMap.values()));
      })
      .catch((err: unknown) => {
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, [actor, year]);

  return { data, isLoading, isError, error };
}
