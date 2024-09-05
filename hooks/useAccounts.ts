import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/hooks/useSession";
import type { Error } from "@/components/ErrorAlert";

export type Account = {
  id: number | undefined;
  starting_balance: number;
  name: string;
  balance: number;
  type: string;
};

export const useAccounts = () => {
  const supabase = createClient();
  const { getBudgetId } = useSession();
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [accounts, setAccounts] = useState<Account[] | undefined>();
  const [balance, setBalance] = useState<number | undefined>();

  // get accounts
  useEffect(() => {
    (async () => {
      setError(null);
      setIsPending(true);

      const budget_id = await getBudgetId();

      const { data } = await supabase
        .from("accounts_view")
        .select("*")
        .eq("budget_id", budget_id);

      setIsPending(false);

      if (!data) {
        setError({
          title: "We could not load your accounts",
          message: "Please try again later",
        });
        return;
      }
      setAccounts(data);
    })();
  }, []);

  // get balance
  useEffect(() => {
    if (!accounts) return;

    const balance = accounts.reduce((acc, account) => {
      return acc + account.balance;
    }, 0);

    setBalance(balance);
  }, [accounts]);

  const insertAccount = async (
    account: Omit<Account, "budget_id" | "balance">,
  ) => {
    setError(null);
    setIsPending(true);

    const budget_id = await getBudgetId();

    const { error } = await supabase
      .from("accounts")
      .insert({ ...account, budget_id });

    setIsPending(false);

    if (error) {
      setError({
        title: "We could not add the account",
        message: "Please try again later",
      });
    }
  };

  return { accounts, setAccounts, balance, insertAccount, error, isPending };
};
