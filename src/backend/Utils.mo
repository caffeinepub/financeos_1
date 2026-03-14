import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  /// Generates a unique ID string from a monotonic counter value and the
  /// current timestamp.  The caller is responsible for incrementing its own
  /// counter before passing it in so that IDs remain unique across calls.
  public func generateId(counter : Nat) : Text {
    counter.toText() # "-" # Time.now().toText();
  };
};
