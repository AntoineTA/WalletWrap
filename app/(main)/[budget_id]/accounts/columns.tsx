// // Adapted from https://ui.shadcn.com/docs/components/data-table

"use client";

import type { ColumnDef, RowData } from "@tanstack/react-table";

export type Transaction = {
  date: string;
  account?: string;
  outflow: number | null;
  inflow: number | null;
  note: string | null;
};

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter?: {
      enable: boolean;
      name: string;
    };
  }
}

const formatAmount = (amount: number | null): string => {
  return amount ? amount.toFixed(2) : "";
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString("en-GB");
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "note",
    header: "Note",
    meta: {
      filter: {
        enable: true,
        name: "Notes",
      },
    },
  },
  {
    accessorKey: "outflow",
    header: () => {
      return <div className="text-right">Outflow</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {formatAmount(row.getValue("outflow"))}
        </div>
      );
    },
  },
  {
    accessorKey: "inflow",
    header: () => {
      return <div className="text-right">Inflow</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">{formatAmount(row.getValue("inflow"))}</div>
      );
    },
  },
];

export const columnsWithAccount = columns.toSpliced(1, 0, {
  accessorKey: "account",
  header: "Account",
  meta: {
    filter: {
      enable: true,
      name: "Accounts",
    },
  },
});
