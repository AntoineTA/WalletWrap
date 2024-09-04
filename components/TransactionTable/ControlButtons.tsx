import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import type { Transaction } from "./TransactionTable";

type ControlButtonsProps = {
  table: Table<Transaction>;
  disabled?: boolean;
};

export const AddRowButton = ({ table, disabled }: ControlButtonsProps) => {
  const meta = table.options.meta!;

  const handleClick = () => {
    meta.revertChanges();
    meta.addRow();
  };

  return (
    <Button onClick={handleClick} variant="ghost" disabled={disabled}>
      <Plus className="mr-2 h-4 w-4" />
      Add
    </Button>
  );
};

export const RemoveRowsButton = ({ table }: ControlButtonsProps) => {
  const meta = table.options.meta!;

  const handleClick = () => {
    meta.revertChanges();
    meta.removeRows(table.getSelectedRowModel().rows.map((row) => row.index));
    table.resetRowSelection();
  };

  return (
    <Button onClick={handleClick} variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </Button>
  );
};

export const CancelButton = ({ table }: ControlButtonsProps) => {
  const meta = table.options.meta!;

  return (
    <Button onClick={meta.revertChanges} variant="ghost">
      <Minus className="mr-2 h-4 w-4" />
      Cancel
    </Button>
  );
};
