// // Adapted from https://ui.shadcn.com/docs/components/data-table

"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TableRow = {
  date: string;
  inflow: number | null;
  outflow: number | null;
  note: string | null;
};

export const columns: ColumnDef<TableRow>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Inflow",
    accessorKey: "inflow",
  },
  {
    header: "Outflow",
    accessorKey: "outflow",
  },
  {
    header: "Note",
    accessorKey: "note",
  },
];
