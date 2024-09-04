import { useEffect, useState } from "react";

import { Transaction, useTransactions } from "@/hooks/useTransactions";
import { useEnvelopes } from "./useEnvelopes";
import { Account, useAccounts } from "./useAccounts";
import type { Error } from "@/components/ErrorAlert";

export type SelectOptions = {
  accounts: { id: number; label: string }[];
  envelopes: { id: number; label: string }[];
};

export const useTransactionTable = (
  budget_id: number,
  accounts: Account[],
  setAccounts: (accounts: Account[]) => void,
) => {
  const { transactions, upsertTransaction, ...transactionsStatus } =
    useTransactions(budget_id);
  const { envelopes, ...envelopesStatus } = useEnvelopes(budget_id);
  const { ...accountsStatus } = useAccounts(budget_id);

  const [saved, setSaved] = useState<Transaction[]>([]);
  const [data, setData] = useState<Transaction[]>([]);
  const [selectOptions, setSelectOptions] = useState<SelectOptions>();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  //Get table data
  useEffect(() => {
    console.log("transactions", transactions);
    setSaved(transactions);
    setData(transactions);
  }, [transactions]);

  //Generate select options
  useEffect(() => {
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

    setSelectOptions({ accounts: accountOptions, envelopes: envelopeOptions });
  }, [accounts, envelopes]);

  // Define isPending
  useEffect(() => {
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

  const addRow = () => {
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

    // Set the new row in editing mode
    setEditingIndex(0);
  };

  const editRow = (rowIndex: number) => {
    revertChanges();
    setEditingIndex(rowIndex);
  };

  const updateCell = (rowIndex: number, columnId: string, value: unknown) => {
    setData((rows) => {
      return rows.map((row, index) => {
        if (index === rowIndex) {
          return { ...row, [columnId]: value };
        }
        return row;
      });
    });
  };

  const revertChanges = () => {
    setData(saved);
    setEditingIndex(null);
  };

  const saveRow = (rowIndex: number) => {
    const newRow = data[rowIndex];
    const oldRow = saved[rowIndex];

    // save locally
    setSaved(data);

    // save to db
    upsertTransaction(newRow)
      .then((upserted) => {
        // if the upserted row was new, we update the id with the one from the db
        if (newRow.id === undefined && upserted) {
          setSaved((rows) => {
            return rows.map((row) => {
              if (row.local_id === newRow.local_id) {
                return { ...row, id: upserted.id };
              }
              return row;
            });
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setError({
          title: "An error occurred while saving the transaction",
          message: "Please try again later",
        });
      });

    // update account balance
    let diff = 0;
    // If the row was updated, we calculate the difference between the old and new inflow/outflow
    if (oldRow && oldRow.id === newRow.id) {
      const diffInflow = (newRow.inflow || 0) - (oldRow.inflow || 0);
      const diffOutflow = (newRow.outflow || 0) - (oldRow.outflow || 0);
      diff = diffInflow - diffOutflow;
    } else {
      // we get the difference between the current inflow and outflow
      diff = (newRow.inflow || 0) - (newRow.outflow || 0);
    }
    const updatedAccounts = accounts.map((account) => {
      if (account.id === newRow.account_id) {
        return { ...account, balance: account.balance + diff };
      }
      return account;
    });
    setAccounts(updatedAccounts);

    setEditingIndex(null);
  };

  return {
    data,
    saved,
    selectOptions,
    editingIndex,
    addRow,
    editRow,
    updateCell,
    revertChanges,
    saveRow,
    isPending,
    error,
  };
};
