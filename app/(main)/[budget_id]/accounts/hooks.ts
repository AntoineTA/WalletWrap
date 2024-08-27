import { useEffect, useState } from "react";
import {
  deleteTransactions,
  upsertTransaction,
  getTransactions,
  getAccounts,
  getBudget,
  updateAccount,
  getAccount,
  getAccountsView,
} from "./actions";
import type { Transaction } from "./TransactionTable";
import type { InboundTransaction } from "./actions";
import type { Error } from "@/components/ui/error-alert";
import type { SelectOptions } from "./TransactionTable";

export const useTransactionTable = (budget_id: number) => {
  const [transactions, setTransactions] = useState<Transaction[] | undefined>();
  const [selectOptions, setSelectOptions] = useState<SelectOptions>(undefined);
  const [upserted, setUpserted] = useState<{
    db_id: number;
    local_id?: number;
  }>();
  const [error, setError] = useState<Error | null>(null);

  const getTableData = async () => {
    const { transactions, error } = await getTransactions(budget_id);

    if (!transactions) {
      setError({
        title: "Could not fetch transactions",
        message: error.message,
        code: error.code,
      });
      return;
    }

    setTransactions(transactions);
  };

  const getAccountOptions = async () => {
    const { accounts, error } = await getAccounts(budget_id);

    if (!accounts) {
      setError({
        title: "Could not fetch accounts",
        message: error.message,
        code: error.code,
      });
      return;
    }

    const accountOptions = accounts.map((account) => ({
      id: account.id,
      label: account.name,
    }));

    setSelectOptions({ accounts: accountOptions });
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

    // change empty string to null
    const cleanTransaction = {
      ...transaction,
      outflow: transaction.outflow || null,
      inflow: transaction.inflow || null,
    };

    // Remove the local_id from the data sent to the server
    const { local_id, ...inbound } = cleanTransaction;

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

  useEffect(() => {
    console.log("fetching data from useTableData hook");
    getTableData();
    getAccountOptions();
  }, []);

  return {
    savedData: transactions,
    setSavedData: setTransactions,
    selectOptions,
    upsertDistant,
    deleteDistant,
    upserted,
    error,
  };
};

export const useTopCards = (budget_id: number) => {
  const [error, setError] = useState<Error | null>(null);
  const [budgetName, setBudgetName] = useState<string | undefined>();

  const getBudgetName = async () => {
    const { budget, error } = await getBudget(budget_id);

    if (!budget) {
      setError({
        title: "Could not fetch budget",
        message: error.message,
        code: error.code,
      });
      return;
    }

    setBudgetName(budget.name);
  };

  const getBalance = async () => {
    const { accounts, error } = await getAccountsView(budget_id);

    if (!accounts) {
      setError({
        title: "Could not fetch accounts",
        message: error.message,
        code: error.code,
      });
      return;
    }

    console.log("accounts", accounts);

    const balance = accounts
      .map((account) => account.balance || 0)
      .reduce((acc, curr) => acc + curr, 0);
    console.log("balance", balance);
    return balance;
  };

  useEffect(() => {
    console.log("fetching data from useAccountPage hook");
    getBudgetName();
  });

  return { budgetName, getBalance, error };
};
