module {
  // User Profile
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  // Data entity types
  public type AssetType = {
    #Retirement;
    #MutualFund;
    #ETF;
    #Crypto;
    #Commodity;
    #RealEstate;
    #FixedIncome;
    #Other;
  };

  public type TransactionType = {
    #Income;
    #Expense;
  };

  public type Goal = {
    id : Text;
    name : Text;
    targetAmount : Float;
    currentAmount : Float;
    deadline : Text;
    category : Text;
    notes : Text;
  };

  public type PortfolioHolding = {
    id : Text;
    assetType : AssetType;
    name : Text;
    ticker : Text;
    quantity : Float;
    costBasis : Float;
    currentValue : Float;
    notes : Text;
  };

  public type BudgetCategory = {
    id : Text;
    name : Text;
    categoryType : TransactionType;
    monthlyLimit : Float;
    color : Text;
  };

  public type Transaction = {
    id : Text;
    date : Text;
    amount : Float;
    categoryId : Text;
    description : Text;
    account : Text;
    transactionType : TransactionType;
  };

  public type Loan = {
    id : Text;
    name : Text;
    loanType : Text;
    principal : Float;
    interestRate : Float;
    termMonths : Int;
    startDate : Text;
    currentBalance : Float;
    monthlyPayment : Float;
    notes : Text;
  };

  public type FinancialRule = {
    id : Text;
    name : Text;
    ruleType : Text;
    threshold : Float;
    condition : Text;
    action : Text;
    isActive : Bool;
  };

  public type PlannerEvent = {
    id : Text;
    title : Text;
    date : Text;
    amount : Float;
    eventType : Text;
    notes : Text;
    isCompleted : Bool;
  };

  public type FinancialModel = {
    id : Text;
    name : Text;
    initialAmount : Float;
    monthlyContribution : Float;
    annualReturn : Float;
    years : Int;
    notes : Text;
  };

  public type DashboardSummary = {
    goalCount : Nat;
    portfolioCount : Nat;
    budgetCategoryCount : Nat;
    transactionCount : Nat;
    loanCount : Nat;
    ruleCount : Nat;
    eventCount : Nat;
    modelCount : Nat;
    totalIncome : Float;
    totalExpenses : Float;
  };
};
