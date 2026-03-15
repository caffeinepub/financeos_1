import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../Types";
import Utils "../Utils";

module {
  public func create(
    userRules : Map.Map<Principal, Map.Map<Text, Types.FinancialRule>>,
    caller    : Principal,
    rule      : Types.FinancialRule
  ) : Types.FinancialRule {
    let userMap = Utils.getOrCreateUserMap(userRules, caller);
    userMap.add(rule.id, rule);
    rule;
  };

  public func get(
    userRules : Map.Map<Principal, Map.Map<Text, Types.FinancialRule>>,
    caller    : Principal,
    id        : Text
  ) : ?Types.FinancialRule {
    switch (userRules.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAll(
    userRules : Map.Map<Principal, Map.Map<Text, Types.FinancialRule>>,
    caller    : Principal
  ) : [Types.FinancialRule] {
    switch (userRules.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func update(
    userRules : Map.Map<Principal, Map.Map<Text, Types.FinancialRule>>,
    caller    : Principal,
    id        : Text,
    rule      : Types.FinancialRule
  ) : ?Types.FinancialRule {
    switch (userRules.get(caller)) {
      case (?userMap) {
        userMap.add(id, rule);
        ?rule;
      };
      case null { null };
    };
  };

  public func delete(
    userRules : Map.Map<Principal, Map.Map<Text, Types.FinancialRule>>,
    caller    : Principal,
    id        : Text
  ) : Bool {
    switch (userRules.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };
};
