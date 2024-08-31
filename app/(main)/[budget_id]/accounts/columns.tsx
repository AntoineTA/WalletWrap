"use client";

import { type ColumnDef, type RowData } from "@tanstack/react-table";
import { HeaderCheckboxCell, CheckboxCell } from "./CheckboxCells";
import { TableCell, DateCell, AmountCell } from "./InputCells";
import { AccountCell, EnvelopeCell } from "./SelectCells";
import { EditCell } from "./EditCell";
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
    id: "checkbox",
    header: HeaderCheckboxCell,
    cell: CheckboxCell,
    size: 10,
    enableResizing: false,
  },
  {
    accessorKey: "date",
    cell: DateCell,
    size: 150,
    meta: {
      type: "date",
    },
  },
  {
    accessorKey: "account_id",
    header: "account",
    cell: AccountCell,
    size: 100,
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
    size: 200,
    meta: {
      filter: {
        enabled: true,
        name: "Notes",
      },
    },
  },
  {
    accessorKey: "envelope_id",
    header: "category",
    cell: EnvelopeCell,
    size: 100,
    meta: {
      filter: {
        enabled: true,
        name: "Envelopes",
      },
      type: "select",
    },
  },
  {
    accessorKey: "outflow",
    cell: AmountCell,
    size: 100,
    meta: {
      type: "number",
    },
  },
  {
    accessorKey: "inflow",
    cell: AmountCell,
    size: 100,
    meta: {
      type: "number",
    },
  },
  {
    id: "edit",
    cell: EditCell,
    size: 10,
  },
];
