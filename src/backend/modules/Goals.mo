import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../Types";
import Utils "../Utils";

module {
  public func create(
    userGoals : Map.Map<Principal, Map.Map<Text, Types.Goal>>,
    caller    : Principal,
    goal      : Types.Goal
  ) : Types.Goal {
    let userMap = Utils.getOrCreateUserMap(userGoals, caller);
    userMap.add(goal.id, goal);
    goal;
  };

  public func get(
    userGoals : Map.Map<Principal, Map.Map<Text, Types.Goal>>,
    caller    : Principal,
    id        : Text
  ) : ?Types.Goal {
    switch (userGoals.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAll(
    userGoals : Map.Map<Principal, Map.Map<Text, Types.Goal>>,
    caller    : Principal
  ) : [Types.Goal] {
    switch (userGoals.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func update(
    userGoals : Map.Map<Principal, Map.Map<Text, Types.Goal>>,
    caller    : Principal,
    id        : Text,
    goal      : Types.Goal
  ) : ?Types.Goal {
    switch (userGoals.get(caller)) {
      case (?userMap) {
        userMap.add(id, goal);
        ?goal;
      };
      case null { null };
    };
  };

  public func delete(
    userGoals : Map.Map<Principal, Map.Map<Text, Types.Goal>>,
    caller    : Principal,
    id        : Text
  ) : Bool {
    switch (userGoals.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };
};
