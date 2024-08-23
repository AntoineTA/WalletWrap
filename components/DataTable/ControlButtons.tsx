import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";

type ControlButtonsProps<TData> = {
  table: Table<TData>;
};

export const AddRowButton = <TData,>({ table }: ControlButtonsProps<TData>) => {
  const meta = table.options.meta!;

  return (
    <Button onClick={meta.addRow} variant="secondary">
      Add Row
    </Button>
  );
};

export const RemoveRowsButton = <TData,>({
  table,
}: ControlButtonsProps<TData>) => {
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
