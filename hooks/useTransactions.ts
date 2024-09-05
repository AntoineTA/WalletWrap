import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/hooks/useSession";
import type { Error } from "@/components/ErrorAlert";

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

export const useTransactions = () => {
  const supabase = createClient();

  const { getBudgetId } = useSession();
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch transactions
  useEffect(() => {
    (async () => {
      setError(null);
      setIsPending(true);

      const budget_id = await getBudgetId();

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
  }, []);

  const upsertTransaction = async (transaction: Transaction) => {
    const supabase = createClient();

    const { local_id, ...inbound } = transaction;

    const { data: upserted, error } = await supabase
      .from("transactions")
      .upsert(inbound, { onConflict: "id", ignoreDuplicates: false })
      .select()
      .single();

    if (!upserted) throw error;

    return upserted;
  };

  const deleteTransaction = async (id: number) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      setError({
        title: "We could not delete the transaction",
        message: "Please try again later",
      });
    }
  };

  const deleteTransactions = async (ids: number[]) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("transactions")
      .delete()
      .in("id", ids);

    if (error) {
      setError({
        title: "We could not delete the transactions",
        message: "Please try again later",
      });
    }
  };

  return {
    transactions,
    upsertTransaction,
    deleteTransaction,
    deleteTransactions,
    error,
    isPending,
  };
};
