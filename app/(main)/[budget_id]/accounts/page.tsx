"use client";

import {
  AccountInfoCard,
  BalanceCard,
  AddAccountButton,
  SkeletonCard,
} from "@/components/AccountCards";
// import { AddAccountButton } from "./AddAccountForm";
import { ErrorAlert } from "@/components/ErrorAlert";
import { columns } from "../../../../components/TransactionTable/columns";
import { TransactionTable } from "../../../../components/TransactionTable/TransactionTable";
import { Equal } from "lucide-react";
import { useAccounts } from "@/hooks/useAccounts";

const Accounts = ({ params }: { params: { budget_id: number } }) => {
  const { accounts, balance, error, isPending } = useAccounts(params.budget_id);

  return (
    <div className="container mx-auto my-8">
      {error && <ErrorAlert {...error} />}
      <div className="flex justify-start items-center gap-4">
        {isPending && <SkeletonCard />}
        {balance !== undefined && <BalanceCard balance={balance} />}
        <Equal size={24} />
        {isPending && <SkeletonCard />}
        {accounts &&
          accounts.map((account) => (
            <AccountInfoCard key={account.id} account={account} />
          ))}
        <AddAccountButton budget_id={params.budget_id} />
      </div>
    </div>
    // <div className="container mx-auto my-8">
    //   <div className="my-8">
    //     {error && <ErrorAlert {...error} />}
    //     <div className="flex justify-start items-center gap-4">
    //       <BalanceCard balance={balance} />
    //       <Equal size={24} />
    //       {accounts ? (
    //         accounts.map((account) => (
    //           <AccountInfoCard key={account.id} account={account} />
    //         ))
    //       ) : (
    //         <SkeletonAccountInfoCard />
    //       )}
    //       <AddAccountButton budget_id={params.budget_id} />
    //     </div>
    //   </div>
    //   <TransactionTable
    //     budget_id={params.budget_id}
    //     columns={columns}
    //     balance={balance}
    //     setBalance={setBalance}
    //   />
    // </div>
  );
};
export default Accounts;
