"use server";

import { createClient } from "@/utils/supabase/server";
import { Transaction } from "./page";

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

export const upsertTransaction = async (data: Transaction) => {
  const supabase = createClient();
  const { data: res, error } = await supabase
    .from("transactions")
    .upsert(data, { ignoreDuplicates: false });
};

export const deleteTransactions = async (data: Transaction[]) => {
  const supabase = createClient();

  const ids = data.map((d) => d.id);
  const { error } = await supabase.from("transactions").delete().in("id", ids);

  console.log("error", error);
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
