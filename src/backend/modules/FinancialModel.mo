import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../Types";
import Utils "../Utils";

module {
  public func create(
    userModels : Map.Map<Principal, Map.Map<Text, Types.FinancialModel>>,
    caller     : Principal,
    model      : Types.FinancialModel
  ) : Types.FinancialModel {
    let userMap = Utils.getOrCreateUserMap(userModels, caller);
    userMap.add(model.id, model);
    model;
  };

  public func get(
    userModels : Map.Map<Principal, Map.Map<Text, Types.FinancialModel>>,
    caller     : Principal,
    id         : Text
  ) : ?Types.FinancialModel {
    switch (userModels.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAll(
    userModels : Map.Map<Principal, Map.Map<Text, Types.FinancialModel>>,
    caller     : Principal
  ) : [Types.FinancialModel] {
    switch (userModels.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func update(
    userModels : Map.Map<Principal, Map.Map<Text, Types.FinancialModel>>,
    caller     : Principal,
    id         : Text,
    model      : Types.FinancialModel
  ) : ?Types.FinancialModel {
    switch (userModels.get(caller)) {
      case (?userMap) {
        userMap.add(id, model);
        ?model;
      };
      case null { null };
    };
  };

  public func delete(
    userModels : Map.Map<Principal, Map.Map<Text, Types.FinancialModel>>,
    caller     : Principal,
    id         : Text
  ) : Bool {
    switch (userModels.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };
};
