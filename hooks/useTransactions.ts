import { useEffect, useState } from "react";
import type { Error } from "@/components/ErrorAlert";
import { createClient } from "@/utils/supabase/client";

export type Transaction = {
  id: number | undefined;
  account_id: number;
  date: string;
  outflow: number | null;
  inflow: number | null;
  note: string | null;
  envelope_id: number | null;
  local_id?: number;
};

export const useTransactions = (budget_id: number) => {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      setError(null);
      setIsPending(true);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("accounts")
        .select("id, transactions (*)")
        .eq("budget_id", budget_id);

      setIsPending(false);

      if (!data) {
        console.error(error);
        setError({
          title: "We could not load your transactions",
          message: "Please try again later",
        });
        return;
      }

      // extract the transaction property from the array of items
      const transactions = data.map((item) => item.transactions).flat();

      setTransactions(transactions);
    })();
  }, [budget_id]);

  const upsertTransaction = async (transaction: Transaction) => {
    const supabase = createClient();

    if (!transaction.account_id) {
      setError({
        title: "We could not save the transaction",
        message: "Account ID is required",
      });
      return;
    }

    const { local_id, ...inbound } = transaction;

    const { data: upserted, error } = await supabase
      .from("transactions")
      .upsert(inbound, { onConflict: "id", ignoreDuplicates: false })
      .select()
      .single();

    if (!upserted) throw error;

    return upserted;
  };

  return { transactions, upsertTransaction, error, isPending };
};
