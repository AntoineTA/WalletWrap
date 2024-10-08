import { Envelope } from "@/hooks/useEnvelopes";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

type ControlButtonsProps = {
  table: Table<Envelope>;
  disabled?: boolean;
};

export const AddRowButton = ({ table, disabled }: ControlButtonsProps) => {
  const meta = table.options.meta!;

  return (
    <Button onClick={meta.addRow} variant="ghost" disabled={disabled}>
      <Plus className="mr-2 h-4 w-4" />
      Add Envelope
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
