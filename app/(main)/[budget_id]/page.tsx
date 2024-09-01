"use client";
import { useEffect, useState } from "react";
import { useTopCards } from "./hooks";
import { ErrorAlert } from "@/components/ui/error-alert";
import { BudgetInfoCard, BudgetBalanceCard } from "./TopCards";
import { columns } from "./columns";
import EnvelopeGrid from "./EnvelopeGrid";

const Budget = ({ params }: { params: { budget_id: number } }) => {
  const { budget, balance, envelopes, error } = useTopCards(params.budget_id);
  const [toBudget, setToBudget] = useState<number | undefined>();

  useEffect(() => {
    if (balance === undefined || !envelopes) return;
    console.log("balance", balance);
    console.log("envelopes", envelopes);
    const budgeted = envelopes
      .map((envelope) => envelope.budgeted)
      .reduce((acc, curr) => acc + curr, 0);
    setToBudget(balance - budgeted);
  }, [balance, envelopes]);

  return (
    <div className="container mx-auto my-8">
      <div className="my-8">
        {error && <ErrorAlert {...error} />}
        {!error && (
          <div className="flex justify-start gap-4">
            {
              <BudgetInfoCard
                budgetName={budget?.name}
                budgetDesc={budget?.description}
              />
            }
            {<BudgetBalanceCard toBudget={toBudget} />}
          </div>
        )}
      </div>
      {envelopes && (
        <EnvelopeGrid
          columns={columns}
          budget_id={params.budget_id}
          toBudget={toBudget}
          setToBudget={setToBudget}
        />
      )}
    </div>
  );
};
export default Budget;
