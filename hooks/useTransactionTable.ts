import { useEffect, useState } from "react";

import { Transaction, useTransactions } from "@/hooks/useTransactions";
import { useEnvelopes } from "./useEnvelopes";
import { useAccounts } from "./useAccounts";

export type SelectOptions = {
  accounts: { id: number; label: string }[];
  envelopes: { id: number; label: string }[];
};

export const useTransactionTable = (budget_id: number) => {
  const { transactions } = useTransactions(budget_id);
  const { envelopes } = useEnvelopes(budget_id);
  const { accounts } = useAccounts(budget_id);

  const [saved, setSaved] = useState<Transaction[]>([]);
  const [data, setData] = useState<Transaction[]>([]);
  const [selectOptions, setSelectOptions] = useState<SelectOptions>();

  //Get table data
  useEffect(() => {
    setSaved(transactions);
    setData(transactions);
  }, [transactions]);

  //Generate select options
  useEffect(() => {
    if (!(accounts && envelopes)) return;
    const accountOptions = accounts.map((account) => {
      return { id: account.id, label: account.name };
    });
    const envelopeOptions = envelopes.map((envelope) => {
      return { id: envelope.id, label: envelope.name };
    });
  }, [accounts, envelopes]);

  return { data, saved };
};
