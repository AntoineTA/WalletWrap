import { Button } from "@/components/ui/button";
import { Check, Minus, MoreHorizontal, Pencil } from "lucide-react";
import type { Table, Row } from "@tanstack/react-table";
import { Transaction } from "./TransactionTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EditCellProps = {
  row: Row<Transaction>;
  table: Table<Transaction>;
};

const EditCell = ({ row, table }: EditCellProps) => {
  const meta = table.options.meta!;

  const changeEditStatus = () => {
    meta.setEditedRows((old: any) => ({
      ...old,
      [row.index]: !old[row.index],
    }));
  };

  return (
    <div>
      {!meta.editedRows[row.index] && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={changeEditStatus}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.removeRow(row.index)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {meta.editedRows[row.index] && (
        <div className="flex">
          <Button
            onClick={() => {
              meta.saveRow(row.index), changeEditStatus();
            }}
            variant="ghost"
            size="icon"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              meta.revertRow(row.index), changeEditStatus();
            }}
            variant="ghost"
            size="icon"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
export { EditCell };
