import { useState, useEffect } from "react";
import {
  getBudget,
  getAccountsView,
  getEnvelopes,
  getEnvelopesView,
  upsertEnvelope,
} from "./accounts/actions";
import type { Error } from "@/components/ui/error-alert";
import type { Envelope } from "./EnvelopeGrid";

export type Budget = {
  name: string;
  description: string;
};

export const useTopCards = (budget_id: number) => {
  const [error, setError] = useState<Error | null>(null);
  const [budget, setBudget] = useState<Budget>();
  const [envelopes, setEnvelopes] = useState<Envelope[]>();
  const [balance, setBalance] = useState<number | undefined>();

  const getBudgetDistant = async () => {
    const { budget, error } = await getBudget(budget_id);

    if (!budget) {
      setError({
        title: "Could not fetch budget",
        message: error.message,
        code: error.code,
      });
      return;
    }

    setBudget(budget);
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

    const balance = accounts
      .map((account) => account.balance || 0)
      .reduce((acc, curr) => acc + curr, 0);
    setBalance(balance);
  };

  const getEnvelopesDistant = async () => {
    const { envelopes, error } = await getEnvelopesView(budget_id);

    if (!envelopes) {
      setError({
        title: "Could not fetch envelopes",
        message: error.message,
        code: error.code,
      });
      return;
    }
    setEnvelopes(envelopes);
  };

  useEffect(() => {
    getBudgetDistant();
    getBalance();
    getEnvelopesDistant();
  }, []);

  return { budget, balance, envelopes, error };
};

export const useEnvelopeGrid = (budget_id: number) => {
  const [envelopes, setEnvelopes] = useState<Envelope[] | undefined>();
  const [upserted, setUpserted] = useState<{
    db_id: number;
    local_id?: number;
  }>();
  const [error, setError] = useState<Error | null>(null);

  const getGridData = async () => {
    const { envelopes, error } = await getEnvelopesView(budget_id);

    if (!envelopes) {
      setError({
        title: "Could not fetch envelopes",
        message: error.message,
        code: error.code,
      });
      return;
    }

    setEnvelopes(envelopes);
  };

  const upsertDistant = async (envelope: Envelope) => {
    // Validate
    if (!envelope.name || !envelope.budget_id) {
      setError({
        title: "Could not save envelope",
        message: "Invalid data",
      });
      return;
    }

    const { local_id, spent, ...inbound } = envelope;
    const { envelope: data, error } = await upsertEnvelope(inbound);

    if (!data) {
      setError({
        title: "Could not save envelope",
        message: error.message,
        code: error.code,
      });
      return;
    }

    // update the grid with the new record
    setUpserted({ db_id: data.id, local_id });
  };

  useEffect(() => {
    console.log("getting grid data");
    getGridData();
  }, []);

  return {
    savedData: envelopes,
    setSavedData: setEnvelopes,
    upsertDistant,
    upserted,
    error,
  };
};
