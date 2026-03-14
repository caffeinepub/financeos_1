import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Types "Types";

module {
  /// Holds all per-user data maps for the application.
  public type State = {
    userProfiles        : Map.Map<Principal, Types.UserProfile>;
    userGoals           : Map.Map<Principal, Map.Map<Text, Types.Goal>>;
    userPortfolios      : Map.Map<Principal, Map.Map<Text, Types.PortfolioHolding>>;
    userBudgetCategories: Map.Map<Principal, Map.Map<Text, Types.BudgetCategory>>;
    userTransactions    : Map.Map<Principal, Map.Map<Text, Types.Transaction>>;
    userLoans           : Map.Map<Principal, Map.Map<Text, Types.Loan>>;
    userRules           : Map.Map<Principal, Map.Map<Text, Types.FinancialRule>>;
    userEvents          : Map.Map<Principal, Map.Map<Text, Types.PlannerEvent>>;
    userModels          : Map.Map<Principal, Map.Map<Text, Types.FinancialModel>>;
  };

  /// Creates and returns a fresh, empty storage state.
  public func init() : State {
    {
      userProfiles         = Map.empty<Principal, Types.UserProfile>();
      userGoals            = Map.empty<Principal, Map.Map<Text, Types.Goal>>();
      userPortfolios       = Map.empty<Principal, Map.Map<Text, Types.PortfolioHolding>>();
      userBudgetCategories = Map.empty<Principal, Map.Map<Text, Types.BudgetCategory>>();
      userTransactions     = Map.empty<Principal, Map.Map<Text, Types.Transaction>>();
      userLoans            = Map.empty<Principal, Map.Map<Text, Types.Loan>>();
      userRules            = Map.empty<Principal, Map.Map<Text, Types.FinancialRule>>();
      userEvents           = Map.empty<Principal, Map.Map<Text, Types.PlannerEvent>>();
      userModels           = Map.empty<Principal, Map.Map<Text, Types.FinancialModel>>();
    };
  };
};
