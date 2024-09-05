"use client";

import { Equal } from "lucide-react";
import {
  AccountInfoCard,
  BalanceCard,
  AddAccountButton,
  SkeletonCard,
} from "@/components/AccountCards";
import { ErrorAlert } from "@/components/ErrorAlert";
import { TransactionTable } from "@/components/TransactionTable/TransactionTable";
import {
  AccountsProvider,
  useAccountsContext,
} from "@/contexts/AccountsContext";

const Accounts = () => {
  return (
    <AccountsProvider>
      <div className="container mx-auto my-8">
        <TopCards />
        <TransactionTable />
      </div>
    </AccountsProvider>
  );
};
export default Accounts;

const TopCards = () => {
  const { accounts, balance, isPending, error } = useAccountsContext();

  return (
    <div className="flex justify-start items-center gap-4">
      {error && <ErrorAlert {...error} />}
      {isPending && <SkeletonCard />}
      {balance !== undefined && <BalanceCard balance={balance} />}
      <Equal size={24} />
      {isPending && <SkeletonCard />}
      {accounts &&
        accounts.map((account) => (
          <AccountInfoCard key={account.id} account={account} />
        ))}
      <AddAccountButton />
    </div>
  );
};
