"use client";

import { useBudgetBalance } from "@/hooks/useBudgetBalance";
import { BudgetBalanceCard, SkeletonCard } from "@/components/BudgetCards";
import { EnvelopeGrid } from "@/components/EnvelopeGrid/EnvelopeGrid";
import { ErrorAlert } from "@/components/ErrorAlert";

const Budget = ({ params }: { params: { budget_id: number } }) => {
  const { error, isPending, budgetBalance, setBudgetBalance } =
    useBudgetBalance(params.budget_id);

  return (
    <div className="container mx-auto my-8">
      <div className="my-8">
        {error && <ErrorAlert {...error} />}
        {isPending && <SkeletonCard />}
        {budgetBalance !== undefined && (
          <BudgetBalanceCard budgetBalance={budgetBalance} />
        )}
      </div>
      <EnvelopeGrid
        budget_id={params.budget_id}
        budgetBalance={budgetBalance}
        setBudgetBalance={setBudgetBalance}
      />
    </div>
  );
};
export default Budget;
