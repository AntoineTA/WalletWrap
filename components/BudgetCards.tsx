import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BudgetBalanceCard = ({
  budgetBalance,
}: {
  budgetBalance: number;
}) => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          <CardTitle
            className={budgetBalance < 0 ? "text-red-500" : "text-green-500"}
          >
            {budgetBalance.toFixed(2)}
          </CardTitle>
          <CardDescription>To budget</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-16" />
        </CardHeader>
      </Card>
    </div>
  );
};
