import type { Envelope } from "./EnvelopeGrid";
import type { Table, Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal } from "lucide-react";

type EditMenuProps = {
  row: Row<Envelope>;
  table: Table<Envelope>;
};

export const EditMenu = ({ row, table }: EditMenuProps) => {
  const meta = table.options.meta!;

  return (
    <div className="flex justify-center">
      {meta.editingIndex !== row.index && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                meta.revertChanges();
                meta.setEditingIndex(row.index);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                meta.revertChanges();
                meta.removeRow(row.index);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {meta.editingIndex === row.index && (
        <Button
          onClick={() => meta.saveRow(row.index)}
          className="h-4 w-4"
          variant="ghost"
        >
          Save
        </Button>
      )}
    </div>
  );
};
