"use client";

import { useState } from "react";
import { AccountCard, BalanceCard } from "./TopCards";
import { ErrorAlert } from "@/components/ui/error-alert";
import { columns } from "./columns";
import { TransactionTable } from "./TransactionTable";
import { useEffect } from "react";
import { useAccountPage } from "./hooks";

const Accounts = ({ params }: { params: { budget_id: number } }) => {
  const { budgetName, balance, error } = useAccountPage(params.budget_id);

  return (
    <div className="container mx-auto my-8">
      <div className="my-8">
        {error && <ErrorAlert {...error} />}
        {!error && (
          <div className="flex justify-start gap-4">
            {<AccountCard accountName="All Accounts" budgetName={budgetName} />}
            {<BalanceCard balance={balance} />}
          </div>
        )}
      </div>
      <TransactionTable budget_id={params.budget_id} columns={columns} />
    </div>
  );
};
export default Accounts;
