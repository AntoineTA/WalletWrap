"use client";

import { type ColumnDef, type RowData } from "@tanstack/react-table";
import { TableCell } from "@/components/DataTable/TableCell";
import { EditCell } from "@/components/DataTable/EditCell";
import { AccountCell, DateCell } from "./Cells";
import type { Transaction } from "./page";

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
    header: () => {
      return <div className="text-right">outflow</div>;
    },
    cell: TableCell,
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "inflow",
    header: () => {
      return <div className="text-right">inflow</div>;
    },
    cell: TableCell,
    meta: {
      type: "number",
    },
  },
  {
    id: "edit",
    cell: EditCell,
  },
];
