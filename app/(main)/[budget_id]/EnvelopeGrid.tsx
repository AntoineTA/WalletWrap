"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  type Row,
} from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AddRowButton } from "./ControlButton";
import { EditMenu } from "./EditMenu";

export type Envelope = {
  id: number | undefined;
  name: string | undefined;
  description: string | undefined;
  budgeted: number;
  spent: number;
  local_id?: number | undefined;
};

type EnvelopeGridProps = {
  columns: ColumnDef<Envelope>[];
  savedData: Envelope[];
};

const EnvelopeGrid = ({ columns, savedData }: EnvelopeGridProps) => {
  const [data, setData] = useState<Envelope[]>(savedData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // useEffect(() => {
  //   if (!savedData) return;
  //   setData(savedData);
  // }, [savedData]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editingIndex,
      setEditingIndex,
      updateCell: (rowIndex, columnId, value) => {
        console.log("update cell", rowIndex, columnId, value);
      },
      saveRow: (rowIndex) => {
        console.log("save row", rowIndex);
      },
      revertChanges: () => {
        console.log("revert changes");
      },
      addRow: () => {
        setData((old) => {
          return [
            ...old,
            {
              id: undefined,
              name: undefined,
              description: undefined,
              budgeted: 0,
              spent: 0,
            },
          ];
        });
      },
      removeRow: () => {
        console.log("remove envelope");
      },
      removeRows: () => {
        console.log("remove envelopes");
      },
    },
  });

  const remaining = (row: Row<Envelope>) =>
    row.getValue<number>("budgeted") - row.getValue<number>("spent");
  return (
    <div>
      <AddRowButton table={table} />
      <div className="flex flex-wrap">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.id} className="m-2 w-full lg:w-80 relative">
            <div className="absolute right-0 m-4">
              <EditMenu table={table} row={row} />
            </div>
            <CardHeader>
              <CardTitle>{row.getValue("name")}</CardTitle>
              <CardDescription className="h-4">
                {row.getValue("description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-8">
              <div className="text-right">
                <div className="text-xs mb-1">Budgeted</div>
                <div>{row.getValue<number>("budgeted").toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs mb-1 ">Spent</div>
                <div>{row.getValue<number>("spent").toFixed(2)}</div>
              </div>
              <Separator orientation="vertical" className="h-11 bg-slate-600" />
              <div className="text-right">
                <div className="text-xs mb-1">Remaining</div>
                <div
                  className={cn(
                    remaining(row) < 0 ? "text-red-500" : "text-black",
                    "text-lg font-medium",
                  )}
                >
                  {remaining(row).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default EnvelopeGrid;
