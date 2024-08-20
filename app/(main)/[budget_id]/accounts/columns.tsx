// // Adapted from https://ui.shadcn.com/docs/components/data-table

"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TableRow = {
  date: string;
  accountName: string;
  outflow: number | null;
  inflow: number | null;
  note: string | null;
};

export const columns: ColumnDef<TableRow>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Account",
    accessorKey: "accountName",
  },
  {
    header: "Outflow",
    accessorKey: "outflow",
  },
  {
    header: "Inflow",
    accessorKey: "inflow",
  },
  {
    header: "Note",
    accessorKey: "note",
  },
];
