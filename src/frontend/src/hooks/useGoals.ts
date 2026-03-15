import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssetType, type PortfolioHolding } from "../backend.d";
import { useActor } from "./useActor";

// Rich Goal interface used by the Goals module UI
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: bigint;
  priority: bigint;
  inflationRate: number;
  linkedInvestments: string[];
  progress: number;
}

export interface Investment {
  id: string;
  name: string;
  currentValue: number;
  assetType?: string;
}

// Serialize rich Goal to backend Goal format
function toBackendGoal(g: Omit<Goal, "id" | "progress"> & { goalId?: string }) {
  const notes = JSON.stringify({
    targetDate: g.targetDate.toString(),
    priority: g.priority.toString(),
    inflationRate: g.inflationRate,
    linkedInvestments: g.linkedInvestments,
  });
  const deadline = new Date(Number(g.targetDate) / 1000000)
    .toISOString()
    .split("T")[0];
  return {
    id: g.goalId || crypto.randomUUID(),
    name: g.name,
    targetAmount: g.targetAmount,
    currentAmount: 0,
    deadline,
    notes,
    category: "",
  };
}

// Deserialize backend Goal to rich Goal
function fromBackendGoal(bg: {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  notes: string;
  category: string;
}): Goal {
  let targetDate = BigInt(0);
  let priority = BigInt(1);
  let inflationRate = 6;
  let linkedInvestments: string[] = [];

  try {
    const parsed = JSON.parse(bg.notes || "{}");
    if (parsed.targetDate) targetDate = BigInt(parsed.targetDate);
    if (parsed.priority) priority = BigInt(parsed.priority);
    if (parsed.inflationRate !== undefined)
      inflationRate = parsed.inflationRate;
    if (parsed.linkedInvestments) linkedInvestments = parsed.linkedInvestments;
  } catch {
    // fallback: try to parse deadline as date
    if (bg.deadline) {
      try {
        targetDate = BigInt(new Date(bg.deadline).getTime() * 1000000);
      } catch {
        /* ignore */
      }
    }
  }

  return {
    id: bg.id,
    name: bg.name,
    targetAmount: bg.targetAmount,
    targetDate,
    priority,
    inflationRate,
    linkedInvestments,
    progress: 0, // computed in components
  };
}

// ---- Goal hooks ----

export function useGetAllGoals() {
  const { actor } = useActor();
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      const goals = await actor.getAllGoals();
      return goals.map(fromBackendGoal);
    },
    enabled: !!actor,
  });
}

export function useCreateGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      targetAmount: number;
      targetDate: bigint;
      priority: bigint;
      inflationRate: number;
    }) => {
      if (!actor) throw new Error("No actor");
      const bg = toBackendGoal({ ...data, linkedInvestments: [] });
      return actor.createGoal(bg);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useUpdateGoalProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      goalId: string;
      name: string;
      targetAmount: number;
      targetDate: bigint;
      priority: bigint;
      inflationRate: number;
      linkedInvestments: string[];
    }) => {
      if (!actor) throw new Error("No actor");
      const bg = toBackendGoal({ ...data, goalId: data.goalId });
      return actor.updateGoal(data.goalId, { ...bg, id: data.goalId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useDeleteGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteGoal(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

// ---- Investment hooks (from Portfolio) ----

function usePortfolioByType(assetType: AssetType) {
  const { actor } = useActor();
  return useQuery<Investment[]>({
    queryKey: ["portfolio", assetType],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      const holdings = await actor.getAllPortfolioHoldings();
      return (holdings as PortfolioHolding[])
        .filter((h) => Object.keys(h.assetType)[0] === assetType)
        .map((h) => ({
          id: h.id,
          name: h.name,
          currentValue: h.currentValue,
          assetType,
        }));
    },
    enabled: !!actor,
  });
}

export function useGetAllRetirals() {
  return usePortfolioByType(AssetType.Retirement);
}
export function useGetAllETFStocks() {
  return usePortfolioByType(AssetType.ETF);
}
export function useGetAllMutualFunds() {
  return usePortfolioByType(AssetType.MutualFund);
}
export function useGetAllCryptos() {
  return usePortfolioByType(AssetType.Crypto);
}
export function useGetAllFDs() {
  return usePortfolioByType(AssetType.FixedIncome);
}
export function useGetAllCommodities() {
  return usePortfolioByType(AssetType.Commodity);
}
export function useGetAllRealEstates() {
  return usePortfolioByType(AssetType.RealEstate);
}
export function useGetAllOtherInvestments() {
  return usePortfolioByType(AssetType.Other);
}

export function useGetAllInvestmentsByCategory() {
  const { actor } = useActor();
  return useQuery<Investment[]>({
    queryKey: ["portfolio", "all"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      const holdings = await actor.getAllPortfolioHoldings();
      return (holdings as PortfolioHolding[]).map((h) => ({
        id: h.id,
        name: h.name,
        currentValue: h.currentValue,
        assetType: Object.keys(h.assetType)[0],
      }));
    },
    enabled: !!actor,
  });
}
