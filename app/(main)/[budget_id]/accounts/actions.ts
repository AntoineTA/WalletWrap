"use server";

import { createClient } from "@/utils/supabase/server";

export type InboundTransaction = {
  id: number | undefined;
  account_id: number;
  date: string;
  outflow: number | null;
  inflow: number | null;
  note: string | null;
};

export const getTransactions = async (budget_id: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("id, transactions (*)")
    .eq("budget_id", budget_id);

  if (!data)
    return {
      error: {
        title: "Could not fetch transactions",
        message: error.message,
        code: error.code,
      },
    };

  const transactions = data.flatMap((account) => {
    return account.transactions.map((transaction) => ({
      id: transaction.id,
      account_id: account.id,
      date: transaction.date,
      outflow: transaction.outflow,
      inflow: transaction.inflow,
      note: transaction.note,
    }));
  });

  return { transactions };
};

export const upsertTransaction = async (data: InboundTransaction) => {
  const supabase = createClient();

  const { data: transaction, error } = await supabase
    .from("transactions")
    .upsert(data, { onConflict: "id", ignoreDuplicates: false })
    .select()
    .single();

  if (error)
    return {
      error: {
        title: "Could not save transaction",
        message: error.message,
        code: error.code,
      },
    };

  return { transaction };
};

export const deleteTransactions = async (ids: number[]) => {
  const supabase = createClient();

  const { error } = await supabase.from("transactions").delete().in("id", ids);

  if (error)
    return {
      error: {
        title: "Could not delete transactions",
        message: error.message,
        code: error.code,
      },
    };

  return { error: null };
};

export const getAccounts = async (budget_id: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("accounts")
    .select()
    .eq("budget_id", budget_id);

  if (!data)
    return {
      error: {
        title: "Could not fetch accounts",
        message: error.message,
        code: error.code,
      },
    };

  return { accounts: data };
};
