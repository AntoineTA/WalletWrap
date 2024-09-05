import { createContext, useContext } from "react";
import { useAccounts, type Account } from "@/hooks/useAccounts";
import type { Error } from "@/components/ErrorAlert";

type AccountsContextProps = {
  accounts: Account[] | undefined;
  setAccounts: (accounts: Account[]) => void;
  balance: number | undefined;
  insertAccount: (
    account: Omit<Account, "balance" | "budget_id">,
  ) => Promise<void>;
  error: Error | null;
  isPending: boolean;
};

const AccountsContext = createContext<AccountsContextProps | undefined>(
  undefined,
);

export const AccountsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AccountsContext.Provider value={useAccounts()}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error(
      "useAccountsContext must be used within a AccountsProvider",
    );
  }
  return context;
};
