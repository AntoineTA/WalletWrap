// Adapted from https://muhimasri.com/blogs/react-editable-table/

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Column, Row, Table } from "@tanstack/react-table";
import { Transaction } from "./TransactionTable";

export type Formatter = (value?: number | string) => any;
export type TableCellProps = {
  getValue: () => any;
  row: Row<Transaction>;
  column: Column<Transaction>;
  table: Table<Transaction>;
  formatter?: Formatter;
};

export const DateCell = (props: Omit<TableCellProps, "formatter">) => {
  const formatDate: Formatter = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-UK", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return <TableCell {...props} formatter={formatDate} />;
};

export const AmountCell = (props: Omit<TableCellProps, "formatter">) => {
  const formatAmount: Formatter = (amount) => {
    if (!amount) return null;
    if (typeof amount === "string") return parseFloat(amount).toFixed(2);
    if (typeof amount === "number") return amount.toFixed(2);
  };

  return <TableCell {...props} formatter={formatAmount} />;
};

export const TableCell = ({
  getValue,
  row,
  column,
  table,
  formatter,
}: TableCellProps) => {
  const tableMeta = table.options.meta!;
  const columnMeta = column.columnDef.meta!;
  const initialValue = getValue();
  const [value, setValue] = useState(getValue());

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // If the row is being edited, return the input field
  if (tableMeta.editedRows[row.index]) {
    return (
      <Input
        className="h-8 p-0"
        value={value || ""}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => tableMeta.updateCell(row.index, column.id, value)}
        type={columnMeta.type || "text"}
      />
    );
  }

  return <span>{formatter ? formatter(value) : value}</span>;
};
