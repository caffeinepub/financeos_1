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
import Storage "Storage";
import Utils "Utils";
import GoalsModule "modules/Goals";
import PortfolioModule "modules/Portfolio";
import BudgetingModule "modules/Budgeting";
import LoansModule "modules/Loans";
import FinancialRulesModule "modules/FinancialRules";
import FinancialPlannerModule "modules/FinancialPlanner";
import FinancialModelModule "modules/FinancialModel";

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

  // Per-user data storage (all maps live in Storage.mo)
  let store = Storage.init();

  // Convenience aliases so the rest of the file is unchanged
  let userProfiles         = store.userProfiles;
  let userGoals            = store.userGoals;
  let userPortfolios       = store.userPortfolios;
  let userBudgetCategories = store.userBudgetCategories;
  let userTransactions     = store.userTransactions;
  let userLoans            = store.userLoans;
  let userRules            = store.userRules;
  let userEvents           = store.userEvents;
  let userModels           = store.userModels;

  // Monotonic counter used by generateId; state lives here, logic lives in Utils.
  var idCounter : Nat = 0;
  func generateId() : Text {
    idCounter += 1;
    Utils.generateId(idCounter);
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

  // Goals CRUD — delegated to GoalsModule
  public shared ({ caller }) func createGoal(goal : Goal) : async Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create goals");
    };
    GoalsModule.create(userGoals, caller, goal);
  };

  public query ({ caller }) func getGoal(id : Text) : async ?Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view goals");
    };
    GoalsModule.get(userGoals, caller, id);
  };

  public query ({ caller }) func getAllGoals() : async [Goal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view goals");
    };
    GoalsModule.getAll(userGoals, caller);
  };

  public shared ({ caller }) func updateGoal(id : Text, goal : Goal) : async ?Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update goals");
    };
    GoalsModule.update(userGoals, caller, id, goal);
  };

  public shared ({ caller }) func deleteGoal(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete goals");
    };
    GoalsModule.delete(userGoals, caller, id);
  };

  // Portfolio CRUD — delegated to PortfolioModule
  public shared ({ caller }) func createPortfolioHolding(holding : PortfolioHolding) : async PortfolioHolding {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create portfolio holdings");
    };
    PortfolioModule.create(userPortfolios, caller, holding);
  };

  public query ({ caller }) func getPortfolioHolding(id : Text) : async ?PortfolioHolding {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio holdings");
    };
    PortfolioModule.get(userPortfolios, caller, id);
  };

  public query ({ caller }) func getAllPortfolioHoldings() : async [PortfolioHolding] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view portfolio holdings");
    };
    PortfolioModule.getAll(userPortfolios, caller);
  };

  public shared ({ caller }) func updatePortfolioHolding(id : Text, holding : PortfolioHolding) : async ?PortfolioHolding {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update portfolio holdings");
    };
    PortfolioModule.update(userPortfolios, caller, id, holding);
  };

  public shared ({ caller }) func deletePortfolioHolding(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete portfolio holdings");
    };
    PortfolioModule.delete(userPortfolios, caller, id);
  };

  // BudgetCategory CRUD — delegated to BudgetingModule
  public shared ({ caller }) func createBudgetCategory(category : BudgetCategory) : async BudgetCategory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create budget categories");
    };
    BudgetingModule.createCategory(userBudgetCategories, caller, category);
  };

  public query ({ caller }) func getBudgetCategory(id : Text) : async ?BudgetCategory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view budget categories");
    };
    BudgetingModule.getCategory(userBudgetCategories, caller, id);
  };

  public query ({ caller }) func getAllBudgetCategories() : async [BudgetCategory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view budget categories");
    };
    BudgetingModule.getAllCategories(userBudgetCategories, caller);
  };

  public shared ({ caller }) func updateBudgetCategory(id : Text, category : BudgetCategory) : async ?BudgetCategory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update budget categories");
    };
    BudgetingModule.updateCategory(userBudgetCategories, caller, id, category);
  };

  public shared ({ caller }) func deleteBudgetCategory(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete budget categories");
    };
    BudgetingModule.deleteCategory(userBudgetCategories, caller, id);
  };

  // Transaction CRUD — delegated to BudgetingModule
  public shared ({ caller }) func createTransaction(transaction : Transaction) : async Transaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create transactions");
    };
    BudgetingModule.createTransaction(userTransactions, caller, transaction);
  };

  public query ({ caller }) func getTransaction(id : Text) : async ?Transaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    BudgetingModule.getTransaction(userTransactions, caller, id);
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    BudgetingModule.getAllTransactions(userTransactions, caller);
  };

  public shared ({ caller }) func updateTransaction(id : Text, transaction : Transaction) : async ?Transaction {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update transactions");
    };
    BudgetingModule.updateTransaction(userTransactions, caller, id, transaction);
  };

  public shared ({ caller }) func deleteTransaction(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete transactions");
    };
    BudgetingModule.deleteTransaction(userTransactions, caller, id);
  };

  // Loan CRUD — delegated to LoansModule
  public shared ({ caller }) func createLoan(loan : Loan) : async Loan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create loans");
    };
    LoansModule.create(userLoans, caller, loan);
  };

  public query ({ caller }) func getLoan(id : Text) : async ?Loan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loans");
    };
    LoansModule.get(userLoans, caller, id);
  };

  public query ({ caller }) func getAllLoans() : async [Loan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loans");
    };
    LoansModule.getAll(userLoans, caller);
  };

  public shared ({ caller }) func updateLoan(id : Text, loan : Loan) : async ?Loan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update loans");
    };
    LoansModule.update(userLoans, caller, id, loan);
  };

  public shared ({ caller }) func deleteLoan(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete loans");
    };
    LoansModule.delete(userLoans, caller, id);
  };

  // FinancialRule CRUD — delegated to FinancialRulesModule
  public shared ({ caller }) func createFinancialRule(rule : FinancialRule) : async FinancialRule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create financial rules");
    };
    FinancialRulesModule.create(userRules, caller, rule);
  };

  public query ({ caller }) func getFinancialRule(id : Text) : async ?FinancialRule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial rules");
    };
    FinancialRulesModule.get(userRules, caller, id);
  };

  public query ({ caller }) func getAllFinancialRules() : async [FinancialRule] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial rules");
    };
    FinancialRulesModule.getAll(userRules, caller);
  };

  public shared ({ caller }) func updateFinancialRule(id : Text, rule : FinancialRule) : async ?FinancialRule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update financial rules");
    };
    FinancialRulesModule.update(userRules, caller, id, rule);
  };

  public shared ({ caller }) func deleteFinancialRule(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete financial rules");
    };
    FinancialRulesModule.delete(userRules, caller, id);
  };

  // PlannerEvent CRUD — delegated to FinancialPlannerModule
  public shared ({ caller }) func createPlannerEvent(event : PlannerEvent) : async PlannerEvent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create planner events");
    };
    FinancialPlannerModule.create(userEvents, caller, event);
  };

  public query ({ caller }) func getPlannerEvent(id : Text) : async ?PlannerEvent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view planner events");
    };
    FinancialPlannerModule.get(userEvents, caller, id);
  };

  public query ({ caller }) func getAllPlannerEvents() : async [PlannerEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view planner events");
    };
    FinancialPlannerModule.getAll(userEvents, caller);
  };

  public shared ({ caller }) func updatePlannerEvent(id : Text, event : PlannerEvent) : async ?PlannerEvent {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update planner events");
    };
    FinancialPlannerModule.update(userEvents, caller, id, event);
  };

  public shared ({ caller }) func deletePlannerEvent(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete planner events");
    };
    FinancialPlannerModule.delete(userEvents, caller, id);
  };

  // FinancialModel CRUD — delegated to FinancialModelModule
  public shared ({ caller }) func createFinancialModel(model : FinancialModel) : async FinancialModel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create financial models");
    };
    FinancialModelModule.create(userModels, caller, model);
  };

  public query ({ caller }) func getFinancialModel(id : Text) : async ?FinancialModel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial models");
    };
    FinancialModelModule.get(userModels, caller, id);
  };

  public query ({ caller }) func getAllFinancialModels() : async [FinancialModel] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial models");
    };
    FinancialModelModule.getAll(userModels, caller);
  };

  public shared ({ caller }) func updateFinancialModel(id : Text, model : FinancialModel) : async ?FinancialModel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update financial models");
    };
    FinancialModelModule.update(userModels, caller, id, model);
  };

  public shared ({ caller }) func deleteFinancialModel(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete financial models");
    };
    FinancialModelModule.delete(userModels, caller, id);
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
      goalCount          = Utils.getUserMapSize(userGoals,            caller);
      portfolioCount     = Utils.getUserMapSize(userPortfolios,       caller);
      budgetCategoryCount = Utils.getUserMapSize(userBudgetCategories, caller);
      transactionCount   = Utils.getUserMapSize(userTransactions,     caller);
      loanCount          = Utils.getUserMapSize(userLoans,            caller);
      ruleCount          = Utils.getUserMapSize(userRules,            caller);
      eventCount         = Utils.getUserMapSize(userEvents,           caller);
      modelCount         = Utils.getUserMapSize(userModels,           caller);
      totalIncome;
      totalExpenses;
    };
  };
};
