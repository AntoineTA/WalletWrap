import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddAccountForm } from "@/components/AddAccountForm";
import type { Account } from "@/hooks/useAccounts";

export const BalanceCard = ({ balance }: { balance: number }) => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          <CardTitle
            className={balance < 0 ? "text-red-500" : "text-green-500"}
          >
            {balance.toFixed(2)}
          </CardTitle>
          <CardDescription>Total Balance</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export const AccountInfoCard = ({ account }: { account: Account }) => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          <CardTitle
            className={account.balance < 0 ? "text-red-500" : "text-green-500"}
          >
            {account.balance.toFixed(2)}
          </CardTitle>
          <CardDescription>
            {account.name} ({account.type})
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export const AddAccountButton = ({ budget_id }: { budget_id: number }) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="w-52">
      <Card
        onClick={() => setIsAdding(true)}
        className="flex justify-center items-center text-slate-600 h-24 border-dashed hover:shadow-lg hover:border-solid hover:text-black cursor-pointer"
      >
        <span className="flex gap-2">
          <Plus size={24} />
          New Account
        </span>
      </Card>
      <AddAccountForm
        open={isAdding}
        setOpen={setIsAdding}
        budget_id={budget_id}
      />
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
      </Card>
    </div>
  );
};
