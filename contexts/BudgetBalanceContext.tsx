import { createContext, useContext } from "react";
import { useBudgetBalance } from "@/hooks/useBudgetBalance";
import type { Error } from "@/components/ErrorAlert";

type BudgetBalanceContextProps = {
  budgetBalance: number | undefined;
  setBudgetBalance: (balance: number) => void;
  error: Error | null;
  isPending: boolean;
};

const BudgetBalanceContext = createContext<
  BudgetBalanceContextProps | undefined
>(undefined);

export const BudgetBalanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <BudgetBalanceContext.Provider value={useBudgetBalance()}>
      {children}
    </BudgetBalanceContext.Provider>
  );
};

export const useBudgetBalanceContext = () => {
  const context = useContext(BudgetBalanceContext);
  if (context === undefined) {
    throw new Error(
      "useBudgetBalanceContext must be used within a BudgetBalanceProvider",
    );
  }
  return context;
};
