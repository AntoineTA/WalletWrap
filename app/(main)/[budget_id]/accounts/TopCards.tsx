import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AccountCard = ({
  accountName,
  budgetName,
}: {
  accountName?: string;
  budgetName?: string;
}) => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          {accountName && budgetName ? (
            <>
              <CardTitle>{accountName}</CardTitle>
              <CardDescription>Budget {budgetName}</CardDescription>
            </>
          ) : (
            <>
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-16" />
            </>
          )}
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
            <Skeleton className="h-6 w-28" />
          )}
          <CardDescription>Balance</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
