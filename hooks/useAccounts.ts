import { useEffect, useState } from "react";
import type { Error } from "@/components/ErrorAlert";
import { createClient } from "@/utils/supabase/client";

export type Account = {
  id: number | undefined;
  budget_id: number;
  starting_balance: number;
  name: string;
  balance: number;
  type: string;
};

export const useAccounts = (budget_id: number) => {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [accounts, setAccounts] = useState<Account[] | undefined>();
  const [balance, setBalance] = useState<number | undefined>();

  useEffect(() => {
    (async () => {
      setError(null);
      setIsPending(true);

      const supabase = createClient();

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

      const balance = data
        .map((account) => account.balance)
        .reduce((acc, curr) => acc + curr, 0);
      setBalance(balance);
    })();
  }, [budget_id]);

  return { error, isPending, accounts, balance };
};
