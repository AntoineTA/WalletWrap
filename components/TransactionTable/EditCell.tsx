import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Table, Row } from "@tanstack/react-table";
import type { Transaction } from "@/hooks/useTransactions";

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
            <DropdownMenuItem onClick={() => meta.editRow(row.index)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.removeRow(row.index)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {meta.editingIndex === row.index && (
        <Button
          onClick={() => meta.saveRow(row.index)}
          className="p-0"
          variant="ghost"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
export { EditCell };
