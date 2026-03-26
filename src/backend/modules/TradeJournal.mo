import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "../Types";
import Utils "../Utils";

module {
  // ─── TradeEntry CRUD ───────────────────────────────────────────

  public func createEntry(
    userTrades : Map.Map<Principal, Map.Map<Text, Types.TradeEntry>>,
    caller     : Principal,
    entry      : Types.TradeEntry
  ) : Types.TradeEntry {
    let userMap = Utils.getOrCreateUserMap(userTrades, caller);
    userMap.add(entry.id, entry);
    entry;
  };

  public func getEntry(
    userTrades : Map.Map<Principal, Map.Map<Text, Types.TradeEntry>>,
    caller     : Principal,
    id         : Text
  ) : ?Types.TradeEntry {
    switch (userTrades.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public func getAllEntries(
    userTrades : Map.Map<Principal, Map.Map<Text, Types.TradeEntry>>,
    caller     : Principal
  ) : [Types.TradeEntry] {
    switch (userTrades.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func updateEntry(
    userTrades : Map.Map<Principal, Map.Map<Text, Types.TradeEntry>>,
    caller     : Principal,
    id         : Text,
    entry      : Types.TradeEntry
  ) : ?Types.TradeEntry {
    switch (userTrades.get(caller)) {
      case (?userMap) {
        userMap.add(id, entry);
        ?entry;
      };
      case null { null };
    };
  };

  public func deleteEntry(
    userTrades : Map.Map<Principal, Map.Map<Text, Types.TradeEntry>>,
    caller     : Principal,
    id         : Text
  ) : Bool {
    switch (userTrades.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // ─── ChecklistItem CRUD ────────────────────────────────────────

  public func createChecklist(
    userChecklists : Map.Map<Principal, Map.Map<Text, Types.ChecklistItem>>,
    caller         : Principal,
    item           : Types.ChecklistItem
  ) : Types.ChecklistItem {
    let userMap = Utils.getOrCreateUserMap(userChecklists, caller);
    userMap.add(item.id, item);
    item;
  };

  public func getAllChecklists(
    userChecklists : Map.Map<Principal, Map.Map<Text, Types.ChecklistItem>>,
    caller         : Principal
  ) : [Types.ChecklistItem] {
    switch (userChecklists.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public func updateChecklist(
    userChecklists : Map.Map<Principal, Map.Map<Text, Types.ChecklistItem>>,
    caller         : Principal,
    id             : Text,
    item           : Types.ChecklistItem
  ) : ?Types.ChecklistItem {
    switch (userChecklists.get(caller)) {
      case (?userMap) {
        userMap.add(id, item);
        ?item;
      };
      case null { null };
    };
  };

  public func deleteChecklist(
    userChecklists : Map.Map<Principal, Map.Map<Text, Types.ChecklistItem>>,
    caller         : Principal,
    id             : Text
  ) : Bool {
    switch (userChecklists.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };
};
