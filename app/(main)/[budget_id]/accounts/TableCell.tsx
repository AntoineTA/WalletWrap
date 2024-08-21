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

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  // If the row is being edited, return the input field
  if (tableMeta?.editedRows[row.id]) {
    return (
      <Input
        className="w-full"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type || "text"}
      />
    );
  }

  return <span>{value}</span>;
};
export { TableCell };
