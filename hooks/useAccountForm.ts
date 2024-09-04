import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Error } from "@/components/ErrorAlert";
import type { Account } from "./useAccounts";
import { createClient } from "@/utils/supabase/client";

export const formSchema = z.object({
  name: z.string(),
  type: z.string(),
  starting_balance: z.coerce.number(),
});

export const useAccountForm = (budget_id: number) => {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "checking",
      starting_balance: 0,
    },
    mode: "onTouched",
  });

  const createAccount = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setIsPending(true);

    const account = { ...values, budget_id };
    const supabase = createClient();

    const { error } = await supabase.from("accounts").insert(account);

    setIsPending(false);

    if (error) {
      setError({
        title: "We could not add the account",
        message: "Please try again later.",
      });
    }
  };

  return { error, isPending, form, createAccount };
};
