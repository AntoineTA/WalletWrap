import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Row, Table } from "@tanstack/react-table";
import type { Envelope } from "@/hooks/useEnvelopes";

type InputCellsProps = {
  row: Row<Envelope>;
  table: Table<Envelope>;
  columnId: string;
  className?: string;
};

export const TextField = ({
  row,
  table,
  columnId,
  className,
}: InputCellsProps) => {
  const { editingIndex, updateCell } = table.options.meta!;
  const initialValue = row.getValue<string>(columnId);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // If the row is being edited, return the input field
  if (editingIndex === row.index) {
    return (
      <Input
        className={className}
        value={value || ""}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => updateCell(row.index, columnId, value)}
        type="text"
      />
    );
  }

  return <span>{value}</span>;
};

export const NumberField = ({
  row,
  table,
  columnId,
  className,
}: InputCellsProps) => {
  const { updateCell, editingIndex } = table.options.meta!;
  const initialValue = row.getValue<number>(columnId);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // If the row is being edited, return the input field
  if (editingIndex === row.index) {
    return (
      <Input
        className={className}
        value={value || ""}
        onChange={(event) => setValue(Number(event.target.value))}
        onBlur={() => updateCell(row.index, columnId, value)}
        type="number"
      />
    );
  }

  return <span>{value.toFixed(2)}</span>;
};
