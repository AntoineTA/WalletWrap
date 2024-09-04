import { useEffect, useState } from "react";

import { Transaction, useTransactions } from "@/hooks/useTransactions";
import { useEnvelopes } from "./useEnvelopes";
import { useAccounts } from "./useAccounts";
import type { Error } from "@/components/ErrorAlert";

export type SelectOptions = {
  accounts: { id: number; label: string }[];
  envelopes: { id: number; label: string }[];
};

export const useTransactionTable = (budget_id: number) => {
  const { transactions, upsertTransaction, ...transactionsStatus } =
    useTransactions(budget_id);
  const { envelopes, ...envelopesStatus } = useEnvelopes(budget_id);
  const { accounts, ...accountsStatus } = useAccounts(budget_id);

  const [saved, setSaved] = useState<Transaction[]>([]);
  const [data, setData] = useState<Transaction[]>([]);
  const [selectOptions, setSelectOptions] = useState<SelectOptions>();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  //Get table data
  useEffect(() => {
    console.log("transactions", transactions);
    setSaved(transactions);
    setData(transactions);
  }, [transactions]);

  //Generate select options
  useEffect(() => {
    console.log("generate options");
    if (!accounts || !envelopes) return;

    const accountOptions = accounts
      .map((account) => {
        return account.id ? { id: account.id, label: account.name } : undefined;
      })
      .filter((option) => option !== undefined);

    const envelopeOptions = envelopes
      .map((envelope) => {
        return envelope.id
          ? { id: envelope.id, label: envelope.name }
          : undefined;
      })
      .filter((option) => option !== undefined);

    console.log("accountOptions", accountOptions);
    console.log("envelopeOptions", envelopeOptions);

    setSelectOptions({ accounts: accountOptions, envelopes: envelopeOptions });
  }, [accounts, envelopes]);

  // Define isPending
  useEffect(() => {
    console.log("isPending");
    const isPending =
      transactionsStatus.isPending ||
      envelopesStatus.isPending ||
      accountsStatus.isPending;
    setIsPending(isPending);
  }, [
    transactionsStatus.isPending,
    envelopesStatus.isPending,
    accountsStatus.isPending,
  ]);

  // Define error
  useEffect(() => {
    console.log("error");
    const error =
      transactionsStatus.error || envelopesStatus.error || accountsStatus.error;
    if (error) {
      console.error(error);
      setError({
        title: "An error occurred",
        message: "Please try again later",
      });
    }
  }, [transactionsStatus.error, envelopesStatus.error, accountsStatus.error]);

  const createRow = () => {
    if (!selectOptions || selectOptions.accounts.length === 0) {
      setError({
        title: "No accounts available",
        message: "Please create an account before adding a transaction",
      });
      return;
    }

    setData((rows) => {
      return [
        {
          id: undefined,
          account_id: selectOptions.accounts[0].id,
          date: new Date().toISOString(),
          outflow: null,
          inflow: null,
          note: null,
          envelope_id: null,
          local_id: Date.now(),
        },
        ...rows,
      ];
    });
  };

  const updateCell = (
    rowIndex: number,
    columnId: string,
    updatedValue: unknown,
  ) => {
    setData((rows) => {
      return rows.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, [columnId]: updatedValue };
        }
        return row;
      });
    });
  };

  const loadSaved = () => {
    setData(saved);
  };

  const saveRow = async (rowIndex: number) => {
    const newRow = data[rowIndex];
    const upserted = await upsertTransaction(newRow);

    upserted
      ? console.log("upserted", upserted)
      : console.log("could not upsert");
  };

  return {
    data,
    saved,
    selectOptions,
    createRow,
    updateCell,
    loadSaved,
    saveRow,
    isPending,
    error,
  };
};
