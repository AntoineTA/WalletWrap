import type { Column, Row, Table } from "@tanstack/react-table";

export type SelectCellProps<TData> = {
  getValue: () => any;
  row: Row<TData>;
  column: Column<TData>;
  table: Table<TData>;
  options: { id: number; label: string }[];
};

const SelectCell = <TData,>({
  getValue,
  row,
  column,
  table,
  options,
}: SelectCellProps<TData>) => {
  const meta = table.options.meta!;
  const id: number = getValue();

  if (meta.editedRows[row.index]) {
    return (
      <select
        value={id}
        onChange={(event) => {
          const intValue = parseInt(event.target.value);
          meta.updateCell(row.index, column.id, intValue);
        }}
      >
        {!id && (
          <option>
            Select {column.columnDef.header?.toString() || "option"}
          </option>
        )}
        {options.map((option) => (
          <option key={option.id} value={option.id} selected={id === option.id}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  return <span>{options.find((option) => option.id === id)?.label}</span>;
};
export { SelectCell };
