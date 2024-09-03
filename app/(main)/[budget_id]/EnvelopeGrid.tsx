"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  type Row,
} from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AddRowButton, CancelButton } from "./ControlButton";
import { EditMenu } from "./EditMenu";
import { NumberField, TextField } from "./InputCells";
import { useEnvelopeGrid } from "./hooks";
import { ErrorAlert } from "@/components/ui/error-alert";

export type Envelope = {
  id: number | undefined;
  budget_id: number;
  name: string;
  description: string | null;
  budgeted: number;
  spent: number;
  local_id?: number | undefined;
};

type EnvelopeGridProps = {
  columns: ColumnDef<Envelope>[];
  budget_id: number;
  toBudget: number | undefined;
  setToBudget: (toBudget: number) => void;
};

const EnvelopeGrid = ({
  columns,
  budget_id,
  toBudget,
  setToBudget,
}: EnvelopeGridProps) => {
  const {
    savedData,
    setSavedData,
    upsertDistant,
    deleteDistant,
    upserted,
    error,
  } = useEnvelopeGrid(budget_id);
  const [data, setData] = useState<Envelope[]>([]);
  const [localId, setLocalId] = useState<number>(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!upserted) return;

    // If upsert is over, we can update the new row with the db id
    if (upserted) {
      data.map((row) => {
        if (row.local_id === upserted.local_id) {
          row.id = upserted.db_id;
        }
      });
    }
  }, [upserted]);

  useEffect(() => {
    if (!savedData) return;
    setData(savedData);
  }, [savedData]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editingIndex,
      setEditingIndex,
      updateCell: (rowIndex, columnId, value) => {
        setData((old) => {
          return old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                [columnId]: value,
              };
            }
            return row;
          });
        });
      },
      saveRow: (rowIndex) => {
        const oldRow = savedData ? savedData[rowIndex] : null;
        const newRow = data[rowIndex];

        if (toBudget === undefined) {
          console.error("Budget balance could not be loaded");
          return;
        }

        setEditingIndex(null);

        if (newRow.id) {
          newRow.local_id = localId;
          setLocalId(localId + 1);
        }

        // const updated = [...data];
        setSavedData([...data]);
        upsertDistant(newRow);

        // update local remaining budget amount
        if (oldRow && newRow.budgeted !== oldRow.budgeted) {
          const diff = oldRow.budgeted - newRow.budgeted;
          setToBudget(toBudget + diff);
        }
      },
      revertChanges: () => {
        if (!savedData) return;
        setEditingIndex(null);
        setData(savedData);
      },
      addRow: () => {
        setData((old) => {
          return [
            ...old,
            {
              id: undefined,
              budget_id: budget_id,
              name: "",
              description: null,
              budgeted: 0,
              spent: 0,
            },
          ];
        });
        setEditingIndex(data.length);
      },
      removeRow: (rowIndex) => {
        const removedRow = data[rowIndex];

        // update remaining budget amount
        if (toBudget === undefined) {
          console.error("Budget balance could not be loaded");
          return;
        }
        setToBudget(toBudget + removedRow.budgeted);

        if (removedRow.id) deleteDistant(removedRow.id);
        const updated = data.filter((_, index) => index !== rowIndex);
        setSavedData(updated);
      },
      removeRows: () => {
        console.log("remove envelopes");
      },
    },
  });

  const remaining = (row: Row<Envelope>) =>
    row.getValue<number>("budgeted") - row.getValue<number>("spent");

  return (
    <div>
      {error && <ErrorAlert {...error} />}
      {!error && (
        <div className="flex items-center py-4">
          <AddRowButton table={table} disabled={!savedData} />
          {editingIndex !== null ? <CancelButton table={table} /> : null}
        </div>
      )}
      {table.getRowModel().rows?.length === 0 && (
        <div className="flex justify-center text-slate-600 text-center my-12">
          {savedData ? (
            <div>
              <div className="font-semibold">Nothing there yet!</div>
              <div>Add an envelope to get started</div>
            </div>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      )}
      <div className="flex flex-wrap">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.index} className="m-2 w-full lg:w-80 relative">
            <div className="absolute right-0 m-4">
              <EditMenu row={row} table={table} />
            </div>
            <CardHeader className="h-28">
              <CardTitle>
                <TextField
                  row={row}
                  table={table}
                  columnId="name"
                  className="text-2xl font-semibold leading-none tracking-tight p-1 w-2/3 h-8"
                />
              </CardTitle>
              <CardDescription>
                <TextField
                  row={row}
                  table={table}
                  columnId="description"
                  className="text-sm text-muted-foreground p-1 w-2/3 h-4"
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-8 lg:justify-between">
              <div className="text-right">
                <div className="text-xs mb-1">Budgeted</div>
                <NumberField
                  row={row}
                  table={table}
                  columnId="budgeted"
                  className="w-20 p-0 h-6 text-right"
                />
              </div>
              <div className="text-right">
                <div className="text-xs mb-1 ">Spent</div>
                <div>{row.getValue<number>("spent").toFixed(2)}</div>
              </div>
              <Separator orientation="vertical" className="h-11 bg-slate-600" />
              <div className="text-right">
                <div className="text-xs mb-1">Remaining</div>
                <div
                  className={cn(
                    remaining(row) < 0 ? "text-red-500" : "text-black",
                    "text-lg font-medium",
                  )}
                >
                  {remaining(row).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default EnvelopeGrid;
