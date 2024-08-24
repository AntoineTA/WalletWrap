// Adapted from https://muhimasri.com/blogs/react-editable-table/

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Column, Row, Table } from "@tanstack/react-table";

export type TableCellProps<TData> = {
  getValue: () => any;
  row: Row<TData>;
  column: Column<TData>;
  table: Table<TData>;
  formatter?: (value: any) => string;
};

const TableCell = <TData,>({
  getValue,
  row,
  column,
  table,
  formatter,
}: TableCellProps<TData>) => {
  const initialValue = getValue();
  const tableMeta = table.options.meta!;
  const columnMeta = column.columnDef.meta!;
  const [value, setValue] = useState(getValue());

  // If the row is being edited, return the input field
  if (tableMeta.editedRows[row.index]) {
    return (
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => tableMeta.updateCell(row.index, column.id, value)}
        type={columnMeta.type || "text"}
      />
    );
  }

  return <span>{formatter ? formatter(value) : value}</span>;
};
export { TableCell };
