import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../Types";
import Utils "../Utils";

module {
  public func create(
    userPortfolios : Map.Map<Principal, Map.Map<Text, Types.PortfolioHolding>>,
    caller         : Principal,
    holding        : Types.PortfolioHolding
  ) : Types.PortfolioHolding {
    let userMap = Utils.getOrCreateUserMap(userPortfolios, caller);
    userMap.add(holding.id, holding);
    holding;
  };

  public func get(
    userPortfolios : Map.Map<Principal, Map.Map<Text, Types.PortfolioHolding>>,
    caller         : Principal,
    id             : Text
  ) : ?Types.PortfolioHolding {
    switch (userPortfolios.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAll(
    userPortfolios : Map.Map<Principal, Map.Map<Text, Types.PortfolioHolding>>,
    caller         : Principal
  ) : [Types.PortfolioHolding] {
    switch (userPortfolios.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func update(
    userPortfolios : Map.Map<Principal, Map.Map<Text, Types.PortfolioHolding>>,
    caller         : Principal,
    id             : Text,
    holding        : Types.PortfolioHolding
  ) : ?Types.PortfolioHolding {
    switch (userPortfolios.get(caller)) {
      case (?userMap) {
        userMap.add(id, holding);
        ?holding;
      };
      case null { null };
    };
  };

  public func delete(
    userPortfolios : Map.Map<Principal, Map.Map<Text, Types.PortfolioHolding>>,
    caller         : Principal,
    id             : Text
  ) : Bool {
    switch (userPortfolios.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };
};
