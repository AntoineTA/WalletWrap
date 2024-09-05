"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AddRowButton,
  CancelButton,
  RemoveRowsButton,
  SaveButton,
} from "./ControlButtons";
import { useTransactionTable } from "@/hooks/useTransactionTable";
import { ErrorAlert } from "@/components/ErrorAlert";
import { columns } from "./columns";
import type { Account } from "@/hooks/useAccounts";

type TransactionTableProps = {
  budget_id: number;
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
};

export function TransactionTable({
  budget_id,
  accounts,
  setAccounts,
}: TransactionTableProps) {
  const {
    data,
    selectOptions,
    editingIndex,
    editRow,
    addRow,
    updateCell,
    revertChanges,
    saveRow,
    removeRow,
    removeRows,
    isPending,
    error,
  } = useTransactionTable(budget_id, accounts, setAccounts);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    state: {},
    meta: {
      selectOptions,
      editingIndex,
      addRow,
      editRow,
      updateCell,
      revertChanges,
      saveRow,
      removeRow,
      removeRows,
    },
  });

  return (
    <div>
      {error && <ErrorAlert {...error} />}

      {!error && (
        <div className="flex items-center py-4">
          {editingIndex === null && (
            <AddRowButton table={table} disabled={isPending} />
          )}
          {editingIndex !== null && <SaveButton table={table} />}
          {editingIndex !== null && <CancelButton table={table} />}
          {table.getSelectedRowModel().rows.length > 0 && (
            <RemoveRowsButton table={table} />
          )}
        </div>
      )}

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
                  {isPending ? (
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
  );
}
