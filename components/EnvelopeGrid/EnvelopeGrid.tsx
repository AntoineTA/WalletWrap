import { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { type Envelope, useEnvelopes } from "@/hooks/useEnvelopes";
import { useEnvelopeGrid } from "@/hooks/useEnvelopeGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ErrorAlert } from "@/components/ErrorAlert";
import { AddRowButton, CancelButton } from "./ControlButtons";
import { EditMenu } from "./EditMenu";
import { NumberField, TextField } from "./InputCells";
import { columns } from "./columns";

export const EnvelopeGrid = ({ budget_id }: { budget_id: number }) => {
  const {
    data,
    editingIndex,
    addRow,
    editRow,
    updateCell,
    revertChanges,
    saveRow,
    removeRow,
    isPending,
    error,
  } = useEnvelopeGrid(budget_id);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editingIndex,
      addRow,
      editRow,
      updateCell,
      revertChanges,
      saveRow,
      removeRow,
    },
  });

  const remaining = (row: Row<Envelope>) =>
    row.getValue<number>("budgeted") - row.getValue<number>("spent");

  return (
    <div>
      {error && <ErrorAlert {...error} />}

      {!error && (
        <div className="flex items-center py-4">
          {editingIndex === null && (
            <AddRowButton table={table} disabled={isPending} />
          )}
          {editingIndex !== null && <CancelButton table={table} />}
        </div>
      )}

      {isPending && <div className="flex justify-center my-12">Loading...</div>}

      {!isPending && data.length === 0 && (
        <div className="flex justify-center text-slate-600 text-center my-12">
          <div>
            <div className="font-semibold">Nothing there yet!</div>
            <div>Add an envelope to get started</div>
          </div>
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
