"use client";

import { useEffect, useState } from "react";
import {
  AccountInfoCard,
  BalanceCard,
  SkeletonAccountInfoCard,
} from "./TopCards";
import { AddAccountButton } from "./AddAccountForm";
import { ErrorAlert } from "@/components/ui/error-alert";
import { columns } from "./columns";
import { TransactionTable } from "./TransactionTable";
import { useTopCards } from "./hooks";
import { Equal } from "lucide-react";

const Accounts = ({ params }: { params: { budget_id: number } }) => {
  const { accounts, error } = useTopCards(params.budget_id);
  const [balance, setBalance] = useState<number | undefined>();

  useEffect(() => {
    if (!accounts) return;
    if (accounts.length === 0) return setBalance(0);
    const balance = accounts
      .map((account) => account.balance || 0)
      .reduce((acc, curr) => acc + curr, 0);
    setBalance(balance);
  }, [accounts]);

  return (
    <div className="container mx-auto my-8">
      <div className="my-8">
        {error && <ErrorAlert {...error} />}
        <div className="flex justify-start items-center gap-4">
          <BalanceCard balance={balance} />
          <Equal size={24} />
          {accounts ? (
            accounts.map((account) => (
              <AccountInfoCard key={account.id} account={account} />
            ))
          ) : (
            <SkeletonAccountInfoCard />
          )}
          <AddAccountButton budget_id={params.budget_id} />
        </div>
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
