var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { S as Subscribable, F as shallowEqualObjects, G as hashKey, H as getDefaultState, J as notifyManager, K as useQueryClient, r as reactExports, M as noop, N as shouldThrowError, u as useActor, b as useQuery } from "./index-CnGSD72i.js";
import { A as AssetType } from "./index-CUmzdL5t.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
function toBackendGoal(g) {
  const notes = JSON.stringify({
    targetDate: g.targetDate.toString(),
    priority: g.priority.toString(),
    inflationRate: g.inflationRate,
    linkedInvestments: g.linkedInvestments,
    investmentAllocations: g.investmentAllocations
  });
  const deadline = new Date(Number(g.targetDate) / 1e6).toISOString().split("T")[0];
  return {
    id: g.goalId || crypto.randomUUID(),
    name: g.name,
    targetAmount: g.targetAmount,
    currentAmount: 0,
    deadline,
    notes,
    category: ""
  };
}
function fromBackendGoal(bg) {
  let targetDate = BigInt(0);
  let priority = BigInt(1);
  let inflationRate = 6;
  let linkedInvestments = [];
  let investmentAllocations = {};
  try {
    const parsed = JSON.parse(bg.notes || "{}");
    if (parsed.targetDate) targetDate = BigInt(parsed.targetDate);
    if (parsed.priority) priority = BigInt(parsed.priority);
    if (parsed.inflationRate !== void 0)
      inflationRate = parsed.inflationRate;
    if (parsed.linkedInvestments) linkedInvestments = parsed.linkedInvestments;
    if (parsed.investmentAllocations)
      investmentAllocations = parsed.investmentAllocations;
  } catch {
    if (bg.deadline) {
      try {
        targetDate = BigInt(new Date(bg.deadline).getTime() * 1e6);
      } catch {
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
    progress: 0
    // computed in components
  };
}
function extractAssetTypeKey(assetType) {
  if (typeof assetType === "string") return assetType;
  if (typeof assetType === "object" && assetType !== null) {
    const keys = Object.keys(assetType);
    if (keys.length > 0) return keys[0];
  }
  return "Other";
}
function useGetAllGoals() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      const goals = await actor.getAllGoals();
      return goals.map(fromBackendGoal);
    },
    enabled: !!actor
  });
}
function useCreateGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("No actor");
      const bg = toBackendGoal({
        ...data,
        linkedInvestments: [],
        investmentAllocations: {}
      });
      return actor.createGoal(bg);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] })
  });
}
function useUpdateGoalProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("No actor");
      const bg = toBackendGoal({ ...data, goalId: data.goalId });
      return actor.updateGoal(data.goalId, { ...bg, id: data.goalId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] })
  });
}
function useDeleteGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteGoal(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] })
  });
}
function usePortfolioByType(assetType) {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["portfolio", "all", assetType],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      const holdings = await actor.getAllPortfolioHoldings();
      return holdings.filter(
        (h) => extractAssetTypeKey(
          h.assetType
        ) === assetType
      ).map((h) => ({
        id: h.id,
        name: h.name,
        currentValue: h.currentValue,
        assetType,
        category: h.notes || ""
      }));
    },
    enabled: !!actor
  });
}
function useGetAllRetirals() {
  return usePortfolioByType(AssetType.Retirement);
}
function useGetAllETFStocks() {
  return usePortfolioByType(AssetType.ETF);
}
function useGetAllMutualFunds() {
  return usePortfolioByType(AssetType.MutualFund);
}
function useGetAllCryptos() {
  return usePortfolioByType(AssetType.Crypto);
}
function useGetAllFDs() {
  return usePortfolioByType(AssetType.FixedIncome);
}
function useGetAllCommodities() {
  return usePortfolioByType(AssetType.Commodity);
}
function useGetAllRealEstates() {
  return usePortfolioByType(AssetType.RealEstate);
}
function useGetAllOtherInvestments() {
  return usePortfolioByType(AssetType.Other);
}
function useGetAllInvestmentsByCategory() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["portfolio", "all"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      const holdings = await actor.getAllPortfolioHoldings();
      return holdings.map((h) => ({
        id: h.id,
        name: h.name,
        currentValue: h.currentValue,
        // Safely extract the string key whether backend returns string or variant object
        assetType: extractAssetTypeKey(
          h.assetType
        ),
        category: h.notes || ""
      }));
    },
    enabled: !!actor
  });
}
export {
  useGetAllInvestmentsByCategory as a,
  useDeleteGoal as b,
  useUpdateGoalProgress as c,
  useCreateGoal as d,
  useGetAllRetirals as e,
  useGetAllETFStocks as f,
  useGetAllMutualFunds as g,
  useGetAllCryptos as h,
  useGetAllFDs as i,
  useGetAllCommodities as j,
  useGetAllRealEstates as k,
  useGetAllOtherInvestments as l,
  useGetAllGoals as u
};
