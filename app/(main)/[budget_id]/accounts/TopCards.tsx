import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Account } from "./hooks";

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

export const BalanceCard = ({ balance }: { balance?: number }) => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          {balance !== undefined ? (
            <CardTitle
              className={balance < 0 ? "text-red-500" : "text-green-500"}
            >
              {balance.toFixed(2)}
            </CardTitle>
          ) : (
            <Skeleton className="h-6 w-20" />
          )}
          <CardDescription>Total Balance</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export const SkeletonAccountInfoCard = () => {
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
