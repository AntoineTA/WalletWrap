import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BudgetInfoCard = ({
  budgetName,
  budgetDesc,
}: {
  budgetName?: string;
  budgetDesc?: string;
}) => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          {budgetName && budgetDesc ? (
            <>
              <CardTitle>{budgetName}</CardTitle>
              <CardDescription className="truncate hover:text-wrap">
                {budgetDesc}
              </CardDescription>
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

export const BudgetBalanceCard = ({ toBudget }: { toBudget?: number }) => {
  return (
    <div className="w-52">
      <Card>
        <CardHeader>
          {toBudget !== undefined ? (
            <CardTitle
              className={toBudget < 0 ? "text-red-500" : "text-green-500"}
            >
              {toBudget.toFixed(2)}
            </CardTitle>
          ) : (
            <Skeleton className="h-6 w-28" />
          )}
          <CardDescription>To budget</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
