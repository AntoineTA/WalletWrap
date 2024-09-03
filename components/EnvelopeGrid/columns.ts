import { Envelope } from "@/hooks/useEnvelopes";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Envelope>[] = [
  {
    accessorKey: "name",
  },
  {
    accessorKey: "description",
  },
  {
    accessorKey: "budgeted",
  },
  {
    accessorKey: "spent",
  },
  {
    accessorKey: "edit",
  },
];
