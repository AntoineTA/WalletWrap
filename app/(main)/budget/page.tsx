"use client";

import { BudgetBalanceCard, SkeletonCard } from "@/components/BudgetCards";
import { EnvelopeGrid } from "@/components/EnvelopeGrid/EnvelopeGrid";
import { ErrorAlert } from "@/components/ErrorAlert";
import {
  BudgetBalanceProvider,
  useBudgetBalanceContext,
} from "@/contexts/BudgetBalanceContext";

const Budget = () => {
  return (
    <BudgetBalanceProvider>
      <div className="container mx-auto my-8">
        <TopCards />
        <EnvelopeGrid />
      </div>
    </BudgetBalanceProvider>
  );
};
export default Budget;

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
