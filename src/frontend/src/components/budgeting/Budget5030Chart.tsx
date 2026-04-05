import { Badge } from "../ui/badge";

interface Budget5030ChartProps {
  income: number;
  expenses: number;
  needs50: number;
  wants30: number;
  savings20: number;
  savings: number;
  savingsRate: number;
  formatCurrency: (n: number) => string;
}

export function Budget5030Chart({
  income,
  expenses,
  needs50,
  wants30,
  savings20,
  savings,
  savingsRate,
  formatCurrency,
}: Budget5030ChartProps) {
  if (income <= 0)
    return (
      <div className="h-40 flex items-center justify-center text-sm text-slate-400">
        No income data for this period
      </div>
    );

  const needsActual = Math.min(expenses, needs50);
  const needsOver = expenses > needs50;
  const needsFill =
    needs50 > 0 ? Math.min((needsActual / needs50) * 100, 100) : 0;

  const wantsActual = Math.max(0, expenses - needs50);
  const wantsFill =
    wants30 > 0 ? Math.min((wantsActual / wants30) * 100, 100) : 0;

  const savingsFill =
    savings20 > 0 ? Math.min((savings / savings20) * 100, 100) : 0;
  const savingsAchieved = savings >= savings20;

  return (
    <div className="space-y-4">
      {/* Needs 50% */}
      <div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">
            🏠 Needs (50%)
          </span>
          <Badge
            className={`text-[9px] ${
              needsOver
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {needsOver ? "Over budget" : "On track"}
          </Badge>
        </div>
        <div className="mt-1">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${needsFill}%`,
                background: needsOver ? "#ef4444" : "#6366f1",
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>Actual: {formatCurrency(needsActual)}</span>
            <span>Target: {formatCurrency(needs50)}</span>
          </div>
        </div>
      </div>

      {/* Wants 30% */}
      <div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">
            🎭 Wants (30%)
          </span>
          <span className="text-[10px] text-slate-400">
            Target: {formatCurrency(wants30)}
          </span>
        </div>
        <div className="mt-1">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${wantsFill}%`, background: "#f59e0b" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>Actual: {formatCurrency(wantsActual)}</span>
            <span>Target: {formatCurrency(wants30)}</span>
          </div>
        </div>
      </div>

      {/* Savings 20% */}
      <div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">
            💰 Savings (20%)
          </span>
          <Badge
            className={`text-[9px] ${
              savingsAchieved
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            {savingsAchieved ? "✓ Achieved" : "Below target"}
          </Badge>
        </div>
        <div className="mt-1">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${savingsFill}%`, background: "#10b981" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>Actual: {formatCurrency(savings)}</span>
            <span>Target: {formatCurrency(savings20)}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
        Savings Rate:{" "}
        <strong
          className={
            savingsRate >= 20
              ? "text-green-700"
              : savingsRate >= 10
                ? "text-amber-700"
                : "text-red-700"
          }
        >
          {savingsRate.toFixed(1)}%
        </strong>{" "}
        (target: 20%)
      </div>
    </div>
  );
}
