import { useState, useEffect } from "react";
import type { Envelope } from "@/hooks/useEnvelopes";

export const useEnvelopeGrid = (envelopes: Envelope[]) => {
  const [saved, setSaved] = useState<Envelope[]>([]);
  const [data, setData] = useState<Envelope[]>([]);

  useEffect(() => {
    setSaved(envelopes);
    setData(envelopes);
  }, [envelopes]);

  const createCard = (budget_id: number) => {
    setData((cards) => {
      return [
        ...cards,
        {
          id: undefined,
          budget_id: budget_id,
          name: "",
          description: null,
          budgeted: 0,
          spent: 0,
          local_id: Date.now(),
        },
      ];
    });
  };

  const updateField = (
    index: number,
    field: string,
    updatedValue: string | number,
  ) => {
    setData((cards) => {
      return cards.map((card, i) => {
        if (i === index) {
          return {
            ...card,
            [field]: updatedValue,
          };
        }
        return card;
      });
    });
  };

  const loadSaved = () => {
    setData(saved);
  };

  const deleteCard = (index: number) => {
    setData((cards) => {
      return cards.filter((card, i) => i !== index);
    });
    setSaved(data);
  };

  return { data, saved, createCard, updateField, loadSaved, deleteCard };
};
