import { Envelope } from "./EnvelopeGrid";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

type ControlButtonsProps = {
  table: Table<Envelope>;
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
