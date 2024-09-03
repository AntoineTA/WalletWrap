import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Error } from "@/components/ErrorAlert";

export const useBudgetBalance = (budget_id?: number) => {
  const [error, setError] = useState<Error | null>();
  const [isPending, setIsPending] = useState(true);
  const [budgetBalance, setBudgetBalance] = useState<number | undefined>();

  useEffect(() => {
    if (!budget_id) return;

    (async () => {
      setError(null);
      setIsPending(true);

      const supabase = createClient();

      const { data } = await supabase
        .from("budgets_view")
        .select("balance")
        .eq("id", budget_id)
        .single();

      setIsPending(false);

      if (!data) {
        setError({
          title: "We could not load your budget balance",
          message: "Please try again later",
        });
        return;
      }

      setBudgetBalance(data.balance);
    })();
  }, []);

  return { error, isPending, budgetBalance, setBudgetBalance };
};
