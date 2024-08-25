"use client";

import { useEffect, useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { AddRowButton, RemoveRowsButton } from "./ControlButtons";
import {
  deleteTransactions,
  getAccounts,
  getTransactions,
  upsertTransaction,
} from "./actions";
import { Error, ErrorAlert } from "@/components/ui/error-alert";

export type Transaction = {
  id: number;
  account_id: number;
  date: string;
  outflow: number | null;
  inflow: number | null;
  note: string | null;
};

type SelectOptions = {
  accounts: { id: number; label: string }[];
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    selectOptions: SelectOptions;
    editedRows: any;
    setEditedRows: (editedRows: any) => void;
    updateCell: (rowIndex: number, columnId: string, value: any) => void;
    saveRow: (rowIndex: number) => void;
    revertRow: (rowIndex: number) => void;
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
  const [data, setData] = useState<Transaction[]>([]); // store the data currently contained by the table
  const [savedData, setSavedData] = useState<Transaction[]>([]); // store the data from before an edit
  const [toggleSync, setToggleSync] = useState(false);
  const [selectOptions, setSelectOptions] = useState<SelectOptions>({
    accounts: [],
  });
  const [editedRows, setEditedRows] = useState({}); // indicates which rows are in edit mode
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(true);

  // on mount, load the data
  useEffect(() => {
    (async () => {
      // setIsPending(true);

      const { accounts } = await getAccounts(budget_id);
      if (!accounts) {
        setError({
          title: "Something went wrong",
          message: "We could not load your data",
        });
        return;
      }
      const accountsOptions = accounts.map((account) => ({
        id: account.id,
        label: account.name,
      }));
      setSelectOptions({ accounts: accountsOptions });

      const { transactions, error } = await getTransactions(budget_id);
      if (!transactions) {
        setError({
          title: "We could not load your transactions",
          message: error.message,
          code: error.code,
        });
        return;
      }
      setData(transactions);
      setSavedData(transactions);

      setIsPending(false);
    })();
  }, []);

  // when the table data changes, load the transactions
  useEffect(() => {
    (async () => {
      const { transactions, error } = await getTransactions(budget_id);
      if (!transactions) {
        setError({
          title: "We could not load your transactions",
          message: error.message,
          code: error.code,
        });
        return;
      }
      setSavedData(transactions);
    })();
  }, [toggleSync]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    state: {
      columnFilters,
    },
    meta: {
      editedRows,
      setEditedRows,
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
      saveRow: async (rowIndex) => {
        setData(data);
        //TODO: prevent the row from being edited until the data is saved
        const { error } = await upsertTransaction(data[rowIndex]);
        if (error) {
          setError(error);
          return;
        }
        setToggleSync(!toggleSync);
      },
      revertRow: (rowIndex) => {
        setData((old) =>
          old
            .map((row, index) =>
              index === rowIndex ? savedData[rowIndex] : row,
            )
            .filter((row) => row !== undefined),
        );
      },
      addRow: () => {
        setData((old) => {
          return [...old, {} as Transaction];
        });
        setEditedRows({
          ...editedRows, // keep the current editing state
          [data.length]: true, // set the new row to be in edit mode
        });
      },
      removeRow: async (rowIndex) => {
        const updated = data.filter((_row, index) => index !== rowIndex);
        setData(updated);

        const id = savedData[rowIndex]?.id;
        if (!id) {
          // data was not saved yet
          return;
        }
        const { error } = await deleteTransactions([id]);
        if (error) {
          setError(error);
          return;
        }
        setToggleSync(!toggleSync);
      },
      removeRows: async (rowsIndices) => {
        const updated = data.filter(
          (_row, index) => !rowsIndices.includes(index),
        );
        setData(updated);

        const ids = rowsIndices
          .map((index) => savedData[index].id)
          .filter((id) => id !== undefined);
        if (ids.length === 0) {
          //rows were not saved yet
          return;
        }
        const { error } = await deleteTransactions(ids);
        if (error) {
          setError(error);
          return;
        }
        setToggleSync(!toggleSync);
      },
    },
  });

  return (
    <div>
      {error && <ErrorAlert {...error} />}

      <div className="flex items-center py-4">
        <AddRowButton table={table} />
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-0 h-12 w-64">
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
                  className="h-24 text-center"
                >
                  {isPending && <span>Loading...</span>}
                  {!isPending && <span>No transactions found</span>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
