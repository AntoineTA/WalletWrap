"use client";

import { useEffect, useState } from "react";
import { AccountCard, BalanceCard } from "./TopCards";
import { ErrorAlert } from "@/components/ui/error-alert";
import { columns } from "./columns";
import { TransactionTable } from "./TransactionTable";
import { useTopCards } from "./hooks";

const Accounts = ({ params }: { params: { budget_id: number } }) => {
  const { budgetName, getBalance, error } = useTopCards(params.budget_id);
  const [balance, setBalance] = useState<number | undefined>();

  useEffect(() => {
    (async () => {
      const balance = await getBalance();
      setBalance(balance);
    })();
  }, [params.budget_id]);

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
      <TransactionTable
        budget_id={params.budget_id}
        columns={columns}
        balance={balance}
        setBalance={setBalance}
      />
    </div>
  );
};
export default Accounts;
