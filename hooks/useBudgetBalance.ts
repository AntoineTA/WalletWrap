import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/hooks/useSession";
import type { Error } from "@/components/ErrorAlert";

export const useBudgetBalance = () => {
  const { getUserId } = useSession();
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [budgetBalance, setBudgetBalance] = useState<number | undefined>();

  const supabase = createClient();
  useEffect(() => {
    (async () => {
      setError(null);
      setIsPending(true);

      const user_id = await getUserId();

      const { data } = await supabase
        .from("budgets_view")
        .select("balance")
        .eq("user_id", user_id)
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
