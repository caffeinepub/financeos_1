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
  // allocation % per investment id, default 100
  investmentAllocations: Record<string, number>;
  progress: number;
}

export interface Investment {
  id: string;
  name: string;
  currentValue: number;
  assetType?: string;
  category?: string;
}

// Serialize rich Goal to backend Goal format
function toBackendGoal(g: Omit<Goal, "id" | "progress"> & { goalId?: string }) {
  const notes = JSON.stringify({
    targetDate: g.targetDate.toString(),
    priority: g.priority.toString(),
    inflationRate: g.inflationRate,
    linkedInvestments: g.linkedInvestments,
    investmentAllocations: g.investmentAllocations,
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
  let investmentAllocations: Record<string, number> = {};

  try {
    const parsed = JSON.parse(bg.notes || "{}");
    if (parsed.targetDate) targetDate = BigInt(parsed.targetDate);
    if (parsed.priority) priority = BigInt(parsed.priority);
    if (parsed.inflationRate !== undefined)
      inflationRate = parsed.inflationRate;
    if (parsed.linkedInvestments) linkedInvestments = parsed.linkedInvestments;
    if (parsed.investmentAllocations)
      investmentAllocations = parsed.investmentAllocations;
  } catch {
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
    investmentAllocations,
    progress: 0, // computed in components
  };
}

// Extract assetType string safely from a PortfolioHolding
// The Candid backend may return a variant object { ETF: null } OR a plain string "ETF"
function extractAssetTypeKey(
  assetType: AssetType | Record<string, unknown>,
): string {
  if (typeof assetType === "string") return assetType;
  if (typeof assetType === "object" && assetType !== null) {
    const keys = Object.keys(assetType as Record<string, unknown>);
    if (keys.length > 0) return keys[0];
  }
  return "Other";
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
      const bg = toBackendGoal({
        ...data,
        linkedInvestments: [],
        investmentAllocations: {},
      });
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
      investmentAllocations: Record<string, number>;
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
        .filter(
          (h) =>
            extractAssetTypeKey(
              h.assetType as AssetType | Record<string, unknown>,
            ) === assetType,
        )
        .map((h) => ({
          id: h.id,
          name: h.name,
          currentValue: h.currentValue,
          assetType,
          category: h.notes || "",
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
        // Safely extract the string key whether backend returns string or variant object
        assetType: extractAssetTypeKey(
          h.assetType as AssetType | Record<string, unknown>,
        ),
        category: h.notes || "",
      }));
    },
    enabled: !!actor,
  });
}
