import { Button } from "@/components/ui/button";
import { Check, Minus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Table, Row } from "@tanstack/react-table";
import type { Transaction } from "./TransactionTable";

type EditCellProps = {
  row: Row<Transaction>;
  table: Table<Transaction>;
};

const EditCell = ({ row, table }: EditCellProps) => {
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
                if (meta.editingIndex !== null)
                  // If there is a row being edited, revert it
                  meta.revertRow(meta.editingIndex);
                meta.setEditingIndex(row.index);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (meta.editingIndex !== null)
                  meta.revertRow(meta.editingIndex);
                meta.removeRow(row.index);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {meta.editingIndex === row.index && (
        <div>
          <Button
            onClick={() => {
              meta.saveRow(row.index), meta.setEditingIndex(null);
            }}
            className="p-0"
            variant="ghost"
            // size="icon"
          >
            <Check className="h-4 w-4" />
          </Button>
          {/* <Button
            onClick={() => {
              meta.revertRow(row.index), meta.setEditingIndex(null);
            }}
            variant="ghost"
            size="icon"
          >
            <Minus className="h-4 w-4" />
          </Button> */}
        </div>
      )}
    </div>
  );
};
export { EditCell };
