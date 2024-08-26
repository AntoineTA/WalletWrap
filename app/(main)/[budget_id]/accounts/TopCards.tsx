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
  const formattedBalance = balance?.toFixed(2);

  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          {balance ? (
            <CardTitle
              className={balance < 0 ? "text-red-500" : "text-green-500"}
            >
              {formattedBalance}
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
