import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../Types";
import Utils "../Utils";

module {
  public func create(
    userEvents : Map.Map<Principal, Map.Map<Text, Types.PlannerEvent>>,
    caller     : Principal,
    event      : Types.PlannerEvent
  ) : Types.PlannerEvent {
    let userMap = Utils.getOrCreateUserMap(userEvents, caller);
    userMap.add(event.id, event);
    event;
  };

  public func get(
    userEvents : Map.Map<Principal, Map.Map<Text, Types.PlannerEvent>>,
    caller     : Principal,
    id         : Text
  ) : ?Types.PlannerEvent {
    switch (userEvents.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAll(
    userEvents : Map.Map<Principal, Map.Map<Text, Types.PlannerEvent>>,
    caller     : Principal
  ) : [Types.PlannerEvent] {
    switch (userEvents.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func update(
    userEvents : Map.Map<Principal, Map.Map<Text, Types.PlannerEvent>>,
    caller     : Principal,
    id         : Text,
    event      : Types.PlannerEvent
  ) : ?Types.PlannerEvent {
    switch (userEvents.get(caller)) {
      case (?userMap) {
        userMap.add(id, event);
        ?event;
      };
      case null { null };
    };
  };

  public func delete(
    userEvents : Map.Map<Principal, Map.Map<Text, Types.PlannerEvent>>,
    caller     : Principal,
    id         : Text
  ) : Bool {
    switch (userEvents.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };
};
