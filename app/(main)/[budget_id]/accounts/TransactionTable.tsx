"use client";

import { useEffect, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowData,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { AddRowButton, CancelButton, RemoveRowsButton } from "./ControlButtons";
import { useTransactionTable } from "./hooks";
import { ErrorAlert } from "@/components/ui/error-alert";

export type Transaction = {
  id: number | undefined;
  account_id: number | undefined;
  date: string | undefined;
  outflow: number | null;
  inflow: number | null;
  note: string | null;
  envelope_id: number | null;
  local_id?: number | undefined;
};

export type SelectOptions =
  | {
      accounts: { id: number; label: string }[];
      envelopes: { id: number; label: string }[];
    }
  | undefined;
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    selectOptions?: SelectOptions;
    editingIndex: number | null;
    setEditingIndex: (index: number | null) => void;
    updateCell: (rowIndex: number, columnId: string, value: any) => void;
    saveRow: (rowIndex: number) => void;
    revertChanges: () => void;
    addRow: () => void;
    removeRow: (rowIndex: number) => void;
    removeRows: (rowIndices: number[]) => void;
  }
}

type TransactionTableProps = {
  columns: ColumnDef<Transaction>[];
  budget_id: number;
  balance: number | undefined;
  setBalance: (balance: number) => void;
};

export function TransactionTable({
  columns,
  budget_id,
  balance,
  setBalance,
}: TransactionTableProps) {
  const {
    savedData,
    setSavedData,
    selectOptions,
    deleteDistant,
    upsertDistant,
    upserted,
    error,
  } = useTransactionTable(budget_id);
  const [data, setData] = useState<Transaction[]>([]); // store the data currently contained by the table
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
    enableRowSelection: true,
    state: {},
    meta: {
      editingIndex,
      setEditingIndex,
      selectOptions,
      updateCell: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
      saveRow: (rowIndex) => {
        const oldRow = savedData ? savedData[rowIndex] : null;
        const newRow = data[rowIndex];

        if (!newRow.account_id) {
          console.error("Account is required");
          return;
        }
        if (balance === undefined) {
          console.error("Balance could not be loaded");
          return;
        }

        setEditingIndex(null);

        // If the row was just added, we need a local_id to keep track of it
        if (!newRow.id) {
          newRow.local_id = localId;
          setLocalId(localId + 1);
        }

        // sort by date descending
        const updated = [...data].sort((a, b) => {
          if (!b.date) return 1;
          if (!a.date) return -1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        // update the data in the table and remotely
        setSavedData(updated);
        upsertDistant(newRow);

        let diff = 0;
        // If the row was updated
        if (oldRow && oldRow.id === newRow.id) {
          //we take the difference between the old and new inflow/outflow
          const diffInflow = (newRow.inflow || 0) - (oldRow.inflow || 0);
          const diffOutflow = (newRow.outflow || 0) - (oldRow.outflow || 0);
          diff = diffInflow - diffOutflow;
        } else {
          // we get the difference between the current inflow and outflow
          diff = (newRow.inflow || 0) - (newRow.outflow || 0);
        }
        setBalance(balance + diff);
      },
      revertChanges: () => {
        if (!savedData) return;
        setEditingIndex(null);
        setData(savedData);
      },
      addRow: () => {
        setData((old) => {
          return [
            {
              id: undefined,
              account_id: undefined,
              date: undefined,
              note: null,
              outflow: null,
              inflow: null,
              envelope_id: null,
              local_id: undefined,
            },
            ...old,
          ];
        });
        setEditingIndex(0); //set the new row in edit mode
      },
      removeRow: (rowIndex) => {
        const removedRow = data[rowIndex];

        // update balance
        if (balance === undefined) {
          console.error("Balance could not be loaded");
          return;
        }
        const diff = (removedRow.inflow || 0) - (removedRow.outflow || 0);
        setBalance(balance - diff);

        deleteDistant([removedRow.id]);
        const updated = data.filter((_row, index) => index !== rowIndex);
        setSavedData(updated);
      },
      removeRows: (rowsIndices) => {
        // update balance
        if (balance === undefined) {
          console.error("Balance could not be loaded");
          return;
        }
        const diff = rowsIndices.reduce((acc, index) => {
          const row = data[index];
          return acc + ((row.inflow || 0) - (row.outflow || 0));
        }, 0);
        setBalance(balance - diff);

        deleteDistant(rowsIndices.map((index) => data[index].id));
        const updated = data.filter(
          (_row, index) => !rowsIndices.includes(index),
        );
        setSavedData(updated);
      },
    },
  });

  return (
    <div>
      {error && <ErrorAlert {...error} />}
      {!error && (
        <div>
          <div className="flex items-center py-4">
            <AddRowButton
              table={table}
              disabled={!(savedData && selectOptions)}
            />
            {editingIndex !== null ? <CancelButton table={table} /> : null}
            {table.getSelectedRowModel().rows.length > 0 ? (
              <RemoveRowsButton table={table} />
            ) : null}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="capitalize">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length && selectOptions ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-0 h-12"
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-12 text-center"
                    >
                      {!(savedData && selectOptions) ? (
                        <span>Loading...</span>
                      ) : (
                        <span>No transactions found</span>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
