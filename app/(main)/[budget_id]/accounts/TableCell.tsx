// Adapted from https://muhimasri.com/blogs/react-editable-table/

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const TableCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const tableMeta = table.options.meta;
  const columnMeta = column.columnDef.meta;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // If the row is being edited, return the input field
  if (tableMeta?.editedRows[row.id]) {
    return columnMeta.type === "select" ? (
      <select
        value={initialValue}
        onChange={(event) => {
          setValue(event.target.value);
          tableMeta.updateCell(row.index, column.id, event.target.value);
        }}
      >
        {columnMeta.options?.map((option: { value: string; label: string }) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <Input
        className="w-full"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => tableMeta.updateCell(row.index, column.id, value)}
        type={columnMeta?.type || "text"}
      />
    );
  }

  return <span>{value}</span>;
};
export { TableCell };
