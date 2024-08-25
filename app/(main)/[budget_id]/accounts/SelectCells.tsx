import type { Column, Row, Table } from "@tanstack/react-table";
import { Transaction } from "./TransactionTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectCellProps = {
  getValue: () => any;
  row: Row<Transaction>;
  column: Column<Transaction>;
  table: Table<Transaction>;
  options: { id: number; label: string }[];
};

export const AccountCell = ({
  table,
  ...props
}: Omit<SelectCellProps, "options">) => {
  const options: { id: number; label: string }[] =
    table.options.meta!.selectOptions.accounts;
  return <SelectCell table={table} options={options} {...props} />;
};

const SelectCell = ({
  getValue,
  row,
  column,
  table,
  options,
}: SelectCellProps) => {
  const meta = table.options.meta!;
  const id: number = getValue();

  if (meta.editedRows[row.index]) {
    return (
      <Select
        onValueChange={(value) => {
          meta.updateCell(row.index, column.id, parseInt(value));
        }}
        defaultValue={id?.toString()}
      >
        <SelectTrigger className="h-8 p-0">
          <SelectValue
            placeholder={
              options.find((option) => option.id === id)?.label ||
              "Select account"
            }
          ></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  return <span>{options.find((option) => option.id === id)?.label}</span>;
};
