import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../Types";
import Utils "../Utils";

module {
  // ── BudgetCategory ────────────────────────────────────────────────────────

  public func createCategory(
    userBudgetCategories : Map.Map<Principal, Map.Map<Text, Types.BudgetCategory>>,
    caller               : Principal,
    category             : Types.BudgetCategory
  ) : Types.BudgetCategory {
    let userMap = Utils.getOrCreateUserMap(userBudgetCategories, caller);
    userMap.add(category.id, category);
    category;
  };

  public func getCategory(
    userBudgetCategories : Map.Map<Principal, Map.Map<Text, Types.BudgetCategory>>,
    caller               : Principal,
    id                   : Text
  ) : ?Types.BudgetCategory {
    switch (userBudgetCategories.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAllCategories(
    userBudgetCategories : Map.Map<Principal, Map.Map<Text, Types.BudgetCategory>>,
    caller               : Principal
  ) : [Types.BudgetCategory] {
    switch (userBudgetCategories.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func updateCategory(
    userBudgetCategories : Map.Map<Principal, Map.Map<Text, Types.BudgetCategory>>,
    caller               : Principal,
    id                   : Text,
    category             : Types.BudgetCategory
  ) : ?Types.BudgetCategory {
    switch (userBudgetCategories.get(caller)) {
      case (?userMap) {
        userMap.add(id, category);
        ?category;
      };
      case null { null };
    };
  };

  public func deleteCategory(
    userBudgetCategories : Map.Map<Principal, Map.Map<Text, Types.BudgetCategory>>,
    caller               : Principal,
    id                   : Text
  ) : Bool {
    switch (userBudgetCategories.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // ── Transaction ───────────────────────────────────────────────────────────

  public func createTransaction(
    userTransactions : Map.Map<Principal, Map.Map<Text, Types.Transaction>>,
    caller           : Principal,
    transaction      : Types.Transaction
  ) : Types.Transaction {
    let userMap = Utils.getOrCreateUserMap(userTransactions, caller);
    userMap.add(transaction.id, transaction);
    transaction;
  };

  public func getTransaction(
    userTransactions : Map.Map<Principal, Map.Map<Text, Types.Transaction>>,
    caller           : Principal,
    id               : Text
  ) : ?Types.Transaction {
    switch (userTransactions.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAllTransactions(
    userTransactions : Map.Map<Principal, Map.Map<Text, Types.Transaction>>,
    caller           : Principal
  ) : [Types.Transaction] {
    switch (userTransactions.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func updateTransaction(
    userTransactions : Map.Map<Principal, Map.Map<Text, Types.Transaction>>,
    caller           : Principal,
    id               : Text,
    transaction      : Types.Transaction
  ) : ?Types.Transaction {
    switch (userTransactions.get(caller)) {
      case (?userMap) {
        userMap.add(id, transaction);
        ?transaction;
      };
      case null { null };
    };
  };

  public func deleteTransaction(
    userTransactions : Map.Map<Principal, Map.Map<Text, Types.Transaction>>,
    caller           : Principal,
    id               : Text
  ) : Bool {
    switch (userTransactions.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };
};
