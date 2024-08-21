// Adapted from https://ui.shadcn.com/docs/components/data-table

"use client";

import {
  createColumnHelper,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { TableCell } from "./TableCell";
import { EditCell } from "./EditCell";

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
      enabled: boolean;
      name: string;
    };
    type?: string;
  }
}

const formatAmount = (amount: number | null): string => {
  return amount ? amount.toFixed(2) : "";
};

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

// export const columns: ColumnDef<Transaction>[] = [
//   {
//     accessorKey: "date",
//     header: "Date",
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("date"));
//       const formatted = date.toLocaleDateString("en-GB");
//       return <div>{formatted}</div>;
//     },
//   },
//   {
//     accessorKey: "note",
//     header: "Note",
//     cell: TableCell,
//     meta: {
//       filter: {
//         enable: true,
//         name: "Notes",
//       },
//       type: "number",
//     },
//   },
//   {
//     accessorKey: "outflow",
//     header: () => {
//       return <div className="text-right">Outflow</div>;
//     },
//     cell: ({ row }) => {
//       return (
//         <div className="text-right">
//           {formatAmount(row.getValue("outflow"))}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "inflow",
//     header: () => {
//       return <div className="text-right">Inflow</div>;
//     },
//     cell: ({ row }) => {
//       return (
//         <div className="text-right">{formatAmount(row.getValue("inflow"))}</div>
//       );
//     },
//   },
// ];

// const columnHelper = createColumnHelper<Transaction>();

// export const columns = [
//   columnHelper.accessor("date", {
//     header: "Date",
//     cell: TableCell,
//     meta: {
//       type: "date",
//     }
//   }),
//   columnHelper.accessor("note", {
//     header: "Note",
//     cell: TableCell,
//     meta: {
//       filter: {
//         enable: true,
//         name: "Notes",
//       },
//     },
//   }),
//   columnHelper.accessor("outflow", {
//     header: () => {
//       return <div className="text-right">Outflow</div>;
//     },
//     cell: TableCell,
//     meta: {
//       type: "number",
//     },
//   }),
//   columnHelper.accessor("inflow", {
//     header: () => {
//       return <div className="text-right">Inflow</div>;
//     },
//     cell: TableCell,
//     meta: {
//       type: "number",
//     },
//   }),
//   columnHelper.display({
//     id: "edit",
//     cell: EditCell,
//   }),
// ];

export const columnsWithAccount = columns.toSpliced(1, 0, {
  accessorKey: "account",
  header: "Account",
  cell: TableCell,
  meta: {
    filter: {
      enabled: true,
      name: "Accounts",
    },
  },
});
