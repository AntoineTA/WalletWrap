"use server";

import { createClient } from "@/utils/supabase/server";
import { Envelope } from "../hooks";

export type InboundTransaction = {
  id: number | undefined;
  account_id: number;
  date: string;
  outflow: number | null;
  inflow: number | null;
  note: string | null;
  envelope_id: number | null;
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
      envelope_id: transaction.envelope_id,
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

export const getAccount = async (account_id: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("accounts")
    .select()
    .eq("id", account_id)
    .single();

  if (!data)
    return {
      error: {
        title: "Could not fetch account",
        message: error.message,
        code: error.code,
      },
    };

  return { account: data };
};

export const getAccountsView = async (budget_id: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("accounts_view")
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

export const updateAccount = async (
  account_id: number,
  data: { name?: string; balance?: number },
) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("accounts")
    .update(data)
    .eq("id", account_id);

  if (error)
    return {
      error: {
        title: "Could not update account",
        message: error.message,
        code: error.code,
      },
    };

  return { error: null };
};

export const getBudget = async (budget_id: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("budgets")
    .select()
    .eq("id", budget_id)
    .single();

  if (!data)
    return {
      error: {
        title: "Could not fetch budget",
        message: error.message,
        code: error.code,
      },
    };

  return { budget: data };
};

export const getEnvelopes = async (budget_id: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("envelopes")
    .select()
    .eq("budget_id", budget_id);

  if (!data)
    return {
      error: {
        title: "Could not fetch envelope",
        message: error.message,
        code: error.code,
      },
    };

  return { envelopes: data };
};

export const getEnvelopesView = async (budget_id: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("envelopes_view")
    .select()
    .eq("budget_id", budget_id);

  if (!data)
    return {
      error: {
        title: "Could not fetch envelopes",
        message: error.message,
        code: error.code,
      },
    };

  return { envelopes: data as Envelope[] };
};
