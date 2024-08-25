"use client";

import { type ColumnDef, type RowData } from "@tanstack/react-table";
import { EditCell } from "./EditCell";
import { TableCell, DateCell, AmountCell } from "./InputCells";
import { AccountCell } from "./SelectCells";
import type { Transaction } from "./TransactionTable";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter?: {
      enabled: boolean;
      name: string;
    };
    type?: string;
  }
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    cell: DateCell,
    meta: {
      type: "date",
    },
  },
  {
    accessorKey: "account_id",
    header: "account",
    cell: AccountCell,
    meta: {
      filter: {
        enabled: true,
        name: "Accounts",
      },
      type: "select",
    },
  },
  {
    accessorKey: "note",
    cell: TableCell,
    meta: {
      filter: {
        enabled: true,
        name: "Notes",
      },
    },
  },
  {
    accessorKey: "outflow",
    cell: AmountCell,
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "inflow",
    cell: AmountCell,
    meta: {
      type: "number",
    },
  },
  {
    id: "edit",
    cell: EditCell,
  },
];
