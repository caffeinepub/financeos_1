import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../Types";
import Utils "../Utils";

module {
  public func create(
    userLoans : Map.Map<Principal, Map.Map<Text, Types.Loan>>,
    caller    : Principal,
    loan      : Types.Loan
  ) : Types.Loan {
    let userMap = Utils.getOrCreateUserMap(userLoans, caller);
    userMap.add(loan.id, loan);
    loan;
  };

  public func get(
    userLoans : Map.Map<Principal, Map.Map<Text, Types.Loan>>,
    caller    : Principal,
    id        : Text
  ) : ?Types.Loan {
    switch (userLoans.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAll(
    userLoans : Map.Map<Principal, Map.Map<Text, Types.Loan>>,
    caller    : Principal
  ) : [Types.Loan] {
    switch (userLoans.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func update(
    userLoans : Map.Map<Principal, Map.Map<Text, Types.Loan>>,
    caller    : Principal,
    id        : Text,
    loan      : Types.Loan
  ) : ?Types.Loan {
    switch (userLoans.get(caller)) {
      case (?userMap) {
        userMap.add(id, loan);
        ?loan;
      };
      case null { null };
    };
  };

  public func delete(
    userLoans : Map.Map<Principal, Map.Map<Text, Types.Loan>>,
    caller    : Principal,
    id        : Text
  ) : Bool {
    switch (userLoans.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };
};
