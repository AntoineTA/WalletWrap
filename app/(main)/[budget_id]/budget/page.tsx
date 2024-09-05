"use client";

import { BudgetBalanceCard, SkeletonCard } from "@/components/BudgetCards";
import { EnvelopeGrid } from "@/components/EnvelopeGrid/EnvelopeGrid";
import { ErrorAlert } from "@/components/ErrorAlert";
import {
  BudgetBalanceProvider,
  useBudgetBalanceContext,
} from "@/contexts/BudgetBalanceContext";

const BudgetPage = ({ params }: { params: { budget_id: number } }) => {
  return (
    <BudgetBalanceProvider budget_id={params.budget_id}>
      <div className="container mx-auto my-8">
        <TopCards />
        <EnvelopeGrid budget_id={params.budget_id} />
      </div>
    </BudgetBalanceProvider>
  );
};
export default BudgetPage;

const TopCards = () => {
  const { error, isPending, budgetBalance } = useBudgetBalanceContext();

  return (
    <div>
      {error && <ErrorAlert {...error} />}
      {isPending && <SkeletonCard />}
      {budgetBalance !== undefined && (
        <BudgetBalanceCard budgetBalance={budgetBalance} />
      )}
    </div>
  );
};
