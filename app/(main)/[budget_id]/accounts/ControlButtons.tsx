import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";
import type { Transaction } from "./TransactionTable";

type ControlButtonsProps = {
  table: Table<Transaction>;
};

export const AddRowButton = ({ table }: ControlButtonsProps) => {
  const meta = table.options.meta!;

  return (
    <Button onClick={meta.addRow} variant="secondary">
      Add Row
    </Button>
  );
};

export const RemoveRowsButton = ({ table }: ControlButtonsProps) => {
  const meta = table.options.meta!;

  const removeRows = () => {
    meta.removeRows(table.getSelectedRowModel().rows.map((row) => row.index));
    table.resetRowSelection();
  };

  return (
    <Button onClick={removeRows} variant="destructive">
      Remove Selected
    </Button>
  );
};
