import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Types "Types";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Type aliases from Types module
  public type UserProfile = Types.UserProfile;
  public type AssetType = Types.AssetType;
  public type TransactionType = Types.TransactionType;
  public type Goal = Types.Goal;
  public type PortfolioHolding = Types.PortfolioHolding;
  public type BudgetCategory = Types.BudgetCategory;
  public type Transaction = Types.Transaction;
  public type Loan = Types.Loan;
  public type FinancialRule = Types.FinancialRule;
  public type PlannerEvent = Types.PlannerEvent;
  public type FinancialModel = Types.FinancialModel;
  public type DashboardSummary = Types.DashboardSummary;

  // Per-user data storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userGoals = Map.empty<Principal, Map.Map<Text, Goal>>();
  let userPortfolios = Map.empty<Principal, Map.Map<Text, PortfolioHolding>>();
  let userBudgetCategories = Map.empty<Principal, Map.Map<Text, BudgetCategory>>();
  let userTransactions = Map.empty<Principal, Map.Map<Text, Transaction>>();
  let userLoans = Map.empty<Principal, Map.Map<Text, Loan>>();
  let userRules = Map.empty<Principal, Map.Map<Text, FinancialRule>>();
  let userEvents = Map.empty<Principal, Map.Map<Text, PlannerEvent>>();
  let userModels = Map.empty<Principal, Map.Map<Text, FinancialModel>>();

  // Helper function to generate unique IDs
  var idCounter : Nat = 0;
  func generateId() : Text {
    idCounter += 1;
    idCounter.toText() # "-" # Time.now().toText();
  };

  // User Profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Goals CRUD
  public shared ({ caller }) func createGoal(goal : Goal) : async Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create goals");
    };
    let userMap = switch (userGoals.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, Goal>();
        userGoals.add(caller, newMap);
        newMap;
      };
    };
    userMap.add(goal.id, goal);
    goal;
  };

  public query ({ caller }) func getGoal(id : Text) : async ?Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view goals");
    };
    switch (userGoals.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public query ({ caller }) func getAllGoals() : async [Goal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view goals");
    };
    switch (userGoals.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func updateGoal(id : Text, goal : Goal) : async ?Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update goals");
    };
    switch (userGoals.get(caller)) {
      case (?userMap) {
        userMap.add(id, goal);
        ?goal;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deleteGoal(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete goals");
    };
    switch (userGoals.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // PortfolioHolding CRUD
  public shared ({ caller }) func createPortfolioHolding(holding : PortfolioHolding) : async PortfolioHolding {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create portfolio holdings");
    };
    let userMap = switch (userPortfolios.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, PortfolioHolding>();
        userPortfolios.add(caller, newMap);
        newMap;
      };
    };
    userMap.add(holding.id, holding);
    holding;
  };

  public query ({ caller }) func getPortfolioHolding(id : Text) : async ?PortfolioHolding {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio holdings");
    };
    switch (userPortfolios.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public query ({ caller }) func getAllPortfolioHoldings() : async [PortfolioHolding] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio holdings");
    };
    switch (userPortfolios.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func updatePortfolioHolding(id : Text, holding : PortfolioHolding) : async ?PortfolioHolding {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update portfolio holdings");
    };
    switch (userPortfolios.get(caller)) {
      case (?userMap) {
        userMap.add(id, holding);
        ?holding;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deletePortfolioHolding(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete portfolio holdings");
    };
    switch (userPortfolios.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // BudgetCategory CRUD
  public shared ({ caller }) func createBudgetCategory(category : BudgetCategory) : async BudgetCategory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create budget categories");
    };
    let userMap = switch (userBudgetCategories.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, BudgetCategory>();
        userBudgetCategories.add(caller, newMap);
        newMap;
      };
    };
    userMap.add(category.id, category);
    category;
  };

  public query ({ caller }) func getBudgetCategory(id : Text) : async ?BudgetCategory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view budget categories");
    };
    switch (userBudgetCategories.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public query ({ caller }) func getAllBudgetCategories() : async [BudgetCategory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view budget categories");
    };
    switch (userBudgetCategories.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func updateBudgetCategory(id : Text, category : BudgetCategory) : async ?BudgetCategory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update budget categories");
    };
    switch (userBudgetCategories.get(caller)) {
      case (?userMap) {
        userMap.add(id, category);
        ?category;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deleteBudgetCategory(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete budget categories");
    };
    switch (userBudgetCategories.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // Transaction CRUD
  public shared ({ caller }) func createTransaction(transaction : Transaction) : async Transaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create transactions");
    };
    let userMap = switch (userTransactions.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, Transaction>();
        userTransactions.add(caller, newMap);
        newMap;
      };
    };
    userMap.add(transaction.id, transaction);
    transaction;
  };

  public query ({ caller }) func getTransaction(id : Text) : async ?Transaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    switch (userTransactions.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    switch (userTransactions.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func updateTransaction(id : Text, transaction : Transaction) : async ?Transaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update transactions");
    };
    switch (userTransactions.get(caller)) {
      case (?userMap) {
        userMap.add(id, transaction);
        ?transaction;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deleteTransaction(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete transactions");
    };
    switch (userTransactions.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // Loan CRUD
  public shared ({ caller }) func createLoan(loan : Loan) : async Loan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create loans");
    };
    let userMap = switch (userLoans.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, Loan>();
        userLoans.add(caller, newMap);
        newMap;
      };
    };
    userMap.add(loan.id, loan);
    loan;
  };

  public query ({ caller }) func getLoan(id : Text) : async ?Loan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loans");
    };
    switch (userLoans.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public query ({ caller }) func getAllLoans() : async [Loan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loans");
    };
    switch (userLoans.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func updateLoan(id : Text, loan : Loan) : async ?Loan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update loans");
    };
    switch (userLoans.get(caller)) {
      case (?userMap) {
        userMap.add(id, loan);
        ?loan;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deleteLoan(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete loans");
    };
    switch (userLoans.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // FinancialRule CRUD
  public shared ({ caller }) func createFinancialRule(rule : FinancialRule) : async FinancialRule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create financial rules");
    };
    let userMap = switch (userRules.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, FinancialRule>();
        userRules.add(caller, newMap);
        newMap;
      };
    };
    userMap.add(rule.id, rule);
    rule;
  };

  public query ({ caller }) func getFinancialRule(id : Text) : async ?FinancialRule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial rules");
    };
    switch (userRules.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public query ({ caller }) func getAllFinancialRules() : async [FinancialRule] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial rules");
    };
    switch (userRules.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func updateFinancialRule(id : Text, rule : FinancialRule) : async ?FinancialRule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update financial rules");
    };
    switch (userRules.get(caller)) {
      case (?userMap) {
        userMap.add(id, rule);
        ?rule;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deleteFinancialRule(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete financial rules");
    };
    switch (userRules.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // PlannerEvent CRUD
  public shared ({ caller }) func createPlannerEvent(event : PlannerEvent) : async PlannerEvent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create planner events");
    };
    let userMap = switch (userEvents.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, PlannerEvent>();
        userEvents.add(caller, newMap);
        newMap;
      };
    };
    userMap.add(event.id, event);
    event;
  };

  public query ({ caller }) func getPlannerEvent(id : Text) : async ?PlannerEvent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view planner events");
    };
    switch (userEvents.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public query ({ caller }) func getAllPlannerEvents() : async [PlannerEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view planner events");
    };
    switch (userEvents.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func updatePlannerEvent(id : Text, event : PlannerEvent) : async ?PlannerEvent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update planner events");
    };
    switch (userEvents.get(caller)) {
      case (?userMap) {
        userMap.add(id, event);
        ?event;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deletePlannerEvent(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete planner events");
    };
    switch (userEvents.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // FinancialModel CRUD
  public shared ({ caller }) func createFinancialModel(model : FinancialModel) : async FinancialModel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create financial models");
    };
    let userMap = switch (userModels.get(caller)) {
      case (?m) { m };
      case null {
        let newMap = Map.empty<Text, FinancialModel>();
        userModels.add(caller, newMap);
        newMap;
      };
    };
    userMap.add(model.id, model);
    model;
  };

  public query ({ caller }) func getFinancialModel(id : Text) : async ?FinancialModel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial models");
    };
    switch (userModels.get(caller)) {
      case (?userMap) { userMap.get(id) };
      case null { null };
    };
  };

  public query ({ caller }) func getAllFinancialModels() : async [FinancialModel] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial models");
    };
    switch (userModels.get(caller)) {
      case (?userMap) { userMap.values().toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func updateFinancialModel(id : Text, model : FinancialModel) : async ?FinancialModel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update financial models");
    };
    switch (userModels.get(caller)) {
      case (?userMap) {
        userMap.add(id, model);
        ?model;
      };
      case null { null };
    };
  };

  public shared ({ caller }) func deleteFinancialModel(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete financial models");
    };
    switch (userModels.get(caller)) {
      case (?userMap) {
        let existed = userMap.containsKey(id);
        userMap.remove(id);
        existed;
      };
      case null { false };
    };
  };

  // Special functions
  public query ({ caller }) func getNetWorth() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view net worth");
    };

    var totalAssets : Float = 0.0;
    var totalLiabilities : Float = 0.0;

    // Sum portfolio current values
    switch (userPortfolios.get(caller)) {
      case (?portfolioMap) {
        for (holding in portfolioMap.values()) {
          totalAssets += holding.currentValue;
        };
      };
      case null {};
    };

    // Sum loan balances
    switch (userLoans.get(caller)) {
      case (?loanMap) {
        for (loan in loanMap.values()) {
          totalLiabilities += loan.currentBalance;
        };
      };
      case null {};
    };

    totalAssets - totalLiabilities;
  };

  public query ({ caller }) func getDashboardSummary() : async DashboardSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard summary");
    };

    var totalIncome : Float = 0.0;
    var totalExpenses : Float = 0.0;

    // Calculate income and expenses from transactions
    switch (userTransactions.get(caller)) {
      case (?txMap) {
        for (tx in txMap.values()) {
          switch (tx.transactionType) {
            case (#Income) { totalIncome += tx.amount };
            case (#Expense) { totalExpenses += tx.amount };
          };
        };
      };
      case null {};
    };

    {
      goalCount = switch (userGoals.get(caller)) {
        case (?m) { m.size() };
        case null { 0 };
      };
      portfolioCount = switch (userPortfolios.get(caller)) {
        case (?m) { m.size() };
        case null { 0 };
      };
      budgetCategoryCount = switch (userBudgetCategories.get(caller)) {
        case (?m) { m.size() };
        case null { 0 };
      };
      transactionCount = switch (userTransactions.get(caller)) {
        case (?m) { m.size() };
        case null { 0 };
      };
      loanCount = switch (userLoans.get(caller)) {
        case (?m) { m.size() };
        case null { 0 };
      };
      ruleCount = switch (userRules.get(caller)) {
        case (?m) { m.size() };
        case null { 0 };
      };
      eventCount = switch (userEvents.get(caller)) {
        case (?m) { m.size() };
        case null { 0 };
      };
      modelCount = switch (userModels.get(caller)) {
        case (?m) { m.size() };
        case null { 0 };
      };
      totalIncome;
      totalExpenses;
    };
  };
};
