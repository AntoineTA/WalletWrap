import { useState, useEffect } from "react";
import { useEnvelopes, type Envelope } from "@/hooks/useEnvelopes";
import { useBudgetBalanceContext } from "@/contexts/BudgetBalanceContext";
import type { Error } from "@/components/ErrorAlert";

export const useEnvelopeGrid = () => {
  const { budgetBalance, setBudgetBalance } = useBudgetBalanceContext();
  const { envelopes, upsertEnvelope, deleteEnvelope, isPending } =
    useEnvelopes();

  const [saved, setSaved] = useState<Envelope[]>([]);
  const [data, setData] = useState<Envelope[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Get table data
  useEffect(() => {
    setSaved(envelopes);
    setData(envelopes);
  }, [envelopes]);

  const addRow = () => {
    setData((rows) => {
      return [
        ...rows,
        {
          id: undefined,
          name: "",
          description: null,
          budgeted: 0,
          spent: 0,
          local_id: Date.now(),
        },
      ];
    });

    //set the new row to be in edit mode
    setEditingIndex(data.length);
  };

  const editRow = (rowIndex: number) => {
    revertChanges();
    setEditingIndex(rowIndex);
  };

  const updateCell = (rowIndex: number, columnId: string, value: unknown) => {
    setData((rows) => {
      return rows.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
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
    upsertEnvelope(newRow)
      .then((upserted) => {
        // if the upserted row was new, we update the id with the one from the db
        if (newRow.id === undefined && upserted) {
          updateId(newRow, upserted.id);
        }
      })
      .catch((error) => {
        console.error(error);
        setError({
          title: "An error occured while saving the envelope",
          message: "Please try again later",
        });
      });

    // update local budget balance
    if (budgetBalance !== undefined) {
      let diff = 0;
      // if the row was updated, we calculate the difference between the old and new budgeted amount
      if (oldRow && oldRow.id === newRow.id) {
        diff = newRow.budgeted - oldRow.budgeted;
      } else {
        diff = newRow.budgeted;
      }
      setBudgetBalance(budgetBalance - diff);
    }

    setEditingIndex(null);
  };

  const removeRow = (rowIndex: number) => {
    const removedRow = data[rowIndex];

    // Remove locally
    setData((rows) => {
      return rows.filter((row, index) => index !== rowIndex);
    });
    setSaved(data);

    // if the row exists in the db, we remove it
    if (removedRow.id) {
      deleteEnvelope(removedRow.id);
    }

    // update local budget balance
    if (budgetBalance !== undefined) {
      setBudgetBalance(budgetBalance + removedRow.budgeted);
    }
  };

  const updateId = (rowToUpdate: Envelope, updatedId: number) => {
    // We change the relevant row, to not erease data.
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
    editingIndex,
    addRow,
    editRow,
    updateCell,
    revertChanges,
    saveRow,
    removeRow,
    error,
    isPending,
  };
};
