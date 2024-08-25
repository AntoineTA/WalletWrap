import { useState } from "react";
import {
  deleteTransactions,
  upsertTransaction,
  getTransactions,
  getAccounts,
} from "./actions";
import type { Transaction } from "./TransactionTable";
import type { InboundTransaction } from "./actions";
import type { Error } from "@/components/ui/error-alert";

export const useTableData = () => {
  const [upserted, setUpserted] = useState<{
    db_id: number;
    local_id?: number;
  }>();
  const [error, setError] = useState<Error | null>(null);

  const getTableData = async (budget_id: number) => {
    const { transactions, error } = await getTransactions(budget_id);

    if (!transactions) {
      setError({
        title: "Could not fetch transactions",
        message: error.message,
        code: error.code,
      });
      return;
    }

    return transactions;
  };

  const getAccountOptions = async (budget_id: number) => {
    const { accounts, error } = await getAccounts(budget_id);

    if (!accounts) {
      setError({
        title: "Could not fetch accounts",
        message: error.message,
        code: error.code,
      });
      return;
    }

    const options = accounts.map((account) => ({
      id: account.id,
      label: account.name,
    }));

    return options;
  };

  const upsertDistant = async (transaction: Transaction) => {
    // Valdiate the data
    if (typeof transaction.account_id !== "number") {
      setError({
        title: "Invalid data",
        message: "No account selected",
      });
      return;
    }

    // Remove the local_id from the data sent to the server
    const { local_id, ...inbound } = transaction;

    const { transaction: data, error } = await upsertTransaction(
      inbound as InboundTransaction,
    );

    if (!data) {
      setError({
        title: "Could not save transaction",
        message: error.message,
        code: error.code,
      });
      return;
    }

    // Update the data in the table with the new record
    setUpserted({ db_id: data!.id, local_id });
  };

  const deleteDistant = async (ids: (number | undefined)[]) => {
    // If an id is undefined, then the data was never saved  to the database and don't need to be deleted
    const idsToDelete = ids.filter((id) => id !== undefined);

    const res = await deleteTransactions(idsToDelete);

    if (res.error) {
      setError({
        title: "Could not delete transactions",
        message: res.error.message,
        code: res.error.code,
      });
    }
  };

  return {
    getTableData,
    getAccountOptions,
    upsertDistant,
    deleteDistant,
    upserted,
    error,
  };
};
