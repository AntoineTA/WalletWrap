"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Envelope } from "./EnvelopeGrid";
import { EditMenu } from "./EditMenu";

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
