"use client";

import { type ColumnDef, type RowData } from "@tanstack/react-table";
import { TableCell } from "./TableCell";
import { EditCell } from "./EditCell";
import { AccountCell } from "./AccountCell";
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
    header: "Date",
    cell: TableCell,
    meta: {
      type: "date",
    },
  },
  {
    accessorKey: "account_id",
    header: "Account",
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
    header: "Note",
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
      return <div className="text-right">Outflow</div>;
    },
    cell: TableCell,
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "inflow",
    header: () => {
      return <div className="text-right">Inflow</div>;
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

// export const columnsWithAccount = columns.toSpliced(1, 0, {
//   accessorKey: "account_name",
//   header: "Account",
//   cell: AccountCell,
//   meta: {
//     filter: {
//       enabled: true,
//       name: "Accounts",
//     },
//     type: "select",

//   },
// });
