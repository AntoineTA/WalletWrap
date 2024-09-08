import { useEffect, useState } from "react";

import { type Transaction, useTransactions } from "@/hooks/useTransactions";
import { useEnvelopes } from "@/hooks/useEnvelopes";
import { useAccountsContext } from "@/contexts/AccountsContext";
import type { Error } from "@/components/ErrorAlert";

export type SelectOptions = {
  accounts: { id: number; label: string }[];
  envelopes: { id: number; label: string }[];
};

export const useTransactionTable = () => {
  const {
    accounts,
    setAccounts,
    isPending: accountsIsPending,
    error: accountsError,
  } = useAccountsContext();
  const {
    transactions,
    upsertTransaction,
    deleteTransaction,
    deleteTransactions,
    isPending: transactionsIsPending,
    error: transactionsError,
  } = useTransactions();
  const {
    envelopes,
    isPending: envelopesIsPending,
    error: envelopesError,
  } = useEnvelopes();

  const [saved, setSaved] = useState<Transaction[]>([]);
  const [data, setData] = useState<Transaction[]>([]);
  const [selectOptions, setSelectOptions] = useState<SelectOptions>();
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  //Get table data
  useEffect(() => {
    console.log("transactions");
    if (!transactions) return;

    // Sort by date descending
    transactions.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

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

    setSelectOptions({
      accounts: accountOptions ?? { id: null, label: null },
      envelopes: envelopeOptions ?? { id: null, label: null },
    });
  }, [accounts, envelopes]);

  // Define isPending
  useEffect(() => {
    setIsPending(
      accountsIsPending || transactionsIsPending || envelopesIsPending,
    );
  }, [accountsIsPending, transactionsIsPending, envelopesIsPending]);

  // Define error
  useEffect(() => {
    if (transactionsError || envelopesError || accountsError) {
      setError({
        title: "An error occurred",
        message: "Please try again later",
      });
    }
  }, [transactionsError, envelopesError, accountsError]);

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

    // sort the data by date descending
    const sortedData = [...data].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // save locally
    setSaved(sortedData);
    setData(sortedData);

    // save to db
    upsertTransaction(newRow)
      .then((upserted) => {
        // if the upserted row was new, we update the id with the one from the db
        if (newRow.id === undefined && upserted) {
          updateId(newRow, upserted.id);
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
    if (accounts !== undefined) {
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
    }

    setEditingIndex(null);
  };

  const removeRow = (rowIndex: number) => {
    const removedRow = data[rowIndex];

    // remove locally
    setData((rows) => {
      return rows.filter((_, index) => index !== rowIndex);
    });
    setSaved(data);

    // if the row exists in the db, we remove it
    if (removedRow.id) {
      deleteTransaction(removedRow.id);
    }

    // update local account balance
    if (accounts !== undefined) {
      const diff = (removedRow.inflow || 0) - (removedRow.outflow || 0);
      const updatedAccounts = accounts.map((account) => {
        if (account.id === removedRow.account_id) {
          return { ...account, balance: account.balance - diff };
        }
        return account;
      });
      setAccounts(updatedAccounts);
    }
  };

  const removeRows = (rowsIndices: number[]) => {
    const removedRows = rowsIndices.map((index) => data[index]);

    // remove locally
    setData((rows) => {
      return rows.filter((_, i) => !rowsIndices.includes(i));
    });
    setSaved(data);

    // remove from db
    const removedIds = removedRows
      .map((row) => row.id)
      .filter((id) => id !== undefined);
    if (removedIds.length > 0) {
      deleteTransactions(removedIds);
    }

    // update local account balance
    if (accounts !== undefined) {
      const diff = removedRows.reduce((acc, row) => {
        return acc + ((row.inflow || 0) - (row.outflow || 0));
      }, 0);
      const updatedAccounts = accounts.map((account) => {
        if (removedRows.some((row) => row.account_id === account.id)) {
          return { ...account, balance: account.balance - diff };
        }
        return account;
      });
      setAccounts(updatedAccounts);
    }
  };

  const updateId = (rowToUpdate: Transaction, updatedId: number) => {
    setData((rows) => {
      return rows.map((row) => {
        if (row.local_id === rowToUpdate.local_id) {
          return { ...row, id: updatedId };
        }
        return row;
      });
    });
    setSaved((rows) => {
      return rows.map((row) => {
        if (row.local_id === rowToUpdate.local_id) {
          return { ...row, id: updatedId };
        }
        return row;
      });
    });
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
    removeRow,
    removeRows,
    isPending,
    error,
  };
};
