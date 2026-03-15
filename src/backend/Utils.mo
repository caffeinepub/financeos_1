import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  /// Generates a unique ID string from a monotonic counter value and the
  /// current timestamp.  The caller is responsible for incrementing its own
  /// counter before passing it in so that IDs remain unique across calls.
  public func generateId(counter : Nat) : Text {
    counter.toText() # "-" # Time.now().toText();
  };

  /// Returns the existing per-user inner map for `caller`, or creates and
  /// registers a fresh empty one if this is the first write for that user.
  /// This eliminates the repeated switch/Map.empty/add boilerplate in every
  /// CRUD create function.
  public func getOrCreateUserMap<V>(
    outerMap : Map.Map<Principal, Map.Map<Text, V>>,
    caller   : Principal
  ) : Map.Map<Text, V> {
    switch (outerMap.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, V>();
        outerMap.add(caller, newMap);
        newMap;
      };
    };
  };

  /// Returns the number of entries in the caller's inner map, or 0 if no
  /// map has been created yet.  Used by read-side helpers (e.g.
  /// getDashboardSummary) to collapse the repeated
  ///   switch (map.get(caller)) { case (?m) { m.size() }; case null { 0 } }
  /// pattern into a single line.
  public func getUserMapSize<V>(
    outerMap : Map.Map<Principal, Map.Map<Text, V>>,
    caller   : Principal
  ) : Nat {
    switch (outerMap.get(caller)) {
      case (?m) { m.size() };
      case null { 0 };
    };
  };
};
