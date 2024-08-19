// // Adapted from https://ui.shadcn.com/docs/components/data-table

"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Transaction = {
  date: string;
  amount: number;
  note: string | null;
  isInflow: boolean;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Note",
    accessorKey: "note",
  },
];
