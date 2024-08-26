"use client";

import { useEffect, useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
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
  local_id?: number | undefined;
};

export type SelectOptions =
  | {
      accounts: { id: number; label: string }[];
    }
  | undefined;
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    selectOptions: SelectOptions;
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
};

export function TransactionTable({
  columns,
  budget_id,
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
    console.log("upserted", upserted);
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
        let toSave = data[rowIndex];

        // If the row was just added, we need a local_id to keep track of it
        if (!toSave.id) {
          toSave.local_id = localId;
          setLocalId(localId + 1);
        }

        // sort by date descending
        const updated = [...data].sort((a, b) => {
          if (!b.date) return 1;
          if (!a.date) return -1;
          return new Date(b.date).getDate() - new Date(a.date).getDate();
        });
        setSavedData(updated);

        upsertDistant(toSave);
        setEditingIndex(null);
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
              local_id: undefined,
            },
            ...old,
          ];
        });
        setEditingIndex(0); //set the new row in edit mode
      },
      removeRow: (rowIndex) => {
        deleteDistant([data[rowIndex].id]);
        const updated = data.filter((_row, index) => index !== rowIndex);
        setSavedData(updated);
      },
      removeRows: (rowsIndices) => {
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
            <AddRowButton table={table} />
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
