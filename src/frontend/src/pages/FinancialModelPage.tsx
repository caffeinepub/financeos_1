import { FinancialModelingTab } from "../components/financial-model/FinancialModelingTab";

export default function FinancialModelPage() {
  return (
    <div data-ocid="financialmodel.page" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financial Model</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Asset allocation, portfolio modeling, retirement planning, insurance,
          and crypto strategies
        </p>
      </div>
      <FinancialModelingTab />
    </div>
  );
}
