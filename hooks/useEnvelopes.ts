import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/hooks/useSession";
import type { Error } from "@/components/ErrorAlert";

export type Envelope = {
  id: number | undefined;
  name: string;
  description: string | null;
  budgeted: number;
  spent: number;
  local_id?: number;
};

export const useEnvelopes = () => {
  const supabase = createClient();
  const { getBudgetId } = useSession();

  const [error, setError] = useState<Error | null>();
  const [isPending, setIsPending] = useState(true);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);

  useEffect(() => {
    (async () => {
      setError(null);
      setIsPending(true);

      const budget_id = await getBudgetId();

      const { data } = await supabase
        .from("envelopes_view")
        .select("*")
        .eq("budget_id", budget_id);

      setIsPending(false);

      if (!data) {
        setError({
          title: "We could not find your envelopes",
          message: "Please try again later",
        });
        return;
      }

      setEnvelopes(data);
    })();
  }, []);

  const upsertEnvelope = async (envelope: Envelope) => {
    const { local_id, spent, ...inbound } = envelope;

    const budget_id = await getBudgetId();

    const { data: upserted, error } = await supabase
      .from("envelopes")
      .upsert(
        { ...inbound, budget_id },
        { onConflict: "id", ignoreDuplicates: false },
      )
      .select()
      .single();

    if (!upserted) throw error;

    return upserted;
  };

  const deleteEnvelope = async (id: number) => {
    const { error } = await supabase.from("envelopes").delete().eq("id", id);

    if (error) {
      setError({
        title: "We could not delete the envelope",
        message: "Please try again later",
      });
    }
  };

  return {
    error,
    isPending,
    envelopes,
    upsertEnvelope,
    deleteEnvelope,
  };
};
